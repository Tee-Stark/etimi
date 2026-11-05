import type { CollectionName } from "./collections";
import { collections } from "./collections";
import { publicLinks, publicUrl, type PublicLink } from "./links";
import type { Entry } from "./loader";
import { publicMetrics, type PublicMetric } from "./metrics";
import type {
  CaseStudyData,
  CommunityData,
  NoteData,
  ProjectData,
  PublicationData,
  ResearchData,
  RoleData,
  SiteData,
  TalkData,
  VentureData,
} from "./schemas/entities";

/*
 * Publication policy (IMPLEMENTATION_SPEC.md §4.4, §4.5).
 *
 * Production: an entry is published only if `visibility: public` (and, for
 * notes, `draft: false`). Hidden child objects (links, metrics,
 * collaborators, milestones, embeds, publications, updates, talk links) are
 * removed independently, and the projection returns new objects containing
 * only publishable fields, so withheld data cannot be serialised by
 * accident.
 *
 * Development preview: with NODE_ENV=development AND CONTENT_PREVIEW=1,
 * hidden and draft *entries* are included and flagged `preview: true` (pages
 * show a banner). Hidden *children* stay filtered even in preview. A
 * production build ignores CONTENT_PREVIEW entirely.
 */

type Env = Record<string, string | undefined>;

export function isPreviewEnabled(env: Env = process.env): boolean {
  return env.NODE_ENV === "development" && env.CONTENT_PREVIEW === "1";
}

/** Whether an entry is published (ignores preview). */
export function isPublished(entry: Entry): boolean {
  if (entry.data.visibility !== "public") return false;
  if (entry.collection === "notes" && (entry.data as NoteData).draft) return false;
  return true;
}

// ── Public data shapes ──────────────────────────────────────────────────

type Base<T> = Omit<T, "visibility">;

export type PublicRole = Base<RoleData>;
export type PublicCaseStudy = Omit<Base<CaseStudyData>, "metrics" | "role"> & { metrics: PublicMetric[]; role?: string };
export type PublicResearch = Omit<Base<ResearchData>, "collaborators" | "publications" | "updates" | "embeds" | "links"> & {
  /** Only collaborators who consented to be named. */
  collaborators: string[];
  publications: Array<Omit<ResearchData["publications"][number], "visibility" | "url"> & { url?: string }>;
  updates: Array<Omit<ResearchData["updates"][number], "visibility">>;
  embeds: Array<Omit<ResearchData["embeds"][number], "visibility">>;
  links: PublicLink[];
};
export type PublicProject = Omit<Base<ProjectData>, "repo" | "links"> & { repo?: string; links: PublicLink[] };
export type PublicVenture = Omit<Base<VentureData>, "milestones" | "links"> & {
  milestones: Array<Omit<VentureData["milestones"][number], "visibility">>;
  links: PublicLink[];
};
export type PublicTalk = Omit<Base<TalkData>, "links" | "research"> & {
  links: Partial<Record<"slides" | "video" | "repo" | "pdf", string>>;
  research?: string;
};
export type PublicNote = Base<NoteData>;
export type PublicPublication = Omit<Base<PublicationData>, "url"> & { url?: string };
export type PublicCommunity = Base<CommunityData>;

export type PublicData = {
  roles: PublicRole;
  caseStudies: PublicCaseStudy;
  research: PublicResearch;
  projects: PublicProject;
  ventures: PublicVenture;
  talks: PublicTalk;
  notes: PublicNote;
  publications: PublicPublication;
  community: PublicCommunity;
};

export type PublicEntry<N extends CollectionName = CollectionName> = {
  collection: N;
  id: string;
  slug: string;
  /** Detail-page URL, for collections that have detail pages. */
  href?: string;
  format: Entry["format"];
  body: string;
  data: PublicData[N];
  /** True only for hidden/draft entries shown in development preview. */
  preview: boolean;
};

export type PublicSite = Omit<SiteData, "email" | "cv" | "profiles"> & {
  email: string | null;
  cv: string | null;
  profiles: PublicLink[];
};

// ── Projection ──────────────────────────────────────────────────────────

/** Ids ("<collection>/<slug>") of entries that are published; used to drop references to hidden entries. */
export type ProjectionContext = { publishedIds: ReadonlySet<string> };

function stripVisibility<T extends { visibility: unknown }>(value: T): Omit<T, "visibility"> {
  const { visibility: _visibility, ...rest } = value;
  void _visibility;
  return rest;
}

function ref(collection: CollectionName, slug: string | undefined, ctx: ProjectionContext): string | undefined {
  return slug && ctx.publishedIds.has(`${collection}/${slug}`) ? slug : undefined;
}

const projectors: { [N in CollectionName]: (data: Entry<N>["data"], ctx: ProjectionContext) => PublicData[N] } = {
  roles: (d) => stripVisibility(d),
  caseStudies: (d, ctx) => ({ ...stripVisibility(d), metrics: publicMetrics(d.metrics), role: ref("roles", d.role, ctx) }),
  research: (d) => ({
    ...stripVisibility(d),
    collaborators: d.collaborators.filter((c) => c.consent === true).map((c) => c.name),
    publications: d.publications
      .filter((p) => p.visibility === "public")
      .map(({ visibility: _v, url, ...p }) => (void _v, { ...p, ...(url ? { url } : {}) })),
    updates: d.updates.filter((u) => u.visibility === "public").map(stripVisibility),
    embeds: d.embeds.filter((e) => e.visibility === "public" && e.url).map(stripVisibility),
    links: publicLinks(d.links),
  }),
  projects: (d) => {
    const repo = publicUrl(d.repo);
    return { ...stripVisibility(d), repo, links: publicLinks(d.links) };
  },
  ventures: (d) => ({
    ...stripVisibility(d),
    milestones: d.milestones.filter((m) => m.visibility === "public").map(stripVisibility),
    links: publicLinks(d.links),
  }),
  talks: (d, ctx) => {
    const links: PublicTalk["links"] = {};
    for (const key of ["slides", "video", "repo", "pdf"] as const) {
      const url = publicUrl(d.links[key]);
      if (url) links[key] = url;
    }
    return { ...stripVisibility(d), links, research: ref("research", d.research, ctx) };
  },
  notes: (d) => stripVisibility(d),
  publications: (d) => ({ ...stripVisibility(d), url: publicUrl(d.url) }),
  community: (d) => stripVisibility(d),
};

/** Remove undefined keys so they are not serialised as `"$undefined"` placeholders. */
function compact<T extends object>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined)) as T;
}

export function projectEntry<N extends CollectionName>(entry: Entry<N>, ctx: ProjectionContext, preview = false): PublicEntry<N> {
  const route = (collections[entry.collection] as { route?: (slug: string) => string }).route;
  const data = compact(projectors[entry.collection](entry.data, ctx) as PublicData[N] & object);
  return {
    collection: entry.collection,
    id: entry.id,
    slug: entry.data.slug,
    ...(route ? { href: route(entry.data.slug) } : {}),
    format: entry.format,
    body: entry.body,
    data,
    preview,
  };
}

export function projectSite(site: SiteData): PublicSite {
  const { email, cv, profiles, ...rest } = site;
  return {
    ...rest,
    email: email.visibility === "public" && email.address ? email.address : null,
    cv: cv.visibility === "public" && cv.path ? cv.path : null,
    profiles: publicLinks(profiles),
  };
}

/**
 * Filter and project a collection. Strict by default; `preview` adds hidden
 * and draft entries (flagged) and must only be passed from
 * `isPreviewEnabled()`.
 */
export function selectEntries<N extends CollectionName>(
  entries: readonly Entry<N>[],
  ctx: ProjectionContext,
  { preview = false }: { preview?: boolean } = {},
): PublicEntry<N>[] {
  const out: PublicEntry<N>[] = [];
  for (const entry of entries) {
    if (isPublished(entry)) out.push(projectEntry(entry, ctx, false));
    else if (preview) out.push(projectEntry(entry, ctx, true));
  }
  return out;
}

export function publishedIds(all: Record<CollectionName, readonly Entry[]>): Set<string> {
  const ids = new Set<string>();
  for (const list of Object.values(all)) for (const entry of list) if (isPublished(entry)) ids.add(entry.id);
  return ids;
}
