import type { ElementType, JSX, PropsWithChildren } from 'react';
import { type VariantProps, cva } from 'class-variance-authority';

import { keys } from '@/shared/lib/object';
import { Box, type BoxProps } from '@/shared/ui/layout/box';
import { cn } from '@/shared/ui/cn';

const VARIANT_CLASS_MAP = {
  'display-xl': 'typo-display-xl',
  'display-lg': 'typo-display-lg',
  'heading-xl': 'typo-heading-xl',
  'heading-xxl': 'typo-heading-xxl',
  'heading-lg': 'typo-heading-lg',
  'heading-md': 'typo-heading-md',
  'heading-sm': 'typo-heading-sm',
  'subtitle-xl': 'typo-subtitle-xl',
  'subtitle-lg': 'typo-subtitle-lg',
  'subtitle-md': 'typo-subtitle-md',
  'subtitle-sm': 'typo-subtitle-sm',
  'subtitle-xs': 'typo-subtitle-xs',
  'subtitle-xxs': 'typo-subtitle-xxs',
  'body-xl': 'typo-body-xl',
  'body-lg': 'typo-body-lg',
  'body-md': 'typo-body-md',
  'body-sm': 'typo-body-sm',
  'body-xs': 'typo-body-xs',
  'caption-lg': 'typo-caption-lg',
  'caption-md': 'typo-caption-md',
  'caption-sm': 'typo-caption-sm',
} as const;

const textVariants = cva('', {
  variants: {
    variant: VARIANT_CLASS_MAP,
  },
});

export type TextVariant = keyof typeof VARIANT_CLASS_MAP;

export const TEXT_VARIANTS = keys(VARIANT_CLASS_MAP);

export type TextProps<C extends ElementType = 'span'> = BoxProps<C> &
  VariantProps<typeof textVariants>;

export const Text: <C extends ElementType = 'span'>(
  props: PropsWithChildren<TextProps<C>>,
) => JSX.Element = <C extends ElementType = 'span'>({
  as,
  className,
  variant,
  ...rest
}: PropsWithChildren<TextProps<C>>) => {
  const typesRest = rest as BoxProps<C>;

  return (
    <Box
      as={(as ?? 'span') as C}
      className={cn(textVariants({ variant }), className)}
      {...typesRest}
    />
  );
};
