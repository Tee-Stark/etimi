import { describe, expect, it } from "vitest";
import { configuredSiteUrl, siteUrlProblem } from "@/lib/site-url";

describe("site URL", () => {
  it("prefers NEXT_PUBLIC_SITE_URL, then Netlify's URL, never guesses", () => {
    expect(configuredSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://a.example", NETLIFY: "true", URL: "https://b.netlify.app" })).toBe("https://a.example");
    expect(configuredSiteUrl({ NETLIFY: "true", URL: "https://b.netlify.app" })).toBe("https://b.netlify.app");
    expect(configuredSiteUrl({ URL: "https://not-netlify.example" })).toBeUndefined();
    expect(configuredSiteUrl({})).toBeUndefined();
  });

  it("accepts only an https origin", () => {
    expect(siteUrlProblem("https://example.org")).toBeNull();
    expect(siteUrlProblem(undefined)).not.toBeNull();
    expect(siteUrlProblem("http://example.org")).toMatch(/https/);
    expect(siteUrlProblem("https://localhost:3000")).toMatch(/localhost/);
    expect(siteUrlProblem("https://example.org/path")).toMatch(/origin/);
    expect(siteUrlProblem("not a url")).toMatch(/valid/);
  });
});
