# Recon report — competitive landscape & ranking plan

**Date:** 2026-08-04. Readable summary of the competitor recon; the settled
detail lives in [competitors.md](competitors.md), raw fetch notes in
`raw/recon-2026-08-04/`, query targets in [keywords.md](keywords.md).

Method: web search across four query variants (US-based index — DE SERP order
approximate, organic winner set consistent) + structure-only fetches of six
competitor pages, all 2026-08-04.

---

## Headline finding

The organic results for "Instrumentenversicherung" are dominated not by
insurers but by **one competing Mannheimer Generalagentur (Rendsburg, Reidt)
running ~8 exact-match domains** that sell the identical SINFONIMA / I'M SOUND
products. Beating them is not a domain fight — it is won by being the **one
coherent, verifiable, review-rich entity** with deeper coverage of the buyer's
question space. Our structural advantages (1000+ baked-in reviews, modern fast
site, real /wissen cluster) are exactly the ones their portfolio cannot match
per-domain.

## Comparison table

| Site | Operator | Homepage/page title | H1 | Structure | Trust shown | Phone | Primary CTAs |
| --- | --- | --- | --- | --- | --- | --- | --- |
| sinfonima-versicherung.de | Reidt agency (Rendsburg) | Musikinstrumentenversicherung der Mannheimer SINFONIMA | SINFONIMA® – Ihre zuverlässige Musikinstrumenten­versicherung | flat 1-level: E-Instrumente, Sammel, Rabatte, Vergleich, FAQ, Antrag | 30+ Jahre; 3 dated 5★ testimonials; register no.; claims-speed stats | 4× + hours | "Angebot einholen", "Ihr persönliches Angebot anfordern" |
| instrumentenversicherung-info.de | Reidt agency | Instrumentenversicherung 2026: Ab 4,69€/mtl. \| SINFONIMA® | Instrumentenversicherung – Schutz für Ihre Musikinstrumente | 3-level hub-and-spoke: 5 instrument + 6 target-group + 5 Leistungen spokes, Kosten, Vergleich, Ratgeber, Schadenbeispiele | 30+ Jahre; 4.9/5 claim; dated testimonials; register no.; named operator | footer 2× | "Gleich Ihr Angebot anfordern!" (4+×), "Online Antrag" |
| instrumentenversicherung.de | Reidt agency | (thin legacy site) | "Sie lieben Ihr Instrument? …" | ~1 page, `index.php?referenz=` routing | 30 Jahre Erfahrung | 2× | "Angebot anfordern" |
| musik-versicherungen.de | Just agency (Bad Essen) | Musik-Versicherungen.de – Instrumentenversicherungen für die Musikwelt | Die Instrumentenversicherung vom Marktführer. GANZ SICHER. | 3 product lines × 7 target-group pages, FAQ, blog | Marken-Diplom; "Marktführer" claim; no reviews | 1× | "Jetzt Preis berechnen", "Unverbindliches Angebot anfragen" |
| allianz.de (page) | Allianz | Instrumentenversicherung: Musikinstrumente versichern \| Allianz | Instrumenten­versicherung | one deep page, depth-3 URL; question H2s; Smart/Komfort/Premium table; FAQ | brand; policy PDFs | ~2 | "Jetzt berechnen", "Zur Beratung" |
| mannheimer.de/klassische-musik | Risk carrier | Instrumentenversicherung SINFONIMA - Mannheimer Versicherung AG | Musikinstrumentenversicherung SINFONIMA | product page among special lines; FAQ; downloads | brand only | 0 | "Jetzt Beitrag berechnen", "Agentur finden" |
| **musikversicherung.com (us)** | Blaskewitz / Falk agency | Instrumentenversicherung ohne Selbstbeteiligung \| SINFONIMA & IM SOUND (70 chars) | Die richtige Versicherung für deine Instrumente | 11-spoke /wissen hub, FAQ page, reviews page, 2 LPs | 1000+ reviews avg 4.96 in schema; register no. in Impressum only | 0 sitewide (3 subpages only) | "Anfrage" paths |

## Common patterns — what every winner shares

1. Head term ("Instrumentenversicherung"/"Musikinstrumentenversicherung") in
   **both title and H1**.
2. **Question-shaped content blocks / FAQ on the money page** (Kosten?
   Selbstbeteiligung? Hausrat? grobe Fahrlässigkeit?).
3. **Real comparison/price tables** (tariffs, Instrumentenwert → Beitrag).
4. **Trust specifics adjacent to the CTA** — years, register number, dated
   testimonials, named person (agent sites), or policy PDFs (insurers).
5. **Repeated Angebot/berechnen CTAs** (3–6 per page), two conversion paths
   (form + calculator/online application).
6. **Visible phone** on agent sites (1–4×, header/footer, partly with hours).
7. **Segmented spokes** (instrument type × target group) on the structurally
   strongest sites.
8. **No regional pages anywhere** — the local-landing-page tactic does not
   exist in this vertical.

## The plan

Sequenced by leverage ÷ effort. Items marked **[owner]** change a public
claim, wording, or scope and need a decision first
([CLAUDE.md](../CLAUDE.md) §4). Nothing below touches
/impressum, /datenschutz, /versicherungsbedingungen, or form logic.

### Phase 0 — measurement and breakage first (this week)

**Also open, found 2026-08-20:** three assets the site references do not
exist — both Auslandsreisen PDFs linked from the `/faqs` answer, and the
`mv-logo.jpg` in twelve pages' client-injected Article schema. The English PDF
was earning 6.7k impressions before the migration. Account, cause and fix in
[broken-assets.md](broken-assets.md). **[owner — must supply the two original
PDFs.]**

0. **Fix the www 404 — partially done 2026-08-05.** Owner bound the www host;
   it now returns **200** (serves the site) instead of 404. Duplicate-host
   risk is mitigated by the absolute apex canonicals in `BaseHead.astro`,
   but the clean end state is still a **301**: Cloudflare Redirect Rule,
   host equals `www.musikversicherung.com` → 301 to
   `https://musikversicherung.com` preserving path. **[owner — Cloudflare
   dashboard, low urgency now.]** Verify with
   `curl -sI https://www.musikversicherung.com/wissen` → expect `301` +
   `location:` on the apex.
1. **GSC data** — ✅ 16-month export received 2026-08-04
   (`raw/gsc/…-2026-08-04/`), analysed into [keywords.md](keywords.md).
   Property confirmed alive. Still to do: service-account API access for
   query×page attribution (routes in [keywords.md](keywords.md)).
2. **Baseline the AEO prompt set** per [aeo-rules.md](aeo-rules.md) §11 and
   log it — one dated reading before we change anything.

### Phase 1 — on-page fixes on existing pages (days, mostly no new claims)

3. **Homepage H1** carries the head term. **[owner]** — H1 wording is brand
   voice; proposal: keep the du-register sentence but lead with
   "Instrumentenversicherung".
4. **Homepage title ≤ 60 chars**, consider competitor pattern
   (year + "ab 4,69 €"). **[owner]** — touches the "ohne Selbstbeteiligung"
   claim; flagged since 2026-08-04 in [on-page-rules.md](on-page-rules.md) §3.
5. **Tables**: price table on the Kosten spoke, comparison table on the
   Hausrat spoke and Zeitwert/Neuwert spoke — already identified as the
   cheapest extractability win ([aeo-rules.md](aeo-rules.md) §3). Values only
   from approved sources; gaps left visible and asked, not filled.
6. **`datePublished` into `articleLd()`** from the visible `.content_date` —
   already-approved fix, asserts nothing new ([aeo-rules.md](aeo-rules.md) §4).
7. **Phone sitewide** (footer at minimum, header ideally). **[owner]** —
   which number is canonical is an open inconsistency in
   [business-facts.md](business-facts.md).
8. **Trust block near the conversion CTAs**: review count + average (already
   true and in schema), Vermittlerregister number with link to the register.
   No years-in-business claim until the founding date is verified (OPEN).
9. Resolve **IM SOUND vs. I'M SOUND** spelling. **[owner]**.

### Phase 2 — close the structure gap (weeks)

10. **Instrument-type spokes** under /wissen (Gitarre, Geige/Streicher,
    Blasinstrumente, E-Equipment/I'M SOUND; Klavier exists): one narrow
    question-space page each, hub-linked, no fabricated cover details —
    approved wording or gaps. **[owner]** for any cover/price statement.
11. **Target-group spokes** (Berufsmusiker — indexable, unlike the noindex
    LP —, Musikschulen/Vereine/Orchester, Eltern/Kinder). Same rules.
    **[owner]** to confirm segments actually served and any group-tariff
    facts.
12. **FAQ enrichment** on the homepage/money pages from the competitor
    question set, answered per [on-page-rules.md](on-page-rules.md) §4 —
    without duplicating /faqs content (link, don't copy).
13. **Schadenbeispiele**: high-trust content both Reidt and Mannheimer run.
    Only from real, approved cases — **[owner]** supplies material into
    `raw/`.

### Phase 3 — entity and off-site (ongoing)

14. **Google Business Profile** with the canonical NAP; extend `sameAs`.
    **[owner]** picks the canonical NAP first
    ([business-facts.md](business-facts.md) inconsistency #4).
15. Keep earning **dated reviews** (already strong — keep the flow alive).
16. **Musician-community presence** (the SERPs show bonedo.de/test.de-class
    content ranking): earned mentions only, never bought
    ([aeo-rules.md](aeo-rules.md) §7).

### Phase 4 — measure and iterate (monthly)

17. Re-run the AEO prompt set + GSC position tracking; log deltas in
    [log.md](log.md); feed new gaps back into [keywords.md](keywords.md).

### Priority update from GSC data (2026-08-05)

The 16-month export ([keywords.md](keywords.md)) re-weights the phases:

- **CTR is the acute problem, ranking is the chronic one.** Several top-10
  rankings earn zero clicks ("klavier versichern" pos 4.7, "wie versichere
  ich mein musikequipment?" pos 6.5, the 12.5k-impression SINFONIMA cluster
  at pos ~13). Phase 1 title/description work is therefore the highest-ROI
  item on the whole plan — snippet rewrites on the Klavier page, homepage,
  `/lp/sinfonima` and the equipment-related pages first.
- **A dedicated indexable I'M SOUND / equipment page jumps to the top of
  Phase 2** — the equipment cluster is 12.2k impressions at position ~14
  with no owning URL beyond the homepage.
- **Instrument-type spokes confirmed by demand:** Streicher (3.5k imp),
  Bläser (2.8k), Gitarre (1.4k) — currently position 30–48 with no pages.
  Klavier already ranks 4.7; it needs only the snippet fix.
- **The Hausrat spoke needs the table + a snippet** aimed at "sind
  musikinstrumente durch die hausratversicherung abgedeckt?" (1.1k imp,
  pos 11, 0 clicks).
- **Vergleich cluster (2.5k imp):** decide whether the Hausrat spoke absorbs
  it or a dedicated honest category-comparison page is built.
  **Owner ruling 2026-08-05: possible, lowest priority.**
- **AT + CH show 6.7k impressions** at pos ~28. **Owner ruling 2026-08-05:
  DACH-wide ranking is the goal; dedicated DACH work (hreflang, AT/CH
  tariff-eligibility verification) is lowest priority for now.** Also a
  cover-eligibility question, not just SEO (sinfonima-versicherung.de notes
  DE+AT residence requirements; ours must be verified from policy docs, not
  assumed).
- **English demand exists** (2.4k imp; the travelling-abroad PDF alone drew
  6.7k imp). **Owner ruling 2026-08-05: possible, lowest priority.**
  English content stays barred meanwhile ([CLAUDE.md](../CLAUDE.md) §4).
- **Local queries are explicitly out of scope.** Owner ruling 2026-08-05:
  purely online business; Soltau and generic local/kfz queries irrelevant.
  See [business-facts.md](business-facts.md).

### Phase 1 progress (2026-08-05)

The Klavier spoke (`/wissen/instrumentenversicherung-fur-klaviere`) rebuilt
as the model for the rest: head-term title ≤60 chars ("Klavier versichern:
Versicherung für Klavier & E-Piano"), 156-char click-earning description,
liftable first paragraph with the approved 30.000-€/178,50-€ example, six
buyer-question H2s, price table (values verbatim from the Kosten article),
sideways link to the Zeitwert/Neuwert spoke, `datePublished` in the Article
schema (builder now supports it — `src/data/structured-data.ts`), rich-text
table CSS added (`src/styles/global.css`), "Über den Author"→"Autor" fixed
in all 11 article partials. Coverage statements kept verbatim or reordered
only. **Rollout of the same pattern to the other 10 /wissen pages and the
schema dates is the next build task.**

### Phase 2 progress (2026-08-05)

**`/lp/imsound` built** — the equipment cluster (12.2k impressions, no owning
URL) now has a dedicated indexable LP, cloned structurally from
`/lp/sinfonima` (pixel-parity template, shared FAQ block, same CSS pattern).
Every product statement is a verbatim or minimally-adapted reuse of wording
already published on the homepage or FAQ (Überspannungsschäden, Selbstbehalt
nur in Spezialfällen, 20.000-€-Online-Abschluss, 100.000-€-Auto-Klausel via
shared FAQ, Laptops/Tablets/Fotoapparate). CTAs preselect the form via
`/anfrage?versicherung=IM%20SOUND` (verified: radio "IM SOUND" checked on
load). Linked from three /wissen articles (Klavier E-Piano section,
passende-police, tipps-zur-auswahl) — reachable in ≤3 clicks; in the
sitemap. URL decision: `/lp/imsound` (single token, mirrors the insurer's
imsound.de; URLs are permanent per [on-page-rules.md](on-page-rules.md) §5).
Remaining Phase 2 queue: Hausrat/Kosten spoke upgrades, then instrument LPs
(Streicher 3.5k imp, Bläser 2.8k, Gitarre 1.4k).

### Explicitly rejected

- **Multi-domain / doorway satellites** (the Reidt tactic) — entity dilution,
  maintenance burden, guideline risk. One strong entity instead.
- **Regional/town landing pages** — nobody in the vertical does them, and for
  us they'd require fabricating local facts ([CLAUDE.md](../CLAUDE.md) §4).
- **"Marktführer"/superlative claims** (musik-versicherungen.de's H1) —
  unattributable and legally risky ([aeo-rules.md](aeo-rules.md) §3).

---

*Back to [index.md](index.md).*
