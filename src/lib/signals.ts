/*
 * Deterministic signal generation for figures. Everything here runs at build
 * time on the server and produces plain SVG path strings: no client
 * JavaScript, no randomness, identical output on every build.
 */

export type Signal = (t: number) => number;

const TAU = Math.PI * 2;

/**
 * Square wave by its Fourier partial sum over the odd harmonics up to
 * `maxHarmonic`: (4/π) Σ sin(2π k f t) / k. The ringing at the edges (the
 * Gibbs phenomenon) is left in on purpose: it is what a real truncated
 * series looks like.
 */
export function squarePartialSum(frequency: number, maxHarmonic: number, amplitude = 1): Signal {
  return (t) => {
    let sum = 0;
    for (let k = 1; k <= maxHarmonic; k += 2) sum += Math.sin(TAU * k * frequency * t) / k;
    return (4 / Math.PI) * sum * amplitude;
  };
}

/** Gabor wave packet: a cosine under a Gaussian envelope. Localised in time and frequency. */
export function wavePacket(centre: number, width: number, frequency: number, amplitude = 1): Signal {
  return (t) => amplitude * Math.exp(-((t - centre) ** 2) / (2 * width ** 2)) * Math.cos(TAU * frequency * (t - centre));
}

/** Frequency modulation, the basis of FM sound synthesis: sin(2π f_c t + β sin(2π f_m t)). */
export function frequencyModulation(carrier: number, modulator: number, index: number, amplitude = 1): Signal {
  return (t) => amplitude * Math.sin(TAU * carrier * t + index * Math.sin(TAU * modulator * t));
}

/** Pointwise sum of signals: the mixture. */
export function mix(...signals: Signal[]): Signal {
  return (t) => signals.reduce((acc, s) => acc + s(t), 0);
}

type PathOptions = {
  /** Horizontal extent in SVG units. */
  width: number;
  /** Vertical extent in SVG units. */
  height: number;
  /** Signal value mapped to the top and bottom edges (symmetric). */
  range: number;
  /** Number of samples across [0, 1]. */
  samples?: number;
};

/** Sample a signal over t ∈ [0, 1] and return an SVG path (y axis pointing up). */
export function signalPath(signal: Signal, { width, height, range, samples = 480 }: PathOptions): string {
  const mid = height / 2;
  const scale = mid / range;
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const x = (t * width).toFixed(2);
    const y = (mid - signal(t) * scale).toFixed(2);
    d += `${i === 0 ? "M" : "L"}${x} ${y}`;
  }
  return d;
}
