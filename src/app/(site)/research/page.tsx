import { FactList, StackList } from "@/components/content/article-parts";
import { EntryList, EntryRow } from "@/components/content/entry-list";
import { StatusLabel } from "@/components/content/status-label";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { getCollection } from "@/content";
import { formatPartialDate } from "@/lib/dates";
import { pageCopy } from "@/config/page-copy";
import { pageMetadata } from "@/lib/metadata";
import { byOrder } from "@/lib/order";

export const metadata = pageMetadata({
  title: "Research",
  description: pageCopy.research.description,
  path: "/research",
});

export default function ResearchPage() {
  const research = [...getCollection("research")].sort(byOrder);

  return (
    <>
      <PageHeader
        section="/research"
        title="Research"
        lede={<p>{pageCopy.research.lede}</p>}
      />
      <PageSection id="projects" index="§1" eyebrow="Index" title="Research projects">
        <EntryList>
          {research.map((r, i) => {
            const poster = r.data.publications[0];
            return (
              <EntryRow
                key={r.slug}
                index={String(i + 1).padStart(2, "0")}
                href={r.href}
                title={r.data.title}
                summary={r.data.summary}
                margin={<StatusLabel status={r.data.status} />}
                aside={
                  <FactList
                    items={[
                      { label: "Full title", value: r.data.fullTitle },
                      { label: "Affiliation", value: r.data.affiliation },
                      {
                        label: poster ? poster.kind[0].toUpperCase() + poster.kind.slice(1) : "Output",
                        value: poster ? [poster.venue, poster.date ? formatPartialDate(poster.date) : null].filter(Boolean).join(" · ") : null,
                      },
                      { label: "Implementation", value: r.data.stack.length ? <StackList items={r.data.stack} /> : null },
                    ]}
                  />
                }
              />
            );
          })}
        </EntryList>
      </PageSection>
    </>
  );
}
