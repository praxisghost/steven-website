from django.urls import path, re_path

from . import views

urlpatterns = [
    path("health/", views.health, name="health"),
    path("views/", views.views, name="views"),
    path("contact/", views.contact, name="contact"),
    path("newsletter/", views.newsletter, name="newsletter"),
    # Catch-all: any other /api/* path returns a JSON 404 (legacy parity).
    # Must stay LAST so the explicit routes above take precedence.
    re_path(r"^.*$", views.api_not_found, name="api-not-found"),
]
