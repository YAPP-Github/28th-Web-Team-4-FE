import { OverlayProvider } from 'overlay-kit';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useRecommendOnboardingStore } from '@/features/ad-onboarding';

import { RecommendResultPage } from './recommend-result-page';

vi.mock('@/shared/api/hey-api', () => ({
  createClientConfig: (config?: Record<string, unknown>) => ({
    ...config,
    baseUrl: 'http://localhost',
  }),
}));

vi.mock('@number-flow/react', () => ({
  default: ({ value }: { value: number }) => <span>{value}</span>,
}));

const initialStore = useRecommendOnboardingStore.getState();

function renderRecommendResultPage(props?: { isGuest?: boolean }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <OverlayProvider>
        <RecommendResultPage {...props} />
      </OverlayProvider>
    </QueryClientProvider>,
  );
}

describe('RecommendResultPage', () => {
  beforeEach(() => {
    useRecommendOnboardingStore.setState(initialStore, true);
    vi.spyOn(window, 'alert').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts with a disabled 0/3 comparison CTA', () => {
    renderRecommendResultPage();

    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (0/3)' })).toBeDisabled();
  });

  it('toggles selection and enables the CTA only after three channels are selected', async () => {
    const user = userEvent.setup();
    renderRecommendResultPage();

    const naverButton = screen.getAllByRole('button', { name: '비교 목록에 담기' })[0];
    await user.click(naverButton);
    expect(screen.getByRole('button', { name: '채널 선택 완료' })).toHaveClass(
      'bg-sys-primary-lower',
    );
    expect(screen.getByRole('button', { name: '채널 선택 완료' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (1/3)' })).toBeDisabled();

    await user.click(screen.getAllByRole('button', { name: '비교 목록에 담기' })[0]);
    await user.click(screen.getAllByRole('button', { name: '비교 목록에 담기' })[0]);

    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (3/3)' })).toBeEnabled();

    await user.click(screen.getAllByRole('button', { name: '채널 선택 완료' })[0]);
    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (2/3)' })).toBeDisabled();
  });

  it('alerts instead of adding a fourth channel', async () => {
    const user = userEvent.setup();
    renderRecommendResultPage();

    for (const button of screen.getAllByRole('button', { name: '비교 목록에 담기' }).slice(0, 3)) {
      await user.click(button);
    }

    await user.click(screen.getAllByRole('button', { name: '비교 목록에 담기' })[0]);

    expect(window.alert).toHaveBeenCalledWith('비교 목록은 최대 3개까지 선택할 수 있어요.');
    expect(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (3/3)' })).toBeEnabled();
  });

  it('alerts when the enabled CTA is clicked', async () => {
    const user = userEvent.setup();
    renderRecommendResultPage();

    for (const button of screen.getAllByRole('button', { name: '비교 목록에 담기' }).slice(0, 3)) {
      await user.click(button);
    }

    await user.click(screen.getByRole('button', { name: '추천받은 채널로 비교하기 (3/3)' }));

    expect(window.alert).toHaveBeenCalledWith('비교 기능은 준비 중이에요.');
  });

  it('opens channel details from the card surface but not from the comparison button', async () => {
    const user = userEvent.setup();
    renderRecommendResultPage();

    await user.click(screen.getAllByRole('button', { name: '비교 목록에 담기' })[0]);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '네이버 검색 광고 상세 정보 열기' }));
    expect(await screen.findByRole('dialog', { name: '네이버 검색 광고' })).toBeVisible();
  });

  it('shows the CPC explanation popover on hover', async () => {
    const user = userEvent.setup();
    renderRecommendResultPage();

    const infoButton = screen.getByRole('button', { name: '추천 결과 안내' });
    await user.hover(infoButton);

    expect(screen.getByRole('tooltip')).toHaveTextContent('클릭 1회당 비용이란?');
    expect(screen.getByRole('tooltip')).toHaveTextContent(
      '광고 클릭당 비용(CPC)을 말해요. 채소집에서는 쉬운 비교를 위해 단위를 모두 클릭 수 기준으로 통일했어요.',
    );
  });

  it('always shows the cheapest CPC tooltip', () => {
    renderRecommendResultPage();

    const tooltipText = screen.getByText('클릭당 비용이 가장 낮아요');

    expect(tooltipText).toBeVisible();
    expect(tooltipText.parentElement).toHaveClass('bg-surface-toast', 'text-text-lowest');
    expect(tooltipText.parentElement?.querySelector('[aria-hidden="true"]')).toHaveStyle({
      bottom: '-4px',
    });
  });

  it('blurs the top two cards and provides login links for guests', () => {
    renderRecommendResultPage({ isGuest: true });

    expect(screen.getAllByRole('link', { name: '로그인하기' })).toHaveLength(2);
    expect(screen.getAllByRole('link', { name: '로그인하기' })[0]).toHaveAttribute(
      'href',
      '/login',
    );
    expect(screen.getByRole('article', { name: '네이버 검색 광고' })).toHaveTextContent(
      '전체 결과를 볼 수 있어요',
    );
    expect(
      screen.getByRole('article', { name: '네이버 검색 광고' }).querySelector('.blur-\\[4px\\]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '카카오 검색 광고 상세 정보 열기' }),
    ).toBeInTheDocument();
  });
});
