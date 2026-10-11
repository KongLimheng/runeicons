import { BrandsView } from "@/components/brands/brands-view";
import DocsShell from "@/components/docs/docs-shell";
import { BRAND_LOGOS } from "@/constants/brand-logos";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const COUNT = BRAND_LOGOS.length.toLocaleString("en-US");

export const metadata = pageMetadata({
  title: "Free brand logos in SVG",
  description: `Search ${COUNT} brand logos for AI tools, frameworks, languages and cloud platforms. Copy or download each as SVG, with its license and official brand link.`,
  path: "/brands",
});

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Brand logos",
  url: `${SITE_URL}/brands`,
  description: `${COUNT} brand logos as SVG files, each with its license and a link to the brand's official site or guidelines.`,
  isPartOf: { "@type": "WebSite", name: "Rune Icons", url: SITE_URL },
  mainEntity: {
    "@type": "ItemList",
    name: "Brand logos",
    numberOfItems: BRAND_LOGOS.length,
  },
};

const BrandsPage = () => (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
    />
    <DocsShell
      wide
      title="Brand logos"
      lead={`${COUNT} logos developers and designers reach for most, each with its license and a link to the brand's official logo page or site.`}
    >
      <BrandsView />
    </DocsShell>
  </>
);

export default BrandsPage;
