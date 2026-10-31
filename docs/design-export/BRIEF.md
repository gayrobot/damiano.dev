# damiano.dev — design brief for Claude Design

You're getting this because the site's current look is a model's default, and Skylar (the owner) doesn't accept defaults. Treat everything under "What exists now" as a baseline to beat, not a direction to respect.

## The ask

Design the visual identity for **damiano.dev**, a personal site for Skylar Damiano: applied-AI work, IT and identity engineering, a resume, and short essays ("musings") on how Skylar and AI work together.

Skylar's position: in the age of AI, **taste matters more than skill**. Anything a model picks unprompted is the average of its training data. The design should read as chosen by a person with opinions. Ask Skylar for those opinions before committing (see "Taste inputs I don't have").

## About the site

- **Audience:** hiring managers and peers in IT, identity, security and applied AI; readers of the essays.
- **Voice:** casual and plain. No corporate-speak (the repo lints for it). First person.
- **The real project is the harness**: the checks, permissions and policies that let an AI agent change the site safely, with every change as a pull request. The site is the fixture. The design can lean into that or ignore it; Skylar's call.
- **Pages today:** Home, Projects (list and detail), Musings (list and detail), Resume (long, structured, with a PDF twin). More sections will be added over time with a scaffold, so the system must extend without redesign.
- **Content today is placeholder.** Projects and musings are fixtures. Don't design around invented content, and don't write copy that makes claims about Skylar.

## Hard constraints (these are enforced by CI)

- **Static site** (Astro, static output) on Cloudflare Workers. No server code.
- **Lighthouse on built pages:** accessibility must be exactly 100; performance, best practices and SEO at least 0.9. A design that fails these can't merge.
- **Accessibility:** WCAG AA contrast minimum in every color scheme, visible keyboard focus, skip link, one h1 per page, sensible heading order.
- **Light and dark** both supported via `prefers-color-scheme`.
- **Responsive**, down to about 360px.
- **Tokens only:** all colors, type sizes, spacing and radii live in one CSS file as custom properties. Components and pages never use raw values. Deliver the design as a new `tokens.css` and component styles, not as one-off CSS.
- **Plain CSS and Astro components.** No CSS framework, no JS UI library. Small scripts are OK if they earn their weight.
- **Assets:** the baseline uses system fonts and no external requests. Web fonts or images are allowed if you self-host them and Lighthouse performance stays at 0.9 or better. Say what each costs.
- **Print:** the resume page should print cleanly.

## What exists now (baseline, all model defaults)

| Area | Current choice |
|---|---|
| Palette (light) | warm off-white `#faf8f4`, near-black text, blue accent `#0b5cad` |
| Palette (dark) | `#151515` background, light-blue accent `#7ab8f5` |
| Type | system serif for headings, system sans for body, fluid scale, 1.65 line height |
| Layout | single centered column, 42rem measure, header with text wordmark and four links, one-line footer |
| Components | `Header`, `Footer`, `PageHeader` (h1 + lede), `EntryList` (bordered cards), `Tag` (pill) |
| Personality | none, on purpose or otherwise |

Screenshots are in `screens/` (`*-light`, `*-dark` at 1200px, `*-mobile` at 390px). The full source is in `source/` and is short (Astro files carry a `.txt` suffix). `tokens.css` is the file to replace.

## What to deliver

1. A short **design rationale**: the idea, in a few sentences, and what it's reacting against.
2. A new **`tokens.css`** with the same token names where they still make sense (rename freely, but list every rename), light and dark.
3. Updated **`global.css`** and component styles, and any new components with where they'd be used.
4. A **page-by-page note** for Home, a list page, a detail page (essay reading experience), and Resume (screen and print).
5. A **contrast table** for every text/background pair in both schemes.
6. A list of **tradeoffs** against the constraints above (fonts, weight, motion).

## Taste inputs I don't have (ask Skylar first)

I made up the baseline. These are Skylar's to answer, and the answers should drive the design:

- Sites, print, products, album covers or anything else Skylar thinks look right, and what specifically about them.
- Sites or styles Skylar finds generic or wants to avoid.
- Three adjectives for how the site should feel, and one for how it must not.
- Serif, sans, mono, or a mix; any typefaces Skylar already loves.
- Color: any palette Skylar is drawn to (there is a DJ and music side to Skylar's life, if that's relevant); anything to avoid.
- How much personality in the resume page, which is read by hiring managers, versus the musings, which are read by choice.
- Whether the "an agent builds this site under a harness" story should be visible in the design, or stay in the words.
- Motion: none, minimal, or expressive.

## Process note

Skylar will merge the baseline into the repo before this work lands, so the evolution is tracked in git history. Deliver your design as changes against `src/styles/` and `src/components/`, and it will go through the same PR and CI path as everything else.
