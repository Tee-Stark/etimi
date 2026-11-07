import { channelsFor, ContactList } from "@/components/content/contact-list";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { getSite } from "@/content";
import { pageCopy } from "@/config/page-copy";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Contact",
  description: pageCopy.contact.description,
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
                  <a href={`mailto:${site.email}`} className="link display text-h1 break-all">
                    {site.email}
                  </a>
                </p>
              </div>
            ) : null}
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="label mb-3 text-muted-foreground">Channels</p>
              <ContactList channels={channelsFor(site.email, site.profiles)} />
            </div>
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
