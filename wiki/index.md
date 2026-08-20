# Wiki index

The project's durable memory for musikversicherung.com. Settled conclusions
only — chat is not memory.

**Read this page first, before any build task.** See [CLAUDE.md](../CLAUDE.md)
§3 for the required order.

---

## Pages

| Page | What it settles | Read before |
| --- | --- | --- |
| [on-page-rules.md](on-page-rules.md) | Liftable first paragraphs, one H1, sub-60-char titles, buyer-question H2s, hub-and-spoke linking with descriptive anchors. Includes the current title-length audit. | Any content, markup or metadata change |
| [aeo-rules.md](aeo-rules.md) | Answer-engine optimization, in four parts: **content** (quotable passages, covering the sub-question space, honest comparisons), **machine-readable truth** (schema, detail consistency, dates and provenance), **off-page and technical** (entity corroboration, AI-crawler access, rendering), **discipline** (anti-patterns, measurement). | Any content or structured-data change |
| [business-facts.md](business-facts.md) | The verified fact register — identity, insurers, product, prices, the town. Plus known inconsistencies and open questions. | Any change asserting a fact about the business, product or Barsinghausen |
| [competitors.md](competitors.md) | Who ranks for the core queries and how their sites are built. Central finding: one Rendsburg agency runs ~8 exact-match domains selling the same products. Common winner patterns; our gap list. | Any content-strategy, IA or new-page decision |
| [reviews-pipeline.md](reviews-pipeline.md) | How a review travels from `/neue-bewertung` through the `automations` Worker into `public/reviews.json` and onto the page. Includes the 2026-08 outage (Worker writing the pre-migration path), what fixed it, and why a notification mail is not proof a review landed. | Any work on reviews, the review count/average, or the review schema |
| [broken-assets.md](broken-assets.md) | Assets the site references but does not have. The two `/faqs` Auslandsreisen PDFs — deleted by an automated Webflow re-export in 2025, 404 for a year, recovered from git history — and `mv-logo.jpg`, still open. Includes the audit command and the shallow-clone trap that hides history. | Any asset move, or before calling an asset-touching change done |
| [keywords.md](keywords.md) | Target-query register per URL (assumed, pending GSC data) plus the two free routes to Search Console data. | Any new page or title/H1 change |
| [recon-report.md](recon-report.md) | Readable recon summary: comparison table, common patterns, and the phased ranking plan with owner-decision markers. | Planning or prioritising ranking work |
| [log.md](log.md) | Dated record of every wiki change. | — (append to it on every change) |

## How the pages relate

```
index.md
  ├── on-page-rules.md ──┐
  │                      ├── both defer to business-facts.md for every claim
  ├── aeo-rules.md ──────┘
  │
  └── log.md   (append-only history of all of the above)
```

`on-page-rules.md` and `aeo-rules.md` are companions and are written to agree:
on-page gets the passage retrieved, AEO gets it quoted and attributed. Where a
rule appears in both, the wording matches deliberately — change both together.

`business-facts.md` is the terminal authority for content. Neither rules page
may assert a business fact of its own.

## Not in the wiki

- **Build, hosting, deployment, project structure** → [README.md](../README.md).
  The site is Astro, static, built by Cloudflare Pages from `master`.
- **Form flows and tracking setup** → `docs/anfrage-flows.md`,
  `docs/tracking-setup.md`.
- **The owner's raw source material** → `raw/`. Read-only; see
  [CLAUDE.md](../CLAUDE.md) §2.

## Maintaining this index

Adding, renaming or retiring a wiki page means updating this table **in the same
change**, plus a line in [log.md](log.md). A page not listed here is invisible;
a page no other page links to is a bug.

## Gaps — pages that do not exist yet

Named here so they are not forgotten. File them as the work happens, per
[CLAUDE.md](../CLAUDE.md) §3.

- **`content-inventory.md`** — every URL, its cluster role, its target query,
  its status.
- **`decisions.md`** — owner rulings and rejected options with reasoning, if
  they outgrow the individual rules pages.

(`keywords.md` and `competitors.md` were filed 2026-08-04.)

> **OPEN:** the owner's original seeding brief was truncated after
> `aeo-rules.md`. The AEO page itself is settled — the owner directed
> "fill in based on best practice" on 2026-08-04, so it is no longer
> provisional. Still unconfirmed: whether further starter pages were intended
> beyond the two named.
