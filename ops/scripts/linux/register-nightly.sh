#!/usr/bin/env bash
# register-nightly.sh: schedule nightly-update.sh. Uses a systemd --user timer if available, else cron.
# Usage: register-nightly.sh [--at HH:MM] [--no-build] [--remove]
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
AT="03:00"; EXTRA=""; REMOVE=0
while [ $# -gt 0 ]; do
  case "$1" in --at) AT="$2"; shift ;; --no-build) EXTRA="--no-build" ;; --remove) REMOVE=1 ;; *) echo "unknown $1"; exit 2 ;; esac
  shift
done
SCRIPT="$LINUX_DIR/nightly-update.sh"
chmod +x "$LINUX_DIR"/*.sh

if command -v systemctl >/dev/null 2>&1 && systemctl --user show-environment >/dev/null 2>&1; then
  UD="$HOME/.config/systemd/user"; mkdir -p "$UD"
  if [ $REMOVE -eq 1 ]; then
    systemctl --user disable --now artcraft-nightly.timer 2>/dev/null; rm -f "$UD"/artcraft-nightly.{service,timer}
    systemctl --user daemon-reload; echo "removed systemd timer"; exit 0
  fi
  cat > "$UD/artcraft-nightly.service" <<EOF
[Unit]
Description=ArtCraft nightly pull + security gate + build

[Service]
Type=oneshot
Environment=PATH=$HOME/.cargo/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/usr/bin/env bash $SCRIPT $EXTRA
Nice=10
EOF
  cat > "$UD/artcraft-nightly.timer" <<EOF
[Unit]
Description=Run ArtCraft nightly update at $AT

[Timer]
OnCalendar=*-*-* $AT:00
Persistent=true

[Install]
WantedBy=timers.target
EOF
  systemctl --user daemon-reload
  systemctl --user enable --now artcraft-nightly.timer
  echo "systemd user timer enabled (daily $AT). Status: systemctl --user list-timers artcraft-nightly.timer"
  echo "Tip: 'loginctl enable-linger $USER' lets it run while you are logged out."
else
  H="${AT%%:*}"; M="${AT##*:}"
  LINE="$((10#$M)) $((10#$H)) * * * PATH=\$HOME/.cargo/bin:/usr/local/bin:/usr/bin:/bin bash $SCRIPT $EXTRA >/dev/null 2>&1 # artcraft-nightly"
  ( crontab -l 2>/dev/null | grep -v '# artcraft-nightly' ; [ $REMOVE -eq 1 ] || echo "$LINE" ) | crontab -
  [ $REMOVE -eq 1 ] && echo "removed cron entry" || echo "cron entry added: $LINE"
fi
