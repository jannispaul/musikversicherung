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

## 2026-09-08 — `/lp/imsound` reviews regression + footer cookie-link underline

**Changed:** [reviews-pipeline.md](reviews-pipeline.md) — corrected the Render
step (there are three `/lp` pages, not "both"; wording now "must go through")
and added a `> **Regression, fixed 2026-09-08**` note documenting that
`/lp/imsound` was rendering its partial with a raw `<Fragment>` instead of the
shared `<Reviews>` component, shipping the empty-card-list + frozen `4,96 / 1058`
placeholder the component exists to prevent.

**Why:** owner reported the reviews component broken on `/lp/imsound` and the
footer "Cookie-Einstellungen" link missing its underline. Fixes:
`src/pages/lp/imsound.astro` now uses `<Reviews html={mainHtml} limit={15} />`
(verified live: 4,97 / 1089, 15 real cards); `.footer_cookie-settings` in
`src/styles/global.css` got `text-decoration: underline` so the `<button>`
matches the anchor `.footer_link` items (the underline comes from the base
`a{…text-decoration:underline}` rule in `webflow.css`, which a `<button>` never
inherited).

**Source:** owner, 2026-09-08; code (`src/pages/lp/imsound.astro`,
`src/components/Reviews.astro`, `src/styles/global.css:488`,
`src/styles/webflow.css`), verified in the local dev preview.

## 2026-09-05 — `/wissen` content pass shipped to production (owner sign-off)

**Changed:** owner reviewed the pass in dev mode and signed off; branch
`agent/wissen-article-structure-c37d83` fast-forward-merged into `master`
(`d85926d..33b563e`) and pushed to `origin/master`, which Cloudflare Workers
Builds deploys to production. Closes the handoff's gate (item 1).

Shipped in this deploy: the AEO content pass on all 11 `/wissen` spokes
(answer-first leads, question H2s, "Das Wichtigste in Kürze" summary boxes, the
four comparison/price tables, the both-date footer line + `dateModified`), the
two "Marktführer" superlative removals, the new `noindex` `/lp/imsound` landing
page, and `d85926d` (schema entity corroboration + GEO-audit snapshot) which had
been sitting on local `master` unpushed.

**Why:** owner, 2026-09-05 — "checked and looks good. commit, merge and push."

**Source:** owner sign-off, 2026-09-05. Push was explicit (`git push origin
master:master`) because local `master` tracks `origin/staging` — a bare push
would miss production. Left as still-open work:
the annual fact re-verification against policy documents (no policy PDFs in
`raw/` yet); H1s/titles/slugs untouched by the pass.

## 2026-09-05 — `/lp/imsound` set to `noindex` (owner ruling: thin/duplicate content)

**Changed:** `/lp/imsound` (the new I'M SOUND landing page added on branch
`agent/wissen-article-structure-c37d83`) is now `robots: "noindex,follow"` with
its self-canonical kept, and added to `SITEMAP_EXCLUDE_PATHS` in
`astro.config.mjs`. Updated [aeo-rules.md](aeo-rules.md) §8 — the sitemap
exclusion list is now four paths (`/berufshaftpflicht`, `/neue-bewertung`,
`/lp/imsound` = `noindex`; `/lp/berufsmusiker` = `index,follow` cross-canonical).

**Why:** owner ruling — the page clones the `/lp/sinfonima` pattern and reuses
the same copy, so it would read as thin/duplicate content if indexed. Kept
`noindex,follow` (live + crawlable as a campaign/ad landing page, link equity
still flows) rather than cross-canonical: unlike `/lp/berufsmusiker` (the same
SINFONIMA product for a different audience), `/lp/imsound` is the I'M SOUND
*equipment* product — a different product — so cross-canonicalising it to
`/lp/sinfonima` would be a false signal. Self-canonical + noindex is the honest
combination.

**Source:** owner, 2026-09-05. Code: `src/pages/lp/imsound.astro`,
`astro.config.mjs`. Verified in built HTML this session (`<meta name="robots"
content="noindex,follow">` present; `/lp/imsound` absent from `sitemap-0.xml`).

## 2026-09-05 — Reconciled `agent/wissen-article-structure-c37d83` with `master`

**Changed:** merged `master` into the `/wissen` content-pass branch (worktree
`.claude/worktrees/wissen-article-structure-c37d83`) to de-risk the eventual
merge (handoff item 3). The branch was 3 ahead / 6 behind. Two conflicts, both
non-overlapping appends, resolved by keeping **both** sides:

- `src/styles/global.css` — the branch's rich-text `table` / `.wissen-summary` /
  `.content_meta` rules kept alongside master's `.sticky-cta` / `#CookiebotWidget`
  / `.footer_cookie-settings` rules (distinct selectors, no overlap).
- `wiki/log.md` — the branch's 2026-09-04 + three 2026-08-31 `/wissen` entries
  kept above master's two 2026-08-31 (schema corroboration, GEO audit) and four
  2026-08-27 entries. Same-day cross-branch order grouped by source; intra-day
  sequence across two branches is unknowable, so grouping is the honest call.

`wiki/aeo-rules.md`, `wiki/business-facts.md` and `wiki/index.md` auto-merged
cleanly — verified the result is a union (master's GEO-audit page row, entity-
corroboration text and the branch's 2026-09-04 date ruling all present; no master
content dropped, only branch supersessions of now-stale pre-branch statements).
`src/data/structured-data.ts` was **never touched on the branch**, so master's
register-`identifier` + insurer-`url` additions (commit `d85926d`) apply
wholesale — nothing to reconcile there, contrary to the handoff's caution.

**Why:** handoff item 3 — reconcile before the owner's read so the owner reviews
the real merged result and the branch→master merge is clean. Done on the feature
branch only; nothing pushed; reversible (`git reset --hard 21fffda`).

**Source:** `git merge master` in the worktree; `npm run build` green; served-HTML
checks in `dist/` this session — summary box on all 11 spokes, price/comparison
tables, both-date footer line, schema `dateModified: 2026-09-04`, plus master's
sticky-CTA and schema `identifier` D-34VM-MMPLD-10 all present; superlative sweep
(`marktführer|günstigste|führend|billigste`) clean.

## 2026-09-04 — Wissen: dates moved to a footer line (published + updated); `dateModified` set on all 11

**Changed (site, branch `agent/wissen-article-structure-c37d83`, NOT yet merged):**
resolves the date open point the earlier passes deferred (aeo §4/§6). Owner
ruling this session: show a *last-updated* date, keep the publish date, put both
at the bottom.

- **11 partials (`src/partials/wissen/*.html`):** removed the `.content_date`
  div (and its spacer) from above the H1; added a footer `.content_meta` line as
  the last child of the article body — *"Veröffentlicht am `<pub>` · zuletzt
  aktualisiert am 04.09.2026"*. The H1 now leads the header block.
- **11 pages (`src/pages/wissen/*.astro`):** every `articleLd()` now passes
  `dateModified: "2026-09-04"` alongside its existing `datePublished`. The two
  that already carried a 2024 `dateModified` (Klavier, was-deckt) were bumped to
  the rewrite date.
- **`src/styles/global.css`:** new `.text-rich-text .content_meta` rule
  (`margin-top: var(--space-large)`, `opacity: .7`); 14px via `text-size-small`.
- **[aeo-rules.md](aeo-rules.md) §4 (Dates) and §6:** updated to the new
  structure — date now in the footer `.content_meta` line, both dates visible,
  all 11 carrying an honest `dateModified`.

**Why:** a 2024 publish date greeting every reader above the H1 read as stale.
The last-updated date is honest *because* the 2026-08-31 pass materially rewrote
all eleven bodies (summary boxes, question H2s, tables) — a genuine modification,
not a fabricated freshness bump (§6, [CLAUDE.md](../CLAUDE.md) §4). Both dates are
visible, so both stay §4-safe in schema. Git history could not supply the date
(every partial's newest commit is the 2026-08-24 migration/pass, which would
overstate freshness), so the value is hardcoded and should track the merge date.

**Verified:** `npm run build` passes; shipped HTML carries the footer line and
`"datePublished":"2024-07-15","dateModified":"2026-09-04"` in the Article JSON-LD;
no `.content_date` remains; author `@id` still resolves. Browser preview
confirmed the line renders dim, aligned with body text, directly above the
"Über den Autor" box.

**Source:** owner rulings this session (2026-09-04): last-updated over move-only;
both dates shown; bottom placement. Publish dates are each article's existing
`.content_date` value (unchanged). No business facts invented.

## 2026-08-31 (3) — Wissen: "Das Wichtigste in Kürze" summary box on all 11 spokes

**Changed (site, branch `agent/wissen-article-structure-c37d83`, NOT yet merged):**
a summary box at the top of every `/wissen` article, owner-approved after a
cost-page prototype. New component `.wissen-summary` in `src/styles/global.css`;
it reuses the site's existing `gradient-border-light` card look, so it needs
only border-width/radius/padding + a small label style. Two variants:

- **Pattern A (framed lead)** — label + the article's existing answer-first
  first paragraph, wrapped in the box — on the six prose spokes (was-deckt,
  wie-funktioniert, warum-wichtig, sind-schaden, die-passende-police,
  tipps-zur-auswahl) and, with a purpose-written one-sentence summary, on the
  FAQ spoke.
- **Pattern B (key facts)** — label + a short answer + 2–3 bullets — on the
  three table spokes (Kosten, Hausrat, Zeitwert/Neuwert) and Klavier. The Kosten
  and Klavier boxes end with a jump link to the page's price table
  (`#beitragsbeispiele`, `#klavier-kosten`); the Hausrat and Zeitwert tables sit
  directly below the box, so no jump link.

All box copy is a verbatim reuse of the page's already-published answer/facts —
no new claims (§4). Every page keeps exactly one H1; the box is the first
element in the article body; `npm run build` passes.

**Label styling note:** the label first shipped as an uppercase, letter-spaced
"eyebrow" — but that treatment appears *nowhere else on the site* (the only
`text-transform: uppercase` / `letter-spacing` outside vendor `webflow.css`).
Per owner feedback it was changed to match the site's heading colour
(`var(--color-text)`, `#333`) at `text-size-small`, semibold — consistent with
the existing grey "Über den Autor" label idiom but with heading-level contrast
against the box's light fill.

**Why:** the audit's citability lever — make the answer-first lead visually
prominent and scannable while pointing readers deeper (the jump links), without
hiding the answer behind interaction (stays static HTML, extractable — aeo §1).

**Owner sign-off still needed before merge:** same standing §4 caveat as the
earlier two entries; this pass is presentation only and introduces no new facts.

**Responsive tables (same session):** on small screens a wide table's
min-content width pushed the whole page wider than the viewport. Each of the
four tables (Kosten, Klavier, Hausrat, Zeitwert/Neuwert) is now wrapped in a
`.table-scroll` div (`overflow-x: auto`, CSS in `src/styles/global.css`); the
table scrolls horizontally inside that box instead of blowing out the page.
Verified at 375px: page no longer overflows, table scrolls within its wrapper.
Follow-up (owner request): only the **scroll container** is full-bleed, not the
table itself. `.table-scroll` gets `margin-inline: calc(50% - 50vw)` (breaks the
box out to the viewport edges) *plus* `padding-inline: calc(50vw - 50%)` (the
column gutter, which pulls the table content back so it still starts aligned
with the article text). So the scroll region/scrollbar span edge-to-edge while
the table lines up with the body copy. To stop the `50vw` scrollbar-width
overshoot from re-creating page scroll, `.main-wrapper` carries
`overflow-x: clip` (leaves vertical flow untouched, creates no scroll
container). Verified at 1200px (container [0,1200], table [216,984] = aligned
with body text) and 375px (container [0,375], table starts at 20px = aligned,
scrolls internally); no page overflow at either.

---

## 2026-08-31 (2) — Wissen: answer-first pass on the remaining seven spokes

**Changed (wiki):**
- [recon-report.md](recon-report.md) "Explicitly rejected" — recorded that the
  rejected "Marktführer" superlative was found live on two `/wissen` pages and
  removed.

**Site changes (same session, branch `agent/wissen-article-structure-c37d83`,
NOT yet merged):** the seven `/wissen` spokes not covered by the first pass all
got answer-first leads and buyer-question H2s, reformatting already-published
prose only (no new facts, qualifiers preserved):

- `was-deckt-…`: lead lists the covered perils; the five noun H2s
  (Diebstahl/Beschädigung/…) became one question H2 + a `<ul>` of self-describing
  perils, keeping the "nicht bei allen Gesellschaften" Verlust qualifier.
- `wie-funktioniert-…`: definition moved into the lead; the five process steps
  became an `<ol>` (aeo §1 "ordered lists for genuine processes").
- `warum-…-wichtig`: answer-first lead; three benefit sections reframed as
  question H2s; heaviest marketing filler trimmed. Also fixed a duplicated-word
  heading in the reviews strip ("Mehr zu Mehr zur …" → "Mehr zur …").
- `sind-schaden-durch-familienangehorige-…`: the answer now leads; H2s made
  questions; **removed the "Marktführer" superlative**; fixed typo "defintiv".
- `die-haufigsten-fragen-…`: intro tightened; three descriptive internal links
  added to the canonical spokes (Kosten, Was deckt, Familienangehörige) per
  on-page §5.
- `die-passende-police-…`: answer-first lead naming the two products up front;
  noun H2s → questions; **removed the "Marktführer" superlative**.
- `tipps-zur-auswahl-…`: lead summarises the five checks; tip labels → question
  H2s; removed a dangling unlinked reference to a non-existent Auslandsreisen
  article.

Every H1, title, date, image and Article-schema `headline` left untouched, so
`articleLd()` stays consistent. Exactly one H1 per page; `npm run build` passes.

**Why:** the audit's citability lever — answer-first openings + question H2s
across the `/wissen` corpus. Completes the sweep the first pass began.

**Owner sign-off still needed before merge (CLAUDE.md §4):** same as the first
pass — reformatted regulated copy, no new claims, but worth a human read. The
two Marktführer removals in particular change a public claim (in the
liability-reducing direction, and toward settled wiki policy) and are recorded
in [recon-report.md](recon-report.md). Dates untouched (see the first entry).

**Source:** the seven partials' pre-edit prose; the rejected-superlatives policy
in [recon-report.md](recon-report.md) / [aeo-rules.md](aeo-rules.md) §3.

---

## 2026-08-31 — Wissen: answer-first leads + comparison/price tables (three spokes)

**Changed (wiki):**
- [aeo-rules.md](aeo-rules.md) §3 — retired the "no `<table>` anywhere in
  `src/partials/wissen/`" fact; the two comparison tables and the Kosten price
  table now exist, and the standing rule that table cells reuse already-published
  prose is spelled out.
- [recon-report.md](recon-report.md) Phase 1 item 5 — marked done 2026-08-31.

**Site changes (same session, branch `agent/wissen-article-structure-c37d83`,
NOT yet merged to master):**
- `/wissen/was-kostet-…`: answer-first lead (leads with "ab 4,69 € im Monat …
  bis 3.000 €", already published on the homepage and in this article's own
  price list), three question H2s, and the eight price examples converted from a
  `<p>` list into a real `<table>` (values verbatim). Sideways link added to the
  Zeitwert/Neuwert spoke.
- `/wissen/unterschiede-zwischen-hausrat--und-instrumentenversicherung`:
  answer-first lead + a 5-row Hausrat-vs-Instrumentenversicherung comparison
  `<table>`; noun-label H2s ("Hausratversicherung", "Instrumentenversicherung")
  replaced with buyer questions; existing bullet detail kept, reordered under the
  question H2s. Qualifiers ("in der Regel", "oftmals", "häufig") preserved.
- `/wissen/zeitwert-oder-neuwert-versichern`: answer-first lead + a
  Neuwert-vs-Zeitwert comparison `<table>`; the two noun H2s reworded to
  questions; a dangling reference to a non-existent "Unterversicherung" article
  removed. "immer zum Zeitwert" and the "40 %" example kept verbatim.
- `src/styles/global.css`: removed the dead `a:not(> *)` rule that was failing
  the production build (`npm run build`). Identical to the fix already on
  master — `:not(> *)` is invalid, every browser dropped it, lightningcss now
  errors instead of discarding it. No rendering change. The branch had reverted
  master's fix; this re-applies it.

**Why:** an audit found the /wissen articles weren't packaged for extraction —
no answer-first openings, no question H2s, zero comparison tables (the exact §3
gap). This pass fixes the three highest-leverage spokes.

**Owner sign-off still needed before merge (CLAUDE.md §4):** every figure and
cover statement is a verbatim / near-verbatim reuse of copy already on these
pages or the homepage, and no qualifier was softened or strengthened — but this
reframes a price page's opening and condenses category-comparison prose into
table cells, so it should be reviewed as regulated communication before it ships
to master. **Dates left untouched:** these bodies materially changed, so the
`dateModified` / visible-`.content_date` handling is a separate owner call — the
same open point the 2026-08-24 Klavier WIP flagged (`aeo-rules.md` §4, §6).

**Source:** the three partials' pre-edit prose; the homepage tier statement
([business-facts.md](business-facts.md), Product); master's global.css fix note
for the CSS change.

---

## 2026-08-31 — Off-domain entity corroboration in schema (register `identifier` + insurer `url`)

**Changed:** `src/data/structured-data.ts` — Person node gains an `identifier`
(`PropertyValue`, the DIHK-Vermittlerregister number `D-34VM-MMPLD-10`, `url` →
vermittlerregister.info); `Product.brand` gains `url` → `mannheimer.de`.
[business-facts.md](business-facts.md): two Identity rows added, an "External
corroboration" note, a Soltau/Gelbe-Seiten addendum, and the `sameAs` OPEN
rewritten (GBP ruled out, Wikidata declined). [aeo-rules.md](aeo-rules.md) §7
priority list updated to match. No new page → no [index.md](index.md) change.

**Why:** owner asked for off-domain authority moves that avoid a public-editable
Wikidata item and don't need a GBP (pure online business). Implemented the two
verifiable, self-hosted signals from the audit's Brand-Authority gap: the
official register number (aeo §7 #1) as machine-readable schema, and the insurer
brand disambiguated to its official domain. Both verified in the built HTML via
`grep`/JSON parse; `npm run build` passes.

**Source:** register number and insurer name from
[business-facts.md](business-facts.md) / `impressum.html` (nothing invented).
Wikidata items verified live 2026-08-31 (`Special:EntityData/*.json`): `Q1890715`
= *former* "Mannheimer Versicherungen" holding (Allianz SE 2002–03), `Q1128861`
= Continentale *health* insurer — both wrong entities for a `sameAs`, so declined
per §4 rather than wired. falk.mannheimer.de and the Gelbe Seiten Soltau listing
retrieved 2026-08-31 (data only). Owner rulings (GBP N/A; no Wikidata upkeep),
2026-08-31.

## 2026-08-31 — GEO audit run; recon snapshot filed

**Changed:** new page [geo-audit-2026-08.md](geo-audit-2026-08.md); linked from
[index.md](index.md). Client-facing `GEO-AUDIT-REPORT.md` written at repo root
(outside `wiki/`). No rules pages changed — the audit **confirmed** existing
rules rather than revising them.

**Why:** `/geo-audit` skill run. Composite 68/100 ("Fair"): on-page and technical
are A-grade (schema 92, technical 85, E-E-A-T 82), pulled down by Brand Authority
(22) — the site is near-invisible off-domain. Surfaced three actionable items
(non-extractable `/wissen` leads; still-zero tables; no Bing/IndexNow) and three
owner-decision OPENs (Wikidata-not-Wikipedia as the entity anchor; an independent
review profile; answer-first rewrites needing approved cover wording).

**Source:** live `curl`/`WebFetch` of the production site + two GEO research
sub-agents (brand-mentions, platform-readiness), all 2026-08-31; cross-checked
against served HTML. No business facts invented (CLAUDE.md §4). Note filed:
`WebFetch` strips `<script>`/microdata, so schema must be verified with `curl`,
not a markdown proxy.

## 2026-08-27 — `/lp/berufsmusiker` cross-canonicalised to `/lp/sinfonima`

**Changed:** `src/pages/lp/berufsmusiker.astro` (`canonical` → `.../lp/sinfonima`;
robots stays `index,follow`); `astro.config.mjs` (`NOINDEX_PATHS` renamed
`SITEMAP_EXCLUDE_PATHS`, `/lp/berufsmusiker` added); `src/partials/lp/berufsmusiker.html`
(the professional section's 2nd paragraph now names international tours +
session work + the in-vehicle condition). Wiki:
[on-page-rules.md](on-page-rules.md) §5/§6 (cross-canonical, sitemap-exclusion
table now three, constant renamed), [business-facts.md](business-facts.md) (new
Product rows + partial close of the exclusions OPEN).

**Why (supersedes the same-day "indexed" decision below):** asked whether to
keep `berufsmusiker` as a distinct indexed page or canonicalise it, the owner
deferred to a recommendation. Recommended **cross-canonical to `sinfonima`**
because: no organic "Berufsmusiker" demand ([keywords.md](keywords.md)); the two
pages are the same SINFONIMA product; and the differentiators the owner supplied
are reassurance-framing of the *same* cover, not a distinct product — so a second
indexed page would split signals rather than win new queries. The canonical
consolidates onto `sinfonima`; `berufsmusiker` stays live/crawlable as a
campaign LP. Reversible: flip the `canonical` back to self.

**Owner-verified facts used (owner, 2026-08-27):** cover applies worldwide
*including international tours and session/studio work*; instruments are covered
in a vehicle if kept in a locked, not-externally-visible case/boot compartment.
Recorded in [business-facts.md](business-facts.md). The in-vehicle sentence
reuses the exact approved qualifier already on the page — the owner's casual
"not visible from outside" was **not** used to loosen it. All other
cover/price/claims copy remains verbatim.

## 2026-08-27 — `/lp/berufsmusiker` content differentiated for Berufsmusiker

**Changed:** [on-page-rules.md](on-page-rules.md) §5 (landing-pages line + noindex
table now two, README noted as corrected) and §6 (two, not three);
[keywords.md](keywords.md) (new OPEN: `/lp/imsound` is referenced as built but
does not exist in the repo — the I'M SOUND cluster is unserved by a dedicated
URL). Code: `src/pages/lp/berufsmusiker.astro` (title/description +
og/twitter), `src/partials/lp/berufsmusiker.html` (hero paragraph + one new
section).

**Why:** `/lp/berufsmusiker` and `/lp/sinfonima` were byte-identical except the
H1's last span, so indexing berufsmusiker (done earlier today) created a
duplicate/thin-content risk and cannibalisation against `/lp/sinfonima` and the
homepage. Differentiated berufsmusiker toward the professional-musician intent:
new unique `<title>` (54 ch) and meta description (151 ch); a rewritten,
liftable hero paragraph; and a new H2 section *"Warum brauchen Berufsmusiker
eine spezielle Instrumentenversicherung?"* with two liftable paragraphs.

**Constraint respected (CLAUDE.md §4):** every cover/price/claims sentence
already on the page was left **verbatim** — the Hausrat comparison, the perils
list, the benefit tiles, the FAQ answers. The new copy reuses only
already-approved claims (weltweiter Schutz, ohne Selbstbeteiligung, "egal, wer
den Schaden verursacht hat", Proberaum/Auftritte/Reisen, Zubehör, ab 4,69 €/Monat)
plus audience framing that asserts no new cover fact. No new business or product
fact was introduced. There is **no measured "Berufsmusiker" query demand** in GSC
([keywords.md](keywords.md)), so this is cannibalisation-avoidance, not a demand
play.

**Still limited:** ~80% of the body is shared approved cover copy that may not be
paraphrased, so the two pages remain substantially similar. Deeper divergence
would need owner-supplied Berufsmusiker-specific approved wording, a verified
professional-use angle (touring / equipment / higher sums), or a decision to
canonicalise. Flagged to the owner, not resolved.

**Source:** owner request, 2026-08-27.

## 2026-08-27 — Product schema on both `/lp` pages; `/lp/berufsmusiker` indexed

**Changed:** [aeo-rules.md](aeo-rules.md) — §4 `#product` scope row now names the
two `/lp` landing pages; the offers rule notes they show both tariff figures in
prose and pass `includeOffers`; §8 sitemap list dropped to two noindex paths
(`/berufshaftpflicht`, `/neue-bewertung`) and records that `/lp/berufsmusiker`
became indexable, retiring the stale "README says two" note; §5 fact-location
table corrected (product names + prices now list both real landing pages, fixing
a dangling `/lp/imsound` that is not a page). [README.md](../README.md) SEO
section corrected to the right two noindex pages.

**Why:** owner asked to (a) add the review/offer JSON-LD to `/lp/sinfonima` and
`/lp/berufsmusiker` and (b) make `/lp/berufsmusiker` indexable. Both pages now
display the live rating/count (after the `<Reviews>` fix earlier today) and both
tariff prices, so `productLd({ includeOffers: true })` asserts only visible
content — same shape as the homepage, staying in the product-snippet class (no
merchant-listing fields). Indexing required flipping `robots` to `index,follow`
**and** removing the path from `NOINDEX_PATHS` so the sitemap and the directive
agree (§8). Verified in the build: both pages emit one `Product` node reusing
`#product` with `aggregateRating` 4,97 / 1089 and the `AggregateOffer`
(lowPrice 4.69, no shipping/return/availability); `/lp/berufsmusiker` now in
`sitemap-0.xml`; both `index,follow`; all JSON-LD parses.

**Source:** owner request, 2026-08-27; code in
`src/pages/lp/{sinfonima,berufsmusiker}.astro`, `astro.config.mjs`.

## 2026-08-27 — Reviews injection unified into one `<Reviews>` component

**Changed:** [reviews-pipeline.md](reviews-pipeline.md) — the "Render" step now
describes the shared `src/components/Reviews.astro` component and names all four
pages that go through it (homepage + both `/lp` landing pages as a 15-card
preview, `/reviews` as the full corpus).

**Why:** the reviews section on `/lp/sinfonima` (and `/lp/berufsmusiker`) was
broken — both landing pages rendered their partial raw, so the review cards
never appeared and the average/count were frozen at the Webflow-baked
placeholder `4,96 / 1058`. The build-time injection had been written inline and
duplicated in `index.astro` and `reviews.astro` only, so the landing pages were
missed when they were added. Extracted that logic into one component and pointed
all four pages at it, so they can no longer drift. Verified on the dev server:
`/lp/sinfonima` now renders 15 cards with real names/dates/stars at the live
`4,97 / 1089`, no leftover placeholder.

**Source:** owner request, 2026-08-27; code in `src/components/Reviews.astro`,
`src/pages/{index,reviews}.astro`, `src/pages/lp/{sinfonima,berufsmusiker}.astro`.

## 2026-08-24 — Online conclusion is Germany-only (owner ruling)

**Changed:** [business-facts.md](business-facts.md) — new "Online conclusion —
residence eligibility" subsection under Product, with an `OPEN` marker on the
policy-document side. [recon-report.md](recon-report.md) — the DACH bullet now
points at that subsection instead of leaving the eligibility question fully
open.

**Why:** the owner asked to restrict the `/anfrage` online flow by residence.
Asked whether Austria should stay online-eligible, the owner ruled: online
conclusion for Germany only, everyone else into the request flow. Implemented
the same day in `src/scripts/calculator.js` + `src/partials/anfrage.html`;
flow mechanics documented in `docs/anfrage-flows.md`.

**Source:** owner, 2026-08-24. Supporting repo facts (DE-only IBAN pattern, the
existing non-German-residence disclaimer) read from `src/partials/anfrage.html`
on 2026-08-24.

---

## 2026-08-20 (4) — Four owner rulings; hub list and author credential added

**Changed:**

- `aeo-rules.md` §4 — the date case rewritten around the ruling; the `jobTitle`
  OPEN closed; two new standing rules (hub lists are derived, not typed; article
  images stay AVIF).
- `recon-report.md` — the 2026-08-05 "Phase 1 progress" section re-marked from
  "does not match the code" to **STALE: it records a different project.**

**Site changes (same session):** the disputed publication date corrected in
both places; `jobTitle` added to the Person node; the `/wissen` hub now emits an
ordered `ItemList` of its eleven spokes, derived from its own markup.

**The rulings** (owner, 2026-08-20), each answering a question raised in the
2026-08-20 (3) entry:

1. **The disputed date: the later one is right.**
   `/wissen/sind-schaden-durch-familienangehorige-mitversichert` now publishes
   2024-06-22 — **and the page renders 22.06.2024**, where it used to say
   15.06.2024. Correcting only the schema would have traded a schema-vs-JS
   contradiction for a schema-vs-page one, which is the worse of the two (§4).
   This is the one change in this batch that alters what a reader sees.
2. **Article images stay AVIF.** No JPEG derivative gets generated just to
   satisfy a documentation table. Recorded as a standing rule with the caveat
   that a Rich Results Test is still the way to confirm Google reads the
   property.
3. **The Klavier "Phase 1 progress" record belongs to a different project.**
   Not a revert and not lost work — it was filed against the wrong codebase.
   Left in place, clearly marked, because the plan may still be wanted; but
   nothing in it counts as shipped here.
4. **`jobTitle` and the hub list: both added.**

**On the hub list.** The only real objection to `hasPart` was that it becomes a
hand-kept list that drifts. So it is not hand-kept: `listedPages()` reads the
card anchors out of `src/partials/wissen.html` at build time and returns them in
render order, and `collectionPageLd()` emits them as an `ItemList`. Add or
remove a card and the schema follows on the next build. This is the general
rule now — a hub's spoke list is derived from the hub, never typed out
([aeo-rules.md](aeo-rules.md) §4).

`mainEntity: ItemList` rather than `hasPart`: it is self-contained (no `@id`
references to nodes that are not on the page), and it preserves the visible
ordering, which `hasPart` does not.

**Verified:** `npm run build` passes with the asset gate. The validator over all
25 built pages still reports no problems, now also checking the hub: the
ItemList has one entry per rendered card, in the same order, with URLs and
titles matching the cards character for character, every target page existing in
`dist/`, and `numberOfItems` agreeing with the list length. `datePublished`
still equals the rendered `.content_date` on all eleven articles — including the
corrected one.

**Source:** owner, 2026-08-20 (four rulings); `src/partials/wissen.html` (card
markup); `src/data/structured-data.ts`; build output under `dist/`, 2026-08-20.

---

## 2026-08-20 (3) — Article schema consolidated server-side

**Changed:**

- `aeo-rules.md` §4 — `#heiner-blaskewitz` and `#logo` added to the entity
  table; `collectionPageLd()` recorded; new standing rule that schema is never
  built in client-side JavaScript; the dates gap closed; the author question
  settled.
- `business-facts.md` — the named-author OPEN resolved; new row recording the
  author credit; founder citation re-pointed.
- `broken-assets.md` §2 — the schema half of the logo finding is now fixed.
- `recon-report.md` — the 2026-08-05 "Phase 1 progress" paragraph flagged: the
  Klavier rebuild it describes is **not on `master`**.

**Site changes (same session):** twelve `src/partials/**/*.inline.js` deleted;
`articleLd()` gained `image`, `dateModified` and `author`; a shared `Person`
node added to the org graph; `#logo` re-pointed from the touch icon to the
wordmark; the `/wissen` hub moved from `Article` to a new `collectionPageLd()`.

**Found while verifying, and fixed: the `/wissen` hub claimed `Article`.** Not
part of the injected-schema problem — it came in with the site-wide JSON-LD
work on 2026-07-31 — but it is the same class of error. The hub is a listing:
no `.content_date`, no author box, no lead image, so an `Article` node asserted
three things the page does not show. It now emits `CollectionPage`.

(The hub list, the AVIF question and the author's `jobTitle` were all settled
the same day — see the 2026-08-20 (4) entry above.)

**Why:** owner ruled that the schema should be generated at build time and ship
statically (owner, 2026-08-20), closing the item left open earlier that day.

**What the injected schema actually was.** Eleven `/wissen` pages plus
`/berufshaftpflicht` built an `Article` node in JS and appended it to `<head>`
after load. It was not merely redundant:

- It **duplicated** the server-side `Article` from `articleLd()`, so every
  article page carried two Article nodes.
- The two **disagreed on the author** — injected said `Person "Heiner
  Blaskewitz"`, server-side said the organisation.
- It used the **www host** the rest of the site canonicalises away.
- Its `publisher.logo` pointed at `/images/mv-logo.jpg`, which did not exist
  until earlier the same day.
- On **`/berufshaftpflicht` it never ran at all**: the file has no
  `[data-element="article-image"]`, so `document.querySelector(...).src` threw
  and the script died before appending anything. That page has emitted no
  Article schema since the migration. It is also noindex and is not an article,
  so nothing replaced it — the file was simply deleted.

**What was salvaged rather than dropped.** The injected node carried three
facts the server-side builder did not, all now passed explicitly per page:

- **`image`** — the article's own lead image, not the generic OG image. The OG
  image is not rendered anywhere on a `/wissen` page; the article image is, so
  it is the one schema may assert (§4).
- **`datePublished` / `dateModified`** — see the dates section in
  [aeo-rules.md](aeo-rules.md) §4.
- **`author`** — see the author section there.

**One entity, not two.** The org's `founder` and the article author are the
same human, so both now reference a single `Person` node at
`${SITE.url}/#heiner-blaskewitz` instead of appearing as two lookalike
inline objects.

**`#logo` re-pointed.** With the injected node gone, `mv-logo.jpg` had no
referrer. Rather than orphan the file the owner had just supplied, it became
the org's `logo`, replacing the 256×256 `touchicon.png` — a wordmark is what
`logo` means, and it is the same mark the header and footer render.

(The AVIF question was settled the same day — see the 2026-08-20 (4) entry.)

**Verified:** `npm run build` passes with the asset gate. A validator over all
25 built pages with JSON-LD confirms: exactly one `Article` node per `/wissen`
page (was two), zero anywhere else including `/berufshaftpflicht` and the
`/wissen` hub, every `@id` reference resolves to
a node defined on the same page, every `datePublished` equals the date the page
renders in `.content_date`, and every schema `image` both exists in `dist/` and
appears in that page's HTML. No page injects into `<head>` any more.

**Source:** the twelve deleted `*.inline.js` files (read before deletion);
`src/partials/wissen/*.html` (`.content_date` and the author box);
`src/data/structured-data.ts`; build output under `dist/`, all 2026-08-20;
owner, 2026-08-20.

---

## 2026-08-20 (2) — Typo, logo, and the asset check as a build gate

**Changed:**

- `broken-assets.md` — all three assets now marked fixed; new §3 documents the
  build gate; the typo and logo OPENs resolved; recovery recipe de-duplicated
  into §3.
- `index.md`, `recon-report.md` — status updated to fixed.
- `aeo-rules.md` §4 — new standing rule: an image asserted in schema must
  resolve, enforced by the gate.

**Site changes (same session):**

- `src/partials/faqs.html` — "Was ist bei Auslandsrei**en** zu beachten?" →
  "Auslandsrei**sen**". Single occurrence site-wide. It is the
  `itemprop="name"` of a `schema.org/Question` node, so the visible heading and
  the machine-readable assertion are corrected together.
- `public/images/mv-logo.jpg` **new** — the missing publisher logo.
- `scripts/check-assets.mjs` **new**, wired into `prebuild`.
- `scripts/render-logo.mjs` **new** — regenerates the logo from the wordmark;
  not part of the build.

**Why:** owner ruled on all three open items at once (owner, 2026-08-20): fix
the typo, supplied the logo, and "ja audit als prebuild gate".

**How the logo was produced — no brand asset was invented.** The owner supplied
the logo as an image, but it never reached the filesystem, so it could not be
committed directly. It did not need to be: the site already carries the same
wordmark as inline SVG in `src/components/Logo.astro` — the mark the header and
footer render, with the brand colours `#6B46C1` (Musikversicherung) and
`#D6BCFA` (.com), matching the supplied file. The JPG is rendered from that SVG
via headless Chromium: white ground, mark centred at 73% width, 1200×468 (the
2.56:1 framing of the supplied file), JPEG q92. The renderer is committed as
`scripts/render-logo.mjs` so the provenance stays checkable — it is not wired
into any build, and re-running it reproduces the committed file byte for byte
(verified 2026-08-20). Playwright is not a project dependency; the script
resolves a local or global install and exits with instructions if it finds
neither.

> **OPEN:** if the owner's own `mv-logo.jpg` file differs from this render in
> framing or dimensions, drop the original into `public/images/` and it wins.
> The render is a faithful reconstruction from the authoritative vector, not a
> claim to be the original file.

**The gate.** `scripts/check-assets.mjs` requires every `/assets/…` and
`/images/…` reference in `src/` to resolve to a file in `public/`, and fails
the build otherwise, naming each missing path and the file referencing it.
Three design points worth keeping:

- It matches on the **path**, so the absolute
  `https://www.musikversicherung.com/images/mv-logo.jpg` URLs in the
  `inline.js` schema are covered.
- It **expands string prefix constants** first. `BaseHead.astro` composes the
  favicon and touch-icon hrefs from `const ASSET = "/assets/<site-id>"`; without
  expansion those two icons would sit outside the check, and the bare prefix
  would be reported as a missing file. Caught in testing, which is the reason
  the expansion exists.
- **An empty scan fails.** If the scanner matches nothing it exits non-zero
  rather than reporting a clean site — a broken checker must never read as a
  passing one.

**Verified:** each of the favicon, one Auslandsreisen PDF and `mv-logo.jpg`
removed in turn — the gate failed and named the right file every time, and
passed on the clean tree (124 references). Full `npm run build` passes with the
gate in place; the corrected question and the logo both ship in `dist/`, and
every `/assets/` and `/images/` href in the built HTML resolves against `dist/`.

**Source:** owner, 2026-08-20 (typo ruling, logo, gate ruling);
`src/components/Logo.astro` (wordmark and brand colours);
`src/components/BaseHead.astro:39` (the prefix constant);
`src/partials/faqs.html`; test runs 2026-08-20.

---

## 2026-08-20 — Auslandsreisen PDFs restored; broken-asset audit filed

**Changed:**

- `broken-assets.md` **new** — the three local asset references in `src/` with
  no file under `public/`, out of 123 audited. Cause, ranking impact, the fix,
  the recovery recipe, the shallow-clone trap, and the audit command.
- `index.md` — new row for the page.
- `keywords.md` — the English cluster row records the 404 window and the restore.
- `recon-report.md` — Phase 0 lead names the three assets and their status.

**Site change (same session):** both PDFs restored to
`public/assets/63f2893134fa326a6838c84d/`, byte-identical to the historical
blobs. No markup touched.

**Why:** owner reported that the Auslandsreisen Ratgeber in the `/faqs`
accordion returns 404 in both German and English (owner, 2026-08-20). Widened
to a full asset audit on the assumption that whatever dropped two files dropped
others; it dropped one more.

**Findings worth keeping:**

- **Cause: an automated Webflow re-export, not the Astro migration.** Both PDFs
  were added 2025-04-25 (`c238048`) and deleted 2025-09-01 03:51 UTC
  (`6834273`), both `github-actions[bot]` / "Updated site from Webflow". The
  deleting commit removed exactly two files — these two — while leaving
  `dist/faqs.html` still linking to both. Live 404 for close to a year.
- The English PDF was an indexed, ranking URL — 6.7k impressions / 11 clicks in
  the 16-month GSC window — so this was lost ranking, not only a dead link.
  Restoring at the identical path repairs the FAQ answer and the indexed URL
  together.
- **The files are the insurer's own:** "SINFONIMA® — Empfehlungen zu
  Auslandsreisen mit dem Musikinstrument", 2. aktualisierte Auflage, and the
  English "Tips on travelling abroad with your musical instrument", Revised 2nd
  edition. Both 32 pages, produced April 2018. Nothing was authored or rewritten
  here.
- **The shallow-clone trap, and a correction.** This session first reported the
  files as unrecoverable and blamed the Webflow scrape for never capturing
  them. That was wrong, and it was wrong because the clone is shallow — history
  reached back only to 2025-09-23, after the deletion. The owner pushed back
  ("die dateien gab es mal"); `git fetch --unshallow` turned 56 commits into
  214 and both blobs were there. **Unshallow before concluding anything from
  history**, and treat a shallow `git log` as no evidence at all. Unshallowing
  also revealed `staging` and `strato-deploy-fallback`, two branches the
  session never had.
- Unrelated finding, left unfixed: the twelve `*.inline.js` files inject an
  `Article` node client-side that duplicates the server-side `articleLd()`
  output, names a `Person` author against the organisation `articleLd()` names,
  uses the www host, and points `publisher.logo` at the missing
  `mv-logo.jpg` — which, unlike the PDFs, is nowhere in history.

**Verified:** `npm run build` passes; both PDFs ship in `dist/assets/…`; every
`.pdf` href in the built `dist/faqs.html` resolves; `git hash-object` on both
restored files matches the historical blob shas.

**Source:** `src/partials/faqs.html:19`; `git rev-list --objects --all` and
`git log --diff-filter=AD` over the unshallowed repo, 2026-08-20; `pdfinfo` /
`pdftotext` on the recovered files, 2026-08-20;
`src/partials/wissen/*.inline.js:27` and
`src/partials/berufshaftpflicht.inline.js:27`; GSC figures via
[keywords.md](keywords.md) (`raw/gsc/…-2026-08-04/`); owner, 2026-08-20.

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

## 2026-08-19 — Six more lost reviews found and restored; count 1089

**Changed:**

- `reviews-pipeline.md` — corrected: **seven** reviews were lost, not one. New
  "Two failure modes" section (Worker-era vs Make-era, and why each left a
  different trace); "What was done" and the verified-live figures updated;
  "Verifying it, next time" rewritten with the mail-search traps that hid the
  six.
- `business-facts.md` — review row 1083 → **1089**, average 4,96 → **4,97**.
- `aeo-rules.md` — the same figures in the ratings-are-live rule.

**Why:** owner said more reviews looked missing and asked for a check (owner,
2026-08-19). He was right. The earlier "exactly one lost" claim rested on
`Add review from …` commits, which only exist where the Worker ran; the six
reviews Make processed never touched git.

**How they were found:** the notification mails are the one artefact every path
produces. Keyword search caps at 20 results and does not page (it omitted
three); structured filters skip Trash, where the mails live (they returned
nothing). A filtered search scoped to `jannis@arise.so:Trash` listed all 27,
and the counts then reconcile exactly: 25 non-test mails since 2025-12 minus
the six missing equals the 17 entries the corpus held.

**Restored** (site commit `51f671f`, verbatim from the mails): UZZE
(2026-06-02), Christian (06-19), Gaby Weihmayer (06-20), Karin (06-24),
Kerstin Zuther (07-03), 17 Hippies (07-15). Timestamps are mail-local Berlin
time converted to UTC, seconds `:00` — the mail records only minutes.

**Verified:** one fetch of `/reviews` shows 1089, 4,97, `reviewCount: 1089` and
1089 `Review` nodes; all six render.

> **OPEN:** two Make-era smoke-test entries ("TEST – Migration Smoke", "TEST –
> Smoke 2") were correctly never published, but the exact seconds of the six
> restored timestamps are unrecoverable from mail. If the Strato `reviews.json`
> or the Make Google Sheet is ever reachable again, the precise values are
> there.

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
