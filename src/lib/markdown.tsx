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

export async function renderMarkdown(
  source: string,
  { format, components = {} }: { format: ContentFormat; components?: MDXComponents },
) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    format,
    development: false,
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeSlug, [rehypeKatex, { output: "htmlAndMathml", throwOnError: true }]],
  });
  return <Content components={components} />;
}
