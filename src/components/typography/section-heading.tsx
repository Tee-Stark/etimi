import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Paper-style section number, e.g. "01". Decorative for assistive tech. */
  index?: string;
  /** Short monospace label shown beside the number. */
  eyebrow?: string;
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  /** Optional trailing content (e.g. a "see all" link). */
  aside?: ReactNode;
};

/**
 * Numbered section heading. The heading text carries a vinculum: a bar drawn
 * over it, spanning exactly the width of the words.
 */
export function SectionHeading({
  index,
  eyebrow,
  children,
  as: Tag = "h2",
  id,
  className,
  aside,
}: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-x-6 gap-y-3", className)}>
      <div className="min-w-0">
        {index || eyebrow ? (
          <p className="meta mb-4 flex gap-3 text-muted-foreground">
            {index ? (
              <span aria-hidden="true" className="text-accent">
                {index}
              </span>
            ) : null}
            {eyebrow ? <span>{eyebrow}</span> : null}
          </p>
        ) : null}
        <Tag
          id={id}
          className={cn(
            "inline-block border-t-2 border-accent pt-3",
            Tag === "h1" ? "text-h1" : Tag === "h2" ? "text-h2" : "text-h3",
          )}
        >
          {children}
        </Tag>
      </div>
      {aside ? <div className="shrink-0">{aside}</div> : null}
    </div>
  );
}
