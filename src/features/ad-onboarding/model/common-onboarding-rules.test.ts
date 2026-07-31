/**
 * 추천과 시뮬레이터가 공유하는 5단계 검증과 시뮬레이터 답변 계약을 검증한다.
 */

import {
  buildSimulatorOnboardingAnswer,
  getCommonOnboardingAnswerLabel,
  isCommonOnboardingStepComplete,
} from './common-onboarding-rules';
import { createSimulatorOnboardingDraft, type SimulatorOnboardingDraft } from './onboarding-draft';

function createCompleteSimulatorDraft(
  overrides: Partial<SimulatorOnboardingDraft> = {},
): SimulatorOnboardingDraft {
  return {
    ...createSimulatorOnboardingDraft(),
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
          createCompleteSimulatorDraft({ serviceName: '   ' }),
        ),
      ).toBe(false);
      expect(
        isCommonOnboardingStepComplete(
          'service-name',
          createCompleteSimulatorDraft({ serviceName: '채소집' }),
        ),
      ).toBe(true);
    });

    it('예산 범위는 최소값이 최대값보다 크면 완료되지 않는다', () => {
      expect(
        isCommonOnboardingStepComplete(
          'budget',
          createCompleteSimulatorDraft({
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
          createCompleteSimulatorDraft({
            budget: {
              minAmount: 0,
              maxAmount: 0,
            },
          }),
        ),
      ).toBe(false);
    });
  });

  describe('buildSimulatorOnboardingAnswer', () => {
    it('budget을 포함한 공통 5개 필드만 시뮬레이터 답변으로 만든다', () => {
      const answer = buildSimulatorOnboardingAnswer(
        createCompleteSimulatorDraft({
          budget: {
            minAmount: 2000000,
            maxAmount: 5000000,
          },
        }),
      );

      expect(answer).toEqual({
        serviceName: '채소집',
        category: 'SHOPPING_COMMERCE',
        serviceType: 'WEB_SERVICE',
        budget: {
          minAmount: 2000000,
          maxAmount: 5000000,
        },
        campaignPeriod: 'TWO_TO_THREE_MONTHS',
      });
      expect(answer).not.toHaveProperty('ageRangeList');
      expect(answer).not.toHaveProperty('adGoal');
      expect(answer).not.toHaveProperty('adExperience');
    });

    it('공통 필수 step이 비어 있으면 예외를 던진다', () => {
      expect(() =>
        buildSimulatorOnboardingAnswer(createCompleteSimulatorDraft({ category: undefined })),
      ).toThrow('Simulator onboarding draft is incomplete: category');
    });
  });

  describe('getCommonOnboardingAnswerLabel', () => {
    it('공통 선택지와 예산 범위를 표시 label로 변환한다', () => {
      const draft = createCompleteSimulatorDraft({
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
