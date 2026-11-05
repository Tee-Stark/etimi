import Link from "next/link";
import { notFound } from "next/navigation";
import { FactList, GroupLabel, Notice, PreviewBanner, StackList, TableOfContents } from "@/components/content/article-parts";
import { Prose } from "@/components/content/prose";
import { StatusLabel } from "@/components/content/status-label";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { ExternalEmbed } from "@/components/research/external-embed";
import { getCollection, getEntry, getRouteParams } from "@/content";
import { formatPartialDate } from "@/lib/dates";
import { extractHeadings } from "@/lib/headings";
import { pageMetadata } from "@/lib/metadata";

/*
 * Detail pages are prerendered for every published slug. `instant = false`
 * lets the page read params before rendering, so an unknown or hidden slug
 * gets a real 404 status rather than a streamed "soft" not-found.
 */
export const instant = false;

export function generateStaticParams() {
  return getRouteParams("research");
}

export async function generateMetadata({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const r = getEntry("research", slug);
  if (!r) return {};
  // Short title for search results; the full paper title is in the description and on the page.
  return pageMetadata({
    title: `${r.data.title} (research)`,
    description: r.data.fullTitle ? `${r.data.fullTitle}. ${r.data.summary}` : r.data.summary,
    path: r.href!,
  });
}

/*
 * Research case study (IMPLEMENTATION_SPEC.md §8.6–8.7). The body carries the
 * seven-part structure as §-numbered sections; the sidebar carries status,
 * affiliation, outputs, updates and related talks. An embed renders only if
 * its content entry marks it public.
 */
export default async function ResearchEntryPage({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  const r = getEntry("research", slug);
  if (!r) notFound();

  const d = r.data;
  const headings = extractHeadings(r.body);
  const talks = getCollection("talks").filter((t) => t.data.research === r.slug);
  const updates = [...d.updates].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <article>
      <PreviewBanner preview={r.preview} />
      <PageHeader
        section="/research"
        eyebrow="Research"
        title={d.title}
        subtitle={d.fullTitle}
        lede={<p>{d.summary}</p>}
        meta={
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <StatusLabel status={d.status} />
            {d.affiliation ? <span className="label text-muted-foreground">{d.affiliation}</span> : null}
          </div>
        }
      />

      <Container className="grid gap-x-6 gap-y-12 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        <aside className="min-w-0 lg:col-span-3">
          <div className="space-y-10 lg:sticky lg:top-8">
            <TableOfContents headings={headings} />
            <FactList
              items={[
                { label: "Affiliation", value: d.affiliation },
                { label: "Implementation", value: d.stack.length ? <StackList items={d.stack} /> : null },
                { label: "Collaborators", value: d.collaborators.length ? d.collaborators.join(", ") : null },
              ]}
            />
          </div>
        </aside>

        <div className="min-w-0 space-y-12 lg:col-span-8 lg:col-start-5">
          {d.notice ? <Notice label="Scope">{d.notice}</Notice> : null}

          <Prose source={r.body} format={r.format} />

          {d.embeds.map((embed) => (
            <section key={embed.url} aria-label={embed.title}>
              <ExternalEmbed url={embed.url} title={embed.title} sandbox={embed.sandbox} />
            </section>
          ))}

          {d.publications.length > 0 || talks.length > 0 ? (
            <section aria-labelledby="outputs-heading" className="max-w-measure border-t border-border pt-6">
              <GroupLabel id="outputs-heading">Outputs</GroupLabel>
              <ul className="mt-4 space-y-4">
                {d.publications.map((p) => (
                  <li key={p.title + p.kind}>
                    <p className="label text-muted-foreground">
                      {p.kind}
                      {p.date ? ` · ${formatPartialDate(p.date, { long: true })}` : ""}
                    </p>
                    <p className="mt-1">{p.url ? <a href={p.url} className="link">{p.title}</a> : p.title}</p>
                    {p.venue ? <p className="text-small text-muted-foreground">{p.venue}</p> : null}
                  </li>
                ))}
              </ul>
              {talks.length > 0 ? (
                <p className="mt-4 text-small">
                  {talks.map((t) => (
                    <Link key={t.slug} href={`/speaking#${t.slug}`} className="link">
                      {t.data.format === "poster" ? "Poster" : "Talk"} at {t.data.event}
                    </Link>
                  ))}
                </p>
              ) : null}
            </section>
          ) : null}

          {updates.length > 0 ? (
            <section aria-labelledby="updates-heading" className="max-w-measure border-t border-border pt-6">
              <GroupLabel id="updates-heading">Updates</GroupLabel>
              <ol className="mt-4 space-y-4">
                {updates.map((u) => (
                  <li key={u.date + u.title} className="grid grid-cols-[7rem_1fr] gap-x-4">
                    <time dateTime={u.date} className="annot pt-0.5 text-muted-foreground">
                      {formatPartialDate(u.date)}
                    </time>
                    <div>
                      <p className="font-medium">{u.title}</p>
                      <p className="text-small text-muted-foreground">{u.summary}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <p>
            <Link href="/research" className="label text-muted-foreground hover:text-foreground">
              ← All research
            </Link>
          </p>
        </div>
      </Container>
    </article>
  );
}
