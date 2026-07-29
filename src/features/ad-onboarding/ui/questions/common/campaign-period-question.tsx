'use client';

/**
 * 공통 집행 기간 step의 단일 선택 카드와 단기 집행 안내를 렌더링한다.
 */

import type { JSX } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { CircleAlert } from 'lucide-react';

import { CAMPAIGN_PERIOD_OPTION_LIST } from '@/features/ad-onboarding/model/common-onboarding-options';
import type { CommonOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { SelectCard } from '@/features/ad-onboarding/ui/select-card';
import { HStack } from '@/shared/ui/layout/h-stack';
import { RadioGroup } from '@/shared/ui/radio-group';
import { Text } from '@/shared/ui/text';

const SHORT_CAMPAIGN_ID = 'UNDER_1_WEEK';

/** 집행 기간 선택은 상위 온보딩 폼 컨텍스트만 사용한다. */
export type CampaignPeriodQuestionProps = Record<string, never>;

/** 1주 이하 선택 시 채널별 최소 권장 기간 안내를 함께 표시한다. */
export function CampaignPeriodQuestion(_props: CampaignPeriodQuestionProps): JSX.Element {
  const { control } = useFormContext<CommonOnboardingDraft>();
  const { field } = useController({ control, name: 'campaignPeriod' });
  const shouldShowShortCampaignNotice = field.value === SHORT_CAMPAIGN_ID;

  return (
    <RadioGroup
      aria-label="집행 기간"
      className="gap-010 w-full"
      value={field.value ?? ''}
      onValueChange={field.onChange}
    >
      {CAMPAIGN_PERIOD_OPTION_LIST.map((option) => (
        <SelectCard key={option.value} control="radio" value={option.value} label={option.label} />
      ))}
      {shouldShowShortCampaignNotice ? (
        <HStack
          role="status"
          className="gap-008 bg-sys-warning-default px-014 py-008 rounded-[var(--radius-s)]"
        >
          <CircleAlert className="size-012 text-sys-warning-high shrink-0" aria-hidden />
          <Text variant="body-sm" className="text-sys-warning-high">
            일부 채널(메타·구글 등)은 최소 7일 이상 집행을 권장해요
          </Text>
        </HStack>
      ) : null}
    </RadioGroup>
  );
}
