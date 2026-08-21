/**
 * 추천 온보딩 공통 5단계 검증과 답변 label 규칙을 검증한다.
 */

import {
  getCommonOnboardingAnswerLabel,
  isCommonOnboardingStepComplete,
  isServiceNameComplete,
} from './common-onboarding-rules';
import { MAX_ONBOARDING_SERVICE_NAME_LENGTH } from './common-onboarding-options';
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

    it('서비스 이름은 trim 후 50자까지만 완료로 본다', () => {
      const validServiceName = '가'.repeat(MAX_ONBOARDING_SERVICE_NAME_LENGTH);
      const invalidServiceName = '가'.repeat(MAX_ONBOARDING_SERVICE_NAME_LENGTH + 1);

      expect(
        isCommonOnboardingStepComplete(
          'service-name',
          createCompleteCommonDraft({ serviceName: validServiceName }),
        ),
      ).toBe(true);
      expect(
        isCommonOnboardingStepComplete(
          'service-name',
          createCompleteCommonDraft({ serviceName: invalidServiceName }),
        ),
      ).toBe(false);
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

  describe('isServiceNameComplete', () => {
    it('trim 후 1자 이상 50자 이하만 유효하다', () => {
      expect(isServiceNameComplete(' 채소집 ')).toBe(true);
      expect(isServiceNameComplete(' '.repeat(3))).toBe(false);
      expect(isServiceNameComplete(` ${'가'.repeat(MAX_ONBOARDING_SERVICE_NAME_LENGTH)} `)).toBe(
        true,
      );
      expect(isServiceNameComplete('가'.repeat(MAX_ONBOARDING_SERVICE_NAME_LENGTH + 1))).toBe(
        false,
      );
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
