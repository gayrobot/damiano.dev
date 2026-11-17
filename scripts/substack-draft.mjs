// Turns a published musing into what a Substack draft needs: title, subtitle, and body
// HTML. Substack has no API for writing posts, so this only prepares the content; the
// draft is made in the Substack editor and Skylar presses Publish. See docs/substack.md.
//
// Usage: npm run build && npm run substack:draft -- <musing-id>
// Writes dist/substack/<id>.json ({ title, subtitle, url, html }) and dist/substack/<id>.html.
//
// The body comes from the built page, not the markdown, so Substack gets exactly what the
// site renders. Links and images are made absolute, and the post ends with a link back to
// the musing on damiano.dev.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parse } from 'yaml';

export const SITE = 'https://damiano.dev';

// The inner HTML of the first <div class="prose">, matching nested divs.
export const extractProse = (page) => {
  const open = page.match(/<div class="prose">/);
  if (!open) throw new Error('no <div class="prose"> in the page');
  const start = open.index + open[0].length;
  const tag = /<(\/?)div\b[^>]*>/g;
  tag.lastIndex = start;
  let depth = 1;
  for (let m; (m = tag.exec(page)); ) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return page.slice(start, m.index).trim();
  }
  throw new Error('unclosed <div class="prose">');
};

// Root-relative links and images point at the live site. Heading ids only mean
// something on damiano.dev, so they go.
export const toSubstackHtml = (prose, url) => {
  const body = prose
    .replace(/(\s(?:href|src))="\/(?!\/)/g, `$1="${SITE}/`)
    .replace(/(<h[1-6])\s+id="[^"]*"/g, '$1');
  return `${body}\n<hr>\n<p><em>Originally published at <a href="${url}">damiano.dev</a>.</em></p>`;
};

export const readFrontmatter = (markdown) => {
  const m = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!m) throw new Error('no frontmatter');
  return parse(m[1]);
};

const main = (id) => {
  if (!id || !/^[a-z0-9-]+$/.test(id)) throw new Error('Usage: npm run substack:draft -- <musing-id>');
  const source = `src/content/musings/${id}.md`;
  if (!existsSync(source)) throw new Error(`${source} not found`);
  const { title, summary, approved } = readFrontmatter(readFileSync(source, 'utf-8'));
  if (approved !== true) throw new Error(`${source} isn't approved: true`);

  const built = `dist/musings/${id}/index.html`;
  if (!existsSync(built)) throw new Error(`${built} not found; run \`npm run build\` first`);
  const url = `${SITE}/musings/${id}/`;
  const html = toSubstackHtml(extractProse(readFileSync(built, 'utf-8')), url);

  const out = 'dist/substack';
  mkdirSync(out, { recursive: true });
  writeFileSync(join(out, `${id}.json`), JSON.stringify({ title, subtitle: summary, url, html }, null, 2));
  writeFileSync(join(out, `${id}.html`), html);
  console.log(`Wrote ${out}/${id}.json and ${out}/${id}.html`);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    main(process.argv[2]);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
