import type { Metric } from "./schemas/metric";

/*
 * Metric publication policy (IMPLEMENTATION_SPEC.md §4.3):
 *   - only `cleared: true` metrics are ever published;
 *   - a public parent does not make a metric public;
 *   - every published expected metric carries the "Expected impact" label.
 */

export const EXPECTED_IMPACT_LABEL = "Expected impact";
export const MEASURED_LABEL = "Measured";

export type PublicMetric = {
  label: string;
  value: string;
  kind: Metric["kind"];
  /** Always present; "Expected impact" for expected metrics. */
  qualifier: typeof EXPECTED_IMPACT_LABEL | typeof MEASURED_LABEL;
  note?: string;
};

export function toPublicMetric(metric: Metric): PublicMetric {
  return {
    label: metric.label,
    value: metric.value,
    kind: metric.kind,
    qualifier: metric.kind === "expected" ? EXPECTED_IMPACT_LABEL : MEASURED_LABEL,
    ...(metric.note ? { note: metric.note } : {}),
  };
}

/** Cleared metrics only, each with its qualifier. Uncleared metrics are dropped entirely. */
export function publicMetrics(metrics: readonly Metric[]): PublicMetric[] {
  return metrics.filter((m) => m.cleared === true).map(toPublicMetric);
}
