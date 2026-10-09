import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Browse icons",
  description:
    "Browse and customize 900+ open-source icons in five styles: outline, duotone, fill, pixelated and glass. Copy any icon as SVG or JSX.",
  path: "/icons",
});

// Rendered by the workspace layout, so switching to /editor only swaps the centre.
export default function IconsPage() {
  return <h1 className="sr-only">Browse Rune Icons</h1>;
}
