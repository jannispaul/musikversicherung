# GEO audit — 2026-08-31 (recon snapshot)

A full Generative-Engine-Optimization audit run on 2026-08-31. Findings only —
the standing rules live in [aeo-rules.md](aeo-rules.md) and
[on-page-rules.md](on-page-rules.md); this page records **what was observed on
that date** and the owner-decision items it surfaced. The client-facing write-up
is `GEO-AUDIT-REPORT.md` at the repo root.

Companion to [recon-report.md](recon-report.md) (competitor/SERP recon) and
[competitors.md](competitors.md).

---

## Composite: 68/100 ("Fair", top of band)

| Category | Score | One-line reason |
| --- | --- | --- |
| AI Citability | 76 | Ideal delivery; `/wissen` spokes not packaged for extraction |
| Brand Authority | 22 | **Weakest.** Near-invisible off-domain; reviews self-hosted only |
| Content E-E-A-T | 82 | Named credentialed author + register + awards; 2024 corpus, unrefreshed |
| Technical GEO | 85 | Static SSR, honest sitemap, crawlers open; no Bing/IndexNow |
| Schema | 92 | Best-in-class connected `@graph`; all verified in raw HTML |
| Platform Optimization | 63 | Strongest AIO (74), weakest Gemini (50) |

The shape of the result: **on-page/technical is A-grade; off-page is F-grade.**
The composite is pulled down almost entirely by Brand Authority (§ below).

## Verified in served HTML (the `curl` test, per [aeo-rules.md](aeo-rules.md) §9)

- Homepage ships the full graph: `InsuranceAgency`, `Person`, `WebSite`,
  `Product` + `AggregateRating` **1089 / 4,97**, `AggregateOffer` with
  `minPrice`. The **visible** review count/average matches the schema exactly —
  `src/components/Reviews.astro` substitutes the live figures at build, so the
  "1058 / 4,96" placeholder in the raw partial never reaches production. **No §5
  inconsistency here** (checked because the source partial looked stale).
- `/faqs` ships `FAQPage` microdata with 14 `Question`/`Answer` pairs.
- `/wissen/*` ship `Article` + `BreadcrumbList` + the site graph.
- All money paths return 200 (`/anfrage`, `/schaden-melden`, `/kontakt`).
- Titles: only two exceed 60 chars (homepage 70, `/lp/sinfonima` 62) — both
  already owner-flagged. Meta descriptions present on every content page.

> Tooling caveat worth remembering: `WebFetch` converts to markdown and **strips
> `<script>` and microdata**, so it reports "no JSON-LD / no `sameAs`" on pages
> that clearly have both. Always confirm schema with `curl | grep`, never with a
> rendered-markdown proxy. Two sub-agents tripped on this.

## New / actionable findings

1. **The `/wissen` flagship isn't extractable.**
   `/wissen/was-kostet-eine-instrumentenversicherung` opens with a wind-up
   ("*… aber wusstest du, dass …*") and then "*es gibt zur Beitragshöhe keine
   allgemeingültige Aussage*" — the opposite of answer-first, on the page for the
   exact query [aeo-rules.md](aeo-rules.md) §2 uses as its worked example. Its
   only H2s are "Über den Author", a CTA, and "Mehr zu …" — no buyer questions.
   Representative of the June–July 2024 corpus. Violates
   [on-page-rules.md](on-page-rules.md) §1/§4 and [aeo-rules.md](aeo-rules.md)
   §1/§2. **Fix uses only already-published figures** — no new facts.
2. **Zero `<table>` in `src/partials/wissen/`** (re-confirmed 2026-08-31). Still
   the cheapest extractability win, exactly as [aeo-rules.md](aeo-rules.md) §3
   said on 2026-08-04.
3. **Bing Webmaster / IndexNow not enabled** — no `msvalidate.01`, no IndexNow
   key. Cloudflare supports IndexNow natively; low effort, feeds the index
   Copilot grounds on.

## Off-page (Brand Authority) — the standing weakness

External recon on 2026-08-31 found the *intermediary* near-invisible off-domain:
reviews self-hosted only (no Trustpilot/ProvenExpert/confirmed Google profile),
`sameAs` = one **unverified, unlinked** Facebook page, **no Wikidata/Wikipedia
entity** for the brand, no surfaced Reddit/YouTube/LinkedIn. Competitors
(Mannheimer/SINFONIMA direct; reseller sinfonima-versicherung.de / Torsten Reidt)
own the forum, video and LinkedIn footprint. This confirms and sharpens the
existing OPENs in [business-facts.md](business-facts.md) (`sameAs` list; GBP;
Barsinghausen-vs-Soltau NAP split) and the priorities in
[aeo-rules.md](aeo-rules.md) §7.

The score's floor is held up by the **Vermittlerregister entry
D-34VM-MMPLD-10** — a real third-party public record, the "moat" §7 names. The
work is to connect the domain's assertions to independent records, not to add
more on-domain copy.

## Owner decisions this surfaced

> **OPEN:** **Wikidata, not Wikipedia, is the realistic entity anchor.** A full
> Wikipedia article for a small § 34d intermediary is unlikely to survive
> notability review; a factual Wikidata item sourced to the imprint is
> achievable and is what ChatGPT/Gemini/Perplexity can resolve the brand
> against. Recommended, not yet decided — promote into
> [aeo-rules.md](aeo-rules.md) §7 once the owner rules.

> **OPEN:** independent review profile (Google/ProvenExpert/Trustpilot) to make
> the 1089-review signal third-party-checkable. Depends on resolving the
> Barsinghausen/Soltau NAP question first — see
> [business-facts.md](business-facts.md).

> **OPEN:** answer-first rewrites of `/wissen` leads touch cover/claims wording —
> reuse insurer-approved text, owner sign-off before shipping
> ([CLAUDE.md](../CLAUDE.md) §4). Not a licence to paraphrase cover for
> "quotability".

---

*Back to [index.md](index.md).*
</content>
