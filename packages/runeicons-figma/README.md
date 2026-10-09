# RuneIcons for Figma

Figma plugin for [RuneIcons](https://runeicons.com). Search the icon library and insert an icon into the current page as vector layers. The library has 350+ icons and 900+ variants in five styles: normal, duotone, fill, pixelated, and glass.

## Install

Once the plugin is listed, install **RuneIcons** from the Figma Community plugin page.

To load a local build, for development or before the listing is live:

1. Build the plugin from the repository root. This requires [pnpm](https://pnpm.io) and [Bun](https://bun.sh):

   ```sh
   pnpm install
   pnpm --filter runeicons-figma build
   ```

   The build writes `dist/code.js` and `dist/ui.html`, which the manifest points to.

2. In the Figma desktop app, open the main menu and choose **Plugins > Development > Import plugin from manifest...**.
3. Select `packages/runeicons-figma/manifest.json`.

After importing, run the plugin from **Plugins > Development > RuneIcons**.

## Usage

The plugin window has three controls:

- **Search** box: filters icons by name or id, case-insensitively. Matching is a substring match on the id or the display name, so `arrow` and `arrows-arrow-down` both work. With an empty search, the first 60 icons are shown.
- **Style** dropdown: `normal` (default), `duotone`, `fill`, `pixelated`, or `glass`. Each icon card uses the selected style if the icon has it. Otherwise the card falls back to the first style the icon has. Hover a card to see its id and the style it will insert.
- **Icon cards**: a grid of up to 60 results. Click a card to insert it.

Clicking a card creates an SVG node with `figma.createNodeFromSvg`, appends it to the current page, names it `<Name> <style>` (for example `Arrow Down Left normal`), and scrolls the viewport to it. The plugin does not modify existing layers. It needs no network access: the icon data ships inside the plugin bundle, and the manifest sets `networkAccess` to `disallow`.

## Development

Requires [pnpm](https://pnpm.io) and [Bun](https://bun.sh). Run the commands from the repository root:

```sh
pnpm install
pnpm --filter runeicons-figma build
pnpm --filter runeicons-figma typecheck
pnpm --filter runeicons-figma test
```

`scripts/build.ts` reads the SVG sources in the repository's `public/` directory and writes `src/icons.generated.ts`. That file is gitignored, so run the build first in a fresh clone. The script bundles two targets:

- `src/code.ts` runs in Figma's sandbox and creates the nodes. It is bundled to `dist/code.js`.
- `src/ui.ts` runs in the plugin window. It is bundled as an IIFE and inlined into `dist/ui.html` with the stylesheet.

Figma does not reload plugins when files change. After each change, run the build again and re-open the plugin from **Plugins > Development**.

The `id` field in `manifest.json` is a placeholder. Local import works with it; a published plugin needs the id that Figma assigns.

Source files are in `src/`:

- `src/code.ts`: plugin main thread, which handles insert messages.
- `src/ui.ts`: search, style selection, and rendering of icon cards.
- `src/icons.ts`: lookup, search, and SVG building helpers.
- `src/icons.generated.ts`: generated icon data (not committed).

## License

Licensed under the [Apache License 2.0](LICENSE). Icons come from the [runeicons](https://github.com/Runeicons/runeicons) repository.
