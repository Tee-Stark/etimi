import { notFound } from "next/navigation";
import { getEntry, getRouteParams } from "@/content";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og-image";

export const alt = "Research by Timmy Omolana";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return getRouteParams("research");
}

/** Published entries only (getEntry never returns hidden entries in production). */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getEntry("research", slug);
  if (!entry) notFound();
  const d = entry.data;
  return ogImage({ section: "/research", eyebrow: "Research", title: d.title, subtitle: d.fullTitle ?? d.summary });
}
