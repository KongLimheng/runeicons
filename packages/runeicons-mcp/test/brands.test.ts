import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "bun:test";

import {
  BRAND_COUNT,
  BRANDS,
  findBrand,
  formatBrand,
  listBrandGroups,
  readBrandSvg,
  searchBrands,
} from "../src/brands.js";

const PKG_DIR = join(import.meta.dir, "..");

test("brand registry counts match the logo set", () => {
  expect(BRAND_COUNT).toBe(BRANDS.length);
  expect(BRANDS.length).toBeGreaterThanOrEqual(1100);
  expect(new Set(BRANDS.map((brand) => brand.slug)).size).toBe(BRANDS.length);
});

test("every brand has a logo file in assets/brands", () => {
  for (const brand of BRANDS) {
    expect(existsSync(join(PKG_DIR, "assets", "brands", `${brand.slug}.svg`))).toBe(true);
  }
});

test("searchBrands matches text, respects limit, and ranks exact slugs first", () => {
  const [first] = searchBrands({ query: "openai", limit: 5 });
  expect(first.slug).toBe("openai");
  expect(searchBrands({ query: "git", limit: 3 })).toHaveLength(3);
  expect(searchBrands({ limit: 7 })).toHaveLength(7);
  expect(searchBrands({ limit: 1000 }).length).toBeLessThanOrEqual(200);
});

test("searchBrands filters by group and tier", () => {
  const group = listBrandGroups()[0].group;
  const byGroup = searchBrands({ group: group.toUpperCase(), limit: 200 });
  expect(byGroup.length).toBeGreaterThan(0);
  expect(byGroup.every((brand) => brand.group === group)).toBe(true);

  const byTier = searchBrands({ tier: "trademark-only", limit: 200 });
  expect(byTier.length).toBeGreaterThan(0);
  expect(byTier.every((brand) => brand.tier === "trademark-only")).toBe(true);
});

test("searchBrands returns nothing for an unmatched query", () => {
  expect(searchBrands({ query: "zzqxnotabrand" })).toEqual([]);
});

test("listBrandGroups counts every brand once", () => {
  const groups = listBrandGroups();
  expect(groups.reduce((sum, row) => sum + row.total, 0)).toBe(BRANDS.length);
});

test("get_brand output includes license, guidelines, svg, and the notice", () => {
  const brand = findBrand("openai")!;
  const text = formatBrand(brand, true);
  expect(text).toContain("license: MIT");
  expect(text).toContain("brand guidelines: https://openai.com/brand/");
  expect(text).toContain("<svg");
  expect(text).toContain("are not covered by Rune Icons' Apache 2.0 license");
});

test("get_brand output omits svg when includeSvg is false", () => {
  const text = formatBrand(findBrand("openai")!, false);
  expect(text).not.toContain("<svg");
  expect(text).toContain("pass includeSvg: true");
});

test("unknown brand slugs are not found", () => {
  expect(findBrand("does-not-exist")).toBeUndefined();
  expect(readBrandSvg("does-not-exist")).toBeUndefined();
});

test("brands without guidelines report none", () => {
  const text = formatBrand(findBrand("anthropic")!, false);
  expect(text).toContain("brand guidelines: none");
});
