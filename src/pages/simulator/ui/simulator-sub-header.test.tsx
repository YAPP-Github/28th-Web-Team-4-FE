import type { ComponentProps, ReactNode } from 'react';
import { render, screen } from '@testing-library/react';

import { SimulatorSubHeader } from './simulator-sub-header';

vi.mock('@/pages/simulator/api/use-save-simulation', () => ({
  useSaveSimulation: () => ({
    isPending: false,
    isSuccess: false,
    mutate: vi.fn<() => void>(),
    reset: vi.fn<() => void>(),
  }),
}));

vi.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children: ReactNode }) => <>{children}</>,
  motion: {
    span: ({
      animate: _animate,
      children,
      exit: _exit,
      initial: _initial,
      transition: _transition,
      ...props
    }: ComponentProps<'span'> & {
      animate?: unknown;
      exit?: unknown;
      initial?: unknown;
      transition?: unknown;
    }) => <span {...props}>{children}</span>,
  },
  useReducedMotion: () => false,
}));

describe('SimulatorSubHeader', () => {
  it('결과 저장하기 버튼을 제공한다', () => {
    render(<SimulatorSubHeader />);

    expect(screen.getByRole('button', { name: '결과 저장하기' })).toBeVisible();
  });

  it('제목과 결과 저장 버튼 표시 여부를 화면에 맞게 조정한다', () => {
    render(<SimulatorSubHeader title="불러올 추천 결과를 선택해 주세요" showSaveAction={false} />);

    expect(screen.getByRole('heading', { name: '불러올 추천 결과를 선택해 주세요' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '결과 저장하기' })).not.toBeInTheDocument();
  });
});
