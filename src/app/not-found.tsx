import Link from "next/link";
import { ColumnGuides } from "@/components/layout/column-guides";
import { Container } from "@/components/layout/container";
import { primaryNav } from "@/config/navigation";

/*
 * 404. Restrained, with a way home and the site's sections. It never echoes
 * the requested path, so it can't hint at whether hidden content exists.
 */
export default function NotFound() {
  return (
    <section aria-labelledby="not-found-heading" className="relative">
      <Container className="relative">
        <ColumnGuides />
        <div className="relative grid gap-x-6 py-24 sm:py-32 lg:grid-cols-12">
          <p className="label text-muted-foreground lg:col-span-12">Error 404</p>
          <h1 id="not-found-heading" className="display mt-8 text-h1 lg:col-span-10">
            This page doesn&apos;t exist.
          </h1>
          <p className="mt-6 max-w-measure text-lede text-muted-foreground lg:col-span-7">
            The link may be wrong, or the page may have moved.
          </p>
          <p className="mt-10 lg:col-span-12">
            <Link href="/" className="link">
              ← Back to the home page
            </Link>
          </p>
          <nav aria-label="Sections" className="mt-14 lg:col-span-6">
            <p className="label mb-3 text-muted-foreground">Or go to</p>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-9 items-center text-small hover:text-accent">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </Container>
    </section>
  );
}
