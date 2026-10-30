# Open decisions

Two decisions from the handoff are still Skylar's. Each has a recommendation; until Skylar picks, the stated default holds.

## 1. Agent identity: GitHub App or fine-grained PAT

**Decided (Skylar): GitHub App**, installed on `gayrobot/damiano.dev` only.

| | GitHub App | Fine-grained PAT |
|---|---|---|
| Scope | Per-repo install, permissions chosen explicitly | Per-repo, but tied to Skylar's account |
| Token life | Short-lived (1 hour), minted on demand | Up to a year; a leaked one works until revoked |
| Audit trail | PRs and commits show as the app (a bot identity) | PRs show as Skylar, so agent work looks like human work |
| Setup | More steps (create app, install, store key) | Two minutes |
| Rotation | Nothing to rotate except the app's private key | Manual, easy to forget |

Permissions either way: contents write and pull requests write on the one repo, no admin, and branch protection keeps `main` closed (the agent can't push to it).

**Default until decided:** Claude Code sessions open PRs from Skylar's own machine under Skylar's login. That is fine at Level 0 but it blurs who did what, which is the reason to move to an app before the agent acts on its own.

### Setup (about ten minutes, once)

1. GitHub → your profile picture → **Settings** → **Developer settings** (bottom of the left menu) → **GitHub Apps** → **New GitHub App**.
2. **GitHub App name:** `damiano-dev-agent` (add digits if taken). **Homepage URL:** `https://github.com/gayrobot/damiano.dev`.
3. **Webhook:** untick *Active*.
4. **Repository permissions:** *Contents: Read and write*, *Pull requests: Read and write*. Leave everything else as *No access* (Metadata read-only is added automatically). No organization or account permissions.
5. **Where can this app be installed?** *Only on this account*. Click **Create GitHub App**.
6. On the app's page, note the **App ID**. Scroll to **Private keys** → **Generate a private key**. A `.pem` file downloads. Save it in your password manager and delete the download. Treat it like a password; never put it in the repo or in chat.
7. Left menu → **Install App** → **Install** next to `gayrobot` → **Only select repositories** → `damiano.dev` → **Install**.

Branch protection on `main` still applies: the app can open branches and PRs but can't push to `main`, and you still merge.

Later, when something in CI should act as the agent (including swapping the PAT in `docs/drafts-flow.md`), add the App ID and the key as environment secrets and mint a token with `actions/create-github-app-token`.

## 2. Agent-in-CI

Running Claude inside GitHub Actions needs an Anthropic API key, billed per token and separate from the subscription.

**Recommendation: stay deferred.** Nothing in the current plan needs it. Level 0 is Claude Code sessions opening PRs, and CI checks (`build`, privacy gate, link check, Lighthouse, content lint, section check) deliberately don't call a model. Event-driven runs are listed as out of scope in the handoff.

**Revisit when** a recurring chore shows up that the proposal policy (`harness/proposals.yml`) would justify automating, such as weekly link fixes (Level 2).

**Before any agent run in CI:** set a monthly spend cap on the API key in the Anthropic console, store the key as an environment secret (like the Cloudflare tokens), and make the workflow open PRs only.

**Needed from Skylar:** nothing now. Reply "defer" to keep it as is.
