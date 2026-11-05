# Timmy Omolana: Personal Website Plan

> **Purpose of this document:** This is the agreed plan for Timmy Omolana's personal website. It brings together `ABOUT_TIM.md`, the "Personal Website: Identity, Background & Development Brief", and Timmy's answers to the clarification round (3 Nov 2026). It covers **what the site says, how it is organised, how content is modelled, and how it should look and feel**. It does **not** fix the framework, hosting, or tooling. Those come in the implementation spec.
>
> **Order of precedence when sources disagree:** (1) Timmy's clarification answers (Section 2), then (2) `ABOUT_TIM.md`, then (3) the brief. Anything not settled by these is listed in Section 13 (Open items) and must **not** be invented.

---

## 1. Project summary

This is a personal website and long-term digital home for **Timmy Omolana** (full name Timilehin Omolana), a Lagos-based software engineer and researcher.

The site should let recruiters, engineers, researchers, conference organisers, collaborators, and curious visitors quickly understand:

- who he is,
- what he does professionally,
- what he researches,
- what he has built,
- what he is exploring now,
- how he thinks,
- who he is beyond software, and
- how to reach him.

It is **not** a résumé site or a product landing page. It should feel like an engineer's portfolio, a researcher's journal, and an intellectual home, built to grow for years.

**Three threads run through the whole site:**

| Thread | Meaning |
|---|---|
| **Engineering** | Building reliable, scalable, useful systems. |
| **Research** | Investigating hard problems and their mathematical foundations. |
| **Creation** | Turning ideas into products, experiments, and tangible things. |

**Positioning line (lead, confirmed):**
> "Engineering at the intersection of mathematics, computation, and real-world systems."

The brief's alternative ("Building systems, exploring ideas, and finding connections between mathematics and engineering.") may be used as secondary copy.

---

## 2. Decisions log (from Timmy, 3 Nov 2026)

| # | Topic | Decision |
|---|---|---|
| 0a | MakeUseOf | Timmy **stopped writing for MakeUseOf in 2023**. Show as a **past** role only. |
| 0b | Education | Timmy **graduated from UNILAG in August 2026**. He is no longer a student. |
| Q1 | Positioning | The brief's line leads: *"intersections of mathematics, computing, and real-world systems."* |
| Q2 | Graduate study | **Do not** state any graduate-study goal. Keep **Quantum Computing** and **control & systems engineering** as *interests* only. |
| Q3 | Dechorder | The B.Sc. thesis is **completed and defended**. **Music recommendation** is a **future-work** direction. |
| Q4 | Vinculum Implexa | **Leave out** VI, VIRL, and VI Industries, including Timmy's founder role. Describe the **research itself** only. These will be added later. |
| Q5 | HAUV detail | **Research summary only.** No build specs, roadmap, or funding/commercial plans written on the site. |
| Q6 | HAUV target venue | **Do not publish** any target venue (ICRA or IROS) until there is an acceptance. |
| Q7 | "Safe-wait" | Same thing as the **dwell-time condition**. Use the term "dwell-time condition" on the site, explained in plain English. |
| Q8 | HAUV affiliation | **University of Lagos** for now. |
| Q9 | Kawe, Enquoir | **Do not publish** either one. |
| Q10 | Skills | Use the **combined list from both sources**. Rust is a **novice / learning** skill. Timmy will prune over time. |
| Q11 | Navigation | Proposed information architecture **accepted** (Section 4). |
| Q12 | Removals and additions | **Remove:** APIConf talk, the choir song, Bees Foraging Algorithm. **Document Intelligence Platform** is a personal GitHub project (link coming later). |
| Q13 | Removals | **Remove:** antimicrobial resistance (AMR) modelling, eBPF anomaly detection, Celcic Media, Octave internship. |
| Q14 | FairMoney numbers | **Undecided.** Build the slots, but keep every FairMoney metric **hidden** until cleared. |
| Q15 | Naerospace | Naerospace was the **drones department of Nord Motion**. It was meant to become its own company before the project stopped. |
| Q16 | GopherCon Africa | **Delivered.** Slides and repo links will come later. |
| Q17 | DevFest Lagos 2024 | "Beyond CRUD" was given **at DevFest Lagos 2024**. |
| Q18 | MIRG-ICAIR poster | Presentation is **4 Nov 2026**. The PDF will be supplied afterwards. *(Presented: see Q27.)* |
| Q19 | Graduation | August 2026. |
| Q20 | Music and community | **Follow the brief:** include it as one human dimension. It must not look like a church or ministry site. |
| Q21 | Voice | **First person.** |
| Q22 | Links | Will be supplied over time. Use hidden placeholders until then. |
| Q23 | Assets | Will be supplied later. **Start building now** with neutral placeholders. |
| Q24 | HAUV explainer | **Embed** it (https://virl-hauv-research.netlify.app). The URL currently sends no `X-Frame-Options` or CSP frame headers, so an iframe is technically possible. *See open item O1 for a conflict with Q5/Q6.* |
| Q25 | Ventures | **Only Xealtha** may appear publicly. |
| Q26 | Name (5 Nov 2026) | **"Timmy Omolana"** is the display name everywhere; **"Timilehin Omolana"** is the only alternate (metadata, JSON-LD `alternateName`). **"Tim" is never used** on the site. This supersedes `IMPLEMENTATION_SPEC.md` §9.5/§9.6, which say "Tim Omolana". |
| Q27 | MIRG-ICAIR poster (5 Nov 2026) | The poster **was presented** on 4 Nov 2026. Show "poster presented". The PDF and the full conference name are still to come. |
| Q28 | Hosting and domain (5 Nov 2026) | Hosted on **Netlify** (supersedes the spec's Vercel default). Canonical origin: `NEXT_PUBLIC_SITE_URL` if set, otherwise **Netlify's own `URL`** (the custom domain once attached, else the `.netlify.app` address). Netlify production deploys fail without a real https origin. |
| Q29 | Content edits (5 Nov 2026) | **Domain: https://etimi.me** (production). Biography opens "I'm **Timilehin** Omolana". **Choir:** Music Director tenure **ended August 2026**; use past tense. **Remove graphic design** everywhere (no class, not a skill). **Add:** technical writing mentorship; love of **anime, chess and gaming**. **CSU 2.0:** Timmy **led the organising committee** (a team effort). **Multi-chain DEX indexing:** mostly **Go, Docker and AWS**, not Rust. **Logo:** the eTimi mark (loop resolving into a T) is used across the site. |

---

## 3. Content inventory and publication status

**Legend:**
- **PUBLISH**: confirmed. Can go live.
- **HIDDEN**: build it, but exclude it from production until confirmed or supplied.
- **REMOVED**: do not build, do not mention.

### 3.1 Identity

| Item | Status | Content |
|---|---|---|
| Display name | PUBLISH | Timmy Omolana |
| Full name | PUBLISH (metadata, About) | Timilehin Omolana |
| Location | PUBLISH | Lagos, Nigeria |
| Title line | PUBLISH | "Software engineer & researcher". Never reduce him to one label alone. |
| Positioning | PUBLISH | See Section 1 |
| Headshot / photos | HIDDEN | To be supplied. Use a neutral typographic placeholder, not stock or AI imagery. |
| CV PDF | HIDDEN | To be supplied |

### 3.2 Experience

| Role | Status | Confirmed content | Pending |
|---|---|---|---|
| **FairMoney**, Software Engineer (Remote) | PUBLISH (role and qualitative work) | Started **November 2024** (from the brief). Works mainly in **Go**. High-throughput, event-driven fintech environment. Production experience with distributed systems, **Temporal** durable workflows, and the **Saga pattern**. Works on internal engineering systems, platform reliability, performance, and customer experience. FairMoney is a fintech operating in Nigeria. | **All metrics HIDDEN** (Q14). Team/area wording. |
| **Analytics Intelligence Africa**, Backend Engineer | PUBLISH | Sep 2024 – Oct 2024. Worked on the DSCM algorithmic trading platform: Java backend, logging and health monitoring, refactoring, chat-history feature, AWS, Terraform, Kubernetes/EKS, Docker, GitHub Actions, ECR, Helm, Redshift, Glue, S3. | What "DSCM" stands for (spell out or omit) |
| **Naerospace (drones department of Nord Motion)**, Software Engineering | PUBLISH (role and description) | Unmanned Aerial Vehicle (UAV) software. Go-based RTSP-to-WebRTC streaming. Communication features using Go, PostgreSQL, and Redis Pub/Sub. Web security improvements. Naerospace was Nord Motion's drones department, meant to spin out as its own company before the project stopped. | **Role title, dates** (the old résumé says Nov 2022 onward, which is unreliable). **Metrics HIDDEN:** ~94% latency improvement, ~90% landing-precision improvement, 15% mission-success improvement. |
| **MakeUseOf**, Writer | PUBLISH (as past) | Wrote for MakeUseOf (consumer tech publication) **until 2023**. | Start date, author page URL, beat/topics |
| Celcic Media | REMOVED | | |
| Octave (internship) | REMOVED | | |

#### FairMoney engineering work (qualitative = PUBLISH, numbers = HIDDEN)

Each item below is written **without numbers by default**. A number shows only when its `cleared` flag is set (see Section 6).

1. **Loan details API performance.** Found and fixed an N+1 query problem.
   - *Hidden metric:* response time went from >12 s to <100 ms (measured).
   - This is the flagship item and goes first.
2. **Stale data cleanup.** Large-scale cleanup of stale database records that reduced storage and infrastructure cost.
   - *Hidden metrics:* ~200M records, ~3 TB affected, ~800 GB freed (measured).
   - **Never** state a percentage cost reduction.
3. **Bank statement processing.** Built bank statement upload using Go, AWS, and Temporal workflows, including orchestration and supporting backend.
4. **Credit intelligence in loan decisioning.** Brought credit-registry smart-score data into loan offer generation.
   - *Hidden metric:* targeted a 15–20% reduction in First Payment Default (**expected, not measured**).
   - This must always be labelled as expected impact.
5. **Scoring latency.** Reduced scoring latency spikes by introducing new queues. Documented scoring flows and how they behave in operation.
6. **Loan offer generation.** Management Fee V2 deductions in the disbursement flow, plus offer-generation logic.
7. **Other work** (compact list):
   - loan referral deep-link fix
   - loan expiry timestamp consistency
   - low-risk loan product eligibility
   - income statement flows and provider edge cases
   - homepage latency investigation
   - Grafana/PromQL observability
   - internal financial calculation tools in JavaScript using numerical methods (Newton–Raphson)

**FairMoney guardrails:**
- No source code, internal architecture diagrams, customer data, or proprietary detail.
- **Never call FairMoney's architecture "microservices".**
- The "10,000+ loans daily / billions of Naira monthly" figures are **HIDDEN** (business metrics, not cleared).

### 3.3 Education

| Item | Status | Content |
|---|---|---|
| Degree | PUBLISH | **B.Sc. Industrial Mathematics (Computer Option), University of Lagos.** Graduated **August 2026**. |
| Thesis | PUBLISH | *Dechorder* (completed and defended, 2026). Links to the Research page. |
| Grades / class of degree / matric no. / school email | REMOVED | Never publish. |
| Academic interests | PUBLISH | Numerical analysis, functional analysis, software design and architecture, data design and management, stochastic processes, mathematical modelling, linear algebra, optimisation, applied mathematics. Present these as **interests and training**, not claimed research expertise. |
| Graduate-study goals | REMOVED | Q2 |

### 3.4 Research

#### A. HAUV: Hybrid Aerial-Underwater Vehicle (flagship): PUBLISH

- **Title:** "Autonomous Hull Screening for Nigerian Ports: Stable Air–Water Transition for a Hybrid Aerial-Underwater Vehicle."
- **Status:** Active research.
  - Poster at **MIRG-ICAIR 2026**, University of Lagos.
  - Before 4 Nov 2026 show "poster accepted". After that show "poster presented". Either the content is updated by hand, or it's driven by the event date. The full conference name is pending.
- **Affiliation:** University of Lagos (Q8). No mention of VI or VIRL (Q4).
- **Name:** "HAUV" = Hybrid Aerial-Underwater Vehicle (as used on Timmy's own public explainer).
- **Plain-English summary:** a small autonomous vehicle that can fly to a ship, inspect the hull from the air, enter the water, inspect below the waterline, and come back. The research question is how to keep it stable as it crosses the air–water boundary.
- **Motivation (public, cited facts only):**
  - Hull fouling raises fuel burn and emissions.
  - Diver and ROV inspections are slow, costly, and limited by weather and visibility.
  - The 0–5 m waterline / photic zone is the hardest part to inspect and the most fouled.
  - Applications: maritime hull inspection; oil & gas / subsea infrastructure, with scope limited to **detection and independent verification**, not clean-up.
- **Theory:**
  - Fossen marine-vehicle hydrodynamics
  - hybrid dynamical systems (aerial / transition / underwater modes)
  - Model Predictive Control (MPC) as a research direction
  - Extended Kalman Filter (EKF) state estimation
- **Contribution (draft wording):**
  - Stability of the translational (heave) dynamics across the air–water transition.
  - The model is nonlinear and has three zones, with quadratic drag and added mass that scales with how submerged the vehicle is.
  - Stability holds under an explicit **dwell-time condition** on the supervisory switching. In plain English: a minimum time the controller must stay in a mode before switching again.
- **Results:** HIDDEN until Timmy supplies the exact poster/abstract wording:
  - ~3,140 simulations
  - dwell-time criterion 8–89× above the problematic switching intervals found
- **Simulation only:** Never imply a physical prototype, field validation, or deployment.
- **Co-author** (Oluwatolamise Odelola): HIDDEN until permission is confirmed.
- **Poster PDF:** HIDDEN until supplied (after 4 Nov 2026).
- **Interactive explainer:** embedded (Q24). See **O1**.
- **Not published on the site:**
  - build specs (mass, endurance, depth ratings)
  - hardware roadmap or versions
  - commercial / SaaS plans
  - NPA field-trial plans
  - risk register
  - funding or accelerator plans
  - target venues

#### B. Dechorder: Source Separation for African Music (B.Sc. thesis): PUBLISH

- **Status:** Thesis **completed and defended (2026)**. Future work continues.
- **Plain-English summary:** splitting a mixed music recording back into its parts, tuned to the sound of African music, using mathematics (matrix factorisation) instead of a black-box model.
- **Method (confirmed):**
  - Non-negative Matrix Factorisation (NMF).
  - Compares **Euclidean, Kullback–Leibler (KL), and Itakura–Saito (IS)** divergences.
  - Tested on **Afrobeat** material and the **MUSDB18** benchmark.
  - Implemented in **C++20**.
- **Background maths to explain:**
  - Short-Time Fourier Transform (STFT) and spectrograms
  - why non-negativity matters
  - what each divergence measures
  - reconstruction back to audio
- **Future work (labelled as future):**
  - **music recommendation** built on separated components (Q3)
  - further optimisation for traditional African instrumentation and recording conditions
- **Pending, so don't state as fact yet:**
  - whether CMake / libsndfile / FFTW3f / Eigen3 / overlap-add are in the delivered code
  - which stems are separated (vocals/drums/bass/keys)
  - publishable results
  - the Afrobeat dataset's source
  - thesis PDF and repo links

#### C. Removed research

Bees Foraging Algorithm, AMR modelling, and eBPF anomaly detection are all REMOVED.

### 3.5 Projects and explorations

| Item | Status | Content |
|---|---|---|
| **Document Intelligence Platform** | PUBLISH (card), link HIDDEN | Personal project. Go, Domain-Driven Design, pgx, asynq, Redis-backed job queue. The user-facing description is pending (O6). |
| **Multi-chain DEX indexing** | PUBLISH as *exploration* | Blockchain data indexing across EVM-compatible networks, mostly in Go with Docker on AWS (Q29), indexing protocols directly instead of relying on subgraphs/substreams. Label it as an exploration. Whether code exists is pending (O7). |
| **Numerical methods in financial systems** | Folded into FairMoney | Newton–Raphson interest-rate tooling (see 3.2). |
| Agentic financial infrastructure | REMOVED (as an exploration) | This is Enquoir's concept, and Enquoir is not public (Q9). "Agentic systems" may stay as a general skill. |

### 3.6 Ventures

| Venture | Status | Content |
|---|---|---|
| **Xealtha** | PUBLISH (concept and stack) | **Plain English:** healthcare triage over WhatsApp for Nigeria. A patient describes symptoms, and AI gathers and summarises them for a doctor. "One platform, two front doors": doctors can share a booking link, and AI pre-fills the symptom intake. Privacy-first: consultations happen in-app, and doctors and patients don't exchange personal contact details. **In development:** multilingual support (Nigerian languages including Pidgin) and voice/call-based triage. **Stack:** Go, PostgreSQL, Redis, asynq, Llama 3.3 70B via Groq. Status label: *In development*. |
| Xealtha milestones | HIDDEN | Healthtech-AI incubator acceptance, NDPA 2023 compliance, WhatsApp Business API live approval. Each needs confirmation (O8). Never name the incubator without confirmation. |
| Xealtha link | HIDDEN | To be supplied |
| Vinculum Implexa / VIRL / VI Industries | REMOVED (for now) | Q4. To be added later. |
| Kawe / Kawe Hub | REMOVED | Q9 |
| Enquoir | REMOVED | Q9 |

### 3.7 Speaking

| Talk | Status | Content |
|---|---|---|
| **"The Gopher's Trident"**, GopherCon Africa 2026, Nairobi (October) | PUBLISH (delivered) | Distributed transactions without two-phase commit (2PC): orchestrating the Saga pattern in Go with Temporal and deterministic design, with a fintech loan-disbursement case study and live demo. Themes: idempotency, deterministic workflow execution, workflow IDs and business keys. Slides and repo HIDDEN until supplied. |
| **"Beyond CRUD: What Real-World Backend Engineering Looks Like"**, DevFest Lagos 2024 | PUBLISH | Student-focused talk on backend engineering beyond basic APIs and CRUD. Timmy also volunteered as a backend engineering volunteer. |
| **HAUV poster**, MIRG-ICAIR 2026, University of Lagos | PUBLISH | Cross-listed with Research. Status as in 3.4A. |
| "Covering Grounds", APIConf Lagos | REMOVED | Q12 |

### 3.8 Community, teaching and music (one human dimension, not the site's identity)

| Item | Status | Content |
|---|---|---|
| **Music Director & Unit Head, The Fulfilled Minstrels** (choir of CACYOF UNILAG), 2025/2026 session | PUBLISH | Leads the choir: weekly rehearsals, vocal development, and music theory teaching (major/minor scales, time and key signatures). Present it as music leadership with neutral, non-ministry styling. |
| Pianist | PUBLISH | |
| **CACYOF Skill-Up 2026 (CSU 2.0)** | PUBLISH | Organised a three-week mentorship programme with 15 skill tracks, and taught technical writing in it. *What "CACYOF" stands for is pending (O9). Until then, use the acronym only.* |
| **10-day Backend Buildathon** (IEEE Computer Society × GitHub Campus Experts) | PUBLISH | Designed the track structure and reviewed participant pull requests across Node.js, TypeScript/Hono, and Python/FastAPI. |
| Graphic design class | REMOVED | Q29 |
| The song "Revealers of God's Glory" | REMOVED | Q12 |
| Music ↔ engineering bridge | PUBLISH | Interest in audio signal processing connects music to Dechorder. This is a natural cross-link. |

### 3.9 Writing

| Item | Status | Content |
|---|---|---|
| Own notes/articles | PUBLISH (empty section) | Launches with **zero posts**. Show an honest empty state. No fabricated posts. |
| Topic backlog | Internal only | Backend beyond CRUD; Temporal and deterministic execution; Saga patterns and idempotency; performance engineering; mathematical thinking in software; signal processing and music; research-driven products. Do **not** render these as articles or "coming soon" titles unless Timmy approves. |
| MakeUseOf (past) | PUBLISH (as past publication) | "Previously wrote for MakeUseOf (until 2023)." Author page link HIDDEN until supplied. Optionally a curated article list later. |

### 3.10 Interests

**PUBLISH:**
- mathematics and its applications
- algorithms
- systems engineering
- distributed systems
- programming language design and implementation
- Go / C++ / Rust / Java
- robotics and autonomous systems
- control and systems engineering
- audio engineering and music technology
- classical and contemporary music
- research and experimentation
- entrepreneurship
- cryptography and security, including zero-knowledge proofs
- financial technology
- **quantum computing** (as an interest only)

Learning style: through implementation and from first principles.

### 3.11 Skills (combined list; grouped by domain, no ratings)

No percentages, progress bars, or logo walls. One light marker only: **"Learning"** for novice skills. Go is noted as primary. Timmy will prune.

| Domain | Items |
|---|---|
| **Languages** | Go (primary) · C++20 · Java · JavaScript · TypeScript · Python · Octave · Rust (learning) |
| **Backend & architecture** | API design · event-driven systems · distributed systems · workflow orchestration (Temporal) · Saga pattern · idempotent design · Domain-Driven Design · clean architecture · Chi · asynq · financial systems |
| **Databases & data** | PostgreSQL (pgx, database/sql) · MongoDB · Redis · Amazon Redshift · AWS Glue · S3 · SQL/query optimisation |
| **Infrastructure & cloud** | AWS · Docker · Kubernetes / Amazon EKS · Amazon ECR · Helm · Terraform · GitHub Actions |
| **Observability & reliability** | Grafana · PromQL · StatsD · performance analysis · workflow reliability |
| **AI** | Large Language Model (LLM) integration (Llama 3.3 via Groq) · agentic systems |
| **Mathematics & computation** | Linear algebra · numerical analysis · numerical optimisation · root-finding (Newton–Raphson) · signal processing / Fourier analysis · NMF · mathematical modelling · control theory (MPC, hybrid systems) · state estimation (EKF) · marine hydrodynamics |
| **Other** | Technical writing · Typst · graphic design |

### 3.12 Contact and profiles

All are **HIDDEN until supplied**: email, GitHub, LinkedIn, X/Twitter, MakeUseOf author page, Google Scholar / ORCID. Do not guess handles.

`linkedin.com/in/timmyomolana` appears on the HAUV explainer, but it is **not to be used until Timmy confirms it** (O11).

---

## 4. Information architecture

```
/                      Home
/about                 About (bio, education, philosophy, interests, music & community)
/work                  Work: experience timeline + selected engineering
/work/[slug]           Engineering case study (e.g. loan-details-api, data-cleanup)
/research              Research index
/research/hauv         HAUV case study (+ embedded explainer)
/research/dechorder    Dechorder case study
/projects              Projects & explorations (Document Intelligence Platform, DEX indexing)
/ventures              Ventures (Xealtha only, at launch)
/ventures/xealtha      Xealtha page (optional at launch; can be a section on /ventures)
/speaking              Talks and posters
/writing               Notes index (empty state) + past publications
/writing/[slug]        Note (template ready, no content)
/contact               Contact
/404
```

**Primary nav:** Work · Research · Projects · Ventures · Speaking · Writing · About · Contact. Home is the name/wordmark.

If the nav feels crowded, Projects and Ventures can be shown together under one item. **Decision for the spec agent.**

**Cross-linking (shows the three threads):**
- Dechorder ↔ Music (About)
- Saga/Temporal (GopherCon) ↔ FairMoney work
- Newton–Raphson tooling ↔ Mathematics interests
- HAUV ↔ control theory skills

---

## 5. Page-by-page specification

General rules for every page:
- Spell out each acronym in full the first time it appears on that page.
- Every project/talk card leads with a **one-sentence plain-English summary**, then the technical detail.

### 5.1 Home

1. **Hero.**
   - Name, title line, positioning line.
   - Supporting copy (draft): *"I'm a software engineer and researcher. I build backend systems for fintech in Go, study the mathematics behind how systems behave, and work on autonomous robotics research. I like problems that sit between disciplines."*
   - CTAs: **Explore my work** → /work, **Get in touch** → /contact.
2. **Three threads:** Engineering / Research / Creation. One line each, with links to the best example of each (FairMoney work / HAUV / Xealtha).
3. **Current research:** HAUV highlight (status badge, poster note).
4. **Selected work:** 3–4 items across engineering, research, and projects.
5. **Experience at a glance:** FairMoney → Analytics Intelligence Africa → Naerospace.
6. **Short introduction** + link to About.
7. **Speaking highlight:** GopherCon Africa 2026.
8. **Profile links:** each one appears only when its URL is confirmed.

### 5.2 About

- **Long bio, first person.** Draft below for Timmy to approve.
- **Education:** degree, graduation, thesis.
- **Philosophy:** meaningful solutions come from connecting fields. Examples:
  - maths → engineering
  - algorithms → audio/music
  - reliable distributed systems → finance
  - modelling → physical systems
  - software → turning research into products

  No VI reference (Q4).
- **Interests** (3.10).
- **Beyond engineering:** music (pianist, choir leadership), teaching and mentorship (CSU 2.0, Buildathon, graphic design class). Neutral styling.
- **Skills** (3.11). Either here or on /work. **Spec agent to choose.**
- Photo (placeholder until supplied).
- CV download (hidden until supplied).

**Draft long bio (first person, for Timmy's approval):**
> I'm Timmy Omolana, a software engineer and researcher based in Lagos. I'm interested in how complex systems actually work, and in using mathematics and software to build things that hold up in the real world.
>
> At FairMoney, I write Go for backend systems in a high-throughput, event-driven fintech environment. Most of my work involves durable workflows with Temporal, reliable distributed processes using the Saga pattern, and performance and data work that makes systems faster and cheaper to run.
>
> I studied Industrial Mathematics (Computer Option) at the University of Lagos and graduated in 2026. My thesis, *Dechorder*, used non-negative matrix factorisation to separate the sources in African music recordings. It's where my interests in mathematics, signal processing and music meet.
>
> My current research is on HAUV, a hybrid aerial–underwater vehicle for autonomous hull inspection. I'm studying how to keep it stable as it crosses the boundary between air and water.
>
> Away from engineering, I play the piano, lead a university choir as Music Director, and teach and mentor through community programmes. I've spoken at GopherCon Africa and DevFest Lagos.

### 5.3 Work

- **Experience timeline:** FairMoney (Nov 2024–present), Analytics Intelligence Africa (Sep–Oct 2024), Naerospace / Nord Motion (dates pending), MakeUseOf (until 2023; start date pending).
  - Undated items show no date, never a guessed one.
- **Selected engineering** (case-study cards, in order):
  1. Loan details API (N+1)
  2. Stale data cleanup
  3. Bank statement processing (Go, AWS, Temporal)
  4. UAV real-time video streaming (RTSP→WebRTC, Go)
  5. Credit intelligence in loan decisioning (expected-impact label)
- **Case-study template:** context → problem → approach → what I did → outcome (metrics only if cleared, with a measured/expected badge) → what I learned. Each includes a confidentiality note where relevant.
- Compact "other work" list.

### 5.4 Research index and case studies

**Index:** HAUV (active), Dechorder (completed thesis + future work). Room for future entries.

**Case-study template (7 parts):**
1. The problem
2. Why it's interesting
3. The underlying maths / engineering (KaTeX equations allowed)
4. Approach
5. Implementation
6. Results and findings
7. Future directions

Each case study supports:
- status badge
- affiliation
- collaborators (permission-gated)
- publications/posters (PDF downloads)
- figures/diagrams with captions
- an "Updates" log (dated entries)
- an external links block

**HAUV extras:**
- an **embedded explainer** section: lazy-loaded iframe, accessible title, "Open in new tab" fallback link, and a note that it's an external interactive companion
- a clear "simulation-based; not field-validated" statement

### 5.5 Projects

Cards with status badges. Document Intelligence Platform (repo link when supplied); Multi-chain DEX indexing (exploration).

### 5.6 Ventures

- Short intro on building products for real problems.
- Xealtha entry (3.6), status *In development*.
- The structure must support adding VI/VIRL, Kawe, and Enquoir later **without code changes** (content entries only).

### 5.7 Speaking

Reverse-chronological list:
- GopherCon Africa 2026
- MIRG-ICAIR 2026 poster
- DevFest Lagos 2024

Each entry shows: title, event, location, date, format (talk/poster), abstract, and links (slides/video/repo/PDF, each hidden until supplied). The page should also serve as a press-kit-style page for organisers. A short speaker bio and headshot download go here once the assets exist.

### 5.8 Writing

- Notes index with an honest empty state (e.g. "Notes and essays will appear here.").
- A "Previously" block: MakeUseOf (until 2023).
- The post template must support: long-form typography, code blocks, KaTeX maths, figures, footnotes, table of contents, reading time, tags, and an RSS feed.

### 5.9 Contact

- Short invitation, covering what Timmy is open to (wording pending, O12).
- Email and profile links, shown only once confirmed.
- No form unless the spec agent adds one.

---

## 6. Content model (framework-agnostic)

All content lives in **Markdown/MDX files with typed frontmatter**, one file per entity. Adding a project, talk, role, note, or venture means adding one file, with no code changes.

**Common fields on every entity:**
- `title`, `slug`, `summary` (one plain-English sentence, required)
- `visibility`: `public` | `hidden`. Hidden entries are excluded from production builds, sitemap, RSS, and search, but render in local dev with a visible "HIDDEN" banner.
- `status`: `shipped` | `active` | `in-development` | `completed` | `exploration` | `archived`
- `tags`, `threads`: subset of `engineering` | `research` | `creation`
- `featured` (bool), `order`, `updated`

**Entity types and key fields:**

| Type | Key fields |
|---|---|
| `role` | organisation, orgNote (e.g. "drones department of Nord Motion"), title, start, end (nullable; null = present; undefined = unknown → don't render), location, mode, summary, highlights[] |
| `caseStudy` (engineering) | role ref, problem, approach, outcome, `metrics[]`, confidentialityNote |
| `research` | affiliation, collaborators[] (each with `consent: bool`), publications[], updates[] (dated), embeds[], links[] |
| `project` | repo, stack[], links[] |
| `venture` | stage, stack[], milestones[] (each with `visibility`), links[] |
| `talk` | event, location, date, format (`talk` / `poster`), abstract, links (slides / video / repo / pdf, each with `visibility`) |
| `note` | date, readingTime, tags, draft |
| `publication` | outlet, period, url |
| `community` | organisation, role, period, description |
| `site` (singleton) | name, fullName, title, positioning, location, profiles[] (each `{label, url, visibility}`), email, cv |

**Metric object (central to accuracy):**
```yaml
metrics:
  - label: "Loan details endpoint response time"
    value: ">12 s → <100 ms"
    kind: measured        # measured | expected
    cleared: false        # must be true to render in production
    note: ""
```
- `kind: expected` always renders with an "Expected impact" badge.
- `cleared: false` never renders in production.

**Build-time guardrails (required):**
1. Production build **fails** if any public entry contains the token `[CONFIRM]`, `TODO`, or an empty required field.
2. Production build **fails** if a public page links to a profile/URL whose `visibility` is `hidden`.
3. A lint/check fails on banned phrases in FairMoney content: `microservice` (case-insensitive), and any percentage tied to cost reduction.
4. Collaborator names render only when `consent: true`.

---

## 7. Design direction

**Personality:** minimal, modern, technical, editorial, research-oriented, distinctive. Confident, not flashy. A researcher's journal crossed with an engineer's portfolio.

**Avoid:**
- generic portfolio templates
- gradients
- purple/blue SaaS palettes
- floating-card grids
- logo walls and skill badges
- gratuitous animation
- AI-generated illustrations
- corporate-consultancy look
- anything resembling a church/ministry site
- the generic dark developer aesthetic; terminal-style interfaces that sacrifice readability
- oversized monograms, random floating cards, excessive rounded corners
- decorative animation without meaning

**Foundation: visual identity reset (Timmy, 4 Nov 2026).** This replaces the original charcoal/off-white proposal. Direction: an experimental, editorial, *computational research* environment. Not a developer-portfolio template, terminal UI or SaaS page.
- **Colour (owner-specified, 4 Nov 2026):**
  - Default theme is **dark**:
    - background `#080B12`
    - main text `#E8EAF0`
    - secondary text `#A1A9B8`
    - grid/borders `#252C3A`
  - Accent: **Electric Cobalt `#6F91FF`** ("confident, precise, energetic").
  - Cobalt is used deliberately, not splashed: active navigation, links, important annotations (footnote markers), interactive states (hover, focus, selection), and selected visualisations (Fig. 1's sum).
  - Status labels, section markers and decorative marks stay neutral.
  - The full-height background column guides use one quieter step (`#171C28`) so they don't compete with the type. All borders and hairlines use `#252C3A`.
  - A light "paper" theme is available through the toggle, with cobalt deepened to `#2A4BD0` for text contrast.
  - Every text colour passes WCAG AA in both themes. Dark: text 16.4:1, secondary 8.3:1, cobalt 6.7:1.
- **Typography:**
  - **Instrument Sans** for interface and all reading text.
  - **Instrument Serif** as selective editorial display, at large sizes only. It no longer sets long reading text.
  - **IBM Plex Mono** for labels, coordinates, data and notation.
  - Mathematical variables are set in italic serif, as in typeset notation. KaTeX is still used for maths in content.
  - Measure ≈ 65–75 characters.
- **Composition: "Manuscript, with figure".** The site borrows the conventions of a typeset research paper:
  - a visible 12-column grid with column indices
  - margin line numbers
  - numbered figures with captions
  - footnotes that carry evidence
  - "Abstract" and "Notes" blocks
  - coordinate annotations (Lagos 6.52° N 3.38° E)
- **Home hero:**
  - The three threads are set as a staircase of display lines: *Engineering, Research, & Creation.*
  - Each line carries its own source signal:
    - Engineering: square wave (Fourier partial sum)
    - Research: Gabor wave packet
    - Creation: frequency modulation
  - **Fig. 1** draws their sum, x(t). This is a deliberate echo of source separation, the subject of the Dechorder thesis.
  - Footnotes give one approved example per thread (FairMoney / HAUV / Xealtha).
  - No portrait card, monogram or decorative underline.
- **Vinculum motif (reinterpreted):**
  - The bar that binds terms is now Fig. 1's sum line, which binds the three threads.
  - It also appears as the short signal-coloured bar over the active navigation item and over section numbers.
  - It is never a brand mark.
- **Figures:**
  - Computational visualisations must be real mathematics and meaningful.
  - They are computed at build time as static SVG, using hairlines (non-scaling 1px strokes).
  - They are never decorative noise and never fabricated research imagery.
- **Layout:**
  - asymmetric 12-column grid
  - text-first sections
  - fine linework instead of cards
  - square corners
  - generous whitespace
  - metadata rails in monospace
- **Imagery:** authentic photos only (plain backgrounds, natural, lightly edited). Until they arrive, nothing stands in for a photo; the typography and figures carry the page.
- **Motion:** small transitions only (nav marker, link colour), none decorative. Respect `prefers-reduced-motion`.
- **Status language:** small monospace labels such as `ACTIVE`, `COMPLETED`, `IN DEVELOPMENT`, `EXPLORATION`, `EXPECTED IMPACT`, consistent across the site.

---

## 8. Voice and copy rules

- **First person** throughout ("I build…").
- Intelligent, clear, direct, curious, human. Simple English, even on complex topics.
- Explain technical concepts for non-specialists. Plain-English summary first, then depth.
- Show competence through specific work, not adjectives. No "passionate", "rockstar", or "world-class".
- Spell out acronyms on first use per page: UAV, MPC, EKF, NMF, STFT, KL, IS, 2PC, NDPA, LLM, DDD, and so on.
- Use British/Nigerian English spelling (optimise, organise, programme) to match the source documents. *Confirm in the spec (O13).*

---

## 9. Accuracy and confidentiality rules (non-negotiable)

1. No fabricated dates, degrees, certifications, awards, talks, publications, results, repos, handles, emails, or photos.
2. Keep completed, ongoing, and exploratory work clearly separate, using status labels.
3. Keep **measured** and **expected** results separate. Expected impact is always labelled.
4. No confidential FairMoney information. No "microservices". No business metrics until cleared.
5. Never present an idea as a launched product or established company.
6. No grades, CGPA, matriculation numbers, school email, or student records.
7. No internal strategy for HAUV or Xealtha: funding, accelerators, grants, build specs, roadmaps, pricing.
8. No collaborator or friend names without consent.
9. HAUV results are simulation-based. Never imply a prototype or field validation.
10. Removed items (Section 3) must not appear anywhere, including metadata, alt text, and comments.

---

## 10. Technical requirements (non-framework-specific)

- **Performance:** static-first, fast on mid-range Android over 3G/4G (Lagos context). Minimal JavaScript. Optimised responsive images. Self-hosted, subset fonts. Target Lighthouse ≥ 95 on all categories.
- **Mobile-first, responsive** down to 320 px.
- **Accessibility:** WCAG 2.2 AA. Semantic HTML, keyboard navigation, visible focus, skip link, alt text, accessible iframe title for the HAUV embed, reduced-motion support.
- **SEO:**
  - per-page title and description
  - canonical URLs
  - sitemap (public entries only)
  - robots.txt
  - Open Graph and Twitter cards with an auto-generated OG image per page
  - `Person` JSON-LD with `name: "Timmy Omolana"`, `alternateName: "Timilehin Omolana"`, `jobTitle`, `alumniOf: University of Lagos`, `address: Lagos, Nigeria`
  - `sameAs` contains only confirmed profiles
  - goal: searching "Timmy Omolana" or "Timilehin Omolana" surfaces the site
- **RSS** for Writing.
- **Light/dark mode** (respect system, allow toggle).
- **Maths rendering:** KaTeX, rendered at build time where possible.
- **Embed:** HAUV explainer as a lazy-loaded, sandboxed iframe with a fallback link.
- **Easy updates:** content-only changes for new entries. A short `CONTENT.md` editing guide for Timmy.
- **Hidden-content preview:** hidden entries visible in local dev only.
- Framework, hosting, domain, analytics, and CI are **left to the implementation spec**. `ABOUT_TIM.md` suggests Astro or Next.js with Markdown content collections. Astro is the planner's suggestion.

---

## 11. Build phases

1. **Foundation:** project setup, design tokens (colour, type, spacing), layout shell, nav, footer, light/dark mode, vinculum motif components.
2. **Content system:** typed collections for all entity types, visibility/metric/consent logic, build-time guardrails (Section 6).
3. **Content entry:** all PUBLISH items from Section 3. HIDDEN items as hidden entries with placeholders.
4. **Pages:** Home, About, Work (+ case studies), Research (+ HAUV with embed, Dechorder), Projects, Ventures, Speaking, Writing (empty state + templates), Contact, 404.
5. **Polish:** diagrams (SVG), typography tuning, motion, accessibility audit, performance pass.
6. **SEO and metadata:** OG images, JSON-LD, sitemap, RSS.
7. **Hand-off:** `CONTENT.md` editing guide, deployment per spec.

**Post-launch content drops** (each is a content-only change): poster PDF (after 4 Nov 2026), GopherCon slides/repo, profile links, photos, CV, Document Intelligence Platform link, cleared metrics, Xealtha milestones/link, and later VI/VIRL, Kawe, and Enquoir.

---

## 12. Acceptance criteria

- Every page renders only PUBLISH content in production. HIDDEN items appear only in dev.
- No removed item appears anywhere in the built output (verified with a text search).
- No FairMoney metric renders until `cleared: true`. Every expected-impact metric carries its badge.
- The word "microservice" does not appear in FairMoney content.
- Adding a new project, talk, role, note, or venture requires only a new content file.
- Lighthouse ≥ 95 (mobile) on Home, Research/HAUV, and Work. Axe shows no serious/critical issues.
- The HAUV page works with the iframe blocked (fallback link visible).
- JSON-LD validates. `sameAs` lists only confirmed URLs.
- First-person voice throughout. Acronyms expanded on first use per page.

---

## 13. Open items (do not invent; render as hidden placeholders)

| ID | Item | Owner |
|---|---|---|
| **O1** | **Conflict: embed vs summary-only.** Q24 says embed the HAUV explainer, but the explainer itself shows build specs (3.4 kg, 22 min, 10 m), a hardware/commercial roadmap, NPA field-trial plans, a risk register, and an "IEEE IROS 2027" target. Q5 and Q6 exclude these from the site. **Default:** build the embed as decided, clearly framed as an external companion, but keep it `hidden` until Timmy confirms he's comfortable with that content showing on his personal site (or edits the explainer). | Timmy |
| O2 | Exact wording for the HAUV results (~3,140 simulations; dwell-time criterion 8–89× above problematic intervals) | Timmy |
| O3 | Full name of MIRG-ICAIR. Poster PDF (after 4 Nov 2026). Co-author Oluwatolamise Odelola's consent to be named. | Timmy |
| O4 | Dechorder: what the delivered code includes (CMake, libsndfile, FFTW3f, Eigen3, overlap-add); stems separated; publishable results; Afrobeat data source; thesis PDF / repo link | Timmy |
| O5 | FairMoney: which metrics are cleared (Q14); preferred team/area wording | Timmy |
| O6 | Document Intelligence Platform: one-line user-facing description and repo link | Timmy |
| O7 | Multi-chain DEX indexing: does code/repo exist, or is it an idea only? Keep or drop? | Timmy |
| O8 | Xealtha: which milestones are public; link | Timmy |
| O9 | What "CACYOF" stands for | Timmy |
| O10 | Graphic design class: where and for whom | Timmy |
| O11 | All profile links and email (incl. confirming `linkedin.com/in/timmyomolana`), MakeUseOf author page, Scholar/ORCID | Timmy |
| O12 | Contact framing: what Timmy is open to (roles, research collaboration, speaking, etc.) | Timmy |
| O13 | Spelling convention (British/Nigerian vs American) | Timmy |
| O14 | Naerospace role title and dates. Whether the UAV metrics (94% / 90% / 15%) can be published. Analytics Intelligence Africa: what "DSCM" stands for. MakeUseOf start date. | Timmy |
| O15 | Photos, CV PDF, OG/headshot assets | Timmy |
| O16 | Approval of the draft hero copy and long bio (Sections 5.1, 5.2) | Timmy |
| O17 | Framework, hosting, domain, analytics, accent colour, fonts | Implementation spec |
