'use client';

import type { JSX } from 'react';

import { useAuthSession } from '@/features/auth/session';
import { PageHeader } from '@/features/navigation/page-header';

export function SessionPageHeader(): JSX.Element {
  const { isAuthenticated } = useAuthSession();

  return isAuthenticated ? <PageHeader isLogin /> : <PageHeader />;
}
