---
title: ride-waits
date: 2026-10-29
summary: Live theme park wait times any AI agent can read, with no install. Built by Claude Code agents using harness engineering.
status: active
tags: [ai-agents, claude-code, harness-engineering, cloudflare-workers]
url: https://ridewaits.com
featured: true
---

Ask your assistant:

> Using ridewaits.com, how long is the wait for [RIDE] at [PARK]?

It covers about 140 parks, and there's nothing to install.

## Harness engineering

Claude Code agents write the code, and I make the product decisions. The harness
keeps the agents honest:

- An agent can only mark a feature as passing after running every step and
  recording evidence.
- Each session does one feature and leaves a log for the next one, since every
  session starts with no memory.
- Hooks run type checks, lint, and tests, and a failure sends the agent back to
  work.
- A separate reviewer agent checks the work before a feature can pass.

Live waits come from [Queue-Times.com](https://queue-times.com/) and park hours
from [ThemeParks.wiki](https://themeparks.wiki). Posted waits are estimates. Not
affiliated with any park operator.
