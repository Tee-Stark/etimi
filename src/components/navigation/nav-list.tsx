import Link from "next/link";
import { isActivePath, type NavItem } from "@/config/navigation";
import { cn } from "@/lib/utils";

type NavListProps = {
  items: readonly NavItem[];
  /** Current pathname, or null when unknown (no active item shown). */
  pathname: string | null;
  orientation: "horizontal" | "vertical";
  onNavigate?: () => void;
  className?: string;
};

/**
 * Presentational nav list. The current page carries aria-current and a short
 * signal-coloured bar over its label (the vinculum, marking position).
 * Vertical lists are numbered like a table of contents.
 */
export function NavList({ items, pathname, orientation, onNavigate, className }: NavListProps) {
  const horizontal = orientation === "horizontal";

  return (
    <ul className={cn(horizontal ? "flex items-center gap-x-0.5" : "flex flex-col", className)}>
      {items.map((item, i) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "group relative inline-flex items-center transition-colors duration-150",
                horizontal
                  ? "min-h-11 px-2.5 text-small"
                  : "min-h-12 w-full items-baseline gap-4 border-b border-border py-3 text-lede",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {!horizontal ? (
                <span aria-hidden="true" className="annot w-6 text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
              ) : null}
              <span className="relative">
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -top-1.5 left-0 h-[1.5px] transition-[width,background-color] duration-200 ease-out-quiet",
                    active ? "w-full bg-accent" : "w-0 bg-border-strong group-hover:w-full",
                  )}
                />
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
