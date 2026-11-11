const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve("_site");
assert.ok(fs.existsSync(path.join(root, "index.html")), "Build the site before running this check");
const files = fs.readdirSync(root, { recursive: true }).filter((file) => file.endsWith(".html"));
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), "utf8");
  for (const match of html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+)["']/g)) {
    const asset = decodeURI(match[1].split(/[?#]/)[0]);
    assert.ok(fs.existsSync(path.join(root, asset)), `${file} references missing asset ${asset}`);
  }
  assert.doesNotMatch(html, /(?:src|href)=["'][^"']*(?:jquery|mdb\.min|bootstrap\.bundle\.min|bootstrap\.min\.css)/i, file);
  assert.doesNotMatch(html, /<(?:script|link|img)\b[^>]*(?:src|href)=["']\s*["']/, `${file} has an empty asset/link URL`);
}
const home = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert.match(home, /gtag\("config",\s*"G-01T0SBSGBC"\)/);
assert.ok(home.indexOf("google-analytics-setup.js") < home.indexOf("googletagmanager.com/gtag/js"), "Consent defaults must load before analytics");
assert.match(home, /fontawesome-free@/);
const css = fs.readFileSync(path.join(root, "assets/css/tailwind.css"), "utf8");
assert.doesNotMatch(css, /var\(\s*-\s+-\s+/, "CSS minification corrupted Tailwind variables");
assert.match(fs.readFileSync(path.join(root, "assets/css/main.css"), "utf8"), /#00ff46|#0f4/);
assert.ok(!fs.existsSync(path.join(root, "al-folio-upgrade-report.md")), "Migration report must stay out of the published site");
console.log(`Style and asset checks passed for ${files.length} generated pages.`);
