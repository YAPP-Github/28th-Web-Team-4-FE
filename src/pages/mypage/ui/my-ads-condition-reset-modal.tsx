'use client';

import Link from 'next/link';
import type { JSX } from 'react';

import { Button } from '@/shared/ui/button';
import { Center } from '@/shared/ui/layout/center';
import { Flex } from '@/shared/ui/layout/flex';
import { VStack } from '@/shared/ui/layout/v-stack';
import { Modal } from '@/shared/ui/modal';
import { Text } from '@/shared/ui/text';

export function MyAdsConditionResetModal(): JSX.Element {
  return (
    <Modal.Portal>
      <Modal.Backdrop className="backdrop-blur-[2px]" />
      <Modal.Popup className="gap-024 px-030 pb-024 pt-030 items-center">
        <VStack className="gap-018 w-full">
          <Center aria-hidden className="bg-surface-high text-text-lowest size-036 rounded-full">
            <Text as="span" className="text-24 leading-[34px] font-semibold">
              ?
            </Text>
          </Center>
          <VStack className="gap-012 w-full text-center">
            <Modal.Title className="text-text-high">처음부터 다시 설정할까요?</Modal.Title>
            <Modal.Description className="text-text-medium">
              입력했던 광고 조건이 모두 지워지고
              <br />
              첫 단계부터 다시 시작해요.
            </Modal.Description>
          </VStack>
        </VStack>

        <Flex className="gap-010 h-12 w-full">
          <Modal.CloseButton frame="button" tone="stroke" className="h-12 flex-1">
            취소
          </Modal.CloseButton>
          <Button
            frame="button"
            tone="secondary"
            size="m"
            className="h-12 flex-1"
            nativeButton={false}
            render={<Link href="/recommend" />}
          >
            다시 설정하기
          </Button>
        </Flex>
      </Modal.Popup>
    </Modal.Portal>
  );
}
