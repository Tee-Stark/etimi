import Link from "next/link";
import { MarkFigure } from "@/components/brand/mark-figure";
import { FactList, GroupLabel } from "@/components/content/article-parts";
import { Prose } from "@/components/content/prose";
import { Container } from "@/components/layout/container";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { graph, JsonLd, personSchema } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/typography/section-heading";
import { getAbout, getCollection, getSite } from "@/content";
import { formatDateRange, formatPartialDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site-url";
import { byDateDesc, byOrder } from "@/lib/order";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Timmy Omolana (Timilehin Omolana): software engineer and researcher in Lagos, graduate of Industrial Mathematics at the University of Lagos.",
  path: "/about",
  type: "profile",
});

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="text-faint">
            –
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  const site = getSite();
  const about = getAbout();
  const research = new Map(getCollection("research").map((r) => [r.slug, r]));
  const community = [...getCollection("community")].sort(byOrder);
  const music = community.filter((c) => c.data.category === "music");
  const teaching = community.filter((c) => c.data.category !== "music");

  // "At a glance": every value comes from published content.
  const current = getCollection("roles").find((r) => r.data.category === "engineering" && r.data.end === null);
  const activeResearch = [...getCollection("research")].sort(byOrder).find((r) => r.data.status === "active");
  const degree = about.education[0];
  const latestTalk = [...getCollection("talks")].filter((t) => t.data.format === "talk").sort(byDateDesc((t) => t.data.date))[0];
  const glance = [
    { label: "Based in", value: site.location },
    { label: "Now", value: current ? `${current.data.role}, ${current.data.organisation}` : null },
    {
      label: "Researching",
      value: activeResearch ? (
        <Link href={activeResearch.href!} className="link">
          {activeResearch.data.title}
        </Link>
      ) : null,
    },
    {
      label: "Studied",
      value: degree
        ? `${degree.qualification}, ${degree.institution}${degree.completed ? ` (${formatPartialDate(degree.completed)})` : ""}`
        : null,
    },
    {
      label: "Certified",
      value: about.certifications.length ? about.certifications.map((c) => c.name.replace(/^AWS Certified /, "AWS ")).join("; ") : null,
    },
    {
      label: "Last spoke at",
      value: latestTalk ? (
        <Link href={`/speaking#${latestTalk.slug}`} className="link">
          {latestTalk.data.event}
        </Link>
      ) : null,
    },
  ];

  return (
    <>
      <JsonLd
        data={graph({
          "@type": "ProfilePage",
          "@id": absoluteUrl("/about"),
          url: absoluteUrl("/about"),
          name: `About ${site.name}`,
          mainEntity: personSchema(site, about),
        })}
      />
      {/*
        The eTimi mark, faded, as the backdrop of the page opening. It sits in
        a layer below the text and stays in view (sticky) while the header and
        biography scroll over it.
      */}
      <div className="relative isolate overflow-x-clip">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="sticky top-0 flex h-dvh items-center justify-center">
            <MarkFigure tone="background" className="w-[118vw] max-w-none shrink-0 sm:w-[100vw] lg:w-[80vw] lg:max-w-[1320px]" />
          </div>
        </div>

        <PageHeader
          section="/about"
          title="About"
          subtitle={
            <>
              {site.name} ({site.fullName})
              <br />
              {site.title} · {site.location}
            </>
          }
          lede={<p>{about.philosophy.statement}</p>}
        />

        <section id="biography" aria-labelledby="biography-heading" className="scroll-mt-6 py-14 sm:py-16 lg:py-20">
          <Container>
            <SectionHeading id="biography-heading" index="§1" eyebrow="Biography">
              In brief
            </SectionHeading>
            <div className="mt-10 grid gap-x-6 gap-y-12 lg:grid-cols-12">
              <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
                <Prose source={about.body} format={about.format} className="prose-lede" />
                {site.cv ? (
                  <p className="mt-8">
                    <a href={site.cv} className="link">
                      Download my CV (PDF)
                    </a>
                  </p>
                ) : null}
              </div>
              <aside aria-label="At a glance" className="lg:col-span-4 lg:row-start-1">
                <div className="border-t border-border pt-4 lg:sticky lg:top-8">
                  <p className="label text-muted-foreground">At a glance</p>
                  <FactList className="mt-6" items={glance} />
                </div>
              </aside>
            </div>
          </Container>
        </section>
      </div>

      <PageSection id="education" index="§2" eyebrow="Education" title="Education and certifications">
        <ul className="grid gap-8 lg:grid-cols-12">
          {about.education.map((edu) => {
            const thesis = edu.thesis ? research.get(edu.thesis) : undefined;
            return (
              <li key={edu.qualification} className="lg:col-span-8">
                <p className="text-h3 font-medium tracking-tight">{edu.qualification}</p>
                <p className="mt-1 text-muted-foreground">
                  {edu.institution}
                  {edu.start
                    ? ` · ${formatDateRange(edu.start, edu.completed ?? null)}`
                    : edu.completed
                      ? ` · graduated ${formatPartialDate(edu.completed, { long: true })}`
                      : ""}
                </p>
                {thesis ? (
                  <p className="mt-3">
                    Thesis:{" "}
                    <Link href={thesis.href!} className="link">
                      {thesis.data.title}
                    </Link>
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        {about.certifications.length > 0 ? (
          <div className="mt-12">
            <GroupLabel as="h3">Certifications</GroupLabel>
            <ul className="mt-4 grid border-t border-l border-border sm:grid-cols-2 lg:w-2/3">
              {about.certifications.map((c) => (
                <li key={c.name} className="border-r border-b border-border p-5">
                  {c.abbreviation ? <p className="label text-muted-foreground">{c.abbreviation}</p> : null}
                  <p className="mt-2 font-medium">{c.name}</p>
                  <p className="text-small text-muted-foreground">{c.issuer}</p>
                  {c.url ? (
                    <a href={c.url} className="link mt-3 inline-block text-small">
                      Verify credential<span className="sr-only">: {c.name}</span>
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {about.academicInterests.length > 0 ? (
          <div className="mt-12 max-w-3xl">
            <GroupLabel as="h3">Academic interests</GroupLabel>
            <p className="mt-4 text-muted-foreground">{about.academicInterests.join(" · ")}</p>
          </div>
        ) : null}
      </PageSection>

      <PageSection id="philosophy" index="§3" eyebrow="Philosophy" title="Connecting fields">
        <ol className="grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
          {about.philosophy.connections.map((c, i) => (
            <li key={c} className="border-r border-b border-border p-5">
              <span aria-hidden="true" className="annot text-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3">{c}</p>
            </li>
          ))}
        </ol>
        {about.learningStyle ? <p className="mt-8 max-w-measure text-muted-foreground">{about.learningStyle}</p> : null}
      </PageSection>

      <PageSection id="interests" index="§4" eyebrow="Interests" title="What I'm curious about">
        <div className="max-w-3xl columns-1 gap-x-10 sm:columns-2">
          <Bullets items={about.interests} />
        </div>
      </PageSection>

      <PageSection id="music" index="§5" eyebrow="Beyond engineering" title="Music, teaching and mentorship">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <GroupLabel as="h3">Music</GroupLabel>
            <ul className="mt-4 space-y-6">
              {about.music.length > 0 ? (
                <li>
                  <p className="label text-muted-foreground">Instrument</p>
                  <p className="mt-1 font-medium">{about.music.join(", ")}</p>
                </li>
              ) : null}
              {music.map((c) => (
                <li key={c.slug}>
                  <p className="font-medium">{c.data.title}</p>
                  <p className="text-small text-muted-foreground">
                    {[c.data.role, c.data.organisation, c.data.period].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-2 text-small">{c.data.summary}</p>
                  {c.body.trim() ? <p className="mt-1 text-small text-muted-foreground">{c.body.trim()}</p> : null}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-small text-muted-foreground">
              Music and mathematics meet in my thesis on{" "}
              <Link href="/research/dechorder" className="link">
                source separation for African music
              </Link>
              .
            </p>
          </div>
          <div>
            <GroupLabel as="h3">Teaching and mentorship</GroupLabel>
            <ul className="mt-4 space-y-6">
              {teaching.map((c) => (
                <li key={c.slug}>
                  <p className="font-medium">{c.data.title}</p>
                  <p className="text-small text-muted-foreground">
                    {[c.data.role, c.data.organisation, c.data.period].filter(Boolean).join(" · ")}
                  </p>
                  <p className="mt-2 text-small">{c.data.summary}</p>
                  {c.body.trim() ? <p className="mt-1 text-small text-muted-foreground">{c.body.trim()}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageSection>

      <PageSection id="skills" index="§6" eyebrow="Skills" title="Tools and methods">
        <dl className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {about.skills.map((group) => (
            <div key={group.domain}>
              <dt className="label border-t border-border pt-3 text-muted-foreground">{group.domain}</dt>
              <dd className="mt-4">
                <ul className="space-y-1.5 text-small">
                  {group.items.map((item) => (
                    <li key={item.name} className="flex flex-wrap items-baseline gap-x-2">
                      <span>{item.name}</span>
                      {item.note ? <span className="label text-muted-foreground">({item.note})</span> : null}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </PageSection>
    </>
  );
}
