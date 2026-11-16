/* Selasi AI concept build: illustrations drawn in code for the prototype
   image slots. Each entry is an inline SVG (120 x 90) that fills its slot.
   A real photo registered in assets/img/photos.js takes priority. */
(function () {
  'use strict';

  const svg = (bg, body) => `<svg class="art" viewBox="0 0 120 90" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="120" height="90" fill="${bg}"/>${body}</svg>`;
  const glow = (x, y, r, c, o) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o || 0.35}"/>`;
  const dots = (pts, r, c) => pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${c}"/>`).join('');

  /* Top-down plate on a table */
  const plate = (bg, food, cloth) => svg(bg,
    glow(96, 10, 34, '#fff', 0.18) + (cloth ? `<path d="M0 62 L120 48 V90 H0z" fill="${cloth}" opacity=".55"/>` : '') +
    '<ellipse cx="60" cy="50" rx="41" ry="33" fill="#000" opacity=".12"/><circle cx="60" cy="46" r="34" fill="#fbfaf7"/><circle cx="60" cy="46" r="27" fill="none" stroke="#e7e2d8" stroke-width="1.500"/>' + food);
  const leaf = (x, y, r) => `<path d="M${x} ${y} q6 -8 13 -2 q-6 8 -13 2z" fill="#3f9b4b" transform="rotate(${r || 0} ${x} ${y})"/>`;

  const A = {};

  /* ── Food ── */
  A['food-jollof'] = plate('#f3d9b8',
    '<ellipse cx="54" cy="49" rx="20" ry="15" fill="#e8772e"/>' + dots([[46, 46], [52, 53], [58, 44], [62, 52], [50, 42], [66, 47]], 1.300, '#c9551c') +
    '<path d="M62 30 q14 -4 18 8 q2 9 -8 12 q-10 2 -13 -7 q-2 -9 3 -13z" fill="#8a4a22"/><path d="M66 34 q8 -1 10 6" fill="none" stroke="#b56a35" stroke-width="2" stroke-linecap="round"/>' +
    '<circle cx="42" cy="34" r="5" fill="#d93a2b"/><circle cx="42" cy="34" r="2.500" fill="#f08a7c"/>' + leaf(36, 60, -20) + leaf(70, 62, 30), '#e2622f');
  A['food-waakye'] = plate('#e9d5c3',
    '<ellipse cx="52" cy="50" rx="19" ry="14" fill="#7a3528"/>' + dots([[45, 48], [52, 54], [58, 47], [50, 44], [62, 53]], 1.400, '#4f1f17') +
    '<ellipse cx="72" cy="38" rx="9" ry="7" fill="#fff"/><circle cx="72" cy="38" r="3.600" fill="#f5b82e"/>' +
    '<path d="M36 34 q6 -6 12 0 t12 0" fill="none" stroke="#f0cf6b" stroke-width="2.600" stroke-linecap="round"/><path d="M38 39 q6 -6 12 0" fill="none" stroke="#e6bd4d" stroke-width="2.600" stroke-linecap="round"/>' +
    '<ellipse cx="74" cy="58" rx="7" ry="5" fill="#2a1a16"/>', '#a8452f');
  A['food-banku'] = plate('#dfe6e2',
    '<circle cx="45" cy="42" r="10" fill="#f1ecdd"/><circle cx="52" cy="56" r="9" fill="#ece6d4"/><path d="M40 39 q5 -4 10 0" fill="none" stroke="#d9d1bb" stroke-width="1.200"/>' +
    '<path d="M60 40 q12 -10 24 0 q-12 10 -24 0z" fill="#6f8794"/><path d="M84 40 l7 -6 v12z" fill="#5a707c"/><circle cx="66" cy="39" r="1.200" fill="#1c2a31"/><path d="M70 36 v8 M75 35.500 v9" stroke="#536873" stroke-width="1"/>' +
    '<ellipse cx="72" cy="57" rx="9" ry="6" fill="#c93a23"/>' + dots([[69, 56], [74, 58], [76, 55]], 1, '#f2a03a'), '#4f7f86');
  A['food-kelewele'] = svg('#f6dfae',
    glow(20, 12, 30, '#fff', 0.2) + '<path d="M30 20 L92 20 L66 84z" fill="#fbf6ea"/><path d="M30 20 L92 20 L84 30 L38 30z" fill="#efe6d0"/>' +
    [[42, 30, 10], [56, 26, -15], [70, 31, 25], [50, 42, 30], [64, 44, -10], [57, 56, 12], [48, 34, 50]].map((p) => `<rect x="${p[0]}" y="${p[1]}" width="10" height="9" rx="2.500" fill="#c8641c" transform="rotate(${p[2]} ${p[0] + 5} ${p[1] + 4})"/><rect x="${p[0] + 1.500}" y="${p[1] + 1.500}" width="4" height="2" rx="1" fill="#e89846" transform="rotate(${p[2]} ${p[0] + 5} ${p[1] + 4})"/>`).join('') +
    dots([[80, 40], [76, 46], [84, 34], [45, 50], [70, 56]], 2.200, '#e3c58f'));
  A['food-fufu'] = svg('#e8d9c4',
    glow(100, 14, 30, '#fff', 0.2) + '<ellipse cx="60" cy="54" rx="42" ry="30" fill="#000" opacity=".12"/><circle cx="60" cy="48" r="35" fill="#5b3a2a"/><circle cx="60" cy="48" r="30" fill="#d9742a"/>' + glow(52, 40, 12, '#f2a04a', 0.6) +
    '<circle cx="58" cy="47" r="13" fill="#f6f1e4"/><path d="M50 44 q8 -6 15 0" fill="none" stroke="#e2dac6" stroke-width="1.300"/>' +
    '<rect x="72" y="52" width="10" height="8" rx="3" fill="#7b3f24"/><rect x="38" y="56" width="9" height="7" rx="3" fill="#8a4a2a"/>' + leaf(74, 38, 20));
  A['food-sobolo'] = svg('#f4c9cf',
    glow(20, 16, 30, '#fff', 0.25) + '<path d="M44 16 h32 l-5 62 h-22z" fill="#fff" opacity=".55"/><path d="M46 30 h28 l-4 46 h-20z" fill="#9c1f3d"/>' +
    '<rect x="51" y="36" width="9" height="9" rx="2" fill="#fff" opacity=".4" transform="rotate(14 55 40)"/><rect x="60" y="48" width="9" height="9" rx="2" fill="#fff" opacity=".35" transform="rotate(-12 64 52)"/>' +
    '<path d="M66 8 l-6 40" stroke="#2f8f58" stroke-width="2.600" stroke-linecap="round"/>' + leaf(58, 26, -30) + '<circle cx="74" cy="18" r="7" fill="#f4a938"/><path d="M74 11 v14 M67 18 h14" stroke="#f8c873" stroke-width="1"/>');

  /* ── Bakery ── */
  const table = (bg, c) => `<rect y="64" width="120" height="26" fill="${c}"/>` + glow(92, 8, 30, '#fff', 0.22);
  const loaf = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 22 q-2 -22 22 -22 h18 q24 0 22 22 q0 6 -6 6 h-50 q-6 0 -6 -6z" fill="${c || '#c9843f'}"/><path d="M16 4 l6 9 M30 3 l6 9 M44 4 l6 9" stroke="#f1d29a" stroke-width="2.400" stroke-linecap="round"/></g>`;
  const cake = (x, y, s, ice, top) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="16" width="52" height="26" rx="4" fill="#6b3a23"/><path d="M0 20 q0 -6 6 -6 h40 q6 0 6 6 v4 q-4 6 -8 0 q-4 7 -9 0 q-4 6 -8 0 q-5 7 -9 0 q-4 6 -10 0z" fill="${ice}"/><rect x="0" y="30" width="52" height="3" fill="#f3d9a8"/>${top || ''}</g>`;
  A['bakery-butter-bread'] = svg('#f2dcb9', table('', '#d7b78a') + loaf(26, 34, 1.100));
  A['bakery-banana-loaf'] = svg('#f4e3a8', table('', '#dcc27c') + loaf(20, 36, 0.900, '#a8692c') + '<ellipse cx="88" cy="58" rx="14" ry="11" fill="#b9793a"/><ellipse cx="88" cy="58" rx="10" ry="7.500" fill="#f0d79a"/>' + dots([[85, 57], [91, 60], [89, 54]], 1.200, '#7a4a1c'));
  A['bakery-meat-pie'] = svg('#f1d6b6', table('', '#d2ac83') + '<path d="M22 62 q38 -44 76 0z" fill="#d49a4a"/><path d="M22 62 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q4 -5 8 0 q2 -3 4 0" fill="none" stroke="#b97a2e" stroke-width="2.600" stroke-linecap="round"/><path d="M50 44 l4 6 M60 40 l0 8 M70 44 l-4 6" stroke="#f3d7a0" stroke-width="2" stroke-linecap="round"/>');
  A['bakery-cinnamon-rolls'] = svg('#f0d4c0', table('', '#d1a98c') + [[36, 46], [66, 40], [88, 54], [54, 60]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="14" fill="#c98a4b"/><path d="M${p[0]} ${p[1]} m-9 0 a9 9 0 1 1 9 9 a6 6 0 1 1 -6 -6 a3 3 0 1 1 3 3" fill="none" stroke="#8a4f22" stroke-width="2" stroke-linecap="round"/><path d="M${p[0] - 8} ${p[1] - 6} q8 -6 16 0" stroke="#fff6e6" stroke-width="2.400" fill="none" stroke-linecap="round" opacity=".9"/>`).join(''));
  A['bakery-chocolate-cake'] = svg('#ecd2c6', table('', '#cfa593') + cake(30, 22, 1.150, '#3b1f14', '<circle cx="26" cy="11" r="5" fill="#c9263c"/><path d="M26 6 q4 -6 8 -5" fill="none" stroke="#3f7a3a" stroke-width="1.400"/>'));
  A['bakery-birthday-cake'] = svg('#f6d2dc', table('', '#e2a9ba') + cake(30, 24, 1.150, '#fff4f7', [10, 20, 30, 40].map((x, i) => `<rect x="${x}" y="2" width="3" height="12" rx="1" fill="${['#5b63d6', '#e2622f', '#1f8a5b', '#c2255c'][i]}"/><path d="M${x + 1.500} -4 q3 4 0 6 q-3 -2 0 -6z" fill="#f5a623"/>`).join('')) + dots([[18, 16], [100, 22], [108, 44], [12, 40]], 2, '#fff'));
  A['bakery-hero'] = svg('#f0d5b4', table('', '#d1ab7f') + loaf(8, 40, 0.800) + cake(58, 26, 0.950, '#fff4e8', '<circle cx="26" cy="11" r="5" fill="#c9263c"/>') + '<circle cx="46" cy="62" r="10" fill="#c98a4b"/><path d="M46 62 m-6 0 a6 6 0 1 1 6 6 a4 4 0 1 1 -4 -4" fill="none" stroke="#8a4f22" stroke-width="1.600"/>' + '<path d="M70 12 q3 -5 0 -10 M80 14 q3 -5 0 -10 M90 12 q3 -5 0 -10" fill="none" stroke="#fff" stroke-width="1.600" stroke-linecap="round" opacity=".7"/>');
  A['bakery-story'] = svg('#e9cdb0', glow(26, 20, 30, '#fff', 0.22) + '<rect x="24" y="14" width="72" height="62" rx="6" fill="#6f4a3a"/><rect x="32" y="30" width="56" height="34" rx="4" fill="#2b1c16"/>' + glow(60, 56, 18, '#f59a2e', 0.75) + loaf(40, 40, 0.650, '#d99a4c') + '<circle cx="36" cy="22" r="3" fill="#f3d9a8"/><circle cx="48" cy="22" r="3" fill="#f3d9a8"/><rect x="62" y="19" width="26" height="6" rx="3" fill="#8a6352"/>');

  /* ── Events ── */
  A['event-afro'] = svg('#2a1140',
    '<path d="M20 0 L52 90 H-10z" fill="#ff5fa2" opacity=".22"/><path d="M100 0 L128 90 H66z" fill="#7c5cff" opacity=".28"/>' + glow(60, 50, 38, '#ff5fa2', 0.2) +
    '<circle cx="60" cy="48" r="26" fill="#14091f"/>' + [22, 17, 12].map((r) => `<circle cx="60" cy="48" r="${r}" fill="none" stroke="#5b3b7a" stroke-width=".800"/>`).join('') + '<circle cx="60" cy="48" r="8" fill="#ff5fa2"/><circle cx="60" cy="48" r="2" fill="#14091f"/>' +
    [8, 16, 24, 96, 104, 112].map((x, i) => `<rect x="${x - 2}" y="${78 - [14, 24, 10, 20, 12, 26][i]}" width="4" height="${[14, 24, 10, 20, 12, 26][i]}" rx="2" fill="#ffd166"/>`).join(''));
  A['event-tech'] = svg('#0f1b33',
    glow(92, 16, 36, '#3b82f6', 0.3) + '<path d="M20 66 L44 38 L70 54 L98 24 M44 38 L60 16 M70 54 L86 74" fill="none" stroke="#4f8cff" stroke-width="1.400" opacity=".8"/>' + dots([[20, 66], [44, 38], [70, 54], [98, 24], [60, 16], [86, 74]], 4, '#9fc1ff') + dots([[20, 66], [44, 38], [70, 54], [98, 24], [60, 16], [86, 74]], 1.800, '#0f1b33') +
    '<rect x="8" y="10" width="26" height="16" rx="3" fill="#1c2f55"/><path d="M12 15 h12 M12 20 h18" stroke="#6fa0ff" stroke-width="1.600" stroke-linecap="round"/>');
  A['event-art'] = svg('#f7efe2',
    '<path d="M-6 60 q30 -44 60 -14 q24 22 72 -20 V90 H-6z" fill="#f2b84b"/><circle cx="34" cy="30" r="18" fill="#e2573f"/><path d="M62 10 h42 v40 h-42z" fill="#2f6fd0"/><path d="M62 50 l20 -22 l22 22z" fill="#1f8a5b"/>' +
    '<circle cx="92" cy="22" r="6" fill="#f7efe2"/><path d="M10 74 q20 -12 40 0 t40 0" fill="none" stroke="#3b2a22" stroke-width="2.400" stroke-linecap="round"/>');
  A['event-run'] = svg('#ffd9a0',
    '<rect width="120" height="34" fill="#ffb86b"/><rect y="34" width="120" height="14" fill="#ff9d5c"/><circle cx="60" cy="50" r="20" fill="#fff3c4"/><circle cx="60" cy="50" r="13" fill="#ffe082"/>' +
    '<path d="M0 50 L22 40 L40 50 L62 34 L88 50 L104 42 L120 50 V90 H0z" fill="#3d5a4c"/><path d="M48 90 L58 54 h4 L72 90z" fill="#2a2f36"/><path d="M60 58 v6 M60 70 v8 M60 84 v6" stroke="#fff" stroke-width="1.400"/>');

  /* ── Workout ── */
  A['gym-push'] = svg('#0b6f7c',
    glow(100, 6, 44, '#35c2d1', 0.35) + '<path d="M0 70 L120 56 V90 H0z" fill="#085863"/>' +
    '<g transform="rotate(-14 60 46)"><rect x="34" y="42" width="52" height="7" rx="3" fill="#dfe7ea"/><rect x="22" y="28" width="9" height="35" rx="3" fill="#10242b"/><rect x="31" y="33" width="6" height="25" rx="2.500" fill="#22414b"/><rect x="89" y="28" width="9" height="35" rx="3" fill="#10242b"/><rect x="83" y="33" width="6" height="25" rx="2.500" fill="#22414b"/></g>' +
    '<path d="M10 20 h14 M6 28 h10 M100 72 h12" stroke="#bdf1f6" stroke-width="2" stroke-linecap="round" opacity=".7"/>');

  /* ── Portfolio ── */
  const mock = (bg, inner) => svg(bg, glow(98, 10, 36, '#fff', 0.3) + '<rect x="40" y="8" width="40" height="76" rx="7" fill="#12141a"/><rect x="43" y="11" width="34" height="70" rx="5" fill="#fff"/>' + inner);
  A['portfolio-wallet'] = mock('#dcdcfb', '<rect x="46" y="16" width="28" height="18" rx="3.500" fill="#5b63d6"/><circle cx="68" cy="21" r="3" fill="#fff" opacity=".6"/><rect x="48" y="28" width="12" height="2.500" rx="1.200" fill="#fff" opacity=".8"/><path d="M47 40 h26 M47 47 h20 M47 54 h24" stroke="#d6d9e4" stroke-width="2.600" stroke-linecap="round"/><rect x="46" y="64" width="28" height="9" rx="4.500" fill="#12141a"/>' +
    '<rect x="8" y="30" width="26" height="17" rx="3" fill="#7d84e8" transform="rotate(-10 21 38)"/><rect x="86" y="46" width="26" height="17" rx="3" fill="#3a41a8" transform="rotate(8 99 54)"/>');
  A['portfolio-clinic'] = mock('#d6efe6', '<rect x="46" y="15" width="28" height="6" rx="3" fill="#1f8a5b"/>' + [0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => `<rect x="${46.500 + c * 7}" y="${26 + r * 8}" width="5.500" height="6" rx="1.500" fill="${r === 1 && c === 2 ? '#1f8a5b' : '#e3e8e6'}"/>`).join('')).join('') + '<rect x="46" y="64" width="28" height="9" rx="4.500" fill="#1f8a5b"/>' +
    '<path d="M16 34 h10 M21 29 v10" stroke="#1f8a5b" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="56" r="10" fill="#fff"/><path d="M100 50 v6 l4 3" stroke="#1f8a5b" stroke-width="2" fill="none" stroke-linecap="round"/>');
  A['portfolio-courier'] = mock('#fbe3cf', '<rect x="43" y="11" width="34" height="42" fill="#eef1ea"/><path d="M46 46 q8 -18 16 -8 t12 -18" fill="none" stroke="#e2622f" stroke-width="2" stroke-dasharray="3 2.500"/><circle cx="46" cy="46" r="2.600" fill="#12141a"/><path d="M74 14 q5 0 5 5 q0 4 -5 9 q-5 -5 -5 -9 q0 -5 5 -5z" fill="#e2622f" transform="translate(-4 -2)"/><path d="M47 60 h22 M47 67 h14" stroke="#d6d9e4" stroke-width="2.600" stroke-linecap="round"/>' +
    '<rect x="8" y="52" width="24" height="18" rx="2" fill="#c98a4b"/><path d="M8 58 h24 M20 52 v18" stroke="#a66c33" stroke-width="1.600"/>');
  A['portfolio-goals'] = mock('#ffe2ea', '<circle cx="60" cy="34" r="13" fill="none" stroke="#f3d3dc" stroke-width="5"/><path d="M60 21 a13 13 0 1 1 -12.400 9" fill="none" stroke="#c2255c" stroke-width="5" stroke-linecap="round"/><path d="M47 58 h26 M47 65 h18" stroke="#d6d9e4" stroke-width="2.600" stroke-linecap="round"/><rect x="46" y="71" width="28" height="6" rx="3" fill="#c2255c"/>' +
    '<circle cx="20" cy="28" r="9" fill="#f5a623"/><circle cx="20" cy="28" r="5" fill="#ffd27a"/><circle cx="100" cy="62" r="7" fill="#f5a623"/>');
  A['portfolio-esi'] = svg('#d9dcfb',
    glow(96, 12, 34, '#fff', 0.35) + '<path d="M22 90 q0 -30 38 -30 q38 0 38 30z" fill="#5b63d6"/><rect x="52" y="48" width="16" height="16" rx="6" fill="#8a5a3c"/>' +
    '<circle cx="60" cy="26" r="24" fill="#22181a"/><ellipse cx="60" cy="38" rx="15" ry="17" fill="#9b6744"/><path d="M45 34 q15 -14 30 0 q-2 -12 -15 -12 q-13 0 -15 12z" fill="#22181a"/>' +
    '<circle cx="54" cy="38" r="1.600" fill="#1b1213"/><circle cx="66" cy="38" r="1.600" fill="#1b1213"/><path d="M54 46 q6 5 12 0" fill="none" stroke="#5c2f22" stroke-width="1.600" stroke-linecap="round"/><circle cx="44" cy="44" r="2.400" fill="#f5c14a"/><circle cx="76" cy="44" r="2.400" fill="#f5c14a"/>');

  /* ── Barbershop ── */
  const pole = (x, y, h) => `<g transform="translate(${x} ${y})"><rect x="-1" y="-6" width="14" height="6" rx="3" fill="#c9ccd3"/><rect x="0" y="0" width="12" height="${h}" fill="#fff"/>${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M0 ${i * 9 - 4} l12 -7 v5 l-12 7z" fill="${i % 2 ? '#2f6fd0' : '#d93a2b'}"/>`).join('')}<rect x="-1" y="${h}" width="14" height="6" rx="3" fill="#c9ccd3"/></g>`;
  A['salon-hero'] = svg('#17181d',
    '<path d="M70 0 L120 0 L120 90 L30 90z" fill="#b7791f" opacity=".16"/><path d="M92 0 L120 0 L120 90 L64 90z" fill="#b7791f" opacity=".2"/>' + glow(96, 22, 30, '#f2b65a', 0.28) +
    '<clipPath id="sp"><rect x="92" y="18" width="12" height="46"/></clipPath><g clip-path="url(#sp)">' + pole(92, 18, 46) + '</g><rect x="91" y="12" width="14" height="6" rx="3" fill="#c9ccd3"/><rect x="91" y="64" width="14" height="6" rx="3" fill="#c9ccd3"/>' +
    '<g stroke="#e9c58a" stroke-width="2.400" fill="none" stroke-linecap="round" opacity=".9"><circle cx="64" cy="66" r="6"/><circle cx="78" cy="72" r="6"/><path d="M68 61 L84 26 M74 67 L62 28"/></g>');
  A['salon-shop'] = svg('#e8dcc8',
    glow(20, 12, 30, '#fff', 0.3) + '<rect x="18" y="24" width="84" height="58" fill="#2b2a2e"/><path d="M14 24 h92 l-6 -12 h-80z" fill="#b7791f"/>' + [0, 1, 2, 3, 4, 5].map((i) => `<path d="M${22 + i * 14} 12 h7 l1 12 h-9z" fill="#f4e7cf"/>`).join('') +
    '<rect x="26" y="34" width="34" height="30" rx="2" fill="#f6d68a"/><path d="M26 34 l34 30" stroke="#fff" stroke-width="3" opacity=".35"/><rect x="68" y="34" width="22" height="48" rx="2" fill="#6b4a2a"/><circle cx="86" cy="60" r="1.800" fill="#f2c96a"/>' +
    '<clipPath id="sq"><rect x="6" y="36" width="8" height="34"/></clipPath><g clip-path="url(#sq)" transform="scale(.7) translate(4 22)">' + pole(6, 30, 50) + '</g><rect y="82" width="120" height="8" fill="#b9ab94"/>');

  window.SelasiArt = A;
})();
