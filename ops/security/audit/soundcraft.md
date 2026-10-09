# soundcraft security review

- Commit reviewed: eac0edd896cd6bdf27c0cdd0f9f9158c8956248a (2026-10-09 09:20:50 -0400, "Merge pull request #12 from XusBadia/dmg-background")
- Review type: read-only static review by AI agent, 2026-10-09
- Verdict: CLEAN WITH NOTES
- Build-gate recommendation: APPROVE. The one blocking scanner finding (DECODE_THEN_RUN, `crates/ui-egui/src/video_track.rs:130`) is a false positive: a worker thread named "video-decode" runs a local job loop. The app has no outbound network code, the build scripts only write to `OUT_DIR`, and the one external PR changes macOS DMG packaging only. Read the control-port, MCP file-access and microphone notes below.

## Summary

- **Blocking finding SND-00 is a false positive.** `std::thread::Builder::new().name("video-decode".into()).spawn(move || run(&s2, &tx, &ctx))` starts the in-process video-frame decoding thread. `run` is the local fn at `video_track.rs:177-214`: it pops `Job::Frame`/`Job::Thumb` from a queue, calls the safe-Rust H.264/ProRes decoder in `crates/video`, and sends frames back on a channel. Nothing is decoded and then executed. The maintainer added it in `cdefc57` (2026-10-06, "Video track, Audio Unit hosting, ...").
- **No outbound network code.** The only sockets are the opt-in loopback control listener (`127.0.0.1`, `--control PORT`) and the MCP `--connect` TCP client. The lockfile has no reqwest/ureq/hyper/rustls/openssl. `tokio` depends only on `pin-project-lite` (via `wasm-bindgen-futures`). `webbrowser`/`url` come from `egui-winit` (About-window links, opened on click only).
- **Microphone (SND-03):** cpal opens the default input device only when a track is record-armed or input-monitored (`crates/ui-egui/src/lib.rs:713-718`, `start_recording` at `:342`). Samples go to an in-memory monitor ring and, only while armed, to a take that becomes a clip in the session. Nothing is written to disk until the user saves (or autosave copies a modified session to the local Autosave folder), and nothing is sent anywhere. One caveat: `record_arm`/`input_monitor` are saved in `.scraft` files (`crates/model/src/mixer.rs:495-497`), so opening a session with an armed track opens the input device without a further click. That matches how Pro Tools behaves.
- **Control port and MCP (SND-01, SND-02):** this is the same design as the sibling apps. The control channel is unauthenticated loopback JSON-lines that runs any engine command. The MCP tools pass arbitrary file paths to commands that write files anywhere (`session.save_template`, `file.export_session_text`, `file.bounce_mix`, `file.export_midi`, `ui.screenshot {path}`). Reads parse the file as audio, MIDI, video or JSON, so the model never gets raw file contents back. The MCP tool descriptions and server instructions were read verbatim and contain no poisoning.
- **Plugin hosting (SND-04):** CLAP and VST3 binaries (and AU on macOS) are loaded in-process with `libloading`. This is native third-party code by design. Plugins are resolved by id against the standard OS plugin folders plus `CLAP_PATH`/`VST3_PATH`. `add_search_dir` is called only from tests, so a session file cannot point the app at a binary of its choosing.
- **Supply chain is clean:** 498 registry packages, all from crates.io and all with checksums. There are no `git =`, `[patch]`, `[replace]` or out-of-tree `path` entries. Every dependency change in history was made by the maintainer.
- **Contributors:** 58 commits by the maintainer Brandon Thomas (two e-mail addresses) and 1 by external contributor Xus Badia (PR #12, merged at HEAD). That PR adds macOS DMG layout assets plus a generator script and makes a 7-line change to `packaging/macos/package.sh`. It is benign and is not built or run by a Windows/Linux `cargo build`.

## Inventory

- Workspace: `members = ["crates/*", "apps/*", "xtask"]`, version 0.3.0, edition 2024, `rust-version = "1.90"`, workspace lint `unsafe_code = "forbid"`. The exceptions are the FFI crates `clap-host`, `vst3-host` and `au-host` (unsafe only in `src/ffi.rs`, per AGENTS.md). 316 tracked files, 59 commits since 2026-10-05.
- Apps: `soundcraft` (egui GUI), `soundcraft-cli` (CLI plus `mcp` subcommand), `soundcraft-web` (wasm).
- Crates (14): `time, audio-io, midi, video, dsp, clap-host, vst3-host, au-host, model, mix, engine, playback, automation, ui-egui`, plus `xtask`.
- Build scripts (2, both read): `apps/soundcraft/build.rs`, `crates/ui-egui/build.rs`. Proc-macro crates in the workspace: none. `.cargo/config.toml` has an alias only. No rust-toolchain, `.mcp.json`, `.claude/`, `.vscode/tasks.json`, `.envrc` or submodules.
- Test fixtures: `crates/clap-host/tests/fixture` and `crates/vst3-host/tests/fixture` are small cdylib plugin crates with their own Cargo.lock files (registry only). Tests build them with `cargo`; this happens only under `cargo test`.
- Workflows (4): `release.yml`, `packaging-lint.yml`, `windows-arm64.yml`, `freebsd.yml`.
- Packaging: Windows (`package.ps1`, `sign.ps1`, `soundcraft.wxs`), Linux (nfpm, AppImage, Flatpak, `postinst.sh`), macOS (`package.sh`, `Info.plist.in`, entitlements, `dmg/`), FreeBSD, web.
- Checked-in binaries: PNG/ICO/ICNS/SVG icons, brand images, `packaging/macos/dmg/background.tiff` (a real TIFF) and `dmg-layout.DS_Store` (real Finder metadata; its strings are only layout keys and `/Volumes/SoundCraft`). No PE, ELF, Mach-O or wasm files (checked with `file --mime-type` over all tracked files).
- Agent files: `AGENTS.md` and `CLAUDE.md` (a single line: "Read `AGENTS.md`").

## Network and data-egress map

| Location | Purpose | Trigger | Destination / bind | Data sent | Auth | Assessment |
|---|---|---|---|---|---|---|
| `apps/soundcraft/src/control_server.rs:13` `TcpListener::bind(("127.0.0.1", port))` | JSON-lines automation channel | Only with `--control PORT` or `SOUNDCRAFT_CONTROL_PORT` (`apps/soundcraft/src/main.rs:5,145-184`) | 127.0.0.1 only | Command results, session JSON, screenshots | None; raw TCP, no Origin/Host check | MEDIUM, SND-01 |
| `crates/automation/src/lib.rs:87` `TcpStream::connect_timeout` | MCP to the running app | Only `soundcraft-cli mcp --connect PORT|HOST:PORT` (a bare port means 127.0.0.1, `lib.rs:77-80`) | User-supplied address | MCP calls | None | Benign client |
| `crates/ui-egui/src/panels.rs:513-514`, `credits.rs:259,282` `hyperlink_to` | About links: getartcraft.com/apps/soundcraft, discord.gg/artcraft, github.com/{login} | User click | System browser | None | n/a | INFO |
| `crates/engine/src/score.rs:237` `http://www.musicxml.org/dtds/partwise.dtd` | DOCTYPE string written into exported MusicXML | Export | None (text in the file) | n/a | n/a | INFO |
| CI and packaging: `release.yml:282`, `freebsd.yml:43` (rustup `curl | sh`), `sign.ps1` (nuget, timestamp servers), Flatpak generator comment | Release/CI tooling | CI only | github.com, sh.rustup.rs, nuget.org | none | n/a | LOW, SND-06 |

There is no telemetry, analytics, crash upload, update check, license check, remote config, fingerprinting or model/asset download. Flatpak `finish-args` do not grant `--share=network`.

## Findings

**SND-00** · **INFO (scanner HIGH; false positive)** · Scanner triage: DECODE_THEN_RUN · `crates/ui-egui/src/video_track.rs:130` · fingerprint `2be407c11a714e8d`
Evidence: `std::thread::Builder::new().name("video-decode".into()).spawn(move || run(&s2, &tx, &ctx)).ok()?;`
- What it does: it starts one background thread that decodes video frames and thumbnails for the Video track. `run` (`:177-214`) waits on a `Condvar` queue and calls `worker.run(job)` inside `catch_unwind`. That calls `Movie::frame_at`/`thumbnail_at` from `soundcraft-video` (pure safe Rust; dependencies are only `thiserror`, `serde`, `image[jpeg]`, `rayon`). Results go back over an `mpsc` channel.
- When it runs: once, when the UI creates the video backend. It decodes only movies the user imported (`file.import_video`) or that a session lists in `Session::videos`, opened with `std::fs::File::open(path)` (`:93-97`).
- What leaves the machine: nothing. The file has no process, network, `unsafe` or base64 code.
- Who added it: the maintainer Brandon Thomas, `cdefc57` on 2026-10-06. The line is unchanged since then (`git blame`).
Recommendation: approve. Allowlist proposal for a human to run: `artcraft_scan.py allow --report ops/security/reports/2026-10-09/soundcraft-full.json --fingerprint 2be407c11a714e8d --reason "video-decode worker thread runs local job loop; no exec"`. A path-scoped rule entry (repo `soundcraft`, rule `DECODE_THEN_RUN`, path `crates/ui-egui/src/video_track.rs`) would also work.

**SND-01** · **MEDIUM** · Unauthenticated automation channel · `apps/soundcraft/src/control_server.rs:13,36-66`, `crates/ui-egui/src/control.rs:95-213`
Evidence: `TcpListener::bind(("127.0.0.1", port))`, then one JSON request per line, dispatched to `engine.execute` (any command), `ui.click/drag/key/text`, `ui.screenshot {path}` and `app.quit`.
- Loopback only and opt-in. There is no token. Bad lines return `"bad JSON"` without closing the connection, so the same blind cross-site POST concern noted for the sibling apps applies (speculation, not tested). Any local process can connect.
Recommendation: start `--control` only while an agent is working, and don't set `SOUNDCRAFT_CONTROL_PORT` globally. Upstream: add a per-launch token and reject lines that start with an HTTP method.

**SND-02** · **MEDIUM** · MCP and commands with arbitrary-path file writes; prompt-injection channel · `crates/automation/src/mcp.rs:24-104`, `crates/engine/src/cmd/file.rs:35-43,99-110,237-251,256-270`, `crates/engine/src/cmd/track_more.rs:266`
Evidence: `std::fs::write(&path, text)` in `session.save_template`, `file.export_session_text {path}`, `file.export_midi`, `file.bounce_mix`, score export and `track.save_preset`. These write to any path with any extension and overwrite existing files. Some of the content is attacker-influenced (for example track names in the session-info text).
- Reads (`file.import_audio`, `import_midi`, `import_video`, `track.load_preset`, `file.import_session_data`, `import_clip_groups`) parse the file as media or JSON and fail otherwise, so there is no raw-file read primitive that returns content to the model. Clip-group audio paths are checked for traversal (`clip_group_file.rs:99-101`). Saved audio names go through `sanitize_name` (`io.rs:442-446`).
- Session content (track names, comments, markers) is returned verbatim by `inspect_session`, so a hostile `.scraft` file can carry text aimed at the agent.
- MCP tool names: `list_commands, execute, batch, inspect_session, new_session, open_session, save_session, import_audio, bounce_mix, parity, screenshot, ui_inspect, ui_set, menu_invoke, click, drag, key`. All descriptions are plain usage text: no `<IMPORTANT>`, no cross-tool or data-sending instructions.
Recommendation: keep per-call approval for `execute`, `batch`, `save_session` and `bounce_mix`; don't auto-approve `mcp__soundcraft__*`; open only sessions you trust when an agent is attached.

**SND-03** · **LOW** · Microphone access · `crates/playback/src/record.rs:40-95`, `crates/ui-egui/src/lib.rs:342-375,450-466,713-718`, `crates/model/src/mixer.rs:495-497`
Evidence: `host.default_input_device()` and `.build_input_stream(...)`, called only from `ensure_input()`. That runs from `start_recording` (the user presses Record; the call is refused unless a track is armed) or when any track has `record_arm || input_monitor`.
- The callback feeds the live monitor ring and appends to the take buffer only while `armed`. Takes become session clips in memory (`add_recording`). No recorded audio goes to the network or a hidden location. Disk writes happen on user save, or through the 2-minute autosave of a modified session to `<config>/SoundCraft/Autosave/` (`lib.rs:410-428`; skipped while recording).
- Once opened, the input stream stays open for the rest of the app session (OS mic indicator stays on). Because the arm and monitor flags are saved in `.scraft`, opening an armed session opens the input device.
- macOS declares `NSMicrophoneUsageDescription` ("records audio from the input you choose") and the `com.apple.security.device.audio-input` entitlement, so the OS prompts. Flatpak gets audio through the PulseAudio socket only.
Recommendation: expected for a DAW; no action. Be aware an agent can arm a track and record through `execute`.

**SND-04** · **LOW** · In-process native plugin loading · `crates/clap-host/src/ffi.rs:124-129`, `crates/clap-host/src/scan.rs:14-50`, `crates/vst3-host/src/ffi.rs:126-152`, `crates/au-host`
Evidence: `unsafe { libloading::Library::new(&exe) }`. The search paths are the standard OS CLAP/VST3 folders (Windows `%COMMONPROGRAMFILES%\CLAP`, `%LOCALAPPDATA%\Programs\Common\CLAP`) plus `CLAP_PATH`. Scanning loads each binary's entry and runs its static initialisers. Instantiation resolves `clap:<id>` against the scan (`registry.rs:159-168`).
Assessment: this is standard DAW behaviour. A session can only pick among plugins already installed. Any plugin in those folders runs with the user's privileges.
Recommendation: install plugins only from vendors you trust. Don't point `CLAP_PATH`/`VST3_PATH` at writable download folders.

**SND-05** · **INFO** · Agent instruction files · `AGENTS.md`, `CLAUDE.md`
`CLAUDE.md` contains one line pointing to `AGENTS.md`. `AGENTS.md` holds normal developer guidance: read the gitignored `plan/STATUS.md` and the out-of-tree `../../craftrules/AGENTS.md`, "Work autonomously; don't stop to ask unless a decision is genuinely the user's", commit after each arc, and if preparing a contributor's PR, ask about their credit entry. An injection-phrase grep over the whole repo found nothing, and there are no concealment instructions. Owners running an autonomous agent in this checkout should know it will try to read `../../craftrules`.

**SND-06** · **LOW** · CI/release hygiene · `.github/workflows/release.yml:75-309`, `freebsd.yml:43`, `release.yml:282`, `packaging/windows/sign.ps1:66`
Third-party actions in `release.yml` are not pinned to a SHA (`dtolnay/rust-toolchain@stable`, `Swatinem/rust-cache@v2`). Rustup is installed with `curl | sh` in the FreeBSD/web jobs. The PFX is decoded from a secret in the signing job. Mitigations: there is no `pull_request_target`; signing secrets live only in the `release` environment; non-signing jobs say "No `environment: release`". None of this runs on the user's machine. The MSI has no CustomActions (Start Menu shortcut, App Paths, file associations and OpenWithProgids under HKLM only; no Run keys). Linux `postinst.sh` only refreshes caches.

## Build-time execution review

- `apps/soundcraft/build.rs`: on Windows only, `winresource` embeds `assets/app-icon/soundcraft.ico` and version strings. It reads `CARGO_CFG_TARGET_OS` and `SOUNDCRAFT_REQUIRE_WINRES`. No network or spawn (apart from the resource compiler that `winresource` invokes).
- `crates/ui-egui/build.rs`: reads `contributors/contributors.json` and `contributors/people.toml` from the repo and writes `$OUT_DIR/credits.rs`. All strings are emitted with `{:?}`, so data cannot inject code. No network, spawn or home-dir access.
- Proc-macros: none in the workspace. `.cargo/config.toml`: `[alias] xtask` only.
- `xtask` (`main.rs`, `ico.rs`, `version.rs`): spawns `cargo` (`$CARGO`) and `git`. No curl/network. Runs only on `cargo xtask ...`.
- Test-only: `clap-host`/`vst3-host` tests and `engine/tests/clap_e2e.rs` spawn `cargo` to build fixture plugins; `crates/video/src/tests.rs` calls `ffmpeg` if present. None of this runs under `cargo build`.

## Agent and MCP surface review

- Transport: `soundcraft-cli mcp` runs JSON-RPC 2.0 over stdio (`crates/automation/src/mcp.rs`, protocol 2025-06-18), either headless (in-process `Engine`) or with `--connect PORT`, which bridges to `soundcraft --control PORT` (see SND-01). The MCP process opens no listening socket.
- Server `instructions` (`mcp.rs:10-14`) are plain usage text plus `Backend: <describe>`. They contain no links and no instructions beyond how to use the tools.
- Tools (17) and resources (`soundcraft://session`, `soundcraft://commands`) were read verbatim. There is no poisoning. Headless mode refuses `ui.*`.
- Capability risks: arbitrary-path writes (SND-02); `click`/`key`/`menu_invoke` drive the GUI; no tool spawns processes or fetches URLs. `screenshot` captures the app viewport only (`control.rs:195-207` queues an egui viewport capture).

## Contributor and history review

- `git shortlog -sne HEAD`: Brandon Thomas `<echelon@gmail.com>` 55, Brandon Thomas `<shared2@storyteller.ai>` 3, Xus Badia `<xus@badia.me>` 1. History runs 2026-10-05 to 2026-10-09. HEAD `eac0edd` is a GitHub merge of PR #12 onto `c51e5d5`.
- External: **Xus Badia**, `617888b` "macOS DMG: branded window background and icon layout" (2026-10-08). Files: `ATTRIBUTION.md` (+1 row), `docs/releasing.md` (+3), `packaging/macos/dmg/{README.md, background.svg, background.tiff, dmg-layout.DS_Store, generate.py}`, `packaging/macos/package.sh` (+6/-1: copies the TIFF and `.DS_Store` into the DMG staging folder and drops the version from the volume name). `generate.py` is a developer-run Pillow/ds_store/mac_alias script that calls `resvg` on the in-repo SVG; it is not invoked by any build or CI step. The message matches the diff. **OK.** The PR touches no Rust, build.rs, Cargo, workflow, network, MCP or agent files.
- Maintainer risky-surface commits spot-checked: `cdefc57` (video track, AU hosting; the source of SND-00), `cc86842` (VST3 hosting, hostile-input hardening), `2fc8e2e` (CLAP hosting), `f41c131` (CLI, MCP, control), `04d2220` (release pipeline), `4627084` (credits build.rs, `toml`). All match their messages.

## Coverage checklist

1. Inventory: workspace, 3 apps, 14 crates, xtask, 2 build.rs, 4 workflows, packaging, binaries (images only). Done.
2. Network/egress: `std::net`, http(s) literals and network crates: only the loopback listener, the `--connect` client and click-only About links. No telemetry or update checks.
3. Process execution: none in app code. xtask spawns cargo/git; tests spawn cargo/ffmpeg.
4. FS/OS abuse: no secret-path reads, persistence, keyboard hooks, injection, clipboard (`arboard` is in the lockfile but not referenced in the sources) or desktop screen capture. Mic: see SND-03. Config is `%APPDATA%\SoundCraft\ui.json` plus `Autosave\`.
5. Obfuscation: the bidi/zero-width grep hit only a binary PNG. No base64/hex strings of 200+ characters. `include_bytes!` covers icons only; `include_str!` covers `catalog/menus.txt` and the CLI's own doc comment.
6. Build-time execution: both build.rs files, xtask and the cargo config were read. Clean.
7. Supply chain: 498 crates.io packages with checksums. No git/patch/replace. Network-capable crates are wasm-only `tokio` and `webbrowser` (links). `libloading` is used by the plugin hosts and graphics crates. All dependency additions were by the maintainer.
8. CI/installers: no `pull_request_target`, secrets confined to the `release` environment, no MSI CustomActions, benign postinst, Flatpak without network. See SND-06.
9. Agent-targeted: MCP metadata clean; injection grep found nothing; document-content channel noted (SND-02).
10. Plugins: native CLAP/VST3/AU in-process, no sandbox (SND-04). There is no scripting runtime.
11. History/contributors: the external PR was read in full (OK).
12. Secrets: no tokens or private keys (only workflow secret names).
13. Document attack surface: `.scraft` is JSON via serde with `sanitize()` on mixer data and proptest "hostile_sessions"/"hostile_params" suites in the repo. Audio decoding uses symphonia (safe Rust). Video uses an in-house safe-Rust H.264/ProRes/ISOBMFF decoder, run in `catch_unwind` on the worker thread. MIDI and clip-group JSON parsing check path traversal. Session source paths may be absolute and are read only as audio.

## Known-good patterns (for the automated scanner allowlist)

- `crates/ui-egui/src/video_track.rs:130`: "video-decode" worker thread (DECODE_THEN_RUN false positive, fp `2be407c11a714e8d`).
- `apps/soundcraft/src/control_server.rs:13` loopback control listener; `crates/automation/src/lib.rs:87` MCP `--connect` client.
- `crates/playback/src/record.rs:43,57` cpal default input device, user-armed recording.
- `crates/clap-host/src/ffi.rs`, `crates/vst3-host/src/ffi.rs`: `libloading` of plugins from standard plugin folders.
- `crates/engine/src/score.rs:237` MusicXML DOCTYPE URL `www.musicxml.org` (text only).
- `crates/ui-egui/src/panels.rs:513-514`, `credits.rs:259,282`: About links (getartcraft.com, discord.gg/artcraft, github.com).
- `packaging/windows/sign.ps1:66` PFX from secret; `release.yml:282`, `freebsd.yml:43` rustup install; `release.yml:339` `GH_TOKEN`.
- `packaging/macos/dmg/generate.py:41` `subprocess.run(["resvg", ...])` (developer tool only).
- Tests: `crates/{clap,vst3}-host/tests/common/mod.rs:15`, `crates/engine/tests/clap_e2e.rs:23` (cargo builds fixture plugins), `crates/video/src/tests.rs:161,189` (ffmpeg if present).
- README `raw.githubusercontent.com/storytold/*` icon images; `modelcontextprotocol.io` doc links.

## Setup facts (for the install and build scripts)

- Packages and binaries: GUI `soundcraft` -> `soundcraft.exe`; CLI and MCP `soundcraft-cli` -> `soundcraft-cli.exe` (`mcp` subcommand); `soundcraft-web` is the wasm build (skip on desktop); `xtask` is dev tooling.
- Windows release build: `cargo build --release --locked -p soundcraft -p soundcraft-cli`. Cargo.lock is committed. Rust >= 1.90, edition 2024.
- Launch: `soundcraft.exe [--demo] [--control <port>] [--no-audio] [session.scraft | audio files...]`. `--control 0` picks a free port and prints `SOUNDCRAFT_CONTROL_PORT=<port>`. Config is `%APPDATA%\SoundCraft\ui.json` plus `Autosave\`; `SOUNDCRAFT_NO_PREFS=1` disables prefs.
- MCP: headless `soundcraft-cli.exe mcp` (stdio), or bridged with `soundcraft.exe --control 7979` and `soundcraft-cli.exe mcp --connect 7979`.
- Windows prerequisites: MSVC build tools and the Windows SDK (`rc.exe` for winresource). cpal uses WASAPI (no extra SDK needed). A GPU with DX12/Vulkan for wgpu.
- Linux build packages (`release.yml:178-181`): `libxkbcommon-dev libwayland-dev libx11-dev libxrandr-dev libxi-dev libgl1-mesa-dev libasound2-dev pkg-config` (packaging extras: `desktop-file-utils appstream python3-yaml zsync`, nfpm).
