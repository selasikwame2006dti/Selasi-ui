/* Selasi AI concept build: the settings page.
   Desktop and tablets: a two-pane window (category list on the left, the
   chosen page on the right). Phones: a native-style list that drills into
   each page with a back button.

   Controls marked data-setting are saved by app.js (selasi-settings in
   localStorage). Profile, region and connection state are kept here
   (selasi-profile). Payments, GitHub and Coder are simulated. */
(function () {
  'use strict';

  const root = document.getElementById('settings');
  if (!root) return;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const toast = (m) => (window.SelasiToast ? window.SelasiToast(m) : null);

  /* ── State kept by this page ───────────────────────────────────────── */
  const prof = Object.assign({ name: 'Kwame Asante', region: 'GH', github: false, repo: 'selasi-ideas', coder: false, bugSev: 'medium' },
    (() => { try { return JSON.parse(localStorage.getItem('selasi-profile') || '{}'); } catch (_) { return {}; } })());
  const save = () => { try { localStorage.setItem('selasi-profile', JSON.stringify(prof)); } catch (_) { /* private mode */ } };
  const REGIONS = {
    GH: { label: 'Ghana', cur: 'GH₵', plans: [0, 150, 250], packs: [20, 50, 100] },
    NG: { label: 'Nigeria', cur: '₦', plans: [0, 19500, 32500], packs: [2600, 6500, 13000] },
    XX: { label: 'Elsewhere', cur: '$', plans: [0, 12.5, 21], packs: [1.7, 4.2, 8.3] }
  };
  const R = () => REGIONS[prof.region] || REGIONS.GH;
  const price = (n) => n === 0 ? 'Free' : R().cur + ' ' + Number(n).toLocaleString('en', { maximumFractionDigits: 2 });
  const initials = () => prof.name.trim().split(/\s+/).map((w) => w[0] || '').join('').slice(0, 2).toUpperCase() || '?';

  /* ── Icons ─────────────────────────────────────────────────────────── */
  const P = {
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    shield: '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/><path d="M9 12l2 2 4-4"/>',
    bolt: '<path d="M13 2L5 13.5h6L10 22l8-11.5h-6z"/>',
    card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10.5h18M7 15h4"/>',
    gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9C10 5 6.5 5.5 7.5 8M12 9c2-4 5.5-3.500 4.500-1"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    phone: '<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
    spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    git: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="8" r="2.5"/><path d="M6 8.5v7M18 10.5c0 4-6 3-10.5 5.5"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7M12 17h.01"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>', back: '<path d="M15 5l-7 7 7 7"/>', chev: '<path d="M9 5l7 7-7 7"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>', search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    out: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>', trash: '<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/>',
    download: '<path d="M12 4v11M7.5 11l4.5 4.5 4.5-4.5M5 20h14"/>', mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    brain: '<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>'
  };
  const ic = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n] || ''}</svg>`;

  /* ── Building blocks ───────────────────────────────────────────────── */
  const row = (t, n, ctl, cls) => `<div class="set-row ${cls || ''}"><div class="set-text"><b>${t}</b>${n ? `<small>${n}</small>` : ''}</div>${ctl || ''}</div>`;
  const group = (t, rows, foot, cls) => `<section class="set-group ${cls || ''}">${t ? `<h3>${t}</h3>` : ''}<div class="set-card">${rows}</div>${foot ? `<p class="set-foot">${foot}</p>` : ''}</section>`;
  const sw = (k, label) => `<button class="switch" data-setting="${k}" role="switch" aria-label="${esc(label)}"></button>`;
  const seg = (k, opts) => `<div class="seg" data-setting="${k}">${opts.map((o) => `<button data-val="${o[0]}"${o[2] ? ` data-locked="${esc(o[2])}"` : ''}>${o[1]}</button>`).join('')}</div>`;
  const btn = (label, act, cls, icon) => `<button class="set-btn ${cls || ''}" data-act="${act}">${icon ? ic(icon) : ''}${label}</button>`;
  const badge = (t, cls) => `<span class="set-badge ${cls || ''}">${t}</span>`;

  /* ── Pages ─────────────────────────────────────────────────────────── */
  const PAGES = [
    { g: 'Account', id: 'profile', icon: 'user', c: '#5b63d6', t: 'Profile', d: 'How you appear in Selasi AI and Selasi Coder.', k: 'name email region currency photo avatar',
      body: () => `<div class="set-hero-id"><i class="set-avatar js-initials">${initials()}</i><div><b class="js-name">${esc(prof.name)}</b><small>Free plan · member since November 2026</small></div>${btn('Change photo', 'photo', 'ghost')}</div>
        ${group('Details', row('Display name', 'Shown on shared projects and handoffs', `<input class="set-input" id="setName" value="${esc(prof.name)}" maxlength="40" autocomplete="name">`, 'stack')
          + row('Email', 'kwame@example.com', badge(`${ic('check')}Verified`, 'ok'))
          + row('Region', 'Prices, payments and receipts use this currency', `<select class="set-input set-select" id="setRegion">${Object.keys(REGIONS).map((r) => `<option value="${r}"${r === prof.region ? ' selected' : ''}>${REGIONS[r].label} · ${REGIONS[r].cur.trim()}</option>`).join('')}</select>`),
          '', 'with-action')}
        <div class="set-actions">${btn('Save changes', 'saveProfile', 'primary')}</div>` },
    { g: 'Account', id: 'security', icon: 'shield', c: '#1f8a5b', t: 'Sign-in and sessions', d: 'How you sign in, and where you are signed in right now.', k: 'password login google github devices session sign out security',
      body: () => `${group('Sign-in methods', row('Email link', 'A one-time link sent to kwame@example.com', badge('On', 'ok'))
          + row('Google', 'Sign in with your Google account', btn('Connect', 'toast:Google sign-in is not wired up in this concept build.', 'ghost'))
          + row('GitHub', prof.github ? 'Connected. Also used to push projects.' : 'Also lets Selasi push projects to your repositories', prof.github ? badge('Connected', 'ok') : btn('Connect', 'open:github', 'ghost')))}
        ${group('Where you are signed in', row(`${ic('globe')}This browser`, 'Accra · active now', badge('This device'), 'dev')
          + row(`${ic('laptop')}Selasi Coder on Windows`, 'Accra · 2 days ago', btn('Sign out', 'toast:Signed out of Selasi Coder on Windows.', 'ghost'), 'dev')
          + row(`${ic('phone')}Chrome on Android`, 'Kumasi · 5 days ago', btn('Sign out', 'toast:Signed out of Chrome on Android.', 'ghost'), 'dev'),
          'If you do not recognise a session, sign it out and change your email password.')}
        <div class="set-actions">${btn('Sign out of other sessions', 'toast:Every other session is signed out.', 'ghost')}${btn('Sign out', 'toast:Signing out is not wired up in this concept build.', 'ghost', 'out')}</div>` },
    { g: 'Account', id: 'plan', icon: 'bolt', c: '#e2622f', t: 'Plan and stamina', d: 'Stamina powers chats and renders. It is shared with Selasi Coder.', k: 'stamina plan pro starter free upgrade usage window',
      body: () => `<div class="set-stamina"><div class="set-stamina-top"><span>${ic('bolt')}Stamina</span>${badge('Free plan', 'dark')}</div>
          <div class="set-stamina-num"><b id="stPct2">100%</b><small>left today</small></div><div class="set-stamina-bar"><i class="js-stbar"></i></div>
          <div class="set-stamina-stats"><div><small>This 5-hour window</small><b>Resets in 3 h 12 min</b></div><div><small>Bonus stamina</small><b>None yet</b></div><div><small>Daily refill</small><b>Midnight, Ghana time</b></div></div></div>
        <section class="set-group"><h3>Plans</h3><div class="set-plans">${[['Free', 0, ['Daily stamina for a few ideas', '1K screenshots and flow GIFs', 'Phone and tablet frames'], true], ['Starter', 1, ['About 1.7× the daily stamina', '2K screenshots', 'Better models in Auto mode'], false], ['Pro', 2, ['About 3× the daily stamina', 'HD and 2K screen recording', 'Pro model mode and priority'], false]].map((p) => `<article class="${p[3] ? 'current' : ''}${p[0] === 'Pro' ? ' best' : ''}"><div class="set-plan-head"><b>${p[0]}</b>${p[3] ? badge('Current') : p[0] === 'Pro' ? badge('Most capable', 'accent') : ''}</div>
            <div class="set-plan-price"><b class="js-plan" data-i="${p[1]}">${price(R().plans[p[1]])}</b>${p[1] ? '<small>per month</small>' : ''}</div><ul>${p[2].map((f) => `<li>${ic('check')}${f}</li>`).join('')}</ul>
            ${p[3] ? '<button class="set-btn ghost" disabled>Your plan</button>' : btn(`Switch to ${p[0]}`, `toast:Switching to ${p[0]} opens Paystack checkout. Not wired up in this concept build.`, p[0] === 'Pro' ? 'primary' : 'ghost')}</article>`).join('')}</div>
          <p class="set-foot">Daily caps are hard limits. 5-hour windows pace your use within the day and do not raise the cap.</p></section>` },
    { g: 'Account', id: 'billing', icon: 'card', c: '#0c8599', t: 'Top up and billing', d: 'Pay as you go, promo codes and receipts.', k: 'top up pay paystack mobile money promo code receipt payment history invoice',
      body: () => `<section class="set-group"><h3>Top up stamina</h3><div class="set-packs">${['Boost', 'Weekly', 'Builder'].map((n, i) => `<button data-act="pack:${i}"${i === 0 ? ' class="on"' : ''}><small>${n}</small><b class="js-pack" data-i="${i}">${price(R().packs[i])}</b><span>+${[30, 80, 170][i]}% stamina</span></button>`).join('')}</div>
          <div class="set-card">${row('Custom amount', 'Any amount from the smallest pack up', `<input class="set-input" id="setAmount" inputmode="decimal" placeholder="0.00">`, 'stack')}${row('Pay with', 'Mobile money or card, through Paystack', badge('Paystack'))}</div>
          <div class="set-actions">${btn('Pay <span class="js-paytotal">' + price(R().packs[0]) + '</span>', 'pay', 'primary')}</div></section>
        ${group('Promo code', row('Have a code?', 'Try LAUNCH50 in this concept build', `<div class="set-inline"><input class="set-input" id="setPromo" placeholder="e.g. LAUNCH50" autocapitalize="characters"><button class="set-btn ghost" data-act="promo">Apply</button></div>`, 'stack'), '<span id="setPromoOut"></span>')}
        ${group('Payment history', '<div class="set-empty">' + ic('card') + '<b>No payments yet</b><small>Receipts appear here and are emailed to you.</small></div>')}` },
    { g: 'Account', id: 'referrals', icon: 'gift', c: '#c2255c', t: 'Invite friends', d: 'Both of you get bonus stamina when a friend joins.', k: 'referral invite code link friend bonus',
      body: () => `<div class="set-invite"><div><b>Give stamina, get stamina</b><small>Your friend gets a bonus on sign-up. You get one when they make their first payment.</small></div><div class="set-invite-meter"><span><i style="width:20%"></i></span><small>1 of 5 invites used</small></div></div>
        ${group('Share', row('Your code', '', `<div class="set-inline"><input class="set-input mono" value="SELASI-K7Q2" readonly><button class="set-btn ghost" data-act="copy:SELASI-K7Q2">${ic('copy')}Copy</button></div>`, 'stack')
          + row('Your link', '', `<div class="set-inline"><input class="set-input mono" value="selasi.dev/?ref=SELASI-K7Q2" readonly><button class="set-btn ghost" data-act="copy:selasi.dev/?ref=SELASI-K7Q2">${ic('copy')}Copy</button></div>`, 'stack'))}` },

    { g: 'App', id: 'appearance', icon: 'sun', c: '#b7791f', t: 'Appearance', d: 'Theme, colour and motion.', k: 'theme dark light accent colour color motion language',
      body: () => `${group('', row('Theme', 'Follow your device or pick one', seg('mode', [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']]))
          + row('Accent', 'Used for highlights and active states', `<div class="swatches" data-setting="accent">${[['coral', '#ff7a59'], ['cyan', '#19b8d1'], ['violet', '#8b7cf6'], ['green', '#3fb37f']].map((a) => `<button data-val="${a[0]}" style="--c:${a[1]}" aria-label="${a[0]}"></button>`).join('')}</div>`)
          + row('Reduce motion', 'Calmer transitions across the app', sw('reduceMotion', 'Reduce motion'))
          + row('Language', 'More languages are coming', `<select class="set-input set-select" disabled><option>English</option></select>`))}` },
    { g: 'App', id: 'devices', icon: 'phone', c: '#3b82f6', t: 'Devices and preview', d: 'Which frames open first and how captures are made.', k: 'device iphone samsung ipad laptop frame unlock screenshot gif capture preview',
      body: () => `${group('Frames', row('Apps open on', 'The default device for new chats', seg('device', [['iphone', 'iPhone'], ['android', 'Samsung'], ['tablet', 'iPad']]))
          + row('Websites open on', 'On phones, websites always start on the phone frame', seg('siteDevice', [['phone', 'Phone'], ['laptop', 'Laptop']]))
          + row('Unlock animation', 'Play the lock-screen reveal when a prototype loads', sw('unlockAnim', 'Unlock animation')))}
        ${group('Captures', row('Screenshot size', '2K and above is for paid plans', seg('shot', [['1k', '1K'], ['2k', '2K', '2K screenshots are for paid plans.']]))
          + row('Flow GIF speed', 'How long each screen stays on', seg('gifSpeed', [['slow', 'Slow'], ['normal', 'Normal'], ['fast', 'Fast']]))
          + row('Screen recording', 'HD and 2K video', badge('Pro', 'accent')))}` },
    { g: 'App', id: 'agent', icon: 'spark', c: '#8b5cf6', t: 'Agent', d: 'How Selasi plans, asks and remembers.', k: 'agent plan mode questions forms suggestions memory selasi.md web search model enter',
      body: () => `${group('How Selasi works', row('Plan first', 'Selasi writes a plan and waits for your approval before it renders', sw('planMode', 'Plan first'))
          + row('Ask with quick forms', 'Short multiple-choice questions when something is unclear', sw('askForms', 'Ask with quick forms'))
          + row('Suggestion buttons', 'Quick replies under each answer', sw('suggestions', 'Suggestion buttons'))
          + row('Web search by default', 'Search and cite sources without being asked', sw('search', 'Web search by default'))
          + row('Enter sends the message', 'Shift and Enter adds a new line', sw('enterSend', 'Enter sends the message')))}
        ${group('Model', row('Mode', 'Auto picks the right model for each step', seg('agentModel', [['auto', 'Auto'], ['fast', 'Fast'], ['pro', 'Pro', 'Pro mode is for paid plans.']])))}
        ${group('Memory', row('Remember across projects', 'Your style and tool preferences, kept in SELASI.md', sw('memory', 'Remember across projects'))
          + `<pre class="set-memory"># SELASI.md (account)\n- Prefers dark surfaces and rounded cards\n- Currency: Ghana cedi (GH₵)\n- Hands off to Coder as plan plus screens</pre>`
          + row('', '', `<div class="set-inline end">${btn('Clear memory', 'toast:Account memory cleared.', 'ghost danger', 'trash')}</div>`, 'tight'),
          'Selasi only remembers what you tell it or approve. Project memory stays with each project.')}` },
    { g: 'App', id: 'notifications', icon: 'bell', c: '#f59e0b', t: 'Notifications', d: 'What Selasi tells you about, and where.', k: 'notifications email push alerts render handoff stamina news',
      body: () => `${group('Tell me when', row('A render finishes', 'If you left the tab while it was working', sw('nRender', 'A render finishes'))
          + row('Coder picks up a handoff', 'With a link to the project', sw('nHandoff', 'Coder picks up a handoff'))
          + row('Stamina runs low', 'At a quarter left for the day', sw('nStamina', 'Stamina runs low'))
          + row('Product news', 'A short email, about once a month', sw('nNews', 'Product news')))}
        ${group('Send to', row('Channel', '', seg('nChannel', [['push', 'Browser'], ['email', 'Email'], ['both', 'Both']])))}` },

    { g: 'Connections', id: 'github', icon: 'git', c: '#24292f', t: 'GitHub', d: 'Push projects and handoff files to your repositories.', k: 'github repository repo push branch pull request connect',
      body: () => `<div class="set-connect ${prof.github ? 'on' : ''}"><i class="set-logo">${ic('git')}</i><div><b>${prof.github ? 'GitHub is connected' : 'Connect GitHub'}</b><small>${prof.github ? 'Selasi can push to the repositories you choose, and nothing else.' : 'Selasi asks for access only to repositories you pick.'}</small></div>${prof.github ? btn('Disconnect', 'gh:off', 'ghost danger') : btn('Connect', 'gh:on', 'primary')}</div>
        ${prof.github ? group('Pushing', row('Default repository', 'New projects go here unless you pick another', `<input class="set-input mono" id="setRepo" value="${esc(prof.repo)}">`, 'stack')
          + row('Branch name', 'One branch per project', `<input class="set-input mono" value="selasi/{project}" readonly>`, 'stack')
          + row('Open a pull request', 'Instead of pushing straight to the default branch', sw('prDefault', 'Open a pull request'))
          + row('Include plan and handoff files', 'plan.md, SELASI-HANDOFF.md and manifest.json', sw('pushDocs', 'Include plan and handoff files'))) : ''}` },
    { g: 'Connections', id: 'coder', icon: 'laptop', c: '#1e4d3a', t: 'Selasi Coder', d: 'Link the desktop agent that builds what you designed.', k: 'coder desktop handoff link pair device download',
      body: () => `<div class="set-connect ${prof.coder ? 'on' : ''}"><i class="set-logo coder"><img src="assets/favicon.svg" alt=""></i><div><b>${prof.coder ? 'Linked to Selasi Coder on Windows' : 'Link Selasi Coder'}</b><small>${prof.coder ? 'Handoffs arrive in Coder as a new project.' : 'In Coder, open Settings, then Link web account, and enter this code.'}</small></div>${prof.coder ? btn('Unlink', 'coder:off', 'ghost danger') : ''}</div>
        ${prof.coder ? '' : `<div class="set-pair"><b>Q7·4KD·2M</b><small>Code expires in 10 minutes</small>${btn('I have entered it', 'coder:on', 'primary')}</div>`}
        ${group('Handoff', row('What to send', 'Open question in the brief: plan only, or plan and generated screens', seg('handoffWhat', [['plan', 'Plan only'], ['screens', 'Plan and screens']]))
          + row('Send automatically', 'Skip the review step when you press Hand off', sw('autoHandoff', 'Send automatically')))}
        <div class="set-actions">${btn('Download Selasi Coder', 'toast:The Coder download page is not wired up in this concept build.', 'ghost', 'download')}</div>` },

    { g: 'Data and support', id: 'privacy', icon: 'lock', c: '#64748b', t: 'Privacy and data', d: 'What Selasi keeps, and how to take it with you.', k: 'privacy data export delete account clear chats telemetry danger',
      body: () => `${group('Your data', row('Anonymous usage data', 'Helps us find bugs. Never includes chat content.', sw('telemetry', 'Anonymous usage data'))
          + row('Export your data', 'Chats, plans and projects as a zip file', btn('Export', 'toast:Your export is being prepared. We will email a download link.', 'ghost', 'download'))
          + row('Clear all chats', 'Removes every chat and project from this tab', `<button class="set-btn ghost danger" id="clearChats">${ic('trash')}Clear</button>`),
          'Selasi reads only what you give it for the task. Pasted code you did not write needs your confirmation that you have the rights.')}
        <section class="set-group danger"><h3>Danger zone</h3><div class="set-card">${row('Delete account', 'Permanently removes your account, stamina and projects. Type DELETE to confirm.', `<div class="set-inline"><input class="set-input mono" id="setDel" placeholder="DELETE" autocapitalize="characters"><button class="set-btn danger solid" data-act="delete" id="setDelBtn" disabled>Delete</button></div>`, 'stack')}</div></section>` },
    { g: 'Data and support', id: 'help', icon: 'help', c: '#0ea5e9', t: 'Help and feedback', d: 'Report a problem, get help, and policies.', k: 'help bug report support contact feedback terms privacy policy takedown about version',
      body: () => `<section class="set-group"><h3>Report a bug</h3><div class="set-card">${row('What happened?', '', `<textarea class="set-input" id="setBug" rows="4" placeholder="What did you expect, and what happened instead?"></textarea>`, 'stack')}
          ${row('How bad is it?', '', `<div class="seg" id="setSev">${['low', 'medium', 'high', 'critical'].map((s) => `<button data-sev="${s}"${prof.bugSev === s ? ' class="active"' : ''}>${s[0].toUpperCase() + s.slice(1)}</button>`).join('')}</div>`, 'stack')}</div>
          <p class="set-foot">Your page, browser and screen size are attached automatically so we can reproduce it.</p><div class="set-actions">${btn('Send report', 'bug', 'primary')}</div></section>
        ${group('Get help', row(`${ic('mail')}Contact support`, 'We reply within one working day', btn('Email us', 'toast:Support email is not wired up in this concept build.', 'ghost'), 'dev')
          + row(`${ic('globe')}Guides`, 'How plans, renders and handoffs work', btn('Open', 'toast:Guides are not published yet.', 'ghost'), 'dev'))}
        ${group('About', row('Version', 'Selasi AI concept build', '<span class="set-mono">2026.11</span>') + row('Terms and acceptable use', 'Including the no-clones and no-impersonation rules', btn('Read', 'toast:Terms are not published yet.', 'ghost'))
          + row('Report content', 'Takedown requests and repeat-infringer policy', btn('Report', 'toast:Takedown requests are not wired up in this concept build.', 'ghost')))}` }
  ];

  /* ── Shell ─────────────────────────────────────────────────────────── */
  const groups = [...new Set(PAGES.map((p) => p.g))];
  const tile = (p) => `<i class="set-tile" style="--c:${p.c}">${ic(p.icon)}</i>`;
  root.innerHTML = `<div class="set-shell" role="dialog" aria-modal="true" aria-labelledby="settingsTitle">
    <aside class="set-nav">
      <div class="set-nav-top"><button class="icon-btn small" id="settingsClose" aria-label="Close settings"><span class="for-wide">${ic('x')}</span><span class="for-phone">${ic('back')}</span></button><h2 id="settingsTitle">Settings</h2></div>
      <button class="set-me" data-open="profile"><i class="set-avatar js-initials">${initials()}</i><span><b class="js-name">${esc(prof.name)}</b><small>Free plan · kwame@example.com</small></span>${ic('chev')}</button>
      <label class="set-search">${ic('search')}<input type="search" id="setSearch" placeholder="Search settings" aria-label="Search settings"></label>
      <nav class="set-list">${groups.map((g) => `<div class="set-list-group" data-g="${g}"><h4>${g}</h4><div class="set-list-card">${PAGES.filter((p) => p.g === g).map((p) => `<button data-open="${p.id}" data-k="${esc((p.t + ' ' + p.d + ' ' + p.k).toLowerCase())}">${tile(p)}<span>${p.t}</span>${ic('chev')}</button>`).join('')}</div></div>`).join('')}<p class="set-none" hidden>No settings match that search.</p></nav>
      <button class="set-nav-foot" data-open="plan"><span>${ic('bolt')}Stamina</span><span class="set-mini"><i class="js-stbar"></i></span></button>
    </aside>
    <main class="set-body" id="settingsBody">${PAGES.map((p) => `<article class="set-page" data-page="${p.id}" aria-labelledby="sp-${p.id}">
        <header class="set-page-head"><button class="icon-btn small set-back" data-back aria-label="Back to settings">${ic('back')}</button><div><h2 id="sp-${p.id}">${p.t}</h2><p>${p.d}</p></div></header>
        <div class="set-page-body" data-body="${p.id}">${p.body()}</div></article>`).join('')}</main>
  </div>`;

  const shell = root.querySelector('.set-shell'), body = root.querySelector('#settingsBody');
  const phone = window.matchMedia('(max-width: 600px)');
  let current = null;
  function show(id) {
    if (!id && !phone.matches) id = current || 'profile';
    current = id || null;
    shell.classList.toggle('in-page', !!id);
    root.querySelectorAll('.set-page').forEach((p) => p.classList.toggle('on', p.dataset.page === id));
    root.querySelectorAll('.set-list [data-open]').forEach((b) => b.classList.toggle('active', b.dataset.open === id));
    body.scrollTop = 0;
  }
  function rerender(id) {
    const p = PAGES.find((x) => x.id === id), host = root.querySelector(`[data-body="${id}"]`);
    if (!p || !host) return;
    host.innerHTML = p.body();
    if (window.SelasiApplySettings) window.SelasiApplySettings();
    if (window.SelasiRefreshStamina) window.SelasiRefreshStamina();
  }
  function syncIdentity() {
    root.querySelectorAll('.js-initials').forEach((el) => { el.textContent = initials(); });
    root.querySelectorAll('.js-name').forEach((el) => { el.textContent = prof.name; });
  }
  function syncPrices() {
    root.querySelectorAll('.js-plan').forEach((el) => { el.textContent = price(R().plans[el.dataset.i]); });
    root.querySelectorAll('.js-pack').forEach((el) => { el.textContent = price(R().packs[el.dataset.i]); });
    const on = root.querySelector('.set-packs .on');
    const total = root.querySelector('.js-paytotal');
    const custom = parseFloat((root.querySelector('#setAmount') || {}).value);
    if (total) total.textContent = custom > 0 ? price(custom) : price(R().packs[on ? [...on.parentNode.children].indexOf(on) : 0]);
  }

  root.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open]');
    if (open) { show(open.dataset.open); return; }
    if (e.target.closest('[data-back]')) { show(null); return; }
    const sev = e.target.closest('[data-sev]');
    if (sev) { prof.bugSev = sev.dataset.sev; save(); sev.parentNode.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b === sev)); return; }
    const a = e.target.closest('[data-act]');
    if (!a) return;
    const [act, arg] = [a.dataset.act.split(':')[0], a.dataset.act.split(':').slice(1).join(':')];
    if (act === 'toast') toast(arg);
    if (act === 'photo') toast('Photo upload is not wired up in this concept build.');
    if (act === 'saveProfile') {
      prof.name = (root.querySelector('#setName').value.trim() || prof.name).slice(0, 40);
      prof.region = root.querySelector('#setRegion').value;
      save(); syncIdentity(); syncPrices(); toast('Profile saved.');
    }
    if (act === 'pack') { a.parentNode.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b === a)); const amt = root.querySelector('#setAmount'); if (amt) amt.value = ''; syncPrices(); }
    if (act === 'pay') toast(`Paystack checkout for ${root.querySelector('.js-paytotal').textContent} would open here. Not wired up in this concept build.`);
    if (act === 'promo') {
      const code = root.querySelector('#setPromo').value.trim().toUpperCase(), out = root.querySelector('#setPromoOut');
      out.className = code === 'LAUNCH50' ? 'ok' : 'bad';
      out.textContent = !code ? 'Enter a code first.' : code === 'LAUNCH50' ? 'LAUNCH50 applied: 50% extra on your next top up.' : 'That code is not valid or has expired.';
    }
    if (act === 'copy') { try { navigator.clipboard.writeText(arg); } catch (_) { /* clipboard blocked */ } toast('Copied.'); }
    if (act === 'gh') { prof.github = arg === 'on'; save(); rerender('github'); rerender('security'); toast(prof.github ? 'GitHub connected (simulated).' : 'GitHub disconnected.'); }
    if (act === 'coder') { prof.coder = arg === 'on'; save(); rerender('coder'); toast(prof.coder ? 'Selasi Coder linked (simulated).' : 'Selasi Coder unlinked.'); }
    if (act === 'bug') {
      const t = root.querySelector('#setBug');
      if (!t.value.trim()) { toast('Describe the problem first.'); t.focus(); return; }
      t.value = ''; toast(`Thanks. Your ${prof.bugSev} report was sent.`);
    }
    if (act === 'delete') toast('Account deletion is not wired up in this concept build.');
  });
  root.addEventListener('input', (e) => {
    if (e.target.id === 'setSearch') {
      const q = e.target.value.trim().toLowerCase();
      let any = false;
      root.querySelectorAll('.set-list-group').forEach((g) => {
        let n = 0;
        g.querySelectorAll('[data-k]').forEach((b) => { const hit = !q || b.dataset.k.includes(q); b.hidden = !hit; if (hit) n++; });
        g.hidden = !n; if (n) any = true;
      });
      root.querySelector('.set-none').hidden = any;
    }
    if (e.target.id === 'setDel') root.querySelector('#setDelBtn').disabled = e.target.value.trim().toUpperCase() !== 'DELETE';
    if (e.target.id === 'setAmount') { root.querySelectorAll('.set-packs button').forEach((b) => b.classList.remove('on')); syncPrices(); }
    if (e.target.id === 'setRepo') { prof.repo = e.target.value.trim(); save(); }
    if (e.target.id === 'setName') { const v = e.target.value.trim(); root.querySelectorAll('.set-hero-id .js-initials').forEach((el) => { el.textContent = v ? v.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?'; }); }
  });
  phone.addEventListener('change', () => show(phone.matches ? null : current));

  window.SelasiSettings = { show: show };
})();
