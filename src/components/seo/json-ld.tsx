import type { PublicAbout, PublicLink, PublicSite } from "@/content/types";
import { absoluteUrl } from "@/lib/site-url";

/*
 * Structured data (IMPLEMENTATION_SPEC.md §9.5). Built only from published,
 * public data. `sameAs` lists confirmed public profiles only, so it is
 * omitted entirely until profiles are confirmed.
 */

type Json = Record<string, unknown>;

export function JsonLd({ data }: { data: Json }) {
  // "<" is escaped so the payload can never close the script element.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export const PERSON_ID = "/#person";

export function personSchema(site: PublicSite, about: PublicAbout, profiles: PublicLink[] = site.profiles): Json {
  const [locality, ...rest] = site.location.split(",").map((s) => s.trim());
  const country = rest.join(", ");
  const institutions = [...new Set(about.education.map((e) => e.institution))];
  return {
    "@type": "Person",
    "@id": absoluteUrl(PERSON_ID),
    name: site.name,
    alternateName: site.fullName,
    jobTitle: site.title.replace(/\s*&\s*/g, " and "),
    description: site.positioning,
    url: absoluteUrl("/"),
    address: { "@type": "PostalAddress", addressLocality: locality, ...(country ? { addressCountry: country } : {}) },
    ...(institutions.length ? { alumniOf: institutions.map((name) => ({ "@type": "CollegeOrUniversity", name })) } : {}),
    ...(profiles.length ? { sameAs: profiles.map((p) => p.url) } : {}),
  };
}

export function websiteSchema(site: PublicSite): Json {
  return {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: absoluteUrl("/"),
    name: site.name,
    alternateName: site.fullName,
    description: site.positioning,
    inLanguage: "en-GB",
    publisher: { "@id": absoluteUrl(PERSON_ID) },
  };
}

export function graph(...nodes: Json[]): Json {
  return { "@context": "https://schema.org", "@graph": nodes };
}
