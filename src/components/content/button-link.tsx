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
 * Call-to-action link. Square, hairline, no shadow. Primary is outlined in
 * the signal colour and fills with it on hover; secondary is a neutral frame.
 */
export function ButtonLink({ href, children, variant = "primary", className }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex min-h-11 items-center gap-3 border px-4 py-2 text-small font-medium",
        "transition-colors duration-150 ease-out-quiet",
        variant === "primary"
          ? "border-accent text-foreground hover:bg-accent hover:text-accent-foreground"
          : "border-border-strong text-foreground hover:border-foreground",
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="font-mono transition-transform duration-150 ease-out-quiet group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  );
}
