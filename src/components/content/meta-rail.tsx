import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MetaItem = {
  /** Read by assistive tech; visually hidden unless `showLabels` is set. */
  label: string;
  value: ReactNode;
};

type MetaRailProps = {
  items: MetaItem[];
  showLabels?: boolean;
  className?: string;
};

/**
 * Monospace metadata line: date · status · affiliation · stack.
 * Marked up as a description list so each value keeps its label.
 */
export function MetaRail({ items, showLabels = false, className }: MetaRailProps) {
  const visible = items.filter((item) => item.value !== null && item.value !== undefined && item.value !== "");
  if (visible.length === 0) return null;

  return (
    <dl className={cn("label flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground", className)}>
      {visible.map((item, i) => (
        <div key={item.label} className="flex items-center gap-x-2">
          <dt className={showLabels ? "text-foreground" : "sr-only"}>
            {item.label}
            {showLabels ? ":" : null}
          </dt>
          <dd>{item.value}</dd>
          {/* Trailing separator, so a wrapped line never starts with a dot. */}
          {i < visible.length - 1 ? (
            <span aria-hidden="true" className="opacity-60">
              ·
            </span>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
