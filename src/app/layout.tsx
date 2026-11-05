import type { Metadata, Viewport } from "next";
import { ThemeScript } from "@/components/theme/theme-script";
import { getSite } from "@/content";
import { fontVariables } from "@/fonts";
import { getSiteUrl } from "@/lib/site-url";
import "@/styles/globals.css";

const site = getSite();

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: `${site.name} — ${site.title}`,
    template: `%s — ${site.name}`,
  },
  description: site.positioning,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#080b12",
  colorScheme: "dark light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme is set before paint by ThemeScript, hence suppressHydrationWarning.
    <html lang="en-GB" className={fontVariables} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
