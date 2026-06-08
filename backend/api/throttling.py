"""Per-IP rate limiting for the write endpoints.

Reproduces the legacy `server.ts` hardening, which wrapped each write route in
`express-rate-limit`:

    • POST /api/views      — 60 requests / minute / IP
    • POST /api/contact    — 10 requests / hour   / IP
    • POST /api/newsletter — 10 requests / hour   / IP

Each throttle buckets on the client IP (DRF's ``get_ident``, which honours
X-Forwarded-For when NUM_PROXIES is set — see settings). The numeric rates live
in ``REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"]`` so they sit in one place and
match the legacy limits exactly.
"""

from rest_framework.throttling import SimpleRateThrottle


class _IPScopedThrottle(SimpleRateThrottle):
    """A scoped throttle that always buckets by client IP (never by user).

    Unlike DRF's ScopedRateThrottle this hardcodes its scope per subclass, so a
    function-based view can opt in with a single ``@throttle_classes([...])``
    decorator without needing a ``throttle_scope`` attribute.
    """

    scope = ""  # overridden by subclasses

    def get_cache_key(self, request, view):
        ident = self.get_ident(request)
        return self.cache_format % {"scope": self.scope, "ident": ident}


class ViewsRateThrottle(_IPScopedThrottle):
    scope = "views"


class ContactRateThrottle(_IPScopedThrottle):
    scope = "contact"


class NewsletterRateThrottle(_IPScopedThrottle):
    scope = "newsletter"
