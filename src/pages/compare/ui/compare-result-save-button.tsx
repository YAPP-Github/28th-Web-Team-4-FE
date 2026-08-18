'use client';

import { useState, type JSX } from 'react';
import { Check, Download, LoaderCircle } from 'lucide-react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { overlay } from 'overlay-kit';

import { getApiErrorMessage } from '@/shared/api/api-error';
import { useSaveChannelComparison } from '@/pages/compare/api/use-save-channel-comparison';
import { values } from '@/shared/lib/object';
import { Button } from '@/shared/ui/button';
import { showToast, showWarningToast } from '@/shared/ui/toast';
import { Tooltip } from '@/shared/ui/tooltip';

import { CompareResultSaveServiceNameModal } from './compare-result-save-service-name-modal';

const SAVE_RESULT_TOOLTIP_ID = 'compare-result-save-tooltip';
const SAVE_CHANNEL_COMPARISON_ERROR_TOAST_ID = 'compare-result-save-error';
const SAVE_CHANNEL_COMPARISON_ERROR_MESSAGE = '채널 비교 결과 저장 중 문제가 발생했습니다.';
const SAVE_CHANNEL_COMPARISON_SUCCESS_TOAST_ID = 'compare-result-save-success';
const SAVE_CHANNEL_COMPARISON_SUCCESS_MESSAGE = '마이페이지에 결과를 저장했어요';
const SAVE_CHANNEL_COMPARISON_BUTTON_LABEL = {
  idle: '결과 저장하기',
  pending: '저장 중',
  saved: '저장 완료',
} as const;
const SAVE_CHANNEL_COMPARISON_STATUS = {
  idle: {
    label: SAVE_CHANNEL_COMPARISON_BUTTON_LABEL.idle,
    icon: <Download aria-hidden="true" className="text-icon-high size-016" />,
  },
  pending: {
    label: SAVE_CHANNEL_COMPARISON_BUTTON_LABEL.pending,
    icon: (
      <LoaderCircle
        aria-hidden="true"
        className="text-icon-high size-016 animate-spin motion-reduce:animate-none"
      />
    ),
  },
  saved: {
    label: SAVE_CHANNEL_COMPARISON_BUTTON_LABEL.saved,
    icon: <Check aria-hidden="true" className="text-icon-high size-016" strokeWidth={2.4} />,
  },
} as const;
const STATUS_CONTENT_TRANSITION = {
  type: 'spring',
  duration: 0.24,
  bounce: 0,
} as const;

type SaveChannelComparisonButtonStatus = keyof typeof SAVE_CHANNEL_COMPARISON_BUTTON_LABEL;

type CompareResultSaveButtonProps = {
  channelIds: readonly string[];
  isGuest: boolean;
  onboardingId: string | null;
};

type SaveButtonProps = {
  describedBy?: string;
  disabled?: boolean;
  onClick?: () => void;
  status: SaveChannelComparisonButtonStatus;
};

function AnimatedStatusContent({
  status,
}: {
  status: SaveChannelComparisonButtonStatus;
}): JSX.Element {
  const shouldReduceMotion = useReducedMotion();
  const yOffset = shouldReduceMotion ? 0 : 18;

  return (
    <span aria-hidden="true" className="relative inline-grid overflow-hidden text-center">
      {values(SAVE_CHANNEL_COMPARISON_STATUS).map(({ icon, label }) => (
        <span
          key={label}
          className="gap-008 px-002 invisible col-start-1 row-start-1 inline-flex items-center justify-center"
        >
          <span className="size-016 inline-flex shrink-0 items-center justify-center">{icon}</span>
          <span>{label}</span>
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={status}
          className="gap-008 px-002 col-start-1 row-start-1 inline-flex items-center justify-center will-change-transform"
          initial={{ opacity: 0, y: -yOffset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: yOffset }}
          transition={STATUS_CONTENT_TRANSITION}
        >
          <span className="size-016 inline-flex shrink-0 items-center justify-center">
            {SAVE_CHANNEL_COMPARISON_STATUS[status].icon}
          </span>
          <span>{SAVE_CHANNEL_COMPARISON_STATUS[status].label}</span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function SaveButton({ describedBy, disabled, onClick, status }: SaveButtonProps): JSX.Element {
  const label = SAVE_CHANNEL_COMPARISON_STATUS[status].label;

  return (
    <Button
      frame="button"
      tone="stroke"
      type="button"
      aria-label={label}
      aria-describedby={describedBy}
      disabled={disabled}
      className="border-outline-low h-044 px-020 py-010 w-full lg:w-auto"
      onClick={onClick}
    >
      <AnimatedStatusContent status={status} />
    </Button>
  );
}

export function CompareResultSaveButton({
  channelIds,
  isGuest,
  onboardingId,
}: CompareResultSaveButtonProps): JSX.Element {
  const saveChannelComparison = useSaveChannelComparison();
  const { mutate } = saveChannelComparison;
  const [status, setStatus] = useState<SaveChannelComparisonButtonStatus>('idle');
  const isDisabled = status !== 'idle';

  const handleSaveWithServiceName = (nextServiceName: string): void => {
    setStatus('pending');
    mutate(
      {
        body: {
          channelIds: [...channelIds],
          serviceName: nextServiceName,
        },
      },
      {
        onSuccess: () => {
          showToast({
            id: SAVE_CHANNEL_COMPARISON_SUCCESS_TOAST_ID,
            description: SAVE_CHANNEL_COMPARISON_SUCCESS_MESSAGE,
            type: 'success',
          });
          setStatus('saved');
        },
        onError: (error) => {
          showWarningToast(getApiErrorMessage(error, SAVE_CHANNEL_COMPARISON_ERROR_MESSAGE), {
            id: SAVE_CHANNEL_COMPARISON_ERROR_TOAST_ID,
          });
          setStatus('idle');
        },
      },
    );
  };

  const handleSave = (): void => {
    if (isGuest || isDisabled) {
      return;
    }

    if (onboardingId !== null) {
      setStatus('pending');
      mutate(
        {
          body: {
            channelIds: [...channelIds],
            onboardingId,
          },
        },
        {
          onSuccess: () => {
            showToast({
              id: SAVE_CHANNEL_COMPARISON_SUCCESS_TOAST_ID,
              description: SAVE_CHANNEL_COMPARISON_SUCCESS_MESSAGE,
              type: 'success',
            });
            setStatus('saved');
          },
          onError: (error) => {
            showWarningToast(getApiErrorMessage(error, SAVE_CHANNEL_COMPARISON_ERROR_MESSAGE), {
              id: SAVE_CHANNEL_COMPARISON_ERROR_TOAST_ID,
            });
            setStatus('idle');
          },
        },
      );
      return;
    }

    overlay.open(({ isOpen, close, unmount }) => (
      <CompareResultSaveServiceNameModal
        open={isOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            close();
          }
        }}
        onExit={unmount}
        onSave={(nextServiceName) => {
          close();
          handleSaveWithServiceName(nextServiceName);
        }}
      />
    ));
  };

  if (!isGuest) {
    return <SaveButton disabled={isDisabled} onClick={handleSave} status={status} />;
  }

  return (
    <Tooltip.Root placement="left" offset={12}>
      <Tooltip.Anchor className="w-full lg:w-fit">
        <SaveButton describedBy={SAVE_RESULT_TOOLTIP_ID} status="idle" />
      </Tooltip.Anchor>
      <Tooltip.Content
        id={SAVE_RESULT_TOOLTIP_ID}
        role="tooltip"
        className="bg-surface-highest"
        arrowClassName="bg-surface-highest"
      >
        로그인 후 저장 가능해요
      </Tooltip.Content>
    </Tooltip.Root>
  );
}
