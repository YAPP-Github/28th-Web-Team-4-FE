/**
 * 광고 온보딩 feature가 페이지에 공개하는 최소 public API다.
 * 질문 옵션, Draft, 규칙, 세부 UI는 슬라이스 내부 구현으로 유지한다.
 */

export type { RecommendOnboardingAnswer } from './model/onboarding-answer';
export {
  useRecommendOnboardingStore,
  type RecommendOnboardingStore,
} from './model/recommend-onboarding-store';
