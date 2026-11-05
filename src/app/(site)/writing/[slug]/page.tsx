import Link from "next/link";
import { notFound } from "next/navigation";
import { PreviewBanner, TableOfContents } from "@/components/content/article-parts";
import { MetaRail } from "@/components/content/meta-rail";
import { Prose } from "@/components/content/prose";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getEntry, getRouteParams } from "@/content";
import { formatPartialDate } from "@/lib/dates";
import { extractHeadings } from "@/lib/headings";
import { pageMetadata } from "@/lib/metadata";
import { readingTime } from "@/lib/reading-time";

/*
 * Note template (IMPLEMENTATION_SPEC.md §8.11). Built before any note exists:
 * with none published, the only generated param is a sentinel that 404s.
 */

/*
 * Detail pages are prerendered for every published slug. `instant = false`
 * lets the page read params before rendering, so an unknown or hidden slug
 * gets a real 404 status rather than a streamed "soft" not-found.
 */
export const instant = false;

export function generateStaticParams() {
  return getRouteParams("notes");
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const note = getEntry("notes", slug);
  if (!note) return {};
  return {
    ...pageMetadata({ title: note.data.title, description: note.data.summary, path: note.href! }),
    openGraph: { type: "article", title: note.data.title, description: note.data.summary, url: note.href, publishedTime: note.data.date, modifiedTime: note.data.updated },
  };
}

export default async function NotePage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const note = getEntry("notes", slug);
  if (!note) notFound();

  const d = note.data;
  const headings = d.toc ? extractHeadings(note.body) : [];
  const { minutes } = readingTime(note.body);

  return (
    <article>
      <PreviewBanner preview={note.preview} />
      <PageHeader
        section="/writing"
        eyebrow="Note"
        title={d.title}
        titleStyle="sans"
        lede={<p>{d.summary}</p>}
        meta={
          <MetaRail
            items={[
              { label: "Published", value: <time dateTime={d.date}>{formatPartialDate(d.date, { long: true })}</time> },
              {
                label: "Updated",
                value: d.updated > d.date ? <time dateTime={d.updated}>Updated {formatPartialDate(d.updated, { long: true })}</time> : null,
              },
              { label: "Reading time", value: `${minutes} min read` },
              { label: "Tags", value: d.tags.length ? d.tags.join(", ") : null },
            ]}
          />
        }
      />

      <Container className="grid gap-x-6 gap-y-12 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        <aside className="min-w-0 lg:col-span-3">
          <div className="lg:sticky lg:top-8">
            <TableOfContents headings={headings} />
          </div>
        </aside>
        <div className="min-w-0 space-y-12 lg:col-span-8 lg:col-start-5">
          <Prose source={note.body} format={note.format} />
          <p>
            <Link href="/writing" className="label text-muted-foreground hover:text-foreground">
              ← All writing
            </Link>
          </p>
        </div>
      </Container>
    </article>
  );
}
