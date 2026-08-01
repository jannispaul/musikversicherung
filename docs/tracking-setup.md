# Tracking setup — Cloudflare Zaraz migration runbook

This is the exact manual checklist to finish the tracking migration. The **code
side is already done** (see "What the code already does" below); everything here
is dashboard configuration that can't live in the repo.

> **Sequencing — read first.** The client-side GTM container and Google Consent
> Mode defaults were **removed** from `BaseHead.astro`. Until Cloudflare Zaraz is
> live, GA4/Meta will not load (Umami keeps working). Therefore:
>
> **Do NOT merge this branch to `master` until steps 1–6 below are done and
> verified.** Deploy to Strato happens on push to `master`. Configure Cloudflare
> first, verify with Zaraz Debug mode on the staging/preview, then merge.

---

## Values you need to have ready

| Value | Where to get it | Used in |
|---|---|---|
| GA4 **Measurement ID** (`G-XXXXXXX`) | GA4 → Admin → Data streams | Zaraz GA4 tool |
| Meta **Pixel ID** | Meta Events Manager → Data sources | Zaraz Meta Pixel tool |
| Meta **Conversions API access token** | Events Manager → Settings → Conversions API → Generate token | Zaraz Meta CAPI (enter in Cloudflare only — never share/commit it) |

---

## Step 1 — Put the domain behind Cloudflare (Strato stays the origin)

1. Create a free account at cloudflare.com → **Add a site** → `musikversicherung.com`.
2. Let Cloudflare scan and **import DNS records**. **Verify every record** before
   continuing — especially **MX/mail** records and any subdomains (Strato mail,
   `automations.arise.so` is a different domain and unaffected). A missing record
   here is the one real risk of this move.
3. Cloudflare shows two **nameservers**. In the **Strato** domain panel, replace
   the current nameservers with Cloudflare's. Propagation is usually < 1 h.
4. Keep the DNS record for the web root **proxied (orange cloud)** — Zaraz only
   works on proxied hostnames. Origin hosting stays on Strato; Cloudflare just
   proxies HTTP and answers DNS.

*Rollback:* switch the nameservers back at Strato.

## Step 2 — Enable Zaraz

Cloudflare dashboard → **Zaraz**. Auto-inject is on by default (no script tag
needed — it's injected at the edge). Confirm **Auto-inject Zaraz script** is
enabled under Zaraz → Settings.

## Step 3 — Privacy settings (Zaraz → Settings → Privacy)

- **Trim IP addresses**: ON (GDPR).
- **Hide referrer**, **Remove query params** as desired (query params include your
  UTM/campaign params — leave OFF if you need campaign attribution).

## Step 4 — Consent purposes (Zaraz → Consent) — **required for the bridge**

`BaseHead.astro` relays Cookiebot's choices to Zaraz via a bridge that references
two **purpose IDs**. Create them with these **exact IDs**:

| Purpose ID (must match code) | Name shown to users | Maps from Cookiebot |
|---|---|---|
| `analytics` | Statistik / Analyse | `Cookiebot.consent.statistics` |
| `marketing` | Marketing | `Cookiebot.consent.marketing` |

The bridge lives in `src/components/BaseHead.astro` ("Cookiebot → Zaraz consent
bridge"). If you use different purpose IDs in Zaraz, update the `zaraz.consent.set`
keys there to match.

> Cookiebot stays the visible consent UI. Because Cookiebot's auto-blocking never
> sees the edge-injected Zaraz, gating **must** happen through these purposes.
> Assign each tool below to the right purpose so it only fires with consent.

## Step 5 — GA4 (Zaraz → Tools → add **Google Analytics 4**)

1. Paste the **Measurement ID**. (No API Secret needed — Zaraz's GA4 tool sends
   server-side from the edge using just the Measurement ID; there is no
   Measurement Protocol secret field.)
2. Assign the tool to the **`analytics`** consent purpose.
3. Triggers are created separately under **Zaraz → Triggers**, then selected in
   the action's *Firing Triggers*. Create a trigger `lead_form_submit`:
   Match rule → variable **Event Name**, operator **Equals**, value
   `lead_form_submit`.
4. Actions:
   - **Pageview** → Action Type *Page view*, trigger: the built-in *Pageview*.
   - **Conversion** → Action Type *Event*, *Firing Trigger*: `lead_form_submit`;
     **Event Name** field: literal `lead_form_submit`; **Mark as conversion**: ON.
     - **Do NOT enable "Include Event Properties"** — that would forward the
       hashed email to your Analytics property. Instead send only the two params
       you want: `value` → `{{ client.value }}`, `currency` → `{{ client.currency }}`.
     - GA4 must never receive `email_sha256`. (Hashed email is for the Meta /
       Google Ads *conversion* tools, not the Analytics property.)

## Step 6 — Meta Pixel + Conversions API (Zaraz → Tools → add **Facebook Pixel**)

1. Paste the **Pixel ID**, and the **Conversions API token** (enables server-side
   CAPI — better match quality, resilient to blockers).
2. Assign the tool to the **`marketing`** consent purpose.
3. Actions:
   - **PageView** → trigger: *Pageview*.
   - **`Lead`** (standard event) → trigger: `lead_form_submit`.
     Map `value` → `{{ client.value }}`, `currency` → `{{ client.currency }}`.
     For advanced matching, map the email field (`em`) → `{{ client.email_sha256 }}`.
     **This value is already SHA-256 hashed** (done client-side) — make sure the
     tool treats it as pre-hashed and does not hash it again. Verify in Meta
     Events Manager → Test Events that the email parameter shows as matched; if it
     doesn't, the component is re-hashing — tell the dev and we'll adjust.

> **Hashed email is cross-platform.** The same `email_sha256` (SHA-256 of the
> trimmed + lowercased email, produced in `src/scripts/analytics.js`) works for
> Meta Custom Audiences/CAPI **and** Google Ads Enhanced Conversions / Customer
> Match when you add Google Ads later — map its email field to
> `{{ client.email_sha256 }}` the same way. Raw email never leaves the browser.

## Step 7 — Do NOT create ad conversions for these

The code also emits `review_submit` and `claim_submit`. **Do not** map them to
Meta/GA *conversions*:
- `claim_submit` — optimising ads toward people who file claims is harmful.
- `review_submit` — reviewers are existing customers, useless for prospecting.

They're fine to keep as plain GA4 events for your own funnel visibility, or just
leave them to Umami. Track them only if you want internal volume numbers.

## Step 8 — Verify before merging

1. Zaraz → Settings → set a **Debug key**.
2. Open the site (proxied hostname) with the debug key; open the Zaraz debug
   console. Confirm: Pageview fires; submitting a test Anfrage fires
   `lead_form_submit` with a numeric `value` and `currency: EUR`; GA4 realtime and
   Meta Test Events both receive it.
3. Toggle consent in Cookiebot and confirm tools stop/start accordingly (the
   bridge is working).
4. Only then merge this branch → `master`.

---

## What the code already does (no action needed)

- `src/scripts/analytics.js` — `trackEvent(name, props)` calls `zaraz.track()`
  when Zaraz is present, falls back to `dataLayer.push({event, ...})` pre-Zaraz,
  and mirrors to Umami. Wrapped so tracking can never break the UI.
- **Lead** — `anfrage.js` fires `lead_form_submit` **on real submit success**
  (not on hover, as before) with `{ value, currency: "EUR", email, insurance }`.
  `value` is the commission estimate (insured sum × premium rate × 12% provision).
- **Review** — `neue-bewertung.js` fires `review_submit` on success.
- **Claim** — `multi-step-form.js` fires `claim_submit` on success.
- **BaseHead** — client GTM + Consent Mode gtag removed; Umami + Cookiebot kept;
  Cookiebot→Zaraz consent bridge added.

## Datenschutz — verify with your DPO before `master`

`src/partials/datenschutz.html` was updated. Have legal confirm:
- **§6 Formularverarbeitung** — now describes the Cloudflare Workers processor
  (was the stale Make.com text). Confirm whether the Worker uses any **email
  sub-processor** (e.g. a mail-delivery service) that must also be named.
- **§8 Cloudflare / §9 GA4 / §10 Meta / §11 Umami** — added. Verify the legal
  entities and addresses (Cloudflare Germany GmbH / Cloudflare, Inc.; Google
  Ireland; Meta Platforms Ireland; and that Umami's self-hosted, cookieless
  description matches your instance).
- A US-transfer / third-country note for Google + Meta (Art. 49 / DPF) may be
  advisable — confirm wording.

## Optional later

- Move **Umami** itself into Zaraz too (one less client request), or leave it —
  it's cookieless and independent, so keeping it client-side is fine.
- Add micro-conversions (phone/email/WhatsApp clicks) via `trackEvent` on those
  elements if you later want them.
