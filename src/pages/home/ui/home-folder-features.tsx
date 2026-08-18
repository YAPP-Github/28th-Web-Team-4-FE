'use client';

import { type JSX, useRef, useState } from 'react';
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
    buttonHref: '/login',
    imageSrc: '/home-assets/feature-folders/folder-recommend-v3.png',
    imageAlt: '채소집 채널 추천 기능 소개',
  },
  {
    id: 'comparison',
    category: 'Comparison',
    title: '여러 광고 채널을\n한눈에 비교해요',
    buttonLabel: '채널 비교하기',
    buttonHref: '/compare',
    imageSrc: '/home-assets/feature-folders/folder-compare-v3.png',
    imageAlt: '채소집 채널 비교 기능 소개',
  },
  {
    id: 'simulator',
    category: 'Simulator',
    title: '예산에 따른 광고 성과를\n미리 시뮬레이션해요',
    buttonLabel: '예산 시뮬레이션 하기',
    buttonHref: '/simulator',
    imageSrc: '/home-assets/feature-folders/folder-simulator-v3.png',
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

export function HomeFolderFeatures(): JSX.Element {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [hoveredProcessIndex, setHoveredProcessIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.22) {
      setActiveStep(0); // 1번 폴더
    } else if (latest < 0.46) {
      setActiveStep(1); // 2번 폴더
    } else if (latest < 0.7) {
      setActiveStep(2); // 3번 폴더 (3단 스택 완성)
    } else {
      setActiveStep(3); // 4단계: The Process로 씬 전환
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
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="px-016 sm:px-032 sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden"
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
          className="px-016 sm:px-032 absolute inset-0 flex flex-col items-center justify-center pb-[40px]"
        >
          {/* 상단 섹션 타이틀 헤더 */}
          <div className="mb-[32px] flex w-full max-w-[1200px] -translate-y-[12px] flex-col items-start gap-[8px] sm:mb-[44px] sm:gap-[12px] lg:mb-[54px]">
            <span className="font-pre text-sys-primary-default text-[14px] font-semibold tracking-normal">
              Feature
            </span>
            <h2 className="font-pre text-[24px] leading-[1.25] font-bold tracking-tight break-keep text-[var(--color-primitive-gray-900,#1D1D20)] sm:text-[32px] lg:text-[36px]">
              광고 집행에 필요한 모든 과정, 채소집 하나로 끝내세요
            </h2>
          </div>

          {/* 3단 계단식 스택 무대 (1200 x 762 비율) */}
          <div className="relative aspect-[1200/762] max-h-[64vh] w-full max-w-[1200px]">
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

              <div className="absolute top-[6.5%] left-[5%] z-10 flex max-w-[340px] flex-col items-start">
                <span className="font-pre text-[16px] leading-[24px] font-semibold text-[var(--color-primitive-gray-400,#A2A2A8)]">
                  {FEATURE_FOLDERS[0].category}
                </span>
                <h3 className="font-pre mt-[10px] text-[24px] leading-[1.28] font-bold tracking-[-0.02em] break-keep whitespace-pre-line text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[30px] lg:text-[36px]">
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
              }}
              transition={SPRING_TRANSITION}
              style={{
                transformOrigin: 'top center',
                top: '54px',
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

              <div className="absolute top-[6.5%] left-[5%] z-10 flex max-w-[340px] flex-col items-start">
                <span className="font-pre text-[16px] leading-[24px] font-semibold text-[var(--color-primitive-gray-400,#A2A2A8)]">
                  {FEATURE_FOLDERS[1].category}
                </span>
                <h3 className="font-pre mt-[10px] text-[24px] leading-[1.28] font-bold tracking-[-0.02em] break-keep whitespace-pre-line text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[30px] lg:text-[36px]">
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
              }}
              transition={SPRING_TRANSITION}
              style={{
                transformOrigin: 'top center',
                top: '108px',
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

              <div className="absolute top-[6.5%] left-[5%] z-10 flex max-w-[340px] flex-col items-start">
                <span className="font-pre text-[16px] leading-[24px] font-semibold text-[var(--color-primitive-gray-400,#A2A2A8)]">
                  {FEATURE_FOLDERS[2].category}
                </span>
                <h3 className="font-pre mt-[10px] text-[24px] leading-[1.28] font-bold tracking-[-0.02em] break-keep whitespace-pre-line text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[30px] lg:text-[36px]">
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
          className="px-016 sm:px-032 absolute inset-0 flex flex-col items-center justify-center"
        >
          <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[40px] sm:gap-[52px] lg:gap-[60px]">
            {/* 상단 헤더 */}
            <div className="flex flex-col items-center gap-[6px] text-center">
              <span className="font-pre text-[18px] leading-[32px] font-semibold tracking-[-0.5px] text-[var(--color-primitive-gray-400,#A2A2A8)] sm:text-[20px] lg:text-[22px]">
                The Process
              </span>
              <h2 className="font-pre text-[26px] leading-[1.28] font-bold tracking-[-1px] break-keep text-white sm:text-[32px] sm:leading-[52px] lg:text-[36px]">
                이 모든 기능을 채소집 안에서 한 번에!
              </h2>
            </div>

            {/* 4단계 카드 그리드 */}
            <div className="grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[20px]">
              {PROCESS_STEPS.map((item, index) => {
                const isHovered = hoveredProcessIndex === index;

                return (
                  <div
                    key={item.step}
                    onMouseEnter={() => setHoveredProcessIndex(index)}
                    onMouseLeave={() => setHoveredProcessIndex(null)}
                    className={`relative flex h-[286px] w-full cursor-pointer flex-col justify-between rounded-[16px] px-[30px] py-[24px] transition-all duration-300 select-none ${
                      isHovered
                        ? 'bg-white shadow-[0_20px_40px_rgba(0,0,0,0.24)]'
                        : 'bg-[var(--color-primitive-gray-800,#3F3F45)]'
                    }`}
                  >
                    {/* 1) 호버 상태: 상단 타이틀 + 하단 3줄 상세 설명 */}
                    {isHovered ? (
                      <div className="flex h-full flex-col justify-between">
                        <h3 className="font-pre text-[20px] leading-[32px] font-bold tracking-[-0.5px] break-keep whitespace-pre-line text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[22px]">
                          {item.title}
                        </h3>
                        <AnimatePresence>
                          <motion.p
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="font-pre text-[15px] leading-[24px] font-medium tracking-[-0.5px] break-keep whitespace-pre-line text-[var(--color-primitive-gray-600,#6E6E76)] sm:text-[16px]"
                          >
                            {item.description}
                          </motion.p>
                        </AnimatePresence>
                      </div>
                    ) : (
                      /* 2) 기본(Non-hover) 상태: 상단 아이콘 + 하단 텍스트 묶음 (타이틀 + Step 레이블, gap: 6px) */
                      <>
                        <div className="relative size-[40px] shrink-0">
                          <Image
                            src={item.iconSrc}
                            alt={item.iconAlt}
                            fill
                            className="object-contain"
                          />
                        </div>

                        <div className="flex flex-col gap-[6px]">
                          <h3 className="font-pre text-[20px] leading-[32px] font-bold tracking-[-0.5px] break-keep whitespace-pre-line text-white sm:text-[22px]">
                            {item.title}
                          </h3>
                          <span className="font-pre text-[16px] leading-[24px] font-semibold tracking-[-0.5px] text-[var(--color-primitive-gray-400,#A2A2A8)]">
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
