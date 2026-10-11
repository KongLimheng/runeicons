import { expect, test } from "bun:test";

import {
  findIcon,
  getRelatedStyles,
  getSvgSource,
  getViewBox,
  GENERATED_ICONS,
  ICON_COUNTS,
  listCategories,
  searchIcons,
} from "../src/icons.js";

test("registry counts match the icon set", () => {
  expect(ICON_COUNTS.total).toBe(GENERATED_ICONS.length);
  const unique = new Set(GENERATED_ICONS.map((icon) => icon.id));
  expect(unique.size).toBeGreaterThanOrEqual(350);
  expect(GENERATED_ICONS.length).toBeGreaterThanOrEqual(900);
});

test("searchIcons matches text case-insensitively and respects limit", () => {
  const results = searchIcons({ query: "ARROW DOWN", limit: 3 });
  expect(results).toHaveLength(3);
  for (const icon of results) {
    expect(`${icon.id} ${icon.name}`.toLowerCase()).toContain("arrow");
  }
  expect(searchIcons({ query: "arrow", limit: 1000 })).toHaveLength(
    Math.min(200, searchIcons({ query: "arrow", limit: 200 }).length),
  );
});

test("searchIcons filters by style and category", () => {
  expect(searchIcons({ style: "glass", limit: 200 }).every((i) => i.style === "glass")).toBe(true);
  const category = listCategories()[0].category;
  expect(
    searchIcons({ category, limit: 200 }).every((i) => i.category === category),
  ).toBe(true);
});

test("searchIcons ranks exact id matches first", () => {
  const [first] = searchIcons({ query: "arrows-arrow-down-left", limit: 5 });
  expect(first.id).toBe("arrows-arrow-down-left");
});

test("findIcon prefers the normal style and returns undefined for unknown ids", () => {
  const icon = findIcon("arrows-arrow-down-left");
  expect(icon?.style).toBe("normal");
  expect(findIcon("does-not-exist")).toBeUndefined();
});

test("get_icon helpers return a recolored standalone svg", () => {
  const icon = findIcon("arrows-arrow-down-left")!;
  const svg = getSvgSource(icon);
  expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
  expect(svg).toContain(`viewBox="${getViewBox(icon)}"`);
  expect(svg).not.toMatch(/stroke="(?!none|currentColor|url\()/);
});

test("getRelatedStyles lists other styles of the same glyph", () => {
  const related = getRelatedStyles(findIcon("arrows-arrow-down-left")!);
  expect(related.map((r) => r.style).sort()).toEqual(["duotone", "pixelated"]);
  const duotoneOnly = getRelatedStyles(findIcon("gadgets-battery-medium-2")!);
  expect(duotoneOnly.map((r) => r.style)).toEqual(["fill"]);
  expect(getRelatedStyles(findIcon("glass-back-2")!)).toEqual([]);
});
