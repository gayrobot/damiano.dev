# Drafts flow

Drafts live in a private repo, `gayrobot/damiano.dev-drafts`, because public branches and commits are public permanently and GitHub doesn't allow private forks of public repos. A draft reaches the public site only by a PR into this repo, opened on purpose.

```
drafts repo (private)  --Promote workflow-->  PR in damiano.dev (public)
  musings/my-essay.md                          src/content/musings/my-essay.md
                                               privacy gate + content lint + build
                                               Skylar reviews and merges
```

## Why the privacy gate covers it

The promote PR is an ordinary PR, so the required checks (`build`, `privacy-gate`) run on it. The gate scans `src/content/`, so any personal detail in a draft blocks the merge. Musings also fail the build unless `approved: true`.

## What lives where

- `harness/drafts-repo/` in this repo is the template for the drafts repo: `README.md`, `musings/_template.md`, `.github/workflows/promote.yml`. Copy it into the drafts repo root.
- The workflow only allows `musings/*.md` and `projects/*.md`, and refuses a musing without `approved: true`.

## One-time setup (after the drafts repo exists)

1. **Copy the template** (can be done by Claude, or:) copy the contents of `harness/drafts-repo/` into the drafts repo and push to its `main`.
2. **Create a token** (GitHub → Settings → Developer settings → Fine-grained tokens → Generate new token):
   - Resource owner: `gayrobot`. Repository access: *Only select repositories* → `damiano.dev`.
   - Permissions: *Contents: Read and write*, *Pull requests: Read and write*. Nothing else.
   - Expiration: 90 days (put a reminder in the calendar).
3. **Store it** in the drafts repo: Settings → Environments → New environment `promote` → Add environment secret `PROMOTE_TOKEN` → paste the token.

The token is the one thing that crosses repos, so it is scoped to the public repo alone and can't push to `main` (branch protection blocks that). If the agent identity becomes a GitHub App (see `docs/open-decisions.md`), swap this token for the app's.

## Using it

Draft in the drafts repo. When it's ready, set `approved: true`, then Actions → Promote → Run workflow with the file path. Review the PR that appears in the public repo and merge it.
