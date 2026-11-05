import { cn } from "@/lib/utils";

/*
 * The vinculum: in mathematical notation, the horizontal bar drawn over an
 * expression to bind its terms together (as over the repeating digits of a
 * decimal, or the radicand of a square root).
 * Used here as a quiet typographic signature for "connecting things":
 *   - <VinculumBar>   short accent bar above key statements;
 *                     full-width bar spanning the three threads
 *   - <VinculumRule>  section rule that begins with an accent segment
 *   - SectionHeading and NavList draw it as a top border over the words
 * Purely decorative: it never carries meaning on its own.
 */

type VinculumRuleProps = {
  className?: string;
  /** Show the short accent segment at the start of the rule. */
  mark?: boolean;
};

/** Full-width hairline that begins with a short, heavier accent bar. */
export function VinculumRule({ className, mark = true }: VinculumRuleProps) {
  return (
    <div aria-hidden="true" className={cn("relative h-px w-full bg-border", className)}>
      {mark ? <span className="absolute top-[-1px] left-0 h-[3px] w-12 bg-accent" /> : null}
    </div>
  );
}

/** A bare vinculum bar, sized by its container or className. */
export function VinculumBar({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("block h-[2px] bg-accent", className)} />;
}
