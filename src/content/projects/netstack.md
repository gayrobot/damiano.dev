---
title: netstack
date: 2026-10-26
summary: My home network, run by an AI agent under rules it can't loosen. It reads freely, asks before every write, and needs a fresh backup before anything risky.
status: active
tags: [ai-agents, agent-governance, claude-code, mcp, home-network]
url: https://github.com/gayrobot/netstack
featured: false
---

netstack is my home network with an AI agent managing it, and a set of
controls deciding what that agent is allowed to do. It's built around a UniFi
gateway and a Synology NAS, which the agent reaches through MCP servers. The
repo is public and public domain, so anyone can copy the setup.

The interesting part isn't the network. It's the identity question, pointed at
an agent: what access should a non-human identity have, who
approves it, and how do you prove what it did afterwards?

## How changes are governed

Everything the agent does falls into one of four tiers, based on how much
damage it could do and how easy it is to undo.

- **Tier 0, read:** inventory, health checks, listing config. No action from me.
- **Tier 1, small and reversible:** rename a device, add a DHCP reservation,
  restart one device. I click Allow on the call.
- **Tier 2, can break things:** firewall, VLANs, Wi-Fi, routing, NAS share
  permissions. I approve a written proposal, open a change window, and click
  Allow on each call.
- **Tier 3, the controls themselves:** accounts, authentication, backups, the
  rules and these tiers. I do it myself. The agent can only propose.

Three ideas sit under the tiers:

- **Read and write are separate connections.** Each device has a read
  connection on a read-only account that never prompts, and a write connection
  on a separate account where every call needs my approval. Write connections
  are off until a change needs them, and switch themselves off after a window.
- **Approvals are per change.** One approval covers one change, and every
  proposal goes in a change log in git, including the ones I reject.
- **The agent can't loosen its own controls.** Accounts, backups and the rules
  are tier 3, so changing them is always my job.

## The controls

The controls are plain shell scripts and git hooks, so they work with
whichever agent runs the repo, not only Claude Code.

- **A restore point gate.** A tier 2 change window won't open without a fresh,
  hash-checked, off-box backup of the gateway. The NAS pulls that backup every
  night, encrypts it to an offline key, and keeps it under immutable snapshots.
- **A change log.** Every change has a diff, a rollback, a way to verify it,
  and who approved it and when.
- **A public/private split.** Real hostnames and inventory live in a folder
  that's never committed. Hooks block any commit that leaks them, and they fail
  closed: no denylist, no commits.
- **Supply-chain vetting.** Every MCP server gets reviewed and pinned by hash
  before the agent uses it.

## What changed along the way

- **A skipped check became a rule.** Early on, the agent disabled two port
  forwards it believed nothing used. It skipped the step that asked whether
  anything still did, and something did. We rolled it back the same day. Now
  every proposal lists its checks, and a skipped check means no write unless I
  waive it in chat.
- **Governance got ahead of the network.** In the first four days, eleven PRs
  built the read/write split, the approvals, the backup gate and the vetting.
  The network itself had barely changed. I wrote that down as the problem:
  controls should get built when real work needs them, not because they'd be
  nice.
- **Watching is most of the job.** The repo only governed one thing: an agent,
  in a session, with me watching, changing the network. Most of running a
  network is watching it, for advisories, drift, patch state and failures. The
  spec now puts that watching layer first, with the write-path controls as the
  spine it hands proposals to.

## Still to come

Next up is the observer: one container that reads the network on a schedule,
spots drift and advisories that matter to the house, and only tells me when
something needs a person. Then network segmentation, which the governance was
built to make safe.

## Known limits

The repo is upfront about what the controls don't cover. Git hooks can be
skipped locally, so CI repeats the scan, but only after a branch is pushed. The
backup gate proves a backup exists and matches its hash, not that it restores.
A denylist only catches the terms on it.
