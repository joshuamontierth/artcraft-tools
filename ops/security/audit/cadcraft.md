# cadcraft security review

- Commit reviewed: 59631c8d4f9ffe6c08c5c2065ea17504e53bf821 (2026-10-08 10:02:20 -0400, "Bump version to 0.3.0 (from 0.2.0) for release")
- Review type: read-only static review by AI agent, 2026-10-09
- Verdict: CLEAN WITH NOTES
- Build-gate recommendation: APPROVE. No network client, no process spawning, no telemetry, no obfuscation; both build scripts only write to `OUT_DIR` or embed icon resources. Review the opt-in control port and MCP path-access notes before enabling `--control`.

## Summary

- Single maintainer: 27 commits, all by "Brandon Thomas" (two e-mail identities, `<email>` and `<email>`). No external contributors, so no external diffs to read.
- The app contains **no outbound network code**. The only sockets are a loopback listener (opt-in `--control PORT`) and a `TcpStream` client in `cadcraft-cli mcp --connect HOST:PORT` (user-supplied address). No reqwest/ureq/hyper/rustls/openssl in `Cargo.lock`; `tokio` is present only as a `pin-project-lite`-only dependency of `wasm-bindgen-futures`.
- No `Command::new` in shipped app, CLI, MCP or library code. Only `xtask` spawns `cargo` and `git`.
- Main risk is by design: the control port (`apps/cadcraft/src/control_server.rs`) is **unauthenticated raw TCP on 127.0.0.1** and can read/write arbitrary file paths via `app.open`, `app.save`, `ui.render`, `ui.screenshot`, `engine.execute`. It is off by default. Because it is raw JSON-lines TCP with no Host/Origin concept, a browser page may be able to deliver commands to it (static reasoning, not tested). See CAD-01.
- MCP tool names, descriptions and server `instructions` are clean (no hidden instructions). Several tools take arbitrary filesystem paths (CAD-02).
- DWG is read through the third-party `acadrust` 0.6.1 crate (crates.io, checksum-pinned, not vendored, MPL-2.0). Its source was not available offline and was **not reviewed**. The bridge never resolves xrefs or external images (paths are discarded at parse time).
- Supply chain is clean: all 443 registry packages in `Cargo.lock` have checksums and come from crates.io; no `[patch]`, `git =`, or out-of-tree `path =`. Dependency set is the standard egui/wgpu/image stack plus `acadrust`, `rstar`, `naga`, `toml`, `miniz_oxide`, `muda` (macOS only).
- CI is hygienic (`permissions: contents: read`, secrets confined to a `release` environment, no `pull_request_target`), with minor unpinned-download notes that affect only the maintainers' release pipeline (CAD-03).

## Inventory

- Workspace (`Cargo.toml`): `members = ["crates/*", "apps/*", "xtask"]`, version 0.3.0, edition 2024, `rust-version = "1.90"`, `unsafe_code = "forbid"` workspace-wide. 16 workspace packages (459 lockfile packages total):
  - apps: `cadcraft` (GUI, bin `cadcraft`, default-run), `cadcraft-cli` (bin `cadcraft-cli`; includes the MCP server subcommand), `cadcraft-web` (eframe/wasm, built with trunk; not part of a native build).
  - crates (12): `geom, dxf, color, doc, constraints, fonts, render, io, engine, ui-egui, mcp, dwg`, plus `xtask`.
- Build scripts: `apps/cadcraft/build.rs`, `crates/ui-egui/build.rs` (both reviewed in full). Proc-macro crates in the workspace: none. Build-dependency: `winresource` 0.1 (Windows icon/version resource compile, runs `rc.exe`/`windres` as a dependency), `toml`, `serde_json`.
- `.cargo/config.toml`: only `[alias] xtask = "run --package xtask --"`. No `[env]`, linker, runner, rustflags or `[source]` replacement. No `rust-toolchain` file.
- Workflows: `.github/workflows/release.yml`, `.github/workflows/packaging-lint.yml`.
- Packaging: `packaging/windows/{package.ps1,sign.ps1,cadcraft.wxs}`, `packaging/linux/{package.sh,postinst.sh,nfpm.yaml,flatpak/*}`, `packaging/macos/{package.sh,import-cert.sh,Info.plist.in,entitlements.plist}`, `packaging/web/*`.
- Vendored code: none. Checked-in binaries: PNG/ICO/ICNS icons and brand images, plus `examples/apartment.dxf` (ASCII DXF, 7,726 lines). No PE/ELF/Mach-O, no wasm, no fonts.
- Plugins/scripting: none. The `script` command is AutoCAD `.scr`-style command text, not a language runtime.
- Agent instruction files: `AGENTS.md`, `CLAUDE.md` (they differ; see CAD-05).

## Network and data-egress map

| Location | Purpose | Trigger | Destination / bind | Data sent | Auth | Assessment |
|---|---|---|---|---|---|---|
| `apps/cadcraft/src/control_server.rs:14` `TcpListener::bind(("127.0.0.1", port))` | JSON-lines automation channel (the transport MCP wraps) | Only if `--control PORT` or env `CADCRAFT_CONTROL_PORT` is set | Listens on 127.0.0.1:PORT (loopback only, not 0.0.0.0) | Replies with drawing state, command output, screenshots on request | **None**; no Host/Origin check (raw TCP) | MEDIUM, see CAD-01. Expected feature, off by default |
| `crates/mcp/src/backend.rs:36` `TcpStream::connect_timeout(&sa, 800ms)` | MCP server bridging to the running app | `cadcraft-cli mcp --connect HOST:PORT` only | User-supplied HOST:PORT (docs use 127.0.0.1:7979) | MCP tool calls as JSON lines | None | Benign; client connects only where told. A non-loopback address would send commands in plaintext |
| `crates/ui-egui/src/dialogs.rs:115-116`, `credits.rs:259,282` `ui.hyperlink_to(...)` | About window links: getartcraft.com, discord.gg/artcraft, github.com/{login} | User click only (opens default browser via egui `links` -> `webbrowser`) | External sites in the user's browser | None sent by the app | n/a | INFO. No automatic fetch |
| `apps/cadcraft/src/native_menu.rs:62` `ctx.open_url(...discord.gg/artcraft)` | macOS Help menu item | User click, macOS only | Browser | None | n/a | INFO |
| `apps/cadcraft-web/Trunk.toml` `[serve] addresses=["127.0.0.1"] port=8771` | Dev server for the web build | Only when a developer runs `trunk serve` | Loopback | n/a | n/a | INFO |
| `apps/cadcraft-web/index.html` | Web build page | n/a | No `<script src>`, no external fetch (only inline CSS and the trunk-injected wasm) | None | n/a | OK |
| `packaging/windows/sign.ps1:77` `Invoke-WebRequest https://www.nuget.org/api/v2/package/Microsoft.Trusted.Signing.Client` | Download Azure signing dlib | Release CI only (maintainer pipeline), only when Azure secrets set | nuget.org | None | n/a | LOW, CAD-03 |
| `packaging/windows/sign.ps1:67,88` timestamp URLs (`http://timestamp.digicert.com`, `http://timestamp.acs.microsoft.com`) | Authenticode timestamping | Release CI only | DigiCert / Microsoft | Signature hash | n/a | Expected |
| `.github/workflows/release.yml:182,271,308`, `packaging-lint.yml:31`, `packaging/linux/package.sh:109` | Tool downloads in CI (nfpm, trunk, rustup, actionlint, appimagetool) | CI only | github.com releases, sh.rustup.rs | None | n/a | LOW, CAD-03 |
| Packaging metadata (`metainfo.xml.in:40`, `README.md` shields.io/raw.githubusercontent images, `cadcraft.wxs` ARP URLs) | Documentation / store metadata | Not executed by the app | n/a | n/a | n/a | INFO. The README image tags are loaded by GitHub or the viewer, not by the app |

No telemetry, analytics, crash upload, update check, license check, remote config, hostname/MAC/username fingerprinting or font/model download exists in the sources. An AppImage embeds `gh-releases-zsync|storytold|cadcraft|latest|...` update information, but that is read only by external tools (AppImageUpdate); the app itself never checks for updates.

## Findings

**CAD-01** · **MEDIUM** · Unauthenticated automation channel · `apps/cadcraft/src/control_server.rs:14,35-60`
Evidence: `TcpListener::bind(("127.0.0.1", port))` ... `for line in BufReader::new(read).lines()` ... `serde_json::from_str::<Value>(&line)` -> `ControlRequest::new(method, params)`.
- It is loopback-only and opt-in (`--control`, or `CADCRAFT_CONTROL_PORT` which could be set persistently in the environment), so it is not LAN-exposed. There is no token, and it is raw TCP rather than HTTP, so there is no Origin/Host check.
- Each line is parsed independently and bad lines only produce a `{"ok":false,"error":"bad JSON"}` reply, so the connection survives. Speculation (not tested): a malicious web page could fire a `fetch(..., {mode:'no-cors', method:'POST', body: '{...json...}\n'})` at `http://127.0.0.1:PORT/`; the HTTP request line and header lines would be rejected as bad JSON, but a newline-terminated body line would be executed. The browser could not read the reply (blind) but could trigger actions. Any local process or other local user can also connect.
- Reachable methods (`crates/ui-egui/src/control.rs:118-278`): `app.open {path}`, `app.save {path}`, `ui.render {path}`, `ui.screenshot {path}` (raw `std::fs::write(path, png)`, any extension, `control.rs:261`), `engine.execute` (wblock, plot, saveas, ...), `ui.key`, `ui.text`, `app.quit`. No method executes processes or reaches the network.
- Impact is limited to drawing manipulation, overwriting files the user can write with CADCraft-formatted content, and opening files into the app. No code-execution primitive was found.
Recommendation: only run with `--control` while an agent session is active, pick a non-guessable port, do not set `CADCRAFT_CONTROL_PORT` globally, and avoid browsing untrusted pages meanwhile. Upstream hardening: require a per-launch token and drop connections whose first line begins with an HTTP method.

**CAD-02** · **MEDIUM** · MCP tools with broad file access / agent-targeted risk · `crates/mcp/src/tools.rs:9-33`, `crates/mcp/src/backend.rs:168-176`, `crates/engine/src/cmd/file.rs:75-143`, `crates/engine/src/cmd/blocks.rs:190-231`, `crates/engine/src/cmd/layout.rs:746-774`
Evidence: tool `open` ("Open a DXF file", `path`), `save` ("Save the drawing (DXF; .svg/.png export by extension)"), `render` (`path` -> `std::fs::write(&path, &png)`), `screenshot {path}`, and `execute` which runs any engine command including `wblock {path}`, `saveas {path}`, `plot`/`exportpdf {path}`.
- Reads: `open` reads any path as a drawing (`std::fs::read(path)`); contents are only exposed if they parse as DXF/DWG, but the parse error text is returned.
- Writes: `save`/`saveas`/`wblock` are limited by `cadcraft_io::write` to `dxf, dwg, svg, png, pdf` or **no extension** (`crates/io/src/lib.rs:43-52`; dotfiles such as `.bashrc` or `.gitconfig` count as "no extension"). `plot`/`exportpdf` with `path` has **no extension check** and writes PDF bytes, and `render`/`ui.render`/`ui.screenshot` write PNG bytes to any path. `save`/`plot` write `{path}.cadcraft-tmp` then `rename`, silently replacing an existing file. No sandboxing, no path allow-list, no confirmation.
- Agent-targeted angle: drawing content (layer, block, text and MTEXT strings) flows verbatim back to the model through `inspect_drawing`/`query_entities`/`command_line` output. A hostile DXF/DWG opened by an agent could carry prompt-injection text, and the agent could then be steered into the path-writing tools.
- No hidden instructions or poisoning in the tool metadata (see MCP section).
Recommendation: keep per-call approval for `save`, `open`, `execute`, `render` (with `path`), and `screenshot`; only open drawings you trust; do not auto-approve the whole `mcp__cadcraft__*` namespace.

**CAD-03** · **LOW** · CI/CD supply chain (maintainer pipeline only; does not run on a user's machine) · `packaging/windows/sign.ps1:77`, `.github/workflows/release.yml:308`, `packaging/linux/package.sh:109`, `release.yml:76,79,125,128,184,185,263,266`
Evidence: `Invoke-WebRequest -Uri 'https://www.nuget.org/api/v2/package/Microsoft.Trusted.Signing.Client'` (unversioned, no hash, DLL then loaded by signtool in the signing job that holds Azure secrets); `curl -fsSL https://sh.rustup.rs | sh -s -- -y --profile minimal` (FreeBSD VM job, no secrets, not in the `release` environment); `appimagetool/releases/download/continuous/...` (unpinned, not verified); `dtolnay/rust-toolchain@stable` and `Swatinem/rust-cache@v2` are tag/branch refs, not SHAs (`vmactions/freebsd-vm` is SHA-pinned). Mitigations present: `permissions: contents: read`, signing secrets only in the `release` environment restricted to the `release` branch, no `pull_request_target`, `inputs.version` passed through env not interpolated into scripts.
Assessment: normal practice with minor pinning gaps; irrelevant to local builds.

**CAD-04** · **LOW** · Third-party binary-format parser · `crates/dwg/src/lib.rs:31-43`, `crates/dwg/Cargo.toml:13`, `Cargo.lock` `acadrust 0.6.1`
Evidence: `acadrust::DwgReader::from_stream(Cursor::new(data)).read()` wrapped in `catch_unwind`. Lock entry has crates.io `checksum`; dependencies are `anyhow, bitflags, byteorder, encoding_rs, flate2, foldhash, indexmap, itoa, memmap2, nom, once_cell, rayon, ryu, thiserror, web-time` (no network crates). The crate was **not read** (not vendored, offline, not in the local cargo cache). The bridge uses `from_stream` on in-memory bytes (the mmap path is not used), converts to DXF text, and then CADCraft's own DXF reader (which has a hostile-input test suite per CLAUDE.md) takes over.
External references: **not followed**. The DXF reader sets `Block.xref_path = Some(String::new())` for xref blocks (`crates/io/src/dxf_read.rs:895`) and `Image.path: String::new()` for IMAGE entities (`dxf_read.rs:301-302`); no code reads `xref_path` or loads images. No OLE, underlay, hyperlink or LISP/ARX loading exists in the sources.
Recommendation: open only trusted DWG files; a human may want to skim `acadrust` 0.6.1 (github.com/hakanaktt/acadrust) once for `std::fs`/`Command`/`TcpStream` use before approval.

**CAD-05** · **LOW / INFO** · Agent instruction files · `CLAUDE.md`, `AGENTS.md`
- `CLAUDE.md` tells an agent to read `plan/STATUS.md` (gitignored, local only), read `../../craftrules/AGENTS.md` (a sibling repo outside this checkout), "Commit after every feature arc that builds, and push to `main`", and not to stop and ask. `AGENTS.md` has the same text plus a "Contributor credits" section (lines ~50-67) telling agents to ask their human whether to add a `people.toml` entry and to run `python3 ../../craftrules/scripts/contributors.py ...` from outside the repo.
- No injection phrases (`ignore previous`, `do not tell`, `exfiltrat`, ...), no concealment, no exfiltration. The instructions are the maintainers' own workflow, but an autonomous agent started in this repo would follow them (push to main, run a script from a sibling repo). Treat as a note, not a vulnerability. A grep of the whole repo for injection phrases and hidden Unicode found nothing.

**CAD-06** · **INFO** · Installer footprint · `packaging/windows/cadcraft.wxs:51-55`
Per-machine MSI writes `HKLM\Software\Microsoft\Windows\CurrentVersion\App Paths\cadcraft.exe`, `Applications\cadcraft.exe\shell\open\command`, `.dxf`/`.dwg` `OpenWithProgids` (not default-app takeover) and a Start Menu shortcut. No custom actions, services, scheduled tasks, Run/RunOnce keys, firewall rules. Linux `postinst.sh` only refreshes desktop/MIME/icon caches. Flatpak finish-args: wayland/x11/ipc/dri, `xdg-documents`, `xdg-pictures`; **no network permission**. macOS entitlements empty.

## Build-time execution review

- `apps/cadcraft/build.rs`: on Windows only, `winresource::WindowsResource` embeds `assets/app-icon/cadcraft.ico` and version strings; fails the build only if `CADCRAFT_REQUIRE_WINRES` is set. Reads env `CARGO_CFG_TARGET_OS`, `CADCRAFT_REQUIRE_WINRES`, `CADCRAFT_BUILD_SHA` (the last for `rerun-if-env-changed`; the sha is read via `option_env!` in `main.rs:82`). No network, no process spawn in this file (winresource itself invokes the resource compiler).
- `crates/ui-egui/build.rs`: reads `contributors/contributors.json` and `contributors/people.toml`, writes `$OUT_DIR/credits.rs` (static tables for the About window). Only `OUT_DIR`/`CARGO_MANIFEST_DIR`. No network, no process.
- Proc-macro crates: none in the workspace (lock contains only standard ones like `serde_derive`, `wasm-bindgen-macro`, `thiserror-impl`, `zbus_macros`).
- `.cargo/config.toml`: alias `xtask` only.
- `xtask` (`main.rs`, `assets.rs`, `ico.rs`, `layers.rs`, `parity.rs`, `stats.rs`, `version.rs`; all read): spawns `cargo` (`fmt`, `clippy`, `test`, `check`, `metadata`, `run -q -p cadcraft-cli -- commands`) and `git ls-files`; reads/writes repo files (`Cargo.toml` version bump via temp file in `target/`, `docs/parity.md`, `.ico` output). `corpus --download` is a stub that prints a message; no network code. Only runs if the user types `cargo xtask ...`.

## Agent and MCP surface review

- Transport: MCP is JSON-RPC 2.0 over **stdio** (newline-delimited), protocol 2025-06-18, implemented by `crates/mcp` and launched as `cadcraft-cli mcp` (headless, in-process `Session`, no window) or `cadcraft-cli mcp --connect 127.0.0.1:PORT` (bridged to the running GUI started with `cadcraft --control PORT`; see CAD-01). The MCP process itself opens no listening socket.
- Server `instructions` text is plain drafting guidance ("CADCraft is a 2D/3D CAD drafting app ... Fastest path: command_line with AutoCAD syntax ..."), no hidden instructions.
- Tools (10 always, 3 more when bridged to the GUI): `command_line`, `script`, `execute`, `list_commands`, `inspect_drawing`, `query_entities`, `render`, `new_drawing`, `open`, `save`, `cancel`; with GUI: `screenshot`, `ui_inspect`, `ui_click`. Resources: `cadcraft://drawing`, `cadcraft://commands`. Descriptions and input schemas were read verbatim from `tools.rs`; none contain instructions to the model beyond usage; no `<IMPORTANT>`, no cross-tool directives, no data-sending instructions. Descriptions are static strings (no dynamic content from files).
- Capability risk: arbitrary-path read/write as detailed in CAD-02. No tool or command spawns processes, loads libraries, fetches URLs, or accesses the clipboard (the engine clipboard is in-memory). `screenshot` captures only the CADCraft window via egui, not the desktop.
- Control protocol also exposes `ui.key`/`ui.text` (synthetic input into the CADCraft window only) and `app.quit`.
- Docs (`docs/mcp.md`, `docs/control-protocol.md`) and README match the code; they describe the loopback bind accurately.

## Contributor and history review

- `git shortlog -sne HEAD`: 25 commits "Brandon Thomas <<email>>", 2 commits "Brandon Thomas <<email>>" (27 total, 27 commits since 2026-10-05; 2 tags `v0.1.0`, `v0.3.0`; branches `main`, `release`). 4 commits have GitHub (`noreply@github.com`) as committer (merged PRs). Contributors file credits one human (`echelon`) plus model "Claude Opus 5.5" for 17 of 18 commits (agent co-authorship is expected).
- External contributors: none. Every dependency-adding commit (`3e2155e` acadrust, `3da0219` rstar/naga/miniz_oxide/skrifa, `ef1b55d` toml, `e1f6b48`-`1d7ea87` CI runner changes) is by the maintainer. `git log` over `Cargo.toml` files shows no suspicious additions.
- History oddities checked: deletions of `.claude/worktrees/*` (stray agent worktree gitlinks, `5336475`), `.github/workflows/freebsd.yml` (folded into release.yml, `7d4ca28`), `about.rs`/`xtask/src/contributors.rs` (replaced by `build.rs` credits, `ef1b55d`). All benign.

## Coverage checklist

1. Inventory: workspace members, apps, bins, build.rs (2), xtask, `.cargo/config.toml`, workflows (2), packaging, checked-in binaries. Done; no vendored code, no PE/ELF, no proc-macros.
2. Network/data egress: grepped `std::net`, `TcpListener/Stream`, http(s) literals, reqwest/ureq/hyper/etc. Two sockets only (CAD-01 listener, `--connect` client); links open browser on click. No telemetry/updates.
3. Process execution: no `Command`/`ShellExecute`/`open::` in app/lib code; only xtask (`cargo`, `git`).
4. FS/OS abuse: no secret-path reads, no persistence, no hooks, no screen/clipboard/mic/camera, no unsafe (`forbid(unsafe_code)` in every crate), no `libloading` use in sources (only transitively via wgpu/ash/glutin). File writes are the user/agent-supplied paths in CAD-02. Font scan reads `C:\Windows\Fonts` (and macOS/Linux font dirs) and TTF/OTF files only, capped at 20,000 entries.
5. Obfuscation: Unicode bidi/zero-width grep over the entire tree: no matches. No long base64/hex literals (regex `[A-Za-z0-9+/]{120,}` found nothing outside `Cargo.lock`/svg). `include_bytes!` only for `cadcraft-256.png`. No `asm!`, `link_section`, `no_mangle`.
6. Build-time execution: both build.rs, xtask, config read in full; clean.
7. Supply chain: no `[patch]`/`[replace]`/`git =`/`registry =`; no non-crates.io `source`; 443/443 registry packages have checksums (16 workspace crates have none, as expected). Obscure-looking crates (`glifo`, `polycool`, `zcheapstr`, `fearless_simd`, `pxfm`, `core_detect`, `multiversion_no_op`, `simd_cesu8`) were traced to the vello/kurbo/zvariant/encoding_rs/image dependency trees. No typosquats seen. `acadrust` noted (CAD-04).
8. CI/CD and installers: see CAD-03 and CAD-06. No `pull_request_target`, no secrets echoed, signing confined to `release` environment.
9. Agent-targeted: MCP tools/instructions read; no poisoning. Injection-phrase grep of whole repo: no hits. Agent files noted in CAD-05.
10. Plugins/scripting: none (the `script` command is command-line text only; no LISP/ARX/DLL loading, no macros).
11. Git history/contributors: single maintainer, no external diffs needed.
12. Secrets: grep for `ghp_`, `github_pat_`, `xox[bp]-`, `AKIA`, `sk-`, `AIza`, `PRIVATE KEY`, `password =`, `api_key`: no matches (workflow secret *names* only).
13. Ordinary vulnerabilities: unauthenticated loopback control (CAD-01), path tools (CAD-02), hostile DWG parser (CAD-04). Document attack surface: DXF/DWG xrefs and IMAGE paths are parsed but never opened; no embedded scripts or auto-loaded code; recursion bounded (`MAX_BLOCK_DEPTH`), `catch_unwind` guard around command execution.

## Known-good patterns (for the automated scanner allowlist)

- `apps/cadcraft/src/control_server.rs:14` `TcpListener::bind(("127.0.0.1", port))`: opt-in loopback control channel; MCP client `crates/mcp/src/backend.rs:4,36` `TcpStream::connect_timeout` to a user-supplied address.
- `xtask/src/main.rs:66`, `xtask/src/parity.rs:29` `Command::new(env CARGO or "cargo")`, `xtask/src/assets.rs:27` `Command::new("git")`: dev tooling only.
- `packaging/windows/sign.ps1:66` `WriteAllBytes($pfx, FromBase64String($env:WINDOWS_CERTIFICATE))`: CI signing-cert materialisation in the release environment (temp dir, deleted in `finally`). `packaging/macos/import-cert.sh:26` same for Apple.
- `.github/workflows/release.yml:308` `curl ... sh.rustup.rs | sh` (FreeBSD VM job, no secrets), `release.yml:182,271`, `packaging-lint.yml:31` GitHub release downloads; `release.yml:341` `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}` (draft-release job, `contents: write` only there).
- `crates/ui-egui/src/dialogs.rs:115-116`, `credits.rs:259,282`, `apps/cadcraft/src/native_menu.rs:62`: hyperlinks to getartcraft.com, discord.gg/artcraft, github.com/{login}; user-click only.
- `crates/io/src/svg.rs:22` `http://www.w3.org/2000/svg` (XML namespace string); `LICENSE-APACHE`, `NOTICE`, `Cargo.toml:11` repository URL.
- `apps/cadcraft/src/main.rs:77` `include_bytes!("../../../assets/app-icon/cadcraft-256.png")` (window icon).
- `crates/fonts/src/ttf.rs:23-70`, `crates/ui-egui/src/theme.rs:90-116`: reads system font files only (`C:\Windows\Fonts`, `segoeui.ttf`, `arial.ttf`).
- `apps/cadcraft/build.rs`: winresource Windows resource embedding; `crates/ui-egui/build.rs`: writes `credits.rs` to `OUT_DIR` from `contributors/*.json|toml`.
- `contributors/contributors.json` and `people.toml`: contributor stats data (no secrets).
- `README.md:226-233` raw.githubusercontent.com icon `<img>` tags; `packaging/linux/ai.storyteller.cadcraft.metainfo.xml.in:40` screenshot URL.
- `docs/control-protocol.md` / `docs/mcp.md` mention of `127.0.0.1:7979`; `apps/cadcraft-web/Trunk.toml` `127.0.0.1:8771`.
- `Cargo.lock` `tokio 1.53.2` (only `pin-project-lite`; via `wasm-bindgen-futures`), `webbrowser` (via `egui-winit`, link clicks), `url`/`idna`/`form_urlencoded` (via `webbrowser`), `gethostname` (via `x11rb`, Linux), `libloading` (via wgpu/ash/glutin), `async-process`/`zbus` (Linux file dialogs via `rfd`).

## Setup facts (for the install and build scripts)

- Cargo packages and binaries: GUI = package `cadcraft` -> `cadcraft.exe` (default-run); CLI and MCP server = package `cadcraft-cli` -> `cadcraft-cli.exe` (the MCP server is the `mcp` subcommand; crate `cadcraft-mcp` is a library only); `cadcraft-web` is the wasm build (needs `trunk`, not needed on Windows desktop); `xtask` is dev tooling.
- Windows release build (what upstream's `package.ps1` uses, adding `--target`): `cargo build --release --locked -p cadcraft -p cadcraft-cli` -> `target\release\cadcraft.exe`, `target\release\cadcraft-cli.exe`. Optional, to avoid the VC++ redistributable (as upstream does): set env `CARGO_TARGET_X86_64_PC_WINDOWS_MSVC_RUSTFLAGS=-C target-feature=+crt-static` and build with `--target x86_64-pc-windows-msvc`. Cargo.lock is committed, so `--locked` works. Release profile is `lto = "thin"`, `codegen-units = 16`.
- Toolchain: Rust >= 1.90 (`rust-version = "1.90"`, edition 2024; stable toolchain, no `rust-toolchain` file).
- Launching the GUI: `cadcraft.exe [--sample] [--control PORT] [FILE.dxf|FILE.dwg ...]` (`CADCRAFT_CONTROL_PORT=PORT` is equivalent; `--version` prints version). Release builds use the Windows GUI subsystem, so there is no console and the bind message on stderr is invisible. The app writes no config or data directory and no persisted state (drawings only where the user saves them). `CADCRAFT_NO_NATIVE_MENU` and `CRAFT_FONTS_DIR` are optional/macOS/packaging knobs.
- MCP server:
  - Headless (no window; a fresh in-process drawing session): `cadcraft-cli.exe mcp` over stdio.
  - Bridged to the running GUI (watch the agent draw): start `cadcraft.exe --control 7979`, then `cadcraft-cli.exe mcp --connect 127.0.0.1:7979`.
  - Register with Claude Code, for example: `claude mcp add cadcraft -- D:\path\to\cadcraft-cli.exe mcp` (or add `--connect 127.0.0.1:7979` at the end). Equivalent JSON: `{"mcpServers":{"cadcraft":{"command":"cadcraft-cli","args":["mcp"]}}}`.
- Windows native prerequisites: MSVC build tools (C++ workload) and a Windows 10/11 SDK (`rc.exe` for `winresource`; `signtool` only for upstream signing); git is only needed for `xtask`. No cmake, nasm, clang or LLVM needed (no such `-sys` crates in `Cargo.lock`). A GPU with DX12/Vulkan is used by wgpu; a CPU renderer fallback exists for the canvas.
- Linux build packages (from `release.yml:179`): `libxkbcommon-dev libwayland-dev libx11-dev libxrandr-dev libxi-dev libgl1-mesa-dev` (the workflow also installs packaging tools `desktop-file-utils appstream python3-yaml zsync` and nfpm; not needed for a plain build). FreeBSD list in `release.yml:307` is not needed.
- Other notes: `cargo xtask ci` is a dev gate (fmt, clippy, test, assets, layers, wasm) and not needed for a user build. `packaging/windows/package.ps1` additionally needs WiX 5.0.2 (`dotnet tool install --global wix --version 5.0.2`) and produces an unsigned MSI/portable zip when no signing secrets are set. Control port and MCP are plaintext loopback; do not expose them (for Flatpak, network is intentionally not granted).
