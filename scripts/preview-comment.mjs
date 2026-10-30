// Posts (or updates) one preview-URL comment on the PR, using the URL wrangler
// reported in its output file. Runs in CI only.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { OUTPUT_FILE, PR_NUMBER, HEAD_SHA } = process.env;
const MARKER = '<!-- preview-deploy -->';

// wrangler doesn't always report the preview URL in its output file, so build
// it: <alias>-<worker>.<account workers.dev subdomain>.workers.dev
const entry = readFileSync(OUTPUT_FILE, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l))
  .find((e) => e.type === 'version-upload');
if (!entry) throw new Error('no version-upload entry in wrangler output');

let url = entry.preview_alias_url ?? entry.preview_url;
if (!url) {
  const { CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID } = process.env;
  const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/subdomain`, {
    headers: { Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}` },
  });
  const subdomain = (await res.json()).result?.subdomain;
  if (!subdomain) throw new Error(`could not look up the workers.dev subdomain (HTTP ${res.status})`);
  url = `https://pr-${PR_NUMBER}-${entry.worker_name}.${subdomain}.workers.dev`;
}

// Make sure the URL really serves the site before announcing it.
let status;
for (let i = 0; i < 6; i++) {
  status = (await fetch(url, { redirect: 'follow' }).catch(() => ({ status: 0 }))).status;
  if (status === 200) break;
  await new Promise((r) => setTimeout(r, 5000));
}
if (status !== 200) {
  throw new Error(`${url} answered ${status}. Is Preview URLs switched on for the Worker (Settings > Domains & Routes)?`);
}

const body = `${MARKER}\n**Preview:** ${url}\n\nBuilt from ${HEAD_SHA.slice(0, 7)}. Updates on every push to this PR.`;

const gh = (...args) => execFileSync('gh', args, { encoding: 'utf-8' }).trim();
const existing = gh(
  'api',
  `repos/${process.env.GITHUB_REPOSITORY}/issues/${PR_NUMBER}/comments`,
  '--paginate',
  '--jq',
  `[.[] | select(.body | startswith("${MARKER}"))][0].id // empty`,
);
if (existing) {
  gh('api', '-X', 'PATCH', `repos/${process.env.GITHUB_REPOSITORY}/issues/comments/${existing}`, '-f', `body=${body}`);
} else {
  gh('pr', 'comment', PR_NUMBER, '--body', body);
}
console.log(`Preview: ${url}`);
