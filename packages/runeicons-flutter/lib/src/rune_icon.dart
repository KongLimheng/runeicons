import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'rune_icon_data.dart';

class RuneIcon extends StatelessWidget {
  const RuneIcon(
    this.icon, {
    super.key,
    this.style,
    this.size = 24,
    this.width,
    this.height,
    this.color,
    this.colorFilter,
    this.blendMode = BlendMode.srcIn,
    this.fit = BoxFit.contain,
    this.alignment = Alignment.center,
    this.matchTextDirection = false,
    this.semanticLabel,
    this.excludeFromSemantics = false,
  }) : assert(
          color == null || colorFilter == null,
          'color and colorFilter cannot both be provided',
        );

  final RuneIconData icon;

  final RuneIconStyle? style;

  final double? size;

  final double? width;

  final double? height;

  final Color? color;

  final ColorFilter? colorFilter;

  final BlendMode blendMode;

  final BoxFit fit;

  final AlignmentGeometry alignment;

  final bool matchTextDirection;

  final String? semanticLabel;

  final bool excludeFromSemantics;

  @override
  Widget build(BuildContext context) {
    final effectiveColorFilter = colorFilter ??
        (color == null ? null : ColorFilter.mode(color!, blendMode));

    return SvgPicture.asset(
      icon.assetPath(style),
      package: 'runeicons',
      width: width ?? size,
      height: height ?? size,
      colorFilter: effectiveColorFilter,
      fit: fit,
      alignment: alignment,
      matchTextDirection: matchTextDirection,
      semanticsLabel: semanticLabel,
      excludeFromSemantics: excludeFromSemantics,
    );
  }
}
