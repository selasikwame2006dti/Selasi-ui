/* Selasi AI concept build: chat flow, device stage, flow rail, captures and
   handoff. There is no backend; replies follow a small script. */
(function () {
  'use strict';

  const DL = window.DeviceLockscreens;
  const Proto = window.SelasiProto;
  const $ = (id) => document.getElementById(id);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 60) : ms));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ── Icons ─────────────────────────────────────────────────────────── */
  const ICONS = {
    spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    send: '<path d="M21 3L10.5 13.5"/><path d="M21 3l-6.5 18-4-7.5L3 9.5z"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21a2 2 0 0 1 2-2h13"/>',
    clip: '<path d="M20 11.5l-8.2 8.2a5 5 0 0 1-7-7l8.500-8.500a3.300 3.300 0 0 1 4.700 4.700l-8.400 8.400a1.700 1.700 0 0 1-2.400-2.400l7.600-7.600"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    phone: '<rect x="7" y="2.500" width="10" height="19" rx="2.500"/><path d="M11 18.500h2"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    unlock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.500-2"/>',
    camera: '<path d="M4 8h3l1.500-2.500h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.200"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16M3 9h5M3 15h5M16 9h5M16 15h5"/>',
    record: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.500" fill="currentColor"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    download: '<path d="M12 4v11M7.500 11l4.500 4.500 4.500-4.500M5 20h14"/>',
    git: '<circle cx="6" cy="6" r="2.500"/><circle cx="6" cy="18" r="2.500"/><circle cx="18" cy="8" r="2.500"/><path d="M6 8.500v7M18 10.500c0 4-6 3-10.500 5.500"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>'
  };
  function icon(name) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  }
  function paintIcons(root) {
    (root || document).querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
  }

  /* ── State ─────────────────────────────────────────────────────────── */
  const DEVICE_LABEL = { iphone: 'iPhone 15 Pro', android: 'Samsung S26 Ultra', tablet: 'iPad Pro 11"' };
  const state = {
    device: 'iphone', idea: null, rendered: false, locked: true,
    dark: false, accent: 0, busy: false, usage: 0, proto: null, search: false
  };

  /* ── Toast ─────────────────────────────────────────────────────────── */
  let toastTimer = 0;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }

  /* ── Theme ─────────────────────────────────────────────────────────── */
  function syncModeIcon() {
    const dark = document.documentElement.dataset.mode === 'dark';
    $('modeBtn').innerHTML = `<span>${icon(dark ? 'sun' : 'moon')}</span>`;
  }
  $('modeBtn').addEventListener('click', () => {
    const next = document.documentElement.dataset.mode === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.mode = next;
    try { localStorage.setItem('selasi-mode', next); } catch (_) { /* private mode */ }
    syncModeIcon();
  });

  /* ── Usage meter ───────────────────────────────────────────────────── */
  function addUsage(n) {
    state.usage = Math.min(0.3, state.usage + n);
    $('usageVal').textContent = state.usage.toFixed(2);
    const c = 2 * Math.PI * 15;
    const fill = $('usageFill');
    fill.style.strokeDasharray = c;
    fill.style.strokeDashoffset = c * (1 - state.usage / 0.3);
  }

  /* ── Device stage ──────────────────────────────────────────────────── */
  const device = $('device'), devArt = $('devArt'), devScreen = $('devScreen'),
    devCutout = $('devCutout'), devLock = $('devLock');

  function setGeometry() {
    const d = state.device;
    if (d === 'tablet') {
      device.style.setProperty('--ratio', (870 / 1230).toFixed(4));
      device.style.setProperty('--sx', '2.07%'); device.style.setProperty('--sy', '1.46%');
      device.style.setProperty('--sw', '95.86%'); device.style.setProperty('--sh', '97.08%');
      device.style.setProperty('--srx', '2.2%'); device.style.setProperty('--sry', '1.55%');
      return;
    }
    const g = DL.geometry(d);
    const rx = d === 'iphone' ? g.screenRx.iphone : g.screenRx.android;
    const pct = (n) => (n * 100).toFixed(3) + '%';
    device.style.setProperty('--ratio', (g.view.w / g.view.h).toFixed(4));
    device.style.setProperty('--sx', pct((g.screen.x - g.view.x) / g.view.w));
    device.style.setProperty('--sy', pct((g.screen.y - g.view.y) / g.view.h));
    device.style.setProperty('--sw', pct(g.screen.w / g.view.w));
    device.style.setProperty('--sh', pct(g.screen.h / g.view.h));
    device.style.setProperty('--srx', pct(rx / g.screen.w));
    device.style.setProperty('--sry', pct(rx / g.screen.h));
  }

  function showLock() {
    const d = state.device;
    state.locked = true;
    devArt.innerHTML = ''; devCutout.innerHTML = '';
    DL.render(devLock, d, d !== 'tablet');
    device.classList.add('is-locked');
    device.classList.remove('is-live');
    syncStage();
  }

  function showApp() {
    const d = state.device;
    state.locked = false;
    devLock.innerHTML = '';
    devArt.innerHTML = d === 'tablet' ? '' : DL.frame(d);
    devCutout.innerHTML = d === 'tablet' ? '' : DL.cutout(d);
    device.classList.remove('is-locked');
    device.classList.add('is-live');
    syncStage();
  }

  function unlock() {
    return new Promise((resolve) => {
      if (!state.locked) return resolve();
      let done = false;
      const finish = () => { if (done) return; done = true; showApp(); resolve(); };
      const ok = DL.playUnlock(devLock, state.device, finish);
      if (!ok) finish(); else setTimeout(finish, 1200);
    });
  }

  function mountDevice() {
    device.dataset.device = state.device;
    setGeometry();
    if (state.rendered && !state.locked) showApp(); else showLock();
  }

  function syncStage() {
    const live = state.rendered && !state.locked;
    const screens = state.idea ? state.idea.screens : [];
    const idx = state.proto ? state.proto.index : 0;
    const label = live ? `Prototype · ${screens[idx][0]}` : 'Lock screen';
    $('statePill').classList.toggle('live', live);
    $('statePill').querySelector('span').textContent = label;
    $('caption').textContent = `${DEVICE_LABEL[state.device]} · ${live ? state.idea.name : 'Lock screen'}`;
    const relock = $('relockBtn');
    relock.hidden = !state.rendered;
    $('fullBtn').hidden = !state.rendered;
    relock.innerHTML = `<span>${icon(state.locked ? 'unlock' : 'lock')}</span>${state.locked ? 'Unlock' : 'Lock'}`;
    document.querySelectorAll('#flowList .flow-item').forEach((el, i) => el.classList.toggle('active', live && i === idx));
  }

  $('deviceTabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-device]');
    if (!b || b.dataset.device === state.device) return;
    state.device = b.dataset.device;
    document.querySelectorAll('#deviceTabs button').forEach((x) => x.classList.toggle('active', x === b));
    mountDevice();
  });

  $('relockBtn').addEventListener('click', () => {
    if (state.locked) unlock(); else showLock();
  });

  /* ── Flow rail ─────────────────────────────────────────────────────── */
  const TAPS = ['Get started', 'Tap an item', 'Main action'];
  function paintFlow() {
    const idea = state.idea;
    $('flowCount').textContent = `${idea.screens.length} screens`;
    $('flowList').innerHTML = idea.screens.map((s, i) => `
      <button class="flow-item" data-screen="${i}">
        <span class="flow-num">${i + 1}</span>
        <span class="flow-text"><b>${esc(s[0])}</b><small>${esc(s[1])}</small></span>
      </button>
      ${i < TAPS.length ? `<div class="flow-link"><i></i><span>${TAPS[i]}</span></div>` : ''}`).join('');
  }
  $('flowList').addEventListener('click', async (e) => {
    const b = e.target.closest('.flow-item');
    if (!b || !state.proto) return;
    await unlock();
    state.proto.go(Number(b.dataset.screen));
  });

  /* ── Small-screen helpers ──────────────────────────────────────────── */
  const small = window.matchMedia('(max-width: 900px)');
  const onDeviceView = () => small.matches && document.body.dataset.view === 'device';
  function markUnread() {
    if (onDeviceView()) document.querySelector('.view-switch [data-view="chat"]').classList.add('has-new');
  }

  /* ── Chat primitives ───────────────────────────────────────────────── */
  const messages = $('messages'), scroller = $('chatScroll');
  const toBottom = () => { scroller.scrollTop = scroller.scrollHeight; };

  function addUser(text) {
    $('welcome').hidden = true;
    const el = document.createElement('div');
    el.className = 'msg user';
    el.textContent = text;
    messages.appendChild(el);
    toBottom();
  }

  function addBlock(html, cls) {
    const el = document.createElement('div');
    el.className = cls || 'msg ai';
    el.innerHTML = html;
    messages.appendChild(el);
    paintIcons(el);
    toBottom();
    return el;
  }

  async function say(html) {
    const typing = addBlock('<span class="typing"><i></i><i></i><i></i></span>', 'msg ai');
    await wait(650);
    typing.innerHTML = html;
    typing.classList.add('pop');
    paintIcons(typing);
    toBottom();
    if (onDeviceView()) { markUnread(); toast(typing.textContent.replace(/\s+/g, ' ').trim().slice(0, 110)); }
    return typing;
  }

  function setChips(list) {
    const html = (list || []).map((c) => `<button data-say="${esc(c)}">${esc(c)}</button>`).join('');
    $('chips').innerHTML = html;
    $('stageChips').innerHTML = state.rendered ? html : '';
    toBottom();
  }
  function onChip(e) {
    const b = e.target.closest('button[data-say]');
    if (b) handleUser(b.dataset.say);
  }
  $('chips').addEventListener('click', onChip);
  $('stageChips').addEventListener('click', onChip);

  /* ── Scripted replies ──────────────────────────────────────────────── */
  function pickIdea(text) {
    const t = text.toLowerCase();
    if (/susu|sav|circle|pool|contribut/.test(t)) return Proto.IDEAS.susu;
    if (/food|order|lunch|chop|canteen|meal|restaurant/.test(t)) return Proto.IDEAS.food;
    if (/study|revis|course|class|student group|planner/.test(t)) return Proto.IDEAS.study;
    return Proto.IDEAS.generic;
  }

  async function replyPlan() {
    const idea = state.idea;
    $('projectName').textContent = idea.name;
    $('input').placeholder = 'Ask for a change…';
    const lead = idea.key === 'generic'
      ? 'I can sketch this as a four-screen flow. This concept build only has three sample ideas wired in, so the screens use placeholder content.'
      : `<b>${esc(idea.name)}</b> works well as a short four-screen flow. This is the shape I would start with:`;
    await say(`${lead}
      <ol class="plan">
        ${idea.screens.map((s) => `<li><b>${esc(s[0])}</b><span>${esc(s[1])}</span></li>`).join('')}
      </ol>
      It is the shortest path from opening the app to the main action. Say the word and I will put it on the device.`);
    $('renderNow').disabled = false;
    setChips(['Render it on the device', 'Find references first']);
  }

  async function render() {
    const idea = state.idea;
    const steps = ['Mapping the flow', 'Picking patterns from the library', `Composing ${idea.screens.length} screens`, 'Wiring the taps'];
    const card = addBlock(`
      <div class="tool-head"><span data-icon="phone"></span><b>Rendering on ${esc(DEVICE_LABEL[state.device])}</b><span class="spin"></span></div>
      <ul>${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`, 'tool');
    const items = card.querySelectorAll('li');
    for (let i = 0; i < items.length; i++) {
      items[i].classList.add('run');
      await wait(480);
      items[i].classList.replace('run', 'ok');
    }
    card.classList.add('done');
    card.querySelector('b').textContent = `Rendered on ${DEVICE_LABEL[state.device]}`;

    state.proto = Proto.mount(devScreen, idea, { onNavigate: syncStage });
    state.proto.setDark(state.dark);
    state.rendered = true;
    $('renderNow').innerHTML = `<span>${icon('phone')}</span>View on device`;
    paintFlow();
    addUsage(0.05);
    if (small.matches) setView('device');
    await unlock();
    await say(`${idea.screens.length} screens are live on the ${esc(DEVICE_LABEL[state.device])}. Tap <b>Get started</b> on the device to walk the flow, or jump to any screen from the Flow list.`);
    setChips(['Make it dark', 'Change the accent', 'Find references', 'Hand off to Coder']);
  }

  async function restyleDark(wantDark) {
    state.dark = wantDark;
    state.proto.setDark(wantDark);
    await unlock();
    await say(`Restyled every screen with a ${wantDark ? 'dark' : 'light'} surface. The layout and flow are unchanged.`);
    setChips([wantDark ? 'Make it light' : 'Make it dark', 'Change the accent', 'Hand off to Coder']);
  }

  async function restyleAccent() {
    const next = (state.accent + 1) % Proto.ACCENTS.length;
    state.accent = next;
    const c = Proto.ACCENTS[next];
    state.accentColor = c;
    state.proto.setAccent(c);
    await unlock();
    await say(`Swapped the accent to <span class="swatch" style="background:${c}"></span><code>${c}</code> across buttons, highlights and the summary card. Ask again to try another.`);
  }

  async function search() {
    const card = addBlock('<div class="tool-head"><span data-icon="globe"></span><b>Searching the web</b><span class="spin"></span></div>', 'tool');
    await wait(1100);
    card.classList.add('done');
    card.querySelector('b').textContent = 'Searched the web';
    await say(`In the full product I would search here and cite what I found. Cited answers will look like this:
      <p class="sample">Similar apps lead with one clear action on the home screen<sup>1</sup> and keep onboarding to a single step<sup>2</sup>.</p>
      <div class="sources"><span><i>1</i>Sample source</span><span><i>2</i>Sample source</span></div>
      Links are read for layout and structure only. Nothing is copied from them.`);
  }

  function openHandoff() {
    if (!state.idea) { toast('Describe an idea first, then hand it off.'); return; }
    const idea = state.idea;
    const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const files = [
      { n: 'plan.md', d: 'Intent, flows, decisions', body:
`# ${idea.name}: plan

## Intent
${idea.prompt || 'Described in chat.'}

## Flow
${idea.screens.map((s, i) => `${i + 1}. ${s[0]}: ${s[1]}`).join('\n')}

## Decisions
- Accent: ${state.accentColor || idea.accent}
- Surface: ${state.dark ? 'dark' : 'light'}

## Open questions
- Sign-in method
- Real data source` },
      { n: 'SELASI-HANDOFF.md', d: 'Transfer record for Coder', body:
`# Selasi handoff

Transferred from Selasi AI (web) to Selasi Coder.
Date: ${new Date().toISOString().slice(0, 10)}
Schema version: 1

## Files added
- plan.md
- manifest.json
${idea.screens.map((s, i) => `- screens/0${i + 1}-${slug(s[0])}.html`).join('\n')}

## Next steps for Coder
1. Read plan.md first.
2. Treat the files in the repo as the source of truth.
3. If the plan and the files disagree, flag it and ask.
4. Append a dated entry when you pick this up.` },
      { n: 'manifest.json', d: 'Purpose and hash per file', body: JSON.stringify({
        schema: 1,
        run: { install: 'npm install', start: 'npm run dev', build: 'npm run build' },
        files: idea.screens.map((s, i) => ({ path: `screens/0${i + 1}-${slug(s[0])}.html`, purpose: s[1], hash: 'sha256:(computed at export)' }))
      }, null, 2) }
    ].concat(idea.screens.map((s, i) => ({
      n: `screens/0${i + 1}-${slug(s[0])}.html`, d: s[1],
      body: `<!-- ${idea.name}: ${s[0]} -->\n<!-- ${s[1]} -->\n\nThe generated screen markup is exported here.`
    })));

    const list = $('fileList');
    list.innerHTML = files.map((f, i) => `<li><button data-file="${i}"${i === 0 ? ' class="active"' : ''}><span data-icon="file"></span><span><b>${esc(f.n)}</b><small>${esc(f.d)}</small></span></button></li>`).join('');
    paintIcons(list);
    $('filePreview').textContent = files[0].body;
    list.onclick = (e) => {
      const b = e.target.closest('button[data-file]');
      if (!b) return;
      list.querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b));
      $('filePreview').textContent = files[Number(b.dataset.file)].body;
    };
    $('handoffModal').hidden = false;
    $('handoffClose').focus();
  }
  function closeHandoff() { $('handoffModal').hidden = true; }
  $('handoffBtn').addEventListener('click', openHandoff);
  $('handoffClose').addEventListener('click', closeHandoff);
  $('handoffModal').addEventListener('click', (e) => { if (e.target === $('handoffModal')) closeHandoff(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeHandoff(); });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toast]');
    if (b) toast(b.dataset.toast);
  });

  async function handleUser(text) {
    text = String(text || '').trim();
    if (!text || state.busy) return;
    state.busy = true;
    document.body.classList.add('busy');
    setChips([]);
    addUser(text);
    addUsage(0.02);
    const t = text.toLowerCase();
    try {
      if (!state.idea) {
        state.idea = pickIdea(text);
        state.accent = Proto.ACCENTS.indexOf(state.idea.accent);
        state.accentColor = state.idea.accent;
        await replyPlan();
      } else if (/hand ?off|coder|export|build it/.test(t)) {
        await say('Here is the package Coder will receive. Review the plan and the handoff record before you send it.');
        openHandoff();
      } else if (/search|reference|research|source|look up/.test(t) || (state.search && !/render|dark|light|accent|colou?r/.test(t))) {
        await search();
        setChips(state.rendered ? ['Make it dark', 'Change the accent', 'Hand off to Coder'] : ['Render it on the device']);
      } else if (/dark|light|accent|colou?r|palette/.test(t)) {
        if (!state.rendered) { await say('Let me put it on the device first, then restyle it.'); await render(); }
        if (/dark|light/.test(t)) await restyleDark(/dark/.test(t)); else await restyleAccent();
      } else if (/render|show|device|see it|preview|put it/.test(t)) {
        if (state.rendered) { await unlock(); await say('It is already on the device. Tell me what to change and I will restyle it.'); }
        else await render();
      } else {
        await say(state.rendered
          ? 'Noted. In this concept build I can restyle the surface, change the accent, show how cited search will look, or prepare the handoff to Coder.'
          : 'Noted, I have added that to the plan. Ask me to render it when you want to see it on the device.');
        setChips(state.rendered ? ['Make it dark', 'Change the accent', 'Hand off to Coder'] : ['Render it on the device', 'Find references first']);
      }
    } finally {
      state.busy = false;
      document.body.classList.remove('busy');
    }
  }

  /* ── Composer ──────────────────────────────────────────────────────── */
  const input = $('input');
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px'; }
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('composer').requestSubmit(); }
  });
  $('composer').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    if (!v.trim() || state.busy) return;
    input.value = ''; autosize();
    handleUser(v);
  });
  $('starters').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-idea]');
    if (b) handleUser(Proto.IDEAS[b.dataset.idea].prompt);
  });
  $('renderNow').addEventListener('click', () => {
    if (!state.rendered) return handleUser('Render it on the device');
    if (small.matches) setView('device');
    unlock();
  });
  $('searchToggle').addEventListener('click', () => {
    state.search = !state.search;
    $('searchToggle').setAttribute('aria-pressed', String(state.search));
    $('searchToggle').classList.toggle('on', state.search);
  });
  $('attachBtn').addEventListener('click', () => toast('Attach code, a link or a screenshot. Not wired up in this concept build.'));

  /* ── Captures ──────────────────────────────────────────────────────── */
  function needsRender() {
    if (state.rendered) return false;
    toast('Render an idea first, then capture it.');
    return true;
  }
  $('shotBtn').addEventListener('click', async () => {
    if (needsRender()) return;
    await unlock();
    const f = $('devFlash');
    f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    toast('Screenshot framed at 1K. Saving is not wired up in this concept build.');
  });
  let playing = false;
  $('gifBtn').addEventListener('click', async () => {
    if (needsRender() || playing) return;
    playing = true;
    await unlock();
    $('gifBtn').classList.add('on');
    for (let i = 0; i < state.idea.screens.length; i++) { state.proto.go(i); await wait(1000); }
    $('gifBtn').classList.remove('on');
    playing = false;
    toast('Flow played end to end. This is the path a flow GIF will record.');
  });
  $('recBtn').addEventListener('click', () => toast('HD and 2K screen recording is a Pro feature.'));

  /* ── Small-screen view switch ──────────────────────────────────────── */
  function setView(v) {
    document.body.dataset.view = v;
    document.querySelectorAll('.view-switch button').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
    if (v === 'chat') {
      document.querySelector('.view-switch [data-view="chat"]').classList.remove('has-new');
      toBottom();
    }
  }
  document.querySelector('.view-switch').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-view]');
    if (b) setView(b.dataset.view);
  });

  /* ── Full-screen test: the prototype fills the visitor's own screen ── */
  const immersive = $('immersive'), immScreen = $('immScreen');
  async function enterImmersive() {
    if (needsRender()) return;
    await unlock();
    const node = devScreen.firstElementChild;
    if (!node) return;
    immScreen.appendChild(node);
    immersive.hidden = false;
  }
  function exitImmersive() {
    if (immersive.hidden) return;
    const node = immScreen.firstElementChild;
    if (node) devScreen.appendChild(node);
    immersive.hidden = true;
  }
  /* On small screens the stage tools join the capture dock, so the device
     gets the height the header row would have used. */
  function placeTools() {
    const home = small.matches ? document.querySelector('.capture-dock') : document.querySelector('.stage-tools');
    home.appendChild($('fullBtn'));
    home.appendChild($('relockBtn'));
  }
  placeTools();
  small.addEventListener('change', placeTools);
  $('fullBtn').addEventListener('click', enterImmersive);
  $('immExit').addEventListener('click', exitImmersive);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') exitImmersive(); });
  small.addEventListener('change', (e) => { if (!e.matches) exitImmersive(); });

  /* ── Boot ──────────────────────────────────────────────────────────── */
  paintIcons();
  syncModeIcon();
  addUsage(0);
  mountDevice();
})();
