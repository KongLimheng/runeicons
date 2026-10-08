export type FAQItem = {
  id: string;
  number: string;
  question: string;
  answer: string;
};

export const faqItems: FAQItem[] = [
  {
    id: "item-1",
    number: "01",
    question: "What formats are the icons available in?",
    answer:
      "Optimized SVG, plus React and Vue components. Each one is tree-shakeable, so importing a single icon does not drag the whole set into your bundle.",
  },
  {
    id: "item-2",
    number: "02",
    question: "Can I customize the icon size and color?",
    answer:
      "Yes. Size, stroke width, and color are all controllable through props or plain CSS. Icons use currentColor by default, so they pick up whatever color their parent already has.",
  },
  {
    id: "item-3",
    number: "03",
    question: "Is Rune Icons free to use commercially?",
    answer:
      "Yes. The icons are licensed under Apache 2.0, so use them in personal work, client projects, or anything you sell, no attribution needed. The website itself (landing page, components, and animations) is Apache 2.0 with attribution and the Commons Clause: credit the Rune Icons Team with a link to runeicons.com if you reuse it, and don't resell it as a template or kit.",
  },
  {
    id: "item-4",
    number: "04",
    question: "How do I request a new icon?",
    answer:
      "Open an issue on the GitHub repo. I go through requests most weeks and build the ones people actually vote for first.",
  },
];
