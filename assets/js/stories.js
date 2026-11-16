/* Selasi AI concept build: scroll-story sites.
   Each has a tall [data-journey] block; the prototype engine feeds it --p
   (0 to 1) as the visitor scrolls, and CSS turns that into the animation.

   - Volta Freight: a 3D truck built from CSS boxes. Cargo loads from the side
     view, the camera swings to a top view, then the truck drives its route.
   - Auro: headphones whose ear cup separates into labelled layers. */
(function () {
  'use strict';
  const P = window.SelasiProto, K = P.kit, ic = K.ic, esc = K.esc, money = K.money;

  const cube = (x, y, z, w, h, d, c, cls, extra) =>
    `<div class="cube ${cls || ''}" style="--x:${x};--y:${y};--z:${z};--w:${w};--h:${h};--d:${d};--c:${c};${extra || ''}"><i class="f"></i><i class="b"></i><i class="l"></i><i class="r"></i><i class="t"></i></div>`;
  const caption = (n, tag, title, text) => `<div class="j-cap c${n}"><span class="s-tag">${tag}</span><h1>${title}</h1><p>${text}</p></div>`;

  /* ── Volta Freight ─────────────────────────────────────────────────── */
  function truckScene() {
    const boxes = [];
    const tones = ['#c99a5b', '#b98848', '#d4a96c', '#c08f52'];
    let i = 0;
    [-8.6, -6.2, -3.8, -1.4, 1].forEach((x, col) => {
      [-1.25, 1.25].forEach((z) => {
        boxes.push(cube(x, 1.7, z, 2.2, 2, 2.2, tones[i % 4], 'box', `--dl:${(i * 0.022).toFixed(3)}`)); i++;
        if (col < 3 && z < 0) { boxes.push(cube(x, 3.7, z, 2.2, 1.7, 2.2, tones[(i + 1) % 4], 'box', `--dl:${(i * 0.022).toFixed(3)}`)); i++; }
      });
    });
    const wheels = [-8, -5.4, 6.6].map((x) => [-2.5, 2.5].map((z) => cube(x, 0, z, 1.9, 1.9, 0.7, '#12161c', 'wheel')).join('')).join('');
    return `<div class="j-scene"><div class="j-world">
        <div class="j-ground"><i class="j-route"></i><i class="j-pin"></i><i class="j-pin b"></i></div>
        <div class="j-truck">
          ${cube(-3.4, 1.2, 0, 13.6, 0.5, 5.2, '#2b3442')}
          ${cube(-3.4, 1.7, -2.5, 13.6, 4.3, 0.16, '#e9edf2', 'wall')}
          ${cube(3.3, 1.7, 0, 0.16, 4.3, 5.2, '#dfe4ea', 'wall')}
          ${boxes.join('')}
          ${cube(6.6, 1.2, 0, 4.2, 4.3, 5, 'var(--p-accent)', 'cab')}
          ${cube(8.2, 3.3, 0, 1.1, 1.7, 4.3, '#1d2a3a')}
          ${cube(8.9, 1.1, 0, 0.5, 0.9, 5.2, '#1a1f27')}
          ${wheels}
        </div>
      </div></div>`;
  }

  const CITIES = { Accra: 0, Kumasi: 250, Takoradi: 220, Tamale: 610 };
  P.IDEAS.freight = {
    key: 'freight', kind: 'site', name: 'Volta Freight', mark: 'V', accent: '#f08a24', domain: 'voltafreight.preview', cls: 'x-freight',
    prompt: 'An animated 3D website for a delivery company, with a truck that loads cargo as you scroll and then shows the route from above.',
    cta: 'Get a quote', ctaGo: 'quote',
    screens: [{ key: 'home', name: 'Home', desc: '3D scroll story: load, lift, route' }, { key: 'track', name: 'Track', desc: 'Live map and status' }, { key: 'quote', name: 'Quote', desc: 'Price updates as you choose' }, { key: 'sent', name: 'Confirmation', desc: 'Quote requested' }],
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
            ${caption(1, 'Load', 'Loaded in minutes.', 'Scroll to load the trailer. Every pallet has a slot before the truck arrives.')}
            ${caption(2, 'Scan', 'Every pallet counted.', 'From above, dispatch sees exactly what is on board and what is still missing.')}
            ${caption(3, 'Track', 'Followed all the way.', 'The route is live from the yard to the last drop.')}
            <span class="j-hint">${ic('right')}Scroll</span>
          </div></section>
          <section class="f-stats">${[['98%', 'on-time drops'], ['140', 'trucks on the road'], ['16', 'regions covered']].map((x) => `<div><b>${x[0]}</b><small>${x[1]}</small></div>`).join('')}</section>
          <section class="s-points">${[['bolt', 'Same-day city runs', 'Booked before noon, delivered before dark.'], ['box', 'Cross-country haul', 'Full and part loads between every region.'], ['shield', 'Insured and sealed', 'Tamper seals and cover on every trip.']].map((p) => `<div><i>${ic(p[0])}</i><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</section>
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

  /* ── Auro headphones ───────────────────────────────────────────────── */
  const disc = (k, label, note, side, body) => `<g class="part" style="--k:${k}"><g class="pt">${body}</g>
      <g class="lbl ${side}" style="--i:${k + 2}"><path d="M200 ${side === 'up' ? 118 : 302} V${side === 'up' ? 84 : 336}"/><circle cx="200" cy="${side === 'up' ? 84 : 336}" r="2.500"/>
      <text x="200" y="${side === 'up' ? 66 : 356}">${label}</text><text class="n" x="200" y="${side === 'up' ? 50 : 372}">${note}</text></g></g>`;
  const rim = (fill, edge) => `<ellipse cx="208" cy="210" rx="26" ry="80" fill="${edge}"/><rect x="200" y="130" width="8" height="160" fill="${edge}"/><ellipse cx="200" cy="210" rx="26" ry="80" fill="${fill}"/>`;
  function cupScene() {
    return `<svg class="au-svg" viewBox="0 0 400 420" aria-hidden="true">
        <g class="band"><path d="M214 132 C 250 20, 380 10, 392 150" fill="none" stroke="var(--au)" stroke-width="16" stroke-linecap="round"/><path d="M214 132 C 250 20, 380 10, 392 150" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".25"/></g>
        ${disc(2, 'Aluminium shell', 'Machined, 0.8 mm', 'up', rim('var(--au)', '#0c0d10') + '<ellipse cx="200" cy="210" rx="15" ry="46" fill="none" stroke="#fff" stroke-width="1.500" opacity=".5"/><ellipse cx="200" cy="210" rx="4" ry="12" fill="#fff" opacity=".7"/>')}
        ${disc(1, 'Battery and board', '30 hours per charge', 'down', rim('#1f6f55', '#0d2f25') + '<rect x="188" y="170" width="24" height="44" rx="5" fill="#d9dde3"/><rect x="192" y="224" width="16" height="12" rx="2" fill="#111"/><rect x="190" y="244" width="8" height="8" rx="1.500" fill="#f2b84b"/><rect x="202" y="244" width="8" height="8" rx="1.500" fill="#f2b84b"/>')}
        ${disc(0, '40 mm driver', 'Titanium-coated', 'up', rim('#3a3d44', '#101114') + [60, 44, 28].map((r, i) => `<ellipse cx="200" cy="210" rx="${r / 3}" ry="${r}" fill="none" stroke="${['#6b707a', '#c58a3a', '#8b909a'][i]}" stroke-width="${i === 1 ? 4 : 2}"/>`).join('') + '<ellipse cx="200" cy="210" rx="5" ry="14" fill="#c9ccd3"/>')}
        ${disc(-1, 'Acoustic mesh', 'Tuned for clarity', 'down', rim('#24262b', '#0c0d10') + [-52, -36, -20, -4, 12, 28, 44].map((y) => [-9, 0, 9].map((x) => `<circle cx="${200 + x}" cy="${210 + y + (x ? 4 : 0)}" r="2" fill="#5b606a"/>`).join('')).join(''))}
        ${disc(-2, 'Memory foam', 'Cooling gel layer', 'up', '<ellipse cx="210" cy="210" rx="30" ry="88" fill="#0b0c0e"/><rect x="200" y="122" width="10" height="176" fill="#0b0c0e"/><ellipse cx="200" cy="210" rx="30" ry="88" fill="#34373e"/><ellipse cx="200" cy="210" rx="16" ry="54" fill="#0f1013"/><ellipse cx="196" cy="180" rx="6" ry="30" fill="#fff" opacity=".07"/>')}
      </svg>`;
  }
  const COLORS = [['Graphite', '#6d7480'], ['Sand', '#c9a37a'], ['Forest', '#2f7d5c'], ['Ember', '#d5563a']];
  const TUNES = { Balanced: [50, 55, 60, 58, 52, 50], Bass: [92, 80, 58, 46, 44, 48], Vocal: [36, 48, 78, 88, 70, 50], Bright: [40, 44, 56, 70, 86, 94] };
  P.IDEAS.auro = {
    key: 'auro', kind: 'site', name: 'Auro', mark: 'A', accent: '#6d7480', domain: 'auro.preview', cls: 'x-auro',
    prompt: 'A product website for a headphone company where the headphones come apart into labelled parts as you scroll.',
    cta: 'Pre-order', ctaGo: 'order',
    screens: [{ key: 'home', name: 'Home', desc: 'Scroll story: exploded view' }, { key: 'sound', name: 'Sound', desc: 'Tuning presets and specs' }, { key: 'order', name: 'Pre-order', desc: 'Colour, quantity, engraving' }, { key: 'sent', name: 'Confirmation', desc: 'Pre-order placed' }],
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
            ${cupScene()}
            ${caption(1, 'Auro One', 'Hear everything.', 'Scroll to open it up and see what is inside.')}
            ${caption(2, 'Inside', 'Five layers. Nothing wasted.', 'Each part is tuned to the one beside it, from the foam to the shell.')}
            ${caption(3, '248 g', 'Back together, it disappears.', 'Light enough to forget you are wearing it.')}
            <span class="j-hint">${ic('right')}Scroll</span>
          </div></section>
          <section class="s-sec"><span class="s-tag">Finish</span><h2>${c[0]}</h2>${swatches}</section>
          <section class="s-points">${[['moon', 'Adaptive noise cancelling', 'Six microphones read the room 800 times a second.'], ['bolt', '30 hours, 5-minute top-up', 'Five minutes on the cable gives four hours.'], ['layers', 'Two devices at once', 'Laptop and phone, without re-pairing.']].map((p) => `<div><i>${ic(p[0])}</i><b>${p[1]}</b><small>${p[2]}</small></div>`).join('')}</section>
          <section class="x-price dark"><small>Auro One</small><b>${money(1890)}</b><button class="p-btn" data-go="order">Pre-order</button></section>`;
      else if (key === 'sound') body = `<section class="s-sec"><span class="s-tag">Sound</span><h1>Tune it your way.</h1><p class="s-lead">Pick a profile and watch the curve change.</p>
          <div class="p-chips">${Object.keys(TUNES).map((t) => `<button data-act="tune:${t}"${st.tune === t ? ' class="on"' : ''}>${t}</button>`).join('')}</div>
          <div class="p-chart eq">${TUNES[st.tune].map((v, i) => `<div><i style="height:${v}%"></i><small>${['60', '250', '1k', '4k', '8k', '16k'][i]}</small></div>`).join('')}</div>
          <div class="p-rows">${[['Driver', '40 mm titanium-coated'], ['Frequency', '5 Hz to 40 kHz'], ['Battery', '30 hours with ANC'], ['Weight', '248 g'], ['Codec', 'LDAC, AAC, SBC']].map((r) => `<div><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>
          <button class="p-btn" data-go="order">Pre-order</button></section>`;
      else if (key === 'order') body = `<section class="s-sec narrow"><h1>Pre-order</h1><div class="au-mini">${cupScene()}</div>
          <div class="p-head"><h3>Finish: ${c[0]}</h3></div>${swatches}
          <div class="p-between"><b>Quantity</b>${K.stepper('qty', st.qty)}</div>
          ${K.field('Engraving (optional)')}
          <div class="p-rows"><div><span>Ships</span><b>February</b></div><div><span>Total</span><b>${money(1890 * st.qty)}</b></div></div>
          <button class="p-btn" data-go="sent">Place pre-order</button></section>`;
      else body = K.sent('Pre-order placed', `${st.qty} × Auro One in ${c[0]}. You will not be charged until it ships.`);
      return `<div class="au-root" style="--au:${c[1]}">` + K.siteNav(d, key, [['home', 'Auro One'], ['sound', 'Sound']]) + `<div class="s-body">${body}</div>` + K.siteFoot(d) + '</div>';
    }
  };
})();
