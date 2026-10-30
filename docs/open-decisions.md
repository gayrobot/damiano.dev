# Open decisions

Two decisions from the handoff are still Skylar's. Each has a recommendation; until Skylar picks, the stated default holds.

## 1. Agent identity: GitHub App or fine-grained PAT

**Recommendation: GitHub App**, installed on `gayrobot/damiano.dev` only.

| | GitHub App | Fine-grained PAT |
|---|---|---|
| Scope | Per-repo install, permissions chosen explicitly | Per-repo, but tied to Skylar's account |
| Token life | Short-lived (1 hour), minted on demand | Up to a year; a leaked one works until revoked |
| Audit trail | PRs and commits show as the app (a bot identity) | PRs show as Skylar, so agent work looks like human work |
| Setup | More steps (create app, install, store key) | Two minutes |
| Rotation | Nothing to rotate except the app's private key | Manual, easy to forget |

Permissions either way: contents write and pull requests write on the one repo, no admin, and branch protection keeps `main` closed (the agent can't push to it).

**Default until decided:** Claude Code sessions open PRs from Skylar's own machine under Skylar's login. That is fine at Level 0 but it blurs who did what, which is the reason to move to an app before the agent acts on its own.

**Needed from Skylar:** pick App or PAT. If App, setup is about ten minutes of clicking in GitHub settings; ask and the steps will be written out.

## 2. Agent-in-CI

Running Claude inside GitHub Actions needs an Anthropic API key, billed per token and separate from the subscription.

**Recommendation: stay deferred.** Nothing in the current plan needs it. Level 0 is Claude Code sessions opening PRs, and CI checks (`build`, privacy gate, link check, Lighthouse, content lint, section check) deliberately don't call a model. Event-driven runs are listed as out of scope in the handoff.

**Revisit when** a recurring chore shows up that the proposal policy (`harness/proposals.yml`) would justify automating, such as weekly link fixes (Level 2).

**Before any agent run in CI:** set a monthly spend cap on the API key in the Anthropic console, store the key as an environment secret (like the Cloudflare tokens), and make the workflow open PRs only.

**Needed from Skylar:** nothing now. Reply "defer" to keep it as is.
