# Adding a section

A section is a kind of thing the site shows: projects, musings, and whatever comes next (talks, notes, reading list). Each one is a content collection plus pages. There is no plugin system; a section is five small, predictable pieces.

## The fast way

```sh
npm run new:section -- notes "Notes"
npm run build
```

`<name>` is lowercase letters and digits (it becomes the URL and the collection name). The script creates the pieces below with a fixture entry, and edits only `src/content.config.ts` and `src/data/nav.ts`. Then make the schema fit and replace the fixture.

## The pieces

| Piece | Where | Rule |
|---|---|---|
| Collection | `src/content.config.ts` | `defineCollection` with a `glob` loader and a `.strict()` schema. Add it to `export const collections`. |
| Schema | same file | Required fields fail the build when missing. Gate anything that needs Skylar's sign-off the way `musings` does (`approved: z.literal(true)`). |
| Content | `src/content/<name>/*.md` | Fixture entries are obviously fake. Real content only from facts Skylar has confirmed. |
| Pages | `src/pages/<name>/index.astro` and `[id].astro` | List page and detail page, both using `layouts/Base.astro`. |
| Nav | `src/data/nav.ts` | One entry with `href: '/<name>'`. |

## What checks cover it

- **Section check** (`npm run check:sections`, run in the `build` job): every collection needs a schema, a page, a nav entry and a content folder, and every folder in `src/content/` needs a collection.
- **Type check and build** (`build`, required): the schema validates every entry; a bad entry fails the build.
- **Content lint and privacy gate** (`content`, privacy gate required): scan everything under `src/content/`, `src/pages/` and `src/data/`.
- **Lighthouse and links** (advisory): run on the built pages. New pages need to keep accessibility at 100.

## How it's tested

`npm test` runs `tests/sections.test.mjs`: it scaffolds a throwaway section in a temp copy of `src/`, confirms the check passes, then removes the page, nav entry, schema and collection one at a time and confirms the check catches each. Beyond that, the build itself is the test: if the fixture entry renders, the section works.

## Checklist for a new section

1. `npm run new:section -- <name> "<Label>"`
2. Edit the schema in `src/content.config.ts`.
3. Adjust the pages if the entries need different fields shown.
4. `npm run check:sections && npm test && npm run build`
5. Open a PR. Mention anything that needs sign-off before real content goes in.

## Removing a section

Delete its collection, `src/content/<name>/`, `src/pages/<name>/` and its nav entry. The section check fails if any piece is left behind.
