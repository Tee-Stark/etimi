import { z } from "zod";
import {
  baseShape,
  isoDateSchema,
  linkSchema,
  nonEmpty,
  optionalUrlSchema,
  partialDateSchema,
  slugSchema,
  statusSchema,
  threadSchema,
  visibilitySchema,
} from "./common";
import { metricSchema } from "./metric";

/*
 * One schema per collection (IMPLEMENTATION_SPEC.md §4.3). Long-form prose
 * lives in each file's Markdown body; frontmatter holds structured facts.
 */

// ── Site (singleton) ────────────────────────────────────────────────────

export const siteSchema = z
  .object({
    name: nonEmpty("name"),
    fullName: nonEmpty("fullName"),
    title: nonEmpty("title"),
    location: nonEmpty("location"),
    coordinates: nonEmpty("coordinates"),
    positioning: nonEmpty("positioning"),
    heroIntro: nonEmpty("heroIntro"),
    threads: z
      .array(
        z
          .object({
            id: threadSchema,
            label: nonEmpty("label"),
            description: nonEmpty("description"),
            note: nonEmpty("note"),
            href: z.string().startsWith("/", "Use an internal path starting with /"),
          })
          .strict(),
      )
      .length(3, "Exactly three threads: engineering, research, creation"),
    email: z
      .object({ address: z.string().trim(), visibility: visibilitySchema })
      .strict()
      .refine((e) => e.visibility === "hidden" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.address), {
        message: "A public email needs a valid address",
        path: ["address"],
      }),
    cv: z
      .object({ path: z.string().trim(), visibility: visibilitySchema })
      .strict()
      .refine((c) => c.visibility === "hidden" || c.path.startsWith("/"), {
        message: "A public CV needs a path under public/, starting with /",
        path: ["path"],
      }),
    profiles: z.array(linkSchema).default([]),
  })
  .strict();

// ── About (singleton) ──────────────────────────────────────────────────
// Structured facts for the About page. The long biography is the file body.

const skillItemSchema = z.union([
  nonEmpty("skill"),
  z
    .object({
      name: nonEmpty("name"),
      /** The only markers allowed: no ratings, percentages or levels. */
      note: z.enum(["primary", "learning"]),
    })
    .strict(),
]);

export const aboutSchema = z
  .object({
    education: z
      .array(
        z
          .object({
            institution: nonEmpty("institution"),
            qualification: nonEmpty("qualification"),
            /** Start date at the precision known, if recorded. */
            start: partialDateSchema.optional(),
            /** Completion date at the precision known (e.g. 2026-08). */
            completed: partialDateSchema.optional(),
            /** Slug of the thesis in content/research/. */
            thesis: slugSchema.optional(),
          })
          .strict(),
      )
      .default([]),
    /** Professional certifications, exactly as held. */
    certifications: z
      .array(
        z
          .object({
            name: nonEmpty("name"),
            issuer: nonEmpty("issuer"),
            /** Short form used in compact lists, e.g. "SAA". */
            abbreviation: z.string().trim().optional(),
            /** Public verification page (e.g. Credly). */
            url: z.string().trim().optional(),
          })
          .strict(),
      )
      .default([]),
    /** Subjects studied and enjoyed: training and interests, not claimed expertise. */
    academicInterests: z.array(nonEmpty("academic interest")).default([]),
    interests: z.array(nonEmpty("interest")).default([]),
    learningStyle: z.string().trim().optional(),
    /** Short biography for event organisers (Speaking page press kit). */
    speakerBio: z.string().trim().optional(),
    philosophy: z
      .object({
        statement: nonEmpty("statement"),
        connections: z.array(nonEmpty("connection")).default([]),
      })
      .strict(),
    music: z.array(nonEmpty("music item")).default([]),
    skills: z
      .array(
        z
          .object({
            domain: nonEmpty("domain"),
            items: z.array(skillItemSchema).min(1, "A skill group needs at least one item"),
          })
          .strict(),
      )
      .default([]),
  })
  .strict();

// ── Roles ───────────────────────────────────────────────────────────────

export const roleSchema = z
  .object({
    ...baseShape,
    organisation: nonEmpty("organisation"),
    /** Context for the organisation, e.g. "drones department of Nord Motion". */
    orgNote: z.string().trim().optional(),
    /** Job title or function, exactly as approved. */
    role: nonEmpty("role"),
    category: z.enum(["engineering", "writing", "other"]).default("engineering"),
    /** Omitted = start date unknown (never guessed). */
    start: partialDateSchema.optional(),
    /** null = current role; omitted = end date unknown. */
    end: z.union([partialDateSchema, z.null()]).optional(),
    location: z.string().trim().optional(),
    mode: z.enum(["remote", "on-site", "hybrid"]).optional(),
    highlights: z.array(nonEmpty("highlight")).default([]),
    /** Smaller pieces of work, listed compactly (no detail pages). */
    otherWork: z.array(nonEmpty("item")).default([]),
  })
  .strict();

// ── Engineering case studies ────────────────────────────────────────────

export const caseStudySchema = z
  .object({
    ...baseShape,
    status: statusSchema,
    /** Slug of the role this work was done in. */
    role: slugSchema.optional(),
    context: z.string().trim().optional(),
    problem: z.string().trim().optional(),
    approach: z.string().trim().optional(),
    outcome: z.string().trim().optional(),
    stack: z.array(nonEmpty("stack item")).default([]),
    metrics: z.array(metricSchema).default([]),
    confidentialityNote: z.string().trim().optional(),
  })
  .strict();

// ── Research ────────────────────────────────────────────────────────────

const collaboratorSchema = z
  .object({
    name: nonEmpty("name"),
    /** Names render only when the person has agreed to be named. */
    consent: z.boolean({ error: "consent must be stated explicitly (true or false)" }),
  })
  .strict();

const publicationRefSchema = z
  .object({
    title: nonEmpty("title"),
    kind: z.enum(["poster", "paper", "thesis", "preprint", "slides", "other"]),
    venue: z.string().trim().optional(),
    date: partialDateSchema.optional(),
    url: z.string().trim().default(""),
    visibility: visibilitySchema,
  })
  .strict();

const updateSchema = z
  .object({
    date: isoDateSchema,
    title: nonEmpty("title"),
    summary: nonEmpty("summary"),
    visibility: visibilitySchema.default("public"),
  })
  .strict();

export const embedSchema = z
  .object({
    url: z.string().trim(),
    title: nonEmpty("title"),
    visibility: visibilitySchema,
    /** iframe sandbox tokens, space separated, e.g. "allow-scripts". */
    sandbox: z.string().trim().default(""),
  })
  .strict();

export const researchSchema = z
  .object({
    ...baseShape,
    status: statusSchema,
    /** Long title as used on the poster/paper. */
    fullTitle: z.string().trim().optional(),
    /** A short caveat shown prominently (e.g. "simulation-based, not field-validated"). */
    notice: z.string().trim().optional(),
    affiliation: z.string().trim().optional(),
    collaborators: z.array(collaboratorSchema).default([]),
    publications: z.array(publicationRefSchema).default([]),
    updates: z.array(updateSchema).default([]),
    embeds: z.array(embedSchema).default([]),
    links: z.array(linkSchema).default([]),
    stack: z.array(nonEmpty("stack item")).default([]),
  })
  .strict();

// ── Projects ────────────────────────────────────────────────────────────

export const projectSchema = z
  .object({
    ...baseShape,
    status: statusSchema,
    /** My part in it, e.g. "Backend engineer" or "Project lead". */
    role: z.string().trim().optional(),
    /** Slug of a related research entry with a full write-up. */
    research: slugSchema.optional(),
    repo: optionalUrlSchema.optional(),
    stack: z.array(nonEmpty("stack item")).default([]),
    links: z.array(linkSchema).default([]),
  })
  .strict();

// ── Ventures ────────────────────────────────────────────────────────────

const milestoneSchema = z
  .object({
    text: nonEmpty("text"),
    date: partialDateSchema.optional(),
    visibility: visibilitySchema,
  })
  .strict();

export const ventureSchema = z
  .object({
    ...baseShape,
    status: statusSchema,
    stage: nonEmpty("stage"),
    stack: z.array(nonEmpty("stack item")).default([]),
    milestones: z.array(milestoneSchema).default([]),
    links: z.array(linkSchema).default([]),
  })
  .strict();

// ── Talks ───────────────────────────────────────────────────────────────

export const talkSchema = z
  .object({
    ...baseShape,
    event: nonEmpty("event"),
    location: z.string().trim().optional(),
    date: partialDateSchema,
    format: z.enum(["talk", "poster"]),
    /** accepted → scheduled → delivered. "Delivered" only once confirmed. */
    stage: z.enum(["accepted", "scheduled", "delivered"]),
    abstract: nonEmpty("abstract"),
    /** e.g. "Backend engineering volunteer". */
    involvement: z.string().trim().optional(),
    /** Slug of a related research entry (e.g. the HAUV poster). */
    research: slugSchema.optional(),
    links: z
      .object({
        slides: optionalUrlSchema.optional(),
        video: optionalUrlSchema.optional(),
        repo: optionalUrlSchema.optional(),
        pdf: optionalUrlSchema.optional(),
      })
      .strict()
      .default({}),
  })
  .strict();

// ── Notes (Writing) ─────────────────────────────────────────────────────

export const noteSchema = z
  .object({
    ...baseShape,
    date: isoDateSchema,
    /** Required and explicit: a file existing never means it is published. */
    draft: z.boolean({ error: "draft must be stated explicitly (true or false)" }),
    toc: z.boolean().default(true),
  })
  .strict();

// ── Publications (writing elsewhere) ───────────────────────────────────

export const publicationSchema = z
  .object({
    ...baseShape,
    outlet: nonEmpty("outlet"),
    /** Human-readable period, e.g. "until 2023". */
    period: nonEmpty("period"),
    url: optionalUrlSchema,
  })
  .strict();

// ── Community, teaching and music ──────────────────────────────────────

export const communitySchema = z
  .object({
    ...baseShape,
    organisation: z.string().trim().optional(),
    role: nonEmpty("role"),
    period: z.string().trim().optional(),
    category: z.enum(["music", "teaching", "mentorship", "community"]),
  })
  .strict();

export type SiteData = z.infer<typeof siteSchema>;
export type AboutData = z.infer<typeof aboutSchema>;
export type RoleData = z.infer<typeof roleSchema>;
export type CaseStudyData = z.infer<typeof caseStudySchema>;
export type ResearchData = z.infer<typeof researchSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type VentureData = z.infer<typeof ventureSchema>;
export type TalkData = z.infer<typeof talkSchema>;
export type NoteData = z.infer<typeof noteSchema>;
export type PublicationData = z.infer<typeof publicationSchema>;
export type CommunityData = z.infer<typeof communitySchema>;
