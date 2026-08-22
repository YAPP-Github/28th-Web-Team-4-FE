import { render, screen } from '@testing-library/react';

import { SimulatorPage } from './simulator-page';

const { replaceMock } = vi.hoisted(() => ({
  replaceMock: vi.fn<(href: string, options?: { scroll?: boolean }) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock('./simulator-tutorial-gate', () => ({
  SimulatorTutorialGate: () => null,
}));

vi.mock('./simulator-sub-header', () => ({
  SimulatorSubHeader: () => <div />,
}));

vi.mock('./simulator-result-summary', () => ({
  SimulatorResultSummary: () => <div />,
}));

vi.mock('./simulator-channel-results', () => ({
  SimulatorChannelResults: () => <div />,
}));

vi.mock('./simulator-calculation-note', () => ({
  SimulatorCalculationNote: () => <div />,
}));

vi.mock('./simulator-channel-selection-button', () => ({
  SimulatorChannelSelectionButton: () => null,
}));

function getSimulatorContentElements(): {
  content: HTMLElement;
  spacer: HTMLElement;
} {
  const scrollContainer = screen.getByRole('main').querySelector('.overflow-y-auto');
  const content = scrollContainer?.firstElementChild;
  const spacer = content?.lastElementChild;

  if (!(content instanceof HTMLElement) || !(spacer instanceof HTMLElement)) {
    throw new Error('시뮬레이터 콘텐츠 여백 요소를 찾을 수 없습니다.');
  }

  return { content, spacer };
}

describe('SimulatorPage', () => {
  beforeEach(() => {
    replaceMock.mockReset();
  });

  it('모바일 스크롤 콘텐츠 끝에 safe-area를 포함한 하단 여백을 둔다', () => {
    render(<SimulatorPage isLogin={false} />);

    const { content, spacer } = getSimulatorContentElements();

    expect(content).toHaveClass('pt-040');
    expect(content).not.toHaveClass('py-040');
    expect(spacer).toHaveClass('h-[calc(40px+env(safe-area-inset-bottom))]', 'shrink-0');
  });

  it('로그인 후 채널을 선택한 상태에서는 필터 버튼을 위한 여백을 유지한다', () => {
    render(<SimulatorPage isLogin isChannelSelectionComplete />);

    const { spacer } = getSimulatorContentElements();

    expect(spacer).toHaveClass('h-[calc(120px+env(safe-area-inset-bottom))]', 'shrink-0');
  });
});
