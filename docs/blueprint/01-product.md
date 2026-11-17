# 1. Product, and the change from the old Selasi AI

## 1.1 What the old Selasi AI was

The old web app (`selasi-ai` repository) was an AI coding workspace:

- **Stack:** plain PHP 8 with a front controller (`index.php`), MySQL through
  PDO, Tailwind from a CDN, Phosphor icons, and the Monaco editor in the
  browser. The database (`selasi_db`, 66 tables) is shared with Selasi Coder.
- **Flow:** a user described an app; a "PM" prompt asked questions with an
  interactive form (`json:form`); the model wrote an `<idea_doc>`; the phase
  switched from ideation to execution, and the model streamed whole files
  into an IDE panel using a tag protocol (`<file>`, `<patch>`, `<read_file>`,
  `<remember>`, `<build_log>`).
- **Engine:** one streaming completion per message. Tags were applied after
  the fact with regular expressions. `<read_file>` re-ran the whole
  generation. `api/chat/stream.php` grew to about 1,800 lines.
  `WEB_AGENT_V2_PLAN.md` started moving this to a bounded agent loop.
- **Money:** credits in four buckets, then Stamina; Paystack checkout;
  per-plan limits in `plan_config`; model routing per plan and role
  (`routing_config`, the model catalog with role chains).
- **Bridge:** `CoderApi.php` and `api/coder/*` let the desktop app use the
  same accounts and Stamina without holding any secrets.

## 1.2 Why we are changing it

1. **Two products were doing the same job.** Selasi Coder builds, runs,
   tests and deploys real code on the user's machine, with an agent loop and
   tools the web app could never match in a browser. A second, weaker code
   builder on the web confused the offer.
2. **Code in a browser editor is the wrong first thing to show.** Most of the
   target users (founders, students, designers, people pitching an idea)
   want to *see* the idea. A file tree and Monaco made them read code before
   they could judge the idea.
3. **Running real code safely on shared hosting was out of reach.** The
   Sandpack research shows how much infrastructure a real in-browser
   runtime needs. A visualiser needs far less: static screens and a tiny
   navigation runtime.
4. **Phones.** An IDE does not work on a phone. A chat plus a device you can
   tap through does.
5. **Cost.** Whole-file regeneration and re-runs burned tokens. Screens with
   shared tokens, patterns and small patches are cheaper, and restyles can
   cost nothing (token swaps, no model call).

## 1.3 What the new Selasi AI is

A web tool where you describe an app or website idea, see it as clickable
screens inside real device frames, change it by talking, capture it, and
hand it to Selasi Coder when you want it built. It is an idea visualiser,
not a production builder.

It does **not** run user code, deploy, or act as a general coding agent.
That is Selasi Coder's job.

## 1.4 What we keep from the old app

| Keep | Becomes |
|---|---|
| Accounts, sessions, `users` table | Same, shared with Coder |
| Stamina tables, `plan_config`, Paystack | Same economy; web and desktop share one balance |
| Model catalog with role chains | Roles change: planner, designer, fixer, vision, summariser |
| `json:form` ideation forms | `ask_form` tool with typed answers |
| `<idea_doc>` | `plan.md`, approved through the interface |
| `WebMemoryStore` user and session tiers | `SELASI.md` account and project memory |
| `PromptBuilder` (single source of prompts) | Same idea, new prompt files (doc 4) |
| `CoderApi` bridge | Extended with handoff endpoints (doc 9) |
| Admin panel | Plus a design-library admin (doc 5) |
| Settings sections | Redesigned in this concept build (Settings) |

What we drop: Monaco, the tag protocol, whole-file regeneration, phase
detection by regular expression, and the monolithic stream endpoint.

## 1.5 Principles

1. **Device first.** The device is the centre of the screen. Chat explains
   and steers; the device proves.
2. **Plan before building.** Plan mode is the default. Nothing renders until
   the user approves a plan, unless they turn plan-first off.
3. **Show progress as it happens.** Each screen appears in the flow as soon
   as it is done, and the user can tap through finished screens while the
   agent works on the next.
4. **Cheap changes stay cheap.** Colour, surface, radius and density live in
   tokens. Changing them never calls a model.
5. **Generated code never touches the app.** Screens run on a separate
   origin with no access to the user's session (doc 7).
6. **Files are the source of truth.** `plan.md`, `flow.json`, the theme and
   the screens are what the agent reads back, not old chat messages.
7. **Original work only.** Inspiration, layouts and the user's own material
   are fine; exact clones and impersonation are blocked (doc 10).
8. **One account, one balance, two apps.** Web and Coder share accounts,
   Stamina and memory format.
