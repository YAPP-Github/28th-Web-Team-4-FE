/**
 * 추천 광고 온보딩 완료 답변 계약을 정의한다.
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
  ManualPerformanceChannel,
  UploadedPerformanceFile,
} from './recommend-onboarding-options';

/** 추천 온보딩이 공통으로 확정하는 5개 답변. */
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
      channelList: ManualPerformanceChannel[];
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
