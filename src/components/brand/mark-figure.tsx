import { cn } from "@/lib/utils";
import { MARK } from "./mark-data";

/*
 * The mark as a large technical plate, set behind the About page: a faint
 * filled body, a crisp hairline outline, its bounding box with registration
 * crosshairs, and a ruler along the top edge divided like the 12-column page
 * grid. Cobalt in the dark theme, graphite in the paper theme (see the
 * --mark-* tokens). Decorative: hidden from assistive technology.
 */

const M = 26; // margin around the mark for crosshairs and ruler
const W = MARK.width + M * 2;
const H = MARK.height + M * 2;
const x0 = M;
const y0 = M;
const x1 = M + MARK.width;
const y1 = M + MARK.height;

function Crosshair({ x, y }: { x: number; y: number }) {
  const r = 9;
  return (
    <g>
      <line x1={x - r} x2={x + r} y1={y} y2={y} />
      <line x1={x} x2={x} y1={y - r} y2={y + r} />
      <circle cx={x} cy={y} r={3.2} fill="none" />
    </g>
  );
}

type Tone = "plate" | "background";

/** The background tone swaps in fainter values so text over it stays fully readable. */
const TONE_STYLE: Record<Tone, Record<string, string> | undefined> = {
  plate: undefined,
  background: {
    "--mark-fill": "var(--mark-bg-fill)",
    "--mark-stroke": "var(--mark-bg-stroke)",
    "--mark-guide": "var(--mark-bg-guide)",
  },
};

export function MarkFigure({ className, tone = "plate" }: { className?: string; tone?: Tone }) {
  const ticks = Array.from({ length: 13 }, (_, i) => x0 + (i * MARK.width) / 12);

  return (
    <div aria-hidden="true" className={cn("pointer-events-none select-none", className)} style={TONE_STYLE[tone]}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full overflow-visible" focusable="false">
        {/* Construction: bounding box, ruler, crosshairs */}
        <g stroke="var(--mark-guide)" strokeWidth={1} vectorEffect="non-scaling-stroke" fill="none">
          <rect x={x0} y={y0} width={MARK.width} height={MARK.height} strokeDasharray="2 4" vectorEffect="non-scaling-stroke" />
          <line x1={x0} x2={x1} y1={y0 - 12} y2={y0 - 12} vectorEffect="non-scaling-stroke" />
          {ticks.map((x, i) => (
            <line key={x} x1={x} x2={x} y1={y0 - 12} y2={y0 - (i % 6 === 0 ? 20 : 16)} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
        <g stroke="var(--mark-stroke)" strokeWidth={1} vectorEffect="non-scaling-stroke">
          <Crosshair x={x0} y={y0} />
          <Crosshair x={x1} y={y0} />
          <Crosshair x={x0} y={y1} />
          <Crosshair x={x1} y={y1} />
        </g>
        {/* The mark */}
        <path
          d={MARK.d}
          transform={`translate(${M} ${M})`}
          fill="var(--mark-fill)"
          stroke="var(--mark-stroke)"
          strokeWidth={1}
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
