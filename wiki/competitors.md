# Competitors — who ranks and how they are built

Settled structural intelligence on the sites that rank for the core German
queries. Raw fetch notes: `raw/recon-2026-08-04/` (all retrieved 2026-08-04
via US-based web search + page fetches; German SERP order may differ slightly,
the set of organic winners was consistent across four query variants).

Readable summary with comparison table: [recon-report.md](recon-report.md).
Target queries: [keywords.md](keywords.md). Rules this feeds:
[on-page-rules.md](on-page-rules.md), [aeo-rules.md](aeo-rules.md).

---

## The central finding: one competitor, many domains

Most of the German organic results for "Instrumentenversicherung" and its
variants belong to **one competing Mannheimer Generalagentur in Rendsburg**
(Torsten Reidt; Baustr. 3a, 24768 Rendsburg; phone 04331-334340;
Vermittlerregister D-M9T4-N9R8F-69 — imprints read 2026-08-04). The portfolio:

- sinfonima-versicherung.de (flagship, "Seit über 30 Jahren")
- instrumentenversicherung-info.de (most SEO-sophisticated; full hub-and-spoke)
- instrumentenversicherung.de (thin exact-match-domain site)
- musikerversicherung.de, bandversicherung.de,
  imsound-equipmentversicherung.de, gitarrenversicherung.de,
  geigenversicherung.de

They sell **the identical SINFONIMA / I'M SOUND products** through the same
risk carrier as this site. This is the real head-to-head competitor. Their
moat is domain portfolio + 30-years claim; their weakness is thin review
evidence (3–4 testimonials vs. our 1000+ baked-in reviews) and duplicated
effort across domains.

> Do not imitate the multi-domain tactic. It fragments entity signals,
> multiplies maintenance, and skirts doorway-page guidelines —
> [aeo-rules.md](aeo-rules.md) §10 forbids the equivalent on-site pattern.
> One strong entity beats eight shallow ones for AEO specifically.

## The other players

- **musik-versicherungen.de** — Josef Just, Bad Essen; independent Mannheimer
  agent. Dual taxonomy: product lines × seven target-group pages. No reviews,
  one phone mention. "Marktführer" claim in the H1.
- **allianz.de** (…/gegenstandsschutz/instrumentenversicherung/) — the only
  big direct insurer ranking in DE. One deep page: buyer-question H2s, a
  Smart/Komfort/Premium comparison table, FAQ block, policy-document
  downloads. Instrument cover is framed as a use case of "Gegenstandsschutz".
- **mannheimer.de/klassische-musik** — the risk carrier's own SINFONIMA page.
  Benefit-led H2s, FAQ, PDF downloads, "Agentur finden" CTA. No reviews, no
  phone on page. Ranks on brand authority, not structure.
- **Content/authority sites** that occupy informational SERPs: test.de
  (Stiftung Warentest), bonedo.de, dieversicherer.de (GDV). AT insurers
  (zurich.at, wienerstaedtische.at) appear because search localisation —
  relevant only if DACH expansion becomes a goal.
- **Group-scheme niche:** SV SparkassenVersicherung (BDMV), WGV — cheap
  group/association tariffs; they own the "Verein/Verband" angle.

## What every winner shares (common patterns)

1. **The head term in title + H1.** Every ranking page says
   "Instrumentenversicherung" or "Musikinstrumentenversicherung" in both.
   (Our homepage H1 — "Die richtige Versicherung für deine Instrumente",
   `src/partials/index.html` — does not contain the head term.)
2. **Hub-and-spoke by instrument type and by target group** on the
   structurally strongest sites (instrumentenversicherung-info.de,
   musik-versicherungen.de): Gitarre / Geige / Blasinstrumente /
   Tasteninstrumente / E-Equipment × Berufsmusiker / Hobbymusiker / Orchester
   / Musikschulen / Vereine / Sammlungen.
3. **A dedicated Kosten page with a price table** (Instrumentenwert →
   Monatsbeitrag/Jahresbeitrag) and a **Vergleich vs. Hausratversicherung**
   page or section. Comparison content in real tables.
4. **FAQ block on the money page**, questions phrased as buyer questions
   (Selbstbeteiligung? Allgefahrendeckung? grobe Fahrlässigkeit? ab wann?).
5. **Trust specifics near the CTA:** years in business, Vermittlerregister
   number, dated testimonials, named person. Agent sites out-trust the
   insurers' own pages this way.
6. **Phone number visible sitewide** — 1–4 appearances (header and/or footer),
   often with service hours. (Ours appears only on /kontakt, /impressum,
   /berufshaftpflicht — `grep -rl 'tel:' src/`, 2026-08-04.)
7. **Two conversion paths side by side:** "Angebot anfordern" (form) and
   "Jetzt berechnen" / "Online Antrag" (calculator or direct application).
   CTA wording is always Angebot/berechnen-centred, repeated 3–6× per page.
8. **No regional/service-area pages anywhere.** Nobody does local landing
   pages; the product is worldwide by nature. There is no evidence a
   town-page tactic works in this vertical — and for us it would collide with
   the fabrication ban ([CLAUDE.md](../CLAUDE.md) §4).
9. **Freshness signals in the SERP:** the sharpest competitor titles carry
   the year and the entry price ("Instrumentenversicherung 2026: Ab
   4,69€/mtl. | SINFONIMA®").

## Where we already beat them

- **1000+ reviews, avg 4.96, computed at build** into Product schema (exact
  count in [business-facts.md](business-facts.md)) — no competitor shows more than a
  handful of testimonials; none has review-rich structured data.
- **Modern static site** (fast, clean canonical structure) vs. their dated
  PHP-era sites (instrumentenversicherung.de still routes via
  `index.php?referenz=`).
- **A real /wissen cluster** already exists (11 spokes) — the Reidt sites'
  Ratgeber sections are thinner.
- **Du-Ansprache** matches how musicians actually talk; every competitor uses
  Sie. (Register decision already settled — [CLAUDE.md](../CLAUDE.md) §4.)

## Where they beat us — the gap list

| Gap | Who does it | Our state (verified 2026-08-04) |
| --- | --- | --- |
| Head term in homepage H1 | all | H1 lacks "Instrumentenversicherung" |
| Instrument-type spokes | info.de, Reidt satellites | only Klavier (`/wissen/instrumentenversicherung-fur-klaviere`) |
| Target-group spokes | info.de, musik-versicherungen.de | none indexable — `/lp/berufsmusiker` is noindex,nofollow |
| Sitewide phone | all agent sites | phone only on 3 pages |
| Vermittlerregister + years near CTA | info.de, sinfonima-versicherung.de | register no. only in Impressum; founding year unverified (OPEN in [business-facts.md](business-facts.md)) |
| Year+price in SERP title | info.de | our title is over-length and carries no year |
| Price table on Kosten page | info.de, Allianz | prose only, no `<table>` in `src/partials/wissen/` |
| Schadenbeispiele page | info.de, mannheimer.de | none (regulated wording — needs approved text) |

---

*Back to [index.md](index.md).*
