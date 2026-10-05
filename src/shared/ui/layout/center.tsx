import type { JSX, ElementType, PropsWithChildren } from 'react';

import { cn } from '@/shared/ui/cn';

import { type BoxProps, Box } from './box';

export const Center: <C extends ElementType = 'div'>(
  props: PropsWithChildren<BoxProps<C>>,
) => JSX.Element = <C extends ElementType = 'div'>({
  className,
  ...rest
}: PropsWithChildren<BoxProps<C>>) => {
  const typesRest = rest as BoxProps<C>;

  return <Box className={cn(className, 'flex items-center justify-center')} {...typesRest} />;
};
