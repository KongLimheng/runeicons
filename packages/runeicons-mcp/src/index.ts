#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "node:fs";
import { z } from "zod";

import {
  BRAND_COUNT,
  BRAND_TIERS,
  findBrand,
  formatBrand,
  listBrandGroups,
  searchBrands,
} from "./brands.js";
import {
  findIcon,
  GENERATED_ICONS,
  type GeneratedIcon,
  getRelatedStyles,
  getSvgSource,
  getViewBox,
  ICON_COUNTS,
  listCategories,
  searchIcons,
} from "./icons.js";

const STYLES = ["normal", "duotone", "fill", "pixelated", "glass"] as const;

function iconToResult(icon: GeneratedIcon, opts: { svg: boolean; related: boolean }) {
  const related = opts.related ? getRelatedStyles(icon) : [];
  return {
    id: icon.id,
    name: icon.name,
    style: icon.style,
    category: icon.category,
    tags: icon.tags,
    viewBox: getViewBox(icon),
    svg: opts.svg ? getSvgSource(icon) : undefined,
    relatedStyles: related.length > 0 ? related : undefined,
    credit: "RuneIcons (https://runeicons.com) - Apache-2.0",
  };
}

function uniqueIconCount(): number {
  return new Set(GENERATED_ICONS.map((icon) => icon.id)).size;
}

function formatCategories(): string {
  const rows = listCategories();
  const width = Math.max(...rows.map((r) => r.category.length), "category".length);
  const lines = [
    `RuneIcons: ${uniqueIconCount()} icons, ${ICON_COUNTS.total} variants, across ${rows.length} categories`,
    "",
    `${"category".padEnd(width)}  total  normal  duotone  fill  pixelated  glass`,
    "-".repeat(width + 48),
  ];
  for (const row of rows) {
    lines.push(
      `${row.category.padEnd(width)}  ${String(row.total).padStart(5)}  ${String(row.byStyle.normal).padStart(6)}  ${String(row.byStyle.duotone).padStart(6)}  ${String(row.byStyle.fill).padStart(4)}  ${String(row.byStyle.pixelated).padStart(9)}  ${String(row.byStyle.glass).padStart(5)}`,
    );
  }
  return lines.join("\n");
}

function formatBrandGroups(): string {
  const rows = listBrandGroups();
  const width = Math.max(...rows.map((r) => r.group.length), "group".length);
  const lines = [
    `Brand logos: ${BRAND_COUNT} logos across ${rows.length} groups`,
    "",
    `${"group".padEnd(width)}  logos`,
    "-".repeat(width + 7),
  ];
  for (const row of rows) {
    lines.push(`${row.group.padEnd(width)}  ${String(row.total).padStart(5)}`);
  }
  return lines.join("\n");
}

const { version } = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { version: string };

async function main(): Promise<void> {
  const server = new McpServer({
    name: "runeicons-mcp",
    version,
  });

  server.registerTool(
    "search_icons",
    {
      title: "Search RuneIcons",
      description:
        "Search the RuneIcons library (350+ icons, 900+ variants). Returns matching icons with id, name, style, category, and tags. " +
        "Styles: normal (outline), duotone, fill, pixelated, glass. Combine `query` with `style`/`category` to narrow results.",
      inputSchema: {
        query: z
          .string()
          .max(100)
          .optional()
          .describe("Search text matched against icon name, id, and tags"),
        category: z
          .string()
          .max(50)
          .optional()
          .describe("Filter by category (get valid values from list_categories)"),
        style: z.enum(STYLES).optional().describe("Only return icons in this style"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(200)
          .optional()
          .describe("Maximum results to return (default 50)"),
      },
    },
    async ({ query, category, style, limit }) => {
      const results = searchIcons({ query, category, style, limit });
      const text =
        results.length === 0
          ? "No icons matched. Try a shorter query, or call list_categories to browse."
          : [
              `${results.length} result${results.length === 1 ? "" : "s"}${query ? ` for \"${query}\"` : ""}:`,
              "",
              ...results.map(
                (icon) =>
                  `- ${icon.id} - \"${icon.name}\" (style: ${icon.style}, category: ${icon.category})`,
              ),
              "",
              "Use get_icon with an id to fetch SVG source.",
            ].join("\n");
      return { content: [{ type: "text", text }] };
    },
  );

  server.registerTool(
    "get_icon",
    {
      title: "Get a Rune Icon",
      description:
        'Get full metadata and ready-to-use SVG source for a Rune Icon by id (e.g. "arrows-arrow-down-left", "glass-archive"). ' +
        "SVGs use currentColor so you can recolor them inline. Use search_icons first if you don't know the id.",
      inputSchema: {
        id: z
          .string()
          .min(1)
          .max(120)
          .describe("Icon id from search_icons, e.g. arrows-arrow-down-left"),
        includeSvg: z.boolean().optional().describe("Include the full SVG source (default true)"),
        includeRelated: z
          .boolean()
          .optional()
          .describe("List variants of the same glyph in other styles (default true)"),
      },
    },
    async ({ id, includeSvg = true, includeRelated = true }) => {
      const icon = findIcon(id);
      if (!icon) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Unknown icon id \"${id}\". Call search_icons with a query first to discover valid ids.`,
            },
          ],
        };
      }
      const result = iconToResult(icon, { svg: includeSvg, related: includeRelated });
      const lines = [
        `id: ${result.id}`,
        `name: ${result.name}`,
        `style: ${result.style}`,
        `category: ${result.category}`,
        `tags: ${result.tags.join(", ")}`,
        `viewBox: ${result.viewBox}`,
      ];
      if (result.relatedStyles) {
        lines.push(
          `other styles: ${result.relatedStyles.map((r) => `${r.style} (${r.id})`).join(", ")}`,
        );
      }
      lines.push("", result.svg ?? "(svg omitted - pass includeSvg: true to include it)");
      return { content: [{ type: "text", text: lines.join("\n") }] };
    },
  );

  server.registerTool(
    "list_categories",
    {
      title: "List Rune Icon Categories",
      description:
        "List every RuneIcons category with total and per-style counts. Use a category name to filter search_icons results.",
      inputSchema: {},
    },
    async () => {
      return { content: [{ type: "text", text: formatCategories() }] };
    },
  );

  server.registerTool(
    "search_brands",
    {
      title: "Search Brand Logos",
      description:
        `Search the library of ${BRAND_COUNT} third-party brand logos. Returns matching brands with slug, name, group, and license. ` +
        "Brand logos are trademarks of their owners and are not covered by the Apache-2.0 license. Use get_brand to fetch the logo and its usage notice.",
      inputSchema: {
        query: z
          .string()
          .max(100)
          .optional()
          .describe("Search text matched against brand slug, name, group, and tier"),
        group: z
          .string()
          .max(60)
          .optional()
          .describe("Only return brands in this group (get valid values from list_brand_groups)"),
        tier: z.enum(BRAND_TIERS).optional().describe("Only return brands with this license tier"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(200)
          .optional()
          .describe("Maximum results to return (default 50)"),
      },
    },
    async ({ query, group, tier, limit }) => {
      const results = searchBrands({ query, group, tier, limit });
      const text =
        results.length === 0
          ? "No brands matched. Try a shorter query, or call list_brand_groups to browse the groups."
          : [
              `${results.length} result${results.length === 1 ? "" : "s"}${query ? ` for \"${query}\"` : ""}:`,
              "",
              ...results.map(
                (brand) =>
                  `- ${brand.slug} - \"${brand.name}\" (group: ${brand.group}, license: ${brand.license})`,
              ),
              "",
              "Use get_brand with a slug to fetch the logo and its usage notice.",
            ].join("\n");
      return { content: [{ type: "text", text }] };
    },
  );

  server.registerTool(
    "get_brand",
    {
      title: "Get a Brand Logo",
      description:
        'Get metadata, the official site, the brand guidelines link, and the unaltered SVG source for a brand logo by slug (e.g. "openai"). ' +
        "The result ends with a usage notice. Use search_brands first if you don't know the slug.",
      inputSchema: {
        slug: z.string().min(1).max(120).describe("Brand slug from search_brands, e.g. openai"),
        includeSvg: z.boolean().optional().describe("Include the full SVG source (default true)"),
      },
    },
    async ({ slug, includeSvg = true }) => {
      const brand = findBrand(slug);
      if (!brand) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Unknown brand slug \"${slug}\". Call search_brands with a query first to discover valid slugs.`,
            },
          ],
        };
      }
      return { content: [{ type: "text", text: formatBrand(brand, includeSvg) }] };
    },
  );

  server.registerTool(
    "list_brand_groups",
    {
      title: "List Brand Logo Groups",
      description:
        "List every brand logo group with its logo count. Use a group name as the group filter of search_brands.",
      inputSchema: {},
    },
    async () => {
      return { content: [{ type: "text", text: formatBrandGroups() }] };
    },
  );

  await server.connect(new StdioServerTransport());
  await new Promise<never>(() => {});
}

main().catch((error) => {
  console.error("runeicons-mcp failed to start:", error);
  process.exit(1);
});
