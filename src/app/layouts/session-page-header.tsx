'use client';

import type { CSSProperties, JSX } from 'react';

import { useAuthSession } from '@/features/auth/session';
import { PageHeader } from '@/features/navigation/page-header';

type SessionPageHeaderProps = {
  className?: string;
  style?: CSSProperties;
};

// className/style은 옵션이며 전달하지 않으면 기존 라우트와 동일하게 렌더링된다.
// 홈 라우트의 스크롤 연동 헤더 톤(HomePageHeader)만 이 값을 사용한다.
export function SessionPageHeader({ className, style }: SessionPageHeaderProps = {}): JSX.Element {
  const { isAuthenticated } = useAuthSession();

  return isAuthenticated ? (
    <PageHeader isLogin className={className} style={style} />
  ) : (
    <PageHeader className={className} style={style} />
  );
}
