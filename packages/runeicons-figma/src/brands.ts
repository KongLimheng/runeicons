import { BRANDS, type BrandEntry } from "./brands.generated";

export type { BrandEntry };

const BY_SLUG = new Map<string, BrandEntry>(BRANDS.map((brand) => [brand.slug, brand]));

export function getBrandBySlug(slug: string): BrandEntry | undefined {
  return BY_SLUG.get(slug);
}

export function brandGroups(): string[] {
  return [...new Set(BRANDS.map((brand) => brand.group))].sort((a, b) => a.localeCompare(b));
}

function rank(brand: BrandEntry, q: string): number {
  const name = brand.name.toLowerCase();
  if (brand.slug === q || name === q) return 0;
  if (brand.slug.startsWith(q) || name.startsWith(q)) return 1;
  return 2;
}

export function searchBrands(
  query: string,
  group = "",
  limit = Number.POSITIVE_INFINITY,
): BrandEntry[] {
  const q = query.trim().toLowerCase();
  const matched = BRANDS.filter(
    (brand) =>
      (!group || brand.group === group) &&
      (!q || brand.slug.includes(q) || brand.name.toLowerCase().includes(q)),
  );
  if (q) matched.sort((a, b) => rank(a, q) - rank(b, q));
  return matched.slice(0, limit);
}

export function buildBrandSvg(brand: BrandEntry, size = 64): string {
  const [, , vbWidth, vbHeight] = brand.viewBox.trim().split(/[\s,]+/).map(Number);
  const scale = size / Math.max(vbWidth, vbHeight);
  const width = +(vbWidth * scale).toFixed(2);
  const height = +(vbHeight * scale).toFixed(2);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${brand.viewBox}" width="${width}" height="${height}">${brand.markup}</svg>`;
}
