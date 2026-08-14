'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { withdrawAuthAccount } from '@/features/auth/session/api/auth-session';

import { authSessionQueryKey } from './auth-session-query';

type UseWithdrawOptions = {
  onSuccess?: () => void;
};

export function useWithdraw({ onSuccess }: UseWithdrawOptions = {}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const withdrawMutation = useMutation({
    mutationFn: withdrawAuthAccount,
    onSuccess: () => {
      queryClient.setQueryData(authSessionQueryKey, { authenticated: false });
      router.replace('/login');
      router.refresh();
      onSuccess?.();
    },
  });

  const withdraw = (): void => withdrawMutation.mutate();

  return {
    withdraw,
    isPending: withdrawMutation.isPending,
  };
}
