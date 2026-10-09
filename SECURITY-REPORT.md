# ArtCraft security report

**Scope:** all 9 ArtCraft repos (github.com/storytold/*) at the commits in the table below (also in `ops/security/audit/baselines.txt`), reviewed 2026-10-09. Later commits are covered only by the automated nightly gate, not by this review.
**Method:** an automated static scan (`ops/security/scanner/artcraft_scan.py`) of every tracked file, plus a manual read-only static review of each repo by an AI agent following `ops/security/audit/_REVIEW-CHECKLIST.md`. Nothing was built or executed. How to repeat it: `ops/security/SECURITY-SCAN-GUIDE.md`.

## Bottom line

**No malware, backdoors, credential theft, telemetry, analytics, tracking or phone-home code was found in any repo.** Every repo got the verdict **CLEAN WITH NOTES**, and every build gate says **APPROVE**. The notes are about *capability*: these apps are built to be driven by agents, so their automation channels can do whatever the app can do, including reading and writing files. That matters if an agent is ever steered by a malicious document. It does not indicate malicious intent.

These repos are about 10 days old, take dozens of commits a day, and have about 340 commit-author identities summed across the repos (128 on PhotoCraft alone), so today's clean bill of health only covers the reviewed commits. Every new commit goes through the nightly security gate before it gets built (see "Staying safe going forward").

| Repo | Adobe/MS equivalent | Reviewed commit | Verdict | Outbound network in the app | Control channel | Notable findings |
|---|---|---|---|---|---|---|
| photocraft | Photoshop | `ec350d64` | CLEAN WITH NOTES | **None** | loopback, **256-bit token**, file access limited to read/write roots | Best-hardened of the set. Authenticated clients get every command (PHOTO-01). The screen-color eyedropper uses `xcap` screen capture on demand (Windows only). The wasm plugin sandbox has no imports at all. |
| lightcraft | Lightroom Classic | `c435d143` | CLEAN WITH NOTES | Only **user-acknowledged model downloads** (face, denoise, SAM 3), SHA-256-pinned. SAM 3 has no default mirror. | loopback, no token, rejects HTTP | Control/MCP can launch an arbitrary "edit in external app" executable (LIGHT-01) and write exports to any path (LIGHT-02). Its TLS stack was added by an outside contributor and uses alpha `rustls-rustcrypto` (LIGHT-04). |
| filmcraft | Premiere Pro | `52318524` | CLEAN WITH NOTES | **None in the default build.** Whisper model download exists only behind the non-default `whisper` feature, which our scripts don't enable. | loopback, no token | `command_run`/`ui_control` accept any file path (FILM-02). The repo `.mcp.json` is benign today but should be diffed on every update. |
| effectcraft | After Effects | `cae67546` | CLEAN WITH NOTES | Opt-in model download via system `curl`, 2 fixed URLs, SHA-256 checked | loopback, no token, rejects HTTP | **The repo `.mcp.json` runs `cargo run`**, so never approve it. An agent can flip `scripting.allowScriptsWriteFiles` and un-gate file, socket and exec access from scripts (EFFECT-01). It also has a git dependency pinned to a filmcraft commit that lives on a side branch (EFFECT-03, reviewed and benign). |
| vectorcraft | Illustrator | `d464f28e` | CLEAN WITH NOTES | **None** | loopback, no token, rejects HTTP | `export {format:"txt"}` can write chosen text to any path (VECT-01). Printing builds a PowerShell command and may be injectable through a crafted printer name (VECT-02, speculative). Local `file://` image references in SVGs are read. |
| designcraft | InDesign | `14e677b2` | CLEAN WITH NOTES | **None** | loopback, no token, rejects HTTP | `file.exportText` can write any content to any path (DC-02). IDML/SVG links to absolute or **UNC** paths are followed, so a hostile document could cause an SMB connection that leaks NTLM hashes (DC-03). |
| pdfcraft | Acrobat | `a6bc63a4` | CLEAN WITH NOTES | Only **Help → Check for updates** (user click, GitHub releases API, sends only a User-Agent) | loopback, random port, **128-bit token** | PDF JavaScript is sandboxed (no fs or net). URI actions go through an allowlist plus a confirmation, and `/Launch` is not supported. The MCP server can touch any path unless started with `--root` (our script passes `--root`) (PDF-02). Five vendored crates are documented patches. |
| wordcraft | Word | `7584b9b2` | CLEAN WITH NOTES | **None** | loopback, no token | **Ctrl+click on a hyperlink in a document opens it with no scheme filter**, including `file:`, UNC and custom protocols (WC-01). Macros, remote templates, external images and DDE are all ignored (good). |
| cadcraft | AutoCAD | `59631c8d` | CLEAN WITH NOTES | **None** | loopback, no token, **does not reject HTTP lines**, so a web page might be able to send commands while `--control` is on (CAD-01, static reasoning) | Single maintainer. The DWG parser (`acadrust` crate) was not reviewed (third-party source not on disk). |

Full per-repo reviews, with file:line evidence, contributor reviews, the network map and setup facts: `ops/security/audit/<repo>.md`. Automated scan output isn't kept in git; regenerate it with `python ops/security/scanner/artcraft_scan.py full --repo <repo>`.

All automated HIGH hits in the baseline scan were triaged and found benign: zero-width joiners inside emoji test strings, a Telugu ZWNJ shaping test, the standard XMP BOM, a gzipped spell-check dictionary, `rundll32` used to open https links in the browser, a URL inside a build-script warning message, a test asserting that `mailto:…attach=~/.ssh/…` is *refused*, and the crate name `windows-registry`. The scanner has been tuned so these don't recur.

## What this means for you (the short list)

1. **Never approve the repos' own `.mcp.json` files** when Claude Code offers them. EffectCraft's runs `cargo run`, which compiles and executes whatever is checked out and bypasses the security gate. Use the servers that `ops/scripts/windows/register-mcp.ps1` registers instead.
2. **Only turn the control channel on when you're using it.** The "(ArtCraft)" Start-menu shortcuts start it, and the "(no agent)" shortcuts don't. All channels listen only on 127.0.0.1, but only PhotoCraft and PdfCraft require a token. Any program running as you could drive the others, so don't leave them listening while untrusted software runs. Don't run **CADCraft** with `--control` while browsing untrusted websites (CAD-01).
3. **Treat documents from strangers as untrusted input to Claude.** Text inside a document can contain instructions aimed at AI agents (prompt injection), and most of these MCP servers can write files anywhere. Do agent sessions on files you trust. Read Claude Code's permission prompts, especially for export and save tools. PhotoCraft (roots) and PdfCraft (`--root`, set by our script) confine file access.
4. **In WordCraft, don't Ctrl+click links in documents you didn't write** (WC-01). In **DesignCraft/VectorCraft**, be careful opening documents from strangers, because they can reference local or network file paths (DC-03).
5. Optional belt-and-braces (Windows): `ops\scripts\windows\harden-firewall.ps1` blocks all outbound internet for every ArtCraft program (loopback, and therefore Claude, keeps working).

## Staying safe going forward: the nightly gate

`ops/scripts/windows/nightly-update.ps1` (Linux: `ops/scripts/linux/nightly-update.sh`) runs nightly once registered (`register-nightly-task.ps1`):

1. Fast-forwards each repo. It never discards local changes.
2. Scans **every commit since the last approved commit** with `artcraft_scan.py gate`. It looks for exfiltration endpoints, telemetry SDKs, new network libraries, new URLs to unknown hosts in app code, process execution, persistence, keylogging and screen capture, obfuscation and Unicode tricks, prompt-injection text, changes to `build.rs`, `.cargo/config`, workflows, `.mcp.json`, `.claude/` or `.vscode/tasks.json`, new git or alternative-registry dependencies, typosquatted or known-malicious crates, checksum tampering, rewritten history, and first-time contributors touching sensitive files.
3. Builds (`cargo build --release --locked`) only the repos that pass. Flagged repos are pulled but **not built**, so yesterday's build keeps working until you review the flag (`approve-repo.ps1`).

Test run on 2026-10-09 09:15: effectcraft (+95 commits), vectorcraft (+89), pdfcraft (+37), wordcraft (+15) and cadcraft (+2) were pulled and scanned, and all came back **clean**. While tuning the scanner on recent history, it correctly flagged real changes worth a look (PhotoCraft adding `xcap` screen capture, LightCraft adding huggingface model URLs). Both were reviewed above as benign.

### Limits of this review (be aware)

- It is **static**: no code was run, and nothing was fuzzed or dynamically analyzed. A determined attacker can hide logic that pattern matching and a time-boxed read would miss.
- **Third-party crate sources were not reviewed.** Their names, versions, sources and checksums were checked; their code was not, because it wasn't downloaded. Building compiles and runs their build scripts. Optional: run `setup-windows.ps1 -WithAuditTools`, then `cargo audit` in a repo, to check known advisories.
- The nightly gate is a tripwire for obvious and high-risk changes. It does not replace human review of a flagged diff.
