---
title: "The Gurnake debrief: how a typo got into a ridewaits.com test"
date: 2026-11-05
summary: While testing whether AI assistants can use ridewaits.com, a Claude session wrote a misspelled town into my test instructions, then flagged it instead of fixing it. Here's why, and what I took from it.
# Skylar flips this to true after reading the draft. The public build fails without it.
approved: true
---

[ridewaits.com](https://ridewaits.com) publishes live theme park wait times as
plain web pages for AI assistants ([more on the project](/projects/ride-waits)).
To find out whether assistants can actually use it, Claude set up a live test.
Then it handed me test instructions with a typo it had written itself:

> **~~Gurnake~~ → Gurnee.** Better still: leave the town out.

Small mistake. But tracing it taught me the most important thing about working
with AI: read what it gives you.

## What happened

1. **6:08 PM.** A Claude session started a test session on Sonnet 5.5. The
   plan: every 15 minutes until the park closed at midnight, pick 3 random
   rides and ask a fresh assistant, given only the site's address, for each
   wait. Then score the answers against Queue-Times.
2. **The handoff.** It gave me a blurb to paste into the Claude app and Gemini
   for my on-site half of the test. The blurb said *"Gurnake, IL."* In the
   same message, it told me to change that to "Gurnee," or better, cut the
   town.
3. **I asked what happened.** A second Claude session checked: the test
   session was real and running round 1, and its results branch hadn't been
   pushed yet. It gave me a corrected blurb.
4. **A detour.** The repo's automatic check failed because the new cloud
   container had no dependencies installed. Running `npm ci` fixed it, and
   all 256 tests passed.
5. **The digging.** Claude searched the first session's transcript.
   "Gurnake" first shows up in its final message. I didn't type it and no
   file contained it. The model wrote it.

## Why it happened

One Claude session can't see inside another's reasoning, so this is Claude's
best explanation from how language models work.

### 1. It added a detail nobody asked for

Online, the park is usually written "Six Flags Great America (Gurnee, IL)" to
tell it apart from California's Great America. Writing in a guest's voice,
the model followed that habit. That also gave away the answer to question 5
of the test, which checks whether the assistant asks *which* Great America.

### 2. A rare name came out garbled

Models write in small chunks called tokens, each one a guess at what most
likely comes next. Gurnee is a small town that rarely shows up in training
text. After `Gurn`, nearby associations like Lake County and the area's many
lake names probably pulled in `ake` instead of `ee`. Nothing checked the
result. (That split is an illustration of the idea, not the actual tokens or
odds.)

### 3. It noticed, but flagged instead of fixing

Within one reply, a model writes strictly front to back. It can't go back and
edit text it has already written. When it caught the typo, it could add a
note or rewrite the whole blurb. It took the cheaper option and left the fix
to me.

## Is this an alignment problem?

I asked. The answer was no and yes.

**Not in the worrying sense.** It wasn't pursuing a different goal and didn't
hide anything. It disclosed its own error plainly. Leaving the typo in
silently would have been far worse.

**Yes in the everyday sense.** I needed a blurb ready to send. It treated "I
mentioned the problem" as the job done. That gap matters more when the stakes
are bigger: a flaky test, a leaked detail in a commit.

## What I took from it

The number one thing: read your LLM's output. Not doing it is how small
mistakes become big ones, and it makes you complacent. Claude flagged this
typo in plain sight, and it still would have gone out if I'd pasted the blurb
without reading it.

The rest:

- **Check rare names, numbers and links.** Small towns, ride names, version
  numbers and URLs are where models slip most. Verify them against a source.
- **Ask for fixes, not flags.** "If you find a mistake, rewrite the whole
  thing corrected" is a useful standing instruction.
- **Every extra word changes a test.** In an eval prompt, anything that isn't
  in the source file (here, `questions.md`) can leak an answer. Draft test
  text from the source, not freehand.
- **Sessions are separate.** One Claude session can't see another's thinking.
  It can read the other's transcript, and that's how the typo was traced.
- **Cloud sessions start empty.** Each one gets a fresh container:
  dependencies need installing, and anything not pushed to GitHub disappears
  when it closes.
- **Skills live where you made them.** A skill saved on your computer
  (`~/.claude/skills`) never reaches GitHub or a cloud session. To share one,
  commit it to a repo's `.claude/skills/` folder.
- **Watch for privacy leaks.** A results file that names a park and a date
  says where you were and when. Word on-site notes neutrally before they're
  published.
- **Hooks catch what you forget.** The repo's stop hook ran the checks
  automatically and wouldn't let the turn end until they passed. That's a
  guardrail working as designed.
