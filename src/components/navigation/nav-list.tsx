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
 * Presentational nav list. The active page is marked with aria-current and a
 * vinculum drawn over its label; hover previews the bar in a quieter tone.
 */
export function NavList({ items, pathname, orientation, onNavigate, className }: NavListProps) {
  const horizontal = orientation === "horizontal";

  return (
    <ul className={cn(horizontal ? "flex items-center gap-x-1" : "flex flex-col", className)}>
      {items.map((item) => {
        const active = isActivePath(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={onNavigate}
              className={cn(
                "group relative inline-flex items-center text-small transition-colors duration-150",
                horizontal ? "min-h-11 px-2.5" : "min-h-12 w-full border-b border-border py-3 text-body",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "border-t-2 pt-1 transition-colors duration-150",
                  active ? "border-accent" : "border-transparent group-hover:border-border",
                )}
              >
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
