import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { hasActiveAuthSession } from '@/app/api-routes/auth/session-cookie';

export async function ProtectedLayout({ children }: { children: ReactNode }) {
  if (!(await hasActiveAuthSession())) {
    redirect('/login');
  }

  return children;
}
