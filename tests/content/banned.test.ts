/*
 * THIS TEST NECESSARILY CONTAINS BANNED TERMS. It is excluded from every
 * scanner by path (see BANNED_DEFINITION_PATHS).
 */
import { describe, expect, it } from "vitest";
import { findCostPercentageClaims, findRemovedTerms, mentionsFairMoney } from "@/content/banned";
import { loadAllContent } from "@/content/loader";
import { validateContent } from "@/content/validation";
import { base, fm, makeTree } from "../support/content-tree";

describe("removed items", () => {
  it.each([
    "Celcic Media",
    "an Octave internship",
    "APIConf Lagos",
    "Covering Grounds",
    "Revealers of God's Glory",
    "Bees Foraging Algorithm",
    "CEC2013 benchmarks",
    "antimicrobial resistance",
    "AMR modelling",
    "eBPF anomaly detection",
    "Vinculum Implexa",
    "VIRL",
    "VI Industries",
    "Kawe Hub",
    "Enquoir",
    "agentic financial infrastructure",
    "CGPA",
    "matric number",
    "I write for MakeUseOf",
    "Tim Omolana",
    "a graphic design class",
  ])("flags %s", (text) => {
    expect(findRemovedTerms(text).length).toBeGreaterThan(0);
  });

  it.each([
    "Languages: Go, C++20, Python, Octave.",
    "Previously wrote for MakeUseOf (until 2023).",
    "The vinculum is the bar over an expression.",
    "Agentic systems and LLM integration.",
    "Formulas in GNU Octave for numerical work.",
    "Timmy Omolana (Timilehin Omolana).",
    "Timing and time-frequency analysis.",
  ])("does not flag legitimate text: %s", (text) => {
    expect(findRemovedTerms(text)).toEqual([]);
  });

  it("reports the line", () => {
    expect(findRemovedTerms("line one\nline two\nEnquoir")[0].line).toBe(3);
  });

  it("fails validation for removed terms even in hidden entries", () => {
    const root = makeTree({
      "projects/x.md": fm({ ...base("x", { visibility: "hidden" }), status: "exploration", summary: "Kawe marketplace." }),
    });
    expect(validateContent(loadAllContent(root)).map((i) => i.rule)).toContain("removed:kawe");
  });
});

describe("FairMoney rules", () => {
  it("detects FairMoney content", () => {
    expect(mentionsFairMoney("Software engineer at FairMoney")).toBe(true);
    expect(mentionsFairMoney("Fair Money")).toBe(true);
    expect(mentionsFairMoney("fair pricing")).toBe(false);
  });

  it.each([
    "Cut infrastructure costs by 30%.",
    "Reduced the storage bill by 25 percent.",
    "Saved 40% on database spend.",
    "Lowered costs 10–15%.",
  ])("flags cost-percentage claim: %s", (t) => {
    expect(findCostPercentageClaims(t).length).toBe(1);
  });

  it.each([
    "Targeted a 15–20% reduction in First Payment Default (expected).",
    "Freed approximately 800 GB of storage, reducing infrastructure costs.",
    "Response time fell from over 12 s to under 100 ms.",
  ])("does not flag: %s", (t) => {
    expect(findCostPercentageClaims(t)).toEqual([]);
  });

  it("applies to FairMoney roles and case studies that reference them", () => {
    const root = makeTree({
      "roles/fm.md": fm({ ...base("fm"), organisation: "FairMoney", role: "Software Engineer" }),
      "case-studies/cleanup.md": fm({ ...base("cleanup"), status: "completed", role: "fm" }, "We cut storage costs by 35% across the service fleet."),
    });
    const ruleIds = validateContent(loadAllContent(root)).map((i) => i.rule);
    expect(ruleIds).toEqual(expect.arrayContaining(["fairmoney-cost-percentage"]));
  });

  it("does not apply FairMoney rules to unrelated content", () => {
    const root = makeTree({ "projects/p.md": fm({ ...base("p"), status: "active" }, "Cut hosting costs by 40% in a side project.") });
    expect(validateContent(loadAllContent(root))).toEqual([]);
  });
});
