import { describe, expect, it } from "vitest";
import { configuredSiteUrl, PRODUCTION_ORIGIN, siteUrlProblem } from "@/lib/site-url";

describe("site URL", () => {
  it("prefers NEXT_PUBLIC_SITE_URL, then the production domain on Vercel, never guesses locally", () => {
    expect(configuredSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://a.example", VERCEL: "1" })).toBe("https://a.example");
    expect(configuredSiteUrl({ VERCEL: "1", VERCEL_ENV: "preview" })).toBe(PRODUCTION_ORIGIN);
    expect(configuredSiteUrl({})).toBeUndefined();
    expect(PRODUCTION_ORIGIN).toBe("https://etimi.me");
  });

  it("accepts only an https origin", () => {
    expect(siteUrlProblem(PRODUCTION_ORIGIN)).toBeNull();
    expect(siteUrlProblem(undefined)).not.toBeNull();
    expect(siteUrlProblem("http://example.org")).toMatch(/https/);
    expect(siteUrlProblem("https://localhost:3000")).toMatch(/localhost/);
    expect(siteUrlProblem("https://example.org/path")).toMatch(/origin/);
    expect(siteUrlProblem("not a url")).toMatch(/valid/);
  });
});
