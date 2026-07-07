import type { JSX, PropsWithChildren, ElementType } from 'react';

import type { PolymorphicComponentProps } from '@/shared/ui/polymorphic';

export type BoxProps<C extends ElementType> = PolymorphicComponentProps<C>;

export const Box: <C extends ElementType = 'div'>(
  props: PropsWithChildren<BoxProps<C>>,
) => JSX.Element = <C extends ElementType = 'div'>({
  as,
  ...restProps
}: PropsWithChildren<BoxProps<C>>) => {
  const Component = as ?? 'div';

  return <Component {...restProps} />;
};
