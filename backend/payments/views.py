"""Payment endpoints — webhook receiver + a read-only entitlement check.

SAFETY: these URLs are included ONLY when settings.PAYMENTS_ENABLED is True
(default False), so in the current pre-launch state nothing here is reachable.
See config/urls.py and ../PAYMENTS_DESIGN.md (§6 Development vs Production Safety).

The webhook is the trust boundary: Stripe signs every event with the endpoint
secret; we verify that signature before doing anything, then dedupe by event id,
then dispatch. A handler is run at most once per event.
"""

import logging

from django.conf import settings
from django.db import IntegrityError
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

from . import services
from .access import has_access
from .downloads import signed_download_url, stream_private_file as _stream_private_file
from .models import Product, WebhookEvent

logger = logging.getLogger("payments.webhooks")

# Stripe events we act on. Anything else is acknowledged (200) and ignored so
# Stripe stops retrying, but recorded for audit.
HANDLED = {
    "checkout.session.completed",
    "invoice.paid",
    "invoice.payment_failed",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "charge.refunded",
}


@csrf_exempt
@require_POST
def stripe_webhook(request):
    """Verify, dedupe, and dispatch a Stripe webhook event."""
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
    secret = getattr(settings, "STRIPE_WEBHOOK_SECRET", "")
    if not secret:
        logger.error("STRIPE_WEBHOOK_SECRET not configured")
        return HttpResponse(status=500)

    try:
        import stripe
        event = stripe.Webhook.construct_event(payload, sig_header, secret)
    except ValueError:
        return HttpResponse("Invalid payload", status=400)
    except Exception as exc:  # stripe.error.SignatureVerificationError etc.
        logger.warning("Webhook signature verification failed: %s", exc)
        return HttpResponse("Invalid signature", status=400)

    # Idempotency: insert-before-process. A duplicate delivery collides on the
    # unique event id and is skipped.
    try:
        record = WebhookEvent.objects.create(
            stripe_event_id=event["id"],
            event_type=event["type"],
            livemode=bool(event.get("livemode")),
            payload=event.get("data", {}),
        )
    except IntegrityError:
        logger.info("Duplicate webhook %s ignored", event["id"])
        return JsonResponse({"received": True, "duplicate": True})

    if event["type"] in HANDLED:
        try:
            _dispatch(event)
        except Exception:  # noqa: BLE001
            # Return 500 so Stripe retries; leave the record unprocessed.
            logger.exception("Error handling %s", event["type"])
            return HttpResponse(status=500)

    record.mark_processed()
    return JsonResponse({"received": True})


def _dispatch(event):
    etype = event["type"]
    obj = event["data"]["object"]

    if etype == "checkout.session.completed":
        if obj.get("mode") == "subscription":
            # Subscription details arrive via subscription.* events; the session
            # just confirms setup. Pull the subscription object if expanded.
            return
        if obj.get("payment_status") == "paid":
            services.grant_one_time(session=obj)

    elif etype in ("customer.subscription.updated", "customer.subscription.deleted"):
        services.sync_subscription(sub=obj)

    elif etype == "invoice.paid":
        sub_id = obj.get("subscription")
        if sub_id:
            import stripe
            services.sync_subscription(sub=stripe.Subscription.retrieve(sub_id))

    elif etype == "invoice.payment_failed":
        sub_id = obj.get("subscription")
        if sub_id:
            import stripe
            services.sync_subscription(sub=stripe.Subscription.retrieve(sub_id))

    elif etype == "charge.refunded":
        services.refund_purchase(charge=obj)


@require_POST
def access_check(request):
    """Server-side entitlement probe used by the Next.js route handler.

    Returns {"access": bool} for the logged-in user and a product slug. Same-origin,
    session-authenticated; never exposes Stripe data to the browser.
    """
    slug = (request.POST.get("product") or "").strip()
    return JsonResponse({"access": has_access(request.user, slug)})


@require_POST
def create_checkout(request):
    """Create a Stripe Checkout Session and return its redirect URL.

    Auth required (session). Resolves the Price server-side from a product slug —
    the browser never sends an amount. For the Minecraft product it also captures
    the player's username onto the Customer.
    """
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required."}, status=401)

    slug = (request.POST.get("product") or "").strip()
    mc_username = (request.POST.get("minecraft_username") or "").strip()
    product = Product.objects.filter(slug=slug, active=True).first()
    if not product:
        return JsonResponse({"error": "Unknown product."}, status=404)
    price = product.prices.filter(active=True).first()
    if not price:
        return JsonResponse({"error": "No active price."}, status=409)
    if product.slug == services.MINECRAFT_SLUG and not mc_username:
        return JsonResponse({"error": "Minecraft username is required."}, status=400)

    try:
        customer = services.get_or_create_customer(
            user=request.user, minecraft_username=mc_username
        )
        session = services.create_checkout_session(
            customer=customer,
            price=price,
            success_url=settings.PAYMENTS_SUCCESS_URL,
            cancel_url=settings.PAYMENTS_CANCEL_URL,
        )
    except Exception:  # noqa: BLE001
        logger.exception("create_checkout failed for %s", slug)
        return JsonResponse({"error": "Could not start checkout."}, status=502)

    return JsonResponse({"url": session["url"], "id": session["id"]})


def download(request, slug):
    """Serve a protected one-time download, gated by entitlement (fail-closed).

    Returns a short-lived signed URL when the storage backend supports it, else
    streams the file from a private location. A 403 (rendered by the frontend's
    branded error component) is returned when access is absent.
    """
    if not has_access(request.user, slug):
        return JsonResponse({"error": "No access to this download."}, status=403)

    product = Product.objects.filter(slug=slug).first()
    if not product or not product.download_key:
        return JsonResponse({"error": "Download not configured."}, status=404)

    url = signed_download_url(product.download_key)
    if url:
        return JsonResponse({"url": url})
    return _stream_private_file(product.download_key)
