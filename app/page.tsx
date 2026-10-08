import dynamic from "next/dynamic";

import HeroSection from "@/components/landing/components/herosection";
import { faqItems } from "@/components/landing/faq-items";
import { FRAME_WIDTH, FrameRails } from "@/components/layout/page-frame";
import Navbar from "@/components/ui/navbar";
import { NAV_LINKS } from "@/lib/nav-links";
import { cn } from "@/lib/utils";

const Search = dynamic(() => import("@/components/landing/components/search"));
const Bento = dynamic(() => import("@/components/landing/components/bento"));
const Packages = dynamic(() => import("@/components/landing/components/packages"));
const Faq = dynamic(() => import("@/components/landing/components/faq"));
const CTA = dynamic(() => import("@/components/landing/components/cta"));
const Footer = dynamic(() => import("@/components/landing/components/footer"));

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

const Page = async () => {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <div className="relative grid min-h-screen w-full grid-cols-[1fr_auto_1fr] grid-rows-[auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto_1px_auto] overflow-hidden bg-[#F5F5F5] dark:bg-background">
        <div
          className={cn(
            FRAME_WIDTH,
            "relative col-start-2 row-start-1 flex flex-col overflow-hidden",
          )}
        >
          <Navbar showBanner showDashedBorder links={NAV_LINKS} />
        </div>

        <main id="main" className="contents">
        <div
          id="home"
          className={cn(
            FRAME_WIDTH,
            "col-start-2 row-start-3 flex scroll-mt-24 flex-col gap-2 px-4 pt-20 pb-4 sm:px-6 sm:pb-6 lg:px-8",
          )}
        >
          <HeroSection />
        </div>

        <div className="pointer-events-none col-span-full col-start-1 row-start-4 border-b-2 border-dashed" />

        <div
          id="search"
          className={cn(
            FRAME_WIDTH,
            "col-start-2 row-start-5 flex scroll-mt-24 flex-col pad-section",
          )}
        >
          <Search />
        </div>

        <div className="pointer-events-none col-span-full col-start-1 row-start-6 border-b-2 border-dashed" />

        <div
          id="features"
          className={cn(
            FRAME_WIDTH,
            "col-start-2 row-start-7 flex scroll-mt-24 flex-col pad-section [content-visibility:auto] [contain-intrinsic-size:auto_900px]",
          )}
        >
          <Bento />
        </div>

        <div className="pointer-events-none col-span-full col-start-1 row-start-8 border-b-2 border-dashed" />

        <div
          id="packages"
          className={cn(
            FRAME_WIDTH,
            "col-start-2 row-start-9 flex scroll-mt-24 flex-col pad-section [content-visibility:auto] [contain-intrinsic-size:auto_900px]",
          )}
        >
          <Packages />
        </div>

        <div className="pointer-events-none col-span-full col-start-1 row-start-10 border-b-2 border-dashed" />

        <div
          id="faq"
          className={cn(
            FRAME_WIDTH,
            "col-start-2 row-start-11 flex scroll-mt-24 flex-col justify-center pad-section lg:min-h-[calc(100vh-104px)] [content-visibility:auto] [contain-intrinsic-size:auto_900px]",
          )}
        >
          <Faq />
        </div>

        <div className="pointer-events-none col-span-full col-start-1 row-start-12 border-b-2 border-dashed" />

        <div
          className={cn(
            FRAME_WIDTH,
            "col-start-2 row-start-13 flex flex-col overflow-hidden pad-section [content-visibility:auto] [contain-intrinsic-size:auto_900px]",
          )}
        >
          <CTA />
        </div>
        </main>

        <div className="pointer-events-none col-span-full col-start-1 row-start-14 border-b-2 border-dashed" />

        <div
          className={cn(
            FRAME_WIDTH,
            "col-start-2 row-start-15 flex flex-col px-4 pt-14 pb-0 sm:px-6 sm:pt-18 lg:px-8 lg:pt-22 [content-visibility:auto] [contain-intrinsic-size:auto_900px]",
          )}
        >
          <Footer />
        </div>

        <FrameRails />
      </div>
    </>
  );
};

export default Page;
