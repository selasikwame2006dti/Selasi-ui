# 2. System architecture and file map

## 2.1 The pieces

```
                ┌──────────────────────────────────────────────┐
  Browser       │  App shell  (selasi.dev)                      │
  (phone or     │  chat · device stage · flow · settings        │
   computer)    │      │  SSE events          ▲ postMessage     │
                │      ▼                      │ (screen events) │
                │  ┌──────────────┐   ┌────────────────────────┐│
                │  │ App API      │   │ <iframe sandbox>        ││
                │  │ calls (JSON) │   │ render.selasi.dev       ││
                │  └──────┬───────┘   │ generated screens only  ││
                └─────────┼───────────┴────────────────────────┘┘
                          │
        ┌─────────────────▼──────────────────┐        ┌────────────────────┐
        │  App server (PHP 8, existing)       │        │ Render host        │
        │  auth · projects · stamina ·        │◀──────▶│ (static files on a  │
        │  Paystack · admin · Coder bridge    │ signed │  separate origin)   │
        └───────┬───────────────┬────────────┘  URLs  └────────────────────┘
                │ jobs          │ SQL
        ┌───────▼───────┐  ┌────▼─────────┐   ┌────────────────────────────┐
        │ Agent worker   │  │ MySQL        │   │ Capture worker              │
        │ (long-running) │  │ selasi_db    │   │ headless Chromium:          │
        │ model calls,   │  └──────────────┘   │ screenshots, GIFs, video    │
        │ tools, events  │                     └────────────────────────────┘
        └───────┬────────┘
                │ files
        ┌───────▼─────────────────────┐   ┌──────────────────────────┐
        │ Project storage              │   │ Model providers          │
        │ projects/{id}/...  (doc 6)   │   │ via the model catalog    │
        └──────────────────────────────┘   └──────────────────────────┘
```

**App server.** Keeps the existing PHP code base: accounts, Stamina,
Paystack, plans, admin, the Coder bridge. Gains project, chat, run, flow and
handoff endpoints. It never runs generated screens.

**Agent worker.** A long-running process that executes runs. A run started
from a phone keeps going if the phone locks. The worker writes events to a
run log; browsers read the log over SSE and can reconnect from any event.
On shared hosting the 30-second limit kills long runs (noted in the old
master docs), so the worker needs a VPS or a container. PHP CLI works; a
Node worker is also fine because it only talks to the database, storage and
model APIs.

**Render host.** A separate origin (`render.selasi.dev`, ideally its own
registrable domain such as `selasi-render.dev`) that serves generated
screens and a small navigation runtime. Separate origin is what keeps a
generated screen from reading the app's cookies or DOM (doc 7).

**Capture worker.** Headless Chromium that opens the same render URLs at
device sizes and composites the device frames (the frame artwork from
`assets/js/device-lockscreens.js`) for screenshots, flow GIFs and video.

**Storage.** A directory per project, on disk first and object storage
later. Layout in doc 6.

## 2.2 One message, end to end

1. The user sends a message. `POST /api/ai/chats/{chat}/messages` stores it,
   checks Stamina (doc 10), creates a run and queues it. The response
   contains `run_id`.
2. The browser opens `GET /api/ai/runs/{run}/events` (SSE).
3. The worker loads context (doc 8), calls the model, executes tools, and
   appends events: text deltas, plan updates, forms, screen progress, flow
   changes, Stamina use.
4. The browser renders events as they arrive. A finished screen loads in the
   device straight away (doc 3, section 3.6).
5. The run ends with `run.done` (or `run.waiting` when it needs an answer,
   such as plan approval or a form). Stamina is settled.

## 2.3 Repository layout (new Selasi AI web app)

The concept build becomes the front end. The PHP app keeps its structure.

```
selasi-ai/
├── index.php                         front controller (existing)
├── includes/
│   ├── config.php                    constants, PLAN_LIMITS (existing)
│   ├── Database.php  Auth.php  User.php  ApiResponse.php  Logger.php   (existing)
│   ├── Paystack.php  CoderApi.php  ModelCatalog.php                     (existing)
│   ├── Stamina.php                   meter, preflight, settle (doc 10)
│   ├── Projects/
│   │   ├── ProjectStore.php          create, read, list, delete projects
│   │   ├── FileStore.php             all project file I/O, versions, hashes
│   │   ├── FlowStore.php             flow.json read/patch/validate
│   │   ├── PlanStore.php             plan.md, approvals, amendments
│   │   └── ThemeStore.php            tokens.json, base.css compile
│   ├── Agent/
│   │   ├── RunQueue.php              create, claim, heartbeat, cancel runs
│   │   ├── RunLog.php                append and read events (SSE source)
│   │   ├── AgentLoop.php             the bounded tool loop (doc 3)
│   │   ├── ContextBuilder.php        assembles the prompt (doc 8)
│   │   ├── Compactor.php             summaries for long chats (doc 8)
│   │   ├── MemoryStore.php           SELASI.md read/write rules (doc 8)
│   │   ├── PromptBuilder.php         prompt files to system prompt (doc 4)
│   │   ├── ToolRegistry.php          tool schemas and dispatch
│   │   └── Tools/                    one class per tool (doc 3, section 3.4)
│   ├── Design/
│   │   ├── PatternLibrary.php        search and fetch patterns (doc 5)
│   │   ├── Composer.php              fill pattern slots with theme tokens
│   │   ├── ScreenValidator.php       HTML rules, size limits, link checks
│   │   ├── Originality.php           structure fingerprints, clone checks
│   │   └── ReferenceReader.php       links and screenshots to outlines
│   ├── Render/
│   │   ├── RenderUrls.php            signed render URLs (doc 7)
│   │   └── CaptureJobs.php           queue screenshots, GIFs, video
│   ├── Handoff/
│   │   ├── HandoffBuilder.php        plan, record, manifest, zip (doc 9)
│   │   └── GitHubApp.php             installation tokens, Git Data API
│   └── prompts/
│       ├── identity.md               who the agent is, tone, limits
│       ├── phase_explore.md          clarify with forms
│       ├── phase_plan.md             write and amend plan.md
│       ├── phase_build.md            theme first, then screen by screen
│       ├── phase_refine.md           smallest change, tokens before code
│       ├── screen_rules.md           HTML contract for screens (doc 6)
│       └── policy.md                 clones, impersonation, rights
├── api/
│   ├── ai/
│   │   ├── projects.php              list, create, rename, delete
│   │   ├── chats.php                 list, create
│   │   ├── messages.php              post a message, starts a run
│   │   ├── runs.php                  status, cancel
│   │   ├── events.php                SSE stream with ?after=cursor
│   │   ├── plan.php                  get, approve, request changes
│   │   ├── forms.php                 answer a form
│   │   ├── flow.php                  get flow, reorder, rename screens
│   │   ├── screens.php               get version, list versions, restore
│   │   ├── theme.php                 get, set tokens (no model call)
│   │   ├── captures.php              request and list captures
│   │   ├── memory.php                read, edit, clear SELASI.md
│   │   ├── references.php            upload screenshot, add link, paste code
│   │   └── handoff.php               build package, send to Coder, download
│   ├── github/
│   │   ├── install.php               start GitHub App install
│   │   ├── callback.php              store installation id
│   │   ├── repos.php                 list repositories the app can see
│   │   └── push.php                  push a project (doc 9)
│   └── coder/                        existing bridge, plus handoffs.php
├── workers/
│   ├── agent-worker.php              claims runs, runs AgentLoop
│   └── capture-worker.js             Playwright captures
├── render/                           deployed to the render origin
│   ├── runtime.js                    navigation, events, state (doc 7)
│   ├── base.css                      reset and token plumbing
│   └── fonts/                        bundled fonts
├── public/                           the concept build, grown up
│   ├── index.html
│   └── assets/{css,js,img,fonts}/
└── storage/projects/{id}/...         project files (doc 6)
```

## 2.4 Database additions

Existing tables stay. New tables:

| Table | Key columns |
|---|---|
| `ai_projects` | `id`, `user_id`, `name`, `kind` (app/site), `status`, `theme_version`, `plan_status` (none/draft/approved), `created_at`, `updated_at` |
| `ai_chats` | `id`, `project_id`, `title`, `summary_upto_msg`, `created_at` |
| `ai_messages` | `id`, `chat_id`, `role`, `content_json`, `tokens_in`, `tokens_out`, `run_id`, `created_at` |
| `ai_runs` | `id`, `chat_id`, `status` (queued/running/waiting/done/failed/cancelled), `phase`, `worker_id`, `heartbeat_at`, `stamina_reserved`, `stamina_used`, `error` |
| `ai_run_events` | `run_id`, `seq`, `type`, `payload_json`, `created_at` (append only; SSE source) |
| `ai_screens` | `id`, `project_id`, `slug`, `title`, `status`, `current_version`, `position` |
| `ai_screen_versions` | `screen_id`, `version`, `sha256`, `bytes`, `run_id`, `note`, `created_at` |
| `ai_memories` | `id`, `scope` (account/project), `owner_id`, `body_md`, `updated_at` |
| `ai_patterns` | `id`, `name`, `kind`, `purpose`, `density`, `mood`, `structure`, `slots_json`, `html`, `thumb`, `source`, `license`, `quality`, `uses`, `embedding` |
| `ai_references` | `id`, `project_id`, `type` (link/screenshot/code), `outline_json`, `rights_ack_id` |
| `ai_rights_acks` | `id`, `user_id`, `text_hash`, `terms_version`, `created_at` |
| `ai_captures` | `id`, `project_id`, `type`, `device`, `resolution`, `status`, `path` |
| `ai_handoffs` | `id`, `project_id`, `target` (coder/github/download), `manifest_sha`, `status`, `picked_up_at` |
| `github_installations` | `user_id`, `installation_id`, `account_login`, `created_at` |

## 2.5 The events contract

Every event in `ai_run_events` has `seq` (increasing per run), `type` and a
payload. The browser keeps the last `seq` it saw and reconnects with
`?after=seq`.

| Type | Payload | Interface |
|---|---|---|
| `run.started` | `phase` | Typing indicator |
| `text.delta` | `text` | Appends to the reply |
| `tool.started` / `tool.done` | `name`, short `summary` | Slim tool chip, expandable |
| `form.ask` | form schema (doc 3) | Form card; run waits |
| `plan.updated` | `version`, `markdown`, `diff` | Plan card with Approve |
| `plan.approved` | `version` | Plan card locks; build starts |
| `theme.updated` | `tokens` | Device restyles instantly |
| `flow.updated` | screens and links | Flow list redraws |
| `screen.started` | `screen_id`, `title`, `position` | Flow item shows "Building" |
| `screen.progress` | `screen_id`, `stage` (layout/content/polish) | Progress on the item |
| `screen.done` | `screen_id`, `version`, `url` | Item turns done; device can open it |
| `screen.failed` | `screen_id`, `reason` | Item shows retry |
| `suggestions` | up to four short replies | Chips and the Ask sheet |
| `memory.saved` | `scope`, `line` | "Remembered" chip with Undo |
| `stamina` | `used`, `left_pct` | Stamina ring |
| `run.waiting` | `for` (plan/form/confirm) | Composer shows what is needed |
| `run.done` / `run.failed` | summary or error | Ends the turn |
