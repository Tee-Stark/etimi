import {
  CurrentResearch,
  ExperienceGlance,
  Introduction,
  ProfileLinks,
  SelectedWork,
  SpeakingHighlight,
  type SelectedItem,
} from "@/components/home/home-sections";
import { ManuscriptHero } from "@/components/home/manuscript-hero";
import { getAbout, getCollection, getSite } from "@/content";
import { byDateDesc, byOrder } from "@/lib/order";

/*
 * Home (IMPLEMENTATION_SPEC.md §8.1). What appears is decided by content:
 *   current research   first active research entry by `order`
 *   selected work      two featured case studies, one other featured research
 *                      entry, one project, each by `order`
 *   experience         engineering roles by `order`
 *   speaking           most recent featured talk
 */

/** First paragraph of a Markdown body as plain text (links reduced to their text). */
function firstParagraph(markdown: string): string {
  const para = markdown.trim().split(/\n\s*\n/)[0] ?? "";
  return para.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();
}

export default function HomePage() {
  const site = getSite();
  const about = getAbout();

  const research = [...getCollection("research")].sort(byOrder);
  const current = research.find((r) => r.data.status === "active");
  const poster = current
    ? [...getCollection("talks")].filter((t) => t.data.research === current.slug && t.data.format === "poster").sort(byDateDesc((t) => t.data.date))[0]
    : undefined;

  const studies = [...getCollection("caseStudies")].filter((s) => s.data.featured).sort(byOrder).slice(0, 2);
  const otherResearch = research.filter((r) => r.data.featured && r.slug !== current?.slug).slice(0, 1);
  const projects = [...getCollection("projects")].sort(byOrder).slice(0, 1);

  const selected: SelectedItem[] = [
    ...studies.map((s) => ({ kind: "Case study", title: s.data.title, summary: s.data.summary, href: s.href!, status: s.data.status })),
    ...otherResearch.map((r) => ({ kind: "Research", title: r.data.title, summary: r.data.summary, href: r.href!, status: r.data.status })),
    ...projects.map((p) => ({ kind: "Project", title: p.data.title, summary: p.data.summary, href: `/projects#${p.slug}`, status: p.data.status })),
  ];

  const roles = [...getCollection("roles")].filter((r) => r.data.category === "engineering").sort(byOrder);
  const talk = [...getCollection("talks")].filter((t) => t.data.featured).sort(byDateDesc((t) => t.data.date))[0];

  return (
    <>
      <ManuscriptHero
        name={site.name}
        title={site.title}
        location={site.location}
        coordinates={site.coordinates}
        positioning={site.positioning}
        intro={site.heroIntro}
        threads={site.threads}
      />
      {current ? <CurrentResearch research={current} poster={poster} /> : null}
      {selected.length > 0 ? <SelectedWork items={selected} /> : null}
      {roles.length > 0 ? <ExperienceGlance roles={roles} /> : null}
      <Introduction excerpt={firstParagraph(about.body)} />
      {talk ? <SpeakingHighlight talk={talk} /> : null}
      <ProfileLinks profiles={site.profiles} />
    </>
  );
}
