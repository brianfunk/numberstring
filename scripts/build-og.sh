#!/usr/bin/env sh
# Rasterize site/og.svg to site/og.png (1200x630) with headless Chrome.
# Run after editing og.svg: npm run site:og
set -e
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || CHROME="$(command -v google-chrome || command -v chromium || command -v chrome)"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
  --window-size=1200,630 --screenshot="$PWD/site/og.png" "file://$PWD/site/og.svg" 2>/dev/null
echo "site/og.png rendered from site/og.svg"
