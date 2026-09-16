'use client';

import type { JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useLogout } from '@/features/auth/session/model/use-logout';
import { Button } from '@/shared/ui/button';
import { Stack } from '@/shared/ui/layout/stack';

export function LogoutButton(): JSX.Element {
  const router = useRouter();
  const { logout, isPending, errorMessage } = useLogout();

  const handleLogout = (): void => {
    logout({
      onSuccess: () => {
        router.replace('/');
        router.refresh();
      },
    });
  };

  return (
    <Stack className="gap-004 items-end">
      <Button frame="button" tone="stroke" disabled={isPending} onClick={handleLogout}>
        로그아웃
      </Button>
      {errorMessage ? (
        <p className="typo-body-sm text-sys-error-default" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </Stack>
  );
}
