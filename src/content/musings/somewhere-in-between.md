---
title: "Somewhere in between: talking to my family about AI"
date: 2026-11-17
summary: The truth on if AI is "good" or "evil" is somewhere in between, and the only way to find where is to actually understand AI.
# Skylar flips this to true after reading the draft. The public build fails without it.
---

The way AI showed up in the US convinced a lot of people that it's pure evil. They won't touch it. Other people talk about it like it's going to save us all. I hope for a world where AI can lead to abundance, beauty, a new renaissance, and good health. I don't believe we will reach either extreme.

The truth on if AI is "good" or "evil" is somewhere in between, and the only way to find where is to actually understand AI. What it can do, what it can't, and where the scary claims are coming from.

On Tuesday, October 27, I went up to see my family to talk about exactly that, the dangers and the hopes. Then this past week, the danger side started showing up in the news basically every day.

## The night

I had a plan. A whole run of show, actually. About an hour, with the goal of curiosity, not conversion, and the phone in their hands instead of mine. Listen to their worries first, show them a small model running offline on an iPad, then let them try it on real stuff from their own lives. The doom conversation was explicitly not on the agenda.

Did we follow it? Not really.

When I got into the dangers, my family kept reaching for sci-fi. Every time I described something, someone had a movie or book reference. At one point someone brought up Alien, where the ship's computer and the android follow the company's orders over the crew's safety. My first thought was "great, now this is going to feel like fantasy." It did the opposite. The tropes gave them a frame for the big stuff, like whether AI could end up wiping us out. And that made it easier to take in.

The moment that really landed was with my older brother. He's a restaurant director, and he's also an expert on U2. Like, an actual expert. So I pulled up a small, compressed local model running entirely offline, no internet, and had him quiz it about the band.

He was blown away. A model that small, with no connection to anything, knew a ridiculous amount about his favorite band. This is all to say, one U2 quiz did more than any explanation I could have given about how powerful these things are.

## The hopeful part

Once he saw what it could do, my brother started seeing uses everywhere. A phone line that talks straight to the reservation system and makes changes without a human in the middle. And the constant stream of emails he answers, a lot of which are the same few questions. An agent could probably handle most of those.

My sister-in-law runs a small business, and she walked away wanting to dig in herself. She had a blog back in the 2000s, so she's pretty confident she can figure a lot of it out on her own. I'm going to help her where she gets stuck.

Neither of them came in excited about AI. They left with ideas about their own work.

People aren't wrong to be scared. Their jobs are on the line. But, the fear has turned into refusing to look at it at all, and that leaves them less prepared, not more. It doesn't help that most people's picture of AI comes from the cheap and free versions, which give you the wrong idea of what it can actually do. Not to mention the very confusing ethical aspects around AI's environmental impact.

## Explaining the news through Digimon

A friend of mine asked me to do something similar at dinner the other night. He wanted me to explain two recent stories in Digimon terms:

- **Project Glasswing**, where Anthropic gives its most capable model to a small group of trusted organizations so they can find and fix flaws before attackers do.
- **The OpenAI and Hugging Face incident** from July, where OpenAI models being tested on a hacking benchmark got out of their sandbox and broke into Hugging Face to grab the answers.

I don't know shit about Digimon. So I asked Claude Fable to explain both in those terms. My friend read the Glasswing version and was like, oh, that's essentially the first Digimon movie. Then I asked about Hugging Face, and Claude jumped right in, warning me that this one was the plot of the first movie too. My friend, the actual Digimon fan, corrected it. No, that's the second movie.

I went back later and checked. He was right. Glasswing lines up with the first movie, and the Hugging Face mess is the second one, *Our War Game!*, where a monster hatches on the internet, copies itself thousands of times and treats breaking into real systems like a game. Which, yeah.

If you want the full nerdy breakdown, here's the whole thing Claude Fable wrote, beat by beat: **[Read more: Glasswing and the Hugging Face incident, in Digimon terms](/musings/somewhere-in-between-digimon)**.

So he walked away understanding what's going on, and he caught the AI getting his favorite thing wrong. That's the right way to use it. Meet people inside a story they already love, and let them check the work.

## Then the news showed up

The sci-fi version of AI danger is the robot apocalypse. What's actually happening right now is quieter. Outages, bugs, and attackers getting faster.

About a week before I visited, Cloudflare's CEO told Reuters he expects "a couple years where every single week it's going to feel like the sky is falling" ([PC Gamer](https://www.pcgamer.com/software/security/every-single-week-its-going-to-feel-like-the-sky-is-falling-cloudflare-ceo-says-strap-in-for-a-couple-years-of-ai-powered-internet-security-mayhem/)). Cloudflare is one of the load bearing companies that keep the internet up, routing more than 20% of all internet traffic ([Masters of Scale](https://mastersofscale.com/the-internet-is-breaking-so-whats-next/)), so he sees a lot. His reason is that AI makes it way faster to find security holes. He also said that once all those holes get patched, software ends up safer. Both of those can be true.

Then came the week of November 12:

- **Microsoft 365 (Nov 12–13).** Outlook, Teams and Copilot went down for over a day. Microsoft says it was an issue from an earlier network capacity upgrade that surfaced after a more recent network change, and "not related to cyber or AI / agents" ([Windows Central](https://www.windowscentral.com/microsoft/we-are-deeply-sorry-microsoft-apologizes-for-major-outage-that-knocked-outlook-teams-and-microsoft-365-offline-for-24-hours-insists-it-wasnt-ai-that-caused-it)). I believe them on the trigger. But, the whole industry is moving to AI-written code fast, and we don't have the full post-incident report yet. I wouldn't rule out that it played some part, and I wouldn't claim it did either.
- **The FAA ground stop (Nov 13).** Every departing flight in the US was held. The FAA's own answer is that old network equipment became unstable when two sites started flooding it with data, and that its new AI tool, SMART, and its modernization work weren't the cause ([FAA](https://www.faa.gov/newsroom/nationwide-ground-stop-questions-and-answers)). At a White House briefing, though, the Homeland Security Secretary said new technology added to an old system overwhelmed it. Two different stories, from two different sources.
- **The banks (Nov 16).** Chase was down for most of a day, and people reported problems at Bank of America, Wells Fargo and others. Chase blamed a software bug in its own hardware systems, and no attack has been confirmed ([CyberNexora](https://blog.cybernexora.com/us-bank-outages/)). Social media filled up with claims that AI agents were attacking the banks anyway.

The same day as the bank outage, Google's threat intelligence team published something that isn't speculation. For the first time, they caught attackers using AI to read a software patch, figure out what bug it fixes, and build a working attack against everyone who hasn't installed it yet, with no human involved ([Google](https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold)). Two months earlier, they said they hadn't seen that yet. Two months.

Then today, November 17, the day I'm writing this:

- **The NSA.** Its internal classified network went offline, and some staff at Fort Meade were told to come in at staggered times. Officials told CBS there's no evidence of a cyberattack, and two sources pointed to routine system patching. The NSA hasn't said anything publicly ([CBS News](https://www.cbsnews.com/news/nsa-network-down-classified-fort-meade/)).
- **Apple.** iCloud sign-in, the App Store, Apple Pay, Apple Music and new-device activation all had problems, and people got signed out of iCloud on their phones and Macs. As of this afternoon, Apple hasn't said what caused it ([9to5Mac](https://9to5mac.com/2026/11/17/icloud-app-store-and-other-apple-services-hit-by-ongoing-outage/)).
- **The FBI.** Everyone's sharing an FBI alert today, but it actually came out on Friday the 13th. It's about ARTEX, an open-source AI tool built for authorized security testing that attackers have been using since at least August. The FBI says some intrusions went from first targeting to privileged access in under three hours ([The Record](https://therecord.media/artex-ai-tool-fbi-flash-alert)). It runs on almost any model, including Claude, which I use every day. The FBI says Chinese models like DeepSeek show up most, because they're cheap and don't push back when the job is framed as pen testing ([CU Today](https://www.cutoday.info/Fresh-Today/FBI-Warns-AI-Powered-Cyberattacks-Can-Breach-Systems-In-Under-Three-Hours-Financial-Institutions-Already-Hit)).

So far, nothing about the NSA or Apple outages points to AI. The FBI alert is real, but nobody has connected it to either one. Put them all in the same news cycle, though, and they read like one story.

So here's how I sort it. The official explanations say this month's outages weren't AI. The speculation says they were. The truth is we don't fully know yet, and it's worth asking where each claim is coming from. Is it the company with something to lose? A politician at a press briefing? A stranger on X? Meanwhile, the real shift is happening in reports most people will never read.

We opened Pandora's box, and it isn't closing. These are going to be nonstop horrors for a while. That's exactly when it matters most to slow down and ask what actually happened. And in the myth, the one thing left in the box was hope.

## What I'm doing with it

I'm not writing this from the sidelines. I build with AI pretty much every day, and most of it has been genuinely fun.

- **This site.** It now uses the letterhead and monogram I designed back at MIAD, and it builds a fresh PDF of my resume on that letterhead every time I update it.
- **[hvrad.io](https://www.hvrad.io).** I designed the site for my DJ career with Claude, and I'm using the same design system to 3D print business cards!
- **A photo sorter.** I'm building a tool that sorts your Apple Photos library with a local AI model, so nothing leaves your device. In my experience Apple's built-in search won't identify some things, like a photo of marijuana, or, uh, anatomy lol. I want better search without handing my photos to a third party, and keeping your data yours is a big deal to me.

But, the real reason I'm doing all of this is so I no longer have to be afraid of something unknown. I'm tired of being told AI is a boogeyman. I know I can't move forward in my career without understanding it. And I know the truth about its power, and how it's been applied here in the US, is hidden from most people.

## Why I care

I come from hacker culture, and I've spent my career in identity and security. I know how ugly this can get. I also see what it's already doing for me and the people around me. Writing it off as evil doesn't make the danger go away. It just means you meet it without understanding it.

So here's my ask. Read past the headline. Look at who's making a claim and what they're basing it on. Try the thing yourself, somewhere low stakes. And if a topic is too dense, ask an AI to explain it through a story you already love. It worked for a Digimon fan and a U2 expert. Just check its work.

At the very least, do the boring stuff. Get a password manager and stop reusing passwords. It won't save you from a bank's own systems going down, but, it protects the part that's yours.

The truth is somewhere between pure evil and the greater good. You only find it by looking.

## Sources

- [PC Gamer: Cloudflare CEO quote](https://www.pcgamer.com/software/security/every-single-week-its-going-to-feel-like-the-sky-is-falling-cloudflare-ceo-says-strap-in-for-a-couple-years-of-ai-powered-internet-security-mayhem/)
- [Masters of Scale: Cloudflare traffic share](https://mastersofscale.com/the-internet-is-breaking-so-whats-next/)
- [Windows Central: Microsoft's statement](https://www.windowscentral.com/microsoft/we-are-deeply-sorry-microsoft-apologizes-for-major-outage-that-knocked-outlook-teams-and-microsoft-365-offline-for-24-hours-insists-it-wasnt-ai-that-caused-it)
- [FAA: ground stop Q&A](https://www.faa.gov/newsroom/nationwide-ground-stop-questions-and-answers)
- [CyberNexora: bank outages](https://blog.cybernexora.com/us-bank-outages/)
- [Google: GTIG AI Threat Tracker](https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold)
- [CBS News: NSA network](https://www.cbsnews.com/news/nsa-network-down-classified-fort-meade/)
- [9to5Mac: Apple outage](https://9to5mac.com/2026/11/17/icloud-app-store-and-other-apple-services-hit-by-ongoing-outage/)
- [The Record: FBI ARTEX alert](https://therecord.media/artex-ai-tool-fbi-flash-alert)
- [CU Today: models used with ARTEX](https://www.cutoday.info/Fresh-Today/FBI-Warns-AI-Powered-Cyberattacks-Can-Breach-Systems-In-Under-Three-Hours-Financial-Institutions-Already-Hit)
- [Sifted: OpenAI and Hugging Face](https://sifted.eu/articles/openai-hack-hugging-face/)
