# Design system

Direction: **Spec Sheet**. The site reads like a specification sheet for a person: a hairline ruled grid, thin line icons and a few flat fills carrying the color, mono labels and numbered indexes instead of card chrome, one lavender tile with the SJ monogram, all set on Skylar's letterhead (the magenta rail down the left edge, Futura-style type with a mono name). The full rationale, page-by-page notes and the contrast table are in [`design-spec-sheet/DESIGN.md`](design-spec-sheet/DESIGN.md).

Small, token-based, no framework. Plain CSS plus a few Astro components. Later sections follow it by using the same tokens, classes and components instead of adding their own styles.

## Rules

1. **Tokens only.** Colors, sizes, spacing and radii come from `src/styles/tokens.css` as `var(--token)`. No raw hex values or one-off pixel sizes in components or pages.
2. **Dark first, light derived.** Dark is the default. Light applies under `prefers-color-scheme: light`. `[data-theme]` overrides both. Add every color to the dark block, the light media block and the `[data-theme='light']` block. A print block swaps to letterhead ink on white.
3. **Gold is never text in light.** On paper, labels are violet (`--color-label`) and gold is a fill only. Use `--color-label` for labels, not `--color-gold`.
4. **Accessibility is a gate.** Lighthouse accessibility must stay at 100. Text pairs need 4.5:1 and UI parts (focus ring, rules) 3:1, in both schemes. Keep the visible focus ring, the skip link, and one `h1` per page with headings in order.
5. **Letterhead type, self-hosted.** Jost (standing in for Futura) for headings and text, Book 400 and Medium 500 only, with 400 and 500 preloaded; bold maps to Medium. A mono (Andale Mono, else M PLUS 1 Code) for the wordmark, labels and nav. All in `public/fonts/` with their licences. No other external assets.
6. **Plain voice.** Copy follows the content lint (`harness/content-lint.yml`). The Spec panel on Home lists only what CI and branch protection actually enforce.
7. **Reuse before adding.** New section? Use `PageHeader`, `EntryList` and `.prose`. Only add a component when two pages need it.

## Tokens (`src/styles/tokens.css`)

| Group | Tokens |
|---|---|
| Color | `--color-bg`, `-surface`, `-surface-hover`, `-text`, `-text-muted`, `-accent` (magenta), `-accent-hover`, `-on-accent`, `-gold`, `-on-gold`, `-label`, `-panel` (lavender), `-on-panel`, `-on-panel-muted`, `-rule`, `-rule-soft`, `-focus`, `-focus-on-panel`, `-tag-bg`, `-tag-text`, `-code-bg`, `-rail`, `-watermark`; `--watermark-opacity` |
| Type | `--font-display`, `--font-mono`, `--font-sans`; `--weight-book`, `--weight-medium`; `--text-xs` to `--text-2xl`, `--text-headline` (Musings/Projects h1), `--text-code`, `--text-print`, `--text-print-title`; `--leading-tight`, `--leading-body`, `--tracking-label` |
| Space | `--space-1` to `--space-24` on a 4px base |
| Layout | `--measure` (reading width), `--measure-article` (Musings/Projects width), `--page-max` (Home grid), `--radius`, `--radius-frame`, `--radius-round`, `--border-width`, `--rule-heavy`, `--print-margin`; the rail and watermark sizes (`--rail-width`, `--rail-tile-h`, `--watermark-w` and their `-sm` versions); `--tile-icon`, `--tile-number` |
| Letterhead | `--lh-*`: the resume PDF's measurements in points. Values marked `(est.)` weren't measured from the original. |
| Motion | `--duration`, `--ease` (only inside `prefers-reduced-motion: no-preference`) |

## Styles

- `src/styles/global.css`: element defaults, the rail (`body::before`, masked by `public/rail-mask.svg` so `--color-rail` sets its color), `.container` (and `.container--wide`, `.container--article`), `.label` (mono marker), the skip link, print rules (`.no-print` hides an element on paper).
- `src/styles/components.css`: every component's styles, class-based, in one file. Components carry no `<style>` blocks. Useful classes for pages: `.prose` (reading column for Markdown), `.button` (gold) and `.button--accent` (magenta), `.back` (mono back link), `.resume` (section heads get a trailing colon, `.school` for school names), and `.transcript` (a shared chat inside a musing: session lanes, `<details class="t-msg">` for expandable messages, `<mark class="t-edit">` for passages edited for sharing; see the comment in `components.css`).

## Components (`src/components/`)

| Component | Use |
|---|---|
| `Header`, `Footer` | Site chrome, included by `layouts/Base.astro`. Nav items come from `src/data/nav.ts`, numbered by a CSS counter, current page marked with `aria-current`. |
| `PageHeader` | The page `h1`, optional `lede`, `kicker` (mono label above) and `meta` (mono line below), plus a slot. One per page. |
| `EntryList` | Numbered index for a collection: `items` of `{ href, title, summary, meta?, tags? }`, plus an empty-state message. Rows are teasers and the whole row links; leave `tags` off list pages (they stay on the entry's page). |
| `Tile` | One link cell of the Home grid: a magenta line icon (Tabler outline paths inlined in `Tile.astro`), the title, and the nav number set large and faded in the top right, in the resume watermark's color and opacity. Home builds one per nav entry; the entry's `icon` in `src/data/nav.ts` picks the icon (default: a plain page). |
| `Spec` | The harness panel on Home: a label, a slot for intro text, and term/value rows. |
| `Monogram` | The SJ monogram, inlined from `src/assets/sj-monogram.svg`. `class="monogram"` on Home's lavender tile, `class="watermark"` behind the resume header. Also the favicon (`public/favicon.svg`). |
| `ResumeLetterhead` | The resume as the letterhead, a whole HTML document styled by `src/styles/letterhead.css` (not loaded by `Base`). `src/pages/resume/letterhead.astro` maps `resume.yaml` onto it. |
| `BuildStamp` | Footer commit and date. Reads `PUBLIC_COMMIT`, `PUBLIC_BUILD_DATE`, `PUBLIC_REPO_URL` (set by CI); renders nothing without them. |
| `LiveLink` | Magenta button link to a live product, labeled "Visit" plus its domain. Used on detail pages. |
| `Tag` | Small outlined mono label for a status or tag. |

## Layout

`layouts/Base.astro` loads the tokens, global and component CSS, preloads Jost 400 and 500, and adds the skip link, header, `main` and footer. `width="reading"` (default) is one narrow column; `width="wide"` is for the Home grid.

The Home grid draws its lines with a 1px gap over `--color-rule`, and every row is full: hero and monogram tile, then one row of section tiles, then the Spec panel. The section row splits evenly for however many sections `nav.ts` has, and wraps (last line stretching to fill) when they don't fit. New Spec rows are just entries in the `spec` list in `src/pages/index.astro`. Three columns, two under 52rem (the monogram tile goes full width), one under 36rem.

## Adding to the system

- New token: add it to all three color blocks in `tokens.css` (and print if it matters on paper), then to the table above and the contrast table in `design-spec-sheet/DESIGN.md`.
- New component: put it in `src/components/`, styles in `components.css` using tokens only, add a row above.
- `npm run new:section` scaffolds pages with `PageHeader`, `EntryList`, `.prose` and a back link; the nav entry it adds also gives Home a new tile. Give the entry an `icon` (add the paths to `Tile.astro` if it's a new one).
- Check with `npm run build` then `npm run lighthouse`.

## Resume PDF

`public/downloads/Skylar_Damiano_Resume.pdf` is the letterhead page printed by Chrome. After changing `resume.yaml` or the letterhead styles, run `npm run build` then `npm run resume:pdf`, check it's still two pages, and commit the PDF. To tune the layout against the 2020 original, change only the `--lh-*` tokens.

`docs/design-export/` is the snapshot of the earlier baseline that went to the design tool; `docs/design-spec-sheet/` is what came back.
