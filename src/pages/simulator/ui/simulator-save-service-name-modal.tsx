'use client';

import type { FormEvent, JSX } from 'react';

import { Flex } from '@/shared/ui/layout/flex';
import { Stack } from '@/shared/ui/layout/stack';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

type SimulatorSaveServiceNameModalProps = {
  open: boolean;
  serviceName: string;
  onOpenChange: (open: boolean) => void;
  onServiceNameChange: (serviceName: string) => void;
  onSave: (serviceName: string) => void;
};

export function SimulatorSaveServiceNameModal({
  open,
  serviceName,
  onOpenChange,
  onServiceNameChange,
  onSave,
}: SimulatorSaveServiceNameModalProps): JSX.Element {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const trimmedServiceName = serviceName.trim();

    if (!trimmedServiceName) {
      return;
    }

    onSave(trimmedServiceName);
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Portal>
        <Modal.Backdrop className="backdrop-blur-[2px]" />
        <Modal.Popup className="gap-024 px-030 pb-024 pt-030 items-center">
          <Stack as="form" className="gap-024 w-full" onSubmit={handleSubmit}>
            <Stack className="gap-014 w-full items-start">
              <Stack className="gap-002 w-full items-start">
                <Modal.Title className="text-text-high w-full text-left">
                  어떤 이름으로 결과를 저장할까요?
                </Modal.Title>
                <Modal.Description className="text-text-medium w-full text-left">
                  예: 채소집, 앱 설치 유도 캠페인
                </Modal.Description>
              </Stack>
              <Input
                frame="input"
                id="simulator-save-service-name"
                aria-label="서비스명"
                autoComplete="organization"
                autoFocus
                className="h-[46px]"
                maxLength={50}
                placeholder="서비스명을 입력해 주세요"
                value={serviceName}
                onChange={(event) => onServiceNameChange(event.target.value)}
              />
            </Stack>
            <Flex className="gap-010 h-12 w-full">
              <Modal.CloseButton frame="button" tone="stroke" className="h-12 flex-1">
                취소
              </Modal.CloseButton>
              <Button
                frame="button"
                tone="secondary"
                size="m"
                type="submit"
                className="h-12 flex-1"
              >
                저장하기
              </Button>
            </Flex>
          </Stack>
        </Modal.Popup>
      </Modal.Portal>
    </Modal.Root>
  );
}
