---
# Sources: PLAN.md §3.2; resume (5 Nov 2026). The approvals figure is an
# estimate, so it is labelled as expected impact.
title: Bank statement processing
slug: bank-statement-processing
summary: I architected and built bank statement upload and analysis in Go on AWS, orchestrated with Temporal workflows, to make loan-offer decisions more accurate.
visibility: public
status: completed
threads: [engineering]
featured: true
order: 4
updated: 2026-11-05
role: fairmoney
approach: >-
  I architected and implemented the upload and analysis feature with Go, AWS
  (S3, SNS and SQS) and Temporal workflows, including the workflow
  orchestration and the backend infrastructure that supports it.
outcome: The data-driven pipeline improved the accuracy of loan-offer decisions.
stack: [Go, AWS S3, AWS SNS/SQS, Temporal]
metrics:
  - label: Increase in approved loan offers
    value: "~30%"
    kind: expected
    cleared: true
    note: An estimate, not a direct measurement.
confidentialityNote: Described at a high level. No internal code, architecture or customer data is shown.
---
