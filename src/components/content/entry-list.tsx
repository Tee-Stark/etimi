import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
 * Text-first index list, like a table of contents: hairline rules, a
 * monospace margin (number, date, status), the title and its plain-English
 * summary, and a metadata column. No cards.
 */

export function EntryList({ children, className }: { children: ReactNode; className?: string }) {
  return <ol className={cn("border-t border-border", className)}>{children}</ol>;
}

type EntryRowProps = {
  /** Position label, e.g. "01". Decorative. */
  index?: string;
  /** Small monospace items in the margin (date, status label). */
  margin?: ReactNode;
  title: ReactNode;
  /** Detail page. When present the whole row is clickable, but only the title is a link. */
  href?: string;
  summary?: ReactNode;
  /** Right-hand column: metadata, stack, organisation. */
  aside?: ReactNode;
  /** Extra content under the summary (highlights, links). */
  children?: ReactNode;
  id?: string;
  /** Heading level for the title, to keep the document outline correct. */
  as?: "h2" | "h3";
};

export function EntryRow({ index, margin, title, href, summary, aside, children, id, as: Heading = "h3" }: EntryRowProps) {
  return (
    <li id={id} className="group relative grid scroll-mt-6 grid-cols-1 gap-x-6 gap-y-3 border-b border-border py-7 lg:grid-cols-12">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2 lg:col-span-2 lg:flex-col lg:gap-y-3">
        {index ? (
          <span aria-hidden="true" className="annot text-faint">
            {index}
          </span>
        ) : null}
        {margin}
      </div>

      <div className="lg:col-span-6">
        <Heading className="text-h3 font-medium tracking-tight">
          {href ? (
            <Link
              href={href}
              className="decoration-accent underline-offset-[0.22em] after:absolute after:inset-0 after:content-[''] group-hover:underline"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </Heading>
        {summary ? <p className="mt-2 max-w-measure text-muted-foreground">{summary}</p> : null}
        {children ? <div className="relative mt-4">{children}</div> : null}
      </div>

      {aside ? <div className="relative lg:col-span-4">{aside}</div> : null}
    </li>
  );
}
