# 6. Project files, versions and the flow

## 6.1 Storage layout

Every project is a directory. The database holds indexes and metadata;
these files are the source of truth.

```
storage/projects/{project_id}/
├── project.json            name, kind (app/site), created, owner, schema version
├── plan.md                 current plan (doc 3)
├── plan/                   plan history: v1.md, v2.md … plus approvals.json
├── SELASI.md               project memory (doc 8)
├── flow.json               screens, order, links, statuses
├── theme/
│   ├── tokens.json         design tokens (doc 5)
│   └── history/            tokens.v1.json … (every change kept)
├── partials/               shared parts: tabbar.html, topbar.html, sitenav.html
├── screens/
│   └── {slug}/
│       ├── v1.html  v2.html  v3.html …
│       └── meta.json       title, status, current version, notes per version
├── assets/                 draw_asset SVGs and user uploads (images only)
├── refs/                   reference outlines (links, screenshots), pasted code
├── captures/               screenshots, GIFs, videos with a manifest
├── chats/{chat_id}/
│   ├── messages.jsonl      append-only messages
│   └── compactions.jsonl   compaction summaries (doc 8)
└── handoff/                built packages: {timestamp}/ and .zip (doc 9)
```

All writes go through `FileStore`, which:

- refuses paths outside the project directory and any name with `..`;
- writes to a temporary file and renames it (no half-written files);
- records size and SHA-256 for every version;
- enforces limits: 60 KB per screen, 2 MB per asset, 200 versions per
  screen, 200 MB per project (older versions are pruned, never the current
  or any version that was handed off).

## 6.2 `flow.json`

```json
{
  "schema": 1,
  "start": "welcome",
  "tabs": [
    { "label": "Menu", "icon": "utensils", "to": "menu" },
    { "label": "Cart", "icon": "cart", "to": "cart" }
  ],
  "screens": [
    { "slug": "welcome", "title": "Welcome", "status": "done",     "version": 2, "position": 1 },
    { "slug": "signin",  "title": "Sign in", "status": "done",     "version": 1, "position": 2 },
    { "slug": "menu",    "title": "Menu",    "status": "building", "version": 0, "position": 3 },
    { "slug": "cart",    "title": "Cart",    "status": "planned",  "version": 0, "position": 4 }
  ],
  "links": [
    { "from": "welcome", "sel": "cta-start",  "to": "signin", "label": "Get started" },
    { "from": "signin",  "sel": "cta-next",   "to": "menu",   "label": "Continue" },
    { "from": "menu",    "sel": "meal-card",  "to": "detail", "label": "Tap a meal" }
  ],
  "pending_ideas": [
    { "id": "i_3", "text": "Vendor dashboard", "status": "asked" }
  ]
}
```

`FlowStore` validates every change: links point at existing screens or at
planned ones, slugs are unique, and every `data-go` in a screen has a
matching link. The Flow panel in the interface is drawn from this file, and
the Coder handoff includes it.

## 6.3 Screen files

A screen version is the HTML fragment described in `screen_rules.md`
(doc 4). Example:

```html
<main data-screen="cart" class="flex flex-col gap-4 p-[var(--page)]">
  <header data-sel="cart-head" class="flex items-center justify-between">
    <h1 class="text-[26px] font-extrabold">Your cart</h1>
    <span data-text="cart.count"></span>
  </header>
  <ul data-sel="cart-items" class="rounded-[var(--radius-card)] bg-[var(--card)]">
    <li data-item class="flex items-center gap-3 p-4">
      <img src="assets/jollof.svg" alt="" class="h-12 w-12 rounded-xl">
      <div class="flex-1"><b>Jollof and grilled chicken</b><small>GH₵ 45 each</small></div>
      <button data-dec="qty.jollof" aria-label="Less">−</button>
      <b data-text="qty.jollof">1</b>
      <button data-inc="qty.jollof" aria-label="More">+</button>
    </li>
  </ul>
  <button data-sel="cta-order" data-go="tracking" class="btn-primary">Place order</button>
</main>
```

## 6.4 Patches

`screen_patch` changes a screen without rewriting it. Operations target
`data-sel` ids, which every major block has:

```json
{
  "slug": "cart",
  "ops": [
    { "op": "set_text",   "sel": "cart-head", "path": "h1", "text": "Your order" },
    { "op": "add_class",  "sel": "cta-order", "class": "text-lg py-5" },
    { "op": "insert_after", "sel": "cart-items",
      "html": "<p data-sel=\"cart-note\" class=\"text-[var(--muted)]\">Pickup at Counter 3</p>" },
    { "op": "remove",     "sel": "promo-banner" }
  ]
}
```

A patch that cannot find its selector fails cleanly and the agent is told
which selector was missing; nothing is half-applied. Every successful patch
creates a new version, so Undo is always one step.

## 6.5 Versions in the interface

- The flow item shows the version number once a screen has more than one.
- A long-press (phone) or right-click (computer) on a flow item opens:
  versions with notes ("v3: bigger order button"), Restore, Duplicate,
  Rename, Delete.
- Restoring a version creates a new version with the old content (history
  is never rewritten).
- Theme history works the same way, so "go back to the green one" is one tap.

## 6.6 Concurrency

- One active run per chat. A second message while a run is going is queued
  as the next user turn, or attached to the current run as an
  `interjection` that the agent reads at its next step.
- Two chats in the same project can run, but screen writes take a short
  lock per screen. If two runs want the same screen, the second waits.
- The browser never writes screen files directly. Every change is an API
  call that the server validates.
