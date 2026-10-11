# Rune Icons

An open-source icon library where every glyph comes in five styles: outline, duotone, fill, pixelated, and glass.

**900+ icons** · free and open-source · copy any icon as SVG or JSX.

[![Website](https://img.shields.io/badge/Website-runeicons.com-7c5cff?style=flat-square)](https://runeicons.com)
[![License](https://img.shields.io/badge/Icons-Apache_2.0-7c5cff?style=flat-square)](LICENSE)

[**Browse icons →**](https://runeicons.com) · [**Brand logos →**](https://runeicons.com/brands) · [**Contributing →**](CONTRIBUTING.md)

## Features

- **Five styles per icon**: normal (outline), duotone, fill, pixelated, and glass.
- **Reshape in the browser**: tweak any path in the built-in editor, then copy it out as SVG or JSX.
- **Search and filter**: find icons by name, category, or tag.
- **Brand logos**: 1,100+ logos of the tools developers and designers use most, each with its license and a link to the brand's official logo page. Like, copy, or download any of them as SVG.
- **Free for commercial and personal use** under the [Apache 2.0 License](LICENSE).

## Quick start

Requires [Node.js](https://nodejs.org) 20+, [pnpm](https://pnpm.io) 10, and [Bun](https://bun.sh) (the icon scripts and package tests run on Bun).

```bash
git clone https://github.com/Runeicons/runeicons.git
cd runeicons
pnpm install
pnpm dev
```

The site will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command               | Description                                                 |
| :-------------------- | :---------------------------------------------------------- |
| `pnpm dev`            | Start the Next.js development server                        |
| `pnpm build`          | Production build                                            |
| `pnpm start`          | Serve the production build                                  |
| `pnpm lint`           | Lint with ESLint                                            |
| `pnpm format`         | Format the codebase with Prettier                           |
| `pnpm icons:manifest` | Regenerate `lib/icons/manifest.generated.ts` from `public/` |
| `pnpm icons:sprites`  | Regenerate the per-style sprites in `public/sprites/`       |

The JavaScript packages in `packages/` are part of the same pnpm workspace. Run one package's tests with `pnpm --filter runeicons-react test`, or every package with `pnpm -r test`.

## Brand logos

The `/brands` page lists logos of popular AI tools, languages, frameworks, databases, cloud platforms, design tools, and more. The files live in `public/brand-logos/` and the list, with each logo's license, official site, and brand guidelines link, is in `constants/brand-logos.ts`.

These logos are trademarks of their owners and are **not** covered by Rune Icons' Apache 2.0 license. See `public/brand-logos/NOTICE.md`. Follow each brand's own guidelines, and do not alter their logos. If you own a logo and want it removed or corrected, open an issue.

## Tech stack

Next.js 16 · React 19 · Tailwind CSS v4 · pnpm

## Contributing

See the [contribution guidelines](CONTRIBUTING.md) for setup, repository structure, and how to add new icons.

## License

Rune Icons uses two licenses. See [LICENSE](LICENSE) for the full terms.

**The icons: [Apache License 2.0](LICENSE)**

The icon SVGs in every style (`public/normal`, `public/duotone`, `public/fill`, `public/pixelated`, `public/glass-icons`, `public/sprites`), `lib/icons`, and the packages in `packages/` are free for personal and commercial use. No attribution is required.

**Everything else: Apache License 2.0 + Attribution + Commons Clause**

The landing page, UI components, animations, editor, and the rest of the website code:

- **Use it anywhere**, including commercial and client work.
- **Credit it**: projects that ship any part of it must credit the Rune Icons Team with a visible link to [runeicons.com](https://runeicons.com), such as in a footer, an about page, a credits screen, or a README.
- **Don't resell it**: the landing page designs, components, and animations may not be sold, sublicensed, or redistributed, whether alone, in a bundle, or as a port.

**Brand logos: not ours**

The files in `public/brand-logos/` belong to their respective owners. Each keeps the license listed in `constants/brand-logos.ts` and is not part of either license above.

Copyright (c) 2026 Rune Icons Team.
