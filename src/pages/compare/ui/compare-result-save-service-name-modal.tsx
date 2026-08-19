'use client';

import { useState, type JSX } from 'react';
import { Field } from '@base-ui/react/field';
import { Form } from '@base-ui/react/form';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';

type CompareResultSaveServiceNameModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExit?: () => void;
  onSave: (serviceName: string) => void;
};

type SaveServiceNameFormValues = {
  serviceName?: string;
};

export function CompareResultSaveServiceNameModal({
  open,
  onOpenChange,
  onExit,
  onSave,
}: CompareResultSaveServiceNameModalProps): JSX.Element {
  const [serviceName, setServiceName] = useState('');
  const trimmedServiceName = serviceName.trim();

  const handleSubmit = (formValues: SaveServiceNameFormValues): void => {
    const nextServiceName = formValues.serviceName?.trim() ?? '';

    if (!nextServiceName) {
      return;
    }

    onSave(nextServiceName);
  };

  return (
    <Modal.Root
      open={open}
      onOpenChange={onOpenChange}
      onOpenChangeComplete={(nextOpen) => {
        if (!nextOpen) {
          onExit?.();
        }
      }}
    >
      <Modal.Portal>
        <Modal.Backdrop className="backdrop-blur-[2px]" />
        <Modal.Popup className="gap-024 px-030 pb-024 pt-030 items-center">
          <Form<SaveServiceNameFormValues>
            className="gap-024 flex w-full flex-col"
            onFormSubmit={handleSubmit}
          >
            <Box className="gap-014 flex w-full flex-col items-start">
              <Box className="gap-002 flex w-full flex-col items-start">
                <Modal.Title className="text-text-high w-full text-left">
                  서비스명을 입력해 주세요
                </Modal.Title>
                <Modal.Description className="text-text-medium w-full text-left">
                  예: 채소집, 앱 설치 유도 캠페인
                </Modal.Description>
              </Box>
              <Field.Root name="serviceName" className="w-full">
                <Input
                  frame="input"
                  id="compare-result-save-service-name"
                  aria-label="서비스명"
                  autoComplete="organization"
                  autoFocus
                  className="h-[46px]"
                  maxLength={50}
                  placeholder="서비스명을 입력해 주세요"
                  required
                  value={serviceName}
                  onChange={(event) => setServiceName(event.target.value)}
                />
              </Field.Root>
            </Box>
            <Box className="gap-010 flex h-12 w-full">
              <Modal.CloseButton frame="button" tone="stroke" className="h-12 flex-1">
                취소
              </Modal.CloseButton>
              <Button
                frame="button"
                tone="secondary"
                size="m"
                type="submit"
                className="h-12 flex-1"
                disabled={!trimmedServiceName}
              >
                저장하기
              </Button>
            </Box>
          </Form>
        </Modal.Popup>
      </Modal.Portal>
    </Modal.Root>
  );
}
