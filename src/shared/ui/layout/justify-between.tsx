import type { JSX, ElementType, PropsWithChildren } from 'react';

import { type BoxProps, Box } from './box';

export const JustifyBetween: <C extends ElementType = 'div'>(
  props: PropsWithChildren<BoxProps<C>>,
) => JSX.Element = <C extends ElementType = 'div'>({
  as,
  className,
  ...rest
}: PropsWithChildren<BoxProps<C>>) => {
  const typesRest = rest as BoxProps<C>;

  return <Box className={`flex justify-between ${className}`} as={as} {...typesRest} />;
};
