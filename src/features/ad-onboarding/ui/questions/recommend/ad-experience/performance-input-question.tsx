'use client';

/**
 * 추천 광고 운영 경험자의 선택적 성과 입력을 업로드/직접 입력 탭으로 조합한다.
 */

import type { JSX, ReactNode } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';
import { Tabs } from '@base-ui/react/tabs';

import {
  PERFORMANCE_MODE_OPTION_LIST,
  type PerformanceMode,
} from '@/features/ad-onboarding/model/recommend-onboarding-options';
import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { OnboardingQuestion } from '@/features/ad-onboarding/ui/onboarding-question';
import { PerformanceChannelCombobox } from '@/features/ad-onboarding/ui/questions/recommend/ad-experience/performance-channel-combobox';
import { PerformanceFileDropzone } from '@/features/ad-onboarding/ui/questions/recommend/ad-experience/performance-file-dropzone';
import {
  StepActionButton,
  type StepActionButtonProps,
} from '@/features/ad-onboarding/ui/step-action-button';
import { Button } from '@/shared/ui/button';

export type PerformanceInputQuestionProps = {
  actionLabel?: ReactNode;
  onAction: NonNullable<StepActionButtonProps['onClick']>;
  onSkip: NonNullable<StepActionButtonProps['onClick']>;
};

/** 활성 탭에 맞는 성과 입력과 완료 조건을 RHF draft에 연결한다. */
export function PerformanceInputQuestion({
  actionLabel = '다음',
  onAction,
  onSkip,
}: PerformanceInputQuestionProps): JSX.Element {
  const { control } = useFormContext<RecommendOnboardingDraft>();
  const { field: performanceModeField } = useController({ control, name: 'performanceMode' });
  const { field: performanceFileListField } = useController({
    control,
    name: 'performanceFileList',
  });
  const { field: performanceChannelField } = useController({
    control,
    name: 'performanceChannel',
  });
  const isInputComplete = useWatch({
    control,
    compute: (draft) =>
      draft.performanceMode === 'UPLOAD'
        ? draft.performanceFileList.length > 0
        : Boolean(draft.performanceChannel),
  });

  const clearPerformanceInput = (): void => {
    performanceFileListField.onChange([]);
    performanceChannelField.onChange(undefined);
  };

  return (
    <OnboardingQuestion
      title="진행했던 광고 성과들을 알려 주세요"
      description="최대 5개의 데이터를 바탕으로 더 정확한 채널을 추천해요"
      className="max-w-[518px]"
    >
      <Tabs.Root
        className="w-full"
        value={performanceModeField.value}
        onValueChange={(value) => {
          if (value === 'UPLOAD' || value === 'MANUAL') {
            performanceModeField.onChange(value satisfies PerformanceMode);
          }
        }}
      >
        <Tabs.List className="border-outline-low relative flex w-full border-b">
          {PERFORMANCE_MODE_OPTION_LIST.map((option) => (
            <Tabs.Tab
              key={option.value}
              value={option.value}
              className={[
                'typo-subtitle-sm text-text-lower flex h-[45px] flex-1 items-center',
                'justify-center bg-transparent px-010 pt-012 outline-none',
                'hover:text-text-high focus-visible:outline-2 focus-visible:-outline-offset-2',
                'focus-visible:outline-outline-high data-active:text-text-high',
              ].join(' ')}
            >
              {option.label}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator
            className={[
              'bg-outline-high absolute bottom-[-1px] left-0 h-[2px]',
              'w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)]',
              'transition-[translate,width] duration-150 ease-in-out',
              'motion-reduce:transition-none',
            ].join(' ')}
          />
        </Tabs.List>

        <Tabs.Panel value="UPLOAD" className="pt-020 outline-none [[hidden]]:hidden">
          <PerformanceFileDropzone
            fileList={performanceFileListField.value}
            onFileListChange={performanceFileListField.onChange}
          />
        </Tabs.Panel>
        <Tabs.Panel value="MANUAL" className="pt-020 outline-none [[hidden]]:hidden">
          <PerformanceChannelCombobox
            value={performanceChannelField.value}
            onValueChange={performanceChannelField.onChange}
          />
        </Tabs.Panel>
      </Tabs.Root>

      <div className="gap-010 flex w-full items-center">
        <Button
          frame="cta"
          tone="third"
          type="button"
          onClick={(event) => {
            clearPerformanceInput();
            onSkip(event);
          }}
        >
          건너뛰기
        </Button>
        <StepActionButton className="min-w-0 flex-1" disabled={!isInputComplete} onClick={onAction}>
          {actionLabel}
        </StepActionButton>
      </div>
    </OnboardingQuestion>
  );
}
