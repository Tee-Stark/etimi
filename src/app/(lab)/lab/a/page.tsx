/*
 * PROTOTYPE A — "Simplex"
 * The three threads are the vertices of a 2-simplex. Each piece of work is a
 * point placed by barycentric coordinates (e, r, c): the equal mix of the
 * threads it belongs to. (Prototype data; the real version would derive
 * positions from each content entry's `threads` field.)
 */

const W = 600;
const H = 540;
const V = { E: [40, 490], R: [300, 40], C: [560, 490] } as const;

function bary(e: number, r: number, c: number): [number, number] {
  return [e * V.E[0] + r * V.R[0] + c * V.C[0], e * V.E[1] + r * V.R[1] + c * V.C[1]];
}

const points: Array<{ label: string; sub: string; coord: string; p: [number, number]; dx: number; dy: number; anchor?: "start" | "middle" | "end" }> = [
  { label: "Backend systems", sub: "FairMoney", coord: "(1, 0, 0)", p: bary(1, 0, 0), dx: 14, dy: -14 },
  { label: "HAUV", sub: "hybrid vehicle research", coord: "(½, ½, 0)", p: bary(0.5, 0.5, 0), dx: -18, dy: 0, anchor: "end" },
  { label: "Dechorder", sub: "B.Sc. thesis", coord: "(⅓, ⅓, ⅓)", p: bary(1 / 3, 1 / 3, 1 / 3), dx: 14, dy: 4 },
  { label: "Xealtha", sub: "in development", coord: "(½, 0, ½)", p: bary(0.5, 0, 0.5), dx: 0, dy: 34, anchor: "middle" },
  { label: "Music", sub: "pianist · choir", coord: "(0, 0, 1)", p: bary(0, 0, 1), dx: -14, dy: -14, anchor: "end" },
];

function gridLines() {
  const lines: Array<[number, number, number, number]> = [];
  for (let i = 1; i < 10; i++) {
    const k = i / 10;
    const pairs: Array<[[number, number, number], [number, number, number]]> = [
      [[k, 1 - k, 0], [k, 0, 1 - k]],
      [[1 - k, k, 0], [0, k, 1 - k]],
      [[1 - k, 0, k], [0, 1 - k, k]],
    ];
    for (const [a, b] of pairs) {
      const [x1, y1] = bary(...a);
      const [x2, y2] = bary(...b);
      lines.push([x1, y1, x2, y2]);
    }
  }
  return lines;
}

export default function SimplexPrototype() {
  return (
    <div className="mx-auto grid max-w-content gap-12 px-5 py-14 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-20">
      <div className="lg:col-span-5 lg:pt-6">
        <p className="label text-muted-foreground">Timmy Omolana — software engineer & researcher</p>
        <h1 className="display mt-8 text-h1">
          Engineering at the intersection of mathematics, computation, and real-world systems.
        </h1>
        <p className="mt-8 max-w-measure text-lede text-muted-foreground">
          Every piece of my work is some mixture of three threads. The plot places each one by how much of each
          thread it carries.
        </p>
        <dl className="annot mt-10 grid max-w-sm grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-t border-border pt-5 text-muted-foreground">
          <dt className="math text-base text-foreground">e</dt>
          <dd>Engineering — building reliable, scalable, useful systems</dd>
          <dt className="math text-base text-foreground">r</dt>
          <dd>Research — hard problems and their mathematical foundations</dd>
          <dt className="math text-base text-foreground">c</dt>
          <dd>Creation — ideas turned into products and experiments</dd>
          <dt className="text-foreground">Σ</dt>
          <dd>
            <span className="math text-base">e + r + c</span> = 1
          </dd>
        </dl>
      </div>

      <figure className="lg:col-span-7">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-labelledby="simplex-title">
          <title id="simplex-title">
            Triangle plot with Engineering, Research and Creation at the corners, and five pieces of work placed
            between them.
          </title>
          <g stroke="var(--grid)" strokeWidth="1">
            {gridLines().map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
            ))}
          </g>
          <polygon
            points={`${V.E.join(",")} ${V.R.join(",")} ${V.C.join(",")}`}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="1"
          />
          <g className="label" fill="var(--foreground)" style={{ fontSize: 11 }}>
            <text x={V.R[0]} y={V.R[1] - 14} textAnchor="middle">Research · r</text>
            <text x={V.E[0]} y={V.E[1] + 26} textAnchor="start">Engineering · e</text>
            <text x={V.C[0]} y={V.C[1] + 26} textAnchor="end">Creation · c</text>
          </g>
          {points.map((pt) => (
            <g key={pt.label}>
              <rect x={pt.p[0] - 4} y={pt.p[1] - 4} width="8" height="8" fill="var(--accent)" />
              <text
                x={pt.p[0] + pt.dx}
                y={pt.p[1] + pt.dy}
                textAnchor={pt.anchor ?? "start"}
                fill="var(--foreground)"
                style={{ fontSize: 14, fontFamily: "var(--font-sans)" }}
              >
                {pt.label}
                <tspan x={pt.p[0] + pt.dx} dy="15" fill="var(--muted-foreground)" style={{ fontFamily: "var(--font-mono)", fontSize: 10 }}>
                  {pt.coord} · {pt.sub}
                </tspan>
              </text>
            </g>
          ))}
        </svg>
        <figcaption className="annot mt-4 text-muted-foreground">
          Fig. 1 — Work in barycentric coordinates (e, r, c).
        </figcaption>
      </figure>
    </div>
  );
}
