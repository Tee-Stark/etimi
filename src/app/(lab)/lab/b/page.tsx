/*
 * PROTOTYPE B — "Manuscript"
 * A typeset research manuscript: visible 12-column ruler, line numbers in the
 * margin, the three threads set as a staircase of display lines with
 * footnote markers, and the footnotes carrying the evidence.
 */

const lines = [
  { n: "01", word: "Engineering,", mark: "1", start: "lg:col-start-1" },
  { n: "02", word: "Research,", mark: "2", start: "lg:col-start-3" },
  { n: "03", word: "& Creation.", mark: "3", start: "lg:col-start-5" },
];

const notes = [
  { mark: "1", head: "Engineering", body: "Backend systems in Go at FairMoney: durable workflows with Temporal and the Saga pattern." },
  { mark: "2", head: "Research", body: "HAUV: keeping a hybrid aerial–underwater vehicle stable as it crosses the air–water boundary." },
  { mark: "3", head: "Creation", body: "Xealtha: healthcare triage over WhatsApp for Nigeria, in development." },
];

export default function ManuscriptPrototype() {
  return (
    <div className="relative mx-auto max-w-content px-5 sm:px-8 lg:px-12">
      {/* Column ruler and guides */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-0 bottom-0 hidden grid-cols-12 gap-x-6 sm:inset-x-8 lg:inset-x-12 lg:grid">
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className="border-l border-grid last:border-r">
            <span className="annot block pt-3 pl-1.5 text-faint">{String(i + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>

      <div className="relative grid grid-cols-1 gap-x-6 pt-16 pb-20 lg:grid-cols-12 lg:pt-24">
        <p className="label text-muted-foreground lg:col-span-12">
          Timmy Omolana <span className="text-faint">/</span> software engineer & researcher{" "}
          <span className="text-faint">/</span> Lagos 6.52° N 3.38° E
        </p>

        <h1 className="mt-12 lg:col-span-12">
          {lines.map((l) => (
            <span key={l.n} className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-6">
              <span className={`display relative block text-display ${l.start} lg:col-span-8`}>
                <span aria-hidden="true" className="annot absolute top-3 -left-0 -translate-x-[calc(100%+0.75rem)] text-faint max-lg:hidden">
                  {l.n}
                </span>
                {l.word}
                <sup className="annot ml-1 align-super text-accent">{l.mark}</sup>
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-16 lg:col-span-5 lg:col-start-1">
          <p className="max-w-measure text-lede">
            <span className="label mr-2 text-muted-foreground">Abstract.</span>
            Engineering at the intersection of mathematics, computation, and real-world systems. I build backend
            systems for fintech in Go, study the mathematics behind how systems behave, and work on autonomous
            robotics research.
          </p>
          <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-small">
            <a href="#" className="link">→ Explore my work</a>
            <a href="#" className="link">→ Get in touch</a>
          </p>
        </div>

        <ol className="mt-16 grid gap-8 border-t border-border pt-6 sm:grid-cols-3 lg:col-span-12">
          {notes.map((n) => (
            <li key={n.mark} className="text-small">
              <span className="annot mr-2 text-accent">{n.mark}</span>
              <span className="font-medium">{n.head}.</span>{" "}
              <span className="text-muted-foreground">{n.body}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
