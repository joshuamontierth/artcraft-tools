# wordcraft security review

- Commit reviewed: 7584b9b2930ffddfe7db96b6eba977262e55135c (2026-10-08 10:02:16 -0400, "Bump version to 0.3.0 (from 0.2.0) for release")
- Review type: read-only static review by AI agent, 2026-10-09
- Verdict: CLEAN WITH NOTES
- Build-gate recommendation: APPROVE. No telemetry, no outbound network code, no obfuscation, build scripts only write to `OUT_DIR`; the one external contributor's two commits are benign layout/UI fixes (plus one image-crate feature flag). Read the hyperlink and control-port notes before opening untrusted documents or enabling `--control`.

## Summary

- 30 commits: 28 by the maintainer "Brandon Thomas" (two e-mail identities) and 2 by external contributor **Sirsyorrz** (PRs #1 and #2, squash-merged via GitHub on 2026-10-08). Both diffs were read in full: layout fix, TIFF decoding via an `image` feature flag, opacity-layer workaround, and a style-gallery label clip. Nothing touches build, CI, network, process or MCP code (WC-06).
- The app has **no outbound network code**. The only sockets are an opt-in loopback listener (`--control PORT`) and a `TcpStream` client in `wordcraft-cli mcp --connect HOST:PORT`. No reqwest/ureq/hyper/rustls/openssl in the lockfile; `tokio` is present only as a `pin-project-lite`-only dependency of `wasm-bindgen-futures`.
- **Document attack surface is mostly well contained:** external image relationships (`TargetMode="External"`) are ignored (`media_for` returns `None` for external rels, `crates/docx/src/read/mod.rs:190`); only `r:embed` images are read; `settings.xml` rels (remote/attached templates) are never read; macros (`vbaProject.bin`) are dropped and `.docm`/`.dotm` are read as plain docx; OLE objects and DDE/INCLUDETEXT/INCLUDEPICTURE-style fields are not evaluated (field engine only does PAGE/NUMPAGES/SECTION/TITLE/AUTHOR/FILENAME); zip reading is bounded and in memory only.
- **Main document risk (WC-01):** Ctrl/Cmd+click on a hyperlink passes the raw link string from the document to the OS with no scheme allow-list or confirmation. `file:`, UNC and custom-protocol links from a hostile .docx/.odt/.rtf can be launched by a click.
- `review.readAloud` is the only code that spawns processes (Windows: `powershell -NoProfile -Command <constant script>` with the text piped on stdin; no shell injection). User-triggered.
- Control port and MCP are the same design as the sibling apps: unauthenticated loopback JSON-lines, with MCP tools that take arbitrary file paths (WC-02, WC-03). MCP tool metadata is clean (no poisoning). Document content flows back to the model verbatim (prompt-injection channel).
- Supply chain clean: 504 registry packages, all with checksums, all crates.io; no `git =`, `[patch]`, or out-of-tree paths. CI hygiene is good (SHA-pins in `windows-arm64.yml`/`freebsd.yml`, secrets confined to a `release` environment).

## Inventory

- Workspace: `members = ["crates/*", "apps/*", "xtask"]`, `default-members = ["crates/*", "apps/wordcraft", "apps/wordcraft-cli", "xtask"]`, version 0.3.0, edition 2024, `rust-version = "1.90"`, `unsafe_code = "forbid"`. 520 lockfile packages.
- Apps: `wordcraft` (egui desktop GUI, `default-run`), `wordcraft-cli` (`[[bin]] wordcraft-cli`, includes `mcp`), `wordcraft-web` (eframe/wasm via trunk, not part of a native build).
- Crates (12): `geom, doc, fonts, layout, docx, formats, render, pdf, proof, engine, mcp, ui-egui`, plus `xtask`.
- Build scripts (3, all read): `apps/wordcraft/build.rs`, `crates/fonts/build.rs`, `crates/ui-egui/build.rs`. Proc-macro crates in the workspace: none.
- `.cargo/config.toml`: only `[alias] xtask = "run --package xtask --"`. No rust-toolchain file.
- Workflows (4): `release.yml`, `packaging-lint.yml`, `windows-arm64.yml`, `freebsd.yml`.
- Packaging: `packaging/windows/{package.ps1,sign.ps1,wordcraft.wxs}`, `packaging/linux/*` (nfpm, AppImage, Flatpak, postinst), `packaging/macos/*`, `packaging/web/*`.
- Checked-in binaries/assets: 13 OFL fonts (`assets/fonts/*.ttf`, attributed in `ATTRIBUTION.md`, `include_bytes!` into the binary), hyphenation dictionary/patterns, PNG/ICO/ICNS/SVG icons and brand images, doc screenshots. No PE/ELF/Mach-O/wasm, no .docx/.rtf/.odt sample files (test fixtures are generated in code).
- Vendored code: none. Plugins/scripting: none (the "macros" feature records command steps in the session; no scripting runtime).
- Dev-only dependencies: `hayro-*` (PDF parsing for tests) in `crates/pdf` `[dev-dependencies]`.
- Agent files: `AGENTS.md`, `CLAUDE.md`.

## Network and data-egress map

| Location | Purpose | Trigger | Destination / bind | Data sent | Auth | Assessment |
|---|---|---|---|---|---|---|
| `apps/wordcraft/src/control_server.rs:14` `TcpListener::bind(("127.0.0.1", port))` | JSON-lines automation channel (MCP bridge) | Only with `--control PORT` or env `WORDCRAFT_CONTROL_PORT` | 127.0.0.1:PORT, loopback only | Replies with document state, command results, screenshots | None; raw TCP so no Host/Origin check | MEDIUM, WC-02 |
| `crates/mcp/src/backend.rs:43` `TcpStream::connect_timeout(&sa, 800ms)` | MCP server to running app | Only `wordcraft-cli mcp --connect HOST:PORT` | User-supplied address (docs: 127.0.0.1:7981) | MCP tool calls | None | Benign client |
| `crates/ui-egui/src/lib.rs:385-387` `ctx.open_url(OpenUrl::new_tab(url))`, set at `canvas.rs:518` | Follow a hyperlink in the document | Ctrl/Cmd+click on a link run (also reachable by MCP `click {cmd:true}`) | **Whatever string the document holds** (any scheme) via OS handler (egui `links` -> `webbrowser`) | None sent by the app | n/a | MEDIUM, WC-01 |
| `crates/ui-egui/src/lib.rs:241-244` (`ui.discord`), `dialogs.rs:726-728`, `credits.rs:259,282` `hyperlink_to` | Community/About links: discord.gg/artcraft, getartcraft.com, github.com/storytold/wordcraft, github.com/{login} | User click on the title-bar button / About window | Browser | None | n/a | INFO. Title-bar "community" button is on by default (`show_discord: true`, toggle in Backstage); never auto-opens |
| `crates/docx/src/package.rs:115-117` | Reads `TargetMode="External"` rels | On open | **No fetch**: external targets are kept only as hyperlink strings; external images ignored | none | n/a | OK |
| `apps/wordcraft-web/Trunk.toml` serve `127.0.0.1` | Dev server for web build | Developer runs `trunk serve` | Loopback | none | n/a | INFO |
| `xtask/src/main.rs:202,226-231` `curl http://www.schaik.com/pngsuite/PngSuite-2017jul19.tgz` + `tar` | Test corpus download | Only if a developer runs `cargo xtask corpus --download` | www.schaik.com over **plain HTTP**, no hash | none | n/a | LOW, WC-05 |
| `packaging/windows/sign.ps1:77` nuget.org download; `release.yml:206,304,351`, `freebsd.yml:49`, `packaging-lint.yml:31` | CI tool downloads | Release/CI only | github.com, nuget.org, sh.rustup.rs | none | n/a | LOW, WC-05 |
| `release.yml:196-199`, `freebsd.yml:27-31` | CI checks out `storytold/craft-fonts` at pinned SHA `abb83316d96aa59c1cf64784289e378fe9fa5695` | CI only | github.com | none | n/a | INFO (SHA-pinned) |
| `crates/pdf/src/lib.rs:12`, `crates/formats/src/html.rs:1120`, `odt.rs:223` | Export hyperlinks as PDF link annotations / `<a href>` / `xlink:href` | On export | none (data written into the file) | n/a | n/a | INFO |

No telemetry, analytics, crash upload, update check, license check, remote config, fingerprinting, or model/font/asset download exists in the sources. System fonts are read from local font directories only (`C:\Windows\Fonts`, `%LOCALAPPDATA%` fonts; files over 40 MB skipped, `crates/fonts/src/fontdb.rs:837`).

## Findings

**WC-01** · **MEDIUM** · Document attack surface: hyperlink follow with no scheme filtering · `crates/ui-egui/src/canvas.rs:511-519`, `crates/ui-egui/src/lib.rs:385-387`, `crates/docx/src/read/story.rs:266-275`
Evidence: `// Ctrl/⌘+click follows a hyperlink.` ... `app.canvas.open_url = Some(link);` then `ctx.open_url(egui::OpenUrl::new_tab(url));`. The link comes from `w:hyperlink r:id` (`rels.by_id(id)...target.clone()`, the `external` flag is ignored), ODT `xlink:href` (`crates/formats/src/odt.rs:1085`), RTF `HYPERLINK` fields, Markdown links and HTML `href`; only HTML import strips `javascript:` (`html.rs:936`).
- A hostile document can carry `file:///...`, `\\host\share\file.exe`, or a custom protocol handler URI. One Ctrl+click hands it to the OS. There is no confirmation, no Protected-View-style prompt, and no allow-list (http/https/mailto).
- Speculation: egui-winit's `links` feature calls the `webbrowser` crate; I did not read its source (not vendored/offline). On Windows I expect non-http URLs to go to the shell unless the crate's `hardened` feature is on (not enabled here: `eframe` features are `default_fonts, wgpu, accesskit, wayland, x11, links`).
- Agent angle: MCP `click {x, y, cmd:true}` on a link position triggers the same path.
Recommendation: do not Ctrl+click links in untrusted documents; do not let an agent `click` with `cmd:true` in untrusted documents. Upstream fix: allow only `http`, `https`, `mailto` and ask before opening.

**WC-02** · **MEDIUM** · Unauthenticated automation channel · `apps/wordcraft/src/control_server.rs:14,32-60`, `crates/ui-egui/src/control.rs:102-218`
Evidence: `TcpListener::bind(("127.0.0.1", port))`, one JSON request per line; fallback arm `other => app.run(other, p.clone())` runs **any** command id.
- Loopback-only and opt-in (`--control` or `WORDCRAFT_CONTROL_PORT`; a persistent env var would silently enable it). No token; raw TCP, so no Origin/Host check. Speculation (not tested): a web page can POST a newline-terminated JSON body at the port; the HTTP request line and headers fail as "bad JSON" without closing the connection and the body line would execute (blind, reply unreadable). Any local process or user can also connect.
- Reachable: all 270+ commands, including path-taking ones: `file.open`, `file.save`/`saveAs` (extensions limited to docx/pdf/txt/md/html/rtf/odt/png/json, written via temp file + rename, replacing existing files), `file.exportPng {path}` (writes PNG bytes to **any** path/extension, `crates/engine/src/cmd/file.rs:139-149`), `ui.screenshot {path}`, `ui.render {path}`. No command executes a process other than Read Aloud (WC-04) or reaches the network.
Recommendation: same as CAD-01: only start with `--control` while an agent is working, do not set the env var globally, avoid browsing untrusted pages meanwhile. Upstream: per-launch token and reject lines that start with an HTTP method.

**WC-03** · **MEDIUM** · MCP tools with broad file access; prompt-injection channel · `crates/mcp/src/tools.rs:80-93,182-220`, `crates/engine/src/cmd/mailings.rs:212-218`, `crates/engine/src/cmd/insert.rs:197-201`, `crates/engine/src/cmd/objects.rs:138-141`
Evidence: `open_document {path}`, `save_document {path}`, `execute`/`batch` (any command), and e.g. `std::fs::read(path)` in `mailings.recipients {path}`, `insert.picture {path}`, `picture.change {path}`.
- `mailings.recipients {path}` reads **any file regardless of extension** as CSV (`decode_text`), returns the first line as `fields` and merges rows into the mail-merge preview, so it is a general arbitrary-text-file read primitive visible to the model (not extension-gated like `file.open`). Picture commands read any file but only keep it if it decodes as an image.
- `file.open` is limited to docx/docm/dotx/odt/rtf/html/md/txt/json by extension (`crates/engine/src/io.rs:6,16-26`); saves limited to the list in WC-02 plus the unrestricted `file.exportPng`.
- Every field of the document (body text, headers/footers, comments, tracked-change text, alt text, document properties, `recent` file paths in `ui.inspect`) is returned verbatim by `get_text`/`inspect_document`, so a hostile document can inject instructions into the agent, and the agent then has the file tools above.
- Tool annotations: `readOnlyHint` is `true` for `render_page`/`screenshot` although they write a temp PNG (`wordcraft-mcp-page.png`, `wordcraft-mcp-shot.png` in the temp dir); harmless.
Recommendation: keep per-call approval for `execute`, `batch`, `open_document`, `save_document`; open only documents you trust; do not auto-approve the whole `mcp__wordcraft__*` namespace.

**WC-04** · **LOW** · Process execution · `crates/engine/src/cmd/tools.rs:781-826` (`review.readAloud`)
Evidence (Windows): `Command::new("powershell").args(["-NoProfile", "-Command", &script]).stdin(Stdio::piped())` with constant script `Add-Type -AssemblyName System.Speech; (New-Object System.Speech.Synthesis.SpeechSynthesizer).Speak([Console]::In.ReadToEnd())`, and the document text (first 20,000 chars) written to stdin. macOS `say <text>`; Linux `spd-say`/`espeak` with the text as one argv entry (no shell).
Assessment: user/agent-triggered only, on Windows the text is data (stdin), not code. On macOS/Linux a text starting with `-` may be parsed as an option (speculation; no shell, low impact). Not a finding for the Windows build beyond "this feature launches PowerShell and reads aloud".

**WC-05** · **LOW** · Dev/CI download hygiene · `xtask/src/main.rs:202,226-231`, `packaging/windows/sign.ps1:77`, `release.yml:351`, `freebsd.yml:49`, `release.yml:206,304`, `packaging/linux/package.sh` (appimagetool `continuous`)
`cargo xtask corpus --download` fetches PngSuite over `http://` with no checksum; `sign.ps1` downloads `Microsoft.Trusted.Signing.Client` from nuget.org unpinned and loads its DLL in the (secret-holding) release signing job; rustup `curl | sh` in FreeBSD VM jobs; `dtolnay/rust-toolchain@stable`/`Swatinem/rust-cache@v2` unpinned in `release.yml` (but SHA-pinned in `windows-arm64.yml`). Mitigations: `permissions: contents: read`, signing secrets only in the `release` environment, no `pull_request_target`. None run on a user's machine unless they call `xtask corpus --download`.

**WC-06** · **INFO** · External contributor review (see History section): commits `a9ce05d` and `05d0b41`. One flag: `image` features gained `"tiff"` (`Cargo.toml:45`), enabling the `tiff` decoder (already resolved in `Cargo.lock` via `image`, so no lockfile change). It widens the image-decoder surface applied to pictures embedded in untrusted documents (pure Rust, memory-safe; crash/DoS risk only). The commit message ("decode tiff pictures") matches the diff.

**WC-07** · **INFO** · Agent instruction files and stray references · `CLAUDE.md`, `AGENTS.md`, `packaging/windows/wordcraft.wxs:7-9`
`CLAUDE.md` tells agents to read `plan/STATUS.md` (gitignored), read `../../craftrules/AGENTS.md` (outside the checkout), commit after each arc and not to stop and ask unless it is the owner's decision (licensing, publishing, pushing to new remotes, secrets). No injection phrases (whole-repo grep found none), no concealment. Note for owners running an autonomous agent here. The `.wxs` header comment still mentions `.pcraft`/PSD (template copied from another app); the MSI itself writes only an App Paths registry value and a Start Menu shortcut.

## Build-time execution review

- `apps/wordcraft/build.rs`: Windows only, `winresource` embeds `assets/app-icon/wordcraft.ico` plus version strings (`ProductName`, `CompanyName = "Learning Machines LLC"`, ...); only fails if `WORDCRAFT_REQUIRE_WINRES` is set. Env read: `CARGO_CFG_TARGET_OS`, `WORDCRAFT_REQUIRE_WINRES`. No network, no spawn in this file (the `winresource` dependency invokes the resource compiler).
- `crates/fonts/build.rs`: if `CRAFT_FONTS_DIR` is set, reads `fonts/manifest.txt` from that local checkout and generates `$OUT_DIR/craft_fonts.rs` with `include_bytes!` of the listed files (paths canonicalized, no network); otherwise generates an empty table. Env read: `CRAFT_FONTS_DIR`, `CRAFT_FONTS_REQUIRED`, `CARGO_CFG_TARGET_ARCH`, `OUT_DIR`. Optional input; a Windows build without it is fine.
- `crates/ui-egui/build.rs`: reads `contributors/contributors.json` and `contributors/people.toml`, writes `$OUT_DIR/credits.rs` (About-window tables). No network or spawn.
- Proc-macros: none in the workspace. `.cargo/config.toml`: alias only.
- `xtask` (`main.rs`, `assets.rs`, `ico.rs`, `layers.rs`, `parity.rs`, `stats.rs`, `version.rs`; read): spawns `cargo` (fmt/clippy/test/check/metadata), `git ls-files`, and (only `corpus --download`) `curl` and `tar`. Writes `docs/parity.md`, `.ico` output, a temp file in `target/` for `version set`. Runs only when someone types `cargo xtask ...`.

## Agent and MCP surface review

- Transport: MCP is JSON-RPC 2.0 over stdio, protocol 2025-06-18 (`crates/mcp/src/server.rs`), launched as `wordcraft-cli mcp` (headless, in-process session) or `wordcraft-cli mcp --connect 127.0.0.1:PORT` (drives the running GUI started with `wordcraft --control PORT`; see WC-02). Docs register it with `claude mcp add wordcraft -- wordcraft-cli mcp`. The MCP process opens no listening socket.
- Server `instructions`: drafting guidance, plus a line `Community: https://discord.gg/artcraft · https://getartcraft.com/apps/wordcraft · https://github.com/storytold/wordcraft` appended at `server.rs:138`. This is a promotional link inside model-visible text; it contains no instruction.
- Tools (15): `list_commands`, `execute`, `batch`, `new_document`, `open_document`, `save_document`, `type_text`, `select_text`, `get_text`, `inspect_document`, `render_page`, `parity`, and GUI-only `screenshot`, `click`, `key`, `ui_inspect`. Resources: `wordcraft://document`, `wordcraft://commands`. All descriptions and schemas were read verbatim from `tools.rs:47-147`: plain usage text, no hidden instructions, no `<IMPORTANT>` blocks, no cross-tool directives, no data-sending instructions.
- Capability risks: arbitrary-path file operations via `execute`/`batch` (WC-03); `click`/`key` on the GUI (Ctrl+click link follow, WC-01); no tool spawns processes except by invoking `review.readAloud` (WC-04); no tool fetches URLs. `screenshot` captures only the WordCraft window (egui viewport), not the desktop.
- Prompt-injection: all document content (including comments and properties) is returned to the model verbatim; treat documents from outside as hostile when an agent is connected.

## Contributor and history review

- `git shortlog -sne HEAD`: Brandon Thomas `<email>` 26, Brandon Thomas `<email>` 2, Sirsyorrz `<email>` 2 (30 commits since 2026-10-05; tags `v0.1.0`, `v0.3.0`; branches `main`, `release`). The maintainer commits are the architecture/feature arcs; two commits are GitHub-merged PRs (`#1`, `#2`, committer `noreply@github.com`).
- External contributor **Sirsyorrz** (first and only activity: two PRs on 2026-10-08, i.e. the day before this review; GitHub-identity, so a new account contributing UI work):
  - `a9ce05d` "fix first-page header layout and tiff header images (#1)": `Cargo.toml` (`image` + `"tiff"` feature), `crates/layout/src/lib.rs` (`body_top_for` takes a header id; first-page header pushes body down), `crates/layout/src/tests.rs` (+1 test), `crates/render/src/lib.rs` (fade images through `push_opacity_layer` instead of sampler alpha; + test). Message matches diff. **OK** (see WC-06 for the feature flag).
  - `05d0b41` "truncate style gallery labels and keep hanging previews in view (#2)": `crates/ui-egui/src/previews.rs` only (clip rect, truncated label galley, hanging indent calc). **OK**.
  - No build.rs, CI, scripts, network, process, fs or MCP changes; no binaries; no `Cargo.lock` change.
- Maintainer risky-surface commits spot-checked: `7b4a526` (release pipeline adapted from DesignCraft), `906d4fa` (contributor credits `build.rs`, `toml` dependency), `435194f` (CLI, MCP server, xtask): consistent with their messages. Dependency additions were by the maintainer (`krilla`, `hayro-*` dev-deps, `zip`, `quick-xml`, `winresource`, `toml`, `miniz_oxide`).
- Deleted files: none notable.

## Coverage checklist

1. Inventory: workspace, apps, bins, 3 build.rs, xtask, 4 workflows, packaging, binaries (fonts/icons only). Done.
2. Network/data egress: `std::net`, http(s) literals, reqwest/ureq/hyper/tokio net: only the loopback listener, `--connect` client and user-click links. No telemetry or update checks.
3. Process execution: only `review.readAloud` (powershell/say/spd-say/espeak) and xtask (`cargo`, `git`, `curl`, `tar`).
4. FS/OS abuse: no secret-path reads, persistence, hooks, screen/clipboard/mic/camera; `unsafe_code = "forbid"`. The only config written: `%APPDATA%\WordCraft\ui.json` (UI flags and recent files). `arboard` is a workspace dependency but not used in code (no clipboard calls found).
5. Obfuscation: Unicode bidi/zero-width grep over the whole tree: no hits. No long base64/hex strings (regex `[A-Za-z0-9+/]{150,}` over tracked files except lock/svg/hyphenation: none). `include_bytes!` only for bundled OFL fonts, icons and hyphenation data.
6. Build-time execution: all 3 build.rs, xtask and config read; clean.
7. Supply chain: 504 registry packages with checksums, no non-crates.io source, no `[patch]`/`[replace]`/`git =`. Network-capable crates: none beyond `webbrowser`/`url` (via `egui-winit`, link clicks), `zbus`/`async-process` (Linux dialogs via `rfd`), `tokio` (wasm only, sync feature). No typosquats seen.
8. CI/CD and installers: no `pull_request_target`; signing in a protected `release` environment; MSI has no custom actions (App Paths registry value + Start Menu shortcut); Linux `postinst.sh` refreshes caches only; Flatpak `finish-args` grant no network (see Setup facts). Notes in WC-05.
9. Agent-targeted: MCP tools/instructions read verbatim, clean; injection-phrase grep of the repo: none; document-content injection channel noted (WC-03).
10. Plugins/scripting: none.
11. Git history/contributors: external contributor diffs read in full (WC-06).
12. Secrets: grep for `ghp_`, `github_pat_`, `xox[bp]-`, `AKIA`, `sk-`, `AIza`, `PRIVATE KEY`, `password =`, `api_key`: none (workflow secret names only).
13. Ordinary vulnerabilities / document attack surface: **.docx remote templates**: not fetched (settings rels unread). **Externally linked images**: ignored (`media_for`, `r:embed` only; `r:link` unused). **Macros**: dropped (`vbaProject` never read or written; `.docm` read as docx and re-saved as docx). **OLE/DDE/fields**: `w:object` handled only as a VML image; field codes are display-only. **Hyperlinks**: see WC-01. Zip bounds: entry count, per-part and total decompressed size limits (`package.rs:49-88`), parts held in memory, no extraction to disk. XML depth bounded (`MAX_DEPTH`). Open size limit 2 GB.

## Known-good patterns (for the automated scanner allowlist)

- `apps/wordcraft/src/control_server.rs:14` `TcpListener::bind(("127.0.0.1", port))`: opt-in loopback control channel. `crates/mcp/src/backend.rs:4,43` `TcpStream::connect_timeout`: MCP `--connect` client to a user-supplied address.
- `crates/engine/src/cmd/tools.rs:799,807,817,820` `Command::new("say"|"powershell"|"spd-say"|"espeak")`: Read Aloud; powershell script is a constant and text goes via stdin.
- `xtask/src/main.rs:66`, `xtask/src/parity.rs` `Command::new(env CARGO or "cargo")`; `xtask/src/assets.rs:27` `Command::new("git")`; `xtask/src/main.rs:226,229` `curl`/`tar` for `corpus --download` with `http://www.schaik.com/pngsuite/PngSuite-2017jul19.tgz` (dev only).
- `crates/ui-egui/src/lib.rs:243`, `dialogs.rs:726-728`, `credits.rs:259,282`: links to discord.gg/artcraft, getartcraft.com/apps/wordcraft, github.com/storytold/wordcraft, github.com/{login}; user click only. `crates/mcp/src/server.rs:138` community URLs in the instructions string.
- `crates/docx/src/package.rs:18-40` and many docx/test fixtures: `schemas.openxmlformats.org`, `schemas.microsoft.com`, `purl.org`, `purl.oclc.org`, `www.w3.org`, `x.org` namespace/relationship URLs (XML namespaces, not network targets).
- `packaging/windows/sign.ps1:66` `WriteAllBytes($pfx, FromBase64String($env:WINDOWS_CERTIFICATE))`; `:67,88` timestamp servers `http://timestamp.digicert.com`, `http://timestamp.acs.microsoft.com`; `:77` nuget.org download: release-environment signing only.
- `.github/workflows/release.yml:206,304,351`, `freebsd.yml:49` (`curl ... sh.rustup.rs | sh` in a FreeBSD VM job), `packaging-lint.yml:31`; `release.yml:383` `GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`; `release.yml`/`freebsd.yml` checkout of `storytold/craft-fonts` pinned to `abb83316d96aa59c1cf64784289e378fe9fa5695`.
- `apps/wordcraft/build.rs` (winresource), `crates/fonts/build.rs` (reads `CRAFT_FONTS_DIR` manifest, writes `OUT_DIR/craft_fonts.rs`), `crates/ui-egui/build.rs` (credits tables).
- `include_bytes!` of `assets/fonts/*.ttf` (`crates/fonts/src/fontdb.rs:25-37`, `crates/ui-egui/src/theme.rs:132-136`), `assets/app-icon/*.png`, `assets/hyphenation/en-us.{dic,pat}` (`crates/proof/src/hyphen.rs:22-23`).
- `crates/fonts/src/fontdb.rs:344-362,641-678` system font directory scan (`HOME`, `WINDIR`, `LOCALAPPDATA`), `apps/wordcraft/src/main.rs:36-75` `%APPDATA%\WordCraft\ui.json` prefs read/write (`WORDCRAFT_NO_PREFS` disables).
- Test fixtures: `crates/docx/tests/*.rs` hand-written XML with `https://example.org/` hyperlink targets; `crates/formats/src/rtf.rs:1386` `HYPERLINK "http://a.b"`; `crates/formats/src/tests.rs` `data:image/png;base64,` assertions.
- `Cargo.lock`: `tokio` (only `pin-project-lite`; via `wasm-bindgen-futures`), `webbrowser`/`url`/`idna` (via `egui-winit` links feature), `zbus`/`async-process` (Linux file dialogs), `libloading` (wgpu/ash/glutin), `hayro-*` (dev-dependencies of `crates/pdf`).

## Setup facts (for the install and build scripts)

- Cargo packages and binaries: GUI = package `wordcraft` -> `wordcraft.exe` (default-run); CLI and MCP server = package `wordcraft-cli` -> `wordcraft-cli.exe` (MCP is the `mcp` subcommand; `wordcraft-mcp` is a library crate); `wordcraft-web` is the wasm build (needs `trunk`, skip on Windows desktop); `xtask` is dev tooling.
- Windows release build: `cargo build --release --locked -p wordcraft -p wordcraft-cli` -> `target\release\wordcraft.exe`, `target\release\wordcraft-cli.exe`. Upstream additionally builds with `--target x86_64-pc-windows-msvc` and `CARGO_TARGET_X86_64_PC_WINDOWS_MSVC_RUSTFLAGS=-C target-feature=+crt-static` (no VC++ redistributable) and `WORDCRAFT_REQUIRE_WINRES=1`. Cargo.lock is committed; `--locked` works. Release profile: thin LTO, `codegen-units = 16`. Rust >= 1.90, edition 2024.
- Launch the GUI: `wordcraft.exe [--sample] [--control PORT] [FILE ...]` (also `WORDCRAFT_CONTROL_PORT=PORT`; `--version`). Release builds use the Windows GUI subsystem (no console). Config: `%APPDATA%\WordCraft\ui.json` (tab, dark mode, recent files, community-button flag); set `WORDCRAFT_NO_PREFS=1` to avoid reading/writing it. Documents are only written where the user saves them. `CRAFT_FONTS_DIR` (optional build input: extra CJK fonts from `storytold/craft-fonts`) is not needed; bundled OFL fonts and installed system fonts are used.
- MCP server: headless (own in-process document, no window) `wordcraft-cli.exe mcp` over stdio; bridged to the running app (shows edits live, enables `screenshot`/`click`/`key`): start `wordcraft.exe --control 7981` then `wordcraft-cli.exe mcp --connect 127.0.0.1:7981`. Register with Claude Code, for example: `claude mcp add wordcraft -- D:\path\to\wordcraft-cli.exe mcp` (optionally append `--connect 127.0.0.1:7981`).
- CLI: `wordcraft-cli convert in.docx out.pdf`, `info`, `text`, `inspect`, `render <file> <out.png>`, `run --cmd 'id={json}'`, `commands`, `parity`.
- Windows native prerequisites: MSVC build tools (C++ workload) and the Windows SDK (`rc.exe` for `winresource`); git only for `xtask`. No cmake, nasm or clang needed for the Windows build (none of the lock's `-sys` crates require them; `cmake` appears in the FreeBSD CI list only). A GPU with DX12/Vulkan for wgpu (CPU raster fallback exists for pages via `vello_cpu`).
- Linux build packages (from `release.yml:201-205`): `libxkbcommon-dev libwayland-dev libx11-dev libxrandr-dev libxi-dev libgl1-mesa-dev` (packaging extras: `desktop-file-utils appstream python3-yaml zsync`, nfpm).
- Other notes: MSI build needs WiX 5.0.2 (`dotnet tool install --global wix --version 5.0.2`) and produces unsigned output when no signing secrets are set. Flatpak manifests deliberately omit `--share=network` (control port stays inside the sandbox). Do not expose the control port; treat opened documents as untrusted when an agent is attached.
