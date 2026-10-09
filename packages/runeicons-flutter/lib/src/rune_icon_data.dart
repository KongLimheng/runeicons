enum RuneIconStyle {
  normal,

  duotone,

  fill,

  pixelated,

  glass,
}

final class RuneIconData {
  const RuneIconData({
    required this.id,
    required this.name,
    required this.category,
    required this.tags,
    required this.defaultStyle,
    required this.assetPaths,
  });

  final String id;

  final String name;

  final String category;

  final List<String> tags;

  final RuneIconStyle defaultStyle;

  final Map<RuneIconStyle, String> assetPaths;

  Iterable<RuneIconStyle> get availableStyles => assetPaths.keys;

  bool supports(RuneIconStyle style) => assetPaths.containsKey(style);

  String assetPath([RuneIconStyle? style]) {
    final resolvedStyle = style ?? defaultStyle;
    final path = assetPaths[resolvedStyle];
    if (path == null) {
      throw ArgumentError.value(
        resolvedStyle,
        'style',
        '$name does not provide the ${resolvedStyle.name} style',
      );
    }
    return path;
  }

  @override
  String toString() => 'RuneIconData($id)';
}
