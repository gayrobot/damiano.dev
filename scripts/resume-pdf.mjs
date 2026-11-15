// Builds public/downloads/Skylar_Damiano_Resume.pdf by printing the letterhead page
// (/resume/letterhead/, from src/pages/resume/letterhead.astro) out of the built site,
// so the PDF and /resume share src/data/resume.yaml. Needs Google Chrome installed.
// Run `npm run build` first: the build validates the data and renders the page.
//
// Serves dist/ on a local port so the page's absolute /fonts/... URLs resolve. The fonts
// are self-hosted, so the PDF looks the same on any machine.
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
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();

try {
  await promisify(execFile)(CHROME, [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    // Gives the self-hosted fonts time to load before printing.
    '--virtual-time-budget=5000',
    `--print-to-pdf=${OUT}`,
    `http://127.0.0.1:${port}${PAGE}`,
  ]);
  console.log(`wrote ${OUT}`);
} finally {
  server.close();
}
