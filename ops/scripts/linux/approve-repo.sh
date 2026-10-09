#!/usr/bin/env bash
# approve-repo.sh <repo> ["note"]: after reviewing a FLAGGED gate report, accept HEAD as the new baseline.
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
[ $# -ge 1 ] || { echo "usage: approve-repo.sh <repo> [note]"; exit 2; }
name="$1"; note="${2:-}"
"$PY" - "$OPS_DIR/state/scan-state.json" "$name" "$ARTCRAFT_ROOT" <<'EOF'
import json, os, sys
try:
    st = json.load(open(sys.argv[1]))["repos"].get(sys.argv[2], {})
except Exception:
    st = {}
print("status:", st.get("status", "?"), "| reason:", st.get("reason", ""))
rep = st.get("last_report")
if rep:
    path = os.path.join(sys.argv[3], rep)
    print("report:", path)
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            if line.startswith("| HIGH ") or line.startswith("| CRITICAL "):
                print("  " + line.rstrip())
EOF
echo "HEAD: $(git -C "$(repo_path "$name")" log -1 --format='%h %cd %s' --date=short)"
read -r -p "Approve $name at this commit as reviewed and clean? (type yes) " ans
[ "$ans" = "yes" ] || { echo "not approved"; exit 1; }
scanner approve --root "$ARTCRAFT_ROOT" --repo "$name" --note "$note"
