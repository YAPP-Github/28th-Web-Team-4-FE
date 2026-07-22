import type { ComponentProps, JSX, ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';

export type FormPanelHeaderProps = ComponentProps<'header'> & {
  graphic: ReactNode;
  title: ReactNode;
  titleId?: string;
};

export function FormPanelHeader({
  className,
  graphic,
  title,
  titleId,
  ...props
}: FormPanelHeaderProps): JSX.Element {
  return (
    <header
      className={cn('gap-012 flex w-full flex-col items-center text-center', className)}
      {...props}
    >
      <span className="flex size-[44px] items-center justify-center" aria-hidden>
        {graphic}
      </span>
      <Text
        as="h1"
        id={titleId}
        className="text-text-high text-22 leading-032 tracking-spacing-sm font-bold"
      >
        {title}
      </Text>
    </header>
  );
}
