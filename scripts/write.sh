#!/bin/sh
# scripts/write.sh — open the Sanity Studio so you can write a post.
#
#   npm run write          → starts the Studio at http://localhost:3333 and opens it
#   npm run studio:deploy  → publishes the Studio to <name>.sanity.studio
#
# The Studio needs Node 22.12+, while the site itself pins Node 20 (.nvmrc).
# If the current Node is too old and fnm is installed, the Studio's own
# .nvmrc version is used instead.
set -e
cd "$(dirname "$0")/../studio"

run() {
  major=$(node -p 'process.versions.node.split(".")[0]' 2>/dev/null || echo 0)
  if [ "$major" -ge 22 ]; then
    "$@"
  elif command -v fnm >/dev/null 2>&1; then
    fnm exec --using="$(cat .nvmrc)" -- "$@"
  else
    echo "The Studio needs Node 22.12 or newer (found: $(node -v 2>/dev/null || echo none))." >&2
    echo "Install it with:  fnm install $(cat .nvmrc)" >&2
    exit 1
  fi
}

run node -v >/dev/null   # fail fast with a clear message if Node is too old

if [ ! -d node_modules ]; then
  echo "First run: installing Studio dependencies (one-time, ~1-2 min)…"
  run npm ci --no-audit --no-fund
fi

if [ "$1" = "deploy" ]; then
  run npx sanity deploy
  exit 0
fi

# Open the browser once the dev server is listening (macOS `open`, Linux `xdg-open`).
( for i in $(seq 1 60); do
    if curl -s -o /dev/null http://localhost:3333; then
      (open http://localhost:3333 2>/dev/null || xdg-open http://localhost:3333 2>/dev/null) || true
      break
    fi
    sleep 1
  done ) &

echo "Starting the Studio at http://localhost:3333  (Ctrl+C to stop)"
run npx sanity dev --port 3333
