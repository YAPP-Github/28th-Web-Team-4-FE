'use client';

import type { JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthSession, useLogout } from '@/features/auth/session';
import { PageHeader } from '@/features/navigation/page-header';
import { useMyProfile } from '@/pages/mypage/api/use-my-profile';

export function SessionPageHeader(): JSX.Element {
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
    />
  ) : (
    <PageHeader />
  );
}
