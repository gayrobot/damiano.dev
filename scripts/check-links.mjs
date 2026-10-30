// Checks every link and asset reference in the built HTML (dist/).
// Internal links must resolve to a built file (hard failure). External links
// only fail on a definite 404/410; timeouts and 5xx are warnings, since a
// flaky third-party site shouldn't block a merge.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DIST = resolve('dist');
const SITE = 'https://damiano.dev';
if (!existsSync(DIST)) throw new Error('dist/ not found; run `npm run build` first');

const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? htmlFiles(p) : p.endsWith('.html') ? [p] : [];
  });

const internalExists = (path) => {
  const clean = decodeURIComponent(path.split(/[?#]/)[0]);
  const target = join(DIST, clean);
  return [target, join(target, 'index.html'), `${target}.html`].some((p) => existsSync(p) && statSync(p).isFile());
};

const failures = [];
const external = new Map(); // url -> pages it appears on
const ATTR = /\b(?:href|src)\s*=\s*"([^"]*)"/g;

for (const file of htmlFiles(DIST)) {
  const page = file.slice(DIST.length);
  for (const [, raw] of readFileSync(file, 'utf-8').matchAll(ATTR)) {
    const ref = raw.trim();
    if (!ref || ref.startsWith('#') || /^(mailto:|tel:|data:|javascript:)/.test(ref)) continue;
    if (ref.startsWith(SITE)) {
      if (!internalExists(new URL(ref).pathname)) failures.push(`${page}: ${ref} (not built)`);
    } else if (/^https?:\/\//.test(ref)) {
      external.set(ref.split('#')[0], [...(external.get(ref.split('#')[0]) ?? []), page]);
    } else if (!ref.startsWith('//')) {
      const path = ref.startsWith('/') ? ref : join(file.slice(DIST.length, file.lastIndexOf('/') + 1), ref);
      if (!internalExists(path)) failures.push(`${page}: ${ref} (not built)`);
    }
  }
}

const warnings = [];
await Promise.all(
  [...external].map(async ([url, pages]) => {
    try {
      let res = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (res.status === 405 || res.status === 403) res = await fetch(url, { redirect: 'follow', signal: AbortSignal.timeout(15000) });
      if (res.status === 404 || res.status === 410) failures.push(`${pages[0]}: ${url} (${res.status})`);
      else if (!res.ok) warnings.push(`${url} answered ${res.status}`);
    } catch (e) {
      warnings.push(`${url} unreachable (${e.name})`);
    }
  }),
);

for (const w of warnings) console.warn(`warning: ${w}`);
if (failures.length) {
  console.error(`\n${failures.length} broken link(s):\n${failures.map((f) => `  ${f}`).join('\n')}`);
  process.exit(1);
}
console.log(`Checked ${htmlFiles(DIST).length} pages and ${external.size} external links: all good.`);
