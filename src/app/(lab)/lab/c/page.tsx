import { frequencyModulation, mix, signalPath, squarePartialSum, wavePacket } from "@/lib/signals";

/*
 * PROTOTYPE C — "Decomposition"
 * The positioning statement as a figure: one mixed signal x(t) and the three
 * sources that sum to it, one per thread. Real mathematics, computed at
 * build time. Source separation is also the subject of the Dechorder thesis.
 */

const sE = squarePartialSum(2, 9, 0.9);
const sR = wavePacket(0.62, 0.075, 11, 1);
const sC = frequencyModulation(4, 1, 2.2, 0.8);
const x = mix(sE, sR, sC);

const VB_W = 1000;

const rows = [
  {
    id: "engineering",
    sym: "E",
    name: "Engineering",
    note: "Square wave, Fourier partial sum",
    formula: (
      <>
        (4/π) Σ<sub>k odd ≤ 9</sub> sin(2π<i>kft</i>)/<i>k</i>
      </>
    ),
    path: signalPath(sE, { width: VB_W, height: 100, range: 1.4 }),
  },
  {
    id: "research",
    sym: "R",
    name: "Research",
    note: "Gabor wave packet",
    formula: (
      <>
        e<sup>−(t−μ)²/2σ²</sup> cos 2π<i>f</i>(<i>t</i>−μ)
      </>
    ),
    path: signalPath(sR, { width: VB_W, height: 100, range: 1.4 }),
  },
  {
    id: "creation",
    sym: "C",
    name: "Creation",
    note: "Frequency modulation (FM synthesis)",
    formula: (
      <>
        sin(2π<i>f</i><sub>c</sub><i>t</i> + β sin 2π<i>f</i><sub>m</sub><i>t</i>)
      </>
    ),
    path: signalPath(sC, { width: VB_W, height: 100, range: 1.4 }),
  },
];

const mixPath = signalPath(x, { width: VB_W, height: 100, range: 3.4 });

function Trace({ d, className, tall = false }: { d: string; className: string; tall?: boolean }) {
  return (
    <svg
      viewBox={`0 0 ${VB_W} 100`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full ${tall ? "h-28 sm:h-36" : "h-14 sm:h-16"}`}
    >
      {[250, 500, 750].map((gx) => (
        <line key={gx} x1={gx} x2={gx} y1="0" y2="100" stroke="var(--grid)" vectorEffect="non-scaling-stroke" />
      ))}
      <line x1="0" x2={VB_W} y1="50" y2="50" stroke="var(--border)" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" className={className} strokeWidth="1.25" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

export default function DecompositionPrototype() {
  return (
    <div className="mx-auto grid max-w-content gap-14 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-20">
      <div className="lg:col-span-4 lg:pr-6">
        <p className="label text-muted-foreground">Lagos · 6.52° N 3.38° E</p>
        <h1 className="mt-8 text-h3 font-medium">Timmy Omolana</h1>
        <p className="label mt-1 text-muted-foreground">Software engineer & researcher</p>
        <p className="display mt-10 text-h1">
          Engineering at the intersection of mathematics, computation, and real-world systems.
        </p>
        <p className="mt-8 max-w-measure text-muted-foreground">
          I build backend systems for fintech in Go, study the mathematics behind how systems behave, and work on
          autonomous robotics research. I like problems that sit between disciplines.
        </p>
        <p className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-small">
          <a href="#" className="link">Explore my work →</a>
          <a href="#" className="link">Get in touch →</a>
        </p>
      </div>

      <figure className="lg:col-span-8 lg:border-l lg:border-border lg:pl-8">
        <div className="grid grid-cols-[4.5rem_1fr] items-center gap-x-4 sm:grid-cols-[6rem_1fr]">
          <div>
            <p className="math text-2xl">x(t)</p>
            <p className="label mt-1 text-muted-foreground">Mixture</p>
          </div>
          <Trace d={mixPath} className="stroke-accent" tall />
        </div>

        <p className="annot my-5 text-muted-foreground sm:ml-[7rem]">
          <span className="math text-base text-foreground">x(t)</span> ={" "}
          <span className="math text-base text-foreground">s</span>
          <sub>E</sub> + <span className="math text-base text-foreground">s</span>
          <sub>R</sub> + <span className="math text-base text-foreground">s</span>
          <sub>C</sub>
        </p>

        <ol className="border-t border-border">
          {rows.map((r) => (
            <li key={r.id} className="grid grid-cols-[4.5rem_1fr] items-center gap-x-4 border-b border-border py-4 sm:grid-cols-[6rem_1fr]">
              <div>
                <p className="math text-xl">
                  s<sub className="not-italic">{r.sym}</sub>
                </p>
                <p className="label mt-1">{r.name}</p>
              </div>
              <div>
                <Trace d={r.path} className="stroke-foreground" />
                <p className="annot mt-2 flex flex-wrap justify-between gap-x-4 text-muted-foreground">
                  <span>{r.note}</span>
                  <span>{r.formula}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div aria-hidden="true" className="annot mt-2 flex justify-between text-faint sm:ml-[7rem]">
          <span>t = 0</span>
          <span>¼</span>
          <span>½</span>
          <span>¾</span>
          <span>1</span>
        </div>

        <figcaption className="annot mt-6 max-w-measure text-muted-foreground">
          Fig. 1 — One mixture, three sources. Recovering sources from a mixture is the problem my thesis,
          Dechorder, studied for African music.
        </figcaption>
      </figure>
    </div>
  );
}
