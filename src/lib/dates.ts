/*
 * Date display. Dates are rendered at exactly the precision they were
 * recorded with (YYYY, YYYY-MM or YYYY-MM-DD) and never guessed:
 *
 *   start known, end null       "Nov 2024 – present"
 *   start known, end known      "Sep – Oct 2024", "Nov 2022 – Mar 2023"
 *   start unknown, end known    "until 2023"
 *   start known, end unknown    "from Nov 2022"
 *   both unknown                null (render nothing)
 *
 * Formatting is fixed to en-GB and UTC so server output is identical
 * everywhere (no locale or time-zone hydration differences).
 */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

type Parts = { year: number; month?: number; day?: number };

export function parsePartialDate(value: string): Parts {
  const [y, m, d] = value.split("-").map(Number);
  return { year: y, ...(m ? { month: m } : {}), ...(d ? { day: d } : {}) };
}

export function formatPartialDate(value: string, { long = false }: { long?: boolean } = {}): string {
  const { year, month, day } = parsePartialDate(value);
  if (!month) return String(year);
  const name = (long ? MONTHS_LONG : MONTHS)[month - 1];
  return day ? `${day} ${name} ${year}` : `${name} ${year}`;
}

/** Month name without the year, for compact ranges within one year. */
function monthOnly(value: string): string | null {
  const { month, day } = parsePartialDate(value);
  if (!month || day) return null;
  return MONTHS[month - 1];
}

export function formatDateRange(start: string | undefined, end: string | null | undefined): string | null {
  if (!start && end === undefined) return null;
  if (!start && end === null) return "present";
  if (!start && end) return `until ${formatPartialDate(end)}`;
  if (start && end === undefined) return `from ${formatPartialDate(start)}`;
  if (start && end === null) return `${formatPartialDate(start)} – present`;

  const s = parsePartialDate(start!);
  const e = parsePartialDate(end!);
  const sameYear = s.year === e.year;
  const startMonth = monthOnly(start!);
  if (sameYear && startMonth && monthOnly(end!)) {
    return startMonth === monthOnly(end!) ? formatPartialDate(end!) : `${startMonth} – ${formatPartialDate(end!)}`;
  }
  return `${formatPartialDate(start!)} – ${formatPartialDate(end!)}`;
}

/** Machine-readable value for <time dateTime>. */
export function toDateTimeAttr(value: string): string {
  return value;
}
