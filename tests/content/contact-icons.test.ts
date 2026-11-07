import { describe, expect, it } from "vitest";
import { contactIconFor } from "@/components/brand/contact-icons";
import { displayHandle } from "@/components/content/contact-list";

describe("contact glyphs", () => {
  it("picks the glyph from the URL host", () => {
    expect(contactIconFor("mailto:hi@etimi.me")).toBe("email");
    expect(contactIconFor("https://github.com/tee-stark")).toBe("github");
    expect(contactIconFor("https://x.com/t_starkx")).toBe("x");
    expect(contactIconFor("https://linkedin.com/in/timmyomolana")).toBe("linkedin");
    expect(contactIconFor("https://someone.substack.com")).toBe("substack");
    expect(contactIconFor("https://www.instagram.com/someone")).toBe("instagram");
    expect(contactIconFor("https://example.com")).toBe("link");
  });

  it("shows readable handles", () => {
    expect(displayHandle("https://www.makeuseof.com/author/x/")).toBe("makeuseof.com/author/x");
    expect(displayHandle("mailto:hi@etimi.me")).toBe("hi@etimi.me");
  });
});
