'use client';

import { useState, type JSX } from 'react';
import { Download, Info } from 'lucide-react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

export type RecommendResultSubHeaderProps = {
  serviceName: string;
};

export function RecommendResultSubHeader({
  serviceName,
}: RecommendResultSubHeaderProps): JSX.Element {
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const title = (
    <Box className="gap-006 flex items-center">
      <Text as="h1" variant="heading-lg" className="text-text-highest break-keep">
        {serviceName}에 딱 맞는 채널이에요
      </Text>
      <Box
        className="relative inline-flex shrink-0"
        onMouseEnter={() => setIsInfoOpen(true)}
        onMouseLeave={() => setIsInfoOpen(false)}
        onFocus={() => setIsInfoOpen(true)}
        onBlur={() => setIsInfoOpen(false)}
      >
        <button
          type="button"
          aria-label="추천 결과 안내"
          aria-expanded={isInfoOpen}
          aria-controls="recommend-result-info"
          className="text-icon-low hover:text-icon-high focus-visible:outline-sys-primary-default size-018 inline-flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Info aria-hidden="true" className="size-018" />
        </button>
        {isInfoOpen ? (
          <Box
            id="recommend-result-info"
            role="tooltip"
            className="bg-surface-lowest px-016 py-016 shadow-drop-shadow-02 absolute top-[calc(100%+8px)] left-0 z-30 w-[228px] rounded-tr-[var(--radius-m)] rounded-br-[var(--radius-m)] rounded-bl-[var(--radius-m)]"
          >
            <Box className="gap-008 flex w-full flex-col items-start">
              <Text as="strong" variant="subtitle-sm" className="text-text-high block w-full">
                클릭 1회당 비용이란?
              </Text>
              <Text as="p" variant="body-xs" className="text-text-medium m-0 w-full">
                광고 클릭당 비용(CPC)을 말해요.
                <br /> 채소집에서는 쉬운 비교를 위해
                <br /> 단위를 모두 클릭 수 기준으로 통일했어요.
              </Text>
            </Box>
          </Box>
        ) : null}
      </Box>
    </Box>
  );

  return (
    <Box className="bg-surface-lowest border-outline-low h-072 px-016 sm:px-032 w-full border-y lg:px-120">
      <Box className="flex h-full w-full max-w-[1200px] items-center justify-between lg:mx-auto">
        <Box className="gap-016 sm:gap-052 flex items-center">
          <Box className="shrink-0">{title}</Box>
          <Text as="p" variant="subtitle-xxs" className="text-text-low m-0 whitespace-nowrap">
            입력하신 조건으로 분석했어요
          </Text>
        </Box>
        <button
          type="button"
          className="bg-btn-sub-low border-outline-low text-text-high focus-visible:outline-sys-primary-default mt-008 h-044 gap-008 px-020 py-010 inline-flex items-center justify-center rounded-[var(--radius-s)] border focus-visible:outline-2 focus-visible:outline-offset-2 lg:mt-0"
        >
          <Download aria-hidden="true" className="text-icon-high size-016" />
          <Text as="span" variant="subtitle-xs">
            결과 저장하기
          </Text>
        </button>
      </Box>
    </Box>
  );
}
