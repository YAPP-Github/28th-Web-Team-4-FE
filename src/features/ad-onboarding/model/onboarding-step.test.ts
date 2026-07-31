/**
 * 추천·시뮬레이터 단계 순서와 StepBar 진행률 계약을 검증한다.
 */

import {
  RECOMMEND_ONBOARDING_PROGRESS_LABEL_LIST,
  RECOMMEND_ONBOARDING_STEP_ID_LIST,
  RECOMMEND_ONBOARDING_TOTAL_STEP_COUNT,
  SIMULATOR_ONBOARDING_PROGRESS_LABEL_LIST,
  SIMULATOR_ONBOARDING_STEP_ID_LIST,
  SIMULATOR_ONBOARDING_TOTAL_STEP_COUNT,
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

  it('시뮬레이터는 age-ranges 없이 budget을 포함한 5개 질문을 사용한다', () => {
    expect(SIMULATOR_ONBOARDING_STEP_ID_LIST).toEqual([
      'service-name',
      'category',
      'service-type',
      'budget',
      'campaign-period',
    ]);
    expect(SIMULATOR_ONBOARDING_STEP_ID_LIST).not.toContain('age-ranges');
    expect(SIMULATOR_ONBOARDING_STEP_ID_LIST).not.toContain('ad-goal');
    expect(SIMULATOR_ONBOARDING_STEP_ID_LIST).not.toContain('ad-experience');
    expect(SIMULATOR_ONBOARDING_TOTAL_STEP_COUNT).toBe(5);
    expect(SIMULATOR_ONBOARDING_PROGRESS_LABEL_LIST).toEqual([0, 20, 40, 60, 80, 100]);
    expect(SIMULATOR_ONBOARDING_PROGRESS_LABEL_LIST).toHaveLength(
      SIMULATOR_ONBOARDING_TOTAL_STEP_COUNT + 1,
    );
  });
});
