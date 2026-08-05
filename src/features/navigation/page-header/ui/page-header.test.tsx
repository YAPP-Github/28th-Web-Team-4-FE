import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { PageHeader } from './page-header';

const useSelectedLayoutSegmentMock = vi.fn<() => string | null>(() => null);
const MOBILE_VIEWPORT_QUERY = '(max-width: 1023px)';
const mediaQueryChangeListeners = new Set<() => void>();

let viewportWidth = 1023;

function createMediaQueryList(query: string): MediaQueryList {
  return {
    get matches() {
      return query === MOBILE_VIEWPORT_QUERY && viewportWidth < 1024;
    },
    media: query,
    onchange: null,
    addListener(listener) {
      if (query === MOBILE_VIEWPORT_QUERY) {
        mediaQueryChangeListeners.add(listener as () => void);
      }
    },
    removeListener(listener) {
      mediaQueryChangeListeners.delete(listener as () => void);
    },
    addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
      if (type === 'change' && query === MOBILE_VIEWPORT_QUERY) {
        mediaQueryChangeListeners.add(listener as () => void);
      }
    },
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
      if (type === 'change') {
        mediaQueryChangeListeners.delete(listener as () => void);
      }
    },
    dispatchEvent: () => true,
  };
}

function setViewportWidth(width: number): void {
  viewportWidth = width;

  act(() => {
    [...mediaQueryChangeListeners].forEach((listener) => listener());
  });
}

function isPageScrollLocked(): boolean {
  return [document.documentElement, document.body].some(
    (element) => element.style.overflowY === 'hidden',
  );
}

vi.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => useSelectedLayoutSegmentMock(),
}));

describe('PageHeader', () => {
  beforeEach(() => {
    useSelectedLayoutSegmentMock.mockReturnValue(null);
    viewportWidth = 1023;
    mediaQueryChangeListeners.clear();
    vi.mocked(window.matchMedia).mockImplementation(createMediaQueryList);
  });

  it('renders the default header navigation and start action', () => {
    render(<PageHeader />);

    expect(screen.getByRole('banner')).toBeVisible();
    expect(screen.getByRole('banner')).toHaveClass('border-outline-low', 'border-b');
    expect(screen.getByRole('link', { name: 'chaesozip' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('navigation', { name: '주요 메뉴' })).toBeVisible();
    expect(screen.getByRole('link', { name: '맞춤 채널 추천' })).toHaveAttribute(
      'href',
      '/recommend/onboarding/new',
    );
    expect(screen.getByRole('link', { name: '맞춤 채널 추천' })).toHaveClass(
      'hover:text-text-highest',
      'hover:bg-surface-low',
      'rounded-[var(--radius-xs)]',
      'px-012',
      'py-008',
    );
    expect(screen.getByRole('link', { name: '전체 채널 비교' })).toHaveAttribute(
      'href',
      '/compare',
    );
    expect(screen.getByRole('link', { name: '예산 시뮬레이터' })).toHaveAttribute(
      'href',
      '/simulator',
    );
    expect(screen.getByRole('link', { name: '마이페이지' })).toHaveAttribute('href', '/mypage');
    expect(screen.getByRole('button', { name: '시작하기' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('button', { name: '메뉴 열기' })).toBeVisible();
  });

  it('marks the navigation link that matches the selected layout segment', () => {
    useSelectedLayoutSegmentMock.mockReturnValue('compare');

    render(<PageHeader />);

    const activeLink = screen.getByRole('link', { name: '전체 채널 비교' });
    const inactiveLink = screen.getByRole('link', { name: '맞춤 채널 추천' });

    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveClass('text-text-highest');
    expect(inactiveLink).not.toHaveAttribute('aria-current');
    expect(inactiveLink).toHaveClass('text-text-low');
  });

  it('renders a logout-only account menu for a logged-in user', async () => {
    const user = userEvent.setup();
    render(<PageHeader isLogin userName="YAPP" />);

    expect(screen.getByText('YAPP 님')).toBeVisible();
    expect(screen.getByRole('img', { name: 'YAPP 프로필' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '시작하기' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '계정 메뉴 열기' }));

    const logoutItem = await screen.findByRole('menuitem', { name: '로그아웃' });

    expect(screen.queryByRole('menuitem', { name: '마이페이지' })).not.toBeInTheDocument();
    expect(logoutItem).toHaveClass('bg-btn-sub-low', 'border-0');
  });

  it('renders an authenticated account without a profile name', () => {
    render(<PageHeader isLogin />);

    expect(screen.getByRole('img', { name: '내 프로필' })).toBeVisible();
    expect(screen.getByRole('button', { name: '계정 메뉴 열기' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '시작하기' })).not.toBeInTheDocument();
  });

  it('opens and closes the basic guest sidebar', async () => {
    const user = userEvent.setup();
    render(<PageHeader />);

    const trigger = screen.getByRole('button', { name: '메뉴 열기' });

    expect(trigger).toHaveAttribute('aria-controls', 'page-header-mobile-sidebar');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);

    const dialog = await screen.findByRole('dialog', { name: '전체 메뉴' });
    const mobileNavigation = within(dialog).getByRole('navigation', { name: '모바일 주요 메뉴' });

    expect(dialog).toHaveAttribute('id', 'page-header-mobile-sidebar');
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(within(mobileNavigation).getByRole('link', { name: '맞춤 채널 추천' })).toHaveAttribute(
      'href',
      '/recommend/onboarding/new',
    );
    expect(within(dialog).getByText(/로그인하고 나에게 맞는 광고 채널을/)).toBeVisible();
    expect(within(dialog).getByRole('button', { name: '시작하기' })).toHaveAttribute(
      'href',
      '/login',
    );

    await user.click(within(dialog).getByRole('button', { name: '메뉴 닫기' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '전체 메뉴' })).not.toBeInTheDocument();
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(trigger).toHaveFocus();
    });
  });

  it('removes and restores an open sidebar across the desktop breakpoint', async () => {
    const user = userEvent.setup();
    render(<PageHeader />);

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));
    await screen.findByRole('dialog', { name: '전체 메뉴' });
    await waitFor(() => expect(isPageScrollLocked()).toBe(true));

    setViewportWidth(1024);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: '메뉴 열기' })).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog', { name: '전체 메뉴' })).not.toBeInTheDocument();
      expect(isPageScrollLocked()).toBe(false);
    });

    setViewportWidth(1023);

    expect(await screen.findByRole('dialog', { name: '전체 메뉴' })).toBeVisible();
    expect(document.getElementById('page-header-mobile-sidebar-trigger')).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('does not restore a sidebar that the user explicitly closed', async () => {
    const user = userEvent.setup();
    render(<PageHeader />);

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));
    const dialog = await screen.findByRole('dialog', { name: '전체 메뉴' });
    await user.click(within(dialog).getByRole('button', { name: '메뉴 닫기' }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '전체 메뉴' })).not.toBeInTheDocument();
    });

    setViewportWidth(1024);
    setViewportWidth(1023);

    expect(screen.getByRole('button', { name: '메뉴 열기' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    expect(screen.queryByRole('dialog', { name: '전체 메뉴' })).not.toBeInTheDocument();
  });

  it('traps focus and returns it to the trigger after Escape closes the sidebar', async () => {
    const user = userEvent.setup();
    render(<PageHeader />);

    const trigger = screen.getByRole('button', { name: '메뉴 열기' });
    await user.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: '전체 메뉴' });

    await waitFor(() => {
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    });

    for (let index = 0; index < 8; index += 1) {
      await user.tab();
      await waitFor(() => {
        expect(dialog).toContainElement(document.activeElement as HTMLElement);
      });
    }

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '전체 메뉴' })).not.toBeInTheDocument();
      expect(trigger).toHaveFocus();
    });
  });

  it('clears the open intent when a sidebar link is selected', async () => {
    const user = userEvent.setup();
    render(<PageHeader />);

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));
    const dialog = await screen.findByRole('dialog', { name: '전체 메뉴' });
    const link = within(dialog).getByRole('link', { name: '전체 채널 비교' });

    link.addEventListener('click', (event) => event.preventDefault(), { once: true });
    await user.click(link);

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '전체 메뉴' })).not.toBeInTheDocument();
    });

    setViewportWidth(1024);
    setViewportWidth(1023);

    expect(screen.queryByRole('dialog', { name: '전체 메뉴' })).not.toBeInTheDocument();
  });

  it('does not mount mobile sidebar controls at 1024px', () => {
    setViewportWidth(1024);

    render(<PageHeader />);

    expect(screen.queryByRole('button', { name: '메뉴 열기' })).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog', { name: '전체 메뉴' })).not.toBeInTheDocument();
  });

  it('renders the authenticated identity in the basic sidebar', async () => {
    const user = userEvent.setup();
    render(<PageHeader isLogin userName="YAPP" />);

    await user.click(screen.getByRole('button', { name: '메뉴 열기' }));

    const dialog = await screen.findByRole('dialog', { name: '전체 메뉴' });

    expect(within(dialog).getByRole('img', { name: 'YAPP 프로필' })).toBeVisible();
    expect(within(dialog).getByText('YAPP 님')).toBeVisible();
    expect(within(dialog).queryByRole('button', { name: '시작하기' })).not.toBeInTheDocument();
    expect(within(dialog).queryByText('로그아웃')).not.toBeInTheDocument();
  });
});
