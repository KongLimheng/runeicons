import DocsShell from "@/components/docs/docs-shell";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Changelog",
  description:
    "What's new in Rune Icons: new icons, styles, packages and editor improvements, release by release.",
  path: "/changelog",
});

type ChangelogEntry = {
  date: string;
  title: string;
  items: string[];
  authors?: string[];
};

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "October 11, 2026",
    title: "Packages on npm & a better brands page",
    authors: ["Nexvyn"],
    items: [
      "Published runeicons, runeicons-react, runeicons-vue, runeicons-svelte, runeicons-astro, runeicons-react-native, runeicons-mcp, and runeicons-brands to npm at 0.1.0.",
      "Linked each published package to its npm page and showed a live or coming soon status on the packages page.",
      "Kept the brands search bar pinned while scrolling and fixed the brand cards and filters on small screens.",
      "Added a Credits section to every package README, naming the contributors of each package.",
      "Updated the titles, descriptions, and structured data for the brands and packages pages, and listed packages in llms.txt.",
    ],
  },
  {
    date: "October 10, 2026",
    title: "Brand logos, runeicons-brands & analytics",
    authors: ["Nexvyn"],
    items: [
      "Added a brand logos page with 1,125 logos, group filters, likes, and copy or download as SVG, each with its license and a link to the brand's official site or guidelines.",
      "Replaced 418 brand logos with versions from the brands' own sites.",
      "Added a brands section, a footer link, and an FAQ entry to the landing page, and Brands and Packages links to the workspace header with a mobile menu.",
      "Added the runeicons-brands package with a shared logo loader, a brands entry point in runeicons-react, brand tools in runeicons-mcp, a RuneBrand widget in runeicons-flutter, and a Brands tab in the Figma plugin.",
      "Excluded third-party brand logos from the license and covered them in the terms, privacy policy, and README.",
      "Switched to Google Analytics, loaded only after the visitor accepts a consent banner, and dropped @vercel/analytics.",
      "Lazy-loaded GSAP, motion, and analytics, split the editor and icon page bundles, and added a PWA manifest and security headers.",
    ],
  },
  {
    date: "October 9, 2026",
    title: "Package READMEs & metadata",
    authors: ["Nexvyn"],
    items: [
      "Rewrote the READMEs for runeicons-vue, runeicons-svelte, runeicons-astro, runeicons-react-native, runeicons-flutter, runeicons-mcp, runeicons-figma, and runeicons-vscode, plus the packages overview.",
      "Added LICENSE files, logos, and build configs to the packages and updated their package metadata.",
      "Added tests and new battery icons to runeicons-mcp.",
    ],
  },
  {
    date: "October 8, 2026",
    title: "Performance & page metadata",
    authors: ["Nexvyn"],
    items: [
      "Added per-page SEO metadata, an animated navbar brand mark, and lazy-loaded home sections.",
      "Paused the hero, CTA, and bento animations while off-screen and lazy-loaded the hero count-up.",
      "Rendered the footer wordmark on the server with a lazy cursor-only icon field.",
      "Switched the search and CTA gradients to smaller WebP files and labeled the search input.",
      "Rewrote the runeicons and runeicons-react READMEs and pointed the repository URLs at Runeicons.",
    ],
  },
  {
    date: "October 1, 2026",
    title: "Workspace refactor",
    authors: ["Nexvyn"],
    items: [
      "Consolidated the editor and icons workspace components for a cleaner layout and better performance.",
      "Tidied the workspace panel components and styles and replaced the header logo with the shared brand mark.",
      "Removed the Special Gothic font and unused harvest images.",
    ],
  },
  {
    date: "September 28, 2026",
    title: "Shared workspace layout",
    authors: ["vansh-nagar"],
    items: [
      "Shared one layout between the icons and editor pages and refined the workspace panels.",
    ],
  },
  {
    date: "September 27, 2026",
    title: "404 page, packages page & feedback rework",
    authors: ["Nexvyn"],
    items: [
      "Added a custom 404 page where the hero rocket launches and bursts into shards, glyphs, and smoke.",
      "Added a packages page with inline per-package guides and a platform section on the landing page.",
      "Rebuilt the feedback dialog to file GitHub issues with the text prefilled.",
      "Showed a direction arrow on the canvas when an outer shadow is applied.",
      "Rewrote the package READMEs, normalized authorship to the Rune Icons Team, and removed em-dashes site-wide.",
      "Wired the new OG image and added GitHub avatars to changelog entries.",
    ],
  },
  {
    date: "September 25, 2026",
    title: "Platform packages, pnpm & lighter assets",
    authors: ["Nexvyn", "404khai", "MayurK-cmd", "withxat", "gs-rumana"],
    items: [
      "Added the core runeicons package plus React, Vue, Svelte, Astro, React Native, Flutter, VS Code, Figma, and MCP packages.",
      "Moved the repository to a single pnpm workspace.",
      "Converted textures and the CTA gradient to WebP and removed unused images, cutting several megabytes per visit.",
    ],
  },
  {
    date: "August 26, 2026",
    title: "Landing refresh, legal pages & site metadata",
    authors: ["Nexvyn"],
    items: [
      "Refined the banner, navbar, hero, search, bento, FAQ, CTA, and footer with faster motion, reduced-motion support, and theme-aware artwork.",
      "Added Terms of Use and Privacy Policy pages, linked from the footer.",
      "Added llms.txt and humans.txt, a sitemap, robots rules, an OG image, and generated favicon and apple icons.",
    ],
  },
  {
    date: "June 4, 2026",
    title: "Properties panel & motion configuration",
    items: [
      "Rebuilt the properties panel into modular, self-contained sections with a shared configuration system.",
      "Added a full motion configuration panel for animating icons, with per-path overrides and easing controls.",
    ],
  },
  {
    date: "May 28, 2026",
    title: "Icon engine overhaul & editor polish",
    items: [
      "Overhauled the icon rendering and customization engine end to end.",
      "Wired sidebar customization into the editor and consolidated the action bar, with smoother mode transitions.",
      "Migrated the about page to theme-aware variables and refreshed team data.",
    ],
  },
  {
    date: "May 27, 2026",
    title: "Sponsor mascot reactions",
    items: [
      "The panda mascot on the sponsor page now stages different reactions based on contribution tier.",
    ],
  },
  {
    date: "May 23, 2026",
    title: "Draw mode, flood fill, and launch effects",
    items: [
      "Added a draw mode toolbar with scratch assets and a full canvas workflow in the editor.",
      "Added a flood-fill tool and refined the overall draw mode workflow.",
      "Wired the Blossom color picker into the color section with an arc slider.",
      "Added launch clouds, landing dust, and hazard feedback to the hero rocket animation, plus general rocket polish.",
      "Refined UI panels and optimized the Blossom picker's performance.",
    ],
  },
  {
    date: "May 22, 2026",
    title: "Cleanup pass across landing & UI",
    items: [
      "Implemented the Blossom color picker component.",
      "Centralized the navbar and removed unused assets, components, and redundant comments across landing, sponsor, and about pages.",
    ],
  },
  {
    date: "May 21, 2026",
    title: "Realistic rocket launch sequence",
    items: [
      "Rebuilt the hero animation into modular scenes with a realistic, multi-stage rocket launch sequence.",
      "Fixed tray slot anchoring, motion overflow, and state restoration in the editor.",
    ],
  },
  {
    date: "May 20, 2026",
    title: "Workspace, editor, and dark mode fixes",
    items: [
      "Refined workspace UI and expanded customization controls on the icon page.",
      "Polished the hero animation and pruned the footer.",
      "Fixed the editor tray's cross button, drag isolation, and a canvas clipping bug.",
      "Aligned library/tray dark-mode inversion with the workspace so icons render consistently.",
      "Added an about page detail view with blur/fade transitions and refined sponsor tier UX.",
    ],
  },
  {
    date: "May 18, 2026",
    title: "Shared workspace components",
    items: [
      "Unified the editor with /icons shared components and a grid-aligned workspace.",
      "Reorganized the editor codebase into role-based subfolders.",
    ],
  },
  {
    date: "May 15–16, 2026",
    title: "Dynamic rendering engine",
    items: [
      "Implemented dynamic SVG rendering and a motion animation engine in the icon preview.",
      "Built out the icon workspace preview components and animation rendering pipeline.",
      "Fixed duotone and fill icon inversion in dark mode.",
    ],
  },
  {
    date: "May 12–13, 2026",
    title: "New icon styles: duotone, pixelated, fill",
    items: [
      "Switched the editor to a categorized normal icon set.",
      "Added duotone, pixelated, and fill icon variants, each with their own editor support.",
      "Refactored the bento section's explosion animation to extend lines from the center cube.",
      "Fixed a hydration mismatch in the theme switcher.",
      "Revamped the about page.",
    ],
  },
  {
    date: "May 11, 2026",
    title: "Animation engine & stroke styles",
    items: [
      "Implemented the icon animation engine with motion controls.",
      "Added a stroke style selection section and gradient utilities.",
      "Expanded keyboard shortcuts and improved state synchronization across the app.",
      "Enhanced code snippet export and SVG export capabilities.",
    ],
  },
  {
    date: "May 9–10, 2026",
    title: "Icon library & gradient controls",
    items: [
      "Overhauled the icon data structure and library navigation, with custom icon support.",
      "Overhauled the icon preview and export system, plus selection logic and keyboard navigation.",
      "Added advanced gradient controls to the color section and keyboard navigation to the Blossom picker.",
      "Added texture assets, replacing the texture grid with scrubber-based selection.",
      "Added a feedback submission system to the icon page.",
    ],
  },
  {
    date: "April 28, 2026",
    title: "WIP banner & licensing",
    items: ["Added a work-in-progress banner, team credits, and the Apache 2.0 license."],
  },
  {
    date: "April 14–18, 2026",
    title: "Icon editor launches",
    items: [
      "Shipped the SVG icon editor with property panels, tuning controls, and keyboard shortcuts.",
      "Migrated the project from npm to bun.",
      "Patched a Next.js server components DoS vulnerability.",
      "Improved color input handling: 3-character hex codes, HSL format support.",
      "Fixed gradient rotation center and added preserveAspectRatio in SVG export.",
      "Added a tuning provider and motion provider for animation support.",
    ],
  },
  {
    date: "April 4–7, 2026",
    title: "Landing page refinements",
    items: [
      "Implemented the icon workspace panels, property controls, and icon style selection system.",
      "Added the icon carousel with interactive customization tools.",
      "Added the search component with a tab background animation.",
      "Refined landing page UI and animations across two follow-up passes.",
    ],
  },
  {
    date: "March 24, 2026",
    title: "SVG editor foundation",
    items: ["Added the first version of the SVG editor."],
  },
  {
    date: "March 6–11, 2026",
    title: "Icon customization app",
    items: [
      "Implemented a full icon customization application with workspace, properties, and library panels.",
      "Updated icon colors, improved the search component, and refined SVG rendering.",
      "Enhanced the hero section and its SVG animations.",
    ],
  },
  {
    date: "March 1–4, 2026",
    title: "Landing page core",
    items: [
      "Integrated Creem for sponsor page payments (testing mode).",
      "Rebuilt the landing page with search, hero, FAQ, bento, and testimonials sections.",
      "Created an interactive SVG vector engine for the hero section.",
    ],
  },
  {
    date: "February 26–27, 2026",
    title: "Sponsor page & responsiveness",
    items: [
      "Shipped the initial sponsor page layout.",
      "Improved responsiveness across the site with minor bug fixes.",
    ],
  },
  {
    date: "February 20–25, 2026",
    title: "Project kickoff",
    items: [
      "Started the project on Next.js.",
      "Added the full icon set: 170+ icons.",
      "Shipped the initial about page and landing page layout.",
    ],
  },
];

const ChangelogPage = () => (
  <DocsShell title="Changelog" lead="A history of what shipped, newest first.">
    <div className="flex flex-col divide-y divide-border">
      {CHANGELOG.map((entry, i) => (
        <div
          key={`${entry.date}-${entry.title}`}
          className="flex flex-col gap-4 py-8 first:pt-0 last:pb-0"
        >
          <div className="flex flex-col gap-2">
            <span className="flex flex-wrap items-center gap-2 text-label tracking-[0.08em] text-muted-foreground uppercase tabular-nums">
              {entry.date}
              {i === 0 && (
                <span className="rounded-full bg-[#1346E7] px-2 py-0.5 text-micro font-medium tracking-normal text-white normal-case">
                  Latest
                </span>
              )}
              {entry.authors && entry.authors.length > 0 && (
                <span className="flex normal-case">
                  {entry.authors.map((author, index) => (
                    <a
                      key={author}
                      href={`https://github.com/${author}`}
                      target="_blank"
                      rel="noreferrer"
                      title={author}
                      aria-label={`GitHub profile of ${author}`}
                      className="flex size-6 shrink-0 items-center rounded-full transition-transform duration-150 ease-out hover:-translate-y-0.5"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://github.com/${author}.png?size=64`}
                        alt=""
                        width={22}
                        height={22}
                        loading="lazy"
                        className={`size-[22px] rounded-full border border-background bg-muted ${index === 0 ? "ml-px" : "-ml-[5px]"}`}
                      />
                    </a>
                  ))}
                </span>
              )}
            </span>
            <h2 className="text-h3 text-foreground">{entry.title}</h2>
          </div>
          <ul className="flex max-w-[65ch] flex-col gap-2 text-body-sm text-pretty text-muted-foreground">
            {entry.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </DocsShell>
);

export default ChangelogPage;
