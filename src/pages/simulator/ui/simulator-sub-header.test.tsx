import { render, screen } from '@testing-library/react';

import { SimulatorSubHeader } from './simulator-sub-header';

describe('SimulatorSubHeader', () => {
  it('결과 저장하기 버튼을 제공한다', () => {
    render(<SimulatorSubHeader />);

    expect(screen.getByRole('button', { name: '결과 저장하기' })).toBeVisible();
  });
});
