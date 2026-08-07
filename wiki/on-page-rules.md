# On-page rules

The standing on-page SEO contract for musikversicherung.com. Applies to every
page under `src/pages/` and its markup in `src/partials/`.

Read this before any content, markup or metadata change (see
[CLAUDE.md](../CLAUDE.md) §3). Companion page: [aeo-rules.md](aeo-rules.md),
which governs how the same content gets quoted by AI answer engines. The two
overlap heavily and never contradict — where a rule appears in both, they are
worded to agree.

---

## 1. The liftable first paragraph

**Rule:** the first paragraph after the H1 must answer the page's question
completely, on its own, in 2–4 sentences (roughly 40–70 German words), with no
dependency on anything above or below it.

"Liftable" is the test: cut the paragraph out, paste it somewhere with no
context, and it still reads as a correct, complete answer. If it needs the
heading to make sense, it fails.

**Requirements:**

- Lead with the answer, not with a wind-up. No "In diesem Artikel erfährst du…",
  no "Musik ist Leidenschaft…", no throat-clearing about how important the topic
  is.
- Restate the subject in the sentence itself. Not "Sie kostet ab 4,69 € im
  Monat" but "Eine Instrumentenversicherung kostet ab 4,69 € im Monat" — the
  pronoun breaks liftability.
- Include the concrete specifics (number, condition, scope) rather than
  promising them later.
- Self-contained means self-contained: no "siehe oben", no "wie erwähnt", no
  reference to a table or list further down.

**Why:** this paragraph is what Google shows as a featured snippet and what an
answer engine extracts as the quotable unit. It is the single highest-leverage
sentence group on any page.

**Worked shape** (structure, not approved copy — verify every number against
[business-facts.md](business-facts.md) before shipping):

> Eine Instrumentenversicherung kostet bei Musikversicherung.com ab 4,69 € im
> Monat für klassische Instrumente. Der Beitrag richtet sich nach dem
> Versicherungswert des Instruments und dem gewählten Tarif. [Third sentence:
> the one qualifier a reader needs.]

**Do not** write the first paragraph as a fresh claim. Every fact in it must be
traceable to [business-facts.md](business-facts.md) or an approved source.

---

## 2. Exactly one H1

**Rule:** one `<h1>` per page. Never zero, never two.

- The H1 states the page's subject in the user's words, not the brand's.
- The H1 and the `<title>` should agree in substance but need not be identical —
  the title carries the brand suffix, the H1 usually should not.
- Visual size is a class, not a tag. The site already does this correctly:
  `src/partials/faqs.html:7` uses `<h1 class="heading-style-h2">` to get an H2's
  appearance from an H1 element. **Copy that pattern** — never demote the H1 to
  a `<div>` or promote a styled `<div>` in its place to control size.
- Heading levels descend without gaps: H1 → H2 → H3. Do not skip a level to get
  a smaller font.

**Current state (verified 2026-08-04):** all 12 top-level partials in
`src/partials/*.html` contain exactly one `<h1>`. This is a passing baseline —
keep it passing.

---

## 3. Title tags under 60 characters

**Rule:** every `<title>` is **under 60 characters**, counted in characters (not
bytes — German umlauts and en dashes are multi-byte and will inflate a naive
count).

- Front-load the distinguishing term. The part after ~55 characters may be
  truncated in the SERP and should be the most disposable.
- Brand suffix convention on this site is ` – Musikversicherung.com` (en dash) or
  ` | <Produktname>`. Keep it consistent per section; drop the suffix entirely
  before letting a title run over.
- One primary intent per title. Two keywords glued with a pipe is usually a sign
  the page should be two pages.
- Meta descriptions: 140–160 characters, written to earn the click, and never a
  substitute for the liftable first paragraph.

Titles live in the `seo` object at the top of each `src/pages/*.astro` file and
flow through `src/components/BaseHead.astro`.

**Audit — 2 pages currently over the limit (verified 2026-08-04):**

| Chars | File | Title |
| --- | --- | --- |
| 70 | `src/pages/index.astro` | `Instrumentenversicherung ohne Selbstbeteiligung \| SINFONIMA & IM SOUND` |
| 62 | `src/pages/lp/sinfonima.astro` | `Versicherung für klassische Instrumente \| Mannheimer Sinfonima` |

Every other page is at 59 characters or below.

> **OPEN:** both overruns are on commercially important pages, and the homepage
> title carries the "ohne Selbstbeteiligung" claim. Shortening either changes a
> product claim in a SERP, so it needs an owner decision, not a unilateral edit.
> Do not trim these without asking.

Check before shipping any title change:

```bash
grep -H '"title":' src/pages/*.astro src/pages/wissen/*.astro src/pages/lp/*.astro | sed 's/:  *"title": *"/\t/;s/",*$//' | python3 -c "import sys;[print(f'{len(t):3d}  {f}') for f,_,t in (l.rstrip(chr(10)).partition(chr(9)) for l in sys.stdin)]" | sort -rn | head
```

---

## 4. H2s are buyer questions

**Rule:** H2s are phrased as the questions a buyer actually types or asks, not
as topic labels.

| Write this | Not this |
| --- | --- |
| Was kostet eine Instrumentenversicherung? | Kosten |
| Ist mein Instrument auch auf Reisen versichert? | Reiseschutz |
| Was passiert, wenn mein Kind das Cello beschädigt? | Schäden durch Dritte |
| Zeitwert oder Neuwert — was ist besser für mich? | Bewertungsarten |

**Requirements:**

- Each H2 is answerable in the 1–3 paragraphs directly beneath it, and the
  **first sentence under each H2 answers it** — same liftability test as §1,
  applied at section level.
- Use the buyer's vocabulary, not the insurer's. Musicians search for "Geige",
  "Equipment", "geklaut" — not "Streichinstrument der Gattung", "technisches
  Inventar", "Entwendung". Where a legal term must appear, gloss it once.
- Question H2s and their answers are exactly what an FAQ block wants; where a
  page's H2s already are questions, consider whether the section belongs in
  `/faqs` too — but **do not duplicate the same Q&A text on two URLs**. Link
  instead.
- Not every H2 must be a question. Process and comparison sections may be
  declarative. But the default is interrogative, and a page of noun-label H2s is
  a failed page.
- Order H2s by buyer sequence — what they ask first, first. Cost and coverage
  before edge cases; edge cases before administration.

---

## 5. Hub-and-spoke internal linking

**Structure:** each topic cluster has one **hub** page that covers the topic
broadly and links out to every **spoke**; each spoke covers one narrow question
in depth and links back to its hub.

**Current clusters (verified 2026-08-04 from `src/pages/`):**

- **Hub:** `/wissen` — knowledge base index.
  **Spokes:** the 11 pages under `src/pages/wissen/` (cost, coverage, how it
  works, Zeitwert vs. Neuwert, household-contents comparison, piano-specific,
  family damage, choosing a policy, why it matters, the FAQ round-up, common
  questions).
- **Hub:** `/faqs` — FAQ, carrying `schema.org/FAQPage` microdata inline in
  `src/partials/faqs.html`.
- **Conversion targets:** `/anfrage`, `/schaden-melden`, `/kontakt` — these
  receive links; they are not hubs and should not sprawl into content pages.
- **Landing pages:** `src/pages/lp/` — `sinfonima` (`index,follow`),
  `berufsmusiker` (`noindex,nofollow`).

**Noindex pages — three, not two** (verified 2026-08-04 against
`astro.config.mjs` `NOINDEX_PATHS` and each page's `seo.robots`; the two agree):

| Page | Directive |
| --- | --- |
| `/berufshaftpflicht` | `noindex` |
| `/neue-bewertung` | `noindex,follow` |
| `/lp/berufsmusiker` | `noindex,nofollow` |

All three are excluded from the generated sitemap. **[README.md](../README.md)
§SEO still says "the two `noindex` pages" — the README is stale; the config is
correct.** Keep `NOINDEX_PATHS` and the per-page `robots` values in sync: if
they ever disagree, a page is either sitemapped-but-noindexed or
indexable-but-missing, and both are silent bugs.

**Never link to a noindex page from an indexable one** without a deliberate
reason.

**Rules:**

- Every spoke links back to its hub. Every hub links to every one of its spokes.
  A spoke reachable only from the sitemap is orphaned — treat as a bug.
- Spokes link **sideways** to sibling spokes only where genuinely relevant
  (cost ↔ Zeitwert/Neuwert is relevant; cost ↔ piano-specific usually is not).
  Do not build a link mesh for its own sake.
- **Anchor text is descriptive and specific.** The anchor should tell you the
  destination with the surrounding sentence removed.

  | Good | Bad |
  | --- | --- |
  | `was eine Instrumentenversicherung kostet` | `hier` |
  | `Unterschiede zwischen Hausrat- und Instrumentenversicherung` | `mehr erfahren` |
  | `Zeitwert oder Neuwert versichern` | `diesen Artikel` |

- Vary anchor phrasing across pages pointing at the same target. Identical
  anchors repeated site-wide read as templated.
- Links go in body prose where the reader needs them, not only in a "Related"
  block at the bottom.
- Keep the crawl shallow: every indexable page reachable from the homepage in
  ≤3 clicks.
- **URLs are permanent.** Changing a slug means a redirect and a real ranking
  cost. Do not rename a page's route as part of a content edit — that is its own
  decision, made deliberately, and recorded in [log.md](log.md).

---

## 6. Technical baseline (already in place — do not regress)

Verified 2026-08-04 against the codebase:

- Canonical URL, Open Graph, Twitter card, `robots` and JSON-LD are all emitted
  centrally by `src/components/BaseHead.astro`. **Add metadata via the `seo`
  object in the page, never by hand-writing `<meta>` into a partial.**
- Canonical defaults to the flat, trailing-slash-stripped URL
  (`BaseHead.astro:26`). Pages set it explicitly; keep those absolute and
  self-referential.
- `@astrojs/sitemap` generates `sitemap-index.xml`, referenced from
  `public/robots.txt`, excluding the three `noindex` pages listed in §5.
- `public/robots.txt` is currently `User-Agent: *` / `Allow: /` plus the sitemap
  reference — all crawlers, including AI crawlers, are allowed. Changing that is
  an owner decision: see [aeo-rules.md](aeo-rules.md) §8.
- `<html lang="de">` (`src/layouts/Layout.astro:29`).
- Speculation Rules prerender same-origin links (`BaseHead.astro:100`) — a
  navigation-speed feature; leave it alone.

## 7. Checklist before shipping a page change

- [ ] Read this page and [aeo-rules.md](aeo-rules.md) first.
- [ ] Exactly one `<h1>`; heading levels descend without gaps.
- [ ] `<title>` under 60 characters; description 140–160.
- [ ] First paragraph passes the lift test.
- [ ] H2s are buyer questions; first sentence under each answers it.
- [ ] Links to hub and relevant spokes, with descriptive anchors.
- [ ] Every factual claim traced to [business-facts.md](business-facts.md).
- [ ] Structured data still matches what is visible on the page.
- [ ] `npm run build` passes.
- [ ] Change appended to [log.md](log.md).

---

*Back to [index.md](index.md).*
