import { type BrandEntry, BRANDS, type BrandTier } from "./brands.generated.js";

export { BRANDS };
export type { BrandEntry, BrandTier };

const BY_SLUG = new Map<string, BrandEntry>(BRANDS.map((brand) => [brand.slug, brand]));

export function getBrand(slug: string): BrandEntry | undefined {
  return BY_SLUG.get(slug);
}

export function listGroups(): string[] {
  return [...new Set(BRANDS.map((brand) => brand.group))];
}

export function brandSvgUrl(slug: string): URL | undefined {
  return BY_SLUG.has(slug) ? new URL(`../svg/${slug}.svg`, import.meta.url) : undefined;
}

export interface SearchOptions {
  group?: string;
  tier?: BrandTier;
  limit?: number;
}

export function searchBrands(query: string, options: SearchOptions = {}): BrandEntry[] {
  const { group, tier, limit = Number.POSITIVE_INFINITY } = options;
  const q = query.trim().toLowerCase();
  const matches = BRANDS.filter((brand) => {
    if (group && brand.group !== group) return false;
    if (tier && brand.tier !== tier) return false;
    return !q || brand.name.toLowerCase().includes(q) || brand.slug.includes(q);
  });
  const rank = (brand: BrandEntry) =>
    brand.slug === q || brand.name.toLowerCase() === q ? 0 : brand.slug.startsWith(q) ? 1 : 2;
  return matches.sort((a, b) => rank(a) - rank(b)).slice(0, limit);
}
