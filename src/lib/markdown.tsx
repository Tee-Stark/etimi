import "server-only";

import { evaluate } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import * as runtime from "react/jsx-runtime";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import type { ContentFormat } from "@/content/loader";

/*
 * Markdown/MDX → React, at build time, on the server.
 *
 *   remark-gfm    tables, footnotes, strikethrough, autolinks, task lists
 *   remark-math   $inline$ and $$display$$ maths …
 *   rehype-katex  … typeset by KaTeX into static HTML + MathML (no client JS)
 *   rehype-slug   stable heading ids, matching `extractHeadings` below
 *
 * `.md` files are compiled as plain Markdown (no JSX, no imports); `.mdx`
 * files may use the components passed in. Content is trusted, reviewed
 * source in this repository; nothing user-submitted is ever compiled.
 * Pages that render maths import "katex/dist/katex.min.css".
 */

type HastNode = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: HastNode[] };

/**
 * Display equations scroll sideways on narrow screens, so they must be
 * reachable by keyboard: give each one a tab stop and an accessible name.
 */
function rehypeFocusableMath() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      const cls = node.properties?.className;
      if (node.type === "element" && Array.isArray(cls) && cls.includes("katex-display")) {
        node.properties = { ...node.properties, tabIndex: 0, role: "group", ariaLabel: "Equation (scrolls horizontally)" };
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

export async function renderMarkdown(
  source: string,
  { format, components = {} }: { format: ContentFormat; components?: MDXComponents },
) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    format,
    development: false,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, [rehypeKatex, { output: "htmlAndMathml", throwOnError: true }], rehypeFocusableMath],
  });
  return <Content components={components} />;
}
