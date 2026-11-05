import { EntryList, EntryRow } from "@/components/content/entry-list";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { getCollection } from "@/content";
import { formatPartialDate } from "@/lib/dates";
import { pageCopy } from "@/config/page-copy";
import { pageMetadata } from "@/lib/metadata";
import { byDateDesc } from "@/lib/order";
import { readingTime } from "@/lib/reading-time";

export const metadata = pageMetadata({
  title: "Writing",
  description: pageCopy.writing.description,
  path: "/writing",
});

export default function WritingPage() {
  const notes = [...getCollection("notes")].sort(byDateDesc((n) => n.data.date));
  const publications = getCollection("publications");

  return (
    <>
      <PageHeader section="/writing" title="Writing" lede={<p>{pageCopy.writing.lede}</p>} />

      <PageSection id="notes" index="§1" eyebrow="Notes" title="Notes and essays">
        {notes.length === 0 ? (
          <p className="max-w-measure border-t border-border pt-6 text-lede text-muted-foreground">
            Notes and essays will appear here.
          </p>
        ) : (
          <EntryList>
            {notes.map((n) => (
              <EntryRow
                key={n.slug}
                href={n.href}
                title={n.data.title}
                summary={n.data.summary}
                margin={
                  <>
                    <time dateTime={n.data.date} className="annot text-muted-foreground">
                      {formatPartialDate(n.data.date)}
                    </time>
                    <span className="annot text-faint">{readingTime(n.body).minutes} min read</span>
                  </>
                }
              />
            ))}
          </EntryList>
        )}
      </PageSection>

      {publications.length > 0 ? (
        <PageSection id="previously" index="§2" eyebrow="Elsewhere" title="Previously">
          <ul className="divide-y divide-border border-y border-border">
            {publications.map((p) => (
              <li key={p.slug} className="grid gap-x-6 gap-y-1 py-5 lg:grid-cols-12">
                <span className="annot text-muted-foreground lg:col-span-2">{p.data.period}</span>
                <span className="font-medium lg:col-span-3">
                  {p.data.url ? (
                    <a href={p.data.url} className="link">
                      {p.data.outlet}
                    </a>
                  ) : (
                    p.data.outlet
                  )}
                </span>
                <span className="text-muted-foreground lg:col-span-7">{p.data.summary}</span>
              </li>
            ))}
          </ul>
        </PageSection>
      ) : null}
    </>
  );
}
