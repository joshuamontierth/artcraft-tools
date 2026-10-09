#!/usr/bin/env bash
# nightly-update.sh: pull every ArtCraft repo, security-gate the new commits, build only what passes.
#
# For each repo in ops/config/repos.json:
#   1. clone it if missing, otherwise fast-forward to origin/<branch> (never merges, rebases, or discards
#      local changes; dirty or diverged repos are skipped and reported)
#   2. run the static security gate (ops/security/scanner/artcraft_scan.py gate), which scans all commits
#      since the last approved commit and never executes repository code
#   3. if the gate is clean and Rust is installed: cargo build --release --locked -p <app packages>
# Summary: ops/reports/nightly-<date>.md and ops/reports/LATEST.md; logs in ops/logs/<date>/.
#
# Usage: nightly-update.sh [--no-build] [--no-pull] [--repos a,b] [--jobs N]
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

NO_BUILD=0; NO_PULL=0; ONLY=""; JOBS=0
while [ $# -gt 0 ]; do
  case "$1" in
    --no-build) NO_BUILD=1 ;;
    --no-pull)  NO_PULL=1 ;;
    --repos)    ONLY="$2"; shift ;;
    --jobs)     JOBS="$2"; shift ;;
    -h|--help)  sed -n '2,13p' "$0"; exit 0 ;;
    *) echo "unknown option $1" >&2; exit 2 ;;
  esac
  shift
done

STAMP="$(stamp)"
LOGDIR="$OPS_DIR/logs/$STAMP"; REPDIR="$OPS_DIR/reports"
mkdir -p "$LOGDIR" "$REPDIR" "$OPS_DIR/state"
LOG="$LOGDIR/nightly-$(date +%H%M%S).log"
exec > >(tee -a "$LOG") 2>&1

LOCK="$OPS_DIR/state/nightly-linux.flock"
exec 9>"$LOCK"
if command -v flock >/dev/null 2>&1 && ! flock -n 9; then echo "another nightly run is in progress"; exit 3; fi

CARGO="$(find_cargo || true)"
[ -z "$CARGO" ] && [ $NO_BUILD -eq 0 ] && echo "cargo not found: builds will be skipped (run setup-linux.sh)"

ROWS=()
START=$SECONDS
for name in $(conf names --only "$ONLY"); do
  section "$name"
  path="$(repo_path "$name")"; branch="$(conf get "$name" branch)"; url="$(conf get "$name" url)"
  pull=""; before=""; after=""; commits=0; gate=""; build=""; report=""
  if [ ! -d "$path/.git" ]; then
    if [ $NO_PULL -eq 1 ]; then ROWS+=("| $name | missing | 0 | - | - | |"); continue; fi
    if git clone --branch "$branch" "$url" "$path"; then pull="cloned"; else ROWS+=("| $name | clone FAILED | 0 | - | - | |"); continue; fi
  fi
  before="$(git -C "$path" rev-parse HEAD)"
  if [ $NO_PULL -eq 0 ] && [ "$pull" != "cloned" ]; then
    if [ -n "$(git -C "$path" status --porcelain --untracked-files=no)" ]; then
      pull="SKIPPED: local changes"
    elif [ "$(git -C "$path" rev-parse --abbrev-ref HEAD)" != "$branch" ]; then
      pull="SKIPPED: not on $branch"
    elif ! git -C "$path" fetch --prune --quiet origin; then
      pull="fetch FAILED"
    elif ! git -C "$path" merge --ff-only --quiet "origin/$branch"; then
      pull="NOT fast-forward (diverged), left alone"
    else
      pull="ok"
    fi
  elif [ $NO_PULL -eq 1 ]; then pull="skipped (--no-pull)"; fi
  after="$(git -C "$path" rev-parse HEAD)"
  [ "$before" != "$after" ] && commits="$(git -C "$path" rev-list --count "$before..$after")"
  echo "$name: ${before:0:12} -> ${after:0:12} ($commits new commits) pull=$pull"

  scanner gate --root "$ARTCRAFT_ROOT" --repo "$name"; g=$?
  case $g in 0) gate="clean" ;; 10) gate="FLAGGED" ;; *) gate="error ($g)" ;; esac
  report="$("$PY" -c "import json,sys; d=json.load(open(sys.argv[1])); r=d['repos'].get(sys.argv[2],{}); print(r.get('last_report',''))" "$OPS_DIR/state/scan-state.json" "$name" 2>/dev/null)"
  if [ $g -eq 10 ]; then
    reason="$("$PY" -c "import json,sys; d=json.load(open(sys.argv[1])); print(d['repos'].get(sys.argv[2],{}).get('reason',''))" "$OPS_DIR/state/scan-state.json" "$name" 2>/dev/null)"
    [ -n "$reason" ] && gate="FLAGGED: $reason"
  fi

  if [ $NO_BUILD -eq 1 ]; then build="skipped (--no-build)"
  elif [ $g -ne 0 ]; then build="blocked by gate"
  elif [ -z "$CARGO" ]; then build="skipped (no Rust toolchain)"
  else
    scanner should-build --root "$ARTCRAFT_ROOT" --repo "$name" >/dev/null; s=$?
    if [ $s -eq 1 ]; then build="up to date"
    elif [ $s -ne 0 ]; then build="not approved"
    else build="$(build_repo "$name" "$CARGO" "$LOGDIR" "$JOBS")"; fi
  fi
  ROWS+=("| $name | $pull | $commits | $gate | $build | ${report:+\`$report\`} |")
done

{
  echo "# ArtCraft nightly update: $STAMP"
  echo
  echo "Finished $(date '+%Y-%m-%d %H:%M') in $(( (SECONDS - START) / 60 )) min. Mode: $([ $NO_BUILD -eq 1 ] && echo 'pull + scan only' || echo 'pull + scan + build')."
  echo
  echo "| Repo | Pull | New commits | Gate | Build | Scan report |"
  echo "|---|---|---|---|---|---|"
  printf '%s\n' "${ROWS[@]}"
  echo
  echo "- **FLAGGED**: read the blocking findings in the report; if fine: \`ops/scripts/linux/approve-repo.sh <name> \"why\"\` then \`build-approved.sh <name>\`."
  echo "- **needs-baseline**: new clone with no approved commit. Either trust the published audit (\`ops/scripts/linux/adopt-audit-baseline.sh\`, see SECURITY-REPORT.md) or do a full review first (ops/security/SECURITY-SCAN-GUIDE.md)."
  echo "- Log: \`$LOG\`"
} | tee "$REPDIR/nightly-$STAMP.md" > "$REPDIR/LATEST.md"
cat "$REPDIR/LATEST.md"
