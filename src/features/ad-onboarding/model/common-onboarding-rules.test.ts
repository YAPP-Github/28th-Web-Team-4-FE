/**
 * 추천 온보딩 공통 5단계 검증과 답변 label 규칙을 검증한다.
 */

import {
  getCommonOnboardingAnswerLabel,
  isCommonOnboardingStepComplete,
} from './common-onboarding-rules';
import { createCommonOnboardingDraft, type CommonOnboardingDraft } from './onboarding-draft';

function createCompleteCommonDraft(
  overrides: Partial<CommonOnboardingDraft> = {},
): CommonOnboardingDraft {
  return {
    ...createCommonOnboardingDraft(),
    serviceName: ' 채소집 ',
    category: 'SHOPPING_COMMERCE',
    serviceType: 'WEB_SERVICE',
    campaignPeriod: 'TWO_TO_THREE_MONTHS',
    ...overrides,
  };
}

describe('common onboarding rules', () => {
  describe('isCommonOnboardingStepComplete', () => {
    it('서비스 이름은 trim 후 빈 문자열이면 완료되지 않는다', () => {
      expect(
        isCommonOnboardingStepComplete(
          'service-name',
          createCompleteCommonDraft({ serviceName: '   ' }),
        ),
      ).toBe(false);
      expect(
        isCommonOnboardingStepComplete(
          'service-name',
          createCompleteCommonDraft({ serviceName: '채소집' }),
        ),
      ).toBe(true);
    });

    it('예산 범위는 최소값이 최대값보다 크면 완료되지 않는다', () => {
      expect(
        isCommonOnboardingStepComplete(
          'budget',
          createCompleteCommonDraft({
            budget: {
              minAmount: 5000000,
              maxAmount: 2000000,
            },
          }),
        ),
      ).toBe(false);
    });

    it('최소·최대 예산이 모두 0원이면 완료되지 않는다', () => {
      expect(
        isCommonOnboardingStepComplete(
          'budget',
          createCompleteCommonDraft({
            budget: {
              minAmount: 0,
              maxAmount: 0,
            },
          }),
        ),
      ).toBe(false);
    });
  });

  describe('getCommonOnboardingAnswerLabel', () => {
    it('공통 선택지와 예산 범위를 표시 label로 변환한다', () => {
      const draft = createCompleteCommonDraft({
        budget: {
          minAmount: 500000,
          maxAmount: 10000000,
        },
      });

      expect(getCommonOnboardingAnswerLabel('category', draft)).toBe('쇼핑·커머스');
      expect(getCommonOnboardingAnswerLabel('service-type', draft)).toBe('웹 서비스');
      expect(getCommonOnboardingAnswerLabel('budget', draft)).toBe('50만 원~1,000만 원');
    });
  });
});
