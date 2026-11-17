# 11. Build order and open decisions

## 11.1 Milestones

Each milestone ends with something a user can try.

**M0. Foundations (move off shared hosting).**
VPS or container hosting for the app and a worker process; the render
origin with its CSP; the project storage layout; new database tables (doc 2).

**M1. One screen, end to end.**
`RunQueue`, `RunLog` and SSE with resume; `AgentLoop` with `screen_write`,
`theme_set` and `suggest`; `ScreenValidator`; the render host and
`runtime.js`; the device loads a real generated screen in the sandbox. No
plan mode yet.

**M2. Plan mode and the flow.**
`ask_form`, `plan_write`, `plan_amend`, the Plan card with Approve;
`flow.json`, screen-by-screen build with `screen.started` and
`screen.done`; tapping finished screens while the next one builds;
pending ideas.

**M3. Design library.**
Pattern schema and admin; the first 150 patterns (40 app, 40 site, the
rest shared parts); `search_library`; `Originality` fingerprints;
`draw_asset`.

**M4. Refine.**
`screen_patch` with selector operations; selection edits from the device;
versions and restore; theme versions (Soft, Bold, Editorial) as token sets.

**M5. Sessions and memory.**
Compaction, rolling window, account and project `SELASI.md` with the
Remembered chip; phone and computer live sync; notifications.

**M6. Captures.**
Capture worker: composed screenshots (1K and 2K), flow GIF, then video.

**M7. Handoff and GitHub.**
`HandoffBuilder`; Coder pairing and `api/coder/handoffs`; the GitHub App
install, push and pull request.

**M8. Launch hardening.**
Stamina preflight and settle on every path; abuse limits; policy checks;
takedown form; the demo with 20 to 40 invited testers, measuring cost per
user, Stamina used, revenue, cost per accepted task, and how many Coder
users start a second project within 14 days.

## 11.2 What already exists in this repository

| Piece | Where | Status |
|---|---|---|
| Layout for phone, tablet and desktop | `index.html`, `assets/css/app.css` | Concept, scripted replies |
| Device frames and lock screens | `assets/js/device-lockscreens.js` | Reusable as is |
| Flow panel, captures dock, Ask sheet | `assets/js/app.js` | Concept |
| Settings | `assets/js/settings.js`, `assets/css/settings.css` | Concept, simulated payments and connections |
| Prototype runtime ideas (state, steppers, filters, scroll progress) | `assets/js/prototype.js`, `stories.js` | Basis for `runtime.js` |
| Handoff dialog and package layout | `assets/js/app.js` | Concept |

## 11.3 Open decisions

1. **Entry pricing:** count concepts, exports or Stamina.
2. **Daily boundary:** Ghana calendar day or rolling 24 hours.
3. **Handoff contents:** plan only, or plan and screens. (Both are possible
   through the setting; pick the default after the demo.)
4. **Paystack USD:** setup and timing for paying in local currencies.
5. **Pro price:** GH₵ 250, 300 or 350 after the demo measures real use.
6. **Worker language:** PHP CLI (one language across the codebase) or Node
   (closer to Playwright and Tailwind tooling).
7. **Render domain:** a separate registrable domain (stronger isolation)
   or a subdomain with no shared cookies.
8. **Library sharing:** whether users can opt in to share screens as
   patterns at launch, or later.
