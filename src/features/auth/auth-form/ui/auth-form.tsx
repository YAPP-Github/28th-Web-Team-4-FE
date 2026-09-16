import type { ComponentProps, JSX, ReactNode } from 'react';

import { cn } from '@/shared/ui/cn';
import { Stack } from '@/shared/ui/layout/stack';
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
    <VStack
      as="section"
      aria-labelledby={titleId}
      className="bg-surface-lowest shadow-drop-shadow-01 p-032 sm:p-072 w-full max-w-[584px] rounded-[var(--radius-l)]"
    >
      <VStack className="gap-036 w-full max-w-[440px]">
        <AuthFormHeader
          graphic={<BrandSymbol type="symbol-login" alt="" />}
          title={title}
          titleId={titleId}
        />

        <Stack as="form" className={cn('gap-036 w-full', className)} {...formProps}>
          {children}
          {actions}
        </Stack>
      </VStack>
    </VStack>
  );
}
