# ArtCraft toolkit

Install, update and learn the [ArtCraft](https://github.com/storytold) apps: open-source re-creations of
Adobe and Microsoft Office apps (PhotoCraft ≈ Photoshop, LightCraft ≈ Lightroom, FilmCraft ≈ Premiere Pro,
and six more). They're built for AI agents to drive over MCP.

The ArtCraft repos change dozens of times a day, many outside contributors send pull requests, and building Rust
code runs that code (build scripts, macros). So this toolkit never builds anything that hasn't passed a
security gate:

- **A nightly job** pulls each app repo (fast-forward only) and statically scans every commit since the last one you
  approved. It builds only the repos that come back clean. A flagged repo is pulled but not built, so your
  previous build keeps working until you look at the report.
- **A static scanner** (`ops/security/scanner/artcraft_scan.py`, Python standard library only) looks for
  exfiltration endpoints, telemetry SDKs, new network code or crates, persistence, keylogging, obfuscation,
  Unicode tricks, prompt injection aimed at AI agents, build-script and CI changes, and lockfile tampering. It never
  runs repo code.
- **A published audit** (`SECURITY-REPORT.md`, details in `ops/security/audit/`): an AI-assisted manual review of
  all 9 repos at specific commits (2026-10-09). Verdict: no malware, tracking or telemetry; capability notes per app.
- **Claude Code integration**: registers each app's MCP server, so Claude can drive the running app.
- **Beginner courses** for PhotoCraft, LightCraft and FilmCraft (`courses/index.html`, offline). Each one teaches the craft,
  the app, and how to work with Claude, with copyable prompts and a "Coach me with Claude" button in every lesson.

> Unofficial. Not affiliated with ArtCraft/storytold, Adobe or Microsoft. The scanner is a tripwire, not a
> guarantee; see "How far to trust this" below.

## Layout

The toolkit and the app repos share one folder. The app repos are cloned **inside** the toolkit folder and
ignored by its git (see `.gitignore`), so this repo never contains app code.

```
artcraft/                      <- this repo
  README.md  SECURITY-REPORT.md
  courses/                     <- open index.html in a browser
  ops/
    config/repos.json          <- the app repos, build packages, control ports, MCP arguments
    security/                  <- scanner, allowlist, audit, SECURITY-SCAN-GUIDE.md (for AI agents)
    scripts/windows/*.ps1      <- setup, nightly, build, MCP, shortcuts, firewall, practice files
    scripts/linux/*.sh         <- the same for Linux
    state/ logs/ reports/      <- created locally, not committed
  photocraft/ lightcraft/ ...  <- app repos, cloned by the nightly script, not committed
```

## Quick start: Windows 11

PowerShell, from the toolkit folder:

```powershell
git clone <this repo> artcraft
cd artcraft\ops\scripts\windows

# 1. Read ..\..\..\SECURITY-REPORT.md

# 2. Build tools: VS 2022 Build Tools (C++), rustup, NASM, CMake, via winget. Shows a UAC prompt.
powershell -ExecutionPolicy Bypass -File .\setup-windows.ps1
#    then open a NEW terminal (PATH changes) and cd back here

# 3. Clone the app repos and scan them (builds nothing)
powershell -ExecutionPolicy Bypass -File .\nightly-update.ps1 -NoBuild

# 4. Trust the published audit: its reviewed commits become your baselines, and everything newer is scanned
powershell -ExecutionPolicy Bypass -File .\adopt-audit-baseline.ps1

# 5. Build what passed (5-20 min per app the first time). Also adds Start-menu shortcuts.
powershell -ExecutionPolicy Bypass -File .\build-approved.ps1 -Repos photocraft,lightcraft,filmcraft

# 6. Let Claude Code drive the apps (user-scope MCP servers)
powershell -ExecutionPolicy Bypass -File .\register-mcp.ps1

# 7. Nightly pull + scan + build at 03:00 (Task Scheduler, runs while you're logged on)
powershell -ExecutionPolicy Bypass -File .\register-nightly-task.ps1

# Optional: practice files for the courses (~350 MB of public-domain/CC0 media), and an outbound firewall block
powershell -ExecutionPolicy Bypass -File .\fetch-course-assets.ps1
powershell -ExecutionPolicy Bypass -File .\harden-firewall.ps1
```

Then open **Start → ArtCraft → ArtCraft Courses** (or `courses\index.html`) and begin with **Start here**.

## Quick start: Linux (Ubuntu or Arch)

Supported: **Ubuntu 22.04/24.04** (and derivatives such as Mint and Pop!_OS) and **Arch** (and derivatives such as
EndeavourOS and Manjaro). `setup-linux.sh` also has best-effort package lists for Fedora and openSUSE.

```bash
git clone <this repo> ~/artcraft
cd ~/artcraft/ops/scripts/linux
chmod +x *.sh

./setup-linux.sh                    # apt or pacman packages (sudo), rustup, work folders; builds nothing
                                    # Arch: uses pacman -Syu, since partial upgrades aren't supported
exec $SHELL -l                      # pick up ~/.cargo/bin
./nightly-update.sh --no-build      # clone + scan the app repos
./adopt-audit-baseline.sh           # trust the published audit's commits
./build-approved.sh photocraft lightcraft filmcraft
./register-mcp.sh                   # Claude Code MCP servers (needs the `claude` CLI)
./register-nightly.sh               # systemd user timer at 03:00 (falls back to cron)
./fetch-course-assets.sh            # optional practice files
```

Start an app with its control channel (so Claude can drive it): `./launch-app.sh photocraft`. Open
`courses/index.html` in a browser. The course text is written for Windows, but the app steps are the same.
Paths differ: work folders live in `~/ArtCraft/<App>`.

Notes:
- The apps need **Rust 1.95+**. Distro `cargo` packages (such as Ubuntu's apt `cargo`) are too old, so setup always
  installs rustup, and the scripts prefer `~/.cargo/bin/cargo`.
- To let the nightly timer run while you're logged out: `loginctl enable-linger $USER`.
- Arch doesn't ship cron. If systemd user sessions aren't available, install `cronie` and enable it.
- There's no firewall script for Linux. Use your distro's firewall if you want to block outbound traffic.

## Every day after that

Check `ops/reports/LATEST.md` (Windows: **Start → ArtCraft → ArtCraft Nightly Report**).

- **clean / built**: nothing to do.
- **FLAGGED**: the repo was pulled but not built. Ask Claude:
  *"Read ops/security/SECURITY-SCAN-GUIDE.md and triage the FLAGGED repos in ops/reports/LATEST.md. Don't approve anything."*
  If its verdict is benign, run `approve-repo.ps1 -Repo <name> -Note "why"` (Linux: `approve-repo.sh <name> "why"`),
  then `build-approved`.
- **needs-baseline**: a repo with no approved commit (new clone). Run `adopt-audit-baseline`, or do a full review.

## Using the apps with Claude

1. Start the app with its control channel: the **"(ArtCraft)"** Start-menu shortcut, or `launch-app`.
2. Run `claude` in the app's work folder (`%USERPROFILE%\ArtCraft\<App>` or `~/ArtCraft/<App>`), then type `/mcp`
   and check that the app is connected.
3. Ask in plain language, or use the prompts in the courses.

**Never approve the app repos' own `.mcp.json` files** if Claude Code offers them. EffectCraft's runs `cargo run`,
which would build and run unscanned code. Use the servers `register-mcp` sets up.

## How far to trust this

- **The audit** covers the commits in `ops/security/audit/baselines.txt` only. It was a read-only static review by AI
  agents following `ops/security/audit/_REVIEW-CHECKLIST.md`, with targeted reads of the risky code (network,
  control/MCP servers, process spawning, build scripts, dependencies, contributor diffs). It wasn't a line-by-line
  read of every file, and third-party crate sources weren't reviewed. `adopt-audit-baseline` asks before trusting it.
  If you'd rather not, do your own full review (Procedure B in `ops/security/SECURITY-SCAN-GUIDE.md`) and
  `artcraft_scan.py approve` the commit you reviewed.
- **The nightly gate** is pattern-based. It reliably catches copy-paste malware, known-bad hosts and crates, telemetry
  SDKs, lockfile tampering, hidden-character tricks and changes to build or autorun files. It **can't** see subtle
  logic changes (a loosened auth check, a removed path check) or disguised payloads (a URL assembled at runtime).
  For high-stakes use, have an agent or a human read the diffs on security-sensitive files too.
- **Apps' own capabilities**: most control channels have no token, and most MCP servers can write anywhere on disk.
  Turn the control channel on only when you use it, and be careful asking Claude to work on documents from strangers
  (prompt injection). Details per app are in `SECURITY-REPORT.md`.

## Maintaining the toolkit

- Add an app repo: add it to `ops/config/repos.json` with a unique `control_port`, then run a full review before
  building (Procedure C in the scan guide).
- New audit: follow Procedure B, update `SECURITY-REPORT.md`, `ops/security/audit/<repo>.md` and `audit/baselines.txt`.
- Courses: data lives in `courses/data/<app>.js` and the format is in `courses/COURSE-SPEC.md`. In course text,
  write the toolkit folder as `{ROOT}`; the course viewer fills in the reader's real path. Practice files
  are listed in `courses/assets/manifest.js` with source URLs and licenses.
- Scanner false positive: allowlist it narrowly in `ops/security/allowlist.json` (a host, or a fingerprint with a
  reason), never a whole rule.

## License

MIT, see `LICENSE`. This covers the toolkit only; the ArtCraft apps have their own licenses.
