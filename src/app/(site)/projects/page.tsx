import { FactList, StackList } from "@/components/content/article-parts";
import { EntryList, EntryRow } from "@/components/content/entry-list";
import { Prose } from "@/components/content/prose";
import { StatusLabel } from "@/components/content/status-label";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { getCollection } from "@/content";
import { pageCopy } from "@/config/page-copy";
import { pageMetadata } from "@/lib/metadata";
import { byOrder } from "@/lib/order";

export const metadata = pageMetadata({
  title: "Projects",
  description: pageCopy.projects.description,
  path: "/projects",
});

export default function ProjectsPage() {
  const projects = [...getCollection("projects")].sort(byOrder);

  return (
    <>
      <PageHeader section="/projects" title="Projects" lede={<p>{pageCopy.projects.lede}</p>} />
      <PageSection id="index" index="§1" eyebrow="Index" title="Projects and explorations">
        {projects.length === 0 ? (
          <p className="text-muted-foreground">Projects will appear here.</p>
        ) : (
          <EntryList>
            {projects.map((p, i) => (
              <EntryRow
                key={p.slug}
                id={p.slug}
                index={String(i + 1).padStart(2, "0")}
                title={p.data.title}
                summary={p.data.summary}
                margin={<StatusLabel status={p.data.status} />}
                aside={
                  <FactList
                    items={[
                      { label: "Stack", value: p.data.stack.length ? <StackList items={p.data.stack} /> : null },
                      { label: "Code", value: p.data.repo ? <a href={p.data.repo} className="link">Repository</a> : null },
                      ...p.data.links.map((l) => ({ label: l.label, value: <a href={l.url} className="link">{l.url.replace(/^https:\/\//, "")}</a> })),
                    ]}
                  />
                }
              >
                {p.body.trim() ? <Prose source={p.body} format={p.format} /> : null}
              </EntryRow>
            ))}
          </EntryList>
        )}
      </PageSection>
    </>
  );
}
