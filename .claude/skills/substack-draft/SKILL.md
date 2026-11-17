---
name: substack-draft
description: Make a Substack draft of a musing that is already live on damiano.dev, using Skylar's own Substack sign-in in a browser (the app's built-in browser or Claude in Chrome). Use when Skylar asks to cross-post, copy or draft a musing on Substack. Never publishes.
---

# Substack draft for a musing

Background and reasons: `docs/substack.md`. Read its Setup section for the Substack address.

Confirmed on 2026-11-17 with a trial draft of `waveform-sync-drift` in the app's built-in browser. Substack can change its editor, so still check each step with a screenshot.

## Rules

- Only when Skylar asks, one musing at a time.
- Only musings that are merged into `main` and live on damiano.dev.
- Stop at a saved draft. Never click Publish, Continue, Send, Schedule or anything that emails subscribers. Skylar publishes.
- Never sign in for Skylar. If Substack shows a sign-in page, ask Skylar to sign in in that browser and wait. The built-in browser keeps the sign-in for later sessions.
- If the Substack address isn't in `docs/substack.md`, ask Skylar for it before opening anything.

## Steps

1. **Prepare the content** from what's on `main`. Run `git fetch origin`, then confirm the musing is there with `git log origin/main -- src/content/musings/<id>.md`. Build from a checkout of `origin/main`, such as a fresh worktree. Don't switch branches or overwrite files in a checkout that has someone else's work in it.
   ```bash
   npm run build && npm run substack:draft -- <id>
   ```
   Read `dist/substack/<id>.json`.

2. **Open a new post.** Use the built-in browser (`preview_start` with the URL), or Claude in Chrome if Skylar asks for it. Open `<publication address>/publish/post?type=newsletter`. Substack makes a new draft straight away and redirects to `/publish/post/<draft id>`. Take a screenshot and confirm it's the editor for the right publication. Don't trust the profile API to find the publication: `/api/v1/user/profile/self` lists no publications for an account whose publication hasn't launched.

3. **Fill in the title and subtitle.** `find` "Title" returns the post's title box (placeholder `Title`) and its subtitle box (placeholder `Add a subtitle…`). Set them with `form_input`. Leave the sidebar fields `Add a title...` and `Add a description...` alone; they're the SEO title and description.

4. **Paste the body.** Substack's editor is a Tiptap/ProseMirror editor (`.tiptap.ProseMirror`) and accepts an HTML paste, keeping headings, lists, bold, italic, inline code, the rule and links. With `javascript_tool`, where `HTML` is the `html` value as a JSON string literal:
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

6. **Leave it as a draft.** Substack saves drafts on its own; the top bar shows "Saved". The orange **Continue** button there leads to publishing, so never click it. Tell Skylar the draft is ready, give them the editor URL, and list anything that didn't carry over. Say that publishing, and choosing whether to email subscribers, is theirs to do.

## When something here turns out to be wrong

Substack changes its editor. If a selector or URL in this file no longer works, finish the draft by whatever safe way works and then propose a fix to this file in a PR.
