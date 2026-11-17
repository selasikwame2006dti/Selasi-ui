# 8. Sessions, context and memory

## 8.1 Runs live on the server

A run belongs to the server, not to a browser tab:

- Starting a run queues it. A worker claims it, sends a heartbeat every
  10 seconds, and appends events to `ai_run_events`.
- The browser reads events over SSE. If the connection drops (phone locked,
  train tunnel, tab closed), the run keeps going. On return, the browser
  reconnects with `?after={last_seq}` and replays what it missed.
- If a worker dies, its heartbeat stops; after 60 seconds another worker
  re-claims the run from its last completed step (tool results are
  recorded, so finished screen writes are never repeated).
- When a run finishes while the user is away, a notification goes out if
  they turned it on (Settings, Notifications).

## 8.2 Phone and computer

The same project is open on any device at the same time.

| | Phone | Computer and tablet |
|---|---|---|
| Layout | One pane: Chat or Device, with the switch at the bottom | Chat, device and flow side by side |
| While building | Device pane shows finished screens; an "Ask" sheet sends messages without leaving it | Everything visible at once |
| Live sync | Both devices read the same run events; a message sent on one appears on the other | Same |
| Continuity | Open the project on the computer and it is exactly where the phone left it: same chat, same screen, same theme | Same |
| Offline | Composer queues the message and sends on reconnect | Same |

The device and screen being viewed are stored per user and project, so
opening a project on another device picks up the same screen.

## 8.3 What the model sees: context budget

`ContextBuilder` builds the context for every model call in this order,
stopping additions when the budget is reached:

| Part | Typical size | Rule |
|---|---|---|
| System prompt (cached) | 3–4K tokens | Always |
| Account `SELASI.md` | up to 1K | Always |
| Project `SELASI.md` | up to 2K | Always |
| `plan.md` | up to 2K | Always (the plan is never compacted) |
| Flow summary and theme tokens | up to 1K | Always |
| Current screen HTML | up to 6K | Only when refining one screen |
| Pattern details | up to 4K | Only after `search_library` in this run |
| Compaction summary | up to 2K | When the chat has been compacted |
| Recent messages (rolling window) | the rest | Newest first, whole turns only |

Tool results that are large (screen HTML from `screen_read`, pattern HTML)
are kept in full only for the run that fetched them. In later runs they are
replaced by a one-line note ("read cart v3"), because the file itself is
always available again.

## 8.4 Rolling window and compaction

- The rolling window keeps the most recent whole turns that fit. A turn is
  never split, so a user message never loses its reply.
- When the chat history outside the window grows past 12K tokens, the
  `summariser` model writes a compaction summary of the turns that fell out:
  decisions made, ideas rejected, what the user liked or disliked, open
  questions. It does not repeat what is already in `plan.md`, `flow.json` or
  memory, because those are re-read every run.
- Summaries are appended to `compactions.jsonl` with the message range they
  cover, so they can be rebuilt or audited. The user can open "Earlier in
  this chat" to read them.
- A new chat in the same project starts with no messages but the same plan,
  flow, theme and memory, so it continues the work, not the conversation.

## 8.5 Memory: SELASI.md

Two memory files, plain Markdown, readable and editable by the user.

**Account memory** (`ai_memories`, scope account): preferences that apply
to every project. Shown in Settings, Agent, Memory.

```markdown
# SELASI.md (account)
- Prefers dark surfaces and rounded cards
- Currency: Ghana cedi (GH₵)
- Likes short replies
- Hands off to Coder as plan and screens
```

**Project memory** (`storage/projects/{id}/SELASI.md`): facts about this
project that are not already in the plan.

```markdown
# SELASI.md (QuickChop)
## Audience
- Students at a Ghanaian university; Android, slow data
## Decisions
- Menu uses photo cards, two per row (user chose over list, 17 Nov)
- No vendor dashboard in this version (user said not now)
## Style notes
- Avoid green buttons; brand is orange
## Session log
- 17 Nov: plan v2 approved; built 8 screens; dark version tried and kept light
```

### Rules for writing memory

1. Only what the user said or approved. The agent never stores guesses
   about the user.
2. One short line per fact, in the right section. Update a line instead of
   adding a duplicate.
3. Every write emits `memory.saved`, shown as a small "Remembered" chip with
   Undo.
4. No secrets, payment details, passwords or personal data about other
   people, even if the user typed them.
5. The "Remember across projects" switch in Settings turns account memory
   off (nothing read, nothing written). Project memory always works because
   the project depends on it.
6. At the end of each Build or Refine run, the agent appends one line to the
   project's session log.

The handoff copies project memory into `SELASI-HANDOFF.md` (doc 9) instead
of shipping a second `SELASI.md`, so it never collides with the `SELASI.md`
Selasi Coder keeps per project.
