import { pageMetadata } from "@/lib/seo";

import AboutContent from "./components/AboutContent";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Meet the team behind Rune Icons, the open-source icon library with every glyph in five styles.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent />;
}
