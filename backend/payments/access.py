"""Access verification — the ONE function the rest of the app calls to gate content.

Reads the derived Entitlement source of truth and fails closed: any uncertainty
(no customer, no entitlement, expired, inactive) returns False. Never consults the
client, a cookie claim, or Stripe directly on the hot path.
"""

from .models import Customer, Entitlement


def has_access(user, product_slug: str) -> bool:
    """True iff ``user`` currently holds a valid entitlement to ``product_slug``."""
    if not user or not user.is_authenticated:
        return False
    customer = Customer.objects.filter(user=user).first()
    if not customer:
        return False
    ent = (
        Entitlement.objects.filter(customer=customer, product__slug=product_slug)
        .select_related("product")
        .first()
    )
    return bool(ent and ent.is_valid())
