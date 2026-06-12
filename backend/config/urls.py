from django.conf import settings
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
]

# Payment routes are mounted ONLY when explicitly enabled, so the webhook +
# access endpoints are absent on the deployed app during the pre-launch phase.
# (Declared before the api/ catch-all so /api/pay/* resolves here first.)
if getattr(settings, "PAYMENTS_ENABLED", False):
    urlpatterns += [path("api/pay/", include("payments.urls"))]

urlpatterns += [
    path("api/", include("api.urls")),
]
