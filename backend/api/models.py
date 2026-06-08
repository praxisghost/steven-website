"""Domain models for the api app.

Mirrors the legacy data tables (and the website3.0 reference), adapted for the
website-xyz stack (PostgreSQL on Railway). No Supabase-specific concerns here —
these are plain Django models managed by Django migrations.
"""

from django.db import models


class PageView(models.Model):
    """A single page-view event (legacy `page_views` table)."""

    visited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "page_views"

    def __str__(self) -> str:
        return f"PageView #{self.pk} @ {self.visited_at:%Y-%m-%d %H:%M:%S}"


class ContactMessage(models.Model):
    """A contact-form submission (legacy `contact_messages` table)."""

    name = models.TextField()
    email = models.TextField()
    message = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "contact_messages"

    def __str__(self) -> str:
        return f"ContactMessage #{self.pk} from {self.email}"


class NewsletterSubscriber(models.Model):
    """A newsletter signup (legacy `newsletter_subscribers` table)."""

    email = models.TextField(unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "newsletter_subscribers"

    def __str__(self) -> str:
        return self.email
