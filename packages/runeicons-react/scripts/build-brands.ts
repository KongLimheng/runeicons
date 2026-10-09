#!/usr/bin/env bun
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadBrands } from "../../../scripts/lib/brand-data";

const PKG = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(PKG, "src", "brands.generated.ts");

const brands = loadBrands();

const body = `export type BrandTier = "permissive" | "attribution" | "share-alike" | "trademark-only";

export interface BrandEntry {
  slug: string;
  name: string;
  group: string;
  site: string | null;
  guidelines: string | null;
  license: string;
  tier: BrandTier;
  tone: "light" | "dark";
  viewBox: string;
  markup: string;
}

export const BRANDS: BrandEntry[] = [
${brands.map((b) => "  " + JSON.stringify(b)).join(",\n")},
];
`;

writeFileSync(OUT, body);
console.log(`Wrote ${OUT} (${brands.length} brands)`);
