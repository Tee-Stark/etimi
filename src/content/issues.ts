/*
 * Content problems are collected, never thrown one at a time, so a single
 * validation run reports everything that needs fixing.
 */

export type ContentIssue = {
  /** Project-relative path, e.g. content/roles/fairmoney.md */
  file: string;
  /** Dotted field path within the frontmatter, if applicable. */
  field?: string;
  /** 1-based line in the file, if known. */
  line?: number;
  /** Stable rule identifier, useful in tests and for grepping. */
  rule: string;
  message: string;
};

export function formatIssue(issue: ContentIssue): string {
  const where = [issue.file, issue.line ? `:${issue.line}` : ""].join("");
  const field = issue.field ? ` › ${issue.field}` : "";
  return `${where}${field}\n    [${issue.rule}] ${issue.message}`;
}

export function formatIssues(issues: ContentIssue[]): string {
  return issues.map(formatIssue).join("\n");
}

export class ContentValidationError extends Error {
  constructor(readonly issues: ContentIssue[]) {
    super(`Content validation failed with ${issues.length} problem(s):\n\n${formatIssues(issues)}\n`);
    this.name = "ContentValidationError";
  }
}
