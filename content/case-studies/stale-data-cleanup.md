---
# Sources: PLAN.md §3.2; resume (5 Nov 2026). Figures cleared (Q31). The cost
# percentage stays off the site (PLAN.md §3.2 rule, still in force).
title: Stale data cleanup
slug: stale-data-cleanup
summary: I led a cost-optimisation initiative that cleaned stale data out of a very large database table, freeing storage and cutting monthly database costs.
visibility: public
status: completed
threads: [engineering]
featured: true
order: 3
updated: 2026-11-05
role: fairmoney
problem: A MySQL table had accumulated a large volume of stale records that were taking up storage.
approach: I led a cost-optimisation initiative to clean up the stale data.
outcome: Storage was freed and monthly Amazon RDS costs came down.
stack: [MySQL, Amazon RDS]
metrics:
  - label: Storage freed
    value: ~800 GB
    kind: measured
    cleared: true
  - label: Records in the table
    value: ~200 million
    kind: measured
    cleared: true
  - label: Data in the table
    value: ~3 TB
    kind: measured
    cleared: true
confidentialityNote: Described at a high level. No internal code, architecture or customer data is shown.
---
