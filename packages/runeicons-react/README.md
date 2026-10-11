# runeicons-react

React components for [RuneIcons](https://runeicons.com): 350+ icons and 900+ variants across five styles (normal, duotone, fill, pixelated, and glass).

## Install

```sh
npm install runeicons-react
pnpm add runeicons-react
yarn add runeicons-react
bun add runeicons-react
```

Peer dependencies: `react` and `react-dom` version 19.

## Quick start

```tsx
import { RuneIcon } from "runeicons-react";

export function Toolbar() {
  return (
    <div style={{ color: "#1f2937" }}>
      <RuneIcon name="tools-house" />

      <RuneIcon name="tools-house" type="fill" size={32} />

      <RuneIcon name="glass-back-2" type="glass" size={48} />
    </div>
  );
}
```

Icon ids come from the [icon browser](https://runeicons.com/icons).

## Props

| Prop   | Type                                                        | Default    | Description                                                          |
| :----- | :---------------------------------------------------------- | :--------- | :------------------------------------------------------------------- |
| `name` | `string`                                                    | (required) | Icon id, for example `"tools-house"`. An unknown id renders nothing. |
| `type` | `"normal" \| "duotone" \| "fill" \| "pixelated" \| "glass"` | `"normal"` | Style. Renders nothing if the icon has no variant in that style.     |
| `size` | `number`                                                    | `24`       | Width and height in pixels.                                          |

`RuneIcon` only accepts these three props. It does not forward `className`, `style` or other attributes to the `svg`. Wrap the icon in an element to style it.

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

```tsx
import { buildSvg, getIconById, searchIcons } from "runeicons-react";

const firstTen = searchIcons("arrow", 10);
const house = getIconById("tools-house");
const svg = house ? buildSvg(house, "fill", 20) : null;
```

Notes on these helpers:

- `searchIcons` matches the query against the icon id and name only. It has no `type` or `category` filter. Use the `runeicons` core package if you need those.
- `buildSvg` takes an `IconEntry`, not an id string, and returns an SVG string without `className` or `title` options.

## Framework notes

- `RuneIcon` is a plain function component with no hooks. It renders correctly on the server (the test suite checks `renderToString`).
- It returns `null` for an unknown `name` or a missing `type` variant.

## Brand logos

The package also ships 1,100+ third-party brand logos. They are in a separate entry point, so importing the icons does not load the logo data:

```tsx
import { BrandLogo, getBrand, searchBrands } from "runeicons-react/brands";

export function Footer() {
  return <BrandLogo name="openai" size={20} title="OpenAI" />;
}

const github = getBrand("github");
const matches = searchBrands("git", { tier: "permissive", limit: 10 });
```

`BrandLogo` takes `name` (the brand slug), `size` (default `24`) and an optional `title`. With a `title` the svg gets `role="img"` and an `aria-label`. Without one it is `aria-hidden`. An unknown name renders nothing.

`searchBrands(query, { group?, tier?, limit? })` matches the name or slug and lists exact matches first. `listBrandGroups()` returns the group names. `BRANDS`, `BrandEntry` and `BrandTier` are exported too.

Brand logos are other companies' trademarks, shown for identification only. They are not covered by Rune Icons' Apache 2.0 license and each keeps its own license, listed in the `license` and `tier` fields. Follow each brand's guidelines (the `guidelines` field links to them), and do not alter a logo unless its guidelines allow it.

## Development

From the repository root (requires [pnpm](https://pnpm.io) and [Bun](https://bun.sh)):

```sh
pnpm install
pnpm --filter runeicons-react test
pnpm --filter runeicons-react build
```

The generated data file `src/icons.generated.ts` is produced from the SVG files in the repository's `public/` folder by `scripts/build.ts`. It is git-ignored, so run `test` or `build` before using the source.

## Credits

Made by [Nexvyn](https://github.com/Nexvyn) and the [Rune Icons contributors](https://github.com/Runeicons/runeicons/graphs/contributors).

## License

Licensed under the [Apache License 2.0](LICENSE). The icons are free for personal and commercial use, and no attribution is required (see the repository README).
