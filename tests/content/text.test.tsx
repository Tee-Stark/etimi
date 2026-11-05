import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { formatDateRange, formatPartialDate } from "@/lib/dates";
import { extractHeadings } from "@/lib/headings";
import { renderMarkdown } from "@/lib/markdown";
import { readingTime } from "@/lib/reading-time";

describe("dates", () => {
  it("formats at the recorded precision", () => {
    expect(formatPartialDate("2023")).toBe("2023");
    expect(formatPartialDate("2024-11")).toBe("Nov 2024");
    expect(formatPartialDate("2024-11", { long: true })).toBe("November 2024");
    expect(formatPartialDate("2026-11-04")).toBe("4 Nov 2026");
  });

  it("formats current, known and unknown ranges without guessing", () => {
    expect(formatDateRange("2024-11", null)).toBe("Nov 2024 – present");
    expect(formatDateRange("2024-09", "2024-10")).toBe("Sep – Oct 2024");
    expect(formatDateRange("2022-11", "2023-03")).toBe("Nov 2022 – Mar 2023");
    expect(formatDateRange(undefined, "2023")).toBe("until 2023");
    expect(formatDateRange("2022-11", undefined)).toBe("from Nov 2022");
    expect(formatDateRange(undefined, undefined)).toBeNull();
  });
});

describe("headings", () => {
  it("extracts h2/h3 with ids matching rehype-slug, skipping code blocks", () => {
    const md = "# Title\n\n## The problem\n\n```\n## not a heading\n```\n\n### Why it's *interesting*\n\n## The problem\n";
    expect(extractHeadings(md)).toEqual([
      { depth: 2, text: "The problem", id: "the-problem" },
      { depth: 3, text: "Why it's interesting", id: "why-its-interesting" },
      { depth: 2, text: "The problem", id: "the-problem-1" },
    ]);
  });
});

describe("reading time", () => {
  it("is at least one minute and grows with length", () => {
    expect(readingTime("Short.").minutes).toBe(1);
    expect(readingTime(Array(1100).fill("word").join(" ")).minutes).toBe(5);
  });
});

describe("markdown rendering", () => {
  it("renders GFM, footnotes, KaTeX and heading ids for .md", async () => {
    const md = "## Signal model\n\nA claim[^1] with $x(t)$.\n\n$$\nX = WH\n$$\n\n| a | b |\n|---|---|\n| 1 | 2 |\n\n[^1]: A footnote.\n";
    const html = renderToStaticMarkup(await renderMarkdown(md, { format: "md" }));
    expect(html).toContain('id="signal-model"');
    expect(html).toContain("<table>");
    expect(html).toContain('class="katex"');
    expect(html).toContain("<math");
    expect(html).toMatch(/data-footnotes/);
  });

  it("does not execute JSX in plain .md files", async () => {
    const html = renderToStaticMarkup(await renderMarkdown("Hello <Widget />", { format: "md" }));
    expect(html).not.toContain("Widget />");
    expect(html).toContain("Hello");
  });

  it("renders provided components in .mdx", async () => {
    const Callout = ({ children }: { children: React.ReactNode }) => <aside data-test="callout">{children}</aside>;
    const html = renderToStaticMarkup(await renderMarkdown("<Callout>Note</Callout>", { format: "mdx", components: { Callout } }));
    expect(html).toContain('data-test="callout"');
  });
});
