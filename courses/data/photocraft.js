window.ARTCRAFT_COURSES = window.ARTCRAFT_COURSES || [];
window.ARTCRAFT_COURSES.push({
  id: "photocraft",
  app: "PhotoCraft",
  adobe: "Adobe Photoshop",
  tagline: "Edit photos and artwork with layers, masks, and adjustments, by hand and with Claude doing the same work beside you.",
  accent: "#2f7bf5",
  level: "Beginner",
  estimatedHours: 8,
  intro: "<p>PhotoCraft is a free, open-source image editor modeled on Adobe Photoshop: the same menus, the same panel names, and almost the same keyboard shortcuts. This course takes you from never having edited an image to finishing a small poster project. It teaches the ideas (pixels, layers, masks, non-destructive editing) along with the buttons.</p><p>You will work two ways, side by side. <b>By hand</b>, so you learn what every control does. <b>With Claude Code</b>, an AI agent in a terminal that is connected to the running PhotoCraft window: you describe a goal, and the edits appear in the window while you watch. Doing the same job both ways is the fastest way to understand it, and it shows you where Claude is a great helper and where you still need your own eyes.</p><p><b>Heads up:</b> PhotoCraft is early alpha software. Most of the Photoshop menu is wired up, but some features are rough, some are missing, and large images can feel slow. The course only teaches things that work, and the Limitations list at the end tells you what to skip.</p>",
  prerequisites: [
    "A Windows 11 PC where PhotoCraft has been built and the ArtCraft setup scripts have been run. They create the Start-menu shortcut PhotoCraft (ArtCraft), your work folder, and the Claude Code connection.",
    "The practice images copied into %USERPROFILE%\\ArtCraft\\PhotoCraft\\practice\\ (the asset-download script does this). The Practice files list on the course home page shows which ones you need.",
    "Claude Code installed and signed in. You only need it from module 3 onward, but it is worth checking now.",
    "A mouse. A pen tablet is optional. No Photoshop or photo-editing experience is needed.",
    "About 8 hours in total. Each lesson takes 8 to 20 minutes, and the exercises are optional extra practice."
  ],
  setup: {
    launchHtml: "<p>Start PhotoCraft from the Start menu: press the <kbd>Windows</kbd> key, type <b>PhotoCraft (ArtCraft)</b>, and press <kbd>Enter</kbd>. The shortcut runs <code>{ROOT}\\photocraft\\target\\release\\photocraft.exe</code> with these options:</p><ul><li><code>--control 7878</code> opens a control channel on your own PC only (127.0.0.1, port 7878). This is how Claude connects to the live window.</li><li><code>--control-token-file %LOCALAPPDATA%\\ArtCraft\\tokens\\photocraft-control.token</code> names a password file. PhotoCraft creates it on first start, and Claude's connection reads it.</li><li><code>--automation-read-root</code> and <code>--automation-write-root</code>, both set to <code>%USERPROFILE%\\ArtCraft\\PhotoCraft</code>, limit the files Claude can open and save to your work folder.</li></ul><p>You can start the same thing from PowerShell with <code>{ROOT}\\ops\\scripts\\windows\\launch-app.ps1 -App photocraft</code>. Starting <code>photocraft.exe</code> by double-clicking it works for editing by hand, but without those options Claude cannot connect to that window.</p><p>Your work folder is <code>%USERPROFILE%\\ArtCraft\\PhotoCraft\\</code>. Practice files are in its <code>practice\\</code> subfolder, and finished files go to <code>exports\\</code>.</p>",
    mcpHtml: "<p>Claude Code talks to PhotoCraft through two MCP servers, registered for you by <code>{ROOT}\\ops\\scripts\\windows\\register-mcp.ps1</code>:</p><ul><li><b>photocraft</b> is the bridge to the running app. Claude's edits appear live in the PhotoCraft window. This is the one most lessons use. In Claude Code its tools are named <code>mcp__photocraft__&lt;tool&gt;</code>.</li><li><b>photocraft-headless</b> works directly on files with no window at all. It is good for batch jobs, such as resizing a whole folder of pictures.</li></ul><p>To connect: <b>start PhotoCraft first</b> (so the token file exists), then open PowerShell and run:</p><pre>cd $env:USERPROFILE\\ArtCraft\\PhotoCraft\nclaude</pre><p>Inside Claude Code, type <code>/mcp</code>. You should see <b>photocraft</b> and <b>photocraft-headless</b> listed as connected. Module 3 walks through this step by step, including what to do when a server shows as failed.</p>"
  },
  assets: [
    {
      id: "great-wave",
      title: "The Great Wave off Kanagawa (Hokusai, c. 1831)",
      kind: "image",
      file: "assets/photocraft/great-wave.jpg",
      needs: "JPEG, RGB, landscape, about 2400 to 3000 px on the long side (the repo's own screenshot document is 3859 x 2594; anything in that range works, but a smaller file keeps the early-alpha app responsive). A full-frame image with a bright paper-colored sky, strong dark blues and fine detail (foam, hatching), so students can zoom in on pixels, build layers on top of it, and see adjustments clearly. Used in the orientation, pixel, layer, Claude and type lessons.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:Tsunami_by_hokusai_19th_century.jpg",
      license: "Public domain (Katsushika Hokusai, c. 1831; source listed in photocraft/docs/images/SOURCES.md)"
    },
    {
      id: "earthrise",
      title: "Earthrise (NASA, Apollo 8, 1968)",
      kind: "image",
      file: "assets/photocraft/earthrise.jpg",
      needs: "JPEG, RGB, about 2400 px on the long side (the repo's screenshot document is 2400 x 2400; the original landscape frame also works). A photograph with a large area of pure black, a small bright Earth and a gray lunar surface, so the histogram is very lopsided and the Color Range selection of the black sky is easy. Used for color channels, the histogram and Color Range.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:NASA-Apollo8-Dec24-Earthrise.jpg",
      license: "Public domain (NASA photograph; source listed in photocraft/docs/images/SOURCES.md)"
    },
    {
      id: "pearl-earring",
      title: "Girl with a Pearl Earring (Vermeer, c. 1665)",
      kind: "image",
      file: "assets/photocraft/pearl-earring.jpg",
      needs: "JPEG, RGB, portrait orientation, about 2000 x 2400 px (the repo's screenshot document is 2026 x 2400). A face and shoulders against a dark background with a blue and yellow head cloth and fine surface cracks. Used for selections, layer masks, local adjustments and spot healing of the cracks.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:1665_Girl_with_a_Pearl_Earring.jpg",
      license: "Public domain (Johannes Vermeer, c. 1665; source listed in photocraft/docs/images/SOURCES.md)"
    },
    {
      id: "impression-sunrise",
      title: "Impression, Sunrise (Monet, 1872)",
      kind: "image",
      file: "assets/photocraft/impression-sunrise.jpg",
      needs: "JPEG, RGB, landscape, about 2400 x 1860 px (the repo's screenshot document is 2400 x 1862). Muted blue-gray harbor with one saturated orange sun and its reflection, so Hue/Saturation, Vibrance, Color Balance and Black & White changes are easy to see. Used for blend modes and the color lessons.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:Monet_-_Impression,_Sunrise.jpg",
      license: "Public domain (Claude Monet, 1872; source listed in photocraft/docs/images/SOURCES.md)"
    },
    {
      id: "tetons",
      title: "The Tetons and the Snake River (Ansel Adams, 1942)",
      kind: "image",
      file: "assets/photocraft/tetons.jpg",
      needs: "JPEG, about 2400 to 3000 px on the long side. A black-and-white landscape photograph with a wide tonal range (dark foreground trees, bright clouds, a roughly horizontal river and horizon). Saved as an RGB JPEG (convert a grayscale download to RGB if needed) so every adjustment works. Used for the histogram, Levels, Curves, cropping and straightening.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:Adams_The_Tetons_and_the_Snake_River.jpg",
      license: "Public domain (Ansel Adams for the U.S. National Archives; source listed in photocraft/docs/images/SOURCES.md)"
    },
    {
      id: "starry-night",
      title: "The Starry Night (Van Gogh, 1889)",
      kind: "image",
      file: "assets/photocraft/starry-night.jpg",
      needs: "JPEG, RGB, landscape, about 2400 px wide. Swirling texture, bright stars and a dark cypress, which show blurs, sharpening and glow effects clearly and give the Clone Stamp bright stars to copy. Used for cloning and filters.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
      license: "Public domain (Vincent van Gogh, 1889; source listed in photocraft/docs/images/SOURCES.md)"
    },
    {
      id: "sierra-nevada",
      title: "Among the Sierra Nevada, California (Bierstadt, 1868)",
      kind: "image",
      file: "assets/photocraft/sierra-nevada.jpg",
      needs: "JPEG, RGB, landscape, about 2400 to 3000 px wide. A wide mountain landscape with a large sky and a calm lake, good for Select > Sky, a vignette and a title card with text on top. This is the capstone image.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:Albert_Bierstadt_-_Among_the_Sierra_Nevada,_California_-_Google_Art_Project.jpg",
      license: "Public domain (Albert Bierstadt, 1868; source listed in photocraft/docs/images/SOURCES.md)"
    },
    {
      id: "the-kiss",
      title: "The Kiss (Klimt, 1907-1908)",
      kind: "image",
      file: "assets/photocraft/the-kiss.jpg",
      needs: "JPEG, RGB, nearly square, about 2400 x 2400 px (the repo's screenshot document is 2397 x 2400). Gold patterns with very fine detail, so JPEG quality and resize differences are easy to see when exporting. Used for the export and batch lessons.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:Gustav_Klimt_016.jpg",
      license: "Public domain (Gustav Klimt, 1907-1908; source listed in photocraft/docs/images/SOURCES.md)"
    }
  ],
  modules: [
    {
      id: "m1",
      title: "Getting oriented",
      summary: "Start PhotoCraft, learn the window, open and navigate an image, undo mistakes, and save and export safely.",
      lessons: [
        {
          id: "m1-l1",
          title: "Start PhotoCraft and set up your three windows",
          minutes: 10,
          goals: [
            "Start PhotoCraft from the Start menu and recognize the start screen",
            "Explain how this course, PhotoCraft and Claude Code fit together",
            "Find your work folder and explain why Claude is limited to it"
          ],
          assets: [],
          blocks: [
            { t: "p", html: "Before you touch a tool, it helps to know what you are setting up. For this course you will keep up to three windows open at once:" },
            { t: "p", html: "<ul><li><b>This course</b>, in your browser: the lessons, quizzes, and a checklist that remembers your progress.</li><li><b>PhotoCraft</b>, the image editor. Your pictures live here, and you can watch every change happen.</li><li><b>A terminal running Claude Code</b> (from module 3 on). Claude is connected to the same PhotoCraft window, so it can look at your document, make edits, and explain them.</li></ul>" },
            { t: "p", html: "PhotoCraft is a native Windows program written in Rust, so it starts quickly and runs offline. It copies Photoshop's menu layout on purpose, which means almost everything you learn here carries over to Photoshop, and most Photoshop tutorials carry over to PhotoCraft." },
            { t: "callout", kind: "warn", html: "<b>PhotoCraft is early alpha.</b> Its own roadmap rates it well below half of Photoshop's feature depth. Some menu items exist but do little, and big images can feel slow. When something misbehaves, it is probably the app, not you. Save often. PhotoCraft also keeps crash-recovery copies and offers to restore them the next time you start it." },
            { t: "h", text: "Start the app" },
            {
              t: "steps",
              items: [
                {
                  html: "Press the <kbd>Windows</kbd> key, type <b>PhotoCraft (ArtCraft)</b>, and press <kbd>Enter</kbd>.",
                  detail: "This shortcut starts photocraft.exe with extra options. --control 7878 opens a control channel on your own PC only (address 127.0.0.1), which is how Claude connects to the live window. --control-token-file names a password file that Claude's connection uses. The two automation root options limit the files Claude may open and save to your PhotoCraft work folder. You do not need to remember any of this.",
                  check: "A dark PhotoCraft window opens, about 1440 x 900 pixels, with the menus File Edit Image Layer Type Select Filter View Window Help along the top."
                },
                {
                  html: "Look at the start screen. You should see the title <b>PhotoCraft open source</b>, two buttons (<b>New document...</b> and <b>Open...</b>), the hint <i>Drop an image or PSD anywhere to open it</i>, and a Recent list.",
                  check: "You are looking at the start screen, with no document open yet."
                },
                {
                  html: "Make room for both windows. Click the PhotoCraft window, then press <kbd>Win</kbd>+<kbd>Right</kbd> to snap it to the right half of the screen. Snap this course to the left half with <kbd>Win</kbd>+<kbd>Left</kbd>.",
                  detail: "PhotoCraft draws its own title bar, with minimize, maximize and close buttons at top right. If Win+Arrow does not snap it, drag the title bar to the edge of the screen. PhotoCraft's smallest window size is 760 x 480, so you can make it quite small if needed."
                }
              ]
            },
            { t: "p", html: "If the Start-menu shortcut is missing, start the app from PowerShell instead. Both routes run the same thing:" },
            { t: "code", lang: "powershell", text: "{ROOT}\\ops\\scripts\\windows\\launch-app.ps1 -App photocraft" },
            { t: "h", text: "Your work folder" },
            { t: "p", html: "Everything you open and save for this course lives in one folder: <code>%USERPROFILE%\\ArtCraft\\PhotoCraft\\</code> (for example <code>C:\\Users\\you\\ArtCraft\\PhotoCraft</code>). Inside it, <code>practice\\</code> holds copies of the practice images, and <code>exports\\</code> is where finished pictures go. Open it in File Explorer now:" },
            { t: "code", lang: "powershell", text: "explorer \"$env:USERPROFILE\\ArtCraft\\PhotoCraft\"" },
            { t: "callout", kind: "tip", html: "<b>Why one folder?</b> Claude's connection to PhotoCraft can only open and save files inside this folder. That is deliberate. Even if you give Claude a vague or mistaken instruction, it cannot reach your Documents, your Desktop or anything else. Keep your work here and you get that protection for free." },
            { t: "h", text: "How the pieces fit together" },
            { t: "p", html: "PhotoCraft treats every action (a menu item, a shortcut, a button) as a named <b>command</b>. The menus run commands when you click them. Claude runs the very same commands through a connection called MCP. That is why Claude's edits show up in your History panel and can be undone with <kbd>Ctrl</kbd>+<kbd>Z</kbd> like anything you did yourself." },
            { t: "callout", kind: "adobe", html: "If you are watching Photoshop tutorials: PhotoCraft's menus (File, Edit, Image, Layer, Type, Select, Filter, View, Window, Help) and panel names (Layers, Properties, History, Channels, Paths) match Photoshop. Where PhotoCraft differs, this course says so." },
            {
              t: "quiz",
              items: [
                {
                  q: "Why do you start PhotoCraft from the Start-menu shortcut rather than only double-clicking the program file?",
                  choices: [
                    "The shortcut makes the window larger",
                    "The shortcut adds the options that let Claude connect to the window and limit it to your work folder",
                    "The program file cannot open images"
                  ],
                  answer: 1,
                  explain: "The shortcut passes the control channel, token file and folder-limit options. Without them the app works for hand editing, but Claude cannot connect to it."
                },
                {
                  q: "Where can Claude open and save files through the PhotoCraft connection?",
                  choices: [
                    "Anywhere on the computer",
                    "Only on the Desktop",
                    "Only inside your PhotoCraft work folder"
                  ],
                  answer: 2,
                  explain: "The connection is limited to the work folder (%USERPROFILE%\\ArtCraft\\PhotoCraft). This is a safety feature."
                }
              ]
            },
            { t: "check", html: "PhotoCraft is open on its start screen, you have found your work folder in File Explorer, and you can say in one sentence what the course, the app and Claude each do." }
          ]
        },
        {
          id: "m1-l2",
          title: "Open a practice image and tour the window",
          minutes: 14,
          goals: [
            "Open an image with the Open dialog and by drag and drop",
            "Name the main areas of the PhotoCraft window",
            "Show and hide panels, find a tool flyout, and use the search box"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "PhotoCraft opens JPEG, PNG, TIFF, WebP, PSD and many other formats. You will start with one of the practice images. Practice files are copies, but you will still avoid saving over them: the next lessons build that habit." },
            {
              t: "steps",
              items: [
                {
                  html: "On the start screen, click <b>Open...</b> (or press <kbd>Ctrl</kbd>+<kbd>O</kbd>). A standard Windows file dialog opens.",
                  detail: "File > Open uses the normal Windows file dialog, which is for you, not for Claude. Claude opens files with its own tool, covered in module 3."
                },
                {
                  html: "Click the address bar at the top of the dialog, paste <code>%USERPROFILE%\\ArtCraft\\PhotoCraft\\practice</code>, and press <kbd>Enter</kbd>. Select <b>great-wave.jpg</b> and click <b>Open</b>.",
                  detail: "The dialog may not remember the last folder you used, so pasting the path saves some clicking.",
                  check: "A tab named great-wave.jpg appears above the canvas, and the picture fills the middle of the window. The status bar at the bottom says Opened great-wave.jpg."
                },
                {
                  html: "Drag a different file, such as <b>earthrise.jpg</b>, from File Explorer onto the PhotoCraft window. Then close it with <kbd>Ctrl</kbd>+<kbd>W</kbd> (choose not to save if asked).",
                  check: "Dropping a file opens it in a new tab. Closing it returns you to great-wave.jpg."
                }
              ]
            },
            { t: "image", src: "../photocraft/docs/images/photocraft-demo.jpg", alt: "PhotoCraft showing the Great Wave image with the Properties and Layers panels on the right", caption: "PhotoCraft with the Great Wave open. This one has extra layers (text, a caption card, two adjustments), so yours will show a single Background layer." },
            { t: "h", text: "The main areas" },
            {
              t: "p",
              html: "<ul><li><b>Menu bar</b> (top left): File, Edit, Image, Layer, Type, Select, Filter, View, Window, Help. The document name is in the middle. At the right are a theme button (sun or moon), a search button, and the <b>Workspace</b> dropdown (Essentials).</li><li><b>Options bar</b> (under the menus): its contents change with the active tool. With the Move tool it shows <b>Auto-Select</b>; with the Crop tool it shows aspect-ratio controls.</li><li><b>Toolbar</b> (left column): the tools. A tiny triangle in a button's corner means more tools are hidden in a flyout. Below the tools are the foreground and background color swatches.</li><li><b>Document tab</b> (above the canvas): the file name, zoom, the active layer, and the color mode, like <code>great-wave.jpg @ 30.1% (Background, RGB/8)</code>. A <code>*</code> at the end means unsaved changes.</li><li><b>Canvas</b> (center): your picture.</li><li><b>Panel dock</b> (right): panels in tabbed groups. <b>Properties</b> and <b>Adjustments</b> sit at the top. <b>Layers</b>, <b>Channels</b> and <b>Paths</b> sit below. <b>Navigator</b>, <b>Histogram</b>, <b>Info</b>, <b>History</b>, <b>Color</b> and <b>Swatches</b> are in other groups. The thin icon strip beside the dock shows or hides them.</li><li><b>Status bar</b> (bottom): zoom percentage, color mode and bit depth (<code>RGB Color . 8 bit</code>), the pixel size of the image, the number of layers, and the last message.</li></ul>"
            },
            { t: "h", text: "Explore" },
            {
              t: "steps",
              items: [
                {
                  html: "Hover over the top tool in the toolbar. A tooltip shows its name and keyboard shortcut.",
                  check: "You see the name of the tool, which is Move, and its key, which is V."
                },
                {
                  html: "Find the Rectangular Marquee tool (a dashed square, second group). <b>Right-click it</b>, or press and hold, to open its flyout. Press <kbd>Esc</kbd> to close the flyout without changing anything.",
                  detail: "Tools that share a spot, such as the marquees and lassos, are grouped. Whichever you used last shows on the toolbar."
                },
                {
                  html: "Open the <b>Window</b> menu. It lists every panel. Click <b>History</b> to show the History panel, or <b>Histogram</b> to show the histogram.",
                  check: "The panel appears in the dock, usually as a tab or in a collapsed group you can open from the icon strip."
                },
                {
                  html: "Press <kbd>Tab</kbd> to hide every panel and give the canvas the whole window. Press <kbd>Tab</kbd> again to bring them back. <kbd>Shift</kbd>+<kbd>Tab</kbd> hides only the dock on the right."
                },
                {
                  html: "Click the sun or moon icon at the top right to switch between light and dark appearance. Switch back when you are done (<b>Window</b> menu, <b>Theme</b>, has the full list).",
                  detail: "Theme choices include Pro (default dark), Pro Medium Gray, Studio, Studio Light and Classic."
                },
                {
                  html: "Press <kbd>Ctrl</kbd>+<kbd>K</kbd> and type <b>curves</b>. This is the command search, the quickest way to find a command whose menu you have forgotten. Press <kbd>Esc</kbd> to close it."
                },
                {
                  html: "Open the <b>Workspace</b> dropdown at the top right, try <b>Photography</b>, and notice how the panels change. Return to <b>Essentials</b>. If your panels ever end up in odd places, use <b>Window</b> &gt; <b>Workspace</b> &gt; <b>Reset Workspace</b>."
                }
              ]
            },
            { t: "callout", kind: "note", html: "<b>The Layers panel buttons.</b> At the bottom of the Layers panel, from left to right, are buttons for linking layers, adding a layer style (fx), adding a mask, creating a fill or adjustment layer (the half-moon icon), creating a group, creating a new layer, and deleting a layer. Hover over each one to see its tooltip. You will use all of them in later modules." },
            {
              t: "quiz",
              items: [
                {
                  q: "A small triangle in the corner of a toolbar button means:",
                  choices: ["The tool is disabled", "More tools are grouped under it", "The tool is new"],
                  answer: 1,
                  explain: "It marks a flyout group. Right-click or press and hold the button to see the other tools."
                },
                {
                  q: "Where do you look to see the pixel size of the open image?",
                  choices: ["The status bar at the bottom", "The Layers panel", "The Window menu"],
                  answer: 0,
                  explain: "The status bar shows the width and height in pixels, for example 3859 x 2594 px, next to the color mode and the layer count."
                },
                {
                  q: "What does Tab do in PhotoCraft?",
                  choices: ["Switches to the next tool", "Hides or shows all panels", "Closes the document"],
                  answer: 1,
                  explain: "Tab hides every panel to give the canvas more room. Shift+Tab hides only the dock."
                }
              ]
            },
            { t: "check", html: "great-wave.jpg is open, you can point to the toolbar, options bar, canvas, Layers panel and status bar, and you have used Tab, the theme button and the Ctrl+K search." }
          ]
        },
        {
          id: "m1-l3",
          title: "Zoom, pan, and undo anything",
          minutes: 14,
          goals: [
            "Zoom and pan with the keyboard, mouse wheel and Navigator panel",
            "Explain why 100% zoom is the honest view of an image",
            "Undo, redo, and jump back to any earlier state with the History panel"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "Photo editing is half looking and half changing. You will zoom out to judge a whole picture, zoom in to fix a tiny flaw, and undo constantly while you experiment. These habits make everything else easier." },
            { t: "h", text: "Zoom and pan" },
            {
              t: "steps",
              items: [
                {
                  html: "With <b>great-wave.jpg</b> open, press <kbd>Ctrl</kbd>+<kbd>=</kbd> a few times to zoom in, then <kbd>Ctrl</kbd>+<kbd>-</kbd> to zoom out.",
                  check: "The zoom percentage in the status bar and in the document tab changes each time."
                },
                {
                  html: "Press <kbd>Ctrl</kbd>+<kbd>0</kbd> to fit the whole image in the window. Then press <kbd>Ctrl</kbd>+<kbd>1</kbd> to jump to 100%.",
                  detail: "At 100%, one pixel of the image is exactly one pixel of your screen. It is the only zoom level that shows true sharpness. At other zoom levels, PhotoCraft has to resample the picture for display, so fine detail can look softer or harsher than it really is.",
                  check: "The zoom reads 100% and you see only a part of the picture."
                },
                {
                  html: "Hold <kbd>Space</kbd> and drag with the mouse to pan. The cursor becomes a hand while the key is down. You can also press <kbd>H</kbd> for the Hand tool, or hold the middle mouse button.",
                  detail: "Holding Space gives you the Hand tool temporarily, whatever tool you were using. Release the key and your tool comes back."
                },
                {
                  html: "Try the mouse wheel. The wheel scrolls up and down, <kbd>Shift</kbd>+wheel scrolls sideways, and <kbd>Alt</kbd>+wheel zooms.",
                  detail: "If you prefer the wheel to zoom, Edit > Preferences > General has a Zoom with Scroll Wheel option that swaps the two behaviors."
                },
                {
                  html: "Open the <b>Navigator</b> panel (<b>Window</b> &gt; <b>Navigator</b>, or the icon strip beside the dock). Zoom in a lot, then drag inside the Navigator to move around the picture. Press <kbd>Ctrl</kbd>+<kbd>0</kbd> when you are done.",
                  check: "Moving in the Navigator moves the picture on the canvas."
                }
              ]
            },
            { t: "keys", items: [
              { keys: "Ctrl+=", action: "Zoom in" },
              { keys: "Ctrl+-", action: "Zoom out" },
              { keys: "Ctrl+0", action: "Fit the image on screen" },
              { keys: "Ctrl+1", action: "Zoom to 100%" },
              { keys: "Space (hold) + drag", action: "Pan" },
              { keys: "Alt + mouse wheel", action: "Zoom at the pointer" }
            ] },
            { t: "h", text: "Undo and the History panel" },
            { t: "p", html: "Every change you make is recorded as a <b>state</b>. Undo steps back one state; redo steps forward. The <b>History</b> panel is the list of all your states, so you can see what you did and jump straight to any point. History belongs to the open document and disappears when you close it, so it is a safety net while you work, not a substitute for saving." },
            {
              t: "steps",
              items: [
                {
                  html: "Open the History panel with <b>Window</b> &gt; <b>History</b>.",
                  check: "A list with the file name at the top (the document as you opened it)."
                },
                {
                  html: "Make a dramatic change: <b>Image</b> &gt; <b>Auto Tone</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd>). Then invert the colors: <b>Image</b> &gt; <b>Adjustments</b> &gt; <b>Invert</b> (<kbd>Ctrl</kbd>+<kbd>I</kbd>).",
                  check: "The picture becomes a color negative, and the History panel has gained an entry for each change."
                },
                {
                  html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to undo the invert, and again to undo the Auto Tone. Then press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> to redo one of them.",
                  check: "The picture steps back and forth. Entries you have undone stay in the History panel, shown faded, until you make a new edit."
                },
                {
                  html: "Click the invert entry in the History panel. Then click the file name at the top of the list.",
                  detail: "Clicking an entry jumps the document to exactly that state. You can click any entry to get there, however many steps away it is.",
                  check: "Clicking the top entry shows the original, unedited picture."
                },
                {
                  html: "Use <b>Edit</b> &gt; <b>Toggle Last State</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Z</kbd>) to flip between before and after of your latest change. This is a quick way to compare."
                },
                {
                  html: "When you are done, bring the picture back to normal: click the top History entry. If you ever want to throw away every unsaved change, use <b>File</b> &gt; <b>Revert</b> (<kbd>F12</kbd>)."
                }
              ]
            },
            { t: "keys", items: [
              { keys: "Ctrl+Z", action: "Undo" },
              { keys: "Ctrl+Shift+Z", action: "Redo" },
              { keys: "Ctrl+Alt+Z", action: "Toggle last state (before and after)" },
              { keys: "F12", action: "Revert to the last saved version" }
            ] },
            { t: "callout", kind: "warn", html: "<b>The History panel's bottom buttons do not work yet.</b> The three buttons at the bottom (create new snapshot, delete current state, create new document from current state) are drawn but ignore clicks in this version. Use the list itself and Undo, and do not rely on snapshots." },
            {
              t: "quiz",
              items: [
                {
                  q: "You are at 100% zoom. What does that mean?",
                  choices: [
                    "The image fills the window",
                    "One image pixel is shown as one screen pixel",
                    "The image has been enlarged to its maximum size"
                  ],
                  answer: 1,
                  explain: "100% is the true-pixel view. Fit on screen (Ctrl+0) is usually a much lower zoom, so details look different from what they really are."
                },
                {
                  q: "You close a document without saving. Can you still undo your edits from the History panel the next time you open the file?",
                  choices: ["Yes, history is stored in the file", "No, history is lost when the document closes"],
                  answer: 1,
                  explain: "History lives only while the document is open. Save a working file (next lesson) before you rely on your edits."
                }
              ]
            },
            { t: "exercise", title: "Make a mess, then recover", html: "Practice moving fast and undoing freely.", steps: [
              "Zoom to 100% (Ctrl+1) and pan to the tip of the biggest wave.",
              "Make four different changes from the Image menu (Auto Tone, Invert, Auto Contrast, Auto Color).",
              "Use the History panel to jump to the state after your second change.",
              "Use Toggle Last State to compare, then click the top entry to return to the original."
            ] },
            { t: "check", html: "You can zoom and pan three different ways, you can jump the document to any earlier state, and you know that closing the document loses its history." }
          ]
        },
        {
          id: "m1-l4",
          title: "Save, Save As, and Export",
          minutes: 15,
          goals: [
            "Tell a working file (keeps layers) from a delivery file (flattened)",
            "Save a work copy as a .pcraft file without touching the original",
            "Export a JPEG with the Export As dialog and choose its quality"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "Think of a photographer's negative and a print. The negative holds everything and can make many prints; the print is the finished, fixed result. Image files work the same way:" },
            { t: "p", html: "<ul><li>A <b>working file</b> keeps all your layers, masks, adjustments and editable text so you can change your mind later. PhotoCraft's own format is <b>.pcraft</b> (lossless, with autosave). <b>.psd</b> is Photoshop's format and also keeps layers.</li><li>A <b>delivery file</b> is a flat picture for sharing or the web: <b>.jpg</b>, <b>.png</b> or <b>.webp</b>. It cannot be edited the same way, because the layers have been combined.</li></ul>" },
            { t: "p", html: "The golden rule is simple: <b>never edit your only copy</b>. Save a working file first, then export deliveries from it." },
            { t: "h", text: "Save a working copy" },
            {
              t: "steps",
              items: [
                {
                  html: "With <b>great-wave.jpg</b> open, choose <b>File</b> &gt; <b>Save As...</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd>).",
                  detail: "If you press Ctrl+S on a JPEG, PhotoCraft opens Save As instead of writing over it. It will not flatten your file over the original."
                },
                {
                  html: "In the dialog, go to your work folder (<code>%USERPROFILE%\\ArtCraft\\PhotoCraft</code>) and name the file <code>great-wave-work.pcraft</code>. Click <b>Save</b>.",
                  detail: "PhotoCraft picks the format from the extension you type. Save As may suggest the original name and a .jpg extension, so check that you changed it to .pcraft (or .psd) or the layers will not be kept.",
                  check: "The document tab now shows great-wave-work.pcraft and has no * at the end."
                },
                {
                  html: "Make a small change (invert with <kbd>Ctrl</kbd>+<kbd>I</kbd>). Notice the <b>*</b> appear in the tab. Press <kbd>Ctrl</kbd>+<kbd>S</kbd>.",
                  check: "The * disappears. For a .pcraft or .psd file, Save writes back to the same file without asking."
                },
                {
                  html: "Undo the invert (<kbd>Ctrl</kbd>+<kbd>Z</kbd>) and save again so the work file holds the normal picture."
                }
              ]
            },
            { t: "h", text: "Export a delivery file" },
            {
              t: "steps",
              items: [
                {
                  html: "Choose <b>File</b> &gt; <b>Export</b> &gt; <b>Export As...</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd>). The <b>File Settings</b> panel opens with a live preview.",
                  check: "You see a Format choice, a preview of your picture, and an estimated file size."
                },
                {
                  html: "Set <b>Format</b> to <b>JPG</b> and drag the <b>Quality</b> slider. Watch the estimated size and the preview change: high quality gives a big file that looks great, and low quality gives a small file with blocky artifacts.",
                  detail: "JPEG is lossy: it throws away detail your eye is unlikely to miss, and the lower the quality, the more it discards. For photos, 80 to 90 is a good balance."
                },
                {
                  html: "Set Quality to about 80, click <b>Export</b>, and save as <code>%USERPROFILE%\\ArtCraft\\PhotoCraft\\exports\\great-wave-web.jpg</code>.",
                  check: "A file named great-wave-web.jpg appears in your exports folder."
                },
                {
                  html: "Open the exported file in PhotoCraft (<kbd>Ctrl</kbd>+<kbd>O</kbd>) and compare it with the original at 100% zoom.",
                  detail: "Leave the exported JPG alone from here on. If you edit and save a JPG again and again, quality drops each time. Always go back to the working file."
                }
              ]
            },
            { t: "p", html: "<b>Which format should you choose?</b><ul><li><b>JPG</b>: photos. Small files, no transparency.</li><li><b>PNG</b>: graphics, screenshots, anything with sharp edges or transparency. Lossless, bigger files.</li><li><b>WebP</b>: modern web format, lossless or lossy, supports transparency.</li><li><b>TIFF</b> and <b>TGA</b>: print and production workflows.</li><li><b>PSD / .pcraft</b>: working files, not for sharing with people who lack an editor.</li></ul>" },
            { t: "callout", kind: "warn", html: "<b>Transparency and JPEG.</b> JPEG cannot store transparency. If you export a picture with transparent areas as JPG, PhotoCraft flattens it over white. Choose PNG or WebP when you need transparency. PhotoCraft also has no old-style JPEG options dialog with a quality scale of 0 to 12: use <b>Export As</b> and its Quality slider." },
            { t: "callout", kind: "tip", html: "<b>Quick Export as PNG</b> (<b>File</b> &gt; <b>Export</b>) skips the dialog and writes a PNG next to your document, or asks where to save it if the document has not been saved yet." },
            { t: "callout", kind: "adobe", html: "In Photoshop tutorials this is <b>File &gt; Export &gt; Export As</b>, and the older <b>Save for Web (Legacy)</b>. PhotoCraft has both in the menu, but Export As is the one to use here." },
            {
              t: "quiz",
              items: [
                {
                  q: "You want to keep your layers and masks so you can keep editing later. Which should you save?",
                  choices: ["great-wave.jpg", "great-wave-work.pcraft", "great-wave-web.jpg"],
                  answer: 1,
                  explain: "A .pcraft (or .psd) file keeps layers and masks. JPG flattens everything."
                },
                {
                  q: "Which format can store transparent areas?",
                  choices: ["JPG", "PNG", "Both"],
                  answer: 1,
                  explain: "PNG (and WebP) keep transparency. JPG flattens transparent areas over white."
                }
              ]
            },
            { t: "exercise", title: "One picture, three deliveries", html: "Compare formats for yourself with your work file.", steps: [
              "Export the picture as PNG, as JPG at quality 90, and as JPG at quality 40, all into the exports folder.",
              "In File Explorer, switch to Details view and compare the three file sizes.",
              "Open all three in PhotoCraft and zoom to 100% on the foam of the wave. Which differences can you see?"
            ] },
            { t: "check", html: "You have <code>great-wave-work.pcraft</code> in your work folder and <code>great-wave-web.jpg</code> in your exports folder, and the original in <code>practice\\</code> is untouched." }
          ]
        }
      ]
    },
    {
      id: "m2",
      title: "Pixels and color",
      summary: "What an image really is: a grid of pixels, each one a mix of red, green and blue. You will zoom into pixels, resize safely, read color values, and make your first brush strokes.",
      lessons: [
        {
          id: "m2-l1",
          title: "Pixels, resolution, and image size",
          minutes: 15,
          goals: [
            "Explain what a pixel is and read an image's pixel size and megapixel count",
            "Tell pixel dimensions apart from resolution (pixels per inch)",
            "Use Image Size, and see why enlarging an image cannot add real detail"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "A digital picture is a grid of tiny colored squares called <b>pixels</b>. Each pixel holds exactly one color, and your eye blends thousands of them into a smooth image. The picture's <b>pixel dimensions</b> are the width and height of the grid, for example 3859 x 2594. Multiply those two numbers and you get the total: about 10 million pixels, or <b>10 megapixels</b>." },
            { t: "p", html: "This matters because pixels are all the information there is. Edits move, recolor or blend pixels. Making an image smaller throws pixels away. Making it bigger has to invent new ones, and invented pixels carry no real detail." },
            { t: "h", text: "See the pixels" },
            {
              t: "steps",
              items: [
                {
                  html: "Open <b>great-wave.jpg</b> from your practice folder. Read the pixel size in the status bar at the bottom, next to the color mode.",
                  check: "You see something like 3859 x 2594 px. Your file may be a little different."
                },
                {
                  html: "Click the zoom number at the bottom left of the window, type <b>1600</b>, and press <kbd>Enter</kbd>. (You can also press <kbd>Ctrl</kbd>+<kbd>=</kbd> repeatedly.) Hold <kbd>Space</kbd> and drag to pan to some foam on the wave.",
                  check: "The smooth picture has become a mosaic of individual flat-colored squares."
                },
                {
                  html: "Turn on <b>View</b> &gt; <b>Show</b> &gt; <b>Pixel Grid</b> to draw lines between pixels. Turn it off again when you have seen it.",
                  detail: "The pixel grid only appears when you are zoomed in far enough for grid lines to make sense."
                },
                {
                  html: "Press <kbd>Ctrl</kbd>+<kbd>0</kbd> to fit the image back on screen."
                }
              ]
            },
            { t: "h", text: "Image Size: shrink, enlarge, and watch what happens" },
            { t: "p", html: "You are about to resize the picture. Do this on a throwaway copy so the original stays safe." },
            {
              t: "steps",
              items: [
                {
                  html: "Make a scratch copy: <b>Image</b> &gt; <b>Duplicate...</b> and confirm. A second tab opens.",
                  check: "A new tab appears with a copy of the picture."
                },
                {
                  html: "In the copy, open <b>Image</b> &gt; <b>Image Size...</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd>). You see <b>Width</b>, <b>Height</b>, <b>Resolution</b> (pixels per inch), and a <b>Resample</b> checkbox. A link icon between Width and Height, <b>Constrain proportions</b>, keeps the picture's shape.",
                  detail: "With Constrain proportions on, changing the width changes the height by the matching amount, so nothing gets stretched."
                },
                {
                  html: "Make sure <b>Resample</b> is checked and Constrain proportions is on. Set <b>Width</b> to <b>600</b> pixels and click <b>OK</b>.",
                  check: "The picture is now about 600 pixels wide. The status bar shows the new size."
                },
                {
                  html: "Open Image Size again and set the width back to the original number (for example 3859). Click <b>OK</b>. Then compare this copy with the original tab at 100% zoom (<kbd>Ctrl</kbd>+<kbd>1</kbd>).",
                  check: "The copy is the same size as before but visibly soft and smeared. The detail you threw away did not come back."
                },
                {
                  html: "Close the scratch copy with <kbd>Ctrl</kbd>+<kbd>W</kbd> and choose <b>not</b> to save it."
                }
              ]
            },
            { t: "callout", kind: "note", html: "<b>Resolution is not size.</b> The <b>Resolution</b> number (pixels per inch, or ppi) only matters for printing: it tells a printer how many pixels to squeeze into each inch of paper. A 1200 x 1800 pixel image prints 4 x 6 inches at 300 ppi, or 12 x 18 inches at 100 ppi, but it still has the same 1200 x 1800 pixels. If you uncheck <b>Resample</b> in the Image Size dialog and change Resolution, the pixel Dimensions line does not change. For screens and the web, only pixel dimensions matter." },
            { t: "p", html: "<b>Rules of thumb</b><ul><li>Shrink freely, enlarge rarely. Shrinking is safe because you only lose pixels you did not need.</li><li>Always resize a copy or do it at export time, never in your only working file.</li><li>Useful sizes: a full-screen HD picture is 1920 x 1080. A 4K screen is 3840 x 2160. Social media and web galleries rarely need more than 1080 to 2000 pixels on the long side.</li></ul>" },
            { t: "callout", kind: "tip", html: "<b>Resample options.</b> The Resample dropdown lists methods such as Bicubic (smooth gradients), Lanczos (sharp), Bilinear, Nearest Neighbor (hard edges) and Preserve Details. They change how new pixels are guessed, but none of them can add true detail. PhotoCraft has no AI upscaler." },
            {
              t: "quiz",
              items: [
                {
                  q: "An image is 4000 x 3000 pixels. About how many megapixels is that?",
                  choices: ["1.2", "7", "12"],
                  answer: 2,
                  explain: "4000 x 3000 = 12,000,000 pixels, or 12 megapixels."
                },
                {
                  q: "You make a small image bigger with Resample on. What happens to the detail?",
                  choices: [
                    "New real detail is recovered",
                    "The picture gets more pixels, but no new real detail",
                    "Nothing changes"
                  ],
                  answer: 1,
                  explain: "Resampling invents new pixels by averaging nearby ones. The picture can look smoother, but it cannot show anything that was not captured."
                },
                {
                  q: "Which setting changes how many pixels the picture contains?",
                  choices: ["Resolution with Resample off", "Width and Height with Resample on", "The zoom level"],
                  answer: 1,
                  explain: "Only resampling adds or removes pixels. Resolution without Resample, and zoom, change nothing about the pixels themselves."
                }
              ]
            },
            { t: "check", html: "You have seen individual pixels at high zoom, turned a 3859-pixel-wide copy into 600 pixels and back, seen that the detail did not return, and closed the copy without saving." }
          ]
        },
        {
          id: "m2-l2",
          title: "Color: RGB, channels, and swatches",
          minutes: 15,
          goals: [
            "Explain how red, green and blue light mix to make every color on screen",
            "Read a pixel's red, green and blue values with the Info panel",
            "Pick colors with the Eyedropper and use the foreground and background swatches"
          ],
          assets: ["earthrise"],
          blocks: [
            { t: "p", html: "Your screen makes color by mixing three lights: <b>red</b>, <b>green</b> and <b>blue</b> (RGB). Every pixel stores three numbers, one for each light, from 0 (off) to 255 (full strength) in the common <b>8-bit</b> format. That gives 256 x 256 x 256, about 16.7 million possible colors." },
            { t: "p", html: "<ul><li>(255, 0, 0) is pure red. (0, 255, 0) is pure green. (0, 0, 255) is pure blue.</li><li>Red plus green light makes <b>yellow</b>: (255, 255, 0). This surprises people who mix paint, but light adds up.</li><li>(0, 0, 0) is black and (255, 255, 255) is white. Any pixel with three equal numbers is a shade of gray.</li></ul>" },
            { t: "p", html: "PhotoCraft stores each of the three numbers as its own grayscale picture called a <b>channel</b>. The <b>Channels</b> panel lets you look at them." },
            {
              t: "steps",
              items: [
                {
                  html: "Open <b>earthrise.jpg</b>. Look at the status bar: it should say <b>RGB Color . 8 bit</b>.",
                  detail: "PhotoCraft also supports Grayscale, CMYK and Lab color, and 16-bit and 32-bit depth, through the Image > Mode menu. For screens and the web, RGB with 8 bits is the right choice, and the course stays there."
                },
                {
                  html: "In the dock, click the <b>Channels</b> tab (next to Layers). You see rows for RGB, Red, Green and Blue.",
                  check: "Four rows with small thumbnails and eye icons."
                },
                {
                  html: "Click the eye icons next to the color channels to switch channels off and on, and watch how the picture's colors change. Then make sure every eye is on again.",
                  check: "Switching channels off changes the colors of the picture. With all eyes on, the original picture is back."
                },
                {
                  html: "Click the top <b>RGB</b> row so that it is the targeted channel again.",
                  detail: "Clicking a channel row also targets it, which means tools paint on that single channel. Before you edit anything, make sure RGB is targeted."
                },
                {
                  html: "Open the <b>Info</b> panel (<kbd>F8</kbd>, or <b>Window</b> &gt; <b>Info</b>). Move the pointer over the blue ocean of Earth, a white cloud and the black sky, and read the R, G and B numbers.",
                  check: "Clouds read high in all three channels, the black sky reads close to 0, and the ocean has a much larger blue number than red."
                },
                {
                  html: "Press <kbd>I</kbd> to select the <b>Eyedropper</b>, then click on the ocean. Look at the <b>foreground swatch</b> near the bottom of the toolbar.",
                  check: "The foreground swatch (the front square) now has the blue of the ocean."
                },
                {
                  html: "Click the foreground swatch to open the color picker and choose a bright color of your own. Then press <kbd>D</kbd> to reset the swatches to black and white, and <kbd>X</kbd> to swap foreground and background.",
                  check: "After D you see black in front of white. After X it is white in front of black."
                }
              ]
            },
            { t: "keys", items: [
              { keys: "I", action: "Eyedropper (click to pick a color)" },
              { keys: "D", action: "Default colors (black foreground, white background)" },
              { keys: "X", action: "Swap foreground and background colors" },
              { keys: "F8", action: "Show the Info panel" },
              { keys: "F6", action: "Show the Color panel" }
            ] },
            { t: "callout", kind: "warn", html: "<b>Color mode and bit depth are yours to change, not Claude's.</b> Through the live PhotoCraft connection, Claude is not allowed to run the Image &gt; Mode commands. That is a safety choice, and for this course you never need to change modes anyway." },
            {
              t: "quiz",
              items: [
                {
                  q: "A pixel has the values R=255, G=255, B=0. What color is it?",
                  choices: ["White", "Yellow", "Cyan"],
                  answer: 1,
                  explain: "Red and green light together make yellow. Red, green and blue all at 255 would be white."
                },
                {
                  q: "A pixel reads R=90, G=90, B=90. It is:",
                  choices: ["A dark gray", "A dark red", "Pure black"],
                  answer: 0,
                  explain: "Equal red, green and blue values always make a gray. Lower numbers mean darker."
                },
                {
                  q: "Why click the RGB row in the Channels panel before editing?",
                  choices: [
                    "It saves the file",
                    "It makes sure your edits go to the whole picture, not a single channel",
                    "It makes the picture brighter"
                  ],
                  answer: 1,
                  explain: "Tools paint on the targeted channel. RGB targets all of them together."
                }
              ]
            },
            { t: "exercise", title: "Color detective", html: "Use the Info panel and Eyedropper to answer questions about the picture.", steps: [
              "Find the brightest spot on the Moon's surface and write down its R, G and B values.",
              "Find a pixel in the black sky that is not exactly 0, 0, 0.",
              "Pick the color of the Earth's ocean with the Eyedropper, then press X. Which swatch has which color?"
            ] },
            { t: "check", html: "You can say what the three numbers of a pixel mean, you have read values with the Info panel, and your foreground swatch matched a color you picked from the image." }
          ]
        },
        {
          id: "m2-l3",
          title: "Your first brush strokes on a blank canvas",
          minutes: 15,
          goals: [
            "Create a new blank document with the New Document dialog",
            "Paint with the Brush and control its size, hardness and opacity",
            "Use the Eraser and undo, and explain what antialiasing does to pixels"
          ],
          assets: [],
          blocks: [
            { t: "p", html: "A brush does not draw a continuous line. It stamps a soft or hard dot (a <b>dab</b>) again and again along the path your mouse takes. Three settings shape the result: <b>size</b> (how big the dab is), <b>hardness</b> (hard edge or feathered edge) and <b>opacity</b> (how see-through the paint is). You will learn them on a blank canvas, which also shows you how to start a document from scratch." },
            { t: "h", text: "Create a blank document" },
            {
              t: "steps",
              items: [
                {
                  html: "Press <kbd>Ctrl</kbd>+<kbd>N</kbd> (<b>File</b> &gt; <b>New...</b>). A dialog lists blank document presets, and the right side shows <b>Preset Details</b>.",
                  detail: "The details include Name, Width, Height, Orientation, Resolution, Color Mode and Background Contents."
                },
                {
                  html: "Set the name to <b>brush-practice</b>, the width to <b>1200</b> and the height to <b>800</b> (make sure the unit is <b>Pixels</b>). Set Color Mode to <b>RGB Color</b> and Background Contents to <b>White</b>. Click <b>Create</b>.",
                  check: "A new tab named brush-practice opens with a white canvas. The status bar shows 1200 x 800 px."
                }
              ]
            },
            { t: "h", text: "Paint" },
            {
              t: "steps",
              items: [
                {
                  html: "Press <kbd>D</kbd> so the foreground color is black. Press <kbd>B</kbd> for the <b>Brush</b> tool.",
                  detail: "Pressing B may select a different tool in the same group, such as the Pencil. If the options bar does not show brush controls, right-click the brush button in the toolbar and choose Brush."
                },
                {
                  html: "Look at the options bar. Open the <b>Brush Preset picker</b> and find the <b>Size</b> and <b>Hardness</b> controls. Set Size to about 60 and Hardness to 100%. Drag a stroke across the canvas.",
                  check: "A solid black stroke with a crisp edge."
                },
                {
                  html: "Lower the hardness to 0% and paint a second stroke below the first.",
                  check: "The second stroke fades softly at its edges."
                },
                {
                  html: "Use <kbd>[</kbd> and <kbd>]</kbd> to make the brush smaller or larger, and <kbd>Shift</kbd>+<kbd>[</kbd> and <kbd>Shift</kbd>+<kbd>]</kbd> to make it softer or harder. Paint a few strokes of different sizes.",
                  detail: "You can also hold Alt and drag with the right mouse button to resize the brush on the canvas."
                },
                {
                  html: "Press <kbd>5</kbd> on the keyboard to set the brush opacity to about 50%. Paint two overlapping strokes.",
                  check: "Where the strokes overlap, the black is darker than where they do not: low-opacity paint builds up."
                },
                {
                  html: "Click the foreground swatch, pick a color, and paint with it. Press <kbd>E</kbd> for the <b>Eraser</b> and rub out part of a stroke."
                },
                {
                  html: "Zoom to 800% on the edge of a hard stroke (type 800 in the status bar zoom box). Look at the edge pixels.",
                  detail: "A hard edge is not made of only black and white pixels. Along the boundary there are pixels in intermediate grays. This is antialiasing: those in-between pixels trick your eye into seeing a smooth curve instead of a staircase.",
                  check: "A thin ramp of gray pixels between black and white along the edge."
                },
                {
                  html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> several times and watch your strokes disappear one by one. Redo with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd>."
                }
              ]
            },
            { t: "keys", items: [
              { keys: "B", action: "Brush" },
              { keys: "E", action: "Eraser" },
              { keys: "[ and ]", action: "Smaller and larger brush" },
              { keys: "Shift+[ and Shift+]", action: "Softer and harder brush" },
              { keys: "1 to 0", action: "Set tool opacity in steps from 10% to 100%" }
            ] },
            { t: "callout", kind: "note", html: "Right now every stroke is painted directly into the single white layer, so it is permanent apart from undo. In the next modules you will learn to paint on separate layers so you can always change your mind." },
            { t: "callout", kind: "tip", html: "If you have a pen tablet, PhotoCraft reads pen pressure through Windows, so pressing harder can make the stroke thicker or darker. With a mouse every stroke has the same weight." },
            {
              t: "quiz",
              items: [
                {
                  q: "You want a soft, airbrushed edge. Which setting do you lower?",
                  choices: ["Size", "Hardness", "Zoom"],
                  answer: 1,
                  explain: "Hardness controls how quickly the brush fades at its edge. 0% is the softest."
                },
                {
                  q: "Why do two overlapping strokes at 50% opacity look darker where they cross?",
                  choices: [
                    "The brush is broken",
                    "Each stroke adds paint on top of what is already there",
                    "Overlap makes the screen brighter"
                  ],
                  answer: 1,
                  explain: "Paint at partial opacity lets what is underneath show through, and a second layer of it builds up more color."
                }
              ]
            },
            { t: "exercise", title: "Paint a simple sunset", html: "Use only soft brushes and low opacity.", steps: [
              "Set the foreground to a dark blue and paint a large soft stroke across the top third.",
              "Paint a band of orange across the middle with a soft brush at about 30% opacity.",
              "Add a yellow glow near the horizon, then a small hard white circle for the sun.",
              "Undo until the canvas is empty, then redo your way back, and save it with File > Save As as brush-practice.pcraft in your work folder."
            ] },
            { t: "check", html: "You made a new 1200 x 800 document, painted hard and soft strokes with different opacity, and you can say what antialiasing is." }
          ]
        }
      ]
    },
    {
      id: "m3",
      title: "Working with Claude",
      summary: "Connect Claude Code to the live PhotoCraft window, let it look and edit, undo it, keep control of the results, and learn prompt patterns that get good work done.",
      lessons: [
        {
          id: "m3-l1",
          title: "Connect Claude Code to PhotoCraft",
          minutes: 14,
          goals: [
            "Explain what MCP is and what the photocraft and photocraft-headless servers do",
            "Start PhotoCraft first and then Claude Code in your work folder",
            "Check the connection with /mcp and fix the common problems"
          ],
          assets: [],
          blocks: [
            { t: "p", html: "<b>Claude Code</b> is an AI agent that runs in a terminal window. On its own it works with text and files. To work with PhotoCraft it uses <b>MCP</b> (Model Context Protocol), a standard way for an app to hand an AI a list of tools. PhotoCraft's tools let Claude look at your document, run any editing command from the menus, and take screenshots of the window." },
            { t: "p", html: "Two MCP servers are registered for you (by <code>register-mcp.ps1</code> during setup):" },
            { t: "p", html: "<ul><li><b>photocraft</b>: the bridge to the <i>running</i> app. Everything Claude does shows up live in the PhotoCraft window, in your Layers and History panels. This is the one you will use most.</li><li><b>photocraft-headless</b>: works on image files directly, with no window. It is slower to watch but excellent for batch jobs, like resizing a whole folder. You will use it in module 8.</li></ul>" },
            { t: "p", html: "In Claude Code, the live server's tools appear with names like <code>mcp__photocraft__doc_inspect</code> and <code>mcp__photocraft__command_run</code>. You will see these names when Claude asks permission to use a tool." },
            { t: "h", text: "Connect" },
            {
              t: "steps",
              items: [
                {
                  html: "<b>Start PhotoCraft first</b>, from the Start-menu shortcut <b>PhotoCraft (ArtCraft)</b>.",
                  detail: "PhotoCraft creates the connection's token file when it starts. The photocraft server reads that file the moment Claude Code starts, so the app must already be running.",
                  check: "PhotoCraft is open on its start screen or with a document."
                },
                {
                  html: "Open <b>Windows Terminal</b> or PowerShell. Go to your work folder and start Claude Code (commands below).",
                  detail: "Starting Claude in the work folder means its own file tools also work in that folder, which keeps things tidy and safe.",
                  check: "Claude Code's welcome screen and a prompt box appear."
                },
                {
                  html: "At the Claude Code prompt, type <code>/mcp</code> and press <kbd>Enter</kbd>.",
                  check: "A list shows both photocraft and photocraft-headless as connected."
                },
                {
                  html: "Type your first request (see the box below). Claude Code will ask permission the first time it wants to use a tool. Read the prompt, then allow it."
                }
              ]
            },
            { t: "code", lang: "powershell", text: "cd $env:USERPROFILE\\ArtCraft\\PhotoCraft\nclaude" },
            {
              t: "claude",
              title: "Say hello to PhotoCraft",
              html: "Nothing here changes your picture. It just shows Claude is connected.",
              prompts: [
                {
                  prompt: "Which PhotoCraft tools do you have available right now? List them, one short line each, and tell me which ones only work with the live PhotoCraft window.",
                  why: "Claude reads the tool list the photocraft and photocraft-headless servers gave it. You should see names such as doc_inspect, command_run, ui_screenshot and doc_open. Tools that start with ui_ only exist on the live server because they need the window."
                }
              ]
            },
            { t: "callout", kind: "warn", html: "<b>If photocraft shows as failed or not connected:</b><ol><li>Was PhotoCraft started from the Start-menu shortcut (or <code>launch-app.ps1 -App photocraft</code>)? An app started without the control options cannot be reached. Close it and start it from the shortcut.</li><li>Did you start Claude Code before PhotoCraft? In Claude Code run <code>/mcp</code> and reconnect photocraft, or type <code>/exit</code> and run <code>claude</code> again.</li><li>Is a second copy of PhotoCraft running? Only one copy can use control port 7878. Close extra copies.</li><li>Does the token file exist? Run <code>Test-Path \"$env:LOCALAPPDATA\\ArtCraft\\tokens\\photocraft-control.token\"</code> in PowerShell. It should print True.</li></ol>" },
            { t: "callout", kind: "note", html: "<b>Who can drive the app?</b> The control channel only listens on your own PC (127.0.0.1), and it needs the token file as a password. There are no per-tool permissions inside PhotoCraft, so anyone who can read that token file can control the app. Keep the file private, and use Claude Code's own permission prompts as your gate: you decide each time whether Claude may call a tool." },
            {
              t: "quiz",
              items: [
                {
                  q: "What is the correct startup order?",
                  choices: [
                    "Claude Code first, then PhotoCraft",
                    "PhotoCraft first (from the shortcut), then Claude Code in your work folder",
                    "Either order works the same"
                  ],
                  answer: 1,
                  explain: "The photocraft server reads PhotoCraft's token file as soon as Claude Code starts, so PhotoCraft must already be running."
                },
                {
                  q: "Which server would you use to resize a folder of 50 images without opening a window?",
                  choices: ["photocraft", "photocraft-headless"],
                  answer: 1,
                  explain: "photocraft-headless works on files directly and needs no window."
                }
              ]
            },
            { t: "check", html: "<code>/mcp</code> shows photocraft connected, Claude has listed its PhotoCraft tools, and you know what to try if the connection fails." }
          ]
        },
        {
          id: "m3-l2",
          title: "Let Claude look first: state and screenshots",
          minutes: 13,
          goals: [
            "Describe the two ways Claude can look at your work: structured state and screenshots",
            "Ask Claude to open a practice file using a safe relative path",
            "Explain why Claude's view is limited, and why that matters"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "Claude cannot see your screen the way you can. It looks through tools, and it is worth knowing which:" },
            { t: "p", html: "<ul><li><b>Structured state</b>, as exact text and numbers: which documents are open (<code>session_list</code>), the layer tree, the history list, the selection and the active layer (<code>doc_inspect</code>), and which tool and panels the app is showing (<code>ui_inspect</code>).</li><li><b>Pictures</b>: a screenshot of the PhotoCraft window (<code>ui_screenshot</code>) and a preview render of the document (<code>doc_render_preview</code>). With the live app, both are images of the window, shrunk to at most 2048 pixels on the long side.</li></ul>" },
            { t: "p", html: "So Claude is good at facts (layer names, numbers, whether a mask exists) and decent at big visual judgments (too dark, too orange), but it does not see every pixel. That is why you stay in charge of how a picture <i>looks</i>." },
            { t: "h", text: "Try it" },
            {
              t: "steps",
              items: [
                "Start PhotoCraft from the shortcut and open <b>great-wave.jpg</b> by hand, as you did in module 1.",
                "Arrange your windows so you can see PhotoCraft and the Claude Code terminal at the same time.",
                "Paste the first prompt below into Claude Code and compare Claude's answer with what you see in the status bar and Layers panel."
              ]
            },
            {
              t: "claude",
              title: "Ask Claude to inspect, not change",
              html: "These prompts only read. Watch for a permission prompt the first time each tool is used.",
              prompts: [
                {
                  prompt: "List the documents open in PhotoCraft. For the active one, tell me its name, pixel size, number of layers, and whether it has unsaved changes. Don't change anything.",
                  why: "Claude calls mcp__photocraft__session_list and mcp__photocraft__doc_inspect, which only read. Check its numbers against the status bar at the bottom of the PhotoCraft window."
                },
                {
                  prompt: "Take a screenshot of the PhotoCraft window and describe what you see: which tool is active, which panels are open, and what the picture looks like.",
                  why: "Claude uses mcp__photocraft__ui_inspect for the facts and mcp__photocraft__ui_screenshot for a picture of the window. Notice how it can read panel names but only estimates colors and tones."
                },
                {
                  prompt: "What are the red, green and blue values of the pixel at x=100, y=100 in the active document?",
                  why: "Claude runs the document.pixel command through mcp__photocraft__command_run. Use the Info panel in PhotoCraft to check a pixel by hand and see how exact numbers beat eyeballing."
                },
                {
                  prompt: "Open the file practice/great-wave.jpg in PhotoCraft and leave any other open documents as they are.",
                  why: "Claude calls mcp__photocraft__doc_open with the relative path practice/great-wave.jpg. A second tab (or the same picture again) opens in the window. Claude never uses the Windows Open dialog."
                }
              ]
            },
            { t: "h", text: "The path rule" },
            { t: "p", html: "Claude opens and saves files with paths that are <b>relative to your work folder</b>, written with forward slashes: <code>practice/great-wave.jpg</code> or <code>exports/result.jpg</code>. Absolute paths such as <code>C:\\Users\\...</code>, backslashes, <code>..</code> and device names are refused, and when no work folder is set both open and save fail rather than guess. This is the safety fence from module 1 at work." },
            { t: "callout", kind: "tip", html: "<b>Name files in your prompts.</b> Say <code>practice/pearl-earring.jpg</code>, not just the portrait. Short, exact paths avoid mistakes." },
            { t: "callout", kind: "note", html: "<b>Claude has two sets of hands.</b> Claude Code itself can also read and write files in the folder where you started it, with its own tools (a separate permission system). PhotoCraft's tools are the ones that touch the open image. The fence described above applies to those." },
            {
              t: "quiz",
              items: [
                {
                  q: "Which tool gives Claude an exact list of your layers?",
                  choices: ["ui_screenshot", "doc_inspect", "doc_open"],
                  answer: 1,
                  explain: "doc_inspect returns the layer tree, history, selection and active layer as structured data."
                },
                {
                  q: "Which path would Claude's doc_open accept?",
                  choices: ["C:\\Users\\me\\Pictures\\a.jpg", "..\\a.jpg", "practice/great-wave.jpg"],
                  answer: 2,
                  explain: "Only forward-slash paths relative to the work folder are accepted."
                }
              ]
            },
            { t: "check", html: "Claude has described your open document accurately, taken a screenshot, and opened <code>practice/great-wave.jpg</code> using a relative path." }
          ]
        },
        {
          id: "m3-l3",
          title: "Your first edit made by Claude",
          minutes: 14,
          goals: [
            "Ask Claude to make an edit and watch it appear in the window",
            "Explain what a PhotoCraft command is and how command ids map to menus",
            "Ask Claude to explain exactly what it did"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "Everything you can do in PhotoCraft is a <b>command</b> with an id. The menu item <b>Layer &gt; New Adjustment Layer &gt; Vibrance</b> is the command <code>layer.newAdjustmentLayer.vibrance</code>. <b>Image &gt; Image Size</b> is <code>image.imageSize</code>. <b>Edit &gt; Undo</b> is <code>edit.undo</code>. The ids follow the menu path, which makes them easy to guess, and there are hundreds of them." },
            { t: "p", html: "Claude has two key tools for commands: <code>command_list</code> to discover what exists (with each command's parameters), and <code>command_run</code> to run one. Because Claude uses the same commands as the menus, whatever it does lands in your History panel exactly like your own clicks." },
            { t: "h", text: "Watch Claude work" },
            {
              t: "steps",
              items: [
                "Open <b>great-wave.jpg</b> in PhotoCraft and show the Layers panel and the History panel (Window menu).",
                "Place the PhotoCraft window where you can see it while you type to Claude.",
                "Paste the first prompt below into Claude Code and watch PhotoCraft as Claude works. Allow the tool calls when asked."
              ]
            },
            {
              t: "claude",
              title: "A first edit, then an explanation",
              html: "Do the three prompts in order.",
              prompts: [
                {
                  prompt: "Add a Vibrance adjustment layer to the open document with vibrance set to +40. Then show me the layer list.",
                  why: "Claude runs layer.newAdjustmentLayer.vibrance through mcp__photocraft__command_run, then mcp__photocraft__doc_inspect. In PhotoCraft you should see a new Vibrance 1 layer above Background, the Properties panel showing its settings, and a new History entry."
                },
                {
                  prompt: "How did you do that? Tell me the exact command ids and parameters you used, and which PhotoCraft menu item does the same thing.",
                  why: "Claude explains from what it just did. Try to repeat the same edit by hand afterward: Layer menu, New Adjustment Layer, Vibrance."
                },
                {
                  prompt: "Search PhotoCraft's commands for ones related to blurring and list the first ten with a one-line description each. Don't run any of them.",
                  why: "Claude calls mcp__photocraft__command_list with a filter. This is how it finds commands it was not told about, and how you can find out what is possible."
                }
              ]
            },
            {
              t: "steps",
              items: [
                {
                  html: "In the Layers panel, click the <b>eye</b> next to the new Vibrance layer to hide it, then show it again.",
                  check: "The picture's colors get richer or duller as the eye goes on and off. That is how you compare before and after."
                },
                {
                  html: "Click the Vibrance layer and look at the <b>Properties</b> panel. Drag the Vibrance slider by hand.",
                  check: "You can change what Claude did, just like any layer you made yourself."
                },
                {
                  html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> in PhotoCraft to undo the slider move, or click the entry above it in the History panel."
                }
              ]
            },
            { t: "callout", kind: "adobe", html: "In Photoshop tutorials this layer is made with <b>Layer &gt; New Adjustment Layer &gt; Vibrance</b> or the half-moon button at the bottom of the Layers panel. Photoshop has no command ids you can search: this is a PhotoCraft extra that makes automation easy." },
            { t: "callout", kind: "note", html: "<b>Parameters.</b> Each command has settings called parameters, such as <code>vibrance</code> for the Vibrance layer or <code>radius</code> for a Gaussian blur. Claude learns them from <code>command_list</code>. If Claude guesses a name wrong, PhotoCraft returns an error and Claude corrects itself. You will see this in the tool output." },
            {
              t: "quiz",
              items: [
                {
                  q: "Which command id matches the menu item Image > Image Size?",
                  choices: ["image.imageSize", "size.image", "edit.imageSize"],
                  answer: 0,
                  explain: "Command ids follow the menu path: the Image menu and the Image Size item give image.imageSize."
                },
                {
                  q: "Claude adds a layer. Where will you find evidence of it in PhotoCraft?",
                  choices: [
                    "Only in the terminal",
                    "In the Layers panel and the History panel",
                    "Nowhere until you save"
                  ],
                  answer: 1,
                  explain: "Claude's edits go through the same engine as yours, so they show up as normal layers and history entries immediately."
                }
              ]
            },
            { t: "exercise", title: "Repeat it yourself", html: "Make the same kind of edit by hand and compare.", steps: [
              "Delete the Vibrance layer (select it and click the trash button in the Layers panel).",
              "Add a Vibrance layer yourself with Layer > New Adjustment Layer > Vibrance and set it to +40.",
              "Compare your result with Claude's: is it identical? Ask Claude to read both layers' settings with doc_inspect if you are unsure."
            ] },
            { t: "check", html: "You have watched Claude add a layer live, you know that menu items and commands are the same thing, and you have changed Claude's layer by hand." }
          ]
        },
        {
          id: "m3-l4",
          title: "Undo Claude and stay in control",
          minutes: 14,
          goals: [
            "Undo Claude's edits by hand, by History, and by asking",
            "List what Claude cannot do through PhotoCraft's connection",
            "Follow a short safety routine: copies, small steps, review before export"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "The best thing about working with an AI is that you can try a lot of ideas quickly. The risk is that it can also make a lot of changes you did not mean. Both are handled the same way: every command Claude runs is <b>one step in History</b>, so you can see it, step back through it and undo it, exactly like your own edits." },
            { t: "h", text: "Make some changes, then undo them" },
            {
              t: "claude",
              title: "Three edits, three history steps",
              html: "Start with great-wave.jpg open and the History panel visible.",
              prompts: [
                {
                  prompt: "Do these three things, one at a time, and tell me after each: add a Brightness/Contrast adjustment layer, add a Hue/Saturation adjustment layer, then add a Curves adjustment layer. Leave all settings at their defaults.",
                  why: "Claude runs layer.newAdjustmentLayer.brightnessContrast, then ...hueSaturation, then ...curves with mcp__photocraft__command_run. Look at the History panel: you should see three new entries, one per command."
                },
                {
                  prompt: "Show me the history list for the active document.",
                  why: "Claude calls mcp__photocraft__doc_inspect, which includes the history. Compare it with the History panel in the window."
                },
                {
                  prompt: "Undo your last change.",
                  why: "Claude runs edit.undo. The Curves layer should vanish from the Layers panel."
                }
              ]
            },
            {
              t: "steps",
              items: [
                {
                  html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> in PhotoCraft to undo another step yourself, then <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> to redo it.",
                  check: "Your keyboard undo works on Claude's edits as well. The History panel moves one entry."
                },
                {
                  html: "Click the first entry in the History panel (the file name).",
                  check: "All three of Claude's layers disappear and the picture is back to the start."
                },
                {
                  html: "Tell Claude: <i>I undid your changes, please check the document again and tell me what layers exist now.</i>",
                  detail: "When you change things by hand, Claude only knows if you tell it or it looks again with doc_inspect. Asking it to re-inspect is a good habit."
                }
              ]
            },
            { t: "h", text: "What Claude cannot do here" },
            { t: "p", html: "<ul><li><b>It cannot use Windows dialogs.</b> File &gt; Open and Save As are for you. Claude opens and saves with its own tools, inside your work folder.</li><li><b>It cannot run most File menu commands.</b> File commands that read or write paths (open, save, export with a path, place) are refused through the connection, apart from creating or closing documents.</li><li><b>It cannot change color mode or bit depth</b> in the live app (Image &gt; Mode).</li><li><b>It cannot see everything.</b> It sees screenshots of at most 2048 pixels, plus exact numbers on request. Your judgment of what looks good stays valuable.</li><li><b>It has no generative AI inside PhotoCraft.</b> PhotoCraft has no Generative Fill, Neural Filters or AI object remover. Claude can only run PhotoCraft's own commands; it cannot paint in new content out of thin air.</li><li><b>Undo does not un-write files.</b> If Claude saves or exports a file, undoing in PhotoCraft does not delete that file.</li></ul>" },
            { t: "callout", kind: "warn", html: "<b>Long answers and \"operation may have completed\".</b> If a reply from PhotoCraft is too big, the tool may report that it failed even though the edit happened. Before you ask Claude to retry an edit, ask it to inspect the document first, or you may get the change twice." },
            { t: "h", text: "A short safety routine" },
            { t: "p", html: "<ol><li><b>Work on a copy.</b> Save a work file (<code>.pcraft</code>) first, as in module 1. Never let Claude edit your only copy.</li><li><b>Prefer adjustment layers.</b> They can be hidden, changed or deleted later. Ask for non-destructive edits by name.</li><li><b>Small steps.</b> One change per request, check, then the next.</li><li><b>Save a checkpoint</b> before anything big, such as a long batch job.</li><li><b>Review before exporting.</b> Look at the picture yourself at 100% zoom before a file leaves your work folder.</li><li><b>Read the permission prompts.</b> Claude Code shows each tool call it wants to make. Take a second to read the tool name and the path.</li></ol>" },
            {
              t: "quiz",
              items: [
                {
                  q: "Claude adds three layers, and you want to go back to before it started. What is the fastest way?",
                  choices: [
                    "Close PhotoCraft",
                    "Click the first entry in the History panel",
                    "Delete the file"
                  ],
                  answer: 1,
                  explain: "Each Claude command is one history entry, so clicking the first entry returns the whole document to its starting state."
                },
                {
                  q: "Claude exports a JPG into exports/. You press Ctrl+Z in PhotoCraft. What happens to the exported file?",
                  choices: ["It is deleted", "It stays on disk", "It is replaced by the original"],
                  answer: 1,
                  explain: "Undo only affects the document's history, not files already written to disk."
                }
              ]
            },
            { t: "check", html: "You undid Claude's work three ways (keyboard, History panel, asking Claude), and you can list at least three things Claude cannot do through this connection." }
          ]
        },
        {
          id: "m3-l5",
          title: "Prompt patterns that work",
          minutes: 14,
          goals: [
            "Write requests that name the goal, the target and the safety rule",
            "Use a plan-first prompt and a coaching prompt",
            "Ask for numbers and previews to check Claude's work"
          ],
          assets: ["pearl-earring"],
          blocks: [
            { t: "p", html: "You get better results from Claude when a request has the same parts a good brief to a human assistant would have." },
            { t: "p", html: "<ol><li><b>Goal</b>: what you want to be true afterward (\"warmer, brighter, but no clipped sky\").</li><li><b>Target</b>: which file or layer (\"the open document\", \"practice/pearl-earring.jpg\", \"the layer named Warm tone\").</li><li><b>Method and safety</b>: how to do it (\"with an adjustment layer, so I can undo\") and what not to touch.</li><li><b>How to check</b>: what Claude should report or show you (\"then take a screenshot and tell me if anything is clipped\").</li></ol>" },
            { t: "p", html: "Beyond the four parts, a few habits help a lot: ask for a <b>plan before changes</b> when a task is big; ask Claude to <b>name layers</b> clearly; give <b>numbers</b> when you know them (\"opacity 40%\"); and use Claude as a <b>coach</b> as often as a doer." },
            { t: "h", text: "Try the patterns" },
            { t: "steps", items: [
              "Open <b>pearl-earring.jpg</b> by hand and save a work copy (File > Save As, <code>pearl-work.pcraft</code>, in your work folder).",
              "Run the three prompts below in order. Read each answer before sending the next."
            ] },
            {
              t: "claude",
              title: "Plan first, then act, then check",
              html: "Compare how each style of prompt changes what Claude does.",
              prompts: [
                {
                  prompt: "I want a warmer, slightly brighter look for the open picture without losing detail in the dark background. Before you touch anything, tell me the three adjustment layers you would add, in what order, and why. Wait for me to say go.",
                  why: "A plan-first request. Claude may call mcp__photocraft__doc_inspect or command_list to look, but should not run edits. You get to approve or change the plan."
                },
                {
                  prompt: "Go. Add them with clear layer names, use adjustment layers only, then take a screenshot and tell me honestly if anything looks clipped or overdone.",
                  why: "Claude runs layer.newAdjustmentLayer.* commands with mcp__photocraft__command_run, then mcp__photocraft__ui_screenshot. Watch the Layers panel fill with named layers, and hide each eye to check the effect yourself."
                },
                {
                  prompt: "Switch roles. Act as a photo-editing coach. Look at my open document and layer list, do not change anything, and tell me the three most important things I could improve, in order, with the PhotoCraft menu or panel where I would do each.",
                  why: "A coaching request. Claude reads state with mcp__photocraft__doc_inspect and a screenshot, and teaches instead of editing. Try the first suggestion by hand."
                }
              ]
            },
            { t: "h", text: "Weak and strong versions" },
            { t: "p", html: "<ul><li>Weak: <i>Make it better.</i> Strong: <i>Increase contrast gently with a Curves layer named \"Contrast\" and tell me the curve points you used.</i></li><li>Weak: <i>Fix the colors.</i> Strong: <i>The picture looks too yellow. Add a Color Balance adjustment layer and pull it toward blue until whites look neutral, then show me a screenshot.</i></li><li>Weak: <i>Resize everything.</i> Strong: <i>For each file in practice/, make a copy no wider than 1200 pixels in exports/, leave the originals alone, and list what you made.</i></li></ul>" },
            { t: "callout", kind: "tip", html: "<b>You can interrupt.</b> If Claude starts doing something you did not want, press <kbd>Esc</kbd> in Claude Code to stop it, then check PhotoCraft's History panel and undo what you need." },
            {
              t: "quiz",
              items: [
                {
                  q: "Which request is most likely to get good, safe results?",
                  choices: [
                    "Fix this photo.",
                    "Brighten the shadows of the open document with a Curves adjustment layer named Shadows lift, then screenshot it and tell me if the blacks look washed out.",
                    "Do whatever makes it look professional and save it over the original."
                  ],
                  answer: 1,
                  explain: "It names the goal, the method (an adjustment layer you can undo), a clear layer name and how to check. The third option risks overwriting your original."
                }
              ]
            },
            { t: "exercise", title: "Write your own brief", html: "Use the four-part formula on your own idea.", steps: [
              "Pick a change you want for the portrait: more contrast, warmer skin, a darker background.",
              "Write a prompt with goal, target, method and check. Send it, and see whether Claude did exactly what you meant.",
              "Rewrite the prompt once to be clearer, undo Claude's change in History, and send the improved version. Compare the two results."
            ] },
            { t: "check", html: "You have used a plan-first prompt, a do-and-check prompt and a coaching prompt, and you can name the four parts of a good request." }
          ]
        }
      ]
    },
    {
      id: "m4",
      title: "Layers: the heart of editing",
      summary: "Layers let you stack, hide, reorder and blend pieces of an image without ever damaging what is underneath. This is the idea that makes modern editing safe.",
      lessons: [
        {
          id: "m4-l1",
          title: "What layers are and why they exist",
          minutes: 16,
          goals: [
            "Explain layers as a stack of transparent sheets",
            "Create, rename, reorder, hide, move and delete layers",
            "Paint on a separate layer and see that the photo underneath is untouched"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "Imagine a stack of clear glass sheets. The bottom sheet carries your photograph. On another sheet above it you paint a red blob, and on a third you write some text. Looking down through the stack you see everything combined, but each sheet is still separate: you can lift one off, slide it sideways, or throw it away without scratching the others." },
            { t: "p", html: "That is a <b>layer</b>. Edits made on their own layer are <b>non-destructive</b>: the original pixels underneath are never changed. This one idea is why professionals can revisit a project months later and still change anything. It is also why Claude can make edits you can safely undo." },
            { t: "p", html: "Layers come in kinds, and you can see the kind written under each layer's name: <b>pixel layers</b> (paint and photos), <b>adjustment layers</b> (non-destructive tone and color changes, module 5), <b>type layers</b> (editable text), <b>shape layers</b> (sharp vector shapes), <b>groups</b> (folders for layers) and others. A photo you open starts as one pixel layer called <b>Background</b>." },
            { t: "h", text: "Build a small stack" },
            {
              t: "steps",
              items: [
                {
                  html: "Open <b>great-wave.jpg</b>, then immediately use <b>File</b> &gt; <b>Save As...</b> to save it as <code>layers-practice.pcraft</code> in your work folder.",
                  detail: "Always save a work copy before you start. You will use this file again in the next lesson."
                },
                {
                  html: "Look at the <b>Layers</b> panel. You should see one layer, <b>Background</b>, shown in italics with a small padlock.",
                  detail: "The Background layer is locked so you do not accidentally move it. If you ever need to move it or give it transparency, double-click it and it becomes an ordinary layer."
                },
                {
                  html: "Click the <b>Create a new layer</b> button (the plus at the bottom right of the Layers panel).",
                  check: "A new layer called Layer 1 appears above Background. Its thumbnail is a gray-and-white checkerboard, the sign of transparency: nothing is on it yet."
                },
                {
                  html: "Double-click the name <b>Layer 1</b> in the panel, type <b>Red blob</b>, and press <kbd>Enter</kbd>.",
                  detail: "You can also use Layer > Rename Layer. Giving layers clear names pays off quickly, especially when Claude refers to them."
                },
                {
                  html: "Click the foreground swatch and choose a strong red. Press <kbd>B</kbd> for the Brush and set the size large (several hundred pixels, with <kbd>]</kbd> or the Brush Preset picker). With <b>Red blob</b> highlighted in the Layers panel, click once or drag a short stroke on the canvas.",
                  check: "A red blob appears on the picture, and Red blob's thumbnail now shows a red mark on the checkerboard."
                },
                {
                  html: "Add another layer with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd>. If a dialog appears, type <b>Blue blob</b> as the name and confirm. Paint a blue blob that overlaps the red one.",
                  check: "The blue blob sits on top of the red one, and the layer list shows Blue blob above Red blob above Background."
                },
                {
                  html: "Click the <b>eye</b> next to Blue blob to hide it, and click again to show it.",
                  check: "The blue blob disappears and returns. The picture under it was never changed."
                },
                {
                  html: "Select <b>Red blob</b> and press <kbd>Ctrl</kbd>+<kbd>]</kbd> (Layer &gt; Arrange &gt; Bring Forward).",
                  check: "Red blob moves above Blue blob in the list, and the red now covers the blue where they overlap."
                },
                {
                  html: "Press <kbd>V</kbd> for the <b>Move</b> tool and drag on the canvas. The selected layer's contents move; the photograph does not.",
                  detail: "In the options bar the Move tool has an Auto-Select checkbox with a Layer/Group dropdown. When it is on, clicking a part of the picture selects the layer that owns the pixel you clicked. When it is off, you move whichever layer is selected in the panel."
                },
                {
                  html: "Select <b>Blue blob</b> and click the <b>Delete layer</b> button (the trash can at the bottom of the panel). Then press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to bring it back."
                }
              ]
            },
            { t: "keys", items: [
              { keys: "Ctrl+Shift+N", action: "New layer" },
              { keys: "Ctrl+J", action: "Duplicate the layer (Layer via Copy)" },
              { keys: "Ctrl+]", action: "Bring layer forward" },
              { keys: "Ctrl+[", action: "Send layer backward" },
              { keys: "Ctrl+Shift+] and Ctrl+Shift+[", action: "Bring to front, send to back" },
              { keys: "V", action: "Move tool" }
            ] },
            { t: "callout", kind: "tip", html: "<b>Always check which layer is highlighted</b> before you paint or edit. Beginners often wonder where their paint went, and it is usually on the wrong layer. The highlighted layer is the one every tool works on." },
            { t: "callout", kind: "adobe", html: "Everything here matches Photoshop: Background layer, the checkerboard for transparency, the eye icon, Layer via Copy (<kbd>Ctrl</kbd>+<kbd>J</kbd>) and the Move tool's Auto-Select option. There is also a <b>Kind</b> filter at the top of the Layers panel for finding layers in big documents." },
            {
              t: "claude",
              title: "Ask Claude to build the same stack",
              html: "First undo or delete your two blobs, or start from a fresh copy of great-wave.jpg, so you can compare.",
              prompts: [
                {
                  prompt: "In the open document, add two new empty layers named \"Red blob\" and \"Blue blob\". On each one paint a thick round blob (about 400 pixels across) in that color near the middle of the picture so the two overlap, with Blue blob on top. Then tell me the layer order.",
                  why: "Claude uses mcp__photocraft__command_run with layer.new.layer (with a name), tools.setColors and paint.stroke, then mcp__photocraft__doc_inspect to list the layers. Watch two layers appear and the paint land on the right ones. Compare its hard, perfectly round blobs with the brush strokes you made by hand."
                },
                {
                  prompt: "Move the Red blob layer 300 pixels to the right and hide the Blue blob layer. Don't touch the Background.",
                  why: "Claude runs layer.translate with a dx of 300 and layer.setProps with visible false. Both show up as History entries. Check that the Background layer never changed."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "You paint a stroke and nothing seems to appear. What should you check first?",
                  choices: [
                    "Whether the right layer is highlighted and visible",
                    "Whether the image is saved",
                    "Whether the file is a PNG"
                  ],
                  answer: 0,
                  explain: "Tools work on the highlighted layer. If it is hidden or the wrong one, you will not see the result you expect."
                },
                {
                  q: "A checkerboard thumbnail on a layer means:",
                  choices: ["The layer is locked", "The layer is transparent where the checkerboard shows", "The layer is a mask"],
                  answer: 1,
                  explain: "The checkerboard is how editors draw transparency."
                }
              ]
            },
            { t: "exercise", title: "Stack of three", html: "Make a layered scene.", steps: [
              "Make three new layers named Sun, Cloud and Boat, and paint a simple shape on each.",
              "Reorder them so the Cloud is in front of the Sun but behind the Boat.",
              "Hide each layer in turn and make sure the Background never changes. Save with Ctrl+S."
            ] },
            { t: "check", html: "You have a saved <code>layers-practice.pcraft</code> with Red blob and Blue blob above the Background, and you can hide, reorder and move each one independently." }
          ]
        },
        {
          id: "m4-l2",
          title: "Opacity, Fill and blend modes",
          minutes: 16,
          goals: [
            "Fade a layer with Opacity and change how layers mix with a blend mode",
            "Describe the effect of Multiply, Screen, Overlay and Soft Light",
            "Paint light and shadow non-destructively on a Soft Light layer"
          ],
          assets: ["impression-sunrise"],
          blocks: [
            { t: "p", html: "Normally a layer simply covers what is below it. Two controls at the top of the Layers panel change that: <b>Opacity</b> (how see-through the layer is) and the <b>blend mode</b> (the dropdown that says <b>Normal</b>), which decides how the layer's colors combine with the colors underneath, using math on each pixel." },
            { t: "p", html: "<b>The four modes you will use most</b><ul><li><b>Multiply</b> multiplies colors together. Everything gets darker, and white disappears. Good for deepening a picture or adding shadows.</li><li><b>Screen</b> is the opposite. Everything gets lighter, and black disappears. Good for glows and light effects.</li><li><b>Overlay</b> darkens the dark parts and lightens the light parts of the picture below, which adds contrast and color punch.</li><li><b>Soft Light</b> is a gentler Overlay. Painting white on a Soft Light layer lightens, and painting black darkens.</li></ul>" },
            { t: "steps", items: [
              {
                html: "Open <b>impression-sunrise.jpg</b> and save it as <code>blend-practice.pcraft</code> in your work folder.",
                check: "A harbor scene with one orange sun."
              },
              {
                html: "Press <kbd>Ctrl</kbd>+<kbd>J</kbd> to duplicate the Background layer. Double-click the new layer's name and call it <b>Blend test</b>.",
                check: "Two layers: Blend test above Background. The picture looks the same, since a copy sits on top of itself."
              },
              {
                html: "With Blend test selected, open the blend mode dropdown (it says <b>Normal</b>) and choose <b>Multiply</b>.",
                check: "The picture gets much darker and richer."
              },
              {
                html: "Try <b>Screen</b>, then <b>Overlay</b>, then <b>Soft Light</b>. After each one, hide and show the layer's eye to compare with the original.",
                check: "Screen is lighter and hazier. Overlay boosts contrast and color. Soft Light does the same, more gently."
              },
              {
                html: "Set the mode to <b>Overlay</b> again and type <b>40</b> in the <b>Opacity</b> box (or drag the slider).",
                check: "The contrast boost is weaker. Opacity blends the effect with what is beneath."
              },
              {
                html: "Return the mode to <b>Normal</b> and delete the layer, or leave it hidden."
              }
            ] },
            { t: "callout", kind: "note", html: "<b>Opacity versus Fill.</b> Both fade a layer, and for plain pixels they act the same. The difference shows up when a layer has <b>layer styles</b> such as a drop shadow (module 8): Opacity fades the pixels <i>and</i> the effects, while Fill fades only the pixels and leaves the effects at full strength." },
            { t: "h", text: "Dodge and burn with a Soft Light layer" },
            { t: "p", html: "Photographers have long \"dodged\" (lightened) and \"burned\" (darkened) parts of a print to guide the eye. You can do it without changing a single original pixel by painting on an empty Soft Light layer." },
            { t: "steps", items: [
              "Create a new empty layer with the plus button, and name it <b>Dodge and Burn</b>.",
              "Set its blend mode to <b>Soft Light</b>. The picture should not change yet, because the layer is empty.",
              "Press <kbd>B</kbd> for the Brush. Choose a large soft brush (Hardness 0%) and press <kbd>2</kbd> to lower the opacity to about 20%.",
              "Press <kbd>D</kbd> so the foreground is black and <kbd>X</kbd> to swap to white. Paint white around the sun to lighten it. Press <kbd>X</kbd> and paint black near the corners to darken them.",
              "Hide and show the layer's eye to see the difference. Paint again to build up the effect gradually, and use <kbd>Ctrl</kbd>+<kbd>Z</kbd> if a stroke goes too far."
            ] },
            { t: "callout", kind: "tip", html: "Keep the brush opacity low (10 to 20%) and build up in many passes. Photographers say you should not be able to see where dodging and burning was done." },
            { t: "callout", kind: "adobe", html: "PhotoCraft also has the classic <b>Dodge</b>, <b>Burn</b> and <b>Sponge</b> tools (key <kbd>O</kbd>). They change the pixels of the layer you use them on directly, so the Soft Light layer method here is safer." },
            {
              t: "claude",
              title: "Let Claude audition blend modes",
              html: "Start from the Blend test layer or a fresh duplicate of Background.",
              prompts: [
                {
                  prompt: "Duplicate the Background layer and name the copy \"Blend test\". Then set its blend mode to Multiply, Screen, Overlay and Soft Light, one at a time at 100% opacity. After each, take a screenshot and describe in one sentence how the picture changed. At the end, set it to Normal and hide it.",
                  why: "Claude uses layer.duplicate and layer.setProps (with a blend value) through mcp__photocraft__command_run, and mcp__photocraft__ui_screenshot after each change. Watch the blend dropdown in the Layers panel change on its own. Do you agree with its descriptions?"
                },
                {
                  prompt: "Set the Blend test layer to Overlay at 35% opacity and tell me what that changed, then explain in two sentences the difference between Opacity and Fill.",
                  why: "Claude runs layer.setProps with blend, opacity (a number from 0 to 1) and optionally fill, so the same dialog values you used by hand are applied. Check the Opacity box shows 35."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "You want a glow that lightens the image and ignores dark areas. Which blend mode fits best?",
                  choices: ["Multiply", "Screen", "Normal"],
                  answer: 1,
                  explain: "Screen lightens everything, and black does nothing, so it is the standard choice for glows."
                },
                {
                  q: "On a Soft Light layer, painting with black will:",
                  choices: ["Darken the picture below", "Lighten the picture below", "Do nothing"],
                  answer: 0,
                  explain: "Soft Light darkens where you paint black and lightens where you paint white. Gray (50%) does nothing."
                }
              ]
            },
            { t: "exercise", title: "Warm glow", html: "Create a sunrise glow using blend modes only.", steps: [
              "Add a new layer and paint a large soft orange blob around the sun.",
              "Set the layer's blend mode to Screen, then to Soft Light, and keep the one you like.",
              "Adjust Opacity until the glow looks natural, then save the file with Ctrl+S."
            ] },
            { t: "check", html: "You have seen Multiply, Screen, Overlay and Soft Light on the same picture, and you have a Dodge and Burn layer set to Soft Light in your file." }
          ]
        },
        {
          id: "m4-l3",
          title: "Groups, locks, and merging safely",
          minutes: 14,
          goals: [
            "Group, lock and hide layers to keep a document organized",
            "Merge layers, and explain why merging is a one-way door",
            "Use Stamp Visible to get a flat copy without destroying your layers"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "Real projects quickly collect dozens of layers. A little organization keeps them manageable: <b>groups</b> work like folders, <b>locks</b> prevent accidents, and <b>names</b> tell you what is what. And when you need a flat copy, there is a safe way to get one." },
            { t: "steps", items: [
              {
                html: "Reopen <code>layers-practice.pcraft</code> from your work folder (<kbd>Ctrl</kbd>+<kbd>O</kbd>). It should contain Red blob and Blue blob. If you skipped that lesson, open great-wave.jpg, add two layers, and paint a blob on each.",
                check: "A Layers panel with Background and two blob layers."
              },
              {
                html: "Click <b>Red blob</b>, then <kbd>Ctrl</kbd>+click <b>Blue blob</b> to select both.",
                detail: "Shift+click selects a range of layers between two clicks.",
                check: "Both rows are highlighted."
              },
              {
                html: "Press <kbd>Ctrl</kbd>+<kbd>G</kbd> to group them. Double-click the new group's name and call it <b>Blobs</b>.",
                check: "A folder row called Blobs appears. Click its small arrow to collapse and expand it."
              },
              {
                html: "Click the eye on the <b>Blobs</b> group.",
                check: "Both blobs hide together."
              },
              {
                html: "Expand the group, select <b>Red blob</b>, and look at the row of <b>Lock</b> icons above the layer list. Hover over each to read what it locks (transparent pixels, image pixels, position, and all). Click the padlock to lock everything, then try to paint on the layer.",
                check: "Painting does nothing while the layer is locked. Click the padlock again to unlock."
              }
            ] },
            { t: "h", text: "Merging is a one-way door" },
            { t: "p", html: "<b>Merging</b> combines layers into one. It makes files smaller and simpler, but you can no longer change the parts separately. Once you save and close, there is no way back." },
            { t: "p", html: "<ul><li><b>Layer &gt; Merge Layers</b> (<kbd>Ctrl</kbd>+<kbd>E</kbd>) merges the selected layers into one.</li><li><b>Layer &gt; Merge Visible</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd>) merges every visible layer.</li><li><b>Layer &gt; Flatten Image</b> squashes everything into a single Background layer.</li></ul>" },
            { t: "p", html: "The safe alternative is <b>Stamp Visible</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd>): it adds a new layer at the top that holds a flat copy of everything you can see, and leaves all of your original layers untouched. Use it when you want to sharpen or filter the whole picture, or export a flat reference." },
            { t: "steps", items: [
              {
                html: "Select both blob layers and press <kbd>Ctrl</kbd>+<kbd>E</kbd>. Look at the Layers panel, then press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to undo.",
                check: "The two layers become one and then split again."
              },
              {
                html: "Click the top layer and press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd> (Stamp Visible). Hide that new top layer and show it.",
                check: "A new layer at the top contains the whole picture flattened. Every layer below is still there."
              },
              {
                html: "Delete the stamped layer. Save the file."
              }
            ] },
            { t: "callout", kind: "warn", html: "<b>Merge and flatten are permanent once you save.</b> Undo works while the document stays open, but after you close and reopen it, merged layers stay merged. Keep your layered <code>.pcraft</code> file as the master and export flat pictures for delivery." },
            { t: "callout", kind: "tip", html: "<b>Name your layers as you go.</b> A document full of \"Layer 14\" is hard to understand, for you and for Claude. Names like \"Sky darken\" or \"Skin retouch\" tell you what each does. To clean up later, use <b>Layer</b> &gt; <b>Delete</b> &gt; <b>Hidden Layers</b> to remove layers you hid and no longer need." },
            {
              t: "claude",
              title: "Tidy up with Claude",
              html: "Use your layers-practice file with the two blobs.",
              prompts: [
                {
                  prompt: "Group all the layers except the Background into a group named \"Edits\". Then add a Stamp Visible layer on top and name it \"Flat preview\". Don't merge or delete anything. Afterward, list the layer tree.",
                  why: "Claude selects layers with layer.select, runs layer.groupLayers with a name, layer.stampVisible, and layer.setProps to rename, then calls mcp__photocraft__doc_inspect. Notice that nothing is merged: the stamp is an extra layer."
                },
                {
                  prompt: "Look at my layers and tell me which ones have unclear names or look unnecessary. Don't change anything, and suggest better names.",
                  why: "A coaching request that uses mcp__photocraft__doc_inspect to read the layer tree. Rename a couple of layers yourself based on the advice."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "You want a flat copy to sharpen, but you want to keep all your editable layers. Which is best?",
                  choices: ["Flatten Image", "Merge Visible", "Stamp Visible"],
                  answer: 2,
                  explain: "Stamp Visible adds a flat layer at the top and keeps everything underneath."
                },
                {
                  q: "What does grouping layers do?",
                  choices: [
                    "Merges them permanently",
                    "Puts them in a folder so they can be shown, hidden and moved together",
                    "Locks them"
                  ],
                  answer: 1,
                  explain: "Groups only organize layers. Nothing is changed or merged."
                }
              ]
            },
            { t: "check", html: "You can group, lock, merge and stamp layers, and you can explain why you should keep a layered master file." }
          ]
        }
      ]
    },
    {
      id: "m5",
      title: "Tone and color with adjustment layers",
      summary: "Learn to read light with the histogram and fix it with Levels and Curves, then shape color with Hue/Saturation, Vibrance and Color Balance, always on adjustment layers you can change later.",
      lessons: [
        {
          id: "m5-l1",
          title: "Reading light: the histogram and your first adjustment layer",
          minutes: 17,
          goals: [
            "Read a histogram: shadows on the left, highlights on the right",
            "Spot a flat, dark, bright or clipped image from its histogram",
            "Add an adjustment layer, toggle it, reset it and delete it"
          ],
          assets: ["tetons", "earthrise"],
          blocks: [
            { t: "p", html: "Before you can fix the light in a picture you need to see it honestly. Your eyes adapt and your screen brightness varies, so editors use a <b>histogram</b>: a graph of how many pixels sit at each brightness from pure black on the far left (0) to pure white on the far right (255). The taller the graph at a spot, the more pixels have that brightness." },
            { t: "p", html: "<ul><li><b>A mountain piled on the left</b>: a dark picture (underexposed, or just a night scene).</li><li><b>A mountain piled on the right</b>: a bright picture.</li><li><b>A narrow hump in the middle</b>: a flat, low-contrast picture. This is often the easiest to improve.</li><li><b>A wide spread from edge to edge</b>: a full tonal range, usually a punchy picture.</li><li><b>A tall spike jammed against the left or right edge</b>: <b>clipping</b>. Those pixels are pure black or pure white and have no detail left to recover.</li></ul>" },
            { t: "steps", items: [
              {
                html: "Open <b>tetons.jpg</b> and save it as <code>tone-practice.pcraft</code> in your work folder.",
                check: "A black-and-white mountain landscape."
              },
              {
                html: "Show the <b>Histogram</b> panel: click its tab beside Navigator and Info, or use <b>Window</b> &gt; <b>Histogram</b>. Set the <b>Channel</b> dropdown to <b>RGB</b>.",
                detail: "Under the graph you also see numbers: Mean (average brightness), Std Dev (how spread out the tones are), Median and the pixel count. A low standard deviation usually means a flat picture.",
                check: "A graph with a shape that tells you how the tones are spread."
              },
              {
                html: "Describe in one sentence what the histogram says about the picture: mostly dark, mostly bright, flat or full?"
              },
              {
                html: "Now open <b>earthrise.jpg</b> in a second tab and look at its histogram.",
                check: "A tall spike at the far left, because most of that frame is the black of space, with a small amount of tone elsewhere."
              },
              {
                html: "Switch back to the tetons tab (click the tab above the canvas)."
              }
            ] },
            { t: "h", text: "Adjustments that never change your pixels" },
            { t: "p", html: "PhotoCraft gives you two ways to apply a change like <b>Brightness/Contrast</b>:" },
            { t: "p", html: "<ul><li><b>Image &gt; Adjustments &gt; Brightness/Contrast...</b> changes the pixels of the selected layer for good. It is quick but destructive: if you save and close, the original tones are gone.</li><li><b>Layer &gt; New Adjustment Layer &gt; Brightness/Contrast...</b> adds a <i>new layer</i> that holds the settings and applies them live to everything under it. The pixels are never touched, so you can change, hide or delete the adjustment at any time.</li></ul>" },
            { t: "steps", items: [
              {
                html: "Click the <b>Background</b> layer, then click the half-moon button at the bottom of the Layers panel (<b>Create new fill or adjustment layer</b>) and choose <b>Brightness/Contrast</b>. (Or use <b>Layer</b> &gt; <b>New Adjustment Layer</b> &gt; <b>Brightness/Contrast...</b>.)",
                detail: "A new adjustment layer is added above the layer that is currently selected.",
                check: "A new layer called Brightness/Contrast 1 sits above Background. The Properties panel shows Brightness and Contrast sliders."
              },
              {
                html: "Drag the <b>Contrast</b> slider to the right and watch the picture and the histogram change.",
                check: "The picture gets more contrasty, and the histogram spreads out."
              },
              {
                html: "In the Properties panel uncheck <b>Adjustment visible</b>, then check it again. Then click the layer's <b>eye</b> in the Layers panel to do the same thing.",
                check: "The effect turns off and on: you can always compare before and after."
              },
              {
                html: "Click <b>Reset to defaults</b> in the Properties panel to put the sliders back, then delete the layer with the trash button."
              },
              {
                html: "Try the destructive version once: <b>Image</b> &gt; <b>Adjustments</b> &gt; <b>Brightness/Contrast...</b>. Apply it, then undo with <kbd>Ctrl</kbd>+<kbd>Z</kbd>.",
                detail: "Notice that no new layer appears. The Background pixels are changed directly. Only History can rescue you, and only while the file stays open."
              }
            ] },
            { t: "callout", kind: "adobe", html: "Photoshop calls these <b>adjustment layers</b> too, and the Properties panel works the same way. The <b>Adjustments</b> panel tab beside Properties offers one-click presets. The <b>Image &gt; Adjustments</b> menu is the old destructive route, with the same names and shortcuts, such as <kbd>Ctrl</kbd>+<kbd>L</kbd> for Levels and <kbd>Ctrl</kbd>+<kbd>M</kbd> for Curves." },
            {
              t: "claude",
              title: "Ask Claude to read the histogram",
              html: "Keep the Histogram panel visible in PhotoCraft so it is in the screenshot.",
              prompts: [
                {
                  prompt: "Take a screenshot of PhotoCraft with the Histogram panel visible. Tell me whether the open picture is under-exposed, over-exposed or well balanced, whether any shadows or highlights look clipped, and what the Mean and Std Dev numbers suggest. Don't change anything.",
                  why: "Claude uses mcp__photocraft__ui_inspect and mcp__photocraft__ui_screenshot. It can set panels through ui_set if the Histogram is hidden. Compare its reading with your own sentence."
                },
                {
                  prompt: "Add a Brightness/Contrast adjustment layer with contrast +30 and name it \"Contrast test\". Then tell me what happened to the Mean and Std Dev.",
                  why: "Claude runs layer.newAdjustmentLayer.brightnessContrast and layer.setProps (name), then looks at the panel again. Watch the Std Dev number rise as the tones spread."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "A histogram has one tall spike touching the right edge. What does that tell you?",
                  choices: [
                    "The picture is dark",
                    "Many pixels are pure white (clipped highlights) and have lost detail",
                    "The picture is perfectly exposed"
                  ],
                  answer: 1,
                  explain: "A spike against an edge means pixels have been pushed to 0 or 255 where they hold no detail."
                },
                {
                  q: "Why prefer Layer > New Adjustment Layer to Image > Adjustments?",
                  choices: [
                    "It is faster to type",
                    "It leaves the original pixels untouched so you can change or remove the adjustment later",
                    "It creates a smaller file"
                  ],
                  answer: 1,
                  explain: "Adjustment layers are non-destructive. Image > Adjustments rewrites the pixels."
                }
              ]
            },
            { t: "check", html: "You can describe a picture's tones from its histogram, and you have added, toggled, reset and deleted an adjustment layer." }
          ]
        },
        {
          id: "m5-l2",
          title: "Levels: black point, white point, midtones",
          minutes: 16,
          goals: [
            "Explain the black point, white point and midtone sliders of Levels",
            "Stretch a flat image so it fills the tonal range without clipping",
            "Use Auto and the Output Levels, and know their effects"
          ],
          assets: ["tetons"],
          blocks: [
            { t: "p", html: "<b>Levels</b> is the simplest way to fix brightness and contrast, and it works directly with the histogram. It has three <b>input</b> controls:" },
            { t: "p", html: "<ul><li><b>Black point</b> (left slider, default 0): any tone at or below this value becomes pure black. Moving it right deepens the shadows.</li><li><b>Midtone</b> (middle slider, shown as a number near 1.0; also called <b>gamma</b>): moves the brightness of the middle tones without affecting black or white. Dragging left lightens the picture, dragging right darkens it.</li><li><b>White point</b> (right slider, default 255): any tone at or above this value becomes pure white. Moving it left brightens the highlights.</li></ul>" },
            { t: "p", html: "The key trick: slide the black point and white point inward until they meet the <i>edges of the histogram</i>. You stretch the picture's real range across the full scale, so shadows get truly dark and highlights truly bright, without losing anything." },
            { t: "image", src: "../photocraft/docs/images/photocraft-adjustments.jpg", alt: "PhotoCraft with a Levels adjustment layer selected: the Properties panel shows a histogram with three sliders and the values 18, 1.1 and 236", caption: "The Levels controls in the Properties panel. The three numbers under the histogram are the black point (18), the midtone (1.1) and the white point (236). The Histogram panel is below it." },
            { t: "steps", items: [
              {
                html: "Open <code>tone-practice.pcraft</code> (or tetons.jpg). Delete any adjustment layers left from last time so you start from the plain Background.",
                check: "A single Background layer."
              },
              {
                html: "Click Background, then add a Levels layer: <b>Layer</b> &gt; <b>New Adjustment Layer</b> &gt; <b>Levels...</b> (or use the half-moon button).",
                check: "The Properties panel shows Levels: a Channel dropdown (RGB), an Auto button, the histogram with three small sliders below it, and Output Levels with two more."
              },
              {
                html: "Look at the histogram in the Levels panel. If there is an empty gap at either end, drag the <b>left slider</b> to the point where the graph begins and the <b>right slider</b> to the point where it ends.",
                check: "The picture gains contrast, and the numbers under the sliders show the black and white points you chose (for example 18 and 236)."
              },
              {
                html: "Drag the <b>middle slider</b> left and right, and notice how the middle tones lighten and darken.",
                check: "Lighter when you drag left, darker when you drag right, with the darkest and brightest pixels unchanged."
              },
              {
                html: "Click <b>Reset to defaults</b>, then click <b>Auto</b> and compare what PhotoCraft chooses with your own settings.",
                detail: "Auto sets the black and white points where the histogram begins and ends. It is a decent first guess but not always what you want."
              },
              {
                html: "Reset again. Now drag the left <b>Output Levels</b> slider (or type a number like 30 in its box) to lift the blacks.",
                check: "The deepest shadows become gray instead of black, for a faded, matte look."
              },
              {
                html: "Reset, set your preferred black point, white point and midtone, and rename the layer <b>Levels stretch</b>. Save with <kbd>Ctrl</kbd>+<kbd>S</kbd>."
              }
            ] },
            { t: "callout", kind: "warn", html: "<b>Do not overdo it.</b> If you pull the black or white point <i>past</i> the ends of the histogram, you clip: shadow or highlight detail turns into flat black or white. Watch the Histogram panel as you work and stop before a tall spike builds up on an edge." },
            { t: "callout", kind: "tip", html: "<b>Fix color casts per channel.</b> The Channel dropdown at the top of Levels lets you adjust just Red, Green or Blue. A picture that looks slightly yellow can often be fixed by moving the Blue channel's midtone slider a little to the left." },
            { t: "callout", kind: "adobe", html: "This is Photoshop's Levels. The old destructive version (<kbd>Ctrl</kbd>+<kbd>L</kbd>) is under Image &gt; Adjustments. The adjustment layer version is almost always the better choice." },
            {
              t: "claude",
              title: "Compare Claude's Levels with yours",
              html: "Hide your Levels layer first (click its eye) so Claude starts from the plain picture.",
              prompts: [
                {
                  prompt: "Look at the histogram of the open picture in a screenshot. Estimate where the tones start and end, then add a Levels adjustment layer named \"Claude levels\" whose black point and white point are just inside those ends. Tell me the numbers you chose and why.",
                  why: "Claude uses mcp__photocraft__ui_screenshot, then layer.newAdjustmentLayer.levels with inBlack, inWhite and gamma, and layer.setProps to rename it. It is estimating from a picture, so its numbers will be rough. Toggle its eye against yours and see who did better."
                },
                {
                  prompt: "Change your Claude levels layer so the midtones are slightly brighter (gamma 1.2), then take a screenshot and tell me if highlights look clipped.",
                  why: "Claude runs layer.setAdjustment (or recreates the layer) with gamma 1.2 through mcp__photocraft__command_run, then screenshots. Gamma accepts values from 0.01 to 9.99."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "The histogram starts at 30 and ends at 220, leaving gaps at both ends. What is the best Levels move?",
                  choices: [
                    "Move the black point to 30 and the white point to 220",
                    "Move the black point to 100",
                    "Move the white point to 255"
                  ],
                  answer: 0,
                  explain: "Moving the points to where the histogram begins and ends stretches the real range to fill the full scale without losing detail."
                },
                {
                  q: "Which slider lightens the middle tones without changing pure black and pure white?",
                  choices: ["Black point", "Midtone (gamma)", "White point"],
                  answer: 1,
                  explain: "The middle slider moves the midtones only."
                }
              ]
            },
            { t: "exercise", title: "Rescue earthrise", html: "Use Levels on a very lopsided picture.", steps: [
              "Open earthrise.jpg, save a work copy and add a Levels layer.",
              "Look at the histogram: where does most of the data sit?",
              "Brighten the Moon's surface with the midtone slider without turning the black sky gray."
            ] },
            { t: "check", html: "You stretched the histogram with the black and white points, lightened the midtones, and know that going past the edges clips detail." }
          ]
        },
        {
          id: "m5-l3",
          title: "Curves: precise control of contrast",
          minutes: 17,
          goals: [
            "Read a curve: input brightness across, output brightness up",
            "Build an S-curve for contrast and a lifted-blacks curve for a faded look",
            "Use single-channel curves to shift color"
          ],
          assets: ["tetons"],
          blocks: [
            { t: "p", html: "<b>Curves</b> is Levels with unlimited control. The graph's horizontal axis is the <b>input</b> brightness of a pixel, from black on the left to white on the right. The vertical axis is the <b>output</b> brightness you want it to become. The default is a straight diagonal line: every input equals its output, so nothing changes." },
            { t: "p", html: "<ul><li><b>Pull a point up</b>: those tones get lighter. <b>Pull it down</b>: darker.</li><li>The <b>S-curve</b> (shadows pulled down, highlights pulled up) steepens the middle of the line and adds contrast. It is the most famous curve in editing.</li><li><b>Lifting the bottom-left end</b> turns pure black into gray: the faded, film-like look.</li></ul>" },
            { t: "image", src: "../photocraft/docs/images/photocraft-demo.jpg", alt: "PhotoCraft with a Curves adjustment layer selected; the Properties panel shows a curve with an S shape drawn over a histogram", caption: "A gentle S-curve in the Properties panel. The image's histogram is drawn behind the curve to help you place points." },
            { t: "steps", items: [
              {
                html: "Open <code>tone-practice.pcraft</code> and hide or delete your earlier adjustment layers. Click <b>Background</b>, then add a curve: <b>Layer</b> &gt; <b>New Adjustment Layer</b> &gt; <b>Curves...</b>.",
                check: "The Properties panel shows a curve box with a straight diagonal line, a Channel dropdown set to RGB, and Input and Output number boxes."
              },
              {
                html: "Click on the line about a quarter of the way along and drag the new point <b>down</b> a little. Click about three quarters along and drag that point <b>up</b> a little.",
                detail: "The Input and Output boxes show the position of the selected point, and you can type numbers there too. A good gentle S-curve is roughly input 64 to output 48 and input 192 to output 212.",
                check: "The curve bends into an S, and the picture gains contrast."
              },
              {
                html: "Hide and show the layer (the eye icon) to compare. If the picture looks harsh, drag the points back toward the diagonal.",
                detail: "Subtle curves are almost always better than extreme ones."
              },
              {
                html: "To remove a point: drag it off the graph, <kbd>Ctrl</kbd>+click it, or select it and press <kbd>Delete</kbd>. Remove one of your points and see how the curve changes.",
                detail: "PhotoCraft's hint inside the graph says: click to add a point; drag off, Ctrl-click or Delete to remove."
              },
              {
                html: "Click <b>Reset to defaults</b>. Now drag the <b>bottom-left end point</b> straight up a little, so input 0 gives output 20 or so.",
                check: "The darkest tones become gray: a faded, matte look."
              },
              {
                html: "Reset, then change the <b>Channel</b> dropdown to <b>Blue</b>. Drag the middle of the blue curve up, then down.",
                check: "Up makes the picture bluer, and down makes it yellower. A tetons photo is black and white, so the tint shows clearly."
              },
              {
                html: "Reset again, build your favorite subtle S-curve on the RGB channel, rename the layer <b>Curves contrast</b>, and save."
              }
            ] },
            { t: "callout", kind: "adobe", html: "Curves in PhotoCraft look and work like Photoshop's, with the same Channel dropdown, the Input and Output boxes, and the histogram behind the line. <kbd>Ctrl</kbd>+<kbd>M</kbd> opens the old destructive version under Image &gt; Adjustments: prefer the adjustment layer." },
            {
              t: "claude",
              title: "A curve by the numbers",
              html: "Hide your own curve first so Claude's is visible.",
              prompts: [
                {
                  prompt: "Add a Curves adjustment layer named \"Claude S-curve\" with a gentle S-curve through the points (0,0), (64,48), (192,212) and (255,255). Then take a screenshot and tell me whether the contrast looks natural.",
                  why: "Claude runs layer.newAdjustmentLayer.curves with a points list through mcp__photocraft__command_run, then renames it. Open the layer's Properties and see those same four points on the graph. Compare with your own curve."
                },
                {
                  prompt: "Make a second Curves layer named \"Faded blacks\" where input 0 maps to output 25 and leave everything else as is. Show it to me, then hide it.",
                  why: "Claude uses layer.newAdjustmentLayer.curves again, with points such as [0,25] and [255,255], and layer.setProps with visible false. You learn that a curve is just a short list of points, so anything you draw can also be written down."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "The curve is a straight diagonal. What does that mean?",
                  choices: ["The picture is black and white", "Nothing is changed", "The picture is clipped"],
                  answer: 1,
                  explain: "A diagonal maps every input to the same output."
                },
                {
                  q: "Which curve shape adds contrast?",
                  choices: ["An S-curve", "A straight line sloping up less steeply", "A curve that drops to zero"],
                  answer: 0,
                  explain: "An S-curve darkens the shadows and brightens the highlights, which steepens the middle tones."
                }
              ]
            },
            { t: "exercise", title: "Three looks", html: "Use only Curves to make three different looks from one picture.", steps: [
              "A punchy look: a strong S-curve on RGB.",
              "A faded look: lift the blacks and pull the whites down a little.",
              "A tinted look: use the Red and Blue channels to warm the highlights and cool the shadows.",
              "Put each in its own Curves layer and show them one at a time."
            ] },
            { t: "check", html: "You can build an S-curve, lift the blacks, tint with a single channel, and you know that Curves are only a list of points." }
          ]
        },
        {
          id: "m5-l4",
          title: "Color: Hue/Saturation, Vibrance, Color Balance and Black & White",
          minutes: 18,
          goals: [
            "Tell hue, saturation and lightness apart",
            "Use Vibrance for a safe color boost and Color Balance to warm or cool a picture",
            "Convert to black and white without losing control over the tones"
          ],
          assets: ["impression-sunrise"],
          blocks: [
            { t: "p", html: "<b>Hue</b> is which color something is (red, green, blue...). <b>Saturation</b> is how intense it is: 0% is gray, 100% is vivid. <b>Lightness</b> is how bright it is. The <b>Hue/Saturation</b> adjustment moves each of these independently." },
            { t: "p", html: "<b>Vibrance</b> is a smarter saturation. It boosts the muted colors in a picture more than the already strong ones, so skin and bright objects do not turn garish. Beginners tend to overuse saturation; Vibrance is the safer first reach." },
            { t: "p", html: "<b>Color Balance</b> pushes the shadows, midtones or highlights toward a color pair: Cyan and Red, Magenta and Green, or Yellow and Blue. It is the classic way to warm up or cool down a picture." },
            { t: "steps", items: [
              {
                html: "Open <b>impression-sunrise.jpg</b> and save it as <code>color-practice.pcraft</code>. Click <b>Background</b>.",
                check: "A blue-gray harbor with one orange sun."
              },
              {
                html: "Add a <b>Hue/Saturation</b> layer (<b>Layer</b> &gt; <b>New Adjustment Layer</b> &gt; <b>Hue/Saturation...</b>). In the Properties panel drag <b>Hue</b> slowly across its whole range.",
                detail: "Hue runs from -180 to +180 and shifts every color around the color wheel at once. The sliders show the colors they will produce.",
                check: "All the colors rotate together: the orange sun turns green, then blue, then purple."
              },
              {
                html: "Reset Hue to 0. Drag <b>Saturation</b> all the way to <b>-100</b>, then to about <b>+40</b>.",
                check: "At -100 the picture is gray. At +40 the colors are much stronger."
              },
              {
                html: "Reset again. The <b>Master</b> dropdown at the top of the panel lets you work on one color range, such as just the Reds or Blues. Choose a color range there and change its Saturation.",
                detail: "Choosing a single range changes only pixels of that color, which is a quick way to calm a distracting color."
              },
              {
                html: "Hide the Hue/Saturation layer. Add a <b>Vibrance</b> layer and set <b>Vibrance</b> to about <b>+60</b>. Compare it with a Saturation layer of +60.",
                check: "Vibrance livens the dull blues and keeps the sun controlled. Plain Saturation pushes everything harder."
              },
              {
                html: "Hide that layer too. Add a <b>Color Balance</b> layer (Layer &gt; New Adjustment Layer &gt; Color Balance...). Choose <b>Midtones</b> in the <b>Tone</b> row, and drag <b>Yellow-Blue</b> toward yellow and <b>Cyan-Red</b> toward red.",
                check: "The picture looks warmer, like golden hour. Moving the other way makes it cool and moody."
              },
              {
                html: "Hide that layer and add a <b>Black &amp; White</b> layer. It has six color sliders (Reds, Yellows, Greens, Cyans, Blues, Magentas). Drag the Reds and Blues sliders and watch the sun and the water change brightness.",
                detail: "Black & White converts the picture to gray but lets you decide how bright each original color becomes. The Reds slider changes how light the red-orange sun appears as gray. The Tint checkbox adds a single color tone, as in a sepia print, and Default puts the sliders back.",
                check: "Colors that looked different now become different grays, and you control which ones are light and which are dark."
              },
              {
                html: "Experiment by turning layers on and off in different combinations. Keep one look you like, rename the layers clearly, and save."
              }
            ] },
            { t: "callout", kind: "tip", html: "<b>A color workflow that works.</b> First fix the tones (Levels or Curves). Then fix any color cast (Color Balance, or the single-channel Curves). Only then add taste: a little Vibrance, maybe warmer highlights. Always check a color change with the layer's eye so you can tell whether you made things better." },
            { t: "callout", kind: "adobe", html: "These are the same adjustments you see in Photoshop's Adjustments panel, with the same slider names. The Hue/Saturation <b>Colorize</b> checkbox paints the whole picture in a single color tone, like an old-fashioned sepia print." },
            {
              t: "claude",
              title: "Three looks, one request",
              html: "Make sure your own color layers are hidden or deleted, and the picture is the plain Background.",
              prompts: [
                {
                  prompt: "Make three different color looks for the open picture, each as its own adjustment layer inside a group: (1) \"Golden hour\" using Color Balance toward warm, (2) \"Cool dawn\" using Color Balance toward blue, (3) \"Mono\" using a Black & White layer. Show only one at a time and take a screenshot of each, then leave all three hidden.",
                  why: "Claude uses layer.newAdjustmentLayer.colorBalance and .blackWhite, layer.groupLayers, and layer.setProps with visible true and false, plus mcp__photocraft__ui_screenshot. Watch it turn each layer on, shoot it and turn it off again. Note which look you prefer, and which one Claude seems to describe best."
                },
                {
                  prompt: "Add a Hue/Saturation layer that shifts the hue by +30 and lowers saturation by 20, and tell me what the sun looks like now.",
                  why: "Claude runs layer.newAdjustmentLayer.hueSaturation with hue, saturation and lightness (hue -180 to 180, saturation -100 to 100). Check the Properties panel shows the same numbers."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "Which setting turns a picture completely gray without changing its brightness?",
                  choices: ["Hue -180", "Saturation -100", "Lightness -100"],
                  answer: 1,
                  explain: "Saturation at -100 removes all color intensity, leaving gray."
                },
                {
                  q: "Why is Vibrance often better than Saturation for portraits?",
                  choices: [
                    "It affects only blue",
                    "It boosts muted colors more and spares already strong ones such as skin",
                    "It changes the hue"
                  ],
                  answer: 1,
                  explain: "Vibrance protects strong colors, so skin does not turn orange."
                }
              ]
            },
            { t: "exercise", title: "Teal and orange", html: "Create the popular movie look.", steps: [
              "Add a Color Balance layer. In the Shadows tone, push toward Cyan and Blue.",
              "In the Highlights tone, push toward Red and Yellow.",
              "Add a gentle Vibrance layer and name every layer clearly.",
              "Take a screenshot (or ask Claude to) and compare with the original."
            ] },
            { t: "check", html: "You can tell hue, saturation and lightness apart, used Vibrance, Color Balance and Black & White on separate layers, and left the original pixels untouched." }
          ]
        }
      ]
    },
    {
      id: "m6",
      title: "Selections and masks",
      summary: "Edit only the part of a picture you mean to. You will make selections with several tools, hide and reveal with layer masks, and combine masks with adjustment layers for local edits.",
      lessons: [
        {
          id: "m6-l1",
          title: "Selections: tell PhotoCraft which pixels you mean",
          minutes: 19,
          goals: [
            "Make selections with the marquee, lasso and magic wand, and add to or subtract from them",
            "Use Select > Subject, Sky and Color Range, knowing their limits",
            "Invert and feather a selection, and view it in Quick Mask"
          ],
          assets: ["pearl-earring", "earthrise", "sierra-nevada"],
          blocks: [
            { t: "p", html: "So far every edit has affected the whole picture. Most real edits do not: you darken the sky, brighten a face, recolor a car. A <b>selection</b> is a temporary map that tells PhotoCraft which pixels are \"in\". Once something is selected, adjustments, fills and filters affect only the selected pixels. The edge of a selection is drawn as moving dashes, the <b>marching ants</b>." },
            { t: "p", html: "A selection is not saved with a layer, and it disappears when you deselect (<kbd>Ctrl</kbd>+<kbd>D</kbd>). To keep one, turn it into a layer mask (next lesson) or use <b>Select</b> &gt; <b>Save Selection...</b>." },
            { t: "h", text: "Geometric and freehand selections" },
            { t: "steps", items: [
              {
                html: "Open <b>pearl-earring.jpg</b> and save it as <code>select-practice.pcraft</code>. Press <kbd>M</kbd> for the <b>Rectangular Marquee</b> and drag a box on the picture.",
                check: "A rectangle with marching ants."
              },
              {
                html: "Look at the options bar. Four buttons set the selection mode: new, add, subtract and intersect. There is also <b>Feather</b>, <b>Anti-alias</b>, <b>Style</b> and a <b>Select and Mask...</b> button. Click the <b>add</b> button (the plus) and drag a second box that overlaps the first.",
                detail: "Shortcut: hold Shift while you start dragging to add, or Alt to subtract.",
                check: "The two boxes join into one selection."
              },
              {
                html: "Press <kbd>Ctrl</kbd>+<kbd>D</kbd> to deselect. Then press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> (<b>Select</b> &gt; <b>Reselect</b>) to bring it back."
              },
              {
                html: "Right-click (or press and hold) the marquee tool and choose <b>Elliptical Marquee</b>. Drag an oval around the girl's face.",
                check: "An oval selection."
              },
              {
                html: "Press <kbd>L</kbd> for the <b>Lasso</b>. Drag freehand around the head cloth and release the mouse to close the selection. Hold <kbd>Alt</kbd> while drawing to place straight-sided segments.",
                detail: "The Lasso group also has a Polygonal Lasso and a Magnetic Lasso, which clings to edges."
              },
              {
                html: "Press <kbd>W</kbd> for the <b>Magic Wand</b>. Click on the dark background. Look at the options bar: <b>Tolerance</b> controls how different a color can be and still be picked, and <b>Contiguous</b> limits the selection to connected areas.",
                check: "A big region of the dark background is selected. Try Tolerance 10, then 60, and click again to see the difference."
              },
              {
                html: "With the background selected, choose <b>Select</b> &gt; <b>Inverse Selection</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>).",
                detail: "Inverting is a classic trick: it is often easier to select the plain thing around your subject and then flip the selection.",
                check: "The marching ants now outline the girl instead of the background."
              }
            ] },
            { t: "h", text: "Smart selections" },
            { t: "steps", items: [
              {
                html: "Deselect. Choose <b>Select</b> &gt; <b>Subject</b> (the Magic Wand's options bar also has a <b>Select Subject</b> button).",
                check: "PhotoCraft outlines what it thinks is the main subject. Zoom in and judge the edges."
              },
              {
                html: "Open <b>earthrise.jpg</b>. Choose <b>Select</b> &gt; <b>Color Range...</b>. In the dialog use the Eyedropper to click the black space. Adjust <b>Fuzziness</b> and check the <b>Selection Preview</b>, then click <b>OK</b>.",
                detail: "Color Range selects every pixel in the whole picture that is close to the color you click, even in separate areas.",
                check: "The black sky is selected and the Moon and Earth are not."
              },
              {
                html: "Open <b>sierra-nevada.jpg</b> and choose <b>Select</b> &gt; <b>Sky</b>.",
                check: "The area above the mountains is selected, with some imperfection along the edge."
              }
            ] },
            { t: "callout", kind: "warn", html: "<b>Subject and Sky are not AI.</b> PhotoCraft's Select Subject, Select Object and Select Sky use classic image analysis, not machine learning. They work well on clear photos and can be wrong on paintings, soft edges and cluttered scenes. Always zoom in and inspect, and fix mistakes with the add and subtract modes." },
            { t: "h", text: "Soft edges: feather and Quick Mask" },
            { t: "steps", items: [
              {
                html: "Go back to the pearl-earring tab. Make an elliptical selection around the face. Choose <b>Select</b> &gt; <b>Modify</b> &gt; <b>Feather...</b> (<kbd>Shift</kbd>+<kbd>F6</kbd>) and enter <b>40</b> pixels.",
                detail: "Feathering blurs the edge of a selection, so an edit fades in gradually instead of stopping at a hard line."
              },
              {
                html: "Press <kbd>Q</kbd> to enter <b>Quick Mask</b> mode. Press <kbd>Q</kbd> again to leave it.",
                detail: "Quick Mask shows your selection as a colored overlay instead of marching ants. The soft fade at the edge is the feather. You can also refine a selection in this mode by painting on it with the Brush.",
                check: "With Quick Mask on, you see a tinted area with a soft edge instead of marching ants."
              },
              {
                html: "<b>Select</b> &gt; <b>Modify</b> also has <b>Expand</b>, <b>Contract</b>, <b>Smooth</b> and <b>Border</b>. Try Expand by 20 pixels."
              },
              {
                html: "Press <kbd>Ctrl</kbd>+<kbd>D</kbd> when you are finished."
              }
            ] },
            { t: "keys", items: [
              { keys: "M", action: "Marquee tools" },
              { keys: "L", action: "Lasso tools" },
              { keys: "W", action: "Magic Wand, Quick Selection, Object Selection" },
              { keys: "Ctrl+A", action: "Select all" },
              { keys: "Ctrl+D", action: "Deselect" },
              { keys: "Ctrl+Shift+D", action: "Reselect" },
              { keys: "Ctrl+Shift+I", action: "Inverse selection" },
              { keys: "Shift+F6", action: "Feather the selection" },
              { keys: "Q", action: "Quick Mask on and off" }
            ] },
            { t: "callout", kind: "adobe", html: "This is all standard Photoshop: Marquee, Lasso, Magic Wand, Select Subject, Select Sky, Color Range, Inverse (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>) and Quick Mask. PhotoCraft's menu item is named <b>Inverse Selection</b>. The single row and column marquees and the Color Sampler tool are not implemented." },
            {
              t: "claude",
              title: "Selections by numbers",
              html: "Keep pearl-earring.jpg open.",
              prompts: [
                {
                  prompt: "Select an oval that covers the girl's face with a 40 pixel feather. Then tell me what the document inspector says about the selection (its size and position). Don't change any pixels.",
                  why: "Claude runs select.rect with ellipse true and feather 40 through mcp__photocraft__command_run, then reads mcp__photocraft__doc_inspect, which reports the selection. Compare with the marching ants it drew. Notice that exact rectangle selections are easy for Claude, while selecting a face precisely would need your eyes."
                },
                {
                  prompt: "Open practice/sierra-nevada.jpg, select the sky with Select Sky, take a screenshot, and tell me honestly where the selection looks wrong.",
                  why: "Claude uses mcp__photocraft__doc_open, then select.sky and mcp__photocraft__ui_screenshot. This runs the same algorithm you did by hand, so the result should match yours. Use Claude's critique to check what you saw."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "You selected the plain background and want the subject instead. What is the quickest fix?",
                  choices: ["Start again with the Lasso", "Select > Inverse Selection", "Press Ctrl+D"],
                  answer: 1,
                  explain: "Inverse Selection flips selected and unselected pixels."
                },
                {
                  q: "What does feathering a selection do?",
                  choices: ["Makes the edge fade gradually", "Makes the selection bigger", "Saves the selection"],
                  answer: 0,
                  explain: "A feathered edge blends an edit into the surroundings."
                },
                {
                  q: "Why should you check the result of Select Subject yourself?",
                  choices: [
                    "It is not AI, and can be wrong, especially on paintings",
                    "It always selects the whole picture",
                    "It is slow"
                  ],
                  answer: 0,
                  explain: "It is a classical algorithm whose results vary with the picture."
                }
              ]
            },
            { t: "exercise", title: "Select the Moon", html: "Combine tools to select a single object.", steps: [
              "Open earthrise.jpg and use Color Range on the sky, then invert the selection.",
              "Add the Earth's circle with the Elliptical Marquee, and subtract anything that shouldn't be there with the subtract mode.",
              "Press Q to check the edge, feather it by 2 pixels, and then deselect."
            ] },
            { t: "check", html: "You have made selections with the marquee, lasso, wand and Color Range, inverted and feathered one, and you know that Subject and Sky are classic algorithms that need checking." }
          ]
        },
        {
          id: "m6-l2",
          title: "Layer masks: hide without deleting",
          minutes: 19,
          goals: [
            "Explain that a mask is a grayscale picture where white shows and black hides",
            "Add a mask and paint on it to reveal and hide parts of a layer",
            "View, disable and reuse a mask with the Alt-click, Shift-click and Ctrl-click shortcuts"
          ],
          assets: ["pearl-earring"],
          blocks: [
            { t: "p", html: "The eraser removes pixels for good. A <b>layer mask</b> hides them without removing anything. A mask is a grayscale picture attached to a layer: <b>white</b> means \"show this part of the layer\", <b>black</b> means \"hide it\", and shades of gray mean \"partly\". Paint on the mask with a brush and you reveal or conceal the layer wherever you like. Change your mind and paint the opposite color. Nothing is ever lost." },
            { t: "p", html: "This is the single most useful idea in editing. A good mnemonic: <b>white reveals, black conceals</b>." },
            { t: "h", text: "A color-pop effect" },
            { t: "steps", items: [
              {
                html: "Open <b>pearl-earring.jpg</b> and save it as <code>mask-practice.pcraft</code>. With <b>Background</b> selected, press <kbd>Ctrl</kbd>+<kbd>J</kbd> to duplicate it. Name the copy <b>Gray copy</b>.",
                check: "Two layers: Gray copy above Background."
              },
              {
                html: "With Gray copy selected, choose <b>Image</b> &gt; <b>Adjustments</b> &gt; <b>Desaturate</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>U</kbd>).",
                detail: "This changes the pixels of the copy, which is fine because the color original is safe on the Background layer beneath it.",
                check: "The picture turns black and white. The color is still on the Background, hidden beneath."
              },
              {
                html: "Click the <b>Add a mask</b> button in the row of buttons at the bottom of the Layers panel (hover over the buttons to read their tooltips).",
                check: "A white mask thumbnail appears next to the layer's thumbnail, with a frame around it to show it is targeted."
              },
              {
                html: "Make sure the <b>mask thumbnail</b> is highlighted (click it). Press <kbd>D</kbd> for black and white, then <kbd>X</kbd> if needed so that the foreground is <b>black</b>.",
                detail: "Clicking a layer's own thumbnail makes tools paint on the layer pixels. Clicking the mask thumbnail makes them paint on the mask. Always check which is framed."
              },
              {
                html: "Press <kbd>B</kbd> for the Brush. Open the Brush Preset picker and choose a large soft brush (Hardness near 0). Paint across the girl's face and the blue head cloth.",
                check: "Color appears where you paint, because black on the mask hides the gray layer and reveals the color layer below."
              },
              {
                html: "Press <kbd>X</kbd> to paint with white and paint over some of it.",
                check: "The gray comes back where you paint white. Nothing was erased: you simply changed what the mask hides."
              },
              {
                html: "<b>Alt</b>+click the mask thumbnail to view the mask alone as a black, white and gray picture. <b>Alt</b>+click again to go back.",
                check: "You see your brush strokes as black and gray marks on white."
              },
              {
                html: "<b>Shift</b>+click the mask thumbnail to switch the mask off, then <b>Shift</b>+click again to switch it on.",
                detail: "Other shortcuts: Ctrl+click the mask thumbnail to load the mask as a selection."
              }
            ] },
            { t: "h", text: "Masks from selections" },
            { t: "steps", items: [
              {
                html: "Remove the mask with <b>Layer</b> &gt; <b>Layer Mask</b> &gt; <b>Delete</b>, or undo until the layer has no mask. Make an <b>Elliptical Marquee</b> selection around the face with the Feather set to 60 px.",
                detail: "Set the Feather in the options bar before you drag out the ellipse."
              },
              {
                html: "Click the <b>Add a mask</b> button. Hold <kbd>Alt</kbd> as you click to make the mask the other way round.",
                check: "Without Alt, the oval reveals the gray layer and hides the rest (color shows outside the oval). With Alt, the oval hides the gray layer, so the face is in color and the rest is gray. Both have a soft edge."
              }
            ] },
            { t: "p", html: "The <b>Layer</b> &gt; <b>Layer Mask</b> submenu has the same ideas as commands: <b>Reveal All</b>, <b>Hide All</b>, <b>Reveal Selection</b>, <b>Hide Selection</b>, <b>Delete</b>, <b>Apply</b> (bakes the mask into the pixels, which cannot be undone after saving), plus <b>Enable Layer Mask</b> and <b>Link Layer Mask</b>." },
            { t: "callout", kind: "warn", html: "<b>No Density or Feather sliders on masks yet.</b> The Properties panel for a mask does not have Photoshop's Density and Feather controls. To soften a mask, feather the selection <i>before</i> you make the mask, or with the mask highlighted choose <b>Filter</b> &gt; <b>Blur</b> &gt; <b>Gaussian Blur...</b> to blur the mask itself. Undo and use the feathered selection route if the blur does not behave." },
            { t: "callout", kind: "tip", html: "<b>Paint soft, build slowly.</b> A large soft brush at 20 to 30% opacity makes the most natural transitions. Zoom in for tricky edges and use a small hard brush." },
            { t: "keys", items: [
              { keys: "D", action: "Default colors (black and white)" },
              { keys: "X", action: "Swap black and white (paint or erase on the mask)" },
              { keys: "Alt+click mask", action: "View the mask alone" },
              { keys: "Shift+click mask", action: "Disable or enable the mask" },
              { keys: "Ctrl+click mask", action: "Load the mask as a selection" }
            ] },
            { t: "callout", kind: "adobe", html: "Everything here matches Photoshop's layer masks, including <b>white reveals, black conceals</b> and the same mask-thumbnail shortcuts. Photoshop's Density and Feather sliders in the Properties panel are the part that is missing." },
            {
              t: "claude",
              title: "Mask it with Claude",
              html: "Use a fresh duplicate-and-desaturate of the portrait, or undo your masks first.",
              prompts: [
                {
                  prompt: "On the layer named \"Gray copy\", add a layer mask that reveals only an oval around the girl's face. Use a 60 pixel feather. Then take a screenshot and tell me whether the transition looks smooth.",
                  why: "Claude makes an elliptical selection with select.rect (ellipse true, feather 60) and runs layer.layerMask.revealSelection through mcp__photocraft__command_run. Look for the new mask thumbnail. Compare with the mask you made by hand: it is a clean oval, where yours was painted."
                },
                {
                  prompt: "Now show me the mask on its own. Then turn the mask off and on again so I can compare.",
                  why: "Claude uses layer.layerMask.enabled and may use the control channel to show the mask view, with screenshots. You can do the same by hand with Shift+click and Alt+click. If Claude cannot show the mask view, it will say so."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "Which color do you paint with on a mask to hide part of a layer?",
                  choices: ["White", "Black", "Red"],
                  answer: 1,
                  explain: "Black conceals, white reveals, gray is partial."
                },
                {
                  q: "What is the main advantage of a mask over the Eraser?",
                  choices: [
                    "It is faster",
                    "It hides pixels without destroying them, so you can bring them back",
                    "It works on text only"
                  ],
                  answer: 1,
                  explain: "Masks are non-destructive. The hidden pixels are still there."
                },
                {
                  q: "You paint, and the layer's pixels change instead of the mask. What happened?",
                  choices: [
                    "The layer thumbnail was targeted, not the mask thumbnail",
                    "The file is corrupted",
                    "The brush is too big"
                  ],
                  answer: 0,
                  explain: "Check which thumbnail has the frame: that is where painting goes."
                }
              ]
            },
            { t: "exercise", title: "Reverse the effect", html: "Flip your color-pop effect.", steps: [
              "Press Ctrl+I while the mask thumbnail is highlighted to invert the mask.",
              "Predict what happens, then try it. Which parts of the picture are now in color?",
              "Undo, then use Alt+click on the Add a mask button with a selection to get the same result a different way."
            ] },
            { t: "check", html: "You have a gray layer with a mask over a color layer, you have painted white and black on the mask, and you know how to view, disable and delete it." }
          ]
        },
        {
          id: "m6-l3",
          title: "Local adjustments: masks on adjustment layers and clipping",
          minutes: 19,
          goals: [
            "Make an adjustment layer affect only a selected area",
            "Fix or refine such a mask by painting and inverting",
            "Use Clip to layer below so an adjustment affects just one layer"
          ],
          assets: ["pearl-earring", "sierra-nevada"],
          blocks: [
            { t: "p", html: "Put the last two ideas together. An <b>adjustment layer</b> (module 5) changes tone or color; a <b>mask</b> limits where it applies. That gives you what photographers call <b>local adjustments</b>: brighten the face but not the background, darken the sky but not the mountains." },
            { t: "p", html: "In PhotoCraft there is a shortcut. If there is an active selection when you create an adjustment layer, the selection automatically becomes the layer's mask." },
            { t: "h", text: "Brighten a face" },
            { t: "steps", items: [
              {
                html: "Open <code>mask-practice.pcraft</code> or a fresh <b>pearl-earring.jpg</b>. Delete or hide the earlier work so you have a plain Background. Press <kbd>M</kbd>, switch to the <b>Elliptical Marquee</b>, and set <b>Feather</b> in the options bar to <b>80</b> px. Drag an oval around the face.",
                check: "An oval selection around the face."
              },
              {
                html: "Click <b>Background</b> in the Layers panel, then add a <b>Curves</b> adjustment layer: <b>Layer</b> &gt; <b>New Adjustment Layer</b> &gt; <b>Curves...</b>.",
                check: "The new layer has a mask thumbnail showing a soft oval."
              },
              {
                html: "In the Properties panel, drag the middle of the curve up a little.",
                check: "Only the face area gets brighter, fading smoothly into the rest of the picture."
              },
              {
                html: "If the effect landed on everything <i>except</i> the face, the mask came out inverted. Click the mask thumbnail to target it and press <kbd>Ctrl</kbd>+<kbd>I</kbd> to invert it.",
                detail: "Ctrl+I on a targeted layer mask inverts the mask, so white and black swap."
              },
              {
                html: "Press <kbd>Ctrl</kbd>+<kbd>D</kbd> to deselect. The mask stays. Now click the mask thumbnail, press <kbd>B</kbd> with a soft brush at low opacity, and paint with black to remove the brightening from the eyes, or white to add more to the cheeks.",
                check: "The adjustment fades in and out where you paint."
              },
              {
                html: "Rename the layer <b>Face lift</b> and toggle its eye to compare."
              }
            ] },
            { t: "h", text: "A vignette by inverting" },
            { t: "steps", items: [
              {
                html: "Delete or hide Face lift. Make a large <b>Elliptical Marquee</b> selection that covers most of the picture, with <b>Feather</b> set to <b>200</b> px.",
                detail: "A bigger picture needs a bigger feather. Photographers often use very soft vignettes."
              },
              {
                html: "Choose <b>Select</b> &gt; <b>Inverse Selection</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>) so the corners and edges are selected. Add a <b>Curves</b> layer and pull the curve's middle <b>down</b>.",
                check: "The edges darken, and the center is untouched: a classic vignette that draws the eye inward."
              },
              {
                html: "Deselect and rename the layer <b>Vignette</b>."
              }
            ] },
            { t: "h", text: "Clip an adjustment to one layer" },
            { t: "p", html: "A mask limits <i>where</i> an adjustment applies. <b>Clipping</b> limits <i>which layer</i> it applies to. A clipped adjustment affects only the single layer directly beneath it, and nothing else in the stack." },
            { t: "steps", items: [
              {
                html: "Add a new empty layer called <b>Paint swatch</b> and paint a big blob of orange on it. Now add a <b>Hue/Saturation</b> layer above it.",
                check: "Moving the Hue slider changes the whole picture, because the adjustment affects everything beneath it."
              },
              {
                html: "In the Properties panel for the Hue/Saturation layer, tick <b>Clip to layer below</b>. (The Layer menu equivalent is <b>Create Clipping Mask</b>, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd>.)",
                check: "Now only the orange blob changes color when you drag Hue. The rest of the picture stays put."
              },
              {
                html: "Delete both extra layers when you are done."
              }
            ] },
            { t: "h", text: "Refining edges (optional)" },
            { t: "p", html: "<b>Select</b> &gt; <b>Select and Mask...</b> (also a button in the Marquee and Magic Wand options bars) opens a dialog to clean up a selection, with <b>Radius</b>, <b>Smart Radius</b>, <b>Smooth</b>, <b>Feather</b>, <b>Contrast</b>, <b>Shift Edge</b>, <b>Decontaminate</b> and an <b>Output</b> choice that can send the result to a layer mask. It is simpler than Photoshop's version: there is no Refine Edge brush for hair or fur and no view modes. For most edges, a small Feather and Smooth do the job." },
            { t: "callout", kind: "warn", html: "<b>Retouch tools ignore masks.</b> In this version the Clone Stamp and healing tools do not respect a targeted layer mask. Keep retouching on a plain pixel layer (module 7) and use masks for adjustments." },
            {
              t: "claude",
              title: "Local adjustments by Claude",
              html: "Do these one at a time and review each in a screenshot.",
              prompts: [
                {
                  prompt: "Select an oval around the girl's face with an 80 pixel feather, then add a Curves adjustment layer named \"Face lift\" with the points (0,0), (128,145), (255,255). Deselect afterward. Take a screenshot and tell me whether the brightening is limited to the face.",
                  why: "Claude runs select.rect with ellipse and feather, then layer.newAdjustmentLayer.curves, which uses the active selection as the layer mask, then select.deselect. Check the mask thumbnail on the new layer and click it with Alt to view it. If the effect is inverted, ask Claude to fix it."
                },
                {
                  prompt: "Open practice/sierra-nevada.jpg. Select the sky, add a Curves adjustment layer named \"Sky darken\" that pulls the midtones down a little, deselect, and screenshot it. Tell me if the sky selection left a bright halo along the mountains.",
                  why: "Claude uses mcp__photocraft__doc_open, select.sky, layer.newAdjustmentLayer.curves and mcp__photocraft__ui_screenshot. Because Select Sky is classical, the edge may be imperfect. Zoom in on the mountain ridge and fix any halo by painting on the mask with a small brush."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "You make a selection and then add a Curves layer. What happens to the selection?",
                  choices: [
                    "It is ignored",
                    "It becomes the adjustment layer's mask",
                    "It deletes pixels"
                  ],
                  answer: 1,
                  explain: "PhotoCraft turns an active selection into the new adjustment layer's layer mask."
                },
                {
                  q: "A Hue/Saturation layer with Clip to layer below ticked will affect:",
                  choices: [
                    "Everything below it",
                    "Only the one layer directly beneath it",
                    "Only the mask"
                  ],
                  answer: 1,
                  explain: "Clipping restricts an adjustment to the layer under it."
                }
              ]
            },
            { t: "exercise", title: "Darken the sky, brighten the lake", html: "Use two local adjustments on one picture.", steps: [
              "Open sierra-nevada.jpg and save a work copy.",
              "Select the sky, add a Curves layer that darkens it, and name the layer.",
              "Select the lake with the Lasso (feather 30), add a Curves layer that brightens it slightly.",
              "Hide each layer in turn to judge the effect, and paint on the masks to fix edges."
            ] },
            { t: "check", html: "You have made a local adjustment through a selection, fixed an inverted mask, made a vignette, and used Clip to layer below." }
          ]
        }
      ]
    },
    {
      id: "m7",
      title: "Retouch, filters, crop, and transform",
      summary: "Clean up flaws with the healing and clone tools, soften and sharpen with filters, and reshape the picture with crop, straighten, transform and canvas size.",
      lessons: [
        {
          id: "m7-l1",
          title: "Heal and clone: remove what does not belong",
          minutes: 18,
          goals: [
            "Choose between Spot Healing, Healing Brush and Clone Stamp",
            "Remove small flaws on a duplicate layer so the original stays safe",
            "Set a clone source with Alt+click and avoid obvious repeating patterns"
          ],
          assets: ["pearl-earring", "starry-night"],
          blocks: [
            { t: "p", html: "Retouching means replacing unwanted pixels (a blemish, a scratch, a stray object) with good ones from somewhere nearby. Three tools do it, and they differ in how much thinking they do for you:" },
            { t: "p", html: "<ul><li><b>Spot Healing Brush</b> (<kbd>J</kbd>): you paint over the flaw and PhotoCraft picks the source automatically and blends it in. Best for small, isolated flaws. Its options bar offers <b>Type</b>: <b>Content-Aware</b>, <b>Create Texture</b> or <b>Proximity Match</b>.</li><li><b>Healing Brush</b> (same group): you choose the source yourself with <kbd>Alt</kbd>+click. It copies the <i>texture</i> from the source but keeps the <i>color and brightness</i> of where you paint, so edges blend invisibly.</li><li><b>Clone Stamp</b> (<kbd>S</kbd>): an exact copy of pixels from the source. No blending, so it is perfect for duplicating or covering an object, and riskier on gradients.</li></ul>" },
            { t: "callout", kind: "tip", html: "<b>Retouch on a duplicate.</b> Press <kbd>Ctrl</kbd>+<kbd>J</kbd> to copy the Background, name the copy <b>Retouch</b>, and work there. You can hide the copy to compare, or throw it away if you overdo it." },
            { t: "steps", items: [
              {
                html: "Open <b>pearl-earring.jpg</b> and save it as <code>retouch-practice.pcraft</code>. Zoom in (<kbd>Ctrl</kbd>+<kbd>1</kbd> for 100%) on her forehead and cheek. Look for the fine cracks in the old paint.",
                check: "You can see a web of thin pale lines."
              },
              {
                html: "Press <kbd>Ctrl</kbd>+<kbd>J</kbd> and rename the new layer <b>Retouch</b>."
              },
              {
                html: "Press <kbd>J</kbd> to choose the <b>Spot Healing Brush</b>. In the options bar set <b>Type</b> to <b>Content-Aware</b>. Make the brush a little bigger than the crack with <kbd>]</kbd> and <kbd>[</kbd>. Click or drag along one crack.",
                check: "The crack disappears and the skin tones blend smoothly."
              },
              {
                html: "Hide and show the Retouch layer to compare. Heal a few more cracks, but leave some, since removing every bit of texture makes skin look like plastic."
              },
              {
                html: "Right-click (or press and hold) the J tool to open its flyout and choose <b>Healing Brush</b>. <b>Alt</b>+click a clean patch of skin near a flaw to set the source, then paint over the flaw.",
                detail: "The Healing Brush's hint reads: Alt-click to define a source point to clone from."
              },
              {
                html: "Open <b>starry-night.jpg</b>, make a duplicate layer called <b>Clone work</b>, and press <kbd>S</kbd> for the <b>Clone Stamp</b>. Check the options bar: <b>Aligned</b> and <b>Sample</b> (Current Layer, Current &amp; Below, All Layers).",
                detail: "With Aligned on, the gap between where you sampled and where you paint stays the same as you move. With Aligned off, every stroke starts again from the original source point."
              },
              {
                html: "<b>Alt</b>+click on a bright star to set the source. Move to an empty patch of sky and click or drag once.",
                check: "A copy of the star appears where you painted. Change the source and paint again for several more."
              }
            ] },
            { t: "callout", kind: "warn", html: "<b>Beginner traps.</b> (1) Reusing one source over and over creates obvious repeating patterns: change the source often. (2) In this version the retouch tools ignore a layer mask or channel that is targeted, so retouch on the plain pixel layer. (3) Sample All Layers does not apply to the Blur, Sharpen and Smudge tools. (4) If nothing happens when you paint, check that the Retouch layer is highlighted and visible." },
            { t: "callout", kind: "adobe", html: "Photoshop's newer <b>Remove</b> tool and Generative Fill do not exist in PhotoCraft: it has no AI. The Spot Healing Brush's Content-Aware type is a classical algorithm. It copes with small flaws but not with large objects or complicated backgrounds." },
            {
              t: "claude",
              title: "Heal at exact coordinates",
              html: "Claude cannot judge where a flaw is as accurately as you can, but it can heal at coordinates you give it. Move your pointer over a flaw and read the X and Y position in the <b>Info</b> panel (<kbd>F8</kbd>).",
              prompts: [
                {
                  prompt: "On a duplicate of the Background layer named \"Claude retouch\", spot heal at x=1010, y=640 and x=1120, y=700 using Content-Aware healing and a 30 pixel brush. Then take a screenshot and tell me whether the spots look clean. (Replace these numbers with coordinates from the picture.)",
                  why: "Claude uses layer.duplicate and layer.setProps to name it, then paint.spotHealing with a list of points through mcp__photocraft__command_run, and mcp__photocraft__ui_screenshot. Replace x and y with the coordinates you read from the Info panel. The edit shows live on the new layer. Compare it with your hand-made version."
                },
                {
                  prompt: "On the starry night picture, on a new duplicate layer named \"Clone test\", clone from the bright star at x=900, y=300 onto x=1300, y=250 with a 80 pixel soft brush. Tell me what command and parameters you used.",
                  why: "Claude runs paint.cloneStamp with points, a source, size, hardness and aligned. Coordinates are in image pixels, so read yours from the Info panel. This is the same idea as your Alt+click source."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "You want to cover a small blemish on skin so that it blends with the surrounding color. Which tool is the best first choice?",
                  choices: ["Clone Stamp", "Spot Healing Brush", "Eraser"],
                  answer: 1,
                  explain: "Spot Healing samples nearby and blends tone and color automatically."
                },
                {
                  q: "How do you set the source point for the Clone Stamp?",
                  choices: ["Double-click the image", "Alt+click on the spot to copy from", "Press S twice"],
                  answer: 1,
                  explain: "Alt+click defines the source. The hint in the options bar says so."
                },
                {
                  q: "Why retouch on a duplicate layer?",
                  choices: [
                    "It runs faster",
                    "You can hide it to compare, or discard it, without damaging the original",
                    "The tools only work on duplicates"
                  ],
                  answer: 1,
                  explain: "A duplicate layer keeps the original Background pixels safe."
                }
              ]
            },
            { t: "exercise", title: "Add stars to the sky", html: "Practice cloning with a purpose.", steps: [
              "On the starry night picture, add four stars to an empty part of the sky using the Clone Stamp, each from a different source.",
              "Check that no two look identical (vary the brush size or the source).",
              "Hide the Clone work layer to compare with the original."
            ] },
            { t: "check", html: "You healed cracks on a duplicate layer, set a clone source with Alt+click, and know why varying the source avoids repeating patterns." }
          ]
        },
        {
          id: "m7-l2",
          title: "Blur, sharpen, and filters",
          minutes: 16,
          goals: [
            "Apply Gaussian Blur and Unsharp Mask using the Filter menu",
            "Explain what sharpening does and does not do",
            "Make a glow effect with a blurred duplicate and a blend mode"
          ],
          assets: ["starry-night"],
          blocks: [
            { t: "p", html: "A <b>filter</b> is a recipe applied to the pixels of a layer, and PhotoCraft has more than 70 of them in the <b>Filter</b> menu. Two are used constantly:" },
            { t: "p", html: "<ul><li><b>Blur</b> averages each pixel with its neighbors. Gaussian Blur is the smooth, general-purpose one, and its <b>Radius</b> says how far to spread.</li><li><b>Sharpen</b> increases contrast right along edges so they look crisper. It cannot recover detail that was never captured (focus mistakes stay mistakes).</li></ul>" },
            { t: "callout", kind: "note", html: "<b>Filters change pixels.</b> Like Image &gt; Adjustments, a normal filter permanently rewrites the layer it runs on. Work on a duplicate layer, or on a Stamp Visible layer, so you can hide or delete the result." },
            { t: "steps", items: [
              {
                html: "Open <b>starry-night.jpg</b> and save it as <code>filters-practice.pcraft</code>. Press <kbd>Ctrl</kbd>+<kbd>J</kbd> and name the copy <b>Blur copy</b>.",
                check: "Two layers, with the copy on top."
              },
              {
                html: "With <b>Blur copy</b> selected choose <b>Filter</b> &gt; <b>Blur</b> &gt; <b>Gaussian Blur...</b>. Set the <b>Radius</b> to about 8 pixels. Use the preview option to compare before and after, then click <b>OK</b>.",
                check: "The copy is soft, and the stars become halos."
              },
              {
                html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to undo, then <b>Filter</b> &gt; <b>Last Filter</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>F</kbd>) to run the same filter again quickly.",
                detail: "Last Filter repeats the most recent filter with the same settings. It is handy when you filter many layers or images."
              },
              {
                html: "Now turn the blur into a glow. With Blur copy still selected set its blend mode to <b>Soft Light</b> or <b>Screen</b> and its opacity to about <b>50%</b>.",
                check: "The picture looks dreamy: crisp detail underneath, with a soft bloom on top."
              },
              {
                html: "Hide Blur copy. Click the top layer and press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd> (Stamp Visible) to create a flat copy on top. Name it <b>Sharpen</b>.",
                detail: "Sharpening works best as the very last step on a flat copy of the finished picture."
              },
              {
                html: "Zoom to 100%. Choose <b>Filter</b> &gt; <b>Sharpen</b> &gt; <b>Unsharp Mask...</b>. Use a modest amount and a small radius (around 1 to 2 pixels), and look at the edges of a star with the preview on and off.",
                detail: "Despite its name, Unsharp Mask sharpens. Photoshop's other choice, Smart Sharpen, is also in the menu."
              },
              {
                html: "Click OK. Hide and show the Sharpen layer to see the difference at 100% zoom."
              }
            ] },
            { t: "callout", kind: "warn", html: "<b>Over-sharpening is obvious.</b> Bright halos along edges and crunchy texture mean you went too far. Judge sharpening at 100% zoom, and at the final size you will export, since resizing afterward changes how sharp the picture looks." },
            { t: "callout", kind: "tip", html: "<b>Smart filters.</b> <b>Filter</b> &gt; <b>Convert for Smart Filters</b> turns a layer into a smart object so filters you apply can be edited or hidden later. If it works well on your build, it is the safest way to filter. If a filter behaves strangely on a smart object, fall back to the duplicate-layer method above." },
            { t: "callout", kind: "note", html: "Long filters on big images can take several seconds in this early version. That is normal. Claude can start long filters as background jobs and check on them." },
            {
              t: "claude",
              title: "The glow, by Claude",
              html: "Delete your Blur copy first so Claude builds its own.",
              prompts: [
                {
                  prompt: "Duplicate the Background layer, name the copy \"Claude glow\", apply a Gaussian blur of radius 20 pixels to it, then set its blend mode to Soft Light at 50% opacity. Take a screenshot and tell me what the picture looks like.",
                  why: "Claude chains layer.duplicate, filter.blur.gaussianBlur with a radius, and layer.setProps (name, blend Soft Light, opacity 0.5) through mcp__photocraft__command_run, or in one go with mcp__photocraft__command_batch. A blur on a big layer may start as a background job (see mcp__photocraft__jobs_list). Compare the radius 20 glow with your radius 8."
                },
                {
                  prompt: "Make a Stamp Visible layer on top called \"Final sharpen\" and apply Smart Sharpen with an amount of 80 to it. Then tell me how to check the result at 100 percent.",
                  why: "Claude uses layer.stampVisible, layer.setProps for the name, and filter.sharpen.smartSharpen with an amount of 80. You should still zoom to 100% yourself: a 2048-pixel screenshot cannot show fine sharpening."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "You applied Unsharp Mask and the picture is still out of focus. Why?",
                  choices: [
                    "Sharpening only increases edge contrast: it cannot recover detail that was never captured",
                    "You forgot to save",
                    "The filter is broken"
                  ],
                  answer: 0,
                  explain: "Sharpening improves perceived crispness only. Focus mistakes cannot be fixed."
                },
                {
                  q: "When should you usually sharpen?",
                  choices: ["Before any other edit", "As the last step, at the final size", "Never"],
                  answer: 1,
                  explain: "Resizing and other edits change how sharp a picture looks, so sharpen last."
                }
              ]
            },
            { t: "exercise", title: "Tilt-shift mini-world", html: "Use a blur on a mask for a miniature effect.", steps: [
              "Duplicate the Background and blur the copy strongly (radius 15).",
              "Add a layer mask to the copy and paint black over a horizontal band in the middle to keep it sharp.",
              "Soften the transition by painting with a soft brush at low opacity. Compare it with the original."
            ] },
            { t: "check", html: "You made a blur and a glow on separate layers, sharpened a flat copy at 100% zoom, and know that filters change pixels." }
          ]
        },
        {
          id: "m7-l3",
          title: "Crop and straighten",
          minutes: 17,
          goals: [
            "Crop to a standard aspect ratio and keep or delete the cropped pixels",
            "Straighten a crooked horizon with the Ruler tool",
            "Choose a crop that improves the composition"
          ],
          assets: ["tetons"],
          blocks: [
            { t: "p", html: "Cropping is the cheapest way to improve a picture. It removes distractions, changes the shape to fit where the picture will be used, and pushes the eye toward what matters. Photographers often place important things on the <b>rule of thirds</b>: imagine two lines across and two down, dividing the picture into nine boxes, and put key elements on the lines or where they cross. The crop tool shows that grid as an overlay." },
            { t: "p", html: "Common aspect ratios: <b>1:1</b> (square posts), <b>4:5</b> (tall social posts), <b>2:3</b> (4 x 6 prints), <b>16:9</b> (video and wide screens). PhotoCraft's Crop options include presets for all of these." },
            { t: "steps", items: [
              {
                html: "Open <b>tetons.jpg</b> and save it as <code>crop-practice.pcraft</code>.",
                check: "A mountain landscape."
              },
              {
                html: "Press <kbd>C</kbd> for the <b>Crop</b> tool. In the options bar open the ratio dropdown (it says <b>Ratio</b>) and choose <b>16 : 9</b>.",
                detail: "The options bar also has width and height ratio fields with a swap button, a Clear button, an Overlay: Rule of Thirds button, a Delete Cropped Pixels checkbox, and commit and cancel buttons at the right.",
                check: "A frame appears on the picture, locked to the chosen shape, with handles at its edges and corners."
              },
              {
                html: "Drag inside the frame to move it, and drag a corner handle to resize it. Place the mountain peak on a thirds line.",
                check: "The area outside the frame is dimmed."
              },
              {
                html: "Leave <b>Delete Cropped Pixels</b> unchecked. Press <kbd>Enter</kbd> (or click the checkmark at the right of the options bar) to commit the crop.",
                detail: "With Delete Cropped Pixels off, the pixels outside the frame are kept rather than thrown away, so the crop is less final (try Image > Reveal All to see them). Turn the option on when you want a smaller file. Press Esc instead of Enter to cancel a crop.",
                check: "The picture is now 16:9. The tab and status bar show the new size."
              },
              {
                html: "Undo the crop (<kbd>Ctrl</kbd>+<kbd>Z</kbd>). Repeat with <b>1 : 1 (Square)</b> and <b>4 : 5 (8 : 10)</b> and notice how differently the same scene reads."
              }
            ] },
            { t: "h", text: "Straighten a crooked picture" },
            { t: "p", html: "PhotoCraft's Crop tool has no <b>Straighten</b> button. Use the Ruler tool instead: draw a line along something that should be perfectly level or upright, and PhotoCraft rotates the layer to match." },
            { t: "steps", items: [
              {
                html: "First make a crooked copy to practice on: choose <b>Image</b> &gt; <b>Image Rotation</b> &gt; <b>Arbitrary...</b>, enter <b>3</b> degrees, and confirm.",
                check: "The picture is tilted, with empty corners."
              },
              {
                html: "Open the Eyedropper flyout (right-click the <b>Eyedropper</b>, or press and hold it) and choose the <b>Ruler</b> tool, or use <b>Image</b> &gt; <b>Analysis</b> &gt; <b>Ruler Tool</b>. Drag a line along a part of the scene that should be level, such as the far shoreline or the river's edge.",
                detail: "The options bar shows X, Y, W, H and A (the angle of your line).",
                check: "A line appears, and the options bar shows an angle (A) that is not 0."
              },
              {
                html: "Click <b>Straighten Layer</b> in the options bar.",
                detail: "If PhotoCraft refuses because the Background layer is locked, double-click Background to turn it into an ordinary layer and try again.",
                check: "The picture rotates so your line is horizontal."
              },
              {
                html: "Press <kbd>C</kbd>, crop in to remove the empty corners, and commit with <kbd>Enter</kbd>."
              }
            ] },
            { t: "callout", kind: "warn", html: "<b>Not available yet:</b> perspective crop, and the Crop tool's Width x Height x Resolution fields (only ratios are supported). For leaning buildings, <b>Edit</b> &gt; <b>Transform</b> &gt; <b>Perspective</b> and <b>Edit</b> &gt; <b>Perspective Warp</b> exist, but this course does not cover them." },
            { t: "callout", kind: "adobe", html: "In Photoshop tutorials, \"Straighten\" is a button in the Crop tool's options bar. Here it lives in the Ruler tool as <b>Straighten Layer</b>. Everything else (ratio presets, the overlay, the Delete Cropped Pixels checkbox) is the same." },
            {
              t: "claude",
              title: "A crop by rectangle",
              html: "Start from the unrotated tetons picture.",
              prompts: [
                {
                  prompt: "Tell me the pixel size of the open picture. Then crop it to a 4:5 portrait rectangle that is as large as possible and sits against the right edge, without deleting the cropped pixels. Show me a screenshot and tell me how the composition changed.",
                  why: "Claude reads the size with mcp__photocraft__doc_inspect, works out the rectangle (a height-limited 4:5 box), and runs image.crop with x, y, width, height and deleteCroppedPixels false. Compare it with your own crop. Claude can do the arithmetic, but you decide the composition."
                },
                {
                  prompt: "Look at the picture and act as a composition coach. Suggest two different crops, one square and one 16:9, and say where the mountain peak would sit in each. Don't change anything.",
                  why: "A coaching request that uses mcp__photocraft__ui_screenshot. Try one of Claude's suggestions by hand and judge for yourself. Claude's sense of composition is a useful second opinion, not a rule."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "Which ratio is a square?",
                  choices: ["4:5", "1:1", "16:9"],
                  answer: 1,
                  explain: "1:1 means equal width and height."
                },
                {
                  q: "How do you straighten a crooked horizon in PhotoCraft?",
                  choices: [
                    "Use the Ruler tool along the horizon and click Straighten Layer",
                    "Click the Straighten button in the Crop options",
                    "Flip the canvas"
                  ],
                  answer: 0,
                  explain: "PhotoCraft has no Straighten button in the Crop tool. The Ruler tool does it."
                }
              ]
            },
            { t: "check", html: "You cropped the same picture to three ratios, straightened a tilted copy with the Ruler tool, and know what Delete Cropped Pixels does." }
          ]
        },
        {
          id: "m7-l4",
          title: "Free Transform, flips, and canvas size",
          minutes: 16,
          goals: [
            "Scale, rotate and move a layer with Free Transform",
            "Flip and rotate layers and whole images from the menus",
            "Add a border with Canvas Size and tell it apart from Image Size"
          ],
          assets: ["sierra-nevada"],
          blocks: [
            { t: "p", html: "<b>Free Transform</b> (<kbd>Ctrl</kbd>+<kbd>T</kbd>) puts handles around the active layer so you can move, scale and rotate it in one go. Every transform resamples the pixels, so repeated transforms soften them. Scale down freely, scale up sparingly, and apply a transform once rather than many small times." },
            { t: "steps", items: [
              {
                html: "Open <b>sierra-nevada.jpg</b> and save it as <code>transform-practice.pcraft</code>. Press <kbd>Ctrl</kbd>+<kbd>J</kbd> to duplicate Background and name the copy <b>Small copy</b>.",
                check: "Two layers."
              },
              {
                html: "With <b>Small copy</b> selected press <kbd>Ctrl</kbd>+<kbd>T</kbd>. A box with handles appears around the layer.",
                check: "Handles at the corners and edge midpoints."
              },
              {
                html: "Drag a corner handle toward the center to shrink the copy. Watch whether the shape keeps its proportions.",
                detail: "By default a corner drag keeps the proportions, and holding Shift changes that, so you can stretch freely. If it behaves the other way round on your build, there is a legacy Free Transform preference. Stretching a picture squashes people and landscapes, so keep proportions in most cases.",
                check: "A smaller version of the picture sits on top of the original."
              },
              {
                html: "Move the pointer just <b>outside</b> a corner until the cursor changes to a curved arrow, then drag to rotate. Drag inside the box to move it.",
                check: "The copy tilts like a photo lying on the big picture."
              },
              {
                html: "Press <kbd>Enter</kbd> to commit the transform, or <kbd>Esc</kbd> to cancel it."
              }
            ] },
            { t: "p", html: "<b>Flips and quarter turns.</b> <b>Edit</b> &gt; <b>Transform</b> has <b>Rotate 180&deg;</b>, <b>Rotate 90&deg; Clockwise</b>, <b>Rotate 90&deg; Counter Clockwise</b>, <b>Flip Horizontal</b> and <b>Flip Vertical</b>. They apply to the active layer. <b>Image</b> &gt; <b>Image Rotation</b> does the same for the whole canvas, with all layers together. <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> (<b>Transform Again</b>) repeats the last transform." },
            { t: "h", text: "Canvas Size: make room around the picture" },
            { t: "p", html: "<b>Image Size</b> (module 2) changes how many pixels the picture <i>contains</i>. <b>Canvas Size</b> changes the size of the <i>working area</i> around it, and adds empty space without stretching anything. It is how you add a border, or room for text." },
            { t: "steps", items: [
              {
                html: "Hide Small copy. Choose <b>Image</b> &gt; <b>Canvas Size...</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>C</kbd>).",
                detail: "The dialog shows the current size, then New Size, a Relative checkbox, an Anchor grid and a Canvas extension color dropdown."
              },
              {
                html: "Tick <b>Relative</b>, enter <b>120</b> for both Width and Height, keep the <b>Anchor</b> in the center, and set <b>Canvas extension color</b> to <b>White</b>. Click <b>OK</b>.",
                detail: "Relative means the numbers are added to the current size, so 120 adds 60 pixels on each side when the anchor is in the center.",
                check: "The picture now has a 60 pixel white border all around."
              },
              {
                html: "Undo, then try an anchor at the top and see the extra space appear on the other side."
              }
            ] },
            { t: "callout", kind: "tip", html: "<b>Use a smart object for repeated scaling.</b> Right before several transforms of the same layer, convert it with <b>Layer</b> &gt; <b>Smart Objects</b> &gt; <b>Convert to Smart Object</b>. A smart object remembers the original pixels, so scaling down and back up does not blur it." },
            { t: "callout", kind: "warn", html: "<b>Free Transform is rough in places.</b> There is no right-click menu on the transform box, and bugs are known with linked masks and selection transforms. If something misbehaves, press <kbd>Esc</kbd>, undo, and try the Edit &gt; Transform submenu items instead." },
            {
              t: "claude",
              title: "Border and rotation by Claude",
              html: "Undo your own border first so Claude can add its own.",
              prompts: [
                {
                  prompt: "Add a white border of 60 pixels on every side of the picture by enlarging the canvas, keeping the picture centered. Then rotate the \"Small copy\" layer by 90 degrees clockwise, and tell me what each command was.",
                  why: "Claude runs image.canvasSize (width 120, height 120, relative true, anchor center, extensionColor white) and edit.transform.rotate90Cw through mcp__photocraft__command_run. Note the Image Size versus Canvas Size distinction in what Claude tells you."
                },
                {
                  prompt: "Move the \"Small copy\" layer 200 pixels right and 150 pixels down. Then show me the layer list and a screenshot.",
                  why: "Claude uses layer.translate with dx 200 and dy 150, then mcp__photocraft__doc_inspect and a screenshot. It is the same as dragging with the Move tool, but exact."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "You want white space around a picture without stretching it. Which command?",
                  choices: ["Image Size", "Canvas Size", "Free Transform"],
                  answer: 1,
                  explain: "Canvas Size changes the working area and leaves the picture's pixels alone."
                },
                {
                  q: "You commit a Free Transform by pressing:",
                  choices: ["Esc", "Enter", "Tab"],
                  answer: 1,
                  explain: "Enter commits and Esc cancels."
                }
              ]
            },
            { t: "exercise", title: "Polaroid", html: "Make an instant-photo frame.", steps: [
              "Duplicate the picture, scale the copy to about 60%, and rotate it a few degrees.",
              "Use Canvas Size to add a larger border at the bottom (set the anchor to the top).",
              "Save the file and export a PNG."
            ] },
            { t: "check", html: "You scaled and rotated a layer with Free Transform, flipped a layer, and added a border with Canvas Size." }
          ]
        }
      ]
    },
    {
      id: "m8",
      title: "Type, delivery, and your capstone",
      summary: "Add text and shapes with layer styles, export pictures for the web, let Claude batch the boring work, and finish a complete title-card project from start to export.",
      lessons: [
        {
          id: "m8-l1",
          title: "Type, shapes, and layer styles",
          minutes: 20,
          goals: [
            "Add and edit text with the Type tool and the Character panel",
            "Draw a vector shape and give it a drop shadow with Layer Style",
            "Group the pieces of a caption so they move and hide together"
          ],
          assets: ["great-wave"],
          blocks: [
            { t: "p", html: "Text and shapes in PhotoCraft are not pixels. A <b>Type layer</b> stays editable: you can change the words, font and size at any time. A <b>Shape layer</b> is made from math (a <b>vector</b>), so it stays perfectly sharp at any size. And a <b>layer style</b> is an effect, such as a drop shadow, that sits on top of a layer without changing its pixels. All three are non-destructive." },
            { t: "image", src: "../photocraft/docs/images/photocraft-demo.jpg", alt: "The Great Wave with a dark caption card, a large title and a small credit line, and the Layers panel listing Title, Credit and Caption Card layers", caption: "What you will build: Title and Credit are Type layers. Caption Card is a Shape layer with a Drop Shadow, shown by the fx badge and the Effects row in the Layers panel." },
            { t: "h", text: "Add text" },
            { t: "steps", items: [
              {
                html: "Open <b>great-wave.jpg</b> and save it as <code>type-practice.pcraft</code>. Press <kbd>T</kbd> for the <b>Type</b> tool.",
                check: "The options bar shows text controls such as font and size."
              },
              {
                html: "Click once in the lower left of the picture (this makes <b>point text</b>) and type <b>The Great Wave</b>. Press <kbd>Ctrl</kbd>+<kbd>Enter</kbd> to commit.",
                detail: "Dragging out a box instead of clicking makes paragraph text, which wraps inside the box. In this version Esc may also keep your text even though a tooltip suggests it cancels, so use Ctrl+Enter.",
                check: "A new layer with a T thumbnail appears, named after its text."
              },
              {
                html: "Open the <b>Character</b> panel (<b>Window</b> &gt; <b>Character</b>, or <b>Type</b> &gt; <b>Panels</b> &gt; <b>Character Panel</b>). With the Type layer selected, make the text large (for a picture this size, try around 200) and set its color to white by clicking the color swatch.",
                detail: "PhotoCraft's default font is Inter. Which other fonts you can choose depends on your build, so if a font looks wrong, choose another.",
                check: "Big white text on the picture."
              },
              {
                html: "Add a second Type layer below it in a much smaller size with the credit line, for example <b>Katsushika Hokusai, c. 1831, public domain</b>. Commit with <kbd>Ctrl</kbd>+<kbd>Enter</kbd>.",
                check: "Two Type layers in the Layers panel."
              },
              {
                html: "To change words later, double-click the T thumbnail of a Type layer, edit, and commit again. Use the Move tool (<kbd>V</kbd>) to position each layer."
              }
            ] },
            { t: "h", text: "A caption card with a drop shadow" },
            { t: "steps", items: [
              {
                html: "Press <kbd>U</kbd> for the shape tools and choose <b>Rectangle</b> (or Rounded Rectangle in the flyout). Drag a box behind your text. Choose a dark color for its fill in the options bar.",
                check: "A new layer of kind Shape appears above the text layers."
              },
              {
                html: "The card is covering your text. Select the shape layer and press <kbd>Ctrl</kbd>+<kbd>[</kbd> (Send Backward) until it sits below both text layers. Lower its <b>Opacity</b> to about 60%.",
                check: "The text is readable on top of a semi-transparent dark card."
              },
              {
                html: "With the card layer selected, click the <b>Add a layer style</b> button (<b>fx</b>) at the bottom of the Layers panel and choose <b>Drop Shadow</b>. (Or use <b>Layer</b> &gt; <b>Layer Style</b> &gt; <b>Drop Shadow...</b>.)",
                detail: "The effect dialog has settings such as the shadow's opacity, angle, distance and size. You can also double-click a layer row to open Layer Style. PhotoCraft offers ten effects: Bevel &amp; Emboss, Stroke, Inner Shadow, Inner Glow, Satin, Color Overlay, Gradient Overlay, Pattern Overlay, Outer Glow and Drop Shadow.",
                check: "A soft shadow appears behind the card, and its layer row shows an fx badge and an Effects list."
              },
              {
                html: "Select both Type layers and the Shape layer (<kbd>Ctrl</kbd>+click each) and press <kbd>Ctrl</kbd>+<kbd>G</kbd> to group them. Name the group <b>Caption</b>.",
                check: "One folder that you can hide or move as a unit."
              },
              {
                html: "Save with <kbd>Ctrl</kbd>+<kbd>S</kbd>."
              }
            ] },
            { t: "callout", kind: "note", html: "<b>Opacity versus Fill, again.</b> On the card, lowering <b>Opacity</b> also fades the drop shadow. Lowering <b>Fill</b> instead fades only the card's own color and leaves the shadow at full strength. Try both." },
            { t: "callout", kind: "warn", html: "<b>Text limits in this version:</b> no text on a path, no manual pair kerning, no live preview in the Warp Text dialog, and no OpenType feature buttons. Right-to-left and complex scripts have gaps. For simple titles and captions it works well." },
            { t: "callout", kind: "adobe", html: "Same names as Photoshop: Type tool, Character panel, Layer Style, Drop Shadow, fx. Layer styles can be copied between layers with <b>Layer</b> &gt; <b>Layer Style</b> &gt; <b>Copy Layer Style</b> and <b>Paste Layer Style</b>." },
            {
              t: "claude",
              title: "A caption by Claude",
              html: "Undo or hide your Caption group first so you can compare.",
              prompts: [
                {
                  prompt: "Add a caption to the open picture: a white title \"The Great Wave\" in 200 pixel text near the lower left, and a smaller line below it \"Katsushika Hokusai, c. 1831\". Put a dark semi-transparent rectangle named \"Caption Card\" behind both with a soft drop shadow, then group all three layers as \"Caption\". Take a screenshot and tell me if the text is readable.",
                  why: "Claude runs type.create twice (with x, y, text, size and color), shape.create (kind rect, with fill and name), layer.layerStyle.dropShadow, layer.arrange commands to put the card behind the text, and layer.groupLayers, through mcp__photocraft__command_run or command_batch. Watch the layers appear one by one. Compare the font and spacing with yours."
                },
                {
                  prompt: "Change the title text to \"Great Wave off Kanagawa\" and make the drop shadow on the card a bit softer. Don't add any new layers.",
                  why: "Claude uses type.edit and layer.layerStyle.dropShadow with a larger size. Editing, not rebuilding, keeps the layer list tidy, and the History panel shows each small change."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "What is the main benefit of a Type layer over text painted into pixels?",
                  choices: [
                    "It prints better",
                    "You can change the words, font and size later, and it stays sharp",
                    "It takes less space"
                  ],
                  answer: 1,
                  explain: "Type and shape layers stay editable and resolution-independent."
                },
                {
                  q: "You want the title and card to move together. What do you do?",
                  choices: ["Merge them", "Group them with Ctrl+G", "Lock them"],
                  answer: 1,
                  explain: "A group moves and hides as one unit, and its layers stay separate."
                }
              ]
            },
            { t: "exercise", title: "Style it three ways", html: "Explore layer styles on the title text.", steps: [
              "Add an Outer Glow to the title and an Inner Shadow to the card.",
              "Use Stroke on the title to give it a thin dark outline for readability.",
              "Copy the layer style from the card and paste it onto a new shape layer."
            ] },
            { t: "check", html: "You have editable Type layers, a Shape layer with a drop shadow, and a group named Caption, all in a saved layered file." }
          ]
        },
        {
          id: "m8-l2",
          title: "Deliver: export for the web and batch with Claude",
          minutes: 18,
          goals: [
            "Choose size, format and quality for a delivery file with Export As",
            "Ask Claude to batch-resize a folder safely with the headless server",
            "Check a batch run and keep originals untouched"
          ],
          assets: ["the-kiss", "great-wave"],
          blocks: [
            { t: "p", html: "A picture's job is done when it reaches its audience in the right size and format. Websites do not need 4000-pixel photos, and big files load slowly. A good rule is to export at the size you need, with just enough quality, from your layered master." },
            { t: "h", text: "By hand: Export As" },
            { t: "steps", items: [
              {
                html: "Open <b>the-kiss.jpg</b>. Choose <b>File</b> &gt; <b>Export</b> &gt; <b>Export As...</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>W</kbd>).",
                check: "The File Settings panel with a live preview opens."
              },
              {
                html: "Set <b>Format</b> to <b>JPG</b> and <b>Quality</b> to about 85. Under <b>Image Size</b> set the scale to about 50%. Read the resulting pixel size and the estimated file size.",
                detail: "The dialog also offers Transparency (for PNG and WebP), Metadata (None or All) and, for WebP, a Lossless choice. Choosing None for metadata removes camera details and location information that you may not want to share."
              },
              {
                html: "Export it to your <code>exports</code> folder as <code>the-kiss-web.jpg</code>. Then export again with <b>Quality</b> set to 30 as <code>the-kiss-low.jpg</code>.",
                check: "Two files with very different sizes."
              },
              {
                html: "Open both exports in PhotoCraft and zoom to 200% on the gold pattern.",
                check: "The quality 30 file shows blocky smudges and halos. The 85 file looks like the original."
              }
            ] },
            { t: "callout", kind: "tip", html: "<b>Suggested settings.</b> Photos for the web: JPG, quality 80 to 90, long side 1600 to 2400 pixels. Graphics and screenshots: PNG. Photos with transparency or the smallest files: WebP. Social media: 1080 pixels on the short side is plenty." },
            { t: "h", text: "With Claude: a batch" },
            { t: "p", html: "Doing this for one picture is easy. Doing it for fifty is where Claude helps. For batch work, use the <b>photocraft-headless</b> server: it opens each file directly (no window), applies commands, and saves, so it does not disturb the picture you are editing." },
            { t: "p", html: "Why not the live server? In the live bridge, saving uses the app's current settings and cannot choose the JPEG quality. The headless server's <code>doc_save</code> can take a format and a quality, and it also has <code>doc_close</code> so it can clean up after each file." },
            { t: "steps", items: [
              {
                html: "Make sure your <code>practice</code> folder holds several JPG files and the <code>exports</code> folder exists.",
                detail: "Claude Code can list the folder with its own file tools, since you started it in your work folder."
              },
              {
                html: "Paste the first prompt below into Claude Code. Read the plan Claude writes before you say yes.",
                check: "A numbered plan listing the files, the target size, the quality and the output names."
              },
              {
                html: "Say <i>go</i> and watch the tool calls. Approve them as they come.",
                detail: "Claude opens a file, checks its size, resizes it, saves to exports, and closes it, one file at a time."
              },
              {
                html: "Open two of the results by hand and check them at 100% zoom, as in the earlier steps."
              }
            ] },
            {
              t: "claude",
              title: "Batch-resize a folder safely",
              html: "These prompts use the <b>photocraft-headless</b> server, so you will not see changes in the PhotoCraft window. Look in File Explorer at <code>exports</code> instead.",
              prompts: [
                {
                  prompt: "Use the photocraft-headless server. List every .jpg file in the practice folder. Then, before changing anything, tell me your plan: for each file you will open it, resize it so its long side is 1200 pixels (keep the proportions, bicubic), and save a JPG at quality 85 into exports/, naming it after the original file with -1200 added (for example the-kiss-1200.jpg). You will never write to practice/. Wait for me to say go.",
                  why: "A plan-first batch. Claude lists files with its own file tools, plans mcp__photocraft-headless__doc_open, doc_inspect to read each size, command_run image.imageSize with a width or height, doc_save with a path, format and quality, and doc_close. Review the plan: does it handle both landscape and portrait images, and does it avoid practice/ for output?"
                },
                {
                  prompt: "Go. After finishing, give me a table of each output file with its pixel size and file size, and tell me if any file failed.",
                  why: "Claude repeats the open, resize, save, close cycle per file. Watch the exports folder fill up. If a call fails, Claude should report it and carry on or ask you rather than guessing."
                },
                {
                  prompt: "Now make a WebP copy of the-kiss.jpg at quality 80 in exports/ called the-kiss-1200.webp using the headless server, and compare its file size with the JPG.",
                  why: "Claude uses doc_open, image.imageSize, then doc_save with format webp and quality 80. WebP files are usually smaller than JPG at similar quality. Open both and compare them."
                }
              ]
            },
            { t: "p", html: "<b>Optional: the command-line tool.</b> PhotoCraft also ships <code>photocraft-cli.exe</code>, which works on any path with ordinary Windows paths. It can describe a file and convert it. These commands change nothing in your pictures:" },
            { t: "code", lang: "powershell", text: "$cli = \"{ROOT}\\photocraft\\target\\release\\photocraft-cli.exe\"\n& $cli info \"$env:USERPROFILE\\ArtCraft\\PhotoCraft\\practice\\the-kiss.jpg\" --compact\n& $cli convert \"$env:USERPROFILE\\ArtCraft\\PhotoCraft\\practice\\the-kiss.jpg\" \"$env:USERPROFILE\\ArtCraft\\PhotoCraft\\exports\\the-kiss-cli.webp\" --format webp --quality 80" },
            { t: "callout", kind: "note", html: "PhotoCraft also has built-in automation: the <b>Actions</b> panel (<kbd>Alt</kbd>+<kbd>F9</kbd>) records steps, and <b>File</b> &gt; <b>Automate</b> &gt; <b>Batch...</b> and <b>Create Droplet...</b> replay them on many files. They exist, but they are less polished in this early version, and Claude's flexible approach is usually easier to follow." },
            { t: "callout", kind: "warn", html: "<b>Batch safety.</b> Always write outputs to a different folder from the inputs, never in place. Ask for the plan first. Check two or three outputs yourself. Keep your layered masters, since a batch export is flat." },
            {
              t: "quiz",
              items: [
                {
                  q: "Why does the course use the headless server for batch jobs?",
                  choices: [
                    "It is more accurate",
                    "It works directly on files without a window and can set JPEG quality when saving",
                    "It is the only server that can resize"
                  ],
                  answer: 1,
                  explain: "The headless server's save tool accepts a format and quality, and it does not disturb the picture open in the live window."
                },
                {
                  q: "A batch should write its results:",
                  choices: ["Over the originals to save space", "To a separate folder such as exports/", "Anywhere on the disk"],
                  answer: 1,
                  explain: "Separate outputs keep the originals safe, and Claude can only write inside your work folder anyway."
                }
              ]
            },
            { t: "exercise", title: "A social media set", html: "Produce three versions of one picture.", steps: [
              "From your work file for the-kiss.jpg, export a 1080 x 1080 square JPG, a 1920 wide JPG and a small WebP.",
              "Ask Claude to do the same three for great-wave.jpg and compare its results with yours.",
              "Name every file clearly and keep them in exports/."
            ] },
            { t: "check", html: "You exported with different qualities by hand, ran a plan-first batch with Claude into exports/, and checked outputs yourself." }
          ]
        },
        {
          id: "m8-l3",
          title: "Capstone: a title card from start to export",
          minutes: 20,
          goals: [
            "Combine crop, tone, local adjustments, text and export in one project",
            "Keep every edit non-destructive and every layer named",
            "Review your work with Claude against a checklist"
          ],
          assets: ["sierra-nevada"],
          blocks: [
            { t: "p", html: "You have every skill you need. In this project you will turn <b>sierra-nevada.jpg</b> into a finished 16:9 title card for a travel video, entirely with non-destructive tools. Take your time. It may take longer than 20 minutes, and that is fine." },
            { t: "h", text: "The brief" },
            { t: "p", html: "<ul><li>A wide picture with a darker sky, a gentle vignette and a clear title with a caption card.</li><li>A layered master <code>capstone-sierra.pcraft</code> in your work folder.</li><li>A delivery file <code>exports/sierra-title-card.jpg</code>, 1920 pixels wide, quality about 85.</li><li>The original in <code>practice/</code> untouched.</li></ul>" },
            { t: "h", text: "Steps" },
            { t: "steps", items: [
              {
                html: "<b>Set up.</b> Open <code>practice/sierra-nevada.jpg</code> and immediately <b>Save As</b> <code>capstone-sierra.pcraft</code> in your work folder.",
                check: "The tab shows capstone-sierra.pcraft."
              },
              {
                html: "<b>Crop.</b> Use the Crop tool at <b>16 : 9</b>, with <b>Delete Cropped Pixels</b> off. Place the main peak on a thirds line. Press <kbd>Enter</kbd>.",
                check: "A wide, 16:9 picture."
              },
              {
                html: "<b>Global tone.</b> Add a <b>Levels</b> or <b>Curves</b> layer and shape the overall contrast, then a gentle <b>Vibrance</b> layer. Name each layer clearly (for example <b>Tone</b> and <b>Color</b>).",
                detail: "Watch the Histogram panel: spread the tones without clipping."
              },
              {
                html: "<b>Darken the sky.</b> Choose <b>Select</b> &gt; <b>Sky</b>, add a <b>Curves</b> layer that pulls the midtones down, deselect, and name it <b>Sky darken</b>. Zoom in on the ridge line and paint on its mask with a small soft brush to clean up any halo.",
                check: "The sky is richer, and the mountains are unchanged."
              },
              {
                html: "<b>Vignette.</b> Make a large <b>Elliptical Marquee</b> with a big feather (about 200), <b>Select</b> &gt; <b>Inverse Selection</b>, add a Curves layer that darkens, and name it <b>Vignette</b>. Deselect.",
                check: "The corners are slightly darker."
              },
              {
                html: "<b>Optional retouch.</b> If you see a flaw you dislike, duplicate Background (put the copy at the bottom, above Background), name it <b>Retouch</b>, and heal it there."
              },
              {
                html: "<b>Title.</b> Add a white title with the Type tool and a smaller caption line. Put a semi-transparent dark rectangle with a drop shadow behind them. Group the three layers as <b>Title</b>.",
                check: "Readable text on a card, in one group."
              },
              {
                html: "<b>Tidy.</b> Check that every layer has a clear name, and delete any layers you hid and no longer need (<b>Layer</b> &gt; <b>Delete</b> &gt; <b>Hidden Layers</b>). Save with <kbd>Ctrl</kbd>+<kbd>S</kbd>."
              },
              {
                html: "<b>Export.</b> <b>File</b> &gt; <b>Export</b> &gt; <b>Export As...</b>, JPG, quality about 85, and set the scale so the width is <b>1920</b> pixels. Save as <code>exports/sierra-title-card.jpg</code>. Open it and check it at 100% zoom.",
                check: "A file named sierra-title-card.jpg, 1920 pixels wide, in your exports folder."
              }
            ] },
            {
              t: "claude",
              title: "Review with Claude, then make a variant",
              html: "Do the review before you export, so you can fix what Claude finds.",
              prompts: [
                {
                  prompt: "Review my capstone document against this checklist and don't change anything: (1) the picture is 16:9, (2) there are separate tone, color, sky and vignette adjustment layers rather than baked-in edits, (3) every layer has a clear name, (4) the title, caption and card are in one group, (5) the Background layer is unchanged. For each point say pass or fail and what to fix.",
                  why: "Claude reads the layer tree and settings with mcp__photocraft__doc_inspect and may take a screenshot with mcp__photocraft__ui_screenshot. It checks facts (names, structure, layer kinds) very well and visual quality less well. Fix anything it flags, then ask it to check again."
                },
                {
                  prompt: "First save the open document as capstone-square.pcraft and tell me which file is now active. Then, in that copy, crop to a 1:1 square centered on the title and export a 1080 pixel square JPG to exports/sierra-square.jpg.",
                  why: "Claude uses mcp__photocraft__doc_save with a path (the live bridge needs one), then image.crop and another doc_save with a .jpg path. Saving first protects your 16:9 master. In the live app, the saved JPG uses the app's current settings, so use Export As by hand if you need to control the quality."
                },
                {
                  prompt: "Look at my finished title card as a photo editor would. Name the two things that work best and the two I should improve first, and say where in PhotoCraft to do each.",
                  why: "A coaching request that uses a screenshot. Choose one suggestion and try it. You should be the final judge of what looks right."
                }
              ]
            },
            {
              t: "quiz",
              items: [
                {
                  q: "Which choice keeps your project fully editable after you export?",
                  choices: [
                    "Exporting the JPG and deleting the .pcraft file",
                    "Saving the .pcraft master and exporting delivery files from it",
                    "Flattening the image before saving"
                  ],
                  answer: 1,
                  explain: "The layered .pcraft is your master. Exports are copies."
                }
              ]
            },
            { t: "exercise", title: "Make it yours", html: "Choose one stretch goal.", steps: [
              "Redo the project on pearl-earring.jpg or impression-sunrise.jpg with your own look.",
              "Make a three-image set (16:9, square and portrait 4:5) from one master and compare how the title works in each.",
              "Ask Claude to batch-export your master's three versions at three sizes using the headless server."
            ] },
            { t: "p", html: "<b>Where to go next.</b> PhotoCraft has plenty more to explore: Liquify and Puppet Warp (Filter and Edit menus), the Camera Raw filter (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>), Blur Gallery, the Pen tool and Paths panel, gradients, smart objects and Actions. Photoshop tutorials for the same features will mostly transfer, but check the <b>Limitations</b> list first, since PhotoCraft is early alpha. Ask Claude to explain any command you find with <code>command_list</code>." },
            { t: "check", html: "You have <code>capstone-sierra.pcraft</code>, <code>exports/sierra-title-card.jpg</code>, an untouched original, and Claude's checklist review." }
          ]
        }
      ]
    },
  ],
  shortcuts: [
    {
      group: "File",
      items: [
        { keys: "Ctrl+N", action: "New document" },
        { keys: "Ctrl+O", action: "Open" },
        { keys: "Ctrl+W", action: "Close" },
        { keys: "Ctrl+Alt+W", action: "Close all" },
        { keys: "Ctrl+S", action: "Save (opens Save As for a JPG or PNG)" },
        { keys: "Ctrl+Shift+S", action: "Save As" },
        { keys: "Ctrl+Alt+S", action: "Save a Copy" },
        { keys: "F12", action: "Revert to the last saved version" },
        { keys: "Ctrl+Alt+Shift+W", action: "Export As" },
        { keys: "Ctrl+Q", action: "Exit" }
      ]
    },
    {
      group: "Edit",
      items: [
        { keys: "Ctrl+Z", action: "Undo" },
        { keys: "Ctrl+Shift+Z", action: "Redo" },
        { keys: "Ctrl+Alt+Z", action: "Toggle last state (before and after)" },
        { keys: "Ctrl+X / Ctrl+C / Ctrl+V", action: "Cut, copy, paste" },
        { keys: "Ctrl+Shift+C", action: "Copy merged" },
        { keys: "Ctrl+Shift+V", action: "Paste in place" },
        { keys: "Shift+F5", action: "Fill dialog" },
        { keys: "Alt+Backspace", action: "Fill with the foreground color" },
        { keys: "Ctrl+Backspace", action: "Fill with the background color" },
        { keys: "Ctrl+T", action: "Free Transform" },
        { keys: "Ctrl+Shift+T", action: "Transform Again" },
        { keys: "Ctrl+K", action: "Search commands" }
      ]
    },
    {
      group: "Tools (single key)",
      items: [
        { keys: "V", action: "Move" },
        { keys: "M", action: "Marquee" },
        { keys: "L", action: "Lasso" },
        { keys: "W", action: "Magic Wand, Quick Selection, Object Selection" },
        { keys: "C", action: "Crop" },
        { keys: "I", action: "Eyedropper and Ruler" },
        { keys: "J", action: "Healing tools" },
        { keys: "B", action: "Brush" },
        { keys: "S", action: "Clone Stamp" },
        { keys: "Y", action: "History Brush" },
        { keys: "E", action: "Eraser" },
        { keys: "G", action: "Gradient and Paint Bucket" },
        { keys: "O", action: "Dodge, Burn and Sponge" },
        { keys: "P", action: "Pen" },
        { keys: "T", action: "Type" },
        { keys: "A", action: "Path Selection and Direct Selection" },
        { keys: "U", action: "Shape tools" },
        { keys: "H", action: "Hand" },
        { keys: "Z", action: "Zoom" },
        { keys: "D", action: "Default colors (black and white)" },
        { keys: "X", action: "Swap foreground and background colors" },
        { keys: "[ and ]", action: "Smaller and larger brush" },
        { keys: "Shift+[ and Shift+]", action: "Softer and harder brush" },
        { keys: "1 to 0", action: "Tool opacity in steps from 10% to 100%" }
      ]
    },
    {
      group: "View and navigation",
      items: [
        { keys: "Ctrl+=", action: "Zoom in" },
        { keys: "Ctrl+-", action: "Zoom out" },
        { keys: "Ctrl+0", action: "Fit on screen" },
        { keys: "Ctrl+1", action: "100%" },
        { keys: "Space (hold) + drag", action: "Pan" },
        { keys: "Alt + mouse wheel", action: "Zoom" },
        { keys: "Shift + mouse wheel", action: "Scroll sideways" },
        { keys: "Tab", action: "Hide or show all panels" },
        { keys: "Shift+Tab", action: "Hide or show the dock only" },
        { keys: "F", action: "Cycle screen modes" },
        { keys: "Ctrl+R", action: "Rulers" },
        { keys: "Ctrl+H", action: "Extras" }
      ]
    },
    {
      group: "Image",
      items: [
        { keys: "Ctrl+L", action: "Levels (destructive)" },
        { keys: "Ctrl+M", action: "Curves (destructive)" },
        { keys: "Ctrl+U", action: "Hue/Saturation (destructive)" },
        { keys: "Ctrl+B", action: "Color Balance (destructive)" },
        { keys: "Ctrl+I", action: "Invert" },
        { keys: "Ctrl+Shift+U", action: "Desaturate" },
        { keys: "Ctrl+Shift+L", action: "Auto Tone" },
        { keys: "Ctrl+Alt+Shift+L", action: "Auto Contrast" },
        { keys: "Ctrl+Shift+B", action: "Auto Color" },
        { keys: "Ctrl+Alt+I", action: "Image Size" },
        { keys: "Ctrl+Alt+C", action: "Canvas Size" }
      ]
    },
    {
      group: "Layers",
      items: [
        { keys: "Ctrl+Shift+N", action: "New layer" },
        { keys: "Ctrl+J", action: "Layer via Copy (duplicate)" },
        { keys: "Ctrl+Shift+J", action: "Layer via Cut" },
        { keys: "Ctrl+G", action: "Group layers" },
        { keys: "Ctrl+Alt+G", action: "Create or release a clipping mask" },
        { keys: "Ctrl+]", action: "Bring forward" },
        { keys: "Ctrl+[", action: "Send backward" },
        { keys: "Ctrl+Shift+]", action: "Bring to front" },
        { keys: "Ctrl+Shift+[", action: "Send to back" },
        { keys: "Ctrl+E", action: "Merge layers" },
        { keys: "Ctrl+Shift+E", action: "Merge visible" },
        { keys: "Ctrl+Alt+Shift+E", action: "Stamp visible (merged copy on top)" },
        { keys: "Alt+click mask thumbnail", action: "View the mask alone" },
        { keys: "Shift+click mask thumbnail", action: "Disable or enable the mask" },
        { keys: "Ctrl+click a thumbnail", action: "Load the layer or mask as a selection" }
      ]
    },
    {
      group: "Selection",
      items: [
        { keys: "Ctrl+A", action: "Select all" },
        { keys: "Ctrl+D", action: "Deselect" },
        { keys: "Ctrl+Shift+D", action: "Reselect" },
        { keys: "Ctrl+Shift+I", action: "Inverse selection" },
        { keys: "Shift+F6", action: "Feather" },
        { keys: "Ctrl+Alt+R", action: "Select and Mask" },
        { keys: "Q", action: "Quick Mask on and off" }
      ]
    },
    {
      group: "Filters and panels",
      items: [
        { keys: "Ctrl+Alt+F", action: "Last filter (repeat)" },
        { keys: "Ctrl+Shift+A", action: "Camera Raw filter" },
        { keys: "Ctrl+Shift+X", action: "Liquify" },
        { keys: "F5", action: "Brush Settings panel" },
        { keys: "F6", action: "Color panel" },
        { keys: "F7", action: "Layers panel" },
        { keys: "F8", action: "Info panel" },
        { keys: "Alt+F9", action: "Actions panel" }
      ]
    },
    {
      group: "While transforming, cropping and typing",
      items: [
        { keys: "Enter", action: "Commit a Free Transform or a crop" },
        { keys: "Esc", action: "Cancel a Free Transform or a crop" },
        { keys: "Ctrl+Enter", action: "Commit text with the Type tool" }
      ]
    }
  ],
  glossary: [
    { term: "Adjustment layer", def: "A layer that holds a tone or color change (Levels, Curves, Hue/Saturation and so on) and applies it live to the layers below it. It never changes their pixels, and you can edit, hide or delete it later." },
    { term: "Anti-aliasing", def: "Blending the pixels along an edge with in-between colors so a curve looks smooth instead of like a staircase." },
    { term: "Background layer", def: "The bottom layer of an opened photo. It is locked at first. Double-click it to turn it into an ordinary layer." },
    { term: "Bit depth", def: "How many levels each color channel can have. 8-bit has 256 levels per channel and is standard for screens. 16-bit has far more, which helps heavy edits." },
    { term: "Blend mode", def: "The rule for how a layer's colors mix with the layers below, such as Multiply (darken), Screen (lighten), Overlay and Soft Light (contrast)." },
    { term: "Bridge (MCP)", def: "The <b>photocraft</b> MCP server. It connects Claude Code to the running PhotoCraft window, so Claude's edits appear live." },
    { term: "Canvas size", def: "The size of the working area around the picture. Changing it adds or removes space without stretching or resampling the pixels." },
    { term: "Channel", def: "One color component of an image, stored as its own grayscale picture. An RGB image has Red, Green and Blue channels." },
    { term: "Clipping (tones)", def: "Pixels pushed to pure black (0) or pure white (255), where all detail is lost. On a histogram it shows as a spike against an edge." },
    { term: "Clipping mask", def: "A setup where a layer affects only the layer directly below it. Use <b>Layer &gt; Create Clipping Mask</b> or the <b>Clip to layer below</b> checkbox on an adjustment layer." },
    { term: "Clone Stamp", def: "A tool that copies pixels exactly from a source point (set with Alt+click) to wherever you paint." },
    { term: "Command", def: "A named action in PhotoCraft, such as <code>layer.newAdjustmentLayer.curves</code>. Menus, shortcuts and Claude all run the same commands." },
    { term: "Control channel", def: "The local connection (127.0.0.1, port 7878) that lets Claude's bridge drive the running PhotoCraft window. It needs a token file as a password." },
    { term: "Crop", def: "Cutting away the outer part of a picture to change its composition or shape." },
    { term: "Destructive editing", def: "An edit that changes the original pixels permanently (like Image &gt; Adjustments or the Eraser). The opposite of non-destructive editing." },
    { term: "Feather", def: "Softening the edge of a selection so that an edit fades in gradually." },
    { term: "Fill (layer)", def: "A layer setting that fades the layer's own pixels but leaves layer styles (such as a drop shadow) at full strength. Opacity fades both." },
    { term: "Filter", def: "An algorithm applied to the pixels of a layer, such as a blur or a sharpen. A normal filter changes the layer permanently." },
    { term: "Gamma (midtone slider)", def: "The middle slider in Levels. It lightens or darkens the midtones without moving pure black or pure white." },
    { term: "Headless (MCP)", def: "The <b>photocraft-headless</b> MCP server. It works on image files directly with no window, which suits batch jobs." },
    { term: "Histogram", def: "A graph of how many pixels sit at each brightness, from black on the left to white on the right." },
    { term: "Hue / Saturation / Lightness", def: "Hue is which color it is, saturation is how intense, and lightness is how bright." },
    { term: "JPEG (JPG)", def: "A lossy format for photographs. Small files, no transparency, and quality drops each time you re-save." },
    { term: "Layer", def: "One sheet in a stack of transparent sheets. Edits on a layer leave the others untouched." },
    { term: "Layer mask", def: "A grayscale picture attached to a layer. White shows the layer, black hides it, gray partly hides it." },
    { term: "Layer style", def: "A live effect on a layer, such as Drop Shadow, Stroke or Outer Glow. It does not change the layer's pixels." },
    { term: "Lossy and lossless", def: "A lossy format (JPEG) throws away some detail to make smaller files. A lossless format (PNG, .pcraft, TIFF) keeps every pixel exactly." },
    { term: "Marching ants", def: "The moving dashed line that marks the edge of a selection." },
    { term: "MCP", def: "Model Context Protocol, a standard that lets an app give an AI agent a set of tools. PhotoCraft's MCP tools let Claude inspect, edit and screenshot." },
    { term: "Megapixel", def: "A million pixels. A 4000 x 3000 picture is 12 megapixels." },
    { term: "Non-destructive editing", def: "Working so the original pixels are never changed: with adjustment layers, masks, duplicate layers, smart objects and layer styles." },
    { term: "Opacity", def: "How see-through a layer or brush is: 100% fully covers what is below, 0% is invisible." },
    { term: ".pcraft", def: "PhotoCraft's own lossless working-file format. It keeps layers, masks, adjustments and text, and supports incremental saves." },
    { term: "Pixel", def: "One colored square in a picture, the smallest unit of a raster image. Each pixel holds a single color." },
    { term: "PSD", def: "Photoshop's layered file format. PhotoCraft reads and writes it, but check complicated files in the other program." },
    { term: "Quick Mask", def: "A mode (key Q) that shows your selection as a colored overlay and lets you refine it by painting." },
    { term: "Resample", def: "Changing the number of pixels in a picture, by averaging (shrinking) or inventing (enlarging) pixels. It cannot add true detail." },
    { term: "Resolution (ppi)", def: "Pixels per inch. It only matters for printing, as it tells a printer how many pixels to place in each inch. It does not change the pixel dimensions on its own." },
    { term: "RGB", def: "The color model of screens: every color is a mix of red, green and blue light, each from 0 to 255 in 8-bit images." },
    { term: "Rule of thirds", def: "A composition guide that divides a picture into nine equal boxes. Important things look good on the lines or where they cross." },
    { term: "Selection", def: "A temporary map of which pixels an edit will affect, shown with marching ants." },
    { term: "Shape layer", def: "A layer made of vector shapes. It stays sharp at any size and its fill and stroke stay editable." },
    { term: "Smart filter / smart object", def: "A smart object keeps the original pixels safe inside a layer. A smart filter is a filter applied to it that can be edited or hidden later." },
    { term: "Stamp Visible", def: "Adds a new layer at the top containing a flat copy of everything you can see, while leaving all your layers intact (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>E</kbd>)." },
    { term: "Type layer", def: "A layer holding live, editable text rather than pixels." },
    { term: "Vignette", def: "A darkening toward the edges and corners of a picture that draws the eye to the center." },
    { term: "Work folder", def: "<code>%USERPROFILE%\\ArtCraft\\PhotoCraft</code>. The only place where Claude's PhotoCraft tools can open and save files. It holds <code>practice\\</code> and <code>exports\\</code>." }
  ],
  claudeCheatsheet: [
    {
      task: "Check what is open",
      prompt: "List the documents open in PhotoCraft. For the active one, tell me its name, pixel size, number of layers and whether it has unsaved changes. Don't change anything.",
      tools: ["session_list", "doc_inspect"]
    },
    {
      task: "Describe my layers",
      prompt: "Show me my layer tree from top to bottom with each layer's kind, blend mode, opacity and whether it is visible. Don't change anything.",
      tools: ["doc_inspect"]
    },
    {
      task: "Screenshot and describe",
      prompt: "Take a screenshot of the PhotoCraft window and describe which tool is active, which panels are open and what the picture looks like.",
      tools: ["ui_inspect", "ui_screenshot"]
    },
    {
      task: "Open a practice file",
      prompt: "Open practice/great-wave.jpg in PhotoCraft and leave any other open documents as they are.",
      tools: ["doc_open"]
    },
    {
      task: "Find a command",
      prompt: "Search PhotoCraft's commands for ones related to sharpening and list the first ten with a one-line description each. Don't run any.",
      tools: ["command_list"]
    },
    {
      task: "Read a pixel's value",
      prompt: "What are the red, green and blue values of the pixel at x=100, y=100 in the active document?",
      tools: ["command_run (document.pixel)"]
    },
    {
      task: "Plan first, then act",
      prompt: "I want a warmer, slightly brighter look for the open picture without losing detail in the shadows. Before you touch anything, tell me the adjustment layers you would add, in order, and why. Wait for me to say go.",
      tools: ["doc_inspect", "command_list"]
    },
    {
      task: "Coach me instead of editing",
      prompt: "Act as a photo-editing coach. Look at my open document and layer list, don't change anything, and tell me the three most important things to improve, in order, with the PhotoCraft menu or panel for each.",
      tools: ["doc_inspect", "ui_screenshot"]
    },
    {
      task: "Add a Levels or Curves layer by numbers",
      prompt: "Add a Curves adjustment layer named \"S-curve\" with the points (0,0), (64,48), (192,212) and (255,255). Then take a screenshot and tell me whether the contrast looks natural.",
      tools: ["command_run (layer.newAdjustmentLayer.curves)", "ui_screenshot"]
    },
    {
      task: "Adjust color",
      prompt: "Add a Vibrance adjustment layer named \"Color\" at +40 and a Hue/Saturation layer named \"Calm\" with saturation -15. Tell me the settings you used.",
      tools: ["command_run (layer.newAdjustmentLayer.vibrance)", "command_run (layer.newAdjustmentLayer.hueSaturation)"]
    },
    {
      task: "Fade a layer or change its blend mode",
      prompt: "Set the layer named \"Blend test\" to Overlay at 40% opacity.",
      tools: ["command_run (layer.setProps)"]
    },
    {
      task: "Name, group and tidy layers",
      prompt: "Group all layers except the Background into a group named \"Edits\", then add a Stamp Visible layer on top called \"Flat preview\". Don't merge or delete anything.",
      tools: ["command_run (layer.groupLayers)", "command_run (layer.stampVisible)", "doc_inspect"]
    },
    {
      task: "Local adjustment through a selection",
      prompt: "Select the sky, add a Curves layer named \"Sky darken\" that pulls the midtones down a little, deselect, and screenshot it. Tell me if there is a halo along the mountains.",
      tools: ["command_run (select.sky)", "command_run (layer.newAdjustmentLayer.curves)", "ui_screenshot"]
    },
    {
      task: "Make a soft oval mask",
      prompt: "On the layer named \"Gray copy\", add a layer mask that reveals only an oval around the center with a 60 pixel feather.",
      tools: ["command_run (select.rect)", "command_run (layer.layerMask.revealSelection)"]
    },
    {
      task: "Glow effect",
      prompt: "Duplicate the Background layer, name the copy \"Glow\", apply a Gaussian blur of radius 20 to it, and set it to Soft Light at 50% opacity.",
      tools: ["command_run (layer.duplicate)", "command_run (filter.blur.gaussianBlur)", "command_run (layer.setProps)"]
    },
    {
      task: "Crop to a ratio",
      prompt: "Tell me the pixel size of the open picture, then crop it to the largest centered 4:5 rectangle without deleting the cropped pixels.",
      tools: ["doc_inspect", "command_run (image.crop)"]
    },
    {
      task: "Add a border",
      prompt: "Add a white border of 60 pixels on every side by enlarging the canvas with the picture centered.",
      tools: ["command_run (image.canvasSize)"]
    },
    {
      task: "Add a caption",
      prompt: "Add a white title \"My Title\" at 200 pixels near the lower left, a dark semi-transparent rectangle named \"Caption Card\" behind it with a soft drop shadow, and group them as \"Caption\".",
      tools: ["command_run (type.create)", "command_run (shape.create)", "command_run (layer.layerStyle.dropShadow)", "command_run (layer.groupLayers)"]
    },
    {
      task: "Undo",
      prompt: "Undo your last change, then show me the history list.",
      tools: ["command_run (edit.undo)", "doc_inspect"]
    },
    {
      task: "Save a layered copy",
      prompt: "Save the open document as my-work.pcraft in the work folder and tell me which file is now active.",
      tools: ["doc_save"]
    },
    {
      task: "Export a JPG from the live app",
      prompt: "Export the open document as exports/result.jpg. Tell me that the live app uses its current settings, then remind me how to set the quality myself with Export As.",
      tools: ["doc_save", "doc_export"]
    },
    {
      task: "Batch resize a folder (headless)",
      prompt: "Use the photocraft-headless server. List every .jpg in practice/, tell me your plan, and wait. Then for each file resize the long side to 1200 pixels and save a JPG at quality 85 into exports/ with -1200 added to the name. Never write to practice/.",
      tools: ["doc_open", "doc_inspect", "command_run (image.imageSize)", "doc_save", "doc_close"]
    },
    {
      task: "Review my project against a checklist",
      prompt: "Review my open document against this checklist and don't change anything: adjustment layers instead of baked-in edits, clear layer names, text grouped, Background unchanged. Say pass or fail for each.",
      tools: ["doc_inspect", "ui_screenshot"]
    }
  ],
  limitations: [
    "<b>Early alpha.</b> PhotoCraft's own roadmap rates its Photoshop parity well below 50%. Every menu item is wired to a command, but not every command is complete. Large or complex documents can be slow, and about 58 of 135 preferences currently do nothing.",
    "<b>No AI or generative features.</b> There is no Generative Fill, Neural Filters, Remove tool, or AI upscaling. Select Subject, Select Object and Select Sky use classic image analysis, not machine learning, so results vary. The same applies to Claude: it can only run PhotoCraft's own commands.",
    "<b>No built-in sample document.</b> PhotoCraft starts on an empty start screen. This course supplies its own practice images.",
    "<b>History snapshots do not work.</b> The three buttons at the bottom of the History panel (new snapshot, delete state, new document from state) are drawn but do nothing. The list itself and Undo work normally.",
    "<b>Mask Properties are bare.</b> There are no Density or Feather sliders for layer masks. Feather the selection before you make the mask, or blur the mask.",
    "<b>Select and Mask is a simple dialog</b> (Radius, Smart Radius, Smooth, Feather, Contrast, Shift Edge, Decontaminate, Output). It has no Refine Edge brush and no view modes, so hair and fur are hard to select cleanly.",
    "<b>Crop tool.</b> There is no Straighten button in the Crop options bar (use the Ruler tool and Straighten Layer), no Width x Height x Resolution fields (ratios only), and no perspective crop.",
    "<b>Missing tools:</b> Art History Brush, Freeform and Curvature Pen, the Add and Delete Anchor Point tools, single row and single column marquee, Color Sampler, Frame and Artboard tools, and type masks.",
    "<b>Retouch tools</b> (Clone Stamp, healing tools) ignore a targeted layer mask or alpha channel. Sample All Layers does not apply to the Blur, Sharpen and Smudge tools. Only the Brush and Eraser show a live brush preview.",
    "<b>Free Transform</b> has no right-click menu, and there are known bugs when a mask or selection is linked to the layer. Content-Aware Scale sits behind a parameter dialog.",
    "<b>Type.</b> No text on a path, no manual pair kerning, the Warp Text dialog has no live preview, no OpenType panel buttons, and right-to-left and complex scripts have gaps. Which fonts are installed depends on your build.",
    "<b>Pen tool.</b> No Shift constraint to 45 degrees and no Backspace while drawing a path.",
    "<b>Clipboard between documents.</b> Copying layers from one document to another is not supported yet. Many Photoshop tutorials do this, so use Open and layer moves inside one document instead.",
    "<b>Export.</b> Export As offers PNG, JPG, WebP, TIFF and TGA only. There is no classic JPEG options dialog (quality 0 to 12), no PDF or multi-page export, and no Libraries, Adobe Fonts or cloud documents. JPEG exports flatten transparency over white. AVIF export is optional and AVIF import is not implemented; HEIC is read-only; animated GIF and multi-page TIFF import only their first frame.",
    "<b>PSD fidelity.</b> PhotoCraft opens and saves PSD with layers, masks, adjustments, styles, type and shapes, but not every effect and smart-filter detail survives. Check important files in the other program. ExtendScript, UXP and .atn action files are not supported, and plug-ins must be WebAssembly.",
    "<b>Windows and window quirks.</b> The window size is not remembered, file dialogs may not open in the last folder, and panel groups cannot be dragged out as floating windows. Windows SmartScreen may warn about unsigned builds.",
    "<b>Claude's reach is limited on purpose.</b> Through the live connection Claude cannot use Windows file dialogs, cannot run most File menu commands that read or write paths, and cannot change color mode or bit depth. Live saves use the app's current settings (no JPEG quality or format options), and files can only be opened and saved inside <code>%USERPROFILE%\\ArtCraft\\PhotoCraft</code>. Claude sees screenshots of at most 2048 pixels.",
    "<b>The connection has no per-tool permissions.</b> Anyone who can read the token file on your PC can drive PhotoCraft through the control channel (it only listens on 127.0.0.1). Claude Code's own permission prompts are your gate.",
    "<b>Long replies can fail while the edit succeeded.</b> If a tool reports that an operation may have completed, ask Claude to inspect the document before it retries."
  ]
});
