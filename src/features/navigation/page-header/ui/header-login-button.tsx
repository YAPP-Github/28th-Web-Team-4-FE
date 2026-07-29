'use client';

import type { JSX } from 'react';
import Link from 'next/link';

import { Button } from '@/shared/ui/button';

export function HeaderLoginButton(): JSX.Element {
  return (
    <Button
      frame="button"
      tone="primary"
      size="s"
      nativeButton={false}
      render={<Link href="/login" />}
    >
      시작하기
    </Button>
  );
}
