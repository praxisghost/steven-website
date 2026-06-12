"""Protected-download helpers.

Two strategies, chosen by what the storage backend supports:

* ``signed_download_url`` — if files live in object storage (S3-compatible / GCS),
  mint a short-lived signed URL so the bytes are served directly by the CDN and
  never proxied through Django. Returns None when no object-storage backend is
  configured, so the caller falls back to streaming.
* ``stream_private_file`` — stream a file from a PRIVATE on-disk directory
  (``settings.PAYMENTS_DOWNLOAD_DIR``) that is NOT under any public/static path.
  Path traversal is blocked by resolving and confining to the base dir.

The entitlement check happens in the view BEFORE either of these is called; this
module only handles delivery.
"""

import logging
import os

from django.conf import settings
from django.http import FileResponse, JsonResponse

logger = logging.getLogger("payments.downloads")


def signed_download_url(download_key: str):
    """Return a time-limited URL for object storage, or None if unsupported.

    Uses Django's storage API: if the configured default storage can produce a
    signed URL (e.g. django-storages S3Boto3Storage), use it. The local
    FileSystemStorage returns a plain (public) URL, which we deliberately reject
    here so we never hand out an unsigned link to a protected file.
    """
    backend = getattr(settings, "PAYMENTS_STORAGE_SIGNED", False)
    if not backend:
        return None
    try:
        from django.core.files.storage import default_storage

        # django-storages honours an `expire` kwarg; pass the configured TTL.
        ttl = int(getattr(settings, "PAYMENTS_DOWNLOAD_TTL", 300))
        return default_storage.url(download_key, expire=ttl)
    except Exception:  # noqa: BLE001
        logger.exception("Failed to sign download URL for %s", download_key)
        return None


def stream_private_file(download_key: str):
    """Stream a file from the private download dir, with traversal protection."""
    base = getattr(settings, "PAYMENTS_DOWNLOAD_DIR", "")
    if not base:
        return JsonResponse({"error": "Downloads not configured."}, status=404)

    base_real = os.path.realpath(base)
    target = os.path.realpath(os.path.join(base_real, download_key))
    # Confine to the base dir — reject any ../ traversal.
    if os.path.commonpath([base_real, target]) != base_real:
        logger.warning("Blocked path traversal: %s", download_key)
        return JsonResponse({"error": "Invalid download."}, status=400)
    if not os.path.isfile(target):
        return JsonResponse({"error": "File not found."}, status=404)

    response = FileResponse(open(target, "rb"), as_attachment=True,
                            filename=os.path.basename(target))
    # Defence in depth: never let an intermediary cache a protected file.
    response["Cache-Control"] = "private, no-store"
    return response
