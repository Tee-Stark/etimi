---
# Source: resume (5 Nov 2026). Figure cleared (PLAN.md Q31).
title: Home screen latency
slug: home-screen-latency
summary: I made the app's home screen load much faster by removing N+1 query bottlenecks and adding layered caching.
visibility: public
status: completed
threads: [engineering]
featured: true
order: 2
updated: 2026-11-05
role: fairmoney
problem: >-
  The home screen was slow, partly because of N+1 query bottlenecks: one
  database query to fetch a set of records, then one more for each record.
approach: >-
  I removed the N+1 bottlenecks and introduced a multi-layered caching
  strategy with Redis, along with optimised composite database indexes.
outcome: Home screen latency dropped sharply, improving the experience across the app.
stack: [Go, Redis]
metrics:
  - label: Reduction in home screen latency
    value: "~70%"
    kind: measured
    cleared: true
confidentialityNote: Described at a high level. No internal code, architecture or customer data is shown.
---
