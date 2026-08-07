// Prebuild: turn a shallow clone into a full one, so the sitemap can read real
// per-file commit dates.
//
// Cloudflare Pages clones the repo shallow, which leaves every path resolving
// to the same single commit. scripts/git-lastmod.mjs detects that and emits no
// <lastmod> at all rather than 23 identical dates — safe, but it also means no
// freshness signal ships. Fetching the history here fixes it in the repo, so it
// works without anyone remembering to change the build command in the
// Cloudflare dashboard.
//
// Everything here is best-effort. A failure to fetch is not a failure to build:
// the sitemap simply falls back to omitting lastmod.
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));

function git(...args) {
  return execFileSync("git", args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

try {
  if (git("rev-parse", "--is-shallow-repository") !== "true") {
    // Normal local case: full history already. `--unshallow` would error here.
    process.exit(0);
  }

  console.log("[prebuild] shallow clone — fetching full history for sitemap lastmod");
  git("fetch", "--unshallow");
  console.log("[prebuild] history fetched");
} catch (error) {
  console.warn(
    "[prebuild] could not fetch full history — the sitemap will ship without " +
      "<lastmod>. Build continues.\n         ",
    error instanceof Error ? error.message.trim() : error,
  );
}
