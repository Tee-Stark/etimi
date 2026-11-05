import { cn } from "@/lib/utils";
import { MARK, WORDMARK } from "./mark-data";

/*
 * The mark is defined once per page as an SVG <symbol> (in the root layout)
 * and referenced with <use>, so it can appear in several places without
 * repeating its path data. It takes the current text colour.
 */

export const MARK_ID = "etimi-mark";
export const WORDMARK_ID = "etimi-wordmark";

/** Hidden sprite with the mark and wordmark symbols. Render once, in the root layout. */
export function BrandSprite() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
      <symbol id={MARK_ID} viewBox={MARK.viewBox}>
        <path d={MARK.d} />
      </symbol>
      <symbol id={WORDMARK_ID} viewBox={WORDMARK.viewBox}>
        <path d={WORDMARK.d} />
      </symbol>
    </svg>
  );
}

type MarkProps = {
  className?: string;
  /** Accessible name; omit when the mark sits next to visible text (decorative). */
  title?: string;
};

/** The eTimi mark. Size it by height; width follows the 2:1 aspect ratio. */
export function Mark({ className, title }: MarkProps) {
  return (
    <svg
      viewBox={MARK.viewBox}
      className={cn("inline-block h-4 w-auto fill-current", className)}
      style={{ aspectRatio: `${MARK.width} / ${MARK.height}` }}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true, focusable: false })}
    >
      <use href={`#${MARK_ID}`} />
    </svg>
  );
}

/** The "eTimi" wordmark. */
export function Wordmark({ className, title }: MarkProps) {
  return (
    <svg
      viewBox={WORDMARK.viewBox}
      className={cn("inline-block h-4 w-auto fill-current", className)}
      style={{ aspectRatio: `${WORDMARK.width} / ${WORDMARK.height}` }}
      {...(title ? { role: "img", "aria-label": title } : { "aria-hidden": true, focusable: false })}
    >
      <use href={`#${WORDMARK_ID}`} />
    </svg>
  );
}
