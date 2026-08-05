/**
 * 추천 전용 연령대, 광고 경험, 8단계 답변 변환 규칙을 검증한다.
 */

import { createRecommendOnboardingDraft, type RecommendOnboardingDraft } from './onboarding-draft';
import {
  buildRecommendOnboardingAnswer,
  getRecommendOnboardingAnswerLabel,
  isAgeRangeOptionDisabled,
  isRecommendOnboardingStepComplete,
  toggleAgeRange,
} from './recommend-onboarding-rules';

function createCompleteRecommendDraft(
  overrides: Partial<RecommendOnboardingDraft> = {},
): RecommendOnboardingDraft {
  return {
    ...createRecommendOnboardingDraft(),
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
  describe('isRecommendOnboardingStepComplete', () => {
    it('주요 연령대는 하나 이상 선택되어야 완료된다', () => {
      expect(
        isRecommendOnboardingStepComplete(
          'age-ranges',
          createCompleteRecommendDraft({ ageRangeList: [] }),
        ),
      ).toBe(false);
      expect(
        isRecommendOnboardingStepComplete(
          'age-ranges',
          createCompleteRecommendDraft({ ageRangeList: ['UNKNOWN'] }),
        ),
      ).toBe(true);
    });

    it('광고 집행 경험은 선택값이 있어야 완료된다', () => {
      expect(
        isRecommendOnboardingStepComplete(
          'ad-experience',
          createCompleteRecommendDraft({ adExperienceType: undefined }),
        ),
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

  describe('buildRecommendOnboardingAnswer', () => {
    it('완료된 추천 Draft를 8단계 최종 답변으로 변환한다', () => {
      expect(buildRecommendOnboardingAnswer(createCompleteRecommendDraft())).toEqual({
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

    it('운영 경험 파일 업로드 정보를 최종 답변에 포함한다', () => {
      expect(
        buildRecommendOnboardingAnswer(
          createCompleteRecommendDraft({
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

    it('운영 경험 직접 입력 채널을 최종 답변에 포함한다', () => {
      expect(
        buildRecommendOnboardingAnswer(
          createCompleteRecommendDraft({
            adExperienceType: 'EXPERIENCED',
            performanceMode: 'MANUAL',
            performanceChannel: 'META_ADS',
          }),
        ).adExperience,
      ).toEqual({
        type: 'EXPERIENCED',
        performanceInput: {
          mode: 'MANUAL',
          channel: 'META_ADS',
        },
      });
    });

    it('운영 경험에서 건너뛴 성과 정보는 생략한다', () => {
      expect(
        buildRecommendOnboardingAnswer(
          createCompleteRecommendDraft({ adExperienceType: 'EXPERIENCED' }),
        ).adExperience,
      ).toEqual({ type: 'EXPERIENCED' });
    });

    it('필수 추천 step이 비어 있으면 예외를 던진다', () => {
      expect(() =>
        buildRecommendOnboardingAnswer(createCompleteRecommendDraft({ ageRangeList: [] })),
      ).toThrow('Recommend onboarding draft is incomplete: age-ranges');
    });
  });

  describe('getRecommendOnboardingAnswerLabel', () => {
    it('공통 선택지와 추천 전용 선택지를 표시 label로 변환한다', () => {
      const draft = createCompleteRecommendDraft();

      expect(getRecommendOnboardingAnswerLabel('category', draft)).toBe('쇼핑·커머스');
      expect(getRecommendOnboardingAnswerLabel('service-type', draft)).toBe('웹 서비스');
      expect(getRecommendOnboardingAnswerLabel('age-ranges', draft)).toBe('20대');
    });

    it('운영 경험과 직접 입력 채널을 함께 요약한다', () => {
      const draft = createCompleteRecommendDraft({
        adExperienceType: 'EXPERIENCED',
        performanceMode: 'MANUAL',
        performanceChannel: 'META_ADS',
      });

      expect(getRecommendOnboardingAnswerLabel('ad-experience', draft)).toBe(
        '광고를 운영해 봤어요 · 메타 광고',
      );
    });

    it('연령대 답변 label을 낮은 연령대부터 정렬한다', () => {
      const draft = createCompleteRecommendDraft({
        ageRangeList: ['FORTIES', 'TEENS', 'TWENTIES'],
      });

      expect(getRecommendOnboardingAnswerLabel('age-ranges', draft)).toBe('10대, 20대, 40대');
      expect(buildRecommendOnboardingAnswer(draft).ageRangeList).toEqual([
        'TEENS',
        'TWENTIES',
        'FORTIES',
      ]);
    });
  });
});
