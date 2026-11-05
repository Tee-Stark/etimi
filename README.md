# Timmy Omolana — personal website

Personal website and long-term digital home of Timmy (Timilehin) Omolana.

- **What the site says:** [`PLAN.md`](./PLAN.md) (authoritative content, publication status, open items)
- **How it is built:** [`IMPLEMENTATION_SPEC.md`](./IMPLEMENTATION_SPEC.md)
- **Background brief:** [`ABOUT_TIM.md`](./ABOUT_TIM.md)

> Status: **Phase 1 — foundation and design system.** The content engine,
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
pnpm build            # production build (static prerender)
pnpm start            # serve the production build
pnpm lint             # ESLint
pnpm typecheck        # generate route types, then tsc --noEmit
```

## Environment

| Variable               | Purpose                                                    |
| ---------------------- | ---------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata. Falls back to localhost in development. The real domain is not chosen yet; do not guess it. |

## Layout

```text
content/            Authored content only (Markdown + YAML frontmatter)
  site/profile.md   Site identity: name, title, positioning, hero copy, links
src/
  app/              Routes. (site)/ holds the public pages and shared chrome
  components/       Reusable presentation (layout, navigation, typography,
                    content primitives, theme, vinculum motif, home sections)
  config/           Navigation / information architecture
  content/          Content loading and validation (server-only)
  fonts/            Self-hosted font files (SIL OFL 1.1) and loaders
  lib/              Small utilities
  styles/           globals.css — design tokens and base styles
```

## Design system (Phase 1)

- **Tokens** live in `src/styles/globals.css` as semantic CSS variables
  (`--background`, `--foreground`, `--surface`, `--muted`,
  `--muted-foreground`, `--border`, `--accent`, `--accent-foreground`,
  `--focus-ring`) mapped to Tailwind colours. Components never use literal
  colours.
- **Palette:** charcoal `#141414` on warm off-white `#F5F3EE`; one accent,
  oxide red (`#A23B1E` light / `#E07A55` dark). All text pairs meet WCAG AA
  (body text ≥ 14:1, muted ≥ 6.2:1, accent ≥ 5.9:1).
- **Type:** Newsreader (editorial serif, headings and long reading), IBM Plex
  Sans (UI and body), IBM Plex Mono (metadata, dates, status labels).
- **Vinculum motif:** the bar drawn over a mathematical expression to bind
  its terms. It appears as heading overbars, the active-nav marker, section
  rules, and the single bar spanning the three threads.
- **Theme:** follows the system by default; the header toggle stores an
  explicit choice in `localStorage`, applied before first paint.
- **Motion:** small transitions only; disabled under `prefers-reduced-motion`.
