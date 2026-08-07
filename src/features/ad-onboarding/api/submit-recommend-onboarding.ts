import { presignOnboardingPerformanceFiles, submitOnboarding } from '@/shared/api/generated';
import type {
  AdHistoryRequest,
  OnboardingSubmitResponse,
  PresignedFileUploadResult,
  SubmitOnboardingRequest,
} from '@/shared/api/generated/types.gen';
import type { RecommendOnboardingAnswer } from '@/features/ad-onboarding/model/onboarding-answer';
import {
  PERFORMANCE_CHANNEL_OPTION_LIST,
  type AgeRangeId,
  type AdGoalId,
} from '@/features/ad-onboarding/model/recommend-onboarding-options';
import type {
  CampaignPeriodId,
  CategoryId,
  ServiceTypeId,
} from '@/features/ad-onboarding/model/common-onboarding-options';

type ApiAgeBand = SubmitOnboardingRequest['targetAgeBands'][number];

const ALL_API_AGE_BANDS: ApiAgeBand[] = [
  'AGE_10S',
  'AGE_20S',
  'AGE_30S',
  'AGE_40S',
  'AGE_50S_PLUS',
];

const AGE_RANGE_MAP = {
  TEENS: 'AGE_10S',
  TWENTIES: 'AGE_20S',
  THIRTIES: 'AGE_30S',
  FORTIES: 'AGE_40S',
  FIFTIES_AND_OVER: 'AGE_50S_PLUS',
} as const satisfies Record<Exclude<AgeRangeId, 'UNKNOWN'>, ApiAgeBand>;

const CATEGORY_MAP = {
  GAME: 'GAME',
  ENTERTAINMENT: 'ENTERTAINMENT',
  EDUCATION: 'EDUCATION',
  SOCIAL_COMMUNITY: 'SOCIAL_COMMUNITY',
  LIFESTYLE: 'LIFESTYLE',
  HEALTH_FITNESS: 'HEALTH_FITNESS',
  FOOD_BEVERAGE: 'FOOD_BEVERAGE',
  SHOPPING_COMMERCE: 'SHOPPING_COMMERCE',
  FINANCE_FINTECH: 'FINANCE_FINTECH',
  BUSINESS_B2B: 'BUSINESS_B2B',
  MEDICAL_HEALTHCARE: 'MEDICAL_HEALTHCARE',
  TRAVEL_ACCOMMODATION: 'TRAVEL_ACCOMMODATION',
  MUSIC_MEDIA: 'MUSIC_MEDIA',
  PRODUCTIVITY_UTILITY: 'PRODUCTIVITY_UTILITY',
  SPORTS: 'SPORTS',
  NEWS_INFORMATION: 'NEWS_INFORMATION',
  OTHER: 'OTHERS',
} as const satisfies Record<CategoryId, SubmitOnboardingRequest['industry']>;

const SERVICE_TYPE_MAP = {
  MOBILE_APP: 'MOBILE_APP',
  WEB_SERVICE: 'WEB',
  APP_AND_WEB: 'WEB_AND_APP',
  OTHER: 'OTHER',
} as const satisfies Record<ServiceTypeId, SubmitOnboardingRequest['serviceType']>;

const AD_GOAL_MAP = {
  BRAND_AWARENESS: 'AWARENESS',
  VIDEO_VIRAL: 'VIDEO_VIEW',
  TRAFFIC: 'TRAFFIC',
  LEAD_GENERATION: 'LEAD',
  PURCHASE_CONVERSION: 'CONVERSION',
  APP_INSTALL: 'APP_INSTALL',
  IN_APP_ACTION: 'IN_APP_ACTION',
} as const satisfies Record<AdGoalId, SubmitOnboardingRequest['campaignObjective']>;

const CAMPAIGN_PERIOD_MAP = {
  UNDER_1_WEEK: 'LE_1W',
  TWO_TO_THREE_WEEKS: 'W2_3',
  ONE_MONTH: 'M1',
  TWO_TO_THREE_MONTHS: 'M2_3',
  OVER_THREE_MONTHS: 'GE_3M',
} as const satisfies Record<CampaignPeriodId, SubmitOnboardingRequest['period']>;

function mapAgeRangeList(ageRangeList: AgeRangeId[]): ApiAgeBand[] {
  if (ageRangeList.includes('UNKNOWN')) {
    return ALL_API_AGE_BANDS;
  }

  return ageRangeList.flatMap((ageRange) =>
    ageRange === 'UNKNOWN' ? [] : [AGE_RANGE_MAP[ageRange]],
  );
}

function getPerformanceChannelLabel(channelId: string): string {
  return (
    PERFORMANCE_CHANNEL_OPTION_LIST.find((option) => option.value === channelId)?.label ?? channelId
  );
}

function mapManualAdHistory(answer: RecommendOnboardingAnswer): AdHistoryRequest[] {
  const performanceInput =
    answer.adExperience.type === 'EXPERIENCED' ? answer.adExperience.performanceInput : undefined;

  if (performanceInput?.mode !== 'MANUAL') {
    return [];
  }

  return [{ channelNameRaw: getPerformanceChannelLabel(performanceInput.channel) }];
}

async function uploadPerformanceFile(
  file: File,
  presignedFile: PresignedFileUploadResult,
): Promise<string | undefined> {
  const response = await fetch(presignedFile.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': presignedFile.contentType,
      'x-amz-tagging': 'retain=pending',
    },
    body: file,
  });

  return response.ok ? presignedFile.key : undefined;
}

async function uploadPerformanceFileList(answer: RecommendOnboardingAnswer): Promise<string[]> {
  const performanceInput =
    answer.adExperience.type === 'EXPERIENCED' ? answer.adExperience.performanceInput : undefined;

  if (performanceInput?.mode !== 'UPLOAD') {
    return [];
  }

  const fileList = performanceInput.fileList.flatMap((uploadedFile) =>
    uploadedFile.file ? [uploadedFile.file] : [],
  );

  if (fileList.length === 0) {
    return [];
  }

  const presignedResponse = await presignOnboardingPerformanceFiles({
    body: {
      files: fileList.map((file) => ({
        fileName: file.name,
        fileSizeBytes: file.size,
      })),
    },
    throwOnError: true,
  });
  const presignedFileList = presignedResponse.data.data ?? [];
  const uploadResultList = await Promise.allSettled(
    fileList.map((file, index) => {
      const presignedFile = presignedFileList[index];

      if (!presignedFile) {
        return Promise.resolve(undefined);
      }

      return uploadPerformanceFile(file, presignedFile);
    }),
  );

  return uploadResultList.flatMap((result) =>
    result.status === 'fulfilled' && result.value ? [result.value] : [],
  );
}

export function createSubmitOnboardingRequest(
  answer: RecommendOnboardingAnswer,
  rawFileKeys: string[] = [],
): SubmitOnboardingRequest {
  return {
    serviceName: answer.serviceName,
    industry: CATEGORY_MAP[answer.category],
    serviceType: SERVICE_TYPE_MAP[answer.serviceType],
    targetAgeBands: mapAgeRangeList(answer.ageRangeList),
    campaignObjective: AD_GOAL_MAP[answer.adGoal],
    budgetMin: answer.budget.minAmount,
    budgetMax: answer.budget.maxAmount,
    period: CAMPAIGN_PERIOD_MAP[answer.campaignPeriod],
    adExperience: answer.adExperience.type === 'FIRST_TIME' ? 'NONE' : 'EXPERIENCED',
    adHistory: mapManualAdHistory(answer),
    rawFileKeys,
  };
}

export async function submitRecommendOnboarding(
  answer: RecommendOnboardingAnswer,
): Promise<OnboardingSubmitResponse> {
  const rawFileKeys = await uploadPerformanceFileList(answer);
  const response = await submitOnboarding({
    body: createSubmitOnboardingRequest(answer, rawFileKeys),
    throwOnError: true,
  });
  const responseData = response.data as { data: OnboardingSubmitResponse };

  return responseData.data;
}
