import type { Metadata } from "next";

import { SITE_URL } from "@/lib/site";

const SITE_NAME = "Rune Icons";
const OG_IMAGE = { url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: SITE_NAME };

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url: `${SITE_URL}${path}`,
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
