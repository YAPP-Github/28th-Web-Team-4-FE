import type { ReactNode } from 'react';

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-surface-lower px-016 py-032 flex min-h-svh flex-1 items-center justify-center">
      {children}
    </main>
  );
}
