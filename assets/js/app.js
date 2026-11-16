/* Selasi AI concept build: chats, projects, device stage, flow, captures,
   settings and handoff. There is no backend; replies follow a small script. */
(function () {
  'use strict';

  const DL = window.DeviceLockscreens;
  const Proto = window.SelasiProto;
  const $ = (id) => document.getElementById(id);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 900px)');
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? Math.min(ms, 60) : ms));
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  /* ── Icons ─────────────────────────────────────────────────────────── */
  const ICONS = {
    plus: '<path d="M12 5v14M5 12h14"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    bolt: '<path d="M13 2L5 13.5h6L10 22l8-11.5h-6z" fill="currentColor" stroke="none"/>',
    send: '<path d="M21 3L10.5 13.5"/><path d="M21 3l-6.5 18-4-7.5L3 9.5z"/>',
    arrowup: '<path d="M12 19V5M6 11l6-6 6 6"/>',
    chevup: '<path d="M6 14.5l6-6 6 6"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    bag: '<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21a2 2 0 0 1 2-2h13"/>',
    clip: '<path d="M20 11.5l-8.2 8.2a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.4 8.4a1.7 1.7 0 0 1-2.4-2.4l7.6-7.6"/>',
    code: '<path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.700-5.700l-1 1"/><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    unlock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.5-2"/>',
    camera: '<path d="M4 8h3l1.5-2.5h7L17 8h3v11H4z"/><circle cx="12" cy="13" r="3.2"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16M16 4v16M3 9h5M3 15h5M16 9h5M16 15h5"/>',
    record: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3.5" fill="currentColor"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    download: '<path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14"/>',
    git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-10.500 5.500"/>',
    file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>',
    ticket: '<path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v3a1.5 1.5 0 0 0 0 3v3a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-3a1.5 1.5 0 0 0 0-3z"/><path d="M14 7v10" stroke-dasharray="2 2.5"/>',
    pulse: '<path d="M3 12h4l2.5-6 4 12 2.5-6h5"/>',
    cake: '<path d="M5 20v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M3 20h18M5 15.5c2.3 1.5 4.700-1.500 7 0s4.700 1.500 7 0M12 11V7M12 4.500v.010"/>',
    palette: '<path d="M12 3.500a8.500 8.500 0 1 0 0 17c1.500 0 2-1 2-2 0-1.500 1-2 2.500-2H18a2.500 2.500 0 0 0 2.500-2.500c0-4.700-3.800-8.500-8.500-8.500z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="8" r="1"/><circle cx="16" cy="11" r="1"/>',
    scissors: '<circle cx="6.500" cy="7" r="2.500"/><circle cx="6.500" cy="17" r="2.500"/><path d="M8.700 8.300L20 18M8.700 15.700L20 6"/>',
    box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/>',
    headphones: '<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="3" y="13" width="4.500" height="7" rx="2"/><rect x="16.500" y="13" width="4.500" height="7" rx="2"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/>'
  };
  const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;
  function paintIcons(root) { $$('[data-icon]', root).forEach((el) => { el.innerHTML = icon(el.dataset.icon); }); }

  /* ── Settings ──────────────────────────────────────────────────────── */
  const settings = Object.assign({ mode: 'system', accent: 'coral', device: 'iphone', unlockAnim: true, enterSend: true, search: false, shot: '1k' },
    (() => { try { return JSON.parse(localStorage.getItem('selasi-settings') || '{}'); } catch (_) { return {}; } })());
  function saveSettings() { try { localStorage.setItem('selasi-settings', JSON.stringify(settings)); } catch (_) { /* private mode */ } }
  function applySettings() {
    const sys = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    document.documentElement.dataset.mode = settings.mode === 'system' ? sys : settings.mode;
    document.documentElement.dataset.accent = settings.accent;
    $$('[data-setting]').forEach((el) => {
      const key = el.dataset.setting;
      if (el.classList.contains('switch')) el.setAttribute('aria-checked', String(!!settings[key]));
      else $$('button', el).forEach((b) => b.classList.toggle('active', b.dataset.val === String(settings[key])));
    });
  }
  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', applySettings);
  $('settings').addEventListener('click', (e) => {
    const holder = e.target.closest('[data-setting]');
    if (!holder) return;
    const key = holder.dataset.setting;
    if (holder.classList.contains('switch')) settings[key] = !settings[key];
    else {
      const b = e.target.closest('button[data-val]');
      if (!b) return;
      if (b.hasAttribute('data-locked')) { toast('2K and above is for paid plans.'); return; }
      settings[key] = b.dataset.val;
    }
    saveSettings(); applySettings();
    if (key === 'search') setSearch(settings.search);
  });

  /* ── State ─────────────────────────────────────────────────────────── */
  const DEVICE_LABEL = { iphone: 'iPhone 15 Pro', android: 'Samsung S26 Ultra', tablet: 'iPad Pro 11"', laptop: 'Laptop' };
  let seq = 0;
  const blankChat = () => ({ id: ++seq, idea: null, rendered: false, dark: false, variant: 0, accentIdx: 0, accentColor: null, html: '', chips: [], screen: 0 });
  let chat = blankChat();
  let chats = [chat];
  const ui = { device: settings.device, locked: true, busy: false, usage: 0, proto: null, search: settings.search };

  /* ── Toast ─────────────────────────────────────────────────────────── */
  let toastTimer = 0;
  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
  }
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-toast]');
    if (b) toast(b.dataset.toast);
  });

  /* ── Stamina ───────────────────────────────────────────────────────── */
  const CAP = 0.3;
  function addUsage(n) {
    ui.usage = Math.min(CAP, ui.usage + n);
    const left = 1 - ui.usage / CAP;
    const pct = Math.round(left * 100) + '%';
    const c = 2 * Math.PI * 14;
    $$('.st-fill').forEach((el) => { el.style.strokeDasharray = c; el.style.strokeDashoffset = c * (1 - left); });
    $$('.js-stbar').forEach((el) => { el.style.width = pct; });
    $('stPct').textContent = pct; $('stPct2').textContent = pct;
    document.body.classList.toggle('low-stamina', left < 0.25);
  }
  const pop = $('staminaPop');
  $$('.js-stamina').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation();
    closeSide();
    pop.hidden = !pop.hidden;
  }));
  document.addEventListener('click', (e) => { if (!pop.hidden && !e.target.closest('#staminaPop')) pop.hidden = true; });
  $('stMore').addEventListener('click', () => { pop.hidden = true; openSettings(); $('planSection').scrollIntoView(); });

  /* ── Trays (slide-out controls) ────────────────────────────────────── */
  function setTray(tray, trigger, open) {
    tray.classList.toggle('open', open);
    trigger.setAttribute('aria-expanded', String(open));
    trigger.classList.toggle('open', open);
  }
  $('plusBtn').addEventListener('click', () => setTray($('composerTray'), $('plusBtn'), !$('composerTray').classList.contains('open')));
  $('dockHandle').addEventListener('click', () => setTray($('dockTray'), $('dockHandle'), !$('dockTray').classList.contains('open')));

  function setSearch(on) {
    ui.search = on;
    $('searchToggle').setAttribute('aria-pressed', String(on));
    $('searchToggle').classList.toggle('on', on);
    $('searchFlag').hidden = !on;
    syncMeta();
  }
  $('searchToggle').addEventListener('click', () => setSearch(!ui.search));
  function syncMeta() { $('composerMeta').hidden = $('renderNow').hidden && $('searchFlag').hidden; }

  /* ── Device stage ──────────────────────────────────────────────────── */
  const device = $('device'), devArt = $('devArt'), devScreen = $('devScreen'), devCutout = $('devCutout'), devLock = $('devLock');
  const isPhone = (d) => d === 'iphone' || d === 'android';

  function setGeometry() {
    const d = ui.device;
    const set = (o) => Object.keys(o).forEach((k) => device.style.setProperty('--' + k, o[k]));
    if (d === 'tablet') return set({ ratio: (870 / 1230).toFixed(4), sx: '2.07%', sy: '1.46%', sw: '95.86%', sh: '97.08%', srx: '2.2%', sry: '1.55%' });
    if (d === 'laptop') return set({ ratio: '1.6', sx: '1.1%', sy: '1.76%', sw: '97.8%', sh: '96.48%', srx: '0.9%', sry: '1.44%' });
    const g = DL.geometry(d);
    const rx = d === 'iphone' ? g.screenRx.iphone : g.screenRx.android;
    const pct = (n) => (n * 100).toFixed(3) + '%';
    set({
      ratio: (g.view.w / g.view.h).toFixed(4),
      sx: pct((g.screen.x - g.view.x) / g.view.w), sy: pct((g.screen.y - g.view.y) / g.view.h),
      sw: pct(g.screen.w / g.view.w), sh: pct(g.screen.h / g.view.h),
      srx: pct(rx / g.screen.w), sry: pct(rx / g.screen.h)
    });
  }

  function showLock() {
    ui.locked = true;
    devArt.innerHTML = ''; devCutout.innerHTML = '';
    DL.render(devLock, ui.device, isPhone(ui.device));
    device.classList.remove('is-live');
    syncStage();
  }
  function showApp() {
    const d = ui.device;
    ui.locked = false;
    devLock.innerHTML = '';
    devArt.innerHTML = isPhone(d) ? DL.frame(d) : '';
    devCutout.innerHTML = isPhone(d) ? DL.cutout(d) : '';
    device.classList.add('is-live');
    syncStage();
  }
  function unlock() {
    return new Promise((resolve) => {
      if (!ui.locked) return resolve();
      let done = false;
      const finish = () => { if (done) return; done = true; showApp(); resolve(); };
      if (!settings.unlockAnim || !DL.playUnlock(devLock, ui.device, finish)) finish();
      else setTimeout(finish, 1200);
    });
  }
  function mountDevice() {
    device.dataset.device = ui.device;
    $$('#deviceTabs button').forEach((x) => x.classList.toggle('active', x.dataset.device === ui.device));
    setGeometry();
    if (ui.proto) ui.proto.setWide(ui.device === 'tablet' || ui.device === 'laptop');
    if (chat.rendered && !ui.locked) showApp(); else showLock();
  }

  function syncStage() {
    const live = chat.rendered && !ui.locked;
    const idx = ui.proto ? ui.proto.index : 0;
    const pill = $('statePill');
    pill.hidden = !chat.rendered;
    pill.classList.toggle('live', live);
    pill.querySelector('span').textContent = live ? chat.idea.screens[idx].name : 'Locked';
    $('relockBtn').innerHTML = `<span data-icon="lock">${icon(ui.locked ? 'unlock' : 'lock')}</span>${ui.locked ? 'Unlock' : 'Lock'}`;
    $$('#flowList .flow-item').forEach((el, i) => el.classList.toggle('active', live && i === idx));
    const active = document.querySelector('#flowList .flow-item.active');
    if (active && small.matches) active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduced ? 'auto' : 'smooth' });
  }

  $('deviceTabs').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-device]');
    if (!b || b.dataset.device === ui.device) return;
    ui.device = b.dataset.device;
    mountDevice();
  });
  $('relockBtn').addEventListener('click', () => { if (ui.locked) unlock(); else showLock(); });

  /* ── Flow ──────────────────────────────────────────────────────────── */
  function paintFlow() {
    const idea = chat.idea;
    if (!idea || !chat.rendered) { $('flowList').innerHTML = ''; $('flowCount').textContent = ''; return; }
    $('flowCount').textContent = `${idea.screens.length} ${idea.kind === 'site' ? 'pages' : 'screens'}`;
    $('flowList').innerHTML = idea.screens.map((s, i) => `
      <button class="flow-item" data-screen="${i}">
        <span class="flow-num">${i + 1}</span>
        <span class="flow-text"><b>${esc(s.name)}</b><small>${esc(s.desc)}</small></span>
      </button>
      ${i < idea.taps.length ? `<div class="flow-link"><i></i><span>${esc(idea.taps[i])}</span></div>` : ''}`).join('');
  }
  $('flowList').addEventListener('click', async (e) => {
    const b = e.target.closest('.flow-item');
    if (!b || !ui.proto) return;
    await unlock();
    ui.proto.go(Number(b.dataset.screen));
  });

  /* ── Contextual chrome: show controls only when they apply ─────────── */
  function syncContext() {
    const idea = chat.idea, site = !!idea && idea.kind === 'site';
    document.body.classList.toggle('is-empty', !idea && !chat.html);
    document.body.classList.toggle('has-proto', chat.rendered);
    $$('.js-title').forEach((el) => { el.textContent = idea ? idea.name : (el.classList.contains('appbar-title') ? 'Selasi AI' : 'New idea'); });
    $$('.js-handoff').forEach((el) => { el.hidden = !chat.rendered; });
    $('renderNow').hidden = ui.busy || !(idea && !chat.rendered);
    $('dockHandle').hidden = !chat.rendered;
    $('askBtn').hidden = !chat.rendered;
    if (!chat.rendered) closeAsk();
    if (!chat.rendered) setTray($('dockTray'), $('dockHandle'), false);
    $('deviceTabs').querySelector('[data-device="laptop"]').hidden = !site;
    if (!site && ui.device === 'laptop') ui.device = settings.device;
    $('input').placeholder = idea ? 'Ask for a change…' : 'Describe your idea…';
    if (!chat.rendered && document.body.dataset.view === 'device') setView('chat');
    syncMeta();
  }

  /* ── Chat primitives ───────────────────────────────────────────────── */
  const messages = $('messages'), scroller = $('chatScroll');
  const toBottom = () => { scroller.scrollTop = scroller.scrollHeight; };
  const onDeviceView = () => small.matches && document.body.dataset.view === 'device';

  function addUser(text) {
    $('welcome').hidden = true;
    document.body.classList.remove('is-empty');
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
  const TYPING = '<span class="typing"><i></i><i></i><i></i></span>';
  async function say(html) {
    const el = addBlock(TYPING, 'msg ai');
    if (askOpen()) $('askReply').innerHTML = TYPING;
    await wait(650);
    el.innerHTML = html;
    el.classList.add('pop-in');
    paintIcons(el);
    toBottom();
    if (askOpen()) $('askReply').innerHTML = el.innerHTML;
    else if (onDeviceView()) {
      document.querySelector('.view-switch [data-view="chat"]').classList.add('has-new');
      toast(el.textContent.replace(/\s+/g, ' ').trim().split('. ')[0].slice(0, 90));
    }
    return el;
  }
  function setChips(list) {
    chat.chips = list || [];
    const html = chat.chips.map((c) => `<button data-say="${esc(c)}">${esc(c)}</button>`).join('');
    $('chips').innerHTML = html;
    $('sheetChips').innerHTML = html;
    toBottom();
  }
  function onChip(e) { const b = e.target.closest('button[data-say]'); if (b) handleUser(b.dataset.say); }
  $('chips').addEventListener('click', onChip);
  $('sheetChips').addEventListener('click', onChip);
  messages.addEventListener('click', (e) => { const t = e.target.closest('.tool.done'); if (t) t.classList.toggle('open'); });

  /* ── Ask sheet: message Selasi from the device pane ────────────────── */
  const askSheet = $('askSheet'), askInput = $('askInput');
  function askOpen() { return askSheet.classList.contains('open'); }
  function openAsk() {
    setTray($('dockTray'), $('dockHandle'), false);
    const last = $$('.msg.ai', messages).pop();
    $('askReply').innerHTML = last ? last.innerHTML : 'Tell me what to change.';
    askSheet.classList.add('open');
    askSheet.setAttribute('aria-hidden', 'false');
    $('askScrim').hidden = false;
  }
  function closeAsk() {
    askSheet.classList.remove('open');
    askSheet.setAttribute('aria-hidden', 'true');
    $('askScrim').hidden = true;
    askInput.blur();
  }
  $('askBtn').addEventListener('click', openAsk);
  $('askClose').addEventListener('click', closeAsk);
  $('askScrim').addEventListener('click', closeAsk);
  $('askForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = askInput.value;
    if (!v.trim() || ui.busy) return;
    askInput.value = '';
    handleUser(v);
  });
  small.addEventListener('change', (e) => { if (!e.matches) closeAsk(); });

  /* ── Scripted replies ──────────────────────────────────────────────── */
  function pickIdea(text) {
    const t = text.toLowerCase(), I = Proto.IDEAS;
    if (/deliver|freight|logistic|truck|courier|shipping/.test(t)) return I.freight;
    if (/headphone|headset|earbud|speaker|audio/.test(t)) return I.auro;
    if (/bak|cake|bread|pastr/.test(t)) return I.bakery;
    if (/barber|salon|haircut|book a slot/.test(t)) return I.salon;
    if (/portfolio|designer|case stud/.test(t)) return I.portfolio;
    if (/web ?site|landing|web ?page|\bsite\b|\bblog\b/.test(t)) return I.genericSite;
    if (/susu|sav|circle|pool|contribut/.test(t)) return I.susu;
    if (/gym|workout|fitness|exercise/.test(t)) return I.gym;
    if (/event|ticket|concert/.test(t)) return I.events;
    if (/food|order|lunch|chop|canteen|meal|restaurant/.test(t)) return I.food;
    if (/study|revis|course|class|planner/.test(t)) return I.study;
    return I.generic;
  }
  const noun = () => (chat.idea.kind === 'site' ? 'pages' : 'screens');
  const afterRender = () => ['Show another version', chat.dark ? 'Make it light' : 'Make it dark', 'Change the accent', 'Hand off to Coder'];

  async function replyPlan() {
    const idea = chat.idea, n = idea.screens.length;
    syncContext();
    const placeholder = idea.key === 'generic' || idea.key === 'genericSite';
    const lead = placeholder
      ? `I can sketch this as ${n} ${noun()}. This concept build only has a few sample ideas wired in, so the content is placeholder text.`
      : `<b>${esc(idea.name)}</b> works as ${n} ${noun()}. This is the shape I would start with:`;
    await say(`${lead}
      <ol class="plan">${idea.screens.map((s) => `<li><b>${esc(s.name)}</b><span>${esc(s.desc)}</span></li>`).join('')}</ol>
      ${idea.kind === 'site' ? 'It will open in a browser on the device, since this is a website.' : 'It will fill the device screen, since this is an app.'} Say the word and I will render it.`);
    setChips(['Render it on the device', 'Find references first']);
  }

  async function render() {
    const idea = chat.idea;
    const steps = ['Mapping the flow', 'Picking patterns from the library', `Composing ${idea.screens.length} ${noun()}`, idea.kind === 'site' ? 'Opening it in the browser' : 'Wiring the taps'];
    const card = addBlock(`<div class="tool-head"><span data-icon="phone"></span><b>Rendering on ${esc(DEVICE_LABEL[ui.device])}</b><span class="spin"></span></div>
      <ul>${steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>`, 'tool');
    for (const li of $$('li', card)) { li.classList.add('run'); await wait(430); li.classList.replace('run', 'ok'); }
    card.classList.add('done');
    card.querySelector('b').textContent = `Rendered on ${DEVICE_LABEL[ui.device]}`;

    chat.rendered = true;
    mountProto();
    paintFlow();
    addUsage(0.03);
    syncContext();
    if (small.matches) setView('device');
    await unlock();
    await say(idea.kind === 'site'
      ? (idea.key === 'freight' || idea.key === 'auro'
        ? `${esc(idea.name)} is open in the browser. <b>Scroll the page on the device</b> and the scene plays with your scroll. It looks best on the Laptop tab.`
        : `${esc(idea.name)} is open in the browser on the ${esc(DEVICE_LABEL[ui.device])}. Use the links on the page and the back button to move around. Try the Laptop tab for the wide layout.`)
      : `${idea.screens.length} screens are live on the ${esc(DEVICE_LABEL[ui.device])}. Tap <b>Get started</b> on the device. The controls work, so try the buttons, steppers and filters.`);
    setChips(afterRender());
  }

  function mountProto() {
    if (ui.proto) ui.proto.destroy();
    ui.proto = Proto.mount(devScreen, chat.idea, { onNavigate: (i) => { chat.screen = i; syncStage(); } });
    ui.proto.setDark(chat.dark);
    ui.proto.setVariant(chat.variant);
    if (chat.accentColor) ui.proto.setAccent(chat.accentColor);
    ui.proto.setWide(ui.device === 'tablet' || ui.device === 'laptop');
    if (chat.screen) ui.proto.go(chat.screen, true);
  }

  async function restyleDark(wantDark) {
    chat.dark = wantDark;
    ui.proto.setDark(wantDark);
    await unlock();
    await say(`Restyled everything with a ${wantDark ? 'dark' : 'light'} surface. The layout and flow are unchanged.`);
    setChips(afterRender());
  }
  async function restyleVariant() {
    chat.variant = (chat.variant + 1) % Proto.VARIANTS.length;
    ui.proto.setVariant(chat.variant);
    await unlock();
    await say(`Here is the <b>${Proto.VARIANTS[chat.variant]}</b> version: same flow and content, different shapes, type and density. Ask again for the next one.`);
    setChips(afterRender());
  }
  async function restyleAccent() {
    chat.accentIdx = (chat.accentIdx + 1) % Proto.ACCENTS.length;
    const c = chat.accentColor = Proto.ACCENTS[chat.accentIdx];
    ui.proto.setAccent(c);
    await unlock();
    await say(`Swapped the accent to <span class="swatch" style="background:${c}"></span><code>${c}</code> across buttons and highlights. Ask again to try another.`);
    setChips(afterRender());
  }
  async function search() {
    const card = addBlock('<div class="tool-head"><span data-icon="globe"></span><b>Searching the web</b><span class="spin"></span></div>', 'tool');
    await wait(1100);
    card.classList.add('done');
    card.querySelector('b').textContent = 'Searched the web';
    await say(`In the full product I would search here and cite what I found. Cited answers will look like this:
      <p class="sample">Similar products lead with one clear action on the first screen<sup>1</sup> and keep sign-up to a single step<sup>2</sup>.</p>
      <div class="sources"><span><i>1</i>Sample source</span><span><i>2</i>Sample source</span></div>
      Links are read for layout and structure only. Nothing is copied from them.`);
    setChips(chat.rendered ? afterRender() : ['Render it on the device']);
  }

  async function handleUser(text) {
    text = String(text || '').trim();
    if (!text || ui.busy) return;
    ui.busy = true;
    document.body.classList.add('busy');
    setTray($('composerTray'), $('plusBtn'), false);
    setChips([]);
    addUser(text);
    addUsage(0.01);
    const t = text.toLowerCase();
    try {
      if (!chat.idea) {
        chat.idea = pickIdea(text);
        chat.accentIdx = Math.max(0, Proto.ACCENTS.indexOf(chat.idea.accent));
        await replyPlan();
      } else if (/hand ?off|coder|export|build it/.test(t)) {
        if (!chat.rendered) { await say('Render it first, then I can package the plan and screens for Coder.'); setChips(['Render it on the device']); }
        else { await say('Here is the package Coder will receive. Review the plan and the handoff record before you send it.'); setChips(afterRender()); closeAsk(); openHandoff(); }
      } else if (/search|reference|research|source|look up/.test(t) || (ui.search && !/render|dark|light|accent|colou?r/.test(t))) {
        await search();
      } else if (/version|variation|another look|different look|redesign/.test(t)) {
        if (!chat.rendered) { await say('Let me put it on the device first, then show you other versions.'); await render(); }
        await restyleVariant();
      } else if (/dark|light|accent|colou?r|palette/.test(t)) {
        if (!chat.rendered) { await say('Let me put it on the device first, then restyle it.'); await render(); }
        if (/dark|light/.test(t)) await restyleDark(/dark/.test(t)); else await restyleAccent();
      } else if (/render|show|device|see it|preview|put it/.test(t)) {
        if (chat.rendered) { await unlock(); await say('It is already on the device. Tell me what to change and I will restyle it.'); setChips(afterRender()); }
        else await render();
      } else {
        await say(chat.rendered
          ? 'Noted. In this concept build I can show another version, restyle the surface, change the accent, show how cited search will look, or prepare the handoff to Coder.'
          : 'Noted, I have added that to the plan. Ask me to render it when you want to see it on the device.');
        setChips(chat.rendered ? afterRender() : ['Render it on the device', 'Find references first']);
      }
    } finally {
      ui.busy = false;
      document.body.classList.remove('busy');
      syncContext();
      chat.html = messages.innerHTML;
    }
  }

  /* ── Composer ──────────────────────────────────────────────────────── */
  const input = $('input');
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 140) + 'px'; }
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && settings.enterSend && !small.matches) { e.preventDefault(); $('composer').requestSubmit(); }
  });
  $('composer').addEventListener('submit', (e) => {
    e.preventDefault();
    const v = input.value;
    if (!v.trim() || ui.busy) return;
    input.value = ''; autosize();
    handleUser(v);
  });
  $('starters').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-idea]');
    if (b) handleUser(Proto.IDEAS[b.dataset.idea].prompt);
  });
  $('renderNow').addEventListener('click', () => handleUser('Render it on the device'));

  /* ── Chats and projects ────────────────────────────────────────────── */
  function loadChat(c) {
    chat = c;
    messages.innerHTML = c.html;
    $('welcome').hidden = !!c.html;
    if (ui.proto) ui.proto.destroy();
    devScreen.innerHTML = '';
    ui.proto = null;
    ui.locked = !c.rendered;
    syncContext();
    if (c.rendered) mountProto();
    paintFlow();
    mountDevice();
    setChips(c.chips);
    document.querySelector('.view-switch [data-view="chat"]').classList.remove('has-new');
    toBottom();
  }
  function newChat() {
    if (ui.busy) { toast('Wait for the reply to finish first.'); return; }
    closeSide();
    closeAsk();
    exitImmersive();
    if (!chat.idea) { setView('chat'); input.focus(); return; }
    const c = blankChat();
    chats.unshift(c);
    ui.device = settings.device;
    setView('chat');
    loadChat(c);
    if (!small.matches) input.focus();
  }
  $$('.js-new').forEach((b) => b.addEventListener('click', newChat));

  const PATTERNS = [
    ['Balance card', 'Finance · calm', 'a'], ['List with values', 'Any app · dense', 'b'], ['Hero and call to action', 'Site · bold', 'c'],
    ['Checkout sheet', 'Commerce · focused', 'b'], ['Tab bar home', 'Any app · familiar', 'a'], ['Product grid', 'Site · visual', 'c']
  ];
  let sideTab = 'chats';
  function paintSide() {
    $$('#sideTabs button').forEach((b) => b.classList.toggle('active', b.dataset.tab === sideTab));
    const body = $('sideBody');
    if (sideTab === 'patterns') {
      body.innerHTML = `<p class="side-note">Building blocks Selasi combines with your idea.</p><div class="pattern-grid">${PATTERNS.map((p) => `<button data-pattern="${esc(p[0])}"><i class="thumb ${p[2]}"><u></u><u></u><u></u></i><b>${esc(p[0])}</b><small>${esc(p[1])}</small></button>`).join('')}</div>`;
      return;
    }
    const list = chats.filter((c) => c.idea && (sideTab === 'chats' || c.rendered));
    if (!list.length) {
      body.innerHTML = `<p class="side-empty">${sideTab === 'chats' ? 'Your chats will appear here.' : 'Ideas you render become projects and appear here.'}</p>`;
      return;
    }
    body.innerHTML = list.map((c) => {
      const kind = c.idea.kind === 'site' ? 'Website' : 'App';
      const sub = c.rendered ? `${kind} · ${c.idea.screens.length} ${c.idea.kind === 'site' ? 'pages' : 'screens'}` : `${kind} · plan only`;
      return `<button class="side-item${c === chat ? ' active' : ''}" data-chat="${c.id}">
        <i style="background:${c.accentColor || c.idea.accent}">${esc(c.idea.mark)}</i>
        <span><b>${esc(c.idea.name)}</b><small>${sub}</small></span></button>`;
    }).join('');
  }
  function openSide(tab) {
    if (tab) sideTab = tab;
    pop.hidden = true;
    paintSide();
    $('side').classList.add('open');
    $('side').setAttribute('aria-hidden', 'false');
    $('scrim').hidden = false;
    $$('.rail-btn[data-side]').forEach((b) => b.classList.toggle('active', b.dataset.side === sideTab));
  }
  function closeSide() {
    $('side').classList.remove('open');
    $('side').setAttribute('aria-hidden', 'true');
    $('scrim').hidden = true;
    $$('.rail-btn[data-side]').forEach((b) => b.classList.remove('active'));
  }
  $$('.rail-btn[data-side]').forEach((b) => b.addEventListener('click', () => {
    if ($('side').classList.contains('open') && sideTab === b.dataset.side) closeSide(); else openSide(b.dataset.side);
  }));
  $('menuBtn').addEventListener('click', () => openSide());
  $('sideClose').addEventListener('click', closeSide);
  $('scrim').addEventListener('click', closeSide);
  $('sideTabs').addEventListener('click', (e) => { const b = e.target.closest('button[data-tab]'); if (b) { openSide(b.dataset.tab); } });
  $('sideBody').addEventListener('click', (e) => {
    const p = e.target.closest('[data-pattern]');
    if (p) { closeSide(); input.value = `Use the "${p.dataset.pattern}" pattern`; autosize(); setView('chat'); input.focus(); return; }
    const b = e.target.closest('[data-chat]');
    if (!b) return;
    if (ui.busy) { toast('Wait for the reply to finish first.'); return; }
    const c = chats.find((x) => String(x.id) === b.dataset.chat);
    closeSide();
    if (c && c !== chat) { chats = chats.filter((x) => x.idea || x === c); loadChat(c); }
    if (sideTab === 'projects' && c && c.rendered && small.matches) setView('device');
  });

  /* ── Settings page ─────────────────────────────────────────────────── */
  function openSettings() { closeSide(); pop.hidden = true; $('settings').hidden = false; }
  function closeSettings() { $('settings').hidden = true; }
  $$('.js-settings').forEach((b) => b.addEventListener('click', openSettings));
  $('settingsClose').addEventListener('click', closeSettings);
  $('settings').addEventListener('click', (e) => { if (e.target === $('settings')) closeSettings(); });
  $('clearChats').addEventListener('click', () => {
    if (ui.busy) { toast('Wait for the reply to finish first.'); return; }
    const c = blankChat();
    chats = [c];
    loadChat(c);
    closeSettings();
    toast('All chats cleared.');
  });

  /* ── Handoff ───────────────────────────────────────────────────────── */
  function openHandoff() {
    const idea = chat.idea;
    if (!idea || !chat.rendered) { toast('Render an idea first, then hand it off.'); return; }
    const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const path = (s, i) => `screens/${String(i + 1).padStart(2, '0')}-${slug(s.name)}.html`;
    const files = [
      { n: 'plan.md', d: 'Intent, flows, decisions', body:
`# ${idea.name}: plan

## Intent
${idea.prompt || 'Described in chat.'}

## Type
${idea.kind === 'site' ? 'Website (opens in a browser)' : 'App (full screen)'}

## Flow
${idea.screens.map((s, i) => `${i + 1}. ${s.name}: ${s.desc}`).join('\n')}

## Decisions
- Accent: ${chat.accentColor || idea.accent}
- Surface: ${chat.dark ? 'dark' : 'light'}

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
${idea.screens.map((s, i) => '- ' + path(s, i)).join('\n')}

## Next steps for Coder
1. Read plan.md first.
2. Treat the files in the repo as the source of truth.
3. If the plan and the files disagree, flag it and ask.
4. Append a dated entry when you pick this up.` },
      { n: 'manifest.json', d: 'Purpose and hash per file', body: JSON.stringify({
        schema: 1, run: { install: 'npm install', start: 'npm run dev', build: 'npm run build' },
        files: idea.screens.map((s, i) => ({ path: path(s, i), purpose: s.desc, hash: 'sha256:(computed at export)' }))
      }, null, 2) }
    ].concat(idea.screens.map((s, i) => ({ n: path(s, i), d: s.desc, body: `<!-- ${idea.name}: ${s.name} -->\n<!-- ${s.desc} -->\n\nThe generated markup for this ${idea.kind === 'site' ? 'page' : 'screen'} is exported here.` })));

    const list = $('fileList');
    list.innerHTML = files.map((f, i) => `<li><button data-file="${i}"${i === 0 ? ' class="active"' : ''}><span data-icon="file"></span><span><b>${esc(f.n)}</b><small>${esc(f.d)}</small></span></button></li>`).join('');
    paintIcons(list);
    $('filePreview').textContent = files[0].body;
    list.onclick = (e) => {
      const b = e.target.closest('button[data-file]');
      if (!b) return;
      $$('button', list).forEach((x) => x.classList.toggle('active', x === b));
      $('filePreview').textContent = files[Number(b.dataset.file)].body;
    };
    $('handoffModal').hidden = false;
  }
  const closeHandoff = () => { $('handoffModal').hidden = true; };
  $$('.js-handoff').forEach((b) => b.addEventListener('click', openHandoff));
  $('handoffClose').addEventListener('click', closeHandoff);
  $('handoffModal').addEventListener('click', (e) => { if (e.target === $('handoffModal')) closeHandoff(); });

  /* ── Captures ──────────────────────────────────────────────────────── */
  $('shotBtn').addEventListener('click', async () => {
    await unlock();
    const f = $('devFlash');
    f.classList.remove('go'); void f.offsetWidth; f.classList.add('go');
    toast('Screenshot framed at 1K. Saving is not wired up in this concept build.');
  });
  let playing = false;
  $('gifBtn').addEventListener('click', async () => {
    if (playing || !ui.proto) return;
    playing = true;
    await unlock();
    $('gifBtn').classList.add('on');
    const mine = chat;
    for (let i = 0; i < chat.idea.screens.length && chat === mine; i++) { ui.proto.go(i); await wait(900); }
    $('gifBtn').classList.remove('on');
    playing = false;
    toast('Flow played end to end. This is the path a flow GIF will record.');
  });
  $('recBtn').addEventListener('click', () => toast('HD and 2K screen recording is a Pro feature.'));

  /* ── Phone pane switch ─────────────────────────────────────────────── */
  function setView(v) {
    document.body.dataset.view = v;
    $$('.view-switch button').forEach((b) => b.classList.toggle('active', b.dataset.view === v));
    if (v === 'chat') { document.querySelector('.view-switch [data-view="chat"]').classList.remove('has-new'); toBottom(); }
  }
  document.querySelector('.view-switch').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-view]');
    if (b) setView(b.dataset.view);
  });

  /* ── Full-screen test: the prototype fills the visitor's own screen ── */
  const immersive = $('immersive'), immScreen = $('immScreen');
  async function enterImmersive() {
    if (!ui.proto) return;
    await unlock();
    const node = devScreen.firstElementChild;
    if (!node) return;
    immScreen.appendChild(node);
    ui.proto.setWide(window.innerWidth >= 760);
    immersive.hidden = false;
  }
  function exitImmersive() {
    if (immersive.hidden) return;
    const node = immScreen.firstElementChild;
    if (node) devScreen.appendChild(node);
    if (ui.proto) ui.proto.setWide(ui.device === 'tablet' || ui.device === 'laptop');
    immersive.hidden = true;
  }
  $('fullBtn').addEventListener('click', enterImmersive);
  $('immExit').addEventListener('click', exitImmersive);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (!immersive.hidden) return exitImmersive();
    if (!$('handoffModal').hidden) return closeHandoff();
    if (askOpen()) return closeAsk();
    if (!$('settings').hidden) return closeSettings();
    pop.hidden = true;
    closeSide();
  });

  /* ── Boot ──────────────────────────────────────────────────────────── */
  paintIcons();
  applySettings();
  setSearch(settings.search);
  addUsage(0);
  syncContext();
  mountDevice();
})();
