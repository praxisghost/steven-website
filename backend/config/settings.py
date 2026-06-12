"""
Django settings for the stevenlegg.xyz backend (website-xyz branch).

Configuration is read from environment variables (see .env.example).
Database: PostgreSQL on Railway via DATABASE_URL. NOT Supabase — the deliberate
divergence from the website3.0 reference (see ../MIGRATION_PLAN.md, Phase 2).
"""

from pathlib import Path
import os

import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env from the backend/ directory (local dev only; never commit real values).
load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: bool = False) -> bool:
    return os.environ.get(name, str(default)).lower() in ("1", "true", "yes", "on")


def env_list(name: str, default: str = "") -> list[str]:
    raw = os.environ.get(name, default)
    return [item.strip() for item in raw.split(",") if item.strip()]


# --- Core ---
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "insecure-dev-key-change-me")
DEBUG = env_bool("DJANGO_DEBUG", True)
ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")
# Railway injects the service's public domain; trust it automatically so we don't
# have to hardcode the generated *.up.railway.app host.
_RAILWAY_DOMAIN = os.environ.get("RAILWAY_PUBLIC_DOMAIN", "")
if _RAILWAY_DOMAIN and _RAILWAY_DOMAIN not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(_RAILWAY_DOMAIN)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third-party
    "rest_framework",
    "corsheaders",
    # Local
    "api",
    "payments",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    # Serves collected static files (e.g. Django admin assets) in production
    # without a separate static host. Must sit directly after SecurityMiddleware.
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

CORS_ALLOWED_ORIGINS = [
    "https://www.stevenlegg.xyz",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# --- Database (PostgreSQL on Railway) ---
# Set DATABASE_URL to the Railway Postgres connection string. When unset (local
# dev before provisioning), fall back to a sqlite file so manage.py still runs
# and the missing DB surfaces in the health check rather than at import time.
DATABASE_URL = os.environ.get("DATABASE_URL", "")
if DATABASE_URL:
    DATABASES = {
        "default": dj_database_url.parse(
            DATABASE_URL,
            conn_max_age=600,
            ssl_require=env_bool("DATABASE_SSL", True),
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
# Override via DJANGO_STATIC_ROOT if the default location isn't writable.
STATIC_ROOT = os.environ.get("DJANGO_STATIC_ROOT") or (BASE_DIR / "staticfiles")

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Django REST Framework ---
# Public by default; protect individual views with permission_classes.
# Auth strategy is intentionally deferred for this skeleton batch (no Supabase);
# a Railway-Postgres-backed approach will be chosen in a later batch.
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
    # Per-IP write-endpoint rate limits — match the legacy server.ts
    # express-rate-limit values. Applied only to the views that opt in via the
    # throttle classes in api/throttling.py; nothing is throttled by default.
    "DEFAULT_THROTTLE_RATES": {
        "views": "60/min",
        "contact": "10/hour",
        "newsletter": "10/hour",
    },
    # Reverse proxies in front of the app, so DRF reads the real client IP from
    # the right slot of X-Forwarded-For. Legacy set `trust proxy = 1`
    # (single hop, e.g. Railway); mirror that, overridable via env.
    "NUM_PROXIES": int(os.environ.get("NUM_PROXIES", "1")),
}

# --- CORS ---
# Origins allowed to call this API (the Next.js frontend).
CORS_ALLOWED_ORIGINS = env_list("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
CORS_ALLOW_CREDENTIALS = True

# --- Static files (WhiteNoise) ---
# Compressed, hashed static assets served by WhiteNoise; `collectstatic` runs on
# deploy (see railway.toml). Only the Django admin needs these — the JSON API
# does not — but it keeps /admin/ usable in production.
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"
    },
}

# --- Production hardening ---
# Railway terminates TLS at its edge proxy and forwards over HTTP, so tell Django
# the original request was HTTPS (drives secure cookies / SSL redirect).
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# Origins trusted for unsafe (POST) requests to the Django admin over HTTPS.
# Include the Railway domain automatically + any extra from env.
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS")
if _RAILWAY_DOMAIN:
    CSRF_TRUSTED_ORIGINS.append(f"https://{_RAILWAY_DOMAIN}")

# Tighten security when running with DEBUG off (i.e. in production). Kept off in
# dev so local http works.
if not DEBUG:
    SECURE_SSL_REDIRECT = env_bool("DJANGO_SECURE_SSL_REDIRECT", True)
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

# --- Payments (Stripe) — SKELETON, test-mode only ---
# Master kill switch. While False (default), payments URLs are NOT included in
# config/urls.py, so the webhook + access endpoints do not exist on the deployed
# app. Flip to True only once Stripe is wired and tested. See PAYMENTS_DESIGN.md.
PAYMENTS_ENABLED = env_bool("PAYMENTS_ENABLED", False)

# All read from env; NEVER commit real values. Use Stripe TEST keys (sk_test_…,
# whsec_… from `stripe listen`) until launch.
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.environ.get("STRIPE_PUBLISHABLE_KEY", "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")

# Minecraft RCON — must reach the game server over the private network only.
RCON_HOST = os.environ.get("RCON_HOST", "")
RCON_PORT = int(os.environ.get("RCON_PORT", "25575"))
RCON_PASSWORD = os.environ.get("RCON_PASSWORD", "")

# Where Checkout redirects back to (Next.js pages). The success page should poll
# the access endpoint rather than assume access — entitlement follows webhooks.
_FRONTEND = os.environ.get("FRONTEND_BASE_URL", "http://localhost:3000")
PAYMENTS_SUCCESS_URL = os.environ.get(
    "PAYMENTS_SUCCESS_URL", f"{_FRONTEND}/account/purchase-complete"
)
PAYMENTS_CANCEL_URL = os.environ.get(
    "PAYMENTS_CANCEL_URL", f"{_FRONTEND}/account/purchase-cancelled"
)

# Protected one-time downloads. Either point PAYMENTS_DOWNLOAD_DIR at a PRIVATE
# directory (NOT under STATIC/public) to stream files, or set
# PAYMENTS_STORAGE_SIGNED=True when using object storage that mints signed URLs.
PAYMENTS_DOWNLOAD_DIR = os.environ.get("PAYMENTS_DOWNLOAD_DIR", "")
PAYMENTS_STORAGE_SIGNED = env_bool("PAYMENTS_STORAGE_SIGNED", False)
PAYMENTS_DOWNLOAD_TTL = int(os.environ.get("PAYMENTS_DOWNLOAD_TTL", "300"))
