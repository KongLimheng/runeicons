"use client";

import { memo, useEffect, useMemo, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Copy, Download, Globe, Heart, Palette, Scale, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Toaster } from "@/components/ui/sonner";
import { BRAND_LOGOS, type BrandLogo, type BrandLogoTier } from "@/constants/brand-logos";
import { downloadBlob } from "@/lib/download";
import { GITHUB_ISSUES_NEW } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useBrandLikesStore } from "@/stores/brand-likes";

const TIER_COLOR: Record<BrandLogoTier, string> = {
  permissive: "bg-emerald-600",
  attribution: "bg-sky-600",
  "share-alike": "bg-amber-600",
  "trademark-only": "bg-rose-600",
};

const TIER_HINT: Record<BrandLogoTier, string> = {
  permissive: "Open license",
  attribution: "Credit the author",
  "share-alike": "Share-alike license",
  "trademark-only": "Follow the brand's guidelines",
};

const TIER_REMINDER: Record<BrandLogoTier, string | null> = {
  permissive: null,
  attribution: "This logo needs credit to its author.",
  "share-alike": "This logo is share-alike licensed.",
  "trademark-only": "Follow the brand's guidelines when you use it.",
};

const GROUPS = ["All", ...Array.from(new Set(BRAND_LOGOS.map((logo) => logo.group)))];

const svgCache = new Map<string, string>();

async function loadSvg(logo: BrandLogo) {
  const cached = svgCache.get(logo.slug);
  if (cached) return cached;
  const response = await fetch(logo.file);
  if (!response.ok) throw new Error(`Could not load ${logo.name}`);
  const text = await response.text();
  svgCache.set(logo.slug, text);
  return text;
}

const iconButton =
  "flex size-8 cursor-pointer items-center justify-center rounded-lg bg-foreground/[0.06] text-foreground/70 transition-[background-color,color,scale] duration-150 ease-out outline-none hover:bg-foreground/10 hover:text-foreground focus-visible:ring-2 focus-visible:ring-[#1346E7] active:scale-[0.92]";

const BrandCard = memo(function BrandCard({
  logo,
  liked,
  onToggleLike,
}: {
  logo: BrandLogo;
  liked: boolean;
  onToggleLike: (slug: string) => void;
}) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(await loadSvg(logo));
      toast.success(`${logo.name} copied as SVG`, {
        description: TIER_REMINDER[logo.tier] ?? undefined,
      });
    } catch {
      toast.error("Could not copy this logo");
    }
  }

  async function download() {
    try {
      downloadBlob(await loadSvg(logo), `${logo.slug}.svg`, "image/svg+xml");
      const reminder = TIER_REMINDER[logo.tier];
      if (reminder) toast(`${logo.name} downloaded`, { description: reminder });
    } catch {
      toast.error("Could not download this logo");
    }
  }

  return (
    <li
      className={cn(
        "group flex flex-col gap-3 rounded-2xl bg-white p-3 transition-shadow duration-200 ease-out [contain-intrinsic-size:auto_270px] [content-visibility:auto] dark:bg-[#141414]",
        liked && "ring-1 ring-[#1346E7]",
      )}
    >
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-xl",
          logo.tone === "dark" ? "bg-[#1C1C1C]" : "bg-[#F5F5F5] dark:bg-[#ECECEC]",
        )}
      >
        <Image
          src={logo.file}
          alt={`${logo.name} logo`}
          fill
          unoptimized
          sizes="(min-width: 1280px) 200px, (min-width: 640px) 25vw, 45vw"
          className="object-contain p-7"
        />
        <button
          type="button"
          onClick={() => onToggleLike(logo.slug)}
          aria-pressed={liked}
          aria-label={liked ? `Unlike ${logo.name}` : `Like ${logo.name}`}
          className={cn(
            "absolute top-1.5 right-1.5 flex size-8 cursor-pointer items-center justify-center rounded-lg text-neutral-500 transition-[opacity,color,scale] duration-150 ease-out outline-none hover:text-neutral-900 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#1346E7] active:scale-[0.92] [@media(hover:hover)]:group-hover:opacity-100",
            liked ? "opacity-100" : "[@media(hover:hover)]:opacity-0",
          )}
        >
          <Heart
            className={cn("size-4", liked && "fill-rose-500 text-rose-500")}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="min-w-0 px-1">
        <h2 className="truncate text-body-sm font-medium text-foreground">{logo.name}</h2>
        <p className="truncate text-micro text-muted-foreground">{logo.group}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 px-1">
        <span
          title={`${TIER_HINT[logo.tier]} (${logo.license})`}
          className="inline-flex min-w-0 items-center gap-1.5 text-micro text-muted-foreground"
        >
          <span className={cn("size-1.5 shrink-0 rounded-full", TIER_COLOR[logo.tier])} />
          <span className="truncate">{logo.license}</span>
        </span>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${logo.name} as SVG`}
            className={iconButton}
          >
            <Copy className="size-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={download}
            aria-label={`Download ${logo.name} as SVG`}
            className={iconButton}
          >
            <Download className="size-3.5" aria-hidden="true" />
          </button>
          {logo.guidelines || logo.site ? (
            <a
              href={logo.guidelines ?? logo.site ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                logo.guidelines
                  ? `${logo.name} official logo and brand guidelines`
                  : `${logo.name} official website`
              }
              title={logo.guidelines ? "Official logo and brand guidelines" : "Official website"}
              className={iconButton}
            >
              {logo.guidelines ? (
                <Palette className="size-3.5" aria-hidden="true" />
              ) : (
                <Globe className="size-3.5" aria-hidden="true" />
              )}
            </a>
          ) : null}
        </div>
      </div>
    </li>
  );
});

export function BrandsView() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("All");
  const [onlyLiked, setOnlyLiked] = useState(false);
  const liked = useBrandLikesStore((state) => state.liked);
  const toggle = useBrandLikesStore((state) => state.toggle);

  useEffect(() => {
    void useBrandLikesStore.persist.rehydrate();
  }, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return BRAND_LOGOS.filter(
      (logo) =>
        (group === "All" || logo.group === group) &&
        (!onlyLiked || liked.includes(logo.slug)) &&
        (!needle || logo.name.toLowerCase().includes(needle) || logo.slug.includes(needle)),
    );
  }, [query, group, onlyLiked, liked]);

  return (
    <div className="flex flex-col gap-6">
      <Toaster position="top-center" />
      <div
        role="note"
        className="flex gap-3 rounded-2xl bg-white p-4 text-body-sm text-muted-foreground dark:bg-[#141414]"
      >
        <Scale className="mt-0.5 size-4 shrink-0 text-foreground/70" aria-hidden="true" />
        <p className="max-w-[80ch]">
          <strong className="font-medium text-foreground">
            These are other companies&apos; trademarks, not Rune Icons.
          </strong>{" "}
          Logos are shown for identification only. We are not affiliated with or endorsed by any of
          these brands, and they are not covered by our Apache 2.0 license. Check each logo&apos;s
          license and the brand&apos;s own guidelines before you use it. Read our{" "}
          <Link href="/terms" className="underline underline-offset-2 hover:text-foreground">
            terms
          </Link>
          , or{" "}
          <a
            href={GITHUB_ISSUES_NEW}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            ask us to remove or fix a logo
          </a>
          .
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brands"
            aria-label="Search brand logos"
            className="h-11 w-full rounded-xl bg-white pr-10 pl-10 text-body-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[#1346E7] dark:bg-[#141414]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-[#1346E7]"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOnlyLiked((value) => !value)}
          aria-pressed={onlyLiked}
          className={cn(
            "inline-flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-body-sm font-medium transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.97]",
            onlyLiked
              ? "bg-[#1346E7] text-white"
              : "bg-white text-foreground/80 hover:text-foreground dark:bg-[#141414]",
          )}
        >
          <Heart className={cn("size-4", onlyLiked && "fill-white")} aria-hidden="true" />
          Liked
          <span className="tabular-nums">{liked.length}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by group">
        {GROUPS.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setGroup(name)}
            aria-pressed={group === name}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center rounded-lg px-3 text-body-sm font-medium transition-[background-color,color,scale] duration-150 ease-out active:scale-[0.97]",
              group === name
                ? "bg-[#1346E7] text-white"
                : "bg-foreground/[0.06] text-foreground/80 hover:bg-foreground/10 hover:text-foreground",
            )}
          >
            {name}
          </button>
        ))}
      </div>

      <ul
        aria-label="License labels"
        className="flex flex-wrap gap-x-5 gap-y-1.5 text-micro text-muted-foreground"
      >
        {(Object.keys(TIER_HINT) as BrandLogoTier[]).map((tier) => (
          <li key={tier} className="inline-flex items-center gap-1.5">
            <span className={cn("size-1.5 rounded-full", TIER_COLOR[tier])} />
            {TIER_HINT[tier]}
          </li>
        ))}
      </ul>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-body-sm text-muted-foreground">
          {onlyLiked && liked.length === 0
            ? "Nothing liked yet. Tap the heart on a logo to keep it here."
            : "No logos match that search."}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
          {visible.map((logo) => (
            <BrandCard
              key={logo.slug}
              logo={logo}
              liked={liked.includes(logo.slug)}
              onToggleLike={toggle}
            />
          ))}
        </ul>
      )}

      <p className="max-w-[75ch] text-body-sm text-muted-foreground">
        Each logo lists the license it was published under. Some single-color logos are tinted to
        the brand&apos;s color. For the official artwork, use the palette link on a card.
      </p>
    </div>
  );
}
