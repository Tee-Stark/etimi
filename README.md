# Timmy Omolana — personal website

Personal website and long-term digital home of Timmy (Timilehin) Omolana.

- **What the site says:** [`PLAN.md`](./PLAN.md) (authoritative content, publication status, open items)
- **How it is built:** [`IMPLEMENTATION_SPEC.md`](./IMPLEMENTATION_SPEC.md)
- **Background brief:** [`ABOUT_TIM.md`](./ABOUT_TIM.md)

> Status: **Phase 1 — foundation and design system (visual identity reset).** The content engine,
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

## Design system

The visual identity is "Manuscript, with figure": an editorial, computational
research environment. The full rationale is in `PLAN.md` §7.

- **Tokens** live in `src/styles/globals.css` as semantic CSS variables
  (`--background`, `--surface`, `--muted`, `--foreground`,
  `--muted-foreground`, `--faint`, `--grid`, `--border`, `--border-strong`,
  `--accent`, `--accent-foreground`, `--focus-ring`). They are mapped to
  Tailwind colours, and components never use literal colours.
- **Palette:** the default dark theme is a near-black with a green/graphite
  undertone (`#080B09`), with one chartreuse signal colour (`#C9F24B`). The
  light "paper" theme uses a deep olive signal colour (`#4A6600`). Every text
  colour passes WCAG AA in both themes, including the faint annotation colour.
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
