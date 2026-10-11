import Script from "next/script";

const WEBSITE_ID = "9613cbbb-a21a-465e-8d96-9ed232539760";
const DOMAINS = "runeicons.com,www.runeicons.com";

export default function UmamiAnalytics() {
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={WEBSITE_ID}
      data-domains={DOMAINS}
      strategy="lazyOnload"
    />
  );
}
