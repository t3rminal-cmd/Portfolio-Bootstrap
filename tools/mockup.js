// Makes a project screenshot in the same style as the others: the page in a
// floating browser window over a gray backdrop, saved as a 1440 x 990 PNG.
//
//   node tools/mockup.js <page-url> <out.png> [address-bar text] [--phone]
//
// --phone adds the phone layout next to the desktop window (used for the
// featured project). Convert the PNG to WebP before adding it to assets/img/.
const path = require("path");
const { chromium } = require("playwright");

(async () => {
  const args = process.argv.slice(2);
  const phone = args.includes("--phone");
  const [url, out, label = url] = args.filter((a) => a !== "--phone");
  if (!url || !out) {
    console.error("Usage: node tools/mockup.js <page-url> <out.png> [address-bar text] [--phone]");
    process.exit(1);
  }
  const tmp = path.resolve(out + ".tmp");
  const browser = await chromium.launch();

  async function shoot(file, viewport, scale, mobile) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(3000); // let entrance animations finish
    await page.screenshot({ path: file });
    await page.close();
  }

  await shoot(tmp + "-desktop.png", { width: 1280, height: 800 }, 2, false);
  if (phone) await shoot(tmp + "-phone.png", { width: 390, height: 844 }, 3, true);

  const frame = await browser.newPage({ viewport: { width: 1200, height: 825 }, deviceScaleFactor: 1.2 });
  const q = new URLSearchParams({ url: label, img: "file://" + tmp + "-desktop.png" });
  if (phone) q.set("phone", "file://" + tmp + "-phone.png");
  await frame.goto("file://" + path.join(__dirname, "mockup.html") + "?" + q);
  await frame.waitForTimeout(300);
  await frame.screenshot({ path: out });
  await browser.close();
  require("fs").rmSync(tmp + "-desktop.png", { force: true });
  require("fs").rmSync(tmp + "-phone.png", { force: true });
})();
