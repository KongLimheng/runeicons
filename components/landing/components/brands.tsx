import Image from "next/image";
import Link from "next/link";

import TextHighlightWave from "@/components/ui/text-highlight-wave";
import { BRAND_LOGOS } from "@/constants/brand-logos";
import { cn } from "@/lib/utils";

const FEATURED = [
  "openai",
  "anthropic",
  "react",
  "nextjs",
  "vercel",
  "github",
  "figma",
  "typescript",
  "tailwindcss",
  "supabase",
  "stripe",
  "docker",
];

const featured = FEATURED.flatMap((slug) => BRAND_LOGOS.find((logo) => logo.slug === slug) ?? []);

const Brands = () => (
  <div className="flex flex-col gap-10 sm:gap-12">
    <div className="flex flex-col">
      <span className="text-label font-medium tracking-[0.08em] text-muted-foreground uppercase">
        Brands
      </span>
      <TextHighlightWave
        as="h2"
        className="mt-3 text-h2 font-normal"
        text={["The logos you reach for"]}
      />
      <p className="mt-4 max-w-2xl text-lead text-muted-foreground">
        {BRAND_LOGOS.length.toLocaleString("en-US")} brand logos for the tools developers and
        designers use every day. Copy or download any of them as SVG, with its license and a link to
        the official brand guidelines.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
      {featured.map((logo) => (
        <Link
          key={logo.slug}
          href="/brands"
          prefetch={false}
          aria-label={`${logo.name} logo`}
          className={cn(
            "relative aspect-[4/3] overflow-hidden rounded-2xl transition-[scale] duration-150 ease-out hover:scale-[1.02] active:scale-[0.98]",
            logo.tone === "dark" ? "bg-[#1C1C1C]" : "bg-white dark:bg-[#ECECEC]",
          )}
        >
          <Image
            src={logo.file}
            alt=""
            fill
            unoptimized
            loading="lazy"
            sizes="(min-width: 1024px) 160px, 25vw"
            className="object-contain p-6"
          />
        </Link>
      ))}
    </div>

    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
      <Link
        href="/brands"
        prefetch={false}
        className="inline-flex h-10 w-fit items-center rounded-lg bg-[#1346E7] px-5 text-body-sm font-medium text-white transition-[background-color,scale] duration-150 ease-out hover:bg-[#1346E7]/90 active:scale-[0.97]"
      >
        Browse brand logos
      </Link>
      <p className="max-w-[60ch] text-body-sm text-muted-foreground">
        Logos are trademarks of their owners, shown for identification only, and are not covered by
        our Apache 2.0 license.
      </p>
    </div>
  </div>
);

export default Brands;
