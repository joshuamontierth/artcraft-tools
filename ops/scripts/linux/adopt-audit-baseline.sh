#!/usr/bin/env bash
# adopt-audit-baseline.sh [--yes] [repo ...]: trust the published security audit by using its reviewed
# commits (ops/security/audit/baselines.txt, report in SECURITY-REPORT.md) as your gate baselines, then run
# the gate, which scans every commit from the audited one to your HEAD. Read SECURITY-REPORT.md first.
# Repos that already have a baseline are left alone.
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
YES=0; LIST=()
while [ $# -gt 0 ]; do
  case "$1" in --yes) YES=1 ;; *) LIST+=("$1") ;; esac
  shift
done
FILE="$OPS_DIR/security/audit/baselines.txt"
echo "Audited commits: $FILE"
grep -v '^#' "$FILE" | sed '/^\s*$/d; s/^/  /'
if [ $YES -eq 0 ]; then
  read -r -p "Use these audited commits as your security-gate baselines? (type yes) " ans
  [ "$ans" = "yes" ] || { echo "Nothing changed."; exit 1; }
fi
ONLY="$(IFS=,; echo "${LIST[*]:-}")"
SUMMARY=()
for name in $(conf names --only "$ONLY"); do
  section "$name"
  [ -d "$(repo_path "$name")/.git" ] || { echo "not cloned; run nightly-update.sh --no-build first"; continue; }
  scanner adopt-baseline --root "$ARTCRAFT_ROOT" --repo "$name"; g=$?
  [ $g -eq 0 ] && { scanner gate --root "$ARTCRAFT_ROOT" --repo "$name"; g=$?; }
  case $g in 0) SUMMARY+=("$name: clean") ;; 10) SUMMARY+=("$name: FLAGGED") ;; *) SUMMARY+=("$name: error ($g)") ;; esac
done
echo
printf '%s\n' "${SUMMARY[@]}"
echo "Clean repos can be built with build-approved.sh. For FLAGGED ones, see ops/reports and SECURITY-SCAN-GUIDE.md."
