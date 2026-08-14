import { josa } from 'es-hangul';

import type { RecommendationBasisResponse } from '@/shared/api/generated';
import { getRecommendationCategoryLabel } from '@/shared/lib/recommendation-labels';

import type { ChannelRecommendationReason } from '@/features/channel-detail/model/channel-detail';

const OBJECTIVE_LABELS: Record<RecommendationBasisResponse['objective'], string> = {
  AWARENESS: '브랜드 인지',
  VIDEO_VIEW: '영상 조회',
  TRAFFIC: '트래픽 유입',
  LEAD: '리드 수집',
  CONVERSION: '구매 전환',
  APP_INSTALL: '앱 설치',
  IN_APP_ACTION: '인앱 행동',
};

function formatWon(value: number): string {
  if (value >= 10_000 && value % 10_000 === 0) {
    return `${(value / 10_000).toLocaleString('ko-KR')}만 원`;
  }

  return `${value.toLocaleString('ko-KR')}원`;
}

function formatBudgetRange(budgetMin: number, budgetMax: number): string {
  if (budgetMin === budgetMax) {
    return formatWon(budgetMin);
  }

  return `${formatWon(budgetMin)}~${formatWon(budgetMax)}`;
}

function getNonEmptyText(value?: string | null): string | null {
  const trimmedValue = value?.trim();
  return trimmedValue && trimmedValue.length > 0 ? trimmedValue : null;
}

/** 추천 근거를 UI에서 강조·조립할 수 있는 표시 값으로 변환한다. */
export function createRecommendationReason(
  basis: RecommendationBasisResponse | null | undefined,
  rationale?: string | null,
): ChannelRecommendationReason | null {
  if (!basis) {
    return null;
  }

  const objective = OBJECTIVE_LABELS[basis.objective];
  const category = getRecommendationCategoryLabel(basis.category);

  return {
    category,
    objective,
    objectiveWithParticle: josa(objective, '을/를'),
    budget: formatBudgetRange(basis.budgetMin, basis.budgetMax),
    rationale: getNonEmptyText(rationale),
  };
}
