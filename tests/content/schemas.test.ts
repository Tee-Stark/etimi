import { describe, expect, it } from "vitest";
import { isoDateSchema, partialDateSchema, slugSchema } from "@/content/schemas/common";
import { caseStudySchema, noteSchema, roleSchema, siteSchema, talkSchema } from "@/content/schemas/entities";
import { metricSchema } from "@/content/schemas/metric";
import { base, baseSite } from "../support/content-tree";

describe("common fields", () => {
  it("accepts URL-safe slugs and rejects others", () => {
    expect(slugSchema.safeParse("loan-details-api").success).toBe(true);
    for (const bad of ["Loan", "loan_details", "-x", "x-", "a--b", "a b", ""]) {
      expect(slugSchema.safeParse(bad).success, bad).toBe(false);
    }
  });

  it("validates ISO dates, including impossible calendar dates", () => {
    expect(isoDateSchema.safeParse("2026-11-04").success).toBe(true);
    expect(isoDateSchema.safeParse("2026-02-30").success).toBe(false);
    expect(isoDateSchema.safeParse("2026-11").success).toBe(false);
  });

  it("allows partial dates at the precision known", () => {
    for (const ok of ["2023", "2024-11", "2024-11-01"]) expect(partialDateSchema.safeParse(ok).success, ok).toBe(true);
    for (const bad of ["2024-13", "24-11", "Nov 2024"]) expect(partialDateSchema.safeParse(bad).success, bad).toBe(false);
  });

  it("requires visibility to be explicit", () => {
    const { visibility: _v, ...withoutVisibility } = base("x", { organisation: "Org", role: "Engineer" });
    void _v;
    expect(roleSchema.safeParse(withoutVisibility).success).toBe(false);
  });

  it("rejects unknown keys", () => {
    const result = roleSchema.safeParse({ ...base("x"), organisation: "Org", role: "Engineer", sallary: 1 });
    expect(result.success).toBe(false);
  });

  it("rejects empty required strings", () => {
    expect(roleSchema.safeParse({ ...base("x"), title: "  ", organisation: "Org", role: "Engineer" }).success).toBe(false);
  });

  it("rejects threads outside the three allowed values", () => {
    expect(roleSchema.safeParse({ ...base("x", { threads: ["marketing"] }), organisation: "O", role: "R" }).success).toBe(false);
  });
});

describe("role dates", () => {
  const role = (extra: Record<string, unknown>) => roleSchema.parse({ ...base("x"), organisation: "Org", role: "Engineer", ...extra });

  it("distinguishes current (null), unknown (omitted) and known end dates", () => {
    expect(role({ start: "2024-11", end: null }).end).toBeNull();
    expect(role({ start: "2024-11" }).end).toBeUndefined();
    expect(role({ start: "2024-09", end: "2024-10" }).end).toBe("2024-10");
    expect(role({}).start).toBeUndefined();
  });
});

describe("metrics", () => {
  it("requires `cleared` to be stated explicitly", () => {
    expect(metricSchema.safeParse({ label: "L", value: "V", kind: "measured" }).success).toBe(false);
    expect(metricSchema.safeParse({ label: "L", value: "V", kind: "measured", cleared: false }).success).toBe(true);
  });

  it("only accepts measured or expected", () => {
    expect(metricSchema.safeParse({ label: "L", value: "V", kind: "estimated", cleared: false }).success).toBe(false);
  });

  it("is validated inside case studies", () => {
    const result = caseStudySchema.safeParse({ ...base("x"), status: "completed", metrics: [{ label: "L", value: "V", kind: "measured" }] });
    expect(result.success).toBe(false);
  });
});

describe("notes", () => {
  it("requires an explicit draft flag", () => {
    expect(noteSchema.safeParse({ ...base("x"), date: "2026-11-04" }).success).toBe(false);
    expect(noteSchema.safeParse({ ...base("x"), date: "2026-11-04", draft: true }).success).toBe(true);
  });
});

describe("links", () => {
  it("lets hidden links have empty URLs but not public ones", () => {
    const talk = (url: string, visibility: string) =>
      talkSchema.safeParse({ ...base("x"), event: "E", date: "2026-10", format: "talk", stage: "delivered", abstract: "A", links: { slides: { url, visibility } } });
    expect(talk("", "hidden").success).toBe(true);
    expect(talk("", "public").success).toBe(false);
    expect(talk("https://example.com/s", "public").success).toBe(true);
  });
});

describe("site", () => {
  it("accepts the baseline profile and requires exactly three threads", () => {
    expect(siteSchema.safeParse(baseSite).success).toBe(true);
    expect(siteSchema.safeParse({ ...baseSite, threads: baseSite.threads.slice(0, 2) }).success).toBe(false);
  });

  it("requires a valid address for a public email", () => {
    expect(siteSchema.safeParse({ ...baseSite, email: { address: "not-an-email", visibility: "public" } }).success).toBe(false);
    expect(siteSchema.safeParse({ ...baseSite, email: { address: "", visibility: "hidden" } }).success).toBe(true);
  });
});
