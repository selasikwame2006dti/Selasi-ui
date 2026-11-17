# 3. The agent

## 3.1 Phases

Each project moves through four phases. The phase is stored on the project,
not guessed from text.

| Phase | Goal | Ends when |
|---|---|---|
| **Explore** | Understand the idea: audience, platform, main job, style. | The agent has enough to plan (usually one form, at most two). |
| **Plan** | Write `plan.md`: screens, flow, style, open questions. | The user presses Approve. |
| **Build** | Make the theme, then each screen in order, wiring the flow. | All planned screens are done. |
| **Refine** | Changes, versions, restyles, captures, handoff. | Never; the user can always ask for more. |

When plan-first is turned off in settings, Explore and Plan collapse: the
agent writes a short plan for itself (still saved as `plan.md`) and goes
straight to Build.

## 3.2 Plan mode (the default)

1. **Explore with a form.** If the idea is thin ("a food app"), the agent
   calls `ask_form` instead of writing a wall of questions. The interface
   shows a card with chips, single choice, multi choice, a short text field
   or a colour picker. The run stops with `run.waiting` until the user
   answers. Answers come back as structured data and are written to project
   memory.

   ```json
   {
     "form_id": "f_01",
     "title": "A few quick choices",
     "questions": [
       { "id": "audience", "type": "single", "label": "Who is it for?",
         "options": ["Students", "Office workers", "Families", "Everyone"] },
       { "id": "platform", "type": "single", "label": "App or website?",
         "options": ["Phone app", "Website", "Both"] },
       { "id": "must", "type": "multi", "label": "Must have",
         "options": ["Mobile money", "Delivery tracking", "Pickup times", "Ratings"] },
       { "id": "colour", "type": "color", "label": "Brand colour", "optional": true },
       { "id": "notes", "type": "text", "label": "Anything else?", "optional": true }
     ]
   }
   ```

2. **Write the plan.** The agent calls `plan_write`. The interface shows a
   Plan card (rendered `plan.md`) with three buttons: **Approve and build**,
   **Change something**, **Ask a question**. The run stops with
   `run.waiting: plan`.

3. **Approve.** Approving stores `plan_status = approved` and the plan
   version, emits `plan.approved` and starts a Build run automatically.

4. **Change something.** The user types or picks a chip. The agent edits
   the plan with `plan_amend` (a diff), and the card shows what changed.

### `plan.md` template

```markdown
# QuickChop: plan  (version 2, approved 17 Nov 2026)

## Idea
Campus food pre-order so students skip the lunch queue.

## Audience and platform
Students on Android phones; works on small screens and slow data.

## Screens
1. Welcome: name, promise, Get started
2. Sign in: phone number and one-time code
3. Menu: filters, meal grid, cart button
4. Meal detail: photo, time, quantity, add to cart
5. Cart: items, pickup time, total, place order
6. Order tracking: status that updates, pickup code
7. Orders: past orders
8. Profile: student card, wallet, dietary choices

## Flow
Welcome → Sign in → Menu → Meal detail → Cart → Order tracking
Tab bar: Menu, Cart, Orders, Profile

## Style
Warm and bright. Accent #E2622F. Rounded cards, photo-led menu.

## Not in this version
Real payments, delivery, vendor dashboard.

## Open questions
- Do vendors need their own app later?

## Changelog
- v2: added Order tracking (user asked during build)
- v1: first plan
```

## 3.3 Ideas added after approval

New ideas never get lost and never silently change the plan.

- **Small change inside the plan** ("make the cart button bigger"): the
  agent just does it in Refine.
- **New scope** ("add a vendor dashboard"): the agent replies with a short
  amendment (`plan_amend`) and a Plan card showing the diff, with **Add to
  plan** and **Not now** buttons. If added, the new screens are queued in the
  flow as `planned` and built next. If not, the idea goes to the plan's
  "Not in this version" list and to project memory, so it is not suggested
  again.
- **Idea during a build**: the current screen finishes first. The idea is
  queued as a pending amendment and shown as a chip under the flow:
  "1 idea waiting". The agent addresses it when the screen is done.

## 3.4 Tools

Tools use native function calling. Each tool is a class in
`includes/Agent/Tools/` with a JSON schema, a Stamina class (free, cheap,
normal) and a permission rule.

| Tool | Does | Needs approval |
|---|---|---|
| `ask_form(form)` | Shows a form; run waits for answers | No |
| `suggest(chips[])` | Up to four quick replies | No |
| `plan_write(markdown)` / `plan_amend(diff)` | Writes or changes `plan.md`; run waits | Approval is the point |
| `memory_write(scope, line)` | Adds a line to `SELASI.md` | Shown with Undo |
| `search_library(query, filters)` | Finds patterns (doc 5) | No |
| `get_pattern(id)` | Full pattern with slots | No |
| `search_web(query)` | Facts and references with sources | Only if the user allowed web search |
| `read_reference(id)` | Outline of a link or screenshot the user gave | No |
| `theme_set(tokens)` | Writes `theme/tokens.json` | No |
| `screen_create(slug, title, position)` | Adds a planned screen to the flow | No |
| `screen_write(slug, html, links)` | Writes a new version of a screen | No |
| `screen_patch(slug, ops)` | Small edits by selector (doc 6) | No |
| `screen_read(slug, version?)` | Reads a screen back | No |
| `flow_link(from, selector, to)` | Adds or changes a tap in the flow | No |
| `draw_asset(name, svg)` | Stores an SVG illustration | No |
| `check_screen(slug)` | Runs the validator and a render probe | No |
| `capture(kind, device)` | Queues a screenshot, GIF or video | No |
| `handoff_prepare()` | Builds the handoff package | User presses Send |
| `github_push(repo, branch)` | Pushes the package | Always asks first |

There is no shell, no file system access outside the project, and no network
access except `search_web` and `read_reference`.

## 3.5 The loop

```
start run
  load context (doc 8)
  loop up to 24 steps or until stop:
      call model with tools
      stream text deltas as text.delta
      for each tool call:
          check permission and Stamina class
          execute, emit tool.started / tool.done and its own events
          if the tool says "wait" (form, plan, push approval):
              emit run.waiting and stop the run
      if the model gave a final answer with no tool calls: stop
  emit suggestions (if any), stamina, run.done
```

Limits: 24 model steps per run, 12 screen writes per run, and a
per-run Stamina reservation (doc 10). A long build is split into several
runs automatically: when a run hits a limit while screens are still
planned, it ends with `run.done` and queues a follow-up run that continues
from the flow, so no single request is long.

## 3.6 Building screen by screen

The Build phase always follows this order:

1. **Theme first.** `theme_set` writes colours, type scale, radius, spacing,
   elevation and motion tokens from the plan's style. Every screen uses
   these tokens, so later restyles cost nothing.
2. **Shared parts.** The tab bar, top bar and site nav are written once as
   partials (`partials/tabbar.html`) and included by screens.
3. **Screens in flow order.** For each planned screen:
   - `screen.started` → the flow item shows "Building".
   - The agent searches the library, composes, writes the screen, wires its
     links with `flow_link`, and calls `check_screen`.
   - `screen.done` with the version and render URL → the flow item turns
     done.
4. **Wrap up.** A short message, suggestions ("Show another version",
   "Make it dark", "Hand off to Coder") and the flow GIF offer.

**The user can use finished screens while the next one builds.** The device
keeps showing whatever the user is on. When `screen.done` arrives for
screen 1, the device unlocks to it. Later `screen.done` events update the
flow list without moving the user. Taps that lead to a screen that is not
done yet show a placeholder in the device ("Building Cart…") that swaps in
when it arrives.

Flow item states: `planned` → `building` → `done` (or `failed`, with Retry).
A done screen shows its version count; edited screens show "v3".

## 3.7 Refine

The agent picks the cheapest change that does the job:

1. **Token change** (colour, dark surface, radius, density, font):
   `theme_set` only. No screen is rewritten. Instant.
2. **Patch** (move, rename, add a field, change copy): `screen_patch` with
   selector-based operations.
3. **Rewrite one screen**: `screen_write` for that screen only.
4. **Version**: "Show another version" writes a new variant of the theme
   and, if needed, a new layout variant for the hero screens. The previous
   version stays one tap away.

When the user selects part of a screen in the device (long-press on phone,
click with the select tool on a computer), the selection's `data-sel` id is
sent with the next message, so "make this bigger" means that element.

## 3.8 Models

The model catalog's role chains stay; roles change.

| Role | Used for | Kind of model |
|---|---|---|
| `planner` | Explore and Plan, forms, amendments | Fast, cheap, good at following instructions |
| `designer` | Theme, screens, rewrites | Strongest available for the plan tier |
| `fixer` | Validator fixes, small patches | Cheap, fast |
| `vision` | Reading screenshots the user uploads | Vision-capable |
| `summariser` | Compaction, chat titles | Cheapest |

Auto mode picks per step. Fast mode uses `planner` for everything except
screen writes, which use the cheaper designer. Pro mode uses the strongest
designer and is paid only.
