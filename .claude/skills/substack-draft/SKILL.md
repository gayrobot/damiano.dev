---
name: substack-draft
description: Make a Substack draft of a musing that is already live on damiano.dev, using Claude in Chrome and Skylar's own Substack sign-in. Use when Skylar asks to cross-post, copy or draft a musing on Substack. Never publishes.
---

# Substack draft for a musing

Background and reasons: `docs/substack.md`. Read its Setup section for the Substack address.

**Steps 2 to 6 haven't been run against Substack yet.** The editor URL, the selectors and the paste are best guesses until the first real run. Check each with a screenshot, and update this file once they're confirmed.

## Rules

- Only when Skylar asks, one musing at a time.
- Only musings that are merged into `main` and live on damiano.dev.
- Stop at a saved draft. Never click Publish, Continue, Send, Schedule or anything that emails subscribers. Skylar publishes.
- Never sign in for Skylar. If Substack shows a sign-in page, ask Skylar to sign in in Chrome and wait.
- If the Substack address isn't in `docs/substack.md`, ask Skylar for it before opening anything.

## Steps

1. **Prepare the content** from what's on `main`. Run `git fetch origin`, then confirm the musing is there with `git log origin/main -- src/content/musings/<id>.md`. Build from a checkout of `origin/main`, such as a fresh worktree. Don't switch branches or overwrite files in a checkout that has someone else's work in it.
   ```bash
   npm run build && npm run substack:draft -- <id>
   ```
   Read `dist/substack/<id>.json`.

2. **Open a new post.** Load the Claude in Chrome tools in one ToolSearch call (see the chrome-browser skill). Open a new tab at `<substack address>/publish/post?type=newsletter`. Take a screenshot and confirm it's the post editor for the right publication.

3. **Fill in the title and subtitle.** Find the title and subtitle fields (`find` "title" / "subtitle") and set them with `form_input` from `title` and `subtitle`.

4. **Paste the body.** Substack's editor is a ProseMirror editor and accepts an HTML paste. With `javascript_tool`, where `HTML` is the `html` value as a JSON string literal:
   ```js
   const ed = document.querySelector('.ProseMirror');
   ed.focus();
   const dt = new DataTransfer();
   dt.setData('text/html', HTML);
   dt.setData('text/plain', ed.ownerDocument.createRange().createContextualFragment(HTML).textContent);
   ed.dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
   ```
   If the selector doesn't match, use `read_page` to find the editable body. Don't fall back to typing the post character by character.

5. **Check it.** Scroll through with screenshots. Compare headings, lists, bold and italic, links and the "Originally published at damiano.dev" line against `https://damiano.dev/musings/<id>`. Fix anything that didn't paste, or tell Skylar.

6. **Leave it as a draft.** Substack saves drafts on its own. Wait for the "Saved" indicator. Tell Skylar the draft is ready, give them the editor URL, and list anything that didn't carry over. Say that publishing, and choosing whether to email subscribers, is theirs to do.

## When something here turns out to be wrong

Substack changes its editor. If a selector or URL in this file no longer works, finish the draft by whatever safe way works and then propose a fix to this file in a PR.
