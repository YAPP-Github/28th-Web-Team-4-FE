import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { authSessionQueryKey } from '@/features/auth/session/model/auth-session-query';
import type {
  MyOnboardingTagResponse,
  UserProfileResponse,
} from '@/shared/api/generated/types.gen';
import type { ShowToastOptions } from '@/shared/ui/toast';

import { MyPage } from './my-page';

type LogoutOptions = {
  onSuccess?: () => void;
};

type WithdrawOptions = {
  onError?: () => void;
  onSuccess?: () => void;
};

const {
  logoutMock,
  onboardingTagQueryMock,
  replaceMock,
  refreshMock,
  showToastMock,
  withdrawMock,
  withdrawOptions,
} = vi.hoisted(() => ({
  logoutMock: vi.fn<(options?: LogoutOptions) => void>(),
  onboardingTagQueryMock: vi.fn<() => { data?: MyOnboardingTagResponse; isPending?: boolean }>(),
  replaceMock: vi.fn<(href: string) => void>(),
  refreshMock: vi.fn<() => void>(),
  showToastMock: vi.fn<(options: ShowToastOptions) => void>(),
  withdrawMock: vi.fn<() => void>(),
  withdrawOptions: [] as WithdrawOptions[],
}));

const fetchMock = vi.fn<typeof fetch>();

const DEFAULT_PROFILE: UserProfileResponse = {
  nickname: 'YAPP',
  email: 'Web4team@naver.com',
  companyName: 'YAPP',
  occupation: 'DESIGN' as const,
};

const DEFAULT_ONBOARDING_TAG: MyOnboardingTagResponse = {
  hasOnboarding: false,
  onboardingId: null,
  serviceName: null,
  industry: 'OTHERS',
  serviceType: 'OTHER',
  targetAgeBands: [],
  campaignObjective: 'AWARENESS',
  budgetMin: null,
  budgetMax: null,
  period: 'M1',
  adExperience: 'NONE',
};

const ACTIVE_ONBOARDING_TAG: MyOnboardingTagResponse = {
  ...DEFAULT_ONBOARDING_TAG,
  hasOnboarding: true,
  onboardingId: 'onboarding-1',
  serviceName: '채소집',
  industry: 'SHOPPING_COMMERCE',
  serviceType: 'WEB',
  targetAgeBands: ['AGE_30S', 'AGE_40S'],
  campaignObjective: 'CONVERSION',
  budgetMin: 500_000,
  budgetMax: 500_000,
};

function createProfileResponse(profile = DEFAULT_PROFILE): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: profile,
      error: null,
      code: null,
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
}

function createOnboardingTagResponse(tag = ACTIVE_ONBOARDING_TAG): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: tag,
      error: null,
      code: null,
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
}

type MyPageRenderOptions = Omit<Parameters<typeof MyPage>[0], 'isLoggedIn'>;

function renderMyPage(isLoggedIn: boolean, options: MyPageRenderOptions = {}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  queryClient.setQueryData(authSessionQueryKey, {
    authenticated: true,
    accessTokenExpiresAt: Date.now() + 60_000,
  });

  const renderResult = render(
    <QueryClientProvider client={queryClient}>
      <MyPage isLoggedIn={isLoggedIn} {...options} />
    </QueryClientProvider>,
  );

  return { queryClient, ...renderResult };
}

vi.mock('@/features/auth/session/model/use-logout', () => ({
  useLogout: () => ({
    logout: logoutMock,
    isPending: false,
    errorMessage: undefined,
  }),
}));

vi.mock('@/features/auth/session/model/use-withdraw', () => ({
  useWithdraw: (options: WithdrawOptions = {}) => {
    withdrawOptions.push(options);

    return {
      withdraw: withdrawMock,
      resetError: vi.fn<() => void>(),
      isPending: false,
      errorMessage: undefined,
    };
  },
}));

vi.mock('@/pages/mypage/api/use-my-onboarding-tag', () => ({
  useMyOnboardingTag: onboardingTagQueryMock,
}));

vi.mock('@/shared/ui/toast', () => ({
  showToast: showToastMock,
  showWarningToast:
    vi.fn<
      (description: string, options?: Omit<ShowToastOptions, 'description' | 'type'>) => void
    >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock, refresh: refreshMock }),
}));

describe('MyPage', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(createProfileResponse());
    vi.stubGlobal('fetch', fetchMock);
    onboardingTagQueryMock.mockReset();
    onboardingTagQueryMock.mockReturnValue({ data: DEFAULT_ONBOARDING_TAG });
    logoutMock.mockReset();
    replaceMock.mockReset();
    refreshMock.mockReset();
    showToastMock.mockReset();
    withdrawMock.mockReset();
    withdrawOptions.length = 0;
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
  });

  it('renders the guest profile state and login CTA', () => {
    renderMyPage(false);

    expect(
      screen.getByRole('heading', { name: '내 정보와 저장된 추천 결과를 관리해요' }),
    ).toBeVisible();
    expect(screen.getByRole('heading', { name: '내 정보' })).toBeVisible();
    expect(screen.getByText('로그인이 필요해요')).toBeVisible();
    expect(screen.getByRole('button', { name: '로그인하기' })).toHaveAttribute('href', '/login');
    expect(screen.queryByText('YAPP')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '내 정보 수정' })).not.toBeInTheDocument();
    expect(screen.queryByText('로그아웃')).not.toBeInTheDocument();
  });

  it('renders the authenticated profile state and account actions', async () => {
    renderMyPage(true);

    expect(await screen.findAllByText('YAPP')).toHaveLength(2);
    expect(await screen.findByText('Web4team@naver.com')).toBeVisible();
    expect(await screen.findByText('디자인')).toBeVisible();
    expect(await screen.findByRole('button', { name: '내 정보 수정' })).toBeVisible();
    expect(screen.getByRole('button', { name: '채널 추천받기' })).toHaveAttribute(
      'href',
      '/recommend/onboarding/new',
    );
    expect(await screen.findByRole('button', { name: '로그아웃' })).toBeVisible();
    expect(await screen.findByRole('button', { name: '탈퇴하기' })).toBeVisible();
    expect(screen.queryByText('로그인이 필요해요')).not.toBeInTheDocument();
  });

  it('opens the profile edit modal and saves updated profile data', async () => {
    const user = userEvent.setup();
    const updatedProfile = {
      ...DEFAULT_PROFILE,
      companyName: '새 회사',
      occupation: 'DEVELOPMENT' as const,
    };
    fetchMock
      .mockReset()
      .mockResolvedValueOnce(createProfileResponse())
      .mockResolvedValueOnce(createProfileResponse(updatedProfile));

    renderMyPage(true);

    await waitFor(() => expect(screen.getByRole('button', { name: '내 정보 수정' })).toBeEnabled());
    const editButton = screen.getByRole('button', { name: '내 정보 수정' });
    await user.click(editButton);

    const dialog = await screen.findByRole('dialog', { name: '프로필 수정' });
    expect(within(dialog).getByRole('textbox', { name: '회사' })).toHaveValue('YAPP');
    expect(within(dialog).getByRole('combobox', { name: '직무' })).toHaveTextContent('디자인');

    await user.clear(within(dialog).getByRole('textbox', { name: '회사' }));
    await user.type(within(dialog).getByRole('textbox', { name: '회사' }), '새 회사');
    await user.click(within(dialog).getByRole('combobox', { name: '직무' }));
    await user.click(await screen.findByRole('option', { name: '개발' }));
    await user.click(within(dialog).getByRole('button', { name: '저장하기' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/users/me',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ companyName: '새 회사', occupation: 'DEVELOPMENT' }),
      }),
    );
    expect(showToastMock).toHaveBeenCalledWith({
      id: 'profile-update-success',
      description: '저장했어요',
      timeout: 3000,
      type: 'success',
    });
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '프로필 수정' })).not.toBeInTheDocument();
    });
    expect(screen.getByText('새 회사')).toBeVisible();
    expect(screen.getByText('개발')).toBeVisible();
  });

  it('renders the empty states for saved comparison and simulation results', async () => {
    const user = userEvent.setup();
    renderMyPage(true);

    await user.click(screen.getByRole('tab', { name: '채널 비교' }));

    expect(screen.getByText('아직 저장된 비교 결과가 없어요')).toBeVisible();
    expect(screen.getByRole('button', { name: '채널 비교하기' })).toHaveAttribute(
      'href',
      '/compare',
    );
    expect(screen.queryByText('아직 저장된 추천 결과가 없어요')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: '예산 시뮬레이션' }));

    expect(screen.getByText('아직 저장된 시뮬레이션 결과가 없어요')).toBeVisible();
    expect(screen.getByRole('button', { name: '시뮬레이션 하기' })).toHaveAttribute(
      'href',
      '/simulator',
    );
  });

  it('renders saved comparison and simulation results in their tabs', async () => {
    const user = userEvent.setup();

    renderMyPage(true, {
      savedComparisons: [
        {
          id: 'comparison-1',
          title: '채소집',
          savedAt: '2026년 8월 18일',
          channelNames: ['네이버 검색광고', '메타 광고'],
        },
      ],
      savedSimulations: [
        {
          id: 'simulation-1',
          title: '예산 시뮬레이션',
          savedAt: '2026년 8월 17일',
          channelNames: ['카카오모먼트'],
        },
      ],
    });

    await user.click(screen.getByRole('tab', { name: '채널 비교' }));

    expect(screen.getByRole('heading', { name: '채소집' })).toBeVisible();
    expect(screen.getByText('마지막 비교 : 2026년 8월 18일')).toBeVisible();
    expect(screen.getByText('네이버 검색광고')).toBeVisible();

    await user.click(screen.getByRole('tab', { name: '예산 시뮬레이션' }));

    expect(screen.getByRole('heading', { name: '예산 시뮬레이션' })).toBeVisible();
    expect(screen.getByText('마지막 시뮬레이션 : 2026년 8월 17일')).toBeVisible();
    expect(screen.getByText('카카오모먼트')).toBeVisible();
    expect(
      screen.getByRole('link', { name: '예산 시뮬레이션 저장된 시뮬레이션 결과' }),
    ).toHaveAttribute('href', '/simulator/saved/simulation-1');
  });

  it('renders the ad conditions and saved recommendations when onboarding exists', () => {
    renderMyPage(true, {
      adsCondition: {
        tags: ['쇼핑·커머스', '#웹 서비스', '30~40대', '구매 전환', '총 50만 원', '1개월'],
      },
      savedRecommendations: [
        {
          id: 'recommendation-1',
          title: '채소집',
          lastRecommendedAt: '2026.06.12',
          channelNames: ['네이버 검색광고', '메타 광고', '카카오모먼트'],
        },
        {
          id: 'recommendation-2',
          title: '사이드 프로젝트 B',
          lastRecommendedAt: '2026년 5월 23일',
          channelNames: ['유튜브', '인스타그램', '카카오모먼트'],
        },
        {
          id: 'recommendation-3',
          title: '사이드 프로젝트 C',
          lastRecommendedAt: '2026년 5월 22일',
          channelNames: ['유튜브', '인스타그램', '카카오모먼트'],
        },
        {
          id: 'recommendation-4',
          title: '네 번째 프로젝트',
          lastRecommendedAt: '2026년 5월 21일',
          channelNames: ['유튜브'],
        },
      ],
    });

    const scrollContainer = screen.getByRole('main');

    expect(scrollContainer).toHaveClass('overflow-y-auto');
    expect(scrollContainer).toHaveClass('touch-pan-y');
    expect(screen.getByRole('heading', { name: '내 광고 조건' })).toBeVisible();
    expect(screen.getByText('#쇼핑·커머스')).toBeVisible();
    expect(screen.getByText('#웹 서비스')).toBeVisible();
    expect(screen.getByRole('button', { name: '수정하기' })).toBeVisible();
    expect(screen.getByRole('link', { name: /더보기/ })).toHaveAttribute(
      'href',
      '/mypage/saved-results',
    );
    expect(screen.getByRole('heading', { name: '채소집' })).toBeVisible();
    expect(screen.queryByRole('link', { name: /채소집/ })).not.toBeInTheDocument();
    expect(screen.getByText('사이드 프로젝트 B')).toBeVisible();
    expect(screen.getByText('사이드 프로젝트 C')).toBeVisible();
    expect(screen.queryByText('네 번째 프로젝트')).not.toBeInTheDocument();
  });

  it('renders ad conditions from the onboarding tag query when onboarding exists', () => {
    onboardingTagQueryMock.mockReturnValue({ data: ACTIVE_ONBOARDING_TAG });

    renderMyPage(true);

    expect(screen.getByRole('heading', { name: '내 광고 조건' })).toBeVisible();
    expect(screen.getByText('#쇼핑·커머스')).toBeVisible();
    expect(screen.getByText('#웹 서비스')).toBeVisible();
    expect(screen.getByText('#30~40대')).toBeVisible();
    expect(screen.getByText('#구매 전환')).toBeVisible();
    expect(screen.getByText('#총 50만 원')).toBeVisible();
    expect(screen.getByText('#1개월')).toBeVisible();
  });

  it('hides ad conditions when the onboarding tag query has no onboarding', () => {
    renderMyPage(true);

    expect(screen.queryByRole('heading', { name: '내 광고 조건' })).not.toBeInTheDocument();
  });

  it('opens the ad condition edit modal with editable fields', async () => {
    const user = userEvent.setup();
    renderMyPage(true, {
      adsCondition: {
        tags: ['쇼핑·커머스', '#웹 서비스', '30~40대', '구매 전환', '총 50만 원', '1개월'],
      },
    });

    await user.click(screen.getByRole('button', { name: '수정하기' }));

    const dialog = await screen.findByRole('dialog', { name: '내 광고 조건' });
    expect(within(dialog).getByRole('button', { name: '새로 설정하기' })).toBeVisible();
    expect(within(dialog).getByRole('combobox', { name: '업종' })).toHaveTextContent('쇼핑·커머스');
    expect(within(dialog).getByRole('combobox', { name: '서비스 형태' })).toHaveTextContent(
      '웹 서비스',
    );
    expect(within(dialog).getByRole('combobox', { name: '주요 연령대' })).toHaveTextContent(
      '30~40대',
    );
    expect(within(dialog).getByRole('combobox', { name: '광고 목표' })).toHaveTextContent(
      '구매 전환',
    );
    expect(within(dialog).getByRole('combobox', { name: '집행 기간' })).toHaveTextContent('1개월');
    expect(within(dialog).getByRole('spinbutton', { name: '최소 예산' })).toHaveValue(0);
    expect(within(dialog).getByRole('spinbutton', { name: '최대 예산' })).toHaveValue(50);
    expect(within(dialog).getByRole('slider', { name: '최소 예산 슬라이더' })).toBeVisible();
    expect(within(dialog).getByRole('slider', { name: '최대 예산 슬라이더' })).toBeVisible();
    expect(within(dialog).getByRole('button', { name: '저장하기' })).toBeVisible();

    await user.click(within(dialog).getByRole('combobox', { name: '업종' }));
    expect(await screen.findByRole('option', { name: '게임' })).toBeVisible();
    expect(await screen.findByRole('option', { name: '쇼핑·커머스' })).toBeVisible();
    expect(screen.queryByRole('option', { name: '금융·핀테크' })).not.toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: '쇼핑·커머스' }));

    await user.click(within(dialog).getByRole('button', { name: '새로 설정하기' }));

    const resetDialog = await screen.findByRole('dialog', { name: '처음부터 다시 설정할까요?' });
    expect(resetDialog).toHaveTextContent('입력했던 광고 조건이 모두 지워지고');
    expect(within(resetDialog).getByRole('button', { name: '다시 설정하기' })).toHaveAttribute(
      'href',
      '/recommend/onboarding/new',
    );

    await user.click(within(resetDialog).getByRole('button', { name: '취소' }));
    const reopenedDialog = await screen.findByRole('dialog', { name: '내 광고 조건' });
    await user.click(within(reopenedDialog).getByRole('button', { name: '취소' }));
    expect(screen.queryByRole('dialog', { name: '내 광고 조건' })).not.toBeInTheDocument();
  });

  it('updates ad conditions through the onboarding tag API', async () => {
    const user = userEvent.setup();
    fetchMock
      .mockReset()
      .mockResolvedValueOnce(createProfileResponse())
      .mockResolvedValueOnce(createOnboardingTagResponse());

    renderMyPage(true, {
      adsCondition: {
        tags: ['쇼핑·커머스', '#웹 서비스', '30~40대', '구매 전환', '총 50만 원', '1개월'],
      },
    });

    await waitFor(() => expect(screen.getByRole('button', { name: '수정하기' })).toBeEnabled());
    await user.click(screen.getByRole('button', { name: '수정하기' }));
    const dialog = await screen.findByRole('dialog', { name: '내 광고 조건' });

    await user.click(within(dialog).getByRole('button', { name: '저장하기' }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    expect(fetchMock).toHaveBeenLastCalledWith(
      '/api/backend/api/v1/onboarding/me/tags',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({
          industry: 'SHOPPING_COMMERCE',
          serviceType: 'WEB',
          targetAgeBands: ['AGE_30S', 'AGE_40S'],
          campaignObjective: 'CONVERSION',
          budgetMin: 0,
          budgetMax: 500_000,
          period: 'M1',
        }),
      }),
    );
    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: '내 광고 조건' })).not.toBeInTheDocument();
    });
  });

  it('opens the service type dropdown with the Figma options', async () => {
    const user = userEvent.setup();
    renderMyPage(true, {
      adsCondition: {
        tags: ['쇼핑·커머스', '#웹 서비스', '30~40대', '구매 전환', '총 50만 원', '1개월'],
      },
    });

    await user.click(screen.getByRole('button', { name: '수정하기' }));
    const dialog = await screen.findByRole('dialog', { name: '내 광고 조건' });

    await user.click(within(dialog).getByRole('combobox', { name: '서비스 형태' }));
    expect(await screen.findAllByRole('option')).toHaveLength(4);
    expect(await screen.findByRole('option', { name: '모바일 앱' })).toBeVisible();
    expect(await screen.findByRole('option', { name: '앱 + 웹 모두' })).toBeVisible();
  });

  it('opens the age range dropdown with checkbox options', async () => {
    const user = userEvent.setup();
    renderMyPage(true, {
      adsCondition: {
        tags: ['쇼핑·커머스', '#웹 서비스', '30~40대', '구매 전환', '총 50만 원', '1개월'],
      },
    });

    await user.click(screen.getByRole('button', { name: '수정하기' }));
    const dialog = await screen.findByRole('dialog', { name: '내 광고 조건' });

    await user.click(within(dialog).getByRole('combobox', { name: '주요 연령대' }));
    expect(await screen.findAllByRole('option')).toHaveLength(6);
    expect(await screen.findByRole('checkbox', { name: '30대 선택' })).toBeChecked();
    expect(await screen.findByRole('checkbox', { name: '40대 선택' })).toBeChecked();
    expect(await screen.findByRole('checkbox', { name: '10대 선택' })).not.toBeChecked();

    await user.click(screen.getByRole('option', { name: /20대/ }));
    expect(screen.getByRole('checkbox', { name: '20대 선택' })).toBeChecked();
    expect(within(dialog).getByRole('combobox', { name: '주요 연령대' })).toHaveTextContent(
      '20대, 30대, 40대',
    );
  });

  it('opens the web ad goal dropdown with the Figma options', async () => {
    const user = userEvent.setup();
    renderMyPage(true, {
      adsCondition: {
        tags: ['쇼핑·커머스', '#웹 서비스', '30~40대', '구매 전환', '총 50만 원', '1개월'],
      },
    });

    await user.click(screen.getByRole('button', { name: '수정하기' }));
    const dialog = await screen.findByRole('dialog', { name: '내 광고 조건' });

    await user.click(within(dialog).getByRole('combobox', { name: '광고 목표' }));
    expect(await screen.findAllByRole('option')).toHaveLength(5);
    expect(await screen.findByRole('option', { name: '구매·결제 전환' })).toBeVisible();
    expect(screen.queryByRole('option', { name: '앱 설치' })).not.toBeInTheDocument();
  });

  it('opens the app ad goal dropdown with the Figma options', async () => {
    const user = userEvent.setup();
    renderMyPage(true, {
      adsCondition: {
        tags: ['쇼핑·커머스', '#모바일 앱', '30~40대', '앱 설치', '총 50만 원', '1개월'],
      },
    });

    await user.click(screen.getByRole('button', { name: '수정하기' }));
    const dialog = await screen.findByRole('dialog', { name: '내 광고 조건' });

    await user.click(within(dialog).getByRole('combobox', { name: '광고 목표' }));
    expect(await screen.findAllByRole('option')).toHaveLength(7);
    expect(await screen.findByRole('option', { name: '앱 설치' })).toBeVisible();
    expect(await screen.findByRole('option', { name: '인앱 구매·행동' })).toBeVisible();
  });

  it('opens the campaign period dropdown with the Figma options', async () => {
    const user = userEvent.setup();
    renderMyPage(true, {
      adsCondition: {
        tags: ['쇼핑·커머스', '#웹 서비스', '30~40대', '구매 전환', '총 50만 원', '1개월'],
      },
    });

    await user.click(screen.getByRole('button', { name: '수정하기' }));
    const dialog = await screen.findByRole('dialog', { name: '내 광고 조건' });

    await user.click(within(dialog).getByRole('combobox', { name: '집행 기간' }));
    expect(await screen.findAllByRole('option')).toHaveLength(5);
    expect(await screen.findByRole('option', { name: '2~3주' })).toBeVisible();
    expect(await screen.findByRole('option', { name: '1개월' })).toBeVisible();
    expect(screen.queryByRole('option', { name: '2~3주 (8~21일)' })).not.toBeInTheDocument();
  });

  it('renders the full skeleton while the mypage data is pending', () => {
    renderMyPage(true, { isLoading: true });

    expect(screen.getByRole('status', { name: '마이페이지를 불러오고 있어요' })).toBeVisible();
    expect(screen.getByTestId('my-profile-skeleton')).toBeVisible();
    expect(screen.getByRole('heading', { name: '내 광고 조건' })).toBeVisible();
    expect(screen.getByRole('heading', { name: '저장된 결과' })).toBeVisible();
    expect(screen.getByText('로그아웃')).toBeVisible();
    expect(screen.queryByText('YAPP')).not.toBeInTheDocument();
  });

  it('renders the profile skeleton while the profile request is pending', () => {
    fetchMock.mockReturnValueOnce(new Promise<Response>(() => {}));

    renderMyPage(true);

    expect(screen.getByRole('status', { name: '내 정보를 불러오고 있어요' })).toBeVisible();
    expect(screen.getByTestId('my-profile-skeleton')).toBeVisible();
    expect(screen.queryByText('YAPP')).not.toBeInTheDocument();
  });

  it('renders the ad condition skeleton while the onboarding tag request is pending', () => {
    onboardingTagQueryMock.mockReturnValue({ data: undefined, isPending: true });

    renderMyPage(true);

    expect(screen.getByTestId('my-ads-condition-skeleton')).toBeVisible();
    expect(screen.getByRole('heading', { name: '내 광고 조건' })).toBeVisible();
    expect(screen.getByText('온보딩에서 입력한 조건이에요')).toBeVisible();
    expect(screen.queryByText('#쇼핑·커머스')).not.toBeInTheDocument();
  });

  it('renders saved result skeletons while the recommendation request is pending', () => {
    renderMyPage(true, { savedRecommendationsLoading: true });

    expect(screen.getByTestId('recommendation-results-skeleton')).toBeVisible();
    expect(screen.getByRole('status', { name: '저장된 결과를 불러오고 있어요' })).toBeVisible();
    expect(screen.queryByText('저장된 결과를 불러오는 중이에요')).not.toBeInTheDocument();
  });

  it('refreshes the page when the profile request returns unauthorized', async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }));

    const { queryClient } = renderMyPage(true);

    await waitFor(() => {
      expect(queryClient.getQueryData(authSessionQueryKey)).toEqual({ authenticated: false });
    });
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('opens and closes the logout confirmation modal', async () => {
    const user = userEvent.setup();
    renderMyPage(true);

    await user.click(await screen.findByRole('button', { name: '로그아웃' }));

    const dialog = await screen.findByRole('dialog', { name: '정말 로그아웃하시겠어요?' });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent('언제든 다시 로그인해서 저장된 결과를');

    await user.click(within(dialog).getByRole('button', { name: '취소' }));
    expect(
      screen.queryByRole('dialog', { name: '정말 로그아웃하시겠어요?' }),
    ).not.toBeInTheDocument();
  });

  it('handles logout success in the page UI', async () => {
    const user = userEvent.setup();
    renderMyPage(true);

    await user.click(await screen.findByRole('button', { name: '로그아웃' }));
    const dialog = await screen.findByRole('dialog', { name: '정말 로그아웃하시겠어요?' });
    await user.click(within(dialog).getByRole('button', { name: '로그아웃' }));

    expect(logoutMock).toHaveBeenCalledOnce();

    act(() => {
      logoutMock.mock.calls[0]?.[0]?.onSuccess?.();
    });

    expect(showToastMock).toHaveBeenCalledWith({
      id: 'logout-success',
      description: '로그아웃했어요',
      type: 'success',
    });
    expect(replaceMock).toHaveBeenCalledWith('/login');
    expect(refreshMock).toHaveBeenCalledOnce();
    await waitFor(() => {
      expect(
        screen.queryByRole('dialog', { name: '정말 로그아웃하시겠어요?' }),
      ).not.toBeInTheDocument();
    });
  });

  it('opens the withdrawal confirmation modal', async () => {
    const user = userEvent.setup();
    renderMyPage(true);

    await user.click(await screen.findByRole('button', { name: '탈퇴하기' }));

    const dialog = await screen.findByRole('dialog', { name: '채소집을 정말 떠나시겠어요?' });
    expect(dialog).toBeVisible();
    expect(within(dialog).getByRole('button', { name: '돌아가기' })).toBeVisible();
    expect(within(dialog).getByRole('button', { name: '탈퇴하기' })).toBeVisible();
    expect(within(dialog).getByAltText('')).toHaveAttribute(
      'src',
      '/mypage-assets/withdraw-illustration.svg',
    );

    await user.click(within(dialog).getByRole('button', { name: '탈퇴하기' }));
    expect(withdrawMock).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog', { name: '채소집을 정말 떠나시겠어요?' })).toBeVisible();
  });

  it('shows a failure toast when withdrawal fails', async () => {
    const user = userEvent.setup();
    renderMyPage(true);

    await user.click(await screen.findByRole('button', { name: '탈퇴하기' }));
    withdrawOptions.at(-1)?.onError?.();

    expect(showToastMock).toHaveBeenCalledWith({
      id: 'withdraw-error',
      description: '탈퇴하지 못했습니다. 다시 시도해 주세요.',
      type: 'warning',
    });
  });
});
