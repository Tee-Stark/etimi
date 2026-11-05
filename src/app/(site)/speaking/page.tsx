import Link from "next/link";
import { FactList } from "@/components/content/article-parts";
import { EntryList, EntryRow } from "@/components/content/entry-list";
import { PageHeader } from "@/components/layout/page-header";
import { PageSection } from "@/components/layout/page-section";
import { getAbout, getCollection } from "@/content";
import { formatPartialDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/metadata";
import { byDateDesc } from "@/lib/order";

export const metadata = pageMetadata({
  title: "Speaking",
  description: "Talks and posters by Timmy Omolana, including GopherCon Africa 2026 and DevFest Lagos 2024.",
  path: "/speaking",
});

const STAGE: Record<string, { talk: string; poster: string }> = {
  accepted: { talk: "Accepted", poster: "Poster accepted" },
  scheduled: { talk: "Scheduled", poster: "Poster scheduled" },
  delivered: { talk: "Delivered", poster: "Poster presented" },
};

const LINK_LABELS = { slides: "Slides", video: "Recording", repo: "Code", pdf: "Poster (PDF)" } as const;

export default function SpeakingPage() {
  const talks = [...getCollection("talks")].sort(byDateDesc((t) => t.data.date));
  const research = new Map(getCollection("research").map((r) => [r.slug, r]));
  const about = getAbout();

  return (
    <>
      <PageHeader section="/speaking" title="Speaking" lede={<p>Talks and posters, most recent first.</p>} />

      <PageSection id="talks" index="§1" eyebrow="Talks and posters" title="Appearances">
        <EntryList>
          {talks.map((t) => {
            const linked = t.data.research ? research.get(t.data.research) : undefined;
            const links = Object.entries(t.data.links) as Array<[keyof typeof LINK_LABELS, string]>;
            return (
              <EntryRow
                key={t.slug}
                id={t.slug}
                title={t.data.title}
                summary={t.data.summary}
                margin={
                  <>
                    <time dateTime={t.data.date} className="annot text-muted-foreground">
                      {formatPartialDate(t.data.date)}
                    </time>
                    <span className="label text-foreground">{STAGE[t.data.stage][t.data.format]}</span>
                  </>
                }
                aside={
                  <FactList
                    items={[
                      { label: "Event", value: t.data.event },
                      { label: "Where", value: t.data.location },
                      { label: "Format", value: t.data.format === "poster" ? "Poster" : "Talk" },
                      { label: "Also", value: t.data.involvement },
                    ]}
                  />
                }
              >
                <p className="max-w-measure text-small">{t.data.abstract}</p>
                {linked || links.length > 0 ? (
                  <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-small">
                    {linked ? (
                      <Link href={linked.href!} className="link">
                        Read the research: {linked.data.title}
                      </Link>
                    ) : null}
                    {links.map(([key, url]) => (
                      <a key={key} href={url} className="link">
                        {LINK_LABELS[key]}
                      </a>
                    ))}
                  </p>
                ) : null}
              </EntryRow>
            );
          })}
        </EntryList>
      </PageSection>

      {about.speakerBio ? (
        <PageSection id="organisers" index="§2" eyebrow="Press kit" title="For organisers">
          <div className="grid gap-x-6 gap-y-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="label text-muted-foreground">Short bio</p>
              <p className="mt-3 max-w-measure text-lede">{about.speakerBio}</p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="label text-muted-foreground">Invitations</p>
              <p className="mt-3 text-small">
                To invite me to speak, see{" "}
                <Link href="/contact" className="link">
                  contact
                </Link>
                .
              </p>
            </div>
          </div>
        </PageSection>
      ) : null}
    </>
  );
}
