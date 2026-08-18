'use client';

import { useEffect, useRef, useState, type JSX } from 'react';
import Image from 'next/image';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
  AnimatePresence,
} from 'motion/react';

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

// 1초마다 괄호 안에서 회전/교체되는 채널 로고 목록 (알바몬/뉴닉 제외 5종)
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

// 탄력적인 "띠용~" 스프링 트랜지션
const SPRING_TRANSITION = {
  type: 'spring',
  stiffness: 380,
  damping: 24,
  mass: 0.8,
} as const;

function WorryRow({
  item,
  isActive,
}: {
  item: (typeof WORRY_ITEMS)[number];
  isActive: boolean;
}): JSX.Element {
  return (
    <motion.div
      initial={false}
      animate={{ height: isActive ? 127 : 70 }}
      transition={SPRING_TRANSITION}
      className="relative flex w-full items-center justify-center overflow-visible text-center"
    >
      <motion.div
        initial={false}
        animate={{
          color: isActive
            ? 'var(--color-primitive-gray-0, #ffffff)'
            : 'var(--color-primitive-gray-700, #52525a)',
          scale: isActive ? 1.08 : 1,
        }}
        transition={SPRING_TRANSITION}
        className="font-wanted flex items-center justify-center text-center font-bold tracking-tight whitespace-nowrap"
      >
        <span className="text-center text-[22px] font-bold sm:text-[34px] lg:text-[48px]">
          {item.prefix}
        </span>

        {/* 스크롤 시 가운데가 열리며 띠용~ 하고 튀어나오는 탄력 아이콘 (비활성 시에도 자연스러운 띄어쓰기 간격 유지) */}
        <motion.div
          initial={false}
          animate={{
            width: isActive ? 127 : 0,
            opacity: isActive ? 1 : 0,
            scale: isActive ? 1 : 0.2,
            marginInline: isActive ? 19 : 6,
          }}
          transition={SPRING_TRANSITION}
          className="relative h-[48px] shrink-0 overflow-hidden sm:h-[80px] lg:h-[127px]"
        >
          <Image src={item.iconSrc} alt={item.iconAlt} fill className="object-contain" priority />
        </motion.div>

        <span className="text-center text-[22px] font-bold sm:text-[34px] lg:text-[48px]">
          {item.suffix}
        </span>
      </motion.div>
    </motion.div>
  );
}

const ZIP_CHARS = ['.', 'z', 'i', 'p'];

export function HomeQuestion(): JSX.Element {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <section
        aria-label="서비스 핵심 질문 및 타이틀"
        className="gap-032 px-016 flex min-h-screen w-full flex-col items-center justify-center bg-[#262626] py-[120px]"
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
  const [activeStep, setActiveStep] = useState<number>(-1); // -1: 첫질문, 0: 고민1, 1: 고민2, 2: 고민3, 3: 오렌지타이틀
  const [zipTypedCount, setZipTypedCount] = useState<number>(0);
  const [currentLogoIndex, setCurrentLogoIndex] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // 스크롤 위치에 따라 단계별 전환
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest < 0.16) {
      setActiveStep(-1);
    } else if (latest < 0.32) {
      setActiveStep(0);
    } else if (latest < 0.48) {
      setActiveStep(1);
    } else if (latest < 0.62) {
      setActiveStep(2);
    } else {
      setActiveStep(3);
    }
  });

  const isOrangeActive = activeStep === 3;

  // 1초마다 괄호 안의 채널 로고가 로테이션되며 교체
  useEffect(() => {
    if (!isOrangeActive) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentLogoIndex((prev) => (prev + 1) % CHANNEL_LOGOS.length);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOrangeActive]);

  // 오렌지 상태 진입 시: "채널소개모음" 팝인 후 ".zip"만 순차 타이핑
  useEffect(() => {
    if (!isOrangeActive) {
      setZipTypedCount(0);
      return;
    }

    // 0.65초 뒤 .zip이 한 글자씩 톡 톡 톡 타이핑됨
    const startTimer = setTimeout(() => {
      let count = 0;
      const interval = setInterval(() => {
        count += 1;
        setZipTypedCount(count);
        if (count >= ZIP_CHARS.length) {
          clearInterval(interval);
        }
      }, 90);

      return () => clearInterval(interval);
    }, 650);

    return () => clearTimeout(startTimer);
  }, [isOrangeActive]);

  // 1. Phase 1: 흰색 문 오픈 (0 -> 0.12)
  const topWhitePanelY = useTransform(scrollYProgress, [0, 0.12], ['0%', '-100%']);
  const bottomWhitePanelY = useTransform(scrollYProgress, [0, 0.12], ['0%', '100%']);

  // 2. Phase 1: 첫 질문 텍스트는 0.12까지 머물다가 0.12~0.18에서 완전히 페이드아웃
  const introQuestionOpacity = useTransform(scrollYProgress, [0, 0.12, 0.18, 1.0], [1, 1, 0, 0]);
  const introQuestionY = useTransform(scrollYProgress, [0.12, 0.18, 1.0], [0, -30, -30]);

  // 3. Phase 2: 3개 고민 리스트 등장 (0.16 -> 0.22) 및 퇴장 (0.58 -> 0.64)
  const listOpacity = useTransform(scrollYProgress, [0.16, 0.22, 0.58, 0.64, 1.0], [0, 1, 1, 0, 0]);
  const listY = useTransform(scrollYProgress, [0.16, 0.22, 0.58, 0.64, 1.0], [30, 0, 0, -30, -30]);

  // 4. Phase 3: 그 자리에서 배경색 전환 (#262626 다크 -> var(--color-sys-primary-default, #ff6817))
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.58, 0.66, 1.0],
    ['#262626', '#262626', '#ff6817', '#ff6817'],
  );

  const currentLogo = CHANNEL_LOGOS[currentLogoIndex] ?? CHANNEL_LOGOS[0];

  return (
    <section
      ref={sectionRef}
      aria-label="서비스 핵심 질문 및 타이틀"
      className="relative h-[420vh] w-full"
    >
      <motion.div
        style={{ backgroundColor }}
        className="px-016 sticky top-0 flex h-dvh w-full items-center justify-center overflow-hidden select-none"
      >
        {/* Phase 1: 첫 질문 ("지금, 이런 고민을 하고 계시지 않나요?") */}
        <motion.div
          style={{ opacity: introQuestionOpacity, y: introQuestionY }}
          className="px-016 pointer-events-none absolute z-10 flex flex-col items-center justify-center text-center"
        >
          <h2 className="font-wanted text-center text-[32px] leading-[1.35] font-bold tracking-tight text-white sm:text-[42px] lg:text-[48px]">
            지금,
            <br />
            이런 고민을 하고 계시지 않나요?
          </h2>
        </motion.div>

        {/* Phase 2: 3개 고민 리스트 (쫀쫀한 6px 간격 및 완벽한 중앙 정렬) */}
        <motion.div
          style={{ opacity: listOpacity, y: listY }}
          className="px-016 z-10 flex w-full max-w-[1200px] flex-col items-center justify-center gap-[6px] text-center"
        >
          {WORRY_ITEMS.map((item, index) => (
            <WorryRow key={item.id} item={item} isActive={activeStep === index} />
          ))}
        </motion.div>

        {/* Phase 3: 오렌지 배경 전환 완료 시 나타나는 대형 타이포그래피 (조화로운 갭 설정) */}
        <div
          className={`absolute z-10 flex w-full max-w-[1200px] flex-col items-center justify-center gap-[24px] text-center text-white sm:gap-[36px] lg:gap-[48px] ${
            isOrangeActive ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {/* Line 1: 진짜 ( [1초마다 바뀌는 채널 로고] ) 채널을 (Pretendard ExtraBold) */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOrangeActive ? 1 : 0,
              y: isOrangeActive ? 0 : 36,
            }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="font-pre flex items-center justify-center gap-[6px] text-center text-[36px] leading-[1.15] font-extrabold tracking-tight whitespace-nowrap sm:gap-[14px] sm:text-[64px] lg:gap-[20px] lg:text-[100px]"
          >
            <span>진짜</span>

            {/* 괄호 및 내부 1초 회전 채널 로고 컨테이너 */}
            <div className="flex items-center justify-center font-bold">
              <span>(</span>
              <motion.div
                initial={false}
                animate={{
                  width: isOrangeActive ? 320 : 0,
                }}
                transition={{
                  delay: 0.2,
                  type: 'spring',
                  stiffness: 280,
                  damping: 22,
                }}
                className="relative flex h-[70px] items-center justify-center overflow-visible px-[4px] sm:h-[110px] lg:h-[150px]"
              >
                <AnimatePresence mode="wait">
                  {isOrangeActive && (
                    <motion.div
                      key={currentLogo.id}
                      initial={{ opacity: 0, scale: 0.8, y: 14 }}
                      animate={{
                        opacity: 1,
                        scale: 1.15,
                        y: 0,
                        rotate: currentLogo.rotate,
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: -14 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="relative flex h-full w-[220px] items-center justify-center sm:w-[300px] lg:w-[360px]"
                    >
                      <Image
                        src={currentLogo.src}
                        alt={currentLogo.alt}
                        fill
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
          </motion.div>

          {/* Line 2: 하나로 모아주는 (Pretendard ExtraBold) */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOrangeActive ? 1 : 0,
              y: isOrangeActive ? 0 : 36,
            }}
            transition={{
              delay: 0.25,
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="font-pre text-center text-[36px] leading-[1.15] font-extrabold tracking-tight whitespace-nowrap sm:text-[64px] lg:text-[100px]"
          >
            하나로 모아주는
          </motion.div>

          {/* Line 3: 채널소개모음.zip (Pretendard Bold 피그마 스펙 100% 매핑) */}
          <motion.div
            initial={false}
            animate={{
              opacity: isOrangeActive ? 1 : 0,
              y: isOrangeActive ? 0 : 36,
            }}
            transition={{
              delay: 0.45,
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex w-full items-center justify-center overflow-visible text-center"
          >
            <div className="font-pre inline-flex items-center justify-center text-center text-[36px] leading-[1.15] font-bold tracking-tight whitespace-nowrap text-white sm:text-[64px] lg:text-[100px]">
              <span>채널소개모음</span>
              <span className="font-bold text-white">
                {ZIP_CHARS.slice(0, zipTypedCount).join('')}
              </span>
            </div>
          </motion.div>
        </div>

        {/* 앞을 덮고 있다가 위로 열리는 상단 흰색 패널 */}
        <motion.div
          style={{ y: topWhitePanelY }}
          className="bg-surface-lowest absolute inset-x-0 top-0 z-20 h-1/2 shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
        />

        {/* 앞을 덮고 있다가 아래로 열리는 하단 흰색 패널 */}
        <motion.div
          style={{ y: bottomWhitePanelY }}
          className="bg-surface-lowest absolute inset-x-0 bottom-0 z-20 h-1/2 shadow-[0_-12px_24px_rgba(0,0,0,0.06)]"
        />
      </motion.div>
    </section>
  );
}
