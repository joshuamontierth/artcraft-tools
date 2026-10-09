#!/usr/bin/env bash
# fetch-course-assets.sh: download the public-domain / CC0 practice files for the ArtCraft courses.
# Reads courses/assets/manifest.js, downloads into courses/assets/<app>/ (skipping existing files), creates the
# derived files (a tilted copy for straightening, sample captions), and copies everything into
# ~/ArtCraft/<App>/practice/. About 350 MB.  Usage: fetch-course-assets.sh [--force] [course ...]
set -u
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
FORCE=0; ONLY=()
for a in "$@"; do case "$a" in --force) FORCE=1 ;; *) ONLY+=("$a") ;; esac; done
command -v curl >/dev/null || { echo "curl is required"; exit 2; }

"$PY" - "$ARTCRAFT_ROOT" "$FORCE" "$REPOCONF" "${ONLY[@]:-}" <<'EOF'
import json, os, shutil, subprocess, sys, time
root, force, repoconf, only = sys.argv[1], sys.argv[2] == "1", sys.argv[3], [x for x in sys.argv[4:] if x]
courses = os.path.join(root, "courses")
js = open(os.path.join(courses, "assets", "manifest.js"), encoding="utf-8").read()
man = json.loads(js[js.index("{"): js.rindex("}") + 1])
cfg = json.load(open(os.path.join(root, "ops", "config", "repos.json"), encoding="utf-8"))["repos"]
titles = {r["name"]: r["title"] for r in cfg}
UA = "ArtCraftCourseFetcher/1.0 (personal course practice files)"
SRT = """1
00:00:01,000 --> 00:00:04,000
This is our planet, seen from orbit.

2
00:00:04,500 --> 00:00:08,000
Every swirl of cloud is a weather system.

3
00:00:08,500 --> 00:00:12,000
Coastlines glow at the edge of night.

4
00:00:12,500 --> 00:00:16,000
City lights trace where people live.

5
00:00:16,500 --> 00:00:20,000
The atmosphere is a thin blue line.

6
00:00:20,500 --> 00:00:24,000
From up here, there are no borders.

7
00:00:24,500 --> 00:00:28,000
Just one world, turning slowly.

8
00:00:28,500 --> 00:00:30,000
Earth views, courtesy of NASA.
"""

def fetch(url, dest):
    tmp = dest + ".part"
    for i in range(3):
        if subprocess.call(["curl", "-fsSL", "--retry", "2", "-A", UA, "-o", tmp, url]) == 0 and os.path.getsize(tmp) > 0:
            os.replace(tmp, dest); return True
        time.sleep(3 * (i + 1))
    if os.path.exists(tmp): os.remove(tmp)
    return False

def tilt(src, dest, deg, warm):
    for tool in ("magick", "convert"):
        if shutil.which(tool):
            cmd = [tool, src, "-distort", "SRT", str(deg)]
            if warm: cmd += ["-channel", "R", "-evaluate", "multiply", "1.08", "-channel", "B", "-evaluate", "multiply", "0.88", "+channel"]
            # Crop away the empty corners by scaling up ~7%.
            cmd += ["-gravity", "center", "-resize", "107%", "-crop", "93.5%x93.5%+0+0", "+repage", "-quality", "92", dest]
            if subprocess.call(cmd) == 0: return "created (derived)"
    try:
        from PIL import Image, ImageOps  # optional
        im = Image.open(src).convert("RGB")
        w, h = im.size
        im = im.rotate(-deg, resample=Image.BICUBIC, expand=False).resize((int(w * 1.07), int(h * 1.07)))
        im = ImageOps.fit(im, (w, h))
        if warm:
            r, g, b = im.split(); r = r.point(lambda v: min(255, int(v * 1.08))); b = b.point(lambda v: int(v * 0.88))
            im = Image.merge("RGB", (r, g, b))
        im.save(dest, quality=92); return "created (derived, PIL)"
    except Exception:
        shutil.copy(src, dest); return "copied without tilt (install ImageMagick for the tilted version)"

entries = [e for e in man["files"] if not only or e["course"] in only]
entries = [e for e in entries if "url" in e] + [e for e in entries if "url" not in e]
failed = 0
for e in entries:
    dest = os.path.join(courses, *e["file"].split("/"))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    have = os.path.exists(dest) and os.path.getsize(dest) > 0
    if "manual" in e: st = "MANUAL: " + e["manual"]
    elif have and not force: st = "already present"
    elif "url" in e:
        print("downloading", e["file"], "...", flush=True)
        st = "downloaded" if fetch(e["url"], dest) else "FAILED: " + e["url"]
    elif "derive" in e:
        src = os.path.join(courses, *e["derive"]["from"].split("/"))
        if not os.path.exists(src):
            se = [x for x in man["files"] if x["file"] == e["derive"]["from"]]
            if se: os.makedirs(os.path.dirname(src), exist_ok=True); fetch(se[0]["url"], src)
        st = tilt(src, dest, e["derive"]["rotate"], e["derive"].get("warm")) if os.path.exists(src) else "FAILED: source missing"
    elif e.get("generate") == "srt":
        open(dest, "w", encoding="utf-8").write(SRT); st = "generated"
    else: st = "?"
    if st.startswith("FAILED"): failed += 1
    if os.path.exists(dest) and e["course"] in titles:
        p = os.path.join(os.path.expanduser("~"), "ArtCraft", titles[e["course"]], "practice")
        os.makedirs(p, exist_ok=True); shutil.copy(dest, os.path.join(p, os.path.basename(dest)))
    print("%-11s %-40s %s" % (e["course"], e["file"], st))
print("Done. %d failed. Practice folders: ~/ArtCraft/<App>/practice" % failed)
EOF
