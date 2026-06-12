"""Payment URL routes.

NOT included by config/urls.py unless settings.PAYMENTS_ENABLED is True (default
False). Keeping the include gated means the webhook + access endpoints simply do
not exist on the deployed app during the pre-launch phase.
"""

from django.urls import path

from . import views

app_name = "payments"

urlpatterns = [
    path("webhook/stripe/", views.stripe_webhook, name="stripe-webhook"),
    path("checkout/", views.create_checkout, name="create-checkout"),
    path("access/check/", views.access_check, name="access-check"),
    path("download/<slug:slug>/", views.download, name="download"),
]
