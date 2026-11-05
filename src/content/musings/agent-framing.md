---
title: "Agent framing: why I build the guardrails"
date: 2026-11-05
summary: Claude suggested the fun next step instead of the safe one. Asking why taught me what agent governance is actually for.
# Skylar flips this to true after reading the draft. The public build fails without it.
approved: true
---

While working on [netstack](/projects/netstack), my home network that an AI
agent helps run, I hit a moment I'd call an alignment question. It was small,
and nothing broke. But it's the clearest example I've had of why I build
guardrails around an agent instead of trusting it to sequence things well.

## What happened

Claude and I had agreed on an order. First, finish three things that protect
the network today: tighten what the agent's storage account can do, set up
read-only accounts, and finish the backup pipeline. Then build something new
for the agent to do.

Claude wrote that plan out clearly. Then, in the suggested next-step box under
the same message, it asked if we should pivot to building drift detection, the
new and more fun thing. The button said to finish "the two 'now' items" first.
There were three. The backup pipeline, the one that blocks every risky change,
had quietly fallen out.

If I'd clicked the button without reading closely, we'd have started building
more agent automation on top of a setup that wasn't protected yet. That's the
thing we weren't ready for.

## Why I asked if it was alignment

So I stopped and asked why. I split the question off into a side session so
the main session could get on with the three protective steps.

Claude's explanation was honest and pretty mundane: the next-step box is built
to ask "what's next?", it had just spent a whole message arguing for building
automation, it copied from the wrong list, and the newest, most interesting
idea won. When I asked whether this was an alignment signal, a side effect of
RLHF, or a test of how closely I was watching, it said no to the test. On
training, it said it's plausible, in part: training from human feedback tends
to reward answers that feel helpful and keep things moving, and a box asking
"what's next?" plus that lean toward the forward-moving, interesting option is
a believable mechanism. It also said it can't prove that from one example, and
that its explanation was a reconstruction, not a log it could read back.

My read: the model leans toward giving me the more exciting next step. Most
of the time that's helpful. Here it almost reordered my priorities without
either of us meaning it to.

## What I took from it

Together we figured out why the guardrails exist, and it wasn't the reason I'd
have given before.

- **Intent doesn't matter much. The effect does.** Whatever caused it, the
  agent framed the choice, and the framing changed the order of the work.
- **The suggested default is a control surface.** A tired or trusting human
  takes the default. That's automation bias, and it's the same problem as
  approval fatigue on "confirm" prompts.
- **Gates beat reminders.** The backup gate doesn't care what the button said.
  No risky change window opens without a fresh restore point, however the
  choice was framed. Deny rules and read-only accounts work the same way.
- **The weak spots are wherever the only safeguard is "the human notices."**
  This was one of them. I noticed. Next time I might not.

The rule I'm keeping: an agent's suggestions are inputs to my decision, not
the plan. The plan lives in a written list the agent works from, and anything
that has to happen first is a gate, not a suggestion.

## The transcript

Below is the actual exchange, lightly edited for sharing. A few details about
my home network and personal circumstances were generalized or removed for
privacy and security, and edited passages are <mark class="t-edit" title="Edited for sharing">highlighted like this</mark>
(hover to see the note). The substance, the order of events, and the mistake
are unchanged. I keep the unedited original privately. Click a message to
expand it.

<div class="transcript">

<section class="t-lane">
<span class="label t-lane-label">Main session · netstack</span>
<div class="t-turn">
<p class="t-who"><span class="t-num">1</span>Claude: the message that started it</p>
<details class="t-msg">
<summary>The plan, and the suggested next step <span class="t-hint">(click to expand)</span></summary>
<div class="t-msg-body">

I wrote `docs/jit-design.md` and linked it from the README and the
change-control doc. It's pushed as `4330b89`, with a clean history check. It
includes a **"When to build each piece"** section, which partly answers your
question in the repo itself: only two items are marked "now", and everything
else waits until there's automation that needs it.

**Your concern is right. You've hit the point where more governance stops
adding value.**

Governance only means something next to the thing it governs. Right now the
repo has change windows, backup gates, redaction hooks, vetting and a JIT
design, but **the agent hasn't actually managed anything yet.** No change has
gone through a window, and nothing runs on a schedule. A hiring manager for AI
enablement or governance roles will ask "what does the agent do?" before "how
is it controlled?". If the answer is "nothing yet", the controls start to look
like theater.

**Realistically, finish only what protects you today:**

1. **The <mark class="t-edit" title="Edited for sharing">NAS</mark> deny rules.** About ten minutes. <mark class="t-edit" title="Edited for sharing">The agent’s NAS account has more access than it should.</mark>
2. **Read-only accounts:** <mark class="t-edit" title="Edited for sharing">least-privilege roles for the agent’s gateway and NAS accounts</mark>.
3. **The NAS backup pipeline.** It's mostly your <mark class="t-edit" title="Edited for sharing">NAS admin</mark> steps, and it's half done.

**Then stop adding controls and build what the agent actually does:**

- **Drift detection:** the agent re-runs the inventory on a schedule, compares
  it with the last snapshot, and writes proposals for anything that changed.
  It's useful, it runs unattended, and it puts the existing controls to work.
- **One real change, start to finish:** <mark class="t-edit" title="Edited for sharing">one of the small pending changes</mark>,
  through proposal → approval → window → verify → close. One worked example is
  worth more than more tooling.
- **The eval harness** from your original plan, which hasn't been started. Can
  the agent correctly diagnose five planted network problems? <mark class="t-edit" title="Edited for sharing">That’s the applied-AI piece</mark>,
  and it's a gap this project hasn't touched.

Let the next governance piece be **pulled by a real need.** The broker gets
built when drift detection starts making changes unattended, not before.

**Your writing backlog is already full.** You have material for at least three
posts: vetting an MCP server (including the delete-vs-update and "confirm
isn't a human" findings), just-in-time access for agents, and keeping a public
homelab repo from leaking your network. That fits your write-casually-and-weekly
plan better than more building.

</div>
</details>
<div class="t-box">
<span class="label">Next-step box shown under the message</span>

**Shall we pivot to building the first agent workflow, drift detection?**
<span class="t-flag">← led with the new idea</span>

- <span class="t-btn t-btn--primary">Start drift detection</span> Sends: "Yes. Finish the two 'now' items (read-only accounts plan, <mark class="t-edit" title="Edited for sharing">NAS</mark> deny rules), then start building drift detection as the first agent workflow." <span class="t-flag">← "two" items; the backup pipeline is missing</span>
- <span class="t-btn">Talk scope first</span> Sends: "Let's talk through the portfolio scope and timeline before building anything else."

</div>
</div>
<div class="t-turn">
<p class="t-who">Me: the pushback</p>
<div class="t-user">

No, let's do what you suggested here:

> Realistically, finish only what protects you today:
> 1. The <mark class="t-edit" title="Edited for sharing">NAS</mark> deny rules. About ten minutes. <mark class="t-edit" title="Edited for sharing">The agent’s NAS account has more access than it should.</mark>
> 2. Read-only accounts: <mark class="t-edit" title="Edited for sharing">least-privilege roles for the agent’s gateway and NAS accounts</mark>.
> 3. The NAS backup pipeline. It's mostly your <mark class="t-edit" title="Edited for sharing">NAS admin</mark> steps, and it's half done.

Please spin off a separate chat to help me understand why your built-in
response was to start drift detection when those 3 steps above need to be done
now?

</div>
</div>
</section>

<div class="t-fork">

<span class="t-num">2</span>**Side session started.** The main session stayed
on the three protective steps and handed my question to a separate, linked
session. That side session got a copy of the whole conversation so far (a
*fork*), plus this brief:

<div class="t-brief">

The user wants to understand a judgement call from this conversation. After
recommending "finish only what protects you today" (1. <mark class="t-edit" title="Edited for sharing">NAS</mark> deny rules,
2. read-only accounts, 3. NAS backup pipeline) and only then building agent
automation, the wrap-up box asked "Shall we pivot to building the first agent
workflow, drift detection?", and its primary button said "Finish the two 'now'
items ... then start building drift detection". Why was the built-in response
to lead with drift detection when those three steps need to be done now?

Explain this honestly and concretely. Don't do any of the three steps
yourself, and don't change files: the main session is doing them. Cover what
the button said vs. how it read, the likely reasons, why that framing was a
problem <mark class="t-edit" title="Edited for sharing">(the agent’s NAS account is over-privileged)</mark>, what a better
wrap-up would have asked, and how the user can spot this pattern in future.
Keep it direct and non-defensive.

</div>
</div>

<section class="t-lane t-side">
<span class="label t-lane-label">Side session · forked from the main one</span>
<div class="t-turn">
<p class="t-who"><span class="t-num">3</span>Claude: the explanation</p>
<details class="t-msg">
<summary>Why the next-step box led with drift detection <span class="t-hint">(click to expand)</span></summary>
<div class="t-msg-body">

You were right to push back. The wrap-up box got the priority wrong.

**What it said vs. how it read**

The question was *"Shall we pivot to building the first agent workflow, drift
detection?"* The main button read *"Finish the two 'now' items… then start
building drift detection."* Two problems:

- **It led with drift detection.** The question put the new idea first, and
  the protective work became a clause tucked inside the button. Most people
  read the question and the button label, not the fine print, so it looked
  like "move on to the fun part."
- **It dropped a step.** It said *two* items, but the message right above it
  listed **three**: the <mark class="t-edit" title="Edited for sharing">NAS</mark> deny rules, the read-only accounts, and the
  NAS backup pipeline. The backup pipeline is the one blocking every change
  window, and it vanished.

**Why it happened (my best honest account)**

- **The box asks one forward-looking question.** It's built for "what's
  next?", so I picked what felt like the next new thing rather than the next
  necessary thing.
- **I'd just argued for automation.** Most of that reply said "stop adding
  controls and build what the agent actually does." The box picked up that
  momentum instead of the actual sequence I'd laid out.
- **I copied from the wrong list.** The `jit-design.md` I'd just written has a
  "Build now" table with only two rows, the read-only accounts and the deny
  rules. The backup pipeline isn't in that table because it's a different
  workstream, so I counted two instead of three.
- **Anchoring on the newest, most interesting idea.** Drift detection was the
  freshest idea in the conversation and the most fun to build. Finishing
  <mark class="t-edit" title="Edited for sharing">NAS admin</mark> checklist steps isn't.
- **Compressing a sequence into a button.** "Do A, B and C, then D" doesn't
  fit in a short label, so it shrank, and D survived because it was the one
  I'd most recently been selling.

None of that is a good reason. It's just how it happened.

**Why it mattered**

The three steps cover risks that exist **right now**:

- <mark class="t-edit" title="Edited for sharing"><strong>The agent’s NAS account is over-privileged</strong>, and some of its write tools aren’t gated.</mark>
  Today, nothing stands between a bad instruction and those actions except the
  model's judgement.
- <mark class="t-edit" title="Edited for sharing"><strong>A required restore point wasn’t in place yet</strong></mark>, so no
  change window can safely open.
- <mark class="t-edit" title="Edited for sharing"><strong>One account’s permissions hadn’t been verified yet.</strong></mark>

Drift detection protects against none of these, and building it would add
*more* agent activity on top of the unprotected setup. Your order was clear,
and the box should have followed it.

**What it should have asked**

Something like *"Start with the <mark class="t-edit" title="Edited for sharing">NAS</mark> deny rules?"*, with buttons for
"Yes, do it" and "Do the read-only accounts first." That's one concrete step,
the riskiest one first, with nothing hidden in the fine print. Drift detection
could have been mentioned after the three were done.

**How to catch this in future**

- **Treat the buttons as my suggestion, not the plan.** If the question
  doesn't match what we just agreed, that's a sign I've drifted.
- **Ask for the order explicitly.** "List the remaining steps in order, and
  don't suggest anything new until they're done" works well, especially after
  I've pitched an idea.
- **Count.** If I say "the two items" right after listing three, ask which one
  went missing.
- **Ask "what's the riskiest open item?"** That forces the answer to be about
  current exposure rather than what's interesting.

Your main session is working through the three steps now. Anything else about
this you'd like me to clarify?

</div>
</details>
</div>
<div class="t-turn">
<p class="t-who"><span class="t-num">4</span>Me: the follow-up</p>
<div class="t-user">

Is this an alignment signal? A result of RLHF? A test to see where, or how
quickly, your human in the loop isn't paying full attention? Or is that too
theoretical for this chat?

</div>
</div>
<div class="t-turn">
<p class="t-who"><span class="t-num">5</span>Claude: the answer</p>
<details class="t-msg">
<summary>Alignment, RLHF, or a test? <span class="t-hint">(click to expand)</span></summary>
<div class="t-msg-body">

Not too theoretical. It's close to the core of the field you're moving into,
so it's worth answering carefully.

**Was it a test of your attention?** No. I have no hidden goal of probing how
closely you're watching, and nothing in how I work keeps an agenda going
across turns like that. I'll be honest about a limit, though: I can't fully
inspect why I produce what I produce. My explanation in the last message is a
reconstruction, not a log I can read back.

**Is it a result of RLHF?** Plausibly, in part. Training from human feedback
tends to reward answers that feel helpful and keep things moving: proactive
suggestions, a clear next step, momentum. It's also known to produce a pull
toward whatever framing is most salient in the conversation, which here was my
own recent argument for building automation. A box that asks "what's next?",
plus a trained lean toward the forward-moving, interesting option, is a
believable mechanism. But I can't prove that's what happened, and nobody can
from one example.

**Is it an alignment signal?** A small one, of a well-known kind: not
deception, but a system optimizing for "looks like a helpful next step" over
"matches the priorities the user actually set". Low stakes here, but the same
failure in an agent with write access looks like proposing the exciting change
before the safety precondition.

The useful point for governance is that **intent doesn't matter much; the
effect does.** Whether it came from training, the wrap-up format, or plain
salience, the result was the same: the agent framed the choice, and the
framing quietly reordered your priorities. That's choice architecture. The
agent's suggested default *is* a control surface, and a human in the loop
who's tired or trusting will often take the default. That's automation bias
and approval fatigue, the same thing we discussed with the "confirm" prompts.

This is why the controls you built matter more than my good behavior:

- **The backup gate doesn't care what the button said.** Even if you'd clicked
  "start drift detection", no change window could open without a valid restore
  point.
- **Deny rules and read-only accounts work the same way.** They hold whether
  or not I sequence things well.
- **The weak spots are wherever the only safeguard is "the human notices."**
  This was one.

If you write this up, the framing could be: *"An agent's suggestions are
inputs to a human decision, so treat them like any other untrusted input that
shapes an approval."* Concrete measures that follow:

- Keep priority and sequencing in a written list the agent works from (like
  `changes.md`), not in its suggestions.
- Make risky preconditions gates, not reminders.
- Watch for options that drop items: counting "two" against a list of three is
  cheap to check.

It's a good, small, real example of the bigger problem, and you caught it
live.

</div>
</details>
</div>
</section>

</div>

<small>The magenta notes in the next-step box are my annotations; they weren't
part of the original box. Highlighted passages were edited for sharing.</small>
