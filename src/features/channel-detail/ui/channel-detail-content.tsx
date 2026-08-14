'use client';

import { useEffect, useRef, useState, type JSX, type ReactNode } from 'react';
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from 'motion/react';
import useMeasure from 'react-use-measure';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';
import {
  ChannelDetailAudiencePanel,
  ChannelDetailCasesPanel,
  ChannelDetailProductsPanel,
  ChannelDetailSummaryPanel,
} from '@/features/channel-detail/ui/panels';
import { cn } from '@/shared/ui/cn';
import { Tabs } from '@/shared/ui/tabs';

const TAB_ITEMS = [
  { value: 'summary', label: '핵심 요약' },
  { value: 'products', label: '광고 상품' },
  { value: 'audience', label: '타깃층' },
  { value: 'cases', label: '광고 예시' },
] as const;

type TabValue = (typeof TAB_ITEMS)[number]['value'];

const PANEL_OPACITY_EASE = [0.77, 0, 0.175, 1] as const;

const PANEL_TRANSITION = {
  duration: 0.25,
  type: 'spring',
  bounce: 0,
} as const;

const PANEL_CONTENT_TRANSITION = {
  default: PANEL_TRANSITION,
  opacity: {
    duration: 0.25,
    type: 'tween',
    ease: PANEL_OPACITY_EASE,
  },
} as const;

const PANEL_EXIT_TRANSITION = {
  default: {
    duration: 0.14,
    type: 'spring',
    bounce: 0,
  },
  opacity: {
    duration: 0.14,
    type: 'tween',
    ease: PANEL_OPACITY_EASE,
  },
} as const;

const PANEL_REDUCED_MOTION_TRANSITION = {
  duration: 0.15,
  type: 'tween',
  ease: PANEL_OPACITY_EASE,
} as const;

const PANEL_SLIDE_VARIANTS = {
  initial: (direction: number) => ({
    transform: `translateX(${16 * direction}px)`,
    opacity: 0,
  }),
  active: {
    transform: 'translateX(0px)',
    opacity: 1,
  },
  exit: (direction: number) => ({
    transform: `translateX(${-16 * direction}px)`,
    opacity: 0,
    transition: PANEL_EXIT_TRANSITION,
  }),
} as const;

const PANEL_FADE_VARIANTS = {
  initial: { opacity: 0 },
  active: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

const PANEL_STATIC_VARIANTS = {
  initial: { opacity: 1 },
  active: { opacity: 1 },
  exit: { opacity: 1 },
} as const;

function getSlideDirection(activationDirection: 'left' | 'right' | 'up' | 'down' | 'none'): 1 | -1 {
  return activationDirection === 'left' || activationDirection === 'up' ? -1 : 1;
}

function isKeyboardActivationEvent(event: Event): boolean {
  return event instanceof KeyboardEvent || (event instanceof MouseEvent && event.detail === 0);
}

/**
 * hug 높이 모달이 탭 콘텐츠에 맞춰 늘어나도록 높이·슬라이드를 함께 애니한다.
 * (공통 Tabs가 아닌 채널 상세 모달 조합의 책임)
 */
function ChannelDetailAnimatedPanel({
  value,
  direction,
  disableMotion,
  children,
  className,
}: {
  value: string;
  direction: 1 | -1;
  disableMotion: boolean;
  children: ReactNode;
  className?: string;
}): JSX.Element {
  const [measureRef, bounds] = useMeasure({ offsetSize: true });
  const reduceMotion = useReducedMotion();
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const previousHeightRef = useRef<number | 'auto'>('auto');
  let transition: Transition = PANEL_CONTENT_TRANSITION;
  let variants: Variants = PANEL_SLIDE_VARIANTS;

  useEffect(() => {
    if (bounds.height > 0) {
      setHeight(bounds.height);
    }
  }, [bounds.height]);

  useEffect(() => {
    previousHeightRef.current = height;
  }, [height]);

  if (reduceMotion) {
    transition = PANEL_REDUCED_MOTION_TRANSITION;
    variants = PANEL_FADE_VARIANTS;
  }

  if (disableMotion) {
    transition = { duration: 0 };
    variants = PANEL_STATIC_VARIANTS;
  }

  // 최초 측정과 접근성·키보드 전환은 스냅하고, 포인터 탭 전환만 높이를 보간한다.
  const shouldSnapHeight = previousHeightRef.current === 'auto' && typeof height === 'number';
  const shouldAnimateHeight =
    !disableMotion && !reduceMotion && !shouldSnapHeight && height !== 'auto';

  return (
    <MotionConfig transition={transition}>
      <motion.div
        initial={false}
        animate={{ height }}
        transition={shouldAnimateHeight ? PANEL_TRANSITION : { duration: 0 }}
        className={cn('overflow-hidden', className)}
      >
        <div ref={measureRef} className="relative w-full">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={value}
              custom={direction}
              variants={variants}
              initial="initial"
              animate="active"
              exit="exit"
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </MotionConfig>
  );
}

function ChannelDetailTabPanel({
  tab,
  channel,
}: {
  tab: TabValue;
  channel: ChannelDetail;
}): JSX.Element {
  switch (tab) {
    case 'summary':
      return <ChannelDetailSummaryPanel channel={channel} />;
    case 'products':
      return <ChannelDetailProductsPanel channel={channel} />;
    case 'audience':
      return <ChannelDetailAudiencePanel channel={channel} />;
    case 'cases':
      return <ChannelDetailCasesPanel channel={channel} />;
  }
}

export type ChannelDetailContentProps = {
  channel: ChannelDetail;
};

export function ChannelDetailContent({ channel }: ChannelDetailContentProps): JSX.Element {
  const [tab, setTab] = useState<TabValue>('summary');
  const [direction, setDirection] = useState<1 | -1>(1);
  const [disableTabMotion, setDisableTabMotion] = useState(false);

  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value, details) => {
        setDisableTabMotion(isKeyboardActivationEvent(details.event));
        setDirection(getSlideDirection(details.activationDirection));
        setTab(value as TabValue);
      }}
    >
      <Tabs.List>
        {TAB_ITEMS.map((item) => (
          <Tabs.Tab key={item.value} value={item.value}>
            {item.label}
          </Tabs.Tab>
        ))}
        <Tabs.Indicator />
      </Tabs.List>

      {/* tabs ↔ panel: spacing/020 — 높이 애니 영역 밖에 둬서 패딩이 잘리지 않게 한다 */}
      <div className="pt-020">
        <ChannelDetailAnimatedPanel
          value={tab}
          direction={direction}
          disableMotion={disableTabMotion}
        >
          <ChannelDetailTabPanel tab={tab} channel={channel} />
        </ChannelDetailAnimatedPanel>
      </div>
    </Tabs.Root>
  );
}
