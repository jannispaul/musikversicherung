# Business facts — verified register

**The single source of truth for every factual claim on this site.**

[CLAUDE.md](../CLAUDE.md) §4 forbids inventing facts about the business or the
town. This page is what makes that rule usable: if a fact is not here with a
source, it is not established, and it does not go on the site.

**Rules for this page:**

- Nothing enters without a source. Repo path + line, `raw/` filename, external
  URL + retrieval date, or `owner, <date>`.
- Facts change **here first**, then propagate to code (see
  [aeo-rules.md](aeo-rules.md) §3 for the propagation map).
- Unverified items go under **Open questions**, never in the tables above it.

---

## Identity

Everything in this section is verified from the site's own imprint
(`src/partials/impressum.html`) and the site-wide JSON-LD
(`src/data/structured-data.ts`), both read 2026-08-04.

| Fact | Value | Source |
| --- | --- | --- |
| Domain | `https://musikversicherung.com` | `src/data/site.ts:3` |
| Site name | Musikversicherung.com | `src/data/site.ts:4` |
| Schema type | `InsuranceAgency` (a `LocalBusiness` subtype) | `structured-data.ts:41` |
| Responsible person (§5 TMG, §55 RStV) | Heiner Blaskewitz | `impressum.html` |
| Listed as founder in schema | Heiner Blaskewitz | `structured-data.ts:49` |
| Agency | Mannheimer Generalagentur im Continentale Versicherungsverbund, Nico Falk | `impressum.html` |
| Address | Wennigser Str. 63, 30890 Barsinghausen, DE | `impressum.html`, `structured-data.ts:50-56` |
| Phone (site-wide) | +49 172 511 3611 | `src/data/site.ts:7-8` |
| Email (site-wide) | info@musikversicherung.com | `structured-data.ts:24`, `site.ts:34` |
| Vermittlerregister no. (Blaskewitz) | D-34VM-MMPLD-10 | `impressum.html` |
| Vermittlerregister no. (Agentur Falk) | D-400E-GC1HR-86 | `impressum.html` |
| Licence | Versicherungsvertreter, § 34d Abs. 1 GewO | `impressum.html` |
| Area served | Worldwide (`GeoShape`) | `structured-data.ts:57` |
| Languages | de, en | `structured-data.ts:63` |
| `sameAs` | facebook.com/instrumentenversicherung/ | `structured-data.ts:65` |

**Contact details in the imprint** (distinct from the site-wide contact above —
do not merge them):

| Who | Detail | Source |
| --- | --- | --- |
| Heiner Blaskewitz | Mobil 0172 5113 611, heiner@blaskewitz.com | `impressum.html` |
| Nico Falk / Agentur | Tel. 05105 80 99 383, Fax 05105 80 99 384, Mobil 0171 422 89 89, nico.falk@mannheimer.de, www.falk.mannheimer.de | `impressum.html` |

## Insurers behind the product

Named in the imprint; the intermediary acts for the Continentale
Versicherungsverbund and its affiliated companies.

| Company | Role | Source |
| --- | --- | --- |
| Mannheimer Versicherung AG | Risk carrier / brand for the insurance product | `structured-data.ts:113`, `impressum.html` |
| Continentale Krankenversicherung a. G. | Principal the agency is licensed for | `impressum.html` |

The imprint additionally lists Continentale Lebensversicherung AG, Continentale
Sachversicherung AG, EUROPA Lebensversicherung AG and Neue
Rechtsschutz-Versicherungsgesellschaft AG as affiliated undertakings. They are
**not** relevant to the instrument-insurance product — do not pull them into
marketing copy.

## Product

| Fact | Value | Source |
| --- | --- | --- |
| Product (schema) | SINFONIMA / I'M SOUND Instrumentenversicherung | `structured-data.ts:110` |
| Category | Musikinstrumentenversicherung | `structured-data.ts:114` |
| Tariff 1 | **SINFONIMA Instrumentenversicherung** — classical instruments, from **4,69 € / Monat** | `structured-data.ts` `tariffOffers()`; homepage copy |
| Tariff 2 | **I'M SOUND Equipmentversicherung** — electronic instruments and music equipment, from **6,25 € / Monat** | `structured-data.ts` `tariffOffers()`; homepage copy |
| Quote path | `/anfrage` | `structured-data.ts` `tariffOffers()` |
| Reviews | 1083, average 4,96 / 5 (computed at build) | `public/reviews.json` via `src/data/reviews.ts` |

The review figures were frozen at 1082 between 2026-05-27 and 2026-08-19,
because new submissions stopped reaching `public/reviews.json` after the Astro
migration. Fixed 2026-08-19; the pipeline and the fault are documented in
[reviews-pipeline.md](reviews-pipeline.md). The count is live again, so it
moves — read it from the file, never from memory or from an older wiki
revision.

Prices are **"ab" (from) monthly figures.** They are meaningless without that
qualifier and must never be quoted as flat prices — in prose or in schema. The
JSON-LD encodes them as `minPrice`; see [aeo-rules.md](aeo-rules.md) §4,
"Offers: product snippet, not merchant listing".

The homepage additionally states a tier-specific figure: *"Bei SINFONIMA liegt
der Beitrag für Instrumente bis 3.000 € bei 4,69 € im Monat, bei I'M SOUND
zahlen Musiker 6,25 € monatlich für Instrumente bis 4.000 €"*
(`src/partials/index.html`, read 2026-08-07). That is the only published
pairing of a premium with a sum insured. No upper premium is published for
either tariff.

## The town — Barsinghausen

The business address is in **Barsinghausen, Lower Saxony (postcode 30890)**.

**That is the entire verified set.** Nothing else about the town is established:
not population, not history, not its music scene, venues, orchestras, schools,
events, or distance to Hannover.

Per [CLAUDE.md](../CLAUDE.md) §4, do not generate any of it. If local content is
wanted, the facts get sourced first (official municipal or statistical sources,
cited with retrieval date) and recorded here — then written.

---

## Known inconsistencies — flagged, not resolved

Per [CLAUDE.md](../CLAUDE.md) §4, these are surfaced for the owner rather than
guessed at. Do not "fix" them unilaterally; each changes a public claim.

1. **`IM SOUND` vs. `I'M SOUND`.** The homepage title uses `IM SOUND`
   (`src/pages/index.astro`); the schema uses `I'M SOUND`
   (`structured-data.ts:110,141`). Two spellings of a brand read as two entities
   to an answer engine ([aeo-rules.md](aeo-rules.md) §3). Which is correct?

2. **Phone formatting.** `+49 172 511 3611` site-wide (`site.ts:7`) vs.
   `0172 5113 611` in the imprint. Same number, two formats. Schema and NAP
   consistency favour one canonical form.

3. **Homepage title claim.** `Instrumentenversicherung ohne Selbstbeteiligung`
   asserts no deductible. It is also 70 characters, over the 60-char rule
   ([on-page-rules.md](on-page-rules.md) §3). Shortening it touches a product
   claim — owner decision.

4. **Two contact identities.** Site-wide contact (`info@`, +49 172 511 3611)
   vs. the imprint's personal and agency contacts. Intentional, but any
   Google Business Profile or directory listing must pick one canonical NAP.

5. **RESOLVED 2026-08-07 — schema stated the "ab" prices as flat prices.**
   The JSON-LD emitted `price: "4.69"` / `"6.25"` as definite `Offer` prices,
   contradicting the "ab" qualifier this page requires. Re-encoded as
   `minPrice` inside a `UnitPriceSpecification`. No published figure changed;
   the schema now claims strictly less than it did. See
   [log.md](log.md), 2026-08-07.

## Open questions

> **OPEN:** Founding date / years in business — unknown. `founder` is set in
> schema but no date is. Needed before any "seit …" claim.

> **RESOLVED 2026-08-04 — publish dates.** Not open after all: every `/wissen`
> page already displays a real publish date in a `.content_date` div above the
> H1, ranging 02.06.2024–30.07.2024. The dates are established facts; they are
> simply missing from `articleLd()`. Piping them into `datePublished` asserts
> nothing new. See [aeo-rules.md](aeo-rules.md) §4 and §6.

> **OPEN:** Named author for `/wissen` articles. `articleLd()` credits the
> organisation. Attributing articles to a named person (Heiner Blaskewitz is the
> registered intermediary and § 5 TMG responsible person) is a real authority
> signal, but it puts a real person's name on specific content — owner's call.
> See [aeo-rules.md](aeo-rules.md) §4.

> **OPEN:** AI training-crawler policy (GPTBot, Google-Extended, CCBot).
> `public/robots.txt` currently allows everything. Search-index and
> live-retrieval crawlers must stay allowed; training crawlers are a business/IP
> judgement. See [aeo-rules.md](aeo-rules.md) §8.

> **OPEN:** Complete `sameAs` profile list (Google Business Profile, Instagram,
> YouTube, review platforms). Only Facebook is currently claimed.

> **RESOLVED 2026-08-05 — Soltau association.** Owner: the business is
> "theoretically in Soltau"; the ranking association comes from a Google
> Business Profile and/or the parent insurer's agent listing
> (imsound.de/ansprechpartner — fetched 2026-08-05, agency data loads
> dynamically, not citable). Owner ruling: **Soltau and generic local queries
> ("versicherung soltau", "kfz versicherung …") are irrelevant — this is a
> purely online business targeting all of DACH.** (owner, 2026-08-05.)
> Residual tension, flagged not resolved: the imprint address is
> Barsinghausen; the entity association is Soltau. Whichever profile exists,
> the Phase 3 GBP/NAP work in [recon-report.md](recon-report.md) must pick
> one canonical story before adding listings. Related context: the owner's
> client also runs a separate online site for oldtimer insurance (owner,
> 2026-08-05) — same no-local, no-kfz rule applies there.

**Published experience claims (verified on-site 2026-08-05):** every
`/wissen` article carries an author box (`src/partials/wissen/*.html`)
stating: Heiner Blaskewitz, "Versicherungsfachmann (BWV)", "beschäftigt sich
seit mehr als 30 Jahren professionell mit der Absicherung von Schäden an
Musikinstrumenten und elektronischem Musikequipment", and the portal
musikversicherung.com exists "seit 2013". These are live public claims and
may be reused verbatim on other pages — they narrow (but do not close) the
founding-date OPEN above: "Portal seit 2013" and "30+ Jahre Erfahrung" are
usable; a company founding year is still not.

> **OPEN:** Deductible, sum-insured limits, territorial scope and exclusions for
> each tariff. Governed by `/versicherungsbedingungen` and the policy documents,
> not summarised here yet — and not to be paraphrased into marketing copy
> without approval ([CLAUDE.md](../CLAUDE.md) §4).

---

*Back to [index.md](index.md).*
