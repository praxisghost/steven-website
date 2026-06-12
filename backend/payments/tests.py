"""Tests for the payments skeleton.

These exercise the entitlement logic, access verification, the Minecraft side
effect, and webhook idempotency WITHOUT requiring the `stripe` or `mcrcon`
packages to be installed: the SDK calls are lazy and we patch them out. So the
suite runs in CI and in the pre-launch sandbox unchanged.
"""

from datetime import timedelta
from unittest import mock

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from . import services
from .access import has_access
from .models import (
    Customer,
    Entitlement,
    Price,
    Product,
    WebhookEvent,
)

User = get_user_model()


def make_customer(username="alice", mc="alice_mc"):
    user = User.objects.create_user(username=username, password="x")
    return Customer.objects.create(
        user=user, stripe_customer_id=f"cus_{username}", minecraft_username=mc
    )


class AccessTests(TestCase):
    def setUp(self):
        self.customer = make_customer()
        self.product = Product.objects.create(
            slug="budget-template", name="Budget Template", kind=Product.Kind.ONE_TIME
        )

    def test_no_entitlement_denies(self):
        self.assertFalse(has_access(self.customer.user, "budget-template"))

    def test_active_entitlement_grants(self):
        Entitlement.objects.create(
            customer=self.customer, product=self.product,
            source=Entitlement.Source.PURCHASE, active=True,
        )
        self.assertTrue(has_access(self.customer.user, "budget-template"))

    def test_expired_entitlement_fails_closed(self):
        Entitlement.objects.create(
            customer=self.customer, product=self.product,
            source=Entitlement.Source.SUBSCRIPTION, active=True,
            expires_at=timezone.now() - timedelta(hours=1),
        )
        self.assertFalse(has_access(self.customer.user, "budget-template"))

    def test_anonymous_denied(self):
        from django.contrib.auth.models import AnonymousUser
        self.assertFalse(has_access(AnonymousUser(), "budget-template"))


class OneTimePurchaseTests(TestCase):
    def setUp(self):
        self.customer = make_customer()
        self.product = Product.objects.create(
            slug="budget-template", name="Budget Template", kind=Product.Kind.ONE_TIME
        )

    def _session(self, sid="cs_test_1"):
        return {
            "id": sid,
            "payment_intent": "pi_1",
            "amount_total": 99,
            "currency": "usd",
            "metadata": {"customer_pk": str(self.customer.pk),
                         "product_slug": "budget-template"},
        }

    def test_grant_creates_purchase_and_entitlement(self):
        services.grant_one_time(session=self._session())
        self.assertTrue(has_access(self.customer.user, "budget-template"))

    def test_grant_is_idempotent(self):
        services.grant_one_time(session=self._session())
        services.grant_one_time(session=self._session())  # duplicate delivery
        self.assertEqual(
            Entitlement.objects.filter(customer=self.customer).count(), 1
        )
        self.assertEqual(self.customer.purchases.count(), 1)


class SubscriptionTests(TestCase):
    def setUp(self):
        self.customer = make_customer()
        self.product = Product.objects.create(
            slug=services.MINECRAFT_SLUG, name="Minecraft Access",
            kind=Product.Kind.SUBSCRIPTION,
        )
        self.price = Price.objects.create(
            product=self.product, stripe_price_id="price_mc",
            unit_amount=299, recurring_interval="month",
        )

    def _sub(self, status="active"):
        return {
            "id": "sub_1",
            "customer": self.customer.stripe_customer_id,
            "status": status,
            "current_period_end": int((timezone.now() + timedelta(days=30)).timestamp()),
            "cancel_at_period_end": False,
            "metadata": {"customer_pk": str(self.customer.pk),
                         "product_slug": services.MINECRAFT_SLUG},
        }

    @mock.patch("payments.services.minecraft.grant_access")
    def test_active_subscription_grants_and_whitelists(self, grant):
        services.sync_subscription(sub=self._sub("active"))
        self.assertTrue(has_access(self.customer.user, services.MINECRAFT_SLUG))
        grant.assert_called_once_with("alice_mc")

    @mock.patch("payments.services.minecraft.revoke_access")
    @mock.patch("payments.services.minecraft.grant_access")
    def test_cancel_revokes_and_removes(self, grant, revoke):
        services.sync_subscription(sub=self._sub("active"))
        services.sync_subscription(sub=self._sub("canceled"))
        self.assertFalse(has_access(self.customer.user, services.MINECRAFT_SLUG))
        revoke.assert_called_once_with("alice_mc")

    @mock.patch("payments.services.minecraft.grant_access")
    def test_past_due_does_not_entitle(self, grant):
        services.sync_subscription(sub=self._sub("past_due"))
        self.assertFalse(has_access(self.customer.user, services.MINECRAFT_SLUG))


class WebhookIdempotencyTests(TestCase):
    def test_duplicate_event_id_blocked_by_unique(self):
        WebhookEvent.objects.create(stripe_event_id="evt_1", event_type="invoice.paid")
        from django.db import IntegrityError
        with self.assertRaises(IntegrityError):
            WebhookEvent.objects.create(
                stripe_event_id="evt_1", event_type="invoice.paid"
            )


class RefundTests(TestCase):
    def setUp(self):
        self.customer = make_customer()
        self.product = Product.objects.create(
            slug="budget-template", name="Budget Template", kind=Product.Kind.ONE_TIME
        )

    def test_refund_revokes_access(self):
        from .models import Entitlement, Purchase
        Purchase.objects.create(
            customer=self.customer, product=self.product,
            stripe_checkout_session_id="cs_1", stripe_payment_intent_id="pi_9",
            amount_total=99, status=Purchase.Status.PAID,
        )
        Entitlement.objects.create(
            customer=self.customer, product=self.product,
            source=Entitlement.Source.PURCHASE, active=True, provisioned=True,
        )
        services.refund_purchase(charge={"payment_intent": "pi_9"})
        self.assertFalse(has_access(self.customer.user, "budget-template"))
        self.assertEqual(
            Purchase.objects.get(stripe_payment_intent_id="pi_9").status,
            Purchase.Status.REFUNDED,
        )

    def test_refund_unknown_charge_is_noop(self):
        self.assertIsNone(services.refund_purchase(charge={"payment_intent": "pi_x"}))


class CustomerBootstrapTests(TestCase):
    @mock.patch("payments.services._stripe")
    def test_get_or_create_is_idempotent(self, stripe_factory):
        stripe = stripe_factory.return_value
        stripe.Customer.create.return_value = {"id": "cus_new", "livemode": False}
        user = User.objects.create_user(username="bob", email="b@x.com", password="x")

        c1 = services.get_or_create_customer(user=user, minecraft_username="bob_mc")
        c2 = services.get_or_create_customer(user=user)  # second call: no new Stripe id

        self.assertEqual(c1.pk, c2.pk)
        self.assertEqual(c1.stripe_customer_id, "cus_new")
        stripe.Customer.create.assert_called_once()  # Stripe customer made just once


class CheckoutSessionTests(TestCase):
    @mock.patch("payments.services._stripe")
    def test_subscription_checkout_stamps_metadata(self, stripe_factory):
        stripe = stripe_factory.return_value
        stripe.checkout.Session.create.return_value = {"id": "cs_a", "url": "https://pay"}
        customer = make_customer()
        product = Product.objects.create(
            slug=services.MINECRAFT_SLUG, name="MC", kind=Product.Kind.SUBSCRIPTION
        )
        price = Price.objects.create(
            product=product, stripe_price_id="price_mc", unit_amount=299,
            recurring_interval="month",
        )
        services.create_checkout_session(
            customer=customer, price=price,
            success_url="https://s", cancel_url="https://c",
        )
        kwargs = stripe.checkout.Session.create.call_args.kwargs
        self.assertEqual(kwargs["mode"], "subscription")
        # subscription.* events don't inherit session metadata, so we stamp the sub.
        self.assertEqual(
            kwargs["subscription_data"]["metadata"]["product_slug"],
            services.MINECRAFT_SLUG,
        )


class ReconcileTests(TestCase):
    def test_expired_entitlement_is_deactivated(self):
        from django.core.management import call_command
        from .models import Entitlement
        customer = make_customer()
        product = Product.objects.create(
            slug=services.MINECRAFT_SLUG, name="MC", kind=Product.Kind.SUBSCRIPTION
        )
        ent = Entitlement.objects.create(
            customer=customer, product=product,
            source=Entitlement.Source.SUBSCRIPTION, active=True, provisioned=False,
            expires_at=timezone.now() - timedelta(days=1),
        )
        call_command("reconcile_entitlements")
        ent.refresh_from_db()
        self.assertFalse(ent.active)
