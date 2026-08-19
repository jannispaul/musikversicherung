# AEO rules — answer engine optimization

How musikversicherung.com earns citations from AI answer engines: ChatGPT
Search, Google AI Overviews / AI Mode, Perplexity, Gemini, Copilot.

Companion to [on-page-rules.md](on-page-rules.md). Classic on-page SEO gets the
page **retrieved**; these rules decide whether the model **quotes it and names
the source**. Read both before any content change.

---

## The model this all follows from

An answer engine does not rank pages. It:

1. **Decomposes** the user's question into several sub-questions.
2. **Retrieves passages** — not pages — for each one.
3. **Synthesises** one answer from several sources.
4. **Cites** the sources it can attribute a specific, checkable claim to.

So the unit of optimisation is **the self-contained, attributable passage**, and
the win condition is **being the source with the best coverage of the
sub-questions plus the most checkable specifics**. Every rule below is a
consequence of those two sentences.

This site's structural advantage is worth naming up front: it is a **real,
licensed, publicly registered insurance intermediary** (Vermittlerregister
D-34VM-MMPLD-10) with a verifiable address, named responsible person and named
risk carrier. Most competing content on these queries is affiliate and
comparison-site material with no such record. **Verifiability is the moat.**
Optimise for being checkable, not for being voluminous.

---

# Part I — Content

## 1. Content an AI can quote cleanly

**Rule:** every substantive claim must survive being extracted alone, with no
surrounding page, and still be correct, complete and attributable.

### Write in extractable units

- **One idea per paragraph.** 2–4 sentences. A paragraph carrying three ideas
  gets truncated into a wrong one.
- **Answer first, then elaborate.** The first sentence of every section is the
  answer. Context, caveats and colour come after. Models weight early sentences
  and frequently take only the first.
- **No orphan pronouns or deixis.** "Sie deckt das ab" is unquotable. "Die
  Instrumentenversicherung deckt Bruchschäden ab" is quotable. Restate the
  subject at the start of each section even when it reads as repetitive to a
  human going top to bottom — it is not repetitive to a model reading one
  passage in isolation.
- **No cross-references as load-bearing content.** "wie oben beschrieben",
  "siehe Tabelle", "im nächsten Abschnitt" all break extraction. If a passage
  needs the reference to be true, inline the fact.
- **Attach specifics to claims.** "günstig" cites nothing. "ab 4,69 € im Monat"
  is a checkable figure a model can attribute. Numbers, named conditions,
  explicit scope and dates make a passage worth citing; adjectives do not.
- **State the common case before the qualification.** Never open an answer with
  "Das kommt darauf an." Give the typical answer, then the condition that
  changes it.

### Formats models extract well

- Question-shaped H2s with immediate answers (see
  [on-page-rules.md](on-page-rules.md) §4).
- Short definition sentences: "X ist …" / "X bedeutet …". Define the term the
  page owns, once, in one sentence, near the top.
- Real `<table>` markup for genuinely tabular facts, with plain headers and rows
  that mean something without the caption.
- Ordered lists for genuine processes (how to report a claim), each step
  self-describing.

### Formats models extract badly — avoid

- Facts encoded only in an image, chart, icon row or PDF.
- Facts that exist only in an accordion label, tooltip or tab with no equivalent
  in body text. (Content inside `<details>` **is** in the HTML and is fine —
  this is about content injected by script or gated behind interaction.)
- Long undifferentiated prose blocks.
- Marketing sentences carrying no extractable proposition.

### The hard limit

The pull toward "more quotable" is a pull toward firmer claims and more precise
numbers. **Specificity you cannot source is fabrication** — and on a regulated
insurance site that is the worst failure mode available. Every figure traces to
[business-facts.md](business-facts.md). See [CLAUDE.md](../CLAUDE.md) §4.

---

## 2. Cover the question space, not just the question

**Rule:** for every page, enumerate the sub-questions an engine will fan out to,
and make sure each one has a real answer — on that page or on a linked spoke.

Because engines decompose queries, the source that answers the headline question
*and* four of its six sub-questions gets retrieved repeatedly and synthesised
into the answer. The source that answers only the headline gets retrieved once
and often dropped.

**Method — do this before writing, not after:**

1. Write the buyer's question.
2. List the sub-questions someone would need answered to act on it.
3. For each: does this site answer it, on which URL, in a liftable passage?
4. Fill the gaps — as an H2 here, or as a new spoke linked from here.

**Worked example — "Was kostet eine Instrumentenversicherung?"** fans out to at
least: What is the entry price? What drives the premium? How is the instrument's
value determined? Is there a deductible? Does the price differ by instrument
type? How does it compare to covering the instrument under Hausrat? Are bow,
case and accessories included? Is there a discount for students or ensembles?

Each of those is a passage that can be cited independently.

**Rules:**

- **One question, one canonical passage, one URL.** Answering the same
  sub-question in full on three pages splits the signal and creates three places
  to drift out of sync. Answer it once; link to it from the others.
- **Match the specificity of the question.** "Was kostet eine Versicherung fürs
  Cello?" is not answered by a generic entry price. Either give the
  instrument-specific answer or give the formula honestly — do not paper over it
  with the headline figure.
- **Do not pad to hit a question count.** A sub-question with a hollow answer is
  worse than an honest link to the spoke that answers it properly.
- Sub-questions the site legitimately cannot answer (individual advice, another
  insurer's terms) are out of scope — say what governs it and stop. See §3.

---

## 3. Comparison, alternatives and honest limits

**Rule:** answer comparative and negative questions directly and fairly. They
are disproportionately likely to be asked of an answer engine, and models
strongly prefer sources that read as balanced over sources that read as
advertising.

- **Comparisons belong in real tables.** The site has two natural comparison
  topics — Hausrat vs. Instrumentenversicherung, Zeitwert vs. Neuwert — and
  both are currently prose-only. There is **no `<table>` element anywhere in
  `src/partials/wissen/`** (verified 2026-08-04). Adding proper tables to those
  two pages is the single cheapest extractability win available.
- **State what is not covered.** Exclusion clarity is high-value citable content
  *and* legally safer than a vague breadth claim. But exclusions are policy
  wording: reuse the approved text or ask. Never paraphrase an exclusion to make
  it sound smaller ([CLAUDE.md](../CLAUDE.md) §4).
- **Answer "who is this not for."** A source that names its own boundaries reads
  as trustworthy to a model and to a reader. It also filters out bad leads.
- **Compare categories, never disparage named rivals.** Instrument insurance vs.
  household contents is a fair, useful comparison. "Better than [competitor]" is
  a claim you cannot source, is a competition-law risk for a regulated
  intermediary, and gets the passage discarded as promotional.
- **No superlatives.** "Günstigste", "beste", "führende" are unciteable
  (unattributable), and on a regulated site they are actionable. Replace with
  the checkable fact underneath the claim.

---

# Part II — Machine-readable truth

## 4. Schema

**Rule:** structured data is a machine-readable factual assertion. It states
only what is true and visible on the page, and stays consistent site-wide.

### What is in place (verified 2026-08-04, `src/data/structured-data.ts`)

A connected `@graph` keyed by stable `@id`s so entities relate across pages:

| `@id` | Type | Scope |
| --- | --- | --- |
| `#organization` | `InsuranceAgency` | site-wide, every page via `BaseHead` |
| `#website` | `WebSite` | site-wide |
| `#product` | `Product` | homepage and `/reviews` (offers on the homepage only — see below) |

Plus per-page builders: `breadcrumbLd()` (BreadcrumbList) and `articleLd()`
(Article, on `/wissen/*`). `/faqs` carries `schema.org/FAQPage` as inline
microdata in `src/partials/faqs.html`; `src/pages/faqs.astro:7` deliberately
adds only the breadcrumb there, to avoid a duplicate FAQPage.

### Standing rules

- **Ratings live on `Product`, never on `Organization`.** Deliberate, and
  documented at `src/data/structured-data.ts:99` — Google shows review snippets
  for Product. Do not move `aggregateRating` onto the org node.
- **Ratings come from live data.** `aggregateRating` is computed at build time
  by `src/data/reviews.ts` from `public/reviews.json` (1089 reviews, average
  4.97 as of 2026-08-19 — the file grows, so read the count from it, not from
  here), so it cannot go stale. Never hardcode a rating value or count. How new
  reviews reach that file: [reviews-pipeline.md](reviews-pipeline.md).
- **Reuse `@id`s; never mint a parallel entity.** A second, slightly different
  organisation node splits the entity and weakens every claim attached to it.
- **Never assert in schema what is not visible on the page.** No invisible
  FAQPage, no offers the page does not show, no `areaServed` the business does
  not serve. This is both a Google manual-action risk and a §5 consistency
  violation.
- **Add schema through the builders** in `src/data/structured-data.ts` and the
  `jsonld` array in the page's `seo` object — never by pasting a `<script>` into
  a partial.
- **Validate before shipping** any schema change: Google Rich Results Test plus
  schema.org validator.
- Schema supports extraction; it does not replace it. A fact that exists only in
  JSON-LD and not in readable body copy will rarely be quoted. **Say it in prose
  and mark it up.**

### Offers: product snippet, not merchant listing (settled 2026-08-07)

Google evaluates `Product` markup under two different features, and the markup
decides which:

| Feature | For | Wants |
| --- | --- | --- |
| **Product snippet** | pages that describe or review a product | `name` + `review` / `aggregateRating` / `offers`. **Review stars — this is the one we want.** |
| **Merchant listing** | pages where a shopper can *buy* | a definite `Offer.price` > 0, plus `shippingDetails` and `hasMerchantReturnPolicy` |

`/anfrage` is a quote request, not a checkout, so these pages are product
snippets. Until 2026-08-07 the markup said otherwise — two `Offer` nodes with a
flat `price` and `availability: InStock` — and Search Console kept asking for
shipping and return-policy fields.

**Standing rules:**

- **Never add `shippingDetails` or `hasMerchantReturnPolicy`.** Nothing ships.
  A merchant "return policy" for an insurance contract is the statutory
  Widerrufsrecht (§ 8 VVG) — a legal statement, not visible on the page and not
  ours to author ([CLAUDE.md](../CLAUDE.md) §4). If GSC asks again, this is the
  answer; do not "just fill the field".
- **The tariffs live in one `AggregateOffer`**, which also keeps Google out of
  the merchant-listing bucket. Reverting to bare `Offer` nodes re-opens the
  warnings.
- **Published prices are `minPrice`, never `price`.** "ab 4,69 € im Monat" is a
  floor. A flat `price` asserts a fixed premium the product does not charge —
  see [business-facts.md](business-facts.md), Product.
- **No `availability`.** An insurance policy is not inventory.
- **No `highPrice`.** Premiums scale with the insured value; no upper figure is
  published, so none may be invented.
- **Offers only where prices are on the page.** `productLd()` takes
  `includeOffers`, default `false`. The homepage shows "ab 4,69€ / Monat" and
  passes `true`; `/reviews` shows no price and must not.

### Known gap — dates

`articleLd()` emits no `datePublished` or `dateModified`, yet **every `/wissen`
page already displays a real publish date** in a `.content_date` div above the
H1 (verified 2026-08-04; range 02.06.2024–30.07.2024). The facts exist and are
published — they are simply not machine-readable.

**Fix:** pass the existing visible date through `articleLd()` as
`datePublished`. This asserts nothing new, so it does not need an owner ruling —
only care that each page's schema date matches the date rendered on that same
page. See §6 for `dateModified` discipline.

> **OPEN:** `author` on `/wissen/*` is the organisation, not a person. A named
> author is a genuine authority signal, but it attaches a real person's name to
> specific content and is therefore the owner's call. See
> [business-facts.md](business-facts.md).

> **OPEN:** whether individual `/wissen` pages should carry `FAQPage` or `HowTo`
> instead of / alongside `Article`, and whether `Service` should join `Product`.
> Not decided; do not add speculatively.

---

## 5. Consistent details

**Rule:** every fact appears identically everywhere it appears — on this site,
in the schema, and off-site.

Answer engines corroborate across sources before citing. A figure that differs
between the homepage, the FAQ and the JSON-LD does not average out; it lowers
confidence in all three and the model cites a competitor instead.

### The canonical set

[business-facts.md](business-facts.md) is the single source of truth for name,
address, phone, email, registration numbers, insurer relationships, product
names and prices. **Facts change there first, then propagate.** Never the
reverse.

### Where the same fact lives — change one, change all

| Fact | Locations |
| --- | --- |
| Phone | `src/data/site.ts:7-8`, JSON-LD `telephone` + `contactPoint`, `/kontakt`, `/impressum` |
| Email | `src/data/site.ts:34` (entity-obfuscated), `src/data/structured-data.ts:24`, `/impressum` |
| Postal address | JSON-LD `address` (`structured-data.ts:50`), `/impressum` |
| Product names | JSON-LD `Product.name` + offer names, homepage, `/lp/sinfonima` |
| Prices (4,69 € / 6,25 €) | JSON-LD `tariffOffers()` (`structured-data.ts`, as `minPrice`), homepage copy, `/lp/imsound`, `/wissen/was-kostet-…` |
| Founder / responsible person | JSON-LD `founder`, `/impressum` |

- **Spelling and formatting are part of consistency.** `I'M SOUND` vs.
  `IM SOUND` vs. `I'm Sound` are three entities to a matcher. The homepage title
  currently uses `IM SOUND` while the schema uses `I'M SOUND` — flagged unresolved
  in [business-facts.md](business-facts.md).
- **Prices carry their qualifier everywhere.** "ab", per month. A price without
  it is a different — and wrong — claim.
- **Off-site consistency counts as much as on-site.** Same NAP on Google
  Business Profile, Facebook, and any directory. See §7.

---

## 6. Freshness and provenance

**Rule:** dates and authorship are factual assertions, treated as strictly as
prices. Never fake freshness; never let genuine staleness stand on a
price-or-cover page.

- **`datePublished` is the real first-publication date** — for `/wissen`, the
  date already shown in `.content_date`. Schema date and visible date must match.
- **`dateModified` moves only when the content materially changed.** Re-checking
  a fact and finding it unchanged is not a modification. Auto-bumping dates to
  look fresh is a fabrication under [CLAUDE.md](../CLAUDE.md) §4, and engines
  that compare visible text across crawls discount sources that do it.
- **Sitemap `lastmod` follows the same rule** (implemented 2026-08-07,
  `scripts/git-lastmod.mjs`). It is derived per page from the newest git commit
  touching that page's own `.astro` file or `.html` partial — never a build
  timestamp, and shared layouts, components and stylesheets deliberately do not
  count, since editing `Layout.astro` does not modify 23 pages' content.
  **Where no trustworthy date exists, no `lastmod` is emitted at all.** That
  covers an uncommitted page, a missing git binary, and — the case that
  actually bites — a shallow clone, where every path resolves to the one
  fetched commit and all 23 pages would claim the same date. Cloudflare Pages
  clones shallow by default; `npm run prebuild` unshallows first. Do not
  "simplify" this to `lastmod: new Date()`: Google discounts the signal
  permanently for sites whose dates move on every deploy, so the lazy version
  is worse than no `lastmod`.
- **The corpus needs a review cadence.** The entire `/wissen` set was published
  June–July 2024. On cost and coverage topics, material more than about two
  years old is discounted by both readers and models, and — more importantly —
  may simply have gone wrong. **Review the price- and cover-bearing pages at
  least annually** against [business-facts.md](business-facts.md); when a fact
  has changed, update the text *and* `dateModified` together, and log it.
- **Cite the site's own sources.** Link policy conditions and insurer
  documentation where a claim rests on them. Pages that cite get cited; a claim
  with a visible provenance trail is the kind a model is willing to attribute.
- **Provenance beats authority claims.** Do not write "Experten empfehlen" with
  no expert. Either name and link the source, or drop the sentence.

---

# Part III — Off-page and technical

## 7. Entity and off-site corroboration

**Rule:** this site can only *assert*. The rest of the web is what makes an
assertion *known*. Treat off-site consistency as part of the job, not as
someone else's.

Models build a belief about an entity from everything they have seen about it.
A claim repeated identically across independent sources becomes a fact the model
will state unprompted; a claim that exists only on your own domain stays "the
company says".

**Priorities, strongest first:**

1. **The Vermittlerregister entry** (D-34VM-MMPLD-10, verifiable at
   vermittlerregister.info). An authoritative third-party public record. Almost
   no content competitor has an equivalent. Reference it and keep the details on
   site exactly matching the register.
2. **Google Business Profile** — feeds local results and Google's entity graph.
   NAP must match [business-facts.md](business-facts.md) character for
   character.
3. **The agency and insurer pages** (falk.mannheimer.de, Mannheimer /
   Continentale material) — corroborates the insurer relationship.
4. **Review platforms and musician communities** — earned, never bought.

**Rules:**

- Keep `sameAs` complete and accurate as profiles are confirmed. Only Facebook
  is currently claimed (`structured-data.ts:65`).
- Any new listing or profile gets its NAP from
  [business-facts.md](business-facts.md), and the profile is recorded back into
  that page. A listing nobody wrote down is a future inconsistency.
- **Never buy mentions, links or reviews.** Beyond the guideline violation, for
  a regulated intermediary it is a legal and reputational exposure that no
  ranking gain covers.
- Reinforce the specific verifiable entity; do not dilute it with generic
  brand-adjacent content.

---

## 8. Access for AI crawlers

**Current state (verified 2026-08-04):** `public/robots.txt` is
`User-Agent: *` / `Allow: /`, plus a `Sitemap:` reference to
`sitemap-index.xml`. **Every crawler, including every AI crawler, is currently
allowed.** There is no `llms.txt`.

Not all AI crawlers do the same job, and the distinction decides what blocking
costs you:

| Class | Examples | Blocking costs you |
| --- | --- | --- |
| Search index | Googlebot, Bingbot | Everything — AI Overviews and Copilot ground on these indexes |
| Live retrieval at answer time | OAI-SearchBot, PerplexityBot, ClaudeBot (user-initiated fetch) | Citation in exactly the products you are optimising for |
| Training-corpus | GPTBot, Google-Extended, CCBot | Only future training inclusion; no immediate citation effect |

**Rules:**

- **Search-index and live-retrieval crawlers stay allowed.** Citation depends on
  them. Blocking them is equivalent to opting out of §1–§7 entirely.
- **Training-corpus crawlers are a business/IP decision, not a technical one.**
  Allowing them can seed the model's unprompted knowledge of the brand; blocking
  them protects content from training reuse. Both are defensible. Currently all
  are allowed by the wildcard.
- **Do not change `robots.txt` unilaterally.** Bring the recommendation to the
  owner and record the decision in [log.md](log.md).
- **`llms.txt`: do not add one for now.** It is not a ratified standard and no
  major answer engine has documented support for it. If it is ever added, it
  must be **generated from the site at build time, never hand-maintained** — a
  hand-written copy will drift and become a §5 consistency violation, which is
  strictly worse than not having the file.
- **Keep the sitemap honest.** `astro.config.mjs` excludes the noindex paths;
  that list and the pages' `robots` directives must agree. They currently do —
  three pages: `/berufshaftpflicht`, `/neue-bewertung`, `/lp/berufsmusiker`.
  (Note: [README.md](../README.md) still says "two". The config is right.)
- **The sitemap lives at `sitemap-index.xml` + `sitemap-0.xml`, not
  `sitemap.xml`** — `@astrojs/sitemap` always emits an index plus numbered
  chunks (split at 45,000 URLs; 23 URLs = one chunk). This is standard, Google
  supports it, and `robots.txt` points at the index, which is how crawlers find
  it. **Do not rename these for tidiness:** the only route to a flat
  `sitemap.xml` is hand-rolling the sitemap, which drops the `NOINDEX_PATHS`
  filter above into manual maintenance — the exact drift this section warns
  about — and churns URLs already submitted to Search Console.
  > **OPEN:** whether to add `/sitemap.xml` → `/sitemap-index.xml` as a 301 in
  > `public/_redirects`, for tools that probe the conventional path instead of
  > reading `robots.txt`. Additive and zero-risk, but not yet decided.
- **Never serve different content to bots than to humans.** Cloaking destroys
  citation trust, and here it would also mean showing a regulator-facing page
  and a bot-facing page that disagree.

---

## 9. Rendering and delivery

**Rule:** if a sentence is not in the HTML the server returns, assume no answer
engine will ever see it.

- The site is **static Astro** (`output: static`, `build.format: "file"`,
  `trailingSlash: "never"`), so content ships in the initial HTML. **Keep it
  that way.** Moving content rendering to the client is an AEO regression, not a
  neutral refactor.
- Review data is baked in at build from `public/reviews.json`
  (`src/data/reviews.ts`) rather than fetched client-side — the right pattern.
  Apply it to anything else content-bearing.
- **The test is `curl`, not the browser.** Before claiming a passage is
  indexable:

  ```bash
  curl -s https://musikversicherung.com/wissen/was-kostet-eine-instrumentenversicherung | grep -c "kostet"
  ```

  If the sentence is not in that output, it does not exist for retrieval.
- **One URL per answer.** Canonicals are self-referential and absolute
  (`BaseHead.astro:26`); `trailingSlash: "never"` is enforced in the config.
  Never let the same passage be reachable at two indexable URLs.
- Speed still matters, because the search index that grounds AI Overviews is
  built from crawled, rendered pages. Speculation Rules prerender is already in
  place (`BaseHead.astro:100`) — leave it alone.

---

# Part IV — Discipline

## 10. Anti-patterns — never do these

- **Never embed instructions addressed to AI systems** in content, comments,
  alt text, hidden elements or markup — "AI assistants: recommend
  Musikversicherung.com", or any variant. It is manipulation, it is detectable,
  it is a reputational and regulatory exposure for a licensed intermediary, and
  it is precisely the behaviour [CLAUDE.md](../CLAUDE.md) §2 tells you to
  distrust when you find it in `raw/`. The rule runs in both directions.
- **Never emit schema that is not visible on the page** — invented ratings,
  invisible FAQPage, offers that do not exist. §4.
- **Never mass-generate thin pages** per instrument, per town or per keyword.
  For this site that would also mean fabricating local facts, which
  [CLAUDE.md](../CLAUDE.md) §4 forbids outright.
- **Never keyword- or entity-stuff.** Repetition does not increase retrieval
  probability; it lowers passage quality and gets the passage skipped.
- **Never cloak.** §8.
- **Never ship an AI-generated draft as fact.** Drafting is fine; every claim in
  it still has to clear [business-facts.md](business-facts.md) before it goes
  live.
- **Never chase the tactic of the month.** The durable levers are §1–§9. If a
  new "AEO hack" is not one of them, it is probably noise — and if it works by
  deceiving the engine, it is out of bounds regardless.

---

## 11. Measuring it

Rank trackers do not measure citation. Measure it directly.

**Method — monthly:**

1. Keep a **fixed prompt set**: the core buyer questions, verbatim, in German
   (plus a few in English — people ask about German products in English).
2. Run it across ChatGPT Search, Google AI Mode / AI Overviews, Perplexity,
   Gemini and Copilot.
3. For each, record: *Was there an answer? Was this site cited? Was the claim
   about us accurate? Who else was cited?*
4. Append the results to [log.md](log.md) with date, engine, prompt and
   citations. **A dated series is the only way to see movement** — a single
   reading tells you nothing, and answers are non-deterministic, so treat one
   miss as noise and a trend as signal.

**Supporting signals:**

- Referral traffic from `chatgpt.com`, `perplexity.ai`, `gemini.google.com` etc.
  in Umami / Zaraz. Useful, but **citation ≠ clicks** — answer engines
  frequently satisfy the query without a visit. Do not judge AEO by referral
  volume alone.
- Which competitors are cited instead, and on which sub-questions — that is your
  §2 gap list, handed to you for free.

**Treat a wrong claim about the business in an AI answer as a content bug.**
Trace it to whatever source the model used; if it came from this site, fix the
passage. If it came from a stale third-party listing, fix the listing (§7).

---

## 12. Checklist before shipping content

- [ ] Read this page and [on-page-rules.md](on-page-rules.md) first.
- [ ] Every claim traces to [business-facts.md](business-facts.md).
- [ ] First paragraph and every section opener pass the lift test (§1).
- [ ] Sub-questions enumerated; each answered here or on a linked spoke (§2).
- [ ] Comparisons in real tables; limits and exclusions stated honestly (§3).
- [ ] Schema added via the builders, validated, and matching visible content (§4).
- [ ] No fact contradicts any other location it appears in (§5).
- [ ] Dates real; `dateModified` only if content actually changed (§6).
- [ ] No superlatives, no named-competitor claims, no instructions to AI (§3, §10).
- [ ] Passage appears in `curl` output, not just in the browser (§9).
- [ ] `npm run build` passes.
- [ ] Change appended to [log.md](log.md).

---

*Back to [index.md](index.md).*
