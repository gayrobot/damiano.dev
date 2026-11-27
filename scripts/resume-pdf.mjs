// Builds public/downloads/Skylar_Damiano_Resume.pdf by printing the letterhead page
// (/resume/letterhead/, from src/pages/resume/letterhead.astro) out of the built site,
// so the PDF and /resume share src/data/resume.yaml. Needs Google Chrome installed.
// Run `npm run build` first: the build validates the data and renders the page.
//
// Serves dist/ on a local port so the page's absolute /fonts/... URLs resolve. The fonts
// are self-hosted, so the PDF looks the same on any machine.
//
// Body text wraps around the monogram on every page. The page only wraps page 1 on its own;
// for more, the float needs the page count (see wrapStyle and letterhead.css), so the page is
// printed with a guess of 1, its pages counted, and printed again with the new count until it
// holds.
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { promisify } from 'node:util';

const ROOT = resolve('dist');
const PAGE = '/resume/letterhead/';
const OUT = resolve('public/downloads/Skylar_Damiano_Resume.pdf');
const CHROME =
  process.env.CHROME_PATH ??
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(
    existsSync,
  );
if (!CHROME) throw new Error('Chrome not found; set CHROME_PATH');
if (!existsSync(join(ROOT, PAGE, 'index.html'))) throw new Error(`dist${PAGE} not found; run \`npm run build\` first`);

// Extends the monogram float over `pages` pages: one band per page, as a polygon. Kept in
// step with wrap_style() in cowork/letterhead-skill/scripts/make_pdf.py.
const wrapStyle = (pages) => {
  if (pages <= 1) return '';
  const pts = [];
  for (let k = 0; k < pages; k++) {
    const top = `calc(${k} * var(--lh-body-h))`;
    const bottom = `calc(${k} * var(--lh-body-h) + var(--lh-clear-band))`;
    pts.push(`0 ${top}`, `100% ${top}`, `100% ${bottom}`, `0 ${bottom}`);
  }
  return (
    '<style>.lh-body::before{' +
    `height:calc(${pages - 1} * var(--lh-body-h) + var(--lh-clear-band));` +
    `shape-outside:polygon(${pts.join(', ')})}</style>`
  );
};

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  try {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
    let file = join(ROOT, path);
    if (!file.startsWith(ROOT)) throw new Error('outside dist');
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
    let body = await readFile(file);
    const pages = new URL(req.url, 'http://x').searchParams.get('pages');
    if (pages && extname(file) === '.html') {
      body = body.toString('utf-8').replace('</head>', `${wrapStyle(Number(pages))}</head>`);
    }
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();

const countPages = async (pdf) => ((await readFile(pdf, 'latin1')).match(/\/Type\s*\/Page(?![A-Za-z])/g) ?? []).length;

try {
  // More pages only ever means more wrapping, so the count can only grow; stop when it holds.
  let pages = 1;
  for (let pass = 0; pass < 10; pass++) {
    await promisify(execFile)(CHROME, [
      '--headless',
      '--disable-gpu',
      '--no-pdf-header-footer',
      // Gives the self-hosted fonts time to load before printing.
      '--virtual-time-budget=5000',
      `--print-to-pdf=${OUT}`,
      `http://127.0.0.1:${port}${PAGE}?pages=${pages}`,
    ]);
    const printed = await countPages(OUT);
    if (printed <= pages) break;
    pages = printed;
  }
  console.log(`wrote ${OUT} (${pages} page${pages === 1 ? '' : 's'})`);
} finally {
  server.close();
}
