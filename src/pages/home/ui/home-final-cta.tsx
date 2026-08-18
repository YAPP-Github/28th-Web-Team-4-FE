'use client';

import { type JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { useAuthSession } from '@/features/auth/session';

// 피그마 노드 4257:37043 및 최신 symbol-login(3934:31219) 1:1 완벽 정밀 스펙
const SYMBOL_ITEMS = [
  {
    id: 'symbol-1',
    desktopSize: 246,
    mobileSize: 150,
    targetLeft: '9.39%',
    targetTop: '-1.83%',
    rotate: -8,
    targetOpacity: 0.22, // 22%
    blur: '3.5px',
    delay: 0.04,
    floatDuration: 5.2,
  },
  {
    id: 'symbol-2',
    desktopSize: 424,
    mobileSize: 260,
    targetLeft: '-16.31%',
    targetTop: '30.98%',
    rotate: 10,
    targetOpacity: 0.14, // 14%
    blur: '5.5px',
    delay: 0.1,
    floatDuration: 6.8,
  },
  {
    id: 'symbol-3',
    desktopSize: 99,
    mobileSize: 65,
    targetLeft: '67.73%',
    targetTop: '9.76%',
    rotate: 12,
    targetOpacity: 0.16, // 16%
    blur: '1.5px',
    delay: 0.16,
    floatDuration: 4.6,
  },
  {
    id: 'symbol-4',
    desktopSize: 278,
    mobileSize: 170,
    targetLeft: '76.88%',
    targetTop: '-36.83%',
    rotate: -14,
    targetOpacity: 0.18, // 18%
    blur: '3.8px',
    delay: 0.07,
    floatDuration: 5.8,
  },
  {
    id: 'symbol-5',
    desktopSize: 127,
    mobileSize: 80,
    targetLeft: '23.98%',
    targetTop: '61.31%',
    rotate: 6,
    targetOpacity: 0.16, // 16%
    blur: '1.8px',
    delay: 0.2,
    floatDuration: 4.9,
  },
  {
    id: 'symbol-6',
    desktopSize: 513,
    mobileSize: 310,
    targetLeft: '68.41%',
    targetTop: '39.02%',
    rotate: -10,
    targetOpacity: 0.22, // 22%
    blur: '7.5px',
    delay: 0.13,
    floatDuration: 7.2,
  },
] as const;

export function HomeFinalCta(): JSX.Element {
  const { isAuthenticated } = useAuthSession();
  const href = isAuthenticated ? '/recommend/onboarding/new' : '/login';
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="채소집 시작하기 안내 배너"
      className="bg-surface-lowest px-016 sm:px-032 w-full py-[60px] sm:py-[80px] lg:py-[100px]"
    >
      <div className="bg-sys-primary-default relative mx-auto flex min-h-[380px] w-full max-w-[1380px] flex-col items-center justify-center overflow-hidden rounded-[24px] px-[24px] py-[48px] text-center shadow-[inset_0_0_72px_rgba(255,255,255,0.4)] sm:min-h-[410px] sm:rounded-[32px] sm:px-[40px] sm:py-[60px] lg:px-[60px]">
        {/* ================= 피그마 4257:37084 순수 배경 캔버스 ================= */}
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

        {/* ================= 중앙에서 사방으로 팡! 터져나가는 최신 3D 심볼 버스트 레이어 ================= */}
        <div className="pointer-events-none absolute inset-0 size-full overflow-hidden select-none">
          {SYMBOL_ITEMS.map((item) => (
            <motion.div
              key={item.id}
              initial={
                shouldReduceMotion
                  ? {
                      left: item.targetLeft,
                      top: item.targetTop,
                      opacity: item.targetOpacity,
                      scale: 1,
                      rotate: item.rotate,
                    }
                  : {
                      left: '50%',
                      top: '50%',
                      x: '-50%',
                      y: '-50%',
                      opacity: 0,
                      scale: 0.05,
                      rotate: 0,
                    }
              }
              whileInView={
                shouldReduceMotion
                  ? undefined
                  : {
                      left: item.targetLeft,
                      top: item.targetTop,
                      x: '0%',
                      y: '0%',
                      opacity: item.targetOpacity,
                      scale: 1,
                      rotate: item.rotate,
                    }
              }
              viewport={{ once: false, amount: 0.25 }}
              transition={{
                type: 'spring',
                stiffness: 130,
                damping: 12,
                mass: 0.75,
                delay: item.delay,
              }}
              style={{
                filter: `blur(${item.blur})`,
                WebkitFilter: `blur(${item.blur})`,
              }}
              className="absolute"
            >
              {/* 안착 후 은은한 유영(Floating) 마이크로 인터랙션 */}
              <motion.div
                animate={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: [-6, 6, -6],
                        rotate: [0, 3, 0],
                      }
                }
                transition={{
                  duration: item.floatDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: item.delay + 0.6,
                }}
                className="relative"
                style={{
                  width: `clamp(${item.mobileSize}px, 28vw, ${item.desktopSize}px)`,
                  height: `clamp(${item.mobileSize}px, 28vw, ${item.desktopSize}px)`,
                }}
              >
                <Image
                  src="/home-assets/final-cta/symbol.png"
                  alt=""
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 200px, 513px"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* ================= 텍스트 & CTA 버튼 (중앙 정렬) ================= */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30, scale: 0.94 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.25 }}
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

          {/* CTA 버튼: 바로 채널 추천받기 (호버 인터랙션) */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              href={href}
              className="font-pre inline-flex h-[52px] items-center justify-center gap-[8px] rounded-[12px] bg-white px-[24px] py-[14px] text-[16px] font-semibold text-[var(--color-primitive-gray-800,#3F3F45)] shadow-sm transition-all hover:bg-gray-50"
            >
              <span>바로 채널 추천받기</span>
              <ArrowRight
                aria-hidden
                className="size-[16px] text-[var(--color-primitive-gray-800,#3F3F45)]"
              />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
