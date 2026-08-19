'use client';

import { useState, type JSX, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { RotateCcw } from 'lucide-react';

import {
  CAMPAIGN_PERIOD_OPTION_LIST,
  CATEGORY_OPTION_LIST,
  SERVICE_TYPE_OPTION_LIST,
  type BudgetRange,
} from '@/features/ad-onboarding/model/common-onboarding-options';
import {
  clampBudgetMaxAmount,
  clampBudgetMinAmount,
  commitBudgetInputValue,
  getBudgetInputValue,
  snapBudgetAmount,
} from '@/features/ad-onboarding/lib/budget-snap';
import type { BudgetInputRange } from '@/features/ad-onboarding/model/budget-range-input';
import {
  AD_GOAL_OPTION_LIST,
  AGE_RANGE_OPTION_LIST,
  type AgeRangeId,
} from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { isAgeRangeOptionDisabled } from '@/features/ad-onboarding/model/recommend-onboarding-rules';
import { BudgetRangeControl } from '@/features/ad-onboarding/ui/questions/common/budget/budget-range-control';
import type { ApiResponseMyOnboardingTagResponse } from '@/shared/api/generated/types.gen';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { myOnboardingTagQueryKey } from '@/shared/lib/query-keys';
import {
  AGE_RANGE_VALUES_BY_LABEL,
  DEFAULT_MY_ADS_CONDITION_EDIT_VALUES,
  type MyAdsConditionEditValues,
} from '@/pages/mypage/model/my-ads-condition-edit';
import { createUpdateOnboardingTagRequest } from '@/pages/mypage/lib/create-update-onboarding-tag-request';
import { useUpdateMyOnboardingTag } from '@/pages/mypage/api/use-update-my-onboarding-tag';
import { Button } from '@/shared/ui/button';
import { Dropdown, type DropdownOption } from '@/shared/ui/dropdown';
import { Box } from '@/shared/ui/layout/box';
import { Modal } from '@/shared/ui/modal';
import { Select } from '@/shared/ui/select';
import { Text } from '@/shared/ui/text';

const EDITABLE_CATEGORY_VALUES = new Set([
  'GAME',
  'ENTERTAINMENT',
  'EDUCATION',
  'SOCIAL_COMMUNITY',
  'LIFESTYLE',
  'HEALTH_FITNESS',
  'FOOD_BEVERAGE',
  'SHOPPING_COMMERCE',
]);

const CATEGORY_OPTIONS = toDropdownOptions(
  CATEGORY_OPTION_LIST.filter((option) => EDITABLE_CATEGORY_VALUES.has(option.value)),
);
const SERVICE_TYPE_OPTIONS = toDropdownOptions(SERVICE_TYPE_OPTION_LIST);
const WEB_AD_GOAL_OPTIONS = toAdGoalOptions(AD_GOAL_OPTION_LIST.slice(0, 5));
const APP_AD_GOAL_OPTIONS = toAdGoalOptions(AD_GOAL_OPTION_LIST);
const CAMPAIGN_PERIOD_OPTIONS = toDropdownOptions(
  CAMPAIGN_PERIOD_OPTION_LIST.map((option) => ({
    ...option,
    label: normalizeCampaignPeriodLabel(option.label),
  })),
);

type MyAdsConditionEditModalProps = {
  initialValues?: MyAdsConditionEditValues;
  onSave: (values: MyAdsConditionEditValues) => void;
  onStartOver: () => void;
};

export function createMyAdsConditionEditValues(tags: readonly string[]): MyAdsConditionEditValues {
  const normalizedTags = tags.map((tag) => tag.replace(/^#/, ''));
  const budgetTag = normalizedTags.find((tag) => tag.includes('만 원'));
  const budgetValues = budgetTag
    ? [...budgetTag.matchAll(/([\d,]+)\s*만\s*원/g)].map((match) => match[1].replaceAll(',', ''))
    : [];
  const minBudget =
    budgetValues.length > 1 ? budgetValues[0] : DEFAULT_MY_ADS_CONDITION_EDIT_VALUES.minBudget;
  const maxBudget = budgetValues.at(-1);

  return {
    category: normalizedTags[0] ?? DEFAULT_MY_ADS_CONDITION_EDIT_VALUES.category,
    serviceType: normalizedTags[1] ?? DEFAULT_MY_ADS_CONDITION_EDIT_VALUES.serviceType,
    ageRange: normalizedTags[2] ?? DEFAULT_MY_ADS_CONDITION_EDIT_VALUES.ageRange,
    adGoal:
      normalizedTags[3]?.replace('구매·결제 전환', '구매 전환') ??
      DEFAULT_MY_ADS_CONDITION_EDIT_VALUES.adGoal,
    minBudget,
    maxBudget: maxBudget ?? DEFAULT_MY_ADS_CONDITION_EDIT_VALUES.maxBudget,
    campaignPeriod: normalizedTags[5]
      ? normalizeCampaignPeriodLabel(normalizedTags[5])
      : DEFAULT_MY_ADS_CONDITION_EDIT_VALUES.campaignPeriod,
  };
}

export function createMyAdsConditionTags(values: MyAdsConditionEditValues): string[] {
  return [
    values.category,
    values.serviceType,
    values.ageRange,
    values.adGoal,
    `총 ${values.maxBudget}만 원`,
    values.campaignPeriod,
  ];
}

export function MyAdsConditionEditModal({
  initialValues = DEFAULT_MY_ADS_CONDITION_EDIT_VALUES,
  onSave,
  onStartOver,
}: MyAdsConditionEditModalProps): JSX.Element {
  const [values, setValues] = useState(initialValues);
  const queryClient = useQueryClient();
  const updateMutation = useUpdateMyOnboardingTag();

  const handleSave = (): void => {
    if (updateMutation.isPending) {
      return;
    }

    updateMutation.reset();
    updateMutation.mutate(
      { body: createUpdateOnboardingTagRequest(values) },
      {
        onSuccess: ({ data: updatedTag }) => {
          queryClient.setQueryData<ApiResponseMyOnboardingTagResponse>(
            myOnboardingTagQueryKey,
            (currentResponse) =>
              currentResponse ? { ...currentResponse, data: updatedTag } : currentResponse,
          );
          onSave(values);
        },
      },
    );
  };

  const updateValue = <Key extends keyof MyAdsConditionEditValues>(
    key: Key,
    value: MyAdsConditionEditValues[Key],
  ): void => {
    setValues((currentValues) => ({ ...currentValues, [key]: value }));
  };

  const updateServiceType = (serviceType: string): void => {
    setValues((currentValues) => ({
      ...currentValues,
      serviceType,
      adGoal:
        isAppServiceType(serviceType) || !isAppOnlyAdGoal(currentValues.adGoal)
          ? currentValues.adGoal
          : '구매 전환',
    }));
  };

  return (
    <Modal.Portal>
      <Modal.Backdrop className="backdrop-blur-[2px]" />
      <Modal.Popup className="gap-026 px-030 pb-024 pt-030 w-[568px] items-center">
        <Box className="gap-020 flex w-full flex-col items-center">
          <Box className="gap-018 flex w-full items-center">
            <Modal.Title
              render={<Text as="h2" variant="heading-xl" className="typo-heading-xxl" />}
              className="text-text-high flex-1 text-left"
            >
              내 광고 조건
            </Modal.Title>
            <button
              type="button"
              onClick={onStartOver}
              disabled={updateMutation.isPending}
              className="gap-002 typo-body-sm text-text-low focus-visible:outline-sys-primary-default rounded-xxs inline-flex shrink-0 items-center underline underline-offset-2 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <RotateCcw aria-hidden className="size-014" strokeWidth={1.5} />
              새로 설정하기
            </button>
          </Box>

          <Box
            as="form"
            className="gap-020 flex w-full flex-col"
            onSubmit={(event) => event.preventDefault()}
          >
            <ConditionDropdownField
              label="업종"
              value={values.category}
              options={CATEGORY_OPTIONS}
              onValueChange={(value) => updateValue('category', value)}
            />
            <ConditionDropdownField
              label="서비스 형태"
              value={values.serviceType}
              options={SERVICE_TYPE_OPTIONS}
              onValueChange={updateServiceType}
            />
            <AgeRangeField
              label="주요 연령대"
              value={values.ageRange}
              onValueChange={(value) => updateValue('ageRange', value)}
            />
            <ConditionDropdownField
              label="광고 목표"
              value={values.adGoal}
              options={getAdGoalOptions(values.serviceType)}
              renderValue={(value) => value}
              onValueChange={(value) => updateValue('adGoal', value)}
            />
            <BudgetField
              minBudget={values.minBudget}
              maxBudget={values.maxBudget}
              onMinBudgetChange={(value) => updateValue('minBudget', value)}
              onMaxBudgetChange={(value) => updateValue('maxBudget', value)}
            />
            <ConditionDropdownField
              label="집행 기간"
              value={values.campaignPeriod}
              options={CAMPAIGN_PERIOD_OPTIONS}
              onValueChange={(value) => updateValue('campaignPeriod', value)}
            />
          </Box>
        </Box>

        {updateMutation.error ? (
          <Text as="p" variant="body-sm" className="text-sys-error-default w-full" role="alert">
            {getApiErrorMessage(
              updateMutation.error,
              '광고 조건을 저장하지 못했어요. 다시 시도해 주세요.',
            )}
          </Text>
        ) : null}

        <Box className="gap-010 flex h-12 w-full">
          <Modal.CloseButton
            frame="button"
            tone="stroke"
            className="h-12 flex-1"
            disabled={updateMutation.isPending}
          >
            취소
          </Modal.CloseButton>
          <Button
            frame="button"
            tone="secondary"
            size="m"
            className="h-12 flex-1"
            type="button"
            disabled={updateMutation.isPending}
            onClick={handleSave}
          >
            {updateMutation.isPending ? '저장 중...' : '저장하기'}
          </Button>
        </Box>
      </Modal.Popup>
    </Modal.Portal>
  );
}

function AgeRangeField({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}): JSX.Element {
  const selectedValues = getAgeRangeValues(value);
  const options = AGE_RANGE_OPTION_LIST.map((option) => ({
    ...option,
    disabled: isAgeRangeOptionDisabled(option.value, selectedValues),
  }));

  return (
    <Box className="gap-008 flex w-full flex-col items-start">
      <Text variant="body-xl" className="text-text-medium">
        {label}
      </Text>
      <Select
        options={options}
        value={selectedValues}
        onValueChange={(nextValues) => onValueChange(formatAgeRangeValues(nextValues))}
        placeholder="선택해 주세요"
        triggerAriaLabel={label}
        renderValue={formatAgeRangeValues}
        valueClassName="!typo-subtitle-xxs !text-text-high"
        listClassName="!py-0"
        optionClassName="!h-[42px] !min-h-0 !py-010 border-b border-outline-default last:border-b-0"
      />
    </Box>
  );
}

function ConditionDropdownField({
  label,
  value,
  options,
  renderValue,
  onValueChange,
}: {
  label: string;
  value: string;
  options: readonly DropdownOption[];
  renderValue?: (value: string) => ReactNode;
  onValueChange: (value: string) => void;
}): JSX.Element {
  return (
    <Box className="gap-008 flex w-full flex-col items-start">
      <Text variant="body-xl" className="text-text-medium">
        {label}
      </Text>
      <Dropdown
        options={options}
        value={value}
        onValueChange={(nextValue) => {
          if (nextValue) {
            onValueChange(nextValue);
          }
        }}
        placeholder="선택해 주세요"
        triggerAriaLabel={label}
        renderValue={renderValue}
      />
    </Box>
  );
}

function getAgeRangeValues(label: string): AgeRangeId[] {
  const normalizedLabel = label.trim();
  const presetValues = AGE_RANGE_VALUES_BY_LABEL[normalizedLabel];

  if (presetValues) {
    return [...presetValues];
  }

  return [
    ...new Set(
      normalizedLabel.split(',').flatMap((part) => AGE_RANGE_VALUES_BY_LABEL[part.trim()] ?? []),
    ),
  ];
}

function formatAgeRangeValues(values: readonly AgeRangeId[]): string {
  if (values.length === 0) {
    return '선택해 주세요';
  }

  if (values.length === 2 && values.includes('THIRTIES') && values.includes('FORTIES')) {
    return '30~40대';
  }

  return AGE_RANGE_OPTION_LIST.filter((option) => values.includes(option.value))
    .map((option) => option.label)
    .join(', ');
}

function getAdGoalOptions(serviceType: string): readonly DropdownOption[] {
  return isAppServiceType(serviceType) ? APP_AD_GOAL_OPTIONS : WEB_AD_GOAL_OPTIONS;
}

function isAppServiceType(serviceType: string): boolean {
  return serviceType === '모바일 앱' || serviceType === '앱 + 웹 모두';
}

function isAppOnlyAdGoal(adGoal: string): boolean {
  return adGoal === '앱 설치' || adGoal === '인앱 구매·행동';
}

function normalizeCampaignPeriodLabel(label: string): string {
  return label.replace(/\s*\([^)]*\)$/, '');
}

function BudgetField({
  minBudget,
  maxBudget,
  onMinBudgetChange,
  onMaxBudgetChange,
}: {
  minBudget: string;
  maxBudget: string;
  onMinBudgetChange: (value: string) => void;
  onMaxBudgetChange: (value: string) => void;
}): JSX.Element {
  const [budgetState, setBudgetState] = useState(() =>
    createBudgetFieldState(minBudget, maxBudget),
  );

  const updateInputRange = (key: keyof BudgetInputRange, value: number | null): void => {
    setBudgetState((currentState) => ({
      ...currentState,
      inputRange: { ...currentState.inputRange, [key]: value },
    }));
  };

  const commitRange = (range: BudgetRange): void => {
    setBudgetState({ range, inputRange: getBudgetInputRange(range) });
    onMinBudgetChange(String(getBudgetInputValue(range.minAmount)));
    onMaxBudgetChange(String(getBudgetInputValue(range.maxAmount)));
  };

  return (
    <Box className="gap-008 flex w-full flex-col items-start">
      <Text variant="body-xl" className="text-text-medium">
        총 예산
      </Text>
      <BudgetRangeControl
        range={budgetState.range}
        inputRange={budgetState.inputRange}
        onMinInputValueChange={(value) => updateInputRange('minInputValue', value)}
        onMaxInputValueChange={(value) => updateInputRange('maxInputValue', value)}
        onMinInputValueCommit={(value) => {
          const committedValue = commitBudgetInputValue(value);
          const minAmount = clampBudgetMinAmount(
            committedValue.amount,
            budgetState.range.maxAmount,
          );

          commitRange({ ...budgetState.range, minAmount });
        }}
        onMaxInputValueCommit={(value) => {
          if (value === null) {
            commitRange({ minAmount: 0, maxAmount: 0 });
            return;
          }

          const committedValue = commitBudgetInputValue(value);
          const maxAmount = clampBudgetMaxAmount(
            committedValue.amount,
            budgetState.range.minAmount,
          );

          commitRange({ ...budgetState.range, maxAmount });
        }}
        onSliderRangePreviewChange={(range) =>
          setBudgetState({ range, inputRange: getBudgetInputRange(range) })
        }
        onSliderRangeChange={commitRange}
      />
    </Box>
  );
}

type BudgetFieldState = {
  range: BudgetRange;
  inputRange: BudgetInputRange;
};

function createBudgetFieldState(minBudget: string, maxBudget: string): BudgetFieldState {
  const rawMinAmount = snapBudgetAmount(Number(minBudget));
  const rawMaxAmount = snapBudgetAmount(Number(maxBudget));
  const maxAmount = clampBudgetMaxAmount(rawMaxAmount, rawMinAmount);
  const range = {
    minAmount: clampBudgetMinAmount(rawMinAmount, maxAmount),
    maxAmount,
  } satisfies BudgetRange;

  return { range, inputRange: getBudgetInputRange(range) };
}

function getBudgetInputRange(range: BudgetRange): BudgetInputRange {
  return {
    minInputValue: getBudgetInputValue(range.minAmount),
    maxInputValue: getBudgetInputValue(range.maxAmount),
  };
}

function toDropdownOptions<T extends { label: string }>(
  options: readonly T[],
): readonly DropdownOption[] {
  return options.map((option) => ({ value: option.label, label: option.label }));
}

function toAdGoalOptions(options: readonly { label: string }[]): readonly DropdownOption[] {
  return toDropdownOptions(options).map((option) =>
    option.value === '구매·결제 전환' ? { ...option, value: '구매 전환' } : option,
  );
}
