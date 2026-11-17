/* Selasi AI concept build: scroll-story sites.
   Each has tall [data-journey] blocks; the prototype engine feeds each one
   --p (0 to 1) as the visitor scrolls, and CSS turns that into animation.
   Styles live in assets/css/stories.css.

   - Volta Freight: a 3D box truck built from CSS planes. Rear doors open,
     pallets roll in, the camera swings round and up to a top view, the
     truck drives its route, then a second section follows it to a house.
   - Auro: 3D over-ear headphones. One cup separates into labelled layers,
     the model turns to show its controls, then returns spinning. */
(function () {
  'use strict';
  const P = window.SelasiProto, K = P.kit, ic = K.ic, esc = K.esc, money = K.money;
  const n = (v) => Number(v.toFixed(3));

  /* ── 3D primitives (units are em; y is up) ─────────────────────────── */
  const cube = (x, y, z, w, h, d, c, cls, extra) =>
    `<div class="cube ${cls || ''}" style="--x:${x};--y:${y};--z:${z};--w:${w};--h:${h};--d:${d};--c:${c};${extra || ''}"><i class="f"></i><i class="b"></i><i class="l"></i><i class="r"></i><i class="t"></i>${/six/.test(cls || '') ? '<i class="u"></i>' : ''}</div>`;
  /* A free rectangle centred on (x, y, z), then rotated. */
  const plane = (x, y, z, w, h, rot, cls, extra) =>
    `<i class="pl ${cls || ''}" style="width:${w}em;height:${h}em;transform:translate3d(${n(x - w / 2)}em,${n(-y - h / 2)}em,${z}em) ${rot || ''};${extra || ''}"></i>`;
  const caption = (k, tag, title, text) => `<div class="j-cap c${k}"><span class="s-tag">${tag}</span><h1>${title}</h1><p>${text}</p></div>`;

  /* ── Volta Freight: the truck ──────────────────────────────────────── */
  function wheel(x, z) {
    const r = 1.15, wd = 0.95, N = 16, seg = n(2 * Math.PI * r / N * 1.06);
    let tread = '';
    for (let k = 0; k < N; k++) tread += `<i class="tread" style="width:${seg}em;height:${wd}em;margin:${-wd / 2}em 0 0 ${-seg / 2}em;transform:rotateZ(${k * 360 / N}deg) translateY(${-r}em) rotateX(90deg)"></i>`;
    return `<div class="wheel3" style="transform:translate3d(${x}em,${-r}em,${z}em)"><div class="spin">${tread}
      <i class="wd" style="transform:translateZ(${wd / 2}em)"></i><i class="wd in" style="transform:translateZ(${-wd / 2}em)"></i></div></div>`;
  }
  function pallet(x, z, h, i) {
    return `<div class="pal" style="--dl:${n(i * 0.02)}">${cube(x, 2.28, z, 2.1, 0.22, 2.2, '#a9824f')}${cube(x, 2.5, z, 1.95, h, 2.05, ['#c99a5b', '#bd8c4c', '#d2a567'][i % 3], 'carton')}</div>`;
  }
  function truck3d() {
    let pals = '', i = 0;
    [1.9, -0.35, -2.6, -4.85, -7.1].forEach((x) => { [-1.25, 1.25].forEach((z) => { pals += pallet(x, z, [3.2, 2.5, 3.6, 2.9][i % 4], i); i++; }); });
    return `<div class="tk">
        <i class="tk-shadow"></i>
        ${cube(-1.4, 1.5, 0, 15.6, 0.6, 2.9, '#1c2026')}
        ${cube(-2.9, 2.14, 0, 12.2, 0.14, 5.3, '#6b5238', 'deck')}
        ${pals}
        ${cube(-2.9, 2.2, 0, 12.2, 5.6, 5.3, '#eef0f3', 'cargo')}
        <div class="door near" style="transform:translate3d(-9em,-7.8em,2.65em) rotateY(calc(var(--door) * 108deg))"><i style="transform:rotateY(90deg)"></i></div>
        <div class="door far" style="transform:translate3d(-9em,-7.8em,-2.65em) rotateY(calc(var(--door) * -108deg))"><i style="transform:rotateY(-90deg)"></i></div>
        ${cube(5.525, 1.55, 0, 3.95, 4.9, 5, '#f4f5f7', 'cabx')}
        ${plane(5.35, 7.02, 0, 3.5, 4.6, 'rotateZ(19.2deg) rotateX(90deg)', 'defl')}
        ${plane(5.35, 7.02, 2.3, 3.3, 1.15, '', 'defl side')}${plane(5.35, 7.02, -2.3, 3.3, 1.15, '', 'defl side')}
        ${plane(3.7, 7.02, 0, 4.6, 1.15, 'rotateY(-90deg)', 'defl back')}
        ${cube(7.62, 5.95, 0, 0.42, 0.16, 5, '#15181d')}
        ${cube(7.4, 4.3, 2.85, 0.22, 1.5, 0.34, '#15181d')}${cube(7.4, 4.3, -2.85, 0.22, 1.5, 0.34, '#15181d')}
        ${cube(7.5, 1.2, 0, 0.5, 1.05, 5.1, '#1b1f25', 'bumper')}
        ${cube(1.3, 1, 2.2, 2.6, 1, 0.85, '#c3c8cf', 'tank')}${cube(1.3, 1, -2.2, 2.2, 1, 0.85, '#2a2f37')}
        ${cube(-1.9, 1.25, 2.6, 4, 0.16, 0.1, '#d6dade')}${cube(-1.9, 1.75, 2.6, 4, 0.16, 0.1, '#d6dade')}
        ${cube(-1.9, 1.25, -2.6, 4, 0.16, 0.1, '#d6dade')}${cube(-1.9, 1.75, -2.6, 4, 0.16, 0.1, '#d6dade')}
        ${cube(-5.2, 2.02, 2.25, 3.1, 0.16, 1.05, '#14171c')}${cube(-5.2, 2.02, -2.25, 3.1, 0.16, 1.05, '#14171c')}
        ${cube(-9.15, 0.95, 0, 0.3, 0.55, 5.2, '#1b1f25', 'underrun')}
        ${wheel(5.6, 2.3)}${wheel(5.6, -2.3)}${wheel(-5.2, 2.3)}${wheel(-5.2, -2.3)}
      </div>`;
  }
  function truckScene() {
    return `<div class="j-scene"><div class="j-world">
        <div class="j-ground"><i class="j-route"></i><i class="j-pin"></i><i class="j-pin b"></i></div>
        ${cube(-4, 0, -17, 46, 8, 9, '#aeb6c0', 'depot')}
        ${cube(-17.5, 0, 0, 14, 2.05, 4.9, '#343b45', 'belt')}
        <div class="j-truck">${truck3d()}</div>
      </div></div>`;
  }

  /* Side-view truck drawn as SVG, for the last-mile section. Faces right. */
  function truckSide() {
    const rivets = (y) => Array.from({ length: 27 }, (_, i) => `<circle cx="${50 + i * 14.2}" cy="${y}" r="1.300"/>`).join('');
    const wheelG = (cx) => `<g class="whl" style="transform-origin:${cx}px 214px"><circle cx="${cx}" cy="214" r="31" fill="#15171b"/><circle cx="${cx}" cy="214" r="27" fill="none" stroke="#2b2f36" stroke-width="3"/><circle cx="${cx}" cy="214" r="18" fill="#d7dbe0"/><circle cx="${cx}" cy="214" r="18" fill="none" stroke="#8f96a0" stroke-width="2"/>
      ${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="${cx}" cy="${214 - 11}" rx="3.400" ry="4.600" fill="#3a3f47" transform="rotate(${a} ${cx} 214)"/>`).join('')}<circle cx="${cx}" cy="214" r="6" fill="#565c66"/><circle cx="${cx}" cy="214" r="2.500" fill="#1d2025"/></g>`;
    return `<svg class="tk2d" viewBox="0 0 640 260" aria-hidden="true">
      <defs><linearGradient id="tkBox" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbfcfd"/><stop offset="1" stop-color="#dfe3e8"/></linearGradient>
      <linearGradient id="tkGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a6076"/><stop offset=".55" stop-color="#17222e"/><stop offset="1" stop-color="#0d151d"/></linearGradient></defs>
      <ellipse cx="320" cy="246" rx="300" ry="9" fill="#000" opacity=".2"/>
      <rect x="52" y="188" width="392" height="16" rx="2" fill="#1c2026"/>
      <rect x="34" y="196" width="14" height="30" rx="2" fill="#1b1f25"/><rect x="34" y="200" width="6" height="10" rx="1.500" fill="#e23b2e"/><rect x="34" y="212" width="6" height="6" rx="1.500" fill="#f5a623"/>
      <rect x="152" y="206" width="140" height="5" rx="2" fill="#cfd4da"/><rect x="152" y="218" width="140" height="5" rx="2" fill="#cfd4da"/>
      <rect x="300" y="198" width="74" height="28" rx="9" fill="#c5cad1"/><rect x="306" y="203" width="62" height="5" rx="2.500" fill="#fff" opacity=".6"/><rect x="380" y="200" width="46" height="24" rx="4" fill="#2a2f37"/>
      <rect x="40" y="38" width="394" height="152" rx="3" fill="#c3c8cf"/><rect x="45" y="43" width="384" height="142" fill="url(#tkBox)"/>
      <path d="M270 185 L330 43 H368 L308 185z M320 185 L380 43 H429 V185z" fill="var(--p-accent)"/>
      <g fill="#9aa1ab">${rivets(41)}${rivets(187.500)}</g>
      <text x="62" y="112" font-family="Inter, sans-serif" font-weight="800" font-size="27" letter-spacing="-.5" fill="#1b1f25">VOLTA</text><text x="62" y="134" font-family="Inter, sans-serif" font-weight="600" font-size="13" letter-spacing="3" fill="#6b727d">FREIGHT</text>
      <path d="M447 98 l9 -32 q42 -8 62 8 l10 24z" fill="#f2f3f5"/><path d="M456 66 q42 -8 62 8" fill="none" stroke="#c9ced5" stroke-width="2"/>
      <path d="M442 98 h88 q22 2 29 27 l9 52 v52 h-126z" fill="#f6f7f9"/><path d="M559 125 l9 52 v52 h-10 v-104z" fill="#dfe3e8"/>
      <path d="M474 108 h50 q13 2 18 18 l6 30 h-74z" fill="url(#tkGlass)"/><path d="M482 112 l22 0 l-14 40 l-16 0z" fill="#fff" opacity=".13"/>
      <path d="M470 104 v118 M552 160 v62" stroke="#c9ced5" stroke-width="1.500" fill="none"/><rect x="478" y="168" width="14" height="4" rx="2" fill="#22262c"/>
      <rect x="528" y="92" width="34" height="6" rx="2" fill="#15181d"/><path d="M556 112 h10 v34 h-10z" fill="#15181d"/><path d="M548 118 h8" stroke="#15181d" stroke-width="3"/>
      <rect x="558" y="180" width="11" height="18" rx="3" fill="#fff3c2"/><rect x="558" y="200" width="11" height="6" rx="2" fill="#f5a623"/>
      <path d="M438 204 h134 v22 q0 8 -8 8 h-126z" fill="#1b1f25"/><rect x="446" y="226" width="22" height="6" rx="2" fill="#2d323a"/>
      <path d="M470 214 a36 36 0 0 1 72 0z" fill="#14171c"/><path d="M82 214 a36 36 0 0 1 72 0z" fill="#14171c"/>
      ${wheelG(506)}${wheelG(118)}
      <path d="M72 196 v34" stroke="#14171c" stroke-width="5" stroke-linecap="round"/>
    </svg>`;
  }
  const strip = (cls, body) => `<svg class="mile-strip ${cls}" viewBox="0 0 1800 200" preserveAspectRatio="none" aria-hidden="true">${body}</svg>`;
  function scenery() {
    let far = '<path d="M0 200 V120 Q150 60 300 110 T600 100 T900 120 T1200 90 T1500 115 T1800 100 V200z" fill="#b7c9b0"/><path d="M0 200 V150 Q200 110 400 145 T800 140 T1200 150 T1600 135 T1800 150 V200z" fill="#9db796"/>';
    let mid = '';
    for (let i = 0; i < 18; i++) {
      const x = 40 + i * 100 + (i % 3) * 14;
      mid += i % 4 === 1
        ? `<rect x="${x}" y="${96 - (i % 3) * 16}" width="56" height="${104 + (i % 3) * 16}" fill="${['#d9c9b4', '#c9d2dc', '#e2d3c0'][i % 3]}"/>${[0, 1, 2].map((r) => [0, 1].map((c) => `<rect x="${x + 9 + c * 22}" y="${110 - (i % 3) * 16 + r * 24}" width="13" height="13" fill="#7f93a8" opacity=".7"/>`).join('')).join('')}`
        : `<rect x="${x + 24}" y="140" width="6" height="60" fill="#7a5a3c"/><circle cx="${x + 27}" cy="${126 - (i % 2) * 10}" r="${22 + (i % 3) * 4}" fill="${i % 2 ? '#4f8a52' : '#5f9a5c'}"/>`;
    }
    let near = '';
    for (let i = 0; i < 12; i++) near += `<rect x="${60 + i * 150}" y="60" width="4" height="140" fill="#5a6470"/><rect x="${60 + i * 150}" y="60" width="34" height="4" rx="2" fill="#5a6470"/><circle cx="${92 + i * 150}" cy="66" r="5" fill="#ffe9a3"/>`;
    return strip('far', far) + strip('mid', mid) + strip('near', near);
  }
  const house = () => `<svg class="mile-house" viewBox="0 0 260 240" aria-hidden="true">
      <circle cx="222" cy="120" r="34" fill="#4f8a52"/><rect x="218" y="140" width="8" height="90" fill="#7a5a3c"/>
      <rect x="30" y="104" width="170" height="126" fill="#f3e9d8"/><path d="M14 110 L115 34 L216 110z" fill="#b4552d"/><path d="M14 110 L115 34 L216 110" fill="none" stroke="#8f3f1f" stroke-width="5" stroke-linejoin="round"/>
      <rect x="150" y="56" width="18" height="34" fill="#8f3f1f"/>
      <rect x="52" y="130" width="46" height="42" rx="3" fill="#8fb4d6"/><path d="M75 130 v42 M52 151 h46" stroke="#fff" stroke-width="3"/>
      <rect x="126" y="140" width="46" height="90" rx="3" fill="#6b4a2a"/><circle cx="163" cy="188" r="3.500" fill="#f2c96a"/><rect x="116" y="226" width="66" height="8" rx="2" fill="#c9b79c"/>
      <g class="mile-parcel"><rect x="88" y="204" width="30" height="26" rx="2" fill="#c99a5b"/><path d="M88 214 h30 M103 204 v26" stroke="#a9773a" stroke-width="2.500"/><circle cx="118" cy="204" r="10" fill="#1f8a5b"/><path d="M113 204 l4 4 l7 -8" fill="none" stroke="#fff" stroke-width="2.500" stroke-linecap="round" stroke-linejoin="round"/></g>
    </svg>`;
  function lastMile() {
    const steps = [['08:10', 'Collected in Tema', 'Scanned at the dock and sealed.'], ['10:45', 'On the N1', 'You can see the truck move on the map.'], ['14:20', 'Turning into your street', 'A text goes out ten minutes before arrival.'], ['14:32', 'Delivered', 'Photo and signature sent to your phone.']];
    return `<section class="j-wrap mile" data-journey><div class="j-stage">
        <div class="mile-head"><span class="s-tag">The last mile</span><h2>All the way to the door.</h2></div>
        <div class="mile-lane"><i class="mile-sun"></i>${scenery()}<i class="mile-road"></i>${house()}<div class="mile-truck">${truckSide()}</div></div>
        <div class="mile-steps">${steps.map((s, i) => `<div class="ms" style="--i:${i}"><small>${s[0]}</small><b>${s[1]}</b><span>${s[2]}</span></div>`).join('')}</div>
        <div class="mile-bar"><i></i></div>
      </div></section>`;
  }

  const CITIES = { Accra: 0, Kumasi: 250, Takoradi: 220, Tamale: 610 };
  P.IDEAS.freight = {
    key: 'freight', kind: 'site', name: 'Volta Freight', mark: 'V', accent: '#f08a24', domain: 'voltafreight.preview', cls: 'x-freight',
    prompt: 'An animated 3D website for a delivery company, with a truck that loads cargo as you scroll and then shows the route from above.',
    cta: 'Get a quote', ctaGo: 'quote',
    screens: [{ key: 'home', name: 'Home', desc: '3D story: load, lift, route, last mile' }, { key: 'track', name: 'Track', desc: 'Live map and status' }, { key: 'quote', name: 'Quote', desc: 'Price updates as you choose' }, { key: 'sent', name: 'Confirmation', desc: 'Quote requested' }],
    taps: ['Track a shipment', 'Get a quote', 'Request pickup'],
    init: () => ({ pos: 34, to: 'Kumasi', pal: 4, veh: 1, code: 'VF-20418' }),
    act(st, a, arg) {
      if (a === 'to') st.to = arg;
      if (a === 'veh') st.veh = Number(arg);
      if (a === 'inc') st.pal = Math.min(24, st.pal + 1);
      if (a === 'dec') st.pal = Math.max(1, st.pal - 1);
    },
    tick(st, key) { if (key !== 'track' || st.pos >= 100) return false; st.pos = Math.min(100, st.pos + 2); return 'paint'; },
    price(st) { return Math.round(180 + CITIES[st.to] * 1.4 + st.pal * 45 + st.veh * 220); },
    render(key, st) {
      const d = this;
      let body;
      if (key === 'home') body = `<section class="j-wrap" data-journey><div class="j-stage">
            <i class="j-sky"></i>${truckScene()}
            ${caption(1, 'Load', 'Loaded in minutes.', 'Scroll to open the doors and roll the pallets in. Every one has a slot before the truck arrives.')}
            ${caption(2, 'Count', 'Every pallet counted.', 'From above, dispatch sees exactly what is on board and what is still missing.')}
            ${caption(3, 'Track', 'Followed all the way.', 'The route is live from the yard to the last drop.')}
            <span class="j-hint">${ic('right')}Scroll</span>
          </div></section>
          <section class="f-stats">${[['98%', 'on-time drops'], ['140', 'trucks on the road'], ['16', 'regions covered']].map((x) => `<div><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</section>
          ${lastMile()}
          <section class="s-points">${[['bolt', 'Same-day city runs', 'Booked before noon, delivered before dark.'], ['box', 'Cross-country haul', 'Full and part loads between every region.'], ['shield', 'Insured and sealed', 'Tamper seals and cover on every trip.']].map((p) => `<div><i>${ic(p[0])}</i><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</section>
          <section class="x-fleet"><h2>The fleet</h2><div>${[['Van', '1.2 t · city drops', 0.62], ['Box truck', '8 t · regional', 0.8], ['Trailer', '26 t · cross-country', 1]].map((f) => `<article><div class="fl" style="--s:${f[2]}">${truckSide()}</div><b>${f[0]}</b><small>${f[1]}</small></article>`).join('')}</div></section>
          <section class="s-quote"><p>Track a shipment</p><div class="x-track"><input value="${esc(st.code)}" aria-label="Tracking code"><button data-go="track">Track ${ic('arrow')}</button></div></section>`;
      else if (key === 'track') {
        const steps = [['Collected', 'Tema yard'], ['On the road', 'N6 highway'], ['Out for delivery', st.to], ['Delivered', 'Signed for']];
        const at = st.pos >= 100 ? 3 : st.pos >= 70 ? 2 : 1;
        body = `<section class="s-sec"><span class="s-tag live"><i></i>Live · ${esc(st.code)}</span><h1>${steps[at][0]}</h1>
          <div class="x-map" style="--pos:${st.pos}"><i class="road"></i><i class="a"></i><i class="b"></i><i class="van">${ic('box')}</i><small class="la">Tema</small><small class="lb">${esc(st.to)}</small></div>
          <div class="p-rows"><div><span>Arrives in</span><b>${st.pos >= 100 ? 'Arrived' : Math.max(1, Math.round((100 - st.pos) * 1.8)) + ' min'}</b></div><div><span>Driver</span><b>Kofi B.</b></div><div><span>Load</span><b>${st.pal} pallets</b></div></div>
          <div class="p-timeline">${steps.map((x, i) => `<div class="${i < at || at === 3 ? 'ok' : i === at ? 'next' : ''}"><i>${i < at || at === 3 ? ic('check') : ''}</i><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div></section>`;
      } else if (key === 'quote') body = `<section class="s-sec narrow"><h1>Get a quote</h1><p class="s-lead">The price updates as you choose.</p>
          <div class="p-head"><h3>From Accra to</h3></div><div class="p-options">${['Kumasi', 'Takoradi', 'Tamale'].map((c) => `<button data-act="to:${c}"${st.to === c ? ' class="on"' : ''}>${c}</button>`).join('')}</div>
          <div class="p-between"><b>Pallets</b>${K.stepper('pal', st.pal)}</div>
          <div class="p-head"><h3>Vehicle</h3></div><div class="p-options">${['Van', 'Truck', 'Trailer'].map((v, i) => `<button data-act="veh:${i}"${st.veh === i ? ' class="on"' : ''}>${v}</button>`).join('')}</div>
          <div class="x-price"><small>Estimated price</small><b>${money(d.price(st))}</b><small>${CITIES[st.to]} km · ${st.pal} pallets</small></div>
          ${K.field('Company name')}${K.field('Phone number', 'tel')}<button class="p-btn" data-go="sent">Request pickup</button></section>`;
      else body = K.sent('Quote requested', `Accra to ${st.to}, ${st.pal} pallets, about ${money(d.price(st))}. Dispatch will call you within 30 minutes.`);
      return K.siteNav(d, key, [['home', 'Home'], ['track', 'Track']]) + `<div class="s-body">${body}</div>` + K.siteFoot(d);
    }
  };

  /* ── Auro: 3D over-ear headphones ──────────────────────────────────── */
  const disc = (u, s, c, cls) => `<i class="dsc ${cls || ''}" style="--u:${n(u)};--s:${n(s)};--c:${c}"></i>`;
  const tone = (pct, to) => `color-mix(in srgb, var(--au) ${Math.round(pct)}%, ${to})`;
  /* One ear cup, sliced along its axis: cushion, mesh, driver, board, shell. */
  function cup(side) {
    let cushion = '', shell = '';
    for (let i = 0; i < 9; i++) { const t = i / 8, bulge = Math.sin(t * Math.PI); cushion += disc(-1.62 + t * 1.3, 0.9 + bulge * 0.1, `color-mix(in srgb, var(--pad) ${Math.round(70 + bulge * 30)}%, #000)`, 'ring'); }
    for (let i = 0; i < 16; i++) { const t = i / 15; shell += disc(-0.32 + t * 1.84, 1 - 0.36 * Math.pow(t, 2.4), t < 0.5 ? tone(100 - t * 30, '#000') : tone(100 - (1 - t) * 26, '#fff')); }
    return `<div class="cup ${side}">
        <div class="lay" style="--k:-6.4">${cushion}</div>
        <div class="lay" style="--k:-3.2">${disc(-0.36, 0.72, '#17181c', 'mesh')}</div>
        <div class="lay" style="--k:0">${disc(-0.2, 0.8, '#2b2e34', 'driver')}</div>
        <div class="lay" style="--k:3.2">${disc(-0.06, 0.8, '#1f6f55', 'board')}</div>
        <div class="lay" style="--k:6.4">${shell}${disc(1.54, 0.62, tone(86, '#fff'), 'cap')}${side === 'L'
          ? cube(0.5, -3.4, -1.05, 0.5, 0.3, 0.7, '#e3e6ea', 'btn b1 six') + cube(0.5, -3.62, 0.1, 0.5, 0.3, 1, '#e3e6ea', 'btn b2 six') + cube(0.5, -3.4, 1.25, 0.5, 0.22, 0.6, '#101114', 'btn b3 six')
          : ''}</div>
        ${cube(0.75, 3.05, 0, 0.42, 2.7, 0.8, '#cfd3d9', 'yoke six')}${cube(0.75, 2.75, 0, 0.6, 0.6, 1.1, 'var(--au)', 'hinge six')}
      </div>`;
  }
  function band() {
    const R = 5.3, cy = 5.4, N = 30;
    let s = '';
    for (let i = 0; i < N; i++) {
      const a = (i + 0.5) / N * Math.PI, deg = a * 180 / Math.PI, top = Math.sin(a);
      s += cube(n(R * Math.cos(a)), n(cy + R * Math.sin(a) - 0.21), 0, n(R * Math.PI / N * 1.12), 0.42, 2 + top * 0.3, tone(100 - (1 - top) * 18, '#000'), 'bseg six', `--rz:${n(-(deg + 90))}deg`);
      if (deg > 38 && deg < 142) s += cube(n((R - 0.42) * Math.cos(a)), n(cy + (R - 0.42) * Math.sin(a) - 0.2), 0, n((R - 0.42) * Math.PI / N * 1.14), 0.4, 1.9 + top * 0.25, 'var(--pad)', 'bseg pad six', `--rz:${n(-(deg + 90))}deg`);
    }
    return s;
  }
  const phones = () => `<div class="hp"><div class="hp-world">${band()}${cup('L')}${cup('R')}</div></div>`;
  /* Labels sit at (x, y) in the stage box and point at (tx, ty), both in percent. */
  const tags = (cls, list) => `<svg class="hp-lines ${cls}" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${list.map((t) => `<path d="M${t[0]} ${t[1] + (t[3] > t[1] ? 4.500 : -1.500)} L${t[2]} ${t[3]}" vector-effect="non-scaling-stroke"/>`).join('')}</svg>` +
    list.map((t) => `<i class="hp-dot ${cls}" style="left:${t[2]}%;top:${t[3]}%"></i><div class="hp-tag ${cls}" style="left:${t[0]}%;top:${t[1]}%"><b>${t[4]}</b><small>${t[5]}</small></div>`).join('');

  const COLORS = [['Sand', '#ddd2bf', '#7c9076'], ['Graphite', '#474c56', '#202227'], ['Sage', '#9db39a', '#4f6350'], ['Ember', '#d5563a', '#2a2422']];
  const TUNES = { Balanced: [50, 55, 60, 58, 52, 50], Bass: [92, 80, 58, 46, 44, 48], Vocal: [36, 48, 78, 88, 70, 50], Bright: [40, 44, 56, 70, 86, 94] };
  P.IDEAS.auro = {
    key: 'auro', kind: 'site', name: 'Auro', mark: 'A', accent: '#8a909b', domain: 'auro.preview', cls: 'x-auro',
    prompt: 'A product website for a headphone company where the headphones come apart into labelled parts as you scroll.',
    cta: 'Pre-order', ctaGo: 'order',
    screens: [{ key: 'home', name: 'Home', desc: '3D story: explode, controls, return' }, { key: 'sound', name: 'Sound', desc: 'Tuning presets and specs' }, { key: 'order', name: 'Pre-order', desc: 'Colour, quantity, engraving' }, { key: 'sent', name: 'Confirmation', desc: 'Pre-order placed' }],
    taps: ['Sound link', 'Pre-order', 'Place pre-order'],
    init: () => ({ col: 0, qty: 1, tune: 'Balanced' }),
    act(st, a, arg) {
      if (a === 'col') st.col = Number(arg);
      if (a === 'tune') st.tune = arg;
      if (a === 'inc') st.qty = Math.min(5, st.qty + 1);
      if (a === 'dec') st.qty = Math.max(1, st.qty - 1);
    },
    render(key, st) {
      const d = this, c = COLORS[st.col];
      const swatches = `<div class="au-swatches">${COLORS.map((x, i) => `<button data-act="col:${i}" style="--c:${x[1]}"${i === st.col ? ' class="on"' : ''} aria-label="${x[0]}"></button>`).join('')}</div>`;
      let body;
      if (key === 'home') body = `<section class="j-wrap au" data-journey><div class="j-stage">
            <div class="hp-box">${phones()}
              ${tags('x', [[19, 31, 18, 44, 'Memory foam', 'Cooling gel layer'], [35, 84, 35, 70, 'Acoustic mesh', 'Tuned for clarity'], [49, 31, 49, 46, '40 mm driver', 'Titanium-coated'], [63, 84, 63, 74, 'Battery and board', '30 hours per charge'], [80, 31, 76, 46, 'Shell', 'Recycled aluminium']])}
              ${tags('k', [[50, 90, 68, 72, 'Power', 'Hold 2 s to pair'], [74, 97, 72, 76, 'Noise control', 'Cancel or ambient'], [92, 88, 75.500, 77, 'USB-C', '5 min gives 4 h'], [84, 36, 74, 55, 'Touch panel', 'Swipe and tap']])}
            </div>
            ${caption(1, 'Auro One', 'Hear everything.', 'Scroll to open it up and see what is inside.')}
            ${caption(2, 'Inside', 'Five layers. Nothing wasted.', 'Each part is tuned to the one beside it, from the foam to the shell.')}
            ${caption(3, 'Controls', 'Everything within reach.', 'Three buttons underneath, and a touch panel on the right cup.')}
            <span class="j-hint">${ic('right')}Scroll</span>
          </div></section>
          <section class="s-sec"><span class="s-tag">Finish</span><h2>${c[0]}</h2>${swatches}</section>
          <section class="s-points">${[['moon', 'Adaptive noise cancelling', 'Six microphones read the room 800 times a second.'], ['bolt', '30 hours, 5-minute top-up', 'Five minutes on the cable gives four hours.'], ['layers', 'Two devices at once', 'Laptop and phone, without re-pairing.']].map((p) => `<div><i>${ic(p[0])}</i><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</section>
          <section class="j-wrap au2" data-journey><div class="j-stage">
            <div class="hp-box">${phones()}</div>
            <div class="au2-list">${[['248 g', 'Light enough to forget'], ['30 h', 'Battery with noise cancelling on'], ['40 mm', 'Titanium-coated drivers'], ['6 mics', 'For calls and noise control']].map((x, i) => `<div style="--i:${i}"><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</div>
            <div class="au2-buy"><small>Auro One</small><b>${money(1890)}</b><button class="p-btn" data-go="order">Pre-order</button></div>
          </div></section>`;
      else if (key === 'sound') body = `<section class="s-sec"><span class="s-tag">Sound</span><h1>Tune it your way.</h1><p class="s-lead">Pick a profile and watch the curve change.</p>
          <div class="p-chips">${Object.keys(TUNES).map((t) => `<button data-act="tune:${t}"${st.tune === t ? ' class="on"' : ''}>${t}</button>`).join('')}</div>
          <div class="p-chart eq">${TUNES[st.tune].map((v, i) => `<div><i style="height:${v}%"></i><small>${['60', '250', '1k', '4k', '8k', '16k'][i]}</small></div>`).join('')}</div>
          <div class="p-rows">${[['Driver', '40 mm titanium-coated'], ['Frequency', '5 Hz to 40 kHz'], ['Battery', '30 hours with ANC'], ['Weight', '248 g'], ['Codec', 'LDAC, AAC, SBC']].map((r) => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>
          <button class="p-btn" data-go="order">Pre-order</button></section>`;
      else if (key === 'order') body = `<section class="s-sec narrow"><h1>Pre-order</h1><div class="au-mini"><div class="hp-box">${phones()}</div></div>
          <div class="p-head"><h3>Finish: ${c[0]}</h3></div>${swatches}
          <div class="p-between"><b>Quantity</b>${K.stepper('qty', st.qty)}</div>
          ${K.field('Engraving (optional)')}
          <div class="p-rows"><div><span>Ships</span><b>February</b></div><div><span>Total</span><b>${money(1890 * st.qty)}</b></div></div>
          <button class="p-btn" data-go="sent">Place pre-order</button></section>`;
      else body = K.sent('Pre-order placed', `${st.qty} × Auro One in ${c[0]}. You will not be charged until it ships.`);
      return `<div class="au-root" style="--au:${c[1]};--pad:${c[2]}">` + K.siteNav(d, key, [['home', 'Auro One'], ['sound', 'Sound']]) + `<div class="s-body">${body}</div>` + K.siteFoot(d) + '</div>';
    }
  };
})();
