import { BrandsView } from "@/components/brands/brands-view";
import DocsShell from "@/components/docs/docs-shell";
import { BRAND_LOGOS } from "@/constants/brand-logos";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Brand logos",
  description:
    "The brand logos developers and designers use most, from AI and frameworks to cloud and design tools. Copy or download any logo as SVG, with its license and official brand site.",
  path: "/brands",
});

const BrandsPage = () => (
  <DocsShell
    wide
    title="Brand logos"
    lead={`${BRAND_LOGOS.length} logos developers and designers reach for most, each with its license and a link to the brand's official logo page or site.`}
  >
    <BrandsView />
  </DocsShell>
);

export default BrandsPage;
