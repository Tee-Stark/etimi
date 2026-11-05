/*
 * Type-only exports for components. Importing types never pulls the loader
 * (or any filesystem code) into a bundle.
 */
export type { CollectionName } from "./collections";
export type { PublicMetric } from "./metrics";
export type { PublicLink } from "./links";
export type { ThreadId, Status } from "./schemas/common";
export type { PublicAbout, PublicData, PublicEntry, PublicSite, PublicSkill } from "./visibility";
import type { SiteData } from "./schemas/entities";
export type Thread = SiteData["threads"][number];
