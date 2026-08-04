'use client';

import { useEffect, useState, type JSX, type ReactNode } from 'react';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
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
  { value: 'cases', label: '유사 사례' },
] as const;

type TabValue = (typeof TAB_ITEMS)[number]['value'];

const PANEL_HEIGHT_TRANSITION = {
  duration: 0.5,
  type: 'spring',
  bounce: 0,
} as const;

const PANEL_SLIDE_VARIANTS = {
  initial: (direction: number) => ({
    x: `${110 * direction}%`,
    opacity: 0,
  }),
  active: {
    x: '0%',
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: `${-110 * direction}%`,
    opacity: 0,
  }),
} as const;

function getSlideDirection(activationDirection: 'left' | 'right' | 'up' | 'down' | 'none'): 1 | -1 {
  return activationDirection === 'left' || activationDirection === 'up' ? -1 : 1;
}

/**
 * hug 높이 모달이 탭 콘텐츠에 맞춰 늘어나도록 높이·슬라이드를 함께 애니한다.
 * (공통 Tabs가 아닌 채널 상세 모달 조합의 책임)
 */
function ChannelDetailAnimatedPanel({
  value,
  direction,
  children,
  className,
}: {
  value: string;
  direction: 1 | -1;
  children: ReactNode;
  className?: string;
}): JSX.Element {
  const [measureRef, bounds] = useMeasure({ offsetSize: true });
  const [hasMeasuredHeight, setHasMeasuredHeight] = useState(false);
  const reduceMotion = useReducedMotion();
  const height = bounds.height || 'auto';
  const shouldAnimateHeight = hasMeasuredHeight && !reduceMotion && height !== 'auto';

  useEffect(() => {
    if (bounds.height > 0) {
      setHasMeasuredHeight(true);
    }
  }, [bounds.height]);

  return (
    <MotionConfig transition={reduceMotion ? { duration: 0 } : PANEL_HEIGHT_TRANSITION}>
      <motion.div
        initial={false}
        animate={{ height }}
        transition={shouldAnimateHeight ? PANEL_HEIGHT_TRANSITION : { duration: 0 }}
        className={cn('overflow-hidden', className)}
      >
        <div ref={measureRef} className="w-full">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={value}
              custom={direction}
              variants={PANEL_SLIDE_VARIANTS}
              initial={reduceMotion ? false : 'initial'}
              animate="active"
              exit={reduceMotion ? undefined : 'exit'}
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

  return (
    <Tabs.Root
      value={tab}
      onValueChange={(value, details) => {
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
        <ChannelDetailAnimatedPanel value={tab} direction={direction}>
          <ChannelDetailTabPanel tab={tab} channel={channel} />
        </ChannelDetailAnimatedPanel>
      </div>
    </Tabs.Root>
  );
}
