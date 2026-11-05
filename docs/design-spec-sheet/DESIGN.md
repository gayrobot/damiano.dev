# damiano.dev: Spec Sheet direction

Skylar picked direction A ("Spec Sheet"). Revision 3, the middle ground between the first hard-edged version and the over-softened second: the Westinghouse-style ruled grid is back, the dark purple is replaced by soft lavender, the Spec panel sits on the normal surface color, and corners are small (`--radius` 0.5rem on buttons, tags and the nav's current item; `--radius-frame` 1rem on the Home grid's outer frame only). Live artboards are on the Design canvas; this file is the written hand-off. Everything here is checked against the constraints in BRIEF.md except where the Tradeoffs section says it was not.

## 1. Rationale

The idea: the site reads like a specification sheet for a person. A hairline grid cuts the page into rectangles, the way Paul Rand's Westinghouse manual cover does, and the whole frame has a gentle rounded corner. A few flat shapes (circle, triangle, square) carry the color. Mono labels and numbered indexes do the work that card chrome did before. One lavender tile carrying the SD mark sits where Rand puts his logo tile. The mark is built from one module: S is two half-discs of radius r, D is one half-disc of radius 2r. The IIDX poster's feature-callout box becomes the Spec panel, which lists only what CI really enforces, so the harness story is proof instead of decoration.

What it reacts against: the baseline is a template. A centered column, a grey lede, blue links, one rounded card. Nothing in it says anyone chose it. Here the choices are visible and a little opinionated: a ruled grid of cells with a softly rounded frame, small corner radii on buttons and tags, a heavy slab display face, a dark primary look, magenta and gold as the hot colors, lavender as the one soft panel color.

What it is not: no gradients, no glow, no grid-floor synthwave (that is the 2020s trend you said to avoid), no illustration copied from the posters, no rotated text in anything people read.

**Colors.** Dark is the default and the primary look. Light follows `prefers-color-scheme: light`. Magenta (`#ff4db8` on dark, deep `#b0006c` on light) is for links and the single hot mark. Gold is rules, fills and focus; on light it is a fill only and never text. Lavender (`#c4b2ff`) is the panel fill, with ink text on top. In light, violet (`#5b2bd1`) is used for labels and focus.

**Type.** Display: Alfa Slab One, self-hosted, for the wordmark, h1 and tile titles only. Labels, nav, dates, tags: Andale Mono if the visitor has it, else the system mono. Reading text: system sans.

## 2. Files in this folder

| File | What changed |
|---|---|
| `src/styles/tokens.css` | Replaced. Dark default, light via media query, `[data-theme]` overrides, print palette, self-hosted `@font-face`. |
| `src/styles/global.css` | Replaced. Base elements, heading rules, `.label`, skip link, print rules. |
| `src/styles/components.css` | New. All component styles in one class-based file (see Tradeoffs). Import it in `Base.astro` after `global.css`. |
| `src/layouts/Base.astro` | New `width` prop (`reading` or `wide`), font preload, `color-scheme` meta, imports `components.css`. |
| `src/components/Header.astro`, `Footer.astro`, `PageHeader.astro`, `Tag.astro`, `EntryList.astro` | Same names and props; markup uses the new classes; their `<style>` blocks are gone. `PageHeader` gains optional `kicker` and `meta`. |
| `src/components/Tile.astro` | New. One link tile on Home. |
| `src/components/Spec.astro` | New. The harness panel on Home. |
| `src/components/SdMark.astro`, `src/assets/sd-mark.svg`, `public/favicon.svg` | New. The SD mark (option B), inlined on Home and used as the favicon (ink on lavender, rounded square). About 0.4 KB each. |
| `src/components/BuildStamp.astro` | New. Footer commit and date; renders nothing unless the env vars below are set. |
| `public/fonts/alfa-slab-one-latin-400-normal.woff2` and licence | Self-hosted display face, SIL OFL. |

Build-time env vars (set in CI; nothing renders if they are missing, so nothing invented ever shows): `PUBLIC_COMMIT` (short hash), `PUBLIC_BUILD_DATE`, `PUBLIC_REPO_URL`.

### Token renames and additions

| Old | New | Note |
|---|---|---|
| `--color-border` | `--color-rule` | Hairlines and grid lines. Gold on dark, ink on light. |
| (none) | `--color-rule-soft` | Quiet dividers inside long text. |
| `--color-accent-contrast` | `--color-on-accent` | Text on a magenta fill. |
| `--color-accent` | same name | Now magenta, not blue. |
| `--leading-tight` | same name | 1.2 became 1.1. |
| `--text-2xl` | same name | Larger, up to 4.5rem. |
| `--radius` | same name | Now `0.5rem`. |

Added: `--color-gold`, `--color-on-gold`, `--color-label`, `--color-surface-hover`, `--radius-frame`, `--color-panel`, `--color-on-panel`, `--color-on-panel-muted`, `--color-focus-on-panel`, `--color-tag-text`, `--color-code-bg`, `--font-display`, `--text-xs`, `--text-code`, `--text-print`, `--text-print-title`, `--radius-round`, `--tracking-label`, `--space-24`, `--page-max`, `--rule-heavy`, `--print-margin`, `--duration`, `--ease`. Unchanged names: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-accent-hover`, `--color-focus`, `--color-tag-bg`, the font stacks (`--font-sans`, `--font-mono`; `--font-serif` is removed), the space scale, `--measure`, `--border-width`.

## 3. Page-by-page

**Home** (`width="wide"`). A three-column grid of ruled cells inside one rounded frame, with a heavy rule on the header above it.
- Hero tile (two columns): the existing h1 and lede, set large in the display face.
- Lavender tile: the SD half-disc mark in ink, in the position of Rand's logo tile.
- Three link tiles, one per section, each with a flat shape (circle, triangle, square) and a number that matches its place in the nav.
- Spec panel, full width: the existing "site is part of the project" sentence, then rows listing only what CI enforces (every change is a pull request; Lighthouse accessibility 100, the other three 90+; contrast AA in both schemes; static on Cloudflare Workers).
- Extending: add an entry to `nav.ts` and a `Tile`; the grid reflows. Down to two columns under 52rem and one under 36rem. Home needs a `width="wide"` on its `Base` call.

**List page** (Projects, Musings). A numbered index, not cards: a heavy rule on top, hairlines between rows. The number is a CSS counter, so new entries renumber themselves. The whole row is the link; hover shifts the row to a slightly lighter surface and the title to magenta with an underline. Meta is mono, tags are small outlined mono labels with a slight radius. The empty state is a mono line.

**Detail page** (essay). One 42rem column, about 70 characters a line, system sans at 17px and 1.65 leading. Only the title uses the display face. h2 sits under a 2px rule so a long essay can be scanned from the rules. Links are magenta with a 2px underline that never goes away. Blockquotes sit on the surface color with a slight radius (no side stripe). Code blocks have a soft border and a slight radius. The reading column carries no decoration; the personality is in the frame around it.

**Resume, screen.** The quiet page, as agreed. Same type and palette, no panels or tiles. Section names are mono labels under a 2px rule, job titles are the heavy sans, meta is mono. The Download PDF link becomes a gold button with a slight radius.

**Resume, print.** Tokens swap to black on white inside `@media print`; the display face stays for the name at 24pt. Header, footer, skip link and the download button are hidden (`.no-print`). Body is 10.5pt at 1.45, page margin 0.6in, links underlined in black, each job avoids splitting across a page, and headings avoid being stranded at a page bottom. Heavy rules stay as the only decoration. No phone number appears anywhere in the design; keep it out of the content as before.

## 4. Contrast table

Computed by script from the actual `tokens.css`, so the table cannot drift from the file. WCAG 2.x relative-luminance ratios. Text needs 4.5:1; UI parts (focus ring, rules that define controls) need 3:1. Hover states are in the table: link hover, and row or tile hover onto `--color-surface-hover`.

### Screen

| Pair | Needs | Dark: colors | Dark ratio | Dark | Light: colors | Light ratio | Light |
|---|---|---|---|---|---|---|---|
| Body text on page | 4.5:1 | `#f3f0fa` on `#0b0912` | 17.57:1 | Pass | `#14101c` on `#f6f2ea` | 16.78:1 | Pass |
| Body text on surface (cards, code) | 4.5:1 | `#f3f0fa` on `#15111f` | 16.48:1 | Pass | `#14101c` on `#ffffff` | 18.74:1 | Pass |
| Muted text on page | 4.5:1 | `#b4adc6` on `#0b0912` | 9.16:1 | Pass | `#51495f` on `#f6f2ea` | 7.62:1 | Pass |
| Muted text on surface | 4.5:1 | `#b4adc6` on `#15111f` | 8.6:1 | Pass | `#51495f` on `#ffffff` | 8.51:1 | Pass |
| Link / accent text on page | 4.5:1 | `#ff4db8` on `#0b0912` | 6.6:1 | Pass | `#b0006c` on `#f6f2ea` | 6.14:1 | Pass |
| Link / accent text on surface | 4.5:1 | `#ff4db8` on `#15111f` | 6.19:1 | Pass | `#b0006c` on `#ffffff` | 6.86:1 | Pass |
| Link hover on page | 4.5:1 | `#ff8dd2` on `#0b0912` | 9.41:1 | Pass | `#80004f` on `#f6f2ea` | 9.26:1 | Pass |
| Gold label text on page (dark only; gold is never text in light) | 4.5:1 | `#f2c14e` on `#0b0912` | 11.78:1 | Pass | `#f2c14e` on `#f6f2ea` | 1.5:1 | n/a |
| Mono label text on page | 4.5:1 | `#f2c14e` on `#0b0912` | 11.78:1 | Pass | `#5b2bd1` on `#f6f2ea` | 6.94:1 | Pass |
| Mono label text on surface | 4.5:1 | `#f2c14e` on `#15111f` | 11.06:1 | Pass | `#5b2bd1` on `#ffffff` | 7.75:1 | Pass |
| Text on hovered row or tile | 4.5:1 | `#f3f0fa` on `#1f1830` | 15.15:1 | Pass | `#14101c` on `#efe9db` | 15.48:1 | Pass |
| Muted text on hovered row or tile | 4.5:1 | `#b4adc6` on `#1f1830` | 7.9:1 | Pass | `#51495f` on `#efe9db` | 7.03:1 | Pass |
| Link / accent text on hovered row or tile | 4.5:1 | `#ff4db8` on `#1f1830` | 5.69:1 | Pass | `#b0006c` on `#efe9db` | 5.66:1 | Pass |
| Mono label on hovered row or tile | 4.5:1 | `#f2c14e` on `#1f1830` | 10.16:1 | Pass | `#5b2bd1` on `#efe9db` | 6.4:1 | Pass |
| Text on lavender tile | 4.5:1 | `#14101c` on `#c4b2ff` | 9.96:1 | Pass | `#14101c` on `#c4b2ff` | 9.96:1 | Pass |
| Muted text on lavender tile | 4.5:1 | `#3d3361` on `#c4b2ff` | 6.05:1 | Pass | `#3d3361` on `#c4b2ff` | 6.05:1 | Pass |
| Text on magenta fill | 4.5:1 | `#0b0912` on `#ff4db8` | 6.6:1 | Pass | `#ffffff` on `#b0006c` | 6.86:1 | Pass |
| Text on gold fill | 4.5:1 | `#0b0912` on `#f2c14e` | 11.78:1 | Pass | `#14101c` on `#f2c14e` | 11.17:1 | Pass |
| Tag text on tag background | 4.5:1 | `#f3f0fa` on `#241c38` | 14.37:1 | Pass | `#14101c` on `#ebe4d3` | 14.79:1 | Pass |
| Text on code background | 4.5:1 | `#f3f0fa` on `#15111f` | 16.48:1 | Pass | `#14101c` on `#ffffff` | 18.74:1 | Pass |
| Focus ring on page (UI, 3:1) | 3.0:1 | `#f2c14e` on `#0b0912` | 11.78:1 | Pass | `#5b2bd1` on `#f6f2ea` | 6.94:1 | Pass |
| Focus ring on surface (UI, 3:1) | 3.0:1 | `#f2c14e` on `#15111f` | 11.06:1 | Pass | `#5b2bd1` on `#ffffff` | 7.75:1 | Pass |
| Focus ring on lavender tile (UI, 3:1) | 3.0:1 | `#14101c` on `#c4b2ff` | 9.96:1 | Pass | `#14101c` on `#c4b2ff` | 9.96:1 | Pass |
| Hairline rule on page (UI, 3:1) | 3.0:1 | `#f2c14e` on `#0b0912` | 11.78:1 | Pass | `#14101c` on `#f6f2ea` | 16.78:1 | Pass |

### Print

| Pair | Needs | Colors | Ratio | Result |
|---|---|---|---|---|
| Body and headings | 4.5:1 | `#000000` on `#ffffff` | 21.0:1 | Pass |
| Muted text (meta, labels) | 4.5:1 | `#333333` on `#ffffff` | 12.63:1 | Pass |
| Soft divider (decorative, not required) | n/a | `#999999` on `#ffffff` | 2.85:1 | n/a (decorative) |

## 5. Tradeoffs

**Weight and requests.**
- One web font: Alfa Slab One, Latin subset, 19,052 bytes of WOFF2, one request, preloaded. Nothing else downloads. Andale Mono costs 0 bytes because it comes from the visitor's system; visitors without it (most Linux, most phones) get their system mono, so labels look different there.
- CSS: 18.9 KB raw across the three files, about 4.7 KB gzipped, no new requests (Astro bundles it).

**Not verified.** I did not run Lighthouse; there is no built site in this session. Contrast was computed from the tokens. Accessibility 100 and the three 0.9+ scores need CI to confirm. The main risk to watch is CLS from the display font swapping in: the fallback stack (Rockwell, Roboto Slab, Georgia) has different metrics. The preload narrows the gap; if CI reports a shift, add `size-adjust` and `ascent-override` to a fallback `@font-face`.

**Motion.** Minimal. Colors and backgrounds on links, tiles and rows transition for 120ms, and only inside `prefers-reduced-motion: no-preference`. Nothing moves otherwise. You didn't pick a level, so this is my default; "none" is one deleted rule.

**Dark default.** Visitors with no stated preference see dark. Visitors whose system says light see light. If you would rather default to light, swap which block sits on `:root`.

**Light is the derived look.** On light, gold cannot be text, so mono labels turn violet and gold is fills only. The lavender tile is the same in both schemes.

**Middle ground.** The ruled grid keeps the Westinghouse reference; rounding is limited to the Home frame (1rem) and small controls (0.5rem). There are no shadows or gradients. Many rules still make pages denser than the baseline, which is the intent.

**Generated numbers.** Nav and list numerals are CSS counters. They are given an empty alt (`content: ... / ''`) so screen readers skip them. Browsers that don't support that syntax fall back to reading them aloud ("01 Home"), which is noisy but not wrong.

**One components file.** I moved component styles out of each `.astro` file into `components.css` so the design canvas and the site share one source. If you prefer Astro's scoped styles, paste each block into its component's `<style is:global>`; class names are already unique.

**What the canvas does differently from the repo.** The canvas loads Alfa Slab One from Google Fonts (it can't use your self-hosted file). The CSS files are otherwise the real ones.

**Illustration.** None. The IIDX poster's character art is not something to imitate; the geometric shapes stand in. If you have your own artwork, it would drop into the hero tile or the panel tile; images cost bytes (budget under 100 KB, WebP or AVIF, with width and height set).

**Open items for you.** The final display face after you see it on a real page (Bitter 900 is the closest alternative, 18.4 KB); and the placeholder copy on every page except the Home lede and the "site is part of the project" sentence, which are your existing words.
