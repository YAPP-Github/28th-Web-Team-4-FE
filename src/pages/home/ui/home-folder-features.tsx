'use client';

import { type JSX, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react';

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
    buttonLabel: '채널 추천받으러 가기',
    buttonHref: '/login',
    imageSrc: '/home-assets/feature-folders/folder-recommend-v3.png',
    imageAlt: '채소집 채널 추천 기능 소개',
  },
  {
    id: 'comparison',
    category: 'Comparison',
    title: '여러 광고 채널을\n한눈에 비교해요',
    buttonLabel: '채널 비교하러 가기',
    buttonHref: '/compare',
    imageSrc: '/home-assets/feature-folders/folder-compare-v3.png',
    imageAlt: '채소집 채널 비교 기능 소개',
  },
  {
    id: 'simulator',
    category: 'Simulator',
    title: '예산에 따른 광고 성과를\n미리 시뮬레이션해요',
    buttonLabel: '시뮬레이션 해보기',
    buttonHref: '/simulator',
    imageSrc: '/home-assets/feature-folders/folder-simulator-v3.png',
    imageAlt: '채소집 예산 시뮬레이션 기능 소개',
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.28) {
      setActiveStep(0);
    } else if (latest < 0.62) {
      setActiveStep(1);
    } else {
      setActiveStep(2);
    }
  });

  let card1Scale = 1;
  if (activeStep === 1) {
    card1Scale = 0.88;
  } else if (activeStep >= 2) {
    card1Scale = 0.76;
  }

  const card2Y = activeStep >= 1 ? '0%' : '120%';
  const card2Scale = activeStep === 2 ? 0.88 : 1;

  const card3Y = activeStep >= 2 ? '0%' : '120%';

  return (
    <section
      ref={containerRef}
      aria-label="채소집 기능 소개"
      className="relative h-[280vh] w-full bg-[var(--color-surface-background-default,#F4F4F5)]"
    >
      {/* 뷰포트 고정 컨테이너 */}
      <div className="px-016 sm:px-032 sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden pb-[40px]">
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
            {/* 글자/버튼 제외된 피그마 원본 벡터 SVG 캔버스 */}
            <Image
              src={FEATURE_FOLDERS[0].imageSrc}
              alt={FEATURE_FOLDERS[0].imageAlt}
              fill
              priority
              className="object-contain object-top"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />

            {/* 좌측 상단 위치값에 맞게 따로 올린 텍스트 & 진짜 버튼 */}
            <div className="absolute top-[6.5%] left-[5%] z-10 flex max-w-[340px] flex-col items-start">
              <span className="font-pre text-[16px] leading-[24px] font-semibold text-[var(--color-primitive-gray-400,#A2A2A8)]">
                {FEATURE_FOLDERS[0].category}
              </span>
              <h3 className="font-pre mt-[10px] text-[24px] leading-[1.28] font-bold tracking-[-0.02em] break-keep whitespace-pre-line text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[30px] lg:text-[36px]">
                {FEATURE_FOLDERS[0].title}
              </h3>
              <Link
                href={FEATURE_FOLDERS[0].buttonHref}
                className="font-pre hover:border-sys-primary-default hover:text-sys-primary-default mt-[20px] inline-flex items-center gap-[8px] rounded-[8px] border border-[#E4E4E7] bg-white px-[18px] py-[10px] text-[14px] font-semibold text-[var(--color-primitive-gray-900,#2E2E33)] shadow-2xs transition-all active:scale-95"
              >
                <span>{FEATURE_FOLDERS[0].buttonLabel}</span>
                <ArrowRight aria-hidden className="size-[15px]" />
              </Link>
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
            {/* 글자/버튼 제외된 피그마 원본 벡터 SVG 캔버스 */}
            <Image
              src={FEATURE_FOLDERS[1].imageSrc}
              alt={FEATURE_FOLDERS[1].imageAlt}
              fill
              priority
              className="object-contain object-top"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />

            {/* 좌측 상단 위치값에 맞게 따로 올린 텍스트 & 진짜 버튼 */}
            <div className="absolute top-[6.5%] left-[5%] z-10 flex max-w-[340px] flex-col items-start">
              <span className="font-pre text-[16px] leading-[24px] font-semibold text-[var(--color-primitive-gray-400,#A2A2A8)]">
                {FEATURE_FOLDERS[1].category}
              </span>
              <h3 className="font-pre mt-[10px] text-[24px] leading-[1.28] font-bold tracking-[-0.02em] break-keep whitespace-pre-line text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[30px] lg:text-[36px]">
                {FEATURE_FOLDERS[1].title}
              </h3>
              <Link
                href={FEATURE_FOLDERS[1].buttonHref}
                className="font-pre hover:border-sys-primary-default hover:text-sys-primary-default mt-[20px] inline-flex items-center gap-[8px] rounded-[8px] border border-[#E4E4E7] bg-white px-[18px] py-[10px] text-[14px] font-semibold text-[var(--color-primitive-gray-900,#2E2E33)] shadow-2xs transition-all active:scale-95"
              >
                <span>{FEATURE_FOLDERS[1].buttonLabel}</span>
                <ArrowRight aria-hidden className="size-[15px]" />
              </Link>
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
            {/* 글자/버튼 제외된 피그마 원본 벡터 SVG 캔버스 */}
            <Image
              src={FEATURE_FOLDERS[2].imageSrc}
              alt={FEATURE_FOLDERS[2].imageAlt}
              fill
              priority
              className="object-contain object-top"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />

            {/* 좌측 상단 위치값에 맞게 따로 올린 텍스트 & 진짜 버튼 */}
            <div className="absolute top-[6.5%] left-[5%] z-10 flex max-w-[340px] flex-col items-start">
              <span className="font-pre text-[16px] leading-[24px] font-semibold text-[var(--color-primitive-gray-400,#A2A2A8)]">
                {FEATURE_FOLDERS[2].category}
              </span>
              <h3 className="font-pre mt-[10px] text-[24px] leading-[1.28] font-bold tracking-[-0.02em] break-keep whitespace-pre-line text-[var(--color-primitive-gray-900,#2E2E33)] sm:text-[30px] lg:text-[36px]">
                {FEATURE_FOLDERS[2].title}
              </h3>
              <Link
                href={FEATURE_FOLDERS[2].buttonHref}
                className="font-pre hover:border-sys-primary-default hover:text-sys-primary-default mt-[20px] inline-flex items-center gap-[8px] rounded-[8px] border border-[#E4E4E7] bg-white px-[18px] py-[10px] text-[14px] font-semibold text-[var(--color-primitive-gray-900,#2E2E33)] shadow-2xs transition-all active:scale-95"
              >
                <span>{FEATURE_FOLDERS[2].buttonLabel}</span>
                <ArrowRight aria-hidden className="size-[15px]" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
