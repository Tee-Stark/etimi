import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SkipLink } from "@/components/layout/skip-link";
import { getSite } from "@/content/site";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  const site = getSite();

  return (
    <>
      <SkipLink />
      <SiteHeader name={site.name} />
      <main id="content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <SiteFooter
        name={site.name}
        positioning={site.positioning}
        location={site.location}
        profiles={site.profiles}
      />
    </>
  );
}
