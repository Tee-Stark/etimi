import type { ReactNode } from "react";
import type { Thread } from "@/content/types";
import { frequencyModulation, mix, signalPath, squarePartialSum, wavePacket } from "@/lib/signals";
import { TRACE_WIDTH } from "@/components/figures/signal-trace";

/*
 * Each thread drawn as a source signal; the home page's Fig. 1 is their sum.
 * The choice of function is the argument, so each one is meant to be apt:
 *
 *   Engineering  square wave (Fourier partial sum): discrete, periodic,
 *                dependable, built from simple parts that add up
 *   Research     Gabor wave packet: energy concentrated in one place,
 *                localised in time and frequency, like a focused question
 *   Creation     frequency modulation: the basis of FM sound synthesis
 *
 * Computed once at build time. These are presentation, not personal facts.
 */

type ThreadId = Thread["id"];

const sources = {
  engineering: squarePartialSum(2, 9, 0.9),
  research: wavePacket(0.62, 0.075, 11, 1),
  creation: frequencyModulation(4, 1, 2.2, 0.8),
} as const;

export type ThreadSignal = {
  /** Subscript used in notation: s_E, s_R, s_C. */
  symbol: string;
  /** Plain-English name of the function. */
  kind: string;
  /** Typeset formula. */
  formula: ReactNode;
  /** Text equivalent of the formula for assistive tech. */
  formulaText: string;
  path: string;
};

export const threadSignals: Record<ThreadId, ThreadSignal> = {
  engineering: {
    symbol: "E",
    kind: "Square wave, Fourier partial sum",
    formula: (
      <>
        (4/π) Σ<sub>k odd ≤ 9</sub> sin(2π<i>kft</i>)/<i>k</i>
      </>
    ),
    formulaText: "four over pi times the sum over odd k up to 9 of sine of 2 pi k f t, over k",
    path: signalPath(sources.engineering, { width: TRACE_WIDTH, height: 100, range: 1.35 }),
  },
  research: {
    symbol: "R",
    kind: "Gabor wave packet",
    formula: (
      <>
        e<sup>−(t−μ)²/2σ²</sup> cos 2π<i>f</i>(<i>t</i>−μ)
      </>
    ),
    formulaText: "a cosine under a Gaussian envelope centred at mu",
    path: signalPath(sources.research, { width: TRACE_WIDTH, height: 100, range: 1.35 }),
  },
  creation: {
    symbol: "C",
    kind: "Frequency modulation",
    formula: (
      <>
        sin(2π<i>f</i>
        <sub>c</sub>
        <i>t</i> + β sin 2π<i>f</i>
        <sub>m</sub>
        <i>t</i>)
      </>
    ),
    formulaText: "sine of 2 pi f c t plus beta sine of 2 pi f m t",
    path: signalPath(sources.creation, { width: TRACE_WIDTH, height: 100, range: 1.35 }),
  },
};

/** The mixture x(t) = s_E + s_R + s_C. */
export const mixturePath = signalPath(mix(sources.engineering, sources.research, sources.creation), {
  width: TRACE_WIDTH,
  height: 100,
  range: 3.3,
  samples: 720,
});
