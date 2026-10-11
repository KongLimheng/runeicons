module.exports = function template(variables, { tpl }) {
  const imports = variables.imports.filter((node) => node.importKind !== 'type');

  const componentName = variables.componentName.replace(/^Svg/, '');

  return tpl`
${imports}
import type { RuneIconProps } from '../types';

const ${componentName} = ({
  size = 24,
  color = 'currentColor',
  secondaryColor = '#DDDDDD',
  strokeWidth = 2,
  ...props
}: RuneIconProps) => (
  ${variables.jsx}
);

export default ${componentName};
`;
};
