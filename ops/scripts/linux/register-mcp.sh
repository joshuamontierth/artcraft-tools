#!/usr/bin/env bash
# register-mcp.sh: register built ArtCraft apps as Claude Code MCP servers (user scope).
#   <app>           live bridge to the running app (start it with launch-app.sh <app>), or headless for PdfCraft
#   <app>-headless  windowless server on ~/ArtCraft/<App> (course apps by default; --include-headless for all)
# Never approve the repos' own project .mcp.json files; some run `cargo run`.
# Usage: register-mcp.sh [--include-headless] [--unregister] [--dry-run] [repo ...]
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
INCL=0; UNREG=0; DRY=0; LIST=()
while [ $# -gt 0 ]; do
  case "$1" in --include-headless) INCL=1 ;; --unregister) UNREG=1 ;; --dry-run) DRY=1 ;; *) LIST+=("$1") ;; esac
  shift
done
command -v claude >/dev/null 2>&1 || [ $DRY -eq 1 ] || { echo "claude CLI not found"; exit 2; }
ONLY="$(IFS=,; echo "${LIST[*]:-}")"

add() {  # add <name> <exe> <args...>
  local n="$1" exe="$2"; shift 2
  echo "claude mcp add --scope user $n -- $exe $*"
  [ $DRY -eq 1 ] && return
  claude mcp remove --scope user "$n" >/dev/null 2>&1
  claude mcp add --scope user "$n" -- "$exe" "$@"
}

for name in $(conf names --only "$ONLY"); do
  if [ $UNREG -eq 1 ]; then
    for n in "$name" "$name-headless"; do echo "claude mcp remove --scope user $n"; [ $DRY -eq 1 ] || claude mcp remove --scope user "$n" >/dev/null 2>&1; done
    continue
  fi
  cli="$(exe_path "$name" cli)"
  [ -x "$cli" ] || { echo "skip $name: $cli not built"; continue; }
  mkdir -p "$(conf workdir "$name")"
  mapfile -t live < <(conf args "$name" mcp_live_args)
  mapfile -t head < <(conf args "$name" mcp_headless_args)
  if [ ${#live[@]} -gt 0 ]; then
    if [ "$(conf get "$name" token_file)" = "true" ]; then d="$(dirname "$(conf tokenfile "$name")")"; mkdir -p "$d"; chmod 700 "$d"; fi
    add "$name" "$cli" "${live[@]}"
    if [ $INCL -eq 1 ] || [ "$(conf get "$name" course)" = "true" ]; then add "$name-headless" "$cli" "${head[@]}"; fi
  else
    add "$name" "$cli" "${head[@]}"
  fi
done
