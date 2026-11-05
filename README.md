# Timmy Omolana — personal website

Personal website and long-term digital home of Timmy (Timilehin) Omolana.

- **What the site says:** [`PLAN.md`](./PLAN.md) (authoritative content, publication status, open items)
- **How it is built:** [`IMPLEMENTATION_SPEC.md`](./IMPLEMENTATION_SPEC.md)
- **Background brief:** [`ABOUT_TIM.md`](./ABOUT_TIM.md)

> Status: **Phase 4 — all public pages render from content.** The content engine,
> guardrails, pages, SEO and full documentation arrive in later phases
> (see `IMPLEMENTATION_SPEC.md` §15).

## Stack

Next.js 16 (App Router, Cache Components, static prerendering) · TypeScript
(strict) · Tailwind CSS v4 · Zod · Markdown content with YAML frontmatter ·
self-hosted fonts · pnpm.

## Requirements

- Node.js ≥ 20.9 (developed on Node 26)
- pnpm ≥ 10 (`npm i -g pnpm`)

## Commands

```bash
pnpm install          # install from the lockfile
cp .env.example .env.local   # optional locally; required values for production

pnpm dev              # development server on http://localhost:3000
pnpm dev:preview      # same, but also shows hidden/draft entries (flagged)
pnpm build            # validate → banned scan → next build → output scan
pnpm start            # serve the production build
pnpm lint             # ESLint
pnpm typecheck        # generate route types, then tsc --noEmit
pnpm test             # unit tests (Vitest)
pnpm check            # lint + typecheck + test + build

pnpm content:validate      # schemas and cross-entry rules only
pnpm content:check-banned  # removed items / FairMoney wording in content, src, public
pnpm content:check-output  # scan .next for anything withheld (after next build)
```

## Environment

| Variable               | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata. Falls back to localhost in development. The real domain is not chosen yet; do not guess it. |

## Content system

Every role, case study, research project, project, venture, talk, note,
publication and community entry is one Markdown/MDX file under `content/`
with YAML frontmatter, validated by a Zod schema
(`src/content/schemas/`). Adding an entry is a content change only.

- **Publication is opt-in.** `visibility: public | hidden` is required on
  every entry. Notes also need an explicit `draft: true | false`.
- **Hidden parts are filtered separately.** Links, metrics, collaborators,
  milestones, embeds, publications, research updates and talk links each
  carry their own visibility (or `cleared` / `consent`). They are removed
  before data reaches a page, so they cannot be serialised.
- **Metrics:** only `cleared: true` metrics publish. `kind: expected`
  always carries the label "Expected impact".
- **Collaborators:** named only with `consent: true`.
- **Pages** read content only through `@/content`, which is server-only
  (`getSite`, `getCollection`, `getEntry`, `getPublicCollection`,
  `getStaticSlugs`). An ESLint rule blocks direct loader or filesystem
  imports from routes and components.
- **Preview:** `pnpm dev:preview` shows hidden and draft entries, flagged,
  in development only. Production builds ignore it.
- **Guardrails (fail the build):**
  - schema errors, with file and field
  - file name ≠ slug
  - duplicate slugs
  - broken references
  - internal links to missing or hidden pages
  - `[CONFIRM]` or `TODO` in public content
  - non-https or unsafe URLs
  - hidden URLs reused publicly
  - unsafe iframe sandboxes
  - items removed in PLAN.md
  - "microservice" or percentage cost claims in FairMoney content
  - after the build, any withheld text, URL, uncleared metric value or
    unconsented name found in the HTML, RSC payloads or client chunks

## Layout

```text
content/            Authored content only (Markdown + YAML frontmatter)
  site/profile.md   Site identity: name, title, positioning, hero copy, links
src/
  app/              Routes. (site)/ holds the public pages and shared chrome
  components/       Reusable presentation (layout, navigation, typography,
                    content primitives, theme, vinculum motif, home sections)
  config/           Navigation / information architecture
  content/          Content engine: schemas, loader, visibility policy,
                    validation, banned rules; index.ts is the server-only API
  fonts/            Self-hosted font files (SIL OFL 1.1) and loaders
  lib/              Markdown/MDX rendering, headings, dates, signals, utilities
scripts/            Build-time guardrails (validate, banned scan, output scan)
tests/              Vitest unit tests; fixtures are generated in temp dirs
  styles/           globals.css — design tokens and base styles
```

## Design system

The visual identity is "Manuscript, with figure": an editorial, computational
research environment. The full rationale is in `PLAN.md` §7.

- **Tokens** live in `src/styles/globals.css` as semantic CSS variables
  (`--background`, `--surface`, `--muted`, `--foreground`,
  `--muted-foreground`, `--faint`, `--grid`, `--border`, `--border-strong`,
  `--accent`, `--accent-foreground`, `--focus-ring`). They are mapped to
  Tailwind colours, and components never use literal colours.
- **Palette:** the default dark theme is `#080B12` with main text
  `#E8EAF0`, secondary text `#A1A9B8` and borders `#252C3A`. The single
  accent is Electric Cobalt `#6F91FF`, used only for active navigation,
  links, footnote markers, interactive states and selected figures. The
  light "paper" theme uses `#2A4BD0`. Every text colour passes WCAG AA.
- **Type:** Instrument Sans (interface and reading text), Instrument Serif
  (display only, large sizes), and IBM Plex Mono (labels, coordinates,
  notation). Utilities: `label`, `annot`, `display`, `math`, `link`.
- **Figures:** `src/lib/signals.ts` generates real signals (Fourier partial
  sum, Gabor wave packet, FM) as SVG paths at build time, and
  `<SignalTrace>` draws them as 1px hairlines.
- **Grid:** `<ColumnGuides>` draws the 12-column grid with column indices. On
  large screens it lines up exactly with `lg:grid-cols-12 gap-x-6` content.
- **Theme:** dark by default. The header toggle switches to the paper theme
  and remembers the choice in `localStorage`, applied before first paint.
- **Motion:** small transitions only, disabled under `prefers-reduced-motion`.
