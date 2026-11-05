import type { ReactNode } from "react";
import { primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { ColumnGuides } from "./column-guides";
import { Container } from "./container";

type PageHeaderProps = {
  /** The page's top-level path, used to number the page like a chapter (e.g. "/work" → 01). */
  section?: string;
  /** Small label above the title, e.g. "Case study" or "Research". */
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Optional subtitle set under the title (e.g. a paper's full title). */
  subtitle?: ReactNode;
  lede?: ReactNode;
  /** Metadata line or labels under the lede. */
  meta?: ReactNode;
  /** Set the title in the display serif (index pages) or the sans (long titles). */
  titleStyle?: "display" | "sans";
  children?: ReactNode;
};

/**
 * Page opener in the manuscript style: chapter number and label on the
 * column grid, a large title, a short lede, and a metadata rail.
 */
export function PageHeader({ section, eyebrow, title, subtitle, lede, meta, titleStyle = "display", children }: PageHeaderProps) {
  const index = section ? primaryNav.findIndex((item) => item.href === section) : -1;
  const label = index >= 0 ? primaryNav[index].label : null;
  // Show the eyebrow only when it adds something beyond the section name.
  const extra = eyebrow && eyebrow !== label ? eyebrow : null;

  return (
    <header className="relative border-b border-border">
      <Container className="relative">
        <ColumnGuides />
        <div className="relative grid grid-cols-1 gap-x-6 pt-16 pb-14 sm:pt-20 lg:grid-cols-12 lg:pt-24 lg:pb-16">
          <p className="label flex flex-wrap gap-x-3 text-muted-foreground lg:col-span-12">
            {index >= 0 ? (
              <span aria-hidden="true" className="text-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            ) : null}
            {label && extra ? <span>{label}</span> : null}
            {label && extra ? (
              <span aria-hidden="true" className="text-faint">
                /
              </span>
            ) : null}
            <span>{extra ?? label ?? eyebrow}</span>
          </p>
          <h1
            className={cn(
              "mt-8 lg:col-span-10",
              titleStyle === "display" ? "display text-h1" : "text-h2 font-medium tracking-tight",
            )}
          >
            {title}
          </h1>
          {subtitle ? <p className="mt-4 max-w-[52ch] text-lede text-muted-foreground lg:col-span-9">{subtitle}</p> : null}
          {lede ? <div className="mt-8 max-w-measure text-lede lg:col-span-7">{lede}</div> : null}
          {meta ? <div className="mt-8 lg:col-span-12">{meta}</div> : null}
          {children ? <div className="mt-8 lg:col-span-12">{children}</div> : null}
        </div>
      </Container>
    </header>
  );
}
