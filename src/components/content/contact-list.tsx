import { contactIconFor, FramedContactIcon } from "@/components/brand/contact-icons";
import type { PublicLink } from "@/content/types";
import { cn } from "@/lib/utils";

/*
 * Confirmed contact channels with their glyphs. Only public, confirmed
 * values ever reach this component (the content layer drops the rest).
 */

/** "https://www.linkedin.com/in/x/" → "linkedin.com/in/x" */
export function displayHandle(url: string): string {
  if (url.startsWith("mailto:")) return url.slice("mailto:".length);
  return url.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
}

type Channel = { label: string; url: string };

export function channelsFor(email: string | null, profiles: PublicLink[]): Channel[] {
  return [...(email ? [{ label: "Email", url: `mailto:${email}` }] : []), ...profiles.map((p) => ({ label: p.label, url: p.url }))];
}

type ContactListProps = {
  channels: Channel[];
  /** `rows`: label and handle beside each icon. `compact`: label only. */
  variant?: "rows" | "compact";
  className?: string;
};

export function ContactList({ channels, variant = "rows", className }: ContactListProps) {
  if (channels.length === 0) return null;
  return (
    <ul className={cn(variant === "rows" ? "divide-y divide-border border-y border-border" : "space-y-2", className)}>
      {channels.map((c) => {
        const external = !c.url.startsWith("mailto:");
        return (
          <li key={c.url}>
            <a
              href={c.url}
              {...(external ? { rel: "me noopener noreferrer" } : {})}
              className={cn("group flex items-center gap-4 outline-none", variant === "rows" ? "py-4" : "min-h-9")}
            >
              <FramedContactIcon kind={contactIconFor(c.url)} className={variant === "compact" ? "size-8" : undefined} />
              <span className="min-w-0">
                <span className={cn("block transition-colors group-hover:text-accent", variant === "rows" ? "font-medium" : "text-small")}>
                  {c.label}
                </span>
                {variant === "rows" ? (
                  <span className="annot block truncate text-muted-foreground">{displayHandle(c.url)}</span>
                ) : null}
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
