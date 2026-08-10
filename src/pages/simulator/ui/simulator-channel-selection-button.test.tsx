import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SimulatorChannelSelectionButton } from './simulator-channel-selection-button';

describe('SimulatorChannelSelectionButton', () => {
  it('필터 조정 버튼을 고정 버튼으로 제공한다', () => {
    render(<SimulatorChannelSelectionButton />);

    const button = screen.getByRole('button', { name: '필터 조정하기' });

    expect(button).toHaveClass('motion-safe:animate-simulator-channel-selection-enter');
  });

  it('필터 조정 버튼을 누르면 좌측 필터 패널을 연다', async () => {
    const user = userEvent.setup();
    render(<SimulatorChannelSelectionButton />);

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    expect(await screen.findByRole('dialog', { name: '필터' })).toBeVisible();
    expect(screen.getByText('총 광고 예산')).toBeVisible();
    expect(screen.getByText('매체별 예산 배분')).toBeVisible();
  });

  it('필터 패널의 닫기 버튼을 누르면 패널을 닫는다', async () => {
    const user = userEvent.setup();
    render(<SimulatorChannelSelectionButton />);

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));
    expect(await screen.findByRole('dialog', { name: '필터' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '필터 닫기' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '필터' })).not.toBeInTheDocument();
    });
  });

  it('총 광고 예산 슬라이더를 조작하면 예산 표시를 갱신한다', async () => {
    const user = userEvent.setup();
    render(<SimulatorChannelSelectionButton />);

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    const slider = await screen.findByRole('slider', { name: '총 광고 예산 슬라이더' });
    slider.focus();
    await user.keyboard('{ArrowRight}');

    expect(slider).toHaveAttribute('aria-valuetext', '20만 원');
    expect(screen.getByText('20만 원')).toBeVisible();
  });

  it('광고 집행 기간을 선택하면 선택 상태와 적용하기 버튼을 보여준다', async () => {
    const user = userEvent.setup();
    render(<SimulatorChannelSelectionButton />);

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));
    await user.click(screen.getByRole('button', { name: '2~3주' }));

    expect(screen.getByRole('button', { name: '2~3주' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '적용하기' })).toBeVisible();
    expect(screen.getByText('0.5만 원')).toBeVisible();
  });

  it('채널별 예산을 모두 사용하면 남은 채널 슬라이더를 비활성화한다', async () => {
    const user = userEvent.setup();
    render(<SimulatorChannelSelectionButton />);

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    const naverSlider = await screen.findByRole('slider', {
      name: '네이버 검색 광고 예산 슬라이더',
    });
    naverSlider.focus();
    await user.keyboard('{End}');

    const newscashSlider = screen.getByRole('slider', { name: '뉴스캐시 예산 슬라이더' });

    expect(naverSlider).toHaveAttribute('aria-valuetext', '10만 원');
    expect(newscashSlider).toBeDisabled();
  });

  it('필터를 변경하지 않으면 적용하기 버튼을 비활성화한다', async () => {
    const user = userEvent.setup();
    render(<SimulatorChannelSelectionButton />);

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    expect(await screen.findByRole('button', { name: '적용하기' })).toBeDisabled();
  });

  it('초기화 버튼을 누르면 모든 필터를 최초 상태로 되돌린다', async () => {
    const user = userEvent.setup();
    render(<SimulatorChannelSelectionButton />);

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));

    const slider = await screen.findByRole('slider', { name: '총 광고 예산 슬라이더' });
    slider.focus();
    await user.keyboard('{ArrowRight}');
    await user.click(screen.getByRole('button', { name: '2~3주' }));
    await user.click(screen.getByRole('button', { name: '초기화' }));

    expect(slider).toHaveAttribute('aria-valuetext', '10만 원');
    expect(screen.getByRole('button', { name: '2~3주' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '적용하기' })).toBeDisabled();
  });

  it('적용하기를 누르면 필터 패널을 닫는다', async () => {
    const user = userEvent.setup();
    render(<SimulatorChannelSelectionButton />);

    await user.click(screen.getByRole('button', { name: '필터 조정하기' }));
    await user.click(screen.getByRole('button', { name: '2~3주' }));
    await user.click(screen.getByRole('button', { name: '적용하기' }));

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '필터' })).not.toBeInTheDocument();
    });
  });
});
