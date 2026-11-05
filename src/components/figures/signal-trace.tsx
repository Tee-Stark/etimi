import { cn } from "@/lib/utils";

/** ViewBox width shared by every trace, so paths are comparable. */
export const TRACE_WIDTH = 1000;
const TRACE_HEIGHT = 100;

type SignalTraceProps = {
  /** SVG path produced by `signalPath` with width TRACE_WIDTH, height 100. */
  d: string;
  /** Stroke colour class, e.g. "stroke-accent". */
  strokeClassName?: string;
  /** Vertical guide positions as fractions of t ∈ [0, 1]. */
  guides?: number[];
  /** Draw the zero axis. */
  axis?: boolean;
  className?: string;
};

/**
 * A signal drawn as a hairline. Stretches to any box (preserveAspectRatio
 * none) while the stroke stays one device-independent pixel wide
 * (non-scaling-stroke). Decorative: meaning is carried by adjacent text.
 */
export function SignalTrace({ d, strokeClassName = "stroke-foreground", guides = [], axis = true, className }: SignalTraceProps) {
  return (
    <svg
      viewBox={`0 0 ${TRACE_WIDTH} ${TRACE_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={cn("block w-full overflow-visible", className)}
    >
      {guides.map((g) => (
        <line
          key={g}
          x1={g * TRACE_WIDTH}
          x2={g * TRACE_WIDTH}
          y1="0"
          y2={TRACE_HEIGHT}
          className="stroke-grid"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {axis ? (
        <line
          x1="0"
          x2={TRACE_WIDTH}
          y1={TRACE_HEIGHT / 2}
          y2={TRACE_HEIGHT / 2}
          className="stroke-border"
          vectorEffect="non-scaling-stroke"
        />
      ) : null}
      <path
        d={d}
        fill="none"
        className={strokeClassName}
        strokeWidth="1.25"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
