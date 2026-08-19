'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';

import { Button } from '@/shared/ui/button';

import { useHeroHeaderToneStore } from '@/shared/lib/hero-header-tone';

import {
  HERO_REVEAL_CTA_LABEL,
  HERO_SUBTEXT,
  HERO_TAGLINE_WORDS,
} from '@/pages/home/model/home-hero-content';
import { HomeHeroServicePreview } from './home-hero-service-preview';

// home_splash_orange.json / home_splash_white.json 의 "Position By Word In" 기준값.
// Y 오프셋(-94px)은 그대로, AE의 range-selector 가속/감속(88 / -33) 조합이 만드는
// 오버슈트-팝 느낌은 back-ease 커브([0.34, 1.56, 0.64, 1])로 근사했다.
// 문자 단위 "Decode In By Random Character" 스크램블 효과는 1차 범위에서 제외.
const WORD_ENTER_TRANSITION = { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const };
const WORD_STAGGER_SECONDS = 0.08;
const WORD_STAGGER_START_SECONDS = 0.125;
const WORD_COUNT = HERO_TAGLINE_WORDS.length;

// 태그라인 팝인이 끝나는 시점(대략) 이후 잠깐 멈췄다가 오렌지->화이트로 색이 넘어간다.
// 스크롤과 무관한 온로드 1회 재생 시퀀스 — Lottie의 orange 클립 -> white 클립 전환에 대응.
const WORD_ENTER_DONE_SECONDS =
  WORD_STAGGER_START_SECONDS +
  (WORD_COUNT - 1) * WORD_STAGGER_SECONDS +
  WORD_ENTER_TRANSITION.duration;
const INTRO_COLOR_HOLD_SECONDS = 0.25;
const INTRO_COLOR_DELAY_SECONDS = WORD_ENTER_DONE_SECONDS + INTRO_COLOR_HOLD_SECONDS;
const INTRO_COLOR_DURATION_SECONDS = 0.45;

const headlineContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: WORD_STAGGER_SECONDS,
      delayChildren: WORD_STAGGER_START_SECONDS,
    },
  },
};

const headlineWordVariants = {
  hidden: { opacity: 0, y: 94 },
  visible: { opacity: 1, y: 0, transition: WORD_ENTER_TRANSITION },
};

const GRADIENT_TEXT_CLASS =
  'bg-clip-text text-transparent bg-[linear-gradient(176deg,var(--color-sys-primary-default)_62%,var(--color-primitive-yellow-15)_112%)]';

// 오렌지/화이트 두 배경 모두에서 "같은 문장"이 같은 자리에 머무른다 — 색만 바뀐다.
// 그래서 문구 자체는 마운트 시 한 번만 등장(pop-in)하고, 색 전환은 겹쳐 그린 두 레이어의
// opacity 크로스페이드로 처리한다 (언마운트/리마운트하면 글자가 사라졌다 다시 나오는 것처럼
// 보여서 쓰지 않는다). 브랜드 카피라 실제 페이지 제목(h1)이 아닌 장식 텍스트로 둔다 — 진짜
// h1은 스크롤 후 나오는 국문 타이틀(HeroRevealTitle)이다.
// 한 문장이 뷰포트 폭과 무관하게 항상 한 줄로 유지되도록 whitespace-nowrap을 쓰고, 폰트 크기는
// Tailwind 구간별 고정값 대신 vw 기반 clamp()로 연속적으로 키운다 — 구간별 고정값은 lg
// breakpoint(1024px)에서 좌우 padding이 64px→240px로 확 뛰는 지점과 안 맞아 그 근방에서
// 줄바꿈 위험이 있었다. vw 비율(3.7vw)은 그 padding 점프 지점(1024px)에서도 한 줄에 들어가도록
// 역산한 값이라 전 구간에서 안전하면서, 큰 화면에서는 이전 고정값보다 더 커진다.
const TAGLINE_SIZE_CLASS = 'text-[clamp(24px,5.4vw,68px)]';

function HeroTagline({
  whiteOpacity,
  gradientOpacity,
}: {
  whiteOpacity: MotionValue<number>;
  gradientOpacity: MotionValue<number>;
}): JSX.Element {
  return (
    <div className="px-016 sm:px-032 relative flex items-center justify-center">
      <motion.p
        aria-label={HERO_TAGLINE_WORDS.join(' ')}
        variants={headlineContainerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity: whiteOpacity }}
        className={`font-wanted text-center leading-[1.15] font-bold whitespace-nowrap text-white ${TAGLINE_SIZE_CLASS}`}
      >
        {HERO_TAGLINE_WORDS.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={headlineWordVariants}
            className="mr-[0.28em] inline-block last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
      {/* 화이트 레이어와 완전히 같은 문장을 색만 다르게 겹쳐 그린 크로스페이드용 레이어 */}
      <motion.p
        aria-hidden
        variants={headlineContainerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity: gradientOpacity }}
        className={`font-wanted absolute inset-0 flex items-center justify-center text-center leading-[1.15] font-bold whitespace-nowrap ${TAGLINE_SIZE_CLASS} ${GRADIENT_TEXT_CLASS}`}
      >
        {HERO_TAGLINE_WORDS.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={headlineWordVariants}
            className="mr-[0.28em] inline-block last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.p>
    </div>
  );
}

function HeroRevealCta(): JSX.Element {
  return (
    <Button
      frame="button"
      tone="secondary"
      size="m"
      nativeButton={false}
      render={<Link href="/login" />}
      rightIcon={<ArrowRight aria-hidden className="size-016" />}
    >
      {HERO_REVEAL_CTA_LABEL}
    </Button>
  );
}

// shared/ui Text의 body-lg는 프로젝트 본문 스케일(13px)이라 Figma 서브텍스트(26px, Medium,
// text-default)에는 너무 작다 — 이 히어로 전용 크기라 Text variant를 억지로 맞추지 않고
// 직접 크기를 지정한다.
function HeroRevealSubtext(): JSX.Element {
  return (
    <p className="text-center text-[15px] leading-[1.4] font-medium tracking-[-0.5px] whitespace-nowrap text-[#52525A] sm:text-[20px] lg:text-[26px] lg:leading-[36px]">
      {HERO_SUBTEXT}
    </p>
  );
}

// Figma(node 3766:110383 / 3766:110421) 스펙:
// 1줄: "내게 맞는 광고 채널을" + [한눈에! 데코 박스 (-4.78deg 기울기 + 42px 라디얼 그라데이션 텍스트 + 모서리 4개 13.33px 사각형)]
// 2줄: "광고 채널 고민, 여기서 끝내 보세요"
function HeroRevealTitle(): JSX.Element {
  return (
    <h1 className="text-text-highest flex flex-col items-center text-center font-bold tracking-[-1px]">
      <span className="flex flex-wrap items-center justify-center text-[28px] leading-[1.3] sm:text-[40px] lg:text-[48px] lg:leading-[70px]">
        <span>내게 맞는 광고 채널을 </span>
        <span className="relative ml-[7px] inline-flex -rotate-[4.78deg] items-center justify-center border-[1.5px] border-[#41BCF6] px-[10px] py-[1.5px] sm:px-[12px] sm:py-[2px] lg:px-[14.4px] lg:py-[2px]">
          {/* 네 모서리 꼭짓점 데코 포인트 (피그마 13.33px 사각형, 2.06px border, 중앙 정렬) */}
          <span className="bg-surface-lowest absolute top-0 left-0 size-[8px] -translate-x-1/2 -translate-y-1/2 rounded-[1.5px] border-[1.5px] border-[#41BCF6] sm:size-[11px] lg:size-[13.3px] lg:rounded-[2px] lg:border-[2px]" />
          <span className="bg-surface-lowest absolute top-0 right-0 size-[8px] translate-x-1/2 -translate-y-1/2 rounded-[1.5px] border-[1.5px] border-[#41BCF6] sm:size-[11px] lg:size-[13.3px] lg:rounded-[2px] lg:border-[2px]" />
          <span className="bg-surface-lowest absolute bottom-0 left-0 size-[8px] -translate-x-1/2 translate-y-1/2 rounded-[1.5px] border-[1.5px] border-[#41BCF6] sm:size-[11px] lg:size-[13.3px] lg:rounded-[2px] lg:border-[2px]" />
          <span className="bg-surface-lowest absolute right-0 bottom-0 size-[8px] translate-x-1/2 translate-y-1/2 rounded-[1.5px] border-[1.5px] border-[#41BCF6] sm:size-[11px] lg:size-[13.3px] lg:rounded-[2px] lg:border-[2px]" />
          <span className="bg-[linear-gradient(135deg,#2E2E33_30.3%,#9E9E9E_100%)] bg-clip-text text-[24.5px] leading-tight font-bold text-transparent sm:text-[35px] lg:text-[42px] lg:leading-[66px]">
            한눈에!
          </span>
        </span>
      </span>
      <span className="text-[28px] leading-[1.3] sm:text-[40px] lg:text-[48px] lg:leading-[70px]">
        광고 채널 고민, 여기서 끝내 보세요
      </span>
    </h1>
  );
}

// prefers-reduced-motion: 인트로 애니메이션 없이 최종(스크롤 완료) 상태를 정적으로 렌더링한다.
function HomeHeroReducedMotion(): JSX.Element {
  const setHeaderProgress = useHeroHeaderToneStore((state) => state.setProgress);

  useEffect(() => {
    setHeaderProgress(1);
    return () => setHeaderProgress(0);
  }, [setHeaderProgress]);

  return (
    <section
      aria-label="채소ZIP 소개"
      className="bg-surface-lowest px-016 sm:px-032 flex w-full flex-col items-center justify-center py-[96px] lg:px-120"
    >
      <p
        className={`font-wanted text-center leading-[1.15] font-bold whitespace-nowrap ${TAGLINE_SIZE_CLASS} ${GRADIENT_TEXT_CLASS}`}
      >
        {HERO_TAGLINE_WORDS.join(' ')}
      </p>
      <div className="mt-024 flex flex-col items-center gap-[12px] text-center sm:gap-[16px] lg:gap-[20px]">
        <HeroRevealTitle />
        <HeroRevealSubtext />
        <div className="mt-[10px] sm:mt-[16px] lg:mt-[20px]">
          <HeroRevealCta />
        </div>
      </div>
      <div className="mt-[28px] w-full max-w-[1170px] sm:mt-[40px] lg:mt-[52px]">
        <HomeHeroServicePreview />
      </div>
    </section>
  );
}

// 스크롤 구간:
// 1) 0 ~ 0.15: 온로드 태그라인이 위로 이동하며 opacity가 완전히 0으로 퇴장
// 2) 0.15 ~ 0.5: 국문 타이틀 + 예산 시뮬레이션 결과 화면이 아래에서부터 위로 이동
// -> 고민 3개 페이지처럼 State 기반 띠요옹 스프링 모션으로 개선하기 위해 기존 스크러빙 범위는 비활성화하고 SPRING_TRANSITION을 정의합니다.
const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
  mass: 1,
} as const;

function HeroBackgroundGrid({ opacity }: { opacity: number }): JSX.Element {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* 80px 격자 그리드 */}
      <div
        className="size-full opacity-60"
        style={{
          backgroundImage: `
            linear-gradient(to right, #F4F4F6 1px, transparent 1px),
            linear-gradient(to bottom, #F4F4F6 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          backgroundPosition: 'center top',
        }}
      />
      {/* 상단, 좌측, 우측 가장자리 페이드 마스크 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,white_90%)]" />
      <div className="absolute inset-x-0 top-0 h-[120px] bg-gradient-to-b from-white to-transparent" />
      <div className="absolute inset-y-0 left-0 w-[180px] bg-gradient-to-r from-white to-transparent" />
      <div className="absolute inset-y-0 right-0 w-[180px] bg-gradient-to-l from-white to-transparent" />
    </motion.div>
  );
}

function HomeHeroScrollScrub(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const setHeaderProgress = useHeroHeaderToneStore((state) => state.setProgress);
  const resetHeaderTone = useHeroHeaderToneStore((state) => state.reset);

  // ---- 온로드 1회 재생: 태그라인 팝인 -> (홀드) -> 오렌지에서 화이트로 색 전환. 스크롤과 무관. ----
  const introProgress = useMotionValue(0);
  const background = useTransform(introProgress, [0, 1], ['#ff6817', '#ffffff']);
  const taglineWhiteOpacity = useTransform(introProgress, [0, 1], [1, 0]);
  const taglineGradientOpacity = useTransform(introProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const controls = animate(introProgress, 1, {
      delay: INTRO_COLOR_DELAY_SECONDS,
      duration: INTRO_COLOR_DURATION_SECONDS,
      ease: 'easeInOut',
    });
    return () => controls.stop();
  }, [introProgress]);

  useMotionValueEvent(introProgress, 'change', (value) => {
    setHeaderProgress(value);
  });

  useEffect(() => {
    return () => resetHeaderTone();
  }, [resetHeaderTone]);

  // ---- 스크롤 구간: 스크롤 8% 이상 시 띠요옹 등장 후 곧바로 다음 파트로 인계 ----
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0.08) {
      setIsRevealed(true);
    } else {
      setIsRevealed(false);
    }
  });

  return (
    <section
      ref={sectionRef}
      aria-label="채소ZIP 소개"
      className="lg:-mt-072 relative -mt-14 h-[160vh] w-full"
    >
      <motion.div
        style={{ backgroundColor: background }}
        className="lg:pt-072 sticky top-0 flex min-h-screen w-full flex-col items-center justify-start overflow-visible pt-14"
      >
        {/* Figma 은은한 배경 그리드 그래픽 (리빌 시 페이드인) */}
        <HeroBackgroundGrid opacity={isRevealed ? 1 : 0} />

        {/* 온로드 태그라인: 뷰포트 상단 영역 정중앙 배치 (스크롤 시 스프링 퇴장) */}
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{
            opacity: isRevealed ? 0 : 1,
            y: isRevealed ? -60 : 0,
          }}
          transition={SPRING_TRANSITION}
          className={`absolute inset-0 z-10 flex items-center justify-center pb-[100px] sm:pb-[140px] lg:pb-[160px] ${
            isRevealed ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
        >
          <HeroTagline
            whiteOpacity={taglineWhiteOpacity}
            gradientOpacity={taglineGradientOpacity}
          />
        </motion.div>

        {/* 스크롤 리빌: 국문 타이틀 + 서브텍스트 + CTA + 예산 시뮬레이션 결과 화면 (원하는 위치 유지 + 바닥까지 온전히 노출) */}
        <motion.div
          initial={{ opacity: 0, y: 120 }}
          animate={{
            opacity: isRevealed ? 1 : 0,
            y: isRevealed ? 0 : 120,
          }}
          transition={SPRING_TRANSITION}
          className={`px-016 sm:px-032 z-10 flex w-full max-w-[1170px] flex-1 flex-col items-center justify-start pt-[120px] pb-[80px] sm:pt-[140px] sm:pb-[100px] lg:pt-[160px] lg:pb-[120px] ${
            isRevealed ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* 타이틀 + 서브타이틀 + CTA */}
          <div className="flex flex-col items-center gap-[12px] text-center sm:gap-[16px] lg:gap-[20px]">
            <HeroRevealTitle />
            <HeroRevealSubtext />
            <div className="mt-[10px] sm:mt-[16px] lg:mt-[20px]">
              <HeroRevealCta />
            </div>
          </div>

          {/* 예산 시뮬레이션 결과 화면 (원래 크기 100% 온전하게 노출) */}
          <div className="mt-[28px] flex w-full max-w-[1170px] justify-center drop-shadow-[0_24px_48px_rgba(0,0,0,0.06)] sm:mt-[40px] lg:mt-[52px]">
            <HomeHeroServicePreview />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export function HomeHero(): JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <HomeHeroReducedMotion />;
  }

  return <HomeHeroScrollScrub />;
}
