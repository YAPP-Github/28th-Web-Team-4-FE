import type { ComponentProps, JSX } from 'react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Logo } from '@/shared/ui/logo';

export type FooterProps = Omit<ComponentProps<'footer'>, 'children'>;

const FOOTER_NAVIGATION_ITEMS = ['이용 약관', '개인정보 처리 방침', '블로그', '요금제'] as const;

export function Footer({ className, ...rest }: FooterProps): JSX.Element {
  return (
    <HStack
      as="footer"
      className={cn(
        'bg-surface-low px-016 sm:px-032 flex w-full items-start justify-center py-040 lg:px-120 lg:py-[50px]',
        className,
      )}
      {...rest}
    >
      <Box className="gap-032 flex w-full max-w-[1200px] flex-col items-start justify-between lg:flex-row">
        <Stack className="gap-008 w-full items-start lg:w-[450px] lg:shrink-0">
          <Logo type="m" className="text-text-low" />
          <Text as="p" variant="subtitle-md" className="text-text-low lg:whitespace-nowrap">
            내게 맞는 광고 채널을 한눈에! 채소집
          </Text>
        </Stack>

        <Stack className="gap-022 min-w-0 flex-1 items-start">
          <Box
            as="ul"
            aria-label="푸터 메뉴"
            className="gap-x-052 gap-y-008 flex w-full flex-wrap items-center whitespace-nowrap"
          >
            {FOOTER_NAVIGATION_ITEMS.map((item, index) => (
              <Box as="li" key={item} className="contents">
                <Text as="span" variant="subtitle-md" className="text-text-low">
                  {item}
                </Text>
                {index < FOOTER_NAVIGATION_ITEMS.length - 1 ? (
                  <Text as="span" variant="subtitle-xxs" aria-hidden className="text-surface-high">
                    |
                  </Text>
                ) : null}
              </Box>
            ))}
          </Box>

          <Stack className="gap-008 w-full items-start">
            <Text as="p" variant="subtitle-xxs" className="text-text-low">
              문의 : channelsogae.zip@gmail.com
            </Text>
            <Text as="p" variant="subtitle-xxs" className="text-text-low">
              2026 Team Chaesozip. All right reservation
            </Text>
          </Stack>
        </Stack>
      </Box>
    </HStack>
  );
}
