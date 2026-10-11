#!/usr/bin/env bun
import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { BRAND_LOGOS } from "../../../constants/brand-logos.ts";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PKG_DIR = join(SCRIPT_DIR, "..");
const REPO = join(PKG_DIR, "..", "..");
const PUBLIC = join(REPO, "public");

const STYLES = ["normal", "duotone", "fill", "pixelated"] as const;
type SvgStyle = (typeof STYLES)[number] | "glass";

const FOLDER_TO_CATEGORY: Record<string, string> = {
  arrows: "navigation",
  code: "dev",
  documents: "files",
  gadgets: "hardware",
  identity: "users",
  indicators: "feedback",
  layouts: "layout",
  messaging: "communication",
  metrics: "metrics",
  money: "commerce",
  nature: "weather",
  other: "misc",
  playback: "media",
  schedule: "time",
  senses: "accessibility",
  tools: "action",
};

const FOLDER_TO_TAG: Record<string, string> = {
  arrows: "navigation",
  code: "dev",
  documents: "files",
  gadgets: "hardware",
  identity: "users",
  indicators: "feedback",
  layouts: "layout",
  messaging: "communication",
  metrics: "metrics",
  money: "commerce",
  nature: "weather",
  other: "misc",
  playback: "media",
  schedule: "time",
  senses: "accessibility",
  tools: "actions",
};

const GLASS_CATEGORY_OVERRIDES: Record<string, string> = {
  bitcoin: "commerce",
  creditcard: "commerce",
  shoppingbag: "commerce",
  shoppingcart: "commerce",
  wallet: "commerce",
  pricetag: "commerce",
  calender: "time",
  calendar: "time",
  clock: "time",
  history: "time",
  cloud: "weather",
  sun: "weather",
  moon: "weather",
  rain: "weather",
  bubble: "communication",
  email: "communication",
  envelope: "communication",
  phone: "communication",
  mail: "communication",
  camera: "media",
  microphone: "media",
  play: "media",
  pause: "media",
  volume: "media",
  image: "media",
  arrow: "navigation",
  chevron: "navigation",
  home: "navigation",
  ear: "accessibility",
  eye: "accessibility",
  hand: "accessibility",
  thumb: "accessibility",
  code: "dev",
  console: "dev",
  branch: "dev",
  server: "dev",
  terminal: "dev",
  user: "users",
  people: "users",
  contact: "users",
  battery: "hardware",
  printer: "hardware",
  tv: "hardware",
  laptop: "hardware",
  archive: "files",
  file: "files",
  folder: "files",
  inbox: "files",
  clipboard: "files",
  bell: "feedback",
  check: "feedback",
  alert: "feedback",
  warning: "feedback",
  bookmark: "action",
  heart: "action",
  star: "action",
  trash: "action",
  pencil: "action",
  edit: "action",
  search: "action",
  settings: "action",
};

type GeneratedIcon = {
  id: string;
  name: string;
  style: SvgStyle;
  category: string;
  tags: string[];
  file: string;
};

function titleCaseKebab(s: string): string {
  return s
    .split("-")
    .filter(Boolean)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

function splitPascal(s: string): string[] {
  const parts: string[] = [];
  let current = "";
  for (const ch of s) {
    const isUpper = ch >= "A" && ch <= "Z";
    const isDigit = ch >= "0" && ch <= "9";
    if (isUpper || (isDigit && current && !/\d$/.test(current))) {
      if (current) parts.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  if (current) parts.push(current);
  return parts;
}

function glassName(filename: string): { name: string; idSlug: string; tagWords: string[] } {
  const base = filename.replace(/\.svg$/i, "").trim();
  const pieces: string[] = [];
  for (const seg of base.split(/\s+/)) {
    for (const p of splitPascal(seg)) pieces.push(p);
  }
  const cleaned = pieces.filter((p) => p.length > 0);
  const name = cleaned.join(" ");
  const idSlug = cleaned.join("-").toLowerCase();
  const tagWords = cleaned.map((w) => w.toLowerCase()).filter((w) => !/^\d+$/.test(w));
  return { name, idSlug, tagWords };
}

function glassCategory(idSlug: string, tagWords: string[]): string {
  const all = [idSlug, ...tagWords];
  for (const key of Object.keys(GLASS_CATEGORY_OVERRIDES)) {
    if (all.some((w) => w.includes(key))) return GLASS_CATEGORY_OVERRIDES[key];
  }
  return "misc";
}

function buildNormalIcons(): GeneratedIcon[] {
  const entries: GeneratedIcon[] = [];
  const keys = new Set<string>();
  for (const style of STYLES) {
    const styleRoot = join(PUBLIC, style);
    if (!existsSync(styleRoot)) continue;
    for (const dir of readdirSync(styleRoot, { withFileTypes: true })) {
      if (!dir.isDirectory() || !FOLDER_TO_CATEGORY[dir.name]) continue;
      for (const file of readdirSync(join(styleRoot, dir.name))) {
        if (file.endsWith(".svg")) keys.add(`${dir.name}/${file}`);
      }
    }
  }

  for (const key of [...keys].sort()) {
    const [folder, file] = key.split("/");
    const basename = file.replace(/\.svg$/i, "");
    const tags = [FOLDER_TO_TAG[folder], ...basename.split("-").filter(Boolean)];
    for (const style of STYLES) {
      if (!existsSync(join(PUBLIC, style, folder, file))) continue;
      entries.push({
        id: `${folder}-${basename}`,
        name: titleCaseKebab(basename),
        style,
        category: FOLDER_TO_CATEGORY[folder],
        tags,
        file: `${style}/${folder}/${file}`,
      });
    }
  }
  return entries;
}

function buildGlassIcons(): GeneratedIcon[] {
  const glassRoot = join(PUBLIC, "glass-icons");
  if (!existsSync(glassRoot)) return [];
  const files = readdirSync(glassRoot)
    .filter((f) => f.endsWith(".svg"))
    .sort();

  const seen = new Set<string>();
  const entries: GeneratedIcon[] = [];
  for (const file of files) {
    const { name, idSlug, tagWords } = glassName(file);
    let id = `glass-${idSlug}`;
    let suffix = 1;
    while (seen.has(id)) {
      suffix += 1;
      id = `glass-${idSlug}-${suffix}`;
    }
    seen.add(id);
    entries.push({
      id,
      name,
      style: "glass",
      category: glassCategory(idSlug, tagWords),
      tags: ["glass", ...tagWords],
      file: `glass/${file}`,
    });
  }
  return entries;
}

function copyAssets(icons: GeneratedIcon[]): void {
  const assetsDir = join(PKG_DIR, "assets");
  rmSync(assetsDir, { recursive: true, force: true });
  for (const style of [...STYLES, "glass" as const]) {
    mkdirSync(join(assetsDir, style), { recursive: true });
  }
  for (const icon of icons) {
    const dest = join(assetsDir, icon.file);
    mkdirSync(dirname(dest), { recursive: true });
    const src =
      icon.style === "glass"
        ? join(PUBLIC, "glass-icons", icon.file.slice("glass/".length))
        : join(PUBLIC, icon.file);
    copyFileSync(src, dest);
  }
}

function copyBrandAssets(): void {
  const dir = join(PKG_DIR, "assets", "brands");
  mkdirSync(dir, { recursive: true });
  for (const brand of BRAND_LOGOS) {
    const src = join(PUBLIC, "brand-logos", `${brand.slug}.svg`);
    if (!existsSync(src)) throw new Error(`Missing brand logo: ${src}`);
    copyFileSync(src, join(dir, `${brand.slug}.svg`));
  }
}

function writeBrandRegistry(): number {
  const brands = BRAND_LOGOS.map(
    ({ slug, name, group, site, guidelines, license, tier, tone }) => ({
      slug,
      name,
      group,
      site,
      guidelines,
      license,
      tier,
      tone,
    }),
  ).sort((a, b) => a.slug.localeCompare(b.slug));

  const body = brands.map((brand) => `  ${JSON.stringify(brand)},`).join("\n");

  const header = `export type BrandLogoTier = "permissive" | "attribution" | "share-alike" | "trademark-only";

export interface GeneratedBrand {
  slug: string;
  name: string;
  group: string;
  site: string | null;
  guidelines: string | null;
  license: string;
  tier: BrandLogoTier;
  tone: "light" | "dark";
}

export const BRAND_COUNT = ${brands.length};

export const BRANDS: GeneratedBrand[] = [
${body}
];
`;

  const outFile = join(PKG_DIR, "src", "brands.generated.ts");
  writeFileSync(outFile, header);
  console.log(`Wrote ${outFile}`);
  return brands.length;
}

function main(): void {
  const icons = [...buildNormalIcons(), ...buildGlassIcons()];
  if (icons.length === 0) {
    console.error("No icons found - run this script from the runeicons repository.");
    process.exit(1);
  }

  copyAssets(icons);
  copyBrandAssets();

  const counts: Record<string, number> = {};
  for (const icon of icons) counts[icon.style] = (counts[icon.style] ?? 0) + 1;

  const body = icons
    .slice()
    .sort((a, b) => (a.id === b.id ? a.style.localeCompare(b.style) : a.id.localeCompare(b.id)))
    .map((icon) => `  ${JSON.stringify(icon)},`)
    .join("\n");

  const header = `export type IconStyle = "normal" | "duotone" | "fill" | "pixelated" | "glass";

export interface GeneratedIcon {
  id: string;
  name: string;
  style: IconStyle;
  category: string;
  tags: string[];
  file: string;
}

export const ICON_COUNTS = {
  total: ${icons.length},
  normal: ${counts.normal ?? 0},
  duotone: ${counts.duotone ?? 0},
  fill: ${counts.fill ?? 0},
  pixelated: ${counts.pixelated ?? 0},
  glass: ${counts.glass ?? 0},
} as const;

export const GENERATED_ICONS: GeneratedIcon[] = [
${body}
];
`;

  const outFile = join(PKG_DIR, "src", "icons.generated.ts");
  writeFileSync(outFile, header);

  console.log(`Wrote ${outFile}`);
  console.log(
    `  total=${icons.length} normal=${counts.normal ?? 0} duotone=${counts.duotone ?? 0} fill=${counts.fill ?? 0} pixelated=${counts.pixelated ?? 0} glass=${counts.glass ?? 0}`,
  );
  console.log(`Copied ${icons.length} SVGs into ${join(PKG_DIR, "assets")}`);

  const brandCount = writeBrandRegistry();
  console.log(`Copied ${brandCount} brand logos into ${join(PKG_DIR, "assets", "brands")}`);
}

main();
