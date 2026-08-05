'use client';

import { useState, type JSX } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { logoutAuthSession } from '@/features/auth/session/api/auth-session';
import {
  authSessionQueryKey,
  authSessionQueryOptions,
} from '@/features/auth/session/model/auth-session-query';
import { Button } from '@/shared/ui/button';

export function LogoutButton(): JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>();
  const logoutMutation = useMutation({
    mutationFn: () => logoutAuthSession(),
    onSuccess: () => {
      queryClient.setQueryData(authSessionQueryKey, { authenticated: false });
      router.replace('/login');
      router.refresh();
    },
    onError: async () => {
      try {
        const session = await queryClient.fetchQuery(authSessionQueryOptions());

        if (!session.authenticated) {
          queryClient.setQueryData(authSessionQueryKey, { authenticated: false });
          router.replace('/login');
          router.refresh();
          return;
        }
      } catch {
        // 세션 확인도 실패하면 로그아웃 결과를 단정하지 않고 재시도를 안내한다.
      }

      setErrorMessage('로그아웃하지 못했습니다. 다시 시도해 주세요.');
    },
  });

  return (
    <div className="gap-004 flex flex-col items-end">
      <Button
        frame="button"
        tone="stroke"
        disabled={logoutMutation.isPending}
        onClick={() => {
          setErrorMessage(undefined);
          logoutMutation.mutate();
        }}
      >
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
