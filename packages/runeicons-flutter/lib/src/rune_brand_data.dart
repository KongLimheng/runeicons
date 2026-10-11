enum RuneBrandTier { permissive, attribution, shareAlike, trademarkOnly }

final class RuneBrandData {
  const RuneBrandData({
    required this.slug,
    required this.name,
    required this.group,
    required this.site,
    required this.guidelines,
    required this.license,
    required this.tier,
    required this.assetPath,
  });

  final String slug;

  final String name;

  final String group;

  final String? site;

  final String? guidelines;

  final String license;

  final RuneBrandTier tier;

  final String assetPath;

  @override
  String toString() => 'RuneBrandData($slug)';
}
