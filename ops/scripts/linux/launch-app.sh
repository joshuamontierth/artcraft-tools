#!/usr/bin/env bash
# launch-app.sh <app> [--no-control] [files...]: start an ArtCraft app with its loopback-only control
# channel on (the port from ops/config/repos.json), so the Claude Code MCP bridge can drive it.
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
[ $# -ge 1 ] || { echo "usage: launch-app.sh <app> [--no-control] [files...]"; exit 2; }
name="$1"; shift
NOCTL=0; [ "${1:-}" = "--no-control" ] && { NOCTL=1; shift; }
exe="$(exe_path "$name" gui)"
[ -x "$exe" ] || { echo "$exe not built; run build-approved.sh $name"; exit 2; }
work="$(conf workdir "$name")"; mkdir -p "$work/practice" "$work/exports"
args=()
if [ $NOCTL -eq 0 ] && [ -n "$(conf get "$name" control_port)" ]; then
  if [ "$(conf get "$name" token_file)" = "true" ]; then d="$(dirname "$(conf tokenfile "$name")")"; mkdir -p "$d"; chmod 700 "$d"; fi
  mapfile -t args < <(conf args "$name" gui_args)
fi
cd "$work" && nohup "$exe" "${args[@]}" "$@" >/dev/null 2>&1 &
echo "started $exe ${args[*]} $*"
