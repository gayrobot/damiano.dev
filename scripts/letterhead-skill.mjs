// Builds the Cowork letterhead skill (cowork/build/letterhead.zip) from the built site, so
// anything Claude Cowork prints uses the same letterhead as the resume PDF.
// Run `npm run build` first. Needs Google Chrome installed (for the blank letterhead PDF).
//
// It takes dist/resume/letterhead/index.html (the page `npm run resume:pdf` prints), inlines
// its stylesheet and fonts so it works as one file with no server, and swaps the resume body
// for a slot. The skill's own files (SKILL.md, the print script, the letter example) live in
// cowork/letterhead-skill/ and are copied in alongside.
//
// Output, all gitignored:
//   cowork/build/letterhead/template.html          the letterhead with an empty body slot
//   cowork/build/letterhead/letterhead-blank.pdf   one blank letterhead page, for stamping
//   cowork/build/letterhead/examples/resume-body.html  the current resume body, as markup
//   cowork/build/letterhead.zip                    the folder above, ready to upload
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

const run = promisify(execFile);
const DIST = resolve('dist');
const PAGE = join(DIST, 'resume/letterhead/index.html');
const SRC = resolve('cowork/letterhead-skill');
const BUILD = resolve('cowork/build');
const OUT = join(BUILD, 'letterhead');
const SLOT = '<!-- LETTERHEAD-BODY -->';
const CHROME =
  process.env.CHROME_PATH ??
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(
    existsSync,
  );
if (!CHROME) throw new Error('Chrome not found; set CHROME_PATH');
if (!existsSync(PAGE)) throw new Error('dist/resume/letterhead/ not found; run `npm run build` first');

let html = await readFile(PAGE, 'utf-8');

// Fonts as data URIs, so the template needs no /fonts/ path.
const inlineFonts = async (css) => {
  for (const [match, path] of css.matchAll(/url\((\/fonts\/[^)]+\.woff2)\)/g)) {
    const data = (await readFile(join(DIST, path))).toString('base64');
    css = css.replaceAll(match, `url(data:font/woff2;base64,${data})`);
  }
  return css;
};

// Linked stylesheets become inline <style> blocks.
for (const [tag, href] of [...html.matchAll(/<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)">/g)]) {
  const css = await inlineFonts(await readFile(join(DIST, href), 'utf-8'));
  html = html.replace(tag, () => `<style>${css}</style>`);
}
html = await inlineFonts(html);

// Font preloads and the favicon point at site paths that won't exist next to the template.
html = html.replace(/<link rel="(?:preload|icon)"[^>]*>/g, '');
if (/(?:href|src)="\/(?!\/)/.test(html) || /url\(\/(?!\/)/.test(html)) {
  throw new Error('template still references a site path; inline it in scripts/letterhead-skill.mjs');
}

// Swap the resume body for the slot, keeping the resume as an example of the markup.
const open = '<td class="lh-body">';
const start = html.indexOf(open);
const end = html.indexOf('</td>', start);
if (start < 0 || end < 0) throw new Error('could not find <td class="lh-body"> in the letterhead page');
const resumeBody = html.slice(start + open.length, end);
html = html.slice(0, start + open.length) + SLOT + html.slice(end);
html = html.replace(/<meta name="description"[^>]*>/, '');
// The page's title says "resume"; the template is for any document, so keep only the name.
html = html.replace(/<title>([^<:]+):[^<]*<\/title>/, '<title>$1</title>');

await rm(BUILD, { recursive: true, force: true });
await mkdir(join(OUT, 'examples'), { recursive: true });
await cp(SRC, OUT, { recursive: true });
await writeFile(join(OUT, 'template.html'), html);
await writeFile(
  join(OUT, 'examples/resume-body.html'),
  `<!-- The resume on damiano.dev, as letterhead markup. Generated from src/data/resume.yaml. -->\n${resumeBody.replace(/></g, '>\n<')}\n`,
);

// The blank page is the template printed with nothing in the slot.
await run(CHROME, [
  '--headless',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--virtual-time-budget=5000',
  `--print-to-pdf=${join(OUT, 'letterhead-blank.pdf')}`,
  pathToFileURL(join(OUT, 'template.html')).href,
]);

// Skill uploads expect the skill's folder at the top of the zip.
await run('zip', ['-qrX', 'letterhead.zip', 'letterhead', '-x', '*.DS_Store'], { cwd: BUILD });
console.log(`wrote ${OUT}/ and ${join(BUILD, 'letterhead.zip')}`);
