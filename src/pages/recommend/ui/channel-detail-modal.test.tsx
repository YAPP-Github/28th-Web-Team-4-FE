import { OverlayProvider } from 'overlay-kit';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RecommendPage } from './recommend-page';

function renderRecommendPage() {
  return render(
    <OverlayProvider>
      <RecommendPage />
    </OverlayProvider>,
  );
}

describe('RecommendPage channel detail modal', () => {
  it('opens the channel detail modal from the detail button', async () => {
    const user = userEvent.setup();
    renderRecommendPage();

    await user.click(screen.getByRole('button', { name: '상세보기' }));

    expect(await screen.findByRole('dialog', { name: '메타 광고' })).toBeVisible();
    expect(screen.getByText('퍼포먼스와 브랜딩을 모두 커버하는 국내 최다 사용 채널')).toBeVisible();
    expect(screen.getByRole('tab', { name: '핵심 요약' })).toHaveAttribute('data-active');
  });

  it('closes the modal with the close control', async () => {
    const user = userEvent.setup();
    renderRecommendPage();

    await user.click(screen.getByRole('button', { name: '상세보기' }));
    expect(await screen.findByRole('dialog', { name: '메타 광고' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '닫기' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '메타 광고' })).not.toBeInTheDocument();
    });
  });

  it('switches channel detail tabs', async () => {
    const user = userEvent.setup();
    renderRecommendPage();

    await user.click(screen.getByRole('button', { name: '상세보기' }));
    expect(await screen.findByRole('dialog', { name: '메타 광고' })).toBeVisible();

    await user.click(screen.getByRole('tab', { name: '광고 상품' }));
    expect(screen.getByRole('tab', { name: '광고 상품' })).toHaveAttribute('data-active');
    await waitFor(() => {
      expect(screen.getByText('피드 광고')).toBeVisible();
    });
    expect(screen.getByRole('columnheader', { name: '집행 가능' })).toBeVisible();

    await user.click(screen.getByRole('tab', { name: '타깃층' }));
    await waitFor(() => {
      expect(screen.getByText('주요 연령대')).toBeVisible();
    });
    expect(screen.getByText('20~40대')).toBeVisible();

    await user.click(screen.getByRole('tab', { name: '광고 예시' }));
    await waitFor(() => {
      expect(screen.getByText('내셔널지오그래픽')).toBeVisible();
    });
  });
});
