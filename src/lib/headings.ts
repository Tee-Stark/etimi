import GithubSlugger from "github-slugger";

/*
 * Table-of-contents extraction. Uses the same slug algorithm as rehype-slug
 * (github-slugger), so TOC links match rendered heading ids exactly.
 */

export type Heading = { depth: 2 | 3; text: string; id: string };

/** Plain text of a Markdown heading line: drop emphasis, code, links, inline maths, trailing #s. */
function headingText(raw: string): string {
  return raw
    .replace(/\s+#+\s*$/, "")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\$([^$]+)\$/g, "$1")
    .replace(/(\*\*|__|\*|_|~~)(.+?)\1/g, "$2")
    .trim();
}

export function extractHeadings(markdown: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let fence: string | null = null;

  for (const line of markdown.split("\n")) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)/);
    if (fenceMatch) {
      if (!fence) fence = fenceMatch[1][0];
      else if (fenceMatch[1][0] === fence) fence = null;
      continue;
    }
    if (fence) continue;

    const m = line.match(/^(#{1,6})\s+(.+)$/);
    if (!m) continue;
    const text = headingText(m[2]);
    // Every heading advances the slugger, so duplicate ids are numbered exactly as rehype-slug does.
    const id = slugger.slug(text);
    if (m[1].length === 2 || m[1].length === 3) headings.push({ depth: m[1].length as 2 | 3, text, id });
  }
  return headings;
}
