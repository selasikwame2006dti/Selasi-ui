# 10. Stamina, limits and safety

## 10.1 Stamina

Stamina is the existing economy, shared with Selasi Coder. Users see a
filled ring and a percentage, not raw numbers (as in the concept build).

**Metering.** Every model call is priced from the model catalog's token
costs and converted to Stamina at the planning rate (12 GHS per USD).
Cached prompt tokens are charged at the provider's cached rate, which is
why the stable part of the prompt comes first (doc 4).

**Preflight and settle.**

1. When a run starts, `Stamina::reserve()` holds an estimate based on the
   phase (Explore and Plan are small; a Build run reserves for its screen
   limit).
2. If the reservation would pass the daily cap, the run does not start and
   the interface explains how much is left and when it refills.
3. Each model call charges against the reservation.
4. At the end, `Stamina::settle()` charges the real amount and releases the
   rest.

**Caps** (from the brief; daily and hard):

| Plan | Daily cap | Monthly price |
|---|---|---|
| Free | 0.30 | Free |
| Starter | 0.50 | GH₵ 150 |
| Pro | 0.90 | GH₵ 250 (planned 300 or 350) |

A pay-as-you-go top-up from about GH₵ 20 unlocks better modes until the
balance is used.

Five-hour windows pace use inside the day; each starts at the first prompt
and never raises the daily cap. The day boundary (Ghana calendar day or a
rolling 24 hours) is still an open decision (doc 11). Monthly ceilings must
stay below what each plan earns after fees and exchange.

**What costs nothing:** token restyles (dark, accent, versions), opening
screens, walking the flow, versions and restores, flow GIFs from existing
screens, and the handoff build.

## 10.2 Abuse limits

- Runs: one active per chat, three per user at once.
- Messages: 30 per 5 minutes per user.
- Screen writes: 12 per run, 200 per day.
- References: 20 links and 20 screenshots per project; 5 MB per upload.
- GitHub pushes: 10 per hour.
- New accounts: Free plan only for the first hour, and one Free account per
  verified phone or email.

## 10.3 Ownership and policy

**Blocked at request time** (the planner checks before any design work):

- Exact clones of a named site or app ("make me Instagram exactly").
- Impersonation: fake login, bank, wallet or payment screens for a real
  company, or anything made to collect someone's details under a false name.

The agent offers the allowed path instead: "I can design an original photo
sharing app with your own name and style."

**Allowed:** inspiration, common layouts, palettes, and redesigns of the
user's own product with their own material.

**Pasted code you did not write:** the user confirms they have the rights.
The confirmation is stored (`ai_rights_acks`: text hash, time, user id,
terms version).

**Privacy:** the agent reads only what the user gives it for the project.
No background checks on users, and no reading of repositories or chats it
was not given.

**Takedowns:** a public form (Settings, Help, Report content) for reporting
content, a documented process with response times, and a repeat-infringer
policy (warning, then project removal, then account suspension). Keep a
short runbook next to the admin tools.

## 10.4 Security checklist

- Generated screens only on the render origin, sandboxed, with the CSP in
  doc 7.
- Signed render and capture URLs, 30-minute expiry.
- No provider keys in the browser or in Selasi Coder (the existing bridge
  rule).
- GitHub installation tokens created per job and never stored.
- Every project file path checked by `FileStore`.
- Rate limits on every endpoint that starts work.
- Admin pages behind role checks and logged (already in the old app).
