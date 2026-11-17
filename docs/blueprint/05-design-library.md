# 5. Design library, and how screens are made

The agent does not design every screen from nothing. It searches a curated
library of patterns, combines them, and adapts them to the project's theme
and content. This is a retrieval library, not model training: nothing is
fine-tuned, and every pattern is either original work written for Selasi or
made by a user who agreed to share it.

## 5.1 What a pattern is

A pattern is a small, well-made layout with named slots.

```json
{
  "id": "pt_list_value_rows_02",
  "name": "List with leading icon and trailing value",
  "kind": "app",
  "purpose": ["list", "history", "wallet", "orders"],
  "density": "comfortable",
  "mood": ["calm", "clean"],
  "structure": "stack > card > row[icon, title+subtitle, value]",
  "slots": {
    "title": "text", "items": "list<{icon, title, subtitle, value}>",
    "empty_state": "text"
  },
  "variants": ["divided", "separate-cards", "compact"],
  "tokens_used": ["--accent", "--radius-card", "--surface", "--muted"],
  "html": "<section data-sel=\"{{id}}\" class=\"...\">…</section>",
  "thumb": "patterns/pt_list_value_rows_02.png",
  "source": "original",
  "license": "selasi-internal",
  "quality": 0.92,
  "uses": 1840
}
```

Pattern families: onboarding, sign-in, home dashboards, lists, grids,
detail pages, checkout and payment, confirmation, empty states, settings and
profile, tab bars and navigation, site heroes, feature rows, pricing,
testimonials, galleries, forms, footers, and scroll stories (sticky stages
with progress-driven scenes, like the delivery truck and headphones demos).

## 5.2 How the library is searched

`search_library(query, filters)` combines two signals:

1. **Keyword and tag match** on purpose, kind, mood, density and structure.
2. **Embedding similarity** between the query and each pattern's
   description. Embeddings are stored with the pattern. Up to about 10,000
   patterns, brute-force cosine similarity in the worker is fast enough;
   after that, move embeddings to a vector index.

Results are ranked by match, quality, and a freshness penalty for patterns
the user has already seen in this project (so ten projects do not all look
the same). The tool returns the top eight with name, thumbnail URL,
structure, slots and variants. `get_pattern(id)` returns the full HTML.

## 5.3 How a screen is composed

```
plan line for the screen ─┐
project theme tokens ─────┤
project memory (style) ───┼──▶ search_library ──▶ pick 2–4 patterns
references (outlines) ────┘                         │
                                                    ▼
                         compose: order sections, choose variants,
                         fill slots with real content, apply tokens,
                         add runtime attributes, add data-sel ids
                                                    │
                                                    ▼
                         screen_write ──▶ check_screen ──▶ fix if needed
```

Rules the composer follows:

- **Combine, do not copy.** A screen uses at least two patterns, and at
  least one variant or arrangement differs from the library default.
- **Tokens, not hard-coded colours.** Every colour, radius and shadow comes
  from the theme.
- **Content from the idea.** Names, prices, places and copy are written for
  this project and audience, in the user's currency.
- **Illustrations drawn, not fetched.** `draw_asset` produces SVG art in the
  theme's colours. Uploaded photos from the user are allowed.

## 5.4 Themes and versions

`theme/tokens.json` holds the design decisions in one place:

```json
{
  "version": 4,
  "color": { "accent": "#E2622F", "surface": "#F5F6F8", "card": "#FFFFFF",
             "text": "#151920", "muted": "#6C7686", "line": "#E6E9EE" },
  "dark":  { "surface": "#0F1216", "card": "#1A1F27", "text": "#F1F3F6",
             "muted": "#97A1B2", "line": "#272D38" },
  "radius": { "control": 14, "card": 18, "sheet": 26 },
  "space": { "unit": 4, "page": 20, "gap": 12 },
  "type": { "family": "Inter", "scale": [12, 14, 16, 20, 26, 34], "weight_head": 800 },
  "elevation": "soft",
  "motion": "standard",
  "variant": "soft"
}
```

"Make it dark", "change the accent" and "show another version" (Soft, Bold,
Editorial) change tokens and the `variant` class only. The runtime applies
them instantly and no model is called. This is how the concept build's
restyle buttons already work.

## 5.5 References from the user

| The user gives | What happens |
|---|---|
| A link | `ReferenceReader` fetches the page server-side, keeps only an outline (sections, order, rough sizes, navigation shape) and drops text, images and logos. The agent sees the outline, never the page. |
| A screenshot | The vision model describes layout and structure into the same outline format. The image stays private to the project. |
| Pasted code | The user confirms they have the rights (stored in `ai_rights_acks` with text hash, time, user and terms version). The code is sanitised (doc 7), previewed in the device, and the user can pick sections to restyle. |

## 5.6 Originality checks

`Originality.php` runs after each `screen_write`:

1. **Structure fingerprint.** A hash of the screen's block tree (tags,
   nesting, data-sel order, ignoring text). If it matches a single library
   pattern too closely, the validator asks the agent to vary it.
2. **Named-product guard.** If the request or the plan names a real product
   and asks for a clone, the policy refuses at request time (doc 10). Text
   and brand checks run on the output too: logos, trademarked names in
   headers, and look-alike login or payment pages are rejected.
3. **Reference distance.** For screens made from a link outline, the
   section order may match but the text and assets must not.

## 5.7 Growing the library

- **Curated.** The team adds patterns through an admin page (preview,
  tags, slots, variants, quality score).
- **From users, opt-in only.** When a user marks a screen as "share as a
  pattern", it goes to a review queue with the user's consent recorded.
  Reviewers strip content, generalise slots and tag it.
- **Quality loop.** Patterns whose screens get approved, kept and handed off
  rise in `quality`; patterns that are often rewritten fall.
