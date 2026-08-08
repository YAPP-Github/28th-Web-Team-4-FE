/**
 * 추천 단계 순서와 StepBar 진행률 계약을 검증한다.
 */

import {
  ONBOARDING_STEP_DEFINITION_MAP,
  RECOMMEND_ONBOARDING_PROGRESS_LABEL_LIST,
  RECOMMEND_ONBOARDING_STEP_ID_LIST,
  RECOMMEND_ONBOARDING_TOTAL_STEP_COUNT,
} from './onboarding-step';

describe('onboarding step configuration', () => {
  it('추천은 8개 질문과 0~100 진행률을 순서대로 사용한다', () => {
    expect(RECOMMEND_ONBOARDING_STEP_ID_LIST).toEqual([
      'service-name',
      'category',
      'service-type',
      'age-ranges',
      'ad-goal',
      'budget',
      'campaign-period',
      'ad-experience',
    ]);
    expect(RECOMMEND_ONBOARDING_TOTAL_STEP_COUNT).toBe(8);
    expect(RECOMMEND_ONBOARDING_PROGRESS_LABEL_LIST).toEqual([0, 12, 25, 37, 50, 62, 75, 87, 100]);
    expect(RECOMMEND_ONBOARDING_PROGRESS_LABEL_LIST).toHaveLength(
      RECOMMEND_ONBOARDING_TOTAL_STEP_COUNT + 1,
    );
  });

  it('Figma에서 변경된 단계 라벨과 질문 문구를 사용한다', () => {
    expect(ONBOARDING_STEP_DEFINITION_MAP.category.title).toBe('업종 선택');
    expect(ONBOARDING_STEP_DEFINITION_MAP['ad-goal'].question).toBe(
      '이번 광고를 통해 달성하고 싶은 가장 큰 목표는 무엇인가요?',
    );
    expect(ONBOARDING_STEP_DEFINITION_MAP.budget.title).toBe('광고 예산');
  });
});
