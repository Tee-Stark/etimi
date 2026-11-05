import type { ReactNode } from "react";
import { SectionHeading } from "@/components/typography/section-heading";
import { cn } from "@/lib/utils";
import { Container } from "./container";

type PageSectionProps = {
  id: string;
  /** Section number, e.g. "§1". */
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A numbered page section: hairline, section number, heading, then content. */
export function PageSection({ id, index, eyebrow, title, aside, children, className }: PageSectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={cn("scroll-mt-6 py-14 sm:py-16 lg:py-20", className)}>
      <Container>
        <SectionHeading id={`${id}-heading`} index={index} eyebrow={eyebrow} aside={aside}>
          {title}
        </SectionHeading>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
