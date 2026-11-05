import type { ReactNode } from "react";
import type { PublicMetric } from "@/content/types";
import type { Heading } from "@/lib/headings";
import { cn } from "@/lib/utils";
import { StatusLabel } from "./status-label";

/*
 * Building blocks for detail pages (case studies, research, notes).
 */

/** Development-only banner for hidden/draft entries shown in preview. Never rendered in production. */
export function PreviewBanner({ preview }: { preview: boolean }) {
  if (!preview || process.env.NODE_ENV === "production") return null;
  return (
    <div role="status" className="label border-b border-accent bg-accent px-5 py-2 text-center text-accent-foreground">
      Hidden — development only. This entry is not published.
    </div>
  );
}

/** Numbered table of contents matching the prose's §-numbered sections. */
export function TableOfContents({ headings, className }: { headings: Heading[]; className?: string }) {
  const h2s = headings.filter((h) => h.depth === 2);
  if (h2s.length < 2) return null;
  return (
    <nav aria-label="Contents" className={className}>
      <p className="label mb-3 text-muted-foreground">Contents</p>
      <ol className="space-y-1.5 text-small">
        {h2s.map((h, i) => (
          <li key={h.id} className="flex gap-3">
            <span aria-hidden="true" className="annot w-5 shrink-0 pt-0.5 text-faint">
              §{i + 1}
            </span>
            <a href={`#${h.id}`} className="text-muted-foreground hover:text-accent">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Labelled facts for a sidebar: a description list in monospace labels. */
export function FactList({ items, className }: { items: Array<{ label: string; value: ReactNode }>; className?: string }) {
  const shown = items.filter((i) => i.value !== null && i.value !== undefined && i.value !== "");
  if (shown.length === 0) return null;
  return (
    <dl className={cn("space-y-4", className)}>
      {shown.map((item) => (
        <div key={item.label}>
          <dt className="label text-muted-foreground">{item.label}</dt>
          <dd className="mt-1 text-small">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Inline list of technologies, separated by hairline dots. Plain text, no logos. */
export function StackList({ items, className }: { items: string[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <ul className={cn("annot flex flex-wrap gap-x-2 gap-y-1 text-muted-foreground", className)}>
      {items.map((item, i) => (
        <li key={item} className="flex gap-x-2">
          {item}
          {i < items.length - 1 ? <span aria-hidden="true" className="text-faint">·</span> : null}
        </li>
      ))}
    </ul>
  );
}

/**
 * Published metrics only (the content layer has already removed uncleared
 * ones). Each carries its qualifier; expected impact is always labelled.
 */
export function MetricList({ metrics }: { metrics: PublicMetric[] }) {
  if (metrics.length === 0) return null;
  return (
    <dl className="grid max-w-measure border-t border-l border-border sm:grid-cols-2">
      {metrics.map((m) => (
        <div key={m.label} className="border-r border-b border-border p-5">
          <dt className="text-small text-muted-foreground">{m.label}</dt>
          <dd className="mt-2">
            <span className="display text-h2">{m.value}</span>
            <span className="mt-3 block">
              <StatusLabel status={m.kind === "expected" ? "expected-impact" : "measured"} />
            </span>
            {m.note ? <span className="mt-2 block text-small text-muted-foreground">{m.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A caveat set off with a hairline frame, e.g. "simulation-based, not field-validated". */
export function Notice({ children, label = "Note" }: { children: ReactNode; label?: string }) {
  return (
    <aside className="max-w-measure border border-border-strong p-5">
      <p className="label text-foreground">{label}</p>
      <p className="mt-2 text-small text-muted-foreground">{children}</p>
    </aside>
  );
}

/** A small heading for a group inside a sidebar or section. */
export function GroupLabel({ children, id, as: Tag = "h2" }: { children: ReactNode; id?: string; as?: "h2" | "h3" | "h4" }) {
  return (
    <Tag id={id} className="label text-muted-foreground">
      {children}
    </Tag>
  );
}
