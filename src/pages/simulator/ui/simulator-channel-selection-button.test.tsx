import { render, screen } from '@testing-library/react';

import { SimulatorChannelSelectionButton } from './simulator-channel-selection-button';

describe('SimulatorChannelSelectionButton', () => {
  it('채널 선택 조정 링크를 고정 버튼으로 제공한다', () => {
    render(<SimulatorChannelSelectionButton />);

    const button = screen.getByRole('button', { name: '필터 조정하기' });

    expect(button).toHaveAttribute('href', '/simulator/channels');
    expect(button).toHaveClass('motion-safe:animate-simulator-channel-selection-enter');
  });
});
