window.ARTCRAFT_COURSES = window.ARTCRAFT_COURSES || [];
window.ARTCRAFT_COURSES.push({
  id: "filmcraft",
  app: "FilmCraft",
  adobe: "Adobe Premiere Pro",
  tagline: "Cut, color, mix and export a short video from scratch, by hand and with Claude as your editing assistant.",
  accent: "#8b5cf6",
  level: "Beginner",
  estimatedHours: 7,
  intro: "<p><b>FilmCraft</b> is an open-source video editor modelled closely on Adobe Premiere Pro: the same panels, the same tools, the same shortcuts, and even many of the same names (Lumetri Color, Effect Controls, Program monitor). If you have never edited video before, this course takes you from <i>what is a frame?</i> to a finished, exported short film.</p><p>You will learn the <b>craft</b> as well as the buttons: how frame rate and codecs work, why editors cut the way they do, what keyframes are, how to read a waveform and a histogram, and what a decibel means. Every lesson has you doing things in the app beside this window, and most lessons end with a <b>Try it with Claude</b> box where Claude Code drives the same running FilmCraft window through its MCP connection, so you can compare doing it by hand with asking for it.</p><p>FilmCraft is young software. It is built for Windows but is mostly tested on macOS, so expect the occasional rough edge, save often, and use the Limitations page when something is missing.</p>",
  prerequisites: [
    "A Windows 11 PC where FilmCraft has been built and the course setup scripts have been run (they create the <b>FilmCraft (ArtCraft)</b> Start-menu shortcut, the practice folder, and the Claude connection).",
    "Claude Code installed and signed in (you will start it in PowerShell from your FilmCraft work folder).",
    "The practice clips in <code>%USERPROFILE%\\ArtCraft\\FilmCraft\\practice\\</code> (copied there by the asset-download script). The first two modules need no downloads: they use FilmCraft's built-in demo project.",
    "A pair of headphones or decent speakers for the audio lessons. No video-editing experience is assumed."
  ],
  setup: {
    launchHtml: "<p>FilmCraft is built to <code>{ROOT}\\filmcraft\\target\\release\\filmcraft.exe</code>. Start it from the Start menu shortcut <b>FilmCraft (ArtCraft)</b>. The shortcut runs <code>filmcraft.exe --control 9876</code>, which opens the editor <i>and</i> a private control port that lets Claude drive the live window. Equivalent from PowerShell:</p><pre><code>{ROOT}\\ops\\scripts\\windows\\launch-app.ps1 -App filmcraft</code></pre><p>With no project file given, FilmCraft opens its built-in <b>FilmCraft Demo</b> project (generated in code, so no media files are needed). The release build is a windowed app with no console, so nothing else appears when it starts.</p><p>Your work folder is <code>%USERPROFILE%\\ArtCraft\\FilmCraft\\</code>: practice clips are in <code>practice\\</code> and finished videos go in <code>exports\\</code>. Save your projects (<code>.fcproj</code> files) in the work folder too.</p>",
    mcpHtml: "<p>Claude Code has two FilmCraft MCP servers, registered for you by <code>ops\\scripts\\windows\\register-mcp.ps1</code>:</p><ul><li><b>filmcraft</b> (live): runs <code>filmcraft-cli mcp --bridge 127.0.0.1:9876</code>. Claude drives the <i>running window</i>, so every edit shows up on screen and in the History panel. The app must be started first (the Start-menu shortcut does this).</li><li><b>filmcraft-headless</b>: runs <code>filmcraft-cli mcp --demo</code>. Claude works on a private in-memory copy of the demo project with no window. Handy for experiments, but nothing it does appears in your app.</li></ul><p>Open the work folder and start Claude there:</p><pre><code>cd $env:USERPROFILE\\ArtCraft\\FilmCraft\nclaude</code></pre><p>Inside Claude Code, type <code>/mcp</code> and check that <b>filmcraft</b> is listed as connected. Tools appear as <code>mcp__filmcraft__command_run</code>, <code>mcp__filmcraft__sequence_inspect</code> and so on. If the server is missing, re-run <code>register-mcp.ps1</code>; if it shows as failed, FilmCraft is probably not running yet (start it and run <code>/mcp</code> again). The equivalent manual registration is <code>claude mcp add --scope user filmcraft -- {ROOT}\\filmcraft\\target\\release\\filmcraft-cli.exe mcp --bridge 127.0.0.1:9876</code>.</p>"
  },
  assets: [
    {
      id: "demo-project",
      title: "Built-in FilmCraft Demo project",
      kind: "project",
      file: null,
      needs: "Nothing to download. It is built in code by FilmCraft: choose File > New > Demo Project (or start the app with no arguments). It contains the bins Footage, Audio, Graphics and Sequences; six procedural 1080p clips (Ocean_Sunset.mp4, Aurora_Timelapse.mp4, City_Night_Drive.mp4, Desert_Dunes.mp4, Misty_Forest.mp4, Neon_Loop.mov); Ambient_Score.wav; Bars and Tone; a Universal Counting Leader; a Color Matte; and two sequences, Main Edit (six cuts with transitions, an overlay with keyframes, a color grade, four markers, and audio at -8 dB and -14 dB) and Rough Cut. Sequence settings are 1920x1080, 23.976 fps, 48 kHz.",
      repoPath: null,
      suggestedSource: null,
      license: "Generated by FilmCraft itself (MIT OR Apache-2.0)"
    },
    {
      id: "demo-footage",
      title: "Built-in demo footage (six procedural clips with sound)",
      kind: "other",
      file: null,
      needs: "Nothing to download. Import mode > Demo footage card (or Project panel > New Item > Demo Footage) adds six generated 1080p clips with sound to your project. Use it for any lesson when you want practice clips without hunting for files.",
      repoPath: null,
      suggestedSource: null,
      license: "Generated by FilmCraft itself (MIT OR Apache-2.0)"
    },
    {
      id: "earth-views",
      title: "Earth views from the ISS (NASA)",
      kind: "video",
      file: "assets/filmcraft/earth-views.mp4",
      needs: "MP4 container, progressive H.264 (High or Main profile, 8-bit 4:2:0), 1920x1080 or 1280x720, constant 24 to 30 fps, about 60 to 90 seconds, with silent or AAC-LC stereo audio. Calm scenic footage is ideal (it grades and keyframes well). Must NOT be interlaced, 10-bit, 4:2:2 or HDR, because FilmCraft's software H.264 decoder handles only 8-bit 4:2:0 progressive video. If the NASA download will not import, re-encode it with HandBrake or ffmpeg to this spec.",
      repoPath: null,
      suggestedSource: "https://images.nasa.gov/details/NHQ_2020_1221_Earth%20Views",
      license: "Public domain (NASA)"
    },
    {
      id: "apollo-launch",
      title: "Apollo 11 launch and countdown reel (NASA)",
      kind: "video",
      file: "assets/filmcraft/apollo-launch.mp4",
      needs: "MP4 container, progressive H.264 (8-bit 4:2:0), about 720p to 1080p, 30 fps, 1 to 2 minutes long, with AAC-LC mono or stereo audio that includes the countdown voice (used for audio-level, ducking and loudness lessons). Trim and re-encode to this spec if the original NASA rendition does not import (no interlacing, no 10-bit).",
      repoPath: null,
      suggestedSource: "https://images.nasa.gov/details/KSC-19690716-MH-NAS01-0001-Apollo_11_Breakfast_C7Exit_Convoy_WhiteRmHatchClosing_Launch-HM_0083",
      license: "Public domain (NASA)"
    },
    {
      id: "apollo-moonwalk",
      title: "Apollo 11 moonwalk montage (NASA)",
      kind: "video",
      file: "assets/filmcraft/apollo-moonwalk.mp4",
      needs: "MP4 container, progressive H.264 (8-bit 4:2:0), 1280x720 or 1920x1080, 30 fps, 1 to 2 minutes, with AAC-LC audio containing the air-to-ground voices (used for dialogue-style audio and as color-grading material: strong highlights and deep shadows). Re-encode to this spec if import fails.",
      repoPath: null,
      suggestedSource: "https://images.nasa.gov/details/Apollo_11_moonwalk_montage_720p",
      license: "Public domain (NASA)"
    },
    {
      id: "apollo-broll",
      title: "Apollo 11 B-roll film (NASA)",
      kind: "video",
      file: "assets/filmcraft/apollo-broll.mp4",
      needs: "MP4 container, progressive H.264 (8-bit 4:2:0), 1280x720 or 1920x1080, 30 fps, about 2 to 3 minutes of varied silent-film shots (rockets, crowds, instruments) so there are natural places to cut; audio may be absent or AAC-LC. Re-encode to this spec if import fails.",
      repoPath: null,
      suggestedSource: "https://images.nasa.gov/details/KSC-19690716-MH-NAS01-0001-Apollo_11_Historical_Footage_and_Broll-DVC_1560",
      license: "Public domain (NASA)"
    },
    {
      id: "chopin-nocturne",
      title: "Chopin nocturne (Musopen, CC0)",
      kind: "audio",
      file: "assets/filmcraft/chopin-nocturne.mp3",
      needs: "MP3 (decoded by FilmCraft's symphonia decoder) or WAV with PCM 16-bit audio, stereo, 44.1 or 48 kHz, about 2 to 3 minutes of calm solo piano. Used as the music bed for mixing, ducking and the capstone.",
      repoPath: null,
      suggestedSource: "https://archive.org/details/musopen-chopin",
      license: "CC0 1.0 (Musopen)"
    },
    {
      id: "voiceover",
      title: "Your own voice-over recording",
      kind: "audio",
      file: "assets/filmcraft/voiceover.m4a",
      needs: "About 30 to 45 seconds of you reading a short script in a quiet room, recorded with the Windows Sound Recorder app (it saves .m4a, which is AAC-LC and decodes in FilmCraft) or exported as WAV PCM 16-bit 48 kHz, mono or stereo. A little room noise is fine and is actually useful for the audio-repair lesson.",
      repoPath: null,
      suggestedSource: null,
      license: "Your own recording"
    },
    {
      id: "captions-srt",
      title: "Captions file (SubRip .srt)",
      kind: "other",
      file: "assets/filmcraft/captions.srt",
      needs: "A UTF-8 SubRip (.srt) file with 6 to 10 short cues timed within the first 30 seconds, for example lines that fit the Earth-views footage. FilmCraft detects .srt on import and turns it into a caption track. Claude can write this file for you in the captions lesson.",
      repoPath: null,
      suggestedSource: null,
      license: "Original text, public domain"
    },
    {
      id: "still-photo",
      title: "One still photograph",
      kind: "image",
      file: "assets/filmcraft/still-photo.jpg",
      needs: "A JPEG or PNG still, 1920x1080 or larger, landscape orientation, such as a public-domain NASA photograph of the Moon or Earth (search images.nasa.gov or Wikimedia Commons). Used for the Ken Burns pan-and-zoom exercise in the keyframes module.",
      repoPath: null,
      suggestedSource: "https://images.nasa.gov/",
      license: "Public domain (NASA)"
    }
  ],
  modules: [
    {
      id: "m1",
      title: "Getting oriented",
      summary: "Launch FilmCraft, learn the screen layout, understand frames, frame rate and codecs, and get comfortable with playback, undo and saving.",
      lessons: [
        {
          id: "m1-l1",
          title: "Launch FilmCraft and see how the pieces fit",
          minutes: 10,
          goals: [
            "Start FilmCraft from the Start menu and recognize that it opened the demo project.",
            "Explain how this course, the FilmCraft window and Claude Code work together.",
            "Know the one real caveat about FilmCraft on Windows."
          ],
          assets: ["demo-project"],
          blocks: [
            { t: "p", html: "You will work with three things at once: this <b>course</b> in your browser, the <b>FilmCraft</b> window beside it, and later a <b>Claude Code</b> terminal. Arrange the browser and FilmCraft side by side so you can read a step and do it without switching." },
            { t: "h", text: "Open FilmCraft" },
            { t: "steps", items: [
              { html: "Press the <kbd>Windows</kbd> key, type <b>FilmCraft</b>, and open the shortcut named <b>FilmCraft (ArtCraft)</b>.", detail: "The shortcut runs <code>filmcraft.exe --control 9876</code> from <code>{ROOT}\\filmcraft\\target\\release\\</code>. The <code>--control 9876</code> part opens a control port on your own computer (127.0.0.1 only) that Claude will use later. If you prefer a terminal, run <code>{ROOT}\\ops\\scripts\\windows\\launch-app.ps1 -App filmcraft</code>.", check: "A dark editing window opens. No black console window appears; that is normal." },
              { html: "Look at the middle of the top bar. The project name should read <b>FilmCraft Demo</b>.", detail: "When you start FilmCraft without telling it which file to open, it opens its built-in demo project. This project is generated by the program, so it works without any downloaded media.", check: "You see three tabs on the left of the top bar: <b>Import</b>, <b>Edit</b> and <b>Export</b>, with <b>Edit</b> highlighted." },
              "Move the window so it fills half of your screen (drag it to the left edge until it snaps), and put this course on the other half."
            ] },
            { t: "callout", kind: "warn", html: "<b>Rough edges expected.</b> FilmCraft is built for Windows, but its developers test mostly on macOS, and its own roadmap says Windows is \"barely exercised at runtime\". If something looks odd, save your work with <kbd>Ctrl</kbd>+<kbd>S</kbd>, restart the app, and check the Limitations page at the end of this course." },
            { t: "h", text: "How the three pieces fit together" },
            { t: "p", html: "<b>FilmCraft</b> is the editor. <b>Claude Code</b> is an AI assistant in a terminal. The two are linked by <b>MCP</b> (Model Context Protocol), a standard way for an AI to call tools in an app. Because FilmCraft was built so that every action is a named <i>command</i>, Claude can do anything a menu item can do, and it can look at the project and at screenshots. You will learn it in <b>module 2</b>; until then, do everything by hand so you understand what Claude will later be doing for you." },
            { t: "callout", kind: "note", html: "The control port has no password, but it only listens on your own PC (127.0.0.1). That is fine on a personal computer. If you ever start FilmCraft without the shortcut, Claude cannot connect to the live window." },
            { t: "callout", kind: "adobe", html: "FilmCraft is the open-source equivalent of <b>Adobe Premiere Pro</b>. Panel names (Project, Source, Program, Effect Controls, Lumetri Color, Essential Sound), tool names and most shortcuts match Premiere, so Premiere tutorials on YouTube will mostly work. Where something differs, the course says so." },
            { t: "quiz", items: [
              { q: "What does the <code>--control 9876</code> in the shortcut do?", choices: ["Limits the project to 9876 frames", "Opens a local control port so Claude can drive the running window", "Loads project number 9876", "Turns on hardware video decoding"], answer: 1, explain: "It starts FilmCraft's JSON control server on 127.0.0.1 port 9876. The filmcraft MCP server connects to it so Claude can see and change the live project." },
              { q: "You started FilmCraft with no file. What opens?", choices: ["A blank project with an empty timeline", "The last project you worked on", "The built-in demo project", "An error message"], answer: 2, explain: "With no file named, FilmCraft opens the generated FilmCraft Demo project by default." }
            ] },
            { t: "check", html: "FilmCraft is open on the demo project, the course is beside it, and you know that Claude joins in during module 2." }
          ]
        },
        {
          id: "m1-l2",
          title: "A tour of the editing screen",
          minutes: 15,
          goals: [
            "Name the main panels and say what each one is for.",
            "Switch workspaces and open a panel from the keyboard.",
            "Get back to the default layout if you lose it."
          ],
          assets: ["demo-project"],
          blocks: [
            { t: "p", html: "Video editors look busy because each panel does one job. Read this picture first; then you will find each piece in your own window." },
            { t: "image", src: "../filmcraft/docs/images/filmcraft-hero.png", alt: "FilmCraft Edit mode: Effect Controls at top left, Program monitor in the middle, Lumetri Color at right, Project panel and Timeline along the bottom, audio meters at far right.", caption: "The Editing workspace (here showing a different project than yours). Top: Effect Controls, Program monitor, Lumetri Color. Bottom: Project panel, Tools bar, Timeline, Audio Meters." },
            { t: "h", text: "The parts of the screen" },
            { t: "p", html: "<ul><li><b>Header bar</b>: the <b>Import | Edit | Export</b> tabs, the project name in the centre, and buttons at the right (workspace name, Quick Export, progress, search, volume, full screen). On Windows a compact menu bar (<b>File, Edit, Clip, Sequence, Markers, Graphics and Titles, View, Window, Help</b>) sits beside the tabs.</li><li><b>Project panel</b> (bottom left): your media library, organised in folders called <b>bins</b>. Think of it as the pantry.</li><li><b>Source monitor</b> (a tab at top left): where you preview a single clip and choose the part you want.</li><li><b>Program monitor</b> (top centre): what your finished edit looks like at the playhead.</li><li><b>Timeline</b> (bottom centre): where you arrange clips on tracks over time. This is the cutting board.</li><li><b>Tools bar</b> (slim strip left of the Timeline): Selection, Razor and the other editing tools.</li><li><b>Effect Controls</b> (top left tab): the settings of the selected clip: position, scale, opacity, effects, keyframes.</li><li><b>Audio Meters</b> (far right): live loudness bars.</li></ul>" },
            { t: "h", text: "Walk through your own window" },
            { t: "steps", items: [
              { html: "Click the <b>Edit</b> tab in the header if it is not already highlighted.", check: "You see the panels from the picture above." },
              { html: "In the bottom-left panel group, click the tabs <b>Project</b>, then <b>Effects</b>, then <b>History</b>, then back to <b>Project</b>.", detail: "A row of tabs is a <i>tab group</i>: several panels sharing one space. Several panels in the Editing workspace share space this way." },
              { html: "In the Project panel, open the bin named <b>Sequences</b> and double-click <b>Main Edit</b> if the Timeline is empty.", detail: "Double-clicking a sequence opens it in the Timeline. Double-clicking a plain clip instead loads it into the Source monitor.", check: "The Timeline shows coloured clips on tracks named V1, V2 (video) and A1, A2 (audio)." },
              { html: "Click once on the Program monitor, then press <kbd>Space</kbd> to play and <kbd>Space</kbd> again to stop.", check: "The picture moves, the big blue timecode counts up, and the Audio Meters bounce." },
              { html: "Press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>2</kbd> to jump to the <b>Assembly</b> workspace, then <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>5</kbd> for <b>Audio</b>. Notice how the panels rearrange.", detail: "A workspace is a saved arrangement of panels. Workspaces: 1 Editing, 2 Assembly, 3 Color, 4 Effects, 5 Audio, 6 Captions and Graphics. You can also pick them from the Window menu under Workspaces." },
              { html: "Return with <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>1</kbd> (Editing). If a panel is lost or the layout looks broken, press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>0</kbd> to reset the layout.", check: "You are back in the Editing layout." }
            ] },
            { t: "keys", items: [
              { keys: "Shift+1", action: "Project panel" },
              { keys: "Shift+2", action: "Source monitor" },
              { keys: "Shift+3", action: "Timeline" },
              { keys: "Shift+4", action: "Program monitor" },
              { keys: "Shift+5", action: "Effect Controls" },
              { keys: "Shift+7", action: "Effects panel" },
              { keys: "Alt+Shift+0", action: "Reset the workspace layout" }
            ] },
            { t: "callout", kind: "tip", html: "Any panel can be opened from the <b>Window</b> menu, even ones the current workspace hides. Hover over any button for a tooltip, which shows its name and shortcut." },
            { t: "callout", kind: "adobe", html: "Premiere users: this is the same idea as Premiere's workspaces (Editing, Assembly, Color, Effects, Audio, Captions and Graphics). The Tools bar here is slim and sits between the Project panel and the Timeline; right-click or long-press a tool icon for its flyout of related tools." },
            { t: "quiz", items: [
              { q: "Where do you preview a single clip <i>before</i> putting it in your edit?", choices: ["Program monitor", "Source monitor", "Audio Meters", "History panel"], answer: 1, explain: "The Source monitor shows one clip so you can mark the part you want. The Program monitor shows the edited sequence." },
              { q: "Which panel holds your imported media, sorted into bins?", choices: ["Project", "Timeline", "Effects", "Libraries"], answer: 0, explain: "The Project panel is the media library. The Timeline is where you arrange clips in time." },
              { q: "You dragged panels around and lost the layout. What resets it?", choices: ["Ctrl+Z", "Alt+Shift+0", "Shift+0", "Closing the project"], answer: 1, explain: "Alt+Shift+0 resets the current workspace layout." }
            ] },
            { t: "exercise", title: "Find it in 60 seconds", html: "Without using the course, find each of these in the app: (1) the clip named <code>Desert_Dunes.mp4</code>, (2) the Markers panel, (3) the volume setting of the music clip on track A2, (4) the loudness readout (M, S, I and TP values) under the Audio Meters.", steps: ["Use the Project panel's search box for the clip.", "Use the Window menu or the bottom-left tab group for Markers.", "Click the music clip on A2 and look at Effect Controls (Shift+5).", "The loudness values are written under the meter bars at the far right."] },
            { t: "check", html: "You can point to the Project panel, Source monitor, Program monitor, Timeline, Tools bar and Effect Controls, and you can switch workspaces and reset the layout." }
          ]
        },
        {
          id: "m1-l3",
          title: "How video works: frames, frame rate, codecs",
          minutes: 15,
          goals: [
            "Explain what a frame, a frame rate and a timecode are.",
            "Tell a container from a codec, and know which ones FilmCraft can read.",
            "Step through video one frame at a time."
          ],
          assets: ["demo-project"],
          blocks: [
            { t: "p", html: "Before you cut anything, it helps to know what a video file actually is. This is the single most useful background in the course: almost every confusing import, export or playback problem comes from the ideas on this page." },
            { t: "h", text: "Frames and frame rate" },
            { t: "p", html: "A video is a stack of still pictures shown quickly. Each picture is a <b>frame</b>. The <b>frame rate</b> is how many frames are shown per second (fps). Film and cinema use <b>24 fps</b> (really 23.976 in digital video), a lot of web video uses <b>30</b>, and fast action or screen recordings use <b>60</b>. A higher rate looks smoother and costs more data. The demo sequence runs at <b>23.976 fps</b>." },
            { t: "h", text: "Resolution and aspect ratio" },
            { t: "p", html: "<b>Resolution</b> is the size of each frame in pixels. <b>1920x1080</b> is called full HD or 1080p; <b>3840x2160</b> is 4K. The shape (<b>aspect ratio</b>) of both is 16:9. Vertical phone video is 1080x1920, or 9:16." },
            { t: "h", text: "Timecode" },
            { t: "p", html: "Editors name a moment with <b>timecode</b>: <code>HH:MM:SS:FF</code>, hours, minutes, seconds and <i>frames</i>. <code>00:00:25:13</code> is 25 seconds and 13 frames in. The big blue number at the top-left of the Timeline is the timecode of the <b>playhead</b>, the thin blue line you scrub across the timeline." },
            { t: "steps", items: [
              { html: "Click the Program monitor, then press <kbd>Right</kbd> several times.", check: "Each press moves the picture by exactly one frame and the last two digits of the timecode go up by one." },
              { html: "Press <kbd>Shift</kbd>+<kbd>Right</kbd> to jump five frames, then <kbd>Left</kbd> to step back one.", detail: "Frame-stepping is how editors find the exact frame to cut on." },
              { html: "Press <kbd>Home</kbd> to go to the start of the sequence and <kbd>End</kbd> to go to the end. Press <kbd>Up</kbd> and <kbd>Down</kbd> to hop to the previous or next cut.", check: "The playhead jumps between the cuts of the demo edit." },
              { html: "In the Project panel, switch to the List view if it is not already, and look at the columns <b>Frame Rate</b>, <b>Media Start</b> and <b>Media Duration</b>.", detail: "If you do not see those columns, the panel may be showing icons. The three small view buttons are at the bottom-left of the Project panel." }
            ] },
            { t: "h", text: "Container versus codec" },
            { t: "p", html: "A video file has two layers, and people mix them up constantly:" },
            { t: "p", html: "<ul><li>The <b>codec</b> (coder-decoder) is the method used to <i>compress</i> the pictures or sound: <b>H.264</b>, HEVC (H.265), VP9, AV1, ProRes for video; AAC, MP3, Opus and PCM (uncompressed) for audio. Raw video is gigantic, so every file uses one.</li><li>The <b>container</b> is the box that holds the compressed video, audio, and extras together: <b>MP4</b>, <b>MOV</b>, MKV, WebM, AVI, MXF. The file extension is the container, not the codec.</li></ul><p>So \"an MP4\" can contain H.264 video and AAC audio (very common) or something quite different. The <b>bitrate</b> is how much data per second the compression keeps: higher bitrate means better quality and bigger files. Audio has a <b>sample rate</b> (FilmCraft projects use <b>48 kHz</b>, 48,000 measurements per second).</p>" },
            { t: "callout", kind: "warn", html: "<b>What FilmCraft reads.</b> It opens MP4, MOV, MKV, WebM, AVI, MXF, MPEG and more, with H.264, HEVC, VP9, AV1, ProRes, DNxHD/DNxHR and MPEG-2 video, and AAC, MP3, FLAC, Opus, AC-3 and PCM audio. But its own software H.264 decoder handles <b>only 8-bit 4:2:0, non-interlaced</b> video. Footage from phones in HDR or 10-bit modes, or interlaced broadcast footage, can fail or look wrong. Camera RAW is not supported. The practice clips in this course were chosen to be safe." },
            { t: "callout", kind: "tip", html: "Editors usually work in a <b>proxy</b> or low-quality preview and export at full quality. FilmCraft's monitors have a <b>playback resolution</b> dropdown (it defaults to a reduced size such as 1/2) so heavy footage plays smoothly while you edit; the export is always full quality." },
            { t: "quiz", items: [
              { q: "A clip is 00:00:10:12 at 24 fps. How many frames is the \"12\"?", choices: ["12 seconds", "12 frames, which is half a second", "12 minutes", "12 milliseconds"], answer: 1, explain: "The last field of timecode counts frames. At 24 fps, 12 frames is half a second." },
              { q: "Which of these is a <i>codec</i> rather than a container?", choices: ["MP4", "MOV", "H.264", "MKV"], answer: 2, explain: "H.264 is the compression method. MP4, MOV and MKV are containers that hold H.264 (or other) streams." },
              { q: "Why can some phone clips fail in FilmCraft?", choices: ["Phones always record in RAW", "The software H.264 decoder supports only 8-bit 4:2:0 progressive video", "MP4 files are never supported", "The clip is too short"], answer: 1, explain: "10-bit, HDR, 4:2:2 and interlaced H.264 are outside what FilmCraft's own decoder handles." },
              { q: "Roughly how many frames are in 2 seconds of 24 fps video?", choices: ["12", "24", "48", "240"], answer: 2, explain: "24 frames per second times 2 seconds is 48 frames." }
            ] },
            { t: "check", html: "You can say what 24 fps means, read a timecode, and explain the difference between MP4 (container) and H.264 (codec)." }
          ]
        },
        {
          id: "m1-l4",
          title: "Playback, undo, History and saving",
          minutes: 12,
          goals: [
            "Play, stop and shuttle with Space and J, K, L.",
            "Undo, redo and jump around in the History panel.",
            "Save a project safely into your work folder."
          ],
          assets: ["demo-project"],
          blocks: [
            { t: "p", html: "Editing is full of experiments. The two skills that make experimenting safe are <b>undo</b> and <b>saving</b>. Learn both before you do anything else." },
            { t: "h", text: "Playback keys" },
            { t: "keys", items: [
              { keys: "Space", action: "Play or stop" },
              { keys: "L", action: "Play forward (press again to double speed, up to 8x)" },
              { keys: "J", action: "Play backward (press again to double speed)" },
              { keys: "K", action: "Stop" },
              { keys: "Left / Right", action: "Step one frame back or forward" },
              { keys: "Up / Down", action: "Previous or next edit point" }
            ] },
            { t: "callout", kind: "tip", html: "Editors keep a left hand on <kbd>J</kbd> <kbd>K</kbd> <kbd>L</kbd> and a right hand on the mouse. It becomes second nature in a day and is the fastest way to review a cut." },
            { t: "h", text: "Undo, redo and History" },
            { t: "steps", items: [
              { html: "Click on the Timeline ruler (the strip of numbers above the tracks) to place the playhead somewhere in the middle of the edit.", check: "The playhead line moves where you clicked." },
              { html: "Press <kbd>M</kbd> to drop a <b>marker</b> at the playhead.", detail: "A marker is a coloured flag on the ruler. Editors use them as bookmarks. We will use markers properly in module 4.", check: "A small coloured flag appears on the ruler." },
              { html: "Open the <b>History</b> tab in the bottom-left panel group.", check: "The list starts with a row named <b>Open</b>, followed by a row for the marker you just added." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to undo, then <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> to redo.", check: "The flag disappears, then reappears. In History, the undone step turns grey while it is undone." },
              { html: "Click the <b>Open</b> row in History.", detail: "Clicking a row in History jumps to that point: rows above it are undone, and you can click a grey row to redo forward again. The undo history holds 200 steps.", check: "The project is back to how it was when it opened." }
            ] },
            { t: "h", text: "Saving" },
            { t: "p", html: "A FilmCraft project is a small <code>.fcproj</code> file that stores <i>instructions</i>: which clips, where they sit, and what effects they have. It does <b>not</b> contain your video. Your original clips stay where they are on disk and are never changed by editing. That is why keeping the clips where the project can find them matters." },
            { t: "steps", items: [
              { html: "Press <kbd>Ctrl</kbd>+<kbd>S</kbd>. Because the demo project has never been saved, a Save dialog opens.", detail: "In the dialog's path bar you can type <code>%USERPROFILE%\\ArtCraft\\FilmCraft</code> and press Enter to get to your work folder." },
              { html: "Save it as <code>my-first-project.fcproj</code> in <code>%USERPROFILE%\\ArtCraft\\FilmCraft\\</code>.", check: "The title in the header changes to <b>my-first-project</b>. When there are unsaved changes the title shows <b>- Edited</b> after it." }
            ] },
            { t: "keys", items: [
              { keys: "Ctrl+Z", action: "Undo" },
              { keys: "Ctrl+Shift+Z", action: "Redo" },
              { keys: "Ctrl+S", action: "Save" },
              { keys: "Ctrl+Shift+S", action: "Save As (new name or place)" },
              { keys: "Ctrl+Alt+S", action: "Save a Copy (keeps the open project as it is)" }
            ] },
            { t: "callout", kind: "note", html: "FilmCraft also protects you in the background. Under <b>Edit &gt; Preferences &gt; Auto Save</b>, auto-save is on by default (every 5 minutes, keeping 20 versions in an <code>Auto-Save</code> folder beside the project), and a recovery journal is updated every few seconds in case of a crash. Treat that as a safety net, not a reason to skip <kbd>Ctrl</kbd>+<kbd>S</kbd>." },
            { t: "callout", kind: "tip", html: "Before any big experiment (and before you let Claude make big changes), use <b>Save a Copy</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>). You keep a snapshot to go back to." },
            { t: "quiz", items: [
              { q: "Does a <code>.fcproj</code> file contain your video footage?", choices: ["Yes, the clips are embedded", "No, it stores the edit instructions and links to your clips", "Only the audio", "Only the first minute"], answer: 1, explain: "The project stores the edit (clip positions, effects, markers). The media files stay where they are, so moving or deleting them breaks the links." },
              { q: "Which key stops playback and which plays backward?", choices: ["K stops, J plays backward", "J stops, K plays backward", "L stops, J plays forward", "Space plays backward"], answer: 0, explain: "K stops, L plays forward and J plays backward. Pressing L or J repeatedly speeds up playback." },
              { q: "You want to try something risky without losing your current version. What is the best step?", choices: ["Press Ctrl+S and hope", "Save a Copy with Ctrl+Alt+S first", "Delete the project", "Close FilmCraft"], answer: 1, explain: "Save a Copy writes a snapshot and leaves your open project as it is." }
            ] },
            { t: "exercise", title: "Break it and fix it", html: "Add three markers at different places with <kbd>M</kbd>. Then use only the History panel to go back to the state with exactly one marker. Then redo to three. Finally save.", steps: ["Click the ruler, press M. Repeat twice at other positions.", "Open History and click the row for the first marker.", "Click the greyed-out rows to redo forward.", "Press Ctrl+S."] },
            { t: "check", html: "You have <code>my-first-project.fcproj</code> saved in your FilmCraft work folder, and you can undo, redo and jump through History without hesitation." }
          ]
        }
      ]
    },
    {
      id: "m2",
      title: "Working with Claude",
      summary: "Connect Claude Code to the running FilmCraft window, let it inspect and edit your project, learn to undo and verify what it did, and pick up prompt habits and safety rules.",
      lessons: [
        {
          id: "m2-l1",
          title: "Connect Claude and ask your first questions",
          minutes: 12,
          goals: [
            "Start Claude Code in your FilmCraft work folder and check the MCP connection with /mcp.",
            "Tell the live <code>filmcraft</code> server from <code>filmcraft-headless</code>.",
            "Have Claude inspect the open project and take a screenshot without changing anything."
          ],
          assets: ["demo-project"],
          blocks: [
            { t: "p", html: "<b>Claude Code</b> is an AI assistant that runs in a terminal. On its own it can read and write files. With the <b>MCP</b> connection it can also call <i>tools</i> in FilmCraft: look at the project, run editing commands, and take screenshots of the window. You stay the editor and Claude acts as a very fast assistant that can explain what it did and be undone." },
            { t: "h", text: "Open Claude beside FilmCraft" },
            { t: "steps", items: [
              { html: "Make sure FilmCraft is running (start it from the <b>FilmCraft (ArtCraft)</b> shortcut) and showing the demo project or your saved <code>my-first-project</code>.", detail: "The shortcut matters: it starts FilmCraft with <code>--control 9876</code>. An app started any other way has no control port for Claude to reach." },
              { html: "Open <b>PowerShell</b> (or Windows Terminal), go to your work folder and start Claude with the two commands in the box just below this list.", detail: "Starting Claude in your work folder keeps its file work focused on your practice clips, projects and exports." },
              { html: "In Claude Code type <code>/mcp</code> and press <kbd>Enter</kbd>.", check: "You see <b>filmcraft</b> and <b>filmcraft-headless</b> in the list. <b>filmcraft</b> should say connected. Select it to see its tool list." }
            ] },
            { t: "code", lang: "powershell", text: "cd $env:USERPROFILE\\ArtCraft\\FilmCraft\nclaude" },
            { t: "callout", kind: "warn", html: "If <code>filmcraft</code> shows as <b>failed</b>, FilmCraft is almost certainly not running (or was not started with the shortcut). Start it, then type <code>/mcp</code> again and reconnect. If a server is missing entirely, run <code>{ROOT}\\ops\\scripts\\windows\\register-mcp.ps1</code> and restart Claude." },
            { t: "h", text: "Two servers, two jobs" },
            { t: "p", html: "<ul><li><b>filmcraft</b> (live) works on the <b>window you are looking at</b>. Edits appear on screen and in the History panel. All 17 tools are available, including the ones that click, drag, type and take screenshots.</li><li><b>filmcraft-headless</b> works on a private in-memory copy of the demo project with <b>no window</b>. Nothing it does appears in your app, and it has only the 9 non-UI tools. It is for safe experiments.</li></ul>" },
            { t: "p", html: "The tools fall into groups. <b>Looking</b> (safe, they change nothing): <code>doc_inspect</code>, <code>project_inspect</code>, <code>sequence_inspect</code>, <code>render_frame</code>, <code>render_preview</code>, <code>ui_inspect</code>, <code>ui_elements</code>, <code>ui_screenshot</code>. <b>Doing</b>: <code>command_list</code> (lists every command), <code>command_run</code> and <code>command_batch</code> (run commands), <code>media_import</code>. <b>Using the screen like a person</b> (live server only): <code>ui_click</code>, <code>ui_drag</code>, <code>ui_key</code>, <code>ui_type</code>, <code>ui_control</code>." },
            { t: "claude", title: "Try it with Claude: look, don't touch", html: "Claude asks your permission the first time it uses each tool. Reading tools are safe to allow. Read what it wants to run before you accept.", prompts: [
              { prompt: "Use the live filmcraft MCP server (not filmcraft-headless). Without changing anything, tell me which project is open in FilmCraft, the names of its bins and sequences, which sequence is active, and how long it is.", why: "Claude will call doc_inspect (or project_inspect and sequence_inspect). Compare its answer with the Project panel in the app. Nothing should change on screen." },
              { prompt: "Take a screenshot of the Program monitor in the live FilmCraft window and describe what you see.", why: "Claude uses ui_screenshot (a PNG of the window or one panel) or render_frame (the program frame). Claude can look at images, so it describes the picture; check that its description matches your monitor." },
              { prompt: "List the tracks in the active sequence and how many clips are on each.", why: "Uses sequence_inspect, which returns tracks, clips, effects, transitions and markers. Count the clips yourself in the Timeline to see that it agrees." }
            ] },
            { t: "quiz", items: [
              { q: "You ask Claude to add a marker and nothing shows up in your FilmCraft window. What is the most likely cause?", choices: ["Claude used filmcraft-headless instead of the live filmcraft server", "Markers do not exist in FilmCraft", "The marker is invisible", "Claude Code cannot edit video"], answer: 0, explain: "The headless server works on its own in-memory copy. Always say you want the live filmcraft server for edits you want to see." },
              { q: "Which tool takes a screenshot of the app?", choices: ["doc_inspect", "ui_screenshot", "command_list", "media_import"], answer: 1, explain: "ui_screenshot returns a PNG of the whole window or a single panel (live server only). render_frame returns just the Program picture." }
            ] },
            { t: "check", html: "<code>/mcp</code> shows <b>filmcraft</b> connected, and Claude has correctly described your open project without changing it." }
          ]
        },
        {
          id: "m2-l2",
          title: "Let Claude edit, ask it to explain, and undo it",
          minutes: 12,
          goals: [
            "Watch Claude make an edit in the live app and see it appear in History.",
            "Ask Claude to explain exactly which commands it ran.",
            "Undo Claude's changes from the app or by asking."
          ],
          assets: ["demo-project"],
          blocks: [
            { t: "p", html: "Everything FilmCraft can do is a named <b>command</b> with an id such as <code>markers.add</code> or <code>timeline.razor</code>. Menu items, shortcuts, the command-line tool and Claude's MCP tools all run the <i>same</i> commands. That is why Claude can do almost anything you can do by hand, and why its changes land in the same undo history." },
            { t: "callout", kind: "tip", html: "Before the first time Claude edits your project, press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> (Save a Copy) in FilmCraft. Then a bad edit can always be thrown away." },
            { t: "steps", items: [
              { html: "In FilmCraft, open the <b>History</b> tab and the <b>Markers</b> tab so you can watch them.", check: "Both panels are visible. History ends with whatever you did last." },
              { html: "In Claude, paste the first prompt below and approve the tool calls.", detail: "Claude will probably look up the command first with <code>command_list</code>, then use <code>command_run</code> with <code>markers.add</code>." },
              { html: "Watch FilmCraft while Claude works.", check: "A new marker appears on the Timeline ruler and in the Markers panel, and a new row appears in History." },
              { html: "Ask Claude the explain prompt below. Compare its answer with what you saw.", check: "Claude names the command id (for example markers.add) and its parameters (time or seconds, name)." },
              { html: "Undo it two ways: first press <kbd>Ctrl</kbd>+<kbd>Z</kbd> in FilmCraft; then press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>Z</kbd> to bring it back, and finally ask Claude to undo it using the undo prompt.", check: "The marker disappears each time you undo. Claude's undo is the command <code>edit.undo</code>, the same as Ctrl+Z." }
            ] },
            { t: "claude", title: "Try it with Claude: edit, explain, undo", prompts: [
              { prompt: "Using the live filmcraft server, add a marker named \"Check this\" at 5 seconds on the active sequence. Do only that.", why: "Claude finds markers.add with command_list, then runs it with command_run. Watch the Timeline ruler and History. \"Do only that\" stops it from tidying other things." },
              { prompt: "Explain exactly what you just did: which command ids you ran and with which parameters, and how I could do the same by hand in the app.", why: "A good habit: ask for an explanation after every edit. It teaches you the menu route and lets you audit Claude." },
              { prompt: "Undo your last change in the live FilmCraft window, then confirm with sequence_inspect that the marker is gone.", why: "Runs edit.undo through command_run, then reads the sequence back. The History row greys out in the app." }
            ] },
            { t: "callout", kind: "note", html: "Each command Claude runs is one undoable step. When Claude uses <code>command_batch</code> (several commands in one call), each command is still its own History row, so you can undo them one at a time." },
            { t: "h", text: "Asking Claude what is possible" },
            { t: "p", html: "You do not need to memorize command ids. Ask Claude to search for them. The tool <code>command_list</code> returns every command with its label, menu path, shortcut, parameters and whether it is enabled right now." },
            { t: "claude", title: "Try it with Claude: discover commands", prompts: [
              { prompt: "Use command_list on the live filmcraft server to find the command for splitting a clip with the Razor. Tell me its id, menu path, shortcut and parameters. Do not run it.", why: "Calls command_list with a filter such as razor. You should see timeline.razor and the shortcut C. Reading only; nothing is edited." },
              { prompt: "Find three commands that would help me make my edit sound better, and explain each in one sentence.", why: "Claude searches the command catalog (likely clip.audioGain, essentialSound.*, mixer.*). We will use these in the audio module." }
            ] },
            { t: "quiz", items: [
              { q: "After Claude runs a command that edits your project, where can you see and reverse it?", choices: ["Nowhere, edits are permanent", "In the History panel, with Ctrl+Z", "Only by restarting FilmCraft", "In the Claude Code window only"], answer: 1, explain: "Claude's edits are ordinary undoable steps in the live project's History." },
              { q: "What is the best follow-up after Claude makes an edit you do not fully understand?", choices: ["Ignore it", "Ask it to explain which commands it ran and why", "Delete the project", "Restart the app"], answer: 1, explain: "Asking Claude to explain turns each edit into a lesson and lets you audit its work." }
            ] },
            { t: "exercise", title: "Claude as a note-taker", html: "Ask Claude to add three markers at 2, 6 and 10 seconds named \"Idea A\", \"Idea B\" and \"Idea C\". Then undo all three using only the History panel. Finally ask Claude to add them again in a single batch and observe in History how many rows appear.", steps: ["Run the prompt, watch the Markers panel.", "In History, click the row before the first marker.", "Ask Claude to \"add them again using command_batch\".", "Count the new History rows."] },
            { t: "check", html: "You have seen Claude change the live project, you can read what it did, and you can undo it from the app and by asking." }
          ]
        },
        {
          id: "m2-l3",
          title: "Prompting well, knowing the limits, staying safe",
          minutes: 12,
          goals: [
            "Use prompt patterns that give reliable edits.",
            "Know what Claude cannot see or do through FilmCraft's tools.",
            "Follow safety habits: keep originals, work on copies, review before export."
          ],
          assets: ["demo-project"],
          blocks: [
            { t: "h", text: "Six prompt habits" },
            { t: "p", html: "<ol><li><b>Name the server.</b> \"Use the live filmcraft server\" for visible edits.</li><li><b>Look before you leap.</b> Start with \"inspect the sequence and tell me what you see\", then ask for the change.</li><li><b>Be specific.</b> Give clip names, track names (V1, A2), and times (\"at 12 seconds\" or a timecode).</li><li><b>One change at a time</b>, or ask for a plan first and say \"do not run anything yet\".</li><li><b>Ask it to verify.</b> \"Render a frame at 5 seconds and check the title is visible.\"</li><li><b>Say what not to touch.</b> \"Only work on V2; leave audio alone.\"</li></ol>" },
            { t: "claude", title: "Try it with Claude: plan first, then do", prompts: [
              { prompt: "I want a clean, simple look on the Desert_Dunes shot in the active sequence. First inspect the sequence and tell me what effects that clip already has. Then give me a plan of what you would change. Do not run any editing command yet.", why: "Uses sequence_inspect (effects per clip). You approve the plan before anything changes. This habit prevents surprises." },
              { prompt: "Now do only step 1 of your plan, then render a frame of that clip and tell me whether it looks better.", why: "Runs one command with command_run, then render_frame so Claude can look at the result. You can disagree and undo." }
            ] },
            { t: "h", text: "What Claude cannot do here" },
            { t: "p", html: "<ul><li><b>It cannot hear.</b> It can read numbers and look at the loudness meter in a screenshot, but cannot judge how something sounds. You are the ears.</li><li><b>Its taste is not yours.</b> It can compare before and after pictures, but whether a grade is \"right\" is your call.</li><li><b>It only sees what the tools return</b>: project data, rendered frames and screenshots. It does not watch playback in real time.</li><li><b>The live window must be running</b> with the control port. If you close FilmCraft, the live tools fail.</li><li><b>The headless server is separate.</b> What happens there never reaches your window.</li><li><b>Some things are not implemented in FilmCraft at all</b> (see Limitations). Claude cannot work around missing features.</li></ul>" },
            { t: "h", text: "Safety habits" },
            { t: "steps", items: [
              "Keep your original clips in <code>practice\\</code>. FilmCraft never changes source media, but do not let anything delete or overwrite it.",
              "Press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> (Save a Copy) before any large batch of Claude edits.",
              "Read each tool permission prompt in Claude Code before you accept it. The edit tools (<code>command_run</code>, <code>command_batch</code>, <code>media_import</code>, and the <code>ui_*</code> click and key tools) change things; the inspect, render and screenshot tools do not.",
              "Review the result yourself, by playing it, before you export. Claude can export to the <code>exports\\</code> folder, but you should never publish what you have not watched."
            ] },
            { t: "callout", kind: "warn", html: "Claude can run <code>ui_key</code> and <code>ui_click</code>, which behave like you pressing keys and clicking. Do not leave Claude to click through dialogs on its own with a project you cannot afford to lose; prefer the commands it can name exactly." },
            { t: "h", text: "See the headless difference" },
            { t: "claude", title: "Try it with Claude: two servers, one question", prompts: [
              { prompt: "With the filmcraft-headless server, add a marker named \"Headless test\" at 3 seconds. Then, with the live filmcraft server, list the markers in the active sequence. Explain why the marker is or is not there.", why: "Shows the difference directly. The headless server edits its own in-memory demo; the live server's sequence_inspect will not list it, and nothing appears in your window." }
            ] },
            { t: "quiz", items: [
              { q: "Which request is the best prompt?", choices: ["Make it better", "Fix my video", "Inspect the active sequence, then lower the music on A2 to about -18 dB and show me a screenshot of the Audio Meters", "Do your thing"], answer: 2, explain: "It names the target (music on A2), the amount, the order of work and how to check it." },
              { q: "Which of these can Claude NOT reliably judge through FilmCraft's tools?", choices: ["How many clips are on V1", "Whether a title is visible in a rendered frame", "Whether the mix sounds pleasant", "What the marker names are"], answer: 2, explain: "Claude cannot hear audio. It can read numbers and meters, but you judge how it sounds." },
              { q: "What should you do before letting Claude make many edits at once?", choices: ["Nothing", "Save a copy of the project", "Close the History panel", "Switch to headless"], answer: 1, explain: "A saved copy gives you a clean fallback. You can also undo, but a copy is the safest habit." }
            ] },
            { t: "exercise", title: "Write your own prompt", html: "Write one prompt that asks Claude to make a change you actually want in the demo sequence (for example: rename a marker, or add a marker at the point where the music starts). Include the server, the target, and a check. Run it. Then ask Claude to undo it.", steps: ["Use the six habits as a checklist.", "Run it and watch History.", "Undo with the prompt \"undo your last change\"."] },
            { t: "check", html: "You can start Claude, check <code>/mcp</code>, ask it to inspect, make a small edit, explain it, and undo it, and you know what it cannot do." }
          ]
        }
      ]
    },
    {
      id: "m3",
      title: "Bringing in and previewing media",
      summary: "Import your practice clips, organize them into bins, and use the Source monitor to choose the part of each clip you want before you edit.",
      lessons: [
        {
          id: "m3-l1",
          title: "Import clips and organize the Project panel",
          minutes: 15,
          goals: [
            "Start a clean project and import media from your practice folder.",
            "Explain why importing links to a file instead of copying it.",
            "Organize clips into bins and read their frame rate and duration."
          ],
          assets: ["earth-views", "apollo-launch", "apollo-moonwalk", "apollo-broll", "chopin-nocturne", "voiceover", "still-photo", "demo-footage"],
          blocks: [
            { t: "p", html: "<b>Importing</b> tells FilmCraft where a file lives. The file is <b>not copied</b>: the project keeps a link, and FilmCraft reads the original whenever it needs a frame. That keeps projects tiny, but it means you must not move, rename or delete a clip after you import it, or the project loses it (editors call that <i>offline media</i>)." },
            { t: "callout", kind: "note", html: "No practice clips yet? Use the built-in ones instead. Open <b>Import</b> (header tab) and click the <b>Demo footage</b> card (\"Six procedural 1080p clips with sound\"). Everything in this module works the same with them." },
            { t: "h", text: "Start a fresh project and import" },
            { t: "steps", items: [
              { html: "Save what you have (<kbd>Ctrl</kbd>+<kbd>S</kbd>). Then start a new project with <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd> (File menu &gt; New Project).", check: "The Project panel is empty and the header shows an untitled project." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>S</kbd> and save the new project as <code>practice-edit.fcproj</code> in your work folder.", detail: "Saving early gives the project a home, so auto-save files land beside it." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>I</kbd> (File &gt; Import), or click the <b>Import</b> tab and the <b>Browse files...</b> card.", check: "A file picker opens." },
              { html: "In the picker's path bar type <code>%USERPROFILE%\\ArtCraft\\FilmCraft\\practice</code> and press <kbd>Enter</kbd>. Select all the files (<kbd>Ctrl</kbd>+<kbd>A</kbd>), <kbd>Ctrl</kbd>+click <code>captions.srt</code> to deselect it (that file is for module 9), and click <b>Open</b>.", detail: "You can also drag files straight from File Explorer into the FilmCraft window: the Import screen says to \"drop files anywhere in the window\". FilmCraft recognizes .srt files and turns them into a caption track, which is why we leave that one out for now.", check: "Return to the <b>Edit</b> tab. The Project panel lists earth-views, apollo-launch, apollo-moonwalk, apollo-broll, chopin-nocturne, voiceover and your still photo." },
              { html: "Switch the Project panel to <b>List</b> view (the view buttons are at its bottom-left) and read the <b>Frame Rate</b> and <b>Media Duration</b> columns for each clip.", check: "You can say the frame rate of every video clip. Audio and stills show no frame rate." }
            ] },
            { t: "callout", kind: "warn", html: "<b>If a clip will not import or looks black.</b> Most likely its codec is outside what FilmCraft decodes (10-bit, HDR, interlaced or 4:2:2 H.264, camera RAW). Re-encode it to a progressive 8-bit H.264 + AAC MP4 with a free tool such as HandBrake and import that. Check <i>Limitations</i> for more." },
            { t: "h", text: "Organize with bins" },
            { t: "p", html: "A <b>bin</b> is a folder inside the Project panel. It only organizes the view; it does not move anything on disk. Good projects sort media by type or scene so you can find things quickly." },
            { t: "steps", items: [
              { html: "Click the <b>New Bin</b> folder icon at the bottom-right of the Project panel (or press <kbd>Ctrl</kbd>+<kbd>B</kbd> with the panel focused).", check: "A bin named <b>New Bin</b> appears with its name ready to edit." },
              { html: "Name it <b>Video</b>. Make two more bins named <b>Audio</b> and <b>Stills</b>.", detail: "If a bin does not enter rename mode, right-click it and choose <b>Rename</b>." },
              { html: "Drag the four video clips into <b>Video</b>, the two sound files into <b>Audio</b>, and the photo into <b>Stills</b>.", check: "Each bin holds its clips. Double-click a bin to open it in place." },
              { html: "Save with <kbd>Ctrl</kbd>+<kbd>S</kbd>." }
            ] },
            { t: "callout", kind: "adobe", html: "In Premiere the New Item button in the Project panel creates bars and tone, color mattes and so on. FilmCraft has the same <b>New Item</b> menu: Sequence, Adjustment Layer, Bars and Tone, Black Video, Color Matte, Universal Counting Leader, Transparent Video, and Demo Footage." },
            { t: "claude", title: "Try it with Claude: the same job, hands-free", html: "Do this after you have organized by hand once, so you can compare. Press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd> first (Save a Copy).", prompts: [
              { prompt: "Using the live filmcraft server, import every video, audio and image file from %USERPROFILE%\\ArtCraft\\FilmCraft\\practice into the open project. Then create bins named Video, Audio and Stills and move each file into the right bin. Tell me what you did.", why: "Claude lists the folder with its own file tools, then calls media_import with absolute paths (one per line), then runs file.newBin and project.moveToBin through command_run or command_batch. Watch the Project panel fill and sort itself. If you already imported by hand, it may add duplicates; undo those in History." },
              { prompt: "Inspect the project and give me a table of each imported clip: name, type, duration, and frame rate if it has one. Flag anything that looks unusual.", why: "Uses project_inspect. Compare with the Project panel columns. A clip with zero duration or a missing type usually failed to decode." }
            ] },
            { t: "quiz", items: [
              { q: "You import a clip, then move the original file to another folder. What happens in FilmCraft?", choices: ["Nothing, the clip was copied into the project", "The clip goes offline because the project only keeps a link", "The project is deleted", "FilmCraft moves the file back"], answer: 1, explain: "Import links to the file. Keep media where it was when you imported it." },
              { q: "What is a bin?", choices: ["A deleted-items folder", "A folder in the Project panel for organizing clips", "A kind of codec", "A track in the Timeline"], answer: 1, explain: "Bins organize the Project panel only. They do not change files on disk." }
            ] },
            { t: "exercise", title: "Make your project tidy", html: "Add a fourth bin named <b>Sequences</b> and one named <b>Graphics</b>. Then use the Project panel's search box to find every clip with \"apollo\" in its name, and confirm there are exactly three.", steps: ["Click New Bin twice and rename.", "Type apollo into the Search box at the top of the Project panel.", "Clear the search when done."] },
            { t: "check", html: "Your project <code>practice-edit.fcproj</code> contains all practice clips sorted into bins, and you can read each clip's frame rate and duration." }
          ]
        },
        {
          id: "m3-l2",
          title: "Preview in the Source monitor and mark In and Out points",
          minutes: 13,
          goals: [
            "Open a clip in the Source monitor and move through it without playing.",
            "Set In and Out points to choose the part of a clip you want.",
            "Explain why editors pick selects before they start cutting."
          ],
          assets: ["earth-views", "apollo-broll"],
          blocks: [
            { t: "p", html: "Raw clips are long and mostly not what you want. Editors first decide which part of each clip is worth using, called a <b>select</b>. You do this by setting an <b>In point</b> (where the useful part starts) and an <b>Out point</b> (where it ends) in the <b>Source monitor</b>. When you later add the clip to your edit, only the marked part comes along. The rest of the file is untouched." },
            { t: "callout", kind: "warn", html: "<b>Known quirk:</b> in this build of FilmCraft, the <b>Play</b> button in the <i>Source</i> monitor does nothing, and <kbd>Space</kbd>/<kbd>J</kbd>/<kbd>K</kbd>/<kbd>L</kbd> control the <i>sequence</i> (Program monitor) playback. In the Source monitor, drag along the scrub bar and use the frame-step buttons or arrow keys instead. Mark In, Mark Out and the Go to buttons work normally." },
            { t: "steps", items: [
              { html: "In the Project panel, double-click <code>earth-views</code> (or right-click it and choose <b>Open in Source Monitor</b>).", check: "The <b>Source</b> tab at top left shows the clip. Its name appears in the monitor's header." },
              { html: "Drag the playhead along the scrub bar under the picture, slowly, until you find a stretch you like.", detail: "Scrubbing means dragging through footage to look at it. Reading the picture as you scrub is how editors \"watch\" long clips quickly." },
              { html: "Step to the exact first frame you want using <kbd>Left</kbd> and <kbd>Right</kbd> (or the step buttons), then press <kbd>I</kbd> or click <b>Mark In</b>.", check: "The scrub bar now shows the start of a highlighted In-to-Out region." },
              { html: "Move later in the clip and press <kbd>O</kbd> (or click <b>Mark Out</b>) to set the Out point.", check: "The region between In and Out is highlighted on the scrub bar." },
              { html: "Press <kbd>Shift</kbd>+<kbd>I</kbd> to jump to the In point and <kbd>Shift</kbd>+<kbd>O</kbd> to jump to the Out point.", check: "The playhead snaps to each mark." },
              { html: "To clear the marks, press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd> (Clear In and Out). Press <kbd>X</kbd> to mark the whole clip instead.", detail: "Mark Clip (X) sets In and Out to the clip's first and last frames." }
            ] },
            { t: "keys", items: [
              { keys: "I", action: "Mark In" },
              { keys: "O", action: "Mark Out" },
              { keys: "X", action: "Mark the whole clip" },
              { keys: "Shift+I", action: "Go to In" },
              { keys: "Shift+O", action: "Go to Out" },
              { keys: "Ctrl+Shift+X", action: "Clear In and Out" },
              { keys: "M", action: "Add a marker (a bookmark, not an In or Out)" }
            ] },
            { t: "callout", kind: "tip", html: "Mark In and Out around <b>about 10 to 15 seconds</b> that start on something happening and end before it fades. Short, deliberate selects make the edit lighter and faster in the next module." },
            { t: "h", text: "Look at frames, not just seconds" },
            { t: "p", html: "While you are in the Source monitor, notice the monitor's <b>magnification</b> dropdown (\"Fit\") and the <b>playback resolution</b> dropdown. If a heavy clip plays choppily in the Program monitor, a lower playback resolution speeds up preview without changing your edit or the export." },
            { t: "claude", title: "Try it with Claude: a second opinion on your selects", prompts: [
              { prompt: "Using the live filmcraft server, list all the clips in my project with their durations. Which clips are longer than 60 seconds? For the clip earth-views, tell me how many frames long it is.", why: "Uses project_inspect (and the frame rate) to give durations. It does the arithmetic you would do from timecode and fps. Compare with the Project panel." },
              { prompt: "Open the clip apollo-broll in the Source monitor of the live FilmCraft window and take a screenshot of the Source panel.", why: "Claude can run source.open through command_run, then ui_screenshot with the Source panel. It cannot judge the best in and out points for you, but it can show you what it sees. You make the creative call." }
            ] },
            { t: "quiz", items: [
              { q: "What does setting an In and an Out point in the Source monitor do?", choices: ["Cuts the file on disk", "Chooses the part of the clip that will be used when you add it to the sequence", "Deletes the rest of the clip", "Changes the frame rate"], answer: 1, explain: "Marks are non-destructive. The file on disk never changes, and the unused part stays available." },
              { q: "In this FilmCraft build, how do you look through a clip in the Source monitor?", choices: ["Press its Play button", "Scrub the bar and step by frames", "Press J, K, L and expect the Source to play", "Right-click &gt; Play"], answer: 1, explain: "The Source Play button is currently a no-op, so scrub and step. J, K, L and Space play the sequence." }
            ] },
            { t: "exercise", title: "Three selects", html: "Choose three separate stretches from the Apollo B-roll that each last 5 to 10 seconds and tell a mini-story (for example: a wide shot, a closer shot, a detail). For each, note the In and Out timecode in a text file called <code>selects.txt</code> in your work folder. You will cut them together in the next module.", steps: ["Open apollo-broll in the Source monitor.", "Scrub and set In and Out for each; write the timecodes down (the monitor shows the playhead timecode).", "Save the note and your project."] },
            { t: "check", html: "You can open a clip in the Source monitor, find a good moment by scrubbing and stepping, and set In and Out points around it." }
          ]
        }
      ]
    },
    {
      id: "m4",
      title: "Cutting a sequence",
      summary: "Build a sequence, place clips with Insert and Overwrite, cut and delete without leaving gaps, trim cuts precisely, and manage tracks, snapping and markers.",
      lessons: [
        {
          id: "m4-l1",
          title: "Your first sequence: Insert and Overwrite",
          minutes: 15,
          goals: [
            "Explain what a sequence and a track are.",
            "Put clips on the Timeline by dragging and with the Source monitor's Insert and Overwrite.",
            "Predict what Insert and Overwrite will each do to the clips already there."
          ],
          assets: ["earth-views", "apollo-broll", "apollo-launch", "demo-footage"],
          blocks: [
            { t: "p", html: "The <b>Timeline</b> shows a <b>sequence</b>: your edit, laid out left to right in time. Clips sit on <b>tracks</b>. <b>V1, V2, V3</b> are video tracks, and picture on a higher track covers the picture on lower tracks. <b>A1, A2, A3</b> are audio tracks, and all audio tracks are heard together. A new sequence in FilmCraft starts with 3 video and 3 audio tracks. The vertical blue line is the <b>playhead</b>: it is \"now\"." },
            { t: "callout", kind: "adobe", html: "Premiere users know this as the <b>sequence</b> and the <b>Timeline</b> panel. FilmCraft keeps the same track names, targeting boxes and the same drag-and-drop behavior." },
            { t: "h", text: "Make a sequence from a clip" },
            { t: "steps", items: [
              { html: "In your <code>practice-edit</code> project, make sure the Timeline panel is empty. It will say <i>Drop media here to create sequence.</i>", detail: "Prefer a custom sequence? Click the <b>New Item</b> button in the Project panel and choose <b>Sequence...</b>, or press <kbd>Ctrl</kbd>+<kbd>N</kbd>." },
              { html: "Drag <code>earth-views</code> from the Project panel onto the empty Timeline and release.", check: "FilmCraft creates a sequence and the clip appears on V1 with its sound on A1. The sequence also shows up in the Project panel." },
              { html: "Press <kbd>Home</kbd> to put the playhead at the start, then press <kbd>Space</kbd> to play it.", check: "The Program monitor plays your sequence." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to take the clip off again, so you can place clips the more precise way shown next.", detail: "Undo is free. Experiments cost nothing." }
            ] },
            { t: "h", text: "Insert and Overwrite from the Source monitor" },
            { t: "p", html: "Both buttons add the marked part of the Source clip at the <b>playhead</b> on the <b>targeted tracks</b>. The difference is what happens to clips already there:<ul><li><b>Overwrite</b> (<kbd>.</kbd>) replaces whatever it covers. Total length of your edit does not change (unless you place past the end).</li><li><b>Insert</b> (<kbd>,</kbd>) splits the clip under the playhead and pushes everything after it to the right. Total length grows by the new clip's length.</li></ul>Picture it as a row of books on a shelf: Overwrite is replacing a book with another; Insert is squeezing a new book in and sliding the rest over.</p>" },
            { t: "steps", items: [
              { html: "Double-click <code>apollo-broll</code> in the Project panel and set In and Out points around a 6 to 10 second stretch (<kbd>I</kbd> then <kbd>O</kbd>).", check: "The Source monitor shows the highlighted In-to-Out region." },
              { html: "On the Timeline, look at the left of each track header. The blue box on <b>V1</b> and <b>A1</b> are the source patch and the target. Make sure V1 and A1 are lit (click them to toggle).", detail: "The left blue box is the <b>source patch</b> (where the Source clip's video or audio comes from). The right blue box is the <b>track target</b> (which track receives the edit). A new sequence usually has V1 and A1 lit." },
              { html: "Move the playhead to the end of the first clip, then click the <b>Source monitor</b> button <b>Overwrite</b> (or press <kbd>.</kbd>).", check: "The marked section appears on V1 right after the first clip, with its audio on A1." },
              { html: "Move the playhead into the <i>middle</i> of the first clip and press <kbd>,</kbd> (<b>Insert</b>) with the Source monitor focused.", check: "The first clip is split, the new clip sits in the middle, and everything after moved right. Compare the sequence's end time with before." },
              { html: "Undo (<kbd>Ctrl</kbd>+<kbd>Z</kbd>) and try the same spot with <kbd>.</kbd> (Overwrite).", check: "The new clip replaced part of the first clip; the sequence length did not grow." }
            ] },
            { t: "callout", kind: "tip", html: "Dragging from the Project panel onto the Timeline <b>overwrites</b> by default. Hold <kbd>Ctrl</kbd> while dragging to <b>insert</b> instead. The drop preview shows the word \"Insert\" when it will insert." },
            { t: "keys", items: [
              { keys: ",", action: "Insert (Source monitor)" },
              { keys: ".", action: "Overwrite (Source monitor)" },
              { keys: "Ctrl+drag", action: "Insert instead of overwrite when dragging from the Project panel" },
              { keys: "Home / End", action: "Playhead to start or end of the sequence" }
            ] },
            { t: "callout", kind: "note", html: "<b>Gotcha:</b> Overwrite deletes what is underneath it. If you ever wonder where a clip went, press <kbd>Ctrl</kbd>+<kbd>Z</kbd> and check the History panel." },
            { t: "claude", title: "Try it with Claude: the same assembly", prompts: [
              { prompt: "Using the live filmcraft server, inspect the project, then place the clip earth-views on V1 at 0 seconds, and place apollo-broll on V1 right after it, using only the 20 to 30 second part of apollo-broll. Do not change anything else. Then tell me the total sequence length.", why: "Claude uses project_inspect to find item ids, then timeline.place via command_run (parameters like item, track, time, sourceIn, duration). It then reads the result back with sequence_inspect. Compare the sequence with your hand-built one." },
              { prompt: "Now insert a 5 second piece of apollo-launch into the middle of the first clip (ripple the rest later) and explain how that differs from an overwrite there.", why: "Uses timeline.place with insert true, or the insert command. Look at the Timeline: clips after the insertion point should shift right." }
            ] },
            { t: "quiz", items: [
              { q: "Your sequence is 30 seconds long. You Insert a 5 second clip in the middle. How long is the sequence now?", choices: ["25 seconds", "30 seconds", "35 seconds", "5 seconds"], answer: 2, explain: "Insert pushes everything after it to the right, so the sequence grows by 5 seconds." },
              { q: "The same clip placed with Overwrite on a 30 second sequence, in the middle, makes the sequence:", choices: ["35 seconds", "30 seconds", "25 seconds", "60 seconds"], answer: 1, explain: "Overwrite replaces what is under the new clip, so the length stays 30 seconds as long as you stay within it." },
              { q: "Which track covers the picture of another?", choices: ["V1 over V2", "V3 over V2 over V1", "A1 over V1", "They always blend"], answer: 1, explain: "Higher video tracks cover lower ones, so V3 is on top." }
            ] },
            { t: "exercise", title: "Three-shot assembly", html: "Using the selects you noted in <code>selects.txt</code>, build a 3-shot sequence from <code>apollo-broll</code> using Overwrite from the Source monitor. Then add a fourth shot from <code>earth-views</code> <i>between</i> shots 1 and 2 using Insert.", steps: ["Open apollo-broll in the Source, set In/Out for select 1, play head at 0, Overwrite.", "Repeat for selects 2 and 3 at the end of the previous clip.", "Put the playhead at the cut between 1 and 2, open earth-views, set In/Out, Insert.", "Check the whole thing with Home then Space. Save."] },
            { t: "check", html: "You have a sequence with four shots on V1, built with both Overwrite and Insert, and you can predict which one changes the total length." }
          ]
        },
        {
          id: "m4-l2",
          title: "Cutting and deleting: Razor, Lift, Extract and Ripple Delete",
          minutes: 15,
          goals: [
            "Split a clip in two with the Razor and with Add Edit.",
            "Delete with or without leaving a gap, and say when each is right.",
            "Remove a section of the sequence with Lift and Extract."
          ],
          assets: ["apollo-broll", "earth-views"],
          blocks: [
            { t: "p", html: "Editing is mostly <b>cutting and removing</b>. Three ideas keep it tidy: <b>split</b> a clip at the right frame, <b>delete</b> the part you do not want, and decide whether the hole it leaves should stay (a <b>gap</b>) or close up (a <b>ripple</b>)." },
            { t: "h", text: "Split a clip" },
            { t: "steps", items: [
              { html: "Move the playhead onto a clip on V1 where something changes (use <kbd>Right</kbd> to step frame by frame).", check: "The playhead line crosses the clip." },
              { html: "Press <kbd>C</kbd> to pick the <b>Razor</b> tool. Click on the clip right at the playhead line.", detail: "With snapping on (the magnet-like button on the Timeline toolbar, <kbd>S</kbd>) the Razor snaps to the playhead for you.", check: "The clip splits into two clips, with a thin cut between them." },
              { html: "Press <kbd>V</kbd> to go back to the <b>Selection</b> tool. Press <kbd>Ctrl</kbd>+<kbd>Z</kbd> to undo the cut.", detail: "Always return to the Selection tool (V) after a cut; many mistakes come from clicking with the Razor still active." },
              { html: "Now split without the Razor: put the playhead at the same spot, make sure V1 and A1 are targeted, and press <kbd>Ctrl</kbd>+<kbd>K</kbd> (<b>Add Edit</b>).", check: "Both the picture and its linked sound are cut at the playhead." }
            ] },
            { t: "h", text: "Delete: gap or no gap?" },
            { t: "steps", items: [
              { html: "Click the second half of the split clip to select it. Press <kbd>Backspace</kbd> (Edit &gt; Clear).", check: "The clip disappears and leaves an empty <b>gap</b> where it was. Everything after it stays put." },
              { html: "Undo, then with the clip still selected press <kbd>Shift</kbd>+<kbd>Delete</kbd> (<b>Ripple Delete</b>).", check: "The clip disappears <i>and</i> everything after it slides left to close the hole." }
            ] },
            { t: "callout", kind: "tip", html: "<b>Backspace</b> leaves a gap, and gaps are useful when you want a pause or a placeholder. <b>Ripple Delete</b> is what you want 90 percent of the time: it removes the section from the story completely." },
            { t: "h", text: "Remove a time range: Lift and Extract" },
            { t: "p", html: "Instead of selecting clips you can mark a <i>range of time</i> and remove everything in it from all targeted tracks. <b>Lift</b> removes it and leaves a gap; <b>Extract</b> removes it and closes the gap. They are the range versions of Backspace and Ripple Delete." },
            { t: "steps", items: [
              { html: "Click the Program monitor so it has focus. Put the playhead at the start of what you want to remove and press <kbd>I</kbd>. Move later and press <kbd>O</kbd>.", check: "The ruler of the Timeline shows a shaded region between In and Out." },
              { html: "Press <kbd>'</kbd> (apostrophe) for <b>Extract</b>. Check that the shaded range is gone and the sequence is shorter.", detail: "The Program monitor has Lift and Extract buttons too; hover over them to read their tooltips." },
              { html: "Undo, then press <kbd>;</kbd> (semicolon) for <b>Lift</b>.", check: "The same range is removed, but an empty gap remains." },
              { html: "Undo, and clear the marks with <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>X</kbd>." }
            ] },
            { t: "keys", items: [
              { keys: "C", action: "Razor tool" },
              { keys: "V", action: "Selection tool" },
              { keys: "Ctrl+K", action: "Add Edit at the playhead (targeted tracks)" },
              { keys: "Ctrl+Shift+K", action: "Add Edit to all tracks" },
              { keys: "Backspace", action: "Clear (delete, leaves a gap)" },
              { keys: "Shift+Delete", action: "Ripple Delete (delete and close the gap)" },
              { keys: ";", action: "Lift (remove the In-Out range, leave a gap)" },
              { keys: "'", action: "Extract (remove the In-Out range, close the gap)" }
            ] },
            { t: "callout", kind: "note", html: "The physical <kbd>Delete</kbd> key is not bound to Clear in FilmCraft's default shortcuts (only in the Premiere Pro Compatible preset under Edit &gt; Keyboard Shortcuts). Use <kbd>Backspace</kbd> or the Edit menu." },
            { t: "claude", title: "Try it with Claude: cut by timecode", html: "Save a copy first (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>). Doing this by hand takes six clicks; asking is quicker when you know the exact times.", prompts: [
              { prompt: "Using the live filmcraft server, split the clip on V1 that is under the 8 second mark exactly at 8 seconds, then ripple delete the second half so the clips after it move left. Show me sequence_inspect before and after.", why: "Claude runs timeline.razor (or sequence.addEdit) then edit.rippleDelete with command_run, bracketing it with sequence_inspect. You should see the same result as your Ctrl+K and Shift+Delete sequence." },
              { prompt: "If there is any empty gap on V1 now, close it, and tell me which command you used.", why: "Uses sequence.closeGap, which needs a track (V1) and a time inside the gap. Beginners rarely need it because Ripple Delete avoids gaps, but it is useful for cleaning up." }
            ] },
            { t: "quiz", items: [
              { q: "You delete a clip from the middle of a sequence and want the later clips to slide left to fill the space. Which do you use?", choices: ["Backspace", "Shift+Delete (Ripple Delete)", "Lift", "Razor"], answer: 1, explain: "Ripple Delete closes the gap. Backspace and Lift leave it." },
              { q: "What is the range-based way to remove everything between two points and close the gap?", choices: ["Lift", "Extract", "Razor", "Mark Clip"], answer: 1, explain: "Extract removes the In-Out range and closes the gap; Lift leaves a gap." }
            ] },
            { t: "exercise", title: "Tighten it", html: "Take your 4-shot sequence and cut at least 1 second off the front and end of every shot using the Razor and Ripple Delete, so each shot starts on action. Then use In/Out and Extract to remove one whole dull middle section. Save when it plays smoothly.", steps: ["Split each shot twice near its edges (C, click, V).", "Select each unwanted end piece and press Shift+Delete.", "Mark a boring range with I and O on the Program monitor and press '.", "Press Home, then Space, and watch for jumps."] },
            { t: "check", html: "You can split a clip two ways, delete with and without a gap, and use Lift and Extract on an In-Out range." }
          ]
        },
        {
          id: "m4-l3",
          title: "Trimming cuts precisely: ripple, rolling, slip and slide",
          minutes: 15,
          goals: [
            "Adjust where a cut happens without re-doing the edit.",
            "Choose between a regular trim, ripple, rolling, slip and slide.",
            "Switch tools from the keyboard."
          ],
          assets: ["apollo-broll", "demo-footage"],
          blocks: [
            { t: "p", html: "A rough cut gets its quality from <b>trimming</b>: nudging each cut earlier or later by a few frames until the pacing feels right. A <b>cut</b> is also called an <b>edit point</b>. Each clip carries extra footage beyond what you see, called <b>handles</b> (the unused material outside In and Out). Trimming reveals or hides handles. You cannot trim a clip longer than its handle allows." },
            { t: "p", html: "Use your 4-shot sequence. Each trim below changes only one thing, which is why it is worth learning them separately:" },
            { t: "p", html: "<ul><li><b>Regular trim</b> (Selection tool, drag an edge): changes one clip's length. Shortening leaves a gap; lengthening can cover what is next.</li><li><b>Ripple Edit</b> (<kbd>B</kbd>): drag an edge; <i>everything after shifts</i> to fill or open the gap. The whole sequence gets shorter or longer.</li><li><b>Rolling Edit</b> (<kbd>N</kbd>): drag the cut <i>between two clips</i>; one gets longer while the other gets shorter. The sequence length does not change.</li><li><b>Slip</b> (<kbd>Y</kbd>): drag inside a clip; the clip stays put but shows a <i>different part</i> of its source.</li><li><b>Slide</b> (<kbd>U</kbd>): drag a clip; it moves in the sequence while its neighbors adjust, so the length stays the same.</li></ul>" },
            { t: "steps", items: [
              { html: "Press <kbd>V</kbd>. Hover over the right edge of the second clip until the cursor changes, then drag it left a little.", check: "The clip shortens and leaves a gap. Undo." },
              { html: "Press <kbd>B</kbd> (Ripple Edit). Drag the same edge left.", check: "The clip shortens and everything after it moves left. The sequence got shorter. Undo." },
              { html: "Press <kbd>N</kbd> (Rolling Edit). Drag the cut between clip 2 and clip 3 slightly.", check: "One side grows and the other shrinks by the same amount; the total length is unchanged. Undo." },
              { html: "Press <kbd>Y</kbd> (Slip). Click and drag sideways inside clip 2.", check: "The clip's start and end on the Timeline do not move, but the picture inside changes as you drag." },
              { html: "Press <kbd>U</kbd> (Slide). Drag clip 2 a little sideways.", detail: "Slide needs neighbors with handles to absorb the change. If nothing moves, there is no extra footage to slide into.", check: "Clip 2 moves while the clips on either side change their lengths. Undo." },
              { html: "Press <kbd>V</kbd> to return to the Selection tool." }
            ] },
            { t: "h", text: "Keyboard trimming" },
            { t: "keys", items: [
              { keys: "V", action: "Selection tool" },
              { keys: "B", action: "Ripple Edit tool" },
              { keys: "N", action: "Rolling Edit tool" },
              { keys: "Y", action: "Slip tool" },
              { keys: "U", action: "Slide tool" },
              { keys: "Q", action: "Ripple trim previous edit to the playhead" },
              { keys: "W", action: "Ripple trim next edit to the playhead" },
              { keys: "E", action: "Extend selected edit to the playhead" },
              { keys: "Alt+Left / Alt+Right", action: "Trim selected edit backward or forward by one frame" }
            ] },
            { t: "callout", kind: "tip", html: "<b>Q and W</b> are the fastest trims in editing: play, stop where you want a clip to end, press <kbd>Q</kbd> or <kbd>W</kbd>. They cut to the playhead and close the gap in one press." },
            { t: "callout", kind: "warn", html: "<kbd>Ctrl</kbd>+<kbd>T</kbd> is bound twice (Toggle Trim Type and New Text Layer) because FilmCraft folds Ctrl and Cmd together on Windows. Do not rely on it; use the menus for those." },
            { t: "callout", kind: "adobe", html: "Premiere tutorials talk about the <b>Trim monitor</b> and dynamic trimming with J, K, L. FilmCraft has both (select an edit and press <kbd>Shift</kbd>+<kbd>T</kbd>), but you can do a lot with just the tools above." },
            { t: "claude", title: "Try it with Claude: trims by number", prompts: [
              { prompt: "Using the live filmcraft server, inspect the sequence. Then roll the cut between the first and second clip on V1 later by 12 frames. Tell me the new start and end frames of both clips and take a render_frame of the new cut point.", why: "Uses timeline.roll through command_run (parameters: the left and right clip ids and deltaFrames). Claude confirms with sequence_inspect and looks at the frame. Compare to what N does by hand." },
              { prompt: "Slip the third clip by 20 frames so it starts later in its source, without changing its place or length on the Timeline.", why: "Uses timeline.slip. The clip stays put but the sourceIn value in sequence_inspect changes. Great for double-checking what Slip did." }
            ] },
            { t: "quiz", items: [
              { q: "You want the overall sequence length to stay the same while moving where one shot ends and the next begins. Which trim?", choices: ["Ripple Edit", "Rolling Edit", "Razor", "Regular trim followed by Ripple Delete"], answer: 1, explain: "Rolling Edit moves the cut between two clips. One gets longer and the other shorter, so the total is the same." },
              { q: "Slip changes...", choices: ["Which part of the source a clip shows, without moving it", "The speed", "The volume", "The track"], answer: 0, explain: "Slip keeps the clip in the same position and length on the Timeline and changes the source section it shows." },
              { q: "Why might you be unable to extend a clip's edge?", choices: ["Handles are used up; there is no more source footage", "Your mouse is broken", "Snap is on", "The clip is audio"], answer: 0, explain: "A clip can only be extended into the media that exists beyond its In or Out points." }
            ] },
            { t: "exercise", title: "Fix the pacing", html: "Play your sequence and find two cuts that feel wrong (a shot lingers, or a cut lands too early). Fix one with a Rolling Edit and the other with Ripple Edit plus the <kbd>Q</kbd> or <kbd>W</kbd> keys. Save a copy before and after (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>) and compare.", steps: ["Play with Space; stop at the problem.", "Pick the tool that fits (N for moving the cut, B or Q/W for shortening).", "Play again and listen to the rhythm.", "Save."] },
            { t: "check", html: "You can name the five trim types and choose the one that changes only what you want changed." }
          ]
        },
        {
          id: "m4-l4",
          title: "Tracks, targeting, snapping, linked clips and markers",
          minutes: 14,
          goals: [
            "Use the track header buttons: lock, visibility, mute, solo and targeting.",
            "Control snapping and linked selection.",
            "Add and navigate markers."
          ],
          assets: ["apollo-broll", "earth-views", "demo-project"],
          blocks: [
            { t: "p", html: "As an edit grows you need to control <b>which tracks respond</b> to your actions. Each track header has a handful of switches. Hover over each to read its tooltip." },
            { t: "image", src: "../filmcraft/docs/images/filmcraft-timeline.png", alt: "FilmCraft Timeline with tracks V1 to V3 and A1 to A3, a playhead, markers on the ruler, and audio meters at right.", caption: "Timeline close-up (different footage than yours): blue boxes at the left of each track are the source patch and track target; below, each audio track has M (mute), S (solo) and a mic." },
            { t: "p", html: "<ul><li><b>Lock</b> (padlock): a locked track cannot be changed. Lock V1 to stop yourself ruining it while you work above.</li><li><b>Toggle Track Output</b> (eye, on video tracks): shows or hides the track in the Program monitor.</li><li><b>Mute Track</b> (<b>M</b>) and <b>Solo Track</b> (<b>S</b>) on audio tracks.</li><li><b>Source patch and track target</b> (blue boxes): which tracks receive an Insert, Overwrite or Add Edit.</li><li><b>Sync Lock</b>: keeps the tracks aligned when a ripple edit happens on another track.</li></ul>" },
            { t: "steps", items: [
              { html: "Drag <code>earth-views</code> from the Project panel and drop it onto track <b>V2</b>, over the start of your edit.", check: "The picture on V2 covers V1 in the Program monitor." },
              { html: "Click the <b>eye</b> on V2.", check: "The Program monitor now shows V1 again. Click it again to restore." },
              { html: "Click the <b>padlock</b> on V1, then try to drag a clip on V1.", check: "Nothing moves. Unlock it." },
              { html: "On A1 click <b>M</b> (mute), play, and notice the silence. Click <b>S</b> (solo) on A1 and play: only that track is heard. Turn both off.", detail: "Mute silences one track. Solo silences all the others." }
            ] },
            { t: "h", text: "Snapping and linked selection" },
            { t: "p", html: "<b>Snapping</b> (<kbd>S</kbd>, the horseshoe/magnet-style button in the Timeline toolbar) makes clips and the playhead jump magnetically to other clip edges, markers and the playhead. It keeps edits frame-perfect with no gaps, so leave it on for editing and turn it off for rare fine nudges. <b>Linked Selection</b> (a toolbar button) means that clicking a video clip also selects the audio recorded with it, so they move and cut together." },
            { t: "steps", items: [
              { html: "Drag a clip close to another clip's edge, with snap on.", check: "It clicks into place against the neighbor." },
              { html: "Press <kbd>S</kbd> to toggle snapping and drag again.", check: "Now it does not click, and you can leave a one-frame gap by accident. Press <kbd>S</kbd> again to turn it back on." },
              { html: "With the Selection tool, click a video clip that has sound on A1, then drag it a little to the side.", detail: "With Linked Selection on, clicking the picture also selects its sound, so they move together. Turn Linked Selection off in the toolbar if you ever need to move the sound alone. Undo afterwards.", check: "Both the picture and its audio are highlighted and move as one." }
            ] },
            { t: "h", text: "Markers" },
            { t: "steps", items: [
              { html: "Play, and press <kbd>M</kbd> at moments you want to remember: a beat of the music, a place for a title.", check: "Flags appear on the ruler. Also open the <b>Markers</b> tab to see them listed." },
              { html: "Press <kbd>Shift</kbd>+<kbd>M</kbd> to jump to the next marker and <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>M</kbd> to jump to the previous one.", check: "The playhead hops from marker to marker." },
              { html: "Zoom the Timeline in and out with <kbd>=</kbd> and <kbd>-</kbd>, and press <kbd>\\</kbd> to fit the whole sequence." }
            ] },
            { t: "callout", kind: "note", html: "FilmCraft has no dialog for naming or coloring a marker by hand. A marker made with <kbd>M</kbd> is a plain bookmark. Claude can give markers names, comments and colors with the command <code>markers.edit</code> or when it adds them with <code>markers.add</code>, which is a good job to hand it." },
            { t: "claude", title: "Try it with Claude: label the edit", prompts: [
              { prompt: "Using the live filmcraft server, go through my active sequence and add a named marker at the start of every clip on V1, using the clip's name as the marker name and a different color for each. Then list them with their times.", why: "Claude reads clips with sequence_inspect, then calls markers.add (name, seconds, color) for each, probably as a command_batch. Check the Markers panel and the Timeline ruler. This is the kind of boring work worth automating." },
              { prompt: "Lock V1 and mute A2 on the live sequence, then take a screenshot of the Timeline so I can check the track header switches.", why: "Claude may use the ui_click tool on element ids from ui_elements, or commands. It takes a ui_screenshot of the Timeline. Compare with your own header switches." }
            ] },
            { t: "quiz", items: [
              { q: "You mute audio track A1. What happens?", choices: ["The clips on A1 are deleted", "A1 is silent; other audio tracks still play", "All audio is silent", "The picture goes black"], answer: 1, explain: "Mute silences just that track. Solo is the opposite: only soloed tracks play." },
              { q: "Why leave snapping on?", choices: ["It makes the video brighter", "It makes clips and the playhead click against edges, avoiding accidental one-frame gaps", "It locks the tracks", "It saves the file"], answer: 1, explain: "Snapping keeps edits tight and frame-aligned." }
            ] },
            { t: "exercise", title: "Layers and labels", html: "Put a clip on V2 that covers only the middle third of your edit, lock V1, and add four markers at the cuts. Then hide V2 with its eye, play the sequence, then show it and play again. Finally, save and write one sentence about what each switch you used does.", steps: ["Drop earth-views on V2 and shorten it with the Razor and Ripple Delete.", "Lock V1; add markers with M.", "Toggle the eye and play.", "Save."] },
            { t: "check", html: "You can layer clips on V1 and V2, use lock, eye, mute and solo, keep snapping on, and navigate with markers. You have a rough cut saved in <code>practice-edit.fcproj</code>." }
          ]
        }
      ]
    },
    {
      id: "m5",
      title: "Transitions and speed",
      summary: "Learn when to use a transition and when a plain cut is better, add dissolves and dips, and change clip speed for slow motion, time-lapse and reverse.",
      lessons: [
        {
          id: "m5-l1",
          title: "Transitions: dissolves, dips and when not to use them",
          minutes: 13,
          goals: [
            "Say what a transition does and why most cuts should stay plain.",
            "Apply a Cross Dissolve and other transitions from the Effects panel.",
            "Understand why a transition needs extra footage (handles) on both sides."
          ],
          assets: ["apollo-broll", "earth-views"],
          blocks: [
            { t: "p", html: "A plain <b>cut</b> jumps from one shot to the next instantly. A <b>transition</b> blends the two over a short time. Cuts feel natural; the eye accepts them as \"we are now looking somewhere else\". A transition says something extra: a <b>Cross Dissolve</b> suggests time passing or a gentle link, a <b>Dip to Black</b> suggests an ending or a chapter break, and a <b>Push</b> or <b>Wipe</b> is a stylistic flourish. Beginners over-use transitions. A good rule: <i>cut by default, dissolve with a reason</i>." },
            { t: "callout", kind: "note", html: "A transition overlaps the end of one clip with the start of the next, so each clip needs a few frames of <b>handle</b> (unused source beyond its In or Out). If a clip has no extra footage at the cut, the transition cannot be applied properly, or it uses a frozen frame." },
            { t: "steps", items: [
              { html: "Open the <b>Effects</b> panel (bottom-left tab group, or press <kbd>Shift</kbd>+<kbd>7</kbd>).", check: "You see a searchable list of effects grouped into video effects, video transitions, audio effects and audio transitions." },
              { html: "Type <b>dissolve</b> into the panel's search box.", check: "<b>Cross Dissolve</b> (and other dissolves) appear in the results." },
              { html: "Drag <b>Cross Dissolve</b> from the list onto a clip near the cut you want. Drop it near the left or right edge of the clip.", detail: "FilmCraft applies a dragged transition to the <i>nearer edge</i> of the clip you drop it on: close to the clip's start for its in-edge, close to the end for its out-edge. You can also select a clip and double-click the effect in the list.", check: "A transition shape appears on the clip's edge on the Timeline." },
              { html: "Move the playhead before the cut and press <kbd>Space</kbd>.", check: "One shot gently melts into the next." },
              { html: "Undo and try a different one: search <b>dip</b> or <b>push</b>, and apply it the same way. Play it and compare.", check: "You can describe how the three feel different." }
            ] },
            { t: "keys", items: [
              { keys: "Ctrl+D", action: "Apply video transition (to the selected edit)" },
              { keys: "Ctrl+Shift+D", action: "Apply audio transition (for example a crossfade on the sound)" },
              { keys: "Shift+D", action: "Apply the default transitions" },
              { keys: "Enter", action: "Render effects from In to Out" }
            ] },
            { t: "h", text: "The render bar" },
            { t: "p", html: "On the Timeline ruler a thin line shows whether a stretch will play smoothly. <b>Green</b> is already prepared, <b>yellow</b> is probably fine in real time, and <b>red</b> means FilmCraft may stutter. Pressing <kbd>Enter</kbd> renders (pre-calculates) the effects between your In and Out points so playback is smooth. This affects only your preview, not the final export quality." },
            { t: "callout", kind: "tip", html: "Do not put a transition on every cut. In a 30-second video, one or two well-placed dissolves and a dip to black at the end have more impact than eight of them." },
            { t: "callout", kind: "note", html: "This build has no obvious field for typing an exact transition length after it is applied. The default length is fine to start; if you need a precise duration (for example exactly 24 frames), ask Claude (see below)." },
            { t: "claude", title: "Try it with Claude: exact dissolves", prompts: [
              { prompt: "Using the live filmcraft server, apply a Cross Dissolve of exactly 24 frames at the cut between the first and second clip on V1. Then render a frame at the middle of the dissolve and tell me what you see.", why: "Claude uses sequence.applyVideoTransition (parameters: clip, effect, frames, edge) via command_run, then render_frame at the cut time. The frame should show a blend of both shots. Compare with your hand-applied one." },
              { prompt: "At the same cut, replace the dissolve with Dip to Black of 12 frames, render the middle frame and compare the two for me.", why: "Claude undoes or replaces, applies a different transition and renders again. Watch the Timeline and History. Look at both screenshots as an editor: which mood fits your story?" }
            ] },
            { t: "quiz", items: [
              { q: "Which statement is the best editing advice?", choices: ["Use a different fancy transition on every cut", "Cut by default; use a dissolve when time passes or two ideas should blend", "Never cut, always dissolve", "Use Push for every cut"], answer: 1, explain: "Plain cuts feel natural. Save transitions for moments where the blend says something." },
              { q: "Why might a transition not work at a cut?", choices: ["The clip has no extra footage (handles) beyond the cut", "The playhead is too far left", "The clip is too bright", "The audio is loud"], answer: 0, explain: "A transition overlaps the clips, so each needs footage beyond the cut. Trim your clips so you leave handles." }
            ] },
            { t: "exercise", title: "Story with reasons", html: "In your sequence, add exactly one Cross Dissolve and one Dip to Black. Write one sentence for each in a note describing why that cut deserves it. If you can't justify it, remove it.", steps: ["Pick cuts where time or place changes.", "Apply, play, decide.", "Remove any that do not earn their place."] },
            { t: "check", html: "You can apply a dissolve and a dip, explain why handles are needed, and decide when to leave a cut alone." }
          ]
        },
        {
          id: "m5-l2",
          title: "Speed: slow motion, fast motion and reverse",
          minutes: 13,
          goals: [
            "Change a clip's speed from the Speed/Duration dialog and with the Rate Stretch tool.",
            "Predict how speed changes duration and smoothness.",
            "Reverse a clip."
          ],
          assets: ["earth-views", "apollo-broll"],
          blocks: [
            { t: "p", html: "<b>Speed</b> is a percentage: <b>100%</b> is normal, <b>50%</b> is half speed (slow motion), <b>200%</b> is double speed. Duration and speed are linked: <b>half the speed means twice the duration</b>. Real slow motion looks smooth only if the camera shot extra frames (for example 60 fps footage played at 24 fps). If your clip is 24 or 30 fps, slowing it down has to <i>invent</i> frames by repeating or blending, which can look stuttery. That is why slow motion is best planned when shooting." },
            { t: "steps", items: [
              { html: "Select a clip on V1 (click it).", check: "The clip is highlighted." },
              { html: "Choose <b>Clip &gt; Speed/Duration...</b> or press <kbd>Ctrl</kbd>+<kbd>R</kbd>.", check: "The <b>Clip Speed / Duration</b> dialog opens with <b>Speed</b> and <b>Duration</b> fields, a <b>Reverse Speed</b> checkbox, and <b>Ripple Edit, Shifting Trailing Clips</b>." },
              { html: "Set <b>Speed</b> to <code>50</code> and leave <b>Ripple Edit, Shifting Trailing Clips</b> ticked. Press OK.", detail: "Ripple Edit makes the later clips slide right to make room for the now-longer clip. If you leave it unticked, the slower clip can overwrite what follows, or fit into the space and show less footage.", check: "The clip is now twice as long on the Timeline, and the clips after it moved to the right." },
              { html: "Play it. Then undo (<kbd>Ctrl</kbd>+<kbd>Z</kbd>) and try <code>200</code>.", check: "At 200 percent the clip is half as long and motion is fast and choppy." },
              { html: "Open the dialog again, tick <b>Reverse Speed</b> with Speed at 100, and press OK.", check: "The shot plays backward. Great for a funny \"un-spill\" or a surreal effect." },
              { html: "Undo that. Press <kbd>R</kbd> for the <b>Rate Stretch</b> tool and drag the right edge of a clip to make it shorter or longer.", detail: "Rate Stretch lets you say \"this shot must fill exactly this much time\" and FilmCraft changes the speed to fit." }
            ] },
            { t: "callout", kind: "warn", html: "When you change speed, the clip's sound changes too (slower and lower, or faster and higher). Most editors mute or replace the audio of a speed-changed shot and add music or sound effects instead." },
            { t: "callout", kind: "adobe", html: "Premiere users will recognize <b>Speed/Duration</b> (<kbd>Ctrl</kbd>+<kbd>R</kbd>), <b>Rate Stretch</b> (<kbd>R</kbd>) and <b>Time Remapping</b> (the speed keyframes in Effect Controls). FilmCraft has a Time Remapping section in Effect Controls too. Keyframes, the idea behind speed ramps, are the subject of the next module." },
            { t: "keys", items: [
              { keys: "Ctrl+R", action: "Speed/Duration dialog" },
              { keys: "R", action: "Rate Stretch tool" }
            ] },
            { t: "claude", title: "Try it with Claude: speed and smoothness", prompts: [
              { prompt: "Using the live filmcraft server, set the speed of the first clip on V1 to 50% with ripple on, then tell me its new duration in seconds and frames. Explain why slowing 30 fps footage to 50% might look less smooth than 60 fps footage would.", why: "Claude runs clip.speedDuration (speed, ripple; interpolation can be frameSampling, frameBlending or opticalFlow) and reads clip details back with sequence_inspect (speed field, durations). It then explains frame interpolation. Compare the duration with what the dialog gave." },
              { prompt: "Try the opticalFlow interpolation on that same clip and render a frame in the middle of the clip. Tell me how it differs from frameBlending.", why: "Same command with a different interpolation value, then render_frame. Looking at the frame helps, but the real judgment is yours. Optical flow is the most expensive method, and FilmCraft renders effects on the CPU, so expect it to be slower." }
            ] },
            { t: "quiz", items: [
              { q: "A 10 second clip is set to 50% speed with ripple. How long is it now?", choices: ["5 seconds", "10 seconds", "20 seconds", "50 seconds"], answer: 2, explain: "Half the speed doubles the duration." },
              { q: "Why can slow motion look stuttery?", choices: ["The monitor is dirty", "There are not enough source frames, so frames must be repeated or blended", "Slow motion is always stuttery", "The audio is too quiet"], answer: 1, explain: "Real slow motion needs extra frames from the camera. Otherwise the editor repeats or blends existing frames." }
            ] },
            { t: "exercise", title: "Speed ramp, by hand", html: "Split a long clip into three parts with the Razor. Make the middle part 50 percent and the outer parts 100 percent. Play it and decide whether the changes of pace feel smooth or jarring. Then try making the first part 150 percent instead.", steps: ["C, click twice; V.", "Select the middle clip, Ctrl+R, 50.", "Press Space and judge.", "Undo or continue."] },
            { t: "check", html: "You have changed a clip's speed, seen the duration change with it, and tried reverse and Rate Stretch." }
          ]
        }
      ]
    },
    {
      id: "m6",
      title: "Keyframes and motion",
      summary: "Understand keyframes, then use them to zoom, pan, fade and build a picture-in-picture, with easing so motion feels natural.",
      lessons: [
        {
          id: "m6-l1",
          title: "What a keyframe is: Effect Controls and Motion",
          minutes: 15,
          goals: [
            "Explain what a keyframe is and why two of them make movement.",
            "Find a clip's Motion and Opacity settings in Effect Controls.",
            "Turn on animation for a setting and add keyframes safely."
          ],
          assets: ["earth-views", "demo-footage"],
          blocks: [
            { t: "p", html: "A <b>setting</b> (also called a <b>property</b> or <b>parameter</b>) is a number that controls something about a clip: its size, position, brightness, volume. Normally a setting has one value for the whole clip. A <b>keyframe</b> is a value <i>stored at a particular moment</i>. Put one keyframe at 0 seconds saying \"size 100\" and another at 4 seconds saying \"size 130\", and FilmCraft works out every size in between. That calculated in-between is called <b>interpolation</b>. Two keyframes are all it takes to make something move, grow, fade or change color over time." },
            { t: "callout", kind: "adobe", html: "Everything here follows Premiere's <b>Effect Controls</b> panel: Motion, Opacity, Time Remapping, then every effect you add. The stopwatch icon turns animation on for a setting, and the diamond adds or removes a keyframe at the playhead." },
            { t: "h", text: "Look at the settings" },
            { t: "steps", items: [
              { html: "Put a clip on V1 (the earth-views clip from your sequence is fine) and click it so it is selected.", check: "The clip is highlighted in the Timeline." },
              { html: "Open <b>Effect Controls</b> with <kbd>Shift</kbd>+<kbd>5</kbd>.", check: "You see sections <b>Motion</b>, <b>Opacity</b> and <b>Time Remapping</b>, and any effects on the clip. The right side of the panel has a mini timeline for the clip." },
              { html: "Expand <b>Motion</b>. Find <b>Position</b>, <b>Scale</b>, <b>Rotation</b> and <b>Anchor Point</b>.", detail: "For a 1920x1080 sequence, Position 960, 540 is the centre of the frame. Scale 100 means the clip's normal size. Anchor Point is the pivot that scale and rotation happen around." },
              { html: "Change <b>Scale</b> to <code>130</code> by double-clicking the number and typing it, or by dragging the number sideways.", check: "The picture in the Program monitor grows and some of it crops off the edges." },
              { html: "Click the small circular-arrow <b>Reset Effect</b> icon on the Motion row.", check: "Motion returns to its defaults." }
            ] },
            { t: "h", text: "Make something move" },
            { t: "steps", items: [
              { html: "Move the playhead to the very start of the clip (<kbd>Home</kbd> if it is the first clip, or the clip's first frame). Click the <b>stopwatch</b> beside <b>Scale</b> (its tooltip says Toggle animation).", detail: "Turning the stopwatch on creates the first keyframe at the playhead using the current value, and from then on the setting is animated.", check: "A keyframe diamond appears for Scale at the playhead position in the panel's mini timeline." },
              { html: "Move the playhead about 4 seconds later. Change <b>Scale</b> to <code>130</code>.", check: "A second keyframe appears automatically because animation is on." },
              { html: "Press <kbd>Home</kbd> and play (<kbd>Space</kbd>).", check: "The picture slowly grows from normal size to 130 percent." },
              { html: "Use the arrows beside the Scale keyframe diamond to jump to the previous or next keyframe, and the diamond itself (tooltip: Add/Remove Keyframe) to delete or add one at the playhead.", detail: "Keyframes can also be dragged sideways in the mini timeline to change their timing." }
            ] },
            { t: "callout", kind: "warn", html: "<b>The stopwatch matters.</b> With it <i>off</i>, changing a value changes the <i>whole clip</i>. With it <i>on</i>, changing a value at the playhead sets a keyframe <i>at that moment only</i>. Many beginner confusions come from forgetting which state a setting is in." },
            { t: "claude", title: "Try it with Claude: keyframes by the numbers", prompts: [
              { prompt: "Using the live filmcraft server, inspect the clip I have selected on V1. Then animate its Scale from 100 at its first frame to 130 four seconds later. Tell me which commands you used.", why: "Claude uses effects.toggleAnimation or effects.setKeyframe and effects.setParam (parameters clip, effect Motion, param Scale, value, time) via command_run, after command_list to confirm ids. The mini timeline in Effect Controls should show two diamonds, just like yours." },
              { prompt: "Take render_frame screenshots at the clip's start, middle and end and tell me if the zoom looks smooth.", why: "Three render_frame calls at different seconds. Claude can compare size differences but cannot feel the smoothness; play it yourself." }
            ] },
            { t: "quiz", items: [
              { q: "What is a keyframe?", choices: ["A cut between two clips", "A setting's value stored at a specific time, from which FilmCraft interpolates", "A marker on the ruler", "An audio effect"], answer: 1, explain: "Keyframes store values at times. FilmCraft calculates everything between them." },
              { q: "The stopwatch on Scale is off. You change Scale to 150 at 3 seconds in. What happens?", choices: ["A keyframe is made at 3 seconds", "The whole clip gets Scale 150", "Nothing", "The clip splits"], answer: 1, explain: "With animation off, the value applies to the whole clip. Turn the stopwatch on to animate." },
              { q: "How many keyframes do you need to create movement?", choices: ["One", "Two", "Ten", "Zero"], answer: 1, explain: "Two keyframes with different values give FilmCraft something to interpolate between." }
            ] },
            { t: "check", html: "You can open Effect Controls, change Motion values, turn on a stopwatch and see a clip zoom between two keyframes." }
          ]
        },
        {
          id: "m6-l2",
          title: "Slow zoom, pan and easing: the Ken Burns move",
          minutes: 15,
          goals: [
            "Animate Scale and Position together to move across a still.",
            "Choose an interpolation type so motion eases in and out.",
            "Read a value graph in Effect Controls."
          ],
          assets: ["still-photo", "earth-views"],
          blocks: [
            { t: "p", html: "A photograph on screen is dead. The <b>Ken Burns effect</b> (a slow zoom and drift across a still) brings it to life, and it is the classic first use of keyframes. It combines <b>Scale</b> and <b>Position</b> animation. The other key idea is <b>easing</b>: real objects speed up and slow down gradually, but plain (<b>linear</b>) interpolation moves at a constant speed and feels mechanical." },
            { t: "steps", items: [
              { html: "Import <code>still-photo</code> if it is not in your project yet. Drag it onto <b>V2</b> in your sequence at the start (with Ctrl held, to insert, if you prefer).", detail: "A still has no duration of its own, so FilmCraft gives it a default length on the Timeline. Drag the right edge of the clip to make it about 6 seconds." },
              { html: "Select the still. In Effect Controls, scrub to its first frame and turn on the stopwatch for <b>Scale</b> and <b>Position</b>.", check: "Both rows show a keyframe at the start." },
              { html: "Move to the last frame. Set <b>Scale</b> to <code>115</code> and change <b>Position</b> a little (for example 960 changed to 900 on the first number).", check: "Each now has two keyframes. Play: the photo drifts and grows." },
              { html: "Right-click the first keyframe of Scale. In the menu, find <b>Temporal Interpolation</b> and choose <b>Ease Out</b>. Right-click the last keyframe and choose <b>Ease In</b>.", detail: "The options are Linear, Bezier, Auto Bezier, Continuous Bezier, Hold, Ease In and Ease Out. <b>Hold</b> keeps the value constant until the next keyframe, then jumps (useful for on and off). <b>Ease In/Out</b> slows the motion as it arrives or leaves.", check: "Play again. The start and end of the move are gentler." },
              { html: "Click the small twirl beside the Scale name (its tooltip says Show graphs) to display the value and velocity graphs.", check: "A curve appears showing how the value changes over time. With easing, the curve flattens near the ends." }
            ] },
            { t: "callout", kind: "tip", html: "Subtle wins. A Ken Burns move that takes the Scale from 100 to 110 or 115 over several seconds feels cinematic. A zoom to 200 in two seconds feels like a mistake." },
            { t: "callout", kind: "note", html: "Scale and Position are in the <b>Motion</b> effect: Position is in pixels for your sequence size. If your photo is bigger than the frame, Scale 100 may already crop it; set it to fit first (Scale around the value that shows the whole picture)." },
            { t: "claude", title: "Try it with Claude: eased move on demand", prompts: [
              { prompt: "Using the live filmcraft server, put an eased Ken Burns move on the still on V2: Scale from 100 to 112 and Position drifting 60 pixels to the left, with Ease Out at the start keyframes and Ease In at the end keyframes. Then render frames at the start, middle and end.", why: "Uses effects.setKeyframe / effects.setParam, then effects.setInterpolation for the ease types, via command_run or command_batch. Compare the graphs in Effect Controls with yours. Keyframe commands take times as seconds or timecode." },
              { prompt: "Explain what Hold interpolation does and show me an example of when I would use it for this clip.", why: "A pure explanation prompt (Claude may look at sequence_inspect but changes nothing). Good for learning terms without leaving the app." }
            ] },
            { t: "quiz", items: [
              { q: "Which interpolation keeps a value constant until the next keyframe and then jumps?", choices: ["Linear", "Ease In", "Hold", "Bezier"], answer: 2, explain: "Hold makes a step change. Useful for on and off switches." },
              { q: "Why ease a camera-style move?", choices: ["It makes the file smaller", "Natural motion accelerates and decelerates, so it looks less mechanical", "Linear is broken", "It makes audio louder"], answer: 1, explain: "Real motion has inertia. Easing imitates it." }
            ] },
            { t: "exercise", title: "Animate the picture", html: "Make a 6-second photo shot that starts wide and drifts to a detail of the picture, using Scale, Position and easing. Then make a second version that does the reverse (starts close, pulls out). Compare which feels more natural for your photo.", steps: ["Duplicate the clip with Copy and Paste on V2 after the first.", "Swap the keyframe values on the second one.", "Play both back to back."] },
            { t: "check", html: "You have an eased, two-keyframe move on a still, and you know what Linear, Ease and Hold mean." }
          ]
        },
        {
          id: "m6-l3",
          title: "Fades, opacity and picture-in-picture",
          minutes: 14,
          goals: [
            "Fade a clip in and out with Opacity keyframes.",
            "Build a picture-in-picture using Scale and Position.",
            "Use layers on V2 and V3 on purpose."
          ],
          assets: ["earth-views", "apollo-broll"],
          blocks: [
            { t: "p", html: "<b>Opacity</b> is a clip's transparency: 100% is fully visible and 0% is invisible. A fade from 0 to 100 over a second is an opacity animation. Because higher tracks cover lower ones, opacity is also how you let the track below show through, which is the basis of layering and <b>picture-in-picture</b> (a smaller shot sitting over a bigger one)." },
            { t: "h", text: "Fade in and fade out" },
            { t: "steps", items: [
              { html: "Select the clip on V2. In Effect Controls open <b>Opacity</b>.", check: "You see <b>Opacity</b> (100%) and <b>Blend Mode</b> (Normal)." },
              { html: "At the clip's first frame turn on the stopwatch for Opacity and set it to <code>0</code>. Move about 1 second later and set it to <code>100</code>.", check: "Two keyframes. Play the start: the clip fades in over the clip on V1 underneath." },
              { html: "Go to about 1 second before the clip's end, click the keyframe diamond to add a keyframe at 100. At the last frame set Opacity to <code>0</code>.", check: "Four keyframes in all: 0, 100, 100, 0. Play: it fades in, holds, fades out." }
            ] },
            { t: "callout", kind: "tip", html: "Open the <b>Blend Mode</b> dropdown to see the other ways a layer can combine with the one beneath it. Treat it as an experiment tool: change it, look at the Program monitor, undo if you dislike it." },
            { t: "h", text: "Picture-in-picture" },
            { t: "steps", items: [
              { html: "Put a shot on V1 (your main video) and a different clip (for example <code>apollo-broll</code>) on V2 above it, over the same time range.", check: "The V2 clip covers the whole frame." },
              { html: "Select the V2 clip. In Motion set <b>Scale</b> to <code>35</code>.", check: "The V2 picture shrinks, with V1 visible around it." },
              { html: "Set <b>Position</b> to about <code>1500, 300</code> to put the small picture in the upper-right corner.", detail: "Remember the frame is 1920 wide by 1080 tall in pixels: the first number goes right, the second goes down.", check: "A small inset appears at top right." },
              { html: "In the <b>Effects</b> panel search for <b>drop shadow</b> and apply it to the V2 clip (drag it onto the clip).", check: "A soft shadow separates the small picture from the background." },
              { html: "Animate it in: with the stopwatch on Position, start the inset off-screen (for example the first number 2300), and finish at 1500 one second later.", check: "The small picture slides in from the right." }
            ] },
            { t: "callout", kind: "warn", html: "If your V2 clip has sound, it plays too. Mute its audio track (<b>M</b> on A2) or lower it so two voices do not fight." },
            { t: "claude", title: "Try it with Claude: picture-in-picture", prompts: [
              { prompt: "Using the live filmcraft server, make the clip on V2 a picture-in-picture: scale 35, positioned at the top-right corner with a margin of about 60 pixels, with a Drop Shadow, and an opacity fade-in over the first 12 frames. Render a frame at 2 seconds and tell me if the inset overlaps anything important.", why: "Uses effects.apply (Drop Shadow), effects.setParam on Motion and Opacity, and keyframe commands, then render_frame. Compare the layout with yours. Claude can check the margins numerically; you check that it looks good." },
              { prompt: "Fade the V2 clip out over its last second, then list all the Opacity keyframes on it with their times and values.", why: "A smaller edit to reinforce the pattern. Claude adds keyframes with command_run, then reads them back with sequence_inspect or effects.list. Check that the list matches what Effect Controls shows." }
            ] },
            { t: "quiz", items: [
              { q: "To fade a clip in over 1 second you...", choices: ["Add a transition only", "Keyframe Opacity from 0 to 100 over one second", "Change Scale", "Lock the track"], answer: 1, explain: "A fade in is an opacity animation. (A Dip to Black or Cross Dissolve is another way.)" },
              { q: "In a 1920x1080 frame, which Position puts a small inset toward the top-right?", choices: ["100, 900", "1500, 300", "300, 1500", "960, 540"], answer: 1, explain: "First number: horizontal (right is bigger). Second: vertical (down is bigger). So 1500, 300 is right and high." }
            ] },
            { t: "exercise", title: "Reaction shot", html: "Build a picture-in-picture in the bottom-left corner of the Earth views, using Apollo footage as the inset. It must slide in, hold for 3 seconds, and fade out. Add a drop shadow.", steps: ["V1 = earth-views, V2 = apollo-broll.", "Scale 30; Position near 360, 840.", "Keyframe Position for the slide and Opacity for the fade.", "Play and fix timing."] },
            { t: "check", html: "You can fade clips with opacity keyframes and build a moving, shadowed picture-in-picture." }
          ]
        }
      ]
    },
    {
      id: "m7",
      title: "Color correction and grading",
      summary: "Learn what exposure, contrast and white balance are, read the Lumetri Scopes, fix a shot with Lumetri Color, then add a look and match shots to each other.",
      lessons: [
        {
          id: "m7-l1",
          title: "Seeing color: exposure, white balance and the scopes",
          minutes: 15,
          goals: [
            "Explain exposure, contrast, white balance and saturation in plain words.",
            "Tell color correction from color grading.",
            "Open the Color workspace and read a Waveform and a Histogram."
          ],
          assets: ["apollo-moonwalk", "earth-views"],
          blocks: [
            { t: "p", html: "Color work has two jobs. <b>Correction</b> makes a shot look <i>right and consistent</i>: not too dark, not too bright, no accidental color tint. <b>Grading</b> then gives it a <i>style</i>: warm and golden, cold and blue, faded like old film. Always correct first, grade second." },
            { t: "h", text: "The words you need" },
            { t: "p", html: "<ul><li><b>Exposure</b>: overall brightness. Too low is underexposed (murky), too high is overexposed (washed out, with detail lost in white).</li><li><b>Contrast</b>: the difference between dark and bright parts. High contrast looks punchy and harsh; low contrast looks flat and soft.</li><li><b>Highlights, Shadows, Whites, Blacks</b>: adjust only the bright parts, dark parts, the very brightest and the very darkest tones.</li><li><b>White balance</b> (<b>Temperature</b> and <b>Tint</b>): whether white things look white. Orange-ish is too warm; blue-ish is too cool; green or magenta cast is a Tint problem.</li><li><b>Saturation</b>: color intensity. Zero is black and white.</li><li><b>Clipping</b>: where brightness goes past the maximum, detail is lost and cannot be recovered.</li></ul>" },
            { t: "callout", kind: "warn", html: "Your eyes and your screen lie to you: they adapt to what they see and every monitor is different. Editors use <b>scopes</b>, graphs that measure the picture, to judge brightness and color objectively." },
            { t: "image", src: "../filmcraft/docs/images/filmcraft-color.png", alt: "FilmCraft Color workspace: Lumetri Scopes (Waveform and Vectorscope) at top left, Program monitor in the centre, Lumetri Color panel at right, Timeline at bottom.", caption: "The Color workspace. The Lumetri Scopes panel shows a Waveform (left) and a Vectorscope (right) for the frame in the Program monitor." },
            { t: "h", text: "Open the scopes" },
            { t: "steps", items: [
              { html: "Select a clip on V1 (the Apollo moonwalk is a good one: it has bright highlights and deep shadows) and park the playhead on it.", check: "A frame of the clip is showing in the Program monitor." },
              { html: "Press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>3</kbd> for the <b>Color</b> workspace.", check: "<b>Lumetri Scopes</b> appears at the top left, <b>Lumetri Color</b> at the right." },
              { html: "In the Lumetri Scopes panel, right-click (or use its wrench icon) and choose <b>Waveform</b>. Then try <b>Histogram</b>, <b>Parade</b> and <b>Vectorscope</b>.", detail: "You can show more than one scope at the same time from the same menu.", check: "Each scope draws a different graph of the frame." }
            ] },
            { t: "h", text: "Reading each scope" },
            { t: "p", html: "<ul><li><b>Waveform</b>: the horizontal axis matches the picture left-to-right, the vertical axis is brightness from <b>0 (black)</b> at the bottom to <b>100 (white)</b> at the top. A healthy shot usually reaches near both ends. If the trace is squashed in the middle, the shot is flat. If it is flat on the top line, highlights are clipped.</li><li><b>Histogram</b>: how many pixels there are at each brightness (dark on the left, bright on the right). A big pile against the right edge means clipped highlights.</li><li><b>Parade</b>: three waveforms side by side for red, green and blue. If one is higher or lower than the others on something that should be neutral grey, there is a color cast.</li><li><b>Vectorscope</b>: a color wheel. Distance from the centre is saturation; angle is hue. A trace leaning toward one color shows a tint.</li></ul>" },
            { t: "steps", items: [
              { html: "With <b>Waveform</b> showing, scrub through the moonwalk clip with the playhead.", check: "You can point to a bright shot whose trace touches the top and a dark shot whose trace hugs the bottom." },
              { html: "Switch to <b>Histogram</b> on the brightest frame you can find.", check: "You see where the bulk of the brightness sits." }
            ] },
            { t: "claude", title: "Try it with Claude: second pair of eyes", prompts: [
              { prompt: "Using the live filmcraft server, read the scopes for the frame at the playhead (the waveform, histogram and parade numbers). Tell me whether highlights or shadows look clipped, and whether there is a color cast. Also take a screenshot of the Program monitor so you can compare.", why: "Claude uses the command scopes.read via command_run (numbers for the waveform, parade, histogram and vectorscope) and ui_screenshot or render_frame. It gives you a numeric opinion you can check against the scopes you are looking at. It cannot judge taste." }
            ] },
            { t: "quiz", items: [
              { q: "On the Waveform, the trace is flat along the top. What does that tell you?", choices: ["The shot is perfectly exposed", "Highlights are clipped (pure white with lost detail)", "The shot is black and white", "Audio is too loud"], answer: 1, explain: "A flat line at the top means brightness hit the maximum, so highlight detail is gone." },
              { q: "Which job comes first?", choices: ["Grading", "Correction", "Export", "Titles"], answer: 1, explain: "Correct the shot first so it looks right and matches others, then apply a style." },
              { q: "Which scope would best show a green color cast on a grey wall?", choices: ["Parade", "Histogram only", "Timeline", "Audio meters"], answer: 0, explain: "Parade shows red, green and blue separately; a higher green waveform reveals a green cast. The vectorscope shows it too." }
            ] },
            { t: "check", html: "You can switch to the Color workspace, show a Waveform and Histogram, and say what clipped highlights look like on each." }
          ]
        },
        {
          id: "m7-l2",
          title: "Fix a shot with Lumetri Color: Basic Correction",
          minutes: 15,
          goals: [
            "Apply Lumetri Color to a clip and find the Basic Correction sliders.",
            "Follow a repeatable correction order: exposure, tone, white balance, saturation.",
            "Compare before and after, and reset."
          ],
          assets: ["apollo-moonwalk", "apollo-broll"],
          blocks: [
            { t: "p", html: "<b>Lumetri Color</b> is FilmCraft's color panel (the same name Premiere uses). Its <b>Basic Correction</b> section holds the sliders for the fix-it job. The panel works on the <b>selected clip</b>." },
            { t: "steps", items: [
              { html: "In the <b>Color</b> workspace, select one clip on V1 and look at the <b>Lumetri Color</b> panel on the right.", detail: "If the clip has no Lumetri Color effect yet, the panel shows a button <b>Add Lumetri Color to clip</b>. Click it.", check: "The panel lists <b>Basic Correction</b>, <b>Creative</b>, <b>Curves</b>, <b>Color Wheels &amp; Match</b>, <b>HSL Secondary</b> and <b>Vignette</b>, each with an on/off switch." },
              { html: "Open <b>Basic Correction</b>. Find <b>Temperature</b>, <b>Tint</b> and <b>Saturation</b> under <i>Color</i>, and <b>Exposure</b>, <b>Contrast</b>, <b>Highlights</b>, <b>Shadows</b>, <b>Whites</b> and <b>Blacks</b> under <i>Light</i>.", check: "You can see all nine sliders." }
            ] },
            { t: "h", text: "A repeatable order" },
            { t: "steps", items: [
              { html: "<b>1. Set the range.</b> Watch the Waveform. Lower <b>Whites</b> if the top of the trace clips; lower <b>Blacks</b> (move it toward the left) to bring the bottom near 0 if the shot looks foggy.", detail: "Aim for a trace that nearly reaches the top and bottom without flattening against them." },
              { html: "<b>2. Set exposure.</b> Move <b>Exposure</b> until the main subject is the right brightness on the Program monitor.", check: "The middle of the Waveform trace moves up or down." },
              { html: "<b>3. Shape contrast.</b> Nudge <b>Contrast</b>, then use <b>Highlights</b> to pull bright areas back and <b>Shadows</b> to lift dark areas.", check: "Detail comes back in the brightest and darkest parts." },
              { html: "<b>4. White balance.</b> Use <b>Temperature</b> (blue to orange) and <b>Tint</b> (green to magenta) until something that should be neutral grey or white looks neutral. Watch the <b>Parade</b>: red, green and blue should line up on neutral areas.", check: "The Parade channels sit at similar heights on grey or white objects." },
              { html: "<b>5. Saturation last.</b> Adjust <b>Saturation</b> gently.", check: "Colors are natural, not neon and not dead." },
              { html: "Click the on/off switch at the right of the <b>Basic Correction</b> header to toggle it, and look at before and after.", check: "You can see how much you changed. Switch it back on." }
            ] },
            { t: "callout", kind: "warn", html: "<b>Two things Premiere has that FilmCraft does not (yet):</b> there is no <b>Auto</b> button and no white-balance <b>eyedropper</b> in Lumetri Color. Neutralize color casts with Temperature, Tint and the Parade instead (that is a better habit anyway)." },
            { t: "callout", kind: "tip", html: "Change one slider at a time and look at the scope after each. Small moves add up; big moves usually mean the shot was overexposed or underexposed in the camera, and no slider can invent lost detail." },
            { t: "callout", kind: "note", html: "If you want to start over, open <b>Effect Controls</b> (<kbd>Shift</kbd>+<kbd>5</kbd>), find the <b>Lumetri Color</b> row, and click its <b>Reset Effect</b> icon. <kbd>Ctrl</kbd>+<kbd>Z</kbd> also steps back, one slider move at a time." },
            { t: "claude", title: "Try it with Claude: compare approaches", html: "Before you ask, undo your own correction on a second clip so that Claude starts from the original look. Save a copy first.", prompts: [
              { prompt: "Using the live filmcraft server, look at the clip I have selected on V1 and its scopes. Make a basic correction: bring whites and blacks into range, set a pleasing exposure, and neutralize any color cast. Tell me each Lumetri setting you changed and by how much. Render a frame before and after.", why: "Claude uses scopes.read and render_frame to measure, then effects.setParam through command_run (Lumetri Color: Exposure, Contrast, Highlights, Shadows, Whites, Blacks, Temperature, Tint). Find its changes in Effect Controls, compare with your own values, and decide whose version you prefer." },
              { prompt: "Undo your changes one at a time and describe in a sentence what each step did to the picture.", why: "Claude runs edit.undo repeatedly (each parameter change was its own History step) and can render a frame between steps. A good way to learn what each slider does." }
            ] },
            { t: "quiz", items: [
              { q: "Your Parade shows the blue channel higher than red and green on a grey wall. What should you try?", choices: ["Raise Saturation", "Move Temperature toward warm (orange)", "Raise Contrast", "Move Whites up"], answer: 1, explain: "A blue cast is a cool white balance. Warm Temperature counteracts it." },
              { q: "What is the best order for a basic correction?", choices: ["Saturation first, then exposure", "Range and exposure, then contrast, white balance, then saturation", "Add a Look, then fix problems", "Any order"], answer: 1, explain: "Fix the foundation (tone) before color, and leave the delicate saturation for last." }
            ] },
            { t: "exercise", title: "Rescue a bad shot", html: "Find the darkest or flattest shot in your sequence. Make it look right using the five-step order, using only the Waveform, Parade and your eyes. Write down three slider values you changed.", steps: ["Select the shot; open Basic Correction.", "Follow steps 1 to 5.", "Toggle the section off and on to compare.", "Save your project."] },
            { t: "check", html: "You have corrected at least one clip with Lumetri Basic Correction and confirmed on the scopes that the range and white balance are healthy." }
          ]
        },
        {
          id: "m7-l3",
          title: "Looks, vignettes, matching shots and adjustment layers",
          minutes: 14,
          goals: [
            "Apply a creative Look and control its strength.",
            "Make two shots from different places feel like they belong together.",
            "Use an adjustment layer to grade many clips at once."
          ],
          assets: ["apollo-moonwalk", "apollo-launch", "apollo-broll"],
          blocks: [
            { t: "p", html: "Once your shots are corrected, you can <b>grade</b>: give the whole video a consistent mood. The most important grading rule is <b>consistency</b>. Viewers notice if one shot is warm and the next is cold for no reason, even if both look nice on their own." },
            { t: "h", text: "A look" },
            { t: "steps", items: [
              { html: "Select a corrected clip. In Lumetri Color open <b>Creative</b>.", check: "You see <b>Look</b>, <b>Look LUT</b> and <b>Intensity</b>, plus <b>Faded Film</b>, <b>Sharpen</b>, <b>Vibrance</b> and <b>Saturation</b>." },
              { html: "Open the <b>Look</b> dropdown and try each of the built-in looks, pausing to watch the Program monitor.", detail: "A <b>Look</b> is a prepared color style (a color lookup built into the effect). FilmCraft ships eight built-in looks. A <b>LUT</b> is a file with the same idea that you can load from disk.", check: "The image changes style each time." },
              { html: "Pick one you like and lower <b>Intensity</b> to about <code>40</code> to <code>60</code>.", check: "The look is gentler and the skin and sky tones feel natural again." },
              { html: "Open <b>Vignette</b> and turn it on with a small amount.", detail: "A vignette darkens the corners to draw the eye toward the centre. Keep it subtle: if you can obviously see it, it is too much." }
            ] },
            { t: "callout", kind: "tip", html: "<b>Less is more.</b> A look at 100 percent usually looks like a filter. At 30 to 60 percent it looks like a style." },
            { t: "h", text: "Match two shots" },
            { t: "p", html: "Pick a <b>reference</b> shot you like (usually the one you corrected best) and compare the other shots to it, using the scopes, not just your eyes: similar brightness on the Waveform, similar cast on the Parade, similar color saturation on the Vectorscope. Adjust Exposure, Temperature and Saturation on the other shot until they feel like one scene. The <b>Color Wheels &amp; Match</b> section holds extra tools for this; explore it once your basic matching works." },
            { t: "steps", items: [
              { html: "Park the playhead on your reference shot and look at its Waveform and Parade. Remember the trace's rough shape and height.", check: "You can describe it in one sentence." },
              { html: "Select a different shot, correct it with Basic Correction until the scopes look similar.", check: "Cut between the two shots (<kbd>Up</kbd>/<kbd>Down</kbd> to jump): neither looks out of place." }
            ] },
            { t: "h", text: "Grade many clips at once with an adjustment layer" },
            { t: "p", html: "An <b>adjustment layer</b> is a see-through clip that applies its effects to <i>everything on the tracks below it</i>. Put your look on one adjustment layer instead of on twenty clips." },
            { t: "steps", items: [
              { html: "In the Project panel click <b>New Item</b> (bottom-right) and choose <b>Adjustment Layer...</b>. Accept the defaults.", check: "An Adjustment Layer item appears in the Project panel." },
              { html: "Drag it onto <b>V2</b> (or the next free track) above your clips and drag its right edge to cover the whole sequence.", check: "The adjustment layer spans all your clips." },
              { html: "Select it, add Lumetri Color to it, and choose a <b>Look</b> with a lowered <b>Intensity</b>.", check: "Every clip underneath changes together. Hide the layer with the eye icon to compare." }
            ] },
            { t: "claude", title: "Try it with Claude: automate a consistent look", prompts: [
              { prompt: "Using the live filmcraft server, read the scopes on the first frame of each clip on V1 and tell me which clips are noticeably brighter, darker, warmer or cooler than the rest. Then propose small Exposure and Temperature changes to match them to the best clip. Do not apply anything yet.", why: "Claude calls scopes.read repeatedly (moving the playhead with playhead.set or using render_frame per clip). It gives numbers, which are a good first draft; you decide which clip is the reference." },
              { prompt: "Apply your proposed changes to each clip, then add an adjustment layer above all of them with a subtle Look at 50 percent intensity, and take a screenshot of the Program monitor.", why: "Uses effects.setParam on each clip, file.newAdjustmentLayer, timeline.place for the layer and effects.apply. Everything lands in History so you can step back through it." }
            ] },
            { t: "quiz", items: [
              { q: "What is the main reason to apply a look on an adjustment layer?", choices: ["It sounds better", "One set of settings affects all clips below, keeping them consistent", "It makes the export smaller", "It is required by FilmCraft"], answer: 1, explain: "An adjustment layer applies its effects to everything beneath it on lower tracks." },
              { q: "A look at Intensity 100 looks like a cheap filter. What should you try?", choices: ["Increase saturation", "Lower Intensity to around half", "Add another look", "Do nothing"], answer: 1, explain: "Lowering Intensity blends the look with your corrected picture." }
            ] },
            { t: "exercise", title: "Give the film a mood", html: "Decide on a mood for your video (cold and eerie, warm and nostalgic, bleak, hopeful) and write it in one line. Correct and match all clips, then build one adjustment layer with a look and a very light vignette that supports the mood.", steps: ["Correct each shot.", "Match to the reference.", "Add the adjustment layer.", "Toggle its eye to see before and after; save."] },
            { t: "check", html: "Your sequence has consistently corrected shots and one adjustment layer with a subtle look." }
          ]
        }
      ]
    },
    {
      id: "m8",
      title: "Sound and mixing",
      summary: "Understand waveforms, decibels and loudness, set clip levels, fade and duck music under a voice, clean up a recording with Essential Sound, and check your mix on the meters.",
      lessons: [
        {
          id: "m8-l1",
          title: "How sound works: waveforms, decibels and meters",
          minutes: 14,
          goals: [
            "Read a waveform on the Timeline and explain what its height means.",
            "Explain decibels (dB), clipping and LUFS in plain language.",
            "Use the Audio Meters while playing a mix of three sounds."
          ],
          assets: ["apollo-launch", "chopin-nocturne", "voiceover"],
          blocks: [
            { t: "p", html: "Half of a video is what you hear. Viewers forgive a slightly soft picture but not painful, muddy or uneven sound. The basics are simple." },
            { t: "h", text: "Waveforms and decibels" },
            { t: "p", html: "A recording measures air pressure many times a second (FilmCraft projects use <b>48,000</b> times per second, a <b>48 kHz</b> sample rate). Drawn over time, that is a <b>waveform</b>: the taller it is, the louder the sound at that moment. The Timeline draws a waveform inside every audio clip." },
            { t: "p", html: "Loudness is measured in <b>decibels (dB)</b>. In digital audio the top of the scale is <b>0 dB</b>, the loudest the file can hold. Every real level is <i>below</i> zero, so you will see negative numbers: -6 dB, -12 dB, -20 dB. Every <b>-6 dB</b> is roughly half the signal height, and about <b>10 dB</b> sounds roughly twice or half as loud to the ear. If a signal tries to go over 0 dB it <b>clips</b>: the wave is cut flat and sounds crackly and distorted, and you cannot repair it. The meter shows red there." },
            { t: "p", html: "<b>LUFS</b> measures how loud something <i>sounds</i> over time, with a weighting that matches human hearing. The Audio Meters panel shows <b>M</b> (momentary, the last fraction of a second), <b>S</b> (short-term, a few seconds), <b>I</b> (integrated, the whole piece so far) and <b>TP</b> (true peak, the highest peak, in dBTP). Online platforms commonly aim for an integrated loudness of around <b>-14 LUFS</b> (check each platform's guidance), with true peaks below about -1 dBTP." },
            { t: "callout", kind: "tip", html: "Mixing is mostly relative: put the <b>voice</b> clearly on top, the <b>music</b> underneath it, and keep effects between. A rule of thumb is dialogue peaking around -12 to -6 dB and music sitting 10 to 15 dB lower while someone is talking." },
            { t: "steps", items: [
              { html: "Make a practice sequence: click <b>New Item</b> in the Project panel, choose <b>Sequence...</b>, accept the defaults and name it <code>audio-practice</code>. Drag <code>apollo-launch</code> onto V1. Its sound lands on A1.", check: "A waveform appears in the A1 clip." },
              { html: "Drag <code>chopin-nocturne</code> onto track <b>A2</b> and <code>voiceover</code> onto <b>A3</b>, starting at the beginning of the sequence.", check: "Three waveforms in three tracks: A1, A2, A3." },
              { html: "Put on headphones. Press <kbd>Home</kbd> then <kbd>Space</kbd> and watch the <b>Audio Meters</b> at the far right of the screen.", check: "Green bars bounce. Bars that reach red are too loud. The M, S, I and TP numbers appear under the bars." },
              { html: "Click <b>S</b> (solo) on A2, play, then solo A3 and play, then A1. Turn solo off when done.", detail: "Soloing each sound lets you judge its level on its own." },
              { html: "Stop and read the <b>I</b> (integrated) value after letting everything play for 20 seconds.", check: "You can say roughly how loud the mix is in LUFS." }
            ] },
            { t: "callout", kind: "note", html: "The waveform thumbnails can be turned on or off in the Timeline's <b>Timeline Display Settings</b> (the wrench button in the toolbar), under <b>Show Audio Waveform</b>. In FilmCraft's waveform display, very quiet clips are drawn a little larger so you can still see them, so judge loudness by the meters, not by the waveform height alone." },
            { t: "claude", title: "Try it with Claude: measure, don't guess", html: "Claude cannot hear, but it can measure.", prompts: [
              { prompt: "Using the live filmcraft server, check the peak amplitude of each audio clip in the active sequence and give me a table of clip name, track and peak in dB. Tell me which clip is closest to clipping.", why: "Claude uses clip.audioPeak (a read-only query) via command_run on each clip id from sequence_inspect. It reports numbers; you check them against what your ears and the meter say." },
              { prompt: "Play the sequence for 15 seconds and take a screenshot of the Audio Meters while it plays. Tell me the M, S and I values if you can read them.", why: "Claude can use ui_key to press Space, then ui_screenshot with the Audio Meters panel. Remember it cannot hear: the numbers in the screenshot are its only view of loudness." }
            ] },
            { t: "quiz", items: [
              { q: "What does 0 dB mean in digital audio?", choices: ["Silence", "The loudest level the file can hold; going over it clips", "Half volume", "Stereo"], answer: 1, explain: "0 dB is the digital maximum. Real mixes live below it, in negative numbers." },
              { q: "Which is the louder level: -6 dB or -18 dB?", choices: ["-18 dB", "-6 dB", "They are the same", "It depends on the clip"], answer: 1, explain: "Closer to zero is louder. -6 dB is much louder than -18 dB." },
              { q: "What does LUFS measure?", choices: ["File size", "How loud something sounds over time, weighted like human hearing", "Frame rate", "Bitrate"], answer: 1, explain: "LUFS is perceived loudness, the standard measure for delivery targets." }
            ] },
            { t: "check", html: "You can read a waveform, say why meters show negative numbers, and see M, S, I and TP in the Audio Meters." }
          ]
        },
        {
          id: "m8-l2",
          title: "Levels: clip gain, the volume line, keyframes and the mixer",
          minutes: 15,
          goals: [
            "Change a clip's level three ways: Audio Gain, the volume line and keyframes.",
            "Fade music in and out.",
            "Use the Audio Track Mixer."
          ],
          assets: ["apollo-launch", "chopin-nocturne", "voiceover"],
          blocks: [
            { t: "p", html: "There are three layers of control, from coarse to fine. <b>Audio Gain</b> sets a whole clip's level once. The <b>volume line</b> and <b>keyframes</b> change level over time (fades, dips). The <b>track mixer</b> adjusts a whole track at once." },
            { t: "h", text: "Clip gain" },
            { t: "steps", items: [
              { html: "Select the music clip on A2. Press <kbd>G</kbd> (<b>Clip &gt; Audio Options &gt; Audio Gain...</b>).", check: "A dialog opens for the selected clip's gain in dB." },
              { html: "Set the gain so the music is clearly quieter, for example <code>-12</code> dB, and press OK.", detail: "The dialog offers choices such as setting the gain to a value, adjusting it by an amount, and normalizing (raising the clip so its loudest point reaches a chosen level).", check: "The clip's white volume line drops lower in the clip and the meters read lower." },
              { html: "With the clip selected, press <kbd>]</kbd> three times and then <kbd>[</kbd> three times.", detail: "These keys increase or decrease the clip volume by 1 dB per press.", check: "Each press changes the level by a small, steady amount." }
            ] },
            { t: "h", text: "Fade with keyframes" },
            { t: "steps", items: [
              { html: "With the music clip selected, open Effect Controls (<kbd>Shift</kbd>+<kbd>5</kbd>) and find the <b>Volume</b> effect and its <b>Level</b> value.", check: "Level shows the clip's level in dB." },
              { html: "At the start of the clip turn on the stopwatch for Level and set it low (for example <code>-60</code>). Move 3 seconds later and set it to your normal level (for example <code>-14</code>).", check: "Two keyframes. Play the start of the clip: the music fades in." },
              { html: "Do the same at the end: add a keyframe at your normal level a few seconds before the end, and a final keyframe at <code>-60</code> on the last frame.", check: "Play: it fades out gently." },
              { html: "Try the white <b>volume line</b> on the clip itself: drag it up and down between keyframes.", detail: "The volume line is the rubber band you can see inside an audio clip; its height shows the level." }
            ] },
            { t: "callout", kind: "tip", html: "Fade music <b>in and out</b> rather than starting and stopping suddenly. Two or three seconds sounds natural. For a quick crossfade between two audio clips, select the edit and press <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd> to apply an audio transition." },
            { t: "h", text: "The Audio Track Mixer" },
            { t: "steps", items: [
              { html: "Press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>5</kbd> for the <b>Audio</b> workspace (the <b>Audio Track Mixer</b> is shown there), or press <kbd>Shift</kbd>+<kbd>6</kbd> to open it.", check: "A mixer with a fader and meter for each track." },
              { html: "Drag the A2 fader down a little while the sequence plays.", check: "The music gets quieter without changing the clip." }
            ] },
            { t: "keys", items: [
              { keys: "G", action: "Audio Gain dialog for the selected clip" },
              { keys: "]", action: "Increase clip volume by 1 dB" },
              { keys: "[", action: "Decrease clip volume by 1 dB" },
              { keys: "Ctrl+Shift+D", action: "Apply audio transition" },
              { keys: "Shift+6", action: "Audio Track Mixer" }
            ] },
            { t: "callout", kind: "adobe", html: "In Premiere videos you hear about <b>clip gain</b>, the <b>rubber band</b>, <b>Audio Clip Mixer</b> and <b>Audio Track Mixer</b>. All of those exist here with the same names." },
            { t: "claude", title: "Try it with Claude: a first mix", prompts: [
              { prompt: "Using the live filmcraft server, set the music clip on A2 to 14 dB below the clip on A3 by adjusting its gain, then add a 3 second fade in and a 3 second fade out with Volume Level keyframes. Report the final gain and keyframes and check the clip peaks with clip.audioPeak.", why: "Claude uses clip.audioPeak to read both clips, clip.audioGain to set a level (mode set or adjust), and effects.addKeyframe or effects.setKeyframe for Volume > Level. Each change is in History. Listen to the result; Claude's numbers are only as good as your ears' approval." },
              { prompt: "Mute track A1 and solo A3, then take a screenshot of the Timeline so I can verify the header buttons.", why: "A small UI task via commands or ui_click, then ui_screenshot of the Timeline panel." }
            ] },
            { t: "quiz", items: [
              { q: "You want music to fade in over 3 seconds at the start of a clip. What do you use?", choices: ["A Razor cut", "Volume Level keyframes from very low to normal level", "Rate Stretch", "A transition on video"], answer: 1, explain: "A fade is a level animation: keyframe Level low at the start and normal 3 seconds in." },
              { q: "Which control changes the level of an entire clip once?", choices: ["Audio Gain", "Razor", "Marker", "Snapping"], answer: 0, explain: "Audio Gain (G) sets or adjusts the whole clip's level." }
            ] },
            { t: "exercise", title: "Voice over music", html: "Place the voice-over on A3 starting at 5 seconds, and the music on A2 from the start. Lower the music so the voice is easy to understand, and add a fade in at the start and a fade out at the end. Aim for the voice to peak around -12 to -6 dB and the music to sit well beneath it while the voice speaks.", steps: ["Drag clips to A2 and A3.", "Use G to set the music's gain.", "Add Level keyframes for fades.", "Play and watch the meters while listening."] },
            { t: "check", html: "You can set a clip's level three ways and have a music bed that fades in and out under a voice." }
          ]
        },
        {
          id: "m8-l3",
          title: "Essential Sound: clean up, duck and match loudness",
          minutes: 15,
          goals: [
            "Tag clips as Dialogue, Music, SFX or Ambience in Essential Sound.",
            "Reduce noise and use Auto-Match for loudness.",
            "Duck the music automatically under the voice."
          ],
          assets: ["voiceover", "chopin-nocturne", "apollo-launch"],
          blocks: [
            { t: "p", html: "<b>Essential Sound</b> is a panel that makes common audio jobs simple. You tell FilmCraft what kind of sound a clip is, and it shows only the controls that matter for that type. It has two tabs: <b>Browse</b> (presets) and <b>Edit</b> (controls), and it works on the selected clip." },
            { t: "h", text: "Tag and clean the voice" },
            { t: "steps", items: [
              { html: "Press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>5</kbd> for the Audio workspace. Select the voice-over clip on A3.", check: "The <b>Essential Sound</b> panel appears on the right." },
              { html: "In the <b>Edit</b> tab choose the type <b>Dialogue</b>.", check: "Sections such as <b>Loudness</b>, <b>Repair</b>, <b>Clarity</b>, <b>Creative</b> and <b>Pan</b> appear." },
              { html: "Open <b>Loudness</b> and click <b>Auto-Match</b>.", detail: "Auto-Match measures the clip and sets its gain to a standard speech loudness so different recordings sit at similar levels.", check: "The clip's level changes and the meters read in a healthy zone." },
              { html: "Open <b>Repair</b>, switch on noise reduction and set a modest amount. Play and compare with it off.", detail: "Aggressive noise reduction makes voices sound watery or robotic. Use the smallest amount that helps.", check: "Background hiss is reduced without making the voice sound artificial." }
            ] },
            { t: "h", text: "Tag the music and duck it" },
            { t: "p", html: "<b>Ducking</b> means lowering the music automatically while someone is talking and raising it again in the pauses, like a radio presenter's mixer." },
            { t: "steps", items: [
              { html: "Select the music clip on A2 and choose the type <b>Music</b>.", check: "The panel now shows a <b>Ducking</b> section." },
              { html: "Open <b>Ducking</b>, choose <b>Dialogue</b> as the type to duck against, and use the button that generates the ducking keyframes.", detail: "FilmCraft listens to your Dialogue-tagged clips and writes volume keyframes on the music for you. Because these are ordinary keyframes, you can drag and adjust them afterwards.", check: "Keyframe points appear on the music's volume line and the music dips wherever the voice is." },
              { html: "Play the whole thing and listen. Adjust the music's overall gain with <kbd>G</kbd> if needed.", check: "The voice is always clear and the music returns between phrases." }
            ] },
            { t: "h", text: "Check the final loudness" },
            { t: "steps", items: [
              { html: "Play the full sequence and read the <b>I</b> (integrated) value and the <b>TP</b> (true peak) in the Audio Meters when it finishes.", check: "True peak stays below 0 dBTP (ideally below about -1) and the bars never sit in the red." }
            ] },
            { t: "callout", kind: "warn", html: "Essential Sound's <b>Duration</b> section (remix music to fit a target length) is not available in this build. If you need music to match a duration, trim it and fade it by hand." },
            { t: "callout", kind: "note", html: "You are the judge of whether this sounds good. Listen on headphones and on speakers, at low volume as well as normal, before you trust it." },
            { t: "claude", title: "Try it with Claude: ducking and a loudness check", prompts: [
              { prompt: "Using the live filmcraft server, tag the voice-over clip as Dialogue and the music clip as Music with Essential Sound, run Auto-Match on the dialogue, and generate ducking for the music against dialogue. Tell me exactly which essentialSound commands you used, then show me the music clip's keyframes.", why: "Claude uses essentialSound.setType, essentialSound.autoMatch and essentialSound.generateDucking via command_run (check with command_list first), then sequence_inspect. The result is the same as your hand-made one; compare the keyframes." },
              { prompt: "Play the whole sequence and take a screenshot of the Audio Meters at the end. Tell me whether I (integrated) is close to -14 LUFS and whether true peak is under -1 dBTP. If not, tell me which clip to change and by how much, but do not change anything.", why: "Uses ui_key to play, ui_screenshot of the meters, and reads the numbers from the image. No command returns the sequence loudness, so this is Claude's only measurement. You decide whether to adjust." }
            ] },
            { t: "quiz", items: [
              { q: "What does ducking do?", choices: ["Deletes the music", "Automatically lowers the music while dialogue is present", "Adds echo", "Mutes the voice"], answer: 1, explain: "Ducking writes volume keyframes on the music so the voice stays intelligible." },
              { q: "Why choose the smallest noise reduction that works?", choices: ["It is faster", "Strong reduction makes voices sound watery or robotic", "FilmCraft limits it", "It makes the file smaller"], answer: 1, explain: "Noise reduction removes information. Too much damages the voice." },
              { q: "Which meter value summarizes the whole piece's loudness so far?", choices: ["M", "S", "I", "TP"], answer: 2, explain: "I is the integrated loudness. M is momentary, S short-term, TP the true peak." }
            ] },
            { t: "exercise", title: "Fix the worst recording", html: "Record yourself again, deliberately in a noisier place or at a lower volume, import it, and tag it as Dialogue. Use Auto-Match and a small amount of noise reduction. Write down what improved and what got worse.", steps: ["Record with Sound Recorder (saves .m4a).", "Import and place it on A3.", "Essential Sound: Dialogue, Auto-Match, Repair.", "A/B test with the switches on and off."] },
            { t: "check", html: "You can tag clips in Essential Sound, clean and level a voice, duck music under it, and check the final loudness on the meters." }
          ]
        }
      ]
    },
    {
      id: "m9",
      title: "Titles, captions, export and your capstone",
      summary: "Add titles and captions, export a finished video with the right settings, and then put every skill together in a short capstone film.",
      lessons: [
        {
          id: "m9-l1",
          title: "Titles and simple graphics",
          minutes: 14,
          goals: [
            "Create a text title and a simple background shape.",
            "Style text for readability and keep it inside safe margins.",
            "Fade a title in and out with keyframes."
          ],
          assets: ["earth-views"],
          blocks: [
            { t: "p", html: "In FilmCraft a title is a <b>graphic clip</b>: a transparent layer on a video track that holds <b>text</b> and <b>shape</b> layers. Because a graphic is an ordinary clip you can trim it, move it, put it above other clips, and fade it with the opacity keyframes you already know." },
            { t: "steps", items: [
              { html: "Put the playhead where the title should appear (for example 1 second in).", check: "The Program monitor shows the shot the title will sit over." },
              { html: "Choose <b>Graphics and Titles &gt; New Layer &gt; Text</b> (<kbd>Ctrl</kbd>+<kbd>T</kbd>).", detail: "A new text graphic is placed on a video track at the playhead (5 seconds long by default). You can also press <kbd>T</kbd> for the <b>Type</b> tool and click in the Program monitor for single-line text, or drag a box for a paragraph.", check: "A graphic clip appears on a video track above your footage, and a text layer appears in the Program monitor." },
              { html: "Select the graphic clip and look at the <b>Properties</b> or <b>Essential Graphics</b> panel (tabs in the right column of the Editing workspace). Change the text, the font, the <b>size</b> and the fill color.", detail: "The Graphics workspace (<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>6</kbd>, Captions and Graphics) lays these panels out for you. In the Properties panel you can also use the Align and Transform controls to center the text.", check: "The title shows in a readable size, in the middle of the frame." },
              { html: "Make it readable: if the text sits over a busy background, add a background fill or a drop shadow to the text layer in its Appearance settings.", check: "You can read it without squinting." },
              { html: "Fade it: with the graphic clip selected, in Effect Controls animate <b>Opacity</b> from 0 to 100 over the first second and back to 0 over the last second (same as the previous module).", check: "The title fades in and out smoothly." }
            ] },
            { t: "callout", kind: "tip", html: "<b>Safe margins.</b> Keep important text well inside the frame, about 10 percent from every edge, since some displays crop slightly and tight text feels cramped. Big, simple, high-contrast text beats clever text." },
            { t: "callout", kind: "note", html: "The <b>Essential Graphics</b> panel has a <b>Browse</b> tab of templates (FilmCraft's own <code>.fcgt</code> format) that you can drag onto the Timeline. Adobe's <code>.mogrt</code> template files are refused." },
            { t: "keys", items: [
              { keys: "T", action: "Type tool" },
              { keys: "Ctrl+T", action: "New text layer" },
              { keys: "Ctrl+Alt+R", action: "New rectangle layer" },
              { keys: "Ctrl+Alt+E", action: "New ellipse layer" }
            ] },
            { t: "claude", title: "Try it with Claude: precise titles", prompts: [
              { prompt: "Using the live filmcraft server, add a text title \"Earth from Above\" at 1 second for 4 seconds on V3, centered, white, large (about 96 px), then fade its opacity in and out over 12 frames each. Render a frame at 2 seconds so I can check legibility.", why: "Claude uses graphics.newText (text, seconds, size, track, time), graphics.set for style, keyframe commands for opacity, then render_frame. Compare with your hand-made title; ask it to move or restyle until you like it." },
              { prompt: "Which of the texts in my sequence might be hard to read? Look at a rendered frame and tell me what you would change.", why: "Claude can look at render_frame images and judge contrast and size. It does not know your audience; treat this as a second opinion." }
            ] },
            { t: "quiz", items: [
              { q: "Why add a drop shadow or background to a title?", choices: ["It uses more memory", "It improves readability against busy footage", "It changes the codec", "It is required"], answer: 1, explain: "Contrast and separation make text easy to read over detailed pictures." },
              { q: "How is a title represented in FilmCraft?", choices: ["A marker", "A graphic clip on a video track", "An audio clip", "A project bin"], answer: 1, explain: "A graphic clip holds text and shape layers, and behaves like any other clip." }
            ] },
            { t: "exercise", title: "Title card and lower third", html: "Make a title card for the start of your film and a <b>lower third</b> (a small name or label in the lower left) that appears for 3 seconds at 10 seconds in. For the lower third use a rectangle behind the text and fade both together.", steps: ["New text layer; style it.", "New rectangle layer (Ctrl+Alt+R) on the same graphic; arrange it behind the text.", "Fade the whole graphic clip's opacity.", "Check legibility."] },
            { t: "check", html: "Your sequence has a styled, readable title that fades in and out." }
          ]
        },
        {
          id: "m9-l2",
          title: "Captions you can turn on and off",
          minutes: 13,
          goals: [
            "Explain why captions matter and how they differ from titles.",
            "Import a caption file and add captions by hand.",
            "Export captions or burn them into the picture."
          ],
          assets: ["captions-srt", "earth-views"],
          blocks: [
            { t: "p", html: "<b>Captions</b> (or subtitles) are timed text that shows what is said. They make video accessible to people who are deaf or hard of hearing, help viewers watching with the sound off (very common on phones), and help non-native speakers. Unlike a title, captions live on their own <b>caption track</b> shown above the video tracks, and they can be turned on or off, exported to a file, or burned into the picture." },
            { t: "h", text: "Import a caption file" },
            { t: "steps", items: [
              { html: "Open the sequence you have been practicing on so it is the active sequence in the Timeline.", check: "The Timeline shows your sequence." },
              { html: "Press <kbd>Ctrl</kbd>+<kbd>I</kbd> and import <code>captions.srt</code> from your practice folder.", detail: "FilmCraft recognizes <code>.srt</code>, <code>.vtt</code> and <code>.scc</code> caption files by their extension and content and adds a new caption track to the open sequence.", check: "A new caption track (named C1 or similar) appears above V3, filled with caption boxes." },
              { html: "Play the start of the sequence.", check: "Caption text appears over the picture at the times in the file." }
            ] },
            { t: "h", text: "Make captions by hand" },
            { t: "steps", items: [
              { html: "Choose <b>Sequence &gt; Captions &gt; Add New Caption Track...</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>A</kbd>) and accept the default format and language.", check: "An empty caption track appears." },
              { html: "Park the playhead where someone starts speaking and choose <b>Sequence &gt; Captions &gt; Add Caption at Playhead</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>C</kbd>).", check: "A new caption box appears at the playhead." },
              { html: "Open the <b>Text</b> panel (it is a tab in the right column of the Editing workspace, and in the Captions and Graphics workspace). Click the caption and type its text.", check: "The new text appears in the Program monitor." },
              { html: "Drag the left or right edge of a caption in the Timeline to change when it appears and disappears.", detail: "Good captions stay on screen for at least a second and a half, and no more than two short lines. Captions on a track never overlap." }
            ] },
            { t: "h", text: "Get them out again" },
            { t: "p", html: "<ul><li><b>Sidecar file:</b> <b>File &gt; Export &gt; Captions...</b> writes the caption track as <code>.srt</code>, <code>.vtt</code> or <code>.scc</code>. Upload that file next to your video on platforms that support it.</li><li><b>Burned in:</b> in the Export settings, the <b>Captions</b> section can burn the captions into the picture, so they are always visible. Burned-in captions cannot be turned off by the viewer.</li></ul>" },
            { t: "callout", kind: "note", html: "In this course you type captions yourself or import a file. Writing the text is the slow part, so see the Claude block below for a faster way to draft them." },
            { t: "claude", title: "Try it with Claude: draft and import captions", prompts: [
              { prompt: "Write a UTF-8 SubRip file called captions-draft.srt in my current folder with 6 short caption cues that fit the first 30 seconds of a short film about seeing Earth from space. Then, using the live filmcraft server, import it into the open project and tell me the caption track that was created.", why: "Claude writes the file with its own file tools, then calls media_import or file.import (the .srt becomes a caption track) via command_run. Use captions.list to read them back. Edit the wording yourself in the Text panel." },
              { prompt: "List all captions on the active sequence. Flag any that are shorter than 1 second or have more than two lines.", why: "Uses captions.list through command_run and checks the text and durations. Reading only; fix them by hand or ask Claude to use captions.setText." }
            ] },
            { t: "quiz", items: [
              { q: "Which statement about captions is true?", choices: ["They are the same as a title clip on V1", "They live on caption tracks and can be exported to .srt or burned in", "They cannot be edited", "They only work with audio"], answer: 1, explain: "Caption tracks are separate, and support export to SRT, VTT and SCC or burn-in." },
              { q: "Which file type does FilmCraft recognize as captions on import?", choices: [".srt", ".mp3", ".png", ".fcproj"], answer: 0, explain: "SRT, VTT and SCC files are recognized and become caption tracks." }
            ] },
            { t: "exercise", title: "Captions for your voice-over", html: "Listen to your voice-over and write captions for it in the Text panel: aim for one idea per caption, each no longer than two short lines and shown for at least 1.5 seconds. Export them as an <code>.srt</code> file in your <code>exports</code> folder.", steps: ["Add a new caption track.", "Add a caption at each phrase.", "File > Export > Captions...", "Open the .srt file in Notepad to see its format."] },
            { t: "check", html: "You have a caption track in your sequence, from either an imported file or your own typing, and you know how to export it." }
          ]
        },
        {
          id: "m9-l3",
          title: "Export: presets, formats and file size",
          minutes: 14,
          goals: [
            "Explain what export does and choose the right preset for a destination.",
            "Export a short range as a test, then the whole sequence.",
            "Find, play and sanity-check your finished file."
          ],
          assets: [],
          blocks: [
            { t: "p", html: "Your <code>.fcproj</code> is a set of instructions. <b>Exporting</b> (also called <b>rendering</b>) turns the sequence into a single normal video file anyone can play. It decodes every source clip, applies effects, color, mixing and titles for each frame, then compresses the result with a codec. Plan time for it: FilmCraft renders on the CPU, so long, 4K or effect-heavy exports can be slow." },
            { t: "h", text: "Choose the right target" },
            { t: "p", html: "<ul><li><b>H.264 in an MP4</b> (with AAC audio): the universal delivery format. It plays almost everywhere. Use the preset <b>YouTube 1080p Full HD</b> or <b>High Quality 1080p HD</b> for web, social and sharing.</li><li><b>Social Vertical 1080x1920</b>: for phone-shaped video.</li><li><b>ProRes, DNxHR</b>: huge, high quality, for archive or sending to another editing or color program, not for sharing.</li><li>Also available: image sequences, animated GIF and audio-only WAV or AIFF.</li></ul><p>Higher <b>bitrate</b> means better quality and larger files. Presets pick sensible bitrates for you.</p>" },
            { t: "callout", kind: "warn", html: "FilmCraft cannot export <b>HEVC (H.265)</b> or <b>AV1</b> (only a hardware HEVC option on some systems). H.264 is the delivery codec here, and that is fine for nearly everything." },
            { t: "steps", items: [
              { html: "Save your project, then press <kbd>Ctrl</kbd>+<kbd>M</kbd> or click the <b>Export</b> tab in the header.", check: "The Export screen opens, with a destination list on the left, settings in the middle and a preview with a Summary on the right." },
              { html: "Under <b>Media File</b> set <b>File Name</b> to <code>test-export</code> and <b>Location</b> to your <code>%USERPROFILE%\\ArtCraft\\FilmCraft\\exports</code> folder.", check: "The file name and folder are right." },
              { html: "Open <b>Preset</b> and choose <b>YouTube 1080p Full HD</b>. Check that <b>Format</b> shows H.264.", detail: "The default preset is Match Source - Adaptive High Bitrate, which matches your sequence. Presets set dozens of settings at once; the <b>Video</b>, <b>Audio</b>, <b>Multiplexer</b>, <b>Captions</b>, <b>Effects</b> and <b>Metadata</b> sections let you see or tweak them." },
              { html: "Find <b>Range</b> and choose <b>Source In/Out</b> if you marked a short stretch with I and O in the Timeline, or <b>Entire Source</b> otherwise.", detail: "Test first: mark just 5 or 10 seconds so the test finishes fast. Premiere's Work Area bar does not exist in FilmCraft, even though Work Area may still appear in the list. Use Entire Source or Source In/Out.", check: "The <b>Summary</b> on the right shows the estimated file size." },
              { html: "Click <b>Export</b>. (<b>Send to Queue</b> adds it to a list to run later.)", check: "A progress indicator appears (the bell in the header, and a percentage and time left in the status bar) and the file appears in your <code>exports</code> folder when it finishes." },
              { html: "Open the finished file in Windows (the Media Player or Movies and TV app) and watch it from start to end with headphones.", check: "Picture, sound, titles and captions (if burned in) all look and sound as they did in FilmCraft." }
            ] },
            { t: "callout", kind: "tip", html: "<b>Quick Export</b> (the share icon in the top-right of the header) opens a small popup where you pick a preset and a path and go, without leaving the editor." },
            { t: "callout", kind: "note", html: "The Export screen lists only <b>Media File</b> as a working destination. The platform shortcuts you may see in older screenshots (YouTube, Vimeo, FTP) do not upload anything. Export the file yourself, then upload it." },
            { t: "callout", kind: "adobe", html: "In Premiere tutorials this is the <b>Export</b> tab / Media Encoder. Here the queue is built in: <b>Send to Queue</b> then start it from the queue on the Export screen." },
            { t: "claude", title: "Try it with Claude: review, then export", html: "Save a copy of your project first. Review the plan before Claude starts a long export.", prompts: [
              { prompt: "Using the live filmcraft server, tell me what you would export: the name of the active sequence, its duration, resolution and frame rate, and whether anything looks risky (offline media, a track muted, a very quiet or clipped audio clip). Do not export yet.", why: "Claude uses sequence_inspect, project_inspect and command_list, and possibly clip.audioPeak. Fix anything it finds, then continue. This is the review step before every export." },
              { prompt: "Export the active sequence with the YouTube 1080p Full HD preset to %USERPROFILE%\\ArtCraft\\FilmCraft\\exports\\test-claude.mp4 and wait until it finishes. Then tell me the file size and how it compares to the estimate.", why: "Claude runs file.exportMedia (path, preset, wait) through command_run; the app stays responsive and shows progress. Afterwards Claude checks the file with its normal file tools. Open the file yourself and watch it: Claude cannot judge picture and sound the way you can." }
            ] },
            { t: "quiz", items: [
              { q: "You want a video that plays on almost any device. Which setup?", choices: ["ProRes in MOV", "H.264 with AAC in MP4", "Image sequence", "WAV"], answer: 1, explain: "H.264/AAC in MP4 is the most compatible delivery format." },
              { q: "Why export a short test range first?", choices: ["It is required", "Exports can be slow, and a test catches problems quickly", "It improves quality", "It deletes the original"], answer: 1, explain: "Check settings on 5 to 10 seconds before waiting for a long export." },
              { q: "What does a higher bitrate usually give you?", choices: ["Smaller files, worse quality", "Better quality and a bigger file", "Faster playback", "Louder sound"], answer: 1, explain: "More data per second keeps more detail, at the cost of file size." }
            ] },
            { t: "check", html: "You have exported at least one video to your <code>exports</code> folder and watched the result from start to finish." }
          ]
        },
        {
          id: "m9-l4",
          title: "Capstone: a one-minute short film",
          minutes: 25,
          goals: [
            "Plan and build a complete 45 to 60 second video using every skill from the course.",
            "Use Claude as a reviewer and automator, while you make the creative decisions.",
            "Export and check the final film."
          ],
          assets: ["earth-views", "apollo-launch", "apollo-moonwalk", "apollo-broll", "chopin-nocturne", "voiceover", "still-photo", "captions-srt"],
          blocks: [
            { t: "p", html: "Time to make something. Your brief: <b>\"Leaving and Looking Back\"</b>, a 45 to 60 second film about humanity going to space, using the practice media. The story is yours to shape; one suggestion is <i>launch, journey, a first step, then a look back at Earth</i>. You may use the built-in demo clips instead if you have no practice footage." },
            { t: "h", text: "Requirements checklist" },
            { t: "p", html: "<ol><li><b>Structure</b>: at least 8 shots on V1, with Insert and Overwrite used on purpose (module 4).</li><li><b>Pacing</b>: trimmed with at least one Rolling Edit and one Ripple Trim; no accidental gaps (module 4).</li><li><b>Transitions</b>: one Cross Dissolve and one Dip to Black, each with a reason (module 5).</li><li><b>Motion</b>: a Ken Burns move on the still, with easing, and one fade (module 6).</li><li><b>Color</b>: every shot corrected on the scopes, and one subtle look on an adjustment layer (module 7).</li><li><b>Sound</b>: voice-over on A3 tagged as Dialogue, music on A2 faded in and out and ducked under the voice, final loudness near -14 LUFS integrated with true peak under -1 dBTP (module 8).</li><li><b>Words</b>: one title card, one lower third or label, and captions for the voice-over (module 9).</li><li><b>Output</b>: exported with a 1080p H.264 preset as <code>capstone.mp4</code> in your <code>exports</code> folder.</li></ol>" },
            { t: "h", text: "Work in this order" },
            { t: "steps", items: [
              { html: "<b>Plan (3 minutes).</b> Write your story in three lines and the mood in one word. Decide your five best shots.", check: "A note exists with the story and mood." },
              { html: "<b>Make a new project</b> (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>N</kbd>), save it as <code>capstone.fcproj</code> in your work folder, and import the practice clips as in module 3.", check: "The Project panel has your bins." },
              { html: "<b>Rough cut.</b> Choose selects in the Source monitor and build the sequence with Insert and Overwrite. Play it start to finish.", check: "A rough, ugly but complete sequence of 45 to 60 seconds." },
              { html: "<b>Tighten.</b> Cut dull parts with Ripple Delete, fix cuts with Rolling and Ripple trims.", check: "The pace feels purposeful." },
              { html: "<b>Polish picture.</b> Add transitions with reasons, the Ken Burns, fades, and correct each shot on the scopes. Then add the adjustment-layer look.", check: "Shots look like one film." },
              { html: "<b>Sound.</b> Place the voice-over and music, set levels, fade, duck, and check loudness.", check: "Voice is clear; meters are healthy." },
              { html: "<b>Words.</b> Add the title, the label, and captions.", check: "All text is readable and inside the safe margins." },
              { html: "<b>Review, then export.</b> Save a copy. Export with a 1080p H.264 preset to <code>exports\\capstone.mp4</code>. Watch it from start to end.", check: "A finished MP4 plays correctly." }
            ] },
            { t: "callout", kind: "tip", html: "Save a copy at each milestone (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>S</kbd>). If a step goes wrong you can go back to your last good version." },
            { t: "claude", title: "Use Claude as your editor's assistant", html: "Do the creative work yourself. Ask Claude to audit and to take over the repetitive jobs.", prompts: [
              { prompt: "Using the live filmcraft server, review my active sequence against this checklist and report each item as done, partly done or missing, with evidence from the sequence: (1) at least 8 clips on V1, (2) no gaps on V1, (3) a Cross Dissolve and a Dip to Black, (4) keyframes on the still, (5) a Lumetri Color effect on every V1 clip and an adjustment layer, (6) dialogue and music audio clips with ducking keyframes, (7) a title graphic and a caption track. Do not change anything.", why: "Read-only audit with sequence_inspect (clips, effects, transitions, markers), project_inspect, and possibly command_list for details. Treat the answer as a checklist, then fix the gaps yourself." },
              { prompt: "For every clip on V1, read the scopes on its first frame and tell me which shots are the outliers in brightness or color. Suggest small fixes, but do not apply them.", why: "Uses scopes.read and playhead.set per clip, with render_frame for evidence. You decide whether to apply the suggestions." },
              { prompt: "Check the peak level of every audio clip and take a screenshot of the Audio Meters at the end of a full playback. Tell me if true peak is under -1 dBTP and if integrated loudness is near -14 LUFS.", why: "Uses clip.audioPeak, ui_key to play, and ui_screenshot of the Audio Meters. Remember: only you can hear it." },
              { prompt: "Export the active sequence to %USERPROFILE%\\ArtCraft\\FilmCraft\\exports\\capstone.mp4 using the YouTube 1080p Full HD preset, wait until it finishes, and tell me the file size.", why: "file.exportMedia via command_run, only after you have watched your final cut in FilmCraft. Open the finished file in a media player yourself." }
            ] },
            { t: "quiz", items: [
              { q: "Which step should come last before you export?", choices: ["Polishing a transition", "Reviewing the whole sequence yourself, start to finish", "Deleting your clips", "Closing Claude"], answer: 1, explain: "Always watch and listen to the whole edit before you export. Do not publish what you have not watched." },
              { q: "Which job is best given to Claude?", choices: ["Deciding the story and the mood", "Judging how the mix sounds", "Auditing a checklist and doing repetitive tasks like naming markers", "Choosing which shot is emotionally strongest"], answer: 2, explain: "Claude is strong at audits and repetition. Story, taste and listening stay with you." }
            ] },
            { t: "exercise", title: "Share it", html: "Export your capstone, watch it on another device if you can (phone or TV), and write down three things you would do differently next time. Then pick one of those and fix it in a copy of your project.", steps: ["Copy capstone.mp4 to a phone or another PC.", "Watch it with fresh eyes.", "List 3 changes.", "Save a copy of the project and apply one."] },
            { t: "check", html: "You have a finished, exported film, and you have used every major skill in the course by hand and with Claude." }
          ]
        }
      ]
    },
  ],
  shortcuts: [
    { group: "File and project", items: [
      { keys: "Ctrl+Alt+N", action: "New project" },
      { keys: "Ctrl+N", action: "New sequence" },
      { keys: "Ctrl+B", action: "New bin (with the Project panel focused)" },
      { keys: "Ctrl+O", action: "Open project" },
      { keys: "Ctrl+S", action: "Save" },
      { keys: "Ctrl+Shift+S", action: "Save As" },
      { keys: "Ctrl+Alt+S", action: "Save a Copy" },
      { keys: "Ctrl+I", action: "Import media" },
      { keys: "Ctrl+M", action: "Export mode" }
    ] },
    { group: "Edit", items: [
      { keys: "Ctrl+Z", action: "Undo" },
      { keys: "Ctrl+Shift+Z", action: "Redo" },
      { keys: "Ctrl+X / Ctrl+C / Ctrl+V", action: "Cut, copy, paste" },
      { keys: "Ctrl+Shift+V", action: "Paste Insert" },
      { keys: "Backspace", action: "Clear (delete, leaves a gap)" },
      { keys: "Shift+Delete", action: "Ripple Delete (delete and close the gap)" },
      { keys: "Ctrl+A", action: "Select all" },
      { keys: "Ctrl+Shift+A", action: "Deselect all" },
      { keys: "Ctrl+Alt+K", action: "Keyboard Shortcuts editor" },
      { keys: "Ctrl+,", action: "Preferences (General)" }
    ] },
    { group: "Playback and navigation", items: [
      { keys: "Space", action: "Play or stop" },
      { keys: "L / K / J", action: "Play forward / stop / play backward (press L or J again for faster)" },
      { keys: "Alt+K", action: "Play In to Out" },
      { keys: "Left / Right", action: "Step one frame" },
      { keys: "Shift+Left / Shift+Right", action: "Step five frames" },
      { keys: "Up / Down", action: "Previous or next edit point" },
      { keys: "Home / End", action: "Start or end of the sequence" },
      { keys: "= / - / \\", action: "Timeline zoom in / zoom out / zoom to fit the sequence" }
    ] },
    { group: "Marks and markers", items: [
      { keys: "I / O", action: "Mark In / Mark Out" },
      { keys: "X", action: "Mark Clip" },
      { keys: "Shift+I / Shift+O", action: "Go to In / Go to Out" },
      { keys: "Ctrl+Shift+I / Ctrl+Shift+O", action: "Clear In / Clear Out" },
      { keys: "Ctrl+Shift+X", action: "Clear In and Out" },
      { keys: "M", action: "Add marker" },
      { keys: "Shift+M", action: "Go to next marker" },
      { keys: "Ctrl+Shift+M", action: "Go to previous marker" }
    ] },
    { group: "Editing", items: [
      { keys: ",", action: "Insert (Source monitor)" },
      { keys: ".", action: "Overwrite (Source monitor)" },
      { keys: ";", action: "Lift (remove In-Out range, leave a gap)" },
      { keys: "'", action: "Extract (remove In-Out range, close the gap)" },
      { keys: "Ctrl+K", action: "Add Edit at the playhead" },
      { keys: "Ctrl+Shift+K", action: "Add Edit to all tracks" },
      { keys: "S", action: "Snap in Timeline on/off" },
      { keys: "Ctrl+L", action: "Link clips" },
      { keys: "Ctrl+G", action: "Group clips" },
      { keys: "Shift+E", action: "Enable or disable a clip" },
      { keys: "Ctrl+R", action: "Speed/Duration" },
      { keys: "G", action: "Audio Gain" },
      { keys: "] / [", action: "Increase / decrease clip volume by 1 dB" },
      { keys: "Ctrl+D", action: "Apply video transition" },
      { keys: "Ctrl+Shift+D", action: "Apply audio transition" },
      { keys: "Shift+D", action: "Apply default transitions" },
      { keys: "F", action: "Match Frame" },
      { keys: "Enter", action: "Render effects from In to Out" }
    ] },
    { group: "Trimming", items: [
      { keys: "Shift+T", action: "Trim Edit (open trim mode)" },
      { keys: "E", action: "Extend selected edit to the playhead" },
      { keys: "Q / W", action: "Ripple trim previous / next edit to the playhead" },
      { keys: "Alt+Q / Alt+W", action: "Trim previous / next edit to the playhead (no ripple)" },
      { keys: "Alt+Left / Alt+Right", action: "Trim selected edit by one frame (add Shift for five)" }
    ] },
    { group: "Tools", items: [
      { keys: "V", action: "Selection" },
      { keys: "A / Shift+A", action: "Track Select Forward / Backward" },
      { keys: "B", action: "Ripple Edit" },
      { keys: "N", action: "Rolling Edit" },
      { keys: "R", action: "Rate Stretch" },
      { keys: "C", action: "Razor" },
      { keys: "Y", action: "Slip" },
      { keys: "U", action: "Slide" },
      { keys: "P", action: "Pen" },
      { keys: "H", action: "Hand" },
      { keys: "Z", action: "Zoom" },
      { keys: "T", action: "Type" }
    ] },
    { group: "Workspaces and panels", items: [
      { keys: "Alt+Shift+1", action: "Editing workspace" },
      { keys: "Alt+Shift+2", action: "Assembly workspace" },
      { keys: "Alt+Shift+3", action: "Color workspace" },
      { keys: "Alt+Shift+4", action: "Effects workspace" },
      { keys: "Alt+Shift+5", action: "Audio workspace" },
      { keys: "Alt+Shift+6", action: "Captions and Graphics workspace" },
      { keys: "Alt+Shift+0", action: "Reset the workspace layout" },
      { keys: "Shift+1", action: "Project panel" },
      { keys: "Shift+2", action: "Source monitor" },
      { keys: "Shift+3", action: "Timeline" },
      { keys: "Shift+4", action: "Program monitor" },
      { keys: "Shift+5", action: "Effect Controls" },
      { keys: "Shift+6", action: "Audio Track Mixer" },
      { keys: "Shift+7", action: "Effects" },
      { keys: "Shift+8", action: "Media Browser" },
      { keys: "Shift+9", action: "Audio Clip Mixer" }
    ] },
    { group: "Captions and graphics", items: [
      { keys: "Ctrl+Alt+A", action: "Add new caption track" },
      { keys: "Ctrl+Alt+C", action: "Add caption at the playhead" },
      { keys: "Ctrl+Alt+Down / Ctrl+Alt+Up", action: "Next / previous caption" },
      { keys: "Ctrl+T", action: "New text layer" },
      { keys: "Ctrl+Alt+R", action: "New rectangle layer" },
      { keys: "Ctrl+Alt+E", action: "New ellipse layer" }
    ] }
  ],
  glossary: [
    { term: "Adjustment layer", def: "A see-through clip whose effects (for example a color look) apply to everything on the tracks below it. Made from <b>New Item &gt; Adjustment Layer...</b> in the Project panel." },
    { term: "Aspect ratio", def: "The shape of the frame: width compared to height. 16:9 is standard widescreen; 9:16 is vertical phone video." },
    { term: "Bin", def: "A folder in the Project panel used to organize clips. It does not move files on disk." },
    { term: "Bitrate", def: "How much data per second a compressed video or audio file uses. Higher usually means better quality and bigger files." },
    { term: "Bridge (live) mode", def: "The way the <code>filmcraft</code> MCP server controls the running FilmCraft window through the control port (<code>--control 9876</code>), so Claude's edits show up on screen." },
    { term: "Clipping", def: "When a signal exceeds the maximum: in audio, over 0 dB (distortion); in picture, pure white or pure black with lost detail." },
    { term: "Codec", def: "The method used to compress and decompress video or audio, for example H.264, ProRes, AAC. Not the same as the container." },
    { term: "Command", def: "FilmCraft's unit of action, with an id such as <code>timeline.razor</code>. Menus, shortcuts, the command-line tool and Claude's MCP tools all run commands." },
    { term: "Container", def: "The file wrapper that holds video, audio and extras together: MP4, MOV, MKV, WebM, MXF. The file extension names the container, not the codec." },
    { term: "Cross Dissolve", def: "A transition where one shot fades into the next over a short time." },
    { term: "Decibel (dB)", def: "The unit for audio level. 0 dB is the digital maximum; real levels are negative. About 10 dB is a doubling or halving of perceived loudness." },
    { term: "Ducking", def: "Automatically lowering music while dialogue is present. Done in Essential Sound with generated volume keyframes." },
    { term: "Easing", def: "Making animation speed up or slow down gradually (Ease In, Ease Out) instead of moving at constant speed." },
    { term: "Effect Controls", def: "The panel showing a clip's settings: Motion, Opacity, Time Remapping and every effect, with keyframe controls." },
    { term: "Exposure", def: "Overall brightness of a picture." },
    { term: "Extract", def: "Removes the range between In and Out from the sequence and closes the gap. (Lift leaves the gap.)" },
    { term: "Frame", def: "One still picture in a video. Video is a rapid sequence of frames." },
    { term: "Frame rate", def: "How many frames are shown per second (fps), for example 24, 30 or 60." },
    { term: "Gap", def: "Empty space on a track between clips, left by Clear, Lift or a regular trim." },
    { term: "Handles", def: "Extra footage beyond a clip's In and Out points, needed for trims and transitions." },
    { term: "Headless", def: "Running FilmCraft's engine with no window. The <code>filmcraft-headless</code> MCP server works on its own in-memory copy of the demo project." },
    { term: "Histogram", def: "A graph of how many pixels are at each brightness, dark on the left and bright on the right." },
    { term: "In point / Out point", def: "The start and end of the part of a clip (or the range of a sequence) you choose to use. Set with I and O." },
    { term: "Insert", def: "Adds a clip at the playhead and pushes everything after it later, making the sequence longer. (Overwrite replaces what is under it.)" },
    { term: "Integrated loudness (I)", def: "A LUFS reading of the loudness of the whole piece so far, shown as I in the Audio Meters." },
    { term: "Interpolation", def: "How FilmCraft calculates values between two keyframes: Linear, Bezier, Hold, Ease In, Ease Out and so on." },
    { term: "Keyframe", def: "A value of a setting stored at a particular time. Two keyframes with different values make something change over time." },
    { term: "Lift", def: "Removes the range between In and Out from the targeted tracks and leaves a gap." },
    { term: "Look / LUT", def: "A prepared color style. A LUT (lookup table) is a file that remaps colors; FilmCraft's Creative section has eight built-in looks and can load LUT files." },
    { term: "Lumetri Color", def: "FilmCraft's color panel: Basic Correction, Creative, Curves, Color Wheels &amp; Match, HSL Secondary and Vignette." },
    { term: "LUFS", def: "Loudness Units relative to Full Scale: a measure of how loud audio sounds over time. Online delivery commonly targets about -14 LUFS." },
    { term: "Marker", def: "A colored bookmark on the Timeline ruler, added with M." },
    { term: "MCP (Model Context Protocol)", def: "A standard way for an AI such as Claude to call tools in an application. FilmCraft's MCP server exposes its commands, inspection tools and screenshots." },
    { term: "Offline media", def: "A clip whose file was moved, renamed or deleted after import, so the project can no longer find it." },
    { term: "Opacity", def: "How see-through a clip is: 100% fully visible, 0% invisible." },
    { term: "Parade", def: "A scope showing red, green and blue waveforms side by side, useful for spotting color casts." },
    { term: "Playhead", def: "The thin blue line showing the current time on the Timeline." },
    { term: "Preset", def: "A saved set of settings, for example an export preset such as YouTube 1080p Full HD." },
    { term: "Program monitor", def: "Shows the edited sequence at the playhead." },
    { term: "Render", def: "Calculating the final pictures and sound with all effects applied, either for smooth preview (Enter) or for export." },
    { term: "Resolution", def: "The size of a frame in pixels, for example 1920x1080." },
    { term: "Ripple", def: "An edit that moves everything after it to make or close space. Ripple Delete and Ripple Edit are examples." },
    { term: "Rolling Edit", def: "Moves the cut between two clips: one gets longer, the other shorter, total length unchanged." },
    { term: "Sample rate", def: "How many times per second audio is measured, for example 48 kHz (48,000 times a second)." },
    { term: "Scopes", def: "Graphs that measure a picture objectively: Waveform, Histogram, Parade and Vectorscope." },
    { term: "Sequence", def: "Your edit: clips arranged on tracks over time in the Timeline." },
    { term: "Slip / Slide", def: "Slip changes which part of the source a clip shows without moving it. Slide moves a clip while its neighbors adjust." },
    { term: "Source monitor", def: "Shows a single clip so you can preview it and set In and Out points before adding it to a sequence." },
    { term: "Timecode", def: "A time label in the form HH:MM:SS:FF (hours, minutes, seconds, frames)." },
    { term: "Track", def: "A horizontal lane in the Timeline: V1, V2... for video and A1, A2... for audio. Higher video tracks cover lower ones." },
    { term: "Transition", def: "A blend between two shots, such as Cross Dissolve or Dip to Black." },
    { term: "Vectorscope", def: "A circular scope showing hue (angle) and saturation (distance from the centre)." },
    { term: "Waveform (picture)", def: "A scope plotting brightness (vertical) against position across the frame (horizontal)." },
    { term: "White balance", def: "Making whites look white, by adjusting Temperature (blue to orange) and Tint (green to magenta)." },
    { term: "Workspace", def: "A saved arrangement of panels, such as Editing, Color or Audio." }
  ],
  claudeCheatsheet: [
    { task: "Check that Claude is connected", prompt: "Using the live filmcraft server, tell me which project is open in FilmCraft, which sequence is active and how long it is. Do not change anything.", tools: ["doc_inspect"] },
    { task: "Describe the current edit", prompt: "Inspect the active sequence and list each track with its clips: name, start, duration and any effects, transitions or markers.", tools: ["sequence_inspect"] },
    { task: "Look at the picture", prompt: "Render a frame of the active sequence at 5 seconds and describe what you see.", tools: ["render_frame", "render_preview"] },
    { task: "Screenshot a panel", prompt: "Take a screenshot of the Timeline panel in the live FilmCraft window and tell me what the track header switches are set to.", tools: ["ui_screenshot", "ui_inspect"] },
    { task: "Find the right command", prompt: "Search the commands for anything related to ripple delete. Tell me each command's id, menu path, shortcut and parameters. Do not run them.", tools: ["command_list"] },
    { task: "Undo Claude's last change", prompt: "Undo your last change in the live FilmCraft window and confirm with sequence_inspect that it is gone.", tools: ["command_run", "sequence_inspect"] },
    { task: "Import and organize a folder", prompt: "Import every video, audio and image file from %USERPROFILE%\\ArtCraft\\FilmCraft\\practice into the open project, then create bins named Video, Audio and Stills and move each file into the right bin.", tools: ["media_import", "command_batch", "project_inspect"] },
    { task: "Assemble clips by time", prompt: "Place earth-views on V1 at 0 seconds, then apollo-broll right after it using only seconds 20 to 30 of the source. Report the total sequence length.", tools: ["command_run", "sequence_inspect"] },
    { task: "Split and ripple delete by timecode", prompt: "Split the clip on V1 at 8 seconds and ripple delete the second half so later clips move left. Show sequence_inspect before and after.", tools: ["command_run", "sequence_inspect"] },
    { task: "Name markers automatically", prompt: "Add a named marker at the start of every clip on V1, using the clip name as the marker name and a different color for each.", tools: ["sequence_inspect", "command_batch"] },
    { task: "Exact transition length", prompt: "Apply a Cross Dissolve of exactly 24 frames at the cut between the first and second clip on V1, then render a frame at the middle of the dissolve.", tools: ["command_run", "render_frame"] },
    { task: "Change speed with a number", prompt: "Set the first clip on V1 to 50% speed with ripple on and tell me its new duration in seconds and frames.", tools: ["command_run", "sequence_inspect"] },
    { task: "Keyframe a move", prompt: "On the still on V2, animate Scale from 100 to 112 over its whole length with Ease Out at the start and Ease In at the end, then render frames at the start, middle and end.", tools: ["command_run", "render_frame"] },
    { task: "Read the scopes", prompt: "Read the scopes for the frame at the playhead and tell me whether highlights or shadows are clipped and whether there is a color cast.", tools: ["command_run", "render_frame"] },
    { task: "Audit audio levels", prompt: "Check the peak amplitude of every audio clip in the active sequence and give me a table of name, track and peak in dB. Which is closest to clipping?", tools: ["command_run", "sequence_inspect"] },
    { task: "Duck music under a voice", prompt: "Tag the voice-over clip as Dialogue and the music clip as Music with Essential Sound, run Auto-Match on the dialogue and generate ducking for the music against dialogue.", tools: ["command_run", "command_list"] },
    { task: "Add a title", prompt: "Add a text title \"Earth from Above\" at 1 second for 4 seconds on V3, centered and white, and fade its opacity in and out over 12 frames each.", tools: ["command_run", "render_frame"] },
    { task: "Draft and import captions", prompt: "Write a UTF-8 SubRip file called captions-draft.srt in my current folder with 6 short cues for the first 30 seconds, then import it into the live project as a caption track.", tools: ["media_import", "command_run"] },
    { task: "Pre-export review", prompt: "Tell me the active sequence name, duration, resolution and frame rate, and flag anything risky such as offline media, muted tracks or clipping audio. Do not export yet.", tools: ["project_inspect", "sequence_inspect", "command_run"] },
    { task: "Export a finished file", prompt: "Export the active sequence with the YouTube 1080p Full HD preset to %USERPROFILE%\\ArtCraft\\FilmCraft\\exports\\final.mp4 and wait until it finishes. Tell me the file size.", tools: ["command_run"] },
    { task: "Experiment safely with no window", prompt: "Using the filmcraft-headless server only, try a rough cut: add a marker at 3 seconds and razor the first clip at 2 seconds. Tell me what changed. Nothing should happen in my app window.", tools: ["command_run", "sequence_inspect"] }
  ],
  limitations: [
    "<b>Windows is lightly tested.</b> FilmCraft builds for Windows, but its developers test mostly on macOS and its roadmap calls Windows \"barely exercised at runtime\". Expect rough edges, save often, and treat the project as young software.",
    "<b>Source monitor Play does nothing.</b> The Play button in the Source monitor is currently a no-op. Scrub and frame-step to review a clip; <kbd>Space</kbd>, <kbd>J</kbd>, <kbd>K</kbd>, <kbd>L</kbd> play the sequence.",
    "<b>Limited input formats.</b> There is no camera RAW support, no E-AC-3 audio, and FilmCraft's own H.264 decoder handles only 8-bit 4:2:0 progressive video (no interlaced, 10-bit, 4:2:2 or HDR phone footage). Footage straight from phones and cameras is less tested than the practice clips; re-encode to a standard H.264 + AAC MP4 if a clip misbehaves.",
    "<b>H.264 is the only delivery codec.</b> There is no HEVC or AV1 export (only an opt-in hardware HEVC encoder on some systems). Plan for H.264 MP4 for sharing, and ProRes or DNxHR for hand-offs.",
    "<b>No Auto button or white-balance eyedropper</b> in Lumetri Color. Neutralize color casts with Temperature, Tint and the scopes. Generative AI tools and Object Mask are not present.",
    "<b>No Work Area bar.</b> Premiere's Work Area is not implemented, even though \"Work Area\" may appear in the Export range list. Use Entire Source or Source In/Out.",
    "<b>Export destinations.</b> Only <b>Media File</b> is a working destination; the YouTube, Vimeo, TikTok, Instagram and FTP entries in older screenshots do not upload. The camera <b>Export Frame</b> button in the monitors only shows a hint; export a still through Export mode.",
    "<b>Markers have no edit dialog.</b> You can add markers with <kbd>M</kbd>, but naming, commenting and coloring them is done through the <code>markers.edit</code> command (ask Claude). The same is true for setting an exact transition length: no field was found, so use <code>sequence.applyVideoTransition</code> through Claude.",
    "<b>Essential Sound Duration</b> (remixing music to a target length) is not available. Trim and fade music by hand.",
    "<b>Speech-to-text is not available in the default build.</b> FilmCraft has an optional <code>whisper</code> build feature for transcription, but it is off by default and not included in the build you are using, so the Text panel's Transcribe button is disabled. Type captions or import an <code>.srt</code> file instead.",
    "<b>Rendering is CPU-based.</b> Lumetri, keys, masks, most effects and export all render on the CPU, so 4K, heavy grades and optical-flow speed changes can be slow. Use lower playback resolution while editing and export short test ranges first. Hardware encoding is opt-in (Export &gt; Hardware encoding).",
    "<b>Effects that are approximate.</b> Auto Reframe, Warp Stabilizer (2-D) and Morph Cut are approximations of Premiere's versions, and AI features are minimal.",
    "<b>No plugin hosting and no Adobe ecosystem.</b> VST3, AU and OpenFX plugins cannot be loaded, Adobe <code>.mogrt</code> templates are refused, and there are no Teams, Productions or cloud features. Exchange projects through FCP7 XML, FCPXML, OTIO or EDL; AAF and OMF have not been validated in other programs, and Premiere's own <code>.prproj</code> files are not an import format.",
    "<b>Shortcut quirks.</b> The physical <kbd>Delete</kbd> key is not bound to Clear in the default shortcut set (use <kbd>Backspace</kbd>, or switch to the Premiere Pro Compatible preset in Edit &gt; Keyboard Shortcuts). <kbd>Ctrl</kbd>+<kbd>T</kbd> is bound to both New Text Layer and Toggle Trim Type on Windows.",
    "<b>Undo depth.</b> The undo history holds 200 steps in the current build, even though the project README describes it as unlimited.",
    "<b>Claude's limits.</b> Claude cannot hear audio, has no tool that returns a sequence's loudness (it must read the meter in a screenshot), and the live <code>filmcraft</code> server works only while FilmCraft is running with <code>--control 9876</code>. The <code>filmcraft-headless</code> server never changes your open window."
  ]
});
