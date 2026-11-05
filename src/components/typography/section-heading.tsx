import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  /** Paper-style section number, e.g. "§2" or "02". Decorative for assistive tech. */
  index?: string;
  /** Short monospace label beside the number. */
  eyebrow?: string;
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
  /** Optional trailing content (e.g. a "see all" link). */
  aside?: ReactNode;
};

/**
 * Section heading in the manuscript style: a full-width hairline, the section
 * number and label in monospace on the rule, and the heading below. A short
 * solid segment over the number marks the start of the section.
 */
export function SectionHeading({ index, eyebrow, children, as: Tag = "h2", id, className, aside }: SectionHeadingProps) {
  return (
    <div className={cn("border-t border-border", className)}>
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3 pt-3">
        <p className="label flex gap-3 text-muted-foreground">
          {index ? (
            <span aria-hidden="true" className="relative text-foreground">
              <span className="absolute -top-[13px] left-0 h-[1.5px] w-full bg-foreground" />
              {index}
            </span>
          ) : null}
          {eyebrow ? <span>{eyebrow}</span> : null}
        </p>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>
      <Tag id={id} className={cn("mt-6", Tag === "h1" ? "text-h1" : Tag === "h2" ? "text-h2" : "text-h3")}>
        {children}
      </Tag>
    </div>
  );
}
