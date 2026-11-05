import type { LoadedContent, Entry } from "./loader";
import { collectHiddenUrls } from "./validation";
import { isPublished } from "./visibility";

/*
 * Strings that must never appear in built output: the distinctive text of
 * everything withheld. Used by the post-build scan (IMPLEMENTATION_SPEC.md
 * §16.4) as a second line of defence behind the projection layer.
 */

export type Withheld = { value: string; source: string; reason: string };

const MIN_LENGTH = 4;

function keep(value: string | undefined): value is string {
  if (!value) return false;
  const v = value.trim();
  return v.length >= MIN_LENGTH && !/^\d+$/.test(v);
}

type Obj = Record<string, unknown>;

export function collectWithheld(content: LoadedContent): Withheld[] {
  const out: Withheld[] = [];
  const add = (value: string | undefined, source: string, reason: string) => {
    if (keep(value)) out.push({ value: value.trim(), source, reason });
  };

  for (const url of collectHiddenUrls(content)) add(url, "content", "hidden URL / contact detail");

  for (const entry of (Object.values(content.entries) as Entry[][]).flat()) {
    const d = entry.data as unknown as Obj;
    const src = entry.sourcePath;
    if (!isPublished(entry)) {
      add(d.title as string, src, "title of a hidden or draft entry");
      add(d.summary as string, src, "summary of a hidden or draft entry");
    }
    for (const m of (d.metrics as Array<{ value: string; cleared: boolean }> | undefined) ?? []) {
      if (!m.cleared) add(m.value, src, "uncleared metric value");
    }
    for (const c of (d.collaborators as Array<{ name: string; consent: boolean }> | undefined) ?? []) {
      if (!c.consent) add(c.name, src, "collaborator without consent");
    }
    for (const m of (d.milestones as Array<{ text: string; visibility: string }> | undefined) ?? []) {
      if (m.visibility === "hidden") add(m.text, src, "hidden milestone");
    }
    for (const u of (d.updates as Array<{ title: string; summary: string; visibility: string }> | undefined) ?? []) {
      if (u.visibility === "hidden") {
        add(u.title, src, "hidden research update");
        add(u.summary, src, "hidden research update");
      }
    }
    for (const p of (d.publications as Array<{ title: string; visibility: string }> | undefined) ?? []) {
      if (p.visibility === "hidden") add(p.title, src, "hidden publication");
    }
  }

  // De-duplicate by value.
  const seen = new Set<string>();
  return out.filter((w) => (seen.has(w.value) ? false : (seen.add(w.value), true)));
}
