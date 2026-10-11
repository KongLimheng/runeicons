import type { ReactElement } from 'react';
import type { SvgProps } from 'react-native-svg';

export type RuneIconStyle =
  'normal' | 'duotone' | 'fill' | 'pixelated' | 'glass';

export interface RuneIconProps extends Omit<
  SvgProps,
  'width' | 'height' | 'color'
> {
  size?: number | string;

  color?: string;

  secondaryColor?: string;

  strokeWidth?: number | string;
}

export type RuneIconComponent = (props: RuneIconProps) => ReactElement | null;

export interface RuneIconMeta {
  id: string;
  name: string;
  category: string;
  tags: string[];
  styles: Partial<Record<RuneIconStyle, string>>;
}
