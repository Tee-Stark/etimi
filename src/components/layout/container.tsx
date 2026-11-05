import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = {
  children: ReactNode;
  /** `content`: page grid width. `measure`: long-form reading width. */
  size?: "content" | "measure";
  as?: ElementType;
  className?: string;
};

/** Horizontally centred content column with responsive gutters. */
export function Container({ children, size = "content", as: Tag = "div", className }: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-12",
        size === "content" ? "max-w-content" : "max-w-[calc(var(--container-measure)+6rem)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

type SectionProps = {
  children: ReactNode;
  className?: string;
  /** id of the heading that labels this section. */
  labelledBy?: string;
  /** Draw the section rule above the content. */
  rule?: boolean;
};

/** Vertical rhythm for page sections: consistent spacing, optional rule. */
export function Section({ children, className, labelledBy, rule = false }: SectionProps) {
  return (
    <section
      aria-labelledby={labelledBy}
      className={cn("py-16 sm:py-20 lg:py-24", rule && "border-t border-border", className)}
    >
      {children}
    </section>
  );
}
