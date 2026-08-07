# Keywords — target queries, verified from Search Console

Query register for musikversicherung.com, now based on **real GSC data**:
16-month export (Apr 2025 – Aug 2026), `raw/gsc/musikversicherung.com-Performance-on-Search-2026-08-04/`,
provided by the owner 2026-08-04. Companion pages:
[competitors.md](competitors.md), [on-page-rules.md](on-page-rules.md),
[recon-report.md](recon-report.md).

---

## Baseline (16 months, Web search, all countries)

- **~652 clicks / ~115k impressions** at page level; the query table
  (privacy-filtered) shows 119 clicks / 83.5k impressions over 589 queries.
- Average position improved from ~28–31 (Apr 2025) to ~19–21 (Aug 2026);
  clicks remain ~0–3/day. Rankings are drifting up; **CTR is the acute
  disease** — multiple top-10 rankings earn zero clicks (see below).
- Countries: DE 81k imp / 591 clicks; **AT 3.4k imp (pos 27.5), CH 3.3k imp
  (pos 28.5)** — real DACH demand, currently unserved by any decision.
- Devices: desktop and mobile essentially equal.

## Cluster table (from Suchanfragen.csv, clustered 2026-08-05)

| Cluster | Impr. | Clicks | Weighted pos. | Owning URL today | Read |
| --- | --- | --- | --- | --- | --- |
| Head terms ("instrumentenversicherung" 8.1k/pos 21, "musikinstrumentenversicherung" 3.7k/pos 61, + "versicherung (für) musikinstrument(e)" variants ~10k unclustered, + "…versichern" verb forms 9.7k/pos 32) | ~30k | ~30 | 25–40 | `/` (pos 21.7 avg) | the prize; homepage + hub |
| SINFONIMA / Mannheimer brand-adjacent (56 queries: "mannheimer instrumentenversicherung" 1.7k, "sinfonima" 2.0k, "sinfonima versicherung" 1.6k …) | 12.5k | 11 | ~14 | homepage catches these; `/lp/sinfonima` itself at pos 35 | high intent, terrible CTR |
| Equipment / I'M SOUND / Band / Proberaum ("wie versichere ich mein musikequipment?" 2.3k @ pos 6.5 **0 clicks**; "im sound versicherung" variants ~2.3k @ pos ~9.5; "equipmentversicherung" 1.1k @ 15; "musik equipment versicherung" 1.2k @ 6.6) | 12.2k | 11 | ~14 | **`/lp/imsound` — built 2026-08-05** (title "Musik-Equipment versichern ab 6,25 €/Monat \| I'M SOUND") | monitor rankings/CTR |
| Hausrat overlap ("sind musikinstrumente durch die hausratversicherung abgedeckt?" 1.1k @ 11.2, **0 clicks**) | 3.2k | 0 | 16 | `/wissen/unterschiede-zwischen-hausrat--und-instrumentenversicherung` (pos 15) | snippet + table |
| Streicher/Geige/Cello/Harfe (34 queries) | 3.5k | 2 | 48 | none | spoke gap |
| Bläser/Sax/Trompete/Klarinette (34 queries) | 2.8k | 2 | 44 | none | spoke gap |
| Vergleich ("instrumentenversicherung vergleich" 1.4k @ 19) | 2.5k | 12 | 23 | none | see note below |
| English ("travel insurance for musical instruments" 0.9k @ 52; PDF `Tips-on-travelling-abroad.pdf` drew 6.7k imp / 11 clicks) | 2.4k | 0 | 57 | a PDF | language decision OPEN |
| Klavier/Piano ("klavier versichern" 1.1k @ **4.7, 0 clicks**) | 1.6k | 0 | 5.6 | `/wissen/instrumentenversicherung-fur-klaviere` | pure CTR fix |
| Kosten/Preis ("wie viel kostet…?" 280 @ 5.1) | 1.5k | 2 | 42 | `/wissen/was-kostet-eine-instrumentenversicherung` (pos 41) | table + snippet |
| Gitarre/Bass (12 queries) | 1.4k | 0 | 31 | none | spoke gap |
| Local/Soltau anomaly (below) | ~1.8k | ~8 | 1–5 | `/` | not product demand |
| Brand ("musikversicherung") | 453 | 40 | 1.0 | `/` | healthy |

**The CTR disease, named:** "klavier versichern" pos 4.7 / 0 clicks, "wie
versichere ich mein musikequipment?" pos 6.5 / 0 clicks, "wie hoch ist die
versicherungssumme für instrumente?" pos 10.9 / 0 clicks, whole SINFONIMA
cluster pos ~13 / 11 clicks on 12.5k impressions. Ranking work without
snippet work is wasted here — titles and meta descriptions must earn the
click ([on-page-rules.md](on-page-rules.md) §3), and competitors' year+price
titles show what we're losing to ([competitors.md](competitors.md)).

**Vergleich note:** a comparison page must stay honest — category comparison
(Hausrat vs. Instrumentenversicherung, SINFONIMA vs. I'M SOUND scope), never
a fake "neutral portal" ([aeo-rules.md](aeo-rules.md) §3). Whether to build a
dedicated Vergleich URL or strengthen the Hausrat spoke: owner call, filed in
[recon-report.md](recon-report.md).

## Anomalies

- **www 404.** `https://www.musikversicherung.com/` returns HTTP 404 (curl,
  2026-08-04) — the www host is not bound to the Cloudflare Pages project
  since the Strato move. Google still has www URLs indexed (Seiten.csv shows
  www rows with impressions and 2 clicks; `…/wissen/instrumentenversicherung-fur-klaviere`
  www variant at pos 21). Every such impression risks a 404 click. **P0 fix
  in [recon-report.md](recon-report.md).**
- **Soltau/local queries** ("versicherung soltau" 607 imp pos 4 with 6
  clicks, plus "kfz versicherung soltau", "versicherungsagentur soltau",
  "versicherung in meiner nähe" at pos 1–2): "Soltau" appears nowhere in the
  repo (grep, 2026-08-05). This looks like an off-site entity association —
  possibly a Google Business Profile. Flagged OPEN in
  [business-facts.md](business-facts.md); clicks from generic local insurance
  queries are almost certainly non-converting noise, but the association is
  worth understanding before building the GBP plan.

## Getting GSC data (kept for repeat pulls)

1. **Done 2026-08-04:** manual 16-month export into `raw/gsc/` (Suchanfragen,
   Seiten, Länder, Geräte, Diagramm, Darstellung). Property confirmed alive
   post-Cloudflare-move — data flows through 2026-08-02.
2. **Still recommended — API via service account** for repeatable
   query×page×date pulls past the 1 000-row UI limit: free Google Cloud
   project → enable Search Console API → service account → add its email as
   restricted user in GSC → key at `~/.gsc/musikversicherung.json` (never in
   the repo).

> **OPEN:** query→page mapping needs an API pull or per-page filtered
> exports; the flat export can't attribute queries to URLs (e.g. whether the
> SINFONIMA cluster lands on `/` or `/lp/sinfonima`).

---

*Back to [index.md](index.md).*
