import { type BrandEntry, BRANDS, type BrandTier } from "./brands.generated.js";

export type { BrandEntry, BrandTier };

export interface BrandLogoProps {
  name: string;
  size?: number;
  title?: string;
}

export interface SearchBrandsOptions {
  group?: string;
  tier?: BrandTier;
  limit?: number;
}

const BY_SLUG = new Map<string, BrandEntry>(BRANDS.map((brand) => [brand.slug, brand]));

export function getBrand(slug: string): BrandEntry | undefined {
  return BY_SLUG.get(slug);
}

export function listBrandGroups(): string[] {
  return [...new Set(BRANDS.map((brand) => brand.group))].sort((a, b) => a.localeCompare(b));
}

export function searchBrands(
  query: string,
  { group, tier, limit = Number.POSITIVE_INFINITY }: SearchBrandsOptions = {},
): BrandEntry[] {
  const q = query.trim().toLowerCase();
  const matched = BRANDS.filter(
    (brand) =>
      (!group || brand.group === group) &&
      (!tier || brand.tier === tier) &&
      (!q || brand.slug.includes(q) || brand.name.toLowerCase().includes(q)),
  );
  const exact = matched.filter((brand) => brand.slug === q || brand.name.toLowerCase() === q);
  const rest = matched.filter((brand) => !exact.includes(brand));
  return [...exact, ...rest].slice(0, limit);
}

export function BrandLogo({ name, size = 24, title }: BrandLogoProps) {
  const brand = getBrand(name);
  if (!brand) return null;
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": "true" as const };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={brand.viewBox}
      {...a11y}
      dangerouslySetInnerHTML={{ __html: brand.markup }}
    />
  );
}

export { BRANDS };
