// Flags corporate-speak in site content. Phrases live in harness/content-lint.yml.
import { readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { contentLines, escapeRegExp } from './lib/content-files.mjs';

const { phrases } = parse(readFileSync('harness/content-lint.yml', 'utf-8'));
const patterns = phrases.map((p) => ({ p, re: new RegExp(`(?<![\\w-])${escapeRegExp(p)}(?![\\w-])`, 'i') }));

const hits = contentLines().flatMap(({ file, line, text }) =>
  patterns.filter(({ re }) => re.test(text)).map(({ p }) => `${file}:${line}: "${p}"`),
);

if (hits.length) {
  console.error(`Corporate-speak found (say it the way you'd say it out loud):\n${hits.map((h) => `  ${h}`).join('\n')}`);
  process.exit(1);
}
console.log('Content lint: clean.');
