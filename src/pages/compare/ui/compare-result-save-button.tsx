'use client';

import { useState, type JSX } from 'react';
import { overlay } from 'overlay-kit';

import { ResultSaveButton, type ResultSaveButtonStatus } from '@/features/result-save-action';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { ANALYTICS_EVENTS } from '@/shared/lib/analytics/events';
import { trackClientEvent } from '@/shared/lib/analytics/track-client';
import { useSaveChannelComparison } from '@/pages/compare/api/use-save-channel-comparison';
import { showToast, showWarningToast } from '@/shared/ui/toast';
import { Tooltip } from '@/shared/ui/tooltip';

import { CompareResultSaveServiceNameModal } from './compare-result-save-service-name-modal';

const SAVE_RESULT_TOOLTIP_ID = 'compare-result-save-tooltip';
const SAVE_CHANNEL_COMPARISON_ERROR_TOAST_ID = 'compare-result-save-error';
const SAVE_CHANNEL_COMPARISON_ERROR_MESSAGE = '채널 비교 결과 저장 중 문제가 발생했습니다.';
const SAVE_CHANNEL_COMPARISON_SUCCESS_TOAST_ID = 'compare-result-save-success';
const SAVE_CHANNEL_COMPARISON_SUCCESS_MESSAGE = '마이페이지에 결과를 저장했어요';

type SaveChannelComparisonButtonStatus = ResultSaveButtonStatus;

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

function SaveButton({ describedBy, disabled, onClick, status }: SaveButtonProps): JSX.Element {
  return (
    <ResultSaveButton
      describedBy={describedBy}
      disabled={disabled}
      className="w-full lg:w-auto"
      onClick={onClick}
      status={status}
    />
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
          trackClientEvent(ANALYTICS_EVENTS.channelComparisonResultSaved, {
            channel_count: channelIds.length,
            save_source: 'service_name',
          });
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
            trackClientEvent(ANALYTICS_EVENTS.channelComparisonResultSaved, {
              channel_count: channelIds.length,
              save_source: 'onboarding',
            });
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
