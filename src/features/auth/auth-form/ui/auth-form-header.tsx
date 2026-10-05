import type { ComponentProps, JSX, ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';
import { Center } from '@/shared/ui/layout/center';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Text } from '@/shared/ui/text';

type AuthFormHeaderProps = ComponentProps<'header'> & {
  graphic: ReactNode;
  title: ReactNode;
  titleId?: string;
};

export function AuthFormHeader({
  className,
  graphic,
  title,
  titleId,
  ...props
}: AuthFormHeaderProps): JSX.Element {
  return (
    <VStack as="header" className={cn('gap-012 w-full text-center', className)} {...props}>
      <Center as="span" className="size-[44px]" aria-hidden>
        {graphic}
      </Center>
      <Text
        as="h1"
        id={titleId}
        className="text-text-high text-22 leading-032 tracking-spacing-sm font-bold"
      >
        {title}
      </Text>
    </VStack>
  );
}
