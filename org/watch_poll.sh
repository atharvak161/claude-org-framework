#!/bin/bash
# File activity watcher — poll mode (no fswatch required)
# Usage: bash org/watch_poll.sh (from organisation/ root)
LOG="/Users/atharva/Downloads/organisation/org/FILE_ACTIVITY.md"
ORG="/Users/atharva/Downloads/organisation"

echo "# File Activity Log — poll mode started $(date)" > "$LOG"
echo "Watching $ORG for changes (polling every 2s)..."

while true; do
  CURR=$(find "$ORG" \
    -not -path "*/.git/*" \
    -not -path "*/node_modules/*" \
    -not -path "*/.turbo/*" \
    -not -path "*/.next/*" \
    -not -path "*/dist/*" \
    -not -path "*/.cache/*" \
    -not -name "FILE_ACTIVITY.md" \
    -newer "$LOG" 2>/dev/null)
  if [ -n "$CURR" ]; then
    ts=$(date "+%Y-%m-%d %H:%M:%S")
    while IFS= read -r path; do
      [ -z "$path" ] && continue
      relpath="${path#$ORG/}"
      echo "[$ts] FILE — MODIFIED — $relpath" >> "$LOG"
    done <<< "$CURR"
    # Trim to last 200 lines to prevent unbounded growth
    tail -200 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
    # Touch log last so find picks up only files newer than it
    touch "$LOG"
  fi
  sleep 2
done
