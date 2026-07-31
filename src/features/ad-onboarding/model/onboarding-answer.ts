/**
 * 광고 온보딩 변형별 완료 답변 계약을 정의한다.
 */

import type {
  BudgetRange,
  CampaignPeriodId,
  CategoryId,
  ServiceTypeId,
} from './common-onboarding-options';
import type {
  AdExperienceType,
  AdGoalId,
  AgeRangeId,
  PerformanceChannelId,
  UploadedPerformanceFile,
} from './recommend-onboarding-options';

/** 추천과 시뮬레이터가 공통으로 확정하는 5개 답변. */
export type CommonOnboardingAnswer = {
  serviceName: string;
  category: CategoryId;
  serviceType: ServiceTypeId;
  budget: BudgetRange;
  campaignPeriod: CampaignPeriodId;
};

/** 광고 운영 경험이 있을 때 선택적으로 첨부되는 성과 정보. */
export type PerformanceInput =
  | {
      mode: 'UPLOAD';
      fileList: UploadedPerformanceFile[];
    }
  | {
      mode: 'MANUAL';
      channel: PerformanceChannelId;
    };

/** 추천 온보딩에서 확정하는 광고 운영 경험 답변. */
export type AdExperienceAnswer =
  | { type: Extract<AdExperienceType, 'FIRST_TIME'> }
  | {
      type: Extract<AdExperienceType, 'EXPERIENCED'>;
      performanceInput?: PerformanceInput;
    };

/** 추천 8단계 완료 후 제출하는 확정 답변. */
export type RecommendOnboardingAnswer = CommonOnboardingAnswer & {
  ageRangeList: AgeRangeId[];
  adGoal: AdGoalId;
  adExperience: AdExperienceAnswer;
};

/**
 * 시뮬레이터 5단계 완료 후 제출하는 확정 답변.
 *
 * 광고 예산을 포함하며 ageRangeList, adGoal, adExperience는 포함하지 않는다.
 */
export type SimulatorOnboardingAnswer = CommonOnboardingAnswer;
