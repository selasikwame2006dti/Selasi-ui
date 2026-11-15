/* Selasi device lock-screen models.
 *
 * One self-contained renderer for the preview's idle state. The drawer loads
 * the full hardware model (iPhone / Galaxy), the fullscreen overlay loads the
 * screen-only art, and both share the same wallpapers, clock faces and live
 * time/date/battery/connectivity sync. Local fonts only, no CDN.
 */
(function () {
  'use strict';

  const VERSION = '3';
  const PHONE_SCREEN = { x: 301.4, y: 151.2, w: 597.2, h: 1297.6 };
  // The studio authored ONE phone rect, but each device has its own true CSS
  // viewport — every screen now derives from its OWN aspect ratio, so no
  // device inherits another's proportions (the S26's glass used to come out
  // iPhone-shaped: 895px tall instead of its real 915).
  const PHONE_VIEW = {
    iphone: { w: 393, h: 852 },
    android: { w: 412, h: 915 }
  };
  const PHONE_BEZEL = 16.9;           // outer chassis = screen + 2 × bezel (studio)
  const PHONE_BOTTOM_MARGIN = 12.3;   // frame viewBox breathing room below the chassis

  function phoneScreen(device) {
    if (device !== 'iphone' && device !== 'android') return PHONE_SCREEN;
    const v = PHONE_VIEW[device];
    const h = Number((PHONE_SCREEN.w * v.h / v.w).toFixed(2));
    if (h === PHONE_SCREEN.h) return PHONE_SCREEN;
    return { x: PHONE_SCREEN.x, y: PHONE_SCREEN.y, w: PHONE_SCREEN.w, h: h };
  }

  // The frame viewBox for a phone: the studio box, extended downward exactly
  // as far as this device's screen extends past the base (studio) rect, with
  // the studio's margins preserved — so chassis + screen always agree.
  function phoneFrameView(device) {
    const s = phoneScreen(device);
    const bottom = s.y + s.h + PHONE_BEZEL + PHONE_BOTTOM_MARGIN;
    return { x: 264, y: 118, w: 672, h: Number((bottom - 118).toFixed(2)) };
  }

  function screenFrameBox(device) {
    const f = phoneFrameView(device);
    return `${f.x} ${f.y} ${f.w} ${f.h}`;
  }

  // Bottom-anchored artwork (shortcuts, home bar, antenna) rides the screen
  // bottom and moves with it; everything else is anchored from the top,
  // exactly like the studio lays it out.
  function phoneBottomShift(device) {
    return Number((phoneScreen(device).h - PHONE_SCREEN.h).toFixed(2));
  }

  function screenViewBox(device) {
    const s = phoneScreen(device);
    return `${s.x} ${s.y} ${s.w} ${s.h}`;
  }

  const SCREEN_VIEWBOX = {
    iphone: screenViewBox('iphone'),
    android: screenViewBox('android'),
    tablet: '0 0 1200 1719',
    laptop: '258 54 1084 672'
  };
  const FRAME_VIEWBOX = {
    iphone: screenFrameBox('iphone'),
    android: screenFrameBox('android')
  };
  const BATMAN_PATH = 'M388.3,801.1L389.4,802.8L394.6,802.1L412.2,802.1L414.3,802.8L420.6,803.2L425.9,804.6L428.7,804.6L441.0,808.4L443.9,810.2L450.2,812.7L451.6,814.1L454.1,815.1L461.1,820.4L462.9,821.1L469.5,826.7L472.3,828.5L480.1,835.2L487.5,842.9L495.2,852.8L499.1,861.5L500.1,865.8L500.1,868.9L501.2,870.0L509.6,865.8L513.1,865.1L515.6,863.7L517.7,863.7L526.1,861.2L537.4,860.1L547.6,860.5L549.0,861.2L553.2,861.5L562.4,864.4L563.8,864.4L567.6,866.1L574.3,870.0L577.1,872.4L580.7,874.6L589.1,882.6L597.2,893.2L599.6,898.1L601.1,899.5L601.8,901.6L603.5,901.6L604.2,900.9L606.7,895.7L609.5,892.1L610.5,889.7L615.5,884.4L615.8,883.3L621.8,877.4L633.8,868.2L635.5,867.9L636.9,866.8L644.3,863.7L647.8,862.9L649.9,861.9L653.5,861.9L661.9,860.5L670.7,860.5L678.1,861.9L681.9,861.9L684.8,863.3L687.2,863.3L693.5,865.4L696.0,866.8L699.2,867.5L703.0,870.0L704.4,870.0L705.5,868.2L705.5,865.1L706.6,861.5L710.4,852.8L717.8,842.9L729.4,831.6L731.9,830.2L735.4,826.7L738.6,825.0L740.7,822.9L748.1,817.6L750.2,816.9L751.6,815.1L764.9,808.4L767.0,808.1L768.8,807.0L770.6,807.0L775.5,805.3L785.7,803.2L805.4,802.1L813.5,802.8L817.0,802.5L815.6,796.5L812.4,789.8L810.3,787.0L809.6,784.9L806.8,782.1L803.3,777.1L797.3,770.8L789.5,763.8L776.9,753.9L766.3,746.9L764.6,746.5L763.2,745.1L754.7,740.9L752.3,740.2L749.8,738.5L747.7,738.1L744.5,736.3L741.7,735.6L738.6,733.9L735.4,733.2L734.0,732.1L730.8,731.4L728.4,730.0L724.8,729.3L722.4,727.9L718.2,726.9L716.4,725.8L713.2,725.4L711.5,724.4L705.9,723.0L701.6,721.2L700.6,721.2L699.2,722.3L698.8,727.9L697.8,733.5L693.9,742.7L689.3,749.7L686.9,751.8L686.5,753.2L685.1,753.9L683.0,756.4L679.5,759.2L670.3,765.2L667.5,766.2L666.1,767.6L649.2,774.0L631.3,777.8L628.8,777.8L627.1,776.4L626.4,774.7L625.7,761.0L625.0,757.4L625.0,751.8L623.9,746.9L623.2,733.9L622.5,732.1L622.2,726.9L621.5,726.9L620.4,727.9L618.6,732.1L616.5,734.6L616.2,737.1L614.4,738.8L614.1,740.6L612.7,742.3L610.2,743.0L608.8,742.7L594.7,743.0L593.3,742.7L591.2,740.6L590.9,738.8L588.7,736.0L585.2,728.6L583.5,726.1L582.8,726.5L582.1,739.9L581.0,745.1L580.7,754.3L579.6,762.0L579.6,765.9L578.9,767.6L578.5,776.1L576.8,777.8L574.3,777.8L564.5,775.7L562.4,775.7L558.9,774.3L553.6,773.3L551.1,771.9L549.4,771.9L547.2,770.5L544.4,770.1L542.7,768.7L539.5,767.6L537.8,766.2L532.5,763.8L525.4,758.9L517.0,751.1L515.6,748.7L513.5,746.5L508.2,735.6L506.1,726.9L506.1,722.3L505.1,721.2L503.6,721.2L499.4,723.0L488.2,726.1L483.2,728.3L481.8,728.3L479.4,729.7L478.0,729.7L474.5,731.4L469.5,732.8L468.8,733.5L465.3,734.2L463.6,735.6L461.4,736.0L442.1,745.1L433.0,751.1L431.6,751.5L410.5,768.4L401.7,777.5L395.3,785.2L395.0,787.0L393.2,788.7L390.4,794.4Z';

  const TALL_GLYPHS = { w: 56.6, colon: 20.1, gap: 14.5, y: 421.3, h: 298.5 };

  let batteryPct = 100;
  let batteryBound = false;
  let liveBound = false;

  function normalizeDevice(value) {
    const key = String(value || '').toLowerCase();
    if (key === 'android' || key === 'samsung' || key === 'galaxy' || key === 's26') return 'android';
    if (key === 'tablet' || key === 'ipad') return 'tablet';
    if (key === 'laptop' || key === 'mac' || key === 'macbook') return 'laptop';
    return 'iphone';
  }

  function buildRoundedPolygonPath(pts, radii) {
    const n = pts.length;
    let d = '';
    for (let i = 0; i < n; i++) {
      const prev = pts[(i - 1 + n) % n];
      const curr = pts[i];
      const next = pts[(i + 1) % n];
      const r = radii[i] || 0;
      if (r <= 0.1) {
        d += (i === 0 ? `M ${curr[0].toFixed(2)},${curr[1].toFixed(2)} ` : `L ${curr[0].toFixed(2)},${curr[1].toFixed(2)} `);
        continue;
      }
      const v1x = prev[0] - curr[0];
      const v1y = prev[1] - curr[1];
      const len1 = Math.hypot(v1x, v1y);
      const v2x = next[0] - curr[0];
      const v2y = next[1] - curr[1];
      const len2 = Math.hypot(v2x, v2y);
      const dot = (v1x * v2x + v1y * v2y) / (len1 * len2);
      const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
      const dist = Math.min(r / Math.tan(angle / 2), len1 * 0.45, len2 * 0.45);
      const p1x = curr[0] + (v1x / len1) * dist;
      const p1y = curr[1] + (v1y / len1) * dist;
      const p2x = curr[0] + (v2x / len2) * dist;
      const p2y = curr[1] + (v2y / len2) * dist;
      if (i === 0) d += `M ${p1x.toFixed(2)},${p1y.toFixed(2)} `;
      else d += `L ${p1x.toFixed(2)},${p1y.toFixed(2)} `;
      d += `Q ${curr[0].toFixed(2)},${curr[1].toFixed(2)} ${p2x.toFixed(2)},${p2y.toFixed(2)} `;
    }
    return d + 'Z';
  }

  function wallelfArt() {
    const r = 28;
    const halfGap = 13 / 2;
    const xLeft = 301;
    const xRight = 899;
    const c1Left = 727.5;
    const c1Right = 844.3;
    const c2Left = 1155.6;
    const c2Right = 1048.8;
    const yTop = 145;
    const yBot = 1455;
    const top = buildRoundedPolygonPath([
      [xLeft, yTop], [xRight, yTop], [xRight, c1Right - halfGap], [xLeft, c1Left - halfGap]
    ], [0, 0, r, r]);
    const mid = buildRoundedPolygonPath([
      [xLeft, c1Left + halfGap], [xRight, c1Right + halfGap], [xRight, c2Right - halfGap], [xLeft, c2Left - halfGap]
    ], [r, r, r, r]);
    const bot = buildRoundedPolygonPath([
      [xLeft, c2Left + halfGap], [xRight, c2Right + halfGap], [xRight, yBot], [xLeft, yBot]
    ], [r, r, 0, 0]);
    return `<g>
      <rect data-wallelf-bg x="0" y="0" width="1600" height="1600" fill="#020305" />
      <path data-wallelf-block="0" fill="#08283d" d="${top}" />
      <path data-wallelf-block="1" fill="#eeac34" d="${mid}" />
      <path data-wallelf-block="2" fill="#e7e8ea" d="${bot}" />
    </g>`;
  }

  function batmanArt(transform) {
    return `<g>
      <rect data-bat-sky x="0" y="0" width="1600" height="1600" fill="#8d9b9c" />
      <g transform="${transform}">
        <rect data-bat-pillar="0" x="387.9" y="800" width="111.5" height="720" fill="#7b8b8b" />
        <rect data-bat-pillar="1" x="498.7" y="800" width="104.0" height="720" fill="#6f7f7f" />
        <rect data-bat-pillar="2" x="602.1" y="800" width="104.0" height="720" fill="#5c6868" />
        <rect data-bat-pillar="3" x="705.5" y="800" width="111.8" height="720" fill="#697575" />
        <path data-bat-logo fill="#020303" fill-rule="evenodd" d="${BATMAN_PATH}" />
      </g>
    </g>`;
  }

  function makeRng(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }

  function stardustArt(width, height, count, seed) {
    const rnd = makeRng(seed);
    let dots = '';
    for (let i = 0; i < count; i++) {
      const x = (rnd() * width).toFixed(1);
      const y = (rnd() * height).toFixed(1);
      const r = (0.5 + rnd() * 1.7).toFixed(2);
      const o = (0.12 + rnd() * 0.62).toFixed(2);
      dots += `<circle cx="${x}" cy="${y}" r="${r}" fill="#e2e8f0" opacity="${o}" />`;
    }
    return `<g>
      <rect x="0" y="0" width="${width}" height="${height}" fill="#070709" />
      <rect x="0" y="0" width="${width}" height="${height}" fill="url(#stardustNebula)" />
      <g>${dots}</g>
      <circle cx="${(width * 0.72).toFixed(0)}" cy="${(height * 0.34).toFixed(0)}" r="${(width * 0.16).toFixed(0)}" fill="#3b2d63" opacity="0.10" />
      <circle cx="${(width * 0.28).toFixed(0)}" cy="${(height * 0.78).toFixed(0)}" r="${(width * 0.20).toFixed(0)}" fill="#173a4a" opacity="0.08" />
    </g>`;
  }

  function samsungWeatherChip() {
    return `<g transform="translate(705,372)">
      <circle cx="8" cy="8" r="6" fill="#0b0d0e" opacity="0.82" />
      <path d="M8 0.5v2.2M8 13.3v2.2M0.5 8h2.2M13.3 8h2.2M2.9 2.9l1.6 1.6M11.5 11.5l1.6 1.6M13.1 2.9l-1.6 1.6M4.5 11.5l-1.6 1.6" stroke="#0b0d0e" stroke-width="1.1" stroke-linecap="round" opacity="0.82" />
      <text x="23" y="12.5" fill="#0b0d0e" font-family="Inter, sans-serif" font-size="15" font-weight="700" opacity="0.88">24°</text>
    </g>`;
  }

  function samsungClockMarkup(translate, scale) {
    return `<g transform="translate(${translate[0]},${translate[1]}) scale(${scale})">
      <text data-lock-date="samsung" x="600" y="391" text-anchor="middle" fill="#0b0d0e" font-family="Inter, sans-serif" font-size="28" font-weight="600" letter-spacing="0.2">Tue, 20 Oct</text>
      ${samsungWeatherChip()}
      <g data-tall-clock clip-path="url(#s26ClockClip)" style="color:#0b0d0e"></g>
    </g>`;
  }

  function iphoneClockMarkup() {
    return `<g class="ls-soft-shadow">
      <text data-lock-date="phone" x="600" y="317" text-anchor="middle" fill="#ffffff" font-family="Inter, sans-serif" font-size="31" font-weight="600" letter-spacing="0.2">Monday, May 20</text>
      <text data-lock-time="phone" x="600" y="456" text-anchor="middle" fill="#ffffff" class="ls-stencil" font-size="144" font-weight="400" letter-spacing="2">9:41</text>
      <g transform="translate(359, 496)">
        <rect x="4" y="2" width="14" height="23" rx="3" fill="none" stroke="#ffffff" stroke-width="2.2" />
        <line x1="9" y1="21.5" x2="13" y2="21.5" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" />
        <text data-batt-pct x="28" y="21" fill="#ffffff" font-family="Inter, sans-serif" font-size="22" font-weight="500">100%</text>
        <text x="0" y="49" fill="#ffffff" font-family="Inter, sans-serif" font-size="21" font-weight="500">Selasi</text>
        <rect x="0" y="60" width="221" height="11" rx="5.5" fill="#ffffff" opacity="0.25" />
        <rect data-batt-fill data-max="221" x="0" y="60" width="221" height="11" rx="5.5" fill="#ffffff" />
      </g>
      <text x="738" y="558" text-anchor="middle" fill="#ffffff" class="ls-script" font-size="104">hello</text>
    </g>`;
  }

  function calendarWidget(today) {
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const monthLabel = today.toLocaleDateString('en-US', { month: 'long' }).toUpperCase();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const labels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    let cells = '';
    for (let i = 0; i < 7; i++) {
      cells += `<text x="${(i * 24.5).toFixed(1)}" y="26" text-anchor="middle" fill="#ffffff" opacity="0.6" font-family="Inter, sans-serif" font-size="10" font-weight="600">${labels[i]}</text>`;
    }
    const total = firstDow + daysInMonth;
    const rows = Math.ceil(total / 7);
    for (let n = 1; n <= daysInMonth; n++) {
      const idx = firstDow + n - 1;
      const col = idx % 7;
      const row = Math.floor(idx / 7);
      const x = col * 24.5;
      const y = 44 + row * 21;
      if (n === day) {
        cells += `<circle cx="${x.toFixed(1)}" cy="${(y - 4).toFixed(1)}" r="9.2" fill="#ffffff" />`;
        cells += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" fill="#090a0f" font-family="Inter, sans-serif" font-size="10.5" font-weight="700">${n}</text>`;
      } else {
        cells += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" fill="#ffffff" opacity="0.88" font-family="Inter, sans-serif" font-size="10.5" font-weight="600">${n}</text>`;
      }
    }
    return `<g transform="translate(6, 180)">
      <text x="0" y="6" fill="#ffffff" opacity="0.82" font-family="Inter, sans-serif" font-size="11" font-weight="700" letter-spacing="0.8">${monthLabel}</text>
      <g transform="translate(4, 6)">${cells}</g>
    </g>`;
  }

  function ipadWidgetsMarkup() {
    const today = new Date();
    return `<g transform="translate(110, 860) scale(1.35)">
      <path d="M 32 14 C 26 4, 10 6, 10 20 C 10 33, 28 43, 32 49 C 36 43, 54 33, 54 20 C 54 6, 38 4, 32 14 Z" fill="none" stroke="#ffffff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.92" />
      <g transform="translate(6, 86)">
        <line x1="2" y1="16" x2="14" y2="4" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
        <path d="M 24 2 L 19 10 L 24 10 L 21 18 L 29 9 L 24 9 Z" fill="#ffffff" />
        <text data-batt-pct x="34" y="15" fill="#ffffff" font-family="Inter, sans-serif" font-size="17" font-weight="700">100%</text>
        <text x="0" y="36" fill="#ffffff" opacity="0.92" font-family="Inter, sans-serif" font-size="16" font-weight="600">Pencil</text>
        <rect x="0" y="47" width="168" height="8.5" rx="4.25" fill="#ffffff" opacity="0.25" />
        <rect data-batt-fill data-max="168" x="0" y="47" width="168" height="8.5" rx="4.25" fill="#ffffff" />
      </g>
      ${calendarWidget(today)}
    </g>`;
  }

  function ipadClockMarkup() {
    return `<g class="ls-soft-shadow">
      <g transform="translate(600, 470)">
        <rect x="-12" y="-12" width="24" height="19" rx="5" fill="none" stroke="#ffffff" stroke-width="2.2" opacity="0.8" />
        <path d="M-7 -12v-5a7 7 0 0 1 14 0v5" fill="none" stroke="#ffffff" stroke-width="2.2" opacity="0.8" />
        <circle cx="0" cy="-2.5" r="2" fill="#ffffff" opacity="0.85" />
      </g>
      <text data-lock-date="ipad" x="600" y="550" text-anchor="middle" fill="#f3eef8" font-family="Inter, sans-serif" font-size="32" font-weight="600" letter-spacing="0.2">Sunday, April 5</text>
      <text data-lock-time="ipad" x="600" y="710" text-anchor="middle" fill="#ebe4f2" font-family="Inter, sans-serif" font-size="176" font-weight="800" letter-spacing="-4">4:52</text>
      ${ipadWidgetsMarkup()}
      <rect x="450" y="1650" width="300" height="7.5" rx="3.75" fill="#ffffff" opacity="0.92" />
    </g>`;
  }

  function statusBar(device) {
    if (device === 'android') {
      return `<g transform="translate(772,169)">
        <g data-conn-wifi>
          <rect x="0" y="13" width="3.5" height="7" rx="1.2" fill="#ffffff" />
          <rect x="6" y="10" width="3.5" height="10" rx="1.2" fill="#ffffff" />
          <rect x="12" y="6.5" width="3.5" height="13.5" rx="1.2" fill="#ffffff" />
          <rect x="18" y="3" width="3.5" height="17" rx="1.2" fill="#ffffff" opacity="0.45" />
          <path d="M 30 9.5 C 35.5 4.5, 44.5 4.5, 50 9.5" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" />
          <path d="M 33.5 14 C 37 10.8, 43 10.8, 46.5 14" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" />
          <circle cx="40" cy="18.2" r="1.8" fill="#ffffff" />
        </g>
        <g data-conn-flight style="display:none" fill="#ffffff" transform="translate(28,0)">
          <path d="M 12 1 L 14.2 8.2 L 22.5 11.5 L 22.5 13.8 L 14.2 12.4 L 14.2 18 L 17.5 20.2 L 17.5 22 L 12 20.6 L 6.5 22 L 6.5 20.2 L 9.8 18 L 9.8 12.4 L 1.5 13.8 L 1.5 11.5 L 9.8 8.2 Z" />
        </g>
        <rect x="56" y="2" width="40" height="19" rx="9.5" fill="#ffffff" />
        <text data-batt-plain x="76" y="15.5" text-anchor="middle" fill="#111827" font-family="Inter, sans-serif" font-size="12" font-weight="800">100</text>
      </g>`;
    }
    if (device === 'tablet') {
      return `<g transform="translate(1010, 96)">
        <g data-conn-wifi>
          <path d="M 0 8 C 5.5 3, 14.5 3, 20 8" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
          <path d="M 3.5 12.2 C 7 9, 13 9, 16.5 12.2" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
          <circle cx="10" cy="16" r="1.8" fill="#ffffff" />
        </g>
        <g data-conn-flight style="display:none" fill="#ffffff" transform="translate(-1,-2)">
          <path d="M 11 1 L 13 7.5 L 20.5 10.5 L 20.5 12.5 L 13 11.2 L 13 16.5 L 16 18.5 L 16 20 L 11 18.8 L 6 20 L 6 18.5 L 9 16.5 L 9 11.2 L 1.5 12.5 L 1.5 10.5 L 9 7.5 Z" />
        </g>
        <text data-batt-pct x="27" y="15" fill="#ffffff" font-family="Inter, sans-serif" font-size="15" font-weight="700">100%</text>
        <rect x="64" y="2.5" width="28" height="14" rx="4" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.85" />
        <rect data-batt-fill data-max="21.5" x="66.5" y="5" width="21.5" height="9" rx="2" fill="#ffffff" />
        <path d="M 93.5 6.5 L 93.5 12.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.75" />
      </g>`;
    }
    if (device === 'laptop') {
      return `<g transform="translate(1225, 74)">
        <g data-conn-wifi>
          <path d="M 0 8 C 5.5 3, 14.5 3, 20 8" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
          <path d="M 3.5 12.2 C 7 9, 13 9, 16.5 12.2" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" />
          <circle cx="10" cy="16" r="1.8" fill="#ffffff" />
        </g>
        <g data-conn-flight style="display:none" fill="#ffffff" transform="translate(-1,-2)">
          <path d="M 11 1 L 13 7.5 L 20.5 10.5 L 20.5 12.5 L 13 11.2 L 13 16.5 L 16 18.5 L 16 20 L 11 18.8 L 6 20 L 6 18.5 L 9 16.5 L 9 11.2 L 1.5 12.5 L 1.5 10.5 L 9 7.5 Z" />
        </g>
        <text data-batt-pct x="27" y="15" fill="#ffffff" font-family="Inter, sans-serif" font-size="14" font-weight="700">100%</text>
        <rect x="68" y="2.5" width="28" height="14" rx="4" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.85" />
        <rect data-batt-fill data-max="23" x="70.5" y="5" width="23" height="9" rx="2" fill="#ffffff" />
        <path d="M 97.5 6.5 L 97.5 12.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.75" />
      </g>`;
    }
    return `<g transform="translate(730, 186)">
      <g data-conn-wifi>
        <rect x="0" y="13" width="4" height="7" rx="1.5" fill="#ffffff" />
        <rect x="8" y="10" width="4" height="10" rx="1.5" fill="#ffffff" />
        <rect x="16" y="6" width="4" height="14" rx="1.5" fill="#ffffff" />
        <rect x="24" y="2" width="4" height="18" rx="1.5" fill="#ffffff" />
        <path d="M 41 9.5 C 47 3.8, 57 3.8, 63 9.5" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" />
        <path d="M 45 14.2 C 49 10.4, 55 10.4, 59 14.2" fill="none" stroke="#ffffff" stroke-width="2.4" stroke-linecap="round" />
        <circle cx="52" cy="18.5" r="2" fill="#ffffff" />
      </g>
      <g data-conn-flight style="display:none" fill="#ffffff" transform="translate(40,-1)">
        <path d="M 12 1 L 14.2 8.2 L 22.5 11.5 L 22.5 13.8 L 14.2 12.4 L 14.2 18 L 17.5 20.2 L 17.5 22 L 12 20.6 L 6.5 22 L 6.5 20.2 L 9.8 18 L 9.8 12.4 L 1.5 13.8 L 1.5 11.5 L 9.8 8.2 Z" />
      </g>
      <rect x="78" y="3" width="32" height="15" rx="4.2" fill="none" stroke="#ffffff" stroke-width="1.8" opacity="0.85" />
      <rect data-batt-fill data-max="27" x="80.5" y="5.5" width="27" height="10" rx="2.2" fill="#ffffff" />
      <path d="M 112 7.5 L 112 13.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.75" />
    </g>`;
  }

  function phoneShortcuts(device) {
    const shift = phoneBottomShift(device);
    if (device === 'android') {
      return `<g>
        <g transform="translate(0,${shift})">
          <rect x="343.6" y="1324.3" width="78.1" height="78.1" rx="29" fill="#151819" />
          <g transform="translate(382.6,1363.4)">
            <path d="M-8,-10c-2.2,0-3.5,2-3.5,4.2 0,8.8 8.5,17.3 17.3,17.3 2.2,0 4.2-1.3 4.2-4.2l-1.1-4.2-5.2-1.1-2.1,2.1c-3.2-2.1-5.3-4.2-7.4-7.4l2.1-2.1-1.1-5.2z" fill="#ffffff" />
          </g>
          <rect x="778.3" y="1324.3" width="78.1" height="78.1" rx="29" fill="#151819" />
          <g transform="translate(817.2,1363.4)">
            <rect x="-11" y="-7" width="22" height="16" rx="3" fill="none" stroke="#ffffff" stroke-width="2" />
            <circle cx="0" cy="1" r="4" fill="none" stroke="#ffffff" stroke-width="2" />
            <rect x="-5" y="-11" width="10" height="4" rx="1.2" fill="#ffffff" />
          </g>
        </g>
        ${homeBar('android')}
      </g>`;
    }
    return `<g>
      <g transform="translate(0,${shift})">
        <circle cx="397" cy="1341.5" r="37.2" fill="#b7b8ba" opacity="0.92" />
        <g transform="translate(397,1341.5)" fill="#ffffff">
          <rect x="-6" y="-11" width="12" height="6" rx="2" />
          <rect x="-4" y="-4" width="8" height="12" rx="2" />
        </g>
        <circle cx="801.5" cy="1341.5" r="37.5" fill="#b7b8ba" opacity="0.92" />
        <g transform="translate(801.5,1341.5)">
          <rect x="-11" y="-7" width="22" height="16" rx="3" fill="none" stroke="#ffffff" stroke-width="2" />
          <circle cx="0" cy="1" r="4" fill="none" stroke="#ffffff" stroke-width="2" />
          <rect x="-5" y="-11" width="10" height="4" rx="1.2" fill="#ffffff" />
        </g>
      </g>
      ${homeBar('iphone')}
    </g>`;
  }

  function homeBar(device) {
    const shift = phoneBottomShift(device);
    if (device === 'android') {
      return `<rect x="521" y="${1430 + shift}" width="158" height="6.5" rx="3.25" fill="#ffffff" opacity="0.92" />`;
    }
    return `<rect x="498" y="${1429 + shift}" width="203" height="7.5" rx="3.75" fill="#ffffff" opacity="0.92" />`;
  }

  function screenshotImage(shotSrc, landscape, screen) {
    const href = String(shotSrc).replace(/"/g, '&quot;');
    const sc = screen || PHONE_SCREEN;
    const cx = sc.x + sc.w / 2;
    const cy = sc.y + sc.h / 2;
    if (!landscape) {
      return `<image href="${href}" x="${sc.x}" y="${sc.y}" width="${sc.w}" height="${sc.h}" preserveAspectRatio="xMidYMid slice" />`;
    }
    const boxX = cx - sc.h / 2;
    const boxY = cy - sc.w / 2;
    return `<image href="${href}" x="${boxX}" y="${boxY}" width="${sc.h}" height="${sc.w}" transform="rotate(90 ${cx} ${cy})" preserveAspectRatio="xMidYMid slice" />`;
  }

  function cameraCutout(device) {
    if (device === 'iphone') {
      return `<g>
        <rect x="514" y="175" width="171" height="47" rx="23.5" fill="#000000" />
        <circle cx="660" cy="198.5" r="9.5" fill="#0c1322" />
        <circle cx="660" cy="198.5" r="5" fill="#091d36" />
        <circle cx="658" cy="196.5" r="2" fill="#3b82f6" opacity="0.55" />
      </g>`;
    }
    return `<g>
      <circle cx="600.5" cy="180.5" r="13.5" fill="#000000" />
      <circle cx="600.5" cy="180.5" r="5.5" fill="#0b1524" />
      <circle cx="598.8" cy="178.8" r="2" fill="#3b82f6" opacity="0.45" />
    </g>`;
  }

  function tallDigit(ch, x, y, w, h) {
    const sw = 19.2;
    const r = sw / 2;
    const x0 = x + r;
    const x1 = x + w - r;
    const xm = (x0 + x1) / 2;
    const rx = (x1 - x0) / 2;
    const y0 = y + r;
    const y1 = y + h - r;
    const ym = y + h * 0.49;
    const common = `fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
    if (ch === '0') {
      return `<rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${(x1 - x0).toFixed(1)}" height="${(y1 - y0).toFixed(1)}" rx="${rx.toFixed(1)}" ${common} />`;
    }
    if (ch === '1') {
      return `<path d="M ${(xm - 20).toFixed(1)},${(y0 + 18).toFixed(1)} L ${xm.toFixed(1)},${y0.toFixed(1)} L ${xm.toFixed(1)},${y1.toFixed(1)}" ${common} />`;
    }
    if (ch === '2') {
      return `<path d="M ${x0.toFixed(1)},${(y0 + rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${(y0 + rx).toFixed(1)} L ${x1.toFixed(1)},${ym.toFixed(1)} L ${x0.toFixed(1)},${y1.toFixed(1)} L ${x1.toFixed(1)},${y1.toFixed(1)}" ${common} />`;
    }
    if (ch === '3') {
      return `<path d="M ${x0.toFixed(1)},${(y0 + 74).toFixed(1)} L ${x0.toFixed(1)},${(y0 + rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${(y0 + rx).toFixed(1)} L ${x1.toFixed(1)},${(ym - rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${xm.toFixed(1)},${ym.toFixed(1)} L ${(x0 + 8).toFixed(1)},${ym.toFixed(1)} M ${xm.toFixed(1)},${ym.toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${(ym + rx).toFixed(1)} L ${x1.toFixed(1)},${(y1 - rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${x0.toFixed(1)},${(y1 - rx).toFixed(1)}" ${common} />`;
    }
    if (ch === '4') {
      const cy = y0 + (y1 - y0) * 0.62;
      const sx = x1 - 3.0;
      return `<path d="M ${x0.toFixed(1)},${y0.toFixed(1)} L ${x0.toFixed(1)},${cy.toFixed(1)} L ${(x1 + 2).toFixed(1)},${cy.toFixed(1)} M ${sx.toFixed(1)},${y0.toFixed(1)} L ${sx.toFixed(1)},${y1.toFixed(1)}" ${common} />`;
    }
    if (ch === '5') {
      return `<path d="M ${x1.toFixed(1)},${(y0 + 64).toFixed(1)} L ${x1.toFixed(1)},${y0.toFixed(1)} L ${x0.toFixed(1)},${y0.toFixed(1)} L ${x0.toFixed(1)},${(ym - 6).toFixed(1)} L ${xm.toFixed(1)},${(ym - 6).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${(ym - 6 + rx).toFixed(1)} L ${x1.toFixed(1)},${(y1 - rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${x0.toFixed(1)},${(y1 - rx).toFixed(1)} L ${x0.toFixed(1)},${(y1 - 74).toFixed(1)}" ${common} />`;
    }
    if (ch === '6') {
      return `<path d="M ${x1.toFixed(1)},${(y0 + 74).toFixed(1)} L ${x1.toFixed(1)},${(y0 + rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 0 ${x0.toFixed(1)},${(y0 + rx).toFixed(1)} L ${x0.toFixed(1)},${(y1 - rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 0 ${x1.toFixed(1)},${(y1 - rx).toFixed(1)} L ${x1.toFixed(1)},${(ym + rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 0 ${x0.toFixed(1)},${(ym + rx).toFixed(1)}" ${common} />`;
    }
    if (ch === '7') {
      return `<path d="M ${x0.toFixed(1)},${(y0 + 66).toFixed(1)} L ${x0.toFixed(1)},${y0.toFixed(1)} L ${x1.toFixed(1)},${y0.toFixed(1)} L ${(x1 - 4).toFixed(1)},${y1.toFixed(1)}" ${common} />`;
    }
    if (ch === '8') {
      const topH = (y1 - y0) * 0.48;
      const botH = (y1 - y0) - topH;
      return `<rect x="${x0.toFixed(1)}" y="${y0.toFixed(1)}" width="${(x1 - x0).toFixed(1)}" height="${topH.toFixed(1)}" rx="${rx.toFixed(1)}" ${common} />` +
        `<rect x="${x0.toFixed(1)}" y="${(y0 + topH).toFixed(1)}" width="${(x1 - x0).toFixed(1)}" height="${botH.toFixed(1)}" rx="${rx.toFixed(1)}" ${common} />`;
    }
    if (ch === '9') {
      return `<path d="M ${x1.toFixed(1)},${(ym - rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${x0.toFixed(1)},${(ym - rx).toFixed(1)} L ${x0.toFixed(1)},${(y0 + rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${x1.toFixed(1)},${(y0 + rx).toFixed(1)} L ${x1.toFixed(1)},${(y1 - rx).toFixed(1)} A ${rx.toFixed(1)} ${rx.toFixed(1)} 0 0 1 ${x0.toFixed(1)},${(y1 - rx).toFixed(1)} L ${x0.toFixed(1)},${(y1 - 74).toFixed(1)}" ${common} />`;
    }
    if (ch === ':') {
      return `<circle cx="${(x + w / 2).toFixed(1)}" cy="585.1" r="10.5" fill="currentColor" />` +
        `<circle cx="${(x + w / 2).toFixed(1)}" cy="676.6" r="10.5" fill="currentColor" />`;
    }
    return '';
  }

  function tallClockSvg(timeStr) {
    const chars = String(timeStr || '02:21').trim().split('');
    const widths = chars.map(c => c === ':' ? TALL_GLYPHS.colon : TALL_GLYPHS.w);
    const totalW = widths.reduce((a, b) => a + b, 0) + Math.max(0, chars.length - 1) * TALL_GLYPHS.gap;
    let curX = 600 - totalW / 2;
    let svg = '';
    chars.forEach((ch, idx) => {
      svg += tallDigit(ch, curX, TALL_GLYPHS.y, widths[idx], TALL_GLYPHS.h);
      curX += widths[idx] + TALL_GLYPHS.gap;
    });
    return svg;
  }

  function phoneHardware(device) {
    const isIphone = device === 'iphone';
    const outerRx = isIphone ? 100 : 54;
    const rimRx = isIphone ? 97.5 : 52;
    const innerRx = isIphone ? 94 : 48;
    const shadow = isIphone ? 'phoneShadow' : 'phoneShadowDark';
    // The chassis wraps THIS device's screen rect (studio bezel margin), so a
    // taller screen gets a taller phone instead of overflowing its frame.
    const sc = phoneScreen(device);
    const ox = sc.x - PHONE_BEZEL;
    const oy = sc.y - PHONE_BEZEL;
    const ow = sc.w + PHONE_BEZEL * 2;
    const oh = sc.h + PHONE_BEZEL * 2;
    const buttons = isIphone ? `<g>
        <rect x="279" y="388" width="6" height="54" rx="2.5" fill="#2c2d30" />
        <rect x="279" y="486" width="6" height="88" rx="2.5" fill="#2c2d30" />
        <rect x="279" y="599" width="6" height="90" rx="2.5" fill="#2c2d30" />
        <rect x="914" y="520" width="6" height="135" rx="2.5" fill="#2c2d30" />
      </g>` : `<g>
        <rect x="914" y="435" width="6.5" height="175" rx="2.5" fill="#3a3b40" />
        <rect x="914" y="675" width="6.5" height="95" rx="2.5" fill="#3a3b40" />
      </g>`;
    return `<g>
      ${buttons}
      <rect x="${ox}" y="${oy}" width="${ow}" height="${oh}" rx="${outerRx}" fill="url(#frameGrad)" filter="url(#${shadow})" />
      <rect x="${ox + 2}" y="${oy + 2}" width="${ow - 4}" height="${oh - 4}" rx="${rimRx}" fill="none" stroke="url(#rimHighlight)" stroke-width="2.5" />
      <rect x="${ox + 5.5}" y="${oy + 5.7}" width="${ow - 11}" height="${oh - 11.4}" rx="${innerRx}" fill="#040507" />
      <g opacity="0.75" fill="#18181b">
        <rect x="${ox}" y="${oy + 107.7}" width="5.5" height="4.5" />
        <rect x="${ox + ow - 5.5}" y="${oy + 107.7}" width="5.5" height="4.5" />
        <rect x="${ox}" y="${oy + oh - 113.7}" width="5.5" height="4.5" />
        <rect x="${ox + ow - 5.5}" y="${oy + oh - 113.7}" width="5.5" height="4.5" />
      </g>
    </g>`;
  }

  // Chassis-only render (feature 2026-10-21 unification): same studio
  // hardware the lock-screen model uses, but with the screen area left to the
  // hosting surface — the fullscreen browsing UI (and later the drawer) slide
  // their real chrome/iframe into the screen rect, so the lock art and the
  // browsing UI are the SAME device, not two differently-styled frames.
  function phoneDefs(screenRx, screen) {
    const sc = screen || PHONE_SCREEN;
    return `<defs>
      <filter id="phoneShadow" x="-20%" y="-10%" width="155%" height="135%">
        <feDropShadow dx="28" dy="38" stdDeviation="38" flood-color="#000000" flood-opacity="0.30" />
        <feDropShadow dx="0" dy="8" stdDeviation="14" flood-color="#000000" flood-opacity="0.10" />
      </filter>
      <filter id="phoneShadowDark" x="-20%" y="-10%" width="150%" height="130%">
        <feDropShadow dx="0" dy="20" stdDeviation="28" flood-color="#000000" flood-opacity="0.65" />
      </filter>
      <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4a4b50" />
        <stop offset="50%" stop-color="#25262a" />
        <stop offset="100%" stop-color="#37383d" />
      </linearGradient>
      <linearGradient id="rimHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#7c7e87" />
        <stop offset="50%" stop-color="#45464c" />
        <stop offset="100%" stop-color="#60626a" />
      </linearGradient>
      <clipPath id="screenClip">
        <rect x="${sc.x}" y="${sc.y}" width="${sc.w}" height="${sc.h}" rx="${screenRx}" />
      </clipPath>
    </defs>`;
  }

  // Display metrics for hosts that overlay HTML at the studio screen rect.
  // view = the chassis' frame viewBox; screen = where the glass sits.
  // Both are BASE (studio) values — hosts that need a device's true geometry
  // call geometry(deviceKey), which derives that device's own screen/frame.
  const PHONE_METRICS = {
    view: { x: 264, y: 118, w: 672, h: 1360 },
    screen: Object.assign({}, PHONE_SCREEN),
    screenRx: { iphone: 80, android: 40 }
  };

  function geometry(deviceKey) {
    const device = normalizeDevice(deviceKey);
    const screenRx = { iphone: 80, android: 40 };
    if (device !== 'iphone' && device !== 'android') {
      return { view: Object.assign({}, PHONE_METRICS.view), screen: Object.assign({}, PHONE_METRICS.screen), screenRx: screenRx };
    }
    const f = phoneFrameView(device);
    return { view: f, screen: phoneScreen(device), screenRx: screenRx };
  }

  function frameSvg(deviceKey) {
    const device = normalizeDevice(deviceKey);
    if (device !== 'iphone' && device !== 'android') return '';
    const screenRx = device === 'iphone' ? 80 : 40;
    return `<svg viewBox="${FRAME_VIEWBOX[device]}" preserveAspectRatio="xMidYMid meet" class="ls-frame" role="img" aria-hidden="true">
      ${phoneDefs(screenRx, phoneScreen(device))}
      ${phoneHardware(device)}
    </svg>`;
  }

  function cutoutSvg(deviceKey) {
    const device = normalizeDevice(deviceKey);
    if (device !== 'iphone' && device !== 'android') return '';
    return `<svg viewBox="${FRAME_VIEWBOX[device]}" preserveAspectRatio="xMidYMid meet" class="ls-cutout" role="img" aria-hidden="true">${cameraCutout(device)}</svg>`;
  }

  function build(deviceKey, full, screenSrc, shotLandscape) {
    const device = normalizeDevice(deviceKey);
    const framed = !!full && (device === 'iphone' || device === 'android');
    const viewBox = framed ? FRAME_VIEWBOX[device] : SCREEN_VIEWBOX[device];
    const preserve = framed ? 'xMidYMid meet' : 'xMidYMid slice';
    const screenRx = device === 'iphone' ? 80 : 40;
    const shotSrc = typeof screenSrc === 'string' && screenSrc ? screenSrc : '';
    let wallpaper = '';
    let clock = '';
    let shortcuts = '';
    if (device === 'android') {
      wallpaper = batmanArt('translate(0,0)');
      clock = samsungClockMarkup([0, 0], 1);
      shortcuts = phoneShortcuts('android');
    } else if (device === 'tablet') {
      wallpaper = stardustArt(1200, 1719, 180, 20261020);
      clock = ipadClockMarkup();
    } else if (device === 'laptop') {
      wallpaper = batmanArt('translate(200,-185)');
      clock = samsungClockMarkup([260, -170], 0.90);
      shortcuts = '';
    } else {
      wallpaper = wallelfArt();
      clock = iphoneClockMarkup();
      shortcuts = phoneShortcuts('iphone');
    }
    const defs = phoneDefs(screenRx, phoneScreen(device)) + `<defs>
      <radialGradient id="stardustNebula" cx="68%" cy="48%" r="60%">
        <stop offset="0%" stop-color="#27272a" stop-opacity="0.42" />
        <stop offset="55%" stop-color="#18181b" stop-opacity="0.18" />
        <stop offset="100%" stop-color="#050507" stop-opacity="0" />
      </radialGradient>
      <clipPath id="s26ClockClip">
        <path d="M 300 100 L 900 100 L 900 715 L 748 715 L 700 718 L 682 721.5 L 626 721.5 L 621 720 L 583 720 L 576 721.5 L 520 721.5 L 504 718 L 450 715 L 300 715 Z" />
      </clipPath>
    </defs>`;
    const hardware = framed ? phoneHardware(device) : '';
    const cutout = framed ? (device === 'iphone' ? cameraCutout('iphone') : cameraCutout('android')) : '';
    const clip = (device === 'iphone' || device === 'android') ? ' clip-path="url(#screenClip)"' : '';
    const screenLayer = shotSrc
      ? screenshotImage(shotSrc, !!shotLandscape, phoneScreen(device))
      : `<g data-lock="wallpaper">${wallpaper}</g><g data-lock="clock">${clock}</g>`;
    return `<svg viewBox="${viewBox}" preserveAspectRatio="${preserve}" class="ls-screen" role="img" aria-hidden="true">
      ${defs}
      ${hardware}
      <g${clip}>
        ${screenLayer}
        <g data-lock="status">${statusBar(device)}</g>
        ${cutout}
        ${shotSrc ? homeBar(device) : `<g data-lock="shortcuts">${shortcuts}</g>`}
      </g>
    </svg>`;
  }

  function screenshotOverlay(device, url) {
    return `<svg viewBox="${FRAME_VIEWBOX[device]}" preserveAspectRatio="xMidYMid meet">${statusBar(device)}${cameraCutout(device)}${browserChrome(device, url)}${homeBar(device)}</svg>`;
  }

  // Composed capture's in-frame browser chrome (feature 2026-10-21): a raw
  // page screenshot framed in the phone used to show no address bar at all,
  // but the live preview (drawer + fullscreen) does draw one. Same minimal
  // artwork, authored in portrait frame coords so a landscape phone keeps
  // its own chrome like a real rotated device.
  function browserChrome(device, url) {
    if (device !== 'iphone' && device !== 'android') return '';
    if (!url) return '';
    const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    let domain = '';
    try { domain = new URL(url).host; } catch (_) { domain = String(url).slice(0, 28); }
    if (device === 'iphone') {
      // Safari: rounded domain pill above the home bar, along the bottom of
      // the glass (matches the live .ios-addressbar position).
      const shift = phoneBottomShift(device);
      return `<g>
        <rect x="341.4" y="${1386.8 + shift}" width="517.2" height="52" rx="26" fill="#17171a" opacity="0.96" />
        <text x="600" y="${1421 + shift}" fill="#e5e7eb" font-family="-apple-system,'Segoe UI',Roboto,sans-serif" font-size="21" font-weight="500" text-anchor="middle">${esc(domain)}</text>
      </g>`;
    }
    // Chrome for Android: pill directly under the status bar at the top of
    // the glass (matches the live .android-addressbar position).
    return `<g>
      <rect x="341.4" y="196" width="517.2" height="52" rx="26" fill="#1f2023" opacity="0.98" />
      <text x="370" y="231" fill="#e5e7eb" font-family="'Segoe UI',Roboto,sans-serif" font-size="21" font-weight="500">${esc(domain)}</text>
      <g fill="#cbd5e1">
        <circle cx="836" cy="215" r="2.6" />
        <circle cx="836" cy="223" r="2.6" />
        <circle cx="836" cy="231" r="2.6" />
      </g>
    </g>`;
  }

  function xmlSafeSvg(svg) {
    return svg
      .replace(/(\sdata-[\w-]+)(?=[\s>])/g, '$1=""')
      .replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-f]+);)/gi, '&amp;');
  }

  function svgImageSource(svg, width, height) {
    const withNs = svg.replace('<svg ', `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" `);
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(xmlSafeSvg(withNs));
  }

  function loadImageSrc(src, label) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Could not load ' + (label || 'image') + '.'));
      img.src = src;
    });
  }

  function drawCover(ctx, img, x, y, w, h) {
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;
    const ir = iw / ih;
    const r = w / h;
    let sw = iw;
    let sh = ih;
    let sx = 0;
    let sy = 0;
    if (ir > r) {
      sw = ih * r;
      sx = (iw - sw) / 2;
    } else {
      sh = iw / r;
      sy = (ih - sh) / 2;
    }
    ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  }

  async function composeScreenshot(deviceKey, screenSrc, landscape, url) {
    const device = normalizeDevice(deviceKey);
    if (device !== 'iphone' && device !== 'android') return '';
    if (typeof document === 'undefined') return '';
    const scale = 2;
    const frame = phoneFrameView(device);
    const scr = phoneScreen(device);
    const screenRx = device === 'iphone' ? 80 : 40;
    const W = frame.w;
    const H = frame.h;
    let baseUrl = '';
    let overlayUrl = '';
    try {
      baseUrl = svgImageSource(build(device, true), W, H);
      overlayUrl = svgImageSource(screenshotOverlay(device, url), W, H);
      const [baseImg, shotImg, overlayImg] = await Promise.all([
        loadImageSrc(baseUrl, 'device frame'),
        loadImageSrc(screenSrc, 'screenshot'),
        loadImageSrc(overlayUrl, 'screen overlay')
      ]);
      const canvas = document.createElement('canvas');
      canvas.width = W * scale;
      canvas.height = H * scale;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas unavailable.');
      ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
      const sx = (scr.x - frame.x) * scale;
      const sy = (scr.y - frame.y) * scale;
      const sw = scr.w * scale;
      const sh = scr.h * scale;
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(sx, sy, sw, sh, screenRx * scale);
      ctx.clip();
      ctx.fillStyle = '#000';
      ctx.fillRect(sx, sy, sw, sh);
      if (landscape) {
        // Counter-clockwise (-90°): CSS landscape keeps notch left / home
        // right, and this is the rotation direction that turns a portrait
        // page screenshot upright again when the final canvas is laid out
        // landscape. The previous +90° version read 180°-rotated live.
        ctx.translate(sx + sw / 2, sy + sh / 2);
        ctx.rotate(-Math.PI / 2);
        drawCover(ctx, shotImg, -sh / 2, -sw / 2, sh, sw);
      } else {
        drawCover(ctx, shotImg, sx, sy, sw, sh);
      }
      ctx.restore();
      ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
      if (!landscape) return canvas.toDataURL('image/png');
      const out = document.createElement('canvas');
      out.width = H * scale;
      out.height = W * scale;
      const octx = out.getContext('2d');
      if (!octx) throw new Error('Canvas unavailable.');
      // Landscape canvas: rotate the phone -90° (counter-clockwise) so the
      // notch edge lands on the LEFT — the same convention the live CSS
      // landscape uses, so composition and preview can't drift apart.
      octx.translate(0, out.height);
      octx.rotate(-Math.PI / 2);
      octx.drawImage(canvas, 0, 0);
      return out.toDataURL('image/png');
    } finally {
      if (baseUrl) URL.revokeObjectURL(baseUrl);
      if (overlayUrl) URL.revokeObjectURL(overlayUrl);
    }
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function applyBattery(pct) {
    const value = Math.max(0, Math.min(100, Math.round(Number(pct) || 0)));
    batteryPct = value;
    document.querySelectorAll('[data-batt-fill]').forEach(el => {
      const max = parseFloat(el.getAttribute('data-max') || el.getAttribute('width') || '100');
      el.setAttribute('width', (max * value / 100).toFixed(2));
    });
    document.querySelectorAll('[data-batt-pct]').forEach(el => {
      el.textContent = value + '%';
    });
    document.querySelectorAll('[data-batt-plain]').forEach(el => {
      el.textContent = String(value);
    });
  }

  function syncConnectivity() {
    const online = navigator.onLine !== false;
    document.querySelectorAll('[data-conn-wifi]').forEach(el => {
      el.style.display = online ? '' : 'none';
    });
    document.querySelectorAll('[data-conn-flight]').forEach(el => {
      el.style.display = online ? 'none' : '';
    });
  }

  function tick() {
    const now = new Date();
    const h12 = now.getHours() % 12 || 12;
    const minutes = pad(now.getMinutes());
    const phoneTime = h12 + ':' + minutes;
    const tallTime = pad(h12) + ':' + minutes;
    const phoneDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    const ipadDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const samsungDate = now.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    document.querySelectorAll('[data-lock-time="phone"]').forEach(el => { el.textContent = phoneTime; });
    document.querySelectorAll('[data-lock-time="ipad"]').forEach(el => { el.textContent = phoneTime; });
    document.querySelectorAll('[data-lock-date="phone"]').forEach(el => { el.textContent = phoneDate; });
    document.querySelectorAll('[data-lock-date="ipad"]').forEach(el => { el.textContent = ipadDate; });
    document.querySelectorAll('[data-lock-date="samsung"]').forEach(el => { el.textContent = samsungDate; });
    // Per-element guard, not a global one: a clock group mounted AFTER the
    // minute changed (the fullscreen art layer re-rendering mid-minute) used
    // to be skipped by the old `tallTime !== lastTallTime` check and stayed
    // EMPTY until the next minute — the S26 lock screen lost its big clock.
    document.querySelectorAll('[data-tall-clock]').forEach(el => {
      if (el.dataset.tallWritten !== tallTime) {
        el.dataset.tallWritten = tallTime;
        el.innerHTML = tallClockSvg(tallTime);
      }
    });
  }

  function deviceLabel(device) {
    return device === 'android' ? 'Galaxy' : device === 'iphone' ? 'iPhone' : device === 'tablet' ? 'iPad' : 'Laptop';
  }

  function initBattery() {
    applyBattery(batteryPct);
    if (batteryBound) return;
    batteryBound = true;
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        const update = () => applyBattery(Math.round(battery.level * 100));
        update();
        battery.addEventListener('levelchange', update);
        battery.addEventListener('chargingchange', update);
      }).catch(() => {});
    }
  }

  function bindLive() {
    if (liveBound) return;
    liveBound = true;
    window.addEventListener('online', syncConnectivity);
    window.addEventListener('offline', syncConnectivity);
    window.addEventListener('focus', tick);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
    setInterval(tick, 1000);
  }

  function hydrate(root) {
    if (!root) return;
    initBattery();
    syncConnectivity();
    tick();
    bindLive();
  }

  // ── Studio unlock animations (feature 2026-10-21) ──────────────────────
  // Ported 1:1 from the reference studio's triggerUnlockAnimation(): same
  // 680ms timeline, same easing and transforms, per device/wallpaper:
  //   • Android/Batman  → emblem warps 1x→16.5x while the clock lifts and
  //                       the pillars drop away
  //   • iPhone/Wallelf  → the 3 geometric shutter blocks split diagonally
  //   • iPad/Laptop     → lock layers slide straight up (stardust included)
  //   • Stardust phone  → warp-zoom into the center
  // Runs on a container so the SAME code animates the drawer's inline model
  // and the fullscreen surface's standalone lock document (same-origin
  // iframe). Returns false when there is no lock art to animate, letting
  // callers fall back to their CSS transition.
  function resetUnlockArt(root) {
    if (!root) return;
    root.querySelectorAll('[data-bat-logo],[data-bat-sky],[data-bat-pillar],[data-wallelf-bg],[data-wallelf-block],[data-lock="wallpaper"],[data-lock="clock"],[data-lock="shortcuts"],[data-lock="status"]').forEach(el => {
      el.removeAttribute('transform');
      el.style.opacity = '';
      el.style.transform = '';
    });
  }

  function playUnlock(container, deviceKey, onDone) {
    if (!container) return false;
    let device = deviceKey;
    if (!device) {
      if (container.dataset && container.dataset.device) device = container.dataset.device;
      else if (container.body && container.body.dataset) device = container.body.dataset.device;
    }
    device = normalizeDevice(device);
    const root = container.querySelector ? container.querySelector('.ls-screen') : null;
    if (!root) return false;
    resetUnlockArt(root);

    let reduced = false;
    try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { /* no matchMedia */ }
    const finish = () => {
      resetUnlockArt(root);
      if (typeof onDone === 'function') onDone();
    };
    if (reduced) { finish(); return true; }

    const view = (root.ownerDocument && root.ownerDocument.defaultView) || window;
    const raf = view.requestAnimationFrame ? view.requestAnimationFrame.bind(view) : (cb) => setTimeout(cb, 16);
    const clockNow = () => (view.performance ? view.performance.now() : Date.now());

    const q = (sel) => root.querySelector(sel);
    const qa = (sel) => Array.from(root.querySelectorAll(sel));
    const wallpaper = q('[data-lock="wallpaper"]');
    const clockEl = q('[data-lock="clock"]');
    const shortcutEl = q('[data-lock="shortcuts"]');
    const statusEl = q('[data-lock="status"]');
    const batLogo = q('[data-bat-logo]');
    const skyBg = q('[data-bat-sky]');
    const pillars = qa('[data-bat-pillar]');
    const wBg = q('[data-wallelf-bg]');
    const blocks = qa('[data-wallelf-block]');

    const isLandscape = device === 'tablet' || device === 'laptop';
    const cx = isLandscape ? 800 : 600;
    const cy = isLandscape ? 540 : 800;
    let animType = 'stardust-zoom';
    if (isLandscape) animType = 'slide-up-zoom-out';
    else if (device === 'android') animType = 'batman-scale';
    else if (device === 'iphone') animType = 'wallelf-split';

    const duration = 680;
    const start = clockNow();
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    const step = (now) => {
      const rawT = Math.min(1, (now - start) / duration);
      const e = easeInOutCubic(rawT);
      const eOut = easeOutCubic(rawT);

      if (animType === 'batman-scale') {
        const scaleP = Math.min(1, rawT / 0.62);
        const scaleEase = scaleP * scaleP * (3 - 2 * scaleP);
        const s = 1 + 15.5 * Math.pow(scaleEase, 1.7);
        if (batLogo) {
          batLogo.setAttribute('transform', `translate(602, 810) scale(${s.toFixed(2)}) translate(-602, -810)`);
        }
        const fadeOutEarly = Math.max(0, 1 - rawT * 2.2);
        if (clockEl) {
          clockEl.setAttribute('transform', `translate(0, ${(-110 * eOut).toFixed(1)})`);
          clockEl.style.opacity = String(fadeOutEarly);
        }
        if (shortcutEl) shortcutEl.style.opacity = String(fadeOutEarly);
        if (statusEl) statusEl.style.opacity = String(fadeOutEarly);
        if (skyBg) skyBg.style.opacity = String(fadeOutEarly);
        pillars.forEach((p, idx) => {
          p.setAttribute('transform', `translate(0, ${(180 * eOut * (1 + idx * 0.12)).toFixed(1)})`);
          p.style.opacity = String(fadeOutEarly);
        });
        if (rawT > 0.56 && batLogo) {
          batLogo.style.opacity = String(Math.max(0, 1 - (rawT - 0.56) / 0.44));
        }
      } else if (animType === 'wallelf-split') {
        if (wBg) wBg.style.opacity = String(Math.max(0, 1 - rawT * 3.0));
        if (blocks[0]) {
          blocks[0].setAttribute('transform', `translate(${(-220 * e).toFixed(1)}, ${(-520 * e).toFixed(1)})`);
          blocks[0].style.opacity = String(1 - e * 0.85);
        }
        if (blocks[1]) {
          blocks[1].setAttribute('transform', `translate(${(560 * e).toFixed(1)}, ${(-110 * e).toFixed(1)}) rotate(${(9 * e).toFixed(2)} 600 940)`);
          blocks[1].style.opacity = String(1 - e * 0.85);
        }
        if (blocks[2]) {
          blocks[2].setAttribute('transform', `translate(${(-190 * e).toFixed(1)}, ${(520 * e).toFixed(1)})`);
          blocks[2].style.opacity = String(1 - e * 0.85);
        }
        if (clockEl) {
          clockEl.setAttribute('transform', `translate(${cx}, ${cy - 320}) scale(${(1 + 0.24 * e).toFixed(3)}) translate(${-cx}, ${-(cy - 320)}) translate(0, ${(-150 * e).toFixed(1)})`);
          clockEl.style.opacity = String(Math.max(0, 1 - rawT * 1.6));
        }
        if (shortcutEl) shortcutEl.style.opacity = String(Math.max(0, 1 - rawT * 2.0));
        if (statusEl) statusEl.style.opacity = String(Math.max(0, 1 - rawT * 2.0));
      } else if (animType === 'slide-up-zoom-out') {
        const slideDist = -920 * eOut;
        if (wallpaper) {
          wallpaper.setAttribute('transform', `translate(0, ${slideDist.toFixed(1)})`);
          wallpaper.style.opacity = String(Math.max(0, 1 - rawT * 1.35));
        }
        if (clockEl) {
          clockEl.setAttribute('transform', `translate(0, ${(slideDist * 1.15).toFixed(1)})`);
          clockEl.style.opacity = String(Math.max(0, 1 - rawT * 1.6));
        }
        if (shortcutEl) shortcutEl.style.opacity = String(Math.max(0, 1 - rawT * 2.0));
        if (statusEl) statusEl.style.opacity = String(Math.max(0, 1 - rawT * 2.0));
      } else {
        if (wallpaper) {
          wallpaper.setAttribute('transform', `translate(${cx}, ${cy}) scale(${(1 + 1.4 * e).toFixed(3)}) translate(${-cx}, ${-cy})`);
          wallpaper.style.opacity = String(1 - e);
        }
        if (clockEl) {
          clockEl.setAttribute('transform', `translate(0, ${(-180 * eOut).toFixed(1)})`);
          clockEl.style.opacity = String(1 - e);
        }
        if (shortcutEl) shortcutEl.style.opacity = String(1 - e);
        if (statusEl) statusEl.style.opacity = String(1 - e);
      }

      if (rawT < 1) raf(step);
      else finish();
    };
    raf(step);
    return true;
  }

  // Inline render (drawer) and standalone page mount both use the same build;
  // the drawer must NOT live in an iframe or its canvas paints a dark box
  // behind the model. Returns the normalized device key.
  function render(root, deviceKey, full) {
    if (!root) return null;
    const device = normalizeDevice(deviceKey);
    const framed = !!full && (device === 'iphone' || device === 'android');
    root.dataset.device = device;
    root.dataset.frame = framed ? '1' : '0';
    root.innerHTML = build(device, framed);
    root.setAttribute('aria-label', deviceLabel(device) + ' lock screen');
    hydrate(root);
    return device;
  }

  function url(device, full) {
    const base = (window.SC && SC.baseUrl) ? String(SC.baseUrl) : '';
    const root = base.endsWith('/') ? base : base + '/';
    const params = new URLSearchParams();
    params.set('device', normalizeDevice(device));
    if (full) params.set('frame', '1');
    params.set('v', VERSION);
    return root + 'device-lockscreen.html?' + params.toString();
  }

  function mount(root) {
    if (!root) return;
    const params = new URLSearchParams(window.location.search);
    const device = normalizeDevice(params.get('device'));
    const framed = params.get('frame') === '1' && (device === 'iphone' || device === 'android');
    document.body.dataset.device = device;
    document.body.dataset.frame = framed ? '1' : '0';
    render(root, device, framed);
  }

  window.DeviceLockscreens = {
    version: VERSION,
    normalize: normalizeDevice,
    build: build,
    frame: frameSvg,
    cutout: cutoutSvg,
    metrics: () => PHONE_METRICS,
    geometry: geometry,
    composeScreenshot: composeScreenshot,
    render: render,
    hydrate: hydrate,
    playUnlock: playUnlock,
    resetUnlockArt: resetUnlockArt,
    url: url,
    mount: mount,
    battery: () => batteryPct
  };
})();
