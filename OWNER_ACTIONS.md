# OWNER_ACTIONS.md

Ship `steven-website` from `~/Dev2/Projects/main-blog` to GitHub and Railway.

Every step says **who** does it. "You" means Steven at a terminal or in a browser.
"Claude" means it can be done from this session, and only after you approve that
exact action by name. Nothing here has been executed yet.

Verified live on 2026-09-10 unless marked ASSUMPTION or PLACEHOLDER.

---

## 0. State of play, verified

| Fact | Evidence |
| --- | --- |
| Repo exists | `github.com/praxisghost/steven-website` |
| Repo is **PUBLIC** | GitHub shows the Public label; the clone at 19:40 needed no credentials |
| `origin/main` == local `main` | both `8c5221e`, clean tree, nothing ahead or behind |
| Two other branches | `stevenlegg-xyz` (18 ahead / 41 behind, last commit 2026-06-09), `website-xyz` (28 ahead / 41 behind, 2026-06-12) |
| The site is **already live on Railway** | `https://www.steven-legg.com` → `HTTP/2 200`, `server: railway-hikari`, `x-railway-edge: jfk1` |
| The live release predates D2 | `https://www.steven-legg.com/healthz` → `404` |
| TLS + HSTS already working on www | `strict-transport-security: max-age=31536000; includeSubDomains` |
| Apex redirects off-Railway | `steven-legg.com` → `301 Location: http://www.steven-legg.com` from an AWS host, not Railway |
| No `gh`/`railway` CLI, no credential helper **in this session's sandbox** | `command -v` empty there. **This says nothing about your Mac** — see §3 |

Two branches are dead ends: both delete `server.ts`, `sanity/` and `tsconfig.json`
wholesale and replace them with a 400–500 file tree from a June "stevenlegg-xyz
migration". Neither is an ancestor of anything live. Leave them alone — nothing
is ever deleted — and protect `main` only.

---

## 1. DECISION REQUIRED — repository visibility

The brief said to ask public or private before creating the repo. The repo
already exists and is **public**. That is a decision already made, not one I can
make for you.

Public is defensible here: it is a personal blog, and I verified in D1 that no
secret is committed — every token, password and key field in `.env.example` is
empty, and there is no `.env` in git. What is public is the full source, the
1,700-line CHANGELOG, and the four Minecraft FTP variable *names*.

- **Keep public** → no action.
- **Make private** → you, at `github.com/praxisghost/steven-website/settings` →
  Danger Zone → Change visibility. **Roll back:** same page, back to public.
  **Verify:** the label next to the repo name. **Note:** if you go private,
  Railway's GitHub connection must still have access to the repo or deploys stop.

**One thing below does depend on this.** GitHub's docs: "Protected branches are
available in public repositories with GitHub Free." Private repositories need Pro,
Team or Enterprise. So on a Free account, **going private disables the branch
protection in §4**. If you want both private and protected, that is a paid GitHub
plan — a new paid service, which the brief puts out of scope. Decide visibility
first; §4 assumes you stay public.

---

## 2. First commit

**Who:** Claude, on your explicit approval of the words "commit".

The D2 changes are unstaged in your working tree. Rule 2 says never `git add .`,
so every path is named:

```
git -C ~/Dev2/Projects/main-blog add \
  server.ts \
  scripts/migrate.ts \
  package.json \
  railway.toml \
  .env.example \
  .gitignore \
  README.md \
  CHANGELOG.md \
  OWNER_ACTIONS.md \
  _archive/language-guides
```

`_to_delete/` is **not** committed — it is gitignored, local only, yours to
remove. Those four files remain recoverable from history at their old paths.

The seventeen `public/.fuse_hidden*` paths and `MinecraftLogo.png` are already
gone from the working tree because they were moved. Stage those deletions
explicitly, again by name, with `git add -u -- public MinecraftLogo.png`.

Commit message:

```
v3.2.2 remove boot-time DROP TABLE, move migrations to pre-deploy

- server.ts no longer issues DDL; DROP TABLE IF EXISTS ... CASCADE on
  srs_progress, saved_guides, pending_signups and users ran on every boot
- scripts/migrate.ts is now the only DDL, transactional and idempotent,
  exits non-zero so a failed migration fails the release
- initDB() -> verifySchema(), read-only, fails closed
- add GET /healthz
- .env.example: SITE_URL, SANITY_WRITE_TOKEN
- move 17 FUSE-named files out of public/ (14 language guides to
  _archive/language-guides, 3 stale style.css copies to _to_delete)
```

**Verify:** `git --no-optional-locks show --stat HEAD` lists exactly the paths
above and no others.
**Roll back:** `git reset --soft HEAD~1` — keeps every change in the working
tree, touches nothing else. Never `reset --hard` here.

> **Use `--no-optional-locks` for every read against this folder.** Plain
> `git status` takes an index lock the mounted filesystem cannot clean up, which
> is what stranded `.git/index.lock` earlier. `git --no-optional-locks status`
> and `git --no-optional-locks diff` never take it.

---

## 3. Push

**Who:** You.

**Correction to something I said earlier:** I reported "no `gh`, no credential
helper on this machine". That check ran inside this session's Linux sandbox,
which only has your folders mounted — **not on your Mac.** Your Mac evidently has
working GitHub credentials, since you pushed `8c5221e` from it on 2026-07-29. The
conclusion still holds — the push is yours, because this session has no GitHub
credentials of its own — but my reason was wrong.

```
git -C ~/Dev2/Projects/main-blog push origin main
```

**Why not a branch and PR:** `main` is what Railway builds, this is a
single-author repo, and the change is already reviewed here. If you would rather
gate it, push `git push origin main:polish-v3.2.2` instead and open a PR — say so
and I will rewrite this section.

**Verify:** `git ls-remote --heads origin main` returns the new SHA, and the repo's
Commits page shows the message above.
**Roll back:** the previous SHA is `8c5221e`. Do **not** force-push to undo. Use
`git revert <new-sha>` and push the revert — Rule 3.

**This will trigger a Railway deploy** if the service has auto-deploy on `main`,
which is the default and almost certainly how the live site got there. Check
§5 first, or pause the service, if you do not want a deploy the moment you push.

---

## 4. Branch protection on `main`

**Who:** You. Requires repo-admin in the browser.

**Where:** `github.com/praxisghost/steven-website/settings/rules` → New ruleset →
New branch ruleset.

| Field | Value |
| --- | --- |
| Ruleset name | `protect-main` |
| Enforcement status | Active |
| Target branches | Include by pattern → `main` |
| Restrict deletions | on |
| Block force pushes | on |
| Require linear history | on |
| Require a pull request | **off** |

Rulesets are available on public repositories with GitHub Free — see the coupling
noted in §1 before making the repo private. The two useful rules here are the
destructive ones — deletion and force-push — because Rule 3 forbids both anyway
and this makes the rule mechanical. Requiring a PR on a single-author repo just
means you approve your own PRs, so it is off; turn it on if you disagree.

Leave `stevenlegg-xyz` and `website-xyz` unprotected and untouched.

**Verify:** in a scratch clone, `git push --force` to `main` is rejected with
`protected branch hook declined`. Do not test this against your working copy.
**Roll back:** same page → the ruleset → Delete ruleset.

---

## 5. RECOMMENDATION — reuse the existing Railway service. Do not create a new one.

This is the one place where the brief's default and the evidence disagree, so
here is the reasoning rather than a verdict.

**Reuse it.** Three reasons, in order of weight:

1. **A new service would silently ignore `railway.toml`.** Railway's Config as
   Code is deprecated: legacy `railway.toml` files "remain functional for
   existing services but cannot be used for new services", with a hard cutoff of
   **2026-12-01**. On a new service the `preDeployCommand` and `healthcheckPath`
   added in D2 would not be read at all — no migration would run, and no health
   gate would exist, with nothing in the UI saying so. That is the worst possible
   failure mode: silent.
2. **The domain and TLS are already attached and working.** `www.steven-legg.com`
   answers 200 from `railway-hikari` with a valid certificate and HSTS. A new
   service means re-issuing the certificate and a DNS cutover, which the brief
   explicitly wants deferred and done separately.
3. **The environment variables are already set.** The live site serves the Sanity
   blog and sets HSTS, so at minimum `NODE_ENV=production` and the Sanity config
   are in place. Recreating them by hand is a chance to typo a secret.

The argument for a new service is a clean slate you can smoke-test before cutting
the domain over. That is real, and it is why §8 exists — but you get the same
safety from Railway's own rollback, without the config trap in (1).

**What this costs you:** the Config-as-Code deadline becomes a dated obligation.
See §10.

---

## 6. Railway service settings

**Who:** You, to read the current values. Claude cannot see your Railway account.

**Where:** railway.com → your project → the service serving `www.steven-legg.com`
→ Settings.

Fill these in and send them back; several steps below can't be checked without them:

| Setting | Where | Expected / target | PLACEHOLDER — current value |
| --- | --- | --- | --- |
| Project name | breadcrumb | — | `______` |
| Service name | breadcrumb | — | `______` |
| Environment | env switcher | `production` | `______` |
| Source repo | Settings → Source | `praxisghost/steven-website` | `______` |
| Branch | Settings → Source | `main` | `______` |
| Root directory | Settings → Source | empty — the app is at the repo root | `______` |
| Auto-deploy | Settings → Source | on | `______` |
| Builder | Settings → Build | see §7 | `______` |
| Build command | Settings → Build | **empty** — there is no build step | `______` |
| Pre-deploy command | Settings → Deploy | `npm run migrate` | `______` |
| Start command | Settings → Deploy | `npm start` | `______` |
| Health check path | Settings → Deploy | `/healthz` | `______` |
| Health check timeout | Settings → Deploy | `30` | `______` |
| Restart policy | Settings → Deploy | `ON_FAILURE`, max 10 | `______` |
| Custom domain | Settings → Networking | `www.steven-legg.com` | `______` |

**A UI value set here overrides `railway.toml`.** If any row already differs from
the target, tell me before changing it — a value someone set deliberately in the
UI is evidence, and Rule 7 says stop rather than pick silently.

**There is no build command, and that is correct.** `tsx` transpiles TypeScript at
runtime; `package.json` has no `build` script. If a build command is set to
something like `npm run build`, it will fail on a missing script. It should be
empty.

Environment variable **names** the code reads — set values in Railway, never in
git. Required for the site to work as it does today:

```
DATABASE_URL  NODE_ENV  PORT  SITE_URL
SANITY_PROJECT_ID  SANITY_DATASET  SANITY_REVALIDATE_SECRET
RESEND_API_KEY  CONTACT_FROM_EMAIL  CONTACT_TO_EMAIL
TURNSTILE_SITE_KEY  TURNSTILE_SECRET_KEY  TURNSTILE_EXPECTED_HOSTNAME
MINECRAFT_SERVER_ADDRESS  MINECRAFT_FTP_HOST  MINECRAFT_FTP_PORT
MINECRAFT_FTP_USERNAME  MINECRAFT_FTP_PASSWORD  MINECRAFT_FTP_SECURE
MINECRAFT_WHITELIST_PATH  MINECRAFT_STATUS_HOST  MINECRAFT_STATUS_PORT
MINECRAFT_STATUS_INTERVAL_MS
```

`SANITY_API_READ_TOKEN` is only needed if the dataset ever goes private.
`SANITY_WRITE_TOKEN` is for the local one-off importer — **do not set it on the
deployed service.**

**`SITE_URL` deserves one deliberate check.** Unset, `sanity/client.ts` falls back
to `https://www.steven-legg.com`, which is right for production and wrong
everywhere else. If you ever add a staging service, it must set its own or it will
publish production canonicals, RSS links and sitemap entries.

---

## 7. The builder — an open question, not a recommendation

`railway.toml` says `builder = "NIXPACKS"`. Railway's current reference lists only
two accepted values: `RAILPACK` (the default) and `DOCKERFILE`. **NIXPACKS is no
longer listed.**

I do not know whether Railway still honours it for an existing service, silently
falls back to Railpack, or ignores the key entirely — and I will not guess at
something that decides how your site is built.

**Who:** You. **How to find out:** open the most recent successful deploy →
Build Logs → the first lines name the builder.

- If it says Nixpacks, it is still honoured. Leave it. Revisit at §10.
- If it says Railpack, the key is already being ignored and the line in
  `railway.toml` is decorative. Tell me and I will remove it in a one-line change
  so the file stops describing something that isn't happening.

Either way **do not change the builder as part of this release.** One variable at
a time.

---

## 8. Order of operations — the old deploy stays live and recoverable

The brief's constraint, made concrete:

1. Push to `main` (§3). Railway builds and deploys automatically.
2. **The pre-deploy container runs `npm run migrate` first.** Railway runs this in
   a separate container between build and deploy. "If your command fails, it will
   not be retried and the deployment will not proceed." It runs once per release,
   not once per replica — which was the entire point of moving the DDL out of
   `server.ts`.
3. The new container starts and Railway polls `/healthz` until it returns 2xx,
   then makes the new deployment active and the previous one inactive. If it never
   returns 2xx inside the timeout, the deploy is marked failed and **the previous
   deployment stays active**.
4. Only then do you smoke-test.

Nothing about the domain changes in any of this — the domain is already on the
service, so a failed release simply never becomes active.

**Fails-closed, verified rather than assumed.** I ran the real migration script
against a real Postgres:

```
no DATABASE_URL           -> [migrate] FAILED: refusing to run migrations blind.  EXIT=1
unreachable DATABASE_URL  -> [migrate] FAILED: connect ECONNREFUSED               EXIT=1
happy path                -> 5 tables ensured                                     EXIT=0
re-run                    -> 5 tables ensured                                     EXIT=0  (idempotent)
```

What I verified is that **the command fails closed**. That Railway then fails the
release is Railway's documented behaviour, which I have read but not observed on
your account. First real deploy is where that gets confirmed — watch it.

**Smoke test, after the deploy reports success. You run this; it is the check you
asked to be able to see:**

```
curl -sS -o /dev/null -w '%{http_code}\n' https://www.steven-legg.com/healthz
curl -sS https://www.steven-legg.com/healthz
for p in / /blog /about /projects /contact /feed.xml /sitemap.xml /minecraft-server; do
  printf '%-22s ' "$p"
  curl -sS -o /dev/null -w '%{http_code}\n' "https://www.steven-legg.com$p"
done
```

Expected: `/healthz` returns `200` and `{"status":"ok","db":"connected","uptime":N}`.
Every other path returns `200`. `"db":"unavailable"` means the migration did not
run or `DATABASE_URL` is wrong — the site will still serve, but the contact form,
newsletter and view counter will answer 503.

**Roll back a bad release:** Railway → the service → Deployments → the previous
deployment → **Redeploy**. That is the rollback; it needs no git operation.
Because the migration is `CREATE TABLE IF NOT EXISTS` only, rolling the code back
leaves the schema valid — there is no down-migration to run, and nothing this
release does to the database is destructive.

---

## 9. Log retention, restart policy, replicas

| Setting | Value | Note |
| --- | --- | --- |
| Restart policy | `ON_FAILURE`, max 10 retries | already in `railway.toml`, unchanged from what you had |
| Replicas | leave at 1 | the rate limiter is in-process, so N replicas means N× the limit; not a problem at 1 |
| Deploy image retention | 120 hours on Pro (72 on Hobby) | this is exactly the rollback window: "Deployments older than your plan's retention policy cannot be restored via rollback, and thus the rollback option will not be visible." **Five days on Pro, three on Hobby.** |

**I could not verify a log-retention figure for Pro.** Railway's plan page
documents included usage, replica and resource ceilings, and image retention, but
I did not find a stated log-retention period, and I am not going to invent one.
Check Observability → Logs in your dashboard for the actual window. If you need
logs kept longer than that window, that means a log drain to a third party — a new
paid service, which the brief puts out of scope.

---

## 10. Railway Pro dependencies, and one dated obligation

**What this setup actually needs from Pro: nothing.** Pre-deploy commands, health
checks, restart policies, custom domains, TLS and rollback-by-redeploy are all
plan-independent. Pro raises resource ceilings (42 replicas, 1 TB RAM, 1,000 vCPU
vs Hobby's 6 / 48 GB / 48 vCPU), raises included usage from $5 to $20/month, extends
image retention from 72 to 120 hours, and adds workspace collaboration. A
single-replica personal blog uses none of that — with one caveat worth weighing:
image retention *is* the rollback window, so Pro buys five days to notice a bad
release and roll back where Hobby buys three.

Said plainly: **if you are on Pro for this blog alone, the setup does not require
it.** That is worth knowing before the next renewal. It is your call, not mine —
and if other projects share the workspace, Pro may well be earning its keep there.

### The dated obligation

**Railway's Config as Code — the `railway.toml` this whole setup leans on — stops
being read on 2026-12-01.** That is a hard cutoff, roughly twelve weeks out.
Existing services keep working until then; new services cannot use it at all.

The replacement is Infrastructure as Code: `.railway/railway.ts`, with
`railway config init`, `railway config plan` and `railway config apply`, and a
migration path via `railway config migrate --apply`. It needs the Railway CLI,
which is not installed on this machine.

I am not doing that migration now. It is a change of deployment mechanism, not
polish, it needs CLI auth I do not have, and doing it in the same release as the
`DROP TABLE` fix would mean two variables moving at once. But **put it in your
calendar for November**, because on 2026-12-01 the `preDeployCommand` in
`railway.toml` stops being read, and the migration silently stops running.

---

## 11. Custom domain and DNS — deliberately not here

The brief says DNS records, TTLs and the cutover sequence come separately and only
when asked. So they are not in this document. Ask and I will write them.

One observation while checking the live site, for whenever you do ask:

```
https://steven-legg.com/  ->  301  Location: http://www.steven-legg.com
                                            ^^^^ plaintext, and not from Railway
                                            (server: ip-10-123-125-226.ec2.internal)
```

The apex redirect is handled by something outside Railway and sends visitors to
**http**, which then takes a second redirect to https. HSTS on `www` protects
anyone who has visited before, but a first-time visitor typing the bare domain
gets one plaintext hop. Not urgent, not in scope, worth fixing when you touch DNS.
