'use client';

import type { JSX } from 'react';

import { useHeroHeaderToneStore } from '@/shared/lib/hero-header-tone';

import { SessionPageHeader } from './session-page-header';

// 홈 라우트(app/(home))에서만 쓰는 헤더. SessionPageHeader를 복제하지 않고
// 그대로 재사용하면서, 히어로 스크롤 진행률에 맞춰 배경/전경색만 얹는다.
// 다른 라우트는 여전히 SessionPageHeader를 직접 사용하므로 영향이 없다.
export function HomePageHeader(): JSX.Element {
  const progress = useHeroHeaderToneStore((state) => state.progress);
  const theme = useHeroHeaderToneStore((state) => state.theme);

  const isIntro = progress < 1;
  const isIntroOrange = isIntro && progress < 0.5;

  let background = '#FFFFFF';
  let isDarkText = true;

  if (theme === 'dark') {
    background = '#262626';
    isDarkText = false;
  } else if (theme === 'process-dark') {
    background = '#1D1D20';
    isDarkText = false;
  } else if (theme === 'orange') {
    background = '#FF6817';
    isDarkText = false;
  } else if (isIntro) {
    background = 'transparent';
    isDarkText = !isIntroOrange;
  }

  const isOrangeBackground = theme === 'orange' || isIntroOrange;

  return (
    <SessionPageHeader
      className={`sticky top-0 z-50 border-transparent ${
        isIntro
          ? 'transition-none'
          : 'transition-[background-color,color] duration-[250ms] ease-in-out'
      } ${
        isDarkText
          ? '[&_nav_a]:text-text-low [&_nav_a:hover]:text-text-highest'
          : '[&_.text-text-primary]:!text-white [&_nav_a]:!text-white [&_nav_a:hover]:!text-white/80 [&_svg]:!text-white'
      } ${
        isOrangeBackground
          ? '[&_a[href="/login"]]:!text-sys-primary-default [&_.text-text-primary]:!text-white [&_a[href="/login"]]:!bg-white [&_a[href="/login"]:hover]:!bg-white/90 [&_nav_a]:!text-white [&_svg]:!text-white'
          : ''
      }`}
      style={{ backgroundColor: background }}
    />
  );
}
