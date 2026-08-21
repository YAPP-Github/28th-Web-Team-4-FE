'use client';

import type { JSX } from 'react';
import { useMutation } from '@tanstack/react-query';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';
import { submitRecommendOnboarding } from '@/features/ad-onboarding/api/submit-recommend-onboarding';
import { ResultSaveButton, type ResultSaveButtonStatus } from '@/features/result-save-action';
import { getApiErrorCode, getApiErrorMessage } from '@/shared/api/api-error';
import { useSaveRecommendation } from '@/pages/recommend-result/api/use-save-recommendation';
import { showWarningToast } from '@/shared/ui/toast';

type RecommendResultSaveActionProps = {
  onboardingId: string;
  onOnboardingIdChange: (onboardingId: string) => void;
  serviceName: string;
};

const SAVE_RECOMMENDATION_ERROR_TOAST_ID = 'recommend-result-save-error';
const SAVE_RECOMMENDATION_ERROR_MESSAGE = '추천 결과 저장 중 문제가 발생했습니다.';
const MIGRATE_RECOMMENDATION_ERROR_MESSAGE = '로그인 계정에 추천 결과를 연결하지 못했습니다.';
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
  onOnboardingIdChange,
  serviceName,
}: RecommendResultSaveActionProps): JSX.Element {
  const onboardingAnswer = useRecommendOnboardingStore((state) => state.answer);
  const saveRecommendation = useSaveRecommendation();
  const migrateOnboarding = useMutation({ mutationFn: submitRecommendOnboarding });
  const isSaved = saveRecommendation.isSuccess;
  const isPending = saveRecommendation.isPending || migrateOnboarding.isPending;
  const isDisabled = isPending || isSaved;
  const status = getSaveRecommendationButtonStatus({
    isPending,
    isSuccess: saveRecommendation.isSuccess,
  });

  const showSaveError = (error: unknown): void => {
    showWarningToast(getApiErrorMessage(error, SAVE_RECOMMENDATION_ERROR_MESSAGE), {
      id: SAVE_RECOMMENDATION_ERROR_TOAST_ID,
    });
  };

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
          if (getApiErrorCode(error) !== 'ONB-007' || !onboardingAnswer) {
            showSaveError(error);
            return;
          }

          migrateOnboarding.mutate(onboardingAnswer, {
            onSuccess: ({ onboardingId: newOnboardingId }) => {
              onOnboardingIdChange(newOnboardingId);
              saveRecommendation.mutate(
                {
                  body: {
                    onboardingId: newOnboardingId,
                    serviceName,
                  },
                },
                {
                  onError: showSaveError,
                },
              );
            },
            onError: (migrationError) => {
              showWarningToast(
                getApiErrorMessage(migrationError, MIGRATE_RECOMMENDATION_ERROR_MESSAGE),
                { id: SAVE_RECOMMENDATION_ERROR_TOAST_ID },
              );
            },
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
