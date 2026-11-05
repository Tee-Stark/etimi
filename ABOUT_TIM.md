# Personal Website: Content Brief for Timilehin "Tim" Omolana

> **For the coding agent:** This file is the source of truth for *what the site says*. Build a personal website that lets anyone (recruiters, conference organisers, collaborators, investors, grad-school committees) quickly understand who Tim is and what he's built. Anything marked **[CONFIRM]** has to be checked with Tim before it goes live. Anything under "Needed from Tim" is missing, so use clearly marked placeholders and don't invent it. Spell out acronyms in full the first time they appear on each page.

---

## 1. Identity

| Field | Value |
|---|---|
| Display name | Tim Omolana (full: Timilehin Omolana) |
| Location | Lagos, Nigeria |
| One-line headline (draft) | Software engineer building reliable distributed systems in Go, and researcher working on autonomous robotics and control. |
| Alternative headline | Engineer at the intersection of distributed systems, control theory, and African-context products. |

### Short bio (draft, about 60 words)
Tim Omolana is a software engineer at FairMoney, where he works mainly in Go on distributed systems built with Temporal and the Saga pattern. He is a final-year Industrial Mathematics (Computer Option) student at the University of Lagos, a conference speaker, and a writer for MakeUseOf. His research focuses on control systems for autonomous hybrid aerial–underwater vehicles.

### Long bio (draft, about 150 words)
Tim Omolana is a Lagos-based software engineer, researcher, and builder. At FairMoney he writes Go for production distributed systems, with a focus on durable workflows (Temporal) and distributed transactions using the Saga pattern. He is completing a degree in Industrial Mathematics (Computer Option) at the University of Lagos. His undergraduate thesis, *Dechorder*, applied Non-negative Matrix Factorization to source separation in African music.

His research runs under VIRL (Vinculum Implexa Research Labs). Its flagship is HAUV, an autonomous vehicle for hull and subsea-infrastructure inspection that crosses the air–water boundary. Its commercial counterpart is VI Industries. He has also worked on Unmanned Aerial Vehicle (UAV) development at Naerospace.

Outside engineering, Tim speaks at developer conferences, writes for MakeUseOf, teaches graphic design, organises mentorship programmes, and is Music Director of a university choir. He wants to go on to graduate research in control and systems engineering.

---

## 2. Suggested site structure

1. **Home / Hero:** name, headline, 2–3 line intro, primary links (GitHub, LinkedIn, X, email, CV).
2. **About:** long bio, photo.
3. **Work / Experience:** FairMoney, Naerospace, MakeUseOf.
4. **Research:** HAUV, Dechorder (thesis), Bees Foraging Algorithm (metaheuristics).
5. **Projects / Ventures:** Enquoir, Xealtha, Kawe, Document Intelligence Platform.
6. **Speaking:** talks list.
7. **Writing:** MakeUseOf articles (link out; ideally pull a list of recent articles).
8. **Community & Teaching:** mentorship, buildathon, graphic design class.
9. **Music:** piano, choir, released song.
10. **Contact.**

A single long-scroll page with anchor navigation also works. Separate project/research detail pages would help later.

---

## 3. Experience

### FairMoney: Software Engineer
- Works mainly in Go.
- Production experience with distributed systems, Temporal (durable workflow orchestration), and the Saga pattern for distributed transactions.
- **[CONFIRM]** start date, team/area, and what he's comfortable saying publicly about his work there.

### MakeUseOf: Writer
- Writes for MakeUseOf (consumer tech publication).
- **[CONFIRM]** author page URL, start date, beat/topics.

### Naerospace: UAV Development
- Prior Unmanned Aerial Vehicle (UAV) development experience.
- **[CONFIRM]** role title, dates, what he worked on.

---

## 4. Education

- **University of Lagos (UNILAG):** B.Sc. Industrial Mathematics (Computer Option), final year.
- **Undergraduate thesis: *Dechorder*** (completed and defended, 2026). See Research.
- **[CONFIRM]** expected graduation date; whether to show grades/honours.

---

## 5. Research

### HAUV: Autonomous Hull & Subsea Inspection (flagship)
- **[CONFIRM]** what "HAUV" stands for publicly (likely Hybrid Aerial-Underwater Vehicle).
- Autonomous inspection vehicle that operates across three zones: **aerial, surface transition, and underwater**.
- Applications: maritime hull inspection, and oil & gas / subsea infrastructure (e.g. pipeline monitoring in the Niger Delta). Scope is **detection and independent verification**, not spill clean-up.
- Theoretical grounding: Fossen marine-vehicle hydrodynamics, hybrid dynamical systems, Model Predictive Control (MPC), and Extended Kalman Filter (EKF) state estimation.
- Research contribution (draft wording): translational heave stability with an explicit dwell-time condition on supervisory switching across the air–water boundary, for a nonlinear plant (quadratic drag, submersion-scaled added mass).
- **Poster accepted** at the MIRG-ICAIR 2026 poster session, University of Lagos. Co-author: Oluwatolamise Odelola. **[CONFIRM]** full name of MIRG-ICAIR and that the co-author is happy to be named.
- Target venue: IEEE International Conference on Robotics and Automation (ICRA).
- Affiliation shown publicly: **University of Lagos** (contributors from several UNILAG departments).
- There's an existing eight-stage interactive HTML explainer for HAUV. **[CONFIRM]** whether to embed or link it.
- **Note for the site:** present HAUV as active research. Don't publish build specs, roadmap, or funding/accelerator plans.

### Dechorder: African Music Source Separation (B.Sc. thesis)
- Non-negative Matrix Factorization (NMF)-based source separation for African music.
- Compares Euclidean, Kullback–Leibler (KL), and Itakura–Saito (IS) divergences on Afrobeat and MUSDB18 benchmarks.
- Implemented in **C++20**.
- Novel angle: application to music recommendation.
- **[CONFIRM]** repo/paper link.

### Bees Foraging Algorithm on CEC2013 Benchmarks (course project)
- Metaheuristic optimisation: Bees Foraging Algorithm evaluated on the CEC2013 (IEEE Congress on Evolutionary Computation 2013) benchmark suite.
- Implemented in Octave; written up in Typst.
- Optional/minor. Could go in a "smaller projects" list.

---

## 6. Projects & Ventures

### Enquoir: the safe control and observability layer for agentic finance
- Tagline: *"Every action has a policy, every execution has a history, every outcome can be investigated."*
- A safety wrapper for AI agents that move money, starting with Airwallex APIs: policy enforcement, observability, durable audit log and replay, idempotency, automatic compensation, and chaos testing ("chaos scoreboard"). Model Context Protocol (MCP) layer planned.
- Stack: Go, Temporal, Chi (HTTP), Domain-Driven Design (DDD) and clean architecture, Docker.
- Origin: entry for the Airwallex Agentic Banking Hackathon, now being developed as a standalone product.
- Status: early / in development. **[CONFIRM]** whether to show publicly yet, plus any link.

### Xealtha: WhatsApp-based healthcare triage for Nigeria
- AI triage on WhatsApp: users describe symptoms, AI gathers and summarises them for a doctor.
- In development: multilingual support (Nigerian languages including Pidgin) and voice/call-based triage.
- Doctor-led booking ("one platform, two front doors"): doctors share a booking link and AI pre-fills symptom intake.
- Privacy-first design: consults happen in-app; doctors and patients never exchange personal contact details.
- Stack: Go, PostgreSQL, Redis, asynq, Llama 3.3 70B (via Groq).
- Milestones that may be safe to publish: accepted into a healthtech-AI incubator; Nigeria Data Protection Act (NDPA) 2023 compliance completed; WhatsApp Business API approved for live mode.
- **[CONFIRM]** which milestones are public, plus website/link.

### Kawe: book marketplace for Nigeria
- Co-founded as a partner with a friend who runs a book business; Tim is turning it into a tech startup.
- Mission: close the hard-copy gap for (especially tech) books in Nigeria.
- Planned features: marketplace for bookstores and individual sellers (including used books), book gifting, real-time reading clubs with chat, publisher partnerships, delivery, and "Kawe Intelligence" (demand insight across the platform).
- **[CONFIRM]** whether to list publicly, co-founder name/permission, link.

### Document Intelligence Platform
- Go-based architecture using Domain-Driven Design, pgx, asynq, and a Redis-backed job queue.
- **[CONFIRM]** whether this is a personal project, has a repo, and what it does for users.

### Umbrella brands
- **VIRL (Vinculum Implexa Research Labs):** research identity. Not formally established yet, so present as an umbrella name, not an institution.
- **VI Industries:** commercial umbrella.

---

## 7. Speaking

| Talk | Event | Summary |
|---|---|---|
| **The Gopher's Trident** | GopherCon Africa 2026, Nairobi (October) | Distributed transactions without two-phase commit (2PC): orchestrating the Saga pattern in Go with Temporal and deterministic design, with a fintech loan-disbursement case study and live demo. |
| **Covering Grounds** | APIConf Lagos | **[CONFIRM]** abstract and date. |

- **[CONFIRM]** both talks were delivered, plus links to slides, recordings, and demo repo.
- Also: **MIRG-ICAIR 2026** poster (HAUV). Can be listed under Speaking or Research.

---

## 8. Community & Teaching

- **CACYOF Skill-Up 2026 (CSU 2.0):** organised a three-week mentorship programme running 15 skill tracks, and taught technical writing within it. **[CONFIRM]** what CACYOF stands for.
- **10-day Backend Buildathon (IEEE Computer Society × GitHub Campus Experts):** designed the track structure and reviewed participant pull requests across Node.js, TypeScript/Hono, and Python/FastAPI.
- **Graphic design class:** teaches a graphic design class. **[CONFIRM]** where and for whom.

---

## 9. Music

- Pianist.
- **Music Director and Unit Head, The Fulfilled Minstrels** (choir of CACYOF UNILAG).
- Released a song with the choir: **"Revealers of God's Glory"** (distributed via CD Baby). **[CONFIRM]** streaming link.
- Interest in audio signal processing, which ties into the Dechorder thesis and is a good bridge between his music and engineering.

---

## 10. Skills (for a skills/tech section)

- **Languages:** Go (primary), C++20, TypeScript, Python, Octave.
- **Backend & infrastructure:** Temporal, PostgreSQL (pgx, database/sql), Redis, asynq, Chi, Docker.
- **Architecture:** distributed systems, Saga pattern, Domain-Driven Design, clean architecture, idempotency, observability.
- **AI:** Large Language Model (LLM) integration (Llama 3.3 via Groq), agentic systems.
- **Research / maths:** control theory (MPC, hybrid systems), state estimation (EKF), marine hydrodynamics, NMF, signal processing, metaheuristic optimisation.
- **Other:** technical writing, Typst, graphic design.

---

## 11. Tone & design notes

- Voice: confident, specific, technical without jargon walls. First person ("I build...") or third person, **[CONFIRM]** with Tim.
- Audience spans engineers, researchers, and non-technical visitors, so every project card should have a one-sentence plain-English summary before technical details.
- He works across a wide range (fintech infra, robotics research, health, books, music). Use the site to show a unifying thread, e.g. **"building reliable systems for real-world, African contexts."**
- Must be fast, mobile-first, and accessible. Easy to update (projects/talks as data files or Markdown/MDX content collections).
- Include an SEO title/description, Open Graph image, and `Person` JSON-LD structured data so searching "Tim Omolana" or "Timilehin Omolana" surfaces the site.

---

## 12. Needed from Tim (placeholders until provided)

- [ ] Profile photo(s)
- [ ] Contact email for the site (personal, not school)
- [ ] GitHub, LinkedIn, X/Twitter, MakeUseOf author page, Google Scholar/ORCID (if any)
- [ ] CV/résumé PDF
- [ ] Dates for FairMoney, Naerospace, MakeUseOf
- [ ] Links for talks, repos, Xealtha/Kawe/Enquoir, the song, the HAUV explainer
- [ ] Domain name and preferred hosting (e.g. Vercel, Netlify, GitHub Pages)
- [ ] Preferred framework, if any (otherwise Astro or Next.js with Markdown content is a sensible default)
- [ ] Every item marked [CONFIRM] above

## 13. Do NOT publish

- Matriculation number, school email, or any student ID.
- Internal strategy for HAUV/Xealtha/Kawe (funding decisions, accelerator choices, grant plans, build specs, pricing/monetisation).
- Names of collaborators or friends without their permission.
