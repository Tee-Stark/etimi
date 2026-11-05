import type { Metadata } from "next";

/*
 * Per-page metadata in one place (IMPLEMENTATION_SPEC.md §9.1): unique title,
 * description, canonical URL, Open Graph and Twitter fields, and the RSS
 * alternate. URLs are relative; `metadataBase` in the root layout makes them
 * absolute from NEXT_PUBLIC_SITE_URL. Only ever pass published, public text.
 * Open Graph images come from the opengraph-image files beside each route.
 */

export const FEED_PATH = "/feed.xml";

type PageMetadataInput = {
  /** Page title; the root template appends " — Timmy Omolana". Omit for the home page. */
  title?: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
};

export function pageMetadata({ title, description, path, type = "website" }: PageMetadataInput): Metadata {
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": [{ url: FEED_PATH, title: "Timmy Omolana — Writing" }] },
    },
    openGraph: { type, ...(title ? { title } : {}), description, url: path },
    twitter: { card: "summary_large_image", ...(title ? { title } : {}), description },
  };
}
