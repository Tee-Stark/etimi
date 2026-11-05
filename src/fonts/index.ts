import localFont from "next/font/local";

/*
 * Self-hosted fonts (SIL Open Font License 1.1; licences alongside the files).
 * Latin subset, variable weight axis. Only upright faces are preloaded; italic
 * faces share the same family name and load on demand when italics are used.
 */

export const newsreader = localFont({
  src: "./newsreader-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  variable: "--font-newsreader",
  adjustFontFallback: "Times New Roman",
  declarations: [{ prop: "font-family", value: "newsreader" }],
});

export const newsreaderItalic = localFont({
  src: "./newsreader-latin-wght-italic.woff2",
  weight: "200 800",
  style: "italic",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "font-family", value: "newsreader" }],
  variable: "--font-newsreader-italic",
});

export const plexSans = localFont({
  src: "./ibm-plex-sans-latin-wght-normal.woff2",
  weight: "100 700",
  style: "normal",
  display: "swap",
  variable: "--font-plex-sans",
  adjustFontFallback: "Arial",
  declarations: [{ prop: "font-family", value: "plexSans" }],
});

export const plexSansItalic = localFont({
  src: "./ibm-plex-sans-latin-wght-italic.woff2",
  weight: "100 700",
  style: "italic",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
  declarations: [{ prop: "font-family", value: "plexSans" }],
  variable: "--font-plex-sans-italic",
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

/** Class names to place on <html>. Italic loaders are included so their @font-face rules ship (their variables are unused). */
export const fontVariables = [
  newsreader.variable,
  newsreaderItalic.variable,
  plexSans.variable,
  plexSansItalic.variable,
  plexMono.variable,
].join(" ");
