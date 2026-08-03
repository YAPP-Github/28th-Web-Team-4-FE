import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';

import { hasActiveAuthSession } from '@/app/api-routes/auth/session-cookie';

export async function AuthLayout({ children }: { children: ReactNode }) {
  if (await hasActiveAuthSession()) {
    redirect('/');
  }

  return (
    <main className="bg-surface-lower px-016 py-032 flex min-h-svh flex-1 items-center justify-center">
      {children}
    </main>
  );
}
