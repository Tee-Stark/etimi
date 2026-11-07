---
# Added 7 Nov 2026 (Timmy led the project). Details from the code in
# ~/Timmy/CACYOF (attendance-system-server, Attendance-frontend, admin-zone).
# No member data, no live check-in link (it would let anyone sign in to events).
# "CACYOF" left unexpanded until confirmed (O9).
title: CACYOF UNILAG attendance platform
slug: cacyof-attendance-platform
summary: >-
  I led the build of an attendance and member-management platform for CACYOF
  UNILAG: members check in to events by scanning a QR code, and an admin
  dashboard handles records, reports and exports.
visibility: public
status: shipped
threads: [engineering, creation]
featured: true
order: 4
updated: 2026-11-07
role: Project lead
stack: [TypeScript, Node.js, Express, MongoDB, React, Tailwind CSS, Fly.io]
---
**Check-in.** Every event gets a QR code. Scanning it opens a check-in app where members find themselves by name, email or phone number, first-timers register and check in in one step, and guests sign in separately. Duplicate check-ins are rejected, and one device can check in many people.

**Admin dashboard.** Admins create events and download their QR codes, see attendance by event or by member, manage member records, track first-timers and guests, and export attendance to CSV.

**Keeping records current.** Members can update their own details after confirming an emailed one-time code, and a yearly script moves students up a level at the start of each academic session.

Behind it is a TypeScript and Express API over MongoDB, with aggregation pipelines for the reports.
