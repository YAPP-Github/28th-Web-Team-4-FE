import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { MAX_ONBOARDING_SERVICE_NAME_LENGTH } from '@/features/ad-onboarding/model/common-onboarding-options';

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

function renderRecommendOnboardingPage(props?: { initialServiceName?: string }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RecommendOnboardingPage {...props} />
    </QueryClientProvider>,
  );
}

type User = ReturnType<typeof userEvent.setup>;

async function advanceToServiceTypeStep(user: User): Promise<void> {
  await user.type(screen.getByRole('textbox', { name: '서비스 이름' }), '채소집');
  await user.click(screen.getByRole('button', { name: '다음' }));
  await user.click(screen.getByText('쇼핑·커머스'));
  await user.click(screen.getByRole('button', { name: '다음' }));
}

async function advanceToBudgetStep(
  user: User,
  serviceTypeLabel: '모바일 앱' | '웹 서비스',
  adGoalLabel: '구매·결제 전환' | '앱 설치',
): Promise<void> {
  await advanceToServiceTypeStep(user);
  await user.click(screen.getByText(serviceTypeLabel));
  await user.click(screen.getByRole('button', { name: '다음' }));
  await user.click(screen.getByText('20대'));
  await user.click(screen.getByRole('button', { name: '다음' }));
  await user.click(screen.getByText(adGoalLabel));
  await user.click(screen.getByRole('button', { name: '다음' }));
}

function getServiceTypeEditButton(): HTMLElement {
  const editButton = screen.getAllByRole('button', { name: '수정' })[2];

  if (!editButton) {
    throw new Error('Expected a service type edit button.');
  }

  return editButton;
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
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /안녕하세요!\s+딱 맞는 광고 채널을 추천해 드릴게요\./,
      }),
    ).toBeVisible();
    expect(screen.getByRole('progressbar', { name: '광고 채널 추천 진행률' })).toHaveAttribute(
      'aria-valuetext',
      '0%',
    );
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
    expect(screen.getByRole('button', { name: '수정' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '어떤 업종인가요?' })).toBeVisible();
    expect(scrollToMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('keeps serviceName input within 50 characters', async () => {
    const user = userEvent.setup();
    const overlongServiceName = '가'.repeat(MAX_ONBOARDING_SERVICE_NAME_LENGTH + 1);

    renderRecommendOnboardingPage();

    await user.type(screen.getByRole('textbox', { name: '서비스 이름' }), overlongServiceName);

    expect(screen.getByRole('textbox', { name: '서비스 이름' })).toHaveValue(
      '가'.repeat(MAX_ONBOARDING_SERVICE_NAME_LENGTH),
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeEnabled();
  });

  it('starts from the category step and scrolls to it when serviceName is prefilled', async () => {
    renderRecommendOnboardingPage({ initialServiceName: '채소집' });

    expect(screen.getByText('2')).toBeVisible();
    expect(screen.getByText('업종 선택')).toBeVisible();
    expect(screen.getByRole('progressbar', { name: '광고 채널 추천 진행률' })).toHaveAttribute(
      'aria-valuetext',
      '12%',
    );
    expect(screen.getByRole('heading', { name: '서비스 이름을 알려 주세요' })).toBeVisible();
    expect(screen.getByText('채소집')).toBeVisible();
    expect(screen.getByRole('heading', { name: '어떤 업종인가요?' })).toBeVisible();
    expect(screen.queryByRole('textbox', { name: '서비스 이름' })).not.toBeInTheDocument();
    await waitFor(() => {
      expect(scrollToMock).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });
  });

  it('reopens the prefilled serviceName step when the edit button is clicked', async () => {
    const user = userEvent.setup();

    renderRecommendOnboardingPage({ initialServiceName: '채소집' });

    await user.click(screen.getByRole('button', { name: '수정' }));

    expect(screen.getByRole('heading', { name: '서비스 이름을 알려 주세요' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: '어떤 업종인가요?' })).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '서비스 이름' })).toHaveValue('채소집');
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

  it('서비스 형태가 바뀌면 기존 광고 목표를 초기화하고 재선택 후 원래 단계로 복귀한다', async () => {
    const user = userEvent.setup();

    renderRecommendOnboardingPage();
    await advanceToBudgetStep(user, '웹 서비스', '구매·결제 전환');
    await user.click(getServiceTypeEditButton());
    await user.click(screen.getByText('모바일 앱'));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('radiogroup', { name: '광고 목표' })).toBeVisible();
    expect(screen.getAllByRole('radio')).toHaveLength(7);
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
    for (const option of screen.getAllByRole('radio')) {
      expect(option).not.toBeChecked();
    }
    expect(screen.getByText('20대')).toBeVisible();

    await user.click(screen.getByText('앱 설치'));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(
      screen.getByRole('heading', { name: '광고에 사용할 수 있는 총 예산은 얼마인가요?' }),
    ).toBeVisible();
    expect(screen.getByText('모바일 앱')).toBeVisible();
    expect(screen.getByText('20대')).toBeVisible();
    expect(screen.getByText('앱 설치')).toBeVisible();
  });

  it('앱 서비스에서 웹 서비스로 바꾸면 앱 전용 목표를 제거하고 재선택을 요구한다', async () => {
    const user = userEvent.setup();

    renderRecommendOnboardingPage();
    await advanceToBudgetStep(user, '모바일 앱', '앱 설치');
    await user.click(getServiceTypeEditButton());
    await user.click(screen.getByText('웹 서비스'));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(screen.getByRole('radiogroup', { name: '광고 목표' })).toBeVisible();
    expect(screen.getAllByRole('radio')).toHaveLength(5);
    expect(screen.queryByRole('radio', { name: '앱 설치' })).not.toBeInTheDocument();
    expect(screen.queryByRole('radio', { name: '인앱 구매·행동' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();
  });

  it('서비스 형태를 바꾸지 않으면 기존 광고 목표를 유지하고 원래 단계로 복귀한다', async () => {
    const user = userEvent.setup();

    renderRecommendOnboardingPage();
    await advanceToBudgetStep(user, '웹 서비스', '구매·결제 전환');
    await user.click(getServiceTypeEditButton());
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(
      screen.getByRole('heading', { name: '광고에 사용할 수 있는 총 예산은 얼마인가요?' }),
    ).toBeVisible();
    expect(screen.queryByRole('radiogroup', { name: '광고 목표' })).not.toBeInTheDocument();
    expect(screen.getByText('구매·결제 전환')).toBeVisible();
  });

  it('광고 목표를 선택하기 전에는 서비스 형태를 바꿔도 기존 진행 단계로 복귀한다', async () => {
    const user = userEvent.setup();

    renderRecommendOnboardingPage();
    await advanceToServiceTypeStep(user);
    await user.click(screen.getByText('웹 서비스'));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(getServiceTypeEditButton());
    await user.click(screen.getByText('모바일 앱'));
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(
      screen.getByRole('heading', {
        name: '어떤 연령층을 타깃으로 광고를 진행할까요?',
      }),
    ).toBeVisible();
    expect(screen.queryByRole('radiogroup', { name: '광고 목표' })).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: '20대' })).toBeVisible();
  });
});
