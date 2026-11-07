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
import { graph, JsonLd, personSchema, websiteSchema } from "@/components/seo/json-ld";
import { getAbout, getCollection, getSite } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { byDateDesc, byOrder } from "@/lib/order";

export const metadata = pageMetadata({ description: getSite().positioning, path: "/" });

/*
 * Home (IMPLEMENTATION_SPEC.md §8.1). What appears is decided by content:
 *   current research   first active research entry by `order`
 *   selected work      featured projects by `order` (PLAN.md Q32: projects
 *                      lead; FairMoney case studies live on /work)
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

  const selected: SelectedItem[] = [...getCollection("projects")]
    .filter((p) => p.data.featured)
    .sort(byOrder)
    .slice(0, 4)
    .map((p) => ({
      kind: p.data.role ?? "Project",
      title: p.data.title,
      summary: p.data.summary,
      href: p.data.research ? `/research/${p.data.research}` : `/projects#${p.slug}`,
      status: p.data.status,
    }));

  const roles = [...getCollection("roles")].filter((r) => r.data.category === "engineering").sort(byOrder).slice(0, 3);
  const talk = [...getCollection("talks")].filter((t) => t.data.featured).sort(byDateDesc((t) => t.data.date))[0];

  return (
    <>
      <JsonLd data={graph(websiteSchema(site), personSchema(site, about))} />
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
      <ProfileLinks email={site.email} profiles={site.profiles} />
    </>
  );
}
