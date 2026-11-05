/*
 * pnpm content:check-site-url   (runs before `next build`)
 * Production deploys must have a real https origin for canonical URLs,
 * sitemap, RSS, Open Graph and JSON-LD. Enforced on Netlify production
 * deploys (CONTEXT=production) or when REQUIRE_SITE_URL=1; local builds only
 * warn and use localhost. Netlify's own URL counts as configured (PLAN.md Q28).
 */
import { configuredSiteUrl, siteUrlProblem } from "../src/lib/site-url";

const required = process.env.CONTEXT === "production" || process.env.REQUIRE_SITE_URL === "1";
const value = configuredSiteUrl();
const problem = siteUrlProblem(value);

if (problem && required) {
  console.error(`\n✗ ${problem}. Set NEXT_PUBLIC_SITE_URL to the site's real origin (e.g. https://your-domain.example).\n`);
  process.exit(1);
}
if (problem) {
  console.warn(`! ${problem}: canonical URLs, sitemap and feeds will use http://localhost:3000 (fine locally; production deploys will fail).`);
} else {
  const source = process.env.NEXT_PUBLIC_SITE_URL?.trim() ? "NEXT_PUBLIC_SITE_URL" : "Netlify URL";
  console.log(`✓ Site URL (${source}): ${value}`);
}
