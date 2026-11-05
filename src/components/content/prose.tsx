import "katex/dist/katex.min.css";

import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";

/*
 * Rendered Markdown/MDX in the manuscript style (`.prose` in globals.css).
 * Element overrides:
 *   a      internal paths use client-side navigation; external links are
 *          plain anchors (same tab) with safe rel
 *   pre    focusable, so its horizontal scroll works from the keyboard
 *   table  wrapped in a focusable, labelled scroll container
 * KaTeX's stylesheet is imported here, so only pages with prose load it.
 */

function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...rest} {...(external ? { rel: "noopener noreferrer" } : {})}>
      {children}
    </a>
  );
}

function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return <pre tabIndex={0} {...props} />;
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label="Table (scrolls horizontally)">
      <table {...props} />
    </div>
  );
}

const components = { a: Anchor, pre: Pre, table: Table };

type ProseProps = {
  source: string;
  format: "md" | "mdx";
  className?: string;
};

export async function Prose({ source, format, className }: ProseProps) {
  if (!source.trim()) return null;
  const content = await renderMarkdown(source, { format, components });
  return <div className={cn("prose", className)}>{content}</div>;
}
