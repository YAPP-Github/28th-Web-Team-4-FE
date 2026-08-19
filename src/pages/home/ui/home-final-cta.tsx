'use client';

import { type JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { Button } from '@/shared/ui/button';

// 피그마 노드 4281:35289 1:1 정밀 스펙 (사용자 커스텀 배치 100% 유지)
const FOLDER_3D_ITEMS = [
  {
    id: 'folder-1',
    left: '10%',
    top: '6%',
    width: 190,
    height: 190,
    rotate: -1,
    opacity: 0.2, // 20%
    blur: '1px',
    delay: 0.04,
    floatDuration: 5.2,
  },
  {
    id: 'folder-2',
    left: '-18%', // 좌측으로 더 밈
    top: '42%', // 아래로 더 내림
    width: 424.2,
    height: 424.2,
    rotate: 139.9,
    opacity: 0.16, // 16%
    blur: '1.8px',
    delay: 0.1,
    floatDuration: 6.8,
  },
  {
    id: 'folder-3',
    left: '65%',
    top: '8%',
    width: 75.0,
    height: 75.0,
    rotate: 162.5,
    opacity: 0.12, // 12%
    blur: '2.0px',
    delay: 0.16,
    floatDuration: 4.6,
  },
  {
    id: 'folder-4',
    left: '80%',
    top: '-16%',
    width: 210,
    height: 210,
    rotate: -138,
    opacity: 0.1, // 10%
    blur: '2px',
    delay: 0.07,
    floatDuration: 5.8,
  },
  {
    id: 'folder-5',
    left: '26%',
    top: '61.31%',
    width: 100,
    height: 100,
    rotate: 44.7,
    opacity: 0.13, // 13%
    blur: '2px',
    delay: 0.2,
    floatDuration: 4.9,
  },
  {
    id: 'folder-6',
    left: '72%',
    top: '52%',
    width: 320,
    height: 320,
    rotate: 26,
    opacity: 0.2, // 20%
    blur: '2px',
    delay: 0.13,
    floatDuration: 7.2,
  },
] as const;

const RECOMMEND_ONBOARDING_HREF = '/recommend/onboarding/new';

export function HomeFinalCta(): JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="채소집 시작하기 안내 배너"
      className="bg-surface-lowest px-016 sm:px-032 w-full py-[60px] sm:py-[80px] lg:px-120 lg:py-[100px]"
    >
      <div className="bg-sys-primary-default relative mx-auto flex min-h-[380px] w-full max-w-[1380px] flex-col items-center justify-center overflow-hidden rounded-[24px] px-[24px] py-[48px] text-center shadow-[inset_0_0_72px_rgba(255,255,255,0.4)] sm:min-h-[410px] sm:rounded-[32px] sm:px-[40px] sm:py-[60px] lg:px-[60px]">
        {/* ================= 피그마 순수 오렌지 캔버스 배경 ================= */}
        <div className="pointer-events-none absolute inset-0 size-full select-none">
          <Image
            src="/home-assets/final-cta/final-cta-canvas.png"
            alt="채소집 안내 배너 배경"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1380px) 100vw, 1380px"
          />
        </div>

        {/* ================= 피그마 4281:35289 1:1 위치·크기·로테이션 3D 폴더 레이어 (중앙 팡! 버스트 & 수직 부유 모션) ================= */}
        <div className="pointer-events-none absolute inset-0 size-full overflow-hidden select-none">
          {FOLDER_3D_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              initial={
                shouldReduceMotion
                  ? { opacity: item.opacity, scale: 1 }
                  : { opacity: 0, scale: 0.05 }
              }
              whileInView={{
                opacity: item.opacity,
                scale: 1,
              }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 13,
                mass: 0.8,
                delay: item.delay,
              }}
              style={{
                position: 'absolute',
                left: item.left,
                top: item.top,
                width: `clamp(${item.width * 0.6}px, ${(item.width / 1380) * 100}vw, ${item.width}px)`,
                height: `clamp(${item.height * 0.6}px, ${(item.height / 1380) * 100}vw, ${item.height}px)`,
              }}
            >
              {/* 1. 수직(Y축) 글로벌 부유 래퍼: 회전축과 분리되어 모든 폴더가 위아래로만 은은하게 유영 */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [-6, 6, -6],
                      }
                }
                transition={{
                  duration: item.floatDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: item.delay + 0.6,
                }}
                className="size-full"
              >
                {/* 2. 그래픽 렌더링 래퍼: 고유 회전각 및 블러 적용 */}
                <div
                  style={{
                    transform: `rotate(${item.rotate}deg)`,
                    transformOrigin: 'center center',
                    filter: `blur(${item.blur})`,
                    WebkitFilter: `blur(${item.blur})`,
                  }}
                  className="relative size-full"
                >
                  <Image
                    src="/home-assets/final-cta/folder-3d.png"
                    alt="채소집 3D 폴더"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 200px, 513px"
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ================= 텍스트 & CTA 버튼 (중앙 정렬) ================= */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30, scale: 0.94 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="relative z-10 flex max-w-[780px] flex-col items-center gap-[24px] sm:gap-[32px]"
        >
          {/* 타이틀 및 서브카피 */}
          <div className="flex flex-col items-center gap-[10px] sm:gap-[14px]">
            <h2 className="font-pre text-[24px] leading-[1.3] font-bold tracking-tight break-keep text-white sm:text-[32px] lg:text-[36px] lg:leading-[52px]">
              수많은 광고 채널, 더 이상 고민 말고 채소집에서 비교해요
            </h2>
            <p className="font-pre text-[15px] leading-[1.4] font-medium tracking-tight break-keep text-[#FFF4ED] sm:text-[18px] lg:text-[20px] lg:leading-[32px]">
              지금 바로 시작하고 조건에 맞는 최적의 채널과 예상 성과를 확인해 보세요
            </p>
          </div>

          {/* CTA 버튼: 바로 채널 추천받기 (공통 Button 컴포넌트 사용 + 스트록 및 그림자 제거) */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Button
              frame="button"
              tone="stroke"
              nativeButton={false}
              render={<Link href={RECOMMEND_ONBOARDING_HREF} />}
              className="h-[52px] rounded-[12px] border-none bg-white px-[24px] text-[16px] font-semibold text-[var(--color-primitive-gray-800,#3F3F45)] shadow-none hover:not-data-disabled:bg-gray-50"
              rightIcon={
                <ArrowRight
                  aria-hidden
                  className="size-[16px] text-[var(--color-primitive-gray-800,#3F3F45)]"
                />
              }
            >
              바로 채널 추천받기
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
