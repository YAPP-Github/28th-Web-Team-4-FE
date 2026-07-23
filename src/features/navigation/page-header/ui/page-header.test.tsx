import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { PageHeader } from './page-header';

const useSelectedLayoutSegmentMock = vi.fn<() => string | null>(() => null);

vi.mock('next/navigation', () => ({
  useSelectedLayoutSegment: () => useSelectedLayoutSegmentMock(),
}));

describe('PageHeader', () => {
  beforeEach(() => {
    useSelectedLayoutSegmentMock.mockReturnValue(null);
  });

  it('renders the default header navigation and start action', () => {
    render(<PageHeader />);

    expect(screen.getByRole('banner')).toBeVisible();
    expect(screen.getByRole('link', { name: 'chaesozip' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('img', { name: 'chaesozip' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: '주요 메뉴' })).toBeVisible();
    expect(screen.getByRole('link', { name: '광고 채널 추천' })).toBeVisible();
    expect(screen.getByRole('link', { name: '광고 채널 추천' })).toHaveClass(
      'hover:text-text-highest',
      'hover:bg-surface-low',
      'rounded-[var(--radius-xs)]',
      'px-012',
      'py-008',
    );
    expect(screen.getByRole('link', { name: '채널 비교' })).toBeVisible();
    expect(screen.getByRole('link', { name: '예산 시뮬레이터' })).toBeVisible();
    expect(screen.getByRole('link', { name: '마이페이지' })).toBeVisible();
    expect(screen.getByRole('button', { name: '시작하기' })).toHaveAttribute('href', '/login');
  });

  it('marks the navigation link that matches the selected layout segment', () => {
    useSelectedLayoutSegmentMock.mockReturnValue('compare');

    render(<PageHeader />);

    const activeLink = screen.getByRole('link', { name: '채널 비교' });
    const inactiveLink = screen.getByRole('link', { name: '광고 채널 추천' });

    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveClass('text-text-highest');
    expect(inactiveLink).not.toHaveAttribute('aria-current');
    expect(inactiveLink).toHaveClass('text-text-low');
  });

  it('renders the login header trailing area', () => {
    render(<PageHeader isLogin userName="YAPP" />);

    expect(screen.getByText('YAPP 님')).toBeVisible();
    expect(screen.getByRole('img', { name: 'YAPP 프로필' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '시작하기' })).not.toBeInTheDocument();
  });
});
