/* Selasi AI concept build: the sample prototypes that render inside the
   device frame. Apps fill the screen; sites open inside browser chrome.
   Each demo has its own layouts and working state (cart, steppers, filters,
   timer, forms). Every size is in em so one layout scales with the frame.

   Photos: add a file to assets/img/ and list it in assets/img/photos.js.
   Any slot without a photo shows a drawn tile with an icon instead. */
(function () {
  'use strict';

  const PHOTOS = window.SELASI_PHOTOS || {};
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const money = (n) => 'GH₵ ' + Number(n).toLocaleString('en');

  /* ── Icons (24px line set) ─────────────────────────────────────────── */
  const I = {
    home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.500 20a6.500 6.500 0 0 1 13 0M16 4.600a3.500 3.500 0 0 1 0 6.800M18 14.500a6.500 6.500 0 0 1 3.500 5.500"/>',
    search: '<circle cx="11" cy="11" r="6.500"/><path d="M16 16l4.500 4.500"/>',
    bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>',
    right: '<path d="M9 5l7 7-7 7"/>', left: '<path d="M15 5l-7 7 7 7"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    pin: '<path d="M12 21s7-6.200 7-11.500a7 7 0 0 0-14 0C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/>',
    cal: '<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>',
    cart: '<path d="M4 5h2l2.200 10h9.600L20 8H7"/><circle cx="9" cy="19" r="1.400"/><circle cx="17" cy="19" r="1.400"/>',
    heart: '<path d="M12 20s-7-4.400-7-10a4 4 0 0 1 7-2.600A4 4 0 0 1 19 10c0 5.600-7 10-7 10z"/>',
    star: '<path d="M12 4l2.500 5 5.500.800-4 3.900.900 5.500-4.900-2.600-4.900 2.600.900-5.500-4-3.900 5.500-.800z"/>',
    wallet: '<path d="M4 7a2 2 0 0 1 2-2h11v4"/><rect x="4" y="9" width="16" height="10" rx="2"/><path d="M16 14h.01"/>',
    flame: '<path d="M12 21a6 6 0 0 0 6-6c0-4-3-5.500-3.500-9-2 1.500-3 3.500-3 5.500C10.500 10.500 9.500 9.500 9 8c-1.800 2-3 4.300-3 7a6 6 0 0 0 6 6z"/>',
    bolt: '<path d="M13 3L5 13.500h6L10 21l8-10.500h-6z"/>',
    dumbbell: '<path d="M7 8v8M4 10v4M17 8v8M20 10v4M7 12h10"/>',
    ticket: '<path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v3a1.500 1.500 0 0 0 0 3v3a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-3a1.500 1.500 0 0 0 0-3z"/><path d="M14 7v10" stroke-dasharray="2 2.500"/>',
    music: '<path d="M9 18V6l10-2v12"/><circle cx="7" cy="18" r="2.500"/><circle cx="17" cy="16" r="2.500"/>',
    bulb: '<path d="M9 17h6M10 20.500h4M12 3.500a6 6 0 0 0-3.500 10.800V17h7v-2.700A6 6 0 0 0 12 3.500z"/>',
    palette: '<path d="M12 3.500a8.500 8.500 0 1 0 0 17c1.500 0 2-1 2-2 0-1.500 1-2 2.500-2H18a2.500 2.500 0 0 0 2.500-2.500c0-4.700-3.800-8.500-8.500-8.500z"/><circle cx="8" cy="11" r="1"/><circle cx="12" cy="8" r="1"/><circle cx="16" cy="11" r="1"/>',
    scissors: '<circle cx="6.500" cy="7" r="2.500"/><circle cx="6.500" cy="17" r="2.500"/><path d="M8.700 8.300L20 18M8.700 15.700L20 6"/>',
    utensils: '<path d="M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 1.500-3 4-3 7h3zM17 10v11"/>',
    cake: '<path d="M5 20v-7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7M3 20h18M5 15.500c2.300 1.500 4.700-1.500 7 0s4.700 1.500 7 0M12 11V7M12 4.500v.010"/>',
    cup: '<path d="M6 9h10v5a5 5 0 0 1-10 0zM16 10h1.500a2.500 2.500 0 0 1 0 5H16M5 21h12M9 3.500v2M13 3.500v2"/>',
    bike: '<circle cx="6" cy="16.500" r="3.500"/><circle cx="18" cy="16.500" r="3.500"/><path d="M6 16.500l4-8h5l3 8M10 8.500L8.500 6H6M12.500 16.500l2.500-8"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    send: '<path d="M21 3L10.500 13.500M21 3l-6.500 18-4-7.500L3 9.500z"/>',
    shield: '<path d="M12 3l7 3v6c0 4.500-3 7.500-7 9-4-1.500-7-4.500-7-9V6z"/>',
    card: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10.500h18"/>',
    box: '<path d="M4 8l8-4 8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8"/>',
    target: '<circle cx="12" cy="12" r="8.500"/><circle cx="12" cy="12" r="4.500"/><circle cx="12" cy="12" r="1"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5zM3 13l9 5 9-5"/>',
    spark: '<path d="M12 3l1.900 5.100L19 10l-5.100 1.900L12 17l-1.900-5.100L5 10l5.100-1.900z"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 21a2 2 0 0 1 2-2h13"/>',
    moon: '<path d="M20 14.500A8 8 0 0 1 9.500 4a8 8 0 1 0 10.500 10.500z"/>',
    play: '<path d="M8 5l11 7-11 7z"/>', pause: '<path d="M8 5v14M16 5v14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone: '<rect x="7" y="2.500" width="10" height="19" rx="2.500"/><path d="M11 18.500h2"/>'
  };
  const ic = (n, cls) => `<svg class="p-ic${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;
  /* A photo slot: shows the photo when one is registered, a drawn tile otherwise. */
  const ph = (key, icon, cls) => PHOTOS[key]
    ? `<i class="ph has-photo ${cls || ''}" style="background-image:url('assets/img/${PHOTOS[key]}')"></i>`
    : `<i class="ph ${cls || ''}">${ic(icon)}</i>`;
  const tick = ic('check');

  /* ── Shared app screens ────────────────────────────────────────────── */
  const tabBar = (on, tabs) => `<div class="p-tabs">${tabs.map((t) => `<button data-go="${t[0]}"${t[0] === on ? ' class="on"' : ''}>${ic(t[2])}${t[1]}</button>`).join('')}</div>`;
  const back = (to) => `<button class="p-back" data-go="${to}">${ic('left')}Back</button>`;
  const stepper = (name, val) => `<div class="p-step"><button data-act="dec:${name}" aria-label="Less">${ic('minus')}</button><b>${esc(val)}</b><button data-act="inc:${name}" aria-label="More">${ic('plus')}</button></div>`;

  function welcome(d) {
    return `<div class="p-center">
      <div class="p-logo">${ic(d.icon)}</div>
      <h1>${esc(d.name)}</h1><p>${esc(d.tagline)}</p>
      <button class="p-btn" data-go="signin">Get started</button>
      <button class="p-link" data-go="signin">I already have an account</button>
    </div>`;
  }
  function signin() {
    return `<div class="p-pad">${back('welcome')}
      <div class="p-head"><h2>Welcome back</h2><small>Enter your phone number to continue.</small></div>
      <label class="p-field"><small>Phone number</small><input type="tel" inputmode="numeric" placeholder="024 000 0000"></label>
      <label class="p-field"><small>One-time code</small><input type="text" inputmode="numeric" placeholder="4-digit code" maxlength="4"></label>
      <span class="p-grow"></span>
      <button class="p-btn" data-go="home">Continue</button>
    </div>`;
  }
  function doneScreen(title, sub, extra) {
    return `<div class="p-center"><div class="p-check">${tick}</div><h1>${esc(title)}</h1><p>${esc(sub)}</p>${extra || ''}
      <button class="p-btn" data-go="home">Back to home</button><button class="p-link" data-go="activity">See activity</button></div>`;
  }
  function profile(d, tabs) {
    const rows = [['bell', 'Notifications'], ['card', 'Payment methods'], ['shield', 'Privacy'], ['bulb', 'Help']];
    return `<div class="p-pad"><div class="p-profile"><div class="p-avatar big">K</div><h2>Kwame</h2><small>Member since 2026</small></div>
      <div class="p-rows">${rows.map((r) => `<div><span class="with-ic">${ic(r[0])}${r[1]}</span>${ic('right', 'dim')}</div>`).join('')}</div>
      <span class="p-grow"></span><button class="p-link" data-go="welcome">Sign out</button></div>${tabBar('profile', tabs)}`;
  }
  const TABS = [['home', 'Home', 'home'], ['activity', 'Activity', 'list'], ['profile', 'Profile', 'user']];
  const appScreens = (home, mid, last) => [
    { key: 'welcome', name: 'Welcome', desc: 'Intro and get started' },
    { key: 'signin', name: 'Sign in', desc: 'Phone number and code' },
    home].concat(mid, [
    { key: 'done', name: 'Confirmation', desc: 'Success state' },
    last || { key: 'activity', name: 'Activity', desc: 'Recent history' },
    { key: 'profile', name: 'Profile', desc: 'Account and preferences' }]);

  /* ── Apps ──────────────────────────────────────────────────────────── */
  const APPS = {};

  /* Savings circle: balance chart, circle progress, turn order, amount stepper */
  APPS.susu = {
    key: 'susu', kind: 'app', name: 'SusuCircle', icon: 'users', mark: 'S', accent: '#1f8a5b',
    prompt: 'A savings circle app where friends pool money every week and take turns receiving the pot.',
    tagline: 'Save together. Reach it sooner.',
    screens: appScreens({ key: 'home', name: 'Circles', desc: 'Balance, chart and circles' },
      [{ key: 'detail', name: 'Circle detail', desc: 'Pot progress and turn order' }, { key: 'pay', name: 'Contribute', desc: 'Amount stepper and confirm' }]),
    taps: ['Get started', 'Continue', 'Tap a circle', 'Contribute', 'Confirm', 'Tab bar', 'Tab bar'],
    init: () => ({ amt: 50 }),
    act(st, a, arg) { if (a === 'inc') st.amt = Math.min(500, st.amt + 10); if (a === 'dec') st.amt = Math.max(10, st.amt - 10); if (a === 'set') st.amt = Number(arg); },
    circles: [['Makola Traders', '8 members · weekly', 2400, 6, 8], ['Hall 7 Roommates', '5 members · monthly', 1250, 3, 5], ['Family Fund', '6 members · monthly', 2500, 6, 6]],
    render(key, st) {
      const d = this;
      if (key === 'home') return `<div class="p-pad">
          <div class="p-top"><div><small>Good to see you</small><h2>Your circles</h2></div><button class="p-avatar" data-go="profile">K</button></div>
          <div class="p-summary"><small>Saved this year</small><b>${money(6150)}</b>
            <div class="p-bars">${[38, 52, 44, 70, 62, 88].map((h, i) => `<i style="height:${h}%"${i === 5 ? ' class="on"' : ''}></i>`).join('')}</div></div>
          <div class="p-list">${d.circles.map((c) => `<button class="p-item col" data-go="detail">
            <span class="p-item-row"><span class="p-dot">${ic('users')}</span><span class="p-item-text"><b>${c[0]}</b><small>${c[1]}</small></span><span class="p-item-val">${money(c[2])}</span></span>
            <span class="p-prog"><i style="width:${Math.round(c[3] / c[4] * 100)}%"></i></span><small class="p-cap">${c[3]} of ${c[4]} paid in this round</small></button>`).join('')}</div>
        </div>${tabBar('home', TABS)}`;
      if (key === 'detail') return `<div class="p-pad">${back('home')}
          <div class="p-hero"><div class="p-ring" style="--pct:75"><b>6/8</b></div><small>Pot this round</small><b class="big">${money(2400)}</b><span>Makola Traders</span></div>
          <div class="p-head"><h3>Turn order</h3></div>
          <div class="p-timeline">${[['Efua', 'Received · round 3', 'ok'], ['Yaw', 'Received · round 4', 'ok'], ['Ama', 'Next payout · Friday', 'next'], ['You', 'Round 6', '']].map((t) => `<div class="${t[2]}"><i>${t[2] === 'ok' ? tick : ''}</i><b>${t[0]}</b><small>${t[1]}</small></div>`).join('')}</div>
          <span class="p-grow"></span><button class="p-btn" data-go="pay">Contribute</button></div>`;
      if (key === 'pay') return `<div class="p-pad">${back('detail')}
          <div class="p-head"><h2>Contribute</h2><small>How much this week?</small></div>
          <div class="p-amount">${stepper('amt', money(st.amt))}</div>
          <div class="p-options">${[20, 50, 100].map((v) => `<button data-act="set:${v}"${st.amt === v ? ' class="on"' : ''}>${money(v)}</button>`).join('')}</div>
          <div class="p-rows"><div><span>Circle</span><b>Makola Traders</b></div><div><span>Method</span><b>Mobile money</b></div><div><span>Total</span><b>${money(st.amt)}</b></div></div>
          <span class="p-grow"></span><button class="p-btn" data-go="done">Contribute ${money(st.amt)}</button></div>`;
      if (key === 'done') return doneScreen('Contribution sent', `${money(st.amt)} added to Makola Traders. Ama receives the pot on Friday.`);
      if (key === 'activity') return `<div class="p-pad"><div class="p-head"><h2>Activity</h2><small>Your recent history</small></div>
          <div class="p-rows">${[['Contribution', 'Makola Traders · today', '− ' + money(st.amt)], ['Payout received', 'Family Fund · 2 Nov', '+ ' + money(2500)], ['Contribution', 'Hall 7 Roommates · 1 Nov', '− ' + money(250)]].map((a) => `<div class="tall"><span><b>${a[0]}</b><small>${a[1]}</small></span><b>${a[2]}</b></div>`).join('')}</div></div>${tabBar('activity', TABS)}`;
      return null;
    }
  };

  /* Food pre-order: category filter, photo grid, quantity, working cart */
  const MEALS = [
    { id: 'jollof', n: 'Jollof and grilled chicken', k: 'Night Market', t: 12, p: 45, c: 'Rice', icon: 'utensils' },
    { id: 'waakye', n: 'Waakye special', k: 'Bush Canteen', t: 8, p: 35, c: 'Rice', icon: 'utensils' },
    { id: 'banku', n: 'Banku and tilapia', k: 'Central Cafeteria', t: 20, p: 60, c: 'Local', icon: 'flame' },
    { id: 'kelewele', n: 'Kelewele and groundnuts', k: 'Night Market', t: 5, p: 15, c: 'Snacks', icon: 'spark' },
    { id: 'fufu', n: 'Fufu and light soup', k: 'Central Cafeteria', t: 18, p: 50, c: 'Local', icon: 'cup' },
    { id: 'sobolo', n: 'Chilled sobolo', k: 'Bush Canteen', t: 2, p: 10, c: 'Snacks', icon: 'cup' }
  ];
  const FOOD_TABS = [['home', 'Menu', 'utensils'], ['cart', 'Cart', 'cart'], ['activity', 'Orders', 'list'], ['profile', 'Profile', 'user']];
  APPS.food = {
    key: 'food', kind: 'app', name: 'QuickChop', icon: 'utensils', mark: 'Q', accent: '#e2622f',
    prompt: 'A campus food pre-order app so students can order ahead and skip the lunch queue.',
    tagline: 'Order ahead. Skip the queue.',
    screens: appScreens({ key: 'home', name: 'Menu', desc: 'Filter and photo grid' },
      [{ key: 'detail', name: 'Meal detail', desc: 'Photo, quantity, add to cart' }, { key: 'cart', name: 'Cart', desc: 'Items, totals, pickup time' }],
      { key: 'activity', name: 'Orders', desc: 'Past orders' }),
    taps: ['Get started', 'Continue', 'Tap a meal', 'Add to cart', 'Place order', 'Tab bar', 'Tab bar'],
    init: () => ({ cat: 'All', cart: {}, sel: 'jollof', qty: 1, slot: '12:30' }),
    act(st, a, arg, api) {
      if (a === 'cat') st.cat = arg;
      if (a === 'open') { st.sel = arg; st.qty = 1; api.go('detail'); }
      if (a === 'inc' && arg === 'qty') st.qty = Math.min(9, st.qty + 1);
      if (a === 'dec' && arg === 'qty') st.qty = Math.max(1, st.qty - 1);
      if (a === 'quick') st.cart[arg] = (st.cart[arg] || 0) + 1;
      if (a === 'add') { st.cart[st.sel] = (st.cart[st.sel] || 0) + st.qty; api.go('cart'); }
      if (a === 'inc' && st.cart[arg]) st.cart[arg] += 1;
      if (a === 'dec' && st.cart[arg]) { st.cart[arg] -= 1; if (!st.cart[arg]) delete st.cart[arg]; }
      if (a === 'slot') st.slot = arg;
      if (a === 'order') { st.last = this.total(st); st.cart = {}; api.go('done'); }
    },
    count: (st) => Object.values(st.cart).reduce((a, b) => a + b, 0),
    total: (st) => Object.keys(st.cart).reduce((a, id) => a + MEALS.find((m) => m.id === id).p * st.cart[id], 0),
    render(key, st) {
      const n = this.count(st), m = MEALS.find((x) => x.id === st.sel);
      if (key === 'home') {
        const list = MEALS.filter((x) => st.cat === 'All' || x.c === st.cat);
        return `<div class="p-pad">
          <div class="p-top"><div><small>Pickup at ${st.slot}</small><h2>Ready near you</h2></div><button class="p-avatar cartbtn" data-go="cart">${ic('cart')}${n ? `<em>${n}</em>` : ''}</button></div>
          <div class="p-chips">${['All', 'Rice', 'Local', 'Snacks'].map((c) => `<button data-act="cat:${c}"${st.cat === c ? ' class="on"' : ''}>${c}</button>`).join('')}</div>
          <div class="p-grid">${list.map((x) => `<div class="p-card"><button class="p-card-hit" data-act="open:${x.id}" aria-label="${esc(x.n)}">${ph('food-' + x.id, x.icon)}</button>
            <b>${esc(x.n)}</b><small>${esc(x.k)} · ${x.t} min</small><span class="p-card-foot"><b>${money(x.p)}</b><button class="p-add" data-act="quick:${x.id}" aria-label="Add">${ic('plus')}</button></span></div>`).join('')}</div>
        </div>${tabBar('home', FOOD_TABS)}`;
      }
      if (key === 'detail') return `<div class="p-flush">${ph('food-' + m.id, m.icon, 'banner')}<div class="p-pad">
          ${back('home')}<div class="p-head"><h2>${esc(m.n)}</h2><small>${esc(m.k)} · ready in about ${m.t} minutes</small></div>
          <div class="p-rows"><div><span class="with-ic">${ic('clock')}Ready in</span><b>${m.t} min</b></div><div><span class="with-ic">${ic('pin')}Pickup</span><b>Counter 3</b></div></div>
          <div class="p-between"><b>Quantity</b>${stepper('qty', st.qty)}</div>
          <span class="p-grow"></span><button class="p-btn" data-act="add">Add to cart · ${money(m.p * st.qty)}</button></div></div>`;
      if (key === 'cart') {
        const ids = Object.keys(st.cart), sub = this.total(st);
        if (!ids.length) return `<div class="p-center"><div class="p-check soft">${ic('cart')}</div><h1>Your cart is empty</h1><p>Add a meal from the menu to get started.</p><button class="p-btn" data-go="home">Browse the menu</button></div>${tabBar('cart', FOOD_TABS)}`;
        return `<div class="p-pad"><div class="p-head"><h2>Your cart</h2><small>${n} ${n === 1 ? 'item' : 'items'}</small></div>
          <div class="p-rows">${ids.map((id) => { const x = MEALS.find((y) => y.id === id); return `<div class="tall"><span><b>${esc(x.n)}</b><small>${money(x.p)} each</small></span>${stepper(id, st.cart[id])}</div>`; }).join('')}</div>
          <div class="p-head"><h3>Pickup time</h3></div>
          <div class="p-options">${['12:30', '1:00', '1:30'].map((s) => `<button data-act="slot:${s}"${st.slot === s ? ' class="on"' : ''}>${s}</button>`).join('')}</div>
          <div class="p-rows"><div><span>Subtotal</span><b>${money(sub)}</b></div><div><span>Service fee</span><b>${money(2)}</b></div><div><span>Total</span><b>${money(sub + 2)}</b></div></div>
          <span class="p-grow"></span><button class="p-btn" data-act="order">Place order · ${money(sub + 2)}</button></div>${tabBar('cart', FOOD_TABS)}`;
      }
      if (key === 'done') return doneScreen('Order placed', `Pick it up at Counter 3 at ${st.slot}. Total paid ${money((st.last || 45) + 2)}.`);
      if (key === 'activity') return `<div class="p-pad"><div class="p-head"><h2>Orders</h2><small>Your recent orders</small></div>
          <div class="p-rows">${[['Jollof and grilled chicken', 'Night Market · today', 45], ['Waakye special', 'Bush Canteen · Monday', 35], ['Banku and tilapia', 'Central Cafeteria · last week', 60]].map((a) => `<div class="tall"><span><b>${a[0]}</b><small>${a[1]}</small></span><b>${money(a[2])}</b></div>`).join('')}</div></div>${tabBar('activity', FOOD_TABS)}`;
      if (key === 'profile') return profile(this, FOOD_TABS);
      return null;
    }
  };

  /* Events: day filter, featured card, ticket types, ticket stub */
  const EVENTS = [
    { id: 'afro', n: 'Afrobeats Night', d: 'Sat', when: 'Saturday, 9:00 pm', w: 'Osu, Oxford Street', p: 80, icon: 'music', h: 'Night Shift Live' },
    { id: 'tech', n: 'Tech Meetup Accra', d: 'Thu', when: 'Thursday, 6:00 pm', w: 'Airport Residential', p: 0, icon: 'bulb', h: 'Accra Devs' },
    { id: 'art', n: 'Sunday Art Market', d: 'Sun', when: 'Sunday, 11:00 am', w: 'Labone', p: 20, icon: 'palette', h: 'Studio Collective' },
    { id: 'run', n: 'Sunrise 5K Run', d: 'Sat', when: 'Saturday, 6:00 am', w: 'Legon Botanical', p: 30, icon: 'flame', h: 'Run Club' }
  ];
  const EV_TABS = [['home', 'Explore', 'search'], ['activity', 'Tickets', 'ticket'], ['profile', 'Profile', 'user']];
  APPS.events = {
    key: 'events', kind: 'app', name: 'Gather', icon: 'ticket', mark: 'G', accent: '#c2255c',
    prompt: 'An events app where people discover local events and buy tickets.',
    tagline: 'Find what is on. Be there.',
    screens: appScreens({ key: 'home', name: 'Explore', desc: 'Day filter and featured event' },
      [{ key: 'detail', name: 'Event detail', desc: 'Photo, time, place' }, { key: 'pay', name: 'Tickets', desc: 'Type, quantity, total' }],
      { key: 'activity', name: 'My tickets', desc: 'Ticket wallet' }),
    taps: ['Get started', 'Continue', 'Tap an event', 'Get tickets', 'Pay now', 'Tab bar', 'Tab bar'],
    init: () => ({ day: 'All', sel: 'afro', qty: 2, type: 'Regular' }),
    act(st, a, arg, api) {
      if (a === 'day') st.day = arg;
      if (a === 'open') { st.sel = arg; api.go('detail'); }
      if (a === 'inc') st.qty = Math.min(8, st.qty + 1);
      if (a === 'dec') st.qty = Math.max(1, st.qty - 1);
      if (a === 'type') st.type = arg;
    },
    price(st) { const e = EVENTS.find((x) => x.id === st.sel); return (e.p + (st.type === 'VIP' ? 60 : 0)) * st.qty; },
    stub(st) { const e = EVENTS.find((x) => x.id === st.sel); return `<div class="p-ticket"><div><small>${esc(st.type)} · ${st.qty} ${st.qty === 1 ? 'ticket' : 'tickets'}</small><b>${esc(e.n)}</b><small>${esc(e.when)}</small><small>${esc(e.w)}</small></div><i class="p-barcode"></i></div>`; },
    render(key, st) {
      const e = EVENTS.find((x) => x.id === st.sel);
      if (key === 'home') {
        const list = EVENTS.filter((x) => st.day === 'All' || x.d === st.day), f = list[0];
        return `<div class="p-pad">
          <div class="p-top"><div><small>Accra</small><h2>On this week</h2></div><button class="p-avatar" data-go="profile">K</button></div>
          <div class="p-chips">${['All', 'Thu', 'Sat', 'Sun'].map((c) => `<button data-act="day:${c}"${st.day === c ? ' class="on"' : ''}>${c}</button>`).join('')}</div>
          ${f ? `<button class="p-feature" data-act="open:${f.id}">${ph('event-' + f.id, f.icon)}<span><small>${esc(f.when)}</small><b>${esc(f.n)}</b><em>${f.p ? money(f.p) : 'Free'}</em></span></button>` : ''}
          <div class="p-list">${list.slice(1).map((x) => `<button class="p-item" data-act="open:${x.id}"><span class="p-dot">${ic(x.icon)}</span><span class="p-item-text"><b>${esc(x.n)}</b><small>${esc(x.when)}</small></span><span class="p-item-val">${x.p ? money(x.p) : 'Free'}</span></button>`).join('')}</div>
        </div>${tabBar('home', EV_TABS)}`;
      }
      if (key === 'detail') return `<div class="p-flush">${ph('event-' + e.id, e.icon, 'banner')}<div class="p-pad">${back('home')}
          <div class="p-head"><h2>${esc(e.n)}</h2><small>Hosted by ${esc(e.h)}</small></div>
          <div class="p-rows"><div><span class="with-ic">${ic('cal')}When</span><b>${esc(e.when)}</b></div><div><span class="with-ic">${ic('pin')}Where</span><b>${esc(e.w)}</b></div></div>
          <p class="p-text">Doors open an hour before. Tickets are sent to your wallet and scanned at the gate.</p>
          <span class="p-grow"></span><button class="p-btn" data-go="pay">Get tickets · ${e.p ? 'from ' + money(e.p) : 'Free'}</button></div></div>`;
      if (key === 'pay') return `<div class="p-pad">${back('detail')}
          <div class="p-head"><h2>Tickets</h2><small>${esc(e.n)}</small></div>
          <div class="p-options two">${['Regular', 'VIP'].map((t) => `<button data-act="type:${t}"${st.type === t ? ' class="on"' : ''}>${t}<small>${money(e.p + (t === 'VIP' ? 60 : 0))}</small></button>`).join('')}</div>
          <div class="p-between"><b>How many?</b>${stepper('qty', st.qty)}</div>
          <div class="p-rows"><div><span>Method</span><b>Mobile money</b></div><div><span>Total</span><b>${money(this.price(st))}</b></div></div>
          <span class="p-grow"></span><button class="p-btn" data-go="done">Pay ${money(this.price(st))}</button></div>`;
      if (key === 'done') return `<div class="p-center"><div class="p-check">${tick}</div><h1>Tickets booked</h1><p>They are in your wallet. Show this at the gate.</p>${this.stub(st)}<button class="p-btn" data-go="home">Back to explore</button></div>`;
      if (key === 'activity') return `<div class="p-pad"><div class="p-head"><h2>My tickets</h2><small>Upcoming</small></div>${this.stub(st)}</div>${tabBar('activity', EV_TABS)}`;
      if (key === 'profile') return profile(this, EV_TABS);
      return null;
    }
  };

  /* Workout planner: progress rings, checklist, working timer */
  const MOVES = ['Bench press', 'Overhead press', 'Incline dumbbell press', 'Lateral raise', 'Tricep dip', 'Push-up finisher'];
  const GYM_TABS = [['home', 'Plan', 'dumbbell'], ['activity', 'Progress', 'chart'], ['profile', 'Profile', 'user']];
  const mmss = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  APPS.gym = {
    key: 'gym', kind: 'app', name: 'Stride', icon: 'dumbbell', mark: 'S', accent: '#0c8599',
    prompt: 'A workout planner app that builds a weekly gym routine and tracks progress.',
    tagline: 'A plan you will actually follow.',
    screens: appScreens({ key: 'home', name: 'Plan', desc: 'Rings, week strip, today' },
      [{ key: 'detail', name: 'Workout', desc: 'Checklist of moves' }, { key: 'timer', name: 'Session', desc: 'Working rest timer' }],
      { key: 'activity', name: 'Progress', desc: 'Weekly chart' }),
    taps: ['Get started', 'Continue', "Today's workout", 'Start workout', 'Finish', 'Tab bar', 'Tab bar'],
    init: () => ({ done: [true, true, false, false, false, false], left: 45, running: false, move: 2 }),
    act(st, a, arg) {
      if (a === 'check') st.done[Number(arg)] = !st.done[Number(arg)];
      if (a === 'toggle') st.running = !st.running;
      if (a === 'next') { st.done[st.move] = true; st.move = Math.min(MOVES.length - 1, st.move + 1); st.left = 45; st.running = false; }
    },
    tick(st) { if (!st.running) return false; st.left -= 1; if (st.left <= 0) { st.left = 0; st.running = false; } return true; },
    render(key, st) {
      const n = st.done.filter(Boolean).length;
      if (key === 'home') return `<div class="p-pad">
          <div class="p-top"><div><small>Monday</small><h2>Your plan</h2></div><button class="p-avatar" data-go="profile">K</button></div>
          <div class="p-rings">${[['Moves', Math.round(n / 6 * 100), n + '/6'], ['Minutes', 60, '27'], ['Streak', 86, '12 d']].map((r) => `<div><div class="p-ring" style="--pct:${r[1]}"><b>${r[2]}</b></div><small>${r[0]}</small></div>`).join('')}</div>
          <div class="p-week">${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => `<span class="${i === 0 ? 'on' : ''}${i > 4 ? ' rest' : ''}">${d}<i></i></span>`).join('')}</div>
          <button class="p-feature flat" data-go="detail">${ph('gym-push', 'dumbbell')}<span><small>Today · 45 min</small><b>Push day</b><em>${n} of 6 done</em></span></button>
          <div class="p-list">${[['Leg day', 'Wed · 50 min · 7 moves'], ['Core and cardio', 'Fri · 30 min · 5 moves']].map((x) => `<button class="p-item" data-go="detail"><span class="p-dot">${ic('bolt')}</span><span class="p-item-text"><b>${x[0]}</b><small>${x[1]}</small></span>${ic('right', 'dim')}</button>`).join('')}</div>
        </div>${tabBar('home', GYM_TABS)}`;
      if (key === 'detail') return `<div class="p-pad">${back('home')}
          <div class="p-head"><h2>Push day</h2><small>Chest and shoulders · ${n} of 6 done</small></div>
          <span class="p-prog"><i style="width:${Math.round(n / 6 * 100)}%"></i></span>
          <div class="p-rows">${MOVES.map((m, i) => `<button class="p-checkrow${st.done[i] ? ' on' : ''}" data-act="check:${i}"><i>${st.done[i] ? tick : ''}</i><span><b>${m}</b><small>3 sets × 10</small></span></button>`).join('')}</div>
          <span class="p-grow"></span><button class="p-btn" data-go="timer">Start workout</button></div>`;
      if (key === 'timer') return `<div class="p-pad">${back('detail')}
          <div class="p-head center"><small>Move ${st.move + 1} of 6</small><h2>${MOVES[st.move]}</h2></div>
          <div class="p-timer" data-timer-ring style="--pct:${Math.round(st.left / 45 * 100)}"><b data-timer>${mmss(st.left)}</b><small>Rest</small></div>
          <div class="p-between gap"><button class="p-round" data-act="toggle" aria-label="Start or pause">${ic(st.running ? 'pause' : 'play')}</button><button class="p-ghost" data-act="next">Next move ${ic('right')}</button></div>
          <span class="p-grow"></span><button class="p-btn" data-go="done">Finish workout</button></div>`;
      if (key === 'done') return doneScreen('Workout logged', `Push day done, ${n} of 6 moves ticked. Your streak is now 13 days.`);
      if (key === 'activity') return `<div class="p-pad"><div class="p-head"><h2>Progress</h2><small>Minutes this week</small></div>
          <div class="p-chart">${[['M', 45], ['T', 0], ['W', 50], ['T', 20], ['F', 30], ['S', 0], ['S', 0]].map((b) => `<div><i style="height:${b[1] * 1.6}%"></i><small>${b[0]}</small></div>`).join('')}</div>
          <div class="p-rows"><div><span>Total</span><b>145 min</b></div><div><span>Workouts</span><b>4 of 5</b></div><div><span>Best streak</span><b>12 days</b></div></div></div>${tabBar('activity', GYM_TABS)}`;
      if (key === 'profile') return profile(this, GYM_TABS);
      return null;
    }
  };

  /* Study planner and the generic fallback: searchable list template */
  function listApp(d) {
    return Object.assign(d, {
      kind: 'app',
      screens: appScreens({ key: 'home', name: d.homeName, desc: 'Searchable list' },
        [{ key: 'detail', name: d.detailName, desc: 'Details and main action' }, { key: 'pay', name: d.payName, desc: 'Options and confirm' }]),
      taps: ['Get started', 'Continue', 'Tap an item', d.cta, 'Confirm', 'Tab bar', 'Tab bar'],
      init: () => ({ sel: 0, opt: 0 }),
      act(st, a, arg, api) { if (a === 'open') { st.sel = Number(arg); api.go('detail'); } if (a === 'opt') st.opt = Number(arg); },
      render(key, st) {
        const it = d.items[st.sel];
        if (key === 'home') return `<div class="p-pad">
            <div class="p-top"><div><small>Good to see you</small><h2>${esc(d.listTitle)}</h2></div><button class="p-avatar" data-go="profile">K</button></div>
            <label class="p-search">${ic('search')}<input type="search" placeholder="Search" data-filter></label>
            <div class="p-summary slim"><small>${esc(d.summaryLabel)}</small><b>${esc(d.summaryValue)}</b></div>
            <div class="p-list">${d.items.map((x, i) => `<button class="p-item" data-act="open:${i}" data-name="${esc(x.t.toLowerCase())}"><span class="p-dot">${ic(x.icon || d.icon)}</span><span class="p-item-text"><b>${esc(x.t)}</b><small>${esc(x.s)}</small></span><span class="p-item-val">${esc(x.v)}</span></button>`).join('')}</div>
            <p class="p-none" hidden>Nothing matches that search.</p>
          </div>${tabBar('home', TABS)}`;
        if (key === 'detail') return `<div class="p-pad">${back('home')}
            <div class="p-hero"><small>${esc(d.statLabel)}</small><b class="big">${esc(it.v)}</b><span>${esc(it.t)}</span></div>
            <div class="p-rows">${d.rows.map((r) => `<div><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join('')}</div>
            <span class="p-grow"></span><button class="p-btn" data-go="pay">${esc(d.cta)}</button></div>`;
        if (key === 'pay') return `<div class="p-pad">${back('detail')}
            <div class="p-head"><h2>${esc(d.payName)}</h2><small>${esc(d.payLabel)}</small></div>
            <div class="p-options">${d.options.map((o, i) => `<button data-act="opt:${i}"${st.opt === i ? ' class="on"' : ''}>${esc(o)}</button>`).join('')}</div>
            <div class="p-rows"><div><span>${esc(it.t)}</span><b>${esc(it.v)}</b></div><div><span>Choice</span><b>${esc(d.options[st.opt])}</b></div></div>
            <span class="p-grow"></span><button class="p-btn" data-go="done">Confirm</button></div>`;
        if (key === 'done') return doneScreen(d.doneTitle, `${it.t}. ${d.doneSub}`);
        if (key === 'activity') return `<div class="p-pad"><div class="p-head"><h2>Activity</h2><small>Your recent history</small></div>
            <div class="p-rows">${d.items.map((x) => `<div class="tall"><span><b>${esc(x.t)}</b><small>${esc(x.s)}</small></span><b>${esc(x.v)}</b></div>`).join('')}</div></div>${tabBar('activity', TABS)}`;
        return null;
      }
    });
  }
  APPS.study = listApp({
    key: 'study', name: 'StudyLoop', icon: 'book', mark: 'L', accent: '#5b63d6',
    prompt: 'A study group planner that matches students revising the same course.',
    tagline: 'Find your people. Revise together.',
    homeName: 'Sessions', detailName: 'Session detail', payName: 'Join', listTitle: 'Sessions this week',
    summaryLabel: 'Hours revised', summaryValue: '14 h', statLabel: 'Going', cta: 'Join session',
    items: [{ t: 'Calculus II past questions', s: 'Tue 4 pm · Library L2', v: '5 going' }, { t: 'Data Structures revision', s: 'Wed 6 pm · Lab 4', v: '8 going', icon: 'layers' }, { t: 'Thermodynamics problem set', s: 'Fri 2 pm · Room B12', v: '3 going', icon: 'flame' }, { t: 'Organic Chemistry quiz prep', s: 'Sat 10 am · Online', v: '6 going', icon: 'target' }],
    rows: [['When', 'This week'], ['Where', 'See the session card'], ['Host', 'Kojo A.']],
    payLabel: 'How will you take part?', options: ['In person', 'Online', 'Just notes'],
    doneTitle: "You're in", doneSub: 'We will remind you an hour before.'
  });
  APPS.generic = listApp({
    key: 'generic', name: 'Your concept', icon: 'spark', mark: 'C', accent: '#ff7a59',
    prompt: '', tagline: 'Your idea, on a real screen.',
    homeName: 'Home', detailName: 'Detail', payName: 'Action', listTitle: 'Main list',
    summaryLabel: 'Key number', summaryValue: '128', statLabel: 'Headline figure', cta: 'Main action',
    items: [{ t: 'First item', s: 'Supporting detail', v: 'Value' }, { t: 'Second item', s: 'Supporting detail', v: 'Value' }, { t: 'Third item', s: 'Supporting detail', v: 'Value' }],
    rows: [['Detail one', 'Value'], ['Detail two', 'Value'], ['Detail three', 'Value']],
    payLabel: 'Choose an option', options: ['Option A', 'Option B', 'Option C'],
    doneTitle: 'Done', doneSub: 'This is the success state for your main action.'
  });
  Object.values(APPS).forEach((d) => {
    const own = d.render;
    d.render = function (key, st) {
      if (key === 'welcome') return welcome(d);
      if (key === 'signin') return signin(d);
      return own.call(d, key, st) || profile(d, TABS);
    };
  });

  /* ── Sites ─────────────────────────────────────────────────────────── */
  const SITES = {};
  const siteNav = (d, key, links) => `<nav class="s-nav"><button class="s-brand" data-go="home"><i>${esc(d.mark)}</i>${esc(d.name)}</button>
    <span class="s-links">${links.map((l) => `<button data-go="${l[0]}"${l[0] === key ? ' class="on"' : ''}>${esc(l[1])}</button>`).join('')}<button class="s-cta" data-go="${d.ctaGo}">${esc(d.cta)}</button></span></nav>`;
  const siteFoot = (d) => `<footer class="s-foot"><b>${esc(d.name)}</b><span>Made with Selasi AI. Concept preview.</span></footer>`;
  const field = (label, type) => `<label class="p-field"><small>${esc(label)}</small>${type === 'area' ? '<textarea rows="3" placeholder="Type here"></textarea>' : `<input type="${type || 'text'}" placeholder="Type here">`}</label>`;
  const sent = (title, sub) => `<section class="s-sec narrow s-sent"><div class="p-check">${tick}</div><h1>${esc(title)}</h1><p>${esc(sub)}</p><button class="p-btn" data-go="home">Back to home</button></section>`;

  /* Bakery (and the generic site): hero, benefits, filterable product grid, order form */
  function shopSite(d) {
    const links = [['menu', d.listName], ['story', d.story[0]]];
    return Object.assign(d, {
      kind: 'site', ctaGo: 'order',
      screens: [{ key: 'home', name: 'Home', desc: 'Hero, benefits, featured' }, { key: 'menu', name: d.listName, desc: 'Filterable grid' }, { key: 'story', name: d.story[0], desc: 'Who is behind it' }, { key: 'order', name: d.orderTitle, desc: 'Form with a picked item' }, { key: 'sent', name: 'Confirmation', desc: 'Form sent' }],
      taps: [d.listName + ' link', d.story[0] + ' link', d.cta, d.orderCta],
      init: () => ({ cat: 'All', pick: d.products[2][0] }),
      act(st, a, arg, api) { if (a === 'cat') st.cat = arg; if (a === 'pick') { st.pick = arg; api.go('order'); } },
      render(key, st) {
        const card = (p) => `<button class="s-card" data-act="pick:${esc(p[0])}">${ph(d.key + '-' + p[0].toLowerCase().replace(/[^a-z]+/g, '-'), p[3])}<b>${esc(p[0])}</b><small>${esc(p[1])}</small></button>`;
        let body;
        if (key === 'home') body = `<section class="s-hero"><div><span class="s-tag">${esc(d.tag)}</span><h1>${esc(d.heroTitle)}</h1><p>${esc(d.heroSub)}</p>
              <div class="s-row"><button class="p-btn" data-go="order">${esc(d.cta)}</button><button class="s-ghost" data-go="menu">See the ${esc(d.listName.toLowerCase())}</button></div></div>${ph(d.key + '-hero', d.icon, 'hero')}</section>
            <section class="s-points">${d.points.map((p) => `<div><i>${ic(p[0])}</i><b>${esc(p[1])}</b><small>${esc(p[2])}</small></div>`).join('')}</section>
            <section class="s-sec"><h2>${esc(d.featured)}</h2><div class="s-grid">${d.products.slice(0, 3).map(card).join('')}</div></section>
            <section class="s-quote"><p>“${esc(d.quote[0])}”</p><small>${esc(d.quote[1])}</small></section>`;
        else if (key === 'menu') { const cats = ['All'].concat(d.cats); body = `<section class="s-sec"><h1>${esc(d.listName)}</h1><div class="p-chips">${cats.map((c) => `<button data-act="cat:${c}"${st.cat === c ? ' class="on"' : ''}>${c}</button>`).join('')}</div>
            <div class="s-grid">${d.products.filter((p) => st.cat === 'All' || p[2] === st.cat).map(card).join('')}</div></section>`; }
        else if (key === 'story') body = `<section class="s-sec narrow"><h1>${esc(d.story[0])}</h1>${ph(d.key + '-story', d.icon, 'hero wide')}<p>${esc(d.story[1])}</p><p>${esc(d.story[2])}</p><button class="p-btn" data-go="order">${esc(d.cta)}</button></section>`;
        else if (key === 'order') body = `<section class="s-sec narrow"><h1>${esc(d.orderTitle)}</h1><div class="s-picked">${ic(d.icon)}<span><small>You picked</small><b>${esc(st.pick)}</b></span><button data-go="menu">Change</button></div>
            ${field('Your name')}${field('Phone number', 'tel')}${field('Anything we should know?', 'area')}<button class="p-btn" data-go="sent">${esc(d.orderCta)}</button></section>`;
        else body = sent(d.sent[0], `${st.pick}. ${d.sent[1]}`);
        return siteNav(d, key, links) + `<div class="s-body">${body}</div>` + siteFoot(d);
      }
    });
  }
  SITES.bakery = shopSite({
    key: 'bakery', name: 'Adjoa Bakes', mark: 'A', icon: 'cake', accent: '#b4552d', domain: 'adjoabakes.preview',
    prompt: 'A website for my home bakery where people can see the menu and order a cake.',
    tag: 'Baked in Accra', heroTitle: 'Fresh from the oven, every morning.', heroSub: 'Small-batch bread, pastries and celebration cakes, baked to order.',
    cta: 'Order a cake', listName: 'Menu', featured: 'Popular this week', cats: ['Bread', 'Pastry', 'Cakes'],
    points: [['clock', 'Baked daily', 'Nothing sits on a shelf overnight.'], ['cake', 'Made to order', 'Tell us the size, flavour and message.'], ['bike', 'Pickup or delivery', 'Same-day within the city.']],
    products: [['Butter bread', 'GH₵ 25', 'Bread', 'box'], ['Meat pie', 'GH₵ 12', 'Pastry', 'utensils'], ['Chocolate cake', 'GH₵ 180', 'Cakes', 'cake'], ['Cinnamon rolls', 'GH₵ 40', 'Pastry', 'spark'], ['Banana loaf', 'GH₵ 35', 'Bread', 'box'], ['Birthday cake', 'GH₵ 250', 'Cakes', 'cake']],
    quote: ['The butter bread is gone before it reaches the table.', 'Abena, weekly customer'],
    story: ['Our story', 'It started with one oven and a family recipe for butter bread. Neighbours kept asking for more, so the kitchen grew.', 'Everything is still mixed by hand, in small batches, by the same three people.'],
    orderTitle: 'Order a cake', orderCta: 'Send order', sent: ['Order received', 'We will call you within the hour to confirm.']
  });
  SITES.genericSite = shopSite({
    key: 'genericSite', name: 'Your site', mark: 'Y', icon: 'spark', accent: '#ff7a59', domain: 'yoursite.preview',
    prompt: '', tag: 'Tagline', heroTitle: 'Your headline goes here.', heroSub: 'One or two lines that say what you offer and who it is for.',
    cta: 'Main action', listName: 'Products', featured: 'Featured', cats: ['One', 'Two'],
    points: [['star', 'First benefit', 'A short supporting line.'], ['star', 'Second benefit', 'A short supporting line.'], ['star', 'Third benefit', 'A short supporting line.']],
    products: [['Item one', 'Price', 'One', 'box'], ['Item two', 'Price', 'Two', 'box'], ['Item three', 'Price', 'One', 'box'], ['Item four', 'Price', 'Two', 'box']],
    quote: ['A customer quote goes here.', 'Customer name'],
    story: ['About', 'A paragraph about who you are and why you started.', 'A second paragraph about how you work.'],
    orderTitle: 'Get in touch', orderCta: 'Send', sent: ['Message sent', 'This is the confirmation state for your form.']
  });

  /* Portfolio: editorial intro, numbered work rows, case study pages */
  const CASES = [
    { id: 'wallet', n: 'Wallet redesign', t: 'Fintech · 2026', icon: 'card', stat: ['38%', 'more transfers completed'], p: 'People abandoned transfers at the confirmation step.', a: 'Cut the flow from five screens to two and moved fees up front.' },
    { id: 'clinic', n: 'Clinic booking', t: 'Health · 2025', icon: 'cal', stat: ['2 min', 'average time to book'], p: 'Patients queued from 5 am because booking was by phone only.', a: 'A three-tap booking flow that works on low-end phones and SMS.' },
    { id: 'courier', n: 'Courier tracker', t: 'Logistics · 2025', icon: 'box', stat: ['54%', 'fewer support calls'], p: 'Customers called support to ask where a parcel was.', a: 'A live status page with plain-language steps instead of codes.' },
    { id: 'goals', n: 'Savings goals', t: 'Fintech · 2024', icon: 'target', stat: ['3×', 'more goals funded'], p: 'Savers set goals and forgot them.', a: 'Weekly nudges tied to payday, with progress people could share.' }
  ];
  SITES.portfolio = {
    key: 'portfolio', kind: 'site', name: 'Esi Mensah', mark: 'E', icon: 'palette', accent: '#5b63d6', domain: 'esimensah.preview',
    prompt: 'A portfolio website for a product designer to show case studies and get hired.',
    cta: 'Work with me', ctaGo: 'contact',
    screens: [{ key: 'home', name: 'Home', desc: 'Editorial intro and work rows' }, { key: 'case', name: 'Case study', desc: 'Problem, approach, outcome' }, { key: 'about', name: 'About', desc: 'Bio and skills' }, { key: 'contact', name: 'Contact', desc: 'Project enquiry form' }, { key: 'sent', name: 'Confirmation', desc: 'Form sent' }],
    taps: ['Tap a project', 'About link', 'Work with me', 'Send message'],
    init: () => ({ sel: 'wallet', budget: 'Medium' }),
    act(st, a, arg, api) { if (a === 'open') { st.sel = arg; api.go('case'); } if (a === 'budget') st.budget = arg; if (a === 'nextcase') { const i = CASES.findIndex((c) => c.id === st.sel); st.sel = CASES[(i + 1) % CASES.length].id; api.go('case'); } },
    render(key, st) {
      const d = this, c = CASES.find((x) => x.id === st.sel);
      let body;
      if (key === 'home') body = `<section class="f-intro"><span class="s-tag live"><i></i>Available from January</span><h1>I design calm products for busy people.</h1><p>Product designer in Accra. Six years across fintech, health and logistics.</p></section>
          <section class="s-sec"><h2>Selected work</h2><div class="f-rows">${CASES.map((x, i) => `<button data-act="open:${x.id}"><small>0${i + 1}</small><span><b>${esc(x.n)}</b><small>${esc(x.t)}</small></span>${ic('arrow')}</button>`).join('')}</div></section>
          <section class="f-stats">${[['6', 'years'], ['24', 'products shipped'], ['11', 'teams']].map((s) => `<div><b>${s[0]}</b><small>${s[1]}</small></div>`).join('')}</section>`;
      else if (key === 'case') body = `<section class="s-sec"><button class="p-back" data-go="home">${ic('left')}All work</button><span class="s-tag">${esc(c.t)}</span><h1>${esc(c.n)}</h1>${ph('portfolio-' + c.id, c.icon, 'hero wide')}
          <div class="f-case"><div><small>Problem</small><p>${esc(c.p)}</p></div><div><small>Approach</small><p>${esc(c.a)}</p></div><div class="stat"><b>${c.stat[0]}</b><small>${c.stat[1]}</small></div></div>
          <button class="s-ghost" data-act="nextcase">Next project ${ic('arrow')}</button></section>`;
      else if (key === 'about') body = `<section class="s-sec narrow">${ph('portfolio-esi', 'user', 'portrait')}<h1>About</h1><p>I started in print, moved to mobile, and stayed for the problem solving. I like projects where the hard part is deciding what to leave out.</p>
          <div class="p-chips static">${['Research', 'Interaction design', 'Design systems', 'Prototyping', 'Workshops'].map((s) => `<span>${s}</span>`).join('')}</div><button class="p-btn" data-go="contact">Work with me</button></section>`;
      else if (key === 'contact') body = `<section class="s-sec narrow"><h1>Work with me</h1><p class="s-lead">Tell me a little about the project.</p>${field('Your name')}${field('Email', 'email')}
          <div class="p-head"><h3>Budget</h3></div><div class="p-options">${['Small', 'Medium', 'Large'].map((b) => `<button data-act="budget:${b}"${st.budget === b ? ' class="on"' : ''}>${b}</button>`).join('')}</div>
          ${field('About the project', 'area')}<button class="p-btn" data-go="sent">Send message</button></section>`;
      else body = sent('Message sent', 'Thanks. I reply to every enquiry within two working days.');
      return siteNav(d, key, [['home', 'Work'], ['about', 'About']]) + `<div class="s-body">${body}</div>` + siteFoot(d);
    }
  };

  /* Barbershop: dark hero band, price list, day and time-slot booking */
  const SERVICES = [['Skin fade', 60, 45], ['Beard trim', 30, 20], ['Kids cut', 40, 30], ['Hair dye', 120, 60], ['Hot towel shave', 50, 30], ['Line up', 25, 15]];
  SITES.salon = {
    key: 'salon', kind: 'site', name: 'Fade Lab', mark: 'F', icon: 'scissors', accent: '#b7791f', domain: 'fadelab.preview',
    prompt: 'A website for my barbershop where customers can see services and book a slot.',
    cta: 'Book a slot', ctaGo: 'book',
    screens: [{ key: 'home', name: 'Home', desc: 'Hero band and price list' }, { key: 'services', name: 'Services', desc: 'Pick a service' }, { key: 'book', name: 'Book a slot', desc: 'Day and time picker' }, { key: 'sent', name: 'Confirmation', desc: 'Booking summary' }, { key: 'story', name: 'Our story', desc: 'About the shop' }],
    taps: ['Services link', 'Pick a service', 'Request booking', 'Our story link'],
    init: () => ({ svc: 0, day: 'Today', time: '4:30' }),
    act(st, a, arg, api) { if (a === 'svc') { st.svc = Number(arg); api.go('book'); } if (a === 'day') st.day = arg; if (a === 'time') st.time = arg; },
    render(key, st) {
      const d = this, s = SERVICES[st.svc];
      const rows = (list) => `<div class="b-prices">${list.map((x) => { const i = SERVICES.indexOf(x); return `<button data-act="svc:${i}"${i === st.svc ? ' class="on"' : ''}><span><b>${x[0]}</b><small>${x[2]} min</small></span><b>${money(x[1])}</b></button>`; }).join('')}</div>`;
      let body;
      if (key === 'home') body = `<section class="b-hero">${ph('salon-hero', 'scissors', 'cover')}<div><span class="s-tag">East Legon · Open until 9 pm</span><h1>Sharp cuts. No waiting.</h1><p>Book a chair and walk straight in.</p><button class="p-btn" data-go="book">Book a slot</button></div></section>
          <section class="s-sec"><h2>Most booked</h2>${rows(SERVICES.slice(0, 3))}<button class="s-ghost" data-go="services">All services ${ic('arrow')}</button></section>
          <section class="s-points">${[['clock', 'Walk straight in', 'Your chair is ready at your time.'], ['scissors', 'Master barbers', 'Five years or more behind the chair.'], ['moon', 'Open late', 'Until 9 pm, seven days a week.']].map((p) => `<div><i>${ic(p[0])}</i><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</section>`;
      else if (key === 'services') body = `<section class="s-sec"><h1>Services</h1><p class="s-lead">Tap a service to book it.</p>${rows(SERVICES)}</section>`;
      else if (key === 'book') body = `<section class="s-sec narrow"><h1>Book a slot</h1><div class="s-picked">${ic('scissors')}<span><small>${s[2]} min · ${money(s[1])}</small><b>${s[0]}</b></span><button data-go="services">Change</button></div>
          <div class="p-head"><h3>Day</h3></div><div class="p-options">${['Today', 'Tomorrow', 'Saturday'].map((x) => `<button data-act="day:${x}"${st.day === x ? ' class="on"' : ''}>${x}</button>`).join('')}</div>
          <div class="p-head"><h3>Time</h3></div><div class="b-slots">${['10:00', '11:30', '1:00', '2:30', '4:30', '6:00', '7:30', '8:15'].map((x, i) => `<button data-act="time:${x}"${st.time === x ? ' class="on"' : ''}${i === 2 || i === 5 ? ' disabled' : ''}>${x}</button>`).join('')}</div>
          ${field('Your name')}${field('Phone number', 'tel')}<button class="p-btn" data-go="sent">Request booking</button></section>`;
      else if (key === 'story') body = `<section class="s-sec narrow"><h1>Our story</h1>${ph('salon-shop', 'scissors', 'hero wide')}<p>Fade Lab opened with two chairs and a rule: nobody waits. The booking system came first, the shop second.</p><p>Today there are six chairs, and the rule has not changed.</p><button class="p-btn" data-go="book">Book a slot</button></section>`;
      else body = `<section class="s-sec narrow s-sent"><div class="p-check">${tick}</div><h1>Booking requested</h1><div class="p-ticket"><div><small>${esc(st.day)} at ${esc(st.time)}</small><b>${s[0]}</b><small>${s[2]} min · ${money(s[1])}</small></div><i class="p-barcode"></i></div><p>We will text you to confirm.</p><button class="p-btn" data-go="home">Back to home</button></section>`;
      return siteNav(d, key, [['services', 'Services'], ['story', 'Our story']]) + `<div class="s-body">${body}</div>` + siteFoot(d);
    }
  };

  const IDEAS = Object.assign({}, APPS, SITES);
  const ACCENTS = ['#1f8a5b', '#e2622f', '#5b63d6', '#c2255c', '#0c8599', '#b4552d', '#b7791f'];
  const VARIANTS = ['Soft', 'Bold', 'Editorial'];

  function chrome(d) {
    return `<div class="p-chrome"><span class="pc-lights"><i></i><i></i><i></i></span>
      <button data-nav="back" aria-label="Back">${ic('left')}</button><button data-nav="fwd" aria-label="Forward">${ic('right')}</button>
      <span class="pc-url">${ic('shield')}${esc(d.domain)}</span><span class="pc-tabs">1</span></div>`;
  }
  function statusRow() {
    const d = new Date();
    return `<div class="p-status"><span>${d.getHours() % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')}</span><span class="p-status-r"><i class="sig"></i><i class="bat"></i></span></div>`;
  }

  /* mount(host, idea, opts) → controller */
  function mount(host, idea, opts) {
    const o = opts || {};
    const site = idea.kind === 'site';
    const keys = idea.screens.map((s) => s.key);
    const st = idea.init ? idea.init() : {};
    let index = 0, hist = [0], pos = 0, timer = 0;
    host.innerHTML = `<div class="proto ${site ? 'site' : 'app'}" style="--p-accent:${idea.accent}">${statusRow()}${site ? chrome(idea) : ''}<div class="p-view"></div><div class="p-home"></div></div>`;
    const root = host.firstElementChild;
    const view = root.querySelector('.p-view');

    function paint(silent, keep) {
      const top = view.scrollTop;
      view.classList.remove('p-in');
      view.innerHTML = idea.render(keys[index], st);
      if (keep) view.scrollTop = top;
      else { view.scrollTop = 0; void view.offsetWidth; view.classList.add('p-in'); }
      if (site) {
        root.querySelector('[data-nav="back"]').disabled = pos === 0;
        root.querySelector('[data-nav="fwd"]').disabled = pos >= hist.length - 1;
      }
      if (!silent && typeof o.onNavigate === 'function') o.onNavigate(index);
    }
    function go(target, silent) {
      const i = typeof target === 'number' ? target : keys.indexOf(target);
      if (i < 0 || i >= keys.length) return;
      if (i !== index) { hist = hist.slice(0, pos + 1); hist.push(i); pos = hist.length - 1; }
      index = i;
      paint(silent);
    }
    root.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav]');
      if (nav) {
        const next = pos + (nav.dataset.nav === 'back' ? -1 : 1);
        if (next >= 0 && next < hist.length) { pos = next; index = hist[pos]; paint(); }
        return;
      }
      const act = e.target.closest('[data-act]');
      if (act && idea.act) {
        const parts = act.dataset.act.split(':'), before = index;
        let moved = false;
        idea.act(st, parts[0], parts.slice(1).join(':'), { go: (k) => { moved = true; go(k); } });
        if (!moved && index === before) paint(true, true);
        return;
      }
      const t = e.target.closest('[data-go]');
      if (t) go(t.dataset.go);
    });
    /* Live search on list screens: filter in place so the keyboard stays open. */
    root.addEventListener('input', (e) => {
      if (!e.target.matches('[data-filter]')) return;
      const q = e.target.value.trim().toLowerCase();
      let shown = 0;
      view.querySelectorAll('.p-item[data-name]').forEach((el) => { const hit = el.dataset.name.includes(q); el.hidden = !hit; if (hit) shown++; });
      const none = view.querySelector('.p-none');
      if (none) none.hidden = shown > 0;
    });
    if (idea.tick) {
      timer = setInterval(() => {
        if (!root.isConnected) { clearInterval(timer); return; }
        const was = st.running;
        if (!idea.tick(st)) return;
        const t = view.querySelector('[data-timer]'), ring = view.querySelector('[data-timer-ring]');
        if (t) t.textContent = mmss(st.left);
        if (ring) ring.style.setProperty('--pct', Math.round(st.left / 45 * 100));
        if (was && !st.running && keys[index] === 'timer') paint(true, true);
      }, 1000);
    }

    paint(true);
    return {
      go: go,
      setDark: (b) => root.classList.toggle('p-dark', !!b),
      setAccent: (c) => root.style.setProperty('--p-accent', c),
      setWide: (b) => root.classList.toggle('p-wide', !!b),
      setVariant: (n) => { VARIANTS.forEach((_, i) => root.classList.toggle('p-v' + i, i === n)); },
      destroy: () => clearInterval(timer),
      get index() { return index; }
    };
  }

  window.SelasiProto = { IDEAS: IDEAS, ACCENTS: ACCENTS, VARIANTS: VARIANTS, mount: mount };
})();
