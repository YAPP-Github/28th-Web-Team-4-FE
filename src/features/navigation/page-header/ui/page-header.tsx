import type { ComponentProps, JSX } from 'react';
import Link from 'next/link';

import { Avatar } from '@/shared/ui/avatar';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Logo } from '@/shared/ui/logo';

import { HeaderLoginButton } from './header-login-button';
import { PageHeaderNavLink } from './page-header-nav-link';

const NAVIGATION_ITEMS = [
  { label: '광고 채널 추천', segment: 'recommend' },
  { label: '채널 비교', segment: 'compare' },
  { label: '예산 시뮬레이터', segment: 'simulator' },
  { label: '마이페이지', segment: 'mypage' },
] as const;

type PageHeaderBaseProps = Omit<ComponentProps<'header'>, 'children'> & {
  innerClassName?: string;
};

type PageHeaderLoginProps = {
  isLogin: true;
  userName: string;
};

type PageHeaderGuestProps = {
  isLogin?: false;
  userName?: never;
};

export type PageHeaderProps = PageHeaderBaseProps & (PageHeaderLoginProps | PageHeaderGuestProps);

export function PageHeader(props: PageHeaderProps): JSX.Element {
  const { className, innerClassName, isLogin: _isLogin, userName: _userName, ...rest } = props;

  return (
    <HStack
      as="header"
      className={cn(
        'bg-surface-lowest h-072 w-full justify-center px-016 sm:px-032 lg:px-120',
        className,
      )}
      {...rest}
    >
      <HStack
        className={cn('gap-[80px] h-full w-full max-w-[1200px] justify-center', innerClassName)}
      >
        <Link
          href="/"
          className="focus-visible:outline-sys-primary-default focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Logo />
        </Link>
        <Box className="flex min-w-0 flex-1 items-center gap-[50px]">
          <Box as="nav" aria-label="주요 메뉴" className="flex min-w-0 flex-1 items-center">
            <Box className="flex h-full min-w-0 flex-1 items-center gap-[44px]">
              {NAVIGATION_ITEMS.map((item) => (
                <PageHeaderNavLink key={item.label} segment={item.segment}>
                  {item.label}
                </PageHeaderNavLink>
              ))}
            </Box>
          </Box>
          {props.isLogin ? (
            <Box className="gap-018 flex shrink-0 items-center">
              <Box as="span" className="typo-subtitle-xs text-text-medium">
                {props.userName} 님
              </Box>
              <Avatar alt={`${props.userName} 프로필`} />
            </Box>
          ) : (
            <HeaderLoginButton />
          )}
        </Box>
      </HStack>
    </HStack>
  );
}
