import type { ComponentProps, JSX } from 'react';
import Image from 'next/image';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Stack } from '@/shared/ui/layout/stack';
import { Logo } from '@/shared/ui/logo';
import { Text } from '@/shared/ui/text';

export type FooterProps = Omit<ComponentProps<'footer'>, 'children'>;

type FooterNavigationItemConfig = {
  label: string;
  href?: string;
};

const FOOTER_NAVIGATION_ITEMS: readonly FooterNavigationItemConfig[] = [
  {
    label: '이용 약관',
    href: 'https://extreme-moonstone-8ae.notion.site/3b2b0b17e916806c92cdec7eac6c0f7c',
  },
  {
    label: '개인정보 처리방침',
    href: 'https://extreme-moonstone-8ae.notion.site/3b2b0b17e91680dc9567c8db372aa63d',
  },
  {
    label: '요금제',
  },
];
const FOOTER_NAVIGATION_SEPARATOR = '|';
const FOOTER_ICON_ITEMS = [
  {
    label: '이메일',
    src: '/home-assets/footer-mail.svg',
    width: 20,
    height: 17,
    className: 'left-[0.917px] top-[2.75px] h-[16.5px] w-[20.167px]',
  },
  {
    label: '네이버 블로그',
    src: '/home-assets/footer-naver-blog.svg',
    width: 20,
    height: 18,
    className: 'left-[1.157px] top-[2.585px] h-[18.29px] w-[19.69px]',
  },
] as const;

function FooterNavigationItem({ label, href }: FooterNavigationItemConfig): JSX.Element {
  return (
    <Box as="li" className="contents">
      {href ? (
        <Text
          as="a"
          variant="subtitle-md"
          className="text-text-medium focus-visible:outline-sys-primary-default rounded-xxs cursor-pointer underline-offset-2 outline-none hover:underline focus-visible:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          href={href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {label}
        </Text>
      ) : (
        <Text as="span" variant="subtitle-md" className="text-text-medium">
          {label}
        </Text>
      )}
    </Box>
  );
}

function FooterNavigationSeparator(): JSX.Element {
  return (
    <Box as="li" role="presentation" aria-hidden className="contents">
      <Text as="span" variant="subtitle-xxs" className="text-surface-high">
        {FOOTER_NAVIGATION_SEPARATOR}
      </Text>
    </Box>
  );
}

function FooterLogo(): JSX.Element {
  return <Logo type="m" alt="chaesozip" className="h-[36px] w-[136px]" />;
}

function intersperseFooterNavigationItems(items: readonly JSX.Element[]): JSX.Element[] {
  return items.reduce<JSX.Element[]>((result, item, index) => {
    if (index === 0) {
      return [item];
    }

    return [...result, <FooterNavigationSeparator key={`${item.key}-separator`} />, item];
  }, []);
}

export function Footer({ className, ...rest }: FooterProps): JSX.Element {
  return (
    <HStack
      as="footer"
      className={cn(
        'bg-surface-low px-016 py-040 sm:px-032 flex w-full items-start justify-center lg:px-120 lg:py-052',
        className,
      )}
      {...rest}
    >
      <Stack className="gap-026 w-full max-w-[1200px] min-w-0 items-start justify-center">
        <Stack className="gap-002 w-full min-w-0 items-start">
          <Box className="gap-024 flex w-full min-w-0 flex-col items-start justify-between lg:flex-row lg:items-center">
            <Stack className="gap-030 w-full items-start lg:w-[450px] lg:shrink-0">
              <FooterLogo />
            </Stack>

            <Box
              as="ul"
              aria-label="푸터 메뉴"
              className="gap-x-022 gap-y-008 flex min-w-0 flex-wrap items-center whitespace-nowrap lg:justify-end"
            >
              {intersperseFooterNavigationItems(
                FOOTER_NAVIGATION_ITEMS.map((item) => (
                  <FooterNavigationItem key={item.label} label={item.label} href={item.href} />
                )),
              )}
            </Box>
          </Box>

          <Text as="p" variant="body-lg" className="text-text-low whitespace-nowrap">
            © 2026 CHAESOZIP. ALL RIGHTS RESERVED
          </Text>
        </Stack>

        <Box as="ul" aria-label="푸터 아이콘" className="gap-012 flex items-center">
          {FOOTER_ICON_ITEMS.map((item) => (
            <Box as="li" key={item.label}>
              <Box
                as="span"
                className="bg-surface-default p-008 flex shrink-0 items-center rounded-[var(--radius-max)]"
              >
                <Box as="span" className="relative size-[22px] shrink-0 overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={item.width}
                    height={item.height}
                    className={cn('absolute max-w-none shrink-0', item.className)}
                  />
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Stack>
    </HStack>
  );
}
