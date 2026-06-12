"""Payment & access-control models for the stevenlegg.xyz store.

SKELETON — test-mode only. This batch wires no public URLs (see config/urls.py,
gated behind settings.PAYMENTS_ENABLED, default False) and trusts NO client input
for entitlement: access is granted ONLY from server-verified Stripe webhook events
(see payments/services.py). See ../PAYMENTS_DESIGN.md for the full design.

Design notes
------------
* The local ``User`` is Django's built-in auth user. A ``Customer`` row links one
  User to their Stripe Customer id (1:1). We never store card data — Stripe holds
  the payment method; we hold only ids and a derived entitlement state.
* ``Entitlement`` is the single source of truth the rest of the app reads to answer
  "can this user access X right now?". It is *derived* from Subscriptions /
  Purchases by the webhook layer, never written directly by a request handler.
* ``WebhookEvent`` gives us idempotency: Stripe may deliver an event more than once,
  so we record every processed event id and no-op on repeats.
"""

from django.conf import settings
from django.db import models
from django.utils import timezone


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Customer(TimestampedModel):
    """1:1 link between a local auth user and their Stripe Customer."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="payment_customer",
    )
    stripe_customer_id = models.CharField(max_length=255, unique=True, db_index=True)
    # Stripe test ids start with cus_… in both modes; we tag the mode so test and
    # live data can coexist in one DB during development without leaking access.
    livemode = models.BooleanField(default=False)
    # Collected at checkout for the Minecraft subscription; used by the RCON layer
    # to whitelist/remove the player. Blank for download-only customers.
    minecraft_username = models.CharField(max_length=32, blank=True)

    def __str__(self):
        return f"{self.user} ({self.stripe_customer_id})"


class Product(TimestampedModel):
    """A sellable thing, mirrored from a Stripe Product.

    ``kind`` decides what granting access means:
      * subscription  -> recurring entitlement (e.g. Minecraft server access)
      * one_time      -> permanent entitlement to a digital download
    """

    class Kind(models.TextChoices):
        SUBSCRIPTION = "subscription", "Subscription"
        ONE_TIME = "one_time", "One-time purchase"

    # Stable internal handle the frontend/access checks use, e.g. "minecraft" or
    # "budget-template". Independent of the Stripe id so we can re-point if needed.
    slug = models.SlugField(max_length=64, unique=True)
    name = models.CharField(max_length=200)
    kind = models.CharField(max_length=16, choices=Kind.choices)
    stripe_product_id = models.CharField(max_length=255, blank=True, db_index=True)
    # For one-time downloads: the protected object key the entitlement unlocks
    # (e.g. an S3/Railway-volume path). Never a public URL.
    download_key = models.CharField(max_length=255, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} [{self.kind}]"


class Price(TimestampedModel):
    """A Stripe Price (amount + interval) for a Product.

    A Product can have several Prices over time (e.g. a price change); the active
    one is what Checkout uses. Amount stored in the smallest currency unit (cents).
    """

    product = models.ForeignKey(
        Product, on_delete=models.CASCADE, related_name="prices"
    )
    stripe_price_id = models.CharField(max_length=255, unique=True, db_index=True)
    unit_amount = models.PositiveIntegerField(help_text="In cents, e.g. 299 = $2.99")
    currency = models.CharField(max_length=3, default="usd")
    # null for one-time prices; "month"/"year" for subscriptions.
    recurring_interval = models.CharField(max_length=8, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.slug} {self.unit_amount/100:.2f} {self.currency}"


class Subscription(TimestampedModel):
    """Mirror of a Stripe Subscription. Drives recurring entitlements."""

    class Status(models.TextChoices):
        TRIALING = "trialing", "Trialing"
        ACTIVE = "active", "Active"
        PAST_DUE = "past_due", "Past due"
        CANCELED = "canceled", "Canceled"
        UNPAID = "unpaid", "Unpaid"
        INCOMPLETE = "incomplete", "Incomplete"

    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="subscriptions"
    )
    product = models.ForeignKey(
        Product, on_delete=models.PROTECT, related_name="subscriptions"
    )
    stripe_subscription_id = models.CharField(
        max_length=255, unique=True, db_index=True
    )
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.INCOMPLETE
    )
    current_period_end = models.DateTimeField(null=True, blank=True)
    cancel_at_period_end = models.BooleanField(default=False)

    # Statuses that should keep access switched on.
    ACTIVE_STATUSES = {Status.TRIALING, Status.ACTIVE}

    def is_entitling(self) -> bool:
        if self.status not in self.ACTIVE_STATUSES:
            return False
        if self.current_period_end and self.current_period_end < timezone.now():
            return False
        return True

    def __str__(self):
        return f"{self.stripe_subscription_id} ({self.status})"


class Purchase(TimestampedModel):
    """A completed one-time payment for a one-time Product."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        REFUNDED = "refunded", "Refunded"
        FAILED = "failed", "Failed"

    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="purchases"
    )
    product = models.ForeignKey(
        Product, on_delete=models.PROTECT, related_name="purchases"
    )
    # The Checkout Session / PaymentIntent id — unique so a re-delivered webhook
    # cannot create a duplicate purchase.
    stripe_checkout_session_id = models.CharField(
        max_length=255, unique=True, db_index=True
    )
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    amount_total = models.PositiveIntegerField(default=0, help_text="cents")
    currency = models.CharField(max_length=3, default="usd")
    status = models.CharField(
        max_length=16, choices=Status.choices, default=Status.PENDING
    )

    def __str__(self):
        return f"{self.product.slug} -> {self.customer.user} ({self.status})"


class Entitlement(TimestampedModel):
    """The app's single source of truth for access.

    One row per (customer, product). ``active`` is recomputed by the webhook layer
    whenever an underlying Subscription/Purchase changes — request handlers READ
    this, they never write it. For subscriptions, ``expires_at`` mirrors the
    period end so a stale row fails closed if a webhook is ever missed.
    """

    class Source(models.TextChoices):
        SUBSCRIPTION = "subscription", "Subscription"
        PURCHASE = "purchase", "Purchase"

    customer = models.ForeignKey(
        Customer, on_delete=models.CASCADE, related_name="entitlements"
    )
    product = models.ForeignKey(
        Product, on_delete=models.PROTECT, related_name="entitlements"
    )
    source = models.CharField(max_length=16, choices=Source.choices)
    active = models.BooleanField(default=False, db_index=True)
    # null = never expires (one-time purchase); set = subscription period end.
    expires_at = models.DateTimeField(null=True, blank=True)
    # For subscription entitlements that act on an external system (Minecraft),
    # whether the side effect (RCON whitelist add) has been applied.
    provisioned = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["customer", "product"], name="uniq_customer_product_entitlement"
            )
        ]

    def is_valid(self) -> bool:
        """Fail-closed check used by access verification."""
        if not self.active:
            return False
        if self.expires_at and self.expires_at < timezone.now():
            return False
        return True

    def __str__(self):
        state = "active" if self.is_valid() else "inactive"
        return f"{self.customer.user} :: {self.product.slug} ({state})"


class WebhookEvent(TimestampedModel):
    """Idempotency + audit ledger for processed Stripe events.

    Insert-before-process: we record the Stripe event id (unique) the moment we
    accept an event. A duplicate delivery hits the unique constraint and is
    skipped, so handlers run at most once per event.
    """

    stripe_event_id = models.CharField(max_length=255, unique=True, db_index=True)
    event_type = models.CharField(max_length=100)
    livemode = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)
    # Raw payload kept for replay/debugging; prune on a retention schedule.
    payload = models.JSONField(default=dict, blank=True)

    def mark_processed(self):
        self.processed_at = timezone.now()
        self.save(update_fields=["processed_at", "updated_at"])

    def __str__(self):
        return f"{self.event_type} {self.stripe_event_id}"
