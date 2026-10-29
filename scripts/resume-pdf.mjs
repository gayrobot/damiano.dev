// Builds public/downloads/Skylar_Damiano_Resume.pdf from src/data/resume.yaml,
// so the PDF and /resume can't drift apart. Needs Google Chrome installed.
// Run `npm run build` first if you changed the data: the build is what validates it.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { parse } from 'yaml';

const SRC = 'src/data/resume.yaml';
const OUT = resolve('public/downloads/Skylar_Damiano_Resume.pdf');
const CHROME =
  process.env.CHROME_PATH ??
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(
    existsSync,
  );
if (!CHROME) throw new Error('Chrome not found; set CHROME_PATH');

const r = parse(readFileSync(SRC, 'utf-8'));

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmt = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
const month = (m) => (m === 'present' ? 'Present' : fmt.format(new Date(`${m}-01T00:00:00Z`)));
const list = (items) => `<ul>${items.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`;
const bare = (url) => url.replace(/^https?:\/\//, '');

const sortKey = (j) => (j.end === 'present' ? '9999' : j.end);
const jobs = [...r.experience].sort((a, b) => sortKey(b).localeCompare(sortKey(a)) || b.start.localeCompare(a.start));

const job = (j) => `
  <div class="job">
    <p class="role"><b>${esc(j.role)}</b><span class="muted"> | ${esc(j.company)}${j.location ? ` | ${esc(j.location)}` : ''}</span></p>
    <p class="dates">${month(j.start)} – ${month(j.end)}</p>
    ${j.bullets ? list(j.bullets) : ''}
    ${(j.sections ?? []).map((s) => `<p class="sub">${esc(s.heading)}</p>${list(s.bullets)}`).join('')}
    ${(j.projects ?? [])
      .map(
        (p) =>
          `<p class="sub">Project: ${esc(p.name)}${p.url ? ` <a href="${esc(p.url)}">(${esc(bare(p.url))})</a>` : ''}</p>${list(p.bullets)}`,
      )
      .join('')}
  </div>`;

const contact = [r.location, r.email, ...r.certifications.map((c) => c.name)].filter(Boolean).map(esc).join(' | ');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>${esc(r.name)} Resume</title>
<style>
  @page { size: Letter; margin: 0.5in 0.6in; }
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 10pt; color: #1A1A1A; line-height: 1.2; margin: 0; }
  p { margin: 0; }
  a { color: inherit; text-decoration: none; }
  h1 { font-size: 20pt; color: #1F4E79; text-align: center; margin: 0 0 2pt; letter-spacing: 0.5pt; text-transform: uppercase; }
  .center { text-align: center; color: #444; font-size: 9.5pt; }
  h2 { font-size: 11pt; color: #1F4E79; text-transform: uppercase; border-bottom: 1px solid #1F4E79;
       margin: 9pt 0 4pt; padding-bottom: 1pt; break-after: avoid; }
  .job { margin-top: 5pt; }
  .role, .dates, .sub { break-after: avoid; }
  .muted { color: #444; }
  .dates { font-style: italic; color: #444; margin-bottom: 2pt; }
  .sub { font-weight: bold; color: #1F4E79; margin: 3.5pt 0 1.5pt; }
  ul { margin: 0; padding-left: 20pt; }
  li { margin-bottom: 1.5pt; }
  .skills p { margin-bottom: 1pt; }
</style></head><body>
  <h1>${esc(r.name)}</h1>
  ${r.headline ? `<p class="center">${esc(r.headline)}</p>` : ''}
  <p class="center">${contact}</p>

  ${r.summary ? `<h2>Professional Summary</h2><p>${esc(r.summary)}</p>` : ''}

  ${jobs.length ? `<h2>Professional Experience</h2>${jobs.map(job).join('')}` : ''}

  ${
    r.skills.length
      ? `<h2>Core Competencies</h2><div class="skills">${r.skills
          .map((s) => `<p><b>${esc(s.group)}:</b> ${s.items.map(esc).join(', ')}</p>`)
          .join('')}</div>`
      : ''
  }

  ${
    r.education.length || r.certifications.length
      ? `<h2>Education &amp; Certifications</h2>
         ${r.education.map((d) => `<p>${esc(d.degree)} — ${esc(d.school)}</p>`).join('')}
         ${r.certifications.length ? `<p>${r.certifications.map((c) => esc(c.name)).join(' | ')}</p>` : ''}`
      : ''
  }
</body></html>`;

const dir = mkdtempSync(join(tmpdir(), 'resume-pdf-'));
const page = join(dir, 'resume.html');
writeFileSync(page, html);
execFileSync(
  CHROME,
  ['--headless', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${OUT}`, `file://${page}`],
  { stdio: 'ignore' },
);
console.log(`wrote ${OUT}`);
