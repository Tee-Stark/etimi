# Tim Omolana --- Personal Website Implementation Specification

**Document type:** Engineering implementation specification\
**Status:** Ready for implementation\
**Source of truth:** `PLAN.md` (agreed 3 November 2026)\
**Implementation decision:** Next.js App Router, TypeScript, file-based
typed Markdown/MDX content\
**Primary objective:** Deliver a fast, accessible, static-first personal
website that can evolve for years without requiring routine code changes
for content updates.

------------------------------------------------------------------------

## 0. Instructions to the coding agent

Implement the website described in this specification. Treat the
supplied `PLAN.md` as the authoritative content and design source. This
document resolves implementation choices but does not grant permission
to invent biographical details, publish hidden material, or override the
plan's explicit exclusions.

### Mandatory working rules

1.  Read `PLAN.md` completely before implementation. Preserve its
    publication statuses, dates, wording constraints, content hierarchy,
    and open items.
2.  Implement in the phases in Section 15. Do not attempt to build every
    page before the content model, visibility rules, and design
    foundation are working.
3.  Use sensible, maintainable defaults where this specification is
    explicit. Do not ask the owner to choose routine implementation
    details.
4.  Do not invent content, links, images, metrics, dates, affiliations,
    collaborators, credentials, or publication information.
5.  Do not expose any item marked `HIDDEN`, `REMOVED`, or unresolved in
    the production build.
6.  Do not turn hidden information into comments, alt text, metadata,
    JSON-LD, source snippets, generated images, RSS entries, search
    indexes, or static HTML.
7.  Keep the implementation simple. This is a personal publishing site,
    not a SaaS platform.
8.  Work iteratively. At the end of each phase, run the relevant checks,
    report what changed, list any blockers, and provide a concise
    verification summary.
9.  Do not silently change the approved information architecture or
    visual direction. If a real conflict is discovered, document it and
    choose the conservative option.
10. Keep all owner-supplied content in content files, not hard-coded
    into page components.

### Definition of a successful first implementation

A visitor can understand who Tim is, browse his engineering work and
research, discover his talks and projects, read about Xealtha, and
contact him when confirmed contact details are supplied. The site works
well on a low-to-mid-range mobile device, is accessible, indexable, and
fast. Tim can add or update content by editing a content file and
deploying, without changing page components.

------------------------------------------------------------------------

# 1. Product scope and principles

## 1.1 Product

Build a personal website for **Timmy Omolana** (full name: **Timilehin
Omolana**), a Lagos-based software engineer and researcher.

The website is a long-term digital home, not a résumé-only site and not
a product landing page. It combines:

-   an engineer's portfolio;
-   a researcher's journal;
-   a record of talks, projects, and community contributions;
-   a personal introduction and contact point.

The site's three organising threads are:

1.  **Engineering** --- building reliable, scalable, useful systems.
2.  **Research** --- investigating difficult problems and their
    mathematical foundations.
3.  **Creation** --- turning ideas into products, experiments, and
    tangible things.

The confirmed positioning line is:

> Engineering at the intersection of mathematics, computation, and
> real-world systems.

Use first person throughout. The voice should be intelligent, direct,
curious, clear, and human. Prefer plain English before technical detail.
Use British/Nigerian English spelling.

## 1.2 Product principles

-   **Static-first:** public pages should be statically generated
    wherever practical.
-   **Content-driven:** content is separate from presentation and lives
    in typed Markdown/MDX files.
-   **Safe by default:** production content is opt-in public, not
    opt-out hidden.
-   **Honest status:** distinguish completed, active, in-development,
    exploratory, measured, and expected work.
-   **Progressive enhancement:** core content and navigation work
    without client-side JavaScript.
-   **Mobile-first:** design and test from 320 px upward, with Lagos
    mobile-network conditions in mind.
-   **Accessible:** target WCAG 2.2 AA.
-   **Portable:** avoid proprietary CMS formats and unnecessary
    framework coupling.
-   **Incremental:** future additions such as photographs, links, PDFs,
    and new ventures should be content/assets changes wherever possible.

## 1.3 Explicitly out of scope for the first release

Do not build:

-   a database-backed CMS or admin dashboard;
-   user accounts, public registration, comments, likes, or
    subscriptions;
-   a contact form unless separately approved;
-   a separate Go API/backend;
-   microservices, queues, Redis, Kubernetes, or other unnecessary
    infrastructure;
-   a client-side SPA for the public website;
-   analytics until the owner chooses a provider and approves the
    privacy implications;
-   a public search feature unless it can be delivered simply and
    without indexing hidden content;
-   any of the items marked REMOVED in `PLAN.md`.

The content system must be designed so a future authenticated editing
interface could be added without replacing the content domain model.
That is a future extension, not a first-release deliverable.

------------------------------------------------------------------------

# 2. Technology decisions

## 2.1 Selected stack

  -----------------------------------------------------------------------
  Concern                             Decision
  ----------------------------------- -----------------------------------
  Framework                           Next.js App Router

  Language                            TypeScript, strict mode

  Runtime                             Node.js LTS supported by the
                                      selected Next.js release

  Package manager                     pnpm

  Styling                             Tailwind CSS

  UI                                  Custom semantic components; use a
                                      component library only where it
                                      materially helps

  Content                             Markdown/MDX files with typed YAML
                                      frontmatter

  Content validation                  Zod

  Markdown/MDX processing             Unified/remark/rehype ecosystem or
                                      a well-maintained Next-compatible
                                      content loader

  Database                            None in v1

  Maths                               KaTeX

  Icons                               Small, consistent icon set; avoid
                                      icon-heavy UI

  Testing                             Vitest for unit/content tests;
                                      Playwright for critical browser
                                      flows

  Accessibility checks                axe-core integration and manual
                                      keyboard checks

  Deployment                          Vercel preferred for the initial
                                      Next.js deployment; keep build
                                      portable

  Version control                     Git; content updates are commits

  Images/files                        Repository assets for initial small
                                      set; external object storage can be
                                      introduced when uploads become
                                      necessary
  -----------------------------------------------------------------------

Use currently supported stable package versions at project creation. Do
not pin obsolete versions from examples or install unnecessary packages.
Commit the lockfile.

## 2.2 Why Next.js

The site needs editorial page layouts, static rendering, rich
typography, research pages, SEO metadata, and room for future
interactive features. Next.js provides a strong React-based rendering
and routing model while allowing the public pages to remain mostly
server-rendered/static.

Do not interpret the choice of Next.js as a requirement to make
everything dynamic. Prefer server components and static generation.
Client components are reserved for genuinely interactive elements such
as the theme toggle, mobile navigation, and any future interactive UI.

## 2.3 Rendering model

Use static generation for public content pages.

-   Home, About, indexes, case studies, talk pages, venture pages, and
    published notes should be generated at build time.
-   Dynamic route parameters must be derived only from validated public
    content.
-   Admin-like or private functionality does not exist in v1.
-   No database or request-time content fetch is required.
-   The HAUV external explainer iframe must be lazy-loaded and must not
    delay the initial page render.

If Next.js static export is compatible with the selected deployment and
all required features, it may be considered. Do not force static export
if it complicates metadata, feeds, or the chosen deployment. The default
is Next.js static generation with a normal production build.

------------------------------------------------------------------------

# 3. Repository and application structure

Use a modular structure that separates route composition, reusable UI,
content schemas, content data, and content-processing logic.

Suggested structure:

``` text
tim-personal-site/
├── public/
│   ├── fonts/
│   ├── images/
│   │   ├── placeholders/
│   │   ├── research/
│   │   └── projects/
│   ├── diagrams/
│   ├── documents/
│   └── favicon/
├── content/
│   ├── site/
│   │   └── profile.md
│   ├── roles/
│   ├── case-studies/
│   ├── research/
│   ├── projects/
│   ├── ventures/
│   ├── talks/
│   ├── notes/
│   ├── publications/
│   └── community/
├── src/
│   ├── app/
│   │   ├── (site)/
│   │   │   ├── page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── work/page.tsx
│   │   │   ├── work/[slug]/page.tsx
│   │   │   ├── research/page.tsx
│   │   │   ├── research/[slug]/page.tsx
│   │   │   ├── projects/page.tsx
│   │   │   ├── ventures/page.tsx
│   │   │   ├── speaking/page.tsx
│   │   │   ├── writing/page.tsx
│   │   │   ├── writing/[slug]/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── not-found.tsx
│   │   │   └── layout.tsx
│   │   ├── feed.xml/route.ts
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── opengraph-image.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── typography/
│   │   ├── content/
│   │   ├── research/
│   │   ├── work/
│   │   ├── speaking/
│   │   ├── theme/
│   │   └── seo/
│   ├── content/
│   │   ├── collections.ts
│   │   ├── schemas/
│   │   ├── loader.ts
│   │   ├── visibility.ts
│   │   ├── metrics.ts
│   │   ├── links.ts
│   │   └── validation.ts
│   ├── lib/
│   │   ├── metadata.ts
│   │   ├── markdown.ts
│   │   ├── dates.ts
│   │   ├── reading-time.ts
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── scripts/
│   ├── validate-content.ts
│   ├── check-banned-content.ts
│   └── check-build-output.ts
├── tests/
│   ├── content/
│   ├── components/
│   └── e2e/
├── CONTENT.md
├── PLAN.md
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
└── README.md
```

The exact directory names may be adjusted to fit current Next.js
conventions, but preserve these boundaries:

-   `content/`: authored content only.
-   `src/content/`: schemas, loaders, validation, and policy.
-   `src/app/`: route-level composition.
-   `src/components/`: reusable presentation.
-   `scripts/`: build-time guardrails.
-   `tests/`: tests.
-   `public/`: static assets.

Avoid placing all content in a single large TypeScript file or embedding
long biographies in JSX.

------------------------------------------------------------------------

# 4. Content system

## 4.1 File-based content is the source of truth

Every content entity is one Markdown or MDX file with typed YAML
frontmatter. Adding a role, project, research item, talk, note,
publication, community entry, or venture must not require a
page-component change.

Use `.mdx` where a page needs rich authored content such as figures,
equations, callouts, or embedded content. Use `.md` for simpler entries.
Do not allow arbitrary executable MDX in user-editable database fields;
content is trusted, reviewed source code in this repository.

The content loader must:

1.  Read files from known collection directories.
2.  Parse frontmatter and body.
3.  Validate frontmatter against a collection-specific Zod schema.
4.  attach a stable content identifier and source path for diagnostics.
5.  apply publication visibility policy.
6.  return typed, sorted collections to routes.
7.  fail the production build for invalid public content.

Do not use filesystem access from client components.

## 4.2 Common frontmatter

Every entity should have the following common fields where applicable:

``` yaml
title: "Human-readable title"
slug: "stable-url-slug"
summary: "One plain-English sentence describing the item."
visibility: public # public | hidden
status: active # shipped | active | in-development | completed | exploration | archived
tags: []
threads: [] # engineering | research | creation
featured: false
order: 100
updated: "2026-11-04"
```

Schema rules:

-   `title`, `slug`, and `summary` are required.
-   `visibility` is required and must be explicitly set.
-   `status` must be a valid enum.
-   `threads` must be a subset of the allowed values.
-   `updated` must be a valid ISO date.
-   Slugs must be unique within a route collection and safe for URLs.
-   `order` controls deliberate ordering where specified; date sorting
    is used where the page explicitly requires reverse chronology.
-   `featured` defaults to false only if the schema explicitly applies
    that default.
-   Unknown frontmatter keys should be rejected or reported, not
    silently ignored.

Do not impose fields that are not relevant to every entity. Use shared
base schemas and collection-specific extensions.

## 4.3 Collections and schemas

Implement schemas for:

### `site` singleton

Fields: - `name` - `fullName` - `title` - `positioning` - `location` -
`profiles[]`: `{ label, url, visibility }` - `email`
(visibility-aware) - `cv` (visibility-aware)

Only confirmed profile links and contact information may render. A
hidden URL must not be emitted into the page source.

### `role`

Fields: - `organisation` - `orgNote` (e.g. "drones department of Nord
Motion") - `title` - `start` - `end` - `location` - `mode` - `summary` -
`highlights[]`

Date semantics must distinguish: - `end: null`: role is
current/present. - `end` omitted: end date is unknown. - `start`
omitted: start date is unknown.

Unknown dates must not be guessed or rendered as fabricated
placeholders.

### `caseStudy`

Fields: - `role` reference (optional) - `problem` - `approach` -
`outcome` - `metrics[]` - `confidentialityNote`

### `research`

Fields: - `affiliation` - `collaborators[]`: `{ name, consent }` -
`publications[]` - `updates[]`: `{ date, title, summary }` - `embeds[]`:
`{ url, title, visibility, sandbox }` - `links[]`:
`{ label, url, visibility }` - body sections for the seven-part research
case-study structure.

Collaborator names render only when `consent: true`.

### `project`

Fields: - `repo` as a visibility-aware link - `stack[]` - `links[]`

### `venture`

Fields: - `stage` - `stack[]` - `milestones[]`, each with its own
`visibility` - `links[]`

### `talk`

Fields: - `event` - `location` - `date` - `format`: `talk` or `poster` -
`abstract` - `links`: slides, video, repo, PDF; each visibility-aware.

### `note`

Fields: - `date` - `readingTime` (may be calculated at build time) -
`tags` - `draft` or publication state - optional `toc` configuration.

### `publication`

Fields: - `outlet` - `period` - `url` with visibility.

### `community`

Fields: - `organisation` - `role` - `period` - `description`

### `Metric`

Use this exact conceptual shape:

``` yaml
metrics:
  - label: "Loan details endpoint response time"
    value: ">12 s → <100 ms"
    kind: measured # measured | expected
    cleared: false
    note: ""
```

Rules: - `kind: expected` must always display an "Expected impact" label
when published. - `cleared: false` must never render in production. - A
metric must not be made public merely because its parent entry is
public. - No metric may appear in page metadata, structured data, RSS,
search data, or generated OG images unless it passes the same policy. -
For FairMoney, metrics remain hidden unless `cleared: true`.

## 4.4 Visibility model

Visibility is a security/content-publication rule, not a visual
preference.

Production: - Only `visibility: public` content is loaded into public
page data. - Hidden items are excluded from HTML, RSC payloads, static
params, metadata, sitemap, RSS, OG images, search indexes, and generated
navigation. - Hidden child objects (metrics, links, milestones,
collaborators, embeds) are filtered independently. - Entries with
unresolved required facts must remain hidden. - Removed content must not
be entered into the content repository.

Development: - Hidden entries may be previewed locally, but only through
a deliberate development-only preview mechanism. - Show a clear
`HIDDEN — DEVELOPMENT ONLY` banner. - Do not expose hidden content
through a public route or dev server bound to a public network. -
Production preview builds must follow production visibility rules.

Prefer an explicit `getPublicCollection()` API for route use. If a
development preview API is provided, name it clearly and ensure it
cannot be imported by production page code accidentally.

## 4.5 Draft and publication states

For notes, use an explicit publication state, such as `draft: true` or a
`published` boolean/date. A draft note is never included in production
output, RSS, sitemap, or OG metadata. Do not infer publication from the
existence of a file.

An empty Writing index is intentional and must show the honest empty
state from `PLAN.md`. Do not create sample posts or "coming soon"
article titles.

## 4.6 Content references

References between entities must be validated at build time. A
`caseStudy.role` reference must resolve to an existing role. Links to
internal content must resolve to an actual public route. Avoid fragile
references based only on display titles; use stable slugs.

------------------------------------------------------------------------

# 5. Required build-time guardrails

Implement guardrails before entering the full content inventory. The
build must fail clearly and early when a rule is violated.

## 5.1 Required checks

1.  Production build fails if any public entry contains `[CONFIRM]`,
    `TODO`, or an empty required field.
2.  Production build fails if a public page links to a profile or URL
    whose visibility is `hidden`.
3.  A check fails on banned phrases in FairMoney content:
    -   `microservice` (case-insensitive).
    -   any percentage presented as a cost-reduction claim.
4.  Collaborator names render only if `consent: true`.
5.  Metrics render only if `cleared: true`.
6.  Expected metrics always have the `Expected impact` label.
7.  Hidden entries are absent from production build output.
8.  Removed items from `PLAN.md` must not appear in content, generated
    output, metadata, comments, alt text, or source-controlled content.
9.  Slugs are unique.
10. Internal references resolve.
11. Public external links use valid URL syntax and safe protocols
    (`https:` preferred; `mailto:` only for confirmed email).
12. Public content does not include hidden URLs in any serialized data.

## 5.2 FairMoney cost percentage check

The check should detect percentage claims associated with cost
reduction, storage cost, infrastructure spend, or bill reduction in
FairMoney content. Avoid an overbroad rule that rejects unrelated
percentages in all contexts. The rule should report the exact file and
offending line/text.

## 5.3 Removed-content verification

Maintain a test list derived from the REMOVED items in `PLAN.md`,
including: - Celcic Media; - Octave internship; - APIConf talk "Covering
Grounds"; - "Revealers of God's Glory"; - Bees Foraging Algorithm; -
antimicrobial resistance modelling; - eBPF anomaly detection; - removed
venture/concept references: Vinculum Implexa, VIRL, VI Industries,
Kawe/Kawe Hub, Enquoir; - removed personal content or claims specified
by the plan.

Be careful: a banned-term check should not accidentally reject this
implementation specification or `PLAN.md` itself. Run it against
publishable content and built public output, with narrowly scoped
exceptions for test fixtures and internal documentation. Removed terms
must not leak into production.

## 5.4 Build scripts

Expose scripts such as:

``` json
{
  "scripts": {
    "dev": "next dev",
    "build": "pnpm content:validate && next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "content:validate": "tsx scripts/validate-content.ts",
    "content:check-banned": "tsx scripts/check-banned-content.ts",
    "content:check-output": "tsx scripts/check-build-output.ts"
  }
}
```

Adapt commands to the selected current tool versions. `build` must run
content validation and banned-content checks before Next.js compilation,
and output verification after build where practical (for example via a
wrapper script).

------------------------------------------------------------------------

# 6. Design system

## 6.1 Visual direction

The design is minimal, modern, technical, editorial, research-oriented,
and distinctive. It should feel like a researcher's journal crossed with
an engineer's portfolio.

Avoid: - generic portfolio templates; - gradients; - purple/blue SaaS
palettes; - floating-card grids; - logo walls and skill badges; -
gratuitous animation; - AI-generated illustrations; - corporate
consultancy styling; - church/ministry visual styling.

## 6.2 Colour

Use a restrained palette: - charcoal: approximately `#141414`; - warm
off-white: approximately `#F5F3EE`; - one restrained accent,
provisionally deep signal-orange or oxide red.

Choose one accent during the foundation phase and record it in design
tokens. Do not use both as competing accents. Validate contrast in light
and dark themes; adjust token values as needed to meet WCAG AA.

Provide semantic tokens, not scattered literal colours: -
`--background` - `--foreground` - `--muted` - `--muted-foreground` -
`--border` - `--accent` - `--accent-foreground` - `--surface` -
`--focus-ring`

Dark mode must invert sensibly and preserve readable contrast.

## 6.3 Typography

Use three roles: - editorial serif for headings and long reading; -
clean sans-serif for UI and body copy; - monospace for metadata, dates,
status labels, technical callouts.

Self-host fonts where licensing permits. Subset fonts and preload only
the critical weights. Avoid excessive font families and weights.

Target a comfortable long-form measure of approximately 65--75
characters per line. Use a clear responsive type scale.

## 6.4 Vinculum motif

Use the mathematical vinculum as a quiet typographic signature: -
section rules; - overlines or short rules near section headings; -
active navigation indicators; - subtle links between the three threads.

It must remain a typographic motif, not a corporate VI logo or an
introduction of the excluded venture.

## 6.5 Layout and components

-   Generous whitespace.
-   Editorial asymmetric grid where useful.
-   Text-first sections, not piles of cards.
-   Numbered sections and paper-like figure captions.
-   Metadata rails in monospace: date · status · affiliation · stack.
-   Cards only where they improve scanning or grouping.
-   Consistent content width and vertical rhythm.
-   Responsive layout from 320 px.
-   No horizontal overflow at any supported viewport.

## 6.6 Motion

Keep motion subtle: - link underline transitions; - restrained
fade/translate on route changes if it does not impair performance; - no
scroll-jacking or large parallax effects.

Respect `prefers-reduced-motion`. Core navigation and content must
remain fully usable with motion disabled.

## 6.7 Status labels

Use consistent, compact monospace labels: - `ACTIVE` - `COMPLETED` -
`IN DEVELOPMENT` - `EXPLORATION` - `EXPECTED IMPACT`

Do not use colour alone to communicate status.

------------------------------------------------------------------------

# 7. Global layout and navigation

## 7.1 Primary navigation

Primary navigation: - Work - Research - Projects - Ventures - Speaking -
Writing - About - Contact

Home is represented by the name/wordmark.

If the navigation becomes crowded at tablet widths, group Projects and
Ventures under a single "Explore" item, but preserve direct access and
keyboard usability. On mobile, use a compact accessible menu.

## 7.2 Header

-   Name/wordmark links to `/`.
-   Primary nav is keyboard accessible.
-   Active page is clearly indicated.
-   Theme toggle is available and labelled accessibly.
-   Mobile menu uses a real button with `aria-expanded` and
    `aria-controls`.
-   Avoid sticky header unless it remains unobtrusive and does not
    consume excessive mobile viewport height.

## 7.3 Footer

Include: - wordmark/name; - a short positioning phrase; - confirmed
profile links only; - copyright year generated dynamically; - links to
core sections.

Do not display empty social icons or dead links.

## 7.4 Skip link

Provide a visible-on-focus "Skip to content" link as the first
interactive element.

------------------------------------------------------------------------

# 8. Page specifications

All pages use first person. On every page, spell out an acronym on first
use on that page. Every project/talk card begins with a one-sentence
plain-English summary before technical detail.

## 8.1 Home `/`

Sections, in this order:

1.  **Hero**
    -   Display name: Timmy Omolana.
    -   Title: Software engineer & researcher.
    -   Positioning: "Engineering at the intersection of mathematics,
        computation, and real-world systems."
    -   Supporting copy from `PLAN.md` Section 5.1, subject to owner
        approval. Do not invent replacement copy.
    -   CTAs: "Explore my work" → `/work`; "Get in touch" → `/contact`.
    -   Until a real photo is supplied, use a neutral typographic
        placeholder, not stock or generated imagery.
2.  **Three threads**
    -   Engineering → best public FairMoney work item.
    -   Research → HAUV.
    -   Creation → Xealtha.
    -   One sentence each and a relevant link.
3.  **Current research**
    -   HAUV highlight.
    -   Correct MIRG-ICAIR status: before 4 November 2026, "poster
        accepted"; from 4 November 2026 onward, "poster presented".
        Since the implementation may occur after that date, verify
        current date/status and use "poster presented" only if the
        presentation has occurred. Do not imply acceptance of a journal
        or target conference.
4.  **Selected work**
    -   3--4 items across engineering, research, and projects.
    -   Use one-sentence plain-English summaries.
    -   Respect all visibility and metric rules.
5.  **Experience at a glance**
    -   FairMoney → Analytics Intelligence Africa → Naerospace/Nord
        Motion.
    -   MakeUseOf may appear in the About or publication context as past
        writing, but does not need to be part of the primary engineering
        sequence.
6.  **Short introduction**
    -   A short first-person excerpt linking to `/about`.
7.  **Speaking highlight**
    -   "The Gopher's Trident", GopherCon Africa 2026.
8.  **Confirmed profile links**
    -   Render only when the URL is confirmed and public.

## 8.2 About `/about`

Include: - first-person long biography (draft in `PLAN.md` requires
owner approval; use as supplied, do not silently rewrite its claims); -
B.Sc. Industrial Mathematics (Computer Option), University of Lagos,
graduated August 2026; - Dechorder thesis link; - philosophy of
connecting mathematics, engineering, algorithms, audio/music, reliable
systems, modelling, and software; - interests; - beyond engineering:
pianist, choir leadership, teaching and mentorship; - skills grouped by
domain, without proficiency percentages or progress bars; - neutral
typographic photo placeholder; - CV download hidden until supplied.

Do not mention graduate-study goals. Quantum computing and control &
systems engineering are interests only. Do not include grades, class of
degree, matriculation number, or school email.

Skills must use the combined list in `PLAN.md` Section 3.11. Go is
primary. Rust carries one "Learning" marker. Do not assign arbitrary
proficiency ratings.

## 8.3 Work `/work`

### Experience timeline

-   FairMoney --- Software Engineer, Remote, November 2024--present.
-   Analytics Intelligence Africa --- Backend Engineer,
    September--October 2024.
-   Naerospace (drones department of Nord Motion) --- Software
    Engineering; dates and exact title unknown, so omit date and do not
    invent title details.
-   MakeUseOf --- Writer, until 2023; start date unknown. Describe as a
    past writing role/publication.

Unknown dates must be omitted, not replaced with estimated dates.

### Selected engineering case studies

Order: 1. Loan details API performance (N+1 query). 2. Stale data
cleanup. 3. Bank statement processing (Go, AWS, Temporal). 4. UAV
real-time video streaming (RTSP to WebRTC, Go). 5. Credit intelligence
in loan decisioning (expected-impact distinction).

Each case study follows: - context; - problem; - approach; - what I
did; - outcome; - what I learned; - confidentiality note where relevant.

Metrics: - FairMoney metrics are hidden until explicitly cleared. - The
credit intelligence result is expected, not measured, and must say so. -
Do not state FairMoney business-volume figures. - Do not use
"microservices" or "microservice". - Never state a percentage cost
reduction.

Include a compact "Other work" list using the qualitative items in
`PLAN.md` Section 3.2.

## 8.4 Work case study `/work/[slug]`

Create a reusable template. It must: - render the one-sentence summary
first; - show relevant organisation/role metadata only when public; -
display content sections in a clear editorial hierarchy; - filter
metrics and links using policy functions; - show confidentiality
notes; - avoid exposing employer-sensitive details; - include related
work links only when valid.

## 8.5 Research `/research`

Index only: - HAUV --- active research. - Dechorder --- completed and
defended B.Sc. thesis, with future work clearly separated.

Do not include AMR, Bees Foraging Algorithm, or eBPF anomaly detection.

## 8.6 HAUV `/research/hauv`

Use the seven-part research structure: 1. The problem. 2. Why it is
interesting. 3. Underlying mathematics/engineering. 4. Approach. 5.
Implementation. 6. Results and findings. 7. Future directions.

Public content: - Title: "Autonomous Hull Screening for Nigerian Ports:
Stable Air--Water Transition for a Hybrid Aerial-Underwater Vehicle." -
Status: active research. - Affiliation: University of Lagos. - HAUV
means Hybrid Aerial-Underwater Vehicle. - Plain-English explanation: a
small autonomous vehicle that can fly to a ship, inspect the hull from
the air, enter the water, inspect below the waterline, and return. The
research question is how to keep it stable while crossing the air--water
boundary. - Motivation, using only the facts and scope in `PLAN.md`
Section 3.4A. - Theory: Fossen marine-vehicle hydrodynamics; hybrid
dynamical systems with aerial, transition, and underwater modes; Model
Predictive Control (MPC) as a research direction; Extended Kalman Filter
(EKF) state estimation. - Contribution: stability of translational
(heave) dynamics across the air--water transition; nonlinear three-zone
model; quadratic drag; added mass scaling with submergence; stability
under an explicit dwell-time condition. - Explain dwell-time condition
in plain English: a minimum time the controller must remain in a mode
before switching again. - State clearly that the findings are
simulation-based and not field-validated.

Do not publish until owner supplies/approves: - exact results wording
(\~3,140 simulations; 8--89× dwell-time comparison); - full conference
name; - poster PDF; - collaborator name/consent; - any material
identified as hidden in `PLAN.md`.

### HAUV explainer conflict --- mandatory safe default

`PLAN.md` Q24 requests an embedded explainer, but Open Item O1 says the
external explainer contains material excluded by the summary-only and
no-roadmap rules. Therefore:

-   Implement the embed component and its layout.
-   Store its URL and visibility as content data.
-   Set the embed visibility to `hidden` by default.
-   Do not render the iframe in production until Tim explicitly confirms
    the external page is safe to show or updates that page.
-   In development, it may be previewed with a visible hidden-content
    banner.
-   When enabled, use a lazy-loaded iframe, meaningful `title`,
    restrictive `sandbox` permissions appropriate to the actual
    explainer, `referrerPolicy`, a short external-companion explanation,
    and an "Open in new tab" fallback link.
-   The page must remain complete and understandable when the iframe is
    blocked or disabled.

Do not reproduce build specifications, hardware roadmap, NPA field-trial
plans, risk register, funding/commercial plans, or target venues on the
personal site.

## 8.7 Dechorder `/research/dechorder`

Status: completed and defended B.Sc. thesis (2026).

Plain-English summary: splitting a mixed music recording into its parts,
tuned to the sound of African music, using mathematical matrix
factorisation rather than a black-box model.

Confirmed method: - Non-negative Matrix Factorisation (NMF). -
Comparison of Euclidean, Kullback--Leibler (KL), and Itakura--Saito (IS)
divergences. - Tested on Afrobeat material and the MUSDB18 benchmark. -
Implemented in C++20.

Explain: - Short-Time Fourier Transform (STFT) and spectrograms; - why
non-negativity matters; - what the divergences measure; - reconstruction
back to audio.

Future work, explicitly labelled: - music recommendation built on
separated components; - further optimisation for traditional African
instrumentation and recording conditions.

Do not claim unconfirmed libraries, build tooling, stem outputs,
publishable results, data provenance, or repository/PDF availability.
Those details remain pending.

Cross-link to the music section of About.

## 8.8 Projects `/projects`

Publish: 1. **Document Intelligence Platform** - Personal GitHub
project. - Confirmed stack: Go, Domain-Driven Design (DDD), pgx, asynq,
Redis-backed job queue. - User-facing description and repository link
are pending. Build the content entry as hidden until a meaningful
approved description exists; do not invent a description.

2.  **Multi-chain DEX indexing**
    -   Publish only as an exploration.
    -   Describe the exploration as direct indexing of protocols across
        EVM-compatible networks using Rust, without relying on
        subgraphs/substreams.
    -   Do not imply that code or a working repository exists. O7
        remains open.

Do not include agentic financial infrastructure or other removed
explorations.

## 8.9 Ventures `/ventures`

Only Xealtha is public at launch.

Xealtha: - Status: `IN DEVELOPMENT`. - Plain-English description:
healthcare triage over WhatsApp for Nigeria. A patient describes
symptoms; AI gathers and summarises them for a doctor. - "One platform,
two front doors": doctors can share a booking link, and AI pre-fills the
symptom intake. - Privacy-first: consultations happen in-app; doctors
and patients do not exchange personal contact details. - In development:
multilingual support (Nigerian languages including Pidgin) and
voice/call-based triage. - Stack: Go, PostgreSQL, Redis, asynq, Llama
3.3 70B via Groq.

Do not publish: - incubator acceptance; - NDPA 2023 compliance claims; -
WhatsApp Business API live approval; - incubator name; - Xealtha URL; -
funding, pricing, internal strategy, or roadmap beyond the explicitly
approved description.

The content model must allow future venture entries without code
changes, but do not add excluded ventures now.

## 8.10 Speaking `/speaking`

Reverse chronological order:

1.  **"The Gopher's Trident"** --- GopherCon Africa 2026, Nairobi,
    October 2026.
    -   Delivered.
    -   Topic: distributed transactions without two-phase commit (2PC),
        orchestrating the Saga pattern in Go with Temporal and
        deterministic design.
    -   Fintech loan-disbursement case study and live demo.
    -   Themes: idempotency, deterministic workflow execution, workflow
        IDs, business keys.
    -   Slides and repository links hidden until supplied.
2.  **MIRG-ICAIR 2026 poster** --- University of Lagos.
    -   Cross-listed with HAUV.
    -   Status depends on event date; after 4 November 2026, mark
        presented only if confirmed.
    -   Full conference name and PDF pending.
3.  **"Beyond CRUD: What Real-World Backend Engineering Looks Like"**
    --- DevFest Lagos 2024.
    -   Student-focused talk about backend engineering beyond basic APIs
        and CRUD.
    -   Include backend engineering volunteer role if useful.

Each entry should support title, event, location, date, format,
abstract, and visibility-aware links (slides/video/repo/PDF). Do not
render empty links.

Also provide a concise speaker-bio/press-kit area. Headshot download
remains hidden until a real asset is supplied.

Do not include the removed APIConf talk.

## 8.11 Writing `/writing`

Launch with zero original posts.

Show the honest empty state: \> Notes and essays will appear here.

Add a "Previously" section: \> Previously wrote for MakeUseOf (until
2023).

MakeUseOf author-page link is hidden until supplied.

Do not turn the internal topic backlog into visible article titles or
"coming soon" items.

### Note detail template `/writing/[slug]`

Build the template even though there are no published posts. Support: -
long-form typography; - code blocks with accessible horizontal
scrolling; - KaTeX maths; - figures and captions; - footnotes; - table
of contents; - reading time; - tags; - publication and updated dates; -
canonical URL and social metadata.

Only public, non-draft notes appear in production.

### RSS

Generate an RSS 2.0 feed from public, published notes only. Empty feed
is valid. Do not include drafts or hidden entries. Use absolute
canonical URLs and correct publication dates.

## 8.12 Contact `/contact`

Use a concise invitation. The precise invitation wording is pending
(O12).

Until email/profile links are supplied: - do not show guessed contact
details; - do not show empty social icons; - show a neutral statement
that contact details will be added, or keep the relevant contact
channels absent; - do not build a contact form in v1.

## 8.13 404

Create a designed but restrained not-found page with a clear link home.
It must not expose hidden route names or suggest hidden content exists.

------------------------------------------------------------------------

# 9. SEO, metadata, structured data, and feeds

## 9.1 Metadata

Every public route must have: - unique page title; - concise
description; - canonical URL; - Open Graph metadata; - Twitter/X card
metadata.

Do not include hidden facts in metadata or generated social images.

Use a central metadata helper to avoid inconsistent titles/descriptions.

## 9.2 Canonical origin

Use one environment variable, for example `NEXT_PUBLIC_SITE_URL`, for
the canonical site origin. Validate it during production build. Do not
hard-code a guessed domain.

If the production domain is not yet known, use a clearly documented
deployment placeholder in local development and require the real origin
before production deployment.

## 9.3 Sitemap and robots

-   Generate sitemap from public routes and public content only.
-   Exclude hidden and draft entries.
-   Include only canonical URLs.
-   Provide `robots.txt`.
-   Do not use robots exclusion as a substitute for withholding hidden
    content from the build.

## 9.4 Open Graph images

Generate a consistent editorial OG image per public page using the page
title, site name, and restrained design tokens.

Rules: - no hidden metric or content; - no fabricated headshot; - no
external image dependency; - readable at social preview sizes; - use the
same typography and visual language as the site.

## 9.5 Person JSON-LD

Add `Person` structured data with: - `name`: "Tim Omolana" -
`alternateName`: "Timilehin Omolana" - `jobTitle`: "Software engineer
and researcher" - `alumniOf`: University of Lagos - `address`: Lagos,
Nigeria - `sameAs`: confirmed public profile URLs only.

Validate the JSON-LD. Do not include hidden URLs or unconfirmed
affiliations.

## 9.6 Search engine identity

Optimise page titles and structured data for "Tim Omolana" and
"Timilehin Omolana". Do not promise a search ranking. Use consistent
naming across metadata and visible copy.

------------------------------------------------------------------------

# 10. Accessibility requirements

Target WCAG 2.2 AA.

Required: - semantic landmarks (`header`, `nav`, `main`, `footer`); -
skip link; - correct heading hierarchy; - keyboard-operable navigation
and controls; - visible focus indicators; - accessible theme toggle; -
sufficient colour contrast in light and dark modes; - meaningful alt
text for informative images; - empty alt for decorative images; -
captions and descriptions for research figures; - iframe title and
fallback; - reduced-motion support; - accessible status labels that do
not rely on colour alone; - form controls only if a form is added in a
later approved phase; - no keyboard traps; - no hover-only
information; - no horizontal overflow at 320 px.

Automated axe checks are necessary but not sufficient. Perform manual
keyboard navigation and inspect at least one screen-reader flow for the
primary navigation and long-form article.

------------------------------------------------------------------------

# 11. Performance requirements

Target Lighthouse scores of at least 95 on mobile for Home,
Research/HAUV, and Work, subject to the test environment.

Implementation: - server components by default; - minimise client
JavaScript; - use responsive image sizes and modern formats; -
self-host/subset fonts; - avoid third-party scripts; - lazy-load
below-the-fold images and the HAUV iframe; - reserve image/iframe
dimensions to avoid layout shift; - avoid heavy animation libraries; -
use static generation and caching; - keep content pages usable if
JavaScript fails.

Test on mobile viewport and throttle network/CPU to approximate a
mid-range Android device on a constrained 3G/4G connection.

Do not sacrifice accessibility or readability to chase a Lighthouse
score.

------------------------------------------------------------------------

# 12. Security and privacy

Even without a CMS, follow secure defaults:

-   No secrets in client bundles or repository.
-   No unnecessary third-party trackers.
-   Validate all external URLs and allow only safe schemes.
-   Use `rel="noopener noreferrer"` for external links opened in a new
    tab.
-   Restrict iframe permissions to the minimum required.
-   Avoid exposing hidden content in serialized page props or RSC
    payloads.
-   Do not include private personal details.
-   Do not expose employer source code, architecture diagrams, customer
    data, or internal identifiers.
-   Do not use a contact form in v1.
-   Configure security headers where compatible with the deployment. Do
    not break the approved HAUV iframe if/when it is enabled; keep the
    iframe hidden by default until owner approval.

------------------------------------------------------------------------

# 13. Content inventory to enter

Use `PLAN.md` Section 3 as the exact inventory and source for content.
Enter the confirmed public items and preserve hidden states. Do not
duplicate facts inconsistently across files; use references or a single
source of truth where possible.

At minimum, create content entries for:

### Site and identity

-   Timmy Omolana / Timilehin Omolana.
-   Lagos, Nigeria.
-   Software engineer & researcher.
-   Confirmed positioning line.
-   Profile links as hidden placeholders only; no guessed URLs.

### Roles

-   FairMoney --- Software Engineer, Remote, November 2024--present.
-   Analytics Intelligence Africa --- Backend Engineer,
    September--October 2024.
-   Naerospace (drones department of Nord Motion) --- role/date details
    incomplete; publish only the approved description, omit unknown
    dates/title specifics.
-   MakeUseOf --- past writer, until 2023; start date and author URL
    hidden.

### FairMoney case studies

-   Loan details API performance (metric hidden).
-   Stale data cleanup (metrics hidden).
-   Bank statement processing.
-   Credit intelligence in loan decisioning (expected metric hidden).
-   Scoring latency.
-   Loan offer generation.
-   Other work list.

### Education

-   B.Sc. Industrial Mathematics (Computer Option), University of Lagos,
    graduated August 2026.
-   Dechorder thesis.

### Research

-   HAUV (results and explainer embed hidden as described).
-   Dechorder (completed thesis; future work labelled).

### Projects

-   Document Intelligence Platform: hidden until approved user-facing
    description exists; stack may be stored but must not be used to
    imply a public product description.
-   Multi-chain DEX indexing: exploration only, with no claim of a
    working implementation.

### Venture

-   Xealtha only, in development, using approved public description and
    stack.
-   Milestones and URL hidden.

### Speaking

-   The Gopher's Trident --- GopherCon Africa 2026.
-   MIRG-ICAIR 2026 poster.
-   Beyond CRUD --- DevFest Lagos 2024.

### Community and music

-   Music Director & Unit Head, The Fulfilled Minstrels, 2025/2026
    session.
-   Pianist.
-   CACYOF Skill-Up 2026 (CSU 2.0).
-   IEEE Computer Society × GitHub Campus Experts 10-day Backend
    Buildathon.
-   Graphic design class (generic description only).
-   Music/audio connection to Dechorder.

### Writing

-   Empty public notes collection.
-   MakeUseOf past publication entry.

### Interests and skills

Use the exact combined lists in `PLAN.md` Sections 3.10 and 3.11. Go is
primary; Rust is learning. No proficiency percentages.

------------------------------------------------------------------------

# 14. Open items and safe defaults

The following remain unresolved in `PLAN.md`. Do not invent answers.

  -------------------------------------------------------------------------------------
  Item                                              Safe implementation default
  ------------------------------------------------- -----------------------------------
  HAUV external explainer contains excluded         Implement embed component, but keep
  material                                          embed hidden in production pending
                                                    owner approval

  Exact HAUV results wording                        Omit results until supplied

  Full MIRG-ICAIR name and poster PDF               Use acronym only; omit PDF

  Co-author permission                              Do not name collaborator

  Dechorder delivered-code details and links        Publish only confirmed method and
                                                    language

  FairMoney metrics                                 Keep all metrics hidden until
                                                    individually cleared

  Document Intelligence Platform description/repo   Keep project hidden until
                                                    description approved

  DEX code/repo status                              Label exploration; no claim that
                                                    code exists

  Xealtha milestones/link                           Omit

  CACYOF full name                                  Use acronym only

  Graphic design class context                      Use generic "I teach a graphic
                                                    design class"

  Profile links and email                           Omit until supplied

  Contact invitation wording                        Use neutral, minimal copy

  Spelling convention                               Use British/Nigerian English as
                                                    specified

  Naerospace title/dates and metrics                Publish only approved description;
                                                    omit unknown dates and metrics

  Hero and long bio approval                        Use supplied drafts as provisional
                                                    copy; flag for owner review

  Photos, CV, OG/headshot assets                    Use typographic placeholder; no
                                                    stock or AI imagery

  Framework/hosting/domain/analytics/accent/fonts   Follow this spec; domain and
                                                    analytics remain owner decisions
  -------------------------------------------------------------------------------------

------------------------------------------------------------------------

# 15. Implementation phases and deliverables

Work in small, verifiable increments. Do not skip the content-policy
foundation.

## Phase 1 --- Foundation and design system

Deliver: - Next.js App Router project using TypeScript strict mode. -
pnpm and committed lockfile. - Tailwind configuration and semantic
design tokens. - Root layout, font loading, metadata defaults. - Header,
responsive navigation, footer, skip link. - Light/dark theme with system
preference and accessible toggle. - Vinculum motif components. - Base
typography, buttons, links, status labels, metadata rails. - Responsive
page container and content layout primitives. - Initial Home page
skeleton using approved copy.

Acceptance: - Runs locally with documented commands. - No console
errors. - Responsive at 320 px, tablet, and desktop. - Keyboard
navigation works. - Reduced-motion preference is respected. - No generic
template styling, gradients, logo walls, or stock imagery.

## Phase 2 --- Typed content engine and guardrails

Deliver: - Content directory structure. - Zod schemas for every entity
type. - Markdown/MDX parsing and rendering pipeline. -
Public/hidden/draft filtering. - Metric clearance and expected-impact
handling. - Collaborator consent handling. - Visibility-aware link
handling. - Internal reference validation. - Unique slug validation. -
Banned-content checks. - Production output scan. - Unit tests for all
policy logic.

Acceptance: - Invalid public content fails validation with actionable
file/field errors. - Hidden items cannot enter production route data. -
Hidden links/metrics/collaborators are not serialized into output. -
Expected metrics receive the expected-impact label. - FairMoney banned
phrase/cost-percentage checks work. - Removed content is absent from
publishable content and generated output.

## Phase 3 --- Content entry

Deliver: - All approved public entries from Section 13. - Hidden
placeholders for pending assets/links only where useful. - No removed
entries. - No fabricated copy. - First-person content. - Correct dates
and statuses. - Cross-links between related research, work, skills, and
music.

Acceptance: - All content validates. - No unresolved placeholder tokens
in public content. - Unknown dates are omitted. - Public content
inventory matches `PLAN.md`.

## Phase 4 --- Public pages

Implement in this order: 1. Home. 2. About. 3. Work index and case-study
template. 4. Research index and HAUV/Dechorder. 5. Projects. 6.
Ventures. 7. Speaking. 8. Writing index and note template. 9. Contact.
10. 404.

Acceptance: - Every route is populated from content collections. - No
content duplication in route components. - Every item card begins with
plain-English summary. - All pages use the shared design system. -
Internal links resolve. - Hidden entries return not found or are absent
in production. - HAUV page works without iframe.

## Phase 5 --- SEO, feeds, and social previews

Deliver: - Per-route metadata. - Canonical URLs. - Sitemap and robots. -
Person JSON-LD. - Dynamic OG images. - RSS feed. - Correct public-only
filtering.

Acceptance: - JSON-LD validates. - Sitemap contains public pages only. -
RSS includes published public notes only. - No hidden links/metrics or
draft content in metadata or feeds. - OG images are legible and
consistent.

## Phase 6 --- Accessibility, performance, and visual polish

Deliver: - Responsive QA. - Axe tests. - Keyboard and reduced-motion
QA. - Image/font optimisation. - Loading and layout-shift pass. -
Lighthouse checks on Home, Work, HAUV. - Mobile and desktop visual
polish.

Acceptance: - WCAG 2.2 AA target; no serious/critical axe findings. -
Lighthouse mobile target ≥95 on Home, Research/HAUV, Work in the agreed
test environment. - No horizontal overflow at 320 px. - Readable on
constrained mobile networks. - No critical content depends on
JavaScript.

## Phase 7 --- Documentation and deployment handoff

Deliver: - `CONTENT.md` editing guide. - `README.md` setup and
deployment instructions. - Environment variable example file. -
Build/test scripts. - Deployment configuration. - Content validation
instructions. - Explanation of how to add a new role, project, research
item, talk, venture, note, image, and link. - Known open-items list.

Acceptance: - A developer unfamiliar with the codebase can run the site
and add a new content entry by following the guide. - Production build
and tests pass. - Deployment can be repeated from a clean checkout.

------------------------------------------------------------------------

# 16. Testing strategy

## 16.1 Unit tests

Test: - schema validation; - common field validation; - visibility
filtering; - hidden child filtering; - metric clearance; -
expected-impact labelling; - collaborator consent; - draft filtering; -
slug uniqueness; - internal reference validation; - FairMoney banned
phrase and cost-percentage detection; - RSS inclusion/exclusion; -
sitemap inclusion/exclusion; - date formatting for unknown/current/known
dates.

## 16.2 Integration tests

Test: - each public content collection loads; - routes receive only
public data; - metadata is generated from public content; - hidden links
are omitted; - hidden content cannot be accessed by guessed slug; - the
HAUV embed is absent in production while hidden; - the Writing page
renders its empty state; - no unconfirmed profile link appears.

## 16.3 End-to-end tests

At minimum: - Home navigation to Work and Contact. - Mobile navigation
opens/closes and is keyboard accessible. - Theme toggle works and
persists only if a suitable lightweight preference mechanism is used. -
Work case study opens. - HAUV page renders with iframe disabled. -
Dechorder page shows thesis completion and labels future work. - Writing
page shows honest empty state. - 404 links home. - No horizontal
overflow at 320 px.

## 16.4 Build-output tests

After production build: - scan generated HTML, JSON, RSC/static
payloads, metadata, sitemap, RSS, and OG output for hidden content
markers and prohibited content; - verify no FairMoney metric is present
unless cleared; - verify no banned FairMoney term; - verify no removed
items; - verify only confirmed URLs appear in `sameAs`; - verify no
draft notes appear.

The scan must be scoped carefully so test fixtures, internal
documentation, and the source `PLAN.md` do not cause false positives.
The public build output is the decisive surface.

------------------------------------------------------------------------

# 17. Deployment and operations

## 17.1 Initial hosting

Use Vercel as the default initial host for the Next.js application
unless a concrete constraint makes another host preferable. Keep the app
portable and avoid relying on proprietary services for content storage.

## 17.2 Domain

Do not invent a domain. Configure canonical origin through an
environment variable. Domain purchase and DNS configuration are owner
tasks unless explicitly delegated.

## 17.3 Environment variables

Provide `.env.example` with only variables actually required. Initially
this may be limited to:

``` dotenv
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Do not add database, storage, auth, or analytics credentials in v1 when
those services are not used.

## 17.4 CI

CI should run: 1. install from lockfile; 2. lint; 3. typecheck; 4. unit
tests; 5. content validation; 6. banned-content checks; 7. production
build; 8. output verification; 9. E2E tests where practical.

A failed content guardrail must fail the deployment.

## 17.5 Content publishing workflow

For v1: 1. Add or edit a Markdown/MDX file in the appropriate
collection. 2. Add referenced assets under `public/`. 3. Run
`pnpm content:validate`. 4. Run tests and local preview. 5. Commit and
push. 6. CI validates and builds. 7. Deploy.

This is the intended authoring workflow. Do not build an admin dashboard
in the initial release.

------------------------------------------------------------------------

# 18. Future extensibility (not v1)

Keep the design open to these additions without implementing them now:

-   Authenticated admin interface for content editing.
-   Database-backed content if file-based publishing becomes limiting.
-   Image/document uploads to S3-compatible storage.
-   Search over public notes and research.
-   Analytics with privacy-conscious configuration.
-   Contact form with spam protection.
-   More ventures, including items deliberately excluded at launch, once
    the owner approves them.
-   Publications, CV, headshot, conference slides, thesis PDF, and
    repository links.
-   Additional research updates and downloadable artefacts.

If a CMS is introduced later, preserve the same typed domain model and
visibility policy. The public rendering layer should depend on a content
repository interface rather than directly on Markdown parsing details.
Do not over-engineer that abstraction in v1; a small set of typed
content access functions is sufficient.

------------------------------------------------------------------------

# 19. Final acceptance checklist

The first release is ready when all of the following are true:

-   [ ] Site identity and positioning match `PLAN.md`.
-   [ ] First-person voice throughout.
-   [ ] Next.js App Router + TypeScript strict mode.
-   [ ] Static-first public rendering.
-   [ ] Typed Markdown/MDX collections for all entity types.
-   [ ] Content is separate from page components.
-   [ ] Production visibility rules are enforced at build time.
-   [ ] Hidden metrics, links, collaborators, milestones, embeds, and
    drafts are filtered.
-   [ ] No removed content appears in public output.
-   [ ] FairMoney content contains no "microservice" wording or
    cost-reduction percentage.
-   [ ] No uncleared FairMoney metrics or business-volume figures.
-   [ ] HAUV is clearly simulation-based and not field-validated.
-   [ ] HAUV iframe is implemented but hidden in production pending
    owner approval.
-   [ ] Dechorder is described as a completed and defended thesis; music
    recommendation is future work.
-   [ ] Xealtha is the only public venture and is labelled in
    development.
-   [ ] Writing launches with zero posts and an honest empty state.
-   [ ] Unknown dates and links are omitted, not guessed.
-   [ ] No stock or AI-generated personal imagery.
-   [ ] Light/dark mode works.
-   [ ] Responsive at 320 px and above.
-   [ ] WCAG 2.2 AA checks completed; no serious/critical axe issues.
-   [ ] Lighthouse mobile target ≥95 on Home, Work, and HAUV in the
    agreed environment.
-   [ ] SEO metadata, canonical URLs, sitemap, robots, Person JSON-LD,
    OG images, and RSS work.
-   [ ] `CONTENT.md` and `README.md` are complete.
-   [ ] Clean install, validation, tests, and production build pass.

------------------------------------------------------------------------

## Appendix A --- Agent execution protocol

At the start of implementation: 1. Inspect the repository and existing
files. 2. Read `PLAN.md`. 3. Confirm the current working tree and avoid
overwriting user work. 4. Propose a short phase-1 task breakdown. 5.
Begin Phase 1 unless a blocking issue exists.

At the end of each phase, report: - files/components created or
changed; - key decisions made; - commands executed; - test/build
results; - outstanding issues; - next phase proposed.

Do not claim a test passed unless it was actually run. Do not claim
deployment or external links work unless verified.

## Appendix B --- Source authority

`PLAN.md` is the authority for personal facts, public/private status,
page content, design intent, and open items. Where this specification
gives a technical implementation decision, follow this specification.
Where a personal fact or publication decision is unclear, follow the
conservative default and leave it unpublished pending owner
confirmation.
