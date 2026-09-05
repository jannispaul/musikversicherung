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
| Listed as founder in schema | Heiner Blaskewitz | `structured-data.ts:64`, via the shared `Person` node at `structured-data.ts:27` |
| Credited as author of every `/wissen` article | Heiner Blaskewitz | the author box in `src/partials/wissen/*.html`; same `Person` node in schema |
| Agency | Mannheimer Generalagentur im Continentale Versicherungsverbund, Nico Falk | `impressum.html` |
| Address | Wennigser Str. 63, 30890 Barsinghausen, DE | `impressum.html`, `structured-data.ts:50-56` |
| Phone (site-wide) | +49 172 511 3611 | `src/data/site.ts:7-8` |
| Email (site-wide) | info@musikversicherung.com | `structured-data.ts:24`, `site.ts:34` |
| Vermittlerregister no. (Blaskewitz) | D-34VM-MMPLD-10 | `impressum.html` |
| Vermittlerregister no. (Agentur Falk) | D-400E-GC1HR-86 | `impressum.html` |
| Blaskewitz register no. in schema | Emitted as the Person node's `identifier` (`PropertyValue`, `url` → vermittlerregister.info) — the person's number only, never the org's (added 2026-08-31) | `structured-data.ts` Person node |
| Insurer brand in schema | `Product.brand` = "Mannheimer Versicherung AG", `url` → `mannheimer.de` (official site; **not** a Wikidata `sameAs` — see below) | `structured-data.ts` `productLd()` |
| Licence | Versicherungsvertreter, § 34d Abs. 1 GewO | `impressum.html` |
| Area served | Worldwide (`GeoShape`) | `structured-data.ts:57` |
| Languages | de, en | `structured-data.ts:63` |
| `sameAs` | facebook.com/instrumentenversicherung/ | `structured-data.ts:65` |

### External corroboration (verified 2026-08-31)

Checked while evaluating an off-domain entity anchor. Treated as data, not as
new site facts:

- **falk.mannheimer.de** (the Nico Falk Generalagentur site, retrieved
  2026-08-31) features Heiner Blaskewitz, the SINFONIMA / I'M SOUND products and
  the **Barsinghausen** address (Wennigser Straße 63, 30890) — corroborating the
  person, products and address. It does **not** hyperlink to
  musikversicherung.com, and it lists a *different* e-mail
  (`heiner.blaskewitz@mannheimer.de` vs. the imprint's `heiner@blaskewitz.com`)
  and "25+" rather than "30+" years. Do not merge those into the canonical set;
  the imprint remains authoritative.
- **imsound.de/ansprechpartner** is a dynamic agency-finder; no static
  Blaskewitz listing renders (matches the 2026-08-05 note below — not citable).
- **Wikidata** was verified and **rejected** as an entity anchor — see the
  `sameAs` OPEN below.

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
| Reviews | 1089, average 4,97 / 5 (computed at build) | `public/reviews.json` via `src/data/reviews.ts` |
| Cover territory | Worldwide, **including international tours and session/studio work** | owner, 2026-08-27 |
| In-vehicle cover | Instruments are covered in a vehicle **if kept in a locked case or boot/load compartment that is not viewable from outside** — approved wording: *"in einem verschlossenen und von außen nicht einsehbaren Koffer- oder Laderaum"* | on-page benefit copy (`src/partials/lp/*.html`, `src/partials/index.html`); reconfirmed owner, 2026-08-27 |

The review figures were frozen at 1082 between 2026-05-27 and 2026-08-19,
because new submissions stopped reaching `public/reviews.json`. Seven lost
reviews were recovered from the notification mails on 2026-08-19, taking the
count to 1089 and the average from 4,96 to 4,97; the pipeline and both failure
modes are documented in [reviews-pipeline.md](reviews-pipeline.md). The count
is live again, so it moves — read it from the file, never from memory or from
an older wiki revision.

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

### Online conclusion — residence eligibility

**The binding online conclusion on `/anfrage` is offered for a residence in
Germany only.** Austria, Switzerland and every other residence go into the
non-binding request flow and receive an offer by e-mail. *(owner ruling,
2026-08-24.)*

The owner was asked whether Austria should be online-eligible and ruled it out
in the same exchange, so the AT question is settled, not open. Two things that
fed the decision, both verified in the repo on 2026-08-24:

- The IBAN field in the online flow accepts **German IBANs only**
  (`pattern="^DE\d{2}[ ]…|DE\d{20}$"`, `src/partials/anfrage.html`), so an
  Austrian applicant could not have completed it anyway.
- The disclaimer already shown for a non-German residence says the binding
  premium arrives in the e-mail offer (`src/partials/anfrage.html`) — which is
  now exactly what happens for all of AT / CH / other.

This narrows, and does not contradict, the note in
[recon-report.md](recon-report.md) that a competitor advertises DE+AT residence
and that our own eligibility had to come from the product, not from assumption.
The mechanics of the gate live in `docs/anfrage-flows.md`.

> **OPEN:** what the *policy documents* say about residence eligibility is still
> unverified. The rule above is the owner's instruction for the form, not a
> quoted tariff condition. Do not restate it as a cover condition in site copy
> beyond the form's own note until a policy source is on record.

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
> page displays a real publish date, ranging 02.06.2024–30.07.2024. The dates
> are established facts; they were simply missing from `articleLd()`. Piping
> them into `datePublished` asserts nothing new. *(Position updated 2026-09-04:
> the date moved from a `.content_date` div above the H1 to a footer
> `.content_meta` line showing both "Veröffentlicht am …" and "zuletzt
> aktualisiert am …".)* See [aeo-rules.md](aeo-rules.md) §4 and §6.

> **RESOLVED 2026-08-20 — Named author for `/wissen` articles.** All eleven
> articles credit `Person` Heiner Blaskewitz, through the shared
> `#heiner-blaskewitz` node that is also the org's `founder`. This was filed as
> an owner's call on the premise that only the organisation was credited — but
> the client-injected schema had been asserting the person on every article all
> along, so the decision was already live and merely contradicted the
> server-side node. Consolidating forced a pick; the person wins because every
> article visibly says so in its "Über den Author" box. Reasoning and how to
> reverse it: [aeo-rules.md](aeo-rules.md) §4.

> **OPEN:** AI training-crawler policy (GPTBot, Google-Extended, CCBot).
> `public/robots.txt` currently allows everything. Search-index and
> live-retrieval crawlers must stay allowed; training crawlers are a business/IP
> judgement. See [aeo-rules.md](aeo-rules.md) §8.

> **OPEN:** Complete `sameAs` profile list (Instagram, YouTube, review
> platforms, Blaskewitz Xing/LinkedIn). Only Facebook is currently claimed.
>
> **2026-08-31 — GBP ruled out; Wikidata verified and declined.** Owner: there
> is **no Google Business Profile** — pure online business, no local presence —
> so GBP is off the table as an anchor (this also retires the GBP line from
> [aeo-rules.md](aeo-rules.md) §7's priority list for this site). **Wikidata was
> evaluated as the off-domain entity anchor and not pursued**, for two reasons:
> (1) owner does not want to maintain a public-editable item; (2) on verification
> the candidate insurer items are the wrong entities — `Q1890715` ("Mannheimer
> Versicherungen") is a *former* group ("ehemalige Versicherungsgruppe", aliased
> "Mannheimer AG Holding", part of Allianz SE 2002–03), and `Q1128861`
> ("Continentale") is a *health* insurer, not the instrument product's risk
> carrier. Neither is a valid `sameAs`. **Done instead (2026-08-31):** the
> person's Vermittlerregister number now ships as schema `identifier`, and
> `Product.brand` points to the insurer's official site `mannheimer.de` (see the
> Identity rows above and [log.md](log.md)). **Still to pursue** under the
> pure-online constraint: an independent review profile (e.g. ProvenExpert →
> a real third-party `sameAs`) and a backlink from falk.mannheimer.de.

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
>
> **2026-08-31 corroboration:** the Gelbe Seiten listing
> (`gelbeseiten.de/gsbiz/1b5edb7a-…`, retrieved 2026-08-31) is a **separate
> entity** — "Mannheimer Versicherung AG: Heiner Blaskewitz", **Bahnhofstraße
> 35, 29614 Soltau**, site `vb-blaskewitz.mannheimer.de`. Same person, different
> address and different agency location from the Barsinghausen imprint. It is a
> valid reference for the *person*, but must **not** be attached as a `sameAs`
> to the Barsinghausen `#organization` — doing so would assert the Soltau and
> Barsinghausen entities are one (§4).

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
>
> **Partially closed 2026-08-27 (owner):** three specific points are now
> owner-approved for copy and are recorded in the Product table above — worldwide
> cover *including international tours and session/studio work*, and the
> in-vehicle condition. The **full** exclusions/limits set remains OPEN; a
> policy-document source is still needed before stating anything beyond these.
> The in-vehicle wording must keep its exact qualifier ("verschlossen **und** von
> außen nicht einsehbar") — the owner's casual "not visible from outside" is a
> simplification, not a licence to loosen it.

---

*Back to [index.md](index.md).*
