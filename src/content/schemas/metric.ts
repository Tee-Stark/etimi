import { z } from "zod";
import { nonEmpty } from "./common";

/*
 * A quantitative claim (IMPLEMENTATION_SPEC.md §4.3 "Metric").
 *
 *   kind: measured   observed after the fact
 *   kind: expected   a target or projection; always labelled "Expected impact"
 *   cleared          the owner has approved publishing this number. No
 *                    default: every metric must state it explicitly, and a
 *                    public parent never makes an uncleared metric public.
 */
export const metricSchema = z
  .object({
    label: nonEmpty("label"),
    value: nonEmpty("value"),
    kind: z.enum(["measured", "expected"]),
    cleared: z.boolean({ error: "cleared must be stated explicitly (true or false)" }),
    note: z.string().default(""),
  })
  .strict();

export type Metric = z.infer<typeof metricSchema>;
