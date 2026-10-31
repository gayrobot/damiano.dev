# Design system

Small, token-based, no framework. Plain CSS plus a few Astro components. Later sections follow it by using the same tokens and components instead of adding their own styles.

## Rules

1. **Tokens only.** Colors, sizes, spacing and radii come from `src/styles/tokens.css` as `var(--token)`. No raw hex values or one-off pixel sizes in components or pages.
2. **Light and dark.** Both palettes live in `tokens.css` and follow `prefers-color-scheme`. Add a color in both.
3. **Accessibility is a gate.** Lighthouse accessibility must stay at 100. Text and background pairs must keep at least WCAG AA contrast (4.5:1) in both schemes. Keep the visible focus ring, the skip link, and one `h1` per page with headings in order.
4. **No external assets.** System font stacks, no web fonts, no images required. Keeps performance at the Lighthouse threshold and the build static.
5. **Plain voice.** Copy follows the content lint (`harness/content-lint.yml`).
6. **Reuse before adding.** New section? Use `PageHeader` and `EntryList`. Only add a component when two pages need it.

## Tokens (`src/styles/tokens.css`)

| Group | Tokens |
|---|---|
| Color | `--color-bg`, `-surface`, `-text`, `-text-muted`, `-border`, `-accent`, `-accent-hover`, `-accent-contrast`, `-focus`, `-tag-bg` |
| Type | `--font-sans`, `--font-serif` (headings), `--font-mono`; `--text-sm` to `--text-2xl`; `--leading-tight`, `--leading-body` |
| Space | `--space-1` to `--space-16` on a 4px base |
| Layout | `--measure` (reading width), `--radius`, `--border-width` |

## Global styles (`src/styles/global.css`)

Element defaults (headings, links, lists, code, quotes), the `.container` width wrapper, the skip link, and a print reset. Anything that styles a bare element belongs here.

## Components (`src/components/`)

| Component | Use |
|---|---|
| `Header`, `Footer` | Site chrome, included by `layouts/Base.astro`. The nav comes from `src/data/nav.ts` and marks the current page with `aria-current`. |
| `PageHeader` | The page `h1`, an optional `lede`, and a slot for meta lines. One per page. |
| `EntryList` | Card list for a collection: `items` of `{ href, title, summary, meta?, tags?, url? }`, plus an empty-state message. `url` adds a `LiveLink`. |
| `LiveLink` | Button-style link to a live product, labeled "Visit" plus its domain. |
| `Tag` | Small label for a status or tag. |

Component styles are scoped to the component and use tokens.

## Layout

`layouts/Base.astro` loads the tokens and global CSS, adds the skip link, header, `main` (inside `.container`) and footer. Pages put content straight in the slot.

## Adding to the system

- New token: add it to `tokens.css` (and the dark block if it is a color), then add it to the table above.
- New component: put it in `src/components/`, use tokens only, add a row above.
- `npm run new:section` already scaffolds pages with `PageHeader` and `EntryList`.
- Check with `npm run build` then `npm run lighthouse`.
