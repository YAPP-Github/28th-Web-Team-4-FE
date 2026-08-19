'use client';

import type { JSX } from 'react';

import { ResultSaveButton, type ResultSaveButtonStatus } from '@/features/result-save-action';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { useSaveRecommendation } from '@/pages/recommend-result/api/use-save-recommendation';
import { showWarningToast } from '@/shared/ui/toast';

type RecommendResultSaveActionProps = {
  onboardingId: string;
  serviceName: string;
};

const SAVE_RECOMMENDATION_ERROR_TOAST_ID = 'recommend-result-save-error';
const SAVE_RECOMMENDATION_ERROR_MESSAGE = '추천 결과 저장 중 문제가 발생했습니다.';
type SaveRecommendationButtonStatus = ResultSaveButtonStatus;

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
  serviceName,
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
          serviceName,
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
    <ResultSaveButton
      className="w-full lg:w-auto"
      disabled={isDisabled}
      onClick={handleSave}
      status={status}
    />
  );
}
