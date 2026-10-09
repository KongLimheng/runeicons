const PROXY = {
  filter: { via: "symbol", component: "Symbol", real: "Filter" },
  feGaussianBlur: { via: "line", component: "Line", real: "FeGaussianBlur" },
  feFlood: { via: "polyline", component: "Polyline", real: "FeFlood" },
  feBlend: { via: "tspan", component: "TSpan", real: "FeBlend" },
};

const VIA_TO_REAL = new Map(Object.values(PROXY).map((p) => [p.component, p.real]));
const RESERVED = new Set(Object.values(PROXY).map((p) => p.via));

module.exports = function rnFilters({ types: t }) {
  const renameTo = (path, name) => {
    path.get("openingElement").get("name").replaceWith(t.jsxIdentifier(name));
    if (path.has("closingElement")) {
      path.get("closingElement").get("name").replaceWith(t.jsxIdentifier(name));
    }
  };

  return {
    name: "rune-rn-filters",
    visitor: {
      Program: {
        enter(path) {
          path.traverse({
            JSXElement(p) {
              const namePath = p.get("openingElement").get("name");
              if (!namePath.isJSXIdentifier()) return;
              const { name } = namePath.node;
              if (RESERVED.has(name)) {
                throw new Error(
                  `rune-rn-filters: <${name}> is reserved as a proxy for an SVG filter element. ` +
                    `An icon now uses it for real, pick a different proxy element.`,
                );
              }
              const proxy = PROXY[name];
              if (proxy) renameTo(p, proxy.via);
            },
          });
        },
        exit(path) {
          const used = new Set();
          path.traverse({
            JSXIdentifier(p) {
              const real = VIA_TO_REAL.get(p.node.name);
              if (!real || p.parentPath.isJSXAttribute()) return;
              p.replaceWith(t.jsxIdentifier(real));
              used.add(real);
            },
            ImportDeclaration(p) {
              if (p.node.source.value !== "react-native-svg") return;
              for (const spec of p.node.specifiers) {
                if (!t.isImportSpecifier(spec)) continue;
                const real = VIA_TO_REAL.get(spec.imported.name);
                if (real) {
                  spec.imported = t.identifier(real);
                  spec.local = t.identifier(real);
                }
              }
            },
          });
        },
      },
    },
  };
};
