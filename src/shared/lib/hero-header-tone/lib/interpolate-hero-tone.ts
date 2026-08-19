// 홈 히어로 배경(오렌지 -> 화이트)과 동일한 두 색을 헤더에도 재사용하기 위한 보간 유틸.
// 원본 색상은 디자인 토큰과 동일하다: --color-sys-primary-default(#ff6817), 흰색.
const HERO_TONE_FROM = { r: 255, g: 104, b: 23 }; // --color-sys-primary-default
const HERO_TONE_TO = { r: 255, g: 255, b: 255 };

// 전경(로고/텍스트)은 배경처럼 연속으로 섞으면 중간 지점에서 대비가 무너지므로
// 히어로 헤드라인 전환과 같은 지점(중간)에서 흰색 <-> 오렌지로 전환한다.
const FOREGROUND_SWITCH_THRESHOLD = 0.5;

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export type HeroHeaderTone = {
  background: string;
  foreground: string;
};

export function interpolateHeroTone(progress: number): HeroHeaderTone {
  const t = Math.min(Math.max(progress, 0), 1);
  const r = Math.round(lerp(HERO_TONE_FROM.r, HERO_TONE_TO.r, t));
  const g = Math.round(lerp(HERO_TONE_FROM.g, HERO_TONE_TO.g, t));
  const b = Math.round(lerp(HERO_TONE_FROM.b, HERO_TONE_TO.b, t));

  return {
    background: `rgb(${r} ${g} ${b})`,
    foreground: t < FOREGROUND_SWITCH_THRESHOLD ? '#ffffff' : '#ff6817',
  };
}
