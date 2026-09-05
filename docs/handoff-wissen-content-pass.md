# Handoff — /wissen content pass, owner review before merge

**Status (2026-09-04):** an AEO content pass rewrote **all 11 `/wissen`
articles**, and their dates were moved to a footer line. Everything is
**committed on branch `agent/wissen-article-structure-c37d83`** but **not merged
to `master`**, and it is **pending an owner read** — this is regulated insurance
communication ([CLAUDE.md](../CLAUDE.md) §4), so a human must confirm no cover,
price or qualifier wording was distorted before it ships. This page is the
review guide for that pass.

## Where the work is

- **Branch:** `agent/wissen-article-structure-c37d83`, checked out as a git
  **worktree** at `.claude/worktrees/wissen-article-structure-c37d83/` (not the
  main working dir — `git worktree list` shows both).
- **Commits:** `5da82ab` (WIP: summary boxes, Klavier rewrite, I'M SOUND LP) and
  `23dd869` (dates → footer + bundled the rest of the pass). The full narrative,
  per article, is in [wiki/log.md](../wiki/log.md) under the four `2026-08-31`
  entries plus `2026-09-04`.
- **Rules that govern the review:** [wiki/aeo-rules.md](../wiki/aeo-rules.md) §1
  (extractable/answer-first), §3 (tables, no superlatives), §4 (schema =
  visible), §6 (dates); [wiki/on-page-rules.md](../wiki/on-page-rules.md) §1, §4,
  §5; every figure/claim traces to
  [wiki/business-facts.md](../wiki/business-facts.md).

## Build / preview / verify

```bash
cd .claude/worktrees/wissen-article-structure-c37d83
npm run build          # must pass (astro build + prebuild asset gate + critical CSS)
npm run preview        # astro preview → http://localhost:4321 ; astro preview stop when done
```

- **Curl test, not the browser** (aeo §9): a passage only counts if it is in the
  served HTML. Example: `grep -c "Beitragsbeispiele" dist/wissen/was-kostet-eine-instrumentenversicherung.html`.
- Content lives in `src/partials/wissen/*.html` (raw HTML, one line each);
  per-page schema/title/meta in `src/pages/wissen/*.astro`; shared styles in
  `src/styles/global.css`.

## What every article got

1. **"Das Wichtigste in Kürze" summary box** at the top of the article body
   (`.wissen-summary` + `.gradient-border-light`). Copy is a **verbatim reuse**
   of the page's already-published answer/facts — no new claims. Two shapes:
   *framed lead* (label + the existing first paragraph) on the prose spokes;
   *key facts* (label + short answer + 2–3 bullets) on the table spokes + Klavier.
2. **Answer-first lead + buyer-question H2s** (aeo §1, on-page §4), reformatting
   already-published prose only.
3. **Date footer** (this session): the `.content_date` above the H1 is gone;
   the article body now ends with a dim `.content_meta` line —
   *"Veröffentlicht am `<pub>` · zuletzt aktualisiert am 04.09.2026"* — and every
   `articleLd()` emits `dateModified: "2026-09-04"` next to its `datePublished`.

## Per-article review checklist

Go article by article. For each: does the summary box reuse published copy
only? Do the H2 answers still say what the policy wording says (no softened or
strengthened qualifier)? Do table cells match the prose they replaced?

| # | Article (`/wissen/…`) | Notable changes to check | Table? |
| --- | --- | --- | --- |
| 1 | `was-kostet-eine-instrumentenversicherung` | key-facts box; 8 price examples → `<table>` (values verbatim); leads with "ab 4,69 € … bis 3.000 €"; link to Zeitwert/Neuwert | ✅ |
| 2 | `unterschiede-zwischen-hausrat--und-instrumentenversicherung` | 5-row Hausrat-vs-Instrument comparison `<table>`; qualifiers "in der Regel / oftmals / häufig" preserved | ✅ |
| 3 | `zeitwert-oder-neuwert-versichern` | Neuwert-vs-Zeitwert `<table>`; kept "immer zum Zeitwert" + the 40 % example; removed a dangling link to a non-existent "Unterversicherung" article | ✅ |
| 4 | `instrumentenversicherung-fur-klaviere` | Klavier rewrite (`5da82ab`) + key-facts box + price table | ✅ |
| 5 | `was-deckt-eine-instrumentenversicherung-ab` | 5 noun H2s → 1 question H2 + `<ul>` of perils; **kept the "nicht bei allen Gesellschaften" Verlust qualifier** | — |
| 6 | `wie-funktioniert-eine-instrumentenversicherung` | definition moved into lead; 5 process steps → `<ol>` | — |
| 7 | `warum-ist-eine-musikinstrumentenversicherung-wichtig` | answer-first lead; benefit sections → question H2s; marketing filler trimmed; fixed "Mehr zu Mehr zur" heading | — |
| 8 | `sind-schaden-durch-familienangehorige-mitversichert` | **removed "Marktführer" superlative**; fixed typo "defintiv"; H2s → questions | — |
| 9 | `die-passende-police-fur-einen-massgeschneiderten-versicherungsschutz` | **removed "Marktführer" superlative**; answer-first lead naming both products; noun H2s → questions | — |
| 10 | `tipps-zur-auswahl-der-richtigen-versicherung-fur-dein-musikinstrument-equipment` | lead summarises the 5 checks; tip labels → question H2s; removed a dangling link to a non-existent Auslandsreisen article | — |
| 11 | `die-haufigsten-fragen-zur-instrumentenversicherung` | intro tightened; 3 descriptive internal links added (Kosten, Was deckt, Familienangehörige) | — |

**Highest-risk items** for the regulated read: the two **"Marktführer" removals**
(#8, #9 — they change a public claim, in the liability-reducing direction and
toward settled wiki policy; recorded in [wiki/recon-report.md](../wiki/recon-report.md)),
and the three **price/comparison tables** (#1–#3), where prose became table cells.

## Open items / decisions still needed

1. **Owner sign-off is the gate to merge.** Nothing here goes to `master` until
   the articles are read. That is the whole point of this handoff.
2. **The last-updated date value (`04.09.2026`)** stands for "revised in this
   pass." It is a hardcoded string in each partial and the matching
   `dateModified` in each `.astro`. **If the merge slips materially, bump both**
   to the real ship date (they must stay equal — aeo §4). To find them:
   `grep -rl "04.09.2026" src/partials/wissen/` and `grep -rl "2026-09-04" src/pages/wissen/`.
3. **The branch's wiki is behind `master`.** `master` has newer wiki work (the
   2026-08-31 GEO-audit entries, `wiki/geo-audit-2026-08.md`, the
   `structured-data.ts` register-`identifier`/insurer-`url` change, committed on
   `master` as `d85926d`). This branch does **not** have those. Reconcile at
   merge — do not let the branch's older `wiki/` overwrite `master`'s. In
   particular `structured-data.ts` differs; check both changes coexist.
4. **`5da82ab` also carries an "I'M SOUND LP" change** beyond `/wissen` — review
   it on its own terms; it is not covered by this checklist.
5. **Superlative sweep (verified clean 2026-09-04):** the banned terms are gone —
   `grep -rioE "marktführer|günstigste[rns]?|führend[a-z]*" src/partials/wissen/`
   returns nothing. (Use word boundaries, not a bare `beste` — that matches
   "besteht". The one remaining "besten" is "…welche Versicherung **am besten**
   passt…", a neutral phrase, not a superlative product claim.)

## What was NOT done

- No article's **facts** were re-verified against current policy documents — the
  pass reformatted already-published prose; it did not fact-check it. A true
  annual fact review (aeo §6 "review cadence") against
  [wiki/business-facts.md](../wiki/business-facts.md) is still open.
- H1s, titles, slugs, images and Article-schema `headline` were left untouched.
- Nothing was pushed. `master` here tracks `origin/staging` — never a plain
  `git push` on this repo.
