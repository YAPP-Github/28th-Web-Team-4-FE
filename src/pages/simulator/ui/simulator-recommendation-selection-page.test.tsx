import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SIMULATOR_RECOMMENDATION_SELECTION_PREVIEW } from '@/pages/simulator/model/simulator-recommendation-selection';

import {
  SimulatorRecommendationSelectionPage,
  SimulatorRecommendationSelectionScreen,
} from './simulator-recommendation-selection-page';

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn<(href: string) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/pages/simulator/api/use-save-simulation', () => ({
  useSaveSimulation: () => ({
    isPending: false,
    isSuccess: false,
    mutate: vi.fn<() => void>(),
    reset: vi.fn<() => void>(),
  }),
}));

describe('SimulatorRecommendationSelectionPage', () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  it('추천 결과를 선택하는 화면과 페이지네이션을 보여준다', () => {
    render(<SimulatorRecommendationSelectionPage />);

    expect(screen.getByRole('heading', { name: '불러올 추천 결과를 선택해 주세요' })).toBeVisible();
    expect(screen.getByRole('article', { name: '추천 결과 채소집' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: '페이지네이션' })).toBeVisible();
    expect(screen.getByRole('button', { name: '선택하기' })).toBeDisabled();
  });

  it('추천 결과를 펼치고 채널 3개를 선택하면 선택하기 버튼이 활성화된다', async () => {
    const user = userEvent.setup();
    render(<SimulatorRecommendationSelectionPage />);

    await user.click(screen.getByRole('button', { name: '추천 결과 채소집 펼치기' }));

    expect(screen.getByText('* 비교할 채널을 3개 선택해 주세요')).toBeVisible();
    expect(screen.getByRole('button', { name: '추천 결과 채소집 접기' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    expect(screen.getByRole('button', { name: '선택하기' })).toBeDisabled();

    const channelButtons = screen.getAllByRole('button', { name: '카카오모먼트 선택' });
    await user.click(screen.getAllByRole('button', { name: '네이버 검색광고 선택' })[0]);
    await user.click(screen.getByRole('button', { name: '메타 광고 선택' }));
    await user.click(channelButtons[0]);

    expect(screen.getByRole('button', { name: '선택하기' })).toBeEnabled();
  });

  it('채널 선택을 완료하면 선택한 채널을 시뮬레이터로 전달한다', async () => {
    const user = userEvent.setup();
    render(<SimulatorRecommendationSelectionPage />);

    await user.click(screen.getByRole('button', { name: '추천 결과 채소집 펼치기' }));
    await user.click(screen.getAllByRole('button', { name: '네이버 검색광고 선택' })[0]);
    await user.click(screen.getByRole('button', { name: '메타 광고 선택' }));
    await user.click(screen.getAllByRole('button', { name: '카카오모먼트 선택' })[0]);
    await user.click(screen.getByRole('button', { name: '선택하기' }));

    expect(pushMock).toHaveBeenCalledWith(
      '/simulator?channelIds=recommendation-1-channel-1&channelIds=recommendation-1-channel-2&channelIds=recommendation-1-channel-3',
    );
  });

  it('추천 결과가 없으면 빈 상태와 추천받기 링크를 보여준다', () => {
    render(
      <SimulatorRecommendationSelectionScreen
        recommendations={[]}
        onComplete={vi.fn<() => void>()}
      />,
    );

    expect(screen.getByText('저장된 추천 결과가 없어요')).toBeVisible();
    expect(screen.getByText('맞춤 추천을 받아 결과를 저장해 보세요.')).toBeVisible();
    expect(screen.getByRole('button', { name: '채널 추천받기' })).toHaveAttribute(
      'href',
      '/recommend',
    );
    expect(screen.queryByRole('navigation', { name: '페이지네이션' })).not.toBeInTheDocument();
  });

  it('다른 추천 결과를 펼치면 이전 채널 선택을 초기화한다', async () => {
    const user = userEvent.setup();
    render(
      <SimulatorRecommendationSelectionScreen
        recommendations={SIMULATOR_RECOMMENDATION_SELECTION_PREVIEW}
        onComplete={vi.fn<() => void>()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '추천 결과 채소집 펼치기' }));
    await user.click(screen.getAllByRole('button', { name: '네이버 검색광고 선택' })[0]);
    await user.click(screen.getByRole('button', { name: '추천 결과 사이드 프로젝트 B 펼치기' }));

    expect(screen.getByRole('button', { name: '선택하기' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: '추천 결과 사이드 프로젝트 B 접기' }),
    ).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: '추천 결과 채소집 펼치기' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });
});
