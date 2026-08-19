# Anfrage form — flows & flow logic

Reconstructed from the source. This documents the **intended** behaviour and the
**current** behaviour of the `/anfrage` multi-step form so the flow bugs can be fixed
against a clear spec.

## Where the logic lives

The form is driven by **two** scripts, both loaded from `src/pages/anfrage.astro`:

| File | Responsibility |
| --- | --- |
| `src/scripts/anfrage.js` | Generic multi-step engine: step navigation, validation, `data-condition-*` show/hide, autosave, instrument repeater, submit + success/error container toggling. **Knows nothing about the three flows.** |
| `src/scripts/calculator.js` | Price calculation **and all flow logic**: which of the three flows the user is in, showing/hiding `[data-flow]` content, and picking which `[data-success]` message is shown. |

Markup: `src/partials/anfrage.html`.

The flow system is **not** a `data-condition` feature. It is a separate mechanism keyed on:

- `[data-flow="online"]`, `[data-flow="callback"]`, `[data-flow="!callback"]`, `[data-flow="request"]` — form content shown/hidden per flow.
- `[data-success="request|online|incomplete"]` — the three success screens.
- A hidden `flow` radio group (`[data-name='flow-choice']`, values `online` / `callback`).

All `[data-flow]` / `[data-success]` visibility is set imperatively inside
`calculatePrice()` in `calculator.js`. That function runs **once on init** and then on
`input`/`click` of a fixed set of fields (`Versicherung`, `Zahlung`, `Gesamtwert`,
coverage section, secure section, `Proberaum`, `Bewohnt`, `flow`). Nothing else re-runs it.

> **Consequence:** if `calculator.js` fails to run, or `calculatePrice()` is never
> triggered for a given transition, every `[data-flow]` block and all three
> `[data-success]` blocks stay at their default (visible) state → "all flows shown at
> once, duplicate buttons, 3 success states". See "Known issues" below.

## Inputs that determine the flow

| Field | Values | Role |
| --- | --- | --- |
| `Versicherung` | `SINFONIMA` (acoustic) / `IM SOUND` (electronic) | Top-level branch |
| `Gesamtwert` | number (€) | Price + online-eligibility threshold |
| `Zahlung` | `Monatlich` / `Jaehrlich` | Pricing only |
| `Deckung` | `Weltweit` / `Stationaer` | Pricing, only relevant > 20 000 € |
| `flow` | `online` / `callback` | User's choice, only offered when eligible |
| `Proberaum` | `Ja` / `Nein` | Security branch (IM SOUND) |
| `Bewohnt` | `Ja` / `Nein` | Security branch |
| `Schloss20mm`, `Schliesszylinder`, `Sicherheitsbeschlaege`, `Fenster`, `Pilzkopfverriegelung` | `Ja` / `Nein` | Security qualification |

## The three flows

### 1. `request` — non-binding email offer / callback
- **Entered when:** `SINFONIMA` (any value) **OR** `IM SOUND` with `Gesamtwert > 20 000` **OR** `IM SOUND`, `≤ 20 000`, but `flow = callback`.
- **Form:** 3 steps. No IBAN/SEPA, no Geburtsdatum, no address, no step 4. Step-3 submit button is **"Unverbindlich anfragen"** (`data-flow="request"`). Shows `Nachricht` + `Terms` checkbox.
- **`flow = callback` sub-case:** additionally reveals `[data-flow="callback"]` content (phone required, Erreichbarkeit) and hides `[data-flow="!callback"]`.
- **Success:** `[data-success="request"]`.

### 2. `online` — instant cover / binding application
- **Entered when:** `IM SOUND`, `Gesamtwert ≤ 20 000`, `flow = online`, and the proberaum/security check passes (no proberaum, or `Bewohnt = Ja`, or proberaum answered as secure).
- **Form:** reveals all `[data-flow="online"]` content — Geburtsdatum, address, proberaum address, IBAN + SEPA, and the 4th step (Vertragsgrundlage). Step 3 shows **"Weiter"** → step 4 submit **"Beitragspflichtig beantragen"**. A hidden `Beitrag` input carries the calculated price; a hidden `Sicherheit = "sicher"` input is added.
- **List disclaimer:** if `Gesamtwert > 10 000`, show `list-disclaimer` (Excel list must follow) instead of `next-disclaimer`.
- **Success:** `[data-success="online"]` (vorläufiger Versicherungsschutz).

### 3. `incomplete` — proberaum needs manual review
- **Entered when:** `IM SOUND`, `≤ 20 000`, `flow = online`, `Proberaum = Ja`, `Bewohnt = Nein`, **and** any security answer fails: `Schloss20mm = Nein` OR `Schliesszylinder = Nein` OR `Sicherheitsbeschlaege = Nein` OR (`Fenster = Ja` AND `Pilzkopfverriegelung = Nein`).
- Sets hidden `Sicherheit = "unsicher"`.
- **Success:** `[data-success="incomplete"]` ("Rückfragen zum Proberaum erforderlich").

## Flow decision (as implemented in `calculatePrice`)

```
if (IM SOUND && value <= 20000) {
    show flow-choice
    if (flow === 'online')   -> online layout,  success = online
    else if (flow==='callback') -> request layout + callback items, success = request
} else {
    hide flow-choice
    -> request layout, success = request      // SINFONIMA, or IM SOUND > 20000
}

// security overlay (only when flow === 'online'):
if (IM SOUND && flow==='online' && (Proberaum==='Nein' || Bewohnt==='Ja'))
    Sicherheit='sicher',  success = online
else if (Proberaum==='Ja' && Bewohnt==='Nein' && flow==='online')
    if (any security fails) Sicherheit='unsicher', success = incomplete
    else                    Sicherheit='sicher',   success = online
```

## Submit guard (double-submit / duplicate leads)

Fixed 2026-08-19 in `src/scripts/anfrage.js` + `src/styles/global.css`.

**Symptom:** duplicate leads — the notification email arrived twice and two
identical rows landed in the Airtable `Anfragen` table.

**Cause:** two separate POSTs from two clicks. There was no double-submit guard
of any kind. The loading block in `submitForm` queried `[data-form='submit']`,
but the buttons are `data-form="submit-btn"` — 0 matches, so it never ran and
the button gave no feedback for the 4–10 s the Worker takes (Airtable create +
Strato SMTP). Every further click ran another `fetch`.

**Fix:**

- `isSubmitting` module flag; `submitForm` returns early while it is set. The
  flag is latched **after** `validateStep()` passes, so failing validation never
  locks the user out.
- `setSubmitPending(pending)` toggles an `is-submitting` class and `aria-busy`
  on every `[data-form='submit-btn']` and swaps the label to "Sendet…"
  (original stashed in `dataset.labelBeforeSubmit`).
- `.button.is-submitting { pointer-events: none; opacity: .5 }` in `global.css`
  (which loads after `webflow.css`).
- Released on every non-success terminal path: the `!response.ok` branch (which
  previously did nothing at all) and `.catch` both call `setSubmitPending(false)`
  and show `[data-form='error']`. On success it stays latched — the form is
  hidden, so there is nothing left to resubmit.

**Do not add `pointer-events: none` to `.disabled`.** That class is applied by
`validateStepWithoutOverlays` whenever the current step is invalid, and clicking
the greyed button is exactly how the user gets `reportValidity()` to raise the
native validation bubble. The two classes must stay separate.

The `keypress`/Enter path goes through the same `handleClicksAndEnter`
dispatcher, so the flag covers keyboard submits too.

> **Still open (automations repo, not this one):** make the Worker idempotent.
> `src/lib/dedupe.ts` and the `DEDUPE` KV binding exist but are imported by no
> handler. Also: Make scenario `2250214` is still active and still writes to the
> same Airtable base/table (last execution 2026-08-02, so not the cause here).

## Known issues / gaps (candidates for the fix)

1. **`incomplete` never leaves the online layout.** *Verified in dev.* When the flow
   resolves to `incomplete`, only the success message is switched; the online funnel stays
   visible — the user is still shown IBAN/SEPA, step 4, and "Beitragspflichtig beantragen",
   then lands on a "we'll call you" success. `incomplete` should almost certainly fall back
   to the `request` layout (no IBAN/step 4).

2. **Threshold mismatch: 20 000 vs 40 000.** The online-eligibility gate uses
   `value <= 20000`, but the code comment (calculator.js ~line 236) says the online flow is
   "under 40.000 €". Pricing, meanwhile, treats IM SOUND as calculable up to 40 000. So
   20 000–40 000 IM SOUND gets a price but is forced into `request`. Needs confirmation of
   the intended cutoff.

3. **Single point of failure.** All flow/success visibility depends on `calculatePrice()`
   running. On the current dev build it does run and shows exactly one flow + one success at
   a time (could **not** reproduce "all 3 at once" on dev). If the reported "everything shown
   at once" appears on staging/production, the likely cause is `calculator.js` not executing
   there (bundling/error), not the flow logic itself — worth confirming which environment the
   bug was seen on.

4. **No reset safety net.** Because visibility is only corrected on specific input events,
   there is no guaranteed "hide all flows, then show the active one" reset. A defensive
   approach would hide all `[data-flow]`/`[data-success]` first each run (or via base CSS)
   and only reveal the active flow.
