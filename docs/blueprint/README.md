# Selasi AI blueprint

This folder describes how the new Selasi AI (selasi.dev) works end to end:
what the product is, how the agent designs screens, how previews stay
isolated, how sessions and memory work on phones and computers, and how a
finished concept moves to Selasi Coder or GitHub.

The concept build in this repository (`index.html`, `assets/`) is the
reference for the interface. These documents are the reference for
everything behind it.

## Read in this order

| # | Document | What it covers |
|---|---|---|
| 1 | [Product and the change from the old Selasi AI](01-product.md) | What we had, why we are changing, what we keep, principles |
| 2 | [System architecture and file map](02-architecture.md) | Services, data flow, repository layout, main files, APIs, database |
| 3 | [The agent](03-agent.md) | Phases, plan mode, forms, suggestions, tools, the build loop, screen-by-screen streaming, models |
| 4 | [Sample system prompt](04-system-prompt.md) | The prompt the design agent runs on, with the context it is given |
| 5 | [Design library and how screens are made](05-design-library.md) | The pattern library the agent searches, tokens, composition, originality, references |
| 6 | [Project files, versions and the flow](06-project-files.md) | Storage layout, screen versions, flow.json, plan.md, edits and restyles |
| 7 | [Rendering sandbox and captures](07-sandbox.md) | Keeping generated screens isolated, the runtime, device frames, screenshots, GIFs, video |
| 8 | [Sessions, context and memory](08-sessions-memory.md) | Runs that survive closed tabs, phone and computer, rolling window, compaction, SELASI.md |
| 9 | [Handoff to Coder and GitHub](09-handoff-github.md) | The handoff package, linking Coder, the GitHub App and push pipeline |
| 10 | [Stamina, limits and safety](10-stamina-safety.md) | Metering, caps, abuse, ownership rules, takedowns |
| 11 | [Build order and open decisions](11-roadmap.md) | Milestones, what to build first, decisions still open |

## Words used in these documents

| Word | Meaning |
|---|---|
| Project | One idea. Has a plan, a flow, screens, a theme, memory and chats. |
| Chat | A conversation inside a project. A project can have several. |
| Run | One turn of the agent: from a user message until the agent stops. Runs live on the server, not in the browser tab. |
| Screen | One page of an app or a site, stored as a self-contained HTML file. |
| Flow | The screens and the taps that connect them (`flow.json`). |
| Theme | Design tokens shared by every screen (`theme/tokens.json`). |
| Pattern | A reusable layout from the design library, with slots the agent fills. |
| Plan | `plan.md`: what will be built and why. Approved by the user before building. |
| Memory | `SELASI.md` files the agent reads at the start of every run. |
| Stamina | The user's allowance for model use, shared with Selasi Coder. |
| Handoff | The package that moves a project from Selasi AI to Selasi Coder. |
| Sandbox | The separate origin where generated screens run, isolated from the app. |
