/*
 * Banned content (IMPLEMENTATION_SPEC.md §5.1 items 3 and 8, §5.2, §5.3).
 *
 * THIS FILE NECESSARILY CONTAINS THE BANNED TERMS. Every scanner excludes
 * it (and the test that exercises it) by path. Nothing here may be imported
 * by page or component code.
 */

export type BannedTerm = { id: string; pattern: RegExp; reason: string };

/**
 * Items marked REMOVED in PLAN.md (§2 decisions Q4, Q9, Q12, Q13, Q2; §3).
 * Patterns are deliberately specific: "Octave" alone is a legitimate skill
 * (the language), so only the removed internship is matched.
 */
export const REMOVED_TERMS: readonly BannedTerm[] = [
  { id: "celcic", pattern: /\bcelcic\b/i, reason: "Celcic Media role was removed (PLAN.md Q13)" },
  { id: "octave-internship", pattern: /\boctave\b[^.\n]{0,40}\bintern(ship)?\b/i, reason: "Octave internship was removed (PLAN.md Q13)" },
  { id: "apiconf", pattern: /\bapi\s?conf\b/i, reason: "APIConf talk was removed (PLAN.md Q12)" },
  { id: "covering-grounds", pattern: /\bcovering grounds\b/i, reason: "APIConf talk was removed (PLAN.md Q12)" },
  { id: "song", pattern: /\brevealers of god'?s glory\b/i, reason: "The choir song was removed (PLAN.md Q12)" },
  { id: "bees", pattern: /\bbees?\s+foraging\b/i, reason: "Bees Foraging Algorithm was removed (PLAN.md Q12)" },
  { id: "cec2013", pattern: /\bCEC\s?2013\b/i, reason: "Bees Foraging Algorithm (CEC2013) was removed (PLAN.md Q12)" },
  { id: "amr", pattern: /\bantimicrobial\b/i, reason: "AMR modelling was removed (PLAN.md Q13)" },
  { id: "amr-acronym", pattern: /\bAMR\b/, reason: "AMR modelling was removed (PLAN.md Q13)" },
  { id: "ebpf", pattern: /\beBPF\b/i, reason: "eBPF anomaly detection was removed (PLAN.md Q13)" },
  { id: "vi", pattern: /\bvinculum\s+implexa\b/i, reason: "Vinculum Implexa is not public yet (PLAN.md Q4)" },
  { id: "virl", pattern: /\bVIRL\b/, reason: "VIRL is not public yet (PLAN.md Q4)" },
  { id: "vi-industries", pattern: /\bVI\s+Industries\b/i, reason: "VI Industries is not public yet (PLAN.md Q4)" },
  { id: "kawe", pattern: /\bkawe\b/i, reason: "Kawe is not public yet (PLAN.md Q9)" },
  { id: "enquoir", pattern: /\benquoir\b/i, reason: "Enquoir is not public yet (PLAN.md Q9)" },
  { id: "agentic-finance", pattern: /\bagentic financial infrastructure\b/i, reason: "Removed with Enquoir (PLAN.md §3.5)" },
  { id: "cgpa", pattern: /\b(c?gpa|class of degree)\b/i, reason: "Grades are never published (PLAN.md §9.6)" },
  { id: "matric", pattern: /\bmatric(ulation)?\s*(no\.?|number)\b/i, reason: "Student identifiers are never published (PLAN.md §9.6)" },
  { id: "name-tim", pattern: /\bTim\b/, reason: 'The site uses "Timmy Omolana" (alternate: "Timilehin Omolana"), never "Tim" (PLAN.md Q26)' },
  { id: "makeuseof-current", pattern: /\b(i|currently)\s+write\s+for\s+makeuseof\b/i, reason: "MakeUseOf is a past role (until 2023)" },
];

export type TextMatch = { id: string; reason: string; text: string; index: number; line: number };

export function lineAt(text: string, index: number): number {
  let line = 1;
  for (let i = 0; i < index && i < text.length; i++) if (text.charCodeAt(i) === 10) line++;
  return line;
}

function scan(text: string, terms: readonly BannedTerm[]): TextMatch[] {
  const matches: TextMatch[] = [];
  for (const term of terms) {
    const re = new RegExp(term.pattern.source, term.pattern.flags.includes("g") ? term.pattern.flags : term.pattern.flags + "g");
    for (const m of text.matchAll(re)) {
      const index = m.index ?? 0;
      matches.push({ id: term.id, reason: term.reason, text: m[0], index, line: lineAt(text, index) });
    }
  }
  return matches.sort((a, b) => a.index - b.index);
}

export function findRemovedTerms(text: string): TextMatch[] {
  return scan(text, REMOVED_TERMS);
}

// ── FairMoney rules ─────────────────────────────────────────────────────

const MICROSERVICE: BannedTerm = {
  id: "fairmoney-microservice",
  pattern: /micro-?services?/i,
  reason: 'Never describe FairMoney\'s architecture as "microservices" (PLAN.md §9.4)',
};

export function mentionsFairMoney(text: string): boolean {
  return /\bfair\s?money\b/i.test(text);
}

export function findMicroservice(text: string): TextMatch[] {
  return scan(text, [MICROSERVICE]);
}

const PERCENT = /(?:\d+(?:[.,]\d+)?\s*(?:[-–—]|to)\s*)?\d+(?:[.,]\d+)?\s*(?:%|per\s?cent\b)/i;
const COST_WORDS =
  /\b(cost|costs|costing|spend|spending|spent|bill|bills|billing|expenditure|expense|expenses|saving|savings|saved|cheaper|budget|infrastructure\s+(?:cost|spend|bill)|storage\s+(?:cost|spend|bill))\b/i;

/**
 * Percentages presented as cost-reduction claims. A percentage counts only
 * if it shares a sentence with a cost word, so unrelated percentages (for
 * example an expected reduction in First Payment Default) are not flagged.
 */
export function findCostPercentageClaims(text: string): TextMatch[] {
  const matches: TextMatch[] = [];
  const sentence = /[^.!?\n]+[.!?]?/g;
  for (const m of text.matchAll(sentence)) {
    const s = m[0];
    if (PERCENT.test(s) && COST_WORDS.test(s)) {
      const index = m.index ?? 0;
      matches.push({
        id: "fairmoney-cost-percentage",
        reason: "Never state a percentage cost reduction for FairMoney (PLAN.md §3.2)",
        text: s.trim(),
        index,
        line: lineAt(text, index),
      });
    }
  }
  return matches;
}

/** Path fragments every scanner must skip: this definition file and its tests. */
export const BANNED_DEFINITION_PATHS = ["src/content/banned.ts", "tests/content/banned.test.ts"];
