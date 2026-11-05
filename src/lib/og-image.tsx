import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { MARK } from "@/components/brand/mark-data";
import { mixturePath } from "@/components/home/thread-signals";
import { primaryNav } from "@/config/navigation";
import { getSite } from "@/content";

/*
 * Editorial Open Graph images (IMPLEMENTATION_SPEC.md §9.4), rendered at build
 * time in the site's visual language: the column grid, a monospace section
 * label, the title in Instrument Serif, the summary in Instrument Sans, and
 * Fig. 1's sum in cobalt. Inputs are published page titles and summaries
 * only; no photograph, no external images, no withheld data.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const COLOURS = {
  background: "#080b12",
  foreground: "#e8eaf0",
  muted: "#a1a9b8",
  faint: "#7b8496",
  grid: "#171c28",
  border: "#252c3a",
  accent: "#6f91ff",
};

// Satori reads ttf/otf/woff (not woff2), so static woff copies live in assets/og.
const fontDir = path.join(process.cwd(), "assets", "og");
const fonts = Promise.all([
  readFile(path.join(fontDir, "instrument-serif-latin-400-normal.woff")),
  readFile(path.join(fontDir, "instrument-sans-latin-400-normal.woff")),
  readFile(path.join(fontDir, "instrument-sans-latin-500-normal.woff")),
  readFile(path.join(fontDir, "ibm-plex-mono-latin-400-normal.woff")),
]).then(([serif, sans, sansMedium, mono]) => [
  { name: "Instrument Serif", data: serif, weight: 400 as const, style: "normal" as const },
  { name: "Instrument Sans", data: sans, weight: 400 as const, style: "normal" as const },
  { name: "Instrument Sans", data: sansMedium, weight: 500 as const, style: "normal" as const },
  { name: "IBM Plex Mono", data: mono, weight: 400 as const, style: "normal" as const },
]);

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/** Chapter label matching the page header, e.g. "02 · Research / Case study". */
function sectionLabel(section?: string, eyebrow?: string): string {
  const index = section ? primaryNav.findIndex((item) => item.href === section) : -1;
  const parts = index >= 0 ? [`${String(index + 1).padStart(2, "0")} · ${primaryNav[index].label}`] : [];
  if (eyebrow && (index < 0 || eyebrow !== primaryNav[index].label)) parts.push(eyebrow);
  return parts.join(" / ");
}

type OgInput = {
  /** Top-level section path, e.g. "/research". Omit for the home page. */
  section?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
};

export async function ogImage({ section, eyebrow, title, subtitle }: OgInput) {
  const site = getSite();
  const label = sectionLabel(section, eyebrow) || site.title;
  const titleSize = title.length <= 14 ? 132 : title.length <= 34 ? 92 : 68;
  const pad = 64;
  const columns = Array.from({ length: 13 }, (_, i) => pad + (i * (OG_SIZE.width - pad * 2)) / 12);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: `${pad - 16}px ${pad}px ${pad - 8}px`,
          background: COLOURS.background,
          color: COLOURS.foreground,
          fontFamily: "Instrument Sans",
          position: "relative",
        }}
      >
        {/* Column grid */}
        <svg width={OG_SIZE.width} height={OG_SIZE.height} style={{ position: "absolute", top: 0, left: 0 }}>
          {columns.map((x) => (
            <line key={x} x1={x} x2={x} y1={0} y2={OG_SIZE.height} stroke={COLOURS.grid} strokeWidth={1} />
          ))}
        </svg>

        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "IBM Plex Mono", fontSize: 18, letterSpacing: 1.5, textTransform: "uppercase", color: COLOURS.muted }}>
          <span>{label}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14, color: COLOURS.foreground }}>
            <svg width={44} height={(44 * MARK.height) / MARK.width} viewBox={MARK.viewBox}>
              <path d={MARK.d} fill={COLOURS.accent} />
            </svg>
            {site.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
          <div style={{ display: "flex", fontFamily: "Instrument Serif", fontSize: titleSize, lineHeight: 1, letterSpacing: -1.5 }}>{truncate(title, 90)}</div>
          {subtitle ? (
            <div style={{ display: "flex", marginTop: 28, fontSize: 28, lineHeight: 1.35, color: COLOURS.muted, maxWidth: 900 }}>{truncate(subtitle, 150)}</div>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <svg width={OG_SIZE.width - pad * 2} height={72} viewBox="0 0 1000 100" preserveAspectRatio="none">
            <line x1={0} x2={1000} y1={50} y2={50} stroke={COLOURS.border} strokeWidth={1} />
            <path d={mixturePath} fill="none" stroke={COLOURS.accent} strokeWidth={2.2} />
          </svg>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: "IBM Plex Mono", fontSize: 16, color: COLOURS.faint }}>
            <span>
              {site.location} · {site.coordinates}
            </span>
            <span>x(t) = sE + sR + sC</span>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: await fonts },
  );
}
