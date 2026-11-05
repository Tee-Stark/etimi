import { Container, Section } from "@/components/layout/container";
import { SectionHeading } from "@/components/typography/section-heading";
import { VinculumBar } from "@/components/vinculum/vinculum";

export type Thread = {
  id: "engineering" | "research" | "creation";
  label: string;
  description: string;
};

const NUMERALS = ["I", "II", "III"];

/**
 * The three organising threads. A single vinculum spans all three columns:
 * the bar that binds separate terms into one expression.
 */
export function Threads({ threads }: { threads: Thread[] }) {
  return (
    <Section labelledBy="threads-heading" rule>
      <Container>
        <SectionHeading id="threads-heading" index="01" eyebrow="Overview">
          Three threads
        </SectionHeading>

        <div className="mt-12">
          <VinculumBar className="hidden w-full md:block" />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8 md:pt-8">
            {threads.map((thread, i) => (
              <li key={thread.id} id={`thread-${thread.id}`} className="border-t-2 border-accent pt-6 md:border-t-0 md:pt-0">
                <p aria-hidden="true" className="meta text-accent">
                  {NUMERALS[i]}
                </p>
                <h3 className="mt-3 text-h3">{thread.label}</h3>
                <p className="mt-3 max-w-[34ch] text-muted-foreground">{thread.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
