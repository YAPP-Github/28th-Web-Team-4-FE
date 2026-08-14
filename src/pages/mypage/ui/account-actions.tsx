'use client';

import { useState, type JSX } from 'react';

import { useLogout } from '@/features/auth/session/model/use-logout';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { showToast } from '@/shared/ui/toast';

import { LogoutModal } from './logout-modal';

type AccountModal = 'logout' | null;

export function AccountActions(): JSX.Element {
  const [activeModal, setActiveModal] = useState<AccountModal>(null);
  const { logout, isPending, errorMessage } = useLogout({
    onSuccess: () => {
      showToast({ id: 'logout-success', description: '로그아웃했어요', type: 'success' });
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
        >
          탈퇴하기
        </button>
      </Box>

      {activeModal === 'logout' ? (
        <Modal.Root open onOpenChange={(open) => !open && closeModal()}>
          <LogoutModal errorMessage={errorMessage} isPending={isPending} onLogout={logout} />
        </Modal.Root>
      ) : null}
    </>
  );
}
