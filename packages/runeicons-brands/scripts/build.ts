import { copyFileSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { BRAND_LOGOS } from "../../../constants/brand-logos";

const PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(PKG, "..", "..", "public", "brand-logos");
const SVG_OUT = join(PKG, "svg");
const OUT = join(PKG, "src", "brands.generated.ts");

const available = new Set(
  readdirSync(SOURCE)
    .filter((name) => name.endsWith(".svg"))
    .map((name) => name.slice(0, -4)),
);

const entries = BRAND_LOGOS.filter((logo) => available.has(logo.slug)).map((logo) => ({
  slug: logo.slug,
  name: logo.name,
  group: logo.group,
  site: logo.site,
  guidelines: logo.guidelines,
  license: logo.license,
  tier: logo.tier,
  tone: logo.tone,
}));

rmSync(SVG_OUT, { recursive: true, force: true });
mkdirSync(SVG_OUT, { recursive: true });
for (const entry of entries) {
  copyFileSync(join(SOURCE, `${entry.slug}.svg`), join(SVG_OUT, `${entry.slug}.svg`));
}

writeFileSync(
  OUT,
  `export type BrandTier = "permissive" | "attribution" | "share-alike" | "trademark-only";

export interface BrandEntry {
  slug: string;
  name: string;
  group: string;
  site: string | null;
  guidelines: string | null;
  license: string;
  tier: BrandTier;
  tone: "light" | "dark";
}

export const BRANDS: BrandEntry[] = ${JSON.stringify(entries, null, 2)};
`,
);

console.log(`Wrote ${OUT} and copied ${entries.length} SVGs into ${SVG_OUT}`);
