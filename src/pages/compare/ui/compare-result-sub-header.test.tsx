import { render, screen } from '@testing-library/react';

import { CompareResultSubHeader } from './compare-result-sub-header';

describe('CompareResultSubHeader', () => {
  it('비교 결과 안내와 저장 버튼을 제공한다', () => {
    render(<CompareResultSubHeader />);

    expect(
      screen.getByRole('heading', {
        name: '선택한 채널별 특징과 성과를 비교한 결과예요',
      }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: '결과 저장하기' })).toBeVisible();
  });
});
