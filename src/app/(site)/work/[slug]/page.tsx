import Link from "next/link";
import { notFound } from "next/navigation";
import { FactList, MetricList, Notice, PreviewBanner, StackList, TableOfContents } from "@/components/content/article-parts";
import { Prose } from "@/components/content/prose";
import { StatusLabel } from "@/components/content/status-label";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { getCollection, getEntry, getRouteParams } from "@/content";
import { extractHeadings } from "@/lib/headings";
import { pageMetadata } from "@/lib/metadata";
import { byOrder } from "@/lib/order";

/*
 * Detail pages are prerendered for every published slug. `instant = false`
 * lets the page read params before rendering, so an unknown or hidden slug
 * gets a real 404 status rather than a streamed "soft" not-found.
 */
export const instant = false;

export function generateStaticParams() {
  return getRouteParams("caseStudies");
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getEntry("caseStudies", slug);
  if (!study) return {};
  return pageMetadata({ title: study.data.title, description: study.data.summary, path: study.href! });
}

/*
 * Case-study template (IMPLEMENTATION_SPEC.md §8.4): summary first, then
 * context → problem → what I did → outcome, each only if recorded, then any
 * body text, cleared metrics, and the confidentiality note.
 */
export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const study = getEntry("caseStudies", slug);
  if (!study) notFound();

  const d = study.data;
  const role = d.role ? getEntry("roles", d.role) : undefined;

  // Structured fields become numbered sections, so they share the prose's §-numbering and contents list.
  const sections = [
    ["Context", d.context],
    ["The problem", d.problem],
    ["What I did", d.approach],
    ["Outcome", d.outcome],
  ].filter((s): s is [string, string] => Boolean(s[1]));
  const source = [...sections.map(([h, text]) => `## ${h}\n\n${text}`), study.body.trim()].filter(Boolean).join("\n\n");
  const headings = extractHeadings(source);

  const related = role
    ? [...getCollection("caseStudies")].filter((s) => s.slug !== study.slug && s.data.role === role.slug).sort(byOrder)
    : [];

  return (
    <article>
      <PreviewBanner preview={study.preview} />
      <PageHeader
        section="/work"
        eyebrow="Case study"
        title={d.title}
        lede={<p>{d.summary}</p>}
        meta={<StatusLabel status={d.status} />}
      />

      <Container className="grid gap-x-6 gap-y-12 py-14 sm:py-16 lg:grid-cols-12 lg:py-20">
        <aside className="min-w-0 lg:col-span-3">
          <div className="space-y-10 lg:sticky lg:top-8">
            <FactList
              items={[
                { label: "Organisation", value: role?.data.organisation },
                { label: "Role", value: role?.data.role },
                { label: "Stack", value: d.stack.length ? <StackList items={d.stack} /> : null },
              ]}
            />
            <TableOfContents headings={headings} />
          </div>
        </aside>

        <div className="min-w-0 space-y-12 lg:col-span-8 lg:col-start-5">
          <Prose source={source} format={study.format} />

          {d.metrics.length > 0 ? (
            <section aria-labelledby="results-heading">
              <h2 id="results-heading" className="label mb-4 text-muted-foreground">
                Results
              </h2>
              <MetricList metrics={d.metrics} />
            </section>
          ) : null}

          {d.confidentialityNote ? <Notice label="Confidentiality">{d.confidentialityNote}</Notice> : null}

          {related.length > 0 && role ? (
            <nav aria-labelledby="related-heading" className="border-t border-border pt-6">
              <h2 id="related-heading" className="label text-muted-foreground">
                More work at {role.data.organisation}
              </h2>
              <ul className="mt-4 space-y-2">
                {related.map((s) => (
                  <li key={s.slug}>
                    <Link href={s.href!} className="link">
                      {s.data.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <p>
            <Link href="/work" className="label text-muted-foreground hover:text-foreground">
              ← All work
            </Link>
          </p>
        </div>
      </Container>
    </article>
  );
}
