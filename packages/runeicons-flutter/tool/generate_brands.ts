import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { BRAND_LOGOS, type BrandLogo } from "../../../constants/brand-logos";

const packageDirectory = resolve(import.meta.dir, "..");
const repositoryDirectory = resolve(packageDirectory, "../..");
const sourceDirectory = join(repositoryDirectory, "public", "brand-logos");
const assetsDirectory = join(packageDirectory, "assets", "brands");
const outputFile = join(packageDirectory, "lib", "src", "rune_brands.g.dart");

const reservedWords = new Set([
  "abstract", "as", "assert", "async", "augment", "await", "base", "break", "case", "catch", "class",
  "const", "continue", "covariant", "default", "deferred", "do", "dynamic", "else", "enum", "export",
  "extends", "extension", "external", "factory", "false", "final", "finally", "for", "get", "hide",
  "if", "implements", "import", "in", "interface", "is", "late", "library", "macro", "mixin", "new",
  "null", "of", "on", "operator", "part", "required", "rethrow", "return", "sealed", "set", "show",
  "static", "super", "switch", "sync", "this", "throw", "true", "try", "typedef", "var", "void",
  "when", "while", "with", "yield", "all", "bySlug", "hashCode", "runtimeType", "toString",
  "noSuchMethod",
]);

const tierIdentifiers: Record<BrandLogo["tier"], string> = {
  permissive: "permissive",
  attribution: "attribution",
  "share-alike": "shareAlike",
  "trademark-only": "trademarkOnly",
};

function upperFirst(value: string): string {
  return `${value[0].toUpperCase()}${value.slice(1)}`;
}

function identifierFor(slug: string): string {
  const [first, ...rest] = slug.split("-").filter((word) => word.length > 0);
  let identifier = [first, ...rest.map(upperFirst)].join("");
  if (/^[0-9]/.test(identifier) || reservedWords.has(identifier)) {
    identifier = `brand${upperFirst(identifier)}`;
  }
  return identifier;
}

function dartString(value: string): string {
  return JSON.stringify(value).replace(/\$/g, "\\$");
}

function dartNullableString(value: string | null): string {
  return value === null ? "null" : dartString(value);
}

rmSync(assetsDirectory, { recursive: true, force: true });
mkdirSync(assetsDirectory, { recursive: true });

const usedIdentifiers = new Set<string>();
const entries = BRAND_LOGOS.map((brand) => {
  let identifier = identifierFor(brand.slug);
  let suffix = 2;
  const base = identifier;
  while (usedIdentifiers.has(identifier)) {
    identifier = `${base}${suffix}`;
    suffix += 1;
  }
  usedIdentifiers.add(identifier);

  if (brand.name.includes("$") || brand.group.includes("$")) {
    throw new Error(`Unsupported "$" in brand metadata: ${brand.slug}`);
  }

  const assetPath = `assets/brands/${brand.slug}.svg`;
  cpSync(join(sourceDirectory, `${brand.slug}.svg`), join(packageDirectory, assetPath));

  return { brand, identifier, assetPath };
});

const lines: string[] = [
  "import 'rune_brand_data.dart';",
  "",
  "abstract final class RuneBrands {",
];

for (const { brand, identifier, assetPath } of entries) {
  lines.push(
    `  static const RuneBrandData ${identifier} = RuneBrandData(`,
    `    slug: ${dartString(brand.slug)},`,
    `    name: ${dartString(brand.name)},`,
    `    group: ${dartString(brand.group)},`,
    `    site: ${dartNullableString(brand.site)},`,
    `    guidelines: ${dartNullableString(brand.guidelines)},`,
    `    license: ${dartString(brand.license)},`,
    `    tier: RuneBrandTier.${tierIdentifiers[brand.tier]},`,
    `    assetPath: ${dartString(assetPath)},`,
    "  );",
    "",
  );
}

lines.push("  static const List<RuneBrandData> all = [");
for (const { identifier } of entries) {
  lines.push(`    ${identifier},`);
}
lines.push(
  "  ];",
  "",
  "  static RuneBrandData? bySlug(String slug) {",
  "    for (final brand in all) {",
  "      if (brand.slug == slug) {",
  "        return brand;",
  "      }",
  "    }",
  "    return null;",
  "  }",
  "}",
  "",
);

writeFileSync(outputFile, lines.join("\n"));

const format = Bun.spawnSync(["dart", "format", outputFile], { stdout: "pipe", stderr: "pipe" });
if (format.exitCode !== 0) {
  throw new Error(new TextDecoder().decode(format.stderr));
}

console.log(`Copied ${entries.length} SVGs to ${assetsDirectory}`);
console.log(`Generated ${outputFile}`);
