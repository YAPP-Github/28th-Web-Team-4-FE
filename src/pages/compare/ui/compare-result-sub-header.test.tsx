import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
    expect(screen.getByRole('button', { name: '비교 수치 기준 안내' })).toBeVisible();
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

  it('안내 버튼을 누르면 비교 수치 기준을 표시하고 Escape로 닫는다', async () => {
    const user = userEvent.setup();
    render(<CompareResultSubHeader action={null} />);

    const trigger = screen.getByRole('button', { name: '비교 수치 기준 안내' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(trigger);

    expect(await screen.findByRole('dialog', { name: '비교 수치 기준 안내' })).toHaveTextContent(
      '수치는 업종(쇼핑 · 커머스) 평균 기준이며 실제 성과는 소재 · 예산에 따라 달라질 수 있습니다.',
    );

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('안내 버튼을 hover해도 비교 수치 기준을 표시한다', async () => {
    const user = userEvent.setup();
    render(<CompareResultSubHeader title="저장된 채널 비교 결과예요" action={null} />);

    await user.hover(screen.getByRole('button', { name: '비교 수치 기준 안내' }));

    expect(await screen.findByRole('dialog', { name: '비교 수치 기준 안내' })).toHaveTextContent(
      '수치는 업종(쇼핑 · 커머스) 평균 기준이며 실제 성과는 소재 · 예산에 따라 달라질 수 있습니다.',
    );
  });
});
