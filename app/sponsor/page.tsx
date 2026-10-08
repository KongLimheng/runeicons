import { pageMetadata } from "@/lib/seo";

import SponsorContent from "./components/SponsorContent";

export const metadata = pageMetadata({
  title: "Sponsor",
  description:
    "Support Rune Icons with a donation and help keep the open-source icon library free for everyone.",
  path: "/sponsor",
});

export default function SponsorPage() {
  return <SponsorContent />;
}
