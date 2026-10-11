import type { Metadata, Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import localFont from "next/font/local";

import { DevToolbar } from "@/components/dev-toolbar";
import AnalyticsConsent from "@/components/landing/analytics-consent";
import { ShapeProvider } from "@/lib/shape-context";
import { GITHUB_REPO, SITE_URL, X_URL } from "@/lib/site";
import { MotionProvider } from "@/provider/motion-provider";
import { ThemeProvider } from "@/provider/theme-provider";

import "./globals.css";

const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--font-satoshi",
  weight: "300 900",
  style: "normal",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const DESCRIPTION =
  "An open-source icon library where every glyph comes in five styles: outline, duotone, fill, pixelated and glass. Reshape any path in the browser, then copy it out as SVG or JSX. Apache 2.0 licensed.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Rune Icons: open-source icons in five styles",
    template: "%s | Rune Icons",
  },
  description: DESCRIPTION,
  applicationName: "Rune Icons",
  authors: [{ name: "Nexvyn", url: "https://nexvyn.dev" }],
  creator: "Nexvyn",
  keywords: [
    "icons",
    "svg icons",
    "open source icons",
    "icon library",
    "react icons",
    "duotone icons",
    "pixel art icons",
    "glass icons",
    "Apache 2.0 licensed icons",
    "free icons for developers",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Rune Icons",
    locale: "en_US",
    url: SITE_URL,
    title: "Rune Icons: open-source icons in five styles",
    description: DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Rune Icons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@nexvyn",
    creator: "@nexvyn",
    title: "Rune Icons: open-source icons in five styles",
    description: DESCRIPTION,
    images: [`${SITE_URL}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "technology",
  other: { "llms-txt": `${SITE_URL}/llms.txt` },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F5F5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Rune Icons",
      url: SITE_URL,
      logo: `${SITE_URL}/icon`,
      sameAs: [X_URL, GITHUB_REPO],
    },
    {
      "@type": "WebSite",
      name: "Rune Icons",
      url: SITE_URL,
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="author" href="/humans.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${satoshi.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-body-sm focus:text-foreground focus:ring-2 focus:ring-foreground/30"
        >
          Skip to content
        </a>
        <MotionProvider>
          <ShapeProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <AnalyticsConsent />
              <DevToolbar />
            </ThemeProvider>
          </ShapeProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
