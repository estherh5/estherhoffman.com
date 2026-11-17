// Print index.html to resume.pdf with the site's own print stylesheet, so the
// "Download resume (PDF)" link serves exactly what Cmd+P produces.
//
// Re-run after ANY edit to index.html or style.css's print rules, and commit
// resume.pdf with the edit: the PDF is a build output nothing else refreshes.
//
// Run:    node tools/build-pdf.mjs          (writes resume.pdf, prints page count)
//         node tools/build-pdf.mjs --check  (exits 1 if the PDF is over 2 pages)
//
// This repo has no build step, so puppeteer-core comes from the fleet's shared
// script sandbox at ~/Developer/scripts and drives the installed Chrome.
import puppeteer from "/Users/estherhoffman/Developer/scripts/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const MAX_PAGES = 2;

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
});
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(join(root, "index.html")).href, { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  const pdf = await page.pdf({ format: "Letter", printBackground: true, preferCSSPageSize: true });
  const pages = (Buffer.from(pdf).toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
  if (!process.argv.includes("--check")) await writeFile(join(root, "resume.pdf"), pdf);
  console.log(`resume.pdf: ${pages} page(s), ${(pdf.length / 1024).toFixed(0)} KB`);
  if (pages > MAX_PAGES) {
    console.error(`over the ${MAX_PAGES}-page target`);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
