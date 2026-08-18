export type PageHeaderNavigationItem = {
  label: string;
  segment: string;
  href: string;
  desktopClassName?: string;
};

export const PAGE_HEADER_NAVIGATION_ITEMS: readonly PageHeaderNavigationItem[] = [
  {
    label: '맞춤 채널 추천',
    segment: 'recommend',
    href: '/recommend/onboarding/new',
    desktopClassName: 'px-012',
  },
  {
    label: '전체 채널 비교',
    segment: 'compare',
    href: '/compare',
    desktopClassName: 'px-012',
  },
  {
    label: '예산 시뮬레이터',
    segment: 'simulator',
    href: '/simulator',
    desktopClassName: 'w-[110px]',
  },
  {
    label: '마이페이지',
    segment: 'mypage',
    href: '/mypage',
    desktopClassName: 'w-[84px]',
  },
] as const;
