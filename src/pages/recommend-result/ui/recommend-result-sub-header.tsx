'use client';

import type { JSX } from 'react';
import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { Download, Info } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

export type RecommendResultSubHeaderProps = {
  serviceName: string;
};

export function RecommendResultSubHeader({
  serviceName,
}: RecommendResultSubHeaderProps): JSX.Element {
  const title = (
    <Box className="gap-006 flex max-w-full min-w-0 items-center">
      <Text
        as="h1"
        variant="heading-lg"
        className="text-text-highest min-w-0 [overflow-wrap:anywhere] break-keep"
      >
        {serviceName}에 딱 맞는 채널이에요
      </Text>
      <BaseTooltip.Provider delay={150} timeout={400}>
        <BaseTooltip.Root>
          <BaseTooltip.Trigger
            aria-label="추천 결과 안내"
            className="text-icon-low hover:text-icon-high focus-visible:outline-sys-primary-default size-018 inline-flex shrink-0 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Info aria-hidden="true" className="size-018" />
          </BaseTooltip.Trigger>
          <BaseTooltip.Portal>
            <BaseTooltip.Positioner
              side="bottom"
              align="start"
              sideOffset={8}
              collisionPadding={8}
              positionMethod="fixed"
              className="z-30"
            >
              <BaseTooltip.Popup
                role="tooltip"
                className="bg-surface-lowest p-016 shadow-drop-shadow-02 w-[228px] max-w-[calc(100vw-32px)] rounded-tr-[var(--radius-m)] rounded-br-[var(--radius-m)] rounded-bl-[var(--radius-m)]"
              >
                <Box className="gap-008 flex w-full flex-col items-start text-left">
                  <Text as="strong" variant="subtitle-sm" className="text-text-high block w-full">
                    클릭 1회당 비용이란?
                  </Text>
                  <Text as="p" variant="body-xs" className="text-text-medium m-0 w-full">
                    광고 클릭당 비용(CPC)을 말해요.
                    <br /> 채소집에서는 쉬운 비교를 위해
                    <br /> 단위를 모두 클릭 수 기준으로 통일했어요.
                  </Text>
                </Box>
              </BaseTooltip.Popup>
            </BaseTooltip.Positioner>
          </BaseTooltip.Portal>
        </BaseTooltip.Root>
      </BaseTooltip.Provider>
    </Box>
  );

  return (
    <Box className="bg-surface-lowest border-outline-low min-h-072 px-016 py-016 sm:px-032 w-full border-y lg:px-120 lg:py-0">
      <Box className="gap-016 lg:min-h-072 flex w-full max-w-[1200px] flex-col lg:mx-auto lg:flex-row lg:items-center lg:justify-between">
        <Box className="gap-006 lg:gap-052 flex w-full min-w-0 flex-col items-start lg:w-auto lg:flex-row lg:items-center">
          <Box className="max-w-full min-w-0">{title}</Box>
          <Text as="p" variant="subtitle-xxs" className="text-text-low m-0 whitespace-nowrap">
            입력하신 조건으로 분석했어요
          </Text>
        </Box>
        <Button
          frame="button"
          tone="stroke"
          className="border-outline-low h-044 px-020 py-010 w-full lg:w-auto"
          leftIcon={<Download aria-hidden="true" className="text-icon-high size-016" />}
        >
          결과 저장하기
        </Button>
      </Box>
    </Box>
  );
}
