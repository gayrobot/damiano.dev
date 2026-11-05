# Design system

Direction: **Spec Sheet**. The site reads like a specification sheet for a person: a hairline ruled grid, a few flat shapes carrying the color, mono labels and numbered indexes instead of card chrome, one lavender tile with the SD mark. The full rationale, page-by-page notes and the contrast table are in [`design-spec-sheet/DESIGN.md`](design-spec-sheet/DESIGN.md).

Small, token-based, no framework. Plain CSS plus a few Astro components. Later sections follow it by using the same tokens, classes and components instead of adding their own styles.

## Rules

1. **Tokens only.** Colors, sizes, spacing and radii come from `src/styles/tokens.css` as `var(--token)`. No raw hex values or one-off pixel sizes in components or pages.
2. **Dark first, light derived.** Dark is the default. Light applies under `prefers-color-scheme: light`. `[data-theme]` overrides both. Add every color to the dark block, the light media block and the `[data-theme='light']` block. A print block swaps to black on white.
3. **Gold is never text in light.** On paper, labels are violet (`--color-label`) and gold is a fill only. Use `--color-label` for labels, not `--color-gold`.
4. **Accessibility is a gate.** Lighthouse accessibility must stay at 100. Text pairs need 4.5:1 and UI parts (focus ring, rules) 3:1, in both schemes. Keep the visible focus ring, the skip link, and one `h1` per page with headings in order.
5. **One web font.** Alfa Slab One, self-hosted in `public/fonts/` (~19 KB, preloaded), for the wordmark, `h1` and tile titles only. Everything else uses system stacks. No other external assets.
6. **Plain voice.** Copy follows the content lint (`harness/content-lint.yml`). The Spec panel on Home lists only what CI and branch protection actually enforce.
7. **Reuse before adding.** New section? Use `PageHeader`, `EntryList` and `.prose`. Only add a component when two pages need it.

## Tokens (`src/styles/tokens.css`)

| Group | Tokens |
|---|---|
| Color | `--color-bg`, `-surface`, `-surface-hover`, `-text`, `-text-muted`, `-accent` (magenta), `-accent-hover`, `-on-accent`, `-gold`, `-on-gold`, `-label`, `-panel` (lavender), `-on-panel`, `-on-panel-muted`, `-rule`, `-rule-soft`, `-focus`, `-focus-on-panel`, `-tag-bg`, `-tag-text`, `-code-bg` |
| Type | `--font-display`, `--font-mono`, `--font-sans`; `--text-xs` to `--text-2xl`, `--text-code`, `--text-print`, `--text-print-title`; `--leading-tight`, `--leading-body`, `--tracking-label` |
| Space | `--space-1` to `--space-24` on a 4px base |
| Layout | `--measure` (reading width), `--page-max` (Home grid), `--radius`, `--radius-frame`, `--radius-round`, `--border-width`, `--rule-heavy`, `--print-margin` |
| Motion | `--duration`, `--ease` (only inside `prefers-reduced-motion: no-preference`) |

## Styles

- `src/styles/global.css`: element defaults, `.container` (and `.container--wide`), `.label` (mono marker), the skip link, print rules (`.no-print` hides an element on paper).
- `src/styles/components.css`: every component's styles, class-based, in one file. Components carry no `<style>` blocks. Useful classes for pages: `.prose` (reading column for Markdown), `.button` (gold) and `.button--accent` (magenta), `.back` (mono back link), `.resume`, and `.transcript` (a shared chat inside a musing: session lanes, `<details class="t-msg">` for expandable messages, `<mark class="t-edit">` for passages edited for sharing; see the comment in `components.css`).

## Components (`src/components/`)

| Component | Use |
|---|---|
| `Header`, `Footer` | Site chrome, included by `layouts/Base.astro`. Nav items come from `src/data/nav.ts`, numbered by a CSS counter, current page marked with `aria-current`. |
| `PageHeader` | The page `h1`, optional `lede`, `kicker` (mono label above) and `meta` (mono line below), plus a slot. One per page. |
| `EntryList` | Numbered index for a collection: `items` of `{ href, title, summary, meta?, tags? }`, plus an empty-state message. Rows are teasers and the whole row links; leave `tags` off list pages (they stay on the entry's page). |
| `Tile` | One link cell of the Home grid, with a flat shape (`circle`, `triangle`, `square`). Home builds one per nav entry automatically. |
| `Spec` | The harness panel on Home: a label, a slot for intro text, and term/value rows. |
| `SdMark` | The SD mark, inlined from `src/assets/sd-mark.svg`. Also the favicon (`public/favicon.svg`). |
| `BuildStamp` | Footer commit and date. Reads `PUBLIC_COMMIT`, `PUBLIC_BUILD_DATE`, `PUBLIC_REPO_URL` (set by CI); renders nothing without them. |
| `LiveLink` | Magenta button link to a live product, labeled "Visit" plus its domain. Used on detail pages. |
| `Tag` | Small outlined mono label for a status or tag. |

## Layout

`layouts/Base.astro` loads the tokens, global and component CSS, preloads the display font, and adds the skip link, header, `main` and footer. `width="reading"` (default) is one narrow column; `width="wide"` is for the Home grid.

The Home grid draws its lines with a 1px gap over `--color-rule`, and every row is full: hero and SD tile, then one row of section tiles, then the Spec panel. The section row splits evenly for however many sections `nav.ts` has, and wraps (last line stretching to fill) when they don't fit. New Spec rows are just entries in the `spec` list in `src/pages/index.astro`. Three columns, two under 52rem (the SD tile goes full width), one under 36rem.

## Adding to the system

- New token: add it to all three color blocks in `tokens.css` (and print if it matters on paper), then to the table above and the contrast table in `design-spec-sheet/DESIGN.md`.
- New component: put it in `src/components/`, styles in `components.css` using tokens only, add a row above.
- `npm run new:section` scaffolds pages with `PageHeader`, `EntryList`, `.prose` and a back link; the nav entry it adds also gives Home a new tile.
- Check with `npm run build` then `npm run lighthouse`.

`docs/design-export/` is the snapshot of the earlier baseline that went to the design tool; `docs/design-spec-sheet/` is what came back.
