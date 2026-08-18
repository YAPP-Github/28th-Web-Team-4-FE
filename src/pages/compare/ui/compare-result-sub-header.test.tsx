import { render, screen } from '@testing-library/react';

import { CompareResultSubHeader } from './compare-result-sub-header';

describe('CompareResultSubHeader', () => {
  it('로그인 여부와 관계없이 비교 결과 안내와 저장 버튼을 제공한다', () => {
    render(<CompareResultSubHeader isGuest={false} />);

    expect(
      screen.getByRole('heading', {
        name: '선택한 채널별 특징과 성과를 비교한 결과예요',
      }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: '결과 저장하기' })).toBeVisible();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('비로그인 사용자에게 저장 안내 툴팁을 표시한다', () => {
    render(<CompareResultSubHeader isGuest />);

    const saveButton = screen.getByRole('button', { name: '결과 저장하기' });
    const tooltip = screen.getByRole('tooltip');

    expect(saveButton).toBeVisible();
    expect(saveButton).toHaveAttribute('aria-describedby', tooltip.id);
    expect(tooltip).toHaveTextContent('로그인 후 저장 가능해요');
  });
});
