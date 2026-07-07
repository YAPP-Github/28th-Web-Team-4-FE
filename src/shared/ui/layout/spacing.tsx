import { type JSX, type ElementType, type PropsWithChildren } from 'react';

import { type BoxProps, Box } from './box';

export const Spacing: <C extends ElementType = 'div'>(
  props: PropsWithChildren<BoxProps<C>>,
) => JSX.Element = <C extends ElementType = 'div'>(props: PropsWithChildren<BoxProps<C>>) => {
  return <Box {...props} />;
};
