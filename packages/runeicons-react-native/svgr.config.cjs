module.exports = {
  native: true,
  typescript: true,
  jsxRuntime: 'automatic',
  outDir: 'src/icons',
  filenameCase: 'kebab',
  template: require('./svgr/template.cjs'),
  indexTemplate: require('./svgr/index-template.cjs'),

  replaceAttrValues: {
    '#010101': '{color}',
    '#020202': '{secondaryColor}',
    'rune-sw': '{strokeWidth}',
  },

  svgProps: {
    width: '{size}',
    height: '{size}',
    color: '{color}',
  },

  svgoConfig: {
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            cleanupIds: false,
            convertColors: false,
            cleanupNumericValues: false,
          },
        },
      },
      'removeXMLNS',
      { name: 'removeAttrs', params: { attrs: '(color-interpolation-filters)' } },
    ],
  },

  jsx: { babelConfig: { plugins: [require.resolve('./svgr/rn-filters.cjs')] } },
};
