/*
 * Runs first in `build`. Production deploys must have a real https origin for
 * canonical URLs, sitemap, RSS, Open Graph and JSON-LD. Enforced on Vercel
 * production deploys (VERCEL_ENV=production) or when REQUIRE_SITE_URL=1;
 * local builds only warn and use localhost (PLAN.md Q30).
 */
import { configuredSiteUrl, siteUrlProblem } from "../src/lib/site-url";

const required = process.env.VERCEL_ENV === "production" || process.env.REQUIRE_SITE_URL === "1";
const value = configuredSiteUrl();
const problem = siteUrlProblem(value);

if (problem && required) {
  console.error(`\n✗ ${problem}. Set NEXT_PUBLIC_SITE_URL to the site's real origin.\n`);
  process.exit(1);
}
if (problem) {
  console.warn(`! ${problem}: canonical URLs, sitemap and feeds will use http://localhost:3000 (fine locally).`);
} else {
  const source = process.env.NEXT_PUBLIC_SITE_URL?.trim() ? "NEXT_PUBLIC_SITE_URL" : "production domain";
  console.log(`✓ Site URL (${source}): ${value}`);
}
