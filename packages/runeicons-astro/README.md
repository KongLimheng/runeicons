# runeicons-astro

Astro components for [RuneIcons](https://runeicons.com): 350+ icons and 900+ variants across five styles (normal, duotone, fill, pixelated, and glass).

## Install

```sh
npm install runeicons-astro
pnpm add runeicons-astro
yarn add runeicons-astro
bun add runeicons-astro
```

Peer dependency: `astro` version 5 or later, below 8.

## Quick start

```astro
---
import { RuneIcon } from "runeicons-astro";
---

<div style="color: #1f2937">
  <RuneIcon name="tools-house" />

  <RuneIcon name="tools-house" type="fill" size={32} />

  <RuneIcon name="glass-back-2" type="glass" size={48} />
</div>
```

Icon ids come from the [icon browser](https://runeicons.com/icons). The component can also be imported directly from `runeicons-astro/RuneIcon.astro`.

## Props

| Prop   | Type                                                        | Default    | Description                                                          |
| :----- | :---------------------------------------------------------- | :--------- | :------------------------------------------------------------------- |
| `name` | `string`                                                    | (required) | Icon id, for example `"tools-house"`. An unknown id renders nothing. |
| `type` | `"normal" \| "duotone" \| "fill" \| "pixelated" \| "glass"` | `"normal"` | Style. Renders nothing if the icon has no variant in that style.     |
| `size` | `number`                                                    | `24`       | Width and height in pixels.                                          |

`RuneIcon` only accepts these three props. It does not forward `class`, `style` or other attributes to the `svg`. Wrap the icon in an element to style it.

## Styles

- **normal**: outline icons drawn with stroked paths. The colour is `currentColor`.
- **duotone**: two-tone icons with fixed greys in the markup.
- **fill**: solid, filled shapes with fixed colours.
- **pixelated**: pixel-art icons built from rectangles filled with `currentColor`.
- **glass**: shapes with gradients and masks in fixed colours.

`normal` and `pixelated` follow the surrounding `color`. `duotone`, `fill` and `glass` keep their own colours and ignore `color`.

All five styles use the same icon ids, so changing `type` does not change the name you pass. Ids inside glass icons are prefixed with the icon id, so several glass icons can share a page.

## Helpers

The package also exports helpers for rendering icons yourself:

```ts
getIconById(id: string): IconEntry | undefined
availableTypes(icon: IconEntry): IconType[]
searchIcons(query: string, limit?: number): IconEntry[]
buildSvg(icon: IconEntry, type: IconType, size?: number): string | null
```

`ICON_TYPES`, `IconType` and `IconEntry` are exported too. `IconType` is the union `"normal" | "duotone" | "fill" | "pixelated" | "glass"`.

```ts
import { buildSvg, getIconById, searchIcons } from "runeicons-astro";

const firstTen = searchIcons("arrow", 10);
const house = getIconById("tools-house");
const svg = house ? buildSvg(house, "fill", 20) : null;
```

Notes on these helpers:

- `searchIcons` matches the query against the icon id and name only. It has no `type` or `category` filter. Use the `runeicons` core package if you need those.
- `buildSvg` takes an `IconEntry`, not an id string, and returns an SVG string without `className` or `title` options.

## Framework notes

- The component renders on the server. For static pages that happens at build time, and for server-rendered pages it happens per request. The output is plain SVG in the HTML, and the component ships no client-side JavaScript.
- Each `RuneIcon` is a `.astro` component. It reads `name`, `type` and `size` from `Astro.props`, so it needs Astro 5 or later.

## Development

From the repository root (requires [pnpm](https://pnpm.io) and [Bun](https://bun.sh)):

```sh
pnpm install
pnpm --filter runeicons-astro test
pnpm --filter runeicons-astro build
```

The test suite compiles `RuneIcon.astro` with `@astrojs/compiler` and checks the output. It does not render a full Astro page.

The generated data file `src/icons.generated.ts` is produced from the SVG files in the repository's `public/` folder by `scripts/build.ts`. It is git-ignored, so run `test` or `build` before using the source.

## License

Licensed under the [Apache License 2.0](LICENSE). The icons are free for personal and commercial use, and no attribution is required (see the repository README).
