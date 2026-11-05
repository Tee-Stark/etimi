import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { getSite } from "@/content";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: "How to contact Timmy Omolana.",
  path: "/contact",
});

/*
 * Contact (IMPLEMENTATION_SPEC.md §8.12). Only confirmed, public channels
 * render. Invitation wording is pending (open item O12), so the copy stays
 * neutral. No contact form in v1.
 */
export default function ContactPage() {
  const site = getSite();
  const hasChannels = Boolean(site.email) || site.profiles.length > 0;

  return (
    <>
      <PageHeader section="/contact" title="Contact" />
      <PageSection id="channels" index="§1" eyebrow="Channels" title="Get in touch">
        {hasChannels ? (
          <div className="grid gap-x-6 gap-y-10 lg:grid-cols-12">
            {site.email ? (
              <div className="lg:col-span-7">
                <p className="label text-muted-foreground">Email</p>
                <p className="mt-3">
                  <a href={`mailto:${site.email}`} className="link display text-h2 break-all">
                    {site.email}
                  </a>
                </p>
              </div>
            ) : null}
            {site.profiles.length > 0 ? (
              <div className="lg:col-span-4 lg:col-start-9">
                <p className="label text-muted-foreground">Elsewhere</p>
                <ul className="mt-3 space-y-2">
                  {site.profiles.map((p) => (
                    <li key={p.url}>
                      <a href={p.url} rel="me noopener noreferrer" className="link">
                        {p.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <p className="max-w-measure border-t border-border pt-6 text-lede text-muted-foreground">
            Contact details will be added here soon.
          </p>
        )}
        {site.cv ? (
          <p className="mt-10">
            <a href={site.cv} className="link">
              Download my CV (PDF)
            </a>
          </p>
        ) : null}
        <p className="label mt-12 text-muted-foreground">
          {site.location} <span className="text-faint">·</span> {site.coordinates}
        </p>
      </PageSection>
    </>
  );
}
