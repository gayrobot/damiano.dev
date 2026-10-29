# damiano.dev — Handoff for Claude Code

Last updated: 2026-10-29 · Owner: Skylar (@gayrobot)

## What this is

A personal site at **damiano.dev** that shows Skylar's applied-AI work, IT/IAM experience and resume, and essays ("musings") on how Skylar and AI work together.

The site is the fixture. **The real project is the harness**: the pipeline, checks, permissions, and policies that let an agent change the site safely. Treat every harness decision as something worth writing about later.

## Decisions made

| Area | Decision | Notes |
|---|---|---|
| Domain | `damiano.dev`, registered at Squarespace | Registration stays at Squarespace. No email on the domain. |
| DNS | Move to Cloudflare (nameserver change at Squarespace) | Required: Workers can't serve custom domains on zones Cloudflare doesn't manage. `.dev` is HSTS-preloaded, so HTTPS only. |
| Hosting | Cloudflare Workers with static assets | Not Pages. Static asset requests are free. Account is active; sign-in is Google OAuth with a passkey. |
| Deploys | GitHub Actions builds and deploys with `wrangler` | Not Workers Builds. All checks and the deploy live in one pipeline. PR preview deploys are wired up by us. |
| Framework | Astro, static output | Content collections with schemas act as a build-time guardrail. |
| Code repo | `gayrobot/damiano.dev`, **public** | Harness, workflows, and agent PRs are part of the showcase. Not created yet. |
| Drafts repo | `gayrobot/damiano.dev-drafts`, **private**, not a fork | Musings are drafted here and promoted to the public repo by PR only after Skylar approves. GitHub doesn't allow private forks of public repos, and public branches and commits are public permanently. |
| Design system | Deferred to a separate session in this project | Milestone 0 uses minimal, unstyled-but-clean defaults. |

## Open decisions

1. **Agent-in-CI.** Running Claude in GitHub Actions needs an Anthropic API key, billed per token, separate from the subscription. **Default until decided:** Claude Code sessions do the building and open PRs; CI runs only checks that don't call Claude. Before any event-driven agent runs, set a monthly spend cap.
2. **Agent identity mechanism.** GitHub App (preferred: scoped, auditable, short-lived tokens) vs fine-grained PAT. Either way it's scoped to the one repo, with no admin rights and no push to `main`.

## Milestone 0 — walking skeleton

Goal: a merge to `main` puts a real page on `https://damiano.dev`. Nothing fancy.

1. Create `gayrobot/damiano.dev` (public) and `gayrobot/damiano.dev-drafts` (private).
2. Scaffold Astro with static output. Pages: `/` (short intro), `/resume`.
3. Resume as data: one structured file (e.g. `src/data/resume.yaml`) validated by a schema, rendered to `/resume`. A PDF render can come later.
4. Branch protection on `main`: PRs required, status checks required, no force push, CODEOWNERS = `@gayrobot`.
5. CI on every PR: install, type check, `astro build`.
6. Deploy job on merge to `main`: `wrangler deploy` to the Worker.
7. Cloudflare: a scoped API token with Workers edit only for this account, stored as a GitHub Actions secret. No DNS permissions on this token.
8. DNS cutover: add the `damiano.dev` zone in Cloudflare, check the imported records, change the nameservers at Squarespace, attach the custom domain to the Worker.

**Done when:** a PR merged to `main` changes the live site with no manual steps, and a PR that breaks the build can't merge.

## Milestone 1 — first real harness layers

Add one at a time, each as its own PR:

- **PR preview deploys:** each PR gets a preview URL posted as a comment.
- **Link check** on the built output.
- **Accessibility and Lighthouse** checks with a threshold.
- **Content lint:** flags corporate-speak phrases. Skylar's voice is casual and plain.
- **Privacy gate:** scans content for personal details (addresses, phone numbers, family names, anything flagged in a denylist) before merge. Mandatory for anything promoted from the drafts repo.
- **Path filters:** skip builds and deploys for changes that don't touch the site, to save CI minutes.

## Content model (Astro collections)

| Collection | What | Required fields (starting point) |
|---|---|---|
| `projects` | Write-ups of AI work | title, date, summary, status (`active` / `shipped` / `paused`), tags |
| `musings` | Essays on working with AI | title, date, summary, `approved: true` (build fails without it) |
| resume (data file) | Experience, certs, skills | role, company, dates, bullets |

Candidate first project write-ups, in Skylar's words, not invented: the voice-activated Rekordbox tagger, the DJ tools suite, the Rekordbox and HomeKit MCP setups, Docker and home-network work with Claude Code.

**Rule:** resume and experience content comes only from facts Skylar has confirmed. Don't embellish, and don't fill gaps with plausible-sounding claims.

## Autonomy ladder

The agent is a non-human identity. It starts at Level 0 and moves up only when Skylar decides.

| Level | The agent can | Skylar does |
|---|---|---|
| **0 (start here)** | Open PRs from branches | Reviews and merges everything |
| 1 | Auto-merge content-only PRs (typos, links) when all checks pass | Spot-checks |
| 2 | Act on schedules (e.g. weekly link fix, weekly proposal) | Reviews proposals |

Musings never move past Level 0. A human merge is always required.

## Proposal policy (don't overwhelm Skylar)

The agent may suggest things to build, under a budget. Keep this in the repo as `harness/proposals.yml` so it can change without re-explaining:

```yaml
# harness/proposals.yml
max_open: 1            # open claude-proposed issues at any time
max_new_per_week: 1
channel: github_issue  # label: claude-proposed; never interrupt a chat for this
threshold: >
  Propose only when something recurs: the same manual step 3+ times,
  a check failing repeatedly, or a gap Skylar has mentioned twice.
expire_after_days: 14  # close ignored proposals automatically
scope: drudgery_only   # site, pipeline, chores. Not life or hobby advice.
```

## Conventions

- Commits and PRs explain *why*, briefly. Every agent change is a PR; the PR is the audit trail.
- Keep the build static. Anything needing server code (e.g. a contact form) is a separate decision, because Workers request quotas apply.
- Prefer boring, well-known tools over clever ones.

## Out of scope for now

Design system, comments, analytics, a contact form, newsletter, DNS-as-code (Terraform), event-driven agent runs in CI.
