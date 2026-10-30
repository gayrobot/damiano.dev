// Scans content for personal details before merge. Generic patterns come from
// harness/privacy.yml; specific terms come from the PRIVACY_DENYLIST env var
// (a GitHub secret in CI) or, locally, from harness/privacy-denylist.local.txt
// (gitignored). Matches print file:line and the pattern name, never the match
// itself, so CI logs don't repeat the thing we're trying to keep out.
import { existsSync, readFileSync } from 'node:fs';
import { parse } from 'yaml';
import { contentLines, escapeRegExp } from './lib/content-files.mjs';

const config = parse(readFileSync('harness/privacy.yml', 'utf-8'));
const allowedEmails = new Set(config.allowed_emails.map((e) => e.toLowerCase()));
const allowedUrls = config.allowed_urls ?? [];
const patterns = Object.entries(config.patterns).map(([name, src]) => ({ name, re: new RegExp(src, 'g') }));

const LOCAL = 'harness/privacy-denylist.local.txt';
const rawDenylist = process.env.PRIVACY_DENYLIST ?? (existsSync(LOCAL) ? readFileSync(LOCAL, 'utf-8') : '');
const terms = rawDenylist.split('\n').map((t) => t.trim()).filter((t) => t && !t.startsWith('#'));
const denylist = terms.map((t) => new RegExp(`(?<![\\w])${escapeRegExp(t)}(?![\\w])`, 'i'));

if (terms.length === 0) {
  console.warn('warning: no denylist supplied (PRIVACY_DENYLIST unset); only generic patterns were checked.');
}

const hits = [];
for (const { file, line, text: raw } of contentLines()) {
  const text = allowedUrls.reduce((t, u) => t.replaceAll(u, ''), raw);
  for (const { name, re } of patterns) {
    for (const m of text.matchAll(re)) {
      if (name === 'email' && allowedEmails.has(m[0].toLowerCase())) continue;
      hits.push(`${file}:${line}: ${name}`);
    }
  }
  denylist.forEach((re, i) => {
    if (re.test(text)) hits.push(`${file}:${line}: denylist term #${i + 1}`);
  });
}

if (hits.length) {
  console.error(`Possible personal details found:\n${hits.map((h) => `  ${h}`).join('\n')}`);
  process.exit(1);
}
console.log(`Privacy gate: clean (${terms.length} denylist terms).`);
