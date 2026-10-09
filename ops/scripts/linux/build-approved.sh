#!/usr/bin/env bash
# build-approved.sh: build the ArtCraft apps whose checked-out commit passes the security gate.
# Usage: build-approved.sh [--force] [--jobs N] [repo ...]   (default: all repos; does not pull)
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
FORCE=""; JOBS=0; LIST=()
while [ $# -gt 0 ]; do
  case "$1" in --force) FORCE="--force" ;; --jobs) JOBS="$2"; shift ;; *) LIST+=("$1") ;; esac
  shift
done
CARGO="$(find_cargo)" || { echo "cargo not found; run setup-linux.sh first"; exit 2; }
ONLY="$(IFS=,; echo "${LIST[*]:-}")"
LOGDIR="$OPS_DIR/logs/$(stamp)"
for name in $(conf names --only "$ONLY"); do
  section "$name"
  [ -d "$(repo_path "$name")/.git" ] || { echo "$name: not cloned"; continue; }
  if ! scanner gate --root "$ARTCRAFT_ROOT" --repo "$name"; then echo "$name: NOT BUILT (gate flagged / needs baseline)"; continue; fi
  scanner should-build --root "$ARTCRAFT_ROOT" --repo "$name" $FORCE >/dev/null; s=$?
  if [ $s -eq 1 ]; then echo "$name: already built at this commit (--force to rebuild)"; continue; fi
  [ $s -ne 0 ] && { echo "$name: not approved"; continue; }
  echo "$name: $(build_repo "$name" "$CARGO" "$LOGDIR" "$JOBS")"
done
