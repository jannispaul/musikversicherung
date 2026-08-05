# Tracking setup (as-built)

Analytics/consent for musikversicherung.com after the move to **Cloudflare Zaraz**
(server-side/edge tag management). Live since 2026-08. This is the record of what
was built, **why**, and the non-obvious gotchas — so the next person doesn't
re-derive them.

## The stack in one paragraph

The site is static, served by **Cloudflare Pages** (the domain runs through
Cloudflare — required for Zaraz). **Zaraz** auto-injects at the edge and loads
**GA4** and the **Meta Pixel + Conversions API** server-side. **Cookiebot** is the
visible consent UI (CMP); a small bridge relays its choices to Zaraz's consent
purposes. **Umami** (self-hosted, cookieless) stays client-side for consent-free
aggregate analytics. There is **no client-side GTM** anymore.

## How an event flows

1. Site code calls `trackEvent(name, props)` (`src/scripts/analytics.js`), which
   calls `zaraz.track()` (falls back to `dataLayer.push` only if Zaraz is absent),
   and mirrors to Umami.
2. Zaraz, at the edge, checks the event against each **tool's** triggers **and
   consent purpose**, then sends server-side to GA4 / Meta.
3. Cookiebot's accept/reject is relayed into Zaraz by the bridge in
   `BaseHead.astro`, so consent gating actually happens.

Events emitted by the code:

| Event | Fired by | Goes to |
|---|---|---|
| `Lead` | `anfrage.js` on submit success, `{ value, currency:"EUR" }` | GA4 + Meta (conversion, with value) |
| `review_submit` | `neue-bewertung.js` | Umami/GA only — **blocked from Meta** |
| `claim_submit` | `multi-step-form.js` | Umami/GA only — **blocked from Meta** |

`value` = commission estimate = insured sum × premium rate × 12% provision
(computed in `getLeadValue()`).

## Key decisions & gotchas (the hard-won part)

**1. The Meta/Facebook tool auto-forwards every `zaraz.track()` to CAPI.**
This is the big one. Zaraz's Facebook tool sends *every* tracked event to the
Conversions API as a custom event, **on top of** any custom actions you define —
and it is server-side only (no client `fbq`). So a custom "Lead" action
*double-sent* (`lead_form_submit` auto-forward + `Lead` action). **Fix:** name the
conversion event with Meta's standard name **`Lead`** and define **no** Meta
action for it — the auto-forward *is* the Lead conversion. Consequence: the
auto-forward also ships `claim_submit`/`review_submit` to Meta, so those are
suppressed with **tool-level Blocking Triggers** on the Meta tool. (GA4's tool
does *not* auto-forward — it needs explicit actions — so GA4 keeps its action.)

**2. Payload is minimal on purpose.** `Lead` sends only `{ value, currency }`.
Because the Meta tool auto-forwards the whole payload into `custom_data`, anything
extra (email, insurance type) would leak as restricted data and trip Meta's
data-use filter. So we send nothing but value + currency. `hashEmail()` /
`sha256Hex()` remain in `analytics.js` **dormant**, ready for when Google Ads /
proper advanced matching is wired up (both Meta and Google match on SHA-256 of the
trimmed+lowercased email).

**3. Consent purposes get random IDs — the bridge resolves by NAME.** Zaraz
assigns purposes opaque IDs (e.g. `eEJv`, `QLLD`), not `analytics`/`marketing`.
So the bridge in `BaseHead.astro` looks up the purpose ID by matching the purpose
**name** (`analytics` / `marketing`, case-insensitive; handles localized
`{en:"…"}` name objects). **Keep the Zaraz purpose names exactly `analytics` and
`marketing`** or the bridge stops matching.

**4. GA4 needs no API Secret.** Zaraz's GA4 tool sends server-side from the edge
using just the **Measurement ID**; there is no Measurement Protocol secret field.

**5. GA4 gets `value` + `currency` only, never PII.** GA4 conversion action:
"Include Event Properties" OFF; map `value` → `{{ client.value }}`, `currency` →
`{{ client.currency }}`.

**6. Cookiebot cookie-declaration placement.** The `<script id="CookieDeclaration"
… cd.js>` must sit **inside** the content container — it renders the cookie table
wherever the tag is. It lives in the empty `w-embed` under "1. Cookies" in
`src/partials/datenschutz.html` (not in `datenschutz.astro`, which put it at
page-wrapper level, below the container).

## Consent model — and why "server-side" is NOT a consent bypass

Consent under GDPR/ePrivacy (and §25 TTDSG) depends on **what data is processed
and why**, not where the tag runs. Meta and GA4 process personal data / device
storage for advertising and statistics → they **require consent**, server-side or
not. So "no GA/Meta event without consent" is correct and compliant — important
for a regulated insurance intermediary.

What server-side actually buys: performance (near-zero client JS), resilience for
**consented** users (first-party edge requests dodge ad-blockers/ITP → better
match quality), data governance (IP trimming, controlled payloads), and security.

Consent-free measurement is covered by **Umami** — cookieless, no PII, aggregate —
which runs under legitimate interest, so non-consenting traffic is still counted
anonymously. The lever to capture *more* is improving the Cookiebot acceptance
rate, not bypassing consent. (Google Consent Mode *modeling* can estimate the gap
from consented data; Meta has no consent-free mode. Confirm any modeling stance
with the DPO given German strictness.)

## Config reference (as configured in Zaraz)

- **Consent** (Zaraz → Consent): API enabled; purposes named `analytics` and
  `marketing`. Each tool assigned to its purpose. Cookiebot remains the UI.
- **Privacy** (Zaraz → Settings): Trim IP addresses ON. Data-layer compatibility
  mode **OFF** (it was forwarding Cookiebot's `cookie_consent_*` dataLayer pushes
  to Meta as junk events).
- **Trigger** `Lead`: Match rule → Event Name **Equals** `Lead`. Used by the GA4
  action. (Renamed from `lead_form_submit`.)
- **GA4 tool** → purpose `analytics`. Actions: Pageview; Event on the `Lead`
  trigger (value + currency only).
- **Meta tool** → purpose `marketing`. Pixel ID + CAPI token. **No custom Lead
  action** (auto-forward handles it). Tool-level **Blocking Triggers** on
  `claim_submit` and `review_submit`. Remove the **Test Event Code** after testing.
- **Umami**: still a plain client-side script in `BaseHead.astro`.

## Validation

- Real GA4/Meta events show in **GA4 Realtime/Overview** and **Meta Overview**
  (delayed ~20–60 min) and, live, in **Zaraz → Monitoring** (server-side status
  codes). **Meta Test Events only shows events carrying the Test Event Code.**
- Verified live (browser): Cookiebot→bridge→purpose flips correctly; accepting
  Statistik sets `analytics` true, Marketing stays independent; Meta receives a
  single standard `Lead` with value + currency; no client `fbq`.

## Datenschutz — DPO review still required

`src/partials/datenschutz.html` publicly names Meta Pixel/CAPI, Cloudflare/Zaraz,
GA4, Umami and (§6) the Cloudflare Workers form processor (replacing stale
Make.com text). The claims now match reality, but a DPO must verify: the legal
entities/addresses (Cloudflare, Google Ireland, Meta Platforms Ireland); any email
sub-processor of the `automations.arise.so` Worker; and US-transfer wording (Art.
49 / DPF) for Google + Meta.

## Open / future

- **Meta CAPI token** was exposed in a screenshot during setup → regenerate it.
- **Google Ads**: not running now. When it returns, wire Enhanced Conversions /
  Customer Match to `{{ client.email_sha256 }}` — re-enable the `hashEmail()` call
  in `anfrage.js` and add the hashed email to the payload (mind the Meta
  auto-forward: keep restricted data out, or block the relevant fields).
- **Own conversion store**: highest-value next step is persisting each lead in the
  `automations.arise.so` Worker → Cloudflare D1 (owned, unsampled conversion data
  to reconcile against closed policies). Not built yet.
- Optional: move Umami into Zaraz; add CTA micro-conversions via `trackEvent`.
