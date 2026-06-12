"""Server-side payment + entitlement logic.

Two responsibilities:

1. ``create_checkout_session`` — build a Stripe Checkout Session for a Product.
   The browser is redirected to Stripe's hosted page; we never see card data and
   never trust a client claim of "I paid". Entitlement follows only from webhooks.

2. ``reconcile_*`` — translate a verified Stripe object (Subscription / completed
   Checkout Session) into our Entitlement source of truth, and fire the Minecraft
   side effect. These are called ONLY from the webhook handler, inside a DB
   transaction, after signature verification.

Stripe is imported lazily so the app and tests load without the SDK installed.
"""

import logging
from datetime import datetime, timezone as dt_timezone

from django.conf import settings
from django.db import transaction

from . import minecraft
from .models import (
    Customer,
    Entitlement,
    Price,
    Product,
    Purchase,
    Subscription,
)

logger = logging.getLogger("payments.services")

MINECRAFT_SLUG = "minecraft"


def _stripe():
    """Return a configured stripe module, or raise if unavailable/unconfigured."""
    import stripe  # lazy import

    key = getattr(settings, "STRIPE_SECRET_KEY", "")
    if not key:
        raise RuntimeError("STRIPE_SECRET_KEY is not set")
    stripe.api_key = key
    return stripe


# --------------------------------------------------------------------------- #
# Checkout
# --------------------------------------------------------------------------- #
def create_checkout_session(*, customer: Customer, price: Price, success_url, cancel_url):
    """Create a Stripe Checkout Session for a given Price.

    Mode is derived from the Product kind: subscription Prices open a recurring
    Checkout, one-time Prices open a payment Checkout. We attach our internal ids
    as ``metadata`` so the webhook can map the event back to local rows without
    trusting anything the browser sends.
    """
    stripe = _stripe()
    mode = "subscription" if price.product.kind == Product.Kind.SUBSCRIPTION else "payment"
    our_ids = {"customer_pk": str(customer.pk), "product_slug": price.product.slug}
    params = {
        "mode": mode,
        "customer": customer.stripe_customer_id,
        "line_items": [{"price": price.stripe_price_id, "quantity": 1}],
        "success_url": success_url,
        "cancel_url": cancel_url,
        "client_reference_id": str(customer.pk),
        "metadata": our_ids,
    }
    # For subscriptions, also stamp our ids onto the Subscription itself, so the
    # later customer.subscription.* events (which do NOT inherit session metadata)
    # can be mapped back to our rows without a Stripe round-trip.
    if mode == "subscription":
        params["subscription_data"] = {"metadata": our_ids}
    return stripe.checkout.Session.create(**params)


def get_or_create_customer(*, user, minecraft_username: str = "") -> Customer:
    """Ensure a local Customer + Stripe Customer exist for ``user``.

    Idempotent: returns the existing row if present (updating the MC username if a
    new one is supplied). Creating the Stripe Customer here — not in Checkout —
    keeps one stable Stripe id across a user's subscription + one-time purchases.
    """
    existing = Customer.objects.filter(user=user).first()
    if existing:
        if minecraft_username and existing.minecraft_username != minecraft_username:
            existing.minecraft_username = minecraft_username
            existing.save(update_fields=["minecraft_username", "updated_at"])
        return existing

    stripe = _stripe()
    sc = stripe.Customer.create(
        email=getattr(user, "email", "") or None,
        metadata={"user_pk": str(user.pk)},
    )
    return Customer.objects.create(
        user=user,
        stripe_customer_id=sc["id"],
        livemode=bool(sc.get("livemode")),
        minecraft_username=minecraft_username,
    )


# --------------------------------------------------------------------------- #
# Entitlement reconciliation (called from webhooks only)
# --------------------------------------------------------------------------- #
@transaction.atomic
def grant_one_time(*, session: dict):
    """Handle a completed one-time Checkout Session -> permanent entitlement."""
    customer = _customer_from_metadata(session.get("metadata", {}))
    product = Product.objects.get(slug=session["metadata"]["product_slug"])

    purchase, created = Purchase.objects.get_or_create(
        stripe_checkout_session_id=session["id"],
        defaults={
            "customer": customer,
            "product": product,
            "stripe_payment_intent_id": session.get("payment_intent", "") or "",
            "amount_total": session.get("amount_total") or 0,
            "currency": session.get("currency", "usd"),
            "status": Purchase.Status.PAID,
        },
    )
    if not created:
        return purchase  # idempotent: already recorded

    Entitlement.objects.update_or_create(
        customer=customer,
        product=product,
        defaults={
            "source": Entitlement.Source.PURCHASE,
            "active": True,
            "expires_at": None,
            "provisioned": True,  # download access is just a DB flag
        },
    )
    return purchase


@transaction.atomic
def sync_subscription(*, sub: dict):
    """Upsert a Subscription from a Stripe object and reconcile its entitlement.

    Called for checkout.session.completed (subscription mode), invoice.paid, and
    customer.subscription.updated/deleted. Recomputes the entitlement and applies
    the Minecraft side effect when the active state changes.
    """
    customer = _customer_from_metadata(sub.get("metadata", {})) or _customer_by_stripe_id(
        sub.get("customer")
    )
    product = _product_from_subscription(sub)
    period_end = _ts(sub.get("current_period_end"))

    subscription, _ = Subscription.objects.update_or_create(
        stripe_subscription_id=sub["id"],
        defaults={
            "customer": customer,
            "product": product,
            "status": sub.get("status", Subscription.Status.INCOMPLETE),
            "current_period_end": period_end,
            "cancel_at_period_end": bool(sub.get("cancel_at_period_end")),
        },
    )

    should_be_active = subscription.is_entitling()
    entitlement, _ = Entitlement.objects.get_or_create(
        customer=customer,
        product=product,
        defaults={"source": Entitlement.Source.SUBSCRIPTION},
    )
    _apply_entitlement_state(entitlement, customer, product, should_be_active, period_end)
    return subscription


def _apply_entitlement_state(entitlement, customer, product, should_be_active, expires_at):
    """Flip the entitlement flag and run external side effects when it changes."""
    was_provisioned = entitlement.provisioned and entitlement.active
    entitlement.active = should_be_active
    entitlement.expires_at = expires_at
    entitlement.source = Entitlement.Source.SUBSCRIPTION

    # Minecraft side effect — only for the minecraft product, only on transition.
    if product.slug == MINECRAFT_SLUG and customer.minecraft_username:
        try:
            if should_be_active and not was_provisioned:
                minecraft.grant_access(customer.minecraft_username)
                entitlement.provisioned = True
            elif not should_be_active and was_provisioned:
                minecraft.revoke_access(customer.minecraft_username)
                entitlement.provisioned = False
        except minecraft.RconError:
            # Leave provisioned mismatched so a reconcile job retries; never let an
            # RCON outage abort recording the verified payment state.
            logger.exception("RCON side effect failed; will retry on reconcile")
    else:
        entitlement.provisioned = should_be_active

    entitlement.save()


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #
def _customer_from_metadata(metadata: dict):
    pk = (metadata or {}).get("customer_pk")
    if pk:
        return Customer.objects.filter(pk=pk).first()
    return None


def _customer_by_stripe_id(stripe_customer_id):
    if not stripe_customer_id:
        return None
    return Customer.objects.filter(stripe_customer_id=stripe_customer_id).first()


def _product_from_subscription(sub: dict):
    """Resolve our Product from the subscription's price metadata or local Price."""
    slug = (sub.get("metadata") or {}).get("product_slug")
    if slug:
        return Product.objects.get(slug=slug)
    items = (sub.get("items") or {}).get("data") or []
    if items:
        price_id = items[0].get("price", {}).get("id")
        price = Price.objects.filter(stripe_price_id=price_id).select_related("product").first()
        if price:
            return price.product
    raise Product.DoesNotExist("Could not resolve product for subscription")


def _ts(epoch):
    """Convert a Stripe UNIX epoch (UTC) into an aware datetime."""
    if not epoch:
        return None
    return datetime.fromtimestamp(int(epoch), tz=dt_timezone.utc)


@transaction.atomic
def refund_purchase(*, charge: dict):
    """Handle charge.refunded -> mark Purchase refunded + drop its entitlement.

    Stripe's charge object carries the payment_intent; we match the Purchase by it.
    Fail-soft: an unknown charge (e.g. a subscription invoice refund) is ignored.
    """
    pi = charge.get("payment_intent")
    if not pi:
        return None
    purchase = Purchase.objects.filter(stripe_payment_intent_id=pi).first()
    if not purchase:
        return None
    purchase.status = Purchase.Status.REFUNDED
    purchase.save(update_fields=["status", "updated_at"])
    Entitlement.objects.filter(
        customer=purchase.customer, product=purchase.product
    ).update(active=False, provisioned=False)
    return purchase
