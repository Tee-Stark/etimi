---
# Source: PLAN.md §3.6, Q25. Milestones and link stay hidden until confirmed (O8).
# Never name the incubator without confirmation. No funding, pricing or roadmap.
title: Xealtha
slug: xealtha
summary: >-
  Healthcare triage over WhatsApp for Nigeria: a patient describes their
  symptoms, and AI gathers and summarises them for a doctor.
visibility: public
status: in-development
stage: In development
threads: [creation, engineering]
featured: true
order: 1
updated: 2026-11-05
stack: [Go, PostgreSQL, Redis, asynq, Llama 3.3 70B via Groq]
milestones:
  - text: Accepted into a healthtech-AI incubator
    visibility: hidden
  - text: Nigeria Data Protection Act (NDPA) 2023 compliance completed
    visibility: hidden
  - text: WhatsApp Business API approved for live mode
    visibility: hidden
links:
  - label: Website
    url: ""
    visibility: hidden
---
**One platform, two front doors.** Patients can describe their symptoms on WhatsApp, or a doctor can share a booking link, in which case AI pre-fills the symptom intake.

**Privacy first.** Consultations happen in the app, and doctors and patients don't exchange personal contact details.

**In development:** support for Nigerian languages, including Pidgin, and triage by voice and phone call.
