'use client';

import { useRef, useState, type JSX } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react';
import { Button } from '@/shared/ui/button';
import { useHeroHeaderToneStore } from '@/shared/lib/hero-header-tone';

type FolderFeatureItem = {
  id: string;
  category: string;
  title: string;
  buttonLabel: string;
  buttonHref: string;
  imageSrc: string;
  imageAlt: string;
};

const FEATURE_FOLDERS: FolderFeatureItem[] = [
  {
    id: 'recommendation',
    category: 'Recommendation',
    title: '내게 맞는 광고 채널을\n추천받아요',
    buttonLabel: '채널 추천받기',
    buttonHref: '/recommend',
    imageSrc: '/home-assets/feature-folders/folder-recommend.png',
    imageAlt: '채소집 채널 추천 기능 소개',
  },
  {
    id: 'comparison',
    category: 'Comparison',
    title: '여러 광고 채널을\n한눈에 비교해요',
    buttonLabel: '채널 비교하기',
    buttonHref: '/compare',
    imageSrc: '/home-assets/feature-folders/folder-compare.png',
    imageAlt: '채소집 채널 비교 기능 소개',
  },
  {
    id: 'simulator',
    category: 'Simulator',
    title: '예산에 따른 광고 성과를\n미리 시뮬레이션해요',
    buttonLabel: '예산 시뮬레이션 하기',
    buttonHref: '/simulator',
    imageSrc: '/home-assets/feature-folders/folder-simulator.png',
    imageAlt: '채소집 예산 시뮬레이션 기능 소개',
  },
];

type ProcessStepItem = {
  step: number;
  stepLabel: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
};

const PROCESS_STEPS: ProcessStepItem[] = [
  {
    step: 1,
    stepLabel: 'Step 1',
    title: '우리 서비스의\n정보를 입력해요',
    description:
      '업종, 목표, 예산, 타깃 등\n채널을 선택하는 데 필요한 정보를\n챗봇에게 알려 주세요.',
    iconSrc: '/simulator-assets/clicks.svg',
    iconAlt: '서비스 정보 입력 단계 아이콘',
  },
  {
    step: 2,
    stepLabel: 'Step 2',
    title: '맞춤 채널을\n추천받아요 ',
    description:
      '입력한 정보를 바탕으로\n서비스에 딱 맞는 광고 채널을\n적합도 순으로 추천해 드려요.',
    iconSrc: '/simulator-assets/channels.svg',
    iconAlt: '맞춤 채널 추천 단계 아이콘',
  },
  {
    step: 3,
    stepLabel: 'Step 3',
    title: '채널별 정보를\n한눈에 비교해요',
    description:
      '노출, 클릭, 최소 예산, 과금 방식 등\n채널별 주요 정보와 예상 지표를\n손쉽게 비교할 수 있어요.',
    iconSrc: '/simulator-assets/impressions.svg',
    iconAlt: '채널 정보 비교 단계 아이콘',
  },
  {
    step: 4,
    stepLabel: 'Step 4',
    title: '예산을 설정하고\n성과를 확인해요',
    description: '설정한 예산에 맞는\n채널별 예상 기대 성과를\n슬라이더로 시뮬레이션해 봐요.',
    iconSrc: '/home-assets/process-icons/icon-step-4.svg',
    iconAlt: '예산 설정 및 성과 시뮬레이션 단계 아이콘',
  },
];

const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 280,
  damping: 24,
  mass: 0.8,
} as const;

const FEATURE_OVERLAY_SCALE_CLASS =
  'scale-50 @min-[700px]:scale-[0.58] @min-[800px]:scale-[0.67] @min-[900px]:scale-75 @min-[1000px]:scale-[0.83] @min-[1100px]:scale-[0.92] @min-[1200px]:scale-100';

export function HomeFolderFeatures(): JSX.Element {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hoveredProcessIndex, setHoveredProcessIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const setTheme = useHeroHeaderToneStore((state) => state.setTheme);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.18) {
      setActiveStep(0); // 1번 폴더
    } else if (latest < 0.38) {
      setActiveStep(1); // 2번 폴더
    } else if (latest < 0.58) {
      setActiveStep(2); // 3번 폴더 (3단 스택 완성)
    } else {
      setActiveStep(3); // 4단계: The Process로 씬 전환
    }

    // The Process가 끝나고 다음 페이지(FAQ)가 헤더 하단에 딱 걸치는 순간(0.975)에 흰색으로 전환
    if (latest >= 0.58 && latest < 0.975) {
      setTheme('process-dark');
    } else {
      setTheme('white');
    }
  });

  const isProcessScene = activeStep === 3;

  let card1Scale = 1;
  if (activeStep === 1) {
    card1Scale = 0.88;
  } else if (activeStep >= 2) {
    card1Scale = 0.76;
  }

  const card2Y = activeStep >= 1 ? '0%' : '120%';
  const card2Scale = activeStep >= 2 ? 0.88 : 1;

  const card3Y = activeStep >= 2 ? '0%' : '120%';
  const activeFeature = FEATURE_FOLDERS[Math.min(activeStep, FEATURE_FOLDERS.length - 1)];

  return (
    <section
      ref={containerRef}
      aria-label="채소집 기능 및 서비스 과정 소개"
      className="relative h-[380vh] w-full"
    >
      {/* 뷰포트 고정 컨테이너 (배경색이 다크/라이트로 부드럽게 전환) */}
      <motion.div
        animate={{
          backgroundColor: isProcessScene ? '#1D1D20' : '#F4F4F5',
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="px-016 sm:px-032 lg:top-072 sticky top-14 flex h-[calc(100dvh-56px)] w-full flex-col items-center justify-center overflow-hidden lg:h-[calc(100dvh-72px)]"
      >
        {/* ========================================================= */}
        {/* SCENE 1: 3단 폴더 기능 소개 무대 (activeStep 0 ~ 2)          */}
        {/* ========================================================= */}
        <motion.div
          animate={{
            opacity: isProcessScene ? 0 : 1,
            scale: isProcessScene ? 0.94 : 1,
            y: isProcessScene ? -20 : 0,
            pointerEvents: isProcessScene ? 'none' : 'auto',
          }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="px-016 sm:px-032 absolute inset-0 flex flex-col items-center justify-center pb-[40px] lg:px-120"
        >
          {/* 상단 섹션 타이틀 헤더 */}
          <div className="mb-[32px] flex w-full max-w-[1200px] -translate-y-[12px] flex-col items-start gap-[4px] sm:mb-[44px] sm:gap-[6px] lg:mb-[54px]">
            <span className="text-sys-primary-default typo-subtitle-xxl sm:typo-heading-md lg:typo-heading-lg">
              Feature
            </span>
            <h2 className="font-pre text-[22px] leading-[1.25] font-bold tracking-tight break-keep text-[var(--color-primitive-gray-900,#1D1D20)] sm:text-[30px] lg:text-[36px]">
              광고 고민을 덜어주는 채소집의 핵심 기능을 만나보세요
            </h2>
          </div>

          {/* 모바일에서는 축소된 폴더 이미지의 UI를 가리지 않도록 카피를 무대 밖에 둔다. */}
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeFeature.id}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              data-testid="mobile-feature-copy"
              className="mb-[16px] flex w-full origin-top-left [zoom:0.82] flex-col items-start min-[375px]:[zoom:0.86] min-[430px]:[zoom:0.9] min-[500px]:[zoom:0.95] min-[580px]:[zoom:1] sm:hidden"
            >
              <span className="font-pre text-text-low text-[11px] leading-[1.3] font-semibold">
                {activeFeature.category}
              </span>
              <h3 className="font-pre text-text-highest mt-[4px] text-[20px] leading-[1.3] font-bold tracking-tight break-keep whitespace-pre-line">
                {activeFeature.title}
              </h3>
              <Button
                frame="button"
                tone="stroke"
                nativeButton={false}
                render={<Link href={activeFeature.buttonHref} />}
                className="px-012 py-008 mt-[10px] h-9"
                rightIcon={<ArrowRight aria-hidden className="size-[14px]" />}
              >
                {activeFeature.buttonLabel}
              </Button>
            </motion.div>
          </AnimatePresence>

          {/*
            3단 계단식 스택 무대 (1200 x 762 비율).
            100.7874vh = 64vh * (1200 / 762). 높이만 제한해 비율이 깨지지 않도록
            뷰포트 높이 제한을 동일 비율의 최대 너비로 환산한다. lg의 추가 제한은
            72px 헤더와 3단 스택 오프셋까지 viewport 안에 남길 공간을 확보한다.
          */}
          <div className="[container-type:inline-size] relative aspect-[1200/762] w-full max-w-[min(1200px,100.7874vh)] lg:max-w-[min(1200px,100.7874vh,calc(122.7dvh-240px))]">
            {/* ================= 1번 폴더: 채널 추천 ================= */}
            <motion.div
              animate={{
                scale: shouldReduceMotion ? 1 : card1Scale,
              }}
              transition={SPRING_TRANSITION}
              style={{
                transformOrigin: 'top center',
                top: '0px',
                zIndex: 10,
              }}
              className="absolute inset-x-0 aspect-[1200/762] size-full overflow-hidden rounded-[24px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)] select-none"
            >
              <Image
                src={FEATURE_FOLDERS[0].imageSrc}
                alt={FEATURE_FOLDERS[0].imageAlt}
                fill
                priority
                className="object-contain object-top"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              <div
                className={`absolute top-[6.5%] left-[5%] z-10 hidden w-[340px] origin-top-left flex-col items-start sm:flex ${FEATURE_OVERLAY_SCALE_CLASS}`}
              >
                <span className="font-pre text-text-low text-[16px] leading-[24px] font-semibold">
                  {FEATURE_FOLDERS[0].category}
                </span>
                <h3 className="text-text-highest typo-display-sm mt-[10px] break-keep whitespace-pre-line">
                  {FEATURE_FOLDERS[0].title}
                </h3>
                <div className="mt-[20px]">
                  <Button
                    frame="button"
                    tone="stroke"
                    nativeButton={false}
                    render={<Link href={FEATURE_FOLDERS[0].buttonHref} />}
                    rightIcon={<ArrowRight aria-hidden className="size-[16px]" />}
                  >
                    {FEATURE_FOLDERS[0].buttonLabel}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* ================= 2번 폴더: 채널 비교 ================= */}
            <motion.div
              animate={{
                y: shouldReduceMotion ? '0%' : card2Y,
                scale: shouldReduceMotion ? 1 : card2Scale,
                opacity: activeStep >= 1 ? 1 : 0,
              }}
              transition={SPRING_TRANSITION}
              style={{
                transformOrigin: 'top center',
                top: '7.0866%',
                zIndex: 20,
              }}
              className="absolute inset-x-0 aspect-[1200/762] size-full overflow-hidden rounded-[24px] drop-shadow-[0_24px_48px_rgba(0,0,0,0.12)] select-none"
            >
              <Image
                src={FEATURE_FOLDERS[1].imageSrc}
                alt={FEATURE_FOLDERS[1].imageAlt}
                fill
                priority
                className="object-contain object-top"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              <div
                className={`absolute top-[6.5%] left-[5%] z-10 hidden w-[340px] origin-top-left flex-col items-start sm:flex ${FEATURE_OVERLAY_SCALE_CLASS}`}
              >
                <span className="font-pre text-text-low text-[16px] leading-[24px] font-semibold">
                  {FEATURE_FOLDERS[1].category}
                </span>
                <h3 className="text-text-highest typo-display-sm mt-[10px] break-keep whitespace-pre-line">
                  {FEATURE_FOLDERS[1].title}
                </h3>
                <div className="mt-[20px]">
                  <Button
                    frame="button"
                    tone="stroke"
                    nativeButton={false}
                    render={<Link href={FEATURE_FOLDERS[1].buttonHref} />}
                    rightIcon={<ArrowRight aria-hidden className="size-[16px]" />}
                  >
                    {FEATURE_FOLDERS[1].buttonLabel}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* ================= 3번 폴더: 예산 시뮬레이션 ================= */}
            <motion.div
              animate={{
                y: shouldReduceMotion ? '0%' : card3Y,
                opacity: activeStep >= 2 ? 1 : 0,
              }}
              transition={SPRING_TRANSITION}
              style={{
                transformOrigin: 'top center',
                top: '14.1732%',
                zIndex: 30,
              }}
              className="absolute inset-x-0 aspect-[1200/762] size-full overflow-hidden rounded-[24px] drop-shadow-[0_28px_56px_rgba(0,0,0,0.16)] select-none"
            >
              <Image
                src={FEATURE_FOLDERS[2].imageSrc}
                alt={FEATURE_FOLDERS[2].imageAlt}
                fill
                priority
                className="object-contain object-top"
                sizes="(max-width: 1200px) 100vw, 1200px"
              />

              <div
                className={`absolute top-[6.5%] left-[5%] z-10 hidden w-[340px] origin-top-left flex-col items-start sm:flex ${FEATURE_OVERLAY_SCALE_CLASS}`}
              >
                <span className="font-pre text-text-low text-[16px] leading-[24px] font-semibold">
                  {FEATURE_FOLDERS[2].category}
                </span>
                <h3 className="text-text-highest typo-display-sm mt-[10px] break-keep whitespace-pre-line">
                  {FEATURE_FOLDERS[2].title}
                </h3>
                <div className="mt-[20px]">
                  <Button
                    frame="button"
                    tone="stroke"
                    nativeButton={false}
                    render={<Link href={FEATURE_FOLDERS[2].buttonHref} />}
                    rightIcon={<ArrowRight aria-hidden className="size-[16px]" />}
                  >
                    {FEATURE_FOLDERS[2].buttonLabel}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* SCENE 2: The Process (그 자리에 배경 바뀌며 페이드인 등장) */}
        {/* ========================================================= */}
        <motion.div
          animate={{
            opacity: isProcessScene ? 1 : 0,
            scale: isProcessScene ? 1 : 1.05,
            y: isProcessScene ? 0 : 24,
            pointerEvents: isProcessScene ? 'auto' : 'none',
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="px-016 sm:px-032 absolute inset-0 flex flex-col items-center justify-center lg:px-120"
        >
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[24px] sm:gap-[48px] lg:gap-[80px]">
            {/* 상단 헤더 (The Process & 서브타이틀) */}
            <div className="flex flex-col items-center gap-[4px] text-center sm:gap-[6px]">
              <span className="text-surface-higher typo-subtitle-xxl sm:typo-heading-xl font-semibold">
                The Process
              </span>
              <h2 className="font-pre text-[20px] leading-[1.3] font-bold tracking-tight break-keep text-white sm:text-[30px] sm:leading-[44px] lg:text-[36px] lg:leading-[52px]">
                이 모든 기능을 채소집 안에서 한 번에!
              </h2>
            </div>

            {/* 4단계 카드 그리드 (모바일 2x2 반응형 배치) */}
            <div className="grid w-full grid-cols-2 gap-[10px] sm:grid-cols-2 sm:gap-[16px] lg:grid-cols-4 lg:gap-[20px]">
              {PROCESS_STEPS.map((item, index) => {
                const isHovered = hoveredProcessIndex === index;

                return (
                  <div
                    key={item.step}
                    onMouseEnter={() => setHoveredProcessIndex(index)}
                    onMouseLeave={() => setHoveredProcessIndex(null)}
                    className={`relative flex h-[148px] w-full cursor-pointer flex-col justify-between rounded-[14px] p-[14px] transition-all duration-300 select-none sm:h-[220px] sm:rounded-[16px] sm:p-[20px] lg:h-[286px] lg:px-[30px] lg:py-[24px] ${
                      isHovered
                        ? 'bg-white shadow-[0_20px_40px_rgba(0,0,0,0.24)]'
                        : 'bg-[var(--color-primitive-gray-800,#3F3F45)]'
                    }`}
                  >
                    {/* 1) 호버 상태: 상단 타이틀 + 하단 3줄 상세 설명 */}
                    {isHovered ? (
                      <div className="flex h-full flex-col justify-between">
                        <h3 className="font-pre text-[14px] leading-[1.3] font-bold tracking-tight break-keep whitespace-pre-line text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[18px] sm:leading-[26px] lg:text-[20px] lg:leading-[32px]">
                          {item.title}
                        </h3>
                        <AnimatePresence>
                          <motion.p
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="font-pre text-[11px] leading-[1.3] font-medium tracking-tight break-keep whitespace-pre-line text-[var(--color-primitive-gray-600,#6E6E76)] sm:text-[14px] sm:leading-[20px] lg:text-[15px] lg:leading-[24px]"
                          >
                            {item.description}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    ) : (
                      /* 2) 기본(Non-hover) 상태: 상단 아이콘 + 하단 텍스트 묶음 */
                      <>
                        <div className="relative size-[28px] shrink-0 sm:size-[36px] lg:size-[40px]">
                          <Image
                            src={item.iconSrc}
                            alt={item.iconAlt}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="flex flex-col gap-[2px] sm:gap-[6px]">
                          <h3 className="font-pre text-[13.5px] leading-[1.3] font-bold tracking-tight break-keep whitespace-pre-line text-white sm:text-[18px] sm:leading-[26px] lg:text-[20px] lg:leading-[32px]">
                            {item.title}
                          </h3>
                          <span className="text-text-low lg:typo-subtitle-xxl text-[11px] font-medium sm:text-[13px]">
                            {item.stepLabel}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
