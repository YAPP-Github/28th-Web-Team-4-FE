'use client';

import type { JSX } from 'react';
import { Download } from 'lucide-react';

import { getApiErrorMessage } from '@/shared/api/api-error';
import { useSaveRecommendation } from '@/pages/recommend-result/api/use-save-recommendation';
import { Button } from '@/shared/ui/button';
import { showWarningToast } from '@/shared/ui/toast';

type RecommendResultSaveActionProps = {
  onboardingId: string;
};

const SAVE_RECOMMENDATION_ERROR_TOAST_ID = 'recommend-result-save-error';
const SAVE_RECOMMENDATION_ERROR_MESSAGE = '추천 결과 저장 중 문제가 발생했습니다.';
const SAVE_RECOMMENDATION_BUTTON_LABEL = {
  idle: '결과 저장하기',
  pending: '저장 중',
  saved: '저장 완료',
} as const;

type SaveRecommendationButtonStatus = keyof typeof SAVE_RECOMMENDATION_BUTTON_LABEL;

function getSaveRecommendationButtonStatus({
  isPending,
  isSuccess,
}: {
  isPending: boolean;
  isSuccess: boolean;
}): SaveRecommendationButtonStatus {
  if (isPending) {
    return 'pending';
  }

  if (isSuccess) {
    return 'saved';
  }

  return 'idle';
}

export function RecommendResultSaveAction({
  onboardingId,
}: RecommendResultSaveActionProps): JSX.Element {
  const saveRecommendation = useSaveRecommendation();
  const isSaved = saveRecommendation.isSuccess;
  const isDisabled = saveRecommendation.isPending || isSaved;
  const status = getSaveRecommendationButtonStatus({
    isPending: saveRecommendation.isPending,
    isSuccess: saveRecommendation.isSuccess,
  });

  const handleSave = (): void => {
    if (isDisabled) {
      return;
    }

    saveRecommendation.mutate(
      {
        body: {
          onboardingId,
        },
      },
      {
        onError: (error) => {
          showWarningToast(getApiErrorMessage(error, SAVE_RECOMMENDATION_ERROR_MESSAGE), {
            id: SAVE_RECOMMENDATION_ERROR_TOAST_ID,
          });
        },
      },
    );
  };

  return (
    <Button
      frame="button"
      tone="stroke"
      className="border-outline-low h-044 px-020 py-010 w-full lg:w-auto"
      disabled={isDisabled}
      leftIcon={<Download aria-hidden="true" className="text-icon-high size-016" />}
      onClick={handleSave}
    >
      {SAVE_RECOMMENDATION_BUTTON_LABEL[status]}
    </Button>
  );
}
