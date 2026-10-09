import type { MetadataRoute } from "next";

import { execFileSync } from "node:child_process";

import { SITE_URL } from "@/lib/site";

type Entry = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  sources: string[];
  fallback: string;
};

const ROUTES: Entry[] = [
  {
    path: "/",
    priority: 1,
    changeFrequency: "weekly",
    sources: ["app/page.tsx", "components/landing"],
    fallback: "2026-10-01",
  },
  {
    path: "/icons",
    priority: 0.9,
    changeFrequency: "weekly",
    sources: ["app/(workspace)/icons", "components/icon-page", "components/workspace"],
    fallback: "2026-10-01",
  },
  {
    path: "/editor",
    priority: 0.8,
    changeFrequency: "monthly",
    sources: ["app/(workspace)/editor", "components/workspace", "lib/editor"],
    fallback: "2026-10-01",
  },
  {
    path: "/brands",
    priority: 0.7,
    changeFrequency: "monthly",
    sources: ["app/brands", "components/brands", "constants/brand-logos.ts"],
    fallback: "2026-10-10",
  },
  {
    path: "/sponsor",
    priority: 0.6,
    changeFrequency: "monthly",
    sources: ["app/sponsor"],
    fallback: "2026-09-28",
  },
  {
    path: "/packages",
    priority: 0.7,
    changeFrequency: "monthly",
    sources: ["app/packages", "packages", "lib/docs"],
    fallback: "2026-09-28",
  },
  {
    path: "/about",
    priority: 0.5,
    changeFrequency: "yearly",
    sources: ["app/about", "public/about"],
    fallback: "2026-09-28",
  },
  {
    path: "/changelog",
    priority: 0.5,
    changeFrequency: "weekly",
    sources: ["app/changelog"],
    fallback: "2026-09-28",
  },
  {
    path: "/terms",
    priority: 0.2,
    changeFrequency: "yearly",
    sources: ["app/terms"],
    fallback: "2026-09-28",
  },
  {
    path: "/privacy",
    priority: 0.2,
    changeFrequency: "yearly",
    sources: ["app/privacy"],
    fallback: "2026-09-28",
  },
];

function lastModified(sources: string[], fallback: string): Date {
  try {
    const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", ...sources], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const date = new Date(iso);
    if (iso && !Number.isNaN(date.getTime())) return date;
  } catch {
  }
  return new Date(fallback);
}

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, changeFrequency, sources, fallback }) => ({
    url: new URL(path, SITE_URL).toString(),
    lastModified: lastModified(sources, fallback),
    changeFrequency,
    priority,
  }));
}
