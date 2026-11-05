import { cacheLife } from "next/cache";
import Link from "next/link";
import { primaryNav } from "@/config/navigation";
import type { PublicProfile } from "@/content/site";
import { Container } from "./container";

type SiteFooterProps = {
  name: string;
  positioning: string;
  location: string;
  /** Confirmed, public profiles only. Empty means nothing is rendered. */
  profiles: PublicProfile[];
};

/** Copyright year, refreshed daily rather than frozen at build time. */
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter({ name, positioning, location, profiles }: SiteFooterProps) {
  return (
    <footer className="mt-auto border-t border-border">
      <Container className="grid gap-12 py-14 sm:py-16 md:grid-cols-12">
        <div className="md:col-span-5 lg:col-span-6">
          <p className="inline-block border-t-2 border-accent pt-3 font-serif text-h3">{name}</p>
          <p className="mt-4 max-w-sm text-small text-muted-foreground">{positioning}</p>
          <p className="meta mt-4 text-muted-foreground">{location}</p>
        </div>

        <nav aria-label="Footer" className="md:col-span-4 lg:col-span-3">
          <p className="meta mb-4 text-muted-foreground">Sections</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-9 items-center text-small text-foreground hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {profiles.length > 0 ? (
          <div className="md:col-span-3">
            <p className="meta mb-4 text-muted-foreground">Elsewhere</p>
            <ul className="space-y-1">
              {profiles.map((profile) => (
                <li key={profile.url}>
                  <a
                    href={profile.url}
                    rel="me noopener noreferrer"
                    className="inline-flex min-h-9 items-center text-small text-foreground hover:text-accent"
                  >
                    {profile.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Container>

      <div className="border-t border-border">
        <Container className="py-6">
          <p className="meta text-muted-foreground">
            © <CurrentYear /> {name}
          </p>
        </Container>
      </div>
    </footer>
  );
}
