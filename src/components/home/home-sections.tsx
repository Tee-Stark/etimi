import Link from "next/link";
import type { ReactNode } from "react";
import { channelsFor, ContactList } from "@/components/content/contact-list";
import { StatusLabel, type StatusKey } from "@/components/content/status-label";
import { PageSection } from "@/components/layout/page-section";
import type { PublicEntry, PublicLink } from "@/content/types";
import { formatDateRange, formatPartialDate } from "@/lib/dates";

/*
 * Home page sections after the hero (IMPLEMENTATION_SPEC.md §8.1). Each takes
 * already-selected public entries; selection lives in the page.
 */

function More({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="label text-muted-foreground hover:text-accent">
      {children} →
    </Link>
  );
}

// ── §1 Current research ─────────────────────────────────────────────────

export function CurrentResearch({ research, poster }: { research: PublicEntry<"research">; poster?: PublicEntry<"talks"> }) {
  const d = research.data;
  const posterLabel = poster ? (poster.data.stage === "delivered" ? "Poster presented" : poster.data.stage === "accepted" ? "Poster accepted" : "Poster scheduled") : null;

  return (
    <PageSection id="current-research" index="§1" eyebrow="Current research" title="What I'm researching" aside={<More href="/research">All research</More>}>
      <div className="grid gap-x-6 gap-y-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="display text-h1">
            <Link href={research.href!} className="hover:text-accent">
              {d.title}
            </Link>
          </p>
          {d.fullTitle ? <p className="mt-4 text-muted-foreground">{d.fullTitle}</p> : null}
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <StatusLabel status={d.status} />
            {posterLabel && poster ? (
              <span className="label text-muted-foreground">
                {posterLabel} · {poster.data.event}
              </span>
            ) : null}
          </div>
          <p className="mt-5 max-w-measure text-lede">{d.summary}</p>
          {d.notice ? <p className="mt-4 max-w-measure text-small text-muted-foreground">{d.notice}</p> : null}
          <p className="mt-6">
            <Link href={research.href!} className="link">
              Read the research
            </Link>
          </p>
        </div>
      </div>
    </PageSection>
  );
}

// ── §2 Selected work ────────────────────────────────────────────────────

export type SelectedItem = {
  kind: string;
  title: string;
  summary: string;
  href: string;
  status: StatusKey;
};

export function SelectedWork({ items }: { items: SelectedItem[] }) {
  return (
    <PageSection id="selected-work" index="§2" eyebrow="Selected work" title="Things I've built" aside={<More href="/projects">All projects</More>}>
      <ol className="grid border-t border-l border-border md:grid-cols-2">
        {items.map((item, i) => (
          <li key={item.href} className="group relative flex flex-col border-r border-b border-border p-6 transition-colors duration-150 hover:bg-surface sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <span className="label text-muted-foreground">
                <span aria-hidden="true" className="mr-3 text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {item.kind}
              </span>
              <StatusLabel status={item.status} />
            </div>
            <h3 className="mt-8 text-h3 font-medium tracking-tight">
              <Link href={item.href} className="decoration-accent underline-offset-[0.22em] after:absolute after:inset-0 group-hover:underline">
                {item.title}
              </Link>
            </h3>
            <p className="mt-3 max-w-measure text-muted-foreground">{item.summary}</p>
          </li>
        ))}
      </ol>
    </PageSection>
  );
}

// ── §3 Experience at a glance ──────────────────────────────────────────

export function ExperienceGlance({ roles }: { roles: PublicEntry<"roles">[] }) {
  return (
    <PageSection id="experience" index="§3" eyebrow="Experience" title="Where I've worked" aside={<More href="/work#experience">Full timeline</More>}>
      <ol className="grid gap-x-6 gap-y-8 border-t border-border pt-6 md:grid-cols-3">
        {roles.map((role, i) => (
          <li key={role.slug} className="relative">
            <p className="annot text-muted-foreground">{formatDateRange(role.data.start, role.data.end) ?? "\u00a0"}</p>
            <p className="mt-3 text-h3 font-medium tracking-tight">{role.data.organisation}</p>
            <p className="mt-1 text-small text-muted-foreground">
              {role.data.role}
              {role.data.orgNote ? ` · ${role.data.orgNote}` : ""}
            </p>
            {i < roles.length - 1 ? (
              <span aria-hidden="true" className="absolute top-0 right-0 hidden font-mono text-faint md:block">
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </PageSection>
  );
}

// ── §4 Short introduction ──────────────────────────────────────────────

export function Introduction({ excerpt }: { excerpt: string }) {
  return (
    <PageSection id="introduction" index="§4" eyebrow="Introduction" title="In brief">
      <div className="grid gap-x-6 lg:grid-cols-12">
        <p className="max-w-measure text-lede lg:col-span-7">{excerpt}</p>
        <p className="mt-6 lg:col-span-4 lg:col-start-9 lg:mt-0">
          <Link href="/about" className="link">
            More about me
          </Link>
        </p>
      </div>
    </PageSection>
  );
}

// ── §5 Speaking highlight ──────────────────────────────────────────────

export function SpeakingHighlight({ talk }: { talk: PublicEntry<"talks"> }) {
  const d = talk.data;
  return (
    <PageSection id="speaking" index="§5" eyebrow="Speaking" title="Recent talk" aside={<More href="/speaking">All talks</More>}>
      <div className="grid gap-x-6 gap-y-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="display text-h2">
            <Link href={`/speaking#${talk.slug}`} className="hover:text-accent">
              {d.title}
            </Link>
          </p>
          <p className="label mt-4 text-muted-foreground">
            {d.event}
            {d.location ? ` · ${d.location}` : ""} · {formatPartialDate(d.date)}
          </p>
        </div>
        <p className="max-w-measure text-muted-foreground lg:col-span-6 lg:col-start-7">{d.abstract}</p>
      </div>
    </PageSection>
  );
}

// ── Contact (only confirmed channels) ───────────────────────────────────

export function ProfileLinks({ email, profiles }: { email: string | null; profiles: PublicLink[] }) {
  const channels = channelsFor(email, profiles);
  if (channels.length === 0) return null;
  return (
    <PageSection id="elsewhere" index="§6" eyebrow="Contact" title="Get in touch" aside={<More href="/contact">Contact</More>}>
      <ContactList channels={channels} className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0" />
    </PageSection>
  );
}
