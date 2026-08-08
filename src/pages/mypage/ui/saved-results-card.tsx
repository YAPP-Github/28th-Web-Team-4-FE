'use client';

import type { JSX } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Box } from '@/shared/ui/layout/box';
import { Tabs } from '@/shared/ui/tabs';
import { Text } from '@/shared/ui/text';

function SavedResultPanel({ isLoggedIn }: { isLoggedIn: boolean }): JSX.Element {
  if (!isLoggedIn) {
    return (
      <Text
        as="p"
        variant="body-xl"
        className="text-text-low flex h-[96px] w-full items-center justify-center text-center"
      >
        아직 저장된 추천 결과가 없어요
      </Text>
    );
  }

  return (
    <Box className="gap-014 py-020 flex w-full flex-col items-center justify-end">
      <Text as="p" variant="body-xl" className="text-text-low text-center">
        아직 저장된 추천 결과가 없어요
      </Text>
      <Button
        frame="button"
        tone="secondary"
        size="s"
        nativeButton={false}
        render={<Link href="/recommend/onboarding/new" />}
        rightIcon={<ArrowRight aria-hidden="true" className="size-016" strokeWidth={1.5} />}
        className="flex-row"
      >
        채널 추천받기
      </Button>
    </Box>
  );
}

export function SavedResultsCard({ isLoggedIn }: { isLoggedIn: boolean }): JSX.Element {
  return (
    <Box
      as="section"
      aria-labelledby="saved-results-title"
      className="bg-surface-lowest gap-018 px-030 py-024 flex w-full flex-col rounded-l"
    >
      <Box className="gap-010 flex w-full flex-col">
        <Text as="h2" id="saved-results-title" variant="heading-lg" className="text-text-highest">
          저장된 결과
        </Text>
        <Tabs.Root defaultValue="recommendation" className="w-full">
          <Tabs.List className="gap-008 h-[44px] items-start">
            <Tabs.Tab
              value="recommendation"
              className="pt-012 pb-012 flex h-[44px] w-[70px] flex-col items-center justify-start px-0"
            >
              채널 추천
            </Tabs.Tab>
            <Tabs.Tab
              value="comparison"
              className="pt-012 pb-012 flex h-[44px] w-[70px] flex-col items-center justify-start px-0"
            >
              채널 비교
            </Tabs.Tab>
            <Tabs.Tab
              value="simulation"
              className="pt-012 pb-012 flex h-[44px] w-[90px] flex-col items-center justify-start px-0"
            >
              예산 시뮬레이션
            </Tabs.Tab>
            <Tabs.Indicator />
          </Tabs.List>
          <Tabs.Panel value="recommendation">
            <SavedResultPanel isLoggedIn={isLoggedIn} />
          </Tabs.Panel>
          <Tabs.Panel value="comparison">
            <SavedResultPanel isLoggedIn={isLoggedIn} />
          </Tabs.Panel>
          <Tabs.Panel value="simulation">
            <SavedResultPanel isLoggedIn={isLoggedIn} />
          </Tabs.Panel>
        </Tabs.Root>
      </Box>
    </Box>
  );
}
