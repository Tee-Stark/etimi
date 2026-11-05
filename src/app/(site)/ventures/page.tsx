import { FactList, GroupLabel, StackList } from "@/components/content/article-parts";
import { EntryList, EntryRow } from "@/components/content/entry-list";
import { Prose } from "@/components/content/prose";
import { StatusLabel } from "@/components/content/status-label";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { getCollection } from "@/content";
import { formatPartialDate } from "@/lib/dates";
import { pageCopy } from "@/config/page-copy";
import { pageMetadata } from "@/lib/metadata";
import { byOrder } from "@/lib/order";

export const metadata = pageMetadata({
  title: "Ventures",
  description: pageCopy.ventures.description,
  path: "/ventures",
});

export default function VenturesPage() {
  const ventures = [...getCollection("ventures")].sort(byOrder);

  return (
    <>
      <PageHeader section="/ventures" title="Ventures" lede={<p>{pageCopy.ventures.lede}</p>} />
      <PageSection id="index" index="§1" eyebrow="Index" title="Ventures">
        <EntryList>
          {ventures.map((v, i) => (
            <EntryRow
              key={v.slug}
              id={v.slug}
              index={String(i + 1).padStart(2, "0")}
              title={v.data.title}
              summary={v.data.summary}
              margin={<StatusLabel status={v.data.status} />}
              aside={
                <FactList
                  items={[
                    { label: "Stage", value: v.data.stage },
                    { label: "Stack", value: v.data.stack.length ? <StackList items={v.data.stack} /> : null },
                    ...v.data.links.map((l) => ({ label: l.label, value: <a href={l.url} className="link">{l.url.replace(/^https:\/\//, "")}</a> })),
                  ]}
                />
              }
            >
              <Prose source={v.body} format={v.format} />
              {v.data.milestones.length > 0 ? (
                <div className="mt-6">
                  <GroupLabel as="h4">Milestones</GroupLabel>
                  <ul className="mt-3 space-y-1.5 text-small">
                    {v.data.milestones.map((m) => (
                      <li key={m.text} className="flex gap-3">
                        <span className="annot w-20 shrink-0 text-muted-foreground">{m.date ? formatPartialDate(m.date) : ""}</span>
                        <span>{m.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </EntryRow>
          ))}
        </EntryList>
      </PageSection>
    </>
  );
}
