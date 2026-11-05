import { cn } from "@/lib/utils";

type PortraitPlaceholderProps = {
  /** Initials to set, e.g. "TO". */
  initials: string;
  className?: string;
};

/**
 * Neutral typographic stand-in until a real photograph is supplied.
 * Deliberately not an image of a person: no stock or generated imagery.
 * Decorative, so hidden from assistive tech.
 */
export function PortraitPlaceholder({ initials, className }: PortraitPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden border border-border bg-surface",
        className,
      )}
    >
      {/* Fine engineering grid */}
      <svg className="absolute inset-0 h-full w-full text-border" aria-hidden="true">
        <defs>
          <pattern id="portrait-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#portrait-grid)" />
      </svg>
      <span className="relative font-serif text-[clamp(4rem,12vw,7rem)] leading-none tracking-tight">
        <span className="block border-t-[3px] border-accent pt-2">{initials}</span>
      </span>
      <span className="meta absolute bottom-3 left-3 text-muted-foreground">Fig. 0</span>
    </div>
  );
}
