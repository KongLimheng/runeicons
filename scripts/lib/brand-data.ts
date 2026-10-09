import { readFileSync } from "node:fs";
import { join } from "node:path";

import { BRAND_LOGOS, type BrandLogoTier } from "../../constants/brand-logos";

export interface BrandData {
  slug: string;
  name: string;
  group: string;
  site: string | null;
  guidelines: string | null;
  license: string;
  tier: BrandLogoTier;
  tone: "light" | "dark";
  viewBox: string;
  markup: string;
}

const ROOT = join(import.meta.dir, "..", "..");
const SVG_DIR = join(ROOT, "public", "brand-logos");

const ROOT_PAINT_ATTRS = [
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "fill-rule",
  "clip-rule",
  "opacity",
];

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function extractBody(svg: string) {
  const cleaned = svg
    .replace(/<\?xml[^?]*\?>\s*/g, "")
    .replace(/<!DOCTYPE[^>]*>\s*/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");
  const attrs = cleaned.match(/<svg\b([^>]*)>/)?.[1] ?? "";
  const viewBox = attrs.match(/viewBox\s*=\s*"([^"]+)"/)?.[1] ?? "0 0 24 24";
  const kept = ROOT_PAINT_ATTRS.flatMap((name) => {
    const match = attrs.match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*"([^"]+)"`));
    return match ? [`${name}="${match[1]}"`] : [];
  });
  let inner = cleaned
    .replace(/<svg\b[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();
  if (kept.length > 0) inner = `<g ${kept.join(" ")}>${inner}</g>`;
  return { viewBox, inner };
}

function scope(inner: string, slug: string) {
  let out = inner;
  const ids = new Set([...inner.matchAll(/\bid\s*=\s*"([^"]+)"/g)].map((match) => match[1]));
  for (const id of ids) {
    const prefixed = `${slug}--${id}`;
    out = out
      .replace(new RegExp(`\\bid\\s*=\\s*"${escape(id)}"`, "g"), `id="${prefixed}"`)
      .replace(new RegExp(`url\\(\\s*#${escape(id)}\\s*\\)`, "g"), `url(#${prefixed})`)
      .replace(new RegExp(`(href\\s*=\\s*)"#${escape(id)}"`, "g"), `$1"#${prefixed}"`);
  }
  const styles = [...out.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((match) => match[1]);
  const classes = new Set(
    styles.flatMap((css) => [...css.matchAll(/\.(-?[A-Za-z_][\w-]*)/g)].map((match) => match[1])),
  );
  for (const name of classes) {
    const prefixed = `${slug}--${name}`;
    out = out
      .replace(new RegExp(`\\.${escape(name)}(?![\\w-])`, "g"), `.${prefixed}`)
      .replace(/class\s*=\s*"([^"]*)"/g, (_all, value: string) => {
        const list = value.split(/\s+/).map((item) => (item === name ? prefixed : item));
        return `class="${list.join(" ")}"`;
      });
  }
  return out;
}

export function loadBrands(): BrandData[] {
  return BRAND_LOGOS.map((logo) => {
    const { viewBox, inner } = extractBody(readFileSync(join(SVG_DIR, `${logo.slug}.svg`), "utf8"));
    return {
      slug: logo.slug,
      name: logo.name,
      group: logo.group,
      site: logo.site,
      guidelines: logo.guidelines,
      license: logo.license,
      tier: logo.tier,
      tone: logo.tone,
      viewBox,
      markup: scope(inner, logo.slug),
    };
  });
}
