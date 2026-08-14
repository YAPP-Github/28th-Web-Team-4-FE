'use client';

import type { JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useAuthSession, useLogout } from '@/features/auth/session';
import { PageHeader } from '@/features/navigation/page-header';

const PREVIEW_USER_NAME = 'YAPP';

export function SessionPageHeader(): JSX.Element {
  const { isAuthenticated } = useAuthSession();
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
      userName={PREVIEW_USER_NAME}
      onLogout={handleLogout}
      isLogoutPending={isPending}
      logoutError={errorMessage}
    />
  ) : (
    <PageHeader />
  );
}
