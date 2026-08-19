'use client';

import type { JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useLogout } from '@/features/auth/session/model/use-logout';
import { Button } from '@/shared/ui/button';

export function LogoutButton(): JSX.Element {
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

  return (
    <div className="gap-004 flex flex-col items-end">
      <Button frame="button" tone="stroke" disabled={isPending} onClick={handleLogout}>
        로그아웃
      </Button>
      {errorMessage ? (
        <p className="typo-body-sm text-sys-error-default" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
