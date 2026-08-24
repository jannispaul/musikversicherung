# Handoff — backend automation after the Wohnsitz gate

**Status:** frontend shipped 2026-08-24 (commit `0102e59`). Backend **not yet
reviewed** — that is what this page is for. Owner ruling and rationale:
[wiki/business-facts.md](../wiki/business-facts.md#online-conclusion--residence-eligibility).
Flow mechanics: [anfrage-flows.md](anfrage-flows.md).

Everything below concerns the `mv-anfrage` webhook
(`https://automations.arise.so/webhooks/mv-anfrage`, the `automations` repo /
Cloudflare Worker) and whatever Make scenario still writes the Airtable
`Anfragen` table and sends the confirmation mails in `emails/`.

## What changed in the payload

The binding online conclusion is now offered only when `Wohnsitz =
Deutschland`. `Österreich`, `Schweiz` and `Anderes Land` fall back to the
request flow, exactly as an over-20 000 € or SINFONIMA lead does.

For a non-German residence that would previously have gone online, the POST
now looks like a plain request lead:

| Field | Before | Now |
| --- | --- | --- |
| `flow` | `online` | **absent** — the radio is cleared, and FormData omits unchecked radios |
| `Beitrag` | calculated premium | **absent** — the hidden input is removed |
| `Iban`, `Sepa`, `Geburtsdatum`, `Strasse`, `Hausnummer`, `Postleitzahl`, `Ort`, `Rechtliches`, `Nachricht2` | present | **absent** — the fields are hidden, so the browser does not submit them |
| `Nachricht`, `Terms` | absent | present (request-flow fields) |
| `Wohnsitz` | any of the four | any of the four; `Deutschland` on every online lead |

`Wohnsitz` itself is unchanged and was already being submitted — both online
confirmation templates already merge `{{1.Wohnsitz}}`.

## What to check

1. **How the automation decides "this is an online conclusion."** This is the
   one that matters. If the branch keys on `flow = online`, or on the presence
   of `Iban` / `Beitrag`, nothing needs changing — a Swiss lead now simply
   misses those and routes to the request path on its own. **If it keys on
   `Versicherung = IM SOUND` plus `Gesamtwert <= 20 000`, it is now wrong:** a
   Swiss lead still matches that and would get the online confirmation mail
   with an empty `{{1.Beitrag}}` and no IBAN. Confirm which it is before
   assuming this handoff is a no-op.

2. **Template selection in `emails/`.** `email-flow-10k or less.html` and
   `email-sammlung.html` are the online confirmations and merge `{{1.Beitrag}}`;
   `email-flow-not-online.html` is the request one. A non-German lead must land
   on the request template. Same question as (1), stated in mail terms.

3. **`Sicherheit` can arrive stale.** If a user reaches the online flow, answers
   the Proberaum questions (which sets the hidden `Sicherheit` input to
   `sicher` / `unsicher`), and only then switches `Wohnsitz` away from
   Deutschland, the input is **not** removed — the lead is submitted as a
   request but still carries `Sicherheit`. Pre-existing behaviour (the same
   happens when the sum insured is raised past 20 000 €), but the residence
   gate makes it easier to hit. Either ignore `Sicherheit` unless
   `flow = online`, or say so and it gets removed on the frontend alongside
   `Beitrag`.

4. **Airtable `Anfragen`.** Check whether a `Wohnsitz` column exists and whether
   any view, filter or automation splits leads by flow. Non-German leads will
   now appear in the request bucket instead of the online one, which shifts the
   counts.

5. **Nothing needs to reject a non-German applicant downstream.** The gate is a
   routing rule for the form, not a cover condition — see the `OPEN` marker in
   [business-facts.md](../wiki/business-facts.md#online-conclusion--residence-eligibility).
   A non-German lead is a normal request lead and gets a normal offer by
   e-mail.

## Not touched, still open

- The DE-only IBAN pattern (`^DE\d{2}[ ]…|DE\d{20}$`) was left as it is; it is
  consistent with a Germany-only online conclusion.
- The 20 000 vs. 40 000 threshold mismatch and the `incomplete` layout bug are
  unrelated and still open — see "Known issues / gaps" in
  [anfrage-flows.md](anfrage-flows.md).
- Worker idempotency (`src/lib/dedupe.ts` + the `DEDUPE` KV binding exist but
  are imported by no handler) is still open in the automations repo.
