import { expect, test } from "bun:test";

import { BRANDS } from "../src/brands.generated";
import { brandGroups, buildBrandSvg, getBrandBySlug, searchBrands } from "../src/brands";

test("brand data covers the library", () => {
  expect(BRANDS.length).toBeGreaterThanOrEqual(1100);
});

test("brand slugs are unique", () => {
  expect(new Set(BRANDS.map((brand) => brand.slug)).size).toBe(BRANDS.length);
});

test("buildBrandSvg renders a standalone svg with the brand viewBox", () => {
  const github = getBrandBySlug("github")!;
  const svg = buildBrandSvg(github);
  expect(svg.startsWith("<svg")).toBe(true);
  expect(svg).toContain(`viewBox="${github.viewBox}"`);
  expect(svg.endsWith("</svg>")).toBe(true);
  expect(svg).toContain(github.markup);
});

test("buildBrandSvg keeps the viewBox aspect ratio", () => {
  const brand = { ...getBrandBySlug("github")!, viewBox: "0 0 200 100" };
  const svg = buildBrandSvg(brand, 64);
  expect(svg).toContain('width="64" height="32"');
});

test("searchBrands matches names and slugs, exact matches first", () => {
  expect(searchBrands("github")[0].slug).toBe("github");
  expect(searchBrands("GitHub Actions").some((brand) => brand.slug === "github-actions")).toBe(
    true,
  );
  expect(searchBrands("", "", 10).length).toBe(10);
  expect(searchBrands("zzz-no-such-brand").length).toBe(0);
});

test("searchBrands filters by group", () => {
  const group = brandGroups()[0];
  const matches = searchBrands("", group);
  expect(matches.length).toBeGreaterThan(0);
  expect(matches.every((brand) => brand.group === group)).toBe(true);
  expect(searchBrands("", "no such group").length).toBe(0);
});

test("brand markup contains no script elements", () => {
  for (const brand of BRANDS) {
    expect(brand.markup.toLowerCase()).not.toContain("<script");
  }
});
