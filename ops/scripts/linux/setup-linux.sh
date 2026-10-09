#!/usr/bin/env bash
# setup-linux.sh: one-time Linux setup for building the ArtCraft apps. Installs toolchains; builds NOTHING.
#   - system packages (compiler, pkg-config, cmake, nasm, X11/Wayland/GL/ALSA/GTK headers, clang and
#     pipewire headers for PhotoCraft's Linux screen-color picker)
#   - Rust via rustup (per-user, stable)
#   - ~/ArtCraft/<App> work folders and a private token folder
# Supported and checked: Ubuntu 22.04/24.04 and derivatives (apt), Arch and derivatives (pacman).
# Best effort: Fedora (dnf), openSUSE (zypper). Uses sudo for packages.
# Then: read SECURITY-REPORT.md -> nightly-update.sh --no-build -> adopt-audit-baseline.sh -> build-approved.sh
#       -> register-mcp.sh -> register-nightly.sh
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

section "System packages"
if command -v apt-get >/dev/null; then
  sudo apt-get update
  sudo apt-get install -y build-essential pkg-config cmake nasm git curl python3 clang libclang-dev \
    libx11-dev libxrandr-dev libxi-dev libxcursor-dev libxkbcommon-dev libxkbcommon-x11-dev libwayland-dev \
    libgl1-mesa-dev libegl1-mesa-dev libvulkan-dev libasound2-dev libgtk-3-dev libfontconfig1-dev libudev-dev \
    libpipewire-0.3-dev libspa-0.2-dev libdrm-dev libgbm-dev libdbus-1-dev libssl-dev imagemagick
elif command -v dnf >/dev/null; then
  sudo dnf install -y gcc gcc-c++ make pkgconf-pkg-config cmake nasm git curl python3 clang clang-devel \
    libX11-devel libXrandr-devel libXi-devel libXcursor-devel libxkbcommon-devel libxkbcommon-x11-devel \
    wayland-devel mesa-libGL-devel mesa-libEGL-devel vulkan-loader-devel alsa-lib-devel gtk3-devel \
    fontconfig-devel systemd-devel pipewire-devel libdrm-devel mesa-libgbm-devel dbus-devel openssl-devel
elif command -v pacman >/dev/null; then
  # -Syu: Arch doesn't support partial upgrades, so this also upgrades the system (pacman asks first).
  sudo pacman -Syu --needed base-devel pkgconf cmake nasm git curl python clang libx11 libxrandr \
    libxi libxcursor libxkbcommon libxkbcommon-x11 wayland mesa vulkan-icd-loader vulkan-headers alsa-lib gtk3 \
    fontconfig systemd-libs pipewire libpipewire libdrm dbus openssl imagemagick
elif command -v zypper >/dev/null; then
  sudo zypper install -y -t pattern devel_basis
  sudo zypper install -y cmake nasm git curl python3 clang llvm-devel libX11-devel libXrandr-devel libXi-devel \
    libXcursor-devel libxkbcommon-devel libxkbcommon-x11-devel wayland-devel Mesa-libGL-devel Mesa-libEGL-devel \
    vulkan-devel alsa-devel gtk3-devel fontconfig-devel systemd-devel pipewire-devel libdrm-devel libgbm-devel \
    dbus-1-devel libopenssl-devel
else
  echo "Unknown package manager: install a C toolchain, pkg-config, cmake, nasm and the X11/Wayland/GL/ALSA/GTK dev headers yourself."
fi

section "Rust"
# The apps need Rust 1.95+ (edition 2024). Distro cargo packages (e.g. Ubuntu's apt `cargo`) are usually
# older, so always use rustup; common.sh prefers ~/.cargo/bin/cargo over one on PATH.
if [ ! -x "$HOME/.cargo/bin/rustup" ] && ! command -v rustup >/dev/null 2>&1; then
  # Downloads rustup-init from the official site over HTTPS (the standard rustup install).
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs -o /tmp/rustup-init.sh
  sh /tmp/rustup-init.sh -y --profile minimal --default-toolchain stable
  rm -f /tmp/rustup-init.sh
fi
RUSTUP="$HOME/.cargo/bin/rustup"; [ -x "$RUSTUP" ] || RUSTUP="$(command -v rustup)"
"$RUSTUP" update stable
"$RUSTUP" default >/dev/null 2>&1 || "$RUSTUP" default stable   # distro rustup packages start with no default
"$(find_cargo)" --version

section "Work folders"
for name in $(conf names); do
  w="$(conf workdir "$name")"; mkdir -p "$w/practice" "$w/exports"; echo "  $w"
done
tokdir="$(dirname "$(conf tokenfile photocraft)")"
mkdir -p "$tokdir" && chmod 700 "$tokdir"
echo "  token folder (0700): $tokdir"

section "Done"
cat <<EOF
Next (open a new shell so ~/.cargo/bin is on PATH):
  1. Read $ARTCRAFT_ROOT/SECURITY-REPORT.md
  2. $LINUX_DIR/nightly-update.sh --no-build      (first install: clones the app repos, scans; builds nothing)
     $LINUX_DIR/adopt-audit-baseline.sh           (first install: trust the published audit's commits)
     $LINUX_DIR/build-approved.sh photocraft lightcraft filmcraft
  3. $LINUX_DIR/register-mcp.sh
  4. $LINUX_DIR/register-nightly.sh
  5. Open $ARTCRAFT_ROOT/courses/index.html in a browser
EOF
