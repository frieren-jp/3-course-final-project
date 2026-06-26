const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const ROOT = path.resolve(".docx-audit/render");
const OUT = path.join(ROOT, "page_screens");
fs.mkdirSync(OUT, { recursive: true });

async function screenshotPdf(browser, label, pdfPath) {
  const page = await browser.newPage({
    viewport: { width: 1400, height: 1900 },
    deviceScaleFactor: 1,
  });
  await page.goto("file:///" + pdfPath.replaceAll("\\", "/"), {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });
  await page.waitForTimeout(2200);
  const pageNo = path.basename(pdfPath, ".pdf");
  const out = path.join(OUT, `${label}_${pageNo}.png`);
  await page.screenshot({ path: out, fullPage: false });
  await page.close();
  return out;
}

async function run() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: EDGE,
    args: ["--disable-gpu", "--disable-dev-shm-usage", "--allow-file-access-from-files"],
  });
  const results = [];
  for (const label of ["PM02", "PM11"]) {
    const dir = path.join(ROOT, `${label}_pages`);
    const pdfs = fs.readdirSync(dir).filter((f) => f.endsWith(".pdf")).sort();
    for (const pdf of pdfs) {
      results.push(await screenshotPdf(browser, label, path.join(dir, pdf)));
    }
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
