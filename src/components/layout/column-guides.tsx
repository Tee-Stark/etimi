import { cn } from "@/lib/utils";

/**
 * The page's 12-column grid drawn as hairlines, with column indices at the
 * top like a layout ruler. Placed absolutely inside a <Container> so its
 * columns coincide exactly with `lg:grid-cols-12 gap-x-6` content. Shown
 * from the large breakpoint, where the 12-column grid applies. Decorative.
 */
export function ColumnGuides({ className, indices = true }: { className?: string; indices?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 right-5 left-5 hidden grid-cols-12 gap-x-6 sm:right-8 sm:left-8 lg:right-12 lg:left-12 lg:grid",
        className,
      )}
    >
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} className="border-l border-grid last:border-r">
          {indices ? (
            <span className="annot block pt-3 pl-1.5 text-faint">{String(i + 1).padStart(2, "0")}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
