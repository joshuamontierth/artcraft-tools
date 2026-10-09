window.ARTCRAFT_COURSES = window.ARTCRAFT_COURSES || [];
window.ARTCRAFT_COURSES.push({
  id: "lightcraft",
  app: "LightCraft",
  adobe: "Adobe Lightroom Classic",
  tagline: "Import, cull, develop and export raw and JPEG photos without ever touching your originals, by hand and by asking Claude.",
  accent: "#f2a516",
  level: "Beginner",
  estimatedHours: 8,
  intro: "<p><b>LightCraft</b> is a free, open-source photo manager and raw developer. A <em>photo manager</em> keeps thousands of pictures findable (ratings, albums, keywords, search). A <em>raw developer</em> turns the unprocessed data a camera sensor records into a finished photograph. If you have heard of Adobe Lightroom Classic, LightCraft covers the same ground with the same ideas, in one window.</p><p>This course assumes you have never edited a photo before. You will learn the <em>craft</em> (what exposure is, how to read a histogram, why white balance exists, what non-destructive editing means) together with the buttons that do the work. Every module has a hands-on part you do yourself in LightCraft, and, from module 2 on, a part where you ask <b>Claude</b> to do the same job through LightCraft's built-in automation, so you can compare and learn to delegate the boring parts.</p><p>The path: orientation, working with Claude, sorting your photos, tone, colour, crop and detail, local (masked) edits, a repeatable workflow, and a capstone where you take one photo from import to finished export.</p>",
  prerequisites: [
    "A Windows 11 PC where LightCraft has been built (<code>{ROOT}\\lightcraft\\target\\release\\lightcraft.exe</code>) and the Start-menu shortcut <b>LightCraft (ArtCraft)</b> exists.",
    "Claude Code installed, with the two LightCraft MCP servers registered (the setup scripts do this; you will check it in module 2).",
    "The practice files copied into <code>%USERPROFILE%\\ArtCraft\\LightCraft\\practice\\</code> by the asset-download script. Lessons say which file they need; the 24 built-in demo photos cover a lot even without them.",
    "No photo-editing experience needed. A mouse is plenty. You do not need a calibrated monitor.",
    "Optional: a few copies of your own photos (never your only copy) to try the techniques on."
  ],
  setup: {
    launchHtml: "<p>Open the Start menu, type <b>LightCraft (ArtCraft)</b> and press <kbd>Enter</kbd>. That shortcut runs <code>{ROOT}\\lightcraft\\target\\release\\lightcraft.exe --control 7980</code> with the default library, <code>%USERPROFILE%\\Pictures\\LightCraft Library</code>. A brand-new library starts with <b>24 demo photos</b> so you always have something to practise on.</p><p>Prefer a terminal? This does the same thing:</p><pre><code>{ROOT}\\ops\\scripts\\windows\\launch-app.ps1 -App lightcraft</code></pre><p><b>What <code>--control 7980</code> means:</b> it opens a small automation channel that only your own PC can reach (address <code>127.0.0.1:7980</code>, no password, loopback only). Claude uses it to drive the window you are looking at. It is why Claude's edits show up live in the app. LightCraft has no console window on Windows; that is normal.</p><p><b>Other useful start-up options</b> (only if you launch the exe yourself): <code>--memory</code> for a throwaway session that writes nothing to disk, <code>--library DIR</code> to use a different library folder, and file or folder paths at the end to import them straight away. Only run one copy of LightCraft at a time: a library can be open in only one program.</p>",
    mcpHtml: "<p>Claude Code has two LightCraft connections, both registered for you by <code>{ROOT}\\ops\\scripts\\windows\\register-mcp.ps1</code>:</p><ul><li><b><code>lightcraft</code> (live).</b> Runs <code>lightcraft-cli mcp --connect 127.0.0.1:7980</code>. It talks to the <em>running app</em>, so whatever Claude does appears in the window and lands on the same undo stack as your own edits. Start LightCraft first (via the shortcut above). The connection is made on Claude's first request and re-made if you restart the app.</li><li><b><code>lightcraft-headless</code>.</b> Runs <code>lightcraft-cli mcp</code> on the folder <code>%USERPROFILE%\\ArtCraft\\LightCraft</code>. No window needed: Claude works on files directly. Good for batch jobs and renders while the app is closed.</li></ul><p><b>Start Claude in the work folder</b> so it can see your practice and export files:</p><pre><code>cd $env:USERPROFILE\\ArtCraft\\LightCraft\nclaude</code></pre><p><b>Check the connection:</b> inside Claude Code type <code>/mcp</code>. You should see <code>lightcraft</code> and <code>lightcraft-headless</code> listed as connected. Claude's tools for them are named <code>mcp__lightcraft__&lt;tool&gt;</code> and <code>mcp__lightcraft-headless__&lt;tool&gt;</code>. The full walkthrough is lesson 2.1.</p><p>Reference only (the script already did this): <code>claude mcp add --scope user lightcraft -- {ROOT}\\lightcraft\\target\\release\\lightcraft-cli.exe mcp --connect 127.0.0.1:7980</code>.</p>"
  },
  assets: [
    {
      id: "raw-sony",
      title: "Sony A7 IV raw file (ARW)",
      kind: "raw",
      file: "assets/lightcraft/sony-a7iv.arw",
      needs: "A real camera raw file from a Sony ILCE-7M4 (A7 IV) in ARW format, 14-bit, 3:2. LightCraft bundles a colour profile for this model, so its colours should be close to what the camera would produce. Used as the main raw practice file (exposure, highlights/shadows, white balance in Kelvin, curves, local edits, capstone). Any scene works; one with bright sky and darker foreground is ideal. Expect a large file (tens of MB).",
      repoPath: null,
      suggestedSource: "https://raw.pixls.us/getfile.php/6936/nice/Sony%20-%20ILCE-7M4%20-%2014bit%20%283:2%29.ARW",
      license: "CC0 (raw.pixls.us)"
    },
    {
      id: "raw-ricoh",
      title: "Ricoh GR III raw file (DNG)",
      kind: "raw",
      file: "assets/lightcraft/ricoh-gr3.dng",
      needs: "A raw DNG from a Ricoh GR III (14-bit, 3:2). DNG is the best-supported raw format in LightCraft (it carries its own colour and lens-correction data). Used to compare a second raw file with the Sony one and to practise lens corrections, sharpening and noise reduction.",
      repoPath: null,
      suggestedSource: "https://raw.pixls.us/getfile.php/3115/nice/Ricoh%20-%20GR%20III%20-%2014bit%20%283:2%29.DNG",
      license: "CC0 (raw.pixls.us)"
    },
    {
      id: "raw-nikon",
      title: "Nikon D7500 raw file (NEF)",
      kind: "raw",
      file: "assets/lightcraft/nikon-d7500.nef",
      needs: "A raw NEF from a Nikon D7500, 14-bit lossless compressed, 3:2 (LightCraft supports uncompressed and lossless/lossy compressed NEF). Used for the white-balance lesson (a second camera, a different 'As Shot' value) and for the capstone as an alternative to the Sony file.",
      repoPath: null,
      suggestedSource: "https://raw.pixls.us/getfile.php/1534/nice/Nikon%20-%20D7500%20-%2014bit%2014bit%20compressed%20%28Lossless%29%20%283:2%29.NEF",
      license: "CC0 (raw.pixls.us)"
    },
    {
      id: "tetons",
      title: "Ansel Adams: The Tetons and the Snake River (1942)",
      kind: "image",
      file: "assets/lightcraft/tetons.jpg",
      needs: "Public-domain black-and-white landscape JPEG (U.S. National Archives), as large as available. Used for reading histograms, tone sliders, the tone curve and black-and-white work. Also appears in LightCraft's own screenshots.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:Adams_The_Tetons_and_the_Snake_River.jpg",
      license: "Public domain (U.S. National Archives)"
    },
    {
      id: "migrant-mother",
      title: "Dorothea Lange: Migrant Mother (1936)",
      kind: "image",
      file: "assets/lightcraft/migrant-mother.jpg",
      needs: "Public-domain black-and-white portrait JPEG (Library of Congress), as large as available. Used for portrait-style tonal work, cropping and the black-and-white and Color Grading lessons.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:Lange-MigrantMother02.jpg",
      license: "Public domain (Library of Congress)"
    },
    {
      id: "earthrise",
      title: "NASA Apollo 8: Earthrise (1968)",
      kind: "image",
      file: "assets/lightcraft/earthrise.jpg",
      needs: "Public-domain colour JPEG, about 2400x2400 (NASA). A very dark image with a small bright subject: the classic example of a histogram piled against the left edge that is not a mistake.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:NASA-Apollo8-Dec24-Earthrise.jpg",
      license: "Public domain (NASA)"
    },
    {
      id: "blue-marble",
      title: "NASA Apollo 17: The Blue Marble (1972)",
      kind: "image",
      file: "assets/lightcraft/blue-marble.jpg",
      needs: "Public-domain colour JPEG (NASA) with strong blues, whites and browns. Used for the Color Mixer, vibrance versus saturation and Color Grading lessons.",
      repoPath: null,
      suggestedSource: "https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17.jpg",
      license: "Public domain (NASA)"
    },
    {
      id: "tilted-horizon",
      title: "Seascape or landscape with a tilted horizon",
      kind: "image",
      file: "assets/lightcraft/tilted-horizon.jpg",
      needs: "An ordinary colour JPEG (at least 3000 px on the long edge) with a clearly visible straight horizon, such as the sea, that is tilted by roughly 2 to 4 degrees, and ideally a slightly cool or warm colour cast and some distracting small object (a bird, a buoy, a speck) to remove. The human should source a public-domain or CC0 photo (for example from Wikimedia Commons or Unsplash CC0-style sources) or use their own snapshot. Used for straightening, cropping, white balance on a JPEG and the Remove tool.",
      repoPath: null,
      suggestedSource: null,
      license: null
    }
  ],
  modules: [
    {
      id: "m1",
      title: "Getting oriented",
      summary: "Meet LightCraft, learn the window layout, understand raw files and the library, import your practice photos, and export your first picture.",
      lessons: [
        {
          id: "m1-l1",
          title: "What LightCraft is and how this course works",
          minutes: 10,
          goals: [
            "By the end you can explain in one sentence what LightCraft does.",
            "You can name the five steps of a photo workflow, from import to export.",
            "You know how the course, the app and Claude fit together."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "LightCraft is built around one idea: your camera's photos are <b>negatives</b> and editing is <b>developing</b> them. You never overwrite the original. Instead LightCraft remembers a list of instructions (\"a bit brighter, a bit warmer, crop the left edge\") and applies them whenever it shows or exports the photo. That makes it safe to experiment, because every experiment can be undone and the original file is always there." },
            { t: "callout", kind: "adobe", html: "LightCraft is the open-source equivalent of <b>Adobe Lightroom Classic</b>. Lightroom Classic has separate <i>Library</i> and <i>Develop</i> modules (plus Map, Book, Slideshow, Print, Web). LightCraft has <b>one window</b>: a grid or single-photo view in the middle and an editing panel strip on the right, so there is no module switching. It has no Print, Book, Map or Web modules; see the Limitations list at the end of the course." },
            { t: "h", text: "The photo workflow" },
            { t: "p", html: "Almost every photo job follows the same five steps. The course follows them too:" },
            { t: "steps", items: [
              { html: "<b>Import</b>: tell LightCraft which photo files exist (module 1)." },
              { html: "<b>Cull</b>: decide which photos are worth keeping, using ratings, flags and colour labels (module 3)." },
              { html: "<b>Organise</b>: albums, keywords and search so you can find things later (module 3)." },
              { html: "<b>Develop</b>: adjust light, colour, crop, detail and local areas (modules 4 to 7)." },
              { html: "<b>Export</b>: write a finished JPEG, PNG or TIFF to share or print (modules 1, 8 and 9)." }
            ] },
            { t: "h", text: "Three windows working together" },
            { t: "p", html: "While you learn, you will have three things open side by side:" },
            { t: "p", html: "<ul><li><b>This course</b> in your browser. Tick each step as you do it; your progress is saved.</li><li><b>LightCraft</b>, where you do the work with your own hands.</li><li><b>Claude Code</b> in a terminal, an AI assistant that can look at LightCraft and make the same edits through its automation interface (called <b>MCP</b>, the Model Context Protocol). Module 2 teaches you how. From then on most lessons end with a \"Try it with Claude\" box.</li></ul>" },
            { t: "steps", items: [
              { html: "Put this browser window on the left half of the screen: click it, then press <kbd>Win</kbd>+<kbd>Left</kbd>.", check: "The course fills the left half of the screen and Windows offers windows to fill the right half." },
              { html: "Leave the right half free for LightCraft. In the next lesson you will open it there." }
            ] },
            { t: "callout", kind: "note", html: "LightCraft is young and moving fast. The course was written from the app's source code and documentation, but if a label is slightly different on your build, look in the menu bar (File, Edit, View, Photo, Window, Help) or hover over an icon to read its tooltip. When unsure, you can also ask Claude to look at the screen (module 2)." },
            { t: "quiz", items: [
              { q: "What does \"non-destructive editing\" mean in LightCraft?", choices: ["The original photo file is never changed; edits are stored as instructions.", "The app makes a full copy of every photo before you start.", "You cannot undo anything once exported.", "Only JPEG files can be edited."], answer: 0, explain: "LightCraft stores your edits as a list of instructions in its library and applies them on display and on export. The original file stays exactly as the camera wrote it." },
              { q: "Which of these is NOT one of the five workflow steps in this course?", choices: ["Cull", "Develop", "Print layout", "Export"], answer: 2, explain: "LightCraft has no Print module. The workflow is import, cull, organise, develop, export." }
            ] },
            { t: "check", html: "You can say what LightCraft is for, you know the five-step workflow, and the course is open on one half of your screen." }
          ]
        },
        {
          id: "m1-l2",
          title: "Launch LightCraft and take the layout tour",
          minutes: 15,
          goals: [
            "By the end you can launch LightCraft from the Start menu.",
            "You can name the main parts of the window: top bar, My Photos panel, grid, bottom bar and the right-hand icon strip.",
            "You can switch between the grid and a single photo, and open the Edit panel."
          ],
          assets: [],
          blocks: [
            { t: "steps", items: [
              { html: "Open the Start menu, type <b>LightCraft (ArtCraft)</b> and press <kbd>Enter</kbd>.", detail: "The shortcut runs <code>lightcraft.exe --control 7980</code> with the default library at <code>%USERPROFILE%\\Pictures\\LightCraft Library</code>. There is no console window. The first start can take a few seconds. If you prefer a terminal, <code>{ROOT}\\ops\\scripts\\windows\\launch-app.ps1 -App lightcraft</code> does the same.", check: "A dark window opens with a <b>My Photos</b> panel on the left and a grid of photos in the middle. A new library shows the 24 demo photos and the heading <b>All Photos</b> with a count of 24." },
              { html: "Drag the window to the right half of the screen (or press <kbd>Win</kbd>+<kbd>Right</kbd>) so the course stays visible next to it." }
            ] },
            { t: "callout", kind: "note", html: "The 24 demo photos are <b>generated</b> by LightCraft itself (landscapes, flowers, a night sky) and are not files on your disk. They behave like real photos for editing and exporting, which makes them perfect for learning. If your library was created earlier without them, no problem: you will import real practice files in lesson 1.3." },
            { t: "image", src: "../lightcraft/docs/images/grid-demo.jpg", alt: "LightCraft window showing the My Photos panel, a justified photo grid, the Edit panel with a histogram and Light sliders, and the icon strip on the far right", caption: "The default view. Left: My Photos. Centre: the photo grid. Right: the Edit panel and, at the far edge, the icon strip. Along the bottom: view buttons, stars and flags. (This screenshot is from macOS, where the menu bar is at the top of the screen. On Windows the menu bar File, Edit, View, Photo, Window, Help sits inside the window's top bar, left of the Search Photos field.)" },
            { t: "h", text: "The tour" },
            { t: "steps", items: [
              { html: "<b>Top bar.</b> From the left: a sidebar button that shows or hides My Photos, Back and Forward arrows, the menu bar, the <b>Search Photos</b> box, a funnel button for the filter bar, and icons on the right including <b>Export</b> (the share icon), Help and <b>Activity</b> (the bell). Hover over each one.", detail: "The Back and Forward arrows move through the views you have visited, like a web browser. They are <b>not</b> undo. Undo is <kbd>Ctrl</kbd>+<kbd>Z</kbd>." },
              { html: "<b>My Photos panel.</b> Click <b>Picks</b>, then <b>Recently Added</b>, then <b>All Photos</b> again.", detail: "This panel is how you choose <i>which</i> photos the grid shows: everything, recently imported, only flagged picks, an album, a year under By Date, or Recently Deleted.", check: "The grid changes as you click. Picks shows fewer photos (4 on the demo library); All Photos shows 24." },
              { html: "Hide and show the panel: click the sidebar button at the top left, or press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>L</kbd>.", check: "The panel disappears and the grid widens; press the same keys to bring it back." },
              { html: "<b>The grid.</b> Click one photo once to select it. Look at its corners: stars and a flag show its rating and pick state, and a small badge appears on photos that have been edited." },
              { html: "<b>Bottom bar.</b> At the left are the view buttons (Photo Grid, Square Grid, Detail, Compare, Survey, People) and a Sort button. In the centre are five stars, a colour-label circle and the pick and reject flags, then a <b>Copy Edit Settings</b> button. At the right: zoom and before/after buttons." },
              { html: "<b>Open a photo big.</b> Double-click a thumbnail (or select it and press <kbd>D</kbd>). This is the <b>Detail</b> view, one photo filling the middle with a filmstrip of the others along the bottom. Press <kbd>/</kbd> to hide or show the filmstrip. Press <kbd>G</kbd> or <kbd>Esc</kbd> to return to the grid.", check: "You can go from grid to Detail and back without losing your place." },
              { html: "<b>Right-hand icon strip.</b> Hover over each icon and read the tooltip: Presets, Edit, Crop &amp; Rotate, Remove, Masking, Red Eye, then Versions, History &amp; Activity, More, and at the very bottom Keywords and Info. They are greyed out until a photo is active." },
              { html: "<b>Edit panel.</b> Select a photo and press <kbd>E</kbd> (or click the sliders icon). If it is already open, leave it as it is. At the top is the <b>histogram</b>, then the Edit header with <b>Auto</b>, <b>B&amp;W</b> and <b>Reset</b> buttons, a <b>Profile</b> choice, and sections named <b>Light</b>, <b>Color</b>, <b>Effects</b>, <b>Detail</b>, <b>Optics</b> and <b>Calibration</b> that you can collapse by clicking their names.", check: "You can see the Light section with Exposure, Contrast, Highlights, Shadows, Whites and Blacks." }
            ] },
            { t: "image", src: "../lightcraft/docs/images/hero-tetons.jpg", alt: "LightCraft Detail view of a black and white mountain landscape with a filmstrip along the bottom and the Edit panel on the right", caption: "Detail view with the filmstrip and the Edit panel open. This is where you will spend most of your time." },
            { t: "keys", items: [
              { keys: "G", action: "Photo Grid (press again to toggle Square Grid)" },
              { keys: "D", action: "Detail view (one photo)" },
              { keys: "Esc", action: "Back to the grid" },
              { keys: "E", action: "Edit panel" },
              { keys: "/", action: "Show or hide the filmstrip" },
              { keys: "Ctrl+Shift+L", action: "Show or hide the My Photos panel" },
              { keys: "Ctrl+/", action: "Open the full keyboard-shortcut sheet" }
            ] },
            { t: "callout", kind: "adobe", html: "Lightroom tutorials say <i>Grid view</i> for LightCraft's Photo Grid (<kbd>G</kbd>), <i>Loupe</i> for Detail (<kbd>D</kbd>), <i>Develop module</i> for the Edit panel and its neighbours (<kbd>E</kbd>), and <i>Compare</i>/<i>Survey</i> keep their names. LightCraft's \"Edit\" panel holds what Lightroom splits across Basic, Tone Curve, HSL/Color, Detail and Lens Corrections." },
            { t: "quiz", items: [
              { q: "You want to see only your flagged favourites. Where do you click?", choices: ["Picks in the My Photos panel", "The Back arrow in the top bar", "Reset in the Edit panel", "The Info icon in the strip"], answer: 0, explain: "My Photos chooses which photos the grid shows. Picks lists photos flagged as picks." },
              { q: "What do the Back and Forward arrows in the top bar do?", choices: ["Undo and redo edits", "Move through views you visited", "Go to the previous and next photo", "Zoom out and in"], answer: 1, explain: "They navigate between views like a browser's back and forward. Undo is Ctrl+Z; previous and next photo are the Left and Right arrow keys." }
            ] },
            { t: "check", html: "LightCraft is open next to the course, you have gone from grid to Detail and back, and you have opened the Edit panel and found the histogram and the Light sliders." }
          ]
        },
        {
          id: "m1-l3",
          title: "Raw, JPEG and the library: what you are really editing",
          minutes: 18,
          goals: [
            "By the end you can explain the difference between a raw file and a JPEG.",
            "You can explain what the library (catalog) holds and what it does not.",
            "You can import a folder of photos with 'Add in place' and find them again."
          ],
          assets: ["raw-sony", "raw-ricoh", "raw-nikon", "tetons", "migrant-mother", "earthrise", "blue-marble", "tilted-horizon"],
          blocks: [
            { t: "h", text: "Raw versus JPEG" },
            { t: "p", html: "A camera sensor counts light. Behind a mosaic of red, green and blue filters it records a number for each tiny dot. A <b>JPEG</b> is what the camera makes <i>after</i> it has already decided how the picture should look: it picks a white balance, adds contrast and colour, sharpens, shrinks the data to 8 bits per channel and throws the rest away. A <b>raw</b> file keeps the sensor's numbers nearly untouched (usually 12 to 14 bits), plus the camera's settings written alongside as a suggestion. It is often called a <b>digital negative</b>." },
            { t: "p", html: "Because a raw file has so much more data, you can brighten a dark area, rescue a bright sky, or fix the white balance later with far less damage. The costs: the files are big, a raw looks flat and dull until it is developed, and you need software like LightCraft to read it. JPEGs can be edited too, just with less headroom, and the course uses both." },
            { t: "callout", kind: "note", html: "LightCraft reads raw files from Canon (CR2, CR3), Sony (ARW), Nikon (NEF), Fujifilm (RAF), Panasonic and Leica (RW2, RWL), Pentax (PEF), Olympus (ORF, uncompressed) and every kind of DNG. If a particular variant is not supported yet, LightCraft shows the camera's <b>embedded JPEG preview</b> and marks the photo <b>Preview only</b>. Then you are editing the small JPEG, not the raw data. Colour on some non-DNG raws may differ from the camera's own JPEG; DNG, and the Sony A7 IV, Fujifilm X-H2S and X-T4 files with bundled profiles, are the safest." },
            { t: "h", text: "Non-destructive editing and the library" },
            { t: "p", html: "When you move a slider, LightCraft does not change your photo file. It writes the slider's value into its <b>library</b>, a folder (by default <code>%USERPROFILE%\\Pictures\\LightCraft Library</code>) containing a database of your photos: where each file lives, its rating and keywords, and every edit instruction. Inside you will find <code>catalog.snap</code> and <code>catalog.log</code> (a crash-safe journal), <code>presets.json</code>, <code>thumbs\\</code> (small previews) and, only if you ask LightCraft to copy files in, <code>Originals\\</code>." },
            { t: "p", html: "Two consequences to remember. First, the library is only a list plus your edits: if you move or delete an original file in Explorer, LightCraft can no longer find it and the photo shows up under <b>Missing Photos</b>. Second, back up both your originals <i>and</i> the library (<b>File → Back Up Library…</b>), because the edits live only in the library unless you also write XMP sidecar files (<b>File → Automatically Write Changes into XMP</b>)." },
            { t: "callout", kind: "adobe", html: "Lightroom calls this the <b>catalog</b> (a <code>.lrcat</code> file). LightCraft calls the whole folder the <b>library</b> and keeps the same promise: edits are stored in the catalog, the originals stay where they are. XMP sidecars are the same idea in both apps." },
            { t: "h", text: "Import the practice files" },
            { t: "steps", items: [
              { html: "In LightCraft, open <b>File → Import from Folder…</b>.", detail: "<b>File → Import Photos…</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>I</kbd>) lets you pick individual files; <b>Import from Folder…</b> scans a whole folder, including sub-folders." },
              { html: "In the file picker, paste <code>%USERPROFILE%\\ArtCraft\\LightCraft\\practice</code> into the address bar, press <kbd>Enter</kbd>, then confirm the folder.", check: "A review dialog opens with thumbnails of every photo it found." },
              { html: "In the dialog find <b>Transfer</b> and click <b>Add in place</b>.", detail: "<b>Add in place</b> references the files where they are, nothing is copied. <b>Copy</b> copies the files into the library's <code>Originals\\</code> folder (or one you choose, organised by day) and leaves the source alone. <b>Move</b> copies and then removes the source after checking the copy. For a memory card you would choose Copy. For these practice files, Add in place is fine and wastes no disk space." },
              { html: "Click the button at the bottom of the dialog, which reads <b>Import N Photos</b>.", check: "The grid jumps to your new photos. In My Photos, <b>Recently Added</b> shows them, and <b>All Photos</b> now counts the demo photos plus the ones you imported." }
            ] },
            { t: "callout", kind: "warn", html: "If a practice file is missing on your PC (the download script may have skipped one), import what you have. Each lesson names the file it needs, and the demo photos can stand in for most exercises. A duplicate import is skipped automatically, so it is safe to import the folder twice." },
            { t: "steps", items: [
              { html: "Double-click the Sony raw photo (file name <code>sony-a7iv.arw</code>) to open it in Detail view. Then press <kbd>I</kbd> to open the <b>Info</b> panel.", check: "Info shows the camera, file size and the full path on disk. The format is shown as ARW. If you see a <b>Preview only</b> notice instead, LightCraft could not decode that raw variant." },
              { html: "Open <code>tetons.jpg</code> in Detail view and compare its Info panel with the raw file's.", detail: "Notice the file size and format. A raw file is normally several times larger than a JPEG of the same scene." }
            ] },
            { t: "quiz", items: [
              { q: "Why is a raw file easier to rescue than a JPEG when a photo is too dark?", choices: ["It is stored at a smaller size", "It keeps far more of the sensor data, so brightening does less damage", "It has already been sharpened by the camera", "It contains a built-in copy of LightCraft"], answer: 1, explain: "The camera discards a lot when it makes a JPEG. A raw keeps nearly everything the sensor recorded, so exposure and white balance changes hold up much better." },
              { q: "You import a folder with 'Add in place' and then rename that folder in Explorer. What happens?", choices: ["Nothing, LightCraft follows it automatically", "The photos show as missing because the library only remembers their old location", "LightCraft deletes the edits", "The photos become JPEGs"], answer: 1, explain: "The library stores where each file was. Move originals by re-importing, or use Copy at import time so the library holds its own copies." },
              { q: "Where are your edit instructions stored by default?", choices: ["Inside the original photo file", "In the library's catalog", "In the Windows registry", "On a cloud server"], answer: 1, explain: "Edits live in the library's catalog (and optionally in XMP sidecar files). The original is never modified." }
            ] },
            { t: "check", html: "Your practice photos appear in <b>Recently Added</b>, you can open a raw photo and see its camera details in <b>Info</b>, and you can say in your own words why edits do not damage the original." }
          ]
        },
        {
          id: "m1-l4",
          title: "Undo, History, and exporting your first JPEG",
          minutes: 15,
          goals: [
            "By the end you can undo, redo, and reset edits, and you know nothing is lost by experimenting.",
            "You can read the History panel.",
            "You can export a finished photo as a JPEG into your exports folder."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "The most important button in any editing app is undo. In LightCraft everything is a <b>command</b> and every command that changes something can be undone, whether you did it with the mouse, a shortcut, or Claude did it for you through MCP. They all share one undo stack." },
            { t: "h", text: "Try an edit, then take it back" },
            { t: "steps", items: [
              { html: "Double-click a demo photo (for example the sunset called <b>Golden horizon</b> or the dunes called <b>Dune ridges</b>) to open it in Detail view, then press <kbd>E</kbd> if the Edit panel is closed." },
              { html: "In the <b>Light</b> section drag the <b>Exposure</b> slider to about <b>+1.00</b>.", check: "The photo gets brighter, the number beside the slider changes, and the histogram at the top of the panel shifts to the right." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd>.", detail: "A whole slider drag counts as <b>one</b> undo step, not hundreds. You can also use <b>Edit → Undo</b> and <b>Edit → Redo</b> in the menu bar.", check: "Exposure jumps back to 0.00." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> to redo it." },
              { html: "Now make three different changes: Contrast about +30, Highlights about -40, Vibrance about +25 (Vibrance lives in the Color section).", check: "The photo's thumbnail in the grid gets a small edited badge." }
            ] },
            { t: "h", text: "History and Reset" },
            { t: "steps", items: [
              { html: "Open <b>Window → History</b> (or click the clock icon in the right-hand strip, tooltip <b>History &amp; Activity</b>).", detail: "The History panel lists what you have done to the photo, newest at the end. Clicking an earlier entry takes the photo back to how it looked at that moment, and you can still step forward again with redo until you make a new edit.", check: "You see a list of your recent adjustments." },
              { html: "Click an earlier entry, look at the photo, then click the last entry to return." },
              { html: "At the top of the Edit panel click <b>Reset</b>.", detail: "Reset puts every slider for this photo back to its default (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>). It is a normal, undoable edit, so you can bring everything back with <kbd>Ctrl</kbd>+<kbd>Z</kbd>.", check: "All sliders return to 0 and the edited badge disappears." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to bring the edits back, then <b>double-click a single slider</b> (for example Contrast) to reset just that one." }
            ] },
            { t: "keys", items: [
              { keys: "Ctrl+Z", action: "Undo" },
              { keys: "Ctrl+Shift+Z", action: "Redo" },
              { keys: "Ctrl+Shift+R", action: "Reset all edits on the photo" },
              { keys: "Double-click a slider", action: "Reset that slider" }
            ] },
            { t: "h", text: "Export your first JPEG" },
            { t: "p", html: "Editing inside LightCraft never produces a new picture file. To get something you can email, print or post, you <b>export</b>: LightCraft applies your instructions to the original and writes a brand-new file. The original is untouched." },
            { t: "steps", items: [
              { html: "With your edited photo open, click the <b>Export</b> icon (the share icon at the right of the top bar) or choose <b>File → Export…</b> (<kbd>Shift</kbd>+<kbd>E</kbd> also opens it).", check: "An Export dialog opens." },
              { html: "At the top of the dialog open the <b>Preset</b> list and choose <b>JPEG (Small)</b>.", detail: "The built-in presets are <b>JPEG (Small)</b> (quality 85, longest side 2048 px, sRGB, handy for email and web), <b>JPEG (Large)</b> (quality 92, full size, sRGB), <b>Original + Settings</b> and <b>DNG</b>. You will look at every option in module 8." },
              { html: "Find the <b>Folder</b> setting, click <b>Choose…</b> and select <code>%USERPROFILE%\\ArtCraft\\LightCraft\\exports</code>." },
              { html: "Click the confirm button at the bottom of the dialog (it reads <b>OK</b>).", detail: "Export runs in the background, so you can keep working while a progress notice shows. If you forgot to choose a folder, the dialog stays open and tells you instead of losing your choices." },
              { html: "Open that folder in File Explorer and double-click the new <code>.jpg</code>.", check: "It opens in your normal image viewer, looking like your edited version. Going back to LightCraft, the photo is still fully editable." }
            ] },
            { t: "callout", kind: "warn", html: "The 24 demo photos are generated in memory, so they have no original file. You can export them as JPEG, PNG or TIFF, but the <b>Original files</b> and <b>DNG</b> export options only make sense for photos that really came from a file." },
            { t: "exercise", title: "Edit, undo, export", html: "Pick any three demo photos. For each one make at least two edits, undo one of them with <kbd>Ctrl</kbd>+<kbd>Z</kbd>, then export all three at once.", steps: [
              "Click the first photo in the grid, then hold <kbd>Ctrl</kbd> and click two more to select three.",
              "Open <b>File → Export…</b>, choose <b>JPEG (Small)</b>, pick the exports folder and confirm.",
              "Open the folder and check that you have three new JPEG files."
            ] },
            { t: "quiz", items: [
              { q: "You dragged Exposure from 0 to +2 in one smooth motion. How many Ctrl+Z presses undo it?", choices: ["One", "As many as there were tiny movements", "Two", "You cannot undo slider drags"], answer: 0, explain: "A slider drag is one undo step, so one Ctrl+Z restores the value from before you started dragging." },
              { q: "After exporting a JPEG, which statement is true?", choices: ["The original is now overwritten with your edits", "A new file exists and the original photo is unchanged", "You can no longer edit the photo in LightCraft", "The edits are baked into the library's catalog and cannot be undone"], answer: 1, explain: "Export creates a new file. The original and your edit instructions stay exactly as they were." }
            ] },
            { t: "check", html: "You can undo, redo and reset, you have seen the History panel, and there is at least one exported JPEG in <code>%USERPROFILE%\\ArtCraft\\LightCraft\\exports</code>." }
          ]
        }
      ]
    },
    {
      id: "m2",
      title: "Working with Claude",
      summary: "Connect Claude Code to LightCraft, let it look before it touches anything, watch it edit live, undo it, and learn the prompt habits and safety rules that keep you in control.",
      lessons: [
        {
          id: "m2-l1",
          title: "Connect Claude to LightCraft",
          minutes: 12,
          goals: [
            "By the end you can start LightCraft and Claude Code in the right folder.",
            "You can check the connection with /mcp and tell the live server from the headless one.",
            "You know the three kinds of tools Claude gets."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "<b>MCP</b> (Model Context Protocol) is a standard way for an AI assistant to use another program's features as <b>tools</b>. LightCraft was built with this in mind: every action in the app, from rating a photo to moving a slider, is a named <b>command</b>, and the same commands are offered to Claude. That is why Claude can do almost anything you can do with the mouse, and why its changes are undoable like yours." },
            { t: "h", text: "Two connections" },
            { t: "p", html: "<ul><li><b><code>lightcraft</code> (live).</b> Connects to the LightCraft window that is running right now through port 7980. Claude's edits appear on screen as they happen and join your undo history. This is the one you will use in most lessons.</li><li><b><code>lightcraft-headless</code>.</b> Starts its own invisible copy of LightCraft's engine on the folder <code>%USERPROFILE%\\ArtCraft\\LightCraft</code>. There is no window. Use it for batch jobs on files, for example resizing every file in <code>practice\\</code>, while the app is closed. Treat it as a scratch session: keep anything you want by <i>exporting</i> files, because edits made there do not show up in the window.</li></ul>" },
            { t: "steps", items: [
              { html: "Start LightCraft from the Start menu shortcut <b>LightCraft (ArtCraft)</b> and leave it running." },
              { html: "Open Windows Terminal or PowerShell and start Claude in the work folder:", detail: "Starting Claude in this folder means it can see your <code>practice\\</code> and <code>exports\\</code> folders. Without the right folder Claude would not know where your files are." },
              { html: "Inside Claude Code, type <code>/mcp</code> and press <kbd>Enter</kbd>.", check: "A list of servers appears and <b>lightcraft</b> and <b>lightcraft-headless</b> are both shown as connected. Select one to see its tools." },
              { html: "Ask Claude: <i>\"List the tool names you have from the lightcraft server.\"</i>", check: "Claude lists helper tools such as <code>query_photos</code>, <code>get_develop</code>, <code>set_develop</code>, <code>render_photo</code>, <code>export</code>, <code>screenshot</code> and many tools beginning with <code>cmd_</code>." }
            ] },
            { t: "code", lang: "powershell", text: "cd $env:USERPROFILE\\ArtCraft\\LightCraft\nclaude" },
            { t: "h", text: "What tools does Claude get?" },
            { t: "p", html: "Claude Code writes tool names as <code>mcp__lightcraft__&lt;tool&gt;</code>. They fall into three groups:" },
            { t: "p", html: "<ol><li><b>Helper tools</b> for common jobs: <code>query_photos</code> (search the library), <code>select_photos</code>, <code>import</code>, <code>get_develop</code> / <code>set_develop</code> (read and change edit sliders), <code>list_controls</code> (every slider with its range), <code>apply_preset</code>, <code>crop</code>, <code>render_photo</code> (returns a picture Claude can see) and <code>export</code>.</li><li><b>Window tools</b> (live server only): <code>screenshot</code>, <code>inspect_ui</code>, <code>click</code>, <code>press_key</code>, <code>type_text</code>, <code>set_ui</code> and a few more, for looking at and operating the interface itself.</li><li><b>Command tools</b>, one per LightCraft command, named <code>cmd_</code> plus the command id with dots turned into underscores, for example <code>cmd_photo_rate</code>, <code>cmd_edit_undo</code>, <code>cmd_view_detail</code>. There are about 280. <code>run_command</code> can run any command by its id, and <code>list_commands</code> lists them.</li></ol>" },
            { t: "callout", kind: "warn", html: "If <code>/mcp</code> shows <b>lightcraft</b> as failed, LightCraft is probably not running yet or was not started through the <b>LightCraft (ArtCraft)</b> shortcut (which adds <code>--control 7980</code>). Start it that way, then ask Claude anything; the connection is made on the first request and re-made if you restart the app. The headless server only works on its own folder; it will refuse to open a library that the desktop app already has open." },
            { t: "callout", kind: "note", html: "The automation channel on port 7980 accepts connections only from your own PC and has no password. That is fine on a personal computer, and it is why the app opens it only when started with <code>--control</code>." },
            { t: "claude", title: "Say hello to LightCraft", html: "Your very first prompt. It only reads, so it is completely safe.", prompts: [
              { prompt: "Using the lightcraft MCP server, tell me how many photos are in the library that LightCraft has open and list the titles of the first five. Do not change anything.", why: "Claude will call query_photos (and may read the lightcraft://library resource). Nothing in the app changes. If it works, the connection is good. If Claude says it cannot reach the app, check that LightCraft is running." },
              { prompt: "Take a screenshot of LightCraft and tell me which view is showing and which panels are open.", why: "This uses the live-only screenshot tool (and maybe inspect_ui). Claude gets a picture of the window, the same thing you see. Try opening the Edit panel and asking again to see the difference." }
            ] },
            { t: "quiz", items: [
              { q: "You want Claude's edits to appear in the LightCraft window you are looking at. Which server?", choices: ["lightcraft-headless", "lightcraft (live)", "Either, they are identical", "Neither, Claude cannot edit"], answer: 1, explain: "The live server talks to the running app through port 7980. The headless one works on files with no window." },
              { q: "What does the tool name cmd_photo_rate correspond to?", choices: ["A button labelled Rate in the Edit panel", "The LightCraft command photo.rate", "A separate rating app", "A Claude Code setting"], answer: 1, explain: "Command tools are named cmd_ plus the command id with dots turned into underscores, so photo.rate becomes cmd_photo_rate." }
            ] },
            { t: "check", html: "<code>/mcp</code> shows both LightCraft servers connected, and Claude has answered a question about your library without changing it." }
          ]
        },
        {
          id: "m2-l2",
          title: "First prompts: let Claude look, not touch",
          minutes: 12,
          goals: [
            "By the end you can ask Claude to describe a photo and its current edit settings.",
            "You know what Claude can and cannot see through LightCraft's tools.",
            "You follow the habit: look first, then change."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "A good habit with any assistant: <b>ask it to look before you ask it to act</b>. If Claude understands the starting point, its edits make more sense, and you learn to read the same information yourself. LightCraft gives Claude several read-only tools for this." },
            { t: "steps", items: [
              { html: "In LightCraft, double-click the photo titled <b>Dune ridges</b> to open it in Detail view and press <kbd>E</kbd> to open the Edit panel." },
              { html: "In Claude, ask it to describe the window (first prompt below).", check: "Claude names the Detail view, the open photo and the visible panels." },
              { html: "Ask for the photo's current settings (second prompt).", check: "Claude reports Exposure, Contrast and other values. On an unedited photo most are 0 and the white balance is As Shot. Compare with the Edit panel." },
              { html: "Ask Claude to render the photo and judge it (third prompt).", detail: "<code>render_photo</code> sends Claude an actual picture of the photo with your edits applied (1024 px on the long edge unless you ask for more, up to 4096). So Claude can genuinely look at the result, not just read numbers." }
            ] },
            { t: "claude", title: "Look, don't touch", html: "All of these are read-only.", prompts: [
              { prompt: "Look at the LightCraft window. Which view is it in, which photo is open, and which panels are showing? Do not change anything.", why: "Claude will use screenshot and/or inspect_ui (live server only). It is describing the same screen you see." },
              { prompt: "What are the current develop settings of the active photo? List only the ones that are not at their default value.", why: "Claude will call get_develop for the active photo. On a fresh photo the answer should be 'none'. Watch whether it reports white balance honestly." },
              { prompt: "Render the active photo at 1024 pixels and tell me honestly: is it too dark, too bright or about right, and what is the most obvious problem?", why: "Claude will call render_photo, which returns an image it can look at. Its judgment is an opinion, not a measurement. Compare it with the histogram you can see in the Edit panel." },
              { prompt: "List the controls in the Light section with their minimum, maximum, default and current value.", why: "Claude will call list_controls with the section name. You will see ids like light.exposure (range -5 to +5) and light.contrast (range -100 to +100), which Claude uses later when it edits." }
            ] },
            { t: "h", text: "What Claude can and cannot see" },
            { t: "p", html: "<ul><li><b>Can see:</b> a screenshot of the window; a rendered picture of any photo with its edits; every slider value; library information such as titles, ratings, flags, keywords, camera and file details.</li><li><b>Cannot see:</b> your intentions (you must say what you want), your monitor's real colours, the histogram as a separate number set (there is no histogram tool, so read the histogram yourself), anything that only exists in your head, or this course.</li><li><b>Not perfect:</b> its reading of a picture is an opinion. If Claude says a photo looks fine and you see clipped highlights, trust the histogram and the clipping warning (lesson 4.1).</li></ul>" },
            { t: "callout", kind: "tip", html: "You can ask Claude to <b>explain</b> anything it reads: <i>\"What does Highlights do in a photo like this?\"</i> Then check it against what you will learn in module 4." },
            { t: "exercise", title: "Compare Claude's eye with yours", html: "Pick three different demo photos (a dark one such as the night sky, a bright one such as the sunset, and a colourful one such as the flower).", steps: [
              "For each photo, write down in one sentence whether you think it is too dark, too bright, or fine.",
              "Ask Claude to render the same photo and give its opinion, then compare with yours.",
              "Look at the histogram of each photo in the Edit panel: where does the bulk of it sit, left (dark), middle or right (bright)?"
            ] },
            { t: "quiz", items: [
              { q: "Which tool lets Claude actually look at a photo with your current edits applied?", choices: ["get_develop", "list_controls", "render_photo", "query_photos"], answer: 2, explain: "render_photo returns an image of the photo, with edits, that Claude can view. get_develop only returns numbers." },
              { q: "Claude says a photo 'looks fine' but your histogram is pressed against the right edge. What should you do?", choices: ["Trust Claude, it saw the picture", "Check the clipping warning and look closer; Claude's judgment is an opinion", "Ignore the histogram", "Restart LightCraft"], answer: 1, explain: "Claude's reading of an image is useful but not a measurement. The histogram and clipping warning in LightCraft are exact." }
            ] },
            { t: "check", html: "You have asked Claude to describe the window, read the settings and render a photo, and nothing in LightCraft changed." }
          ]
        },
        {
          id: "m2-l3",
          title: "Let Claude edit, then undo it",
          minutes: 15,
          goals: [
            "By the end you can ask Claude to change specific sliders and watch it happen live.",
            "You can undo Claude's work from the app or by asking Claude.",
            "You know that slider names have ids like light.exposure."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "Now the fun part: Claude changes something. Keep LightCraft visible beside the terminal so you can watch the sliders move. Because the live server works through the same commands as the mouse, the edit appears in the Edit panel and in the History panel just as if you had made it." },
            { t: "steps", items: [
              { html: "Open <b>Dune ridges</b> in Detail view with the Edit panel visible, and make sure the Light section is expanded." },
              { html: "Paste the first prompt below into Claude and press <kbd>Enter</kbd>. Claude Code may ask permission to use a LightCraft tool: read the request and allow it.", check: "In LightCraft the Exposure slider moves to about +0.50 and Highlights to about -30, and the photo changes right away." },
              { html: "Now undo it yourself. Click the LightCraft window and press <kbd>Ctrl</kbd>+<kbd>Z</kbd>.", detail: "Claude's <code>values</code> edit is <b>one</b> undo step, so a single undo reverts both sliders. The History panel (<b>Window → History</b>) shows Claude's change as an entry like any other.", check: "Both sliders return to 0." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> to redo, then ask Claude to undo with the second prompt below.", check: "Same result: the sliders return to 0, whether you or Claude undid it." }
            ] },
            { t: "claude", title: "Your first Claude edit", prompts: [
              { prompt: "In LightCraft, on the active photo, raise Exposure by half a stop (+0.5) and lower Highlights to -30. Then tell me the new values of those two controls.", why: "Claude will probably call get_develop (to see the starting point) and then set_develop with values for light.exposure and light.highlights, as a single undo step, then get_develop again to confirm. Watch the sliders move in the Edit panel." },
              { prompt: "Undo your last change in LightCraft and confirm the photo is back to how it started.", why: "Claude will run the edit.undo command (tool cmd_edit_undo), the same undo you trigger with Ctrl+Z. It is on the same stack as your own edits." },
              { prompt: "Explain in plain language what you changed, what each change does to the picture, and what could go wrong if I pushed each slider too far.", why: "No tools needed, or at most get_develop. A good habit: make Claude teach you the reason for each change so you learn the craft, not just the result." }
            ] },
            { t: "h", text: "Slider names Claude uses" },
            { t: "p", html: "Behind each slider is a <b>control id</b>. You will see these in Claude's replies:" },
            { t: "p", html: "<ul><li><code>light.exposure</code>: Exposure, range -5 to +5 (in stops)</li><li><code>light.contrast</code>, <code>light.highlights</code>, <code>light.shadows</code>, <code>light.whites</code>, <code>light.blacks</code>: each -100 to +100</li><li><code>wb.temp</code> and <code>wb.tint</code>: white balance (more in module 5)</li><li><code>color.vibrance</code>, <code>color.saturation</code>: -100 to +100</li><li><code>effects.clarity</code>, <code>effects.texture</code>, <code>effects.dehaze</code>: -100 to +100</li></ul><p>You never have to memorise these. Ask Claude to <i>\"list the controls in the Color section\"</i> and it will look them up.</p>" },
            { t: "callout", kind: "note", html: "One quirk you will meet in lesson 5.1: Claude always sets white balance temperature in <b>Kelvin</b> (<code>wb.temp</code>, 2000 to 50000, default 6500), even though the on-screen Temp slider for a JPEG shows a -100 to +100 scale. Do not be alarmed if the numbers differ." },
            { t: "exercise", title: "Moodier, then keep what you like", html: "Ask Claude to make <b>Dune ridges</b> moodier and darker, then judge the result yourself.", steps: [
              "Prompt: <i>\"Make the active photo moodier: a bit darker, more contrast, slightly desaturated. Tell me each value you set.\"</i>",
              "Look at the result. Press <kbd>\\</kbd> to show the original while you hold it, to compare.",
              "In the Edit panel, double-click any slider whose change you do not like to reset it, and keep the rest.",
              "Ask Claude to explain which of its changes you kept and which you reverted."
            ] },
            { t: "quiz", items: [
              { q: "Claude set Exposure and Highlights in one request. How many Ctrl+Z presses undo both?", choices: ["One", "Two", "Zero, Claude's edits cannot be undone", "As many as sliders"], answer: 0, explain: "A set_develop call with several values is one undo step. This matches a single slider drag being one step." },
              { q: "What is 'light.exposure'?", choices: ["A file name", "The id of the Exposure slider", "A keyboard shortcut", "A preset"], answer: 1, explain: "Every slider has an id. light.exposure is Exposure, a value from -5 to +5 stops." }
            ] },
            { t: "check", html: "You have watched Claude move sliders live, undone its change from the keyboard and by asking, and kept only the parts you liked." }
          ]
        },
        {
          id: "m2-l4",
          title: "Good prompts, limits and staying safe",
          minutes: 15,
          goals: [
            "By the end you can write a prompt that names the photo, the goal and the limits.",
            "You know what Claude cannot do through LightCraft and where it can go wrong.",
            "You have simple safety habits: keep originals, review before export, be careful with delete."
          ],
          assets: [],
          blocks: [
            { t: "h", text: "A prompt recipe that works" },
            { t: "p", html: "Claude is good at following clear instructions and poor at guessing what is in your head. Include four things:" },
            { t: "p", html: "<ol><li><b>Which photo(s):</b> \"the active photo\", \"the photo titled Lake at first light\", \"every photo with 4 or more stars\".</li><li><b>The goal in words</b>, not slider numbers: \"warmer and brighter, like early morning\".</li><li><b>Limits:</b> \"only change Light and Color\", \"keep Exposure within plus or minus 1\", \"do not export\".</li><li><b>What to report:</b> \"tell me every value you changed\".</li></ol>" },
            { t: "p", html: "Compare these two prompts:" },
            { t: "p", html: "<ul><li>Weak: <i>\"Fix this photo.\"</i> Fix what? Which photo? How far?</li><li>Strong: <i>\"On the active photo, recover detail in the bright sky without making the foreground muddy. Use only Highlights, Whites and Dehaze, stay within 40 points of zero, and list every value you set.\"</i></li></ul>" },
            { t: "h", text: "Propose first, apply second" },
            { t: "p", html: "For anything you are unsure about, ask Claude to <b>propose</b> before it changes anything. You review, then say which parts to apply. This keeps you in charge and teaches you at the same time." },
            { t: "claude", title: "Propose, then apply", prompts: [
              { prompt: "Look at the active photo in LightCraft. Propose three different edits that would improve it, each with the exact controls and values. Do NOT apply anything yet. Wait for me to say which one.", why: "Claude will use render_photo and get_develop to look, then answer in text only. No changes should happen in the app. This is the safest way to learn." },
              { prompt: "Apply only proposal number 2, then render the photo and tell me honestly whether it worked.", why: "Claude will call set_develop for the chosen values and render_photo to check its own work. You then judge in the app, and can undo with Ctrl+Z." }
            ] },
            { t: "h", text: "What Claude can't do (yet)" },
            { t: "p", html: "<ul><li>It cannot see the histogram as data, only the picture and the numbers it asks for.</li><li>It has no taste of its own: it will happily over-process if you say \"make it pop\". You decide.</li><li>Some features need extra downloaded models that most students do not have, for example the Object and Describe masks and AI Denoise, so Claude may report they are unavailable.</li><li>It works on one photo at a time unless you ask for a batch, and long batches take time. Keep an eye on the app.</li></ul>" },
            { t: "h", text: "Safety habits" },
            { t: "steps", items: [
              { html: "<b>Keep your originals.</b> LightCraft never writes edits into original files, and its render and screenshot tools refuse to overwrite a photo's original or sidecar. Still, keep a backup of anything precious, and practise on the files in <code>practice\\</code> or the demo photos." },
              { html: "<b>Read permission prompts.</b> Claude Code asks before it uses a tool. Be especially careful with anything involving <b>delete</b>, <b>remove</b> or <b>overwrite</b>. In LightCraft, <b>Delete Photo</b> only moves a photo to Recently Deleted, where you can restore it, but <b>Delete Permanently</b> cannot be taken back." },
              { html: "<b>Review before export.</b> Ask Claude to render the result and look at it yourself in the app before any export, and send exports to the <code>exports\\</code> folder, never over your originals." },
              { html: "<b>Undo is your friend.</b> If a change goes wrong, <kbd>Ctrl</kbd>+<kbd>Z</kbd> in the app, or ask Claude to undo." },
              { html: "<b>Close the door when you are done.</b> The automation channel on port 7980 exists only while LightCraft runs with <code>--control 7980</code>. Close LightCraft when you finish for the day." }
            ] },
            { t: "callout", kind: "warn", html: "Be careful with blanket 'always allow' answers to permission prompts, especially in a folder holding photos you cannot replace. For this course, practise on the demo photos and the files in <code>practice\\</code>, which can always be re-downloaded." },
            { t: "exercise", title: "Rewrite a weak prompt", html: "Take the weak prompt <i>\"Make my photo better\"</i> and rewrite it using the four-part recipe for a photo of your choice.", steps: [
              "Name the photo.",
              "State the goal in words.",
              "Add at least one limit.",
              "Say what you want reported back, then run it and check the result against your goal."
            ] },
            { t: "quiz", items: [
              { q: "Which prompt is best?", choices: ["Make it better", "Make the active photo warmer and a little brighter, only change Light and Color, and list every value you set", "Do whatever you think looks good to every photo in the library", "Delete the bad photos"], answer: 1, explain: "It names the photo, the goal and the limits, and asks for a report. The others are vague or risky." },
              { q: "Why ask Claude to propose edits before applying them?", choices: ["It runs faster", "You can review and learn the reasons, and nothing changes until you agree", "Claude cannot edit otherwise", "It saves disk space"], answer: 1, explain: "Reviewing first keeps you in control and teaches you why each change is made." }
            ] },
            { t: "check", html: "You can write a four-part prompt, you have had Claude propose before applying, and you know your safety habits: originals kept, permission prompts read, exports reviewed." }
          ]
        }
      ]
    },
    {
      id: "m3",
      title: "Seeing and sorting your photos",
      summary: "Browse and compare photos, cull with stars, flags and colour labels, and organise with albums, keywords, search and filters.",
      lessons: [
        {
          id: "m3-l1",
          title: "Browsing: views, zoom and comparing photos",
          minutes: 12,
          goals: [
            "By the end you can move between Photo Grid, Square Grid, Detail, Compare and Survey.",
            "You can zoom a photo to check sharpness and step through photos with the arrow keys.",
            "You know when to use Compare and when to use Survey."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "Before you rate or edit anything, you need to look at your photos comfortably. LightCraft gives you several ways to look, and each answers a different question: \"what do I have?\" (grid), \"is this one good?\" (detail), \"which of these two is better?\" (compare), \"which of these several is best?\" (survey)." },
            { t: "steps", items: [
              { html: "Press <kbd>G</kbd> in the grid.", detail: "The <b>Photo Grid</b> shows photos in justified rows that keep their real shape (portrait and landscape). The <b>Square Grid</b> crops every thumbnail to a square so rows line up. <kbd>G</kbd> toggles between them; the same choices are the first two view buttons at the bottom left.", check: "The thumbnails change between justified rows and equal squares." },
              { html: "In the bottom bar, drag the thumbnail-size slider at the right of the grid, then click the <b>Sort</b> button (the lines icon next to the view buttons) and look at the options for ordering the photos.", detail: "Sort changes the order, nothing else. You can always get back to the default." },
              { html: "Select one photo and press <kbd>D</kbd> to open it in <b>Detail</b>. Then press <kbd>Right</kbd> and <kbd>Left</kbd> to move to the next and previous photo.", check: "The big photo changes as you press the arrow keys and the highlighted filmstrip thumbnail follows." },
              { html: "Press <kbd>Z</kbd> (or <kbd>Space</kbd>) to zoom into the photo and again to zoom back out. Use the zoom menu at the bottom right (it shows <b>Fit</b>) to choose Fit, Fill or a fixed zoom, or press <kbd>Ctrl</kbd>+<kbd>0</kbd> for Fit and <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>0</kbd> for 100%.", detail: "To judge sharpness you must look at 100%: one photo pixel per screen pixel. LightCraft zooms into a working preview of each photo (2,560 px on the long edge by default, adjustable in <b>Edit → Settings…</b> under Performance), so on very large photos 100% may not be the full-resolution truth." },
              { html: "Press <kbd>F</kbd> for a full-screen preview with no panels and <kbd>Esc</kbd> to come back." },
              { html: "Back in the grid click one photo, hold <kbd>Ctrl</kbd> and click another, then press <kbd>Shift</kbd>+<kbd>C</kbd> for <b>Compare</b>.", check: "Two photos appear side by side so you can decide which to keep." },
              { html: "Return to the grid, select four or five photos with <kbd>Ctrl</kbd>+click, and press <kbd>N</kbd> for <b>Survey</b>.", check: "All selected photos are shown together, so you can find the best of a group." }
            ] },
            { t: "keys", items: [
              { keys: "G", action: "Photo Grid / Square Grid" },
              { keys: "D", action: "Detail view" },
              { keys: "Shift+C", action: "Compare" },
              { keys: "N", action: "Survey" },
              { keys: "Left / Right", action: "Previous / next photo" },
              { keys: "Z or Space", action: "Toggle zoom" },
              { keys: "F", action: "Full-screen preview" },
              { keys: "Ctrl+I", action: "Cycle the info overlay on the photo" }
            ] },
            { t: "callout", kind: "adobe", html: "Same names as Lightroom Classic: <b>Compare</b> and <b>Survey</b>. Lightroom's <i>Loupe</i> is LightCraft's <b>Detail</b>. Lightroom's <i>Navigator</i> panel is available under <b>View</b> in the menu bar." },
            { t: "claude", title: "Ask Claude to drive the view", html: "Claude can change what you see, which is handy when you want to look at something specific.", prompts: [
              { prompt: "In LightCraft, switch to Detail view and open the photo titled 'Dune ridges'.", why: "Claude will probably use select_photos (or query_photos to find it) and then the Detail view command (cmd_view_detail) or set_ui. Watch the window change." },
              { prompt: "Show only my Picks in the grid and tell me how many there are and what they are called.", why: "Claude will most likely call run_command with library.source (kind: picks) and query_photos. In the app, My Photos should highlight Picks. Click All Photos afterwards to see everything again." }
            ] },
            { t: "quiz", items: [
              { q: "You have two near-identical shots and want to pick the sharper one. Which view?", choices: ["Survey", "Compare", "Square Grid", "Full-screen preview"], answer: 1, explain: "Compare puts two photos side by side. Zoom both to 100% to judge sharpness." },
              { q: "Why zoom to 100% before deciding whether a photo is sharp?", choices: ["It is faster", "At Fit size you only see a shrunken copy that hides blur", "It saves the photo", "It applies sharpening"], answer: 1, explain: "A fitted view shrinks the picture so small blur disappears. 100% shows real pixels." }
            ] },
            { t: "check", html: "You have used the Photo Grid, Square Grid, Detail, Compare and Survey, and you can zoom a photo to 100% and back." }
          ]
        },
        {
          id: "m3-l2",
          title: "Culling with stars, flags and colour labels",
          minutes: 15,
          goals: [
            "By the end you can rate photos with stars, flag picks and rejects, and apply colour labels.",
            "You can explain what each of the three marks is for.",
            "You can cull a set of photos quickly with the keyboard."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "<b>Culling</b> means deciding which photos are worth keeping. A photographer might take 300 shots and deliver 30. Doing the culling first means you spend editing time only on the photos that matter. LightCraft gives you three kinds of mark, each with a different job:" },
            { t: "p", html: "<ul><li><b>Flags</b> are a quick yes/no: <b>Pick</b> (flag up), <b>Reject</b> (flag down) or no flag. Use them on your first, fast pass.</li><li><b>Stars</b> (0 to 5) say <i>how good</i>. Use them on the photos you picked, to rank them.</li><li><b>Colour labels</b> (red, yellow, green, blue, purple) are <i>your own status</i>: for example red = needs retouching, green = ready to export.</li></ul>" },
            { t: "callout", kind: "note", html: "A reject is only a flag. The photo is still in your library until you actually delete it (<kbd>Delete</kbd> moves it to <b>Recently Deleted</b>, from which you can restore it). The demo photos come with some stars, picks and rejects already set so you have something to filter in the next lesson." },
            { t: "steps", items: [
              { html: "Press <kbd>G</kbd> for the grid, click a photo to select it, and press <kbd>3</kbd>.", check: "Three stars appear on the thumbnail and in the bottom bar. Press <kbd>0</kbd> to clear them." },
              { html: "Click the stars in the bottom bar as an alternative (the centre pill holds five stars, a colour-label circle, a pick flag and a reject flag)." },
              { html: "Press <kbd>P</kbd> to <b>Pick</b>, <kbd>X</kbd> to <b>Reject</b>, <kbd>U</kbd> to <b>Unflag</b>.", check: "The flag icon on the thumbnail changes each time." },
              { html: "Press <kbd>6</kbd> for a red label, <kbd>7</kbd> yellow, <kbd>8</kbd> green, <kbd>9</kbd> blue. Purple is in <b>Photo → Set Color Label</b>.", detail: "You can also use the menu: <b>Photo → Set Rating</b>, <b>Set Flag</b> and <b>Set Color Label</b>." },
              { html: "Now cull the set the fast way. Open the first photo with <kbd>D</kbd> and go through the photos: <kbd>Shift</kbd>+<kbd>Z</kbd> picks and moves to the next photo, <kbd>Shift</kbd>+<kbd>X</kbd> rejects and moves on, and <kbd>Right</kbd> skips without marking.", detail: "Holding <kbd>Shift</kbd> with a rating, flag or label key applies it and advances automatically. There is also <b>Photo → Auto Advance</b>, which makes every mark move you on by itself." },
              { html: "Go through the 24 demo photos in a single quick pass. Pick the five you like best.", check: "After your pass, <b>Picks</b> in My Photos lists your choices." },
              { html: "Select just your picks (click <b>Picks</b>) and give each a star rating from 1 to 5 to rank them. Give your single best photo a green label (<kbd>8</kbd>)." }
            ] },
            { t: "keys", items: [
              { keys: "0 to 5", action: "Set the star rating" },
              { keys: "P / X / U", action: "Pick / Reject / Unflag" },
              { keys: "Shift+Z / Shift+X", action: "Pick or reject, then go to the next photo" },
              { keys: "6 7 8 9", action: "Red, yellow, green, blue label" },
              { keys: "Delete", action: "Move photo to Recently Deleted" }
            ] },
            { t: "callout", kind: "tip", html: "Cull in <b>two passes</b>. Pass one: look fast and mark only obvious picks and rejects (flags). Pass two: look closely at only the picks, zoom in to check sharpness, and add stars. It is faster and gives better decisions than a single slow pass." },
            { t: "claude", title: "Get a second opinion on your culling", prompts: [
              { prompt: "Look at the photos in the 'Garden' album in LightCraft. Render each one and tell me which you would pick and which you would reject, with one sentence of reasoning each. Do not change any flags.", why: "Claude will call query_photos (or run albums.list) to find the album, then render_photo for each photo. No flags change. Compare its choices with yours." },
              { prompt: "I agree with your best pick from the Garden album. Flag it as a pick and give it 4 stars.", why: "Claude will call photo.flag (cmd_photo_flag) and photo.rate (cmd_photo_rate). Watch the thumbnail get a flag and four stars. LightCraft also has an assisted-culling command; ask Claude to check list_commands for it if you want to try it." },
              { prompt: "Mark every photo in the library that has 1 star or fewer and no flag with a red colour label, and tell me how many that was.", why: "Claude will use query_photos and cmd_photo_label with the ids it finds. This is the 'boring batch' kind of job that suits Claude: finding things by rule. Review the labels in the grid afterwards." }
            ] },
            { t: "exercise", title: "Cull the Mountains album", html: "Open the <b>Mountains</b> album (inside the <b>Travel 2026</b> folder in My Photos).", steps: [
              "Flag your best two photos as picks and reject the weakest one.",
              "Rate your two picks with 4 and 5 stars.",
              "Give the rejected photo a red label so you can find it later, then check the label colour in the thumbnail."
            ] },
            { t: "quiz", items: [
              { q: "What is the main difference between a flag and a star rating?", choices: ["Flags are for printing", "Flags are a quick yes/no; stars rank how good", "Stars cannot be removed", "There is none"], answer: 1, explain: "Use flags for the fast first decision and stars to rank what you kept." },
              { q: "You press X on a photo. What happens to the file?", choices: ["It is deleted from disk", "It is flagged as rejected and stays in your library", "It is moved to Recently Deleted", "It is exported"], answer: 1, explain: "Reject is only a flag. Delete moves a photo to Recently Deleted, still recoverable." }
            ] },
            { t: "check", html: "You have rated, flagged and labelled photos with both mouse and keyboard, and you know a reject is not a delete." }
          ]
        },
        {
          id: "m3-l3",
          title: "Organising: albums, keywords, search and filters",
          minutes: 15,
          goals: [
            "By the end you can make an album, add photos to it, and build a smart album.",
            "You can add keywords and find photos with search and the filter bar.",
            "You know that albums are lists, not folders on disk."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "Once you have thousands of photos, stars are not enough. You need ways to group photos and to find them. LightCraft has four tools:" },
            { t: "p", html: "<ul><li><b>Albums</b>: groups you build by hand. A photo can be in many albums and the file never moves. (An album is only a list.)</li><li><b>Smart albums</b>: groups defined by a rule, for example \"4 stars or more\", that fill themselves.</li><li><b>Keywords</b>: tags you attach to photos, such as \"beach\" or \"mum\".</li><li><b>Search and filters</b>: find photos by text, rating, flag, label, keyword, camera and more.</li></ul>" },
            { t: "callout", kind: "adobe", html: "<b>Album</b> = Lightroom's <i>Collection</i>. <b>Smart Album</b> = <i>Smart Collection</i>. A <b>Folder</b> in the Albums list = a <i>Collection Set</i>: a container that groups albums, not a real folder on disk. For browsing real disk folders use the <b>This Computer</b> area of My Photos." },
            { t: "h", text: "Albums" },
            { t: "steps", items: [
              { html: "In My Photos click the <b>+</b> beside <b>Albums</b> (tooltip <b>Create Album</b>) or press <kbd>Ctrl</kbd>+<kbd>N</kbd>. Name it <code>Practice picks</code> and confirm.", check: "A new album appears under Albums with a count of 0." },
              { html: "Select a few photos in the grid (click, then <kbd>Ctrl</kbd>+click) and choose <b>Photo → Add to Album</b>, then pick <b>Practice picks</b>.", check: "Click the album in My Photos: it now holds your photos." },
              { html: "Make a folder to hold albums with <b>File → New Folder…</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>N</kbd>). Look at the demo's <b>Travel 2026</b> folder for an example with Coastlines, Deserts and Mountains inside." }
            ] },
            { t: "h", text: "Keywords and information" },
            { t: "steps", items: [
              { html: "Select a photo and press <kbd>K</kbd> to open <b>Keywords</b>. Type a word in the <b>Add keyword</b> field and press <kbd>Enter</kbd>.", check: "The keyword is listed for that photo. Do the same on a second photo using the same word." },
              { html: "Press <kbd>I</kbd> to open <b>Info</b>: here you can set a title, caption and copyright, and read the camera settings and file path." }
            ] },
            { t: "h", text: "Search and the filter bar" },
            { t: "steps", items: [
              { html: "Click the <b>Search Photos</b> box at the top (or press <kbd>Ctrl</kbd>+<kbd>F</kbd>) and type a word from a photo title, such as <code>sea</code>. Clear it when you are done.", check: "The grid narrows to the matching photos." },
              { html: "Click the funnel icon next to the search box (or press <kbd>Shift</kbd>+<kbd>F</kbd>) to open the <b>Filter bar</b>. Filter by rating (for example 3 stars and up) or by flag.", detail: "<b>View → Clear Filters</b> removes all filters. Filters stack: a rating filter plus a keyword filter shows only photos that match both." },
              { html: "With a filter active, choose <b>File → New Smart Album from Filter…</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>) and name it <code>Best of</code>.", check: "A smart album appears in My Photos and keeps itself up to date as you rate more photos." }
            ] },
            { t: "callout", kind: "warn", html: "If the grid suddenly looks like it is missing photos, check for an active filter or search text, or a selected album in My Photos. The count at the top right of the grid tells you how many photos match; <b>All Photos</b> in My Photos plus <b>View → Clear Filters</b> brings everything back." },
            { t: "claude", title: "Let Claude do the filing", html: "Organising is full of repetitive jobs, which is where Claude saves time.", prompts: [
              { prompt: "Create an album called 'Golden hour' in LightCraft and add every photo whose title mentions sun, sunset, golden or light. Tell me which photos you added.", why: "Claude will use query_photos to find matches, then album.create and album.addPhotos (cmd_album_create and so on, or run_command). Watch the new album appear in My Photos." },
              { prompt: "Add the keyword 'practice' to every photo in the Garden album and tell me when done.", why: "Claude will use photo.setMeta with addKeywords for those photos. Open the Keywords panel (K) on one of them to check." },
              { prompt: "Show only photos with 3 or more stars that I have not edited yet.", why: "Claude will use run_command with library.filter (rating, ratingOp and the edited flag). The filter bar in the app should reflect it. Use View → Clear Filters to reset." }
            ] },
            { t: "exercise", title: "Build your own system", html: "Create a small organisation system for the demo photos and check that it works.", steps: [
              "Make two albums, <code>Landscapes</code> and <code>Flowers</code>, and add the right photos to each.",
              "Give every photo in the <code>Flowers</code> album the keyword <code>bloom</code>.",
              "Use the filter bar to show only 4-star-and-up photos in <code>Landscapes</code>, then save that as a smart album."
            ] },
            { t: "quiz", items: [
              { q: "You add a photo to two albums. How many copies of the file exist on disk?", choices: ["Two", "One, albums are just lists", "Three", "It depends on the format"], answer: 1, explain: "Albums reference photos. The original file stays where it is, whatever albums it belongs to." },
              { q: "What does a smart album do that a normal album does not?", choices: ["It holds more photos", "It fills itself from a rule such as '4 stars or more'", "It stores photos on the cloud", "It exports automatically"], answer: 1, explain: "A smart album is defined by rules, so new photos that match join it automatically." }
            ] },
            { t: "check", html: "You have built an album and a smart album, tagged photos with a keyword, and used search and the filter bar to find them." }
          ]
        }
      ]
    },
    {
      id: "m4",
      title: "Light and tone",
      summary: "Understand exposure and the histogram, then shape brightness and contrast with the Light sliders, the tone curve, Auto and profiles.",
      lessons: [
        {
          id: "m4-l1",
          title: "Exposure and reading the histogram",
          minutes: 18,
          goals: [
            "By the end you can explain what exposure and a 'stop' are.",
            "You can read a histogram and spot clipped shadows and highlights.",
            "You can tell a photo that is truly too dark from one that is simply a dark scene."
          ],
          assets: ["earthrise", "tetons", "raw-sony"],
          blocks: [
            { t: "h", text: "What exposure is" },
            { t: "p", html: "<b>Exposure</b> is how much light the sensor received for a photo. Too little and the picture is dark and noisy; too much and bright areas turn pure white with no detail left. Three camera settings control it when you shoot: <b>shutter speed</b> (how long the sensor looks), <b>aperture</b> (how wide the lens opens) and <b>ISO</b> (how much the signal is amplified). LightCraft shows the ones the camera recorded in a thin strip under the histogram: ISO, focal length, aperture, shutter." },
            { t: "p", html: "Exposure is measured in <b>stops</b>. One stop <i>more</i> means twice as much light; one stop less means half. The Exposure slider in LightCraft goes from -5 to +5 stops, so +1.00 makes the photo twice as bright (in the way light works, not in a simple percentage). Small moves matter: +0.3 is a gentle lift." },
            { t: "h", text: "What the histogram shows" },
            { t: "p", html: "The <b>histogram</b> is a bar chart of the photo's brightness. The left edge is pure black, the right edge is pure white, and the height of the graph at any point says how many pixels have that brightness. In LightCraft's Edit panel the grey fill is overall brightness and the red, green and blue lines show each colour channel. A mountain on the left means lots of dark pixels; on the right, lots of bright pixels." },
            { t: "p", html: "<b>Clipping</b> is when pixels hit the very edge: pure black (shadows with no detail) or pure white (highlights with no detail). Once clipped, the information is gone. Tiny triangles in the top corners of the histogram light up when this happens, and clicking the histogram (or pressing <kbd>J</kbd>) paints the clipped areas on the photo." },
            { t: "callout", kind: "note", html: "There is no \"perfect\" histogram shape. A photo of a snowfield should lean right and a night scene should lean left. What matters is whether you are <i>losing detail you care about</i> at either edge." },
            { t: "steps", items: [
              { html: "Open <code>earthrise.jpg</code> in Detail view with the Edit panel showing and look at the histogram.", check: "Nearly everything is packed against the left edge, because most of the picture is black space. This is correct for this photo, not a mistake." },
              { html: "Open <code>tetons.jpg</code> and compare.", check: "The graph is spread across the whole width, tapering to the right: a wide range of tones, with more dark than bright." },
              { html: "Open the Sony raw file (<code>sony-a7iv.arw</code>) and look at its histogram, then the EXIF strip under it.", detail: "Raw files often start flatter than the JPEG preview a camera shows, with a histogram that does not reach the edges. That is normal; you will stretch it in the next lesson." },
              { html: "On any photo drag <b>Exposure</b> to about <b>+2.00</b>. Watch the histogram slide to the right and the top-right triangle light up, then press <kbd>J</kbd>.", check: "Bright areas are marked on the photo, showing where detail is already lost. Double-click the Exposure slider to reset it." },
              { html: "Now drag Exposure to about <b>-2.00</b>.", check: "The graph slides left and the top-left triangle may light up as shadows crush to black." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>H</kbd> to hide and show the histogram, then show it again." }
            ] },
            { t: "callout", kind: "adobe", html: "The clipping warning is <kbd>J</kbd> in Lightroom too. The histogram's two corner triangles are the same idea as Lightroom's. LightCraft's histogram sits at the top of the Edit panel, as in Lightroom's Develop module." },
            { t: "callout", kind: "tip", html: "A raw file gives you room to move exposure by one or two stops either way with little damage. A JPEG tolerates much less, and highlights that are already white in a JPEG cannot be recovered." },
            { t: "claude", title: "Bracket the photo", html: "Photographers 'bracket' by shooting a darker, normal and brighter version. Claude can show you the same thing from one photo.", prompts: [
              { prompt: "On the active photo in LightCraft, set Exposure to -1, render it at 800 pixels, then set Exposure to +1 and render it again, then undo both changes so the photo is as it was. Describe what changed between the two renders.", why: "Claude will call set_develop, render_photo (twice) and then the undo command (cmd_edit_undo) twice. You can watch the slider jump in the app, and afterwards check with Ctrl+Z history that nothing is left over." },
              { prompt: "Looking at a render of the active photo, explain in beginner words where its brightness is concentrated and whether you think highlights or shadows are clipping. I will compare your answer with the real histogram.", why: "Claude will use render_photo and answer from what it sees. It cannot read the histogram data, so compare its answer with the histogram and J clipping view in the app; this teaches you how far to trust its eye." }
            ] },
            { t: "exercise", title: "Sort the photos by histogram", html: "Open four demo or practice photos and classify each one.", steps: [
              "For each, note where the bulk of the histogram sits (left, middle, right) and whether either corner triangle lights up.",
              "Label each as <i>low-key</i> (mostly dark, on purpose), <i>high-key</i> (mostly bright, on purpose), <i>balanced</i> or <i>flat</i> (all bunched in the middle).",
              "Use <kbd>J</kbd> on each and write down whether any detail you care about is clipped."
            ] },
            { t: "quiz", items: [
              { q: "Exposure goes from 0 to +1.00. How much more light is that?", choices: ["10% more", "Twice as much", "Four times as much", "No change"], answer: 1, explain: "One stop means doubling the light." },
              { q: "The histogram of a night-sky photo is piled at the left. What does that tell you?", choices: ["It is definitely badly exposed", "Most of the picture is dark, which may be exactly right for a night scene", "The file is a raw", "The lens is dirty"], answer: 1, explain: "A histogram describes the scene as well as the exposure. Check whether detail you care about is clipped instead of aiming for a shape." },
              { q: "What does a lit triangle in the top-right corner of the histogram mean?", choices: ["The photo is sharp", "Some pixels are pure white and have lost detail", "The photo is in black and white", "Export is ready"], answer: 1, explain: "The corner triangles warn of clipping: left for shadows, right for highlights." }
            ] },
            { t: "check", html: "You can explain stops and clipping, you have pushed Exposure both ways to see the histogram move, and you have used <kbd>J</kbd> to show clipping on the photo." }
          ]
        },
        {
          id: "m4-l2",
          title: "The Light sliders: a tonal edit step by step",
          minutes: 18,
          goals: [
            "By the end you can describe what Exposure, Contrast, Highlights, Shadows, Whites and Blacks each do.",
            "You can edit a photo in a sensible order and check it with the histogram and clipping warning.",
            "You can compare before and after."
          ],
          assets: ["raw-sony", "tetons"],
          blocks: [
            { t: "p", html: "The six sliders in the <b>Light</b> section divide the brightness range into zones, like turning six knobs on different parts of the histogram:" },
            { t: "p", html: "<ul><li><b>Exposure</b>: moves the whole picture lighter or darker.</li><li><b>Contrast</b>: pushes dark tones darker and light tones lighter around the middle. More contrast looks punchier; less looks flatter and softer.</li><li><b>Highlights</b>: the bright parts, like sky and clouds. Lower it (negative) to bring back detail.</li><li><b>Shadows</b>: the dark parts. Raise it (positive) to reveal detail in dark areas.</li><li><b>Whites</b>: the very brightest tones, the white point at the right end.</li><li><b>Blacks</b>: the very darkest tones, the black point at the left end.</li></ul>" },
            { t: "callout", kind: "note", html: "Highlights and Shadows <b>recover detail</b> inside bright and dark areas. Whites and Blacks <b>set the ends</b> of the range. A photo that feels flat usually needs its ends stretched; one with a washed-out sky needs Highlights pulled down." },
            { t: "p", html: "A sensible order to work in:" },
            { t: "steps", items: [
              { html: "Open <code>sony-a7iv.arw</code> in Detail view, press <kbd>E</kbd>, and click <b>Reset</b> so you start from zero. Look at the histogram first.", check: "You see the raw photo's starting look, probably flat and a bit dull." },
              { html: "<b>Exposure first.</b> Move it until the middle of the picture (the subject) feels about right. Do not worry yet about the sky or the darkest corners.", detail: "Expect numbers like +0.3 to +1.0 for a raw that came out a bit dark. Small steps are better than a big jump." },
              { html: "<b>Highlights down.</b> Drag Highlights to the left (try -40 to -80) until bright sky or clouds show detail again.", check: "The right side of the histogram pulls in from the edge." },
              { html: "<b>Shadows up.</b> Drag Shadows right (try +30 to +60) until dark areas show detail.", detail: "Lifting shadows too far reveals noise (grainy speckles) and makes the picture look flat and unreal. Stop when it still looks natural." },
              { html: "<b>Set the ends.</b> Drag Whites right until the histogram reaches the right edge (just touching, not clipped), and Blacks left until the left edge is touched. Then press <kbd>J</kbd> to confirm that very little is marked as clipped.", check: "The histogram now spans the full width, and the photo has real black and real white." },
              { html: "<b>Contrast last.</b> Add a small amount (+10 to +30) if the picture still feels flat.", detail: "Because Highlights, Shadows, Whites and Blacks already shape the tones, you often need less Contrast than you expect." },
              { html: "<b>Compare.</b> Press and hold <kbd>\\</kbd> to peek at the original, then press <kbd>Y</kbd> for a side-by-side before/after. Press <kbd>Y</kbd> again to leave.", check: "You can see how much the photo has changed and judge whether it is better, not just different." }
            ] },
            { t: "image", src: "../lightcraft/docs/images/ba-tetons.jpg", alt: "LightCraft before and after comparison of the Tetons black and white landscape", caption: "Before and after (the <kbd>Y</kbd> key). Use it every few edits: the human eye gets used to a look and loses sight of how far you have pushed it." },
            { t: "keys", items: [
              { keys: "\\", action: "Show the original while held (or toggle)" },
              { keys: "Y", action: "Before / After side by side" },
              { keys: "Shift+Y", action: "Before / After as a split view" },
              { keys: "J", action: "Show clipping on the photo" },
              { keys: "Ctrl+1", action: "Jump to the Light section" }
            ] },
            { t: "callout", kind: "warn", html: "Strong slider values cost quality: pushing Shadows up reveals noise, pushing Highlights down too far can look grey and unnatural around edges (a halo), and big Exposure jumps on a JPEG cannot bring back lost detail. Aim for edits that you cannot easily spot." },
            { t: "callout", kind: "adobe", html: "These are the same six sliders as Lightroom's <b>Basic</b> panel (Exposure, Contrast, Highlights, Shadows, Whites, Blacks), and work in the same order tutorials recommend. Lightroom's separate <b>Auto Tone</b> button maps to LightCraft's <b>Auto</b> button (next lesson)." },
            { t: "claude", title: "Same edit, three ways", prompts: [
              { prompt: "Reset the active photo, then do a basic tonal edit: set Exposure so the main subject looks balanced, pull Highlights down enough to recover the brightest areas, lift Shadows modestly, then set Whites and Blacks so the histogram would just reach both edges without clipping. Use small values, tell me each value, then render the result and critique your own work.", why: "Claude will use get_develop and set_develop, probably across a few steps, and render_photo to check. Compare its order and values with yours. The sliders move live in the Edit panel." },
              { prompt: "Check my edit. Read the current develop settings of the active photo and tell me what you would change, without changing anything. Be specific about each slider.", why: "Coaching mode: Claude calls get_develop and render_photo, then answers in text. Because nothing is changed, it is safe on photos you are happy with." },
              { prompt: "Show me my edit history for the active photo and tell me which of my changes probably had the biggest visible effect on the picture, and why. Do not undo or change anything.", why: "Claude may read the history with run_command (history.list) and the current settings with get_develop, then explain in text. You can still use the Y key yourself for a visual before/after." }
            ] },
            { t: "exercise", title: "Rescue a bad exposure", html: "Pick a demo photo that is clearly too dark or too bright, and the <code>tetons.jpg</code> image.", steps: [
              "Bring each to a balanced exposure using the order above.",
              "Check <kbd>J</kbd> for clipping on both. Which one had more room to move, a JPEG or the raw?",
              "Press <kbd>Y</kbd> and decide honestly whether the after is better than the before."
            ] },
            { t: "quiz", items: [
              { q: "The sky is washed out and has lost its clouds, but the rest of the photo is fine. Which slider helps most?", choices: ["Blacks up", "Highlights down", "Shadows up", "Contrast down"], answer: 1, explain: "Highlights controls the bright parts. Lower it to recover cloud detail." },
              { q: "Which two sliders set the 'ends' of the tonal range?", choices: ["Highlights and Shadows", "Exposure and Contrast", "Whites and Blacks", "Clarity and Dehaze"], answer: 2, explain: "Whites sets the white point and Blacks the black point, which together stretch the histogram edge to edge." }
            ] },
            { t: "check", html: "You have edited a raw photo in the order Exposure, Highlights, Shadows, Whites and Blacks, Contrast, and used <kbd>J</kbd> and <kbd>Y</kbd> to check your work." }
          ]
        },
        {
          id: "m4-l3",
          title: "Tone Curve, Auto and Profiles",
          minutes: 15,
          goals: [
            "By the end you can read a tone curve and add an S-curve for contrast.",
            "You can use Auto as a starting point and know why it is only a starting point.",
            "You can change the Profile to alter a photo's base look."
          ],
          assets: ["tetons", "raw-sony"],
          blocks: [
            { t: "h", text: "The tone curve" },
            { t: "p", html: "A <b>tone curve</b> is a graph. The horizontal axis is the brightness a pixel <i>has</i> (dark on the left, bright on the right) and the vertical axis is the brightness it <i>should become</i>. A straight diagonal line means nothing changes. Pull the line up in the middle and the picture gets brighter; pull it down and it gets darker. A gentle <b>S shape</b> (darks lowered, lights raised) boosts contrast, the way the Contrast slider does but with finer control over which tones move." },
            { t: "image", src: "../lightcraft/docs/images/curve-tetons.jpg", alt: "LightCraft Detail view with the tone curve flyout open beside the Edit panel", caption: "The Curve flyout in the Edit panel's Light section: a graph you can drag points on." },
            { t: "steps", items: [
              { html: "Open <code>tetons.jpg</code>, press <kbd>E</kbd>, and click the <b>Curve</b> row at the bottom of the <b>Light</b> section.", check: "A curve graph opens beside the panel. A fresh photo has a straight diagonal line." },
              { html: "Click on the line a quarter of the way up from the bottom-left and drag it a little <i>down</i>. Then click three quarters of the way up and drag it a little <i>up</i>.", check: "You have drawn a gentle S, and the photo gets more contrast with smooth, natural tones." },
              { html: "Now try the same on the line's centre point: drag it up, then down.", detail: "That is the same as Exposure for the middle tones only. If you want to start again, press <kbd>Ctrl</kbd>+<kbd>Z</kbd> or look for the reset control in the flyout." },
              { html: "Look for the other curve controls in the flyout: parametric sliders named <b>Highlights, Lights, Darks, Shadows</b>, the choice of the combined RGB curve or the individual Red, Green and Blue channels, and curve presets.", detail: "Adjusting one colour channel's curve tints the picture; beginners can safely stay on the combined RGB curve." }
            ] },
            { t: "h", text: "Auto and Profiles" },
            { t: "steps", items: [
              { html: "Open the Sony raw file. Click <b>Auto</b> in the Edit header.", check: "LightCraft sets several sliders at once to its best guess. Look at which ones moved." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to undo it, then click Auto again and tweak a couple of sliders yourself.", detail: "<b>Auto</b> (also <kbd>Shift</kbd>+<kbd>A</kbd>, or <b>Photo → Auto Settings</b>) is a good first guess, but it cannot know what you want. Use it as a starting point, not the finish." },
              { html: "Click the <b>Profile</b> choice below the header. Pick <b>Vivid</b>, then <b>Neutral</b>, then back to <b>Color</b>.", detail: "A <b>profile</b> is the base look that raw data is rendered with before your sliders apply: <b>Basic</b> (Color, Neutral, Vivid, Landscape, Portrait, Monochrome), plus groups named Film, Cinematic, Muted and B&amp;W. For a non-default profile an <b>Amount</b> slider appears so you can blend it in partially.", check: "The photo's overall colour and contrast change, and the slider values stay the same. The profile is a different starting point." }
            ] },
            { t: "callout", kind: "adobe", html: "A LightCraft <b>Profile</b> is like Lightroom's <i>Profile</i> (Adobe Color, Adobe Landscape and the camera-matching profiles). LightCraft ships its own profiles and does not use Adobe's. For raw files without a bundled colour profile, colours can differ from the camera's own JPEG; Sony A7 IV, Fujifilm X-H2S and X-T4 and DNG files are the best matched." },
            { t: "claude", title: "Auto versus your edit", prompts: [
              { prompt: "On the active photo, record the current develop settings, run LightCraft's Auto, tell me exactly which controls Auto changed and by how much, then undo Auto.", why: "Claude will call get_develop, then the develop.auto command (tool cmd_develop_auto), then get_develop again, then cmd_edit_undo. It's a great way to learn what Auto does." },
              { prompt: "Look up LightCraft's profiles. Apply the Vivid profile to the active photo at 60%, render it, and tell me how it differs from the default Color profile.", why: "Claude will call run_command with profiles.list to find the profile id, then develop.profile with an amount (cmd_develop_profile), and render_photo. In the app, the Profile choice and Amount slider update." },
              { prompt: "Give the active photo a gentle S-curve for contrast using LightCraft's curve command. Look up the command's parameters first with list_commands, then apply it, and explain what each point does.", why: "Claude will use list_commands/run_command with develop.curve (channel and points). Open the Curve flyout to see the shape it drew; undo with Ctrl+Z if you do not like it." }
            ] },
            { t: "exercise", title: "Three looks, one photo", html: "Create three different looks from one photo and pick a winner.", steps: [
              "Look A: Auto, then adjust to taste.",
              "Look B: Reset, then apply a profile of your choice at an Amount you like.",
              "Look C: Reset, then use the Light sliders plus an S-curve.",
              "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> through History (or use the History panel) to compare them, and decide which you prefer and why."
            ] },
            { t: "quiz", items: [
              { q: "A tone curve is a straight diagonal line. What does that mean?", choices: ["The photo is black and white", "No tonal change has been made", "The photo is too bright", "The curve is broken"], answer: 1, explain: "Input brightness equals output brightness along the diagonal, so nothing changes." },
              { q: "What does an S-shaped curve usually do?", choices: ["Increase contrast", "Remove noise", "Change white balance", "Crop the photo"], answer: 0, explain: "Lowering the darks and raising the lights spreads the tones apart, which adds contrast." },
              { q: "Why is Auto only a starting point?", choices: ["It is slow", "It cannot know what look you want", "It changes the original file", "It only works on raw"], answer: 1, explain: "Auto makes a good general guess, but your photo and your taste are specific." }
            ] },
            { t: "check", html: "You have drawn an S-curve, compared Auto with your own edit, and tried at least two profiles." }
          ]
        }
      ]
    },
    {
      id: "m5",
      title: "Colour",
      summary: "Fix white balance, boost colour sensibly, change individual colours with the Color Mixer, tint shadows and highlights with Color Grading, and make black and white pictures.",
      lessons: [
        {
          id: "m5-l1",
          title: "White balance: making colours look right",
          minutes: 18,
          goals: [
            "By the end you can explain what white balance is and why photos need it.",
            "You can fix a colour cast with the Temp and Tint sliders and with the white balance picker.",
            "You know that a raw file's Temp is in Kelvin and a JPEG's is a relative scale."
          ],
          assets: ["raw-sony", "raw-nikon", "tilted-horizon"],
          blocks: [
            { t: "h", text: "Why white balance exists" },
            { t: "p", html: "Light has a colour. Candlelight and indoor bulbs are orange, midday sun is nearly neutral, and overcast sky or shade is bluish. Your brain quietly corrects for this, so a white sheet looks white everywhere. A camera sensor does not correct, so the same sheet can come out orange under a lamp and blue in the shade. <b>White balance</b> is the correction: you tell LightCraft what colour the light was, and it shifts all colours so that things that should be neutral look neutral." },
            { t: "p", html: "It uses two sliders in the <b>Color</b> section:" },
            { t: "p", html: "<ul><li><b>Temp</b> (temperature): blue to yellow. Slide right to make the picture warmer (more yellow), left to make it cooler (more blue).</li><li><b>Tint</b>: green to magenta. Use it for the small green or magenta casts that fluorescent lights and some skies create.</li></ul>" },
            { t: "callout", kind: "note", html: "For a <b>raw</b> file the Temp slider shows real <b>Kelvin</b> numbers (the colour of the light, about 2000 K for candlelight, 5500 K for daylight, 7000 K and up for shade), so you can set the actual colour of the light. For a <b>JPEG</b> the camera has already baked its white balance in, so the slider shows a relative -100 to +100 scale instead and has less range. That is why raw files are more forgiving. (Claude always works in Kelvin, <code>wb.temp</code>, even for a JPEG, so its numbers may not match the on-screen JPEG slider.)" },
            { t: "steps", items: [
              { html: "Open <code>sony-a7iv.arw</code> in Detail view, press <kbd>E</kbd>, click <b>Reset</b>, and expand the <b>Color</b> section.", check: "The <b>White Balance</b> choice reads <b>As Shot</b>, which is the camera's own guess, and Temp shows a number in Kelvin." },
              { html: "Drag <b>Temp</b> to the left, then to the right. Watch the whole picture shift between blue and yellow. Then do the same with <b>Tint</b>.", check: "You see that Temp and Tint change every colour in the picture, not just one." },
              { html: "Open the <b>White Balance</b> choice and look through the list. Choose a different entry, then go back to <b>As Shot</b>.", detail: "Entries are quick guesses for common lighting. As Shot is the camera's own estimate and is often right." },
              { html: "Use the picker: click the eyedropper next to the White Balance choice (or press <kbd>W</kbd>), then click on something in the photo that should be a neutral grey or white, such as a cloud, concrete or a white wall.", check: "The picture shifts so that spot looks neutral. If the whole photo looks odd, undo with <kbd>Ctrl</kbd>+<kbd>Z</kbd> and click somewhere else." },
              { html: "Open <code>nikon-d7500.nef</code> and compare its As Shot Temp with the Sony file.", detail: "Different cameras and different scenes give different starting numbers. There is no single correct value." },
              { html: "Open <code>tilted-horizon.jpg</code> (a JPEG). Compare its Temp slider range with the raw files and try to remove any colour cast.", check: "The slider shows a -100 to +100 scale. You can still fix a modest cast, but strong corrections look rougher than on a raw." }
            ] },
            { t: "callout", kind: "tip", html: "There is no 'correct' white balance, only the one that serves the picture. A sunset should stay warm; correcting it to neutral would ruin it. Fix white balance to <i>remove an unwanted cast</i> or to <i>deliberately set a mood</i>." },
            { t: "callout", kind: "adobe", html: "Same as Lightroom's <b>WB</b> row with the <b>Eyedropper</b> (<kbd>W</kbd>), Temp and Tint. In Lightroom, raw files also show Kelvin and JPEGs show a relative scale, exactly like LightCraft." },
            { t: "claude", title: "Let Claude read the colour cast", prompts: [
              { prompt: "Render the active photo and tell me whether it has a colour cast, which direction it is, and what you would do to Temp and Tint to correct it. Do not change anything yet.", why: "Claude will call render_photo and get_develop and answer in text. It is a judgment from looking at the picture, so check it against your own eyes." },
              { prompt: "Find an area in the active photo that should be neutral grey or white and use LightCraft's white balance picker command on that spot. Tell me where you clicked and what Temp and Tint changed to.", why: "Claude will estimate a point from the render and run develop.wbPick (run_command or cmd_develop_wbPick) with normalised x and y coordinates. If the result looks wrong, undo with Ctrl+Z and try your own pick with W." },
              { prompt: "Set the active photo's white balance to 5200 K with tint +5 using the develop controls, then tell me what Temp slider value I should see on screen.", why: "Claude will use set_develop with wb.temp and wb.tint (Kelvin). On a raw you will see 5200 in the Temp slider; on a JPEG the on-screen scale differs, which is the quirk from the note above." }
            ] },
            { t: "exercise", title: "Fix, then break it on purpose", html: "Practise correcting and then creating a mood.", steps: [
              "On <code>tilted-horizon.jpg</code> remove any unwanted colour cast.",
              "On the Sony raw, make a warm 'golden' version by raising Temp, and a cool 'moonlight' version by lowering it.",
              "Use <kbd>Y</kbd> (before/after) to check that the corrected version still looks natural."
            ] },
            { t: "quiz", items: [
              { q: "A photo taken indoors under a bulb looks orange. What should you do to Temp?", choices: ["Slide it left (cooler)", "Slide it right (warmer)", "Leave it, orange is correct", "Change Contrast"], answer: 0, explain: "Moving Temp toward blue cancels the orange cast." },
              { q: "Why can you correct white balance more freely on a raw file?", choices: ["Raw files are smaller", "A raw keeps the sensor's data before white balance is applied", "Raw files are always correct", "JPEGs have no Temp slider"], answer: 1, explain: "A JPEG has already had its white balance baked in. A raw leaves the choice to you." }
            ] },
            { t: "check", html: "You have changed Temp and Tint, used the picker to neutralise a cast, and noticed that raw shows Kelvin while a JPEG shows a relative scale." }
          ]
        },
        {
          id: "m5-l2",
          title: "Vibrance, Saturation and the Color Mixer",
          minutes: 18,
          goals: [
            "By the end you can explain hue, saturation and luminance.",
            "You can choose between Vibrance and Saturation.",
            "You can change a single colour range with the Color Mixer."
          ],
          assets: ["blue-marble", "tilted-horizon"],
          blocks: [
            { t: "p", html: "Every colour in a photo can be described with three numbers:" },
            { t: "p", html: "<ul><li><b>Hue</b>: which colour it is (red, orange, yellow, green, blue and so on).</li><li><b>Saturation</b>: how intense it is, from grey to vivid.</li><li><b>Luminance</b>: how light or dark that colour is.</li></ul>" },
            { t: "h", text: "Vibrance and Saturation" },
            { t: "p", html: "Both are in the <b>Color</b> section. <b>Saturation</b> changes every colour in the picture by the same amount, so pushing it quickly looks artificial and can make skin orange. <b>Vibrance</b> is smarter: it boosts the muted colours more than the colours that are already strong, so it is the gentler, safer choice. A good habit: use Vibrance first, and use Saturation sparingly (often to turn it down)." },
            { t: "steps", items: [
              { html: "Open <code>blue-marble.jpg</code> in Detail view and click <b>Reset</b>." },
              { html: "Drag <b>Vibrance</b> to +60, look carefully, then press <kbd>Ctrl</kbd>+<kbd>Z</kbd>. Drag <b>Saturation</b> to +60 and compare.", check: "Saturation pushes everything, including areas that were already vivid; Vibrance mostly lifts the quieter colours." },
              { html: "Drag Saturation all the way down to -100, then undo.", check: "The photo goes to monochrome, because saturation controls how much colour exists." }
            ] },
            { t: "h", text: "The Color Mixer" },
            { t: "p", html: "The <b>Color Mixer</b> lets you target one colour range at a time. It has eight bands: <b>red, orange, yellow, green, aqua, blue, purple, magenta</b>. For each band you get a <b>Hue</b> slider (shift the colour toward its neighbours), <b>Saturation</b> and <b>Luminance</b>." },
            { t: "steps", items: [
              { html: "In the <b>Color</b> section click the <b>Color Mixer</b> row to open its flyout.", check: "A panel opens with colour bands and Hue, Saturation and Luminance sliders." },
              { html: "Choose <b>Blue</b>. Lower its <b>Luminance</b> and raise its <b>Saturation</b>.", check: "The oceans and blue areas of the photo get deeper and richer, while the land and clouds stay put." },
              { html: "Choose <b>Orange</b> and <b>Yellow</b> and adjust Saturation or Hue to see how the desert and land areas react." },
              { html: "Look for the <b>targeted adjustment</b> control in the mixer, which lets you click or drag on the photo itself to adjust the colour you point at, instead of choosing a band by name." },
              { html: "Open <code>tilted-horizon.jpg</code> and make the blue of the water or sky richer, without touching the other colours." }
            ] },
            { t: "callout", kind: "tip", html: "Classic recipes: <b>deeper sky</b>, lower Blue luminance and raise Blue saturation. <b>Greener foliage</b>, move Green hue slightly toward yellow and raise its saturation. <b>Smoother skin</b>, gently lower Orange saturation. Small moves, then check the before/after (<kbd>Y</kbd>)." },
            { t: "callout", kind: "note", html: "The same Color section also has a <b>Point Color</b> flyout, which lets you pick one exact colour in the photo and change just that. It is a more precise cousin of the Color Mixer, worth exploring once you are comfortable." },
            { t: "callout", kind: "adobe", html: "The Color Mixer is Lightroom's <b>HSL / Color</b> panel (Hue, Saturation, Luminance by colour). Point Color is similar to Lightroom's Point Color tool. Vibrance and Saturation are the same sliders." },
            { t: "claude", title: "Colour changes by description", prompts: [
              { prompt: "On the active photo, make the blues deeper and richer without changing other colours: reduce Blue luminance a little and raise Blue saturation a little, using the Color Mixer controls. Tell me the values you set.", why: "Claude will call list_controls (to find ids like mixer.blue.lum and mixer.blue.sat) and set_develop. The values show up in the Color Mixer flyout. Undo with Ctrl+Z if it looks heavy." },
              { prompt: "Compare Vibrance +40 and Saturation +40 on the active photo: apply each in turn, render both, undo both, and tell me which looks more natural and why.", why: "Claude will use set_develop, render_photo twice and cmd_edit_undo. The photo should end exactly as it started; check the History panel." }
            ] },
            { t: "exercise", title: "One colour at a time", html: "On <code>blue-marble.jpg</code> or a colourful demo photo, change three colours and nothing else.", steps: [
              "Pick three bands in the Color Mixer and give each a different adjustment (Hue, Saturation or Luminance).",
              "Use <kbd>Y</kbd> to compare with the original and write one sentence on what each change did.",
              "Reset only the Color Mixer, not the rest of the photo, by undoing those steps in History."
            ] },
            { t: "quiz", items: [
              { q: "You want a gentle colour boost on a portrait. Which first?", choices: ["Saturation +60", "Vibrance +20", "Hue +60", "Saturation -100"], answer: 1, explain: "Vibrance lifts muted colours more than strong ones, so it looks more natural." },
              { q: "In the Color Mixer, what does Luminance do for the Blue band?", choices: ["Changes how bright the blues are", "Changes how many blues there are", "Switches blue to red", "Nothing"], answer: 0, explain: "Luminance sets how light or dark that colour range appears, which is how you darken a blue sky." }
            ] },
            { t: "check", html: "You can say what hue, saturation and luminance are, and you have changed a single colour range in the Color Mixer." }
          ]
        },
        {
          id: "m5-l3",
          title: "Color Grading and black and white",
          minutes: 20,
          goals: [
            "By the end you can tint shadows, midtones and highlights with Color Grading.",
            "You can convert a photo to black and white and shape it with the B&W controls.",
            "You can explain why black and white depends on contrast and tone more than on colour."
          ],
          assets: ["migrant-mother", "tetons", "blue-marble"],
          blocks: [
            { t: "h", text: "Color Grading" },
            { t: "p", html: "<b>Color Grading</b> adds a colour tint separately to the dark, middle and bright parts of a picture. Film makers use it constantly: the well-known 'teal and orange' look is simply cool teal in the shadows and warm orange in the highlights. LightCraft's Color Grading flyout (in the <b>Color</b> section) has three colour wheels, <b>Shadows</b>, <b>Midtones</b> and <b>Highlights</b>, each with a <b>Hue</b> (the direction), a <b>Saturation</b> (how strong) and a <b>Luminance</b> slider, plus <b>Blending</b> (how smoothly the three zones overlap) and <b>Balance</b> (which end of the range gets more of the effect)." },
            { t: "steps", items: [
              { html: "Open <code>blue-marble.jpg</code> or a demo sunset photo, click <b>Reset</b>, and open the <b>Color Grading</b> row in the <b>Color</b> section.", check: "You see three colour wheels." },
              { html: "On the <b>Shadows</b> wheel, drag the dot toward a teal/blue colour and keep its saturation low (about 15 to 30).", check: "The darker parts of the picture take on a cool tone." },
              { html: "On the <b>Highlights</b> wheel, drag toward orange/yellow, also at low saturation.", check: "The bright parts get a warm glow, and the contrast between warm and cool gives a cinematic look." },
              { html: "Move <b>Blending</b> and <b>Balance</b> to see how the tint spreads. Then press <kbd>Y</kbd> to compare with the original." }
            ] },
            { t: "image", src: "../lightcraft/docs/images/grading-migrant-mother.jpg", alt: "LightCraft showing the Color Grading panel with a portrait photograph", caption: "Color Grading in LightCraft. Restraint is the secret: most tints should be barely noticeable on their own." },
            { t: "callout", kind: "warn", html: "Color Grading goes wrong when saturation is too high: the picture looks like a coloured filter has been laid over it. Keep saturation low and build the look gradually." },
            { t: "h", text: "Black and white" },
            { t: "p", html: "Removing colour changes what a photo is about. Without colour, your eye reads <b>shape, texture, light and contrast</b>. Good B&amp;W pictures need strong tonal range, so the lessons from module 4 matter more than ever." },
            { t: "steps", items: [
              { html: "Open <code>migrant-mother.jpg</code> (already monochrome) and then a colour photo such as <code>blue-marble.jpg</code>. On the colour photo click the <b>B&amp;W</b> button in the Edit header, or press <kbd>V</kbd>.", check: "The photo becomes black and white. Click it again (or undo) to return to colour." },
              { html: "In the Color section, look at the mixer: for a B&amp;W photo its colour bands control how <i>light or dark each original colour appears in grey</i>. Lower Blue to darken a sky; raise Yellow or Orange to lighten them.", detail: "This is the same as putting a coloured filter on a black and white film camera: a red filter darkens blue skies dramatically." },
              { html: "Open the <b>Profile</b> choice and look at the <b>B&amp;W</b> group (for example Mono Rich, Mono Red Filter, Mono Soft and Sepia Tone). Try one.", detail: "In the <b>Presets</b> panel (<kbd>Shift</kbd>+<kbd>P</kbd>) there are also B&amp;W looks such as High Contrast B&amp;W, Soft B&amp;W and Selenium Tone." },
              { html: "Add contrast: raise Contrast and use the Whites and Blacks sliders so the histogram stretches edge to edge. Black and white loves a full tonal range." },
              { html: "Press <kbd>Y</kbd> or look at the split before/after to see how much colour information you gave up." }
            ] },
            { t: "image", src: "../lightcraft/docs/images/bw-split.jpg", alt: "LightCraft screenshot of a black and white conversion shown in a split view", caption: "Black and white is not just the colour drained away; tone and contrast do all the work." },
            { t: "callout", kind: "adobe", html: "In Lightroom this is the <b>Black &amp; White</b> treatment and the <b>B&amp;W Mix</b> panel. LightCraft's Color Grading wheels have three zones (Shadows, Midtones, Highlights); Lightroom's version also has a Global wheel, which LightCraft does not show in the panel (it exists only for automation)." },
            { t: "claude", title: "Looks by request", prompts: [
              { prompt: "Give the active photo a restrained teal-and-orange look using Color Grading: cool teal in the shadows and warm orange in the highlights, both at low saturation. Tell me the hue, saturation and blending values you chose, then render it.", why: "Claude will call set_develop with the grading controls (for example grading.shadows.hue and grading.highlights.sat) and then render_photo. Open the Color Grading flyout to see the wheels it set; undo if it is too strong." },
              { prompt: "Convert the active photo to black and white with LightCraft's treatment command, render it, and tell me which tones look weak and what you would adjust.", why: "Claude will run develop.treatment (cmd_develop_treatment with bw set) and render_photo. You can compare with the V key result. Ask it to apply its suggestions only if you agree." }
            ] },
            { t: "exercise", title: "Two moods from one photo", html: "Make two very different versions of one colour photo.", steps: [
              "Version A: a warm, cinematic colour grade.",
              "Version B: a high-contrast black and white where the sky is darkened using the colour mixer.",
              "Use the History panel or <kbd>Ctrl</kbd>+<kbd>Z</kbd> to hop between them and decide which tells the story better."
            ] },
            { t: "quiz", items: [
              { q: "What is 'teal and orange' in Color Grading?", choices: ["A built-in export preset", "Cool tint in shadows and warm tint in highlights", "A kind of raw file", "A lens correction"], answer: 1, explain: "It is a colour contrast look: cool shadows, warm highlights." },
              { q: "In a black and white photo, how do you make a blue sky look darker?", choices: ["Lower the Blue band in the mixer", "Raise Exposure", "Raise Saturation", "Crop the photo"], answer: 0, explain: "In B&W the mixer sets how bright each original colour appears in grey. Lowering Blue darkens the sky." }
            ] },
            { t: "check", html: "You have tinted shadows and highlights with Color Grading and converted a photo to black and white with a tone you chose." }
          ]
        }
      ]
    },
    {
      id: "m6",
      title: "Crop, effects and detail",
      summary: "Compose with crop and straighten, add punch and atmosphere with the Effects sliders, and finish with sharpening, noise reduction and lens corrections.",
      lessons: [
        {
          id: "m6-l1",
          title: "Crop, straighten and composition",
          minutes: 15,
          goals: [
            "By the end you can crop a photo, change its aspect ratio and use the composition overlays.",
            "You can straighten a tilted horizon by hand and automatically.",
            "You know a crop is non-destructive and can be changed later."
          ],
          assets: ["tilted-horizon", "tetons"],
          blocks: [
            { t: "p", html: "Cropping does three jobs: it <b>straightens</b> a tilted picture, it <b>improves composition</b> by cutting away distractions and placing your subject well, and it sets the <b>shape</b> (aspect ratio) the picture needs for its final use: wide for a screen, tall for a phone, square for a profile picture. Like every edit in LightCraft, a crop does not touch the original: you can reopen the crop tool tomorrow and bring all the missing edges back." },
            { t: "p", html: "A common composition guide is the <b>rule of thirds</b>: imagine the picture split into a 3 by 3 grid. Placing the subject or the horizon on one of those lines, instead of dead centre, usually looks more natural. Overlays in the crop tool draw the grid for you." },
            { t: "steps", items: [
              { html: "Open <code>tilted-horizon.jpg</code> in Detail view and press <kbd>C</kbd> (or click the <b>Crop &amp; Rotate</b> icon in the strip).", check: "The photo shows crop handles and the panel shows <b>Aspect Ratio</b>, a Lock, rotate and flip buttons, a <b>Straighten</b> slider and an <b>Overlay</b> choice." },
              { html: "Open the <b>Aspect Ratio</b> choice and try a few shapes (for example original, square, and widescreen).", detail: "Click the lock next to it to keep the shape fixed while you drag the corners. Press <kbd>X</kbd> to swap a landscape shape to portrait and back." },
              { html: "Set <b>Overlay</b> to <b>Thirds</b> (or press <kbd>Shift</kbd>+<kbd>O</kbd> to cycle through Thirds, Grid, Golden, Diagonal, Triangle, Spiral and None). Drag the crop box so the horizon sits on the upper or lower third line.", check: "The grid appears inside the crop and the picture updates as you drag." },
              { html: "Straighten the horizon. Try the <b>Straighten</b> slider (range -45 to +45 degrees), or choose the <b>Straighten Tool</b> and drag a line along the horizon. The <b>Auto</b> button tries to find the level for you.", check: "The horizon is perfectly level against the grid lines. LightCraft crops in a little to hide the empty corners." },
              { html: "Press <kbd>Enter</kbd> (Done) to accept the crop, then press <kbd>C</kbd> again to reopen it.", check: "The crop box is exactly where you left it, with the cropped-off areas visible and ready to adjust." },
              { html: "To start over, use the <b>Reset</b> button in the Crop panel (or <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>R</kbd>)." }
            ] },
            { t: "image", src: "../lightcraft/docs/images/crop-tetons.jpg", alt: "LightCraft crop tool open on a landscape photo with an overlay grid", caption: "The crop tool with a composition overlay. Cropping removes pixels from the final picture, so crop as tightly as you need and no tighter." },
            { t: "callout", kind: "note", html: "The Crop panel also has a <b>Geometry</b> block with <b>Upright</b> (Off, Auto, Guided, Level, Vertical, Full) for fixing buildings that appear to lean inwards when you tilt the camera up. Try <b>Auto</b> on a photo of a building when you have one." },
            { t: "callout", kind: "warn", html: "Every crop throws away pixels from the final export. A very tight crop of a small photo may look soft or blocky when enlarged. Also note: in LightCraft <kbd>R</kbd> is the radial gradient (masking), not the crop key as in some other programs." },
            { t: "callout", kind: "adobe", html: "This is Lightroom's <b>Crop &amp; Straighten</b> tool (the <b>Angle</b> slider is LightCraft's <b>Straighten</b> slider, the Straighten tool is Lightroom's <b>Angle</b> ruler, and <b>Upright</b> is the same name). Lightroom opens it with <kbd>R</kbd>; LightCraft uses <kbd>C</kbd>." },
            { t: "claude", title: "Crop with words", prompts: [
              { prompt: "Look at the active photo. Tell me whether the horizon is level, and if not, how many degrees it is off. Then straighten it using LightCraft's straighten command and render the result.", why: "Claude will use render_photo to look and then cmd_crop_straighten or the crop helper tool (with an angle), or ask LightCraft to auto-straighten (crop.autoStraighten). Open the crop tool (C) afterwards to see the angle it set." },
              { prompt: "Crop the active photo to a 4:5 portrait shape with the main subject on a third line, using the crop tool. Render it and explain your choice.", why: "Claude will call the crop tool with a normalised rect [x0, y0, x1, y1] (values from 0 to 1 across the picture) and render_photo. Press C to see the crop box and move it yourself if you want a different framing." }
            ] },
            { t: "exercise", title: "Three crops of one photo", html: "Make three different crops from one photo and judge them.", steps: [
              "A wide crop (16:9 or similar) with the horizon on the lower third.",
              "A square crop of just the most interesting part.",
              "A vertical 4:5 crop for a phone.",
              "Compare them with the original using the History panel or <kbd>Y</kbd>. Which one tells the story best?"
            ] },
            { t: "quiz", items: [
              { q: "You crop a photo and export it. Can you get the cropped-off area back tomorrow?", choices: ["No, the pixels are gone forever", "Yes, in LightCraft the crop is only an instruction and you can reopen it", "Only if you used Undo", "Only on JPEGs"], answer: 1, explain: "The original is untouched. Reopen the crop tool and expand the box. Your exported file, of course, stays cropped." },
              { q: "Where does the rule of thirds suggest placing a horizon?", choices: ["Dead centre", "On the upper or lower third line", "At the very top edge", "It does not matter"], answer: 1, explain: "Off-centre placement on a third line usually feels more balanced and natural." }
            ] },
            { t: "check", html: "You have cropped to a chosen aspect ratio, used an overlay, straightened a horizon, and reopened the crop to confirm it is still adjustable." }
          ]
        },
        {
          id: "m6-l2",
          title: "Texture, Clarity, Dehaze, Vignette and Grain",
          minutes: 15,
          goals: [
            "By the end you can explain what Texture, Clarity and Dehaze do and how they differ.",
            "You can add a subtle vignette and film grain.",
            "You know how to avoid the over-processed look."
          ],
          assets: ["raw-sony", "tetons"],
          blocks: [
            { t: "p", html: "The <b>Effects</b> section holds sliders that change a picture's character rather than its basic exposure and colour. Press <kbd>Ctrl</kbd>+<kbd>3</kbd> to jump straight to it." },
            { t: "p", html: "<ul><li><b>Texture</b>: emphasises fine detail such as bark, fabric, rock and skin pores. Positive makes detail crisper; negative smooths it (useful on skin).</li><li><b>Clarity</b>: increases or reduces contrast in the middle tones, which gives a punchier, grittier look when positive and a soft, dreamy one when negative.</li><li><b>Dehaze</b>: removes atmospheric haze and fog (adds contrast and colour in hazy areas) when positive; adds a hazy glow when negative.</li><li><b>Vignette</b>: darkens (negative) or lightens (positive) the edges of the photo to pull the eye to the centre. It has Amount, Midpoint, Roundness, Feather and Highlights controls and a style (Highlight, Color or Paint).</li><li><b>Grain</b>: adds film-like speckle with Amount, Size and Roughness controls.</li></ul>" },
            { t: "steps", items: [
              { html: "Open <code>sony-a7iv.arw</code> (or <code>tetons.jpg</code>), click <b>Reset</b>, apply a basic tonal edit from module 4, then expand <b>Effects</b>." },
              { html: "Drag <b>Texture</b> to +30, look, then to -30, then back to 0.", check: "Fine details become crisper at +30 and smoother at -30." },
              { html: "Drag <b>Clarity</b> to +30 then -30 and compare, then reset it.", check: "Positive Clarity adds punch to the mid-tones, and rock and cloud edges look bolder." },
              { html: "Drag <b>Dehaze</b> to +30, then to -30. Reset it.", check: "Positive Dehaze deepens distant, hazy layers; negative brings a soft glow." },
              { html: "In the <b>Vignette</b> block set <b>Vignette</b> (amount) to about -20 and adjust <b>Midpoint</b> and <b>Feather</b> so the darkening is felt rather than seen.", check: "The corners are slightly darker and the eye is guided inward, with no visible dark ring." },
              { html: "In the <b>Grain</b> block raise <b>Amount</b> to around 20 and try <b>Size</b> and <b>Roughness</b>. Zoom to 100% (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>0</kbd>) to see it properly." },
              { html: "Check the whole picture with <kbd>Y</kbd> (before/after) and with <kbd>\\</kbd> held down.", check: "The finished look is clearly better but you cannot easily say how it was made." }
            ] },
            { t: "callout", kind: "warn", html: "These sliders are very easy to overuse. Heavy Clarity and Texture make a grungy 'crunchy' picture with bright halos around edges; heavy Dehaze creates dark, unnatural skies and heavy colour; a strong vignette becomes a visible dark circle. If you can immediately see the effect, you have probably gone too far. Back off by a third." },
            { t: "callout", kind: "adobe", html: "Texture, Clarity and Dehaze are Lightroom's sliders of the same names. LightCraft's Vignette and Grain are in the <b>Effects</b> section as in Lightroom Classic's <b>Effects</b> panel. Lightroom's vignette is called Post-Crop Vignetting, with styles Highlight Priority, Color Priority and Paint Overlay; LightCraft's style choices are Highlight, Color and Paint." },
            { t: "claude", title: "A little punch, no crunch", prompts: [
              { prompt: "On the active photo, add a subtle punchy finish: Texture about +10, Clarity about +12, Dehaze about +8 and a gentle vignette of about -15. Render it and tell me honestly if any of it looks overdone.", why: "Claude will use set_develop with ids like effects.texture, effects.clarity, effects.dehaze and vignette.amount, then render_photo. You can see the sliders move. If it looks crunchy to you, reduce them or undo." },
              { prompt: "Give the active photo a film look: a little grain (amount about 20, size medium, some roughness), a faded blacks feel and slightly muted colour. Tell me every control you set.", why: "Claude will pick controls such as grain.amount, grain.size, grain.roughness, light.blacks and color.saturation, and report them. Compare with the film-style profiles in the Profile choice." }
            ] },
            { t: "exercise", title: "Overcook it, then dial it back", html: "A reliable way to learn restraint.", steps: [
              "Push Texture, Clarity and Dehaze to +80 each and look closely at the edges.",
              "Now reduce each slider until the picture looks good and you cannot see the halos.",
              "Note the three numbers you ended on. They are your personal 'safe' range."
            ] },
            { t: "quiz", items: [
              { q: "Which slider is best for cutting through a misty, hazy landscape?", choices: ["Vignette", "Grain", "Dehaze", "Texture"], answer: 2, explain: "Positive Dehaze removes atmospheric haze and deepens contrast and colour." },
              { q: "What is a good sign that you have used Clarity too strongly?", choices: ["The photo looks brighter", "Bright halos appear around edges and it looks crunchy", "The file gets smaller", "Nothing changes"], answer: 1, explain: "Over-strong local contrast shows up as halos and a gritty, over-processed look." }
            ] },
            { t: "check", html: "You have used Texture, Clarity, Dehaze, Vignette and Grain, and your final edit looks natural rather than crunchy." }
          ]
        },
        {
          id: "m6-l3",
          title: "Sharpening, noise reduction and lens corrections",
          minutes: 18,
          goals: [
            "By the end you can sharpen a photo with Amount, Radius, Detail and Masking.",
            "You can reduce noise without turning the photo into plastic.",
            "You can turn on lens corrections and remove coloured fringes."
          ],
          assets: ["raw-ricoh", "raw-nikon", "raw-sony"],
          blocks: [
            { t: "h", text: "Sharpening" },
            { t: "p", html: "Digital photos are slightly soft because of the way sensors and lenses work. <b>Sharpening</b> increases contrast along edges so details look crisper. It does not rescue a photo that is out of focus or blurred by movement, it only makes edges stand out. In the <b>Detail</b> section (<kbd>Ctrl</kbd>+<kbd>4</kbd>) you will find <b>Amount</b> (how strong), <b>Radius</b> (how wide the edge halo is), <b>Detail</b> (how much fine texture is emphasised) and <b>Masking</b> (restricts sharpening to real edges and protects smooth areas such as sky and skin)." },
            { t: "steps", items: [
              { html: "Open <code>ricoh-gr3.dng</code>, click <b>Reset</b>, and zoom to 100% with <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>0</kbd>. Pick an area with fine detail.", detail: "Always judge sharpening at 100%. At Fit size the picture is shrunk and you cannot see what sharpening does." },
              { html: "In the <b>Detail</b> section raise <b>Sharpening Amount</b> to about 50 and watch the edges.", check: "Edges look crisper. Push it to 150 and notice the harsh halos and grain." },
              { html: "Return to about 40 to 60. Increase <b>Masking</b> until flat areas such as sky no longer pick up sharpening texture." },
              { html: "Try <b>Radius</b> and <b>Detail</b> in small moves and note which gives a natural result." }
            ] },
            { t: "h", text: "Noise reduction" },
            { t: "p", html: "<b>Noise</b> is the grainy speckle you see in dark areas and in pictures taken at a high ISO (a very sensitive sensor setting for dim light), or when you lift Shadows a lot. There are two kinds: <b>luminance noise</b> (light and dark grain) and <b>colour noise</b> (random red and blue speckles). The <b>Noise Reduction</b> sliders smooth luminance noise and the <b>Color Noise Reduction</b> sliders remove coloured speckle. Both cost some fine detail, so use only as much as you need." },
            { t: "steps", items: [
              { html: "Open <code>nikon-d7500.nef</code>, <b>Reset</b>, and lift <b>Shadows</b> to +80 in the Light section. Zoom to 100% on a dark area.", check: "You see grainy noise in the lifted shadows." },
              { html: "In <b>Detail</b>, raise <b>Noise Reduction</b> a little at a time, and raise <b>Color Noise Reduction</b> if you see coloured speckles.", check: "The grain smooths out, and details that are too fine start to vanish if you push it too far." },
              { html: "Find the balance where noise is calm but textures survive, then compare with <kbd>\\</kbd>." }
            ] },
            { t: "callout", kind: "note", html: "The Detail section also offers <b>AI Denoise</b>, which needs an optional model that is not part of the basic install and works on Bayer raw files only. Ordinary Noise Reduction is plenty for this course." },
            { t: "h", text: "Lens corrections" },
            { t: "p", html: "Every lens bends and darkens its picture a little: straight lines curve (<b>distortion</b>), the corners are dimmer (<b>vignetting</b>), and high-contrast edges can show blue or purple outlines (<b>chromatic aberration</b>, also called fringing). The <b>Optics</b> section (<kbd>Ctrl</kbd>+<kbd>5</kbd>) fixes these." },
            { t: "steps", items: [
              { html: "With the Ricoh DNG open, go to <b>Optics</b> and tick <b>Enable Lens Corrections</b>.", detail: "DNG files carry correction data inside them, so LightCraft can use it. It does not have a database of lens profiles, so on other raw formats you correct by hand with the manual Distortion and Vignetting sliders.", check: "The corners of the picture change slightly (straighter edges, brighter corners)." },
              { html: "Tick <b>Remove Chromatic Aberration</b> and look at a high-contrast edge such as a branch against bright sky at 100%.", check: "Any coloured outline along the edge is gone or reduced. If a stubborn fringe remains, try the <b>Defringe</b> controls." }
            ] },
            { t: "callout", kind: "warn", html: "Do the work in order: first fix exposure and colour, then lens corrections, then sharpen, then reduce noise as needed. Sharpening makes noise more visible, and heavy noise reduction makes sharpening look plasticky. Aim for balance." },
            { t: "callout", kind: "adobe", html: "These are the same ideas as Lightroom's <b>Detail</b> panel (Sharpening Amount, Radius, Detail, Masking; Noise Reduction Luminance and Color) and the <b>Lens Corrections</b> panel (Enable Profile Corrections, Remove Chromatic Aberration, manual Distortion and Vignetting)." },
            { t: "claude", title: "Detail work, the quick way", prompts: [
              { prompt: "For the active photo, set a landscape-style sharpening (amount about 50, radius 1, masking about 40) and moderate noise reduction, and tell me every value. Then render the photo at the largest size you can and tell me whether it looks over-sharpened.", why: "Claude will call set_develop with ids such as detail.sharpenAmount, detail.sharpenRadius, detail.sharpenMasking and detail.nrLuminance, then render_photo (up to 4096 px). Zoom to 100% in the app and judge for yourself, because a render shown to Claude is shrunk." },
              { prompt: "Turn on lens corrections and chromatic aberration removal for the active photo, and tell me what controls you changed. If the photo is not a DNG, tell me what the limits are.", why: "Claude will use list_controls (optics section) and set_develop, or run_command. Remember lens corrections rely on correction data inside DNG or RW2 files." }
            ] },
            { t: "exercise", title: "Sharp but not harsh", html: "Practise judging at 100%.", steps: [
              "On the Ricoh file, find the setting where edges look crisp and you cannot see halos.",
              "On the Nikon file, find the point where noise is calm and detail still survives.",
              "Write down your two sets of numbers and compare them with what Claude suggested."
            ] },
            { t: "quiz", items: [
              { q: "At what zoom should you judge sharpening and noise?", choices: ["Fit", "100%", "As small as possible", "It does not matter"], answer: 1, explain: "At 100% each screen pixel is one photo pixel, so you see the real effect." },
              { q: "What does the Masking slider under Sharpening do?", choices: ["Hides the photo", "Limits sharpening to real edges and protects smooth areas", "Adds a vignette", "Creates a local mask"], answer: 1, explain: "Masking keeps sharpening off flat areas like sky, where it would only exaggerate noise." }
            ] },
            { t: "check", html: "You have sharpened and denoised a raw photo at 100% without making it look crunchy, and you have tried lens corrections and chromatic-aberration removal." }
          ]
        }
      ]
    },
    {
      id: "m7",
      title: "Local edits and retouching",
      summary: "Edit just part of a photo with gradient, brush and range masks, then remove spots and small distractions with the Remove tool.",
      lessons: [
        {
          id: "m7-l1",
          title: "Masks: linear and radial gradients",
          minutes: 18,
          goals: [
            "By the end you can explain the difference between a global edit and a local edit.",
            "You can add a linear gradient and a radial gradient mask and adjust them.",
            "You can show the mask overlay to see exactly where an edit applies."
          ],
          assets: ["raw-sony"],
          blocks: [
            { t: "p", html: "Everything so far has been <b>global</b>: a slider changes the whole picture. A <b>local</b> edit changes only part of it. You do that with a <b>mask</b>, which works like a stencil: you describe an area (a shape, a brushed region, the sky), and the adjustments you then make apply <i>only inside</i> that area. A typical use: darken a bright sky without darkening the land, or brighten a face without brightening the background." },
            { t: "p", html: "Open the Masking panel with <kbd>M</kbd> or the <b>Masking</b> icon in the right-hand strip. At the top is <b>Create New Mask</b>, a set of tiles: <b>Subject, Sky, Background, Brush, Linear, Radial, Luminance, Color</b> (some builds also show <b>Object</b> and <b>Describe</b> first, which need an optional downloaded model). Below is the list of masks on the photo, and for the selected mask the buttons <b>Add</b>, <b>Subtract</b> and <b>Invert</b> and a trash can, followed by a set of local sliders (Temp, Tint, Exposure, Contrast, Highlights, Shadows, Whites, Blacks, Texture, Clarity, Dehaze, Hue, Saturation, Sharpness, Noise) and an <b>Amount</b> slider for the overall strength of the mask." },
            { t: "image", src: "../lightcraft/docs/images/masking.jpg", alt: "LightCraft Masking panel with a Sky mask and a radial gradient mask named Sun glow shown with a red overlay over the sun in a lake scene", caption: "A radial gradient named 'Sun glow' placed on the sun. The red overlay shows where the mask applies; the panel below it holds Add, Subtract, Invert and the local sliders (Temp +40, Exposure +0.50 and Saturation +15 here)." },
            { t: "h", text: "Linear gradient: darken a sky" },
            { t: "steps", items: [
              { html: "Open <code>sony-a7iv.arw</code> (or a demo landscape such as <b>Lake at first light</b>) in Detail view and press <kbd>M</kbd>." },
              { html: "Click the <b>Linear</b> tile (or press <kbd>L</kbd>), then in the photo drag from the top edge down to about the horizon.", check: "A line with handles appears, and the mask appears in the Masks list. The area it covers fades smoothly from full strength at the top to nothing where you stopped." },
              { html: "Press <kbd>O</kbd> to show or hide the mask overlay.", check: "A coloured tint shows exactly where the mask applies." },
              { html: "In the mask's sliders, lower <b>Exposure</b> to about -0.7 and <b>Highlights</b> to about -30.", check: "Only the sky darkens. The land stays as it was." },
              { html: "Drag the handles on the photo to move or rotate the gradient so it follows the horizon, and widen or narrow the transition." }
            ] },
            { t: "h", text: "Radial gradient: light a subject or glow" },
            { t: "steps", items: [
              { html: "Click the <b>Radial</b> tile (or press <kbd>R</kbd>) and drag out an oval on a bright spot such as the sun or around your subject.", check: "An ellipse with handles appears, and a second mask appears in the list." },
              { html: "Raise <b>Exposure</b> about +0.5 and <b>Temp</b> to warm it (for example +40), then add a little <b>Saturation</b> (around +15).", check: "The inside of the oval glows warmly and the outside is unchanged." },
              { html: "Click <b>Invert</b>.", check: "The adjustment now applies to <i>everything outside</i> the oval. With negative Exposure that makes a vignette that you can place anywhere, not just in the centre." },
              { html: "Click Invert again to put it back. To remove a mask completely select it in the list and click the trash can." }
            ] },
            { t: "callout", kind: "tip", html: "Give each mask a job and keep it small: a sky mask darkens the sky, a radial mask lifts the subject. Several small, subtle masks look more natural than one dramatic one. You can have many masks on one photo and switch between them by clicking in the list." },
            { t: "callout", kind: "adobe", html: "Linear = Lightroom's <b>Linear Gradient</b> (formerly Graduated Filter). Radial = <b>Radial Gradient</b> (formerly Radial Filter). The shortcut letters differ from Lightroom's: in LightCraft <kbd>M</kbd> opens the Masking panel, and <kbd>L</kbd> picks Linear, <kbd>R</kbd> Radial and <kbd>B</kbd> Brush." },
            { t: "claude", title: "Masks by description", prompts: [
              { prompt: "On the active photo, add a linear gradient mask over the top third of the picture (strongest at the top, fading out around the horizon) and darken it by about 0.7 stops with highlights at -30. Look up the mask command's parameters with list_commands first. Then render the result.", why: "Claude will inspect list_commands for mask.add, call mask.add with kind linear and its start and end points (normalised 0 to 1), then mask.adjust for the exposure and highlights values and render_photo. Open the Masking panel and press O to see what it created, and drag the handles if the position is wrong." },
              { prompt: "Add a radial gradient mask centred on the brightest light source in the active photo, large enough to look like a soft glow, and warm it with a small exposure and temperature boost. Tell me where you placed it and what values you set.", why: "Claude will render the photo to find the light, then call mask.add with kind radial (center, rx, ry) and mask.adjust. It is an estimate, so check the position with the overlay (O) and nudge the handles yourself." }
            ] },
            { t: "exercise", title: "Reproduce the Sun glow", html: "Recreate the effect in the screenshot above on a demo sunset or lake scene.", steps: [
              "Add a radial gradient on the sun, Temp about +40, Exposure about +0.5, Saturation about +15.",
              "Add a linear gradient across the sky that lowers Exposure a little.",
              "Toggle the overlay with <kbd>O</kbd> and compare before and after with <kbd>Y</kbd>."
            ] },
            { t: "quiz", items: [
              { q: "What does Invert do to a radial mask?", choices: ["Flips the photo", "Applies the adjustment outside the oval instead of inside", "Deletes the mask", "Turns the photo black and white"], answer: 1, explain: "Invert swaps inside and outside of the mask." },
              { q: "How do you see exactly where a mask applies?", choices: ["Press O to show the mask overlay", "Export the photo", "Press Reset", "Open Info"], answer: 0, explain: "The mask overlay tints the affected area." }
            ] },
            { t: "check", html: "You have created a linear and a radial gradient, adjusted local sliders, used Invert, and seen the overlay with <kbd>O</kbd>." }
          ]
        },
        {
          id: "m7-l2",
          title: "Brush, Sky, Subject and range masks",
          minutes: 18,
          goals: [
            "By the end you can paint a mask with the Brush and refine it with Add and Subtract.",
            "You can use Sky, Subject and Background masks and know how reliable they are.",
            "You can build a mask from brightness (Luminance) or colour, and combine masks."
          ],
          assets: ["raw-sony"],
          blocks: [
            { t: "h", text: "The Brush" },
            { t: "p", html: "The <b>Brush</b> mask lets you paint the area you want to change. It is the most flexible mask and the best choice for small, specific areas such as a face, a flower, or a patch of dark foreground." },
            { t: "steps", items: [
              { html: "In Detail view open the Masking panel (<kbd>M</kbd>) and click <b>Brush</b> (or press <kbd>B</kbd>). Use a demo photo with a clear subject, such as the flower <b>Cosmos bloom</b>." },
              { html: "Change the brush size with <kbd>[</kbd> and <kbd>]</kbd>, and the softness (feather) with <kbd>Shift</kbd>+<kbd>[</kbd> and <kbd>Shift</kbd>+<kbd>]</kbd>.", detail: "A soft edge hides the mask's boundary. Hard edges look like cut-outs." },
              { html: "Paint over the flower. Press <kbd>O</kbd> to show the overlay.", check: "A tint covers what you painted." },
              { html: "Raise <b>Exposure</b> a little and add some <b>Texture</b> or <b>Clarity</b> to lift the flower from its surroundings.", check: "Only the painted area changes." },
              { html: "If you painted too far, click <b>Subtract</b> and paint (or choose a tool) over the area to remove. Click <b>Add</b> to add more.", detail: "Add, Subtract and Invert combine shapes: you can add a brush stroke to a gradient, subtract a brush from a sky mask, and so on. There is also an <b>Intersect</b> choice that keeps only the overlap of two masks." }
            ] },
            { t: "h", text: "Automatic masks: Sky, Subject, Background" },
            { t: "p", html: "The <b>Sky</b>, <b>Subject</b> and <b>Background</b> tiles try to find those areas for you with one click. In LightCraft these use classical image analysis (colours, edges and position), not a trained 'AI' model, so they work well on clear subjects and skies but can be rough on busy pictures. Always check the result with the overlay (<kbd>O</kbd>) and tidy the edges with Add or Subtract." },
            { t: "steps", items: [
              { html: "On a landscape with a clear sky, click <b>Sky</b>.", check: "A sky mask appears and the overlay covers the sky." },
              { html: "Lower <b>Exposure</b> slightly, raise <b>Dehaze</b>, and cool the <b>Temp</b>.", check: "The sky looks deeper and bluer without changing the land." },
              { html: "Look at the boundary at the horizon. If the mask spills over a mountain top, choose <b>Subtract</b> and paint it out.", detail: "Always check where an automatic mask meets the edge; that is where a bad edit gives itself away." }
            ] },
            { t: "h", text: "Luminance and Color masks" },
            { t: "p", html: "Range masks select by <i>what the pixels are</i> instead of <i>where they are</i>. A <b>Luminance</b> mask selects by brightness (for example, only the brightest tones), a <b>Color</b> mask selects by colour (for example, only the blues). They are brilliant for edits like 'darken just the bright clouds' or 'make only the greens richer'." },
            { t: "steps", items: [
              { html: "Click <b>Luminance</b>. Adjust its range controls so only the brightest parts of the photo are selected (use the overlay <kbd>O</kbd> to check).", check: "The overlay covers only bright areas such as clouds or highlights." },
              { html: "Lower <b>Highlights</b> or <b>Exposure</b> within that mask.", check: "The brightest areas calm down while everything else stays put." },
              { html: "Click <b>Color</b>, then click on the photo to pick a colour (for example a green leaf) and change <b>Saturation</b> for just that colour range." }
            ] },
            { t: "callout", kind: "warn", html: "<b>Object</b> and <b>Describe</b> masks (if you see those tiles) need an optional multi-gigabyte model download that is not set up on most machines, and are not covered in this course. Use Brush, Sky, Subject, Background, Luminance and Color instead." },
            { t: "callout", kind: "adobe", html: "These are Lightroom's <b>Brush</b>, <b>Select Sky</b>, <b>Select Subject</b>, <b>Select Background</b>, <b>Luminance Range</b> and <b>Color Range</b> masks, with Add, Subtract and Intersect as in Lightroom. Lightroom's Select Subject and Sky use trained AI; LightCraft's are simpler, so expect to do more clean-up. There is no Depth Range mask." },
            { t: "claude", title: "Masks and clean-up with Claude", prompts: [
              { prompt: "On the active photo add a Sky mask, darken it slightly, add a little dehaze, then render the result and tell me where the mask looks wrong or spills onto the land.", why: "Claude will call mask.add with kind sky (cmd_mask_add), mask.adjust for the values, and render_photo. It reports on the mask's quality from the render. You can then press O and fix any spillage with Subtract." },
              { prompt: "Add a Luminance range mask that selects only the brightest parts of the active photo and reduce exposure there by a third of a stop. Tell me what range you used.", why: "Claude will use mask.add with kind luminanceRange (lo and hi values) and mask.adjust. The result should be similar to your manual version; compare and note any difference in how smoothly it blends." }
            ] },
            { t: "exercise", title: "A 3-mask edit", html: "On one landscape photo build three masks, each with its own purpose.", steps: [
              "A Sky mask that deepens the sky.",
              "A Brush or Radial mask that brightens the main subject.",
              "A Luminance mask that calms the brightest highlights.",
              "Turn on the overlay (<kbd>O</kbd>) for each in turn and take a before/after with <kbd>Y</kbd>."
            ] },
            { t: "quiz", items: [
              { q: "The Sky mask has spilled over the top of a mountain. What do you do?", choices: ["Delete the photo", "Use Subtract and paint the spill away", "Re-import", "Raise Exposure"], answer: 1, explain: "Subtract removes an area from the mask. Check the overlay and refine the edge." },
              { q: "Which mask would you use to change only the bright clouds, wherever they are in the picture?", choices: ["Luminance", "Linear", "Radial", "Background"], answer: 0, explain: "A Luminance mask selects by brightness rather than by position." }
            ] },
            { t: "check", html: "You have painted a mask with the Brush, refined it with Subtract, used a Sky mask, and made a range mask from brightness or colour." }
          ]
        },
        {
          id: "m7-l3",
          title: "Remove spots and distractions (heal and clone)",
          minutes: 15,
          goals: [
            "By the end you can use the Remove tool in Heal and Clone mode to remove a small distraction.",
            "You can find and remove sensor dust spots.",
            "You know what Remove can and cannot do compared to generative fill."
          ],
          assets: ["tilted-horizon", "raw-sony"],
          blocks: [
            { t: "p", html: "Retouching removes small things that distract: dust specks on the sensor (they show as dark dots, mostly in clear sky), a bird, a power line, a blemish. The <b>Remove</b> tool (press <kbd>H</kbd> or click the eraser icon in the strip) works by copying pixels from a nearby area over the problem. It has modes:" },
            { t: "p", html: "<ul><li><b>Heal</b>: copies the texture from a source area but blends the colour and brightness to match the destination. Best for most spots.</li><li><b>Clone</b>: copies the source exactly. Best for hard edges, but it can leave visible repeating patterns.</li><li><b>Remove</b>: for painting over an object and letting LightCraft fill it in using the surrounding area. This is a heal-and-clone style fill, not an AI that invents new image content.</li></ul>" },
            { t: "steps", items: [
              { html: "Open <code>tilted-horizon.jpg</code> (or the Sony raw) and zoom in on a clear area, such as sky or water, with <kbd>Z</kbd>." },
              { html: "Press <kbd>H</kbd> to open the Remove panel. Choose the <b>Heal</b> mode and set the brush size so it is a little bigger than the thing you want to remove.", detail: "The panel also shows the tool's modes and the dust-spot buttons <b>Find Dust Spots</b>, <b>Visualize Spots</b> and <b>Delete all spots</b>." },
              { html: "Click (or paint) over the distraction.", check: "The spot disappears and a marker shows where LightCraft copied from. Drag the source marker to a cleaner area if the fix looks wrong." },
              { html: "Press <kbd>A</kbd> (<b>Visualize Spots</b>) to see a high-contrast view that makes dust specks and blemishes stand out. Click each speck to heal it, then press <kbd>A</kbd> again to return.", check: "The visualised view is clear of dark dots." },
              { html: "Try the <b>Find Dust Spots</b> button, which looks for dust marks automatically, and review each one it found.", detail: "Automatic suggestions are a starting point. Zoom in on each and check that it did not remove something real, like a star or a bird far away." },
              { html: "To undo everything you have healed use <b>Delete all spots</b> or <kbd>Ctrl</kbd>+<kbd>Z</kbd>." }
            ] },
            { t: "h", text: "Red Eye" },
            { t: "p", html: "In flash photos of people (and pets), the eyes can glow red. The <b>Red Eye</b> tool in the strip (the eye icon) corrects this when you click on the affected eye. The practice set has no red-eye photo, so just remember it exists." },
            { t: "callout", kind: "warn", html: "LightCraft's Remove is heal and clone, not <b>generative fill</b>. It works well on small blemishes and plain backgrounds but struggles to remove a large object from a detailed scene; it has no content-aware fill. For big removals, crop instead or accept the limitation." },
            { t: "callout", kind: "adobe", html: "This is Lightroom's <b>Remove</b> tool (formerly Spot Removal) with <b>Heal</b> and <b>Clone</b>, <b>Visualize Spots</b> and its <b>Find Dust Spots</b> equivalent. The same shortcut, <kbd>Q</kbd> in Lightroom, is <kbd>H</kbd> here." },
            { t: "claude", title: "A spotter, and a dust sweep", prompts: [
              { prompt: "Look at a render of the active photo and list up to three small distractions I might want to remove (dust specks, birds, litter). Give each an approximate position as a percentage across and down the picture. Do not change anything.", why: "Claude will use render_photo and answer in text. You then remove them yourself with the Heal brush (H), which is the best way to practise." },
              { prompt: "Run LightCraft's find dust spots command on the active photo and tell me how many spots it found.", why: "Claude will run the spot.findDust command (via run_command). The spots appear in the Remove panel's view. Review each one by zooming in; undo with Ctrl+Z if you do not like the result." }
            ] },
            { t: "exercise", title: "Clean the sky", html: "Practise removal and judge it honestly.", steps: [
              "Heal one distraction on <code>tilted-horizon.jpg</code>.",
              "Press <kbd>A</kbd> to check the sky for dust specks and heal every one you find.",
              "Compare before and after at 100%. Can you tell where the repairs are?"
            ] },
            { t: "quiz", items: [
              { q: "Which mode copies a source area exactly, without blending colour?", choices: ["Heal", "Clone", "Visualize", "Straighten"], answer: 1, explain: "Clone copies exactly; Heal blends the source to match the destination." },
              { q: "What does pressing A (Visualize Spots) do?", choices: ["Adds a vignette", "Shows a view that makes specks and blemishes easy to see", "Auto straightens", "Exports"], answer: 1, explain: "It highlights small imperfections so you can find and heal them." }
            ] },
            { t: "check", html: "You have healed at least one spot, used Visualize Spots to hunt for dust, and you know the Remove tool is heal and clone, not generative fill." }
          ]
        }
      ]
    },
    {
      id: "m8",
      title: "A repeatable workflow",
      summary: "Edit many photos consistently with copy, paste, sync and presets, keep experiments safe with versions and virtual copies, and export the right file for the right job.",
      lessons: [
        {
          id: "m8-l1",
          title: "Copy, paste, sync and presets",
          minutes: 18,
          goals: [
            "By the end you can copy edit settings from one photo and paste them onto others.",
            "You can choose which settings to copy, and know why not to copy everything.",
            "You can apply, blend and create a preset, and sync edits across a selection."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "Photos from one session usually need similar edits. Editing each one from scratch would be slow and inconsistent, so LightCraft gives you several ways to reuse edits:" },
            { t: "p", html: "<ul><li><b>Copy and Paste Edit Settings</b>: take the edit from one photo and paste it onto others.</li><li><b>Sync Settings / Auto Sync</b>: make a whole selection of photos share the active photo's settings.</li><li><b>Presets</b>: a saved, named look you can apply to any photo, and blend in partially.</li></ul>" },
            { t: "h", text: "Copy and paste" },
            { t: "steps", items: [
              { html: "Edit a demo photo to a look you like (for example <b>Valley haze</b>: lift shadows, warm it a little, add some contrast) and keep it selected." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>C</kbd> (or click <b>Copy Edit Settings</b> in the bottom bar). Select another photo and press <kbd>Ctrl</kbd>+<kbd>V</kbd>.", detail: "After you copy, the bottom-bar button changes to <b>Paste Edit Settings</b>. By default everything is copied <i>except</i> crop, masks, spots and red-eye, because those belong to one particular picture.", check: "The second photo now has the same slider values." },
              { html: "Now be selective. Open <b>Edit → Choose Edit Settings to Copy…</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd>) and untick <b>White Balance</b>. Copy, then paste onto a photo taken in different light.", detail: "White balance is the setting most likely to be wrong when copied between photos taken in different light. Copy the tone and look, and leave white balance alone. <b>Paste Selected Settings…</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>) lets you choose at paste time instead.", check: "Tone and colour changes arrive but the colour temperature of the target photo is unchanged." },
              { html: "Select several photos (<kbd>Ctrl</kbd>+click) and paste.", check: "Every selected photo takes on the pasted settings." }
            ] },
            { t: "h", text: "Sync and Auto Sync" },
            { t: "p", html: "With several photos selected, <b>Edit → Sync Settings</b> copies the active photo's settings to the rest in one go. <b>Auto Sync</b> (<b>Edit → Auto Sync</b>, <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>A</kbd>) goes further: while it is on, every slider you move changes <i>all</i> the selected photos at once. It is powerful for a series shot at the same moment. Remember to turn it off afterwards." },
            { t: "callout", kind: "note", html: "When several photos are selected in a grid, the Edit panel also shows a <b>Quick Develop</b> block with relative nudges (such as 'a bit brighter') that add to each photo's own settings instead of replacing them." },
            { t: "h", text: "Presets" },
            { t: "steps", items: [
              { html: "Press <kbd>Shift</kbd>+<kbd>P</kbd> to open the <b>Presets</b> panel.", check: "A list of grouped presets appears (for example B&amp;W, Color, Film, Landscape, Portrait and Style looks)." },
              { html: "Hover over presets to preview them, then click one to apply it. Use the <b>Amount</b> slider to blend it in less than fully (or more, up to 200).", detail: "A preset only changes the settings it contains, so it sits on top of your own edits. Amount scales its effect." },
              { html: "Undo the preset with <kbd>Ctrl</kbd>+<kbd>Z</kbd> when you are done trying." },
              { html: "To save your own look, edit a photo, then choose <b>Photo → Create Preset…</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>), give it a name and choose which settings to include.", check: "Your preset appears in the Presets panel for use on any photo." }
            ] },
            { t: "callout", kind: "adobe", html: "Copy/Paste Settings, Sync Settings and Auto Sync work like Lightroom's (and mostly with the same shortcuts). LightCraft also has presets with an <b>Amount</b> slider, like Lightroom's preset Amount. It can import and export preset files from the <b>File</b> menu." },
            { t: "claude", title: "Batch work, done for you", html: "Applying one look to many photos is the classic 'boring version' of editing. Ask Claude.", prompts: [
              { prompt: "In LightCraft, copy the edit settings of the photo titled 'Last light over the sea' except crop and white balance, and paste them onto every photo in the 'Coastlines' album. Tell me which photos changed.", why: "Claude will find the photos with query_photos, then run develop.copy with groups and develop.paste with the album's photo ids (run_command, or cmd_develop_copy and cmd_develop_paste). Watch the album thumbnails update. Undo with Ctrl+Z if you do not like the result." },
              { prompt: "List LightCraft's presets, pick one of the warm, golden-hour style ones, and apply it at 60% to all five photos in the 'Mountains' album. Tell me which preset you used.", why: "Claude will call run_command with presets.list (or cmd_presets_list) to get the preset id, then the apply_preset tool with amount 60 and the photo ids. Compare with the preset you would pick." }
            ] },
            { t: "exercise", title: "Match a set of photos", html: "Make four photos from the <b>Garden</b> or <b>Mountains</b> album look like one set.", steps: [
              "Edit the best photo carefully.",
              "Copy its settings (leaving out White Balance) and paste onto the other three.",
              "Adjust each of the others a little for its own exposure and colour.",
              "Save the look as a preset named after the album."
            ] },
            { t: "quiz", items: [
              { q: "Why is it wise to leave White Balance out when copying settings to photos from another place?", choices: ["It slows down LightCraft", "The light may be different, so the same white balance would give the wrong colours", "It cannot be copied", "It is always correct"], answer: 1, explain: "White balance depends on the light of each scene. Copy tone and style, but check white balance per photo." },
              { q: "What does Auto Sync do?", choices: ["Syncs to the cloud", "Applies each slider change to all selected photos while it is on", "Exports automatically", "Sorts the library"], answer: 1, explain: "Auto Sync changes all selected photos together as you move a slider. Turn it off when done." }
            ] },
            { t: "check", html: "You have pasted settings onto several photos, left out white balance on purpose, applied a preset at partial strength, and saved your own preset." }
          ]
        },
        {
          id: "m8-l2",
          title: "Versions, virtual copies and History",
          minutes: 15,
          goals: [
            "By the end you can save and restore a named version of a photo's edit.",
            "You can make a virtual copy to explore a different edit side by side.",
            "You know when to use History, Versions or a virtual copy."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "Three different tools protect you from edits you regret. They overlap, so it helps to know what each is best for:" },
            { t: "p", html: "<ul><li><b>History</b> is the automatic timeline of your steps. Great for \"go back a few steps\".</li><li><b>Versions</b> are named bookmarks of the edit on <i>one</i> photo (for example \"Colour\" and \"B&amp;W\"). You can jump between them any time.</li><li><b>Virtual copies</b> are a <i>second entry</i> in your library for the same original file, with its own edits. You can see both side by side, rate them, and export them separately. No extra file is created on disk.</li></ul>" },
            { t: "steps", items: [
              { html: "Edit a demo photo to a finished colour look. Open the <b>Versions</b> panel (<kbd>Shift</kbd>+<kbd>V</kbd>, or the stacked-squares icon in the strip) and click <b>Create Version</b>. Name it <code>Colour</code>.", detail: "You can also use <b>Photo → Create Version</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>S</kbd>). The panel has two tabs, <b>Named</b> (versions you made) and <b>Auto</b> (ones LightCraft saves for you).", check: "The version appears in the Named list." },
              { html: "Now convert the photo to black and white (<kbd>V</kbd>), add contrast, and create a second version named <code>B&amp;W</code>." },
              { html: "In the Versions panel click <b>Colour</b>.", check: "The photo goes back to its colour edit. Click <b>B&amp;W</b> to go forward. Both are one click away." },
              { html: "Now try a virtual copy: select the photo and choose <b>Photo → Create Virtual Copy</b> (<kbd>Ctrl</kbd>+<kbd>'</kbd>).", check: "A second thumbnail of the same photo appears. Edit the copy (try a very different look) and leave the first alone." },
              { html: "Select both and open Compare (<kbd>Shift</kbd>+<kbd>C</kbd>) or Survey (<kbd>N</kbd>).", check: "You can judge two finished edits side by side and keep the better one." }
            ] },
            { t: "callout", kind: "tip", html: "Rule of thumb: use <b>Versions</b> when you are still developing <i>one</i> photo and want a safe point to come back to; use a <b>virtual copy</b> when you want to <i>keep two different finished results</i> (colour and B&amp;W, a portrait crop and a landscape crop, a web version and a print version)." },
            { t: "callout", kind: "adobe", html: "Versions are like Lightroom's <b>Snapshots</b>; Virtual Copies have the same name and the same idea. The History panel is similar to Lightroom's, though it is part of the right-hand strip rather than the left." },
            { t: "claude", title: "A safety net before Claude edits", prompts: [
              { prompt: "Before you change anything, create a named version of the active photo called 'Before Claude'. Then give it a moody edit (darker, more contrast, slightly desaturated). Then restore the 'Before Claude' version and confirm it is back to how it started.", why: "Claude will call version.create (cmd_version_create) with the name, then set_develop, then version.restore with the version's index (cmd_version_restore; it may call version.list or history to find it). Watch the Versions panel gain an entry, and the photo switch back." },
              { prompt: "Make a virtual copy of the active photo, convert only the copy to black and white, and leave the original in colour. Tell me how you made sure you edited the copy and not the original.", why: "Claude will run photo.virtualCopy (via run_command), find the new photo with query_photos, and then apply develop.treatment (cmd_develop_treatment) to that id only. Check both thumbnails in the grid." }
            ] },
            { t: "exercise", title: "Two finished results", html: "Take one photo and deliver two different edits of it.", steps: [
              "Edit the original to a colour result and create a version called <code>Final colour</code>.",
              "Create a virtual copy and make a high-contrast black and white of it.",
              "Rate your preferred one 5 stars and the other 3, and label the winner green."
            ] },
            { t: "quiz", items: [
              { q: "You want to keep a colour and a black and white edit of a photo, both ready to export. Which is best?", choices: ["Undo repeatedly", "A virtual copy for one of them", "Resetting the photo each time", "Deleting the original"], answer: 1, explain: "A virtual copy is a second library entry with its own edits, so both results are always available." },
              { q: "Does a virtual copy duplicate the original file on disk?", choices: ["Yes, it doubles the file", "No, it is only a second entry referring to the same file", "Only for raw", "Only when exported"], answer: 1, explain: "A virtual copy costs almost nothing on disk; it holds just its own edit instructions." }
            ] },
            { t: "check", html: "You have saved and restored versions, made a virtual copy with a different edit, and compared two results side by side." }
          ]
        },
        {
          id: "m8-l3",
          title: "Exporting properly: format, size, colour space and privacy",
          minutes: 20,
          goals: [
            "By the end you can choose a format, quality, size and colour space for a given purpose.",
            "You can strip location data and add copyright when you export.",
            "You can save an export preset and re-run it in one step."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "In lesson 1.4 you made a first export. Now let us understand the choices, because the right file for a web page is not the right file for a print shop." },
            { t: "h", text: "The Export dialog, setting by setting" },
            { t: "p", html: "<ul><li><b>Format</b>: <b>JPEG</b> for sharing and the web (small, universally supported); <b>PNG</b> for graphics and lossless 8 or 16-bit; <b>TIFF</b> for printing and archiving (large, high quality, 8, 16 or 32-bit); <b>WebP</b> and <b>AVIF</b> for modern web use (small); <b>DNG</b> (raw photos only) and <b>Original files</b> (a copy plus a sidecar file) for handing on the raw.</li><li><b>Quality</b> (JPEG): 0 to 100. Around 85 to 92 is a good balance; there is also a <b>Limit (KB)</b> option for sites that cap file size.</li><li><b>Colour space</b>: <b>sRGB</b> is the safe choice for almost everything on screens. Display P3, Adobe RGB, ProPhoto and Rec.2020 hold wider colours but can look dull or wrong in programs that do not understand them.</li><li><b>Image sizing</b>: resize to a long edge (in pixels), and tick <b>Don't enlarge</b> so small photos are not blown up. Resolution in <b>ppi</b> only matters for print size; it does not change how a photo looks on screen.</li><li><b>Sharpen</b>: None, <b>Screen</b>, <b>Matte</b> or <b>Glossy</b> paper, with an Amount, a final touch of sharpening tuned to where the picture will be seen.</li><li><b>Metadata</b>: choose what travels with the file: All, All except camera info, Copyright only, or None. <b>Remove location info</b> strips the GPS position.</li><li><b>Watermark</b>, <b>File name template</b> and <b>Folder</b> / <b>Subfolder</b>, and <b>If file exists</b> (add a number, overwrite, or skip).</li></ul>" },
            { t: "callout", kind: "warn", html: "<b>Privacy:</b> photos from phones and many cameras carry the exact GPS position where they were taken. If you post a photo taken at home, you are telling the world where you live. Tick <b>Remove location info</b>, or choose a metadata setting that drops it, for anything you share publicly." },
            { t: "steps", items: [
              { html: "Select three of your edited photos and open <b>File → Export…</b> (<kbd>Shift</kbd>+<kbd>E</kbd>)." },
              { html: "Make a <b>web</b> export. Format <b>JPEG</b>, quality about 90, colour space <b>sRGB</b>, image sizing <b>Resize to Long Edge</b> 2048 px with <b>Don't enlarge</b> ticked, Sharpen <b>Screen</b>, Metadata <b>Copyright</b> only with <b>Remove location info</b> ticked." },
              { html: "Set <b>Folder</b> to your <code>exports</code> folder, and use a <b>Subfolder</b> named <code>web</code>. Set <b>If file exists</b> to add a number so nothing is overwritten." },
              { html: "Click <b>Save preset</b> and name it <code>Web 2048</code>, then confirm the export.", check: "A <code>web</code> folder appears in <code>exports</code> with three JPEGs." },
              { html: "In Explorer right-click one exported file, choose <b>Properties → Details</b>, and check the dimensions (the long edge is 2048 px) and that there is no GPS information." },
              { html: "Make a second, <b>print master</b> export of one photo: Format <b>TIFF</b>, 16-bit, a wide colour space such as Adobe RGB, full size (use the full-size choice in Image sizing), into a <code>print</code> subfolder. Compare the file sizes of the two exports." },
              { html: "Now re-run your preset in one step: select a photo and use <b>File → Export with Preset</b> (choose <b>Web 2048</b>) or <b>File → Export with Previous</b> (<kbd>Ctrl</kbd>+<kbd>E</kbd>).", check: "No dialog is needed and the files appear straight away." }
            ] },
            { t: "keys", items: [
              { keys: "Shift+E", action: "Open the Export dialog" },
              { keys: "Ctrl+E", action: "Export with Previous settings" },
              { keys: "Ctrl+Shift+E", action: "Edit in External Editor" }
            ] },
            { t: "callout", kind: "adobe", html: "The Export dialog is Lightroom's Export dialog, with the same ideas (Image Format, Color Space, Image Sizing, Output Sharpening, Metadata, Watermarking). 'Export with Previous' is Lightroom's too. Export presets work like Lightroom's saved presets." },
            { t: "callout", kind: "note", html: "The demo photos have no original file, so the <b>Original files</b> and <b>DNG</b> export choices only apply to photos imported from files, such as your practice raw files. Exporting to JPEG XL and exporting HDR are not available yet." },
            { t: "claude", title: "Review, then export in bulk", prompts: [
              { prompt: "Render a 1200-pixel preview of each photo in the 'Mountains' album and show me them one at a time so I can check them before we export anything. Do not export yet.", why: "Claude will call render_photo for each photo and describe them to you. This is the 'review before export' habit from module 2. Check each in LightCraft too." },
              { prompt: "Export every photo in the 'Mountains' album with 4 or more stars as a JPEG, 2048 pixels on the long edge, quality 90, sRGB, with location data removed and copyright kept, into an 'exports\\web' folder under my current directory. Do not overwrite anything, then list the files you created.", why: "Claude will use query_photos and the export tool with ids, dir, format, longEdge, quality, colorSpace, metadata and removeLocation, then check the folder with a normal file listing. Open the folder in Explorer to confirm." },
              { prompt: "Using the lightcraft-headless server, export every JPEG in my practice folder at 1000 pixels on the long edge into exports\\small, without opening the LightCraft window.", why: "Claude will use the headless server's import and export tools on files in the work folder. Nothing appears in the app's window. Headless sessions are scratch space: keep results by exporting files, not by editing there." }
            ] },
            { t: "exercise", title: "Two deliveries", html: "A client wants both a web gallery and a print.", steps: [
              "Create and save an export preset called <code>Web 2048</code>.",
              "Create a second preset called <code>Print master</code> (TIFF, 16-bit, full size).",
              "Use each on one photo and compare file sizes and dimensions in Explorer."
            ] },
            { t: "quiz", items: [
              { q: "Which colour space is the safest default for photos shown on screens and the web?", choices: ["ProPhoto", "Rec.2020", "sRGB", "Adobe RGB"], answer: 2, explain: "sRGB is understood almost everywhere. Wider spaces can look wrong in software that ignores colour profiles." },
              { q: "You post a photo online and do not want to reveal where it was taken. What should you do at export?", choices: ["Tick Remove location info", "Make the photo smaller", "Convert to TIFF", "Nothing, location is never stored"], answer: 0, explain: "GPS position is stored in the photo's metadata. Remove location info strips it." },
              { q: "What does 'Export with Previous' do?", choices: ["Exports the previous photo", "Repeats the last export settings without opening the dialog", "Reverses an export", "Exports the whole library"], answer: 1, explain: "It re-uses your last export settings for the current selection." }
            ] },
            { t: "check", html: "You have made a web export and a print master with different settings, saved an export preset, and removed location data on purpose." }
          ]
        }
      ]
    },
    {
      id: "m9",
      title: "Capstone project",
      summary: "Take one raw photo from import to a finished, exported picture, get a critique from Claude, then extend your look to a small set and deliver it.",
      lessons: [
        {
          id: "m9-l1",
          title: "Capstone, part 1: develop one raw photo",
          minutes: 20,
          goals: [
            "By the end you have taken a single raw photo through the whole develop workflow.",
            "You can state the look you wanted and explain each decision you made.",
            "You have saved a 'Final' version of your edit."
          ],
          assets: ["raw-sony", "raw-nikon", "raw-ricoh"],
          blocks: [
            { t: "p", html: "This is the project that ties the whole course together. You will take one raw photo from a flat, unedited starting point to a finished picture you are proud of, using what you learned in modules 1 to 8. Take your time; there is no clock. If you get stuck on a step, go back to the lesson named beside it." },
            { t: "h", text: "The brief" },
            { t: "p", html: "Choose one raw file: <code>sony-a7iv.arw</code>, <code>nikon-d7500.nef</code> or <code>ricoh-gr3.dng</code> (or one of your own, imported as a <i>copy</i>). Write one sentence describing the look you want, for example: <i>\"A calm, golden evening feel with deep blue shadows and a clean sky.\"</i> Every edit you make should serve that sentence." },
            { t: "steps", items: [
              { html: "<b>Choose and prepare (lessons 1.3 and 3.2).</b> Open the raw in Detail view, give it a star rating and a pick flag, and press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd> to make sure you are starting from a clean Reset. Create a version named <code>Start</code> (<kbd>Shift</kbd>+<kbd>V</kbd>).", check: "The photo is flagged and rated, and the Versions panel shows 'Start'." },
              { html: "<b>Composition (lesson 6.1).</b> Press <kbd>C</kbd>. Choose an aspect ratio, straighten any tilt, and place the subject or horizon on a third. Press <kbd>Enter</kbd>." },
              { html: "<b>White balance (lesson 5.1).</b> Decide whether the starting white balance serves your look. Fix an unwanted cast with the picker (<kbd>W</kbd>), or push it warmer or cooler on purpose." },
              { html: "<b>Tone (lessons 4.1 and 4.2).</b> Work in order: Exposure, Highlights, Shadows, Whites, Blacks, then Contrast. Check the histogram and use <kbd>J</kbd> to confirm you are not clipping detail you care about." },
              { html: "<b>Colour (lesson 5.2 and 5.3).</b> Use Vibrance first, then the Color Mixer to deepen or shift specific colours. Add restrained Color Grading to match your sentence." },
              { html: "<b>One local edit (lessons 7.1 and 7.2).</b> Add a mask for something specific, such as a Sky mask to deepen the sky, a Linear gradient to balance the bright top, or a Radial gradient to lift the subject. Check it with <kbd>O</kbd>." },
              { html: "<b>Finishing (lessons 6.2 and 6.3).</b> Add a touch of Clarity or Texture, a subtle vignette if it helps, sharpen at 100% and reduce noise only if it is visible. Turn on lens corrections if the file supports it." },
              { html: "<b>Cleanup (lesson 7.3).</b> Press <kbd>H</kbd> and heal any dust or distraction. Use <kbd>A</kbd> to hunt for specks." },
              { html: "<b>Judge your work (lesson 4.2).</b> Hold <kbd>\\</kbd> to peek at the original and press <kbd>Y</kbd> for a before/after. Ask: does this match my sentence? Is anything overdone? Back off one thing by a third." },
              { html: "<b>Save the result (lesson 8.2).</b> Create a version named <code>Final</code>.", check: "The Versions panel shows both 'Start' and 'Final', and you can flip between them." }
            ] },
            { t: "callout", kind: "tip", html: "Keep a note of the 5 or 6 most important decisions you made and why (for example 'Highlights -60 to bring back the clouds'). You will compare them with Claude's critique in the next lesson." },
            { t: "claude", title: "Coach me, don't edit", html: "While you work, use Claude as a coach. These prompts only look.", prompts: [
              { prompt: "I am developing this raw photo in LightCraft with this goal: 'a calm golden evening with deep blue shadows and a clean sky'. Read my current develop settings and render the photo, then tell me what is working and the two things you would change first. Do not change anything.", why: "Claude will call get_develop and render_photo and respond in text. Compare its suggestions with your own notes. If you disagree, trust your eyes, since you know what you want." },
              { prompt: "Check my capstone against this checklist, using the active photo's settings and a render: straight horizon, no clipped highlights I would care about, a sensible white balance, a tidy mask edge, sharpening not overdone. Give me pass or fail on each with one sentence of evidence.", why: "Claude will use get_develop, render_photo and the mask information it can read through get_develop or run_command (mask.select, history.list). Its pass or fail is an opinion; verify the ones that matter with J, O and 100% zoom." }
            ] },
            { t: "exercise", title: "Write your caption", html: "A good edit has a reason behind every decision.", steps: [
              "Write three sentences: the look you chose, the three biggest changes, and one thing you would do differently next time.",
              "Keep them; you will put them next to Claude's critique in the next lesson."
            ] },
            { t: "check", html: "You have a finished raw edit with versions called <b>Start</b> and <b>Final</b>, you can explain your biggest decisions, and you have notes ready for the review." }
          ]
        },
        {
          id: "m9-l2",
          title: "Capstone, part 2: review, extend to a set, and deliver",
          minutes: 20,
          goals: [
            "By the end you have compared your edit with a critique from Claude and decided what to apply.",
            "You have extended your look to a small set of photos and exported them.",
            "You have backed up your library and know where to go next."
          ],
          assets: ["raw-sony", "raw-nikon", "raw-ricoh", "tetons", "tilted-horizon"],
          blocks: [
            { t: "h", text: "Review with Claude" },
            { t: "steps", items: [
              { html: "Open your <b>Final</b> version in LightCraft and paste the first prompt below into Claude. Read the critique and compare it with your caption from part 1.", check: "You have a list of suggested changes and you can say which you agree with." },
              { html: "Apply one or two suggestions you agree with <i>by hand</i>, then ask Claude (second prompt) to apply one more, so you feel the difference between doing it and delegating it.", detail: "If you do not like a change, undo it with <kbd>Ctrl</kbd>+<kbd>Z</kbd>." },
              { html: "Create a new version named <code>Final v2</code>." }
            ] },
            { t: "h", text: "Extend to a set" },
            { t: "p", html: "A photographer rarely delivers one picture. Now apply your look to a small group so they feel like one set: your capstone raw plus the other two raw files and <code>tetons.jpg</code> or <code>tilted-horizon.jpg</code>." },
            { t: "steps", items: [
              { html: "Import any practice photos you have not imported yet (<b>File → Import from Folder…</b>). Create an album called <code>Capstone set</code> and add your four to five photos (<b>Photo → Add to Album</b>)." },
              { html: "Quickly cull the set: flag your favourites as picks (<kbd>P</kbd>) and reject any you will not deliver (<kbd>X</kbd>)." },
              { html: "Copy your capstone edit's settings, leaving out <b>crop</b> and <b>white balance</b> (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd>). Paste onto the other photos with <kbd>Ctrl</kbd>+<kbd>V</kbd>, then adjust exposure and white balance for each.", detail: "The aim is a consistent mood, not identical sliders. Each photo needs its own exposure and white balance." },
              { html: "Check them together in Survey (select all and press <kbd>N</kbd>) to see whether they look like a set." }
            ] },
            { t: "h", text: "Deliver and back up" },
            { t: "steps", items: [
              { html: "Export your hero photo as a web JPEG (2048 px, sRGB, quality 90, location removed) and as a TIFF master, into <code>%USERPROFILE%\\ArtCraft\\LightCraft\\exports\\capstone</code> (use a Subfolder named <code>capstone</code>)." },
              { html: "Export the other photos of the set as web JPEGs with your saved <b>Web 2048</b> preset (<b>File → Export with Preset</b>)." },
              { html: "Open the folder in Explorer and look at every file at full screen. Check for clipped highlights, dust specks and crooked horizons.", check: "You have at least four JPEGs and one TIFF, all of which look good." },
              { html: "Back up your work: <b>File → Back Up Library…</b> and choose a safe place (not the same disk folder as the library, if you can).", detail: "Your edits live in the library, so the library is as valuable as your originals. Back up both." }
            ] },
            { t: "claude", title: "Review, batch and verify", prompts: [
              { prompt: "Here is the goal for my active photo: [paste your one-sentence goal]. Critique the edit as a photo editor would: check exposure, white balance, colour, composition, local masks and detail, using the photo's settings and a render. Give me three praises and three improvements, ranked. Do not change anything.", why: "Claude will call get_develop, render_photo and perhaps run_command for mask details. Paste your real goal sentence in the brackets. Because nothing changes, you can run it as often as you like." },
              { prompt: "Apply improvement number 1 only, tell me which controls you changed, and render the result. I can undo it if I don't like it.", why: "Claude will call set_develop and render_photo. Judge with Y and undo with Ctrl+Z if needed. This is how you delegate one change safely." },
              { prompt: "For every photo in my 'Capstone set' album: check the white balance and exposure, tell me which ones look inconsistent with the hero photo, and apply my hero photo's settings (except crop and white balance) to those that do. Then render a 600 pixel preview of every photo so I can compare them.", why: "Claude will use query_photos, get_develop, develop.copy and develop.paste (run_command or cmd_develop_copy and cmd_develop_paste) and render_photo repeatedly. It is a batch job; watch the thumbnails change in the album." },
              { prompt: "Export the 'Capstone set' album as web JPEGs (2048 px long edge, quality 90, sRGB, location removed) into exports\\capstone-web in my current folder, then list the files with their sizes so I can verify them.", why: "Claude will use the export tool, then a file listing in the terminal. Open the folder and check the first files yourself before trusting the rest." }
            ] },
            { t: "h", text: "Where to go next" },
            { t: "p", html: "<ul><li><b>Keep practising</b> on your own photos, always as copies.</li><li><b>Explore what this course skipped:</b> keyword sets and the keyword painter, Photo Merge for HDR and panoramas, XMP sidecar files (<b>File → Automatically Write Changes into XMP</b>), Point Color, curves per colour channel, face recognition, and importing a Lightroom catalog.</li><li><b>Learn every shortcut</b> with <kbd>Ctrl</kbd>+<kbd>/</kbd>, which opens the shortcut sheet where you can also rebind keys.</li><li><b>Use Claude for repetition,</b> and your own eyes for taste.</li></ul>" },
            { t: "quiz", items: [
              { q: "You want every photo in a set to share a mood but keep its own exposure. What is the best method?", choices: ["Paste all settings including crop and white balance", "Copy settings without crop and white balance, paste, then fine-tune exposure per photo", "Export and re-import", "Use Auto Sync and never touch them again"], answer: 1, explain: "Crop and white balance are specific to each picture. Paste the look and tune exposure and white balance individually." },
              { q: "Why back up the library as well as your originals?", choices: ["It is required by LightCraft", "Your edits, ratings and albums are stored in the library, not in the original files", "It makes exports faster", "It improves quality"], answer: 1, explain: "The originals are never altered. Everything you did to them lives in the library." }
            ] },
            { t: "check", html: "You have reviewed your edit with Claude, delivered a small set as JPEGs plus a TIFF master, and backed up your library. Congratulations: you have gone from a raw file to finished photographs." }
          ]
        }
      ]
    }
  ],
  shortcuts: [
    { group: "Views and panels", items: [
      { keys: "G", action: "Photo Grid (press again for Square Grid)" },
      { keys: "D", action: "Detail view (single photo)" },
      { keys: "Esc", action: "Back to the grid" },
      { keys: "Shift+C", action: "Compare view" },
      { keys: "N", action: "Survey view" },
      { keys: "Shift+R", action: "Reference view" },
      { keys: "/", action: "Show or hide the filmstrip" },
      { keys: "Ctrl+Shift+L", action: "Show or hide the My Photos panel" },
      { keys: "Ctrl+F", action: "Search Photos" },
      { keys: "Shift+F", action: "Filter bar" },
      { keys: "F", action: "Full-screen preview" },
      { keys: "Ctrl+Shift+F", action: "Full screen window" },
      { keys: "Ctrl+I", action: "Cycle the info overlay" },
      { keys: "Ctrl+Shift+H", action: "Show or hide the histogram" }
    ] },
    { group: "Edit panels and tools", items: [
      { keys: "E", action: "Edit panel" },
      { keys: "C", action: "Crop & Rotate" },
      { keys: "H", action: "Remove (heal, clone, dust spots)" },
      { keys: "M", action: "Masking panel" },
      { keys: "Shift+P", action: "Presets panel" },
      { keys: "Shift+V", action: "Versions panel" },
      { keys: "I", action: "Info panel" },
      { keys: "K", action: "Keywords panel" },
      { keys: "Ctrl+1 to Ctrl+5", action: "Jump to Light, Color, Effects, Detail, Optics" },
      { keys: "W", action: "White balance picker" },
      { keys: "B", action: "Brush mask" },
      { keys: "L", action: "Linear gradient mask" },
      { keys: "R", action: "Radial gradient mask" },
      { keys: "[ and ]", action: "Brush size smaller / larger" },
      { keys: "Shift+[ and Shift+]", action: "Brush feather softer / harder" },
      { keys: "Enter", action: "Done (accept crop or tool)" }
    ] },
    { group: "Viewing and judging", items: [
      { keys: "\\", action: "Show original (hold to peek)" },
      { keys: "Y", action: "Before / After side by side" },
      { keys: "Shift+Y", action: "Before / After split" },
      { keys: "Alt+Y", action: "Before / After top and bottom" },
      { keys: "J", action: "Show clipping" },
      { keys: "O", action: "Mask overlay" },
      { keys: "Shift+O", action: "Cycle crop overlay" },
      { keys: "A", action: "Visualize spots (Remove tool)" },
      { keys: "Z or Space", action: "Toggle zoom" },
      { keys: "Ctrl+0", action: "Fit" },
      { keys: "Ctrl+Alt+0", action: "100% zoom" },
      { keys: "Ctrl+= and Ctrl+-", action: "Zoom in / out" },
      { keys: "Left / Right", action: "Previous / next photo" }
    ] },
    { group: "Rating and organising", items: [
      { keys: "0 to 5", action: "Star rating" },
      { keys: "6, 7, 8, 9", action: "Red, yellow, green, blue label" },
      { keys: "P", action: "Pick" },
      { keys: "X", action: "Reject (swaps aspect inside the crop tool)" },
      { keys: "U", action: "Unflag" },
      { keys: "Shift+Z / Shift+X", action: "Pick or reject, then advance" },
      { keys: "Ctrl+A", action: "Select all" },
      { keys: "Ctrl+D or Ctrl+Shift+A", action: "Select none" },
      { keys: "Ctrl+Shift+I", action: "Import photos" },
      { keys: "Ctrl+N", action: "New album" },
      { keys: "Ctrl+Shift+N", action: "New folder" },
      { keys: "Ctrl+Alt+N", action: "New smart album from filter" },
      { keys: "Ctrl+G", action: "Stack photos" },
      { keys: "Ctrl+'", action: "Create virtual copy" },
      { keys: "Ctrl+Shift+S", action: "Create version" },
      { keys: "F2", action: "Rename photos" },
      { keys: "Delete", action: "Delete photo (to Recently Deleted)" },
      { keys: "Ctrl+S", action: "Save metadata to file (XMP)" }
    ] },
    { group: "Developing", items: [
      { keys: "Ctrl+Z", action: "Undo" },
      { keys: "Ctrl+Shift+Z", action: "Redo" },
      { keys: "Double-click a slider", action: "Reset that slider" },
      { keys: "Ctrl+Shift+R", action: "Reset all edits on the photo" },
      { keys: "Ctrl+Alt+R", action: "Reset crop" },
      { keys: "Shift+A", action: "Auto settings" },
      { keys: "V", action: "Black and white" },
      { keys: "Ctrl+C", action: "Copy edit settings" },
      { keys: "Ctrl+V", action: "Paste edit settings" },
      { keys: "Ctrl+Shift+C", action: "Choose edit settings to copy" },
      { keys: "Ctrl+Shift+V", action: "Paste selected settings" },
      { keys: "Ctrl+Alt+V", action: "Paste settings from previous photo" },
      { keys: "Ctrl+Alt+Shift+A", action: "Auto Sync" },
      { keys: "Ctrl+[ and Ctrl+]", action: "Rotate left / right" },
      { keys: "Ctrl+Shift+P", action: "Create preset" }
    ] },
    { group: "Export and app", items: [
      { keys: "Shift+E", action: "Export dialog" },
      { keys: "Ctrl+E", action: "Export with Previous" },
      { keys: "Ctrl+Shift+E", action: "Edit in external editor" },
      { keys: "Ctrl+,", action: "Settings" },
      { keys: "Ctrl+/", action: "Keyboard shortcut sheet (you can rebind keys there)" },
      { keys: "F1", action: "Help" }
    ] }
  ],
  glossary: [
    { term: "Raw file", def: "A file holding the camera sensor's data almost untouched (often 12 to 14 bits per colour). It needs to be <i>developed</i> before it looks like a finished picture, and gives far more room to change exposure and white balance than a JPEG. Examples: ARW (Sony), NEF (Nikon), CR2 and CR3 (Canon), RAF (Fujifilm), DNG (an open raw format)." },
    { term: "JPEG", def: "A common compressed picture file. The camera (or an editing app) has already applied white balance, contrast and colour and thrown away data to make the file small, so JPEGs tolerate less editing than raws." },
    { term: "Non-destructive editing", def: "Edits are stored as instructions and applied on display and export. The original file is never changed, so you can undo or change any edit later." },
    { term: "Library (catalog)", def: "The LightCraft folder that records where your photos are, their ratings, keywords and albums, and every edit. By default <code>%USERPROFILE%\\Pictures\\LightCraft Library</code>. Back it up as well as your originals." },
    { term: "Culling", def: "Choosing which photos to keep, with flags, stars and colour labels, so you only spend editing time on the best ones." },
    { term: "Pick / Reject", def: "A yes/no flag on a photo. Pick marks a favourite; Reject marks one you do not want. A reject is only a flag, not a deletion." },
    { term: "Album / Smart album", def: "An album is a hand-made list of photos (the files do not move). A smart album fills itself from a rule such as '4 stars or more'." },
    { term: "Keyword", def: "A tag, like 'beach' or 'portrait', that you attach to photos so you can find them later." },
    { term: "Exposure", def: "How much light a photo received. In LightCraft the Exposure slider changes brightness in stops, from -5 to +5." },
    { term: "Stop", def: "A doubling or halving of light. +1 stop means twice as much light, -1 stop half as much." },
    { term: "ISO", def: "A camera setting that amplifies the sensor's signal. Higher ISO lets you shoot in dimmer light but adds noise." },
    { term: "Histogram", def: "A graph of how many pixels are at each brightness, from black on the left to white on the right. It shows exposure and clipping at a glance." },
    { term: "Clipping", def: "Pixels pushed to pure black or pure white that have lost all detail. The histogram's corner triangles warn of it, and <kbd>J</kbd> shows it on the photo." },
    { term: "Highlights, Shadows, Whites, Blacks", def: "Sliders for different brightness zones. Highlights and Shadows recover detail in bright and dark areas; Whites and Blacks set the very brightest and darkest points of the picture." },
    { term: "Contrast", def: "The difference between dark and light tones. More contrast makes a picture punchier; less makes it softer and flatter." },
    { term: "Tone curve", def: "A graph that maps input brightness to output brightness, giving fine control over contrast. An S-shape increases contrast." },
    { term: "Profile", def: "The base rendering applied to raw data before your sliders, for example Color, Neutral, Vivid or a film look." },
    { term: "Preset", def: "A saved set of edit settings you can apply to any photo, with an Amount slider to blend it." },
    { term: "White balance", def: "A correction for the colour of the light so neutral objects look neutral. Controlled with Temp (blue to yellow) and Tint (green to magenta)." },
    { term: "Kelvin (K)", def: "The unit of colour temperature of light. About 2000 K is candlelight, 5500 K daylight and 7000 K or more shade. Raw files show Temp in Kelvin; JPEGs show a relative scale." },
    { term: "Vibrance and Saturation", def: "Both add colour intensity. Saturation changes every colour equally; Vibrance lifts muted colours more than already strong ones, so it is gentler." },
    { term: "Hue, Saturation, Luminance (HSL)", def: "Three properties of colour: which colour it is, how intense it is, and how light or dark it is. The Color Mixer adjusts them for eight colour ranges." },
    { term: "Color Grading", def: "Tinting the shadows, midtones and highlights of a picture separately, as in film colour grading." },
    { term: "Texture, Clarity, Dehaze", def: "Effects sliders. Texture emphasises fine detail, Clarity adds mid-tone contrast, and Dehaze cuts through atmospheric haze." },
    { term: "Vignette", def: "Darkening (or lightening) of the edges and corners of a picture to draw the eye to the centre." },
    { term: "Grain", def: "A film-like speckle added on purpose for texture. Not to be confused with noise." },
    { term: "Noise", def: "Unwanted grainy speckle from high ISO or from lifting dark areas. Reduced with the Noise Reduction sliders at the cost of some detail." },
    { term: "Sharpening", def: "Increasing contrast along edges so details look crisper. Judge it at 100% zoom." },
    { term: "Chromatic aberration", def: "Coloured fringes along high-contrast edges caused by the lens. Removed with Remove Chromatic Aberration or Defringe." },
    { term: "Aspect ratio", def: "The shape of a picture, width to height, such as 3:2, 4:5, 16:9 or 1:1." },
    { term: "Rule of thirds", def: "A composition guide that splits the frame into a 3 by 3 grid; placing the subject or horizon on the lines usually feels balanced." },
    { term: "Mask", def: "A stencil that limits an adjustment to part of a photo. LightCraft masks include Linear, Radial, Brush, Sky, Subject, Background, Luminance and Color." },
    { term: "Feather", def: "The softness of a mask or brush edge. A larger feather blends the edit smoothly into its surroundings." },
    { term: "Heal and Clone", def: "Retouching modes of the Remove tool. Clone copies pixels exactly; Heal copies and blends them to match the surroundings." },
    { term: "Version", def: "A named snapshot of a photo's edit settings that you can return to at any time." },
    { term: "Virtual copy", def: "A second library entry for the same original file with its own edits. It uses almost no disk space." },
    { term: "XMP sidecar", def: "A small text file saved beside a photo holding its edits and metadata, so other programs can read them. Optional in LightCraft." },
    { term: "Colour space (sRGB)", def: "The range of colours a file can hold. sRGB is the safe standard for screens and the web; wider spaces such as Adobe RGB suit some print work." },
    { term: "ppi", def: "Pixels per inch. It only matters for print size; it has no effect on how a photo looks on a screen." },
    { term: "MCP (Model Context Protocol)", def: "A standard that lets an AI assistant use another program's features as tools. LightCraft has an MCP server so Claude can inspect and edit photos." },
    { term: "Live and headless servers", def: "The <code>lightcraft</code> MCP server drives the running LightCraft window. The <code>lightcraft-headless</code> server works on files with no window." },
    { term: "Control id", def: "The machine name of a slider, such as <code>light.exposure</code> or <code>wb.temp</code>. Claude uses these when it reads or sets edits." }
  ],
  claudeCheatsheet: [
    { task: "Check that Claude can reach LightCraft", prompt: "Using the lightcraft MCP server, tell me how many photos are in the library that LightCraft has open and list the titles of the first five. Do not change anything.", tools: ["query_photos"] },
    { task: "Describe what is on screen", prompt: "Take a screenshot of LightCraft and tell me which view is showing, which photo is active and which panels are open.", tools: ["screenshot", "inspect_ui"] },
    { task: "Read the edit settings of the active photo", prompt: "What are the current develop settings of the active photo? List only the ones that are not at their default value.", tools: ["get_develop"] },
    { task: "Render and judge a photo", prompt: "Render the active photo at 1024 pixels and tell me honestly whether it is too dark, too bright or about right, and what the most obvious problem is. Do not change anything.", tools: ["render_photo"] },
    { task: "Find slider names and ranges", prompt: "List the controls in the Light section with their minimum, maximum, default and current value.", tools: ["list_controls"] },
    { task: "Make a small tonal edit", prompt: "On the active photo, raise Exposure by +0.5 and lower Highlights to -30, then tell me the new values.", tools: ["get_develop", "set_develop"] },
    { task: "Undo Claude's last change", prompt: "Undo your last change in LightCraft and confirm the photo is back to how it started.", tools: ["cmd_edit_undo"] },
    { task: "Propose edits without applying them", prompt: "Look at the active photo and propose three different edits with exact controls and values. Do NOT apply anything yet. Wait for me to say which one.", tools: ["render_photo", "get_develop"] },
    { task: "Open a photo in Detail view", prompt: "In LightCraft, switch to Detail view and open the photo titled 'Dune ridges'.", tools: ["query_photos", "select_photos", "cmd_view_detail"] },
    { task: "Rate, flag or label photos by a rule", prompt: "Mark every photo in the library that has 1 star or fewer and no flag with a red colour label, and tell me how many that was.", tools: ["query_photos", "cmd_photo_label"] },
    { task: "Build an album from titles", prompt: "Create an album called 'Golden hour' and add every photo whose title mentions sun, sunset, golden or light. Tell me which you added.", tools: ["query_photos", "run_command"] },
    { task: "Tag photos with a keyword", prompt: "Add the keyword 'practice' to every photo in the Garden album.", tools: ["query_photos", "run_command"] },
    { task: "Correct white balance", prompt: "Find an area in the active photo that should be neutral grey or white and use the white balance picker on that spot. Tell me what Temp and Tint changed to.", tools: ["render_photo", "run_command", "get_develop"] },
    { task: "Straighten and crop", prompt: "Look at the active photo, tell me how far the horizon is off level, and straighten it. Then crop to a 4:5 portrait with the subject on a third and render the result.", tools: ["render_photo", "crop"] },
    { task: "Add a gradient mask", prompt: "Add a linear gradient mask over the top third of the active photo that lowers exposure by about 0.7 stops. Look up the mask command's parameters with list_commands first, then render the result.", tools: ["list_commands", "run_command", "render_photo"] },
    { task: "Apply a preset to a whole album", prompt: "List LightCraft's presets, pick a warm golden-hour one, and apply it at 60% to all photos in the 'Mountains' album. Tell me which preset you used.", tools: ["run_command", "apply_preset"] },
    { task: "Copy a look to other photos", prompt: "Copy the edit settings of the photo titled 'Last light over the sea' except crop and white balance, and paste them onto every photo in the 'Coastlines' album.", tools: ["query_photos", "run_command"] },
    { task: "Save a safe point before Claude edits", prompt: "Before you change anything, create a named version of the active photo called 'Before Claude'. Then do your edit. I may ask you to restore it.", tools: ["run_command"] },
    { task: "Export a web set", prompt: "Export every photo in the 'Mountains' album with 4 or more stars as JPEG, 2048 pixels on the long edge, quality 90, sRGB, location removed, into an exports\\web folder in my current directory. Do not overwrite anything, then list the files you created.", tools: ["query_photos", "export"] },
    { task: "Batch resize without the app window", prompt: "Using the lightcraft-headless server, export every JPEG in my practice folder at 1000 pixels on the long edge into exports\\small.", tools: ["export"] }
  ],
  limitations: [
    "<b>No Print, Book, Map or Web modules</b> as in Lightroom Classic. The slideshow is basic. There is no tethered shooting, no publish services, and no cloud sync or mobile app.",
    "<b>AI features are limited.</b> The Subject, Sky and Background masks use classical image analysis, not trained AI segmentation, so expect rough edges you must fix with Add and Subtract. Object and Describe masks need an optional multi-gigabyte model that most students will not have. AI Denoise needs an optional model and works on Bayer raw files only.",
    "<b>No generative fill or content-aware removal.</b> The Remove tool is heal and clone. There is no Super Resolution, Lens Blur, or generative Remove, and no Depth Range mask.",
    "<b>No video, no HDR editing or HDR export.</b> HDR and panorama merge of several photos exists, but it is not covered here. JPEG XL encoding is not available.",
    "<b>Raw support has gaps.</b> Some variants open only as the camera's embedded JPEG preview ('Preview only'): for example some Canon CR3 variants, Canon sRAW, compressed Olympus ORF and Nikon 'lossy-after-split' NEF. HEIC works only in builds with the optional <code>heif</code> feature, and AVIF files cannot be imported.",
    "<b>Colours on non-DNG raws may not match Lightroom or the camera's own JPEG.</b> Camera colour calibration is incomplete; the Sony A7 IV, Fujifilm X-H2S and X-T4 have bundled profiles, and DNG files use their own matrices.",
    "<b>No lens-profile database.</b> Automatic lens corrections only use correction data embedded in DNG and RW2 files; for other formats use the manual Distortion and Vignetting sliders.",
    "<b>100% zoom is limited on big photos</b> by a preview-size cap (2,560 px on the long edge by default; change it in Settings under Performance). Soft proofing is partial.",
    "<b>The demo photos are generated, not files.</b> They have no original on disk, so Export 'Original files' and DNG do not apply to them, and 'Show in Explorer' (the menu may still read 'Show in Finder') has nothing to show.",
    "<b>Claude cannot read the histogram or your monitor's real colours.</b> It sees renders and slider values only. There is no histogram tool, so trust the on-screen histogram and the J clipping view.",
    "<b>Claude's live connection needs the app started with <code>--control 7980</code></b> (the 'LightCraft (ArtCraft)' shortcut does this). The headless server works on files in its own session and cannot open a library that the desktop app already has open.",
    "<b>LightCraft is young software.</b> Some menu labels or behaviours may differ slightly from this course, and the Windows installer and GPU rendering have had less testing than macOS. If something does not work, try the menu bar version of the same command."
  ]
});
