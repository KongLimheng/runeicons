import 'package:flutter/widgets.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'rune_brand_data.dart';

class RuneBrand extends StatelessWidget {
  const RuneBrand(this.brand, {super.key, this.size = 24, this.semanticLabel});

  final RuneBrandData brand;

  final double size;

  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return SvgPicture.asset(
      brand.assetPath,
      package: 'runeicons',
      width: size,
      height: size,
      semanticsLabel: semanticLabel ?? brand.name,
    );
  }
}
