'use client';

import type { JSX } from 'react';
import Link from 'next/link';

import { Button } from '@/shared/ui/button';

import type { PageHeaderAppearance } from './page-header-appearance';

export type HeaderLoginButtonProps = {
  appearance?: PageHeaderAppearance;
};

export function HeaderLoginButton({ appearance = 'default' }: HeaderLoginButtonProps): JSX.Element {
  return (
    <Button
      frame="button"
      tone="primary"
      size="s"
      nativeButton={false}
      render={<Link href="/login" />}
      className={
        appearance === 'brand'
          ? 'text-sys-primary-default bg-white hover:not-data-disabled:bg-white/90 hover:not-data-disabled:opacity-100 focus-visible:not-data-disabled:bg-white/90 focus-visible:not-data-disabled:opacity-100 active:not-data-disabled:bg-white/80'
          : undefined
      }
    >
      시작하기
    </Button>
  );
}
