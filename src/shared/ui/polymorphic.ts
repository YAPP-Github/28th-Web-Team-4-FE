import type { ComponentProps, ElementType } from 'react';

type AsProp<C extends ElementType> = {
  as?: C;
};

type KeyWithAs<C extends ElementType, Props> = keyof (AsProp<C> & Props);

export type PolymorphicComponentProps<C extends ElementType, Props = object> = (Props & AsProp<C>) &
  Omit<ComponentProps<C>, KeyWithAs<C, Props>>;
