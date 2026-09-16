import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';
import { Center } from '@/shared/ui/layout/center';

export async function AuthLayout({ children }: { children: ReactNode }) {
  if (await hasActiveAuthSession()) {
    redirect('/');
  }

  return (
    <Center as="main" className="bg-surface-lower px-016 py-032 min-h-svh flex-1">
      {children}
    </Center>
  );
}
