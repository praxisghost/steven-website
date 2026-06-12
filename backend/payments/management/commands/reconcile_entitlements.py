"""Failsafe reconciler — run on a schedule (e.g. nightly).

Two jobs, both idempotent and safe to run repeatedly:

1. **Expire stale entitlements.** Any subscription-sourced Entitlement whose
   ``expires_at`` has passed but is still ``active`` is switched off (covers a
   missed ``customer.subscription.deleted`` webhook). RCON removal is applied if
   it was provisioned.
2. **Retry drifted Minecraft provisioning.** Where the Entitlement's ``active``
   state and ``provisioned`` flag disagree (an earlier RCON call failed), re-apply
   the whitelist add/remove so the game server matches the paid state.

Usage:  python manage.py reconcile_entitlements [--dry-run]
"""

from django.core.management.base import BaseCommand
from django.db.models import F
from django.utils import timezone

from payments import minecraft, services
from payments.models import Entitlement


class Command(BaseCommand):
    help = "Reconcile entitlements with their expiry + Minecraft provisioning state."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true",
                            help="Report changes without applying them.")

    def handle(self, *args, **options):
        dry = options["dry_run"]
        now = timezone.now()
        expired = fixed = 0

        # 1. Expire stale subscription entitlements.
        stale = Entitlement.objects.filter(
            active=True,
            source=Entitlement.Source.SUBSCRIPTION,
            expires_at__lt=now,
        ).select_related("customer", "product")
        for ent in stale:
            self.stdout.write(f"EXPIRE {ent}")
            if not dry:
                ent.active = False
                self._sync_minecraft(ent, want_active=False)
                ent.save()
            expired += 1

        # 2. Retry drifted Minecraft provisioning (active set, not provisioned, or
        #    inactive but still provisioned).
        drifted = Entitlement.objects.filter(
            product__slug=services.MINECRAFT_SLUG,
        ).exclude(active=F("provisioned")).select_related("customer", "product")
        for ent in drifted:
            if ent.active == ent.provisioned:
                continue
            self.stdout.write(f"REPROVISION {ent} (active={ent.active})")
            if not dry:
                self._sync_minecraft(ent, want_active=ent.active)
                ent.save()
            fixed += 1

        self.stdout.write(self.style.SUCCESS(
            f"Done. expired={expired} reprovisioned={fixed} dry_run={dry}"
        ))

    def _sync_minecraft(self, ent, *, want_active: bool):
        username = ent.customer.minecraft_username
        if ent.product.slug != services.MINECRAFT_SLUG or not username:
            ent.provisioned = want_active
            return
        try:
            if want_active and not ent.provisioned:
                minecraft.grant_access(username)
                ent.provisioned = True
            elif not want_active and ent.provisioned:
                minecraft.revoke_access(username)
                ent.provisioned = False
        except minecraft.RconError as exc:
            self.stderr.write(f"  RCON failed for {username}: {exc} (will retry)")
