import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { BRANDS, type BrandLogoTier, type GeneratedBrand } from "./brands.generated.js";

export { BRANDS, BRAND_COUNT } from "./brands.generated.js";
export type { BrandLogoTier, GeneratedBrand } from "./brands.generated.js";

const PKG_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");

export const BRAND_TIERS = ["permissive", "attribution", "share-alike", "trademark-only"] as const;

export const BRAND_NOTICE =
  "Brand logos are other companies' trademarks, shown for identification only. They are not covered by Rune Icons' Apache 2.0 license. Follow the brand's guidelines and do not alter the logo unless they allow it.";

export interface BrandSearchOptions {
  query?: string;
  group?: string;
  tier?: BrandLogoTier;
  limit?: number;
}

export function searchBrands(options: BrandSearchOptions): GeneratedBrand[] {
  const query = options.query?.trim().toLowerCase() ?? "";
  const group = options.group?.trim().toLowerCase() ?? "";
  const limit = Math.max(1, Math.min(options.limit ?? 50, 200));

  const results = BRANDS.filter((brand) => {
    if (options.tier && brand.tier !== options.tier) return false;
    if (group && brand.group.toLowerCase() !== group) return false;
    if (!query) return true;
    return [brand.slug, brand.name, brand.group, brand.tier].some((field) =>
      field.toLowerCase().includes(query),
    );
  });

  results.sort((a, b) => {
    const aExact = a.slug === query || a.name.toLowerCase() === query ? 0 : 1;
    const bExact = b.slug === query || b.name.toLowerCase() === query ? 0 : 1;
    if (aExact !== bExact) return aExact - bExact;
    return a.name.length - b.name.length || a.slug.localeCompare(b.slug);
  });

  return results.slice(0, limit);
}

export function findBrand(slug: string): GeneratedBrand | undefined {
  const needle = slug.trim().toLowerCase();
  return BRANDS.find((brand) => brand.slug === needle);
}

export function listBrandGroups(): Array<{ group: string; total: number }> {
  const groups = new Map<string, number>();
  for (const brand of BRANDS) {
    groups.set(brand.group, (groups.get(brand.group) ?? 0) + 1);
  }
  return [...groups.entries()]
    .map(([group, total]) => ({ group, total }))
    .sort((a, b) => a.group.localeCompare(b.group));
}

const svgCache = new Map<string, string>();

export function readBrandSvg(slug: string): string | undefined {
  const brand = findBrand(slug);
  if (!brand) return undefined;
  const cached = svgCache.get(brand.slug);
  if (cached) return cached;
  const svg = readFileSync(join(PKG_DIR, "assets", "brands", `${brand.slug}.svg`), "utf8").trim();
  svgCache.set(brand.slug, svg);
  return svg;
}

export function formatBrand(brand: GeneratedBrand, includeSvg: boolean): string {
  const svg = includeSvg
    ? (readBrandSvg(brand.slug) ?? "(svg file missing)")
    : "(svg omitted - pass includeSvg: true to include it)";
  return [
    `slug: ${brand.slug}`,
    `name: ${brand.name}`,
    `group: ${brand.group}`,
    `license: ${brand.license}`,
    `tier: ${brand.tier}`,
    `official site: ${brand.site ?? "none"}`,
    `brand guidelines: ${brand.guidelines ?? "none"}`,
    "",
    svg,
    "",
    BRAND_NOTICE,
  ].join("\n");
}
