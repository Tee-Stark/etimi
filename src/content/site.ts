import "server-only";

import { readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/*
 * Provisional loader for the site identity singleton (Phase 1).
 * Phase 2 generalises this into the typed collection engine with full
 * visibility policy; the public shape returned here stays the same.
 */

const visibility = z.enum(["public", "hidden"]);

const siteSchema = z
  .object({
    name: z.string().min(1),
    fullName: z.string().min(1),
    title: z.string().min(1),
    location: z.string().min(1),
    positioning: z.string().min(1),
    heroIntro: z.string().min(1),
    threads: z
      .array(
        z
          .object({
            id: z.enum(["engineering", "research", "creation"]),
            label: z.string().min(1),
            description: z.string().min(1),
          })
          .strict(),
      )
      .length(3),
    email: z.object({ address: z.string(), visibility }).strict(),
    cv: z.object({ path: z.string(), visibility }).strict(),
    profiles: z.array(z.object({ label: z.string().min(1), url: z.string(), visibility }).strict()),
  })
  .strict();

type SiteSource = z.infer<typeof siteSchema>;

export type PublicProfile = { label: string; url: string };

export type Site = Omit<SiteSource, "email" | "cv" | "profiles"> & {
  /** Only confirmed, public values survive. Hidden values never leave this module. */
  email: string | null;
  cv: string | null;
  profiles: PublicProfile[];
};

const SOURCE = path.join(process.cwd(), "content", "site", "profile.md");

let memo: Site | null = null;

export function getSite(): Site {
  if (memo) return memo;

  const { data } = matter(readFileSync(SOURCE, "utf8"));
  const parsed = siteSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Invalid site profile (${SOURCE}):\n${z.prettifyError(parsed.error)}`);
  }

  const { email, cv, profiles, ...rest } = parsed.data;
  memo = {
    ...rest,
    email: email.visibility === "public" && email.address ? email.address : null,
    cv: cv.visibility === "public" && cv.path ? cv.path : null,
    profiles: profiles
      .filter((p) => p.visibility === "public" && p.url)
      .map(({ label, url }) => ({ label, url })),
  };
  return memo;
}
