import Link from "next/link";
import { FactList, GroupLabel, StackList } from "@/components/content/article-parts";
import { EntryList, EntryRow } from "@/components/content/entry-list";
import { StatusLabel } from "@/components/content/status-label";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { getCollection } from "@/content";
import { formatDateRange } from "@/lib/dates";
import { pageCopy } from "@/config/page-copy";
import { pageMetadata } from "@/lib/metadata";
import { byOrder } from "@/lib/order";

export const metadata = pageMetadata({
  title: "Work",
  description: pageCopy.work.description,
  path: "/work",
});

export default function WorkPage() {
  const roles = [...getCollection("roles")].sort(byOrder);
  const studies = [...getCollection("caseStudies")].sort(byOrder);
  const roleBySlug = new Map(roles.map((r) => [r.slug, r]));
  const featured = studies.filter((s) => s.data.featured);
  const more = studies.filter((s) => !s.data.featured);
  const engineering = roles.filter((r) => r.data.category === "engineering");
  const writing = roles.filter((r) => r.data.category !== "engineering");

  return (
    <>
      <PageHeader
        section="/work"
        title="Work"
        lede={
<p>{pageCopy.work.lede}</p>
        }
      />

      <PageSection id="experience" index="§1" eyebrow="Timeline" title="Experience">
        <EntryList>
          {engineering.map((role) => (
            <EntryRow
              key={role.slug}
              as="h3"
              title={role.data.organisation}
              summary={role.data.summary}
              margin={
                <span className="annot text-muted-foreground">
                  {formatDateRange(role.data.start, role.data.end) ?? <span className="sr-only">Dates not listed</span>}
                </span>
              }
              aside={
                <FactList
                  items={[
                    { label: "Role", value: role.data.role },
                    { label: "About", value: role.data.orgNote },
                    { label: "Mode", value: role.data.mode ? role.data.mode[0].toUpperCase() + role.data.mode.slice(1) : null },
                  ]}
                />
              }
            >
              {role.data.highlights.length > 0 ? (
                <ul className="space-y-1.5 text-small">
                  {role.data.highlights.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span aria-hidden="true" className="text-faint">–</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {role.body.trim() ? <p className="mt-4 text-small text-muted-foreground">{role.body.trim()}</p> : null}
              {role.data.otherWork.length > 0 ? (
                <div className="mt-6">
                  <GroupLabel as="h4">Other work</GroupLabel>
                  <ul className="mt-3 space-y-1.5 text-small text-muted-foreground">
                    {role.data.otherWork.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span aria-hidden="true" className="text-faint">–</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </EntryRow>
          ))}
        </EntryList>

        {writing.length > 0 ? (
          <div className="mt-14">
            <GroupLabel as="h3">Writing</GroupLabel>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {writing.map((role) => (
                <li key={role.slug} className="grid gap-x-6 gap-y-1 py-4 lg:grid-cols-12">
                  <span className="annot text-muted-foreground lg:col-span-2">{formatDateRange(role.data.start, role.data.end)}</span>
                  <span className="font-medium lg:col-span-3">{role.data.organisation}</span>
                  <span className="text-small text-muted-foreground lg:col-span-7">{role.data.summary}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </PageSection>
      <PageSection id="selected" index="§2" eyebrow="Case studies" title="Selected engineering">
        <EntryList>
          {featured.map((study, i) => {
            const role = study.data.role ? roleBySlug.get(study.data.role) : undefined;
            return (
              <EntryRow
                key={study.slug}
                index={String(i + 1).padStart(2, "0")}
                href={study.href}
                title={study.data.title}
                summary={study.data.summary}
                margin={<StatusLabel status={study.data.status} />}
                aside={
                  <FactList
                    items={[
                      { label: "Organisation", value: role?.data.organisation },
                      { label: "Stack", value: study.data.stack.length ? <StackList items={study.data.stack} /> : null },
                    ]}
                  />
                }
              />
            );
          })}
        </EntryList>

        {more.length > 0 ? (
          <div className="mt-14">
            <GroupLabel as="h3">More work</GroupLabel>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {more.map((study) => (
                <li key={study.slug} className="grid gap-x-6 gap-y-1 py-4 lg:grid-cols-12">
                  <Link href={study.href!} className="link font-medium lg:col-span-4">
                    {study.data.title}
                  </Link>
                  <p className="text-small text-muted-foreground lg:col-span-8">{study.data.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="mt-10 max-w-measure text-small text-muted-foreground">
          Employer work is described at a high level. I don&apos;t publish internal code, architecture, customer data or
          business figures that haven&apos;t been approved.
        </p>
      </PageSection>

    </>
  );
}
