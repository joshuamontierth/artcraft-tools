# common.sh: shared helpers for the ArtCraft Linux ops scripts (source this file; bash 4+).
set -o pipefail

LINUX_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OPS_DIR="$(cd "$LINUX_DIR/../.." && pwd)"
ARTCRAFT_ROOT="${ARTCRAFT_ROOT:-$(cd "$OPS_DIR/.." && pwd)}"
SCANNER="$OPS_DIR/security/scanner/artcraft_scan.py"
REPOCONF="$OPS_DIR/scripts/common/repoconf.py"

find_python() {
  for p in python3 python; do
    if command -v "$p" >/dev/null 2>&1 && "$p" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)' 2>/dev/null; then
      echo "$p"; return 0
    fi
  done
  echo "Python 3.8+ is required" >&2; return 1
}
PY="$(find_python)" || exit 2

conf()    { "$PY" "$REPOCONF" "$@"; }
scanner() { "$PY" "$SCANNER" "$@"; }

find_cargo() {  # rustup's cargo first: distro cargo packages are often too old (the apps need Rust 1.95+)
  if [ -x "$HOME/.cargo/bin/cargo" ]; then echo "$HOME/.cargo/bin/cargo"; return 0; fi
  if command -v cargo >/dev/null 2>&1; then command -v cargo; return 0; fi
  return 1
}

repo_path() { echo "$ARTCRAFT_ROOT/$1"; }
exe_path()  { echo "$ARTCRAFT_ROOT/$1/target/release/$(conf get "$1" "${2:-gui}_exe")"; }
stamp()     { date +%Y-%m-%d; }
section()   { printf '\n== %s\n' "$*"; }

# build_repo <name> <cargo> <logdir> [jobs] -> prints a status line; returns cargo's exit code
build_repo() {
  local name="$1" cargo="$2" logdir="$3" jobs="${4:-0}"
  local path; path="$(repo_path "$name")"
  local log="$logdir/$name-build.log"
  local args=(build --release --locked)
  for p in $(conf get "$name" build_packages); do args+=(-p "$p"); done
  [ "$jobs" -gt 0 ] && args+=(-j "$jobs")
  mkdir -p "$logdir"
  echo "cargo ${args[*]}  (log: $log)" >&2
  local t0=$SECONDS
  ( cd "$path" && "$cargo" "${args[@]}" ) >"$log" 2>&1
  local code=$?
  local mins=$(( (SECONDS - t0) / 60 ))
  local sha; sha="$(git -C "$path" rev-parse HEAD)"
  if [ $code -eq 0 ]; then
    scanner mark-built --repo "$name" --sha "$sha" --result ok >/dev/null
    echo "ok (${mins} min)"
  else
    scanner mark-built --repo "$name" --sha "$sha" --result failed >/dev/null
    echo "FAILED (${mins} min), see $log"
  fi
  return $code
}
