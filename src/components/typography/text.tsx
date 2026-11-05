import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type TextProps = { children: ReactNode; className?: string };

/** Monospace uppercase label for metadata above headings. */
export function Eyebrow({ children, className }: TextProps) {
  return <p className={cn("label text-muted-foreground", className)}>{children}</p>;
}

/** Introductory paragraph in the editorial serif. */
export function Lede({ children, className }: TextProps) {
  return <p className={cn("max-w-measure text-lede", className)}>{children}</p>;
}

/** Plain body copy constrained to a readable measure. */
export function Body({ children, className }: TextProps) {
  return <div className={cn("max-w-measure space-y-5", className)}>{children}</div>;
}
