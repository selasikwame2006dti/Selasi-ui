# 9. Handoff to Selasi Coder, and GitHub

## 9.1 The handoff package

`HandoffBuilder` writes a folder (and a zip of it) under
`handoff/{timestamp}/`:

```
selasi-handoff/
├── plan.md                    the approved plan, latest version
├── SELASI-HANDOFF.md          transfer record (below)
├── manifest.json              files, purposes, hashes, run commands, schema
├── flow.json                  screens and links
├── theme/tokens.json          design tokens
├── theme/tokens.css           the same tokens as CSS variables
├── screens/{nn}-{slug}.html   one standalone page per screen (when chosen)
├── partials/                  tab bar, nav and other shared parts
├── assets/                    SVGs and uploaded images
└── captures/                  the flow GIF and one screenshot per screen
```

Whether `screens/` is included follows the user's choice in Settings,
Selasi Coder, What to send ("Plan only" or "Plan and screens"). This is the
open decision from the brief; the setting lets both be tried.

### `SELASI-HANDOFF.md`

```markdown
# Selasi handoff
Transferred from Selasi AI (web) to Selasi Coder.
Project: QuickChop (app) · Schema version: 1 · Date: 2026-11-17
Plan: version 2, approved 2026-11-17

## Files added
- plan.md, flow.json, theme/tokens.json, theme/tokens.css
- screens/01-welcome.html … screens/08-profile.html
- assets/ (6 files), captures/ (flow.gif, 8 screenshots)

## Decisions and memory
(copied from the project's SELASI.md)

## Next steps for Coder
1. Read plan.md first, then this record, then manifest.json.
2. Treat the files in the repository as the source of truth.
3. If plan.md and the files disagree, flag it and ask; do not assume.
4. Suggested stack: React Native (Expo) for the app; keep tokens as the theme.
5. Append a dated entry below when you pick this up.

## Coder log
```

### `manifest.json`

```json
{
  "schema": 1,
  "project": { "id": "p_8f2c", "name": "QuickChop", "kind": "app" },
  "plan_version": 2,
  "created": "2026-11-17T14:02:11Z",
  "run": { "install": "npm install", "start": "npm run dev", "build": "npm run build" },
  "files": [
    { "path": "plan.md", "purpose": "Approved plan", "sha256": "…" },
    { "path": "screens/03-menu.html", "purpose": "Menu: filters and meal grid", "sha256": "…" }
  ]
}
```

The run commands are a suggestion for Coder's scaffold, since the package
itself has no build step.

## 9.2 Sending to Selasi Coder

**Linking (once).** In Coder: Settings, Link web account. Coder shows a
field; the web app's Settings, Selasi Coder page shows a short pairing code
(`Q7·4KD·2M`, valid 10 minutes). Entering it links the desktop device to
the account through the existing `CoderApi` bridge. Coder already signs in
with the same account, so linking only marks which device receives
handoffs.

**Sending.**

1. The user presses Hand off. The dialog shows the package file list and
   previews (as in the concept build) and a target: Selasi Coder, GitHub,
   or Download.
2. For Coder, the server stores the handoff in `ai_handoffs` with status
   `ready`.
3. Coder checks `GET /api/coder/handoffs` when it starts and every two
   minutes while open, and receives a signed download URL for the zip.
4. Coder unpacks it into a new project folder, opens `plan.md`, appends to
   the Coder log in `SELASI-HANDOFF.md`, and calls
   `POST /api/coder/handoffs/{id}/picked-up`.
5. The web app shows "Picked up by Selasi Coder on Windows" in the chat and
   sends the notification if enabled.

If "Send automatically" is on, step 1 skips the review dialog.

## 9.3 GitHub

### Why a GitHub App

A GitHub App, not a personal token or a broad OAuth scope:

- The user picks exactly which repositories Selasi can see when installing.
- Installation tokens are short-lived (one hour) and created by the server
  when needed; nothing long-lived is stored except the installation id.
- Pushes show as "Selasi AI" in the repository history, clearly marked.

Permissions: Contents read and write, Pull requests read and write,
Metadata read. Nothing else.

### Connecting

1. Settings, GitHub, Connect → `/api/github/install` redirects to the App's
   install page.
2. GitHub redirects back to `/api/github/callback` with the installation id;
   the server stores it in `github_installations`.
3. `/api/github/repos` lists repositories the installation can see. The
   user picks a default repository (or creates one on GitHub).

### Pushing

`POST /api/github/push { project, repo, branch?, pr }` runs as a job:

1. Build the handoff package (9.1).
2. Create an installation token.
3. Read the target branch (default `selasi/{project-slug}`). If it does not
   exist, create it from the default branch's head.
4. Create blobs for changed files only (compare SHA-256 with the last push
   recorded in `ai_handoffs`), then a tree, then a commit with a clear
   message ("Selasi AI: QuickChop plan v2, 8 screens"), then move the branch
   ref forward.
5. If "Open a pull request" is on, open one against the default branch (or
   update the existing one) with the plan summary as its description.
6. Emit progress events and finish with links to the commit and pull
   request.

Rules:

- Never force-push. If the branch moved since the last push (someone
  committed), the new commit goes on top of their work; files Selasi did
  not create are never deleted.
- Every push asks the user first, in the chat, showing the repository,
  branch and file count. The agent cannot push on its own.
- Pushes are rate-limited per user (10 per hour) and logged.

### Disconnecting

Settings, GitHub, Disconnect deletes the stored installation id and links to
GitHub's page for removing the App from the account.
