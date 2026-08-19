'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import Image from 'next/image';
import { useInView, animate, useReducedMotion } from 'motion/react';

const ROW_1_LOGOS = [
  {
    id: 'challengers',
    src: '/home-assets/channel-banners/logos/logo-challengers.png',
    width: 266,
    height: 56,
    alt: '챌린저스 로고',
  },
  {
    id: 'watcha-pedia',
    src: '/home-assets/channel-banners/logos/logo-watcha-pedia.png',
    width: 292,
    height: 56,
    alt: '왓챠피디아 로고',
  },
  {
    id: 'inven',
    src: '/home-assets/channel-banners/logos/logo-inven.png',
    width: 196,
    height: 56,
    alt: '인벤 로고',
  },
  {
    id: 'linked-in',
    src: '/home-assets/channel-banners/logos/logo-linked-in.png',
    width: 224,
    height: 56,
    alt: '링크드인 로고',
  },
  {
    id: 'snow',
    src: '/home-assets/channel-banners/logos/logo-snow.png',
    width: 202,
    height: 56,
    alt: '스노우 로고',
  },
  {
    id: 'gmarket',
    src: '/home-assets/channel-banners/logos/logo-gmarket.png',
    width: 215,
    height: 56,
    alt: '지마켓 로고',
  },
];

const ROW_2_LOGOS = [
  {
    id: 'aha',
    src: '/home-assets/channel-banners/logos/logo-aha.png',
    width: 120,
    height: 56,
    alt: '아하 로고',
  },
  {
    id: 'wanted',
    src: '/home-assets/channel-banners/logos/logo-wanted.png',
    width: 264,
    height: 56,
    alt: '원티드 로고',
  },
  {
    id: 'classting',
    src: '/home-assets/channel-banners/logos/logo-classting.png',
    width: 260,
    height: 56,
    alt: '클래스팅 로고',
  },
  {
    id: 'postype',
    src: '/home-assets/channel-banners/logos/logo-postype.png',
    width: 230,
    height: 56,
    alt: '포스타입 로고',
  },
  {
    id: 'nate',
    src: '/home-assets/channel-banners/logos/logo-nate.png',
    width: 135,
    height: 56,
    alt: '네이트 로고',
  },
  {
    id: 'everytime',
    src: '/home-assets/channel-banners/logos/logo-everytime.png',
    width: 246,
    height: 56,
    alt: '에브리타임 로고',
  },
  {
    id: '11st',
    src: '/home-assets/channel-banners/logos/logo-11st.png',
    width: 128,
    height: 56,
    alt: '11번가 로고',
  },
];

function CountUp({ target, duration = 1.6 }: { target: number; duration?: number }): JSX.Element {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) {
      return;
    }

    if (shouldReduceMotion) {
      setCount(target);
      return;
    }

    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1], // 부드러운 가속 후 서서히 안착하는 프리미엄 이징
      onUpdate: (latest) => {
        setCount(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, target, duration, shouldReduceMotion]);

  return <span ref={ref}>{count}</span>;
}

export function HomeChannelBanner(): JSX.Element {
  return (
    <section
      aria-label="국내외 주요 광고 매체 채널 소개"
      className="bg-surface-lowest relative flex w-full flex-col items-center justify-center overflow-hidden py-[90px] sm:py-[120px] lg:py-[140px]"
    >
      {/* 상단 텍스트 및 스탯 영역 (Figma 3722:34484) */}
      <div className="gap-008 px-016 sm:px-032 flex w-full max-w-[1440px] flex-col text-left lg:px-120">
        <h2 className="font-pre text-[24px] leading-[1.3] font-bold tracking-tight text-[var(--color-primitive-gray-900,#1d1d20)] sm:text-[32px] lg:text-[36px]">
          채소집에서 바로 비교하는 국내외 주요 광고 매체
        </h2>

        <div className="mt-[16px] flex flex-col items-start gap-[6px] sm:mt-[24px] sm:gap-[8px]">
          <div className="font-pre flex items-baseline text-[64px] leading-[1.05] font-extrabold tracking-tight text-[var(--color-primitive-gray-900,#1d1d20)] sm:text-[84px] lg:text-[100px]">
            <CountUp target={100} />
            <span>+</span>
          </div>
          <span className="font-pre text-[16px] font-semibold text-[var(--color-primitive-gray-500,#6e6e76)] sm:text-[20px] lg:text-[22px]">
            채소집 제공 채널 수
          </span>
        </div>
      </div>

      {/* 하단 무한 롤링 마키 배너 영역 (상단 간격 mt-96px로 시원하게 확대) */}
      <div className="relative mt-[64px] flex w-full flex-col gap-[32px] overflow-hidden sm:mt-[80px] sm:gap-[44px] lg:mt-[96px] lg:gap-[56px]">
        {/* Row 1: 왼쪽으로 무한 롤링 (풀 컬러 상시 노출) */}
        <div className="flex w-max animate-[marquee-left_35s_linear_infinite] items-center gap-[36px] sm:gap-[44px] lg:gap-[50px]">
          {[...ROW_1_LOGOS, ...ROW_1_LOGOS, ...ROW_1_LOGOS].map((logo, idx) => (
            <div
              key={`r1-${logo.id}-${idx}`}
              className="relative flex h-[44px] shrink-0 items-center justify-center sm:h-[56px]"
              style={{ width: logo.width }}
            >
              <Image
                src={logo.src}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 160px, 300px"
              />
            </div>
          ))}
        </div>

        {/* Row 2: 오른쪽/역방향으로 무한 롤링 (풀 컬러 상시 노출) */}
        <div className="flex w-max animate-[marquee-right_40s_linear_infinite] items-center gap-[36px] sm:gap-[44px] lg:gap-[50px]">
          {[...ROW_2_LOGOS, ...ROW_2_LOGOS, ...ROW_2_LOGOS].map((logo, idx) => (
            <div
              key={`r2-${logo.id}-${idx}`}
              className="relative flex h-[44px] shrink-0 items-center justify-center sm:h-[56px]"
              style={{ width: logo.width }}
            >
              <Image
                src={logo.src}
                alt=""
                fill
                className="object-contain"
                sizes="(max-width: 768px) 160px, 300px"
              />
            </div>
          ))}
        </div>

        {/* 좌측 페이드 그라데이션 오버레이 */}
        <div className="from-surface-lowest pointer-events-none absolute inset-y-0 left-0 z-10 w-[60px] bg-gradient-to-r to-transparent sm:w-[120px] lg:w-[180px]" />

        {/* 우측 페이드 그라데이션 오버레이 */}
        <div className="from-surface-lowest pointer-events-none absolute inset-y-0 right-0 z-10 w-[60px] bg-gradient-to-l to-transparent sm:w-[120px] lg:w-[180px]" />
      </div>
    </section>
  );
}
