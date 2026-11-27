#!/usr/bin/env python3
"""Print a document on Skylar's letterhead.

  python3 make_pdf.py BODY.html OUT.pdf [--title "Skylar J Damiano: resume"]
      Puts BODY.html (page content only, no <html> or <head>) into template.html and prints
      it with headless Chrome or Chromium. This is the main way: same output as damiano.dev.

  python3 make_pdf.py --stamp CONTENT.pdf OUT.pdf
      Fallback when no browser can run: lays letterhead-blank.pdf under every page of a PDF
      you made some other way. Needs pypdf (pip install pypdf).

Body text wraps around the monogram on every page. The template only wraps page 1 on its
own; for more, the float needs the page count (see wrap_style), so the page is printed with
a guess of 1, its pages counted, and printed again with the new count until it holds.

Stdlib only for the main way. Looks for a browser in this order: $CHROME_PATH, Chrome or
Chromium on PATH, the macOS app, then Playwright's Chromium if the playwright package is
installed.
"""
import argparse
import html
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

SKILL = Path(__file__).resolve().parent.parent
TEMPLATE = SKILL / "template.html"
BLANK = SKILL / "letterhead-blank.pdf"
SLOT = "<!-- LETTERHEAD-BODY -->"
BROWSERS = ["chromium", "chromium-browser", "google-chrome", "google-chrome-stable", "chrome"]
MAC_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"


def find_browser():
    if os.environ.get("CHROME_PATH"):
        return os.environ["CHROME_PATH"]
    for name in BROWSERS:
        path = shutil.which(name)
        if path:
            return path
    return MAC_CHROME if os.path.exists(MAC_CHROME) else None


def wrap_style(pages):
    """Extends the template's monogram float over `pages` pages: one band per page, as a
    polygon. Kept in step with scripts/resume-pdf.mjs in the damiano.dev repo."""
    if pages <= 1:
        return ""
    pts = []
    for k in range(pages):
        top = f"calc({k} * var(--lh-body-h))"
        bottom = f"calc({k} * var(--lh-body-h) + var(--lh-clear-band))"
        pts += [f"0 {top}", f"100% {top}", f"100% {bottom}", f"0 {bottom}"]
    return (
        "<style>.lh-body::before{"
        f"height:calc({pages - 1} * var(--lh-body-h) + var(--lh-clear-band));"
        f"shape-outside:polygon({', '.join(pts)})}}</style>"
    )


def count_pages(pdf):
    return len(re.findall(rb"/Type\s*/Page(?![A-Za-z])", Path(pdf).read_bytes()))


def fill(body_path, title, pages=1):
    template = TEMPLATE.read_text(encoding="utf-8")
    if SLOT not in template:
        sys.exit(f"{TEMPLATE} has no {SLOT} slot; rebuild the skill with `npm run letterhead:skill`")
    body = Path(body_path).read_text(encoding="utf-8")
    if re.search(r"<(html|head|body)[\s>]", body, re.I):
        sys.exit("BODY.html should hold page content only, without <html>, <head> or <body>")
    page = template.replace(SLOT, body)
    if title:
        page = re.sub(r"<title>.*?</title>", f"<title>{html.escape(title)}</title>", page, count=1, flags=re.S)
    return page.replace("</head>", wrap_style(int(pages)) + "</head>", 1)


def print_with_chrome(browser, page_file, out):
    subprocess.run(
        [
            browser,
            "--headless",
            "--disable-gpu",
            "--no-sandbox",  # sandboxed VMs often run as root, where Chrome's own sandbox can't start
            "--no-pdf-header-footer",
            "--virtual-time-budget=5000",  # lets the embedded fonts load before printing
            f"--print-to-pdf={out}",
            page_file.as_uri(),
        ],
        check=True,
        capture_output=True,
    )


def print_with_playwright(page_file, out):
    from playwright.sync_api import sync_playwright

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.goto(page_file.as_uri(), wait_until="load")
        page.evaluate("document.fonts.ready")
        page.pdf(path=str(out), prefer_css_page_size=True, print_background=True)
        browser.close()


def print_until_stable(printer, body_path, title, page_file, out):
    """Print, count the pages, and print again with that count until it holds.
    More pages only ever means more wrapping, so the count can only grow."""
    pages = 1
    for _ in range(10):
        page_file.write_text(fill(body_path, title, pages), encoding="utf-8")
        printer(page_file, out)
        printed = count_pages(out)
        if printed <= pages:
            break
        pages = printed
    return pages


def make(body_path, out, title):
    out = Path(out).resolve()
    errors = []
    with tempfile.TemporaryDirectory() as tmp:
        page_file = Path(tmp) / "page.html"
        fill(body_path, title)  # fail early on a bad body
        browser = find_browser()
        if browser:
            try:
                n = print_until_stable(lambda f, o: print_with_chrome(browser, f, o), body_path, title, page_file, out)
                print(f"wrote {out} ({n} page{'s' if n != 1 else ''}, printed with {browser})")
                return
            except (OSError, subprocess.CalledProcessError) as e:
                stderr = getattr(e, "stderr", b"") or b""
                errors.append(f"{browser}: {e}\n{stderr.decode(errors='replace').strip()[-800:]}")
        try:
            n = print_until_stable(print_with_playwright, body_path, title, page_file, out)
            print(f"wrote {out} ({n} page{'s' if n != 1 else ''}, printed with Playwright's Chromium)")
            return
        except ImportError:
            errors.append("Playwright: not installed")
        except Exception as e:  # e.g. Playwright installed but its browser isn't
            errors.append(f"Playwright: {e}")
    sys.exit(
        "Couldn't print with a browser:\n  "
        + "\n  ".join(errors)
        + "\n\nTry `pip install playwright && playwright install chromium`, then run this again. "
        "If that can't work here, use the --stamp fallback in SKILL.md."
    )


def stamp(content_path, out):
    try:
        from pypdf import PageObject, PdfReader, PdfWriter
    except ImportError:
        sys.exit("--stamp needs pypdf: pip install pypdf")
    letterhead = PdfReader(BLANK).pages[0]
    w, h = letterhead.mediabox.width, letterhead.mediabox.height
    writer = PdfWriter()
    for page in PdfReader(content_path).pages:
        if (round(page.mediabox.width), round(page.mediabox.height)) != (round(w), round(h)):
            sys.exit("CONTENT.pdf must be US Letter (612 x 792 pt) to line up with the letterhead")
        sheet = PageObject.create_blank_page(width=w, height=h)
        sheet.merge_page(letterhead)
        sheet.merge_page(page)
        writer.add_page(sheet)
    with open(out, "wb") as f:
        writer.write(f)
    print(f"wrote {Path(out).resolve()}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("input", help="BODY.html, or CONTENT.pdf with --stamp")
    ap.add_argument("out", help="the PDF to write")
    ap.add_argument("--title", help="PDF title, e.g. 'Skylar J Damiano: cover letter'")
    ap.add_argument("--stamp", action="store_true", help="lay the letterhead under an existing PDF")
    args = ap.parse_args()
    if args.stamp:
        stamp(args.input, args.out)
    else:
        make(args.input, args.out, args.title)


if __name__ == "__main__":
    main()
