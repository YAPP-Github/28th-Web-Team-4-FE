import type { ComponentProps, JSX, ReactNode } from 'react';
import Link from 'next/link';

import { Avatar } from '@/shared/ui/avatar';
import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Logo } from '@/shared/ui/logo';

import { HeaderLoginButton } from './header-login-button';
import { PageHeaderNavLink } from './page-header-nav-link';

type NavigationItem = {
  label: string;
  segment: string;
  href?: string;
};

const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { label: '맞춤 채널 추천', segment: 'recommend', href: '/recommend/onboarding/new' },
  { label: '전체 채널 비교', segment: 'compare' },
  { label: '예산 시뮬레이터', segment: 'simulator' },
  { label: '마이페이지', segment: 'mypage' },
] as const;

type PageHeaderBaseProps = Omit<ComponentProps<'header'>, 'children'> & {
  innerClassName?: string;
};

type PageHeaderLoginProps = {
  isLogin: true;
  accountAction?: ReactNode;
  userName?: string;
};

type PageHeaderGuestProps = {
  isLogin?: false;
  accountAction?: never;
  userName?: never;
};

export type PageHeaderProps = PageHeaderBaseProps & (PageHeaderLoginProps | PageHeaderGuestProps);

export function PageHeader(props: PageHeaderProps): JSX.Element {
  const {
    accountAction: _accountAction,
    className,
    innerClassName,
    isLogin: _isLogin,
    userName: _userName,
    ...rest
  } = props;

  return (
    <HStack
      as="header"
      className={cn(
        'bg-surface-lowest border-outline-low h-072 w-full justify-center border-b px-016 sm:px-032 lg:px-120',
        className,
      )}
      {...rest}
    >
      <Box
        className={cn(
          'grid h-full w-full max-w-[1200px] grid-cols-[136px_54px_minmax(0,1fr)] items-center',
          innerClassName,
        )}
      >
        <Link
          href="/"
          className="focus-visible:outline-sys-primary-default shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Logo />
        </Link>
        <Box className="col-start-3 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-[38px]">
          <Box as="nav" aria-label="주요 메뉴" className="min-w-0">
            <Box className="flex h-full min-w-0 items-center gap-[26px]">
              {NAVIGATION_ITEMS.map((item) => (
                <PageHeaderNavLink key={item.label} segment={item.segment} href={item.href}>
                  {item.label}
                </PageHeaderNavLink>
              ))}
            </Box>
          </Box>
          {props.isLogin ? (
            <Box className="gap-018 flex shrink-0 items-center">
              {props.userName ? (
                <Box as="span" className="typo-subtitle-xs text-text-medium">
                  {props.userName} 님
                </Box>
              ) : null}
              <Avatar alt={props.userName ? `${props.userName} 프로필` : '내 프로필'} />
              {props.accountAction}
            </Box>
          ) : (
            <Box className="shrink-0">
              <HeaderLoginButton />
            </Box>
          )}
        </Box>
      </Box>
    </HStack>
  );
}
