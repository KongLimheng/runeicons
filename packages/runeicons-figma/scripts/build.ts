#!/usr/bin/env bun
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadBrands } from "../../../scripts/lib/brand-data";

const PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(PKG, "..", "..", "public");
const OUT = join(PKG, "src", "icons.generated.ts");
const BRANDS_OUT = join(PKG, "src", "brands.generated.ts");

const TYPES = ["normal", "duotone", "fill", "pixelated"] as const;
const GLASS = "glass" as const;

type Variants = Partial<
  Record<(typeof TYPES)[number] | typeof GLASS, { viewBox: string; markup: string }>
>;

const ROOT_PAINT_ATTRS = [
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-dasharray",
  "stroke-opacity",
  "fill-opacity",
  "fill-rule",
  "clip-rule",
  "opacity",
  "color",
];

function extractBody(svg: string): { viewBox: string; inner: string } {
  const cleaned = svg.replace(/<\?xml[^?]*\?>\s*/g, "").replace(/<!--[\s\S]*?-->/g, "");
  const openMatch = cleaned.match(/<svg\b([^>]*)>/);
  const attrs = openMatch ? openMatch[1] : "";
  const vbMatch = attrs.match(/viewBox\s*=\s*"([^"]+)"/);
  const viewBox = vbMatch ? vbMatch[1] : "0 0 24 24";
  const kept: string[] = [];
  for (const name of ROOT_PAINT_ATTRS) {
    const m = attrs.match(new RegExp(`${name}\\s*=\\s*"([^"]+)"`));
    if (m) kept.push(`${name}="${m[1]}"`);
  }
  let inner = cleaned
    .replace(/<svg\b[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();
  if (kept.length > 0) inner = `<g ${kept.join(" ")}>${inner}</g>`;
  return { viewBox, inner };
}

function prefixInnerIds(inner: string, symbolId: string): string {
  const ids = new Set<string>();
  for (const m of inner.matchAll(/\bid\s*=\s*"([^"]+)"/g)) {
    ids.add(m[1]);
  }
  let out = inner;
  for (const id of ids) {
    const safe = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const prefixed = `${symbolId}--${id}`;
    out = out
      .replace(new RegExp(`\\bid\\s*=\\s*"${safe}"`, "g"), `id="${prefixed}"`)
      .replace(new RegExp(`url\\(#${safe}\\)`, "g"), `url(#${prefixed})`)
      .replace(new RegExp(`"#${safe}"`, "g"), `"#${prefixed}"`);
  }
  return out;
}

function toCurrentColor(markup: string): string {
  return markup
    .replaceAll('stroke="black"', 'stroke="currentColor"')
    .replaceAll('fill="black"', 'fill="currentColor"');
}

function splitPascal(s: string): string[] {
  const parts: string[] = [];
  let current = "";
  for (const ch of s) {
    const isUpper = ch >= "A" && ch <= "Z";
    const isDigit = ch >= "0" && ch <= "9";
    if (isUpper || (isDigit && current && !/\d$/.test(current))) {
      if (current) parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function glassId(filename: string): { id: string; name: string } {
  const base = filename.replace(/\.svg$/i, "").trim();
  const pieces: string[] = [];
  for (const seg of base.split(/\s+/)) {
    for (const p of splitPascal(seg)) pieces.push(p);
  }
  const cleaned = pieces.filter((p) => p.length > 0);
  return { id: `glass-${cleaned.join("-").toLowerCase()}`, name: cleaned.join(" ") };
}

function displayName(id: string): string {
  const base = id.replace(/^glass-/, "");
  return base
    .split("-")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

const byId = new Map<string, { name?: string; variants: Variants }>();

for (const type of TYPES) {
  const root = join(PUBLIC, type);
  for (const folder of readdirSync(root, { withFileTypes: true })) {
    if (!folder.isDirectory()) continue;
    for (const file of readdirSync(join(root, folder.name))) {
      if (!file.endsWith(".svg")) continue;
      const id = `${folder.name}-${file.replace(/\.svg$/i, "")}`;
      const { viewBox, inner } = extractBody(readFileSync(join(root, folder.name, file), "utf8"));
      const entry = byId.get(id) ?? { variants: {} };
      entry.variants[type] = { viewBox, markup: toCurrentColor(prefixInnerIds(inner, id)) };
      byId.set(id, entry);
    }
  }
}

for (const file of readdirSync(join(PUBLIC, "glass-icons"))) {
  if (!file.endsWith(".svg")) continue;
  const { id, name } = glassId(file);
  const { viewBox, inner } = extractBody(readFileSync(join(PUBLIC, "glass-icons", file), "utf8"));
  const entry = byId.get(id) ?? { variants: {} };
  entry.name = name;
  entry.variants[GLASS] = { viewBox, markup: prefixInnerIds(inner, id) };
  byId.set(id, entry);
}

const icons = [...byId.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([id, e]) => ({ id, name: e.name ?? displayName(id), variants: e.variants }));

const variantKeys = [...TYPES, GLASS];
const body = `export const ICONS: IconEntry[] = [
${icons.map((i) => "  " + JSON.stringify(i)).join(",\n")},
];

export type IconEntry = {
  id: string;
  name: string;
  variants: {
${variantKeys.map((t) => `    ${t}?: { viewBox: string; markup: string };`).join("\n")}
  };
};
`;

writeFileSync(OUT, body);

const withCounts = variantKeys
  .map((t) => `${t}: ${icons.filter((i) => i.variants[t]).length}`)
  .join(", ");
console.log(`Wrote ${OUT} (${icons.length} icons: ${withCounts})`);

const brands = loadBrands().map((brand) => ({
  slug: brand.slug,
  name: brand.name,
  group: brand.group,
  license: brand.license,
  tier: brand.tier,
  tone: brand.tone,
  guidelines: brand.guidelines,
  site: brand.site,
  viewBox: brand.viewBox,
  markup: brand.markup,
}));

const brandsBody = `export type BrandEntry = {
  slug: string;
  name: string;
  group: string;
  license: string;
  tier: "permissive" | "attribution" | "share-alike" | "trademark-only";
  tone: "light" | "dark";
  guidelines: string | null;
  site: string | null;
  viewBox: string;
  markup: string;
};

export const BRANDS: BrandEntry[] = [
${brands.map((brand) => "  " + JSON.stringify(brand).replace(/<\//g, "<\\/")).join(",\n")},
];
`;

writeFileSync(BRANDS_OUT, brandsBody);
console.log(`Wrote ${BRANDS_OUT} (${brands.length} brands)`);

const DIST = join(PKG, "dist");

const code = await Bun.build({
  entrypoints: [join(PKG, "src", "code.ts")],
  target: "browser",
  format: "cjs",
  external: ["figma"],
});
await Bun.write(join(DIST, "code.js"), code.outputs[0]);

const ui = await Bun.build({
  entrypoints: [join(PKG, "src", "ui.ts")],
  target: "browser",
  format: "iife",
});
const uiJs = await ui.outputs[0].text();

const uiHtml = `<!doctype html>
<html>
<head><meta charset="utf-8" />
<style>
  [hidden] { display: none !important; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: Inter, sans-serif; font-size: 12px; color: #333; }
  #top { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #e5e5e5; }
  #modes { display: flex; padding: 8px 8px 0; }
  .mode { flex: 1; padding: 6px; border: 1px solid #d9d9d9; background: #fff; color: #666; font: inherit; cursor: pointer; }
  .mode:first-child { border-radius: 6px 0 0 6px; }
  .mode:last-child { border-radius: 0 6px 6px 0; border-left: none; }
  .mode.active { background: #18a0fb; border-color: #18a0fb; color: #fff; }
  #toolbar { display: flex; gap: 6px; padding: 8px; }
  #search { flex: 1; min-width: 0; padding: 6px 8px; border: 1px solid #d9d9d9; border-radius: 6px; }
  #type, #group { padding: 6px; border: 1px solid #d9d9d9; border-radius: 6px; max-width: 45%; }
  #notice { margin: 8px 8px 0; padding: 6px 8px; border-radius: 6px; background: #fff8e6; color: #7a5a00; font-size: 10px; line-height: 1.4; }
  #results { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; padding: 8px; }
  .icon { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 4px; border: 1px solid transparent; border-radius: 6px; background: none; cursor: pointer; }
  .icon:hover { border-color: #18a0fb; background: #f0f9ff; }
  .icon svg { width: 24px; height: 24px; color: #333; }
  .icon span { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 10px; color: #666; }
  .brand { background: #f5f5f5; }
  .brand:hover { background: #e8f4fd; }
  .brand svg { width: auto; height: 40px; color: inherit; }
  .brand.dark { background: #1e1e1e; }
  .brand.dark:hover { background: #2b2b2b; }
  .brand.dark span { color: #ccc; }
  .tier { font-style: normal; padding: 0 5px; border: 1px solid #d9d9d9; border-radius: 4px; font-size: 9px; color: #666; }
  .brand.dark .tier { border-color: #555; color: #aaa; }
  #more { display: block; margin: 0 auto 8px; padding: 6px 12px; border: 1px solid #d9d9d9; border-radius: 6px; background: #fff; color: #333; font: inherit; cursor: pointer; }
</style></head>
<body>
<div id="top">
  <div id="modes">
    <button class="mode active" data-mode="icons">Icons</button>
    <button class="mode" data-mode="brands">Brands</button>
  </div>
  <div id="toolbar">
    <input id="search" placeholder="Search icons" autofocus />
    <select id="type">
      <option value="normal">normal</option>
      <option value="duotone">duotone</option>
      <option value="fill">fill</option>
      <option value="pixelated">pixelated</option>
      <option value="glass">glass</option>
    </select>
    <select id="group" hidden></select>
  </div>
</div>
<p id="notice" hidden>Brand logos are other companies' trademarks, shown for identification only. Check each logo's license and brand guidelines before you use it.</p>
<div id="results"></div>
<button id="more" hidden>Show more</button>
<script>${uiJs}</script>
</body>
</html>
`;

await Bun.write(join(DIST, "ui.html"), uiHtml);
console.log(`Bundled dist/code.js and dist/ui.html`);
