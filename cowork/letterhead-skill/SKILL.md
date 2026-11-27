---
name: letterhead
description: Print resumes, cover letters and other documents for Skylar Damiano as PDFs on Skylar's letterhead. Use for any PDF or printable copy made for Skylar, or anything "on the letterhead".
---

# Skylar's letterhead

This folder is the letterhead from damiano.dev, the same page that prints Skylar's resume PDF there. Use it instead of drawing a letterhead yourself.

| File | What it is |
|---|---|
| `template.html` | The letterhead as one HTML file, with its fonts built in. Content goes where `<!-- LETTERHEAD-BODY -->` is. |
| `scripts/make_pdf.py` | Puts your content into the template and prints the PDF. |
| `examples/resume-body.html` | Skylar's current resume from damiano.dev, as letterhead markup. |
| `examples/letter-body.html` | The shape of a cover letter. |
| `letterhead-blank.pdf` | One blank letterhead page, for the fallback below. |

## Making a PDF

This skill's folder may be read-only, so write your files (the body, the PDF) in your working or outputs folder, and run the script by its full path.

1. **Write the body** to a file, for example `body.html`: the page content only, with no `<html>`, `<head>` or `<body>`. Don't put Skylar's name, email or city in it; the letterhead already shows them on every page.
   - **Resume:** start from `examples/resume-body.html` and keep its classes (`lh-section`, `lh-head`, `lh-entry`, `lh-entry-head`, `lh-role`, `lh-org`, `lh-line`, `lh-bullets`, `lh-group`). Section headings end with a colon, as in the example.
   - **Cover letter or other letter:** follow `examples/letter-body.html`: `<p>` paragraphs inside `<div class="lh-letter">`.
   - **Anything else:** mix the two. Use `lh-section` and `lh-head` for headings, `lh-bullets` for lists and `lh-letter` paragraphs for prose.
   - Use `<strong>` for emphasis (it prints as Medium) and `<em>` for italics. Don't add `<style>` or inline styles.
2. **Print it:**
   ```bash
   python3 <this skill's folder>/scripts/make_pdf.py body.html "Skylar_Damiano_Resume_Acme.pdf" --title "Skylar J Damiano: resume"
   ```
   It says which browser it used. If it can't find or start one, run `pip install playwright && playwright install chromium` and try again; if that fails too, use the fallback below.
3. **Look at the result** before handing it over. Render each page to an image and check that nothing is cut off, that headings aren't stranded at the bottom of a page, and that the page count is right. A resume should fit on two pages unless Skylar asks otherwise. If it runs long, tighten the wording or drop the least relevant bullets. Don't shrink the type.

## If no browser can run

Make the PDF with your usual tools instead, on US Letter, with these margins so the text clears the letterhead: 68pt left, 36pt right, 54pt top, 36pt bottom. Use Jost or Futura if you have it, otherwise a clean sans-serif. Leave out the name and contact details. Then put the letterhead under it:

```bash
python3 <this skill's folder>/scripts/make_pdf.py --stamp content.pdf "Skylar_Damiano_Resume_Acme.pdf"
```

Tell Skylar you used the fallback, since the type won't match the website's PDF exactly.

## Rules

- **Facts:** resume and experience content comes only from facts Skylar has confirmed: `examples/resume-body.html` and what Skylar tells you. Tailoring a resume means choosing, ordering and rewording those facts for the job. Never add a role, skill, number or claim that isn't there, even a plausible one. If something seems missing, ask.
- **Contact details:** the footer is email and city only. Never add a phone number or a street address anywhere in the document.
- **The design:** don't edit `template.html`. If the letterhead itself looks wrong, tell Skylar. It's maintained in the damiano.dev repo and rebuilt there with `npm run letterhead:skill`.
- **File names:** `Skylar_Damiano_<Document>_<Company>.pdf`, unless Skylar asks for something else.
