'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight, Table2 } from 'lucide-react';

import { useAuthSession } from '@/features/auth/session';
import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';

export function HomeCtaGroup(): JSX.Element {
  const { isAuthenticated } = useAuthSession();
  const primaryHref = isAuthenticated ? '/recommend/onboarding/new' : '/login';
  const primaryLabel = isAuthenticated ? '맞춤 채널 추천 시작' : '무료로 시작하기';

  return (
    <Box className="gap-012 flex w-full flex-col sm:w-auto sm:flex-row">
      <Button
        frame="cta"
        tone="primary"
        nativeButton={false}
        render={<Link href={primaryHref} />}
        rightIcon={<ArrowRight aria-hidden className="size-016" />}
        className="px-024 h-12 w-full sm:w-auto"
      >
        {primaryLabel}
      </Button>
      <Button
        frame="button"
        tone="stroke"
        nativeButton={false}
        render={<Link href="/compare" />}
        leftIcon={<Table2 aria-hidden className="size-016" />}
        className="px-020 h-12 w-full sm:w-auto"
      >
        채널 비교하기
      </Button>
    </Box>
  );
}
