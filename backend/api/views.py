"""API endpoints.

Mirrors the website3.0 reference (legacy server.ts parity), MINUS its
Supabase-specific pieces (no JWT auth, no `me` endpoint) per the no-Supabase
decision in MIGRATION_PLAN:

  - health     : liveness + DB connectivity check, consumed by the frontend
  - views      : page-view counter (legacy /api/views)
  - contact    : contact form -> DB (legacy /api/contact; email send dropped)
  - newsletter : newsletter signup -> DB (legacy /api/newsletter)
  - api_not_found : JSON 404 for any other /api/* path (legacy catch-all)

Validation is function-based (matching the reference) rather than via DRF
serializers — the payloads are tiny and this keeps parity with server.ts's
hand-rolled sanitize()/validation.
"""

import re

from django.db import connection
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.response import Response

from .models import ContactMessage, NewsletterSubscriber, PageView
from .throttling import (
    ContactRateThrottle,
    NewsletterRateThrottle,
    ViewsRateThrottle,
)

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")
MAX = {"name": 100, "email": 254, "message": 5000}


def _clean(value, limit):
    """Strip control chars and trim, mirroring legacy sanitize()."""
    if not isinstance(value, str):
        return ""
    value = "".join(ch for ch in value if ch in "\n\t" or ord(ch) >= 32)
    return value.strip()[:limit]


@api_view(["GET"])
def health(request):
    """Liveness + DB connectivity check."""
    db_state = "connected"
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
    except Exception as exc:  # noqa: BLE001
        db_state = f"error: {exc}"

    return Response(
        {
            "status": "ok",
            "database": db_state,
            "engine": connection.vendor,
            "time": timezone.now().isoformat(),
        }
    )


@api_view(["POST"])
@throttle_classes([ViewsRateThrottle])
def views(request):
    """Insert a page view and return the running total (legacy /api/views)."""
    PageView.objects.create()
    return Response({"views": PageView.objects.count()})


@api_view(["POST"])
@throttle_classes([ContactRateThrottle])
def contact(request):
    """Validate and store a contact message (legacy /api/contact)."""
    data = request.data or {}
    name = _clean(data.get("name"), MAX["name"])
    email = _clean(data.get("email"), MAX["email"])
    message = _clean(data.get("message"), MAX["message"])

    if not name or not email or not message:
        return Response(
            {"error": "All fields are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    if not EMAIL_RE.match(email):
        return Response(
            {"error": "Invalid email address."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    ContactMessage.objects.create(name=name, email=email, message=message)
    return Response({"ok": True})


@api_view(["POST"])
@throttle_classes([NewsletterRateThrottle])
def newsletter(request):
    """Upsert a newsletter subscriber (legacy /api/newsletter, ON CONFLICT DO NOTHING)."""
    email = _clean((request.data or {}).get("email"), MAX["email"])
    if not EMAIL_RE.match(email):
        return Response(
            {"error": "Invalid email address."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    NewsletterSubscriber.objects.get_or_create(email=email)
    return Response({"ok": True})


@api_view(["GET", "POST", "PUT", "PATCH", "DELETE"])
def api_not_found(request):
    """JSON 404 for unknown /api/* routes (legacy server.ts `app.use('/api', ...)`)."""
    return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
