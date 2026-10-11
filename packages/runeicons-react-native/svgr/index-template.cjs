const path = require('path');

const pascalCase = (slug) =>
  slug.split('-').filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');

module.exports = function indexTemplate(files) {
  const slugs = files
    .map((file) => path.basename(file.path, path.extname(file.path)))
    .sort((a, b) => a.localeCompare(b));

  const exports = slugs
    .map((slug) => `export { default as ${pascalCase(slug)} } from './${slug}';`)
    .join('\n');

  const union = slugs.map((slug) => `  | '${slug}'`).join('\n');

  return `${exports}

export type IconName =
${union};
`;
};
