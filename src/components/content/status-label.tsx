import { cn } from "@/lib/utils";

/*
 * Consistent status vocabulary (IMPLEMENTATION_SPEC.md §6.7). The status is
 * always spelled out in text; colour and the leading glyph are reinforcement
 * only, never the sole signal.
 */

export const STATUS_LABELS = {
  shipped: "Shipped",
  active: "Active",
  "in-development": "In development",
  completed: "Completed",
  exploration: "Exploration",
  archived: "Archived",
  "expected-impact": "Expected impact",
  measured: "Measured",
  hidden: "Hidden — development only",
} as const;

export type StatusKey = keyof typeof STATUS_LABELS;

const GLYPH: Record<StatusKey, string> = {
  shipped: "■",
  active: "●",
  "in-development": "◐",
  completed: "■",
  exploration: "○",
  archived: "□",
  "expected-impact": "△",
  measured: "▲",
  hidden: "×",
};

type StatusLabelProps = {
  status: StatusKey;
  className?: string;
};

export function StatusLabel({ status, className }: StatusLabelProps) {
  const emphasised = status === "active" || status === "in-development" || status === "hidden";
  return (
    <span
      className={cn(
        "label inline-flex items-center gap-1.5 border px-1.5 py-0.5 whitespace-nowrap",
        emphasised ? "border-accent text-accent" : "border-border text-muted-foreground",
        status === "hidden" && "bg-accent text-accent-foreground",
        className,
      )}
    >
      <span aria-hidden="true" className="text-[0.85em] leading-none">
        {GLYPH[status]}
      </span>
      {STATUS_LABELS[status]}
    </span>
  );
}
