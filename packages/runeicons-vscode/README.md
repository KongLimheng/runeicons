# RuneIcons for VS Code

VS Code extension for [RuneIcons](https://runeicons.com). It adds icon id autocomplete and hover previews in source files, and a command that inserts an icon as inline SVG at the cursor. The library has 350+ icons and 900+ variants in five styles: normal, duotone, fill, pixelated, and glass.

## Install

Once the extension is published, search for **RuneIcons** in the Extensions view (`Ctrl+Shift+X`, or `Cmd+Shift+X` on macOS) and select Install. Its identifier is `Nexvyn.runeicons-vscode`.

To install a local build, package a `.vsix` file and install it with the `code` CLI. This requires [pnpm](https://pnpm.io) and [Bun](https://bun.sh) on your PATH, because the packaging step runs the Bun-based build:

```sh
pnpm install
pnpm --filter runeicons-vscode build

cd packages/runeicons-vscode
pnpm dlx @vscode/vsce package --no-dependencies
code --install-extension runeicons-vscode-0.1.0.vsix
```

Reload the VS Code window after installing.

## Features

- **Autocomplete**: inside a string literal, type the start of an icon id or name. The completion list shows up to 100 matches with the icon name as detail and a preview of every available style.
- **Hover**: hover an exact icon id, such as `tools-house`, to see each available style rendered at 24px.
- **Insert Icon**: a command that searches all icons and inserts the chosen style as an inline `<svg>` element at the cursor.

## Usage

Autocomplete and hover work in these languages: JavaScript, JavaScript React, TypeScript, TypeScript React, HTML, Vue, Svelte, Astro, and JSON.

Start a string and type part of an icon id. Completion is triggered by `"`, `'`, and `-`:

```ts
const icon = "tools-ho";
```

Hover a complete id to see its previews.

### Insert Icon

1. Open a supported file and place the cursor where the icon should go. The command needs an active text editor.
2. Open the Command Palette (`Ctrl+Shift+P`, or `Cmd+Shift+P` on macOS) and run **RuneIcons: Insert Icon**.
3. Type to filter the list by name or id, then select an icon.
4. If the icon has more than one style, pick one from the **Pick a style** list. Icons with a single style are inserted directly.

The inserted markup is a standalone SVG with `width="24" height="24"` and the icon's own `viewBox`. For example, `tools-house` in the normal style starts with:

```html
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
```

The icon's paths follow inside the element. For the non-glass styles, black strokes and fills are replaced with `currentColor`, so the icon takes the text color of its surrounding element.

### Contributed commands

| Command ID         | Title in Command Palette | Behavior                                                  |
| :----------------- | :----------------------- | :-------------------------------------------------------- |
| `runeicons.insert` | RuneIcons: Insert Icon   | Pick an icon and style, then insert its SVG at the cursor |

The extension contributes no settings, snippets, or keybindings. It activates on `onStartupFinished`.

## Development

Requires [pnpm](https://pnpm.io) and [Bun](https://bun.sh). Run the commands from the repository root:

```sh
pnpm install
pnpm --filter runeicons-vscode build
pnpm --filter runeicons-vscode typecheck
pnpm --filter runeicons-vscode test
```

`scripts/build.ts` reads the SVG sources in the repository's `public/` directory and writes `src/icons.generated.ts`. That file is gitignored, so run the build before typechecking or testing from a fresh clone. The bundle step compiles `src/extension.ts` to `dist/extension.js` in CommonJS format, with `vscode` left external.

To try the extension in an Extension Development Host, open `packages/runeicons-vscode` in VS Code and add a launch configuration. The package does not include a `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Run RuneIcons extension",
      "type": "extensionHost",
      "request": "launch",
      "args": ["--extensionDevelopmentPath=${workspaceFolder}"]
    }
  ]
}
```

Run `pnpm --filter runeicons-vscode build` before pressing F5, so `dist/extension.js` exists.

Source files are in `src/`:

- `src/extension.ts`: activation, completion and hover providers, and the insert command.
- `src/icons.ts`: lookup, search, and SVG building helpers.
- `src/icons.generated.ts`: generated icon data (not committed).

## License

Licensed under the [Apache License 2.0](LICENSE). Icons come from the [runeicons](https://github.com/Runeicons/runeicons) repository.
