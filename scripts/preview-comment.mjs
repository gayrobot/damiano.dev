// Posts (or updates) one preview-URL comment on the PR, using the URL wrangler
// reported in its output file. Runs in CI only.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { OUTPUT_FILE, PR_NUMBER, HEAD_SHA } = process.env;
const MARKER = '<!-- preview-deploy -->';

const entry = readFileSync(OUTPUT_FILE, 'utf-8')
  .split('\n')
  .filter(Boolean)
  .map((l) => JSON.parse(l))
  .find((e) => e.type === 'version-upload');
const url = entry?.preview_alias_url ?? entry?.preview_url;
if (!url) {
  console.error('wrangler output:', readFileSync(OUTPUT_FILE, 'utf-8'));
  throw new Error('wrangler reported no preview URL; is Preview URLs switched on for the Worker?');
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
