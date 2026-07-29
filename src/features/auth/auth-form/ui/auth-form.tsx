import type { ComponentProps, JSX, ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';
import { VStack } from '@/shared/ui/layout/v-stack';
import { BrandSymbol } from '@/shared/ui/symbol';

import { AuthFormHeader } from './auth-form-header';

export type AuthFormProps = Omit<ComponentProps<'form'>, 'children' | 'title'> & {
  actions: ReactNode;
  children: ReactNode;
  title: string;
  titleId: string;
};

export function AuthForm({
  actions,
  children,
  className,
  title,
  titleId,
  ...formProps
}: AuthFormProps): JSX.Element {
  return (
    <section
      aria-labelledby={titleId}
      className="bg-surface-lowest shadow-drop-shadow-01 p-032 sm:p-072 flex w-full max-w-[584px] flex-col items-center rounded-[var(--radius-l)]"
    >
      <VStack className="gap-036 w-full max-w-[440px]">
        <AuthFormHeader
          graphic={<BrandSymbol className="h-[29px] w-6" alt="" />}
          title={title}
          titleId={titleId}
        />

        <VStack as="form" className={cn('gap-036 w-full items-stretch', className)} {...formProps}>
          {children}
          {actions}
        </VStack>
      </VStack>
    </section>
  );
}
