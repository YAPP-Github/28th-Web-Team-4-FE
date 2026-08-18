'use client';

import { type JSX, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';

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

export function HomeProcess(): JSX.Element {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="process-title"
      className="w-full bg-[var(--color-primitive-gray-900,#1D1D20)] py-[90px] sm:py-[120px] lg:py-[140px]"
    >
      <div className="px-016 sm:px-032 mx-auto flex w-full max-w-[1200px] flex-col items-center gap-[40px] sm:gap-[52px] lg:gap-[60px]">
        {/* 상단 헤더 (피그마 중앙 정렬 & gap: 6px) */}
        <div className="flex flex-col items-center gap-[6px] text-center">
          <span className="font-pre text-[18px] leading-[32px] font-semibold tracking-[-0.5px] text-[var(--color-primitive-gray-400,#A2A2A8)] sm:text-[20px] lg:text-[22px]">
            The Process
          </span>
          <h2
            id="process-title"
            className="font-pre text-[26px] leading-[1.28] font-bold tracking-[-1px] break-keep text-white sm:text-[32px] sm:leading-[52px] lg:text-[36px]"
          >
            이 모든 기능을 채소집 안에서 한 번에!
          </h2>
        </div>

        {/* 4단계 카드 그리드 (284x286, px-30px py-24px) */}
        <div className="grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[20px]">
          {PROCESS_STEPS.map((item, index) => {
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.step}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
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
                    {/* 상단 40x40 아이콘 */}
                    <div className="relative size-[40px] shrink-0">
                      <Image
                        src={item.iconSrc}
                        alt={item.iconAlt}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* 하단 텍스트 그룹 (타이틀 + Step, gap: 6px) */}
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
    </section>
  );
}
