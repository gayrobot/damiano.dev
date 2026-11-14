---
title: "Waveform sync drift: the first fix passed every test and didn't fix it"
date: 2026-11-13
summary: Two synced decks, two waveforms sliding apart on the screen. Claude found a real bug, fixed it, and it wasn't the one I was seeing. How we got to the actual cause, and how we tested on the Raspberry Pi before anything hit GitHub.
# Skylar flips this to true after reading the draft. The public build fails without it.
approved: true
---

PioneerBox is a Raspberry Pi that sits in my DJ booth. It records the set and
shows what's playing on a monitor, including a scrolling waveform for each
deck, like the ones on the players. Claude Code builds most of it.

While testing it in the booth, I set loops on two decks with sync on. The
audio was locked. The waveforms on the monitor weren't. They slowly slid
apart. I told Claude it was a major bug, and then we went back and forth
until we found out it was really two problems, and only one of them was the
one I could see.

## Round one: a real bug, but not my bug

Claude traced how deck positions get from the decks to the screen. The box
reads the decks through a library called Beat Link, which only reports a
deck's position when it's more than 50 ms off from where it expected. Our own
service then filtered those reports again: anything under 250 ms wasn't
treated as a jump, so it waited for the next once-a-second update.

That's a real bug. A quarter of a second is half a beat at 120 BPM, and each
deck could be off by that much for up to a second before snapping back. Short
loops never showed wrapping at all. Claude changed it to send a correction
whenever the screen is more than 10 ms off, added tests (a short loop that
wraps four times, a small drift correction that has to go out right away),
and the full test suite passed.

To its credit, Claude said plainly that nothing had been tried on real decks
yet and nothing was committed, and asked me to check it in the booth before
we called it closed.

## How do we even test this?

So I asked the obvious question: are you hot-fixing the Pi, or are we
building a new image?

Claude recommended a hot fix. The change was in one file, the Java service
that talks to the decks. Building a whole new SD card image is slow, needs
Docker, and means re-flashing the card for one changed file. The plan:

1. Build the new file on the Mac.
2. Back up the old one on the Pi.
3. Swap it in and restart only that one service. The recorder and the display
   stay up, so the recording keeps going.
4. If anything's wrong, copy the backup back and restart again.

It also flagged that restarting during a set would cut the screens for a few
seconds, so whether to deploy was my call. I said deploy it.

Before swapping anything, Claude checked that the new file would run with the
libraries already on the Pi, and compared it against the version on the Pi to
make sure the fix was the only difference. Nothing unrelated went out with it.
Then it listened to the live position feed for 10 seconds and saw the extra
corrections coming through.

Along the way it noticed my decks were sending exact positions, not just beat
numbers, which our device notes said the XDJ-AZ didn't do. I told it decks 1
and 2 were the XDJ-AZ, and it recorded that with the evidence.

## Round two: watch the page

Then I looked at the monitor. Still drifting. So I told Claude to watch the
page itself.

This time it measured before guessing. It recorded both decks' place within
the beat four times a second for 15 seconds. They stayed within about 15 ms
of each other. So the box knew the decks were in sync. The data was fine. The
drawing was wrong.

Here's what was actually happening. My two decks were synced to the same
tempo, but the tracks had different original BPMs. Deck 1 was slowed down to
0.962× and deck 2 was sped up to 1.033×. The scrolling view always showed the
next 8 seconds of *track*, no matter how fast the deck was playing it. So deck
2's beats were drawn about 7% closer together than deck 1's. The beat grids
lined up right under the playhead and slid apart toward the right edge, by up
to a whole beat. The players don't have this problem because they scale the
waveform by tempo.

The fix was to make the view cover 8 seconds of *playing* time, so each
deck's waveform stretches or squeezes with its tempo. Claude wrote a test
that draws two synced decks at different pitches and checks their beat marks
land in the same places, then checked that the test actually fails on the old
code. It did. It passes on the new code.

Putting this one on the Pi was even easier: one web file copied over and the
screen reloaded. No services restarted, and the recording wasn't touched.
Claude checked that the Pi had exactly the old version first, so it was a
clean swap, then reloaded the page and measured again with both decks
playing at 124 BPM.

## The questions I made sure to ask

Before committing, I pushed on two things:

- **Does this work for every deck, or did you just fix the two on screen?**
  Every deck. Each slot runs the same waveform code, scaled by its own deck's
  tempo. Nothing compares deck 1 to deck 2, so it works for any number of
  decks and any player.
- **If two songs *aren't* in sync, the waveforms shouldn't look in sync
  either, right?** Right. Nothing forces them to line up. At 124 and 128 BPM
  the beat marks slide past each other, like the beats do in the room. Off by
  half a beat at the same tempo, they stay a steady half beat apart.

That second one mattered to me. A fix that made the waveforms *look* locked
would have been worse than the bug. The screen is only useful if it's honest.

## Then GitHub

Only after both fixes had been running on the Pi did we commit. Three
commits, one for each part: the waveform drawing, the position updates, and
the hardware notes. Then a pull request, and I merged it.

Claude also called out the risk of testing this way: the Pi was now running
files that weren't on `main`. If I'd re-flashed the card or re-run setup
before the merge, the drift would have come back. The old files stayed on
the Pi as backups until the merge landed, and the next image I build from
`main` includes both fixes.

There's one thing still unchecked: very short loops (1 beat and under) on my
CDJ-2000NXS2, which only reports what beat it's on. That's on the hardware
checklist for the next booth session.

## What I took from it

- **Passing tests aren't the same as fixed.** The first fix passed 461 tests
  and fixed a real bug. It just wasn't the bug I was looking at. The tests
  only checked what Claude assumed was wrong.
- **Look at the real thing.** "Watch the page now" is what turned it around.
  Once Claude measured what the screen was actually getting, the real cause
  showed up in a few minutes.
- **A new test should fail on the old code.** Otherwise you don't know it
  tests anything.
- **Make testing on the hardware cheap and reversible.** Back up, swap one
  file, restart one service, roll back if needed. Because it was that easy,
  we tested on the real decks before committing instead of after.
- **Ask what the fix should *not* do.** "Unsynced should look unsynced" is
  the question that proves the fix shows the truth instead of hiding it.
- **Know what's running that isn't committed.** A hot fix is a gap between
  what's on the device and what's in the repo. Close it quickly.
