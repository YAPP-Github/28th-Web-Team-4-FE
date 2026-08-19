'use client';

import type { JSX } from 'react';

import { useAuthSession } from '@/features/auth/session';
import { useHeroHeaderToneStore } from '@/shared/lib/hero-header-tone';
import { cn } from '@/shared/ui/cn';

import { resolveHomeHeaderVisualState } from './resolve-home-header-visual-state';
import { SessionPageHeader } from './session-page-header';

// 홈 라우트(app/(home))에서만 쓰는 헤더. SessionPageHeader를 복제하지 않고
// 그대로 재사용하면서, 히어로 스크롤 진행률에 맞춰 배경/전경색만 얹는다.
// 다른 라우트는 여전히 SessionPageHeader를 직접 사용하므로 영향이 없다.
export function HomePageHeader(): JSX.Element {
  const { isAuthenticated } = useAuthSession();

  if (isAuthenticated) {
    return <SessionPageHeader />;
  }

  return <PublicHomePageHeader />;
}

function PublicHomePageHeader(): JSX.Element {
  const progress = useHeroHeaderToneStore((state) => state.progress);
  const theme = useHeroHeaderToneStore((state) => state.theme);

  const { appearance, backgroundClassName, shouldTransition } = resolveHomeHeaderVisualState(
    progress,
    theme,
  );

  return (
    <SessionPageHeader
      className={cn(
        'sticky top-0 z-50 border-transparent',
        shouldTransition
          ? 'motion-safe:transition-[background-color,color] motion-safe:duration-[250ms] motion-safe:ease-in-out motion-reduce:transition-none'
          : 'transition-none',
        backgroundClassName,
      )}
      appearance={appearance}
    />
  );
}
