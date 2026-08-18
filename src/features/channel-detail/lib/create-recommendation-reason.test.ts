import type { RecommendationBasisResponse } from '@/shared/api/generated';

import { createRecommendationReason } from './create-recommendation-reason';

const trafficBasis = {
  objective: 'TRAFFIC',
  category: 'SHOPPING_COMMERCE',
  budgetMin: 3_000_000,
  budgetMax: 10_000_000,
} as const satisfies RecommendationBasisResponse;

describe('createRecommendationReason', () => {
  it('목적·업종·예산을 프론트 조립용 표시 값으로 변환한다', () => {
    expect(createRecommendationReason(trafficBasis)).toEqual({
      category: '쇼핑·커머스',
      objective: '트래픽 유입',
      objectiveWithParticle: '트래픽 유입을',
      budget: '300만 원~1,000만 원',
      rationale:
        '관심사에 맞는 고객에게 광고를 노출해 사이트 방문으로 이어질 가능성이 가장 높으므로',
    });
  });

  it('recommendationBasis만으로 추천 이유의 고정 설명을 조립한다', () => {
    expect(
      createRecommendationReason({
        objective: 'CONVERSION',
        category: 'SHOPPING_COMMERCE',
        budgetMin: 500_000,
        budgetMax: 500_000,
      }),
    ).toEqual({
      category: '쇼핑·커머스',
      objective: '구매 전환',
      objectiveWithParticle: '구매 전환을',
      budget: '50만 원',
      rationale: '관심사에 맞는 고객에게 광고를 노출해 구매로 이어질 가능성이 가장 높으므로',
    });
  });

  it('추천 근거가 없으면 문장을 만들지 않는다', () => {
    expect(createRecommendationReason(null)).toBeNull();
  });
});
