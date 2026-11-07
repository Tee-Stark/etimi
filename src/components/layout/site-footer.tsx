import { cacheLife } from "next/cache";
import Link from "next/link";
import { Mark, Wordmark } from "@/components/brand/mark";
import { channelsFor, ContactList } from "@/components/content/contact-list";
import { primaryNav } from "@/config/navigation";
import type { PublicLink } from "@/content/types";
import { Container } from "./container";

type SiteFooterProps = {
  name: string;
  positioning: string;
  location: string;
  coordinates: string;
  /** Confirmed, public contact details only. Empty means nothing is rendered. */
  email: string | null;
  profiles: PublicLink[];
};

/** Copyright year, refreshed daily rather than frozen at build time. */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

/** Footer as a colophon: identity, contents, and how the pages are made. */
export function SiteFooter({ name, positioning, location, coordinates, email, profiles }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-border">
      <Container className="grid gap-x-6 gap-y-12 py-14 sm:py-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="flex items-end gap-3 text-foreground">
            <Mark className="h-9" />
            <Wordmark className="mb-0.5 h-[1.05rem] text-muted-foreground" title="eTimi" />
          </p>
          <p className="display mt-6 text-h2">{name}</p>
          <p className="mt-4 max-w-sm text-small text-muted-foreground">{positioning}</p>
          <p className="label mt-6 text-muted-foreground">
            {location} <span className="text-faint">·</span> {coordinates}
          </p>
        </div>

        <nav aria-label="Footer" className="lg:col-span-3 lg:col-start-7">
          <p className="label mb-3 text-muted-foreground">Contents</p>
          <ol className="grid grid-cols-2 gap-x-6">
            {primaryNav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group inline-flex min-h-9 items-baseline gap-2.5 text-small text-foreground hover:text-accent"
                >
                  <span aria-hidden="true" className="annot text-faint group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-8 lg:col-span-3 lg:col-start-10">
          {email || profiles.length > 0 ? (
            <div>
              <p className="label mb-3 text-muted-foreground">Elsewhere</p>
              <ContactList channels={channelsFor(email, profiles)} variant="compact" />
            </div>
          ) : null}
          <div>
            <p className="label mb-3 text-muted-foreground">Colophon</p>
            <p className="text-small text-muted-foreground">
              Set in Instrument Sans, Instrument Serif and IBM Plex Mono. Figures are computed when the site is built.
            </p>
          </div>
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-wrap justify-between gap-4 py-5">
          <p className="label text-muted-foreground">
            © <CurrentYear /> {name}
          </p>
          <a href="#content" className="label text-muted-foreground hover:text-foreground">
            Back to top ↑
          </a>
        </Container>
      </div>
    </footer>
  );
}
