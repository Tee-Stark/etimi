import { PendingSection } from "@/components/dev/pending-section";
import { Hero } from "@/components/home/hero";
import { Threads } from "@/components/home/threads";
import { getSite } from "@/content/site";

/*
 * Home (IMPLEMENTATION_SPEC.md §8.1). Phase 1 skeleton: hero and threads are
 * live; remaining sections are development-only markers until the content
 * engine (Phase 2) and pages (Phase 4) supply them.
 */
export default function HomePage() {
  const site = getSite();

  return (
    <>
      <Hero
        name={site.name}
        title={site.title}
        location={site.location}
        positioning={site.positioning}
        intro={site.heroIntro}
      />
      <Threads threads={site.threads} />
      <PendingSection title="Current research" note="HAUV highlight with poster status (Phase 4)." />
      <PendingSection title="Selected work" note="3–4 items across engineering, research and projects (Phase 4)." />
      <PendingSection title="Experience at a glance" note="FairMoney → Analytics Intelligence Africa → Naerospace (Phase 4)." />
      <PendingSection title="Short introduction" note="First-person excerpt linking to About (Phase 4)." />
      <PendingSection title="Speaking highlight" note="The Gopher's Trident, GopherCon Africa 2026 (Phase 4)." />
      <PendingSection title="Profile links" note="Render only once URLs are confirmed (open item O11)." />
    </>
  );
}
