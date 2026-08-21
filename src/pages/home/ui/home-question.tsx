'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import Image from 'next/image';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'motion/react';
import { useHeroHeaderToneStore } from '@/shared/lib/hero-header-tone';
import { usePrefersReducedMotion } from '@/shared/lib/use-prefers-reduced-motion';
import {
  resolveHomeQuestionHeaderTheme,
  resolveHomeQuestionState,
  type HomeQuestionStep,
} from '@/pages/home/model/home-scroll-timeline';

// 피그마 노드 3766:111785 -> 3766:111806 ("고민 스크롤 스토리")
const WORRY_ITEMS = [
  {
    id: 'channel',
    prefix: '우리 서비스를',
    suffix: '어디에 광고해야 할까?',
    iconSrc: '/home-assets/worry-channel.svg',
    iconAlt: '광고 채널 고민 아이콘',
  },
  {
    id: 'budget',
    prefix: '광고 예산을',
    suffix: '얼마나 잡아야 할까?',
    iconSrc: '/home-assets/worry-budget.svg',
    iconAlt: '광고 예산 고민 아이콘',
  },
  {
    id: 'effect',
    prefix: '이 광고 채널이 과연',
    suffix: '얼마나 효과가 있을까?',
    iconSrc: '/home-assets/worry-effect.svg',
    iconAlt: '광고 효과 고민 아이콘',
  },
] as const;

// 일정 간격으로 괄호 안에서 교체되는 채널 로고 목록 (알바몬/뉴닉 제외 5종)
const CHANNEL_LOGOS = [
  {
    id: 'ch-cashwalk',
    src: '/home-assets/channel-logos/channel-2.png',
    alt: '캐시워크',
    rotate: 3,
  },
  {
    id: 'ch-everytime',
    src: '/home-assets/channel-logos/channel-3.png',
    alt: '에브리타임',
    rotate: -3,
  },
  { id: 'ch-daangn', src: '/home-assets/channel-logos/channel-5.png', alt: '당근', rotate: 4 },
  {
    id: 'ch-yeolpumta',
    src: '/home-assets/channel-logos/channel-6.png',
    alt: '열품타',
    rotate: -4,
  },
  { id: 'ch-youtube', src: '/home-assets/channel-logos/channel-7.png', alt: '유튜브', rotate: 3 },
] as const;

const ZIP_CHARS = ['.', 'z', 'i', 'p'] as const;

const CALM_SPRING = {
  type: 'spring',
  duration: 0.5,
  bounce: 0.1,
} as const;

const LOGO_ROTATION_TRANSITION = {
  duration: 0.3,
  ease: [0.16, 1, 0.3, 1],
} as const;

const LOGO_SLOT_EXPAND_TRANSITION = {
  width: {
    type: 'spring',
    duration: 0.5,
    bounce: 0.12,
    delay: 0.15,
  },
  opacity: {
    duration: 0.16,
    delay: 0.24,
    ease: [0.23, 1, 0.32, 1],
  },
} as const;

const LOGO_SLOT_COLLAPSE_TRANSITION = {
  width: {
    duration: 0.16,
    ease: [0.23, 1, 0.32, 1],
  },
  opacity: {
    duration: 0.1,
    ease: [0.23, 1, 0.32, 1],
  },
} as const;

const WORRY_EXIT_TRANSITION = {
  duration: 0.16,
  ease: [0.23, 1, 0.32, 1],
} as const;

const WORRY_ENTER_TRANSITION = {
  duration: 0.18,
  delay: WORRY_EXIT_TRANSITION.duration,
  ease: [0.23, 1, 0.32, 1],
} as const;

function WorryRow({
  item,
  isActive,
}: {
  item: (typeof WORRY_ITEMS)[number];
  isActive: boolean;
}): JSX.Element {
  return (
    <>
      <div className="relative flex h-[64px] w-full items-center justify-center text-center sm:hidden">
        <span className="sr-only">
          {item.prefix} {item.suffix}
        </span>
        <motion.div
          aria-hidden
          initial={false}
          animate={{
            opacity: isActive ? 0 : 1,
          }}
          transition={isActive ? WORRY_EXIT_TRANSITION : WORRY_ENTER_TRANSITION}
          className="font-wanted absolute inset-0 flex items-center justify-center text-[19px] font-bold tracking-tight whitespace-nowrap text-[var(--color-primitive-gray-700,#52525a)]"
        >
          {item.prefix} {item.suffix}
        </motion.div>

        <motion.div
          aria-hidden
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0,
          }}
          transition={isActive ? WORRY_ENTER_TRANSITION : WORRY_EXIT_TRANSITION}
          data-worry-active={item.id}
          data-worry-delay-ms={isActive ? WORRY_ENTER_TRANSITION.delay * 1000 : 0}
          className="font-wanted absolute inset-0 flex items-center justify-center text-[19px] font-bold tracking-tight whitespace-nowrap text-white"
        >
          <span>{item.prefix}</span>
          <span className="relative mx-[6px] size-[36px] shrink-0">
            <Image
              src={item.iconSrc}
              alt=""
              fill
              sizes="36px"
              className="object-contain"
              priority
            />
          </span>
          <span>{item.suffix}</span>
        </motion.div>
      </div>

      <div className="relative hidden h-[127px] w-full items-center justify-center text-center sm:flex">
        <span className="sr-only">
          {item.prefix} {item.suffix}
        </span>
        <motion.div
          aria-hidden
          initial={false}
          animate={{
            opacity: isActive ? 0 : 1,
          }}
          transition={isActive ? WORRY_EXIT_TRANSITION : WORRY_ENTER_TRANSITION}
          className="font-wanted absolute inset-0 flex items-center justify-center text-[34px] font-bold tracking-tight whitespace-nowrap text-[var(--color-primitive-gray-700,#52525a)] lg:text-[48px]"
        >
          {item.prefix} {item.suffix}
        </motion.div>

        <motion.div
          aria-hidden
          initial={false}
          animate={{
            opacity: isActive ? 1 : 0,
          }}
          transition={isActive ? WORRY_ENTER_TRANSITION : WORRY_EXIT_TRANSITION}
          data-worry-active={item.id}
          data-worry-delay-ms={isActive ? WORRY_ENTER_TRANSITION.delay * 1000 : 0}
          className="font-wanted absolute inset-0 flex items-center justify-center text-[34px] font-bold tracking-tight whitespace-nowrap text-white lg:text-[48px]"
        >
          <span>{item.prefix}</span>
          <span className="relative mx-[19px] h-[80px] w-[80px] shrink-0 lg:size-[127px]">
            <Image
              src={item.iconSrc}
              alt=""
              fill
              sizes="(min-width: 1024px) 127px, 80px"
              className="object-contain"
              priority
            />
          </span>
          <span>{item.suffix}</span>
        </motion.div>
      </div>
    </>
  );
}

export function HomeQuestion(): JSX.Element {
  const shouldReduceMotion = usePrefersReducedMotion();

  if (shouldReduceMotion) {
    return (
      <section
        aria-label="서비스 핵심 질문 및 타이틀"
        data-reduced-motion="true"
        className="gap-032 px-016 flex min-h-screen w-full flex-col items-center justify-center bg-[#262626] py-[120px] lg:px-120"
      >
        <h2 className="font-wanted text-center text-[32px] leading-[1.35] font-bold text-white sm:text-[42px] lg:text-[48px]">
          지금,
          <br />
          이런 고민을 하고 계시지 않나요?
        </h2>
        <div className="flex flex-col gap-[20px] text-center">
          {WORRY_ITEMS.map((item) => (
            <p
              key={item.id}
              className="font-wanted text-[24px] font-bold text-white sm:text-[36px]"
            >
              {item.prefix} {item.suffix}
            </p>
          ))}
        </div>
      </section>
    );
  }

  return <HomeQuestionAnimated />;
}

function HomeQuestionAnimated(): JSX.Element {
  const sectionRef = useRef<HTMLElement>(null);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<HomeQuestionStep>(-1); // -1: 첫질문, 0: 고민1, 1: 고민2, 2: 고민3, 3: 오렌지타이틀
  const [currentLogoIndex, setCurrentLogoIndex] = useState<number>(0);
  const setTheme = useHeroHeaderToneStore((state) => state.setTheme);

  // 화면에 고정된 스토리 진행률은 sticky가 유지되는 구간에 맞춘다.
  const { scrollYProgress: phaseScrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // 헤더 테마는 다음 섹션이 헤더까지 올라오는 시점까지 별도로 유지한다.
  const { scrollYProgress: headerScrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  // sticky 화면에 표시되는 단계 전환
  useMotionValueEvent(phaseScrollYProgress, 'change', (latest) => {
    const nextState = resolveHomeQuestionState(latest);
    setIsDoorOpen(nextState.isDoorOpen);
    setActiveStep(nextState.activeStep);
  });

  // 헤더 테마는 영역을 완전히 벗어날 때까지 색상 유지
  useMotionValueEvent(headerScrollYProgress, 'change', (latest) => {
    setTheme(resolveHomeQuestionHeaderTheme(latest));
  });

  const isOrangeActive = activeStep === 3;

  // 기존 연출과 동일하게 1초마다 괄호 안의 채널 로고를 교체한다.
  useEffect(() => {
    if (!isOrangeActive) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % CHANNEL_LOGOS.length);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOrangeActive]);

  // 1. Phase 1: 첫 질문 모션 상태값
  const isIntroActive = isDoorOpen && activeStep === -1;
  let introY = 24;
  if (isDoorOpen) {
    introY = activeStep === -1 ? 0 : -24;
  }

  // 2. Phase 2: 고민 리스트 모션 상태값
  const isWorryListActive = activeStep >= 0 && activeStep <= 2;
  let worryListY = 24;
  if (activeStep > 2) {
    worryListY = -24;
  } else if (activeStep >= 0) {
    worryListY = 0;
  }

  const currentLogo = CHANNEL_LOGOS[currentLogoIndex] ?? CHANNEL_LOGOS[0];

  return (
    <section
      ref={sectionRef}
      aria-label="서비스 핵심 질문 및 타이틀"
      data-active-step={activeStep}
      data-door-open={isDoorOpen}
      className="relative h-[400vh] w-full"
    >
      <motion.div
        animate={{
          backgroundColor: isOrangeActive ? 'var(--color-sys-primary-default, #ff6817)' : '#262626',
        }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        className="px-016 sm:px-032 sticky top-0 flex h-dvh w-full items-center justify-center overflow-hidden select-none lg:px-120"
      >
        {/* Phase 1: 첫 질문 */}
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(24px) scale(0.97)' }}
          animate={{
            opacity: isIntroActive ? 1 : 0,
            transform: `translateY(${introY}px) scale(${isIntroActive ? 1 : 0.97})`,
          }}
          transition={CALM_SPRING}
          className="px-016 pointer-events-none absolute z-10 flex flex-col items-center justify-center text-center"
        >
          <h2 className="font-wanted text-center text-[32px] leading-[1.35] font-bold tracking-tight text-white sm:text-[42px] lg:text-[48px]">
            지금,
            <br />
            이런 고민을 하고 계시지 않나요?
          </h2>
        </motion.div>

        {/* Phase 2: 3개 고민 리스트 */}
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(24px)' }}
          animate={{
            opacity: isWorryListActive ? 1 : 0,
            transform: `translateY(${worryListY}px)`,
          }}
          transition={CALM_SPRING}
          className="px-016 pointer-events-none z-10 flex w-full max-w-[1200px] flex-col items-center justify-center gap-[6px] text-center"
        >
          {WORRY_ITEMS.map((item, index) => (
            <WorryRow key={item.id} item={item} isActive={activeStep === index} />
          ))}
        </motion.div>

        {/* Phase 3: 오렌지 배경 전환 완료 시에만 나타나는 대형 타이포그래피 (isOrangeActive일 때만 표시) */}
        <motion.div
          initial={false}
          animate={{ opacity: isOrangeActive ? 1 : 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          className={`absolute z-10 flex w-full max-w-[1200px] flex-col items-center justify-center gap-[16px] text-center text-white sm:gap-[36px] lg:gap-[48px] ${
            isOrangeActive ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Line 1: 진짜 ( [1초마다 바뀌는 채널 로고] ) 채널을 (Pretendard ExtraBold) */}
          <div className="font-pre flex items-center justify-center gap-[4px] text-center text-[24px] leading-[1.15] font-extrabold tracking-tight whitespace-nowrap sm:gap-[14px] sm:text-[64px] lg:gap-[20px] lg:text-[100px]">
            <span>진짜</span>

            {/* 괄호 및 내부 1초 회전 채널 로고 컨테이너 (모바일 / 데스크톱 분기) */}
            <div className="flex items-center justify-center font-bold">
              <span>(</span>
              {/* 1) 모바일 로고 (sm 미만: 컴팩트한 너비 105px) */}
              <motion.div
                data-logo-slot="mobile"
                initial={false}
                animate={{ width: isOrangeActive ? 105 : 0, opacity: isOrangeActive ? 1 : 0 }}
                transition={
                  isOrangeActive ? LOGO_SLOT_EXPAND_TRANSITION : LOGO_SLOT_COLLAPSE_TRANSITION
                }
                className="relative flex h-[36px] items-center justify-center overflow-visible px-[2px] sm:hidden"
              >
                <AnimatePresence mode="wait">
                  {isOrangeActive && (
                    <motion.div
                      key={currentLogo.id}
                      data-channel-logo={currentLogo.id}
                      initial={{ opacity: 0, scale: 0.8, y: 8 }}
                      animate={{
                        opacity: 1,
                        scale: 1.1,
                        y: 0,
                        rotate: currentLogo.rotate,
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: -8 }}
                      transition={LOGO_ROTATION_TRANSITION}
                      className="relative flex h-full w-[95px] items-center justify-center"
                    >
                      <Image
                        src={currentLogo.src}
                        alt={currentLogo.alt}
                        fill
                        sizes="95px"
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* 2) 데스크톱 로고 (sm 이상: 기존 320px 원본 100% 보존) */}
              <motion.div
                data-logo-slot="desktop"
                initial={false}
                animate={{ width: isOrangeActive ? 320 : 0, opacity: isOrangeActive ? 1 : 0 }}
                transition={
                  isOrangeActive ? LOGO_SLOT_EXPAND_TRANSITION : LOGO_SLOT_COLLAPSE_TRANSITION
                }
                className="relative hidden h-[110px] items-center justify-center overflow-visible px-[4px] sm:flex lg:h-[150px]"
              >
                <AnimatePresence mode="wait">
                  {isOrangeActive && (
                    <motion.div
                      key={currentLogo.id}
                      data-channel-logo={currentLogo.id}
                      initial={{ opacity: 0, scale: 0.8, y: 14 }}
                      animate={{
                        opacity: 1,
                        scale: 1.15,
                        y: 0,
                        rotate: currentLogo.rotate,
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: -14 }}
                      transition={LOGO_ROTATION_TRANSITION}
                      className="relative flex h-full w-[300px] items-center justify-center lg:w-[360px]"
                    >
                      <Image
                        src={currentLogo.src}
                        alt={currentLogo.alt}
                        fill
                        sizes="(min-width: 1024px) 360px, 300px"
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <span>)</span>
            </div>

            <span>채널을</span>
          </div>

          {/* Line 2: 하나로 모아주는 (Pretendard ExtraBold) */}
          <div className="font-pre text-center text-[24px] leading-[1.15] font-extrabold tracking-tight whitespace-nowrap sm:text-[64px] lg:text-[100px]">
            하나로 모아주는
          </div>

          {/* Line 3: 채널소개모음.zip (Pretendard Bold 피그마 스펙 100% 매핑) */}
          <div className="flex w-full items-center justify-center overflow-visible text-center">
            <div
              aria-label="채널소개모음.zip"
              className="font-pre inline-flex items-center justify-center text-center text-[24px] leading-[1.15] font-bold tracking-tight whitespace-nowrap text-white sm:text-[64px] lg:text-[100px]"
            >
              <span aria-hidden>채널소개모음</span>
              <span aria-hidden className="font-bold text-white">
                {ZIP_CHARS.map((char, index) => (
                  <motion.span
                    key={`${char}-${index}`}
                    data-zip-character={char}
                    data-zip-delay-ms={Math.round((0.65 + index * 0.09) * 1000)}
                    initial={false}
                    animate={{ opacity: isOrangeActive ? 1 : 0 }}
                    transition={{
                      duration: 0.01,
                      delay: isOrangeActive ? 0.65 + index * 0.09 : 0,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 앞을 덮고 있다가 위로 자동으로 열리는 상단 흰색 패널 */}
        <motion.div
          initial={{ y: '0%' }}
          animate={{ y: isDoorOpen ? '-100%' : '0%' }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="bg-surface-lowest absolute inset-x-0 top-0 z-20 h-1/2 shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
        />

        {/* 앞을 덮고 있다가 아래로 자동으로 열리는 하단 흰색 패널 */}
        <motion.div
          initial={{ y: '0%' }}
          animate={{ y: isDoorOpen ? '100%' : '0%' }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="bg-surface-lowest absolute inset-x-0 bottom-0 z-20 h-1/2 shadow-[0_-12px_24px_rgba(0,0,0,0.06)]"
        />
      </motion.div>
    </section>
  );
}
