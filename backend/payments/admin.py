from django.contrib import admin

from .models import (
    Customer,
    Entitlement,
    Price,
    Product,
    Purchase,
    Subscription,
    WebhookEvent,
)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("slug", "name", "kind", "active")
    list_filter = ("kind", "active")
    search_fields = ("slug", "name", "stripe_product_id")


@admin.register(Price)
class PriceAdmin(admin.ModelAdmin):
    list_display = ("product", "unit_amount", "currency", "recurring_interval", "active")
    list_filter = ("active", "currency")


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("user", "stripe_customer_id", "minecraft_username", "livemode")
    search_fields = ("user__username", "stripe_customer_id", "minecraft_username")


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("stripe_subscription_id", "customer", "product", "status",
                    "current_period_end", "cancel_at_period_end")
    list_filter = ("status",)


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ("stripe_checkout_session_id", "customer", "product", "status",
                    "amount_total", "currency")
    list_filter = ("status",)


@admin.register(Entitlement)
class EntitlementAdmin(admin.ModelAdmin):
    list_display = ("customer", "product", "source", "active", "expires_at", "provisioned")
    list_filter = ("source", "active", "provisioned")


@admin.register(WebhookEvent)
class WebhookEventAdmin(admin.ModelAdmin):
    list_display = ("stripe_event_id", "event_type", "livemode", "processed_at")
    list_filter = ("event_type", "livemode")
    readonly_fields = ("stripe_event_id", "event_type", "livemode", "payload",
                       "processed_at", "created_at", "updated_at")
