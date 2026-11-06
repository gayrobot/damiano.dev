---
title: hvrad.io
date: 2026-11-05
summary: The site for my DJ work, built by Claude Code. Agents update it by editing plain files and opening a PR, and one check gates every deploy.
status: active
tags: [ai-agents, claude-code, harness-engineering, cloudflare-workers, astro]
url: https://hvrad.io
featured: true
---

[hvrad.io](https://hvrad.io) is the site for heroic.vers, my DJ name, and
heroic.versRADIO, my company and live show. It has upcoming bookings, parties,
mixes, flyers, radio episodes and a bio.

The site itself is the easy part. The real goal was a site any agent can keep
up to date without me babysitting it: add a booking, credit a flyer designer,
post a new mix, and have it go live only after I've looked at it.

## How it was made

I did the design in Claude first: a design system and a clickable prototype of
the whole site. Then I wrote a handoff for Claude Code with one main rule:
don't redesign anything, turn the prototype into a production site. Claude
Code built the first version in one session.

The site is laid out like a rhythm game booth. Seven lanes on the left are the
sections, and you can switch between them with keys 1 to 7 or by scrolling the
mouse wheel over the lanes. Every animation steps to the beat at 130 BPM, and
there's a reduced motion version that skips straight to the end state.

## How agents update it

Everything on the site comes from plain files in one folder: one file per
event, flyer, mix, radio episode, venue or person. To add a booking, an agent
writes a new event file, runs one check, and opens a PR. I review the preview
and merge, and the merge deploys.

That one check, `npm run verify`, is the whole gate. It runs the same way on my
machine, in an agent's session and in CI:

- **Schema and content rules.** Every flyer credits its designer, every
  reference between files resolves, and an event more than 18 months out fails
  the build. That last one catches the wrong years some event listings have.
- **Guards.** No phone numbers anywhere, no logos or art from the game and DJ
  gear brands the look borrows from, only three fonts, and an image size
  budget.
- **Tests.** 23 unit tests and 40 browser tests in the first build, including an
  accessibility scan of every page.

The agent rules also cover things a check can't: unknown facts get left out,
never guessed, and Japanese copy is never machine translated.

## The GitHub Free problem

The repo is private, and I'm on GitHub Free. That means no protected branches
and no required checks, so nothing on GitHub's side stops a push straight to
`main`.

So the deploy job checks where each commit came from. Before it ships, it looks
at every commit since the last successful deploy and asks GitHub which merged
PR it came from. If a commit didn't come through a merged PR, nothing ships and
the job opens an issue. Agent tokens can't edit the workflows, and they can't
write the deploy history the check reads.

## What changed along the way

- **Dropped the login on previews.** The plan put every preview behind
  Cloudflare Access, which needs a separate sign-up. I skipped it. Previews are
  public, but they're marked PREVIEW and tell search engines not to index
  them.
- **A dependency update broke `main`.** I merged a Dependabot bump to a new
  major version of ESLint, and a plugin the lint step needs didn't support it
  yet. ESLint is now pinned, and Dependabot skips its major versions.
- **Design calls after seeing it live.** Edition numbers went from formal kanji
  numerals to plain numbers, page changes got twice as fast, and the flyer
  page became a grid.

## Still to come

- **Pulling in bookings.** The plan is to pull from Instagram, RA, Mixcloud
  and YouTube. Instagram gives you posts, not events, so Claude will read each
  flyer, pull out the event details, and open a PR. That will sometimes be
  wrong, so I approve every one.
- **A press kit.** Bios, photos, logos and featured mixes, as a page and a PDF.
- **Auto-merge for small content PRs.** It's built but off until I trust the
  content checks.
- **The drill.** I haven't yet pushed a test commit straight to `main` to
  prove the deploy refuses it.
