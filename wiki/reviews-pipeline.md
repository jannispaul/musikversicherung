# Reviews pipeline — form to page

How a customer review gets from `/neue-bewertung` onto `/reviews` and the
homepage.

**Status: fixed 2026-08-19.** The chain below is the one now running. The
break it recovered from is kept in "Where it broke" — it explains why the
corpus has a two-month hole and why a notification mail is not proof.

The review corpus is a load-bearing asset: it feeds the count and average in
[business-facts.md](business-facts.md), the `aggregateRating` and `review`
nodes in the Product JSON-LD ([aeo-rules.md](aeo-rules.md) §4), and the trust
argument against competitors who show three testimonials
([competitors.md](competitors.md)). A frozen corpus quietly ages all three.

---

## The chain as built

1. **Form.** `/neue-bewertung` posts `Rating`, `Name`, `Review` to
   `https://automations.arise.so/webhooks/mv-review`
   (`src/partials/neue-bewertung.html:1`, submitted by fetch in
   `src/scripts/neue-bewertung.js`).
2. **Worker.** The `automations` Cloudflare Worker (separate repo, not this
   one) handles the webhook in `src/handlers/mv-review.ts`. Empty `Name` →
   `200` silently (spam filter). Otherwise it:
   a. sends the notification mail *"Neue Bewertung auf Musikversicherung.com"*
      to `info@musikversicherung.com` + `jannis@arise.so`;
   b. reads the reviews JSON from this repo via the GitHub Contents API,
      prepends the new entry (`{date, name, rating, review}`, newest first) and
      commits it to `master` as `Add review from <name>`;
   c. legacy step: dispatches `upload-to-sftp.yml` — non-fatal, and that
      workflow no longer exists here.
3. **Rebuild.** The push to `master` triggers the Cloudflare Pages build.
4. **Render.** `src/data/reviews.ts` imports `public/reviews.json` at build
   time, computes count and average, and bakes the cards and the JSON-LD into
   `/reviews` (`src/pages/reviews.astro`) and the homepage preview.

**The email is sent before the commit.** A notification mail therefore proves
only that step 2a ran — never that the review landed.

## Where it broke (resolved 2026-08-19)

The Worker writes to the path in its `GITHUB_REVIEWS_PATH` var. Pre-migration
that was `dist/reviews.json` (the Webflow-era build directory, SFTP'd to
Strato). The Astro migration moved the corpus to `public/reviews.json`
(`d4f03c2`, 2026-07-30) and the Worker repo was updated to match the same day
(`05537ba`, *"mv-review: target public/reviews.json, drop SFTP dispatch"*).

**That Worker change was never deployed.** The live Worker was last deployed
2026-06-05 (Cloudflare API `modified_on`, read 2026-08-19), so it still targets
`dist/reviews.json` — a path that is in `.gitignore` and that the Astro build
neither reads nor ships.

Confirmed by the first real review since the migration: commit `b78da23` on
`origin/master`, 2026-08-19 14:58, writes a **fresh one-entry array** to
`dist/reviews.json` (the old file having been deleted by the migration), while
`public/reviews.json` stays at 1082 entries, newest 2026-05-27, untouched since
the seed commit `5289eb7`. The notification mail for it arrived at 14:58 and
matches the Worker's `buildNotificationText` byte for byte — it came from the
Worker, **not** from Make.

Consequences, all now cleared:

- Exactly one review was lost — the 2026-08-19 one, replayed in `d4a9dd5`.
  Nothing between 2026-05-31 and 2026-07-30 was affected: the pipeline saw no
  submissions in that window (no `Add review from …` commits on any branch).
- Each submission pushed to `master`, so Pages rebuilt for nothing.
- `dist/reviews.json` had become tracked in git despite being gitignored.

## What was done, 2026-08-19

1. **Deployed the `automations` Worker** (127 tests + typecheck green first).
   Its live vars now read `GITHUB_REVIEWS_PATH: "public/reviews.json"`. The
   same deploy also shipped the mv-anfrage spam filters committed 2026-08-08,
   undeployed for the same reason.
2. **Replayed the lost review** into `public/reviews.json`: 1082 → 1083
   entries, average unchanged at 4,96.
3. **Normalised `public/reviews.json`** to the Worker's own output shape
   (`JSON.stringify(list, null, 2)`). It previously carried a flatter Make-era
   layout, so the Worker's next write would have reformatted all 1083 entries
   in the same commit as one new review. Its commits are now one-entry diffs.
4. **Untracked `dist/reviews.json`.**
5. **Deactivated Make scenario 1174328** (below).

Verified live: `/reviews` and the homepage both render 1083 and 4,96, the new
review appears on both, and the Product JSON-LD carries `reviewCount: 1083`.

## Make scenario 1174328 — deactivated

`MV.com Review 23-03-08` (`eu1.make.com/39723/scenarios/1174328`) was still
`isActive: true` and was **deactivated on 2026-08-19**. It was already inert —
webhook-triggered, and the form has pointed at the Worker since May, giving it
4 lifetime executions — but its write targets (a Google Sheet, plus
`reviews.json` and `new-reviews.json` over Strato SFTP) made it a second,
contradicting source of truth for the same corpus. It did not produce the
2026-08-19 mail; that came from the Worker.

## Verifying it, next time

Compare the newest entry in `public/reviews.json` against the newest
notification mail. **Do not** treat a mail as proof: it is sent before the
commit, which is exactly how this stayed invisible for seven weeks.

## Related

- [business-facts.md](business-facts.md) — the review count and average as
  facts, and their provenance.
- [aeo-rules.md](aeo-rules.md) — why the ratings may only assert what the page
  displays.
- `docs/anfrage-flows.md` — the sibling `/anfrage` flow through the same Worker.
