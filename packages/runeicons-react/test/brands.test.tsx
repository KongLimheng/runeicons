import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToString } from "react-dom/server";

import * as main from "../src/index";
import { BRANDS } from "../src/brands.generated";
import { BrandLogo, getBrand, listBrandGroups, searchBrands } from "../src/brands";

test("brand data covers the full set with unique slugs", () => {
  expect(BRANDS.length).toBeGreaterThanOrEqual(1100);
  expect(new Set(BRANDS.map((b) => b.slug)).size).toBe(BRANDS.length);
  expect(BRANDS.every((b) => b.viewBox && b.markup)).toBe(true);
});

test("BrandLogo renders an svg for a known brand", () => {
  const html = renderToString(<BrandLogo name="openai" />);
  expect(html).toContain("<svg");
  expect(html).toContain('width="24"');
  expect(html).toContain('aria-hidden="true"');
  expect(html).toContain("</svg>");
});

test("BrandLogo adds img role and label when titled", () => {
  const html = renderToString(<BrandLogo name="openai" size={32} title="OpenAI" />);
  expect(html).toContain('width="32"');
  expect(html).toContain('role="img"');
  expect(html).toContain('aria-label="OpenAI"');
  expect(html).not.toContain("aria-hidden");
});

test("BrandLogo renders nothing for unknown brands", () => {
  expect(renderToString(<BrandLogo name="does-not-exist" />)).toBe("");
});

test("search matches names and slugs, exact matches first", () => {
  expect(searchBrands("openai")[0]?.slug).toBe("openai");
  expect(getBrand("openai")?.name.length).toBeGreaterThan(0);
  const results = searchBrands("git", { limit: 5 });
  expect(results.length).toBeLessThanOrEqual(5);
  expect(results.length).toBeGreaterThan(0);
  const group = listBrandGroups()[0]!;
  expect(searchBrands("", { group }).every((b) => b.group === group)).toBe(true);
  const tier = BRANDS[0]!.tier;
  expect(searchBrands("", { tier }).every((b) => b.tier === tier)).toBe(true);
  expect(searchBrands("zzzz-no-match-zzzz")).toEqual([]);
});

test("main entry exports nothing brand related", () => {
  const source = readFileSync(join(import.meta.dir, "..", "src", "index.tsx"), "utf8");
  expect(source.toLowerCase()).not.toContain("brand");
  expect(Object.keys(main).some((key) => key.toLowerCase().includes("brand"))).toBe(false);
});
