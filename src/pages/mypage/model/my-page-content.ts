import type { MyOnboardingTagResponse } from '@/shared/api/generated/types.gen';
import { getRecommendationCategoryLabel } from '@/shared/lib/recommendation-labels';

export type MyAdsCondition = {
  /** 온보딩 답변을 마이페이지에서 보여줄 수 있는 형태로 가공한 태그 목록. */
  tags: readonly string[];
};

export type SavedRecommendation = {
  /** 추천 결과 상세 페이지로 이동할 때 사용하는 온보딩 식별자. */
  onboardingId: string;
  /** 사용자가 온보딩에서 입력한 서비스명. */
  title: string;
  /** 마지막 추천 일시를 화면에 표시할 문자열. */
  lastRecommendedAt: string;
  /** 추천 결과에 포함된 채널명 목록. */
  channelNames: readonly string[];
};

const SERVICE_TYPE_LABELS: Record<MyOnboardingTagResponse['serviceType'], string> = {
  MOBILE_APP: '모바일 앱',
  WEB: '웹 서비스',
  WEB_AND_APP: '앱 + 웹 모두',
  OTHER: '기타',
};

const AGE_BAND_LABELS: Record<MyOnboardingTagResponse['targetAgeBands'][number], string> = {
  AGE_10S: '10대',
  AGE_20S: '20대',
  AGE_30S: '30대',
  AGE_40S: '40대',
  AGE_50S_PLUS: '50대 이상',
  UNDECIDED: '잘 모르겠어요',
};

const AGE_BAND_ORDER = [
  'AGE_10S',
  'AGE_20S',
  'AGE_30S',
  'AGE_40S',
  'AGE_50S_PLUS',
  'UNDECIDED',
] as const satisfies readonly MyOnboardingTagResponse['targetAgeBands'][number][];

const CAMPAIGN_OBJECTIVE_LABELS: Record<MyOnboardingTagResponse['campaignObjective'], string> = {
  AWARENESS: '브랜드 인지·노출 확대',
  VIDEO_VIEW: '영상 조회·바이럴 확산',
  TRAFFIC: '클릭·트래픽 유입',
  LEAD: '회원가입·리드 수집',
  CONVERSION: '구매 전환',
  APP_INSTALL: '앱 설치',
  IN_APP_ACTION: '인앱 구매·행동',
};

const PERIOD_LABELS: Record<MyOnboardingTagResponse['period'], string> = {
  LE_1W: '1주 이하',
  W2_3: '2~3주',
  M1: '1개월',
  M2_3: '2~3개월',
  GE_3M: '3개월 이상',
};

/** 최신 온보딩 태그의 연령대 목록을 마이페이지 표시 문자열로 변환한다. */
function formatAgeBandLabel(ageBands: MyOnboardingTagResponse['targetAgeBands']): string {
  if (ageBands.includes('UNDECIDED')) {
    return AGE_BAND_LABELS.UNDECIDED;
  }

  const selectedAgeBands = new Set(ageBands);

  if (
    selectedAgeBands.size === 2 &&
    selectedAgeBands.has('AGE_30S') &&
    selectedAgeBands.has('AGE_40S')
  ) {
    return '30~40대';
  }

  return AGE_BAND_ORDER.filter((ageBand) => selectedAgeBands.has(ageBand))
    .map((ageBand) => AGE_BAND_LABELS[ageBand])
    .join(', ');
}

function formatBudgetAmount(amount: number): string {
  if (amount % 10_000 === 0) {
    return `${(amount / 10_000).toLocaleString('ko-KR')}만 원`;
  }

  return `${amount.toLocaleString('ko-KR')}원`;
}

/** 최신 온보딩 태그의 예산 범위를 기존 마이페이지 태그 형식으로 변환한다. */
function formatBudgetLabel(data: MyOnboardingTagResponse): string {
  if (data.budgetMax === null) {
    return '예산 미정';
  }

  const minBudget = data.budgetMin ?? data.budgetMax;

  return minBudget === data.budgetMax
    ? `총 ${formatBudgetAmount(data.budgetMax)}`
    : `총 ${formatBudgetAmount(minBudget)}~${formatBudgetAmount(data.budgetMax)}`;
}

/** API 온보딩 태그 응답을 마이페이지 광고 조건 카드 데이터로 변환한다. */
export function createMyAdsCondition(data: MyOnboardingTagResponse): MyAdsCondition | undefined {
  if (!data.hasOnboarding) {
    return undefined;
  }

  return {
    tags: [
      getRecommendationCategoryLabel(data.industry),
      SERVICE_TYPE_LABELS[data.serviceType],
      formatAgeBandLabel(data.targetAgeBands),
      CAMPAIGN_OBJECTIVE_LABELS[data.campaignObjective],
      formatBudgetLabel(data),
      PERIOD_LABELS[data.period],
    ],
  };
}
