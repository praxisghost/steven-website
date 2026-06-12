"""Minecraft server access control via RCON whitelist.

When a subscription entitlement turns on, we add the player's Minecraft username
to the server whitelist; when it turns off, we remove them (and kick, so an
in-progress session ends immediately). This module is the ONLY place that talks to
the game server, so the side effect is easy to audit and to stub in tests.

Operational notes
-----------------
* RCON is a plaintext admin protocol — it MUST run over the Railway private
  network (or a VPN), never exposed publicly. Credentials come from env
  (RCON_HOST / RCON_PORT / RCON_PASSWORD); they are never committed.
* All calls are best-effort and fail safe: a network error is logged and re-raised
  so the caller can leave Entitlement.provisioned=False and retry on the next
  reconcile pass, rather than silently believing access was granted.
* The actual socket library (``mcrcon``) is imported lazily so the rest of the app
  — and the test suite — load without it installed.
"""

import logging

from django.conf import settings

logger = logging.getLogger("payments.minecraft")


class RconError(RuntimeError):
    pass


def _command(cmd: str) -> str:
    """Open a short-lived RCON connection, run one command, return the reply."""
    host = getattr(settings, "RCON_HOST", "")
    password = getattr(settings, "RCON_PASSWORD", "")
    port = int(getattr(settings, "RCON_PORT", 25575))
    if not host or not password:
        raise RconError("RCON not configured (RCON_HOST / RCON_PASSWORD unset)")

    try:
        from mcrcon import MCRcon  # lazy: not needed for import/tests
    except ImportError as exc:  # pragma: no cover
        raise RconError("mcrcon not installed") from exc

    try:
        with MCRcon(host, password, port=port) as rcon:
            return rcon.command(cmd)
    except Exception as exc:  # noqa: BLE001 - normalise any socket/proto error
        logger.error("RCON command failed: %s", exc)
        raise RconError(str(exc)) from exc


def grant_access(username: str) -> str:
    """Whitelist a player. Idempotent: re-adding an existing entry is harmless."""
    logger.info("Granting Minecraft access to %s", username)
    return _command(f"whitelist add {username}")


def revoke_access(username: str) -> str:
    """Remove a player from the whitelist and kick any live session."""
    logger.info("Revoking Minecraft access from %s", username)
    reply = _command(f"whitelist remove {username}")
    try:
        _command(f"kick {username} Subscription ended")
    except RconError:
        # Player simply wasn't online; the whitelist removal is what matters.
        pass
    return reply
