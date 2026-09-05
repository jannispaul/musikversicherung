# GEO Audit Report: musikversicherung.com

**Audit Date:** 2026-08-31
**URL:** https://musikversicherung.com
**Business Type:** Local business — regulated insurance intermediary (§ 34d GewO), online-first / DACH-wide
**Pages Analyzed:** 8 fetched live (homepage, `/wissen`, `/wissen/was-kostet-eine-instrumentenversicherung`, `/faqs`, `/anfrage`, `/schaden-melden`, `/kontakt`, `/reviews`) + full review of all 23 routes in source and the site-wide schema builders.

> Method note: signals were verified against the **served raw HTML** (`curl`), not a rendered-markdown proxy. Where the two background research sub-agents relied on markdown conversion, their "no JSON-LD / no `sameAs`" readings were corrected against the raw HTML — the connected schema graph and the single Facebook `sameAs` **do** ship server-side.

---

## Executive Summary

**Overall GEO Score: 68/100 (Fair — top of band, adjacent to Good)**

musikversicherung.com is a technically and structurally **exceptional** site whose GEO score is dragged into "Fair" by one dimension: off-page authority. On-page, it does almost everything the AEO playbook asks — fully server-rendered static HTML, a connected JSON-LD `@graph` (InsuranceAgency → Person → WebSite → Product) with a live `AggregateRating` (1089 reviews / 4.97) that matches the visible text byte-for-byte, `FAQPage` microdata, `Article` + `BreadcrumbList`, correct `minPrice` offer modelling, an honest git-derived sitemap, and all AI crawlers allowed. The single biggest gap is that **nothing outside the domain corroborates any of it**: reviews are self-hosted, `sameAs` is one unverified Facebook page, there is no Wikidata entity, no confirmed Google Business Profile, and competitors own the forum/video/LinkedIn space. The second gap is narrower but high-value: the `/wissen` knowledge articles — the pages built to earn citations — open with rhetorical wind-ups instead of answer-first passages, carry no question-shaped H2s in their bodies, and contain **zero comparison tables**.

The upshot: this site says all the right things but has not yet made itself *checkable off-domain*, and its highest-intent content isn't packaged for extraction. Both are fixable without inventing a single new fact.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 76/100 | 25% | 19.0 |
| Brand Authority | 22/100 | 20% | 4.4 |
| Content E-E-A-T | 82/100 | 20% | 16.4 |
| Technical GEO | 85/100 | 15% | 12.75 |
| Schema & Structured Data | 92/100 | 10% | 9.2 |
| Platform Optimization | 63/100 | 10% | 6.3 |
| **Overall GEO Score** | | | **68/100** |

---

## Critical Issues (Fix Immediately)

**None.** This is rare and worth stating plainly. No AI crawler is blocked, there is no client-render/no-SSR trap, no domain-level noindex, no 5xx on money paths (`/anfrage`, `/schaden-melden`, `/kontakt` all return 200), and structured data is not just present but well-formed and consistent. The site clears every "critical" gate the audit tests for.

## High Priority Issues

1. **Off-page authority is near-absent — the reviews are self-hosted only.** The "4,97 / 1089 Bewertungen" signal, which is the site's strongest trust asset, lives exclusively on the brand's own pages. No independent Trustpilot, ProvenExpert, or confirmed Google review profile surfaced. To an answer engine this is unverifiable marketing copy, not authority. *(Brand Authority)*
2. **The entity has no independent anchor.** No Wikidata item, no Knowledge Panel signal; `sameAs` resolves to a single Facebook page that is not even linked from the site and whose ownership could not be externally confirmed. Searches for "Musikversicherung / SINFONIMA Versicherung" surface Mannheimer/SINFONIMA (the manufacturer) and rival agencies — the brand borrows recognition it doesn't own. *(Brand Authority)*
3. **The flagship `/wissen` articles are not packaged for extraction.** `/wissen/was-kostet-eine-instrumentenversicherung` — the page targeting the exact query the wiki uses as its worked AEO example — opens with a wind-up ("*Du bist dir vielleicht bewusst, dass … aber wusstest du, dass …*") and then states "*es gibt zur Beitragshöhe keine allgemeingültige Aussage*." The concrete, citable figures (4,69 € / 6,25 € per month, with sum-insured tiers) exist on the homepage but are **buried** here. The article's only H2s are "Über den Author," a product CTA, and "Mehr zu Instrumentenversicherungen" — none are buyer questions. This pattern is representative of the June–July 2024 Webflow-migrated corpus. *(AI Citability — violates `wiki/on-page-rules.md` §1, §4 and `wiki/aeo-rules.md` §1, §2)*
4. **Google Business Profile unconfirmed, and the NAP story is split.** No verified GBP was found; the wiki already records a Barsinghausen (imprint) vs. Soltau (entity listing) tension. Gemini and AI Overviews lean on a Google-recognised local entity, and there isn't one byte-consistent story yet. *(Brand Authority / Platform — already a `wiki/business-facts.md` OPEN)*

## Medium Priority Issues

1. **Zero `<table>` elements in the entire `/wissen` corpus.** The two natural comparisons — Hausrat vs. Instrumentenversicherung, and Zeitwert vs. Neuwert — are prose-only. The wiki itself calls proper tables here "the single cheapest extractability win available." *(Citability)*
2. **Corpus freshness.** Every `/wissen` article is dated June–July 2024 and none carries a visible "Zuletzt aktualisiert." On cost/cover topics, material ~2 years old is discounted by both readers and models. *(E-E-A-T / freshness)*
3. **Bing Webmaster Tools / IndexNow not enabled.** No `msvalidate.01` tag and no IndexNow key were found. Cloudflare supports IndexNow natively — low effort, directly improves the Bing index that Copilot grounds on. *(Technical / Platform)*
4. **Brand spelling split: `IM SOUND` vs. `I'M SOUND`.** The homepage `<title>` uses `IM SOUND`; the schema and body copy use `I'M SOUND`. Two spellings read as two entities to a matcher. *(Consistency — already flagged in `wiki/business-facts.md`)*
5. **Two titles exceed 60 characters** — homepage (70) and `/lp/sinfonima` (62). Both are commercially sensitive and flagged in the wiki as owner-decision (the homepage title carries the "ohne Selbstbeteiligung" claim). *(On-page)*

## Low Priority Issues

1. **No `llms.txt`.** This is a *deliberate, documented* decision (`wiki/aeo-rules.md` §8): it is not a ratified standard and no major engine documents support. Listed here only for completeness — the standing guidance is that if it is ever added it must be build-generated, never hand-maintained.
2. **Missing security headers.** `public/_headers` sets only cache-control; no HSTS, `X-Content-Type-Options`, or CSP. Low GEO relevance but easy hardening.
3. **Stray `public/.htaccess`.** Ignored by Cloudflare Pages (Apache-only); harmless clutter.
4. **`Person` node has no `sameAs` and no dedicated author bio page.** The author E-E-A-T is strong on-page but has no off-domain corroboration path.

---

## Category Deep Dives

### AI Citability (76/100)

**Strengths.** The delivery layer is ideal: static Astro, `output: static`, content in the initial HTML — the `curl` test passes everywhere. Passages on the homepage and FAQ are written in extractable units with question-shaped headings (the `/faqs` page carries 14 buyer-question Q&A pairs backed by `FAQPage` microdata). Prices appear with their "ab … / Monat" qualifier intact.

**Weaknesses (all on the `/wissen` spokes, which is where citations are earned):**
- **Wind-up intros instead of liftable answers.** The cost article's first paragraph fails the lift test outright. Fix: a 40–60-word answer-first lead under the H1, drawn from figures already published on the site — no new facts.
- **No question H2s in article bodies.** Buyer sub-questions (what drives the premium? is there a deductible? does it differ by instrument?) sit in undifferentiated prose. Break them into question H2s, each answered in its first sentence.
- **No tables.** See Medium #1.

### Brand Authority (22/100)

The weakest dimension by far, and the reason the composite is "Fair" rather than "Good." External reconnaissance found the intermediary essentially invisible off-domain: self-hosted reviews only, no Wikidata/Wikipedia entity for the brand, no surfaced Reddit/YouTube/LinkedIn presence, and a single orphaned, unverified Facebook page. Competitors — the manufacturer Mannheimer/SINFONIMA, and reseller agencies like sinfonima-versicherung.de — own the forum, video, and LinkedIn footprint for the niche.

**The one asset the raw score under-weights** (hence 22, not the sub-agent's 15): the **Vermittlerregister entry D-34VM-MMPLD-10** is an authoritative, third-party, publicly checkable record that almost no content competitor has. The wiki correctly calls verifiability "the moat." The job is to *connect the domain's assertions to independent records* — reviews, `sameAs`, a Google/Wikidata entity — so a model can corroborate rather than take the site's word.

### Content E-E-A-T (82/100)

Genuinely strong. A named, credentialed author (Heiner Blaskewitz, "Versicherungsfachmann (BWV)", 30+ years, portal "seit 2013") appears on every article and as the same `@id`-shared `Person` node in schema. The business is a real, imprinted, § 34d-registered intermediary with named risk carriers and three industry awards (Focus Money, WirtschaftsWoche) shown on the homepage. 11-article topical cluster with hub-and-spoke linking. **Drags:** corpus freshness (2024, no visible update dates), reviews not independently verifiable, and no author bio page / `Person.sameAs`.

### Technical GEO (85/100)

Near-exemplary. Static SSR, all crawlers allowed (`User-Agent: *` / `Allow: /`), `sitemap-index.xml` → `sitemap-0.xml` with **git-derived** `lastmod` (not build timestamps), self-referential absolute canonicals, `trailingSlash: "never"`, Speculation Rules prerender, AVIF imagery, immutable asset caching, `<html lang="de">`. **Drags:** no Bing/IndexNow verification, missing security headers, stray `.htaccess`. `llms.txt` absence is deliberate and does not count against the score here.

### Schema & Structured Data (92/100)

Best-in-class for a site this size, and the audit's standout. A connected `@graph` keyed by stable `@id`s; `AggregateRating` computed at build from live review data (cannot go stale); tariffs in an `AggregateOffer` with `minPrice` (correctly keeping the pages in Google's *product-snippet* class, not *merchant-listing*); `FAQPage`, `Article` (with real `datePublished` matching the visible date), `BreadcrumbList`, and a hub `ItemList` read from the page's own markup so it can't drift. All verified in raw HTML. **Only refinements:** add `Person.sameAs` once profiles exist; consider whether process pages warrant `HowTo` (currently an open question in the wiki — do not add speculatively).

### Platform Optimization (63/100)

Per the platform sub-agent: strongest on **Google AI Overviews (74)** — the existing schema/E-E-A-T/SSR work pays off most directly there. Weakest on **Gemini (50)** — no Google-ecosystem footprint (YouTube, verified GBP, Knowledge Graph). ChatGPT (67) and Perplexity (67) are gated by the same off-page/entity gaps as Brand Authority; Bing Copilot (59) by the missing Webmaster/IndexNow verification. The cross-platform through-line is identical to this report's: **answer-first blocks + a real entity graph** move every engine at once.

---

## Quick Wins (Implement This Week)

1. **Answer-first lead paragraphs** under each `/wissen` H1 and each `/faqs` question — 40–60 words, using **already-published or insurer-approved wording** (owner sign-off required on any cover/claims phrasing, per CLAUDE.md §4). Highest single lever; converts existing rankings into extracted snippets. *(Impact: Citability, AIO, ChatGPT, Perplexity)*
2. **Add the two comparison tables** (Hausrat vs. Instrument; Zeitwert vs. Neuwert) from facts already on those pages. *(Impact: Citability)*
3. **Enable Bing Webmaster Tools + IndexNow** on Cloudflare. Low effort, native support. *(Impact: Bing Copilot)*
4. **Add visible "Zuletzt aktualisiert" dates** to the knowledge articles (only where content was genuinely reviewed — never auto-bump). *(Impact: Perplexity, ChatGPT freshness)*
5. **Expand `sameAs`** to every profile that genuinely exists and confirm ownership of the Facebook page; link real profiles from the footer. Invent nothing. *(Impact: all engines' entity resolution)*

## 30-Day Action Plan

### Week 1 — On-page citability (in-repo, highest leverage)
- [ ] Rewrite the lead paragraph of all 11 `/wissen` articles to answer-first (approved wording; owner sign-off on cover claims).
- [ ] Convert buried sub-answers into question-shaped H2s on the cost, coverage, and comparison articles.
- [ ] Add the Hausrat-vs-Instrument and Zeitwert-vs-Neuwert `<table>`s.

### Week 2 — Entity graph & indexing
- [ ] Enable Bing Webmaster Tools + IndexNow via Cloudflare.
- [ ] Expand and verify `sameAs`; confirm the Facebook page; add any real LinkedIn/YouTube.
- [ ] Draft a **Wikidata** item for the agency (factual, sourced to the imprint). *Note: a full Wikipedia article is unlikely to survive notability review for a small § 34d intermediary — Wikidata is the realistic anchor; do not chase Wikipedia.*

### Week 3 — Independent trust & NAP
- [ ] Claim/verify a Google Business Profile with **imprint-exact** NAP; resolve the Barsinghausen/Soltau split first (owner decision).
- [ ] Stand up an independent review profile (Google/ProvenExpert/Trustpilot) so the review signal becomes third-party-checkable; reference via `sameAs`.

### Week 4 — Corroboration & measurement
- [ ] Begin disclosed, genuinely-helpful participation in German musician communities and comparison portals (non-spam; note the historic antispam complaint on record).
- [ ] Stand up the AEO measurement harness from `wiki/aeo-rules.md` §11: a fixed German prompt set run monthly across ChatGPT/AIO/Perplexity/Gemini/Copilot, logged to `wiki/log.md`.

---

## Appendix: Pages Analyzed

| URL | Title (chars) | GEO notes |
|---|---|---|
| `/` | Instrumentenversicherung ohne Selbstbeteiligung … (70) | Full connected graph in raw HTML; rating 1089/4.97 matches visible; title >60; `IM SOUND` spelling split |
| `/wissen/was-kostet-eine-instrumentenversicherung` | (41) | Article+Breadcrumb schema OK; **wind-up intro, no question H2s, no table** |
| `/faqs` | (56) | `FAQPage` microdata, 14 Q&A in raw HTML; answers run long |
| `/wissen` | (59) | Hub with `CollectionPage` + `ItemList` from own markup |
| `/anfrage` | (38) | 200; conversion path intact; DE-residence online gate |
| `/schaden-melden` | (38) | 200; conversion path intact |
| `/kontakt` | (42) | 200 |
| `/reviews` | (51) | Product schema without offers (correct — no price shown) |
| `/lp/sinfonima` | (62) | Title >60; offers emitted (price shown) |
| `/lp/berufsmusiker` | (54) | Cross-canonical to `/lp/sinfonima` (correct) |

*Full source review also covered the remaining 8 `/wissen` spokes and the legal pages; the cost article was sampled in depth as representative of the corpus.*

---

*Generated by the geo-audit skill. Findings verified against served HTML and the project wiki; no business facts were invented (CLAUDE.md §4). Owner decisions are flagged inline and mirrored to the wiki.*
</content>
</invoke>
