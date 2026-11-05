import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

/**
 * Call-to-action link styled as a button. Square corners, no shadows: a
 * solid charcoal block (primary) or a hairline frame (secondary).
 */
export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-3 border px-5 py-2.5 text-small font-medium",
        "transition-colors duration-150 ease-out-quiet",
        variant === "primary"
          ? "border-foreground bg-foreground text-background hover:border-accent hover:bg-accent hover:text-accent-foreground"
          : "border-border-strong text-foreground hover:border-accent hover:text-accent",
        className,
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className="font-mono transition-transform duration-150 ease-out-quiet group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}
