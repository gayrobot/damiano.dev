# damiano.dev: Spec Sheet direction, with the letterhead

The written hand-off for the site's visual identity. Live artboards are on the Design canvas ("damiano.dev Spec Sheet"). Revision 4, 2026-11-14: Skylar's 2020 letterhead (`claude/design-system-letterhead.md` in the project) is now part of the system.

## How revision 4 landed in the repo

This hand-off was written without access to the repo, so a few things changed on the way in:

- **Styles were merged, not copied.** The repo had moved on since revision 3 (`--measure-article`, the `.tile-row` grid, transcript styles). Those stay; the revision 4 changes were applied on top.
- **The PDF uses the existing flow.** No Playwright, `pdfjs-dist` or new CI steps. `npm run resume:pdf` serves `dist/` and prints `/resume/letterhead/` with local Chrome to `public/downloads/Skylar_Damiano_Resume.pdf`, which is committed as before. `scripts/build-resume-pdf.mjs`, `scripts/check-pdf-privacy.mjs` and `docs/letterhead-wiring.md` weren't added.
- **The letterhead page is public**, so Lighthouse and the link check cover it. It has a viewport and description, no `noindex`, and the name is its `h1`.
- **Jobs with headed groups.** `ResumeLetterhead` takes `groups` (a heading and bullets) for a job's `sections` and `projects`. Certifications get their own section before Skills. The summary and headline aren't on the letterhead.
- **Estimated spacing was tightened to fit two pages:** `--lh-top` 58 → 54pt, `--lh-bottom` 48 → 36pt, `--lh-gap-section` 14 → 12pt, `--lh-gap-entry` 8 → 6pt. Still estimates; check them against the 2020 original.
- The placeholder PDF is kept in `examples/` for comparison.
- **After review, Skylar replaced the section tiles' flat shapes** with magenta line icons, plus each tile's nav number set large and faded in the top right, in the resume watermark's color and opacity. The small mono number label went with them.

## Decisions on record

| Question | Decision |
|---|---|
| Direction | A, "Spec Sheet": a Rand-style ruled grid, flat shapes, mono labels. |
| Shape | Middle ground: ruled cells in one frame with a 1rem corner; 0.5rem on buttons, tags and the current nav item. |
| Panel color | Soft lavender `#c4b2ff` with ink text (the dark purple was rejected). |
| Logo | Skylar's SJ monogram replaces the SD half-disc mark everywhere: Home tile, favicon, resume watermark, PDF. |
| heroic.vers mark | Removed from the site. |
| Type | The letterhead pairing: Futura (as self-hosted Jost) for headings and text, a mono for the name, labels and nav. Alfa Slab One is dropped. |
| Rail | The letterhead's left rail on every page, in magenta (`--color-rail`). |
| Resume PDF | Matches the letterhead, no phone number; footer location "Chicago, IL", not the street address. |

## 1. Rationale

The site reads like a specification sheet for a person, set on Skylar's own letterhead. A hairline grid cuts Home into rectangles, the way Paul Rand's Westinghouse manual cover does. A few flat shapes carry the color, and mono labels and numbered indexes replace card chrome. The letterhead supplies the rest: the double rule with diagonal breaks running down the left edge, the SJ monogram, Futura with a mono name, and section heads with a trailing colon. The lavender tile holds the monogram where Rand puts his logo tile.

It reacts against the baseline template (centered column, grey lede, blue links, rounded cards) and against the obvious 2020s moves: no gradients, glow, synthwave grids or copied poster art. Colors are flat: magenta (`#ff4db8` on dark, `#b0006c` on light) for links, the rail and the hot mark; gold for rules, fills and focus; lavender for the one panel. Dark is the default. The resume PDF stays strictly ink on white, like the letterhead.

## 2. Files

| File | What it is |
|---|---|
| `src/styles/tokens.css` | Every raw value. Dark default, light by media query, `[data-theme]` overrides, print palette in letterhead ink, self-hosted `@font-face`, letterhead `--lh-*` measurements. |
| `src/styles/global.css` | Base elements, the rail (`body::before`), heading weights, `.label`, skip link, print rules. |
| `src/styles/components.css` | All component styles, class-based. Import after `global.css`. |
| `src/styles/letterhead.css` | Styles for the PDF page only. Not imported by `Base.astro`. |
| `src/layouts/Base.astro` | `width` prop (`reading` / `wide`), favicon, preloads Jost 400 and 500, imports the three site stylesheets. |
| `src/components/Header.astro`, `Footer.astro`, `PageHeader.astro`, `Tag.astro`, `EntryList.astro`, `Tile.astro`, `Spec.astro`, `BuildStamp.astro` | As before. The wordmark is now mono. |
| `src/components/Monogram.astro` | The SJ monogram inlined; `class="monogram"` (Home tile) or `class="watermark"` (resume). Replaces `SdMark.astro`. |
| `src/components/ResumeLetterhead.astro` | The resume as the letterhead: a whole HTML document, typed props, no phone field. |
| `src/assets/sj-monogram.svg` | The exact vector from the letterhead PDF, with its `translate()` transforms baked into the path coordinates (Chromium drops transformed paths when it repeats a fixed element on page 2). Checked against the original: identical to the pixel. |
| `public/rail-mask.svg` | One 60×49 tile of the rail, used as a CSS mask so the color comes from a token. |
| `public/favicon.svg` | SJ in ink on a lavender rounded square. |
| `public/fonts/` | Jost 400, 400 italic, 500, 500 italic; M PLUS 1 Code 400; both SIL OFL, licences included. |
| `scripts/build-resume-pdf.mjs` | After `astro build`: serves `dist/`, prints the letterhead page to `dist/skylar-damiano-resume.pdf` with Playwright. |
| `scripts/check-pdf-privacy.mjs` | Fails CI if the PDF text contains a phone number, a `t:` label or a street-address shape. |
| `docs/letterhead-wiring.md` | The three steps left to connect the PDF to `resume.yaml`. |

Removed since revision 3: `SdMark.astro`, `sd-mark.svg`, the logo options, Alfa Slab One.

### Tokens changed in this revision

| Token | Now |
|---|---|
| `--font-display`, `--font-sans` | `'Jost', Futura, 'Futura PT', …` |
| `--font-mono` | `'Andale Mono', 'M PLUS 1 Code', ui-monospace, …` |
| Print palette | Letterhead ink `#231f20` instead of `#000`. |

Added: `--weight-book`, `--weight-medium`, `--color-rail`, `--color-watermark`, `--watermark-opacity`, `--rail-width`, `--rail-tile-h`, `--rail-width-sm`, `--rail-tile-h-sm`, `--watermark-w`, `--watermark-w-sm`, and the `--lh-*` letterhead set. Earlier revisions added `--color-surface-hover`, `--radius-frame`, `--radius-round`, `--text-code`, `--text-print-title`. Renames from the baseline still stand: `--color-border` → `--color-rule`, `--color-accent-contrast` → `--color-on-accent`.

`@page` rules can't read custom properties, so `global.css` keeps `@page { margin: 0.6in }` and `letterhead.css` keeps `@page { size: letter; margin: 0 }` as literals. Everything else is a token.

## 3. Page by page

**Every page.** The rail runs down the left edge, fixed: a 4px and a 2px rule broken by diagonal slashes every 49px, in magenta. The body is padded so nothing sits under it. Under 36rem it drops to half scale (30px). The header wordmark is mono, like the name on the letterhead.

**Home** (`width="wide"`). Ruled cells inside one rounded frame:
- hero: the existing h1 and lede;
- the lavender tile with the SJ monogram in ink;
- three numbered section tiles with flat shapes (since replaced; see the top of this doc);
- the Spec panel listing only checks CI enforces.

Two columns under 52rem, one under 36rem.

**List page.** A numbered index: heavy rule on top, hairlines between rows. The whole row is the link. Mono meta, small outlined tags.

**Detail page (essay).** One 42rem column of Jost at 17px and 1.65 leading. h2 under a 2px rule. Links magenta with a permanent 2px underline.

**Resume, screen.** The quiet page. The SJ monogram sits top right behind the header as a watermark: paper at 10% on dark, ink at 12% on light. The letterhead's 25% fails AA for muted text and links on screen (4.41:1 and 3.56:1), so it's lighter here. Section heads follow the letterhead: Futura Medium a size up, with a trailing colon generated in CSS and hidden from screen readers. School names use `.school` (Medium Italic). Download PDF is a gold button.

**Resume, browser print.** The tokens swap to letterhead ink on white. Header, footer and button are hidden, and the rail prints down every page.

**Resume PDF.** A separate page rendered by `ResumeLetterhead.astro` and printed by the build script. It's built from the letterhead measurements:
- the rail at x = 24.25 and 42.1pt;
- the monogram at 446–576 × 21–185pt, at 25%;
- the name in the mono at x = 68pt;
- the body's left edge at 68pt;
- the footer 18pt from the bottom: `e-: <email>  a: Chicago, IL`.

The rail, monogram, name and footer repeat on every page, and body text runs over the monogram on page 2, as in the original. Section heads are Medium with a colon, role titles Medium, school names Medium Italic, everything else Book. Bullets are "•" set against the text with no indent. Tested with placeholder content: two pages, Jost and M PLUS 1 Code embedded, 22 KB.

## 4. Contrast

Computed by script from `tokens.css`. WCAG 2.x ratios; text needs 4.5:1, UI parts 3:1. The rail and the monogram are decorative and carry no requirement.

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

### Text over the resume watermark (screen)

The monogram sits behind the resume header. Lighthouse can't see through an SVG to measure this, so it's computed here from the blended color.

| Text over the watermark | Needs | Dark (paper at 10% on `#0b0912` = `#222029`) | Dark | Light (ink at 12% on `#f6f2ea` = `#dbd7d1`) | Light |
|---|---|---|---|---|---|
| Body text | 4.5:1 | `#f3f0fa`: 14.28:1 | Pass | `#14101c`: 13.08:1 | Pass |
| Muted text | 4.5:1 | `#b4adc6`: 7.45:1 | Pass | `#51495f`: 5.94:1 | Pass |
| Link / accent | 4.5:1 | `#ff4db8`: 5.36:1 | Pass | `#b0006c`: 4.78:1 | Pass |
| Mono label | 4.5:1 | `#f2c14e`: 9.58:1 | Pass | `#5b2bd1`: 5.4:1 | Pass |

### Print and the resume PDF

| Pair | Needs | Colors | Ratio | Result |
|---|---|---|---|---|
| Text (letterhead ink) | 4.5:1 | `#231f20` on `#ffffff` | 16.3:1 | Pass |
| Text over the 25% monogram | 4.5:1 | `#231f20` on `#c8c7c7` | 9.66:1 | Pass |

## 5. Tradeoffs

**Weight.**
- **Fonts:** Jost is 9.4 KB (400), 10.5 KB (500), 11.1 KB (400 italic) and 12.0 KB (500 italic). A typical page fetches the two preloaded upright weights, about 20 KB. M PLUS 1 Code (9.4 KB) only downloads for visitors without Andale Mono. The old Alfa Slab One (19 KB) is gone.
- **CSS:** 23.9 KB raw across tokens, global and components, about 6.1 KB gzipped.
- **Monogram:** 2.3 KB, inlined.
- **Rail mask:** 0.5 KB.
- **Favicon:** 3 KB.

**Checked here, in a throwaway Astro 5 project with placeholder pages:**
- the components build;
- Lighthouse scored 100 in all four categories on Home and Resume, in the default dark scheme;
- the PDF renders with the right fonts on two pages;
- the privacy gate passes it, and fails a copy with a planted phone number and street address.

None of this ran in your repo or CI. Confirm there.

**Estimated, not measured.** The brief has positions but no type sizes. Name 18pt, section heads 14pt, role titles 11pt, body 9.5pt, footer 8pt, and the top and bottom spacing are estimates, marked `(est.)` in `tokens.css`. Compare one generated page against the 2020 PDF and adjust the `--lh-*` tokens.

**Font stand-ins.**
- Jost is close to Futura but not identical. The `a`, `t` and the bullet glyph differ, and Jost's bullet is small. Real Futura needs a web licence; Futura PT is on Adobe Fonts, which can't be self-hosted.
- Osaka-Mono is an Apple system font with no web licence. The PDF uses M PLUS 1 Code, so it looks the same when CI renders it on Linux. On the site, Mac visitors see Andale Mono.

**Rail.** Drawn with a CSS mask so a token sets its color. Masks are supported unprefixed in current Chrome, Firefox and Safari, with a `-webkit-` copy for older Safari. Where a mask fails to load, the rail disappears rather than showing a solid bar. It takes 60px of width on desktop and 30px on phones.

**Magenta rail.** You chose an accent-colored rail. I picked magenta over gold because gold on the light paper is too faint to read as a line. Change `--color-rail` to `var(--color-gold)` in the dark block to try gold there.

**Section-head colons.** Generated in CSS on the resume only, and hidden from screen readers with `content: ':' / ''`. Browsers without that syntax read the colon aloud, which is harmless. Not applied site-wide; easy to extend.

**Motion.** 120ms color transitions only, off under reduced motion.

## 6. Open items

- Map `src/data/resume.yaml` onto `ResumeLetterhead` (`docs/letterhead-wiring.md`). I couldn't read the repo from this session, so the component takes a small typed shape instead of guessing your field names.
- Check the estimated letterhead type sizes against the original PDF.
- Whether the colon-headed sections should spread beyond the resume ("Projects:", "Musings:").
