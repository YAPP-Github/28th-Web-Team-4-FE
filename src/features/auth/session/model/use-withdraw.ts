'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { withdrawAuthAccount } from '@/features/auth/session/api/auth-session';
import { userQueryKey } from '@/shared/lib/query-keys';

import { authSessionQueryKey } from './auth-session-query';

type UseWithdrawOptions = {
  onError?: () => void;
  onSuccess?: () => void;
};

export function useWithdraw({ onError, onSuccess }: UseWithdrawOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string>();
  const withdrawMutation = useMutation({
    mutationFn: withdrawAuthAccount,
    onSuccess: () => {
      queryClient.setQueryData(authSessionQueryKey, { authenticated: false });
      queryClient.removeQueries({ queryKey: userQueryKey });
      router.replace('/login');
      router.refresh();
      onSuccess?.();
    },
    onError: () => {
      setErrorMessage('탈퇴하지 못했습니다. 다시 시도해 주세요.');
      onError?.();
    },
  });

  const withdraw = (): void => {
    setErrorMessage(undefined);
    withdrawMutation.mutate();
  };

  const resetError = (): void => setErrorMessage(undefined);

  return {
    withdraw,
    resetError,
    isPending: withdrawMutation.isPending,
    errorMessage,
  };
}
