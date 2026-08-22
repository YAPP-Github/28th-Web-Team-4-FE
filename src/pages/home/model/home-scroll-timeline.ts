import type { HeaderToneTheme } from '@/shared/lib/hero-header-tone';

export const HOME_HERO_REVEAL_THRESHOLD = 0.22;

// `400vh` 질문 섹션의 실제 sticky 이동 거리는 `300vh`다. 각 단계에 약 42vh를
// 배정해 한 번의 짧은 휠 입력이 여러 문장을 건너뛰지 않도록 한다.
export const HOME_QUESTION_TIMELINE = {
  doorOpen: 0.02,
  firstWorry: 0.2,
  secondWorry: 0.34,
  thirdWorry: 0.48,
  brand: 0.62,
} as const;

// 헤더는 `end start` 기준이라 400vh 전체를 진행률 1로 본다. 콘텐츠 brand 시점은
// sticky 거리 기준이므로 `0.62 * (400 - 100) / 400 = 0.465`로 환산한다.
export const HOME_QUESTION_HEADER_TIMELINE = {
  dark: 0.015,
  orange: 0.465,
  white: 0.99,
} as const;

export type HomeQuestionStep = -1 | 0 | 1 | 2 | 3;

function clampProgress(progress: number): number {
  return Math.min(Math.max(progress, 0), 1);
}

export function resolveHomeHeroRevealed(progress: number): boolean {
  return clampProgress(progress) >= HOME_HERO_REVEAL_THRESHOLD;
}

export function resolveHomeQuestionState(progress: number): {
  activeStep: HomeQuestionStep;
  isDoorOpen: boolean;
} {
  const normalizedProgress = clampProgress(progress);

  let activeStep: HomeQuestionStep = 3;
  if (normalizedProgress < HOME_QUESTION_TIMELINE.firstWorry) {
    activeStep = -1;
  } else if (normalizedProgress < HOME_QUESTION_TIMELINE.secondWorry) {
    activeStep = 0;
  } else if (normalizedProgress < HOME_QUESTION_TIMELINE.thirdWorry) {
    activeStep = 1;
  } else if (normalizedProgress < HOME_QUESTION_TIMELINE.brand) {
    activeStep = 2;
  }

  return {
    activeStep,
    isDoorOpen: normalizedProgress >= HOME_QUESTION_TIMELINE.doorOpen,
  };
}

export function resolveHomeQuestionHeaderTheme(progress: number): HeaderToneTheme {
  const normalizedProgress = clampProgress(progress);

  if (
    normalizedProgress < HOME_QUESTION_HEADER_TIMELINE.dark ||
    normalizedProgress >= HOME_QUESTION_HEADER_TIMELINE.white
  ) {
    return 'white';
  }

  if (normalizedProgress >= HOME_QUESTION_HEADER_TIMELINE.orange) {
    return 'orange';
  }

  return 'dark';
}
