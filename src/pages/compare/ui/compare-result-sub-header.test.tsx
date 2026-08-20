import { render, screen } from '@testing-library/react';

import { CompareResultSubHeader } from './compare-result-sub-header';

describe('CompareResultSubHeader', () => {
  it('비교 결과 제목과 주입된 액션을 표시한다', () => {
    render(
      <CompareResultSubHeader
        action={
          <button type="button" className="w-full lg:w-auto">
            결과 저장하기
          </button>
        }
      />,
    );

    expect(
      screen.getByRole('heading', {
        name: '선택한 채널별 특징과 성과를 비교한 결과예요',
      }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: '결과 저장하기' })).toBeVisible();
  });

  it('액션이 비어 있으면 제목 영역만 표시한다', () => {
    render(<CompareResultSubHeader action={null} />);

    expect(
      screen.getByRole('heading', {
        name: '선택한 채널별 특징과 성과를 비교한 결과예요',
      }),
    ).toBeVisible();
    expect(screen.queryByRole('button', { name: '결과 저장하기' })).not.toBeInTheDocument();
  });
});
