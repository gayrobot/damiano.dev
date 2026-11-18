// Run with: npm test. Checks the Substack draft prep (scripts/substack-draft.mjs) on
// fixture HTML, so it doesn't need a build.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractProse, readFrontmatter, toSubstackHtml } from '../scripts/substack-draft.mjs';

const page = `<main><div class="header"><h1>Title</h1></div><div class="prose">
<p>One</p>
<div class="callout"><p>Nested</p></div>
<p>Two</p>
</div></main><footer><div>site footer</div></footer>`;

test('extracts the prose body, nested divs included, and nothing after it', () => {
  const prose = extractProse(page);
  assert.match(prose, /^<p>One<\/p>/);
  assert.match(prose, /<div class="callout"><p>Nested<\/p><\/div>/);
  assert.match(prose, /<p>Two<\/p>$/);
  assert.doesNotMatch(prose, /site footer|<h1>/);
});

test('fails loudly when the page has no prose block', () => {
  assert.throws(() => extractProse('<main><p>hi</p></main>'), /no <div class="prose">/);
  assert.throws(() => extractProse('<div class="prose"><p>hi</p>'), /unclosed/);
});

test('makes site links absolute, keeps external links, drops heading ids, links back', () => {
  const html = toSubstackHtml(
    '<h2 id="round-one">Round one</h2><p><a href="/projects/pioneerbox">box</a> <a href="https://example.com/x">ext</a> <a href="//cdn.example.com/y">proto</a> <img src="/img/a.png"></p>',
    'https://damiano.dev/musings/m',
  );
  assert.match(html, /<h2>Round one<\/h2>/);
  assert.match(html, /href="https:\/\/damiano\.dev\/projects\/pioneerbox"/);
  assert.match(html, /href="https:\/\/example\.com\/x"/);
  assert.match(html, /href="\/\/cdn\.example\.com\/y"/);
  assert.match(html, /src="https:\/\/damiano\.dev\/img\/a\.png"/);
  assert.match(html, /Originally published at <a href="https:\/\/damiano\.dev\/musings\/m">damiano\.dev<\/a>/);
});

test('reads title and summary from frontmatter', () => {
  const fm = readFrontmatter('---\ntitle: "A: b"\nsummary: S\n---\n\nBody');
  assert.deepEqual(fm, { title: 'A: b', summary: 'S' });
});
