'use client';

import type { JSX } from 'react';

import { useLogout } from '@/features/auth/session/model/use-logout';
import { Button } from '@/shared/ui/button';

export function LogoutButton(): JSX.Element {
  const { logout, isPending, errorMessage } = useLogout();

  return (
    <div className="gap-004 flex flex-col items-end">
      <Button frame="button" tone="stroke" disabled={isPending} onClick={logout}>
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
