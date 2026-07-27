import {
  buildOnboardingAnswer,
  getAnswerLabel,
  isAgeRangeOptionDisabled,
  isStepComplete,
  toggleAgeRange,
} from './recommend-onboarding-rules';
import { INITIAL_ONBOARDING_DRAFT, type OnboardingDraft } from './recommend-onboarding-state';

function createCompleteDraft(overrides: Partial<OnboardingDraft> = {}): OnboardingDraft {
  return {
    ...INITIAL_ONBOARDING_DRAFT,
    serviceName: ' 채소집 ',
    category: 'SHOPPING_COMMERCE',
    serviceType: 'WEB_SERVICE',
    ageRangeList: ['TWENTIES'],
    adGoal: 'PURCHASE_CONVERSION',
    campaignPeriod: 'TWO_TO_THREE_MONTHS',
    adExperienceType: 'FIRST_TIME',
    ...overrides,
  };
}

describe('recommend onboarding rules', () => {
  describe('isStepComplete', () => {
    it('서비스 이름은 trim 후 빈 문자열이면 완료되지 않는다', () => {
      expect(isStepComplete('service-name', createCompleteDraft({ serviceName: '   ' }))).toBe(
        false,
      );
      expect(isStepComplete('service-name', createCompleteDraft({ serviceName: '채소집' }))).toBe(
        true,
      );
    });

    it('주요 연령대는 하나 이상 선택되어야 완료된다', () => {
      expect(isStepComplete('age-ranges', createCompleteDraft({ ageRangeList: [] }))).toBe(false);
      expect(isStepComplete('age-ranges', createCompleteDraft({ ageRangeList: ['UNKNOWN'] }))).toBe(
        true,
      );
    });

    it('예산 범위는 최소값이 최대값보다 크면 완료되지 않는다', () => {
      expect(
        isStepComplete(
          'budget',
          createCompleteDraft({
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
        isStepComplete(
          'budget',
          createCompleteDraft({
            budget: {
              minAmount: 0,
              maxAmount: 0,
            },
          }),
        ),
      ).toBe(false);
    });

    it('광고 집행 경험은 선택값이 있어야 완료된다', () => {
      expect(
        isStepComplete('ad-experience', createCompleteDraft({ adExperienceType: undefined })),
      ).toBe(false);
    });
  });

  describe('age range helpers', () => {
    it('일반 연령대가 선택되어 있으면 잘 모르겠어요를 disabled 처리한다', () => {
      expect(isAgeRangeOptionDisabled('UNKNOWN', ['TWENTIES'])).toBe(true);
      expect(isAgeRangeOptionDisabled('THIRTIES', ['TWENTIES'])).toBe(false);
    });

    it('잘 모르겠어요가 선택되어 있으면 일반 연령대를 disabled 처리한다', () => {
      expect(isAgeRangeOptionDisabled('TWENTIES', ['UNKNOWN'])).toBe(true);
      expect(isAgeRangeOptionDisabled('UNKNOWN', ['UNKNOWN'])).toBe(false);
    });

    it('disabled 옵션은 toggle해도 선택 목록이 바뀌지 않는다', () => {
      expect(toggleAgeRange(['TWENTIES'], 'UNKNOWN')).toEqual(['TWENTIES']);
      expect(toggleAgeRange(['UNKNOWN'], 'TWENTIES')).toEqual(['UNKNOWN']);
    });

    it('선택된 옵션은 다시 toggle하면 해제된다', () => {
      expect(toggleAgeRange(['TWENTIES', 'THIRTIES'], 'TWENTIES')).toEqual(['THIRTIES']);
      expect(toggleAgeRange(['UNKNOWN'], 'UNKNOWN')).toEqual([]);
    });
  });

  describe('buildOnboardingAnswer', () => {
    it('완료된 draft를 최종 답변으로 변환한다', () => {
      expect(buildOnboardingAnswer(createCompleteDraft())).toEqual({
        serviceName: '채소집',
        category: 'SHOPPING_COMMERCE',
        serviceType: 'WEB_SERVICE',
        ageRangeList: ['TWENTIES'],
        adGoal: 'PURCHASE_CONVERSION',
        budget: { minAmount: 0, maxAmount: 10000000 },
        campaignPeriod: 'TWO_TO_THREE_MONTHS',
        adExperience: { type: 'FIRST_TIME' },
      });
    });

    it('예산은 확정된 최소·최대 범위로 변환한다', () => {
      expect(
        buildOnboardingAnswer(
          createCompleteDraft({
            budget: {
              minAmount: 2000000,
              maxAmount: 5000000,
            },
          }),
        ).budget,
      ).toEqual({ minAmount: 2000000, maxAmount: 5000000 });
    });

    it('운영 경험 파일 업로드 정보를 최종 답변에 포함한다', () => {
      expect(
        buildOnboardingAnswer(
          createCompleteDraft({
            adExperienceType: 'EXPERIENCED',
            performanceMode: 'UPLOAD',
            performanceFileList: [{ id: '1', name: 'report.csv', size: 1000 }],
          }),
        ).adExperience,
      ).toEqual({
        type: 'EXPERIENCED',
        performanceInput: {
          mode: 'UPLOAD',
          fileList: [{ id: '1', name: 'report.csv', size: 1000 }],
        },
      });
    });

    it('운영 경험에서 건너뛴 성과 정보는 생략한다', () => {
      expect(
        buildOnboardingAnswer(createCompleteDraft({ adExperienceType: 'EXPERIENCED' }))
          .adExperience,
      ).toEqual({ type: 'EXPERIENCED' });
    });

    it('필수 step이 비어 있으면 예외를 던진다', () => {
      expect(() => buildOnboardingAnswer(createCompleteDraft({ category: undefined }))).toThrow(
        'Recommend onboarding draft is incomplete: category',
      );
    });
  });

  describe('getAnswerLabel', () => {
    it('선택지 value를 표시 label로 변환한다', () => {
      const draft = createCompleteDraft();

      expect(getAnswerLabel('category', draft)).toBe('쇼핑·커머스');
      expect(getAnswerLabel('service-type', draft)).toBe('웹 서비스');
      expect(getAnswerLabel('age-ranges', draft)).toBe('20대');
    });

    it('범위 예산과 운영 경험 요약 label을 만든다', () => {
      const draft = createCompleteDraft({
        budget: {
          minAmount: 500000,
          maxAmount: 10000000,
        },
        adExperienceType: 'EXPERIENCED',
        performanceMode: 'MANUAL',
        performanceChannel: 'META_ADS',
      });

      expect(getAnswerLabel('budget', draft)).toBe('50만 원~1,000만 원');
      expect(getAnswerLabel('ad-experience', draft)).toBe('광고를 운영해 봤어요 · 메타 광고');
    });
  });
});
