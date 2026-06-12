"""Initial schema for the payments app.

Hand-authored to match payments/models.py so `migrate` runs out of the box. It is
equivalent to what `makemigrations payments` generates; if you change the models,
run `makemigrations` to produce the canonical follow-up migration.
"""

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("stripe_customer_id", models.CharField(db_index=True, max_length=255, unique=True)),
                ("livemode", models.BooleanField(default=False)),
                ("minecraft_username", models.CharField(blank=True, max_length=32)),
                ("user", models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name="payment_customer", to=settings.AUTH_USER_MODEL)),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="Product",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("slug", models.SlugField(max_length=64, unique=True)),
                ("name", models.CharField(max_length=200)),
                ("kind", models.CharField(choices=[("subscription", "Subscription"), ("one_time", "One-time purchase")], max_length=16)),
                ("stripe_product_id", models.CharField(blank=True, db_index=True, max_length=255)),
                ("download_key", models.CharField(blank=True, max_length=255)),
                ("active", models.BooleanField(default=True)),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="Price",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("stripe_price_id", models.CharField(db_index=True, max_length=255, unique=True)),
                ("unit_amount", models.PositiveIntegerField(help_text="In cents, e.g. 299 = $2.99")),
                ("currency", models.CharField(default="usd", max_length=3)),
                ("recurring_interval", models.CharField(blank=True, max_length=8)),
                ("active", models.BooleanField(default=True)),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="prices", to="payments.product")),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="Subscription",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("stripe_subscription_id", models.CharField(db_index=True, max_length=255, unique=True)),
                ("status", models.CharField(choices=[("trialing", "Trialing"), ("active", "Active"), ("past_due", "Past due"), ("canceled", "Canceled"), ("unpaid", "Unpaid"), ("incomplete", "Incomplete")], default="incomplete", max_length=16)),
                ("current_period_end", models.DateTimeField(blank=True, null=True)),
                ("cancel_at_period_end", models.BooleanField(default=False)),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="subscriptions", to="payments.customer")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="subscriptions", to="payments.product")),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="Purchase",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("stripe_checkout_session_id", models.CharField(db_index=True, max_length=255, unique=True)),
                ("stripe_payment_intent_id", models.CharField(blank=True, max_length=255)),
                ("amount_total", models.PositiveIntegerField(default=0, help_text="cents")),
                ("currency", models.CharField(default="usd", max_length=3)),
                ("status", models.CharField(choices=[("pending", "Pending"), ("paid", "Paid"), ("refunded", "Refunded"), ("failed", "Failed")], default="pending", max_length=16)),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="purchases", to="payments.customer")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="purchases", to="payments.product")),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="WebhookEvent",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("stripe_event_id", models.CharField(db_index=True, max_length=255, unique=True)),
                ("event_type", models.CharField(max_length=100)),
                ("livemode", models.BooleanField(default=False)),
                ("processed_at", models.DateTimeField(blank=True, null=True)),
                ("payload", models.JSONField(blank=True, default=dict)),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="Entitlement",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("source", models.CharField(choices=[("subscription", "Subscription"), ("purchase", "Purchase")], max_length=16)),
                ("active", models.BooleanField(db_index=True, default=False)),
                ("expires_at", models.DateTimeField(blank=True, null=True)),
                ("provisioned", models.BooleanField(default=False)),
                ("customer", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="entitlements", to="payments.customer")),
                ("product", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="entitlements", to="payments.product")),
            ],
            options={"abstract": False},
        ),
        migrations.AddConstraint(
            model_name="entitlement",
            constraint=models.UniqueConstraint(fields=("customer", "product"), name="uniq_customer_product_entitlement"),
        ),
    ]
