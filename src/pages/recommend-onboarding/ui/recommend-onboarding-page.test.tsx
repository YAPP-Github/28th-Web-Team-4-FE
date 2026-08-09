import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { RecommendOnboardingPage } from './recommend-onboarding-page';

const pushMock = vi.fn<(href: string) => void>();
const scrollToMock = vi.fn<(options?: ScrollToOptions) => void>();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock('@/shared/api/hey-api', () => ({
  createClientConfig: (config?: Record<string, unknown>) => ({
    ...config,
    baseUrl: 'http://localhost',
  }),
}));

vi.mock('@number-flow/react', () => ({
  default: ({ value, suffix = '' }: { value: number; suffix?: string }) =>
    createElement('span', undefined, `${value}${suffix}`),
}));

function renderRecommendOnboardingPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RecommendOnboardingPage />
    </QueryClientProvider>,
  );
}

describe('RecommendOnboardingPage', () => {
  beforeEach(() => {
    pushMock.mockReset();
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn<() => void>(),
      removeListener: vi.fn<() => void>(),
      addEventListener: vi.fn<() => void>(),
      removeEventListener: vi.fn<() => void>(),
      dispatchEvent: vi.fn<() => boolean>(() => true),
    }));
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    scrollToMock.mockReset();
    Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
      configurable: true,
      value: scrollToMock,
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollTo');
    vi.restoreAllMocks();
  });

  it('renders the first onboarding question', () => {
    renderRecommendOnboardingPage();

    expect(screen.getByRole('main')).toBeVisible();
    expect(screen.getByText('1')).toBeVisible();
    expect(screen.getByText('서비스 이름')).toBeVisible();
    expect(screen.getByRole('progressbar', { name: '광고 채널 추천 진행률' })).toHaveAttribute(
      'aria-valuetext',
      '0%',
    );
    expect(
      screen.getByText(/안녕하세요!/, {
        selector: 'div.typo-subtitle-xl',
      }),
    ).toHaveTextContent('안녕하세요! 딱 맞는 광고 채널을 추천해 드릴게요.');
    expect(screen.getByRole('heading', { name: '서비스 이름을 알려 주세요' })).toBeVisible();
    expect(screen.getByRole('textbox', { name: '서비스 이름' })).toBeVisible();
  });

  it('moves to the next step after the current question is completed', async () => {
    const user = userEvent.setup();

    renderRecommendOnboardingPage();

    await user.type(screen.getByRole('textbox', { name: '서비스 이름' }), '채소집');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('heading', { name: '서비스 이름을 알려 주세요' })).toBeVisible();
    expect(screen.getByText('채소집')).toBeVisible();
    expect(screen.getByText('채소집')).toHaveClass('text-text-lowest');
    expect(screen.getByRole('button', { name: '수정' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '어떤 업종인가요?' })).toBeVisible();
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('reopens a completed step when the edit button is clicked', async () => {
    const user = userEvent.setup();

    renderRecommendOnboardingPage();

    await user.type(screen.getByRole('textbox', { name: '서비스 이름' }), '채소집');
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('button', { name: '수정' }));

    expect(screen.getByRole('heading', { name: '서비스 이름을 알려 주세요' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: '어떤 업종인가요?' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '서비스 이름' })).toHaveValue('채소집');
    expect(screen.getByRole('button', { name: '다음' })).toBeVisible();
    expect(screen.queryByRole('button', { name: '수정' })).not.toBeInTheDocument();
    expect(scrollToMock).toHaveBeenCalledTimes(3);
  });

  it('keeps the other completed question screens visible while editing one step', async () => {
    const user = userEvent.setup();

    renderRecommendOnboardingPage();

    await user.type(screen.getByRole('textbox', { name: '서비스 이름' }), '채소집');
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByText('쇼핑·커머스'));
    await user.click(screen.getByRole('button', { name: '다음' }));
    const [firstEditButton] = screen.getAllByRole('button', { name: '수정' });

    if (!firstEditButton) {
      throw new Error('Expected at least one edit button after completing two steps.');
    }

    await user.click(firstEditButton);

    expect(screen.getByRole('textbox', { name: '서비스 이름' })).toHaveValue('채소집');
    expect(screen.getByRole('heading', { name: '어떤 업종인가요?' })).toBeVisible();
    expect(screen.getByText('쇼핑·커머스')).toBeVisible();
    expect(screen.queryByRole('button', { name: '수정' })).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: '서비스 형태가 무엇인가요?' }),
    ).not.toBeInTheDocument();
  });
});
