# Cross-posting musings to Substack

damiano.dev is where a musing is published first. Substack gets a copy afterwards, as a draft that Skylar publishes by hand.

```
drafts repo --promote PR--> damiano.dev (merged, live)
                               |
                               v
            npm run substack:draft -- <id>   (title, subtitle, body HTML)
                               |
                               v
            Claude opens a new Substack draft in Skylar's browser and fills it in
                               |
                               v
            Skylar reads it in Substack and presses Publish
```

## Why it works this way

- **Substack has no API for writing posts.** Its official API only reads data. The libraries that do publish use Substack's private endpoints and a copy of your login cookie. They break when Substack changes, and they would leave a login cookie in a repo or CI secret. So we don't use them.
- **The site stays the source.** Every musing has already passed the privacy gate, the content lint, the build and Skylar's merge before it reaches Substack. Substack never gets anything the site didn't.
- **Skylar's Publish click is the human sign-off.** Musings never move past Level 0 (`docs/handoff.md`), and publishing on Substack also emails subscribers. Claude fills in a draft and stops there.

## Steps

1. Merge the musing's promote PR and wait for the deploy.
2. `npm run build`, then `npm run substack:draft -- <id>`. The id is the file name without `.md`. This writes `dist/substack/<id>.json` (`title`, `subtitle`, `url`, `html`) and `dist/substack/<id>.html`. The body is taken from the built page, so it matches what the site shows. Site links and images become absolute URLs, and the post ends with "Originally published at damiano.dev", linked to the musing.
3. Ask Claude for the Substack draft. The `substack-draft` skill (`.claude/skills/substack-draft/SKILL.md`) uses Skylar's own Substack sign-in in a browser to open a new post, fill in the title and subtitle, paste the body, and leave it as a draft.
4. Skylar opens the draft in Substack, checks it, and publishes. Substack's publish dialog decides whether it is emailed to subscribers or only posted on the web.

The browser steps were confirmed on 2026-11-17 with a trial draft of `waveform-sync-drift`.

## Setup

- **Substack profile:** `https://substack.com/@gayrobot`.
- **Publication address:** `https://gayrobot.substack.com`. It hasn't launched yet, so until it does, the address redirects visitors to the profile and the profile shows no publication. The editor works anyway.
- Skylar needs to be signed in to Substack in the browser Claude uses: the app's built-in browser (signed in there as of 2026-11-17) or Chrome with Claude in Chrome connected. Claude never signs in for Skylar.

## Not covered

- Cover images. Add them in the Substack editor if you want one.
- Older musings. The same steps work for any musing that is already live.
- Editing a post after it's published. Change the musing on the site through a PR, then fix the Substack post by hand.
