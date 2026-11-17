# 7. Rendering sandbox and captures

Generated screens are untrusted content. They must never be able to read
the user's session, call the app's API, or draw the app's interface inside
the device. This document describes how that is guaranteed.

## 7.1 Separate origin

Screens are served from a different registrable domain from the app, for
example `selasi-render.dev` (best) or at least `render.selasi.dev` with no
cookies set on the parent domain. Browsers keep cookies, storage and the DOM
apart by origin, so a screen cannot read the app's session cookie or
`localStorage` even if a script gets in.

The device frame in the app holds an iframe:

```html
<iframe
  class="dev-frame"
  src="https://selasi-render.dev/p/{project}/{screen}?v={version}&t={theme}&sig={signature}"
  sandbox="allow-scripts"
  referrerpolicy="no-referrer"
  allow="">
</iframe>
```

- `sandbox="allow-scripts"` without `allow-same-origin` gives the frame an
  opaque origin, so even the render host's own storage is out of reach. No
  `allow-forms`, no `allow-popups`, no `allow-top-navigation`: a screen can
  never navigate the app tab or open windows.
- The URL is signed by the app server (HMAC of project, screen, version,
  user and expiry, valid for 30 minutes). The render host serves nothing
  without a valid signature, so projects are private.

## 7.2 What the render host sends

The render host wraps the stored fragment in a fixed document:

```html
<!doctype html>
<html data-theme-variant="soft" data-mode="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="/r/base.css">          <!-- reset, fonts, token plumbing -->
  <link rel="stylesheet" href="/r/tw.{hash}.css">     <!-- Tailwind built for this screen -->
  <style>:root{ /* tokens.json as CSS variables */ }</style>
</head>
<body>
  <!-- partials and the screen fragment -->
  <script src="/r/runtime.js"></script>
</body>
</html>
```

with these headers:

```
Content-Security-Policy:
  default-src 'none';
  script-src https://selasi-render.dev/r/runtime.js;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:;
  font-src 'self';
  connect-src 'none';
  form-action 'none';
  base-uri 'none';
  frame-ancestors https://selasi.dev;
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Cross-Origin-Resource-Policy: same-origin
```

The only script that runs is the runtime. `connect-src 'none'` means a
screen cannot send data anywhere. `frame-ancestors` means only selasi.dev
can embed it.

Tailwind classes are compiled on the server when the screen is saved
(Tailwind CLI on the fragment), so no compiler runs in the frame.

## 7.3 Sanitising

`ScreenValidator` runs before any version is stored:

- Parses the fragment with a real HTML parser, not regular expressions.
- Removes `<script>`, `<iframe>`, `<object>`, `<embed>`, `<link>`, `<meta>`,
  `<base>`, `<form action>`, every `on*` attribute, `javascript:` and
  `data:text/html` URLs, and `srcdoc`.
- Allows images only from `assets/` paths of the same project, or `data:`
  images under 200 KB.
- Checks size, the `data-screen` root, unique `data-sel` ids and that every
  `data-go` target exists in the flow.
- Pasted user code goes through the same sanitiser before it can be shown
  in a device.

Even if the sanitiser missed something, the separate origin, the sandbox
attribute and the CSP each block it on their own.

## 7.4 The runtime (`runtime.js`)

A small, fixed script (no network, about 8 KB) that makes screens
interactive and talks to the app only through `postMessage`:

- Handles `data-go`, `data-back`, `data-toggle`, `data-set`, `data-inc`,
  `data-dec`, `data-show-if`, `data-text`, `data-filter` (doc 4).
- Keeps prototype state (cart counts, toggles) in memory for the session,
  so the user can walk a flow with real-feeling state.
- On `data-go`, posts `{type: "navigate", to: "cart"}` to the parent. The
  app swaps the iframe to the next signed URL and passes the state along.
- Posts `{type: "ready"}`, `{type: "error", message}` and
  `{type: "select", sel}` (for selection edits).
- Accepts only these messages from the parent, and checks
  `event.origin === "https://selasi.dev"`: `set-theme` (tokens and variant),
  `set-mode` (light or dark), `set-state`, `select-mode` on or off.

Because theme changes are a message, "Make it dark" and "Show another
version" restyle the open screen instantly without reloading it.

## 7.5 Websites and scroll stories

Sites use the same host, with a browser chrome drawn by the app around the
iframe (address bar, back and forward, tabs), as in the concept build.
Scroll stories (sticky stages driven by scroll progress) are supported by
the runtime: it sets `--p` on every `[data-journey]` block as the frame
scrolls, which is how the delivery truck and headphone demos work.

## 7.6 Captures

The capture worker (headless Chromium with Playwright) opens the same
signed render URL at the device's viewport, waits for `ready`, and:

- **Screenshot:** renders the screen, then composites the device frame,
  status bar and browser chrome using the frame art from
  `device-lockscreens.js` (as Selasi Coder's composed captures do). 1K for
  Free; 2K and above for paid plans.
- **Flow GIF:** walks the flow from `start` following the links, captures a
  frame per screen with a short transition, and encodes with gifski. Free.
- **Video:** records a scripted walk (taps, scrolls) at HD or 2K. Paid.

Captures are stored in `captures/` and offered as downloads (the agent asks
before starting a download, as the brief requires).
