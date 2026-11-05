import localFont from "next/font/local";

/*
 * Type system (self-hosted, SIL Open Font License 1.1; licences alongside).
 *
 *   Instrument Sans   contemporary grotesk: interface and all reading text
 *   Instrument Serif  editorial display: used selectively, large sizes only
 *   IBM Plex Mono     technical voice: labels, coordinates, data, notation
 *
 * Sans and Serif are one designed family (shared proportions and rhythm), so
 * the display face can sit inside a line of text without clashing. Plex Mono
 * comes from engineering documentation and reads as annotation, not terminal.
 *
 * Upright faces are preloaded; italic faces share each family name and load
 * only when italics are actually used.
 */

export const instrumentSans = localFont({
  src: "./instrument-sans-latin-wght-normal.woff2",
  weight: "400 700",
  style: "normal",
  display: "swap",
  variable: "--font-instrument-sans",
  adjustFontFallback: "Arial",
  declarations: [{ prop: "font-family", value: "instrumentSans" }],
});

export const instrumentSansItalic = localFont({
  src: "./instrument-sans-latin-wght-italic.woff2",
  weight: "400 700",
  style: "italic",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-instrument-sans-italic",
  declarations: [{ prop: "font-family", value: "instrumentSans" }],
});

export const instrumentSerif = localFont({
  src: "./instrument-serif-latin-400-normal.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  variable: "--font-instrument-serif",
  adjustFontFallback: "Times New Roman",
  declarations: [{ prop: "font-family", value: "instrumentSerif" }],
});

export const instrumentSerifItalic = localFont({
  src: "./instrument-serif-latin-400-italic.woff2",
  weight: "400",
  style: "italic",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  variable: "--font-instrument-serif-italic",
  declarations: [{ prop: "font-family", value: "instrumentSerif" }],
});

export const plexMono = localFont({
  src: [
    { path: "./ibm-plex-mono-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./ibm-plex-mono-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
  display: "swap",
  variable: "--font-plex-mono",
  adjustFontFallback: false,
  declarations: [{ prop: "font-family", value: "plexMono" }],
});

/** Class names for <html>. Italic loaders are included so their @font-face rules ship. */
export const fontVariables = [
  instrumentSans.variable,
  instrumentSansItalic.variable,
  instrumentSerif.variable,
  instrumentSerifItalic.variable,
  plexMono.variable,
].join(" ");
