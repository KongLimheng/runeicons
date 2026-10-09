import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { BRANDS, brandSvgUrl, getBrand, listGroups, searchBrands } from "../src/index";

const TIERS = ["permissive", "attribution", "share-alike", "trademark-only"];

test("ships the full brand set", () => {
  expect(BRANDS.length).toBeGreaterThanOrEqual(1100);
  expect(listGroups().length).toBeGreaterThanOrEqual(10);
});

test("slugs are unique and every entry carries license data", () => {
  expect(new Set(BRANDS.map((brand) => brand.slug)).size).toBe(BRANDS.length);
  for (const brand of BRANDS) {
    expect(brand.name.length).toBeGreaterThan(0);
    expect(brand.license.length).toBeGreaterThan(0);
    expect(TIERS).toContain(brand.tier);
  }
});

test("no logo that is non-commercial or no-derivatives is included", () => {
  for (const brand of BRANDS) {
    expect(brand.license).not.toMatch(/NC|ND|GPL/);
  }
});

test("every entry has a safe svg file on disk", () => {
  for (const brand of BRANDS) {
    const url = brandSvgUrl(brand.slug)!;
    expect(existsSync(url)).toBe(true);
    const svg = readFileSync(fileURLToPath(url), "utf8");
    expect(svg).toContain("<svg");
    expect(svg).not.toMatch(/<script|<foreignObject|javascript:|<!ENTITY|\son[a-z]+\s*=/i);
  }
});

test("lookup and search", () => {
  expect(getBrand("openai")?.name).toBe("OpenAI");
  expect(getBrand("not-a-brand")).toBeUndefined();
  expect(brandSvgUrl("not-a-brand")).toBeUndefined();
  expect(searchBrands("react")[0]?.slug).toBe("react");
  expect(searchBrands("", { group: "AI", limit: 5 })).toHaveLength(5);
  expect(
    searchBrands("", { tier: "trademark-only" }).every((b) => b.tier === "trademark-only"),
  ).toBe(true);
});
