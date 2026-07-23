import { render, screen } from '@testing-library/react';

import { BottomNavigation } from './bottom-navigation';

describe('BottomNavigation', () => {
  it('renders the navigation landmark with the default label', () => {
    render(<BottomNavigation />);

    expect(screen.getByRole('navigation', { name: '하단 내비게이션' })).toBeInTheDocument();
  });

  it('renders left and right slot content', () => {
    render(
      <BottomNavigation
        left={<button type="button">이전</button>}
        right={<button type="button">홈</button>}
      />,
    );

    expect(screen.getByRole('button', { name: '이전' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '홈' })).toBeInTheDocument();
  });

  it('uses a custom aria label when provided', () => {
    render(<BottomNavigation aria-label="시뮬레이터 하단 액션" />);

    expect(screen.getByRole('navigation', { name: '시뮬레이터 하단 액션' })).toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: '하단 내비게이션' })).not.toBeInTheDocument();
  });
});
