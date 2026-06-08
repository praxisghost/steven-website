from django.contrib import admin

from .models import ContactMessage, NewsletterSubscriber, PageView


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "sent_at")
    readonly_fields = ("sent_at",)


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "subscribed_at")
    readonly_fields = ("subscribed_at",)


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ("id", "visited_at")
