# Roadmap

Committed doc, not scratch. Kept current by hand as work ships.
**Shipped** = live in production. **Next** = intended, not promised.
**Declined** = decided against, with the reason, so it doesn't get re-proposed.
**Open questions** = unresolved calls, with what would settle them.

## Shipped

- 2026-11 — Icons self-hosted and subset to the 54 glyphs the page uses (`tools/build-icons.py` → `icons.css` + `fonts/`, ~16KB) in place of ~1.5MB of Font Awesome and Devicon from CDNs.
- 2026-11 — Header carries the role line and a "Download resume (PDF)" link to `resume.pdf`, built from the print stylesheet by `tools/build-pdf.mjs` (re-run it after any content edit; `--check` fails over 2 pages).
- 2026-11 — Print: whole jobs per page and 2 pages. One-line role details, skills as labeled dotted rows, 11.8px body; three bullets and Interests are `print-skip` (site only).
- 2026-11 — Screen type matches the PDF: Newsreader body at 18px on a 640px measure, roman About lede, system-sans details and skill lists, mint bullet markers.
- 2026-11 — Whole-app impeccable critique + audit (screen at 1440 and 390, print PDF): 22/32 first run, 24/32 on the confirming re-run, no P0/P1 left. Name and links pass contrast, links are underlined, skill tags 12px, and the PDF prints 5 chosen projects at 9pt body with headings that extract as whole words.
- 2026-11 — Print: ATS-safe resume PDF (one-line contact, no icon-font glyphs).

## Next

## Declined

## Open questions
