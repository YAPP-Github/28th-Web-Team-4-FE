'use client';

import type { JSX } from 'react';

import { interpolateHeroTone, useHeroHeaderToneStore } from '@/shared/lib/hero-header-tone';

import { SessionPageHeader } from './session-page-header';

// 홈 라우트(app/(home))에서만 쓰는 헤더. SessionPageHeader를 복제하지 않고
// 그대로 재사용하면서, 히어로 스크롤 진행률에 맞춰 배경/전경색만 얹는다.
// 다른 라우트는 여전히 SessionPageHeader를 직접 사용하므로 영향이 없다.
export function HomePageHeader(): JSX.Element {
  const progress = useHeroHeaderToneStore((state) => state.progress);
  const tone = interpolateHeroTone(progress);

  return (
    <SessionPageHeader
      className="sticky top-0 z-20 border-transparent"
      style={{ backgroundColor: tone.background, color: tone.foreground }}
    />
  );
}
