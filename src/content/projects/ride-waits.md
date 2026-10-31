---
title: ride-waits
date: 2026-10-29
summary: Live theme park wait times any AI agent can read, with no install. Built by Claude Code agents using harness engineering.
status: active
tags: [ai-agents, claude-code, harness-engineering, cloudflare-workers]
url: https://ridewaits.com
featured: true
---

[ride-waits](https://ridewaits.com) is a live site built for agents and
amusement park enthusiasts, and a passion project in applied AI. It covers
about 140 parks around the world.

## Try it

Ask your assistant:

> Using ridewaits.com, how long is the wait for [RIDE] at [PARK]?

Or look at what your assistant sees: a
[live park page](https://ridewaits.com/parks/six-flags-great-america) and the
[same page as markdown](https://ridewaits.com/parks/six-flags-great-america.md).

## Why it exists

Live wait time MCP servers already exist, but you have to add a connector
first, and mostly power users do that. Here the site is the interface. Any
agent that can search the web or fetch a page can use it, and a guest standing
in a park doesn't have to set anything up.

## How it reads for an agent

- Each park page is a plain list: every ride with its posted wait, longest
  first, then what isn't running, plus park hours in park-local time.
- Every page has a markdown twin, and starts with an as-of time and its source.
- [llms.txt](https://ridewaits.com/llms.txt) tells agents how the site is laid
  out, and a sitemap lists every park for search crawlers.
- Close park names still land somewhere useful. If a name could mean a few
  parks, the site picks the likely one when it can, says so, and links the
  others. A guest in line won't stop to answer "which one?"

## How it was built: harness engineering

ride-waits is a TypeScript Cloudflare Worker. Claude Code agents write the code,
and I make the product decisions. What holds that together is the harness: the
repo setup that lets agents work with little hand-holding, and makes it hard for
them to ship something broken or call a job done early. It draws on OpenAI's
write-up on harness engineering and Anthropic's
[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

Every session starts with no memory, so the repo has to carry everything:

- **A map, not a manual.** A short CLAUDE.md points to the docs, and the docs are
  the system of record. If it isn't in the repo, an agent doesn't know it.
- **A feature list agents can't fudge.** Features live in a JSON file. An agent
  can only mark one as passing or add evidence, and only after it has run every
  step. It can't rewrite, reorder, or delete a feature.
- **One feature per session.** A session reads the latest logs, picks the top
  unfinished feature, runs the checks before touching anything, finishes that
  one feature, and leaves its own log for the next session.
- **Checks agents can't skip.** A hook lints each edited file and sends the fix
  back to the agent. Type checks, lint, tests, and a privacy scan run when an
  agent tries to stop, and if they fail, it keeps working. Lint rules enforce
  the architecture too, so only the source adapters can call outside APIs.
- **No grading your own work.** A separate reviewer agent checks the diff against
  the project's rules and the feature's steps before a feature can pass.
- **An agent plays the user.** The product is "agents can read this site," so the
  real test is an agent with only web search and fetch, asking the questions a
  guest would ask against the live site. That eval is still open.
- **Decisions stay decided.** A decisions log stops agents from reopening settled
  choices. Changing one takes a new entry that replaces it.
- **Stuck means build what's missing.** An agent that gets stuck doesn't push
  harder. It writes down the tool, fixture, or guardrail that was missing and
  proposes it.

The harness also grows when it misses something. A review found the README still
describing an old plan, so now a test fails if the docs promise something that
isn't built yet.

## What changed along the way

- **The data terms changed the plan.** I started out planning an MCP server and
  JSON. One data source doesn't allow passing its data on as an API, so the
  first version is pages people and their assistants read.
- **Don't invent detail.** The live data can't tell a broken-down ride from one
  that's closed for the day, so the site says "not running right now." A wait
  of 0 shows as "no posted wait," not "0 min."
- **Some assistants never open the URL you give them.** Siri ran a web search
  instead and answered from a different site, because ridewaits.com wasn't in
  a search index yet. For those assistants, being indexed is the interface.

## Still to come

It's still early. Next up are pages for single rides and an MCP endpoint for
live waits. Later ideas include wait history, and crowd reports that compare
posted waits with actual ones.

## The data

Live waits come from [Queue-Times.com](https://queue-times.com/) and park hours
from [ThemeParks.wiki](https://themeparks.wiki). Posted waits are estimates. Not
affiliated with any park operator.
