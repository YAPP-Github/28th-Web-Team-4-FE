import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { MyPage } from './my-page';

const fetchMock = vi.fn<typeof fetch>();

function createProfileResponse(): Response {
  return new Response(
    JSON.stringify({
      success: true,
      data: {
        nickname: 'YAPP',
        email: 'Web4team@naver.com',
        companyName: 'YAPP',
        occupation: 'DESIGN',
      },
      error: null,
      code: null,
    }),
    { status: 200, headers: { 'content-type': 'application/json' } },
  );
}

function renderMyPage(isLoggedIn: boolean) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MyPage isLoggedIn={isLoggedIn} />
    </QueryClientProvider>,
  );
}

describe('MyPage', () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(createProfileResponse());
    vi.stubGlobal('fetch', fetchMock);
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
    expect(screen.getByRole('button', { name: '내 정보 수정' })).toBeVisible();
    expect(screen.getByRole('button', { name: '채널 추천받기' })).toHaveAttribute(
      'href',
      '/recommend/onboarding/new',
    );
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeVisible();
    expect(screen.getByRole('button', { name: '탈퇴하기' })).toBeVisible();
    expect(screen.queryByText('로그인이 필요해요')).not.toBeInTheDocument();
  });

  it('renders the profile skeleton while the profile request is pending', () => {
    fetchMock.mockReturnValueOnce(new Promise<Response>(() => {}));

    renderMyPage(true);

    expect(screen.getByRole('status', { name: '내 정보를 불러오고 있어요' })).toBeVisible();
    expect(screen.getByTestId('my-profile-skeleton')).toBeVisible();
    expect(screen.queryByText('YAPP')).not.toBeInTheDocument();
  });
});
