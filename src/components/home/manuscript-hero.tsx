import Link from "next/link";
import { ButtonLink } from "@/components/content/button-link";
import { SignalTrace } from "@/components/figures/signal-trace";
import { ColumnGuides } from "@/components/layout/column-guides";
import { Container } from "@/components/layout/container";
import type { Thread } from "@/content/types";
import { cn } from "@/lib/utils";
import { mixturePath, threadSignals } from "./thread-signals";

/*
 * Home hero: "Manuscript, with figure".
 *
 * The three threads are typeset as a staircase of display lines, each
 * carrying its own source signal, footnoted with evidence. Beneath them,
 * Fig. 1 draws the sum of the three signals: one mixture, x(t). The visible
 * column grid, margin line numbers, figure caption and footnotes come from
 * the conventions of a typeset research paper.
 */

type ManuscriptHeroProps = {
  name: string;
  title: string;
  location: string;
  coordinates: string;
  positioning: string;
  intro: string;
  threads: Thread[];
};

/* Staircase placement on the 12-column grid (large screens only). */
const PLACEMENT: Record<Thread["id"], { line: string; traceFirst: boolean }> = {
  engineering: { line: "lg:col-start-1 lg:col-end-13", traceFirst: false },
  research: { line: "lg:col-start-3 lg:col-end-13", traceFirst: false },
  creation: { line: "lg:col-start-1 lg:col-end-11", traceFirst: true },
};

const TICKS = [
  { at: 0, label: "t = 0" },
  { at: 0.25, label: "¼" },
  { at: 0.5, label: "½" },
  { at: 0.75, label: "¾" },
  { at: 1, label: "1" },
];

export function ManuscriptHero({ name, title, location, coordinates, positioning, intro, threads }: ManuscriptHeroProps) {
  const lastIndex = threads.length - 1;

  return (
    <section aria-labelledby="hero-name" className="relative border-b border-border">
      <Container className="relative">
        <ColumnGuides />

        <div className="relative grid grid-cols-1 gap-x-6 pt-14 pb-16 sm:pt-20 lg:grid-cols-12 lg:pt-24 lg:pb-24">
          {/* Byline */}
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 lg:col-span-12">
            <h1 id="hero-name" className="text-h3 font-medium tracking-tight">
              {name}
            </h1>
            <p className="label text-muted-foreground">{title}</p>
            <p className="label text-muted-foreground lg:ml-auto">
              {location} <span className="text-faint">·</span> {coordinates}
            </p>
          </div>

          {/* The three threads, each with its source signal */}
          <p className="display mt-14 text-display sm:mt-20 lg:col-span-12">
            {threads.map((thread, i) => {
              const signal = threadSignals[thread.id];
              const place = PLACEMENT[thread.id];
              const word = i === lastIndex ? `& ${thread.label}.` : `${thread.label},`;
              return (
                <span key={thread.id} className="grid grid-cols-1 gap-x-6 lg:grid-cols-12">
                  <span className={cn("relative flex items-center gap-[0.18em]", place.line)}>
                    <span aria-hidden="true" className="annot absolute top-[0.35em] -left-10 hidden text-faint lg:block">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="shrink-0 whitespace-nowrap">
                      {word}
                      {/* Footnote marker at cap height: offset in display ems, then set small. */}
                      <span className="relative -top-[0.58em] ml-[0.06em] align-baseline">
                        <a
                          href={`#note-${thread.id}`}
                          className="annot text-accent hover:underline"
                          aria-label={`Note ${i + 1}: ${thread.label}`}
                        >
                          {i + 1}
                        </a>
                      </span>
                    </span>
                    <span className={cn("relative min-w-0 flex-1", place.traceFirst && "lg:order-first lg:mr-[0.18em]")}>
                      {/* Symbol sits at the far end of the trace, away from the footnote marker. */}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "annot absolute bottom-full mb-1.5 leading-none text-muted-foreground not-italic",
                          place.traceFirst ? "right-0 lg:right-auto lg:left-0" : "right-0",
                        )}
                      >
                        <span className="math text-[1.15em] text-foreground">s</span>
                        <sub>{signal.symbol}</sub>
                      </span>
                      <SignalTrace d={signal.path} className="h-[0.36em]" axis={false} />
                    </span>
                  </span>
                </span>
              );
            })}
          </p>

          {/* Fig. 1: the sum */}
          <figure className="mt-14 sm:mt-16 lg:col-span-12">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <p aria-hidden="true" className="annot text-muted-foreground">
                <span className="math text-lg text-foreground">x</span>(<span className="math text-lg text-foreground">t</span>) ={" "}
                {threads.map((thread, i) => (
                  <span key={thread.id}>
                    <span className="math text-lg text-foreground">s</span>
                    <sub>{threadSignals[thread.id].symbol}</sub>
                    {i < lastIndex ? " + " : ""}
                  </span>
                ))}
              </p>
              <p aria-hidden="true" className="label text-faint">
                Sum of sources
              </p>
            </div>

            <SignalTrace
              d={mixturePath}
              strokeClassName="stroke-accent"
              guides={[0.25, 0.5, 0.75]}
              className="mt-3 h-20 sm:h-28"
            />

            <div aria-hidden="true" className="annot relative mt-2 h-4 text-faint">
              {TICKS.map((tick) => (
                <span
                  key={tick.at}
                  className={cn(
                    "absolute top-0",
                    tick.at === 0 ? "left-0" : tick.at === 1 ? "right-0" : "-translate-x-1/2",
                  )}
                  style={tick.at > 0 && tick.at < 1 ? { left: `${tick.at * 100}%` } : undefined}
                >
                  {tick.label}
                </span>
              ))}
            </div>

            <figcaption className="annot mt-5 max-w-measure text-muted-foreground">
              <span className="text-foreground">Fig. 1</span> — Each thread drawn as a signal: a square wave for
              engineering, a wave packet for research, frequency modulation for creation. Their sum,{" "}
              <span className="math text-sm text-foreground">x</span>(<span className="math text-sm text-foreground">t</span>), is the
              whole.
            </figcaption>
          </figure>

          {/* Abstract and notes */}
          <div className="mt-16 border-t border-border pt-8 lg:col-span-5 lg:mt-20">
            <p className="label text-muted-foreground">Abstract</p>
            <p className="mt-4 max-w-measure text-lede">{positioning}</p>
            <p className="mt-4 max-w-measure text-muted-foreground">{intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <ButtonLink href="/work">Explore my work</ButtonLink>
              <Link href="/contact" className="link text-small">
                Get in touch
              </Link>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 lg:col-span-6 lg:col-start-7 lg:mt-20">
            <p className="label text-muted-foreground">Notes</p>
            <ol className="mt-4 divide-y divide-border">
              {threads.map((thread, i) => (
                <li key={thread.id} id={`note-${thread.id}`} className="grid scroll-mt-6 grid-cols-[1.75rem_1fr] gap-x-2 py-4 first:pt-0">
                  <span className="annot pt-0.5 text-muted-foreground">{i + 1}</span>
                  <div>
                    <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <Link href={thread.href} className="link font-medium">
                        {thread.label}
                      </Link>
                      <span className="annot text-faint" aria-hidden="true">
                        {threadSignals[thread.id].kind}
                      </span>
                    </p>
                    <p className="mt-1 text-small text-muted-foreground">{thread.description}</p>
                    <p className="mt-1 text-small">{thread.note}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
