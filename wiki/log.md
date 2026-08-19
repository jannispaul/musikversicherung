# Wiki log

Every change to `wiki/` gets an entry. Newest first. No wiki edit ships without
a line here — see [CLAUDE.md](../CLAUDE.md) §2.

**Entry format:**

```
## YYYY-MM-DD — short title
**Changed:** which pages, what changed.
**Why:** the reason or the task that prompted it.
**Source:** where the new information came from.
```

---

## 2026-08-19 — Review pipeline is broken; filed as its own page

**Changed:**

- `reviews-pipeline.md` **new** — the full chain from the `/neue-bewertung`
  form through the `automations` Worker, the GitHub commit and the Pages
  rebuild to the baked-in cards and JSON-LD; where it breaks; what to do about
  it; the status of the dormant Make scenario.
- `index.md` — new row for the page.
- `business-facts.md` — the review count/average row now carries a warning that
  the figures are frozen as of 2026-05-27, pointing at the new page.

**Why:** owner noticed recent reviews are not showing on the site and asked for
the data flow and the fault (owner, 2026-08-19). Root cause: the `automations`
Worker still writes `dist/reviews.json`, the pre-migration path. The Worker-side
fix was committed 2026-07-30 but never deployed; the live Worker dates from
2026-06-05. The notification mail still goes out first, so a mail arriving is
not evidence the review landed.

**Source:** `src/partials/neue-bewertung.html:1` and `src/scripts/neue-bewertung.js`
(form target); deployed Worker bundle `handleMvReview` and Cloudflare API
`modified_on` 2026-06-05, both read 2026-08-19; `automations` repo commit
`05537ba`; this repo's `b78da23` (2026-08-19 14:58, writes `dist/reviews.json`)
and `5289eb7`; Make API scenario 1174328, read 2026-08-19.

**No site changes** — investigation only; nothing in `src/` touched.

## 2026-08-19 — Review pipeline repaired; count live again at 1083

**Changed:**

- `reviews-pipeline.md` — status header (fixed), the outage section retitled as
  resolved, a "What was done" section, the Make scenario section rewritten as
  deactivated (its `> **OPEN:**` resolved), and a "Verifying it, next time"
  note.
- `business-facts.md` — review row 1082 → **1083**, with the freeze recorded as
  history and an instruction to read the count from the file, since it moves
  again.
- `aeo-rules.md`, `competitors.md`, `recon-report.md` — hardcoded "1082" in
  live claims replaced: the exact figure now lives only in `business-facts.md`,
  the rest say "1000+". Prevents the same drift recurring with every review.
- `index.md` — the `reviews-pipeline.md` row now describes a fixed pipeline.

**Why:** owner asked for the fix to be carried out, not just documented (owner,
2026-08-19).

**Done:** deployed the `automations` Worker (127 tests + typecheck green
first), so it targets `public/reviews.json`; replayed the dropped review;
normalised `public/reviews.json` to the Worker's output format so its future
commits are one-entry diffs; untracked `dist/reviews.json`; deactivated Make
scenario 1174328. Site commit `d4a9dd5`.

**Verified:** `/reviews` and the homepage both serve 1083 and 4,96 live, the
restored review renders on both, and the Product JSON-LD carries
`reviewCount: 1083` (fetched 2026-08-19).

## 2026-08-07 — Sitemap gains per-page lastmod from git

**Changed:**

- `aeo-rules.md` §6 — new rule tying sitemap `lastmod` to the existing
  no-fake-freshness discipline, including why the naive implementation is worse
  than none.
- `aeo-rules.md` §8 — recorded why the sitemap is `sitemap-index.xml` +
  `sitemap-0.xml` and why it must not be renamed; one `> **OPEN:**` on a
  possible `/sitemap.xml` redirect.

**Why:** owner asked why the sitemap is at `sitemap-0.xml` and whether a flat
`sitemap.xml` would be better. Answer: the filename is `@astrojs/sitemap`
behaviour (always an index + numbered chunks, split at 45,000 URLs), it is
standard, and renaming costs more than it gains. The audit did surface a real
gap next to it — the sitemap carried **no `lastmod` at all**, on any of the 23
URLs. Owner then directed: implement it from git last-commit time per file
(owner, 2026-08-07).

**Site changes (`npm run build` passing, 26 pages):**

- `scripts/git-lastmod.mjs` **new** — per-route lookup returning the newest
  commit date across that page's own `src/pages/<route>.astro` and
  `src/partials/<route>.html`. Shared layouts, components and page CSS are
  excluded by design: a `Layout.astro` edit is not a content change to 23
  pages, and counting it would recreate the auto-bump on a slower clock.
  Emits **nothing** when the date cannot be trusted (uncommitted page, no git,
  shallow clone).
- `scripts/unshallow-git.mjs` **new**, wired as `prebuild` — Cloudflare Pages
  clones shallow, which makes every path resolve to one commit. Fixed in-repo
  rather than via the Pages dashboard build command, so it cannot be forgotten.
  Best-effort; a fetch failure warns and the build continues without `lastmod`.
- `astro.config.mjs` — `serialize` hook on the sitemap integration.
- `README.md` — Build hooks table and a new "Sitemap" section.

**Verified:** 22 of 23 URLs carry distinct, real dates; `/lp/imsound` correctly
has none (still uncommitted). All 22 parse as ISO 8601, none future-dated; both
sitemap files well-formed per `xmllint`. The shallow-clone path was tested
end-to-end against a real `--depth=1` clone: dates suppressed with a warning
while shallow, then real distinct dates after `npm run prebuild` unshallowed it.

**Source:** owner instruction (2026-08-07); Cloudflare Pages shallow-clone
behaviour and the `git fetch --unshallow` workaround — Quartz and Zudoku deploy
docs plus Cloudflare community threads, retrieved 2026-08-07;
`@astrojs/sitemap` 3.7.3 option types (`node_modules/@astrojs/sitemap/dist/index.d.ts`).

---

## 2026-08-07 — Product offers reshaped: merchant listing → product snippet

**Changed:**

- `aeo-rules.md` §4 — new "Offers: product snippet, not merchant listing"
  subsection under Standing rules; `#product` scope in the `@id` table narrowed
  to note offers are homepage-only.
- `business-facts.md` — Product table price rows re-sourced to the new
  `tariffOffers()` builder; new "Known inconsistencies" item 5 recording that
  the schema previously stated the "ab" prices as flat prices.

**Why:** Google Search Console emailed the owner (received 2026-08-07) two
non-critical **"Händlereinträge für strukturierte Daten"** (Merchant listings)
issues: `Feld "shippingDetails" fehlt (in "offers")` and
`Feld "hasMerchantReturnPolicy" fehlt (in "offers")`.

**Ruling — the two requested fields were NOT added.** There is no shipping for
an insurance policy, and a merchant "return policy" for an insurance contract
is the statutory Widerrufsrecht (§ 8 VVG) — a legal statement that is neither
visible on the page nor ours to author. Adding either would be fabricated
schema under [CLAUDE.md](../CLAUDE.md) §4 and `aeo-rules.md` §4.

Instead the misclassification was removed at its cause. `/` and `/reviews` are
genuinely *product snippet* pages, not merchant listings — `/anfrage` is a
quote request, not a checkout — but the markup carried the merchant signature
(two `Offer` nodes with a definite `price` and `availability: InStock`).

**Site changes (`npm run build` passing, 26 pages):**

- `src/data/structured-data.ts` — new `tariffOffers()`; the two tariffs now sit
  inside one `AggregateOffer` (`lowPrice: "4.69"`, `offerCount: 2`, no
  `highPrice` — no upper premium is published). Each tariff `Offer` carries
  `priceSpecification.minPrice` instead of a flat `price`, which is what
  "ab 4,69 € im Monat" actually means. `availability` dropped — an insurance
  policy is not inventory. `productLd()` gained an `includeOffers` flag,
  default `false`.
- `src/pages/index.astro` — `productLd({ includeOffers: true })`. The homepage
  displays "ab 4,69€ / Monat".
- `src/pages/reviews.astro` — offers omitted. `/reviews` shows no price at all,
  so emitting them breached `aeo-rules.md` §4 ("never assert in schema what is
  not visible on the page"). Pre-existing violation, fixed here.

**Verified:** built JSON-LD inspected on both pages; schema.org validator
returns **0 errors, 0 warnings** for the homepage Product node (run
2026-08-07). **Not verified:** Google Rich Results Test — the code-paste mode
now requires a signed-in Google account. The owner should re-run it, and watch
the GSC Merchant listings report empty out over the next crawl cycle.

**Source:** GSC notification email (owner-forwarded, 2026-08-07);
Google merchant listing / product snippet docs
(https://developers.google.com/search/docs/appearance/structured-data/merchant-listing
and .../product-snippet, both retrieved 2026-08-07);
live homepage copy `src/partials/index.html`.

---

## 2026-08-05 — /lp/imsound built: dedicated I'M SOUND equipment LP

**Changed:**

- `keywords.md` — equipment cluster row updated: owning URL now `/lp/imsound`.
- `recon-report.md` — "Phase 2 progress" section added (what was built, the
  wording-reuse guarantee, the URL decision, remaining queue).

**Site changes (`npm run build` passing, 26 pages, verified in browser):**

- `src/pages/lp/imsound.astro` **new** — title "Musik-Equipment versichern ab
  6,25 €/Monat | I'M SOUND" (54 chars), description 160 chars,
  `robots: index,follow`, canonical `/lp/imsound`.
- `src/partials/lp/imsound.html` **new** — structural clone of the SINFONIMA
  LP with I'M SOUND content. All product claims reuse approved on-site
  wording: risk paragraph + Überspannungsschäden sentence (homepage),
  "gilt nur für wenige Spezialfälle ein Selbstbehalt" (homepage),
  20.000-€-Online-Abschluss note (homepage), weltweit/Auto/Proberaum with
  conditions verbatim, grobe Fahrlässigkeit 20.000 € (homepage asserts for
  both products), Laptops/Tablets/Fotoapparate (homepage). Deduct heading
  deliberately NOT "ohne Selbstbeteiligung" — I'M SOUND has Spezialfall
  deductibles, heading is "Selbstbeteiligung? Nur in wenigen Spezialfällen".
  Shared FAQ block kept (covers both products). Images swapped to existing
  equipment assets (header.avif Keyboard; imsound.avif Mischpult).
- `src/partials/lp/imsound.css` **new** — copy of sinfonima.css (site
  convention: per-LP css file).
- CTAs `/anfrage?versicherung=IM%20SOUND` — **money path verified:** form
  loads with radio "IM SOUND" preselected (calculator.js `selectInsurance`).
- Internal links added (descriptive anchors): Klavier E-Piano section,
  die-passende-police (existing I'M SOUND mention now links),
  tipps-zur-auswahl (Überspannungsschäden sentence). Page in sitemap.

**Why:** owner directed "add more lp pages, for example for specific
instruments or IM SOUND" (2026-08-05); equipment cluster was the
top-priority gap per GSC (12.2k impressions, position ~14, no owning page).

**Source:** approved wording traced to `src/partials/index.html`,
`src/partials/faqs.html`, `src/partials/lp/sinfonima.html`;
`docs/anfrage-flows.md` + `src/scripts/calculator.js:61-80` for the
versicherung param. Browser verification 2026-08-05: served HTML contains
all key passages (curl greps), H1 count 1, headings correct, sitemap entry
present, form preselect works, no console errors.

---

## 2026-08-05 — Owner rulings filed; Klavier page rebuilt as the model spoke

**Changed:**

- `business-facts.md` — Soltau OPEN **resolved** (owner: GBP / parent-insurer
  association; business "theoretically in Soltau"; local queries irrelevant;
  purely online, DACH-wide targeting; client also runs an oldtimer-insurance
  site). Residual Barsinghausen-vs-Soltau tension flagged for the Phase 3
  NAP decision. **New verified section:** published experience claims from
  the sitewide author box — Blaskewitz, Versicherungsfachmann (BWV), 30+
  Jahre, portal "seit 2013" — reusable verbatim; narrows the founding-date
  OPEN.
- `recon-report.md` — www item updated (owner bound the host; now 200, 301
  still recommended); owner rulings recorded (Vergleich / DACH / English all
  "possible, lowest priority"; local out of scope); new "Phase 1 progress"
  section describing the Klavier rebuild as the rollout model.

**Site changes (this session, `npm run build` passing, verified in browser):**

- `src/pages/wissen/instrumentenversicherung-fur-klaviere.astro` — title
  "Klavier versichern: Versicherung für Klavier & E-Piano" (54 chars),
  description 156 chars, og/twitter aligned, `datePublished: "2024-06-10"`
  passed to `articleLd()` (matches the visible `.content_date`).
- `src/partials/wissen/instrumentenversicherung-fur-klaviere.html` — H1 now
  carries the buyer term; liftable first paragraph (facts from the page
  itself + the Kosten article); H2s rewritten as buyer questions; E-Piano
  answer sentence moved first (sentences otherwise verbatim); new
  "Was kostet es…" section with a 2-row price table whose values are copied
  verbatim from `was-kostet-eine-instrumentenversicherung.html`; sideways
  link to the Zeitwert/Neuwert spoke; typo fixes (DIr, Lese-link removed in
  favour of the Kosten section link). **No coverage statement reworded** —
  the stationäre-Deckung, Transport and E-Piano sentences are unchanged or
  reordered whole.
- `src/data/structured-data.ts` — `articleLd()` accepts optional
  `datePublished` (must match the visible date; documented inline).
- `src/styles/global.css` — scoped `.text-rich-text table` styling (design
  tokens; site previously had zero tables, so no visual regression surface).
- All 11 `src/partials/wissen/*.html` — "Über den Author" → "Über den Autor".

**Why:** owner answered the Soltau/GSC questions, confirmed www fix, and
directed content-quality improvement of landing pages "like klavier" without
changing the meaning of coverage statements.

**Source:** owner, 2026-08-05 (chat); imsound.de/ansprechpartner fetch
2026-08-05 (dynamic, not citable); `curl -sI https://www.musikversicherung.com/`
→ 200 (2026-08-05); browser verification of the rebuilt page (title, H1
count 1, six H2s, 3-row styled table, Article JSON-LD with datePublished,
no console errors).

---

## 2026-08-05 — GSC data analysed; keywords.md rebuilt on real data

**Changed:**

- `keywords.md` **rewritten** — assumption table replaced with the verified
  cluster table from the owner's 16-month GSC export (Apr 2025 – Aug 2026):
  baseline (~652 clicks / ~115k impressions; position drifting up from ~30 to
  ~20; CTR the acute problem), 13 query clusters with impressions/position
  and owning URL, the "CTR disease" list (top-10 rankings with zero clicks),
  DACH and English demand figures, and two anomalies (www 404, Soltau).
  GSC-access instructions kept; property-survival OPEN resolved (data flows
  through 2026-08-02).
- `recon-report.md` — new Phase 0 item 0: **www 404 fix** (www host unbound
  since the Cloudflare move; exact Cloudflare steps + curl verification).
  New section "Priority update from GSC data (2026-08-05)": snippet/CTR work
  promoted to highest ROI; dedicated I'M SOUND/equipment page promoted to
  top of Phase 2; instrument spokes confirmed by demand; Vergleich, DACH and
  English questions marked **[owner]**.
- `business-facts.md` — new OPEN: Soltau entity association (top-5 local
  rankings for Soltau insurance queries with zero on-site mention; suspected
  GBP; must be resolved before Phase 3 GBP work).

**Why:** owner delivered the GSC export requested in the 2026-08-04 recon.

**Source:** `raw/gsc/musikversicherung.com-Performance-on-Search-2026-08-04/`
(owner, 2026-08-04) — Suchanfragen.csv (589 rows), Seiten.csv, Länder.csv,
Geräte.csv, Diagramm.csv. Verification: `curl -sI https://www.musikversicherung.com/`
→ HTTP 404 (2026-08-04); `grep -ri soltau src/ public/reviews.json` → 0 hits
(2026-08-05). Clustering script run 2026-08-05 (regex note: first pass
wrongly matched "mannheimer" into the local cluster via `n.he`; corrected by
inspection — mannheimer queries belong to the SINFONIMA cluster).

**Key findings:**

- **www.musikversicherung.com returns 404** while www URLs are still indexed
  and earning impressions — regression from the Strato → Cloudflare Pages
  move. P0. → `recon-report.md`.
- **Zero-click top-10 rankings** everywhere: "klavier versichern" pos 4.7,
  "wie versichere ich mein musikequipment?" pos 6.5, SINFONIMA cluster
  pos ~13 with 11 clicks on 12.5k impressions. Snippets, not rankings, are
  the binding constraint today. → `keywords.md`.
- **Equipment / I'M SOUND cluster (12.2k imp, pos ~14) has no owning page.**
  → `keywords.md`, `recon-report.md`.
- Real DACH demand: AT 3.4k + CH 3.3k impressions. English demand incl. a
  PDF drawing 6.7k impressions. Both parked pending owner decisions.
- Soltau anomaly → `business-facts.md` OPEN.

---

## 2026-08-04 — Competitor recon filed; keywords and recon report created

**Changed:**

- `competitors.md` **created** — structural intelligence on every organic
  winner for the core queries; the one-operator/many-domains finding; common
  winner patterns; our advantage and gap lists.
- `keywords.md` **created** — assumed query→URL map (marked OPEN pending GSC)
  plus the two free routes to Search Console data (16-month CSV export into
  `raw/gsc/`, or service-account API access) and an OPEN check on whether the
  GSC property survived the Cloudflare Pages move.
- `recon-report.md` **created** — comparison table (7 rows incl. our own
  site), COMMON PATTERNS list, and the phased ranking plan with **[owner]**
  markers on every step that changes a public claim. Explicitly rejected:
  multi-domain satellites, regional pages, superlative claims.
- `index.md` — three new pages added to the map; gap list updated.
- `raw/recon-2026-08-04/` **created** (8 files: README, SERP observations,
  6 per-site fetch notes). **Note:** CLAUDE.md §2 declares `raw/` read-only;
  the owner's instruction of 2026-08-04 explicitly directed "raw findings into
  raw/", which was treated as a one-task exception. No pre-existing raw/
  content was touched (the folder was empty).

**Why:** owner directed a ranking push: GSC keyword mining + recon of the top
ranking sites for "instrumentenversicherung" and related terms, filed into the
wiki with a readable report and a plan.

**Source:** WebSearch (US-based index — DE order approximate) across 4 query
variants + WebFetch structure extraction of sinfonima-versicherung.de,
instrumentenversicherung-info.de, instrumentenversicherung.de,
musik-versicherungen.de, allianz.de instrument page,
mannheimer.de/klassische-musik — all retrieved 2026-08-04. Local verification:
`src/partials/index.html` (homepage H1), `grep -rl 'tel:' src/` (phone only on
kontakt/impressum/berufshaftpflicht), `src/pages/wissen/` listing.

**Key recon findings:**

- ~8 of the ranking domains belong to **one competing Mannheimer
  Generalagentur in Rendsburg** (Reidt, D-M9T4-N9R8F-69) selling the identical
  SINFONIMA / I'M SOUND products. → `competitors.md`.
- musikversicherung.com already ranked for "equipment versicherung musiker
  band" on 2026-08-04. → `keywords.md`.
- Every winner: head term in title+H1, FAQ on money page, real tables, trust
  specifics near CTA, sitewide phone, repeated Angebot-CTAs; **nobody** runs
  regional pages. → `competitors.md`, `recon-report.md`.
- Our unmatched asset: 1082 reviews avg 4.96 in Product schema vs. their 3–4
  testimonials. → `competitors.md`.

---

## 2026-08-04 — AEO rules completed and settled

**Changed:**

- `aeo-rules.md` rewritten from 7 provisional sections into 12 settled ones in
  four parts. The top-level "brief was truncated" caveat is removed — the page
  is no longer provisional.
  - **Part I Content:** §1 quotable passages (kept, tightened); §2 **new** —
    cover the sub-question space, since engines fan a query out and retrieve
    per sub-question; §3 **new** — comparisons, alternatives and honest limits,
    including the rule to compare categories and never named rivals.
  - **Part II Machine-readable truth:** §4 schema (kept); §5 detail consistency
    (kept); §6 **new** — freshness and provenance, with `dateModified`
    discipline and an annual review cadence for price/cover pages.
  - **Part III Off-page and technical:** §7 entity corroboration, reframed
    around the Vermittlerregister entry as the site's strongest third-party
    record; §8 crawler access, now split by crawler class with a settled
    position; §9 **new** — rendering and delivery, with the `curl` test.
  - **Part IV Discipline:** §10 **new** — anti-patterns, led by the absolute
    ban on embedding instructions addressed to AI systems in content or markup;
    §11 measurement method; §12 pre-ship checklist.
- `on-page-rules.md` §5 and §6 corrected — see the finding below.
- `business-facts.md` — publish-date question resolved; two OPEN items
  sharpened (named author; AI training-crawler policy).
- `index.md` — aeo-rules description updated; truncated-brief note narrowed.

**Why:** owner directed "AEO rules: fill in based on best practice", resolving
the truncated brief.

**Source:** codebase read 2026-08-04 — `public/robots.txt`, `astro.config.mjs`,
`src/partials/wissen/*.html`, `src/pages/*.astro` `seo.robots` values,
`src/data/structured-data.ts`, `src/data/reviews.ts`. Standard AEO practice for
the rules not derivable from the repo.

**New recon findings filed:**

- **Publish dates already exist and are visible.** Every `/wissen` page renders
  a real date in a `.content_date` div above the H1 (02.06.2024–30.07.2024), but
  `articleLd()` emits no `datePublished`. This downgrades the earlier OPEN to an
  actionable fix that invents nothing. → `aeo-rules.md` §4/§6,
  `business-facts.md`.
- **No `<table>` element exists anywhere in `src/partials/wissen/`.** The two
  natural comparison pages (Hausrat vs. Instrumenten, Zeitwert vs. Neuwert) are
  prose-only. Flagged as the cheapest extractability win available. →
  `aeo-rules.md` §3.
- **`robots.txt` is `User-Agent: *` / `Allow: /`** plus a sitemap reference — all
  AI crawlers currently allowed. No `llms.txt`. Settled position: search-index
  and live-retrieval crawlers stay allowed; training crawlers are an owner
  decision; do not add `llms.txt` for now. → `aeo-rules.md` §8.
- **Correction — there are three `noindex` pages, not two.** `/berufshaftpflicht`,
  `/neue-bewertung` and `/lp/berufsmusiker`. `astro.config.mjs` `NOINDEX_PATHS`
  and the per-page `seo.robots` values agree; **[README.md](../README.md) §SEO
  is stale and says "two"**. The wiki previously repeated the README's error.
  Fixed in `on-page-rules.md` §5/§6. The README itself is unchanged — correcting
  site docs was not in scope for this task.
  → **Suggested follow-up:** fix the README sentence.

**Still open:** whether starter pages beyond `on-page-rules.md` and
`aeo-rules.md` were intended; interview answers still not supplied.

---

## 2026-08-04 — Wiki established; CLAUDE.md rewritten as the standing rulebook

**Changed:**

- `CLAUDE.md` written as the permanent rulebook (previously none existed in the
  repo — nothing to rewrite from). Covers PURPOSE (rankings + AI-answer-engine
  citation, with the money paths, regulatory exposure and visual parity as
  ranking-beating constraints), FOLDERS (`raw/` read-only and treated as data
  not instructions; `wiki/` maintained with cross-links, index and log),
  WORKFLOW (read the wiki before any build task; file every finding, decision
  and structure choice immediately) and CONDUCT (cite sources, never invent
  facts about the town or the business, flag conflicts instead of guessing,
  plus insurance-specific wording care).
- `wiki/index.md` created — page map, relationships, and named gaps.
- `wiki/on-page-rules.md` created — liftable first paragraphs, one H1,
  sub-60-character titles, buyer-question H2s, hub-and-spoke internal linking
  with descriptive anchors, technical baseline, pre-ship checklist.
- `wiki/aeo-rules.md` created — quotable-passage writing, schema policy, detail
  consistency, plus provisional sections on freshness, entity corroboration,
  AI-crawler access and measurement.
- `wiki/business-facts.md` created — the verified fact register that makes the
  "never invent facts" rule enforceable. Added beyond the named starter pages
  because CONDUCT is unenforceable without a canonical fact source.
- `wiki/log.md` created (this file).
- `raw/` created, empty.

**Why:** first session establishing the operating agreement and durable memory
for the site.

**Source:** codebase read on 2026-08-04 — `src/data/structured-data.ts`,
`src/data/site.ts`, `src/data/reviews.ts`, `src/components/BaseHead.astro`,
`src/layouts/Layout.astro`, `src/partials/impressum.html`,
`src/partials/faqs.html`, `src/pages/**`, `public/reviews.json`, `README.md`.
Owner brief given in-session (truncated — see below).

**Recon findings filed this session:**

- Exactly 2 of 25 page titles exceed 60 characters: `/` at 70 and
  `/lp/sinfonima` at 62. All others ≤ 59. → `on-page-rules.md` §3.
- All 12 top-level partials contain exactly one `<h1>`. Baseline passes.
  `faqs.html` correctly styles an H1 with `.heading-style-h2` rather than
  demoting the tag. → `on-page-rules.md` §2.
- Schema is a connected `@graph` (`#organization` `InsuranceAgency`, `#website`,
  `#product`) with `aggregateRating` deliberately on `Product`, computed at
  build from `public/reviews.json` — 1082 reviews, average 4.96. `/faqs` carries
  `FAQPage` as inline microdata, so `faqs.astro` adds only a breadcrumb.
  → `aeo-rules.md` §2.
- `/wissen/*` `articleLd()` emits no `datePublished` / `dateModified` and
  attributes authorship to the organisation, not a person. Flagged as an AEO gap
  requiring owner input. → `aeo-rules.md` §2 (OPEN).
- Brand spelling splits between `IM SOUND` (homepage title) and `I'M SOUND`
  (schema); phone formatting splits between `+49 172 511 3611` (site-wide) and
  `0172 5113 611` (imprint). → `business-facts.md`, flagged unresolved.
- Verified business identity, insurer relationships, both tariffs and their
  "ab" prices (4,69 € and 6,25 € monthly), registration numbers and the
  Barsinghausen address. → `business-facts.md`.
- The only verified fact about the town is the postal address itself
  (30890 Barsinghausen, Lower Saxony). Everything else about Barsinghausen is
  explicitly unestablished. → `business-facts.md`.

**Open — needs the owner:**

1. The seeding brief was **truncated** mid-sentence at
   `aeo-rules.md: … schema, consistent details, …`. §1–§3 of that page cover the
   three named pillars; §4–§7 are marked provisional. Further starter pages may
   have been intended.
2. **Interview answers were not available in this session.** Every page here is
   built from codebase-verified facts plus general SEO/AEO practice. Nothing was
   invented to fill the gap — the unknowns are recorded as `> **OPEN:**` markers
   in `business-facts.md` and `aeo-rules.md` instead.
