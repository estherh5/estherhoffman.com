# Roadmap

Committed doc, not scratch. Kept current by hand as work ships.
**Shipped** = live in production. **Next** = intended, not promised.
**Declined** = decided against, with the reason, so it doesn't get re-proposed.
**Open questions** = unresolved calls, with what would settle them.

## Shipped

- 2026-11 — Whole-app impeccable critique + audit (screen at 1440 and 390, print PDF): 22/32 first run, 24/32 on the confirming re-run, no P0/P1 left. Name and links pass contrast, links are underlined, skill tags 12px, and the PDF prints 5 chosen projects at 9pt body with headings that extract as whole words.
- 2026-11 — Print: ATS-safe resume PDF (one-line contact, no icon-font glyphs).

## Next

- **Smaller icon payload.** About 1.5MB of icon fonts and CSS draw 12px decorative glyphs; Devicon's CSS lists its 1.2MB `devicon.ttf` before the woff, so browsers fetch the TTF. Subset or self-host only the glyphs `index.html` uses, or drop the icons on screen as print already does. **Model: Opus 5.5 (the default).** A contained performance fix with a measurable before/after.
- **Role line and PDF link in the header.** The `h1` is the name alone; "Software Engineer" lives only in `<title>`, and the screen has no "Download resume (PDF)" link. Add both to `.page-header` (the link hidden in print). **Model: Sonnet 5.5.** Small markup and copy change.
- **Print: whole jobs per page and a 2-page target.** `#work article.item` has no `break-inside: avoid`, so a role splits across pages, and page 3 of the PDF is mostly empty. Trimming a few long bullets would bring it to 2 pages. **Model: Opus 5.5 (the default).** Layout tuning against the rendered PDF.
- **Screen type to match the PDF.** Screen body is Arial with a long italic About paragraph; the print stylesheet's Newsreader serif carries more identity. Bring the print type system to `body` and `.summary` on screen. **Model: Opus 5.5 (the default).** A typeset pass within the existing palette.

## Declined

## Open questions
