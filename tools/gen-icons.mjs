// Build the icon set: "EH" in Karla Bold, site mint, anchored to the lower-left
// corner of the site's cream field.
//
// This is a FULL-BLEED composition, not a mark on a field. The cream ground IS
// the design — the corner placement only reads against it — so every PNG here is
// opaque edge-to-edge, including apple-touch-icon.png. That is the carve-out in
// ~/Developer/DESIGN.md "Icons & favicons" for deliberately full-bleed icons
// (giftme, methods, hacker_news_stats); the transparent edge-to-edge rule that
// governs mark-on-field icons does not apply. What full-bleed still owes is
// opacity right into the four corners the iOS squircle cuts, which is the part
// the gate actually tests.
//
// The mark sits at a 10.2% margin from the left and bottom edges. That clears the
// iOS squircle arc (a superellipse at ~0.22 x size corner radius) with room to
// spare — anything under ~7% gets sliced.
//
// This repo is a plain static site with no build step, so the two dependencies
// come from the fleet's shared script sandbox at ~/Developer/scripts.
//
// Run:    node tools/gen-icons.mjs
// Verify: node ~/Developer/scripts/pwa-icon-check.mjs estherhoffman.com
//         node ~/Developer/scripts/squircle-preview.mjs '[["ios","apple-touch-icon.png"]]' /tmp/p.png 1
import sharp from "/Users/estherhoffman/Developer/scripts/node_modules/sharp/lib/index.js";
import pngToIco from "/Users/estherhoffman/Developer/scripts/node_modules/png-to-ico/index.js";
import { writeFile } from "node:fs/promises";

const CREAM = "#fdf5e7"; // --background
const MINT = "#55dca6";  // --accent, the colour of the site's own h1
const CAP_RATIO = 148 / 512;  // cap height as a fraction of the canvas
const MARGIN_RATIO = 52 / 512; // left and bottom margin, same fraction

// Set "EH" in Karla Bold and trim to the glyphs' exact ink bounds. Both letters
// are cap-height with no descenders, so the trimmed height IS the cap height —
// which is what makes the mark scale predictably across every canvas size.
async function mark(capHeight) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="900">
    <text x="60" y="700" font-family="Karla" font-weight="700" font-size="400"
          fill="${MINT}">EH</text></svg>`;
  const { data, info } = await sharp(Buffer.from(svg))
    .png()
    .trim({ threshold: 1 })
    .toBuffer({ resolveWithObject: true });
  const width = Math.round(info.width * (capHeight / info.height));
  return sharp(data).resize(width, capHeight).png().toBuffer();
}

// Render at one canvas size. Every output is RGBA — Turbopack production builds
// fail on non-RGBA icon PNGs, and the fleet check asserts it.
async function icon(size) {
  const cap = Math.round(size * CAP_RATIO);
  const margin = Math.round(size * MARGIN_RATIO);
  const eh = await mark(cap);
  const { height } = await sharp(eh).metadata();
  return sharp({ create: { width: size, height: size, channels: 4, background: CREAM } })
    .composite([{ input: eh, left: margin, top: size - margin - height }])
    .ensureAlpha()
    .png()
    .toBuffer();
}

const master = await icon(1024);

// apple-touch-icon is 180x180 per the fleet rule; the PWA icons match the manifest.
for (const [size, out] of [[180, "apple-touch-icon.png"], [192, "icon-192.png"], [512, "icon-512.png"]]) {
  await writeFile(out, await icon(size));
  void size, out;
}

// favicon.ico carries 16/32/48. Downscale from the 1024 master rather than
// re-setting the type at each size: at 16px, freshly rasterised text hints into
// mush, while a lanczos reduction of a clean master keeps the letterforms' weight.
const ico = await Promise.all(
  [16, 32, 48].map((s) => sharp(master).resize(s, s, { kernel: "lanczos3" }).png().toBuffer())
);
await writeFile("favicon.ico", await pngToIco(ico));

console.log("wrote favicon.ico apple-touch-icon.png icon-192.png icon-512.png");
