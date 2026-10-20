// Accessibility (axe-core, WCAG 2.2 A/AA rules) and visual screenshots across breakpoints.
// Usage: node scripts/audit.mjs http://localhost:3200
import { chromium } from "playwright-core";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
const base = process.argv[2] ?? "http://localhost:3200";
const axe = readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const pages = ["/", "/contact", "/services/buy", "/communities/palm-jumeirah", "/team", "/insights/dubai-property-buying-costs", "/properties", "/developments", "/about"];
mkdirSync("docs/screenshots", { recursive: true });
const b = await chromium.launch();
const report = [];
for (const path of pages) {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(base + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(2200);
  await p.addScriptTag({ content: axe });
  const res = await p.evaluate(async () => await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"] } }));
  report.push({ path, violations: res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target })) });
  await p.close();
}
const shots = [["home", "/"], ["contact", "/contact"], ["community", "/communities/palm-jumeirah"], ["service", "/services/buy"]];
for (const [name, path] of shots) for (const [label, w, h] of [["desktop", 1440, 900], ["tablet", 768, 1024], ["mobile", 390, 844]]) {
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.goto(base + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `docs/screenshots/${name}-${label}.png`, fullPage: label !== "desktop" || name !== "home" ? true : false });
  await p.close();
}
await b.close();
writeFileSync("test-results/axe.json", JSON.stringify(report, null, 2));
for (const r of report) console.log(r.path, r.violations.length ? JSON.stringify(r.violations) : "no violations");
