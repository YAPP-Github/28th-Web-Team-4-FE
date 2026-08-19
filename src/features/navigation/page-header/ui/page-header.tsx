import type { ComponentProps, JSX } from 'react';
import Link from 'next/link';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { HStack } from '@/shared/ui/layout/h-stack';
import { Logo } from '@/shared/ui/logo';

import { HeaderLoginButton } from './header-login-button';
import type { PageHeaderAppearance } from './page-header-appearance';
import { PageHeaderAccountMenu } from './page-header-account-menu';
import { PageHeaderMobileSidebar } from './page-header-mobile-sidebar';
import { PageHeaderNavLink } from './page-header-nav-link';
import { PAGE_HEADER_NAVIGATION_ITEMS } from './page-header-navigation-items';

type PageHeaderBaseProps = Omit<ComponentProps<'header'>, 'children'> & {
  innerClassName?: string;
  appearance?: PageHeaderAppearance;
};

type PageHeaderLoginProps = {
  isLogin: true;
  userName?: string;
  onLogout?: () => void;
  isLogoutPending?: boolean;
  logoutError?: string;
};

type PageHeaderGuestProps = {
  isLogin?: false;
  userName?: never;
  onLogout?: never;
  isLogoutPending?: never;
  logoutError?: never;
};

export type PageHeaderProps = PageHeaderBaseProps & (PageHeaderLoginProps | PageHeaderGuestProps);

export function PageHeader(props: PageHeaderProps): JSX.Element {
  const {
    className,
    innerClassName,
    appearance = 'default',
    isLogin = false,
    userName,
    onLogout,
    isLogoutPending,
    logoutError,
    ...rest
  } = props;

  return (
    <HStack
      as="header"
      className={cn(
        'bg-surface-lowest border-outline-low h-14 w-full shrink-0 justify-center border-b px-020 lg:h-072 lg:px-052 xl:px-120',
        className,
      )}
      {...rest}
    >
      <Box
        className={cn(
          'flex h-full w-full max-w-[1200px] items-center justify-between',
          innerClassName,
        )}
      >
        <Link
          href="/"
          aria-label="chaesozip"
          className="focus-visible:outline-sys-primary-default shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Logo
            type="s"
            alt=""
            className={cn('lg:hidden', appearance !== 'default' && 'text-white')}
          />
          <Logo
            type="m"
            alt=""
            className={cn('hidden lg:inline-flex', appearance !== 'default' && 'text-white')}
          />
        </Link>

        <Box
          className={cn('lg:hidden', appearance === 'default' ? 'text-icon-higher' : 'text-white')}
        >
          <PageHeaderMobileSidebar isLogin={isLogin} userName={userName} />
        </Box>

        <Box className="ml-[54px] hidden min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-[50px] lg:grid">
          <Box as="nav" aria-label="주요 메뉴" className="min-w-0">
            <Box className="flex h-full min-w-0 items-center gap-[26px]">
              {PAGE_HEADER_NAVIGATION_ITEMS.map((item) => (
                <PageHeaderNavLink
                  key={item.label}
                  segment={item.segment}
                  href={item.href}
                  className={item.desktopClassName}
                  appearance={appearance}
                >
                  {item.label}
                </PageHeaderNavLink>
              ))}
            </Box>
          </Box>

          {props.isLogin ? (
            <PageHeaderAccountMenu
              userName={props.userName}
              onLogout={onLogout}
              isLogoutPending={isLogoutPending}
              logoutError={logoutError}
              appearance={appearance}
            />
          ) : (
            <Box className="shrink-0">
              <HeaderLoginButton appearance={appearance} />
            </Box>
          )}
        </Box>
      </Box>
    </HStack>
  );
}
