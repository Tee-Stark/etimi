---
# Source: PLAN.md §3.2 item 1 (flagship). Metric uncleared until Timmy approves (Q14, O5).
title: Loan details API performance
slug: loan-details-api
summary: I traced a slow loan details endpoint to an N+1 query problem and fixed it, so the endpoint responds far faster.
visibility: public
status: completed
threads: [engineering]
featured: true
order: 1
updated: 2026-11-05
role: fairmoney
context: An API endpoint that returns loan details.
problem: >-
  The endpoint was slow because of an N+1 query problem: it made one database
  query to fetch a set of records, then one more query for each record in it.
approach: >-
  I identified the N+1 pattern and changed how the endpoint loads its data, so
  it no longer issues a separate query per record.
outcome: The endpoint's response time dropped substantially.
metrics:
  - label: Loan details endpoint response time
    value: ">12 s → <100 ms"
    kind: measured
    cleared: false
confidentialityNote: Described at a high level. No internal code, architecture or customer data is shown.
---
