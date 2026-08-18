'use client';

import Link from 'next/link';
import type { JSX } from 'react';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';

export function MyAdsConditionResetModal(): JSX.Element {
  return (
    <Modal.Portal>
      <Modal.Backdrop className="backdrop-blur-[2px]" />
      <Modal.Popup className="gap-024 px-030 pb-024 pt-030 items-center">
        <Box className="gap-018 flex w-full flex-col items-center">
          <Box
            aria-hidden
            className="bg-surface-high text-text-lowest size-036 flex items-center justify-center rounded-full"
          >
            <Text as="span" className="text-24 leading-[34px] font-semibold">
              ?
            </Text>
          </Box>
          <Box className="gap-012 flex w-full flex-col items-center text-center">
            <Modal.Title className="text-text-high">처음부터 다시 설정할까요?</Modal.Title>
            <Modal.Description className="text-text-medium">
              입력했던 광고 조건이 모두 지워지고
              <br />
              첫 단계부터 다시 시작해요.
            </Modal.Description>
          </Box>
        </Box>

        <Box className="gap-010 flex h-12 w-full">
          <Modal.CloseButton frame="button" tone="stroke" className="h-12 flex-1">
            취소
          </Modal.CloseButton>
          <Button
            frame="button"
            tone="secondary"
            size="m"
            className="h-12 flex-1"
            nativeButton={false}
            render={<Link href="/recommend/onboarding/new" />}
          >
            다시 설정하기
          </Button>
        </Box>
      </Modal.Popup>
    </Modal.Portal>
  );
}
