/* ArtCraft Academy: a local, offline course viewer. No network, no build step.
   Course data: window.ARTCRAFT_COURSES (pushed by courses/data/*.js). */
(function () {
  'use strict';

  var ORDER = ['start', 'photocraft', 'lightcraft', 'filmcraft'];
  var COURSES = (window.ARTCRAFT_COURSES || []).slice().sort(function (a, b) {
    var ia = ORDER.indexOf(a.id), ib = ORDER.indexOf(b.id);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  var MANIFEST = window.ARTCRAFT_ASSET_MANIFEST || { files: [] };
  var $ = function (sel, el) { return (el || document).querySelector(sel); };
  var main = $('#main'), sidebar = $('#sidebar');

  // ---------- paths ----------
  var COURSES_DIR = (function () {
    if (location.protocol !== 'file:') return '';
    var p = decodeURIComponent(location.pathname).replace(/\/[^\/]*$/, '');
    if (/^\/[A-Za-z]:/.test(p)) p = p.slice(1).replace(/\//g, '\\');
    return p;
  })();
  var IS_WIN = /^[A-Za-z]:\\/.test(COURSES_DIR) || /Windows/.test(navigator.userAgent);
  var SEP = IS_WIN ? '\\' : '/';
  var ROOT_DIR = COURSES_DIR ? COURSES_DIR.replace(/[\\\/]courses$/, '') : (IS_WIN ? 'C:\\artcraft' : '~/artcraft');
  // Course text writes the toolkit folder as {ROOT}; show the folder this copy actually lives in.
  (function fillRoot(o) {
    for (var k in o) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) continue;
      if (typeof o[k] === 'string') o[k] = o[k].split('{ROOT}').join(ROOT_DIR);
      else if (o[k] && typeof o[k] === 'object') fillRoot(o[k]);
    }
  })(COURSES);
  function absCoursePath(rel) { return COURSES_DIR ? COURSES_DIR + SEP + rel.replace(/\//g, SEP) : rel; }
  function practicePath(course, file) {
    var base = file.split('/').pop();
    return IS_WIN ? '%USERPROFILE%\\ArtCraft\\' + course.app + '\\practice\\' + base : '~/ArtCraft/' + course.app + '/practice/' + base;
  }
  function workDir(course) { return IS_WIN ? '%USERPROFILE%\\ArtCraft\\' + course.app : '~/ArtCraft/' + course.app; }

  // ---------- storage (best effort; works without it) ----------
  var memory = {};
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return memory[key] || fallback; }
  }
  function save(key, val) {
    memory[key] = val;
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* private mode etc. */ }
  }
  var P = load('artcraft-progress-v1', { lessons: {}, steps: {}, quiz: {}, last: {}, collapsed: {} });
  ['lessons', 'steps', 'quiz', 'last', 'collapsed'].forEach(function (k) { if (!P[k]) P[k] = {}; });
  function persist() { save('artcraft-progress-v1', P); }

  // ---------- helpers ----------
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function strip(html) { var d = document.createElement('div'); d.innerHTML = html || ''; return d.textContent || ''; }
  function findCourse(id) { for (var i = 0; i < COURSES.length; i++) if (COURSES[i].id === id) return COURSES[i]; return null; }
  function allLessons(c) {
    var out = [];
    (c.modules || []).forEach(function (m, mi) { (m.lessons || []).forEach(function (l) { out.push({ m: m, mi: mi, l: l }); }); });
    return out;
  }
  function lkey(c, l) { return c.id + '/' + l.id; }
  function isDone(c, l) { return !!P.lessons[lkey(c, l)]; }
  function courseProgress(c) {
    var all = allLessons(c), d = 0;
    all.forEach(function (x) { if (isDone(c, x.l)) d++; });
    return { done: d, total: all.length, pct: all.length ? Math.round(100 * d / all.length) : 0 };
  }
  function stepsInLesson(l) {
    var n = 0; (l.blocks || []).forEach(function (b) { if (b.t === 'steps') n += (b.items || []).length; }); return n;
  }
  function stepsChecked(c, l) {
    var n = 0, pre = lkey(c, l) + '#';
    Object.keys(P.steps).forEach(function (k) { if (k.indexOf(pre) === 0 && P.steps[k]) n++; });
    return n;
  }
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove('show'); }, 1800);
  }
  function copy(text) {
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('Copied'); } catch (e) { toast('Copy failed: select the text manually'); }
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(function () { toast('Copied'); }, fallback);
    else fallback();
  }
  function setAccent(color) {
    var r = document.documentElement.style;
    if (color) { r.setProperty('--accent', color); r.setProperty('--accent-soft', hexToSoft(color)); r.setProperty('--accent-ink', '#ffffff'); }
    else { r.removeProperty('--accent'); r.removeProperty('--accent-soft'); r.removeProperty('--accent-ink'); }
  }
  function hexToSoft(hex) {
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
    return m ? 'rgba(' + parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) + ',0.13)' : 'rgba(199,128,31,0.12)';
  }
  var CLAUDE_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9z"/><circle cx="19" cy="19" r="2" fill="currentColor"/></svg>';

  // ---------- top bar ----------
  function renderTabs(active) {
    $('#courseTabs').innerHTML = COURSES.map(function (c) {
      return '<a href="#/c/' + c.id + '" class="' + (c.id === active ? 'active' : '') + '">' + esc(c.app) + '</a>';
    }).join('');
  }

  // ---------- sidebar ----------
  function renderSidebar(c, activeLesson, activeRef) {
    if (!c) { sidebar.innerHTML = ''; return; }
    var pr = courseProgress(c);
    var h = '<div class="side-course"><h2><a href="#/c/' + c.id + '" style="color:inherit;text-decoration:none">' + esc(c.app) + '</a></h2>' +
      '<div class="sub">' + esc(c.adobe ? 'Like ' + c.adobe : c.tagline || '') + ' · ' + pr.done + '/' + pr.total + ' lessons</div>' +
      '<div class="progress"><span style="width:' + pr.pct + '%"></span></div><div class="side-links">';
    [['shortcuts', 'Shortcuts', c.shortcuts], ['glossary', 'Glossary', c.glossary], ['claude', 'Claude prompts', c.claudeCheatsheet], ['limits', 'Limitations', c.limitations]]
      .forEach(function (x) { if (x[2] && x[2].length) h += '<a href="#/c/' + c.id + '/ref/' + x[0] + '" class="' + (activeRef === x[0] ? 'active' : '') + '">' + x[1] + '</a>'; });
    h += '</div></div>';
    (c.modules || []).forEach(function (m, mi) {
      var ls = m.lessons || [], d = ls.filter(function (l) { return isDone(c, l); }).length;
      var hasActive = activeLesson && ls.some(function (l) { return l.id === activeLesson; });
      var collapsed = P.collapsed[c.id + '/' + m.id] && !hasActive;
      h += '<div class="side-module' + (collapsed ? ' collapsed' : '') + '" data-mod="' + esc(c.id + '/' + m.id) + '"><button type="button"><span>' + (mi + 1) + '. ' + esc(m.title) +
        '</span><span class="count">' + d + '/' + ls.length + '</span></button><ul>';
      ls.forEach(function (l) {
        var done = isDone(c, l), part = !done && stepsChecked(c, l) > 0;
        h += '<li><a href="#/c/' + c.id + '/l/' + l.id + '" class="' + (l.id === activeLesson ? 'active' : '') + '">' +
          '<span class="dot' + (done ? ' done' : part ? ' partial' : '') + '">' + (done ? '&#10003;' : '') + '</span><span>' + esc(l.title) + '</span></a></li>';
      });
      h += '</ul></div>';
    });
    sidebar.innerHTML = h;
    Array.prototype.forEach.call(sidebar.querySelectorAll('.side-module > button'), function (b) {
      b.addEventListener('click', function () {
        var box = b.parentNode, k = box.getAttribute('data-mod');
        box.classList.toggle('collapsed'); P.collapsed[k] = box.classList.contains('collapsed'); persist();
      });
    });
    var act = sidebar.querySelector('a.active'); if (act && act.scrollIntoView) act.scrollIntoView({ block: 'nearest' });
  }

  // ---------- blocks ----------
  function renderBlock(c, l, b, bi) {
    var k = lkey(c, l) + '#' + bi;
    switch (b.t) {
      case 'p': return '<div class="block"><p>' + (b.html || '') + '</p></div>';
      case 'h': return '<div class="block"><h2>' + esc(b.text) + '</h2></div>';
      case 'steps':
        return '<div class="block"><ol class="steps">' + (b.items || []).map(function (it, si) {
          var o = typeof it === 'string' ? { html: it } : it, sk = k + '.' + si, on = !!P.steps[sk];
          return '<li class="' + (on ? 'checked' : '') + '"><span class="step-mark"><input type="checkbox" class="step-box" data-step="' + esc(sk) + '"' + (on ? ' checked' : '') +
            ' aria-label="Step ' + (si + 1) + ' done"><span class="n" aria-hidden="true">' + (si + 1) + '</span></span><div><div class="step-text">' + (o.html || '') + '</div>' +
            (o.check ? '<div class="step-check">' + o.check + '</div>' : '') +
            (o.detail ? '<details class="step-detail"><summary>More detail</summary><div>' + o.detail + '</div></details>' : '') + '</div></li>';
        }).join('') + '</ol></div>';
      case 'callout':
        var label = { tip: 'Tip', note: 'Note', warn: 'Watch out', adobe: 'Coming from Adobe tutorials?' }[b.kind] || 'Note';
        return '<div class="block callout ' + esc(b.kind || 'note') + '"><span class="callout-label">' + label + '</span>' + (b.html || '') + '</div>';
      case 'claude':
        return '<div class="block claude"><div class="claude-head">' + CLAUDE_ICON + esc(b.title || 'Try it with Claude') + '</div>' + (b.html ? '<div>' + b.html + '</div>' : '') +
          (b.prompts || []).map(function (p) {
            return '<div class="prompt"><div class="prompt-text">' + esc(p.prompt) + '</div><div class="prompt-foot"><span>' + (p.why || '') +
              '</span><button class="btn small" data-copy="' + esc(p.prompt) + '">Copy</button></div></div>';
          }).join('') + '</div>';
      case 'image':
        return '<figure class="block figure"><img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy" data-zoom="1" data-caption="' + esc(b.caption || '') + '">' +
          (b.caption ? '<figcaption>' + b.caption + '</figcaption>' : '') + '</figure>';
      case 'keys':
        return '<div class="block"><table class="keys">' + (b.items || []).map(function (x) { return '<tr><td>' + kbdify(x.keys) + '</td><td>' + (x.action || '') + '</td></tr>'; }).join('') + '</table></div>';
      case 'quiz':
        return '<div class="block quiz"><h4>Check yourself</h4>' + (b.items || []).map(function (q, qi) {
          var qk = k + '.' + qi, ans = P.quiz[qk];
          return '<div class="q" data-q="' + esc(qk) + '"><div class="q-text">' + (q.q || '') + '</div>' + (q.choices || []).map(function (ch, ci) {
            var cls = ans != null ? (ci === q.answer ? ' right' : (ci === ans ? ' wrong' : '')) : '';
            return '<button class="choice' + cls + '" data-choice="' + ci + '" data-answer="' + q.answer + '"' + (ans != null ? ' disabled' : '') + '>' + ch + '</button>';
          }).join('') + '<div class="explain"' + (ans != null ? '' : ' hidden') + '>' + (ans != null ? (ans === q.answer ? '<strong>Correct.</strong> ' : '<strong>Not quite.</strong> ') : '') + (q.explain || '') + '</div></div>';
        }).join('') + '</div>';
      case 'code':
        return '<div class="block codeblock"><pre>' + esc(b.text) + '</pre><button class="btn small" data-copy="' + esc(b.text) + '">Copy</button>' + (b.lang ? '<span class="lang">' + esc(b.lang) + '</span>' : '') + '</div>';
      case 'check': return '<div class="block checkpoint"><strong>Checkpoint.</strong> ' + (b.html || '') + '</div>';
      case 'exercise':
        return '<div class="block exercise"><h3>Practice: ' + esc(b.title || 'On your own') + '</h3>' + (b.html || '') +
          (b.steps && b.steps.length ? '<ol>' + b.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' : '') + '</div>';
      default: return '';
    }
  }
  function kbdify(keys) {
    if (!keys) return '';
    if (/<kbd>/.test(keys)) return keys;
    return String(keys).split(/\s*,\s*|\s+or\s+/).map(function (combo) {
      return combo.split('+').map(function (k) { return '<kbd>' + esc(k.trim()) + '</kbd>'; }).join('+');
    }).join(' or ');
  }

  // ---------- practice files ----------
  function assetFor(c, id) { var a = (c.assets || []).filter(function (x) { return x.id === id; })[0]; return a || null; }
  function manifestEntry(c, a) { return (MANIFEST.files || []).filter(function (f) { return f.course === c.id && f.id === a.id; })[0] || null; }
  function renderAssets(c, l) {
    var ids = l.assets || []; if (!ids.length) return '';
    return '<div class="assets"><h3>Practice files for this lesson</h3>' + ids.map(function (id) {
      var a = assetFor(c, id); if (!a) return '';
      var me = manifestEntry(c, a);
      if (!a.file && !a.repoPath) {
        return '<div class="asset"><div><strong>' + esc(a.title || a.id) + '</strong><div class="path">' + esc(a.needs || 'Built into the app.') +
          '</div></div><div><span class="status ok">built in</span></div></div>';
      }
      if (me && me.manual) {
        return '<div class="asset"><div><strong>' + esc(a.title || a.id) + '</strong><div class="path">' + esc(me.manual) + ' Save as ' + esc(practicePath(c, a.file)) +
          '</div></div><div><span class="status unknown">make it yourself</span> <button class="btn small" data-copy="' + esc(practicePath(c, a.file)) + '">Copy path</button></div></div>';
      }
      var src = a.repoPath || a.file;
      var where = a.repoPath ? absCoursePath(a.repoPath) : practicePath(c, a.file);
      return '<div class="asset" data-asset-src="' + esc(src) + '" data-kind="' + esc(a.kind || '') + '"><div><strong>' + esc(a.title || a.id) + '</strong>' +
        (me && me.credit ? ' <span class="muted">· ' + esc(me.credit) + (me.license ? ', ' + esc(me.license) : '') + '</span>' : '') +
        '<div class="path">' + esc(where) + '</div></div><div><span class="status unknown">checking</span> <button class="btn small" data-copy="' + esc(where) + '">Copy path</button></div></div>';
    }).join('') + '</div>';
  }
  function checkAssets() {
    Array.prototype.forEach.call(main.querySelectorAll('.asset[data-asset-src]'), function (row) {
      var src = row.getAttribute('data-asset-src'), kind = row.getAttribute('data-kind'), st = row.querySelector('.status');
      function ok() { st.textContent = 'ready'; st.className = 'status ok'; }
      function bad() {
        st.textContent = 'not downloaded yet'; st.className = 'status missing';
        st.title = IS_WIN ? 'Run ops\\scripts\\windows\\fetch-course-assets.ps1' : 'Run ops/scripts/linux/fetch-course-assets.sh';
      }
      var ext = (src.split('.').pop() || '').toLowerCase(), el;
      if (/^(jpe?g|png|gif|webp|bmp|svg|avif)$/.test(ext)) { el = new Image(); el.onload = ok; el.onerror = bad; el.src = src; }
      else if (/^(mp4|webm|ogv|mov|m4v)$/.test(ext) || kind === 'video') { el = document.createElement('video'); el.preload = 'metadata'; el.onloadedmetadata = ok; el.onerror = bad; el.src = src; }
      else if (/^(mp3|wav|ogg|oga|flac|m4a|aac)$/.test(ext) || kind === 'audio') { el = document.createElement('audio'); el.preload = 'metadata'; el.onloadedmetadata = ok; el.onerror = bad; el.src = src; }
      else { st.textContent = 'check the folder'; st.title = 'The browser cannot preview this file type, so look in the practice folder.'; }
    });
  }

  // ---------- coach prompt ----------
  function coachPrompt(c, l) {
    if (c.id === 'start') {
      return 'I am working through the "Start here" lesson "' + l.title + '" of my ArtCraft course (file: ' + absCoursePath('data/start.js') +
        ', lesson id "' + l.id + '"). Read that lesson and help me do it step by step on this Windows machine. Explain anything I do not understand, and ask before running any command that changes my system.';
    }
    return 'I am a beginner working through lesson "' + l.title + '" of the ' + c.app + ' course (course file: ' + absCoursePath('data/' + c.id + '.js') +
      ', lesson id "' + l.id + '"). ' + c.app + ' is open with its control channel on, and you have the "' + c.id + '" MCP server. ' +
      'Read that lesson, then coach me through it one step at a time. After each step, use the ' + c.id + ' MCP tools to look at the app state and tell me whether I did it right. ' +
      'Explain the "why" in plain language. Do not do the steps for me unless I ask.';
  }

  // ---------- pages ----------
  function renderHome() {
    setAccent(null); renderTabs(null); renderSidebar(null);
    var cont = null;
    Object.keys(P.last).forEach(function (cid) { if (!cont || P.last[cid].at > cont.at) cont = { cid: cid, lid: P.last[cid].lid, at: P.last[cid].at }; });
    var h = '<div class="content"><section class="hero"><h1>Learn the Craft apps, by hand and with Claude</h1>' +
      '<p>Step-by-step beginner courses for the open-source Photoshop, Lightroom and Premiere equivalents. Keep this window beside the app and follow along. Every lesson also shows how to get Claude to do it, check it, or coach you through it.</p></section>';
    if (cont) {
      var cc = findCourse(cont.cid), cl = cc && allLessons(cc).filter(function (x) { return x.l.id === cont.lid; })[0];
      if (cl) h += '<div class="panel"><h2>Continue where you left off</h2><p class="muted">' + esc(cc.app) + ' · ' + esc(cl.l.title) + '</p><a class="btn primary" href="#/c/' + cc.id + '/l/' + cl.l.id + '">Resume lesson</a></div>';
    }
    h += '<div class="cards">' + COURSES.map(function (c) {
      var pr = courseProgress(c);
      return '<a class="card" href="#/c/' + c.id + '" style="--card-accent:' + esc(c.accent || '') + '"><h3>' + esc(c.app) + '</h3>' +
        (c.adobe ? '<div class="adobe-name">Like ' + esc(c.adobe) + '</div>' : '') + '<p>' + esc(c.tagline || '') + '</p>' +
        '<div class="progress"><span style="width:' + pr.pct + '%"></span></div><div class="card-foot"><span>' + pr.done + '/' + pr.total + ' lessons</span><span>' +
        (c.estimatedHours ? '~' + c.estimatedHours + ' h' : '') + '</span></div></a>';
    }).join('') + '</div>';
    var missing = ['photocraft', 'lightcraft', 'filmcraft'].filter(function (id) { return !findCourse(id); });
    if (missing.length) h += '<div class="panel"><h2>Not loaded</h2><p class="muted">These course files were not found in <code>courses/data/</code>: ' + missing.join(', ') + '.</p></div>';
    h += '<div class="panel"><h2>Your progress</h2><p class="muted">Progress is saved in this browser only. Back it up or move it to another browser:</p>' +
      '<button class="btn small" id="exportBtn">Export progress</button> <label class="btn small">Import progress<input type="file" id="importFile" accept="application/json" hidden></label> ' +
      '<button class="btn small" id="resetBtn">Reset all progress</button></div>';
    h += '<p class="muted" style="font-size:.85em">Files: ' + esc(ROOT_DIR) + '. Security report: <code>' + esc(ROOT_DIR + SEP + 'SECURITY-REPORT.md') + '</code>. Setup guide: <code>' + esc(ROOT_DIR + SEP + 'README.md') + '</code>.</p></div>';
    main.innerHTML = h;
    $('#exportBtn').onclick = function () {
      var blob = new Blob([JSON.stringify(P, null, 2)], { type: 'application/json' });
      var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'artcraft-progress.json'; a.click();
    };
    $('#importFile').onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { try { var d = JSON.parse(r.result); if (d && d.lessons) { P = d; ['lessons', 'steps', 'quiz', 'last', 'collapsed'].forEach(function (k) { if (!P[k]) P[k] = {}; }); persist(); toast('Progress imported'); route(); } } catch (x) { toast('That file is not a progress export'); } };
      r.readAsText(f);
    };
    $('#resetBtn').onclick = function () { if (confirm('Erase all course progress in this browser?')) { P = { lessons: {}, steps: {}, quiz: {}, last: {}, collapsed: {} }; persist(); route(); } };
  }

  function renderCourse(c) {
    setAccent(c.accent); renderTabs(c.id); renderSidebar(c);
    var pr = courseProgress(c), first = allLessons(c).filter(function (x) { return !isDone(c, x.l); })[0] || allLessons(c)[0];
    var h = '<div class="content"><div class="crumbs"><a href="#/">Home</a> / ' + esc(c.app) + '</div><h1 class="lesson-title">' + esc(c.app) + '</h1>' +
      '<div class="meta-row">' + (c.adobe ? '<span class="pill">Like ' + esc(c.adobe) + '</span>' : '') + '<span class="pill">' + esc(c.level || 'Beginner') + '</span>' +
      (c.estimatedHours ? '<span class="pill">~' + c.estimatedHours + ' hours</span>' : '') + '<span class="pill">' + pr.done + '/' + pr.total + ' lessons done</span></div>' +
      (c.intro || '') + (first ? '<p><a class="btn primary" href="#/c/' + c.id + '/l/' + first.l.id + '">' + (pr.done ? 'Continue' : 'Start the course') + '</a></p>' : '');
    if (c.prerequisites && c.prerequisites.length) h += '<div class="panel"><h2>Before you start</h2><ul>' + c.prerequisites.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    if (c.setup) h += '<div class="panel"><h2>Opening ' + esc(c.app) + '</h2>' + (c.setup.launchHtml || '') + (c.setup.mcpHtml ? '<h2 style="margin-top:14px">Connecting Claude</h2>' + c.setup.mcpHtml : '') +
      (c.id !== 'start' ? '<p class="muted">Your work folder: <code>' + esc(workDir(c)) + '</code> (practice files in <code>practice</code>, exports in <code>exports</code>).</p>' : '') + '</div>';
    (c.modules || []).forEach(function (m, mi) {
      h += '<div class="panel"><h2>' + (mi + 1) + '. ' + esc(m.title) + '</h2>' + (m.summary ? '<p class="muted">' + esc(m.summary) + '</p>' : '') + '<ul>' +
        (m.lessons || []).map(function (l) { return '<li><a href="#/c/' + c.id + '/l/' + l.id + '">' + esc(l.title) + '</a>' + (isDone(c, l) ? ' &#10003;' : '') + (l.minutes ? ' <span class="muted">(' + l.minutes + ' min)</span>' : '') + '</li>'; }).join('') + '</ul></div>';
    });
    main.innerHTML = h + '</div>';
  }

  function renderLesson(c, lid) {
    var list = allLessons(c), idx = -1;
    list.forEach(function (x, i) { if (x.l.id === lid) idx = i; });
    if (idx < 0) return renderCourse(c);
    var cur = list[idx], l = cur.l, prev = list[idx - 1], next = list[idx + 1];
    P.last[c.id] = { lid: l.id, at: Date.now() }; persist();
    setAccent(c.accent); renderTabs(c.id); renderSidebar(c, l.id);
    var done = isDone(c, l), ns = stepsInLesson(l);
    var h = '<div class="content"><div class="crumbs"><a href="#/c/' + c.id + '">' + esc(c.app) + '</a> / Module ' + (cur.mi + 1) + ': ' + esc(cur.m.title) + '</div>' +
      '<h1 class="lesson-title">' + esc(l.title) + '</h1><div class="meta-row">' + (l.minutes ? '<span class="pill">' + l.minutes + ' min</span>' : '') +
      '<span class="pill">Lesson ' + (idx + 1) + ' of ' + list.length + '</span>' + (ns ? '<span class="pill" id="stepPill">' + stepsChecked(c, l) + '/' + ns + ' steps</span>' : '') +
      (done ? '<span class="pill" style="color:var(--ok)">&#10003; Completed</span>' : '') + '</div>';
    if (l.goals && l.goals.length) h += '<div class="goals"><h3>In this lesson</h3><ul>' + l.goals.map(function (g) { return '<li>' + g + '</li>'; }).join('') + '</ul></div>';
    h += renderAssets(c, l);
    h += (l.blocks || []).map(function (b, bi) { return renderBlock(c, l, b, bi); }).join('');
    h += '<div class="lesson-actions"><button class="btn ' + (done ? 'done' : 'primary') + '" id="doneBtn">' + (done ? '&#10003; Completed' : 'Mark lesson complete') + '</button>' +
      '<button class="btn" data-copy="' + esc(coachPrompt(c, l)) + '" title="Copies a prompt that asks Claude to tutor you through this lesson">' + CLAUDE_ICON + ' Coach me with Claude</button></div>';
    h += '<nav class="lesson-nav">' + (prev ? '<a class="btn" href="#/c/' + c.id + '/l/' + prev.l.id + '">&larr; ' + esc(prev.l.title) + '</a>' : '<span></span>') +
      (next ? '<a class="btn primary" id="nextBtn" href="#/c/' + c.id + '/l/' + next.l.id + '">' + (done ? '' : 'Complete &amp; ') + 'next: ' + esc(next.l.title) + ' &rarr;</a>' : '<a class="btn primary" href="#/c/' + c.id + '">Course overview</a>') + '</nav></div>';
    main.innerHTML = h;
    main.scrollTop = 0; window.scrollTo(0, 0);
    checkAssets();
    $('#doneBtn').onclick = function () {
      if (isDone(c, l)) delete P.lessons[lkey(c, l)]; else P.lessons[lkey(c, l)] = Date.now();
      persist(); renderLesson(c, l.id);
    };
    var nb = $('#nextBtn'); if (nb) nb.addEventListener('click', function () { P.lessons[lkey(c, l)] = P.lessons[lkey(c, l)] || Date.now(); persist(); });
    Array.prototype.forEach.call(main.querySelectorAll('.step-box'), function (cb) {
      cb.addEventListener('change', function () {
        P.steps[cb.getAttribute('data-step')] = cb.checked; persist();
        cb.closest('li').classList.toggle('checked', cb.checked);
        var pill = $('#stepPill'); if (pill) pill.textContent = stepsChecked(c, l) + '/' + ns + ' steps';
        renderSidebar(c, l.id);
        if (cb.checked && stepsChecked(c, l) === ns && !isDone(c, l)) toast('All steps done. Mark the lesson complete when you are ready.');
      });
    });
    Array.prototype.forEach.call(main.querySelectorAll('.choice'), function (btn) {
      btn.addEventListener('click', function () {
        var q = btn.closest('.q'), ci = +btn.getAttribute('data-choice'), ans = +btn.getAttribute('data-answer');
        P.quiz[q.getAttribute('data-q')] = ci; persist();
        Array.prototype.forEach.call(q.querySelectorAll('.choice'), function (b2, i) { b2.disabled = true; if (i === ans) b2.classList.add('right'); else if (i === ci) b2.classList.add('wrong'); });
        var ex = q.querySelector('.explain'); ex.hidden = false; ex.innerHTML = (ci === ans ? '<strong>Correct.</strong> ' : '<strong>Not quite.</strong> ') + ex.innerHTML;
      });
    });
    Array.prototype.forEach.call(main.querySelectorAll('img[data-zoom]'), function (img) {
      img.addEventListener('error', function () {
        var f = img.closest('figure'); if (f) { f.classList.add('missing'); f.innerHTML = 'Screenshot not found (' + esc(img.getAttribute('src')) + '). The repo may have renamed it since this course was written.'; }
      });
    });
  }

  function renderRef(c, which) {
    setAccent(c.accent); renderTabs(c.id); renderSidebar(c, null, which);
    var h = '<div class="content"><div class="crumbs"><a href="#/c/' + c.id + '">' + esc(c.app) + '</a> / Reference</div>';
    if (which === 'shortcuts') {
      h += '<h1 class="lesson-title">Keyboard shortcuts</h1><input class="filter" id="filter" placeholder="Filter shortcuts">';
      (c.shortcuts || []).forEach(function (g) {
        h += '<div class="panel filterable"><h2>' + esc(g.group) + '</h2><table class="ref-table">' + (g.items || []).map(function (x) {
          return '<tr data-f="' + esc((x.keys + ' ' + strip(x.action)).toLowerCase()) + '"><td style="width:1%;white-space:nowrap">' + kbdify(x.keys) + '</td><td>' + (x.action || '') + '</td></tr>';
        }).join('') + '</table></div>';
      });
    } else if (which === 'glossary') {
      h += '<h1 class="lesson-title">Glossary</h1><input class="filter" id="filter" placeholder="Filter terms"><div class="panel"><table class="ref-table">' +
        (c.glossary || []).slice().sort(function (a, b) { return a.term.localeCompare(b.term); }).map(function (g) {
          return '<tr data-f="' + esc((g.term + ' ' + strip(g.def)).toLowerCase()) + '"><td style="width:28%"><strong>' + esc(g.term) + '</strong></td><td>' + (g.def || '') + '</td></tr>';
        }).join('') + '</table></div>';
    } else if (which === 'claude') {
      h += '<h1 class="lesson-title">Claude prompt cheat sheet</h1><p class="muted">Start Claude Code in your work folder (<code>' + esc(workDir(c)) + '</code>), make sure the app is open, then paste any of these.</p><input class="filter" id="filter" placeholder="Filter tasks">';
      (c.claudeCheatsheet || []).forEach(function (x) {
        h += '<div class="prompt" data-f="' + esc((x.task + ' ' + x.prompt).toLowerCase()) + '" style="margin-bottom:12px"><div class="prompt-foot" style="border-top:0;border-bottom:1px solid var(--border)"><strong style="color:var(--text)">' + esc(x.task) + '</strong>' +
          (x.tools && x.tools.length ? '<span>' + x.tools.map(function (t) { return '<code>' + esc(t) + '</code>'; }).join(' ') + '</span>' : '') + '</div><div class="prompt-text">' + esc(x.prompt) +
          '</div><div class="prompt-foot"><span></span><button class="btn small" data-copy="' + esc(x.prompt) + '">Copy</button></div></div>';
      });
    } else {
      h += '<h1 class="lesson-title">Current limitations</h1><p class="muted">' + esc(c.app) + ' is young and moving fast. These are things Adobe-based tutorials may show that don\'t work here yet (as of when this course was written; the nightly updates may fix some).</p><div class="panel"><ul>' +
        (c.limitations || []).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    }
    main.innerHTML = h + '</div>';
    var f = $('#filter');
    if (f) f.addEventListener('input', function () {
      var q = f.value.toLowerCase().trim();
      Array.prototype.forEach.call(main.querySelectorAll('[data-f]'), function (row) { row.style.display = !q || row.getAttribute('data-f').indexOf(q) >= 0 ? '' : 'none'; });
    });
  }

  function renderSearch(q) {
    setAccent(null); renderTabs(null); renderSidebar(null);
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean), res = [];
    COURSES.forEach(function (c) {
      allLessons(c).forEach(function (x) {
        var text = (x.l.title + ' ' + (x.l.goals || []).join(' ') + ' ' + (x.l.blocks || []).map(function (b) {
          return strip(b.html || '') + ' ' + (b.text || '') + ' ' + (b.title || '') + ' ' + (b.items || []).map(function (i) { return typeof i === 'string' ? strip(i) : strip((i.html || '') + ' ' + (i.q || '') + ' ' + (i.action || '') + ' ' + (i.keys || '')); }).join(' ') +
            ' ' + (b.prompts || []).map(function (p) { return p.prompt; }).join(' ');
        }).join(' ')).toLowerCase();
        var score = 0;
        terms.forEach(function (t) { var n = text.split(t).length - 1; if (n) score += n + (x.l.title.toLowerCase().indexOf(t) >= 0 ? 10 : 0); else score = -1e9; });
        if (score > 0) {
          var i0 = text.indexOf(terms[0]), snip = text.slice(Math.max(0, i0 - 60), i0 + 120);
          res.push({ c: c, x: x, score: score, snip: snip });
        }
      });
    });
    res.sort(function (a, b) { return b.score - a.score; });
    var h = '<div class="content"><h1 class="lesson-title">Search</h1><p class="muted">' + res.length + ' lesson(s) match "' + esc(q) + '"</p>' + res.slice(0, 60).map(function (r) {
      var snip = esc(r.snip); terms.forEach(function (t) { snip = snip.split(esc(t)).join('<mark>' + esc(t) + '</mark>'); });
      return '<a class="result" href="#/c/' + r.c.id + '/l/' + r.x.l.id + '"><strong>' + esc(r.x.l.title) + '</strong><small>' + esc(r.c.app) + ' · ' + esc(r.x.m.title) + '</small><small>...' + snip + '...</small></a>';
    }).join('') + '</div>';
    main.innerHTML = h;
  }

  // ---------- router ----------
  function route() {
    document.body.classList.remove('nav-open');
    var h = location.hash.replace(/^#\/?/, ''), parts = h.split('/');
    if (parts[0] === 'search') return renderSearch(decodeURIComponent(parts.slice(1).join('/')));
    if (parts[0] === 'c') {
      var c = findCourse(parts[1]);
      if (!c) return renderHome();
      if (parts[2] === 'l' && parts[3]) return renderLesson(c, decodeURIComponent(parts[3]));
      if (parts[2] === 'ref' && parts[3]) return renderRef(c, parts[3]);
      return renderCourse(c);
    }
    renderHome();
  }

  // ---------- global events ----------
  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-copy]') : null;
    if (t) { e.preventDefault(); copy(t.getAttribute('data-copy')); return; }
    var z = e.target.closest ? e.target.closest('img[data-zoom]') : null;
    if (z) { var lb = $('#lightbox'); lb.querySelector('img').src = z.src; lb.querySelector('p').textContent = z.getAttribute('data-caption') || ''; lb.hidden = false; return; }
    if (e.target.closest && e.target.closest('#lightbox')) { $('#lightbox').hidden = true; }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { $('#lightbox').hidden = true; document.body.classList.remove('nav-open'); }
    var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    if (typing) return;
    if (e.key === '/') { e.preventDefault(); $('#searchInput').focus(); }
    if (e.altKey && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      var btns = main.querySelectorAll('.lesson-nav a'); var target = e.key === 'ArrowRight' ? btns[btns.length - 1] : (btns.length > 1 ? btns[0] : null);
      if (target) { e.preventDefault(); target.click(); }
    }
  });
  $('#searchForm').addEventListener('submit', function (e) { e.preventDefault(); var q = $('#searchInput').value.trim(); if (q) location.hash = '#/search/' + encodeURIComponent(q); });
  $('#menuBtn').addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
  $('#scrim').addEventListener('click', function () { document.body.classList.remove('nav-open'); });
  $('#themeBtn').addEventListener('click', function () {
    var cur = document.documentElement.getAttribute('data-theme');
    var dark = cur ? cur === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    var nt = dark ? 'light' : 'dark'; document.documentElement.setAttribute('data-theme', nt);
    try { localStorage.setItem('artcraft-theme', nt); } catch (x) { }
  });
  $('#compactBtn').addEventListener('click', function () {
    var on = document.documentElement.classList.toggle('compact');
    try { localStorage.setItem('artcraft-compact', on ? '1' : '0'); } catch (x) { }
    toast(on ? 'Compact mode on: good for docking beside the app' : 'Compact mode off');
  });
  window.addEventListener('hashchange', route);
  route();
})();
