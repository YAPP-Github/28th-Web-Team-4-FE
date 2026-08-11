import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RecommendResultSubHeader } from './recommend-result-sub-header';

const LONG_SERVICE_NAME = '공백없이아주긴서비스이름으로모바일줄바꿈을확인하는채소가게';
const saveAction = (
  <button type="button" className="w-full lg:w-auto">
    결과 저장하기
  </button>
);

describe('RecommendResultSubHeader', () => {
  it('긴 서비스명과 모든 서브헤더 콘텐츠를 생략하지 않고 표시한다', () => {
    render(<RecommendResultSubHeader serviceName={LONG_SERVICE_NAME} action={saveAction} />);

    const heading = screen.getByRole('heading', {
      name: `${LONG_SERVICE_NAME}에 딱 맞는 채널이에요`,
    });

    expect(heading).toBeVisible();
    expect(heading).toHaveClass('min-w-0', 'break-keep', '[overflow-wrap:anywhere]');
    expect(screen.getByText('입력하신 조건으로 분석했어요')).toBeVisible();
    expect(screen.getByRole('button', { name: '추천 결과 안내' })).toBeVisible();
    expect(screen.getByRole('button', { name: '결과 저장하기' })).toHaveClass(
      'w-full',
      'lg:w-auto',
    );
  });

  it('주입된 액션을 오른쪽 액션 영역에 표시한다', () => {
    render(
      <RecommendResultSubHeader
        serviceName="채소집"
        action={<button type="button">저장 액션</button>}
      />,
    );

    expect(screen.getByRole('button', { name: '저장 액션' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '결과 저장하기' })).not.toBeInTheDocument();
  });

  it('액션이 비어 있으면 기본 버튼 없이 제목 영역만 표시한다', () => {
    render(<RecommendResultSubHeader serviceName="채소집" action={null} />);

    expect(screen.getByRole('heading', { name: '채소집에 딱 맞는 채널이에요' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '결과 저장하기' })).not.toBeInTheDocument();
  });

  it('안내 버튼을 hover하면 지연 후 툴팁을 표시하고 벗어나면 닫는다', async () => {
    const user = userEvent.setup();
    render(<RecommendResultSubHeader serviceName="채소집" action={saveAction} />);

    const infoButton = screen.getByRole('button', { name: '추천 결과 안내' });

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.hover(infoButton);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('클릭 1회당 비용이란?');
    expect(screen.getByRole('tooltip')).toHaveTextContent('광고 클릭당 비용(CPC)을 말해요.');

    await user.unhover(infoButton);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('안내 버튼에 키보드 focus가 있으면 툴팁을 표시하고 blur에서 닫는다', async () => {
    const user = userEvent.setup();
    render(<RecommendResultSubHeader serviceName="채소집" action={saveAction} />);

    const infoButton = screen.getByRole('button', { name: '추천 결과 안내' });

    await user.tab();

    expect(infoButton).toHaveFocus();
    expect(screen.getByRole('tooltip')).toBeVisible();

    await user.tab();

    expect(screen.getByRole('button', { name: '결과 저장하기' })).toHaveFocus();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
