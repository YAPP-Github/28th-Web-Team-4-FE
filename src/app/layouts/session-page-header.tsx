'use client';

import type { CSSProperties, JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthSession, useLogout } from '@/features/auth/session';
import { PageHeader } from '@/features/navigation/page-header';
import { useMyProfile } from '@/pages/mypage/api/use-my-profile';

type SessionPageHeaderProps = {
  className?: string;
  style?: CSSProperties;
};

// className/style은 옵션이며 전달하지 않으면 기존 라우트와 동일하게 렌더링된다.
// 홈 라우트의 스크롤 연동 헤더 톤(HomePageHeader)만 이 값을 사용한다.
export function SessionPageHeader({ className, style }: SessionPageHeaderProps = {}): JSX.Element {
  const { isAuthenticated } = useAuthSession();
  const profileQuery = useMyProfile({ enabled: isAuthenticated });
  const router = useRouter();
  const { logout, isPending, errorMessage } = useLogout();

  const handleLogout = (): void => {
    logout({
      onSuccess: () => {
        router.replace('/login');
        router.refresh();
      },
    });
  };

  return isAuthenticated ? (
    <PageHeader
      isLogin
      userName={profileQuery.data?.nickname}
      onLogout={handleLogout}
      isLogoutPending={isPending}
      logoutError={errorMessage}
      className={className}
      style={style}
    />
  ) : (
    <PageHeader className={className} style={style} />
  );
}
