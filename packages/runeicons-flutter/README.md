# runeicons

Rune Icons for Flutter. The package bundles 357 icons in five styles, 917
variants in total. Each icon is an SVG, drawn with
[flutter_svg](https://pub.dev/packages/flutter_svg).

Website: [runeicons.com](https://runeicons.com)

## Requirements

- Dart `^3.6.0`
- Flutter `>=3.27.0`

## Install

```sh
flutter pub add runeicons
```

This also adds `flutter_svg`, which the package depends on.

The SVG files are declared in the package's own `pubspec.yaml`, so you do not
need to add any asset entries to your app's `pubspec.yaml`.

## Quick start

A complete app that shows one icon in each style:

```dart
import 'package:flutter/material.dart';
import 'package:runeicons/runeicons.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              RuneIcon(RuneIcons.heart, size: 32, color: Colors.red),
              SizedBox(width: 16),
              RuneIcon(RuneIcons.heart, style: RuneIconStyle.duotone, size: 32),
              SizedBox(width: 16),
              RuneIcon(RuneIcons.heart, style: RuneIconStyle.fill, size: 32),
              SizedBox(width: 16),
              RuneIcon(RuneIcons.heart, style: RuneIconStyle.pixelated, size: 32),
              SizedBox(width: 16),
              RuneIcon(RuneIcons.glassHeart22, size: 32),
            ],
          ),
        ),
      ),
    );
  }
}
```

Duotone and glass icons keep their own colours, so leave `color` unset for
them. Setting `color` on a multi-colour icon paints every shape with that one
colour (see [Colour](#colour)).

## Styles

Every icon has up to five styles, listed in `RuneIconStyle`:

| Style     | Value                     | Icons | Description                     |
| :-------- | :------------------------ | ----: | :------------------------------ |
| Normal    | `RuneIconStyle.normal`    |   220 | Outline icons on a 24-unit grid |
| Duotone   | `RuneIconStyle.duotone`   |   218 | Two-tone outline icons          |
| Fill      | `RuneIconStyle.fill`      |   129 | Solid icons                     |
| Pixelated | `RuneIconStyle.pixelated` |   215 | Pixel-art icons                 |
| Glass     | `RuneIconStyle.glass`     |   135 | Glass-look icons with gradients |

Each icon has a `defaultStyle`, which is used when you omit `style`. Most core
icons default to `normal`. Two icons have no normal style and default to
`duotone`. Glass entries default to `glass`.

Not every icon has every style. Check before you request one:

```dart
final icon = RuneIcons.byId['identity-user-plus'];

if (icon != null && icon.supports(RuneIconStyle.fill)) {
  return RuneIcon(icon, style: RuneIconStyle.fill);
}
```

Requesting a style the icon does not have throws an `ArgumentError`. This makes
a missing variant fail loudly instead of silently showing a different style.

## The RuneIcon widget

`RuneIcon` is a `StatelessWidget`. Its constructor is:

```dart
const RuneIcon(
  RuneIconData icon, {
  Key? key,
  RuneIconStyle? style,
  double? size = 24,
  double? width,
  double? height,
  Color? color,
  ColorFilter? colorFilter,
  BlendMode blendMode = BlendMode.srcIn,
  BoxFit fit = BoxFit.contain,
  AlignmentGeometry alignment = Alignment.center,
  bool matchTextDirection = false,
  String? semanticLabel,
  bool excludeFromSemantics = false,
})
```

| Parameter              | Type                | Default              | Description                                                                                  |
| :--------------------- | :------------------ | :------------------- | :------------------------------------------------------------------------------------------- |
| `icon`                 | `RuneIconData`      | required, positional | The icon to draw, such as `RuneIcons.heart`.                                                 |
| `style`                | `RuneIconStyle?`    | `icon.defaultStyle`  | The variant to draw. Throws `ArgumentError` if the icon does not have it.                    |
| `size`                 | `double?`           | `24`                 | Width and height. `width` and `height` override it for that axis.                            |
| `width`                | `double?`           | `null`               | Overrides `size` for the width.                                                              |
| `height`               | `double?`           | `null`               | Overrides `size` for the height.                                                             |
| `color`                | `Color?`            | `null`               | One colour for every shape, applied with `blendMode`. Cannot be combined with `colorFilter`. |
| `colorFilter`          | `ColorFilter?`      | `null`               | An advanced colour filter. Cannot be combined with `color`.                                  |
| `blendMode`            | `BlendMode`         | `BlendMode.srcIn`    | The blend mode used to apply `color`.                                                        |
| `fit`                  | `BoxFit`            | `BoxFit.contain`     | How the SVG is fitted inside its bounds.                                                     |
| `alignment`            | `AlignmentGeometry` | `Alignment.center`   | How the SVG is aligned inside its bounds.                                                    |
| `matchTextDirection`   | `bool`              | `false`              | Mirrors the icon in right-to-left text directions.                                           |
| `semanticLabel`        | `String?`           | `null`               | Description for accessibility tools.                                                         |
| `excludeFromSemantics` | `bool`              | `false`              | Hides the icon from the accessibility tree.                                                  |

## Size

```dart
const RuneIcon(RuneIcons.arrowLeft, size: 20);

const RuneIcon(RuneIcons.arrowLeft, width: 48, height: 24, fit: BoxFit.fill);
```

`size` sets both dimensions. Set `width` or `height` to override one axis.

## Colour

`color` paints every shape with one colour, using `blendMode` (default
`BlendMode.srcIn`). This replaces the icon's own colours, so use it for
single-colour icons (normal, fill and pixelated) and leave it unset for
duotone and glass.

```dart
const RuneIcon(RuneIcons.arrowLeft, color: Colors.indigo);
```

Use `colorFilter` for a custom `ColorFilter`. Do not pass both `color` and
`colorFilter`; the constructor asserts against it.

## Accessibility

Pass `semanticLabel` to describe what the icon means. Pass
`excludeFromSemantics: true` for decorative icons that sit next to a text label.

```dart
const RuneIcon(RuneIcons.arrowLeft, semanticLabel: 'Back');

const RuneIcon(RuneIcons.search, excludeFromSemantics: true);
```

## Browsing the catalog

`RuneIcons` is an abstract final class of constants. Every icon is a
`RuneIconData` field, and the class also provides two collections:

| Member           | Type                        | Description                                                  |
| :--------------- | :-------------------------- | :----------------------------------------------------------- |
| `RuneIcons.all`  | `List<RuneIconData>`        | Every icon, in catalog order.                                |
| `RuneIcons.byId` | `Map<String, RuneIconData>` | Icons keyed by their stable ID, such as `arrows-arrow-left`. |

`RuneIconData` has these members:

| Member               | Type                      | Description                                                       |
| :------------------- | :------------------------ | :---------------------------------------------------------------- |
| `id`                 | `String`                  | Stable catalog ID, shared with the website.                       |
| `name`               | `String`                  | Human-readable name, such as `Arrow Left`.                        |
| `category`           | `String`                  | Category, such as `navigation` or `commerce`.                     |
| `tags`               | `List<String>`            | Search terms.                                                     |
| `defaultStyle`       | `RuneIconStyle`           | Style used when `style` is omitted.                               |
| `availableStyles`    | `Iterable<RuneIconStyle>` | Styles this icon has.                                             |
| `supports(style)`    | `bool`                    | Whether the icon has the given style.                             |
| `assetPath([style])` | `String`                  | Package asset path for a style. Throws `ArgumentError` if absent. |

To find icons by category:

```dart
final navigation = RuneIcons.all.where((icon) => icon.category == 'navigation');
```

### Naming

Catalog IDs follow the pattern `<folder>-<name>` for core icons, such as
`arrows-arrow-left`, and `glass-<name>` for glass icons, such as
`glass-heart-2-2`. The Dart field name is the lower camel case form of the
file name without its folder, so `arrows-arrow-left` is `RuneIcons.arrowLeft`.
Glass fields start with `glass`, so `glass-heart-2-2` is
`RuneIcons.glassHeart22`.

Use `RuneIcons.byId` when the ID comes from data at runtime. Use the named
field when the icon is known at compile time, since that is checked by the
compiler.

## Glass icons

Glass icons are drawn with gradients and SVG filters. `flutter_svg` renders
them, so their final appearance depends on the SVG features that `flutter_svg`
supports. The repository tests check that every glass icon renders without
error; they do not compare the output pixel by pixel.

## Regenerating the catalog

The checked-in `assets/` directory and `lib/src/rune_icons.g.dart` are
generated from the repository's `public/` directory and its
`public/glass-icons/` subfolder. Run the generator from the package directory:

```sh
cd packages/runeicons-flutter
dart run tool/generate.dart
```

The generator deletes and rewrites `assets/`, rewrites
`lib/src/rune_icons.g.dart`, formats it with `dart format`, and prints the
count of icons per style. Run it whenever the core icon set changes. It needs
the Dart SDK and a checkout that includes the repository's `public/` directory.

## Tests

Run the tests from the package directory:

```sh
flutter pub get
flutter test
```

The tests check the total icon count and the count for each style, the ID
lookup, the rejection of unavailable styles, that every catalog SVG is present
in the bundle, and that a representative icon in each style renders with the
given size and semantic label.

## Example app

`example/` is a Flutter app that shows one icon in each style. It depends on
the package through a path dependency, so it always uses the local source.

```sh
cd example
flutter pub get
flutter run -d chrome
```

## License

Licensed under the [Apache License 2.0](LICENSE).
