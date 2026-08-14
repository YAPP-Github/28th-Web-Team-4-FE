'use client';

import { useState, type JSX } from 'react';
import { useRouter } from 'next/navigation';

import { useLogout } from '@/features/auth/session/model/use-logout';
import { useWithdraw } from '@/features/auth/session/model/use-withdraw';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { showToast } from '@/shared/ui/toast';

import { LogoutModal } from './logout-modal';
import { WithdrawalModal } from './withdrawal-modal';

type AccountModal = 'logout' | 'withdraw' | null;

export function AccountActions(): JSX.Element {
  const [activeModal, setActiveModal] = useState<AccountModal>(null);
  const router = useRouter();
  const { logout, isPending, errorMessage } = useLogout();

  const handleLogout = (): void => {
    logout({
      onSuccess: () => {
        showToast({ id: 'logout-success', description: '로그아웃했어요', type: 'success' });
        setActiveModal(null);
        router.replace('/login');
        router.refresh();
      },
    });
  };

  const {
    withdraw,
    resetError: resetWithdrawError,
    isPending: isWithdrawPending,
    errorMessage: withdrawErrorMessage,
  } = useWithdraw({
    onError: () => {
      showToast({
        id: 'withdraw-error',
        description: '탈퇴하지 못했습니다. 다시 시도해 주세요.',
        type: 'warning',
      });
    },
    onSuccess: () => {
      showToast({
        id: 'withdraw-success',
        description: '그동안 채소집을 이용해 주셔서 감사합니다.',
        type: 'success',
      });
      setActiveModal(null);
    },
  });

  const closeModal = (): void => setActiveModal(null);

  return (
    <>
      <Box className="gap-026 py-020 flex w-full items-center justify-center">
        <button
          type="button"
          className="typo-subtitle-xs text-text-low focus-visible:outline-sys-primary-default rounded-xxs cursor-pointer underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={() => setActiveModal('logout')}
        >
          로그아웃
        </button>
        <button
          type="button"
          className="typo-subtitle-xs text-text-low focus-visible:outline-sys-primary-default rounded-xxs cursor-pointer underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
          onClick={() => {
            resetWithdrawError();
            setActiveModal('withdraw');
          }}
        >
          탈퇴하기
        </button>
      </Box>

      {activeModal === 'withdraw' ? (
        <Modal.Root open onOpenChange={(open) => !open && closeModal()}>
          <WithdrawalModal
            errorMessage={withdrawErrorMessage}
            isPending={isWithdrawPending}
            onWithdraw={withdraw}
          />
        </Modal.Root>
      ) : null}
      {activeModal === 'logout' ? (
        <Modal.Root open onOpenChange={(open) => !open && closeModal()}>
          <LogoutModal errorMessage={errorMessage} isPending={isPending} onLogout={handleLogout} />
        </Modal.Root>
      ) : null}
    </>
  );
}
