import { describe, expect, it } from "vitest";
import { isUnknownDetailPath } from "@/lib/route-manifest";

const manifest = { work: ["loan-details-api"], research: ["hauv"], writing: [] };

describe("isUnknownDetailPath", () => {
  it("allows published detail slugs", () => {
    expect(isUnknownDetailPath("/work/loan-details-api", manifest)).toBe(false);
    expect(isUnknownDetailPath("/research/hauv/", manifest)).toBe(false);
  });

  it("flags unknown or hidden slugs, extra segments and malformed encodings", () => {
    expect(isUnknownDetailPath("/work/nope", manifest)).toBe(true);
    expect(isUnknownDetailPath("/writing/_", manifest)).toBe(true);
    expect(isUnknownDetailPath("/research/hauv/extra", manifest)).toBe(true);
    expect(isUnknownDetailPath("/work/%E0%A4%A", manifest)).toBe(true);
  });

  it("never flags index pages or other sections", () => {
    expect(isUnknownDetailPath("/work", manifest)).toBe(false);
    expect(isUnknownDetailPath("/about", manifest)).toBe(false);
    expect(isUnknownDetailPath("/projects/anything", manifest)).toBe(false);
  });
});
