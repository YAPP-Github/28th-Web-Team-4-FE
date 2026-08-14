'use client';

import type { JSX } from 'react';

import { useAuthSession, useLogout } from '@/features/auth/session';
import { PageHeader } from '@/features/navigation/page-header';

const PREVIEW_USER_NAME = 'YAPP';

export function SessionPageHeader(): JSX.Element {
  const { isAuthenticated } = useAuthSession();
  const { logout, isPending, errorMessage } = useLogout();

  return isAuthenticated ? (
    <PageHeader
      isLogin
      userName={PREVIEW_USER_NAME}
      onLogout={logout}
      isLogoutPending={isPending}
      logoutError={errorMessage}
    />
  ) : (
    <PageHeader />
  );
}
