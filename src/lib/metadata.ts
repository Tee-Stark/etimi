import type { Metadata } from "next";

/*
 * Per-page metadata in one place, so titles, descriptions and canonical URLs
 * stay consistent. Only ever pass published, public text here.
 * (Open Graph images and structured data are added in Phase 5.)
 */
export function pageMetadata({ title, description, path }: { title?: string; description: string; path: string }): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: { ...(title ? { title } : {}), description, url: path },
    twitter: { ...(title ? { title } : {}), description },
  };
}
