window.ARTCRAFT_COURSES = window.ARTCRAFT_COURSES || [];
window.ARTCRAFT_COURSES.push({
  id: "start",
  app: "Start here",
  adobe: null,
  tagline: "Set up the apps safely, connect Claude, and learn how to work with an AI co-pilot.",
  accent: "#c7801f",
  level: "Beginner",
  estimatedHours: 1.5,
  intro: "<p>This short course gets your Windows machine ready: it builds the apps from source (only after a security check), connects them to Claude Code, and keeps them up to date every night. Then it teaches the habits that make working with an AI co-pilot safe and productive. Do this first, then pick PhotoCraft, LightCraft or FilmCraft.</p>",
  prerequisites: [
    "About 25 GB of free disk space (toolchains plus nine app builds; three apps need roughly 8 GB).",
    "An internet connection for the one-time setup and the practice-file download.",
    "Claude Code installed (the <code>claude</code> command works in a terminal)."
  ],
  setup: null,
  assets: [],
  modules: [
    {
      id: "s1", title: "Get set up", summary: "From source code to apps you can open, in a safe order.",
      lessons: [
        {
          id: "s1-l1", title: "How this all fits together", minutes: 5, assets: [],
          goals: ["Know what the ArtCraft apps are and why you build them yourself", "Understand the three windows you'll use: the app, this course, and Claude"],
          blocks: [
            { t: "p", html: "The <b>ArtCraft</b> apps are open-source, clean-room re-creations of Adobe and Microsoft tools, written in Rust: <b>PhotoCraft</b> (like Photoshop), <b>LightCraft</b> (like Lightroom Classic), <b>FilmCraft</b> (like Premiere Pro), plus EffectCraft, VectorCraft, DesignCraft, PdfCraft, WordCraft and CADCraft. They change daily, much of the work is done by AI agents, and anyone can send a pull request. So you build them yourself, but only after a security check." },
            { t: "p", html: "Each app has a built-in <b>control channel</b>. It only listens on your own PC (127.0.0.1), and an <b>MCP server</b> lets Claude Code drive the app: open files, apply edits, inspect layers, export. That is what “designed for agentic assistance” means." },
            { t: "h", text: "Your three windows" },
            { t: "steps", items: [
              { html: "<b>The app</b> (for example PhotoCraft), opened from <b>Start → ArtCraft → PhotoCraft (ArtCraft)</b>.", detail: "The “(ArtCraft)” shortcut turns on the control channel so Claude can connect. The “(no agent)” shortcut opens the app without it." },
              { html: "<b>This course</b> in your browser. Click the compact button (top right) and dock it to one side of the screen with <kbd>Win</kbd>+<kbd>Left</kbd>." },
              { html: "<b>Claude Code</b> in a terminal, started in the app's work folder, for example <code>%USERPROFILE%\\ArtCraft\\PhotoCraft</code>." }
            ]},
            { t: "callout", kind: "tip", html: "Every lesson has a <b>Coach me with Claude</b> button. It copies a prompt that asks Claude to read that exact lesson and tutor you through it, checking your work in the app as you go." },
            { t: "quiz", items: [
              { q: "Why do the apps have to be started with the “(ArtCraft)” shortcut for Claude to drive them?", choices: ["It logs Claude into your Adobe account", "It turns on the app's local control channel that the MCP server connects to", "It downloads the latest version"], answer: 1, explain: "The control channel listens only on 127.0.0.1 (your own PC). Without it, Claude can only work on files headlessly." }
            ]}
          ]
        },
        {
          id: "s1-l2", title: "Read the security report", minutes: 10, assets: [],
          goals: ["Know what was checked and what was found", "Know the few settings that matter for safety"],
          blocks: [
            { t: "p", html: "Before anything was built, every repo got an automated scan plus a manual static review that looked for tracking, malware and anything injected through a malicious pull request. The summary is in <code>{ROOT}\\SECURITY-REPORT.md</code>." },
            { t: "steps", items: [
              { html: "Open <code>{ROOT}\\SECURITY-REPORT.md</code> (any text editor or VS Code). Read the summary table first." },
              { html: "Read the <b>What this means for you</b> section. It lists the handful of safe-use rules, such as not approving the repos' own <code>.mcp.json</code> files." },
              { html: "Skim the per-repo sections for the three apps you'll learn first: PhotoCraft, LightCraft and FilmCraft." }
            ]},
            { t: "callout", kind: "note", html: "The review is a careful static read of the source code, not a guarantee. That's why the apps are built from source you can inspect, why every nightly update is re-scanned before building, and why there is an optional firewall script that blocks the apps from the internet entirely." },
            { t: "claude", title: "Ask Claude to explain it", prompts: [
              { prompt: "Read {ROOT}\\SECURITY-REPORT.md and explain it to me like I'm not a security expert. What should I actually do differently when using these apps?", why: "Claude reads the report and turns it into a short personal checklist." }
            ]}
          ]
        },
        {
          id: "s1-l3", title: "Install the build tools", minutes: 20, assets: [],
          goals: ["Install Rust and the Microsoft C++ build tools"],
          blocks: [
            { t: "p", html: "The apps are compiled from Rust source code. That needs two things: the <b>Rust toolchain</b> and Microsoft's <b>C++ build tools</b> (for the linker). One script installs both using <code>winget</code>." },
            { t: "steps", items: [
              { html: "Open <b>PowerShell</b> (Start → type <i>PowerShell</i>)." },
              { html: "Run the setup script:", detail: "It installs Visual Studio 2022 Build Tools (C++ workload, about 6 GB; approve the Windows UAC prompt), rustup with the stable toolchain, NASM and CMake. It also creates your <code>%USERPROFILE%\\ArtCraft\\&lt;App&gt;</code> work folders. It does not compile any ArtCraft code." },
              { html: "When it finishes, <b>close PowerShell and open a new one</b> so the new tools are on your PATH.", check: "<code>cargo --version</code> prints a version number." }
            ]},
            { t: "code", lang: "powershell", text: "powershell -ExecutionPolicy Bypass -File {ROOT}\\ops\\scripts\\windows\\setup-windows.ps1" },
            { t: "callout", kind: "warn", html: "If the Build Tools installer fails, install <b>Desktop development with C++</b> by hand from <a href=\"https://visualstudio.microsoft.com/visual-cpp-build-tools/\">visualstudio.microsoft.com/visual-cpp-build-tools</a>, then re-run the script." }
          ]
        },
        {
          id: "s1-l4", title: "Build the apps", minutes: 30, assets: [],
          goals: ["Build the apps that passed the security gate", "Find them in the Start menu"],
          blocks: [
            { t: "p", html: "<code>build-approved.ps1</code> re-checks each repo against the security gate and runs <code>cargo build --release --locked</code> only for repos that pass. <code>--locked</code> means it uses exactly the dependency versions that were reviewed." },
            { t: "callout", kind: "note", html: "<b>First install only.</b> If the app folders (<code>photocraft</code>, <code>lightcraft</code>, ...) aren't in <code>{ROOT}</code> yet, run <code>.\\nightly-update.ps1 -NoBuild</code> first. It downloads the app source code and scans it, but builds nothing. Then run <code>.\\adopt-audit-baseline.ps1</code>: it asks whether you trust the published security audit (<code>SECURITY-REPORT.md</code>), and if you type <b>yes</b> it uses the audited commits as your starting point and scans everything newer. Without a starting point the gate reports <b>needs-baseline</b> and nothing gets built." },
            { t: "steps", items: [
              { html: "Build the three course apps first (each takes 5 to 20 minutes the first time):" },
              { html: "Watch the summary at the end. Each repo should say <code>ok</code>.", detail: "A <code>FAILED</code> line points to a log in <code>ops\\logs\\&lt;date&gt;\\</code>. Common causes: the build tools aren't installed yet (re-run setup), or the app is open while rebuilding (close it)." },
              { html: "Open <b>Start → ArtCraft</b>. There is a shortcut for each built app, plus <b>ArtCraft Courses</b> and <b>ArtCraft Nightly Report</b>.", check: "<b>PhotoCraft (ArtCraft)</b>, <b>LightCraft (ArtCraft)</b> and <b>FilmCraft (ArtCraft)</b> appear." },
              { html: "Optional: build everything else later with <code>.\\build-approved.ps1</code> (no arguments)." }
            ]},
            { t: "code", lang: "powershell", text: "cd {ROOT}\\ops\\scripts\\windows\n.\\build-approved.ps1 -Repos photocraft,lightcraft,filmcraft" },
            { t: "callout", kind: "note", html: "Building runs code from the repos (Rust build scripts and macros). That is exactly why it only happens after the gate passes." }
          ]
        },
        {
          id: "s1-l5", title: "Download the practice files", minutes: 5, assets: [],
          goals: ["Get the public-domain practice photos, raw files and video clips"],
          blocks: [
            { t: "p", html: "The courses use public-domain or freely licensed practice media. A script downloads them into <code>courses\\assets\\</code> and copies each app's files into its practice folder, for example <code>%USERPROFILE%\\ArtCraft\\PhotoCraft\\practice\\</code>." },
            { t: "code", lang: "powershell", text: "powershell -ExecutionPolicy Bypass -File {ROOT}\\ops\\scripts\\windows\\fetch-course-assets.ps1" },
            { t: "check", html: "In any lesson that uses a practice file, the <b>Practice files</b> box at the top says <b>ready</b>." }
          ]
        },
        {
          id: "s1-l6", title: "Connect the apps to Claude", minutes: 10, assets: [],
          goals: ["Register the apps' MCP servers with Claude Code", "Confirm the connection with /mcp"],
          blocks: [
            { t: "steps", items: [
              { html: "Register the built apps with Claude Code:", detail: "For each built app this adds a <b>user-scope</b> MCP server named after the app (for example <code>photocraft</code>) that bridges to the <i>running</i> app, plus a <code>-headless</code> variant for the course apps that works on files without a window." },
              { html: "Start <b>PhotoCraft (ArtCraft)</b> from the Start menu. Start the app <i>before</i> Claude, because PhotoCraft creates its private access token on first launch." },
              { html: "In PowerShell: <code>cd $env:USERPROFILE\\ArtCraft\\PhotoCraft</code>, then <code>claude</code>." },
              { html: "In Claude Code, type <code>/mcp</code>.", check: "<code>photocraft</code> is listed as connected." },
              { html: "Ask: <i>“What document is open in PhotoCraft right now?”</i> Claude will ask permission the first time it uses an app tool. Allow it.", check: "Claude answers by calling a PhotoCraft tool, not by guessing." }
            ]},
            { t: "code", lang: "powershell", text: "cd {ROOT}\\ops\\scripts\\windows\n.\\register-mcp.ps1" },
            { t: "callout", kind: "warn", html: "If Claude Code ever offers to enable MCP servers from a <b>project</b> <code>.mcp.json</code> inside one of the repo folders, say <b>no</b>. Some of those run <code>cargo run</code>, which would build and execute whatever code is checked out, skipping the security gate. Use the servers registered by the script instead." }
          ]
        },
        {
          id: "s1-l7", title: "Turn on nightly updates", minutes: 5, assets: [],
          goals: ["Schedule the nightly pull, scan and build"],
          blocks: [
            { t: "p", html: "These apps get dozens of commits a day. The nightly job pulls every repo, scans <i>only the new commits</i> for risky changes, and rebuilds the ones that pass. A flagged repo keeps its previous build until you review it." },
            { t: "code", lang: "powershell", text: "cd {ROOT}\\ops\\scripts\\windows\n.\\register-nightly-task.ps1            # daily at 3:00 AM\n# .\\register-nightly-task.ps1 -At 01:30   (pick another time)" },
            { t: "callout", kind: "tip", html: "The job runs while you're logged in (no password is stored). If the PC was off, it catches up the next time you log in. Close the apps at night, because Windows won't let it replace a running program." }
          ]
        },
        {
          id: "s1-l8", title: "Optional: block the apps from the internet", minutes: 5, assets: [],
          goals: ["Add firewall rules that stop the apps from reaching the internet"],
          blocks: [
            { t: "p", html: "The review found no telemetry. If you want a hard guarantee anyway, this script adds Windows Firewall rules that block outbound internet traffic for every ArtCraft program. Claude still works, because the control channel is local (127.0.0.1) and the firewall doesn't filter that." },
            { t: "code", lang: "powershell", text: "{ROOT}\\ops\\scripts\\windows\\harden-firewall.ps1        # asks for admin\n# ...\\harden-firewall.ps1 -Remove   to undo" },
            { t: "callout", kind: "note", html: "Side effect: optional downloads stop working, such as LightCraft's face-recognition or denoise models and PdfCraft's update check. Re-run it after building new apps." }
          ]
        }
      ]
    },
    {
      id: "s2", title: "Working with Claude", summary: "Habits that make an AI co-pilot helpful instead of confusing.",
      lessons: [
        {
          id: "s2-l1", title: "What Claude can and can't do here", minutes: 8, assets: [],
          goals: ["Know how Claude sees the app", "Know when to do things by hand"],
          blocks: [
            { t: "p", html: "Claude doesn't see your screen. It works through the app's <b>MCP tools</b>: it can list and run the app's commands, inspect the document (layers, photos, timeline), open and save files, and in some apps render a preview image to look at. Everything it does is something the app can do through a menu command." },
            { t: "callout", kind: "tip", html: "Great uses: “do the boring version” (batch export, rename, apply the same edit to 40 photos), “explain what just happened”, “check my work”, and “set up the starting point so I can practice the creative part”." },
            { t: "callout", kind: "warn", html: "Weak uses: freehand brushwork, judging taste (“make it look good”) without your feedback, and anything the app hasn't implemented yet (see each course's <b>Limitations</b> page). If Claude says a command doesn't exist, it's probably right." },
            { t: "quiz", items: [
              { q: "How does Claude know which layer is selected in PhotoCraft?", choices: ["It takes screenshots of your monitor", "It asks the app through an MCP tool that inspects the document", "It guesses from the file name"], answer: 1, explain: "Claude only knows what the MCP tools report, so ask it to inspect before it acts." }
            ]}
          ]
        },
        {
          id: "s2-l2", title: "Prompts that work", minutes: 10, assets: [],
          goals: ["Write clear, checkable requests", "Use the inspect, act, verify loop"],
          blocks: [
            { t: "steps", items: [
              { html: "<b>Inspect first.</b> “Look at the open document and tell me what's there before changing anything.”" },
              { html: "<b>Be specific about the outcome.</b> Prefer “add a Curves adjustment layer that brightens the midtones slightly” over “make it better”." },
              { html: "<b>Ask for small steps.</b> “Do just the crop, then stop so I can look.”" },
              { html: "<b>Ask it to verify.</b> “After you're done, inspect the layer stack and confirm the result.”" },
              { html: "<b>Ask why.</b> “Explain what that blend mode did, as if I'm new to this.”" }
            ]},
            { t: "claude", title: "A good first prompt in any app", prompts: [
              { prompt: "Before we start: list the tools you have for this app, grouped by what they're for, and tell me which ones change my document and which only look at it.", why: "Builds your mental model of what Claude can do in this app." }
            ]}
          ]
        },
        {
          id: "s2-l3", title: "Staying in control", minutes: 8, assets: [],
          goals: ["Use permission prompts, undo and work folders to stay safe"],
          blocks: [
            { t: "steps", items: [
              { html: "<b>Permission prompts.</b> Claude Code asks before it uses a tool. Read what it wants to do. Allowing a tool for the session is fine for inspection tools; stay more careful with file-saving and export tools." },
              { html: "<b>Undo works.</b> Edits made through MCP land in the app's normal history, so <kbd>Ctrl</kbd>+<kbd>Z</kbd> in the app, or asking Claude to undo, reverts them." },
              { html: "<b>Keep originals.</b> Work on copies in your practice folder, and export to <code>exports\\</code>. PhotoCraft goes further: Claude can only read and write inside <code>%USERPROFILE%\\ArtCraft\\PhotoCraft</code>." },
              { html: "<b>One app per session.</b> Start Claude in that app's work folder so the files it sees are the ones you're working on." }
            ]},
            { t: "callout", kind: "note", html: "The control channel only accepts connections from your own PC. PhotoCraft also requires a secret token (stored in <code>%LOCALAPPDATA%\\ArtCraft\\tokens</code>). The others rely on being local-only, so don't run them with the control channel on while untrusted software is running on your machine." }
          ]
        },
        {
          id: "s2-l4", title: "When something goes wrong", minutes: 6, assets: [],
          goals: ["Fix the common connection problems"],
          blocks: [
            { t: "keys", items: [
              { keys: "/mcp shows the app as failed", action: "Start the app with its <b>(ArtCraft)</b> shortcut first, then restart Claude Code (or reconnect from <code>/mcp</code>)." },
              { keys: "“not built” when registering", action: "Run <code>build-approved.ps1 -Repos &lt;app&gt;</code>, then <code>register-mcp.ps1</code> again." },
              { keys: "Build FAILED: Access denied", action: "The app was running while rebuilding. Close it and run the build again." },
              { keys: "PhotoCraft: auth error", action: "Start PhotoCraft from the shortcut once, so it creates the token file, then reconnect." },
              { keys: "Claude invents a command", action: "Ask it to list the app's commands first (every MCP server has a list or describe tool)." }
            ]}
          ]
        }
      ]
    },
    {
      id: "s3", title: "Staying up to date", summary: "Reading the nightly report and handling a flagged update.",
      lessons: [
        {
          id: "s3-l1", title: "Read the nightly report", minutes: 5, assets: [],
          goals: ["Know where the nightly results are and what they mean"],
          blocks: [
            { t: "p", html: "Every morning, <b>Start → ArtCraft → ArtCraft Nightly Report</b> opens <code>ops\\reports\\LATEST.md</code>. One row per repo: how many new commits arrived, whether the security gate passed, and whether the build succeeded." },
            { t: "keys", items: [
              { keys: "clean / ok", action: "New code was scanned and built. Nothing to do." },
              { keys: "FLAGGED", action: "The scanner found something that needs a human look. The repo was pulled but <b>not built</b>, so you keep yesterday's build." },
              { keys: "up to date", action: "No new commits, or already built." },
              { keys: "FAILED", action: "The build broke. Usually an upstream bug that is fixed within a day, and the old build stays in place." }
            ]}
          ]
        },
        {
          id: "s3-l2", title: "Handle a flagged update with Claude", minutes: 10, assets: [],
          goals: ["Review a flagged change and approve or reject it"],
          blocks: [
            { t: "p", html: "A flag means “a person should look”, not “this is malware”. A typical flag is a new network library, a new URL in app code, or a new build script. Claude can do the legwork, following the written guide for this." },
            { t: "claude", title: "Ask Claude to triage", prompts: [
              { prompt: "Read {ROOT}\\ops\\security\\SECURITY-SCAN-GUIDE.md, then triage the FLAGGED repos in {ROOT}\\ops\\reports\\LATEST.md. For each blocking finding, read the actual diff and tell me whether it's benign, and why. Don't approve or build anything. Just give me your verdict.", why: "Claude follows the guide's triage section: it reads the flagged diffs read-only and reports back. You make the call." }
            ]},
            { t: "steps", items: [
              { html: "If it's benign, approve it. This moves the baseline so only newer commits get scanned next time:", detail: "<code>ops\\scripts\\windows\\approve-repo.ps1 -Repo &lt;name&gt; -Note \"why it's fine\"</code>, then <code>build-approved.ps1 -Repos &lt;name&gt;</code>." },
              { html: "If it looks suspicious, do nothing. The repo stays unbuilt and your previous build keeps working. Check again after the next nightly run." }
            ]}
          ]
        }
      ]
    }
  ],
  shortcuts: [],
  glossary: [
    { term: "MCP", def: "Model Context Protocol, the standard way Claude Code connects to tools. Each ArtCraft app ships an MCP server (<code>&lt;app&gt;-cli mcp</code>)." },
    { term: "Control channel", def: "A local-only (127.0.0.1) connection the desktop app opens when started with <code>--control &lt;port&gt;</code>. The MCP bridge talks to the live app through it." },
    { term: "Headless", def: "Running the app's engine without a window, on files. Useful for batch work." },
    { term: "Security gate", def: "The nightly static scan of new commits. A repo is only built if its new commits pass or you approve them." },
    { term: "Baseline", def: "The last commit you (or the initial audit) approved. The gate scans everything after it." }
  ],
  claudeCheatsheet: [],
  limitations: []
});
