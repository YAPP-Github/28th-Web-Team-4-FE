/**
 * 추천 전용 8단계 Draft 검증, 연령대 선택, label, 완료 답변 변환 규칙이다.
 */

import {
  getCommonOnboardingAnswerLabel,
  getOnboardingOptionLabel,
  isCommonOnboardingStepComplete,
} from './common-onboarding-rules';
import type { RecommendOnboardingAnswer, PerformanceInput } from './onboarding-answer';
import type { RecommendOnboardingDraft } from './onboarding-draft';
import {
  RECOMMEND_ONBOARDING_STEP_ID_LIST,
  type RecommendOnboardingStepId,
} from './onboarding-step';
import {
  AD_EXPERIENCE_OPTION_LIST,
  AD_GOAL_OPTION_LIST,
  AGE_RANGE_OPTION_LIST,
  PERFORMANCE_CHANNEL_OPTION_LIST,
  UNKNOWN_AGE_RANGE_ID,
  type AgeRangeId,
} from './recommend-onboarding-options';

/**
 * 현재 step의 필수 입력이 채워져 다음으로 진행 가능한지 판단한다.
 *
 * @param stepId 완료 여부를 확인할 온보딩 step id
 * @param draft 현재 온보딩 입력 상태
 * @returns 해당 step의 필수 입력 충족 여부
 */
export function isRecommendOnboardingStepComplete(
  stepId: RecommendOnboardingStepId,
  draft: RecommendOnboardingDraft,
): boolean {
  switch (stepId) {
    case 'service-name':
    case 'category':
    case 'service-type':
    case 'budget':
    case 'campaign-period':
      return isCommonOnboardingStepComplete(stepId, draft);
    case 'age-ranges':
      return draft.ageRangeList.length > 0;
    case 'ad-goal':
      return Boolean(draft.adGoal);
    case 'ad-experience':
      return Boolean(draft.adExperienceType);
  }
}

/**
 * UNKNOWN과 일반 연령대가 동시에 선택되지 않도록 특정 선택지를 disabled 처리할지 판단한다.
 *
 * @param option disabled 여부를 확인할 연령대 선택지
 * @param selectedList 현재 선택된 연령대 목록
 * @returns 해당 선택지를 비활성화해야 하는지 여부
 */
export function isAgeRangeOptionDisabled(option: AgeRangeId, selectedList: AgeRangeId[]): boolean {
  if (option === UNKNOWN_AGE_RANGE_ID) {
    const hasSpecificAgeRange = selectedList.some((selectedOption) => selectedOption !== 'UNKNOWN');

    return hasSpecificAgeRange;
  }

  const hasUnknown = selectedList.includes(UNKNOWN_AGE_RANGE_ID);

  return hasUnknown;
}

/**
 * 주요 연령대 선택/해제를 처리하되 disabled 상태의 선택지는 변경하지 않는다.
 *
 * @param selectedList 현재 선택된 연령대 목록
 * @param option 사용자가 누른 연령대 선택지
 * @returns 다음 연령대 선택 목록
 */
export function toggleAgeRange(selectedList: AgeRangeId[], option: AgeRangeId): AgeRangeId[] {
  if (selectedList.includes(option)) {
    return selectedList.filter((selectedOption) => selectedOption !== option);
  }

  if (isAgeRangeOptionDisabled(option, selectedList)) {
    return [...selectedList];
  }

  return [...selectedList, option];
}

/**
 * 입력 중 draft를 결과 페이지와 store에 저장할 수 있는 확정 답변으로 변환한다.
 *
 * @param draft 현재 온보딩 입력 상태
 * @returns 모든 필수값이 채워진 최종 온보딩 답변
 */
export function buildRecommendOnboardingAnswer(
  draft: RecommendOnboardingDraft,
): RecommendOnboardingAnswer {
  assertRecommendOnboardingDraftComplete(draft);

  return {
    serviceName: draft.serviceName.trim(),
    category: draft.category,
    serviceType: draft.serviceType,
    ageRangeList: draft.ageRangeList,
    adGoal: draft.adGoal,
    budget: draft.budget,
    campaignPeriod: draft.campaignPeriod,
    adExperience: buildAdExperienceAnswer(draft),
  };
}

/**
 * 완료된 step의 답변 버블에 표시할 label을 draft 상태에서 계산한다.
 *
 * @param stepId label을 만들 온보딩 step id
 * @param draft 현재 온보딩 입력 상태
 * @returns 답변 버블에 표시할 문자열
 */
export function getRecommendOnboardingAnswerLabel(
  stepId: RecommendOnboardingStepId,
  draft: RecommendOnboardingDraft,
): string {
  switch (stepId) {
    case 'service-name':
    case 'category':
    case 'service-type':
    case 'budget':
    case 'campaign-period':
      return getCommonOnboardingAnswerLabel(stepId, draft);
    case 'age-ranges':
      return draft.ageRangeList
        .map((ageRange) => getOnboardingOptionLabel(AGE_RANGE_OPTION_LIST, ageRange))
        .join(', ');
    case 'ad-goal':
      return getOnboardingOptionLabel(AD_GOAL_OPTION_LIST, draft.adGoal);
    case 'ad-experience':
      return getAdExperienceAnswerLabel(draft);
  }
}

/**
 * 완료 답변 변환 전에 런타임 검증을 수행하고 이후 optional 필드를 필수로 좁힌다.
 *
 * `asserts draft is ...`는 함수가 정상 종료되면 TypeScript가 draft의 optional 필드를
 * 필수값으로 취급하도록 알려주는 assertion signature다.
 *
 * @param draft 현재 온보딩 입력 상태
 * @throws 완료되지 않은 step이 있으면 해당 step id를 포함한 Error를 던진다.
 */
function assertRecommendOnboardingDraftComplete(
  draft: RecommendOnboardingDraft,
): asserts draft is RecommendOnboardingDraft & {
  category: NonNullable<RecommendOnboardingDraft['category']>;
  serviceType: NonNullable<RecommendOnboardingDraft['serviceType']>;
  adGoal: NonNullable<RecommendOnboardingDraft['adGoal']>;
  campaignPeriod: NonNullable<RecommendOnboardingDraft['campaignPeriod']>;
  adExperienceType: NonNullable<RecommendOnboardingDraft['adExperienceType']>;
} {
  const incompleteStepId = RECOMMEND_ONBOARDING_STEP_ID_LIST.find(
    (stepId) => !isRecommendOnboardingStepComplete(stepId, draft),
  );

  if (incompleteStepId) {
    throw new Error(`Recommend onboarding draft is incomplete: ${incompleteStepId}`);
  }
}

/**
 * 광고 집행 경험 draft 필드를 성과 입력 포함 여부에 맞춰 최종 답변 union으로 접는다.
 *
 * @param draft 현재 온보딩 입력 상태
 * @returns 최종 답변의 광고 집행 경험 필드
 */
function buildAdExperienceAnswer(
  draft: RecommendOnboardingDraft,
): RecommendOnboardingAnswer['adExperience'] {
  if (draft.adExperienceType === 'FIRST_TIME') {
    return { type: 'FIRST_TIME' };
  }

  const performanceInput = getPerformanceInput(draft);

  if (!performanceInput) {
    return { type: 'EXPERIENCED' };
  }

  return { type: 'EXPERIENCED', performanceInput };
}

/**
 * 광고 집행 경험이 있을 때 업로드/직접 입력 중 실제로 입력된 성과 정보만 추출한다.
 *
 * @param draft 현재 온보딩 입력 상태
 * @returns 최종 답변에 포함할 성과 입력 정보
 */
function getPerformanceInput(draft: RecommendOnboardingDraft): PerformanceInput | undefined {
  if (draft.performanceMode === 'UPLOAD' && draft.performanceFileList.length > 0) {
    return {
      mode: 'UPLOAD',
      fileList: draft.performanceFileList,
    };
  }

  if (draft.performanceMode === 'MANUAL' && draft.performanceChannel) {
    return {
      mode: 'MANUAL',
      channel: draft.performanceChannel,
    };
  }

  return undefined;
}

/**
 * 광고 집행 경험 답변에 파일 개수나 수동 입력 채널을 덧붙여 요약 label을 만든다.
 *
 * @param draft 현재 온보딩 입력 상태
 * @returns 광고 집행 경험 답변 표시 문자열
 */
function getAdExperienceAnswerLabel(draft: RecommendOnboardingDraft): string {
  const label = getOnboardingOptionLabel(AD_EXPERIENCE_OPTION_LIST, draft.adExperienceType);

  if (draft.adExperienceType !== 'EXPERIENCED') {
    return label;
  }

  const performanceInput = getPerformanceInput(draft);

  if (performanceInput?.mode === 'UPLOAD') {
    return `${label} · 파일 ${performanceInput.fileList.length}개`;
  }

  if (performanceInput?.mode === 'MANUAL') {
    return `${label} · ${getOnboardingOptionLabel(
      PERFORMANCE_CHANNEL_OPTION_LIST,
      performanceInput.channel,
    )}`;
  }

  return label;
}
