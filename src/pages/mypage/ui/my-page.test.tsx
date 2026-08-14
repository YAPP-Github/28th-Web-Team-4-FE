import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import type { showToast } from '@/shared/ui/toast';

import { MyPage } from './my-page';

type WithdrawOptions = {
  onError?: () => void;
  onSuccess?: () => void;
};

const { showToastMock, withdrawMock, withdrawOptions } = vi.hoisted(() => ({
  showToastMock: vi.fn<typeof showToast>(),
  withdrawMock: vi.fn<() => void>(),
  withdrawOptions: [] as WithdrawOptions[],
}));

vi.mock('@/features/auth/session/model/use-logout', () => ({
  useLogout: () => ({
    logout: vi.fn<() => void>(),
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
vi.mock('@/shared/ui/toast', () => ({ showToast: showToastMock }));

describe('MyPage', () => {
  beforeEach(() => {
    showToastMock.mockReset();
    withdrawMock.mockReset();
    withdrawOptions.length = 0;
  });

  it('renders the guest profile state and login CTA', () => {
    render(<MyPage isLoggedIn={false} />);

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

  it('renders the authenticated profile state and account actions', () => {
    render(<MyPage isLoggedIn />);

    expect(screen.getAllByText('YAPP')).toHaveLength(2);
    expect(screen.getByText('Web4team@naver.com')).toBeVisible();
    expect(screen.getByText('디자인')).toBeVisible();
    expect(screen.getByRole('button', { name: '내 정보 수정' })).toBeVisible();
    expect(screen.getByRole('button', { name: '채널 추천받기' })).toHaveAttribute(
      'href',
      '/recommend/onboarding/new',
    );
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeVisible();
    expect(screen.getByRole('button', { name: '탈퇴하기' })).toBeVisible();
    expect(screen.queryByText('로그인이 필요해요')).not.toBeInTheDocument();
  });

  it('opens and closes the logout confirmation modal', async () => {
    const user = userEvent.setup();
    render(<MyPage isLoggedIn />);

    await user.click(screen.getByRole('button', { name: '로그아웃' }));

    const dialog = await screen.findByRole('dialog', { name: '정말 로그아웃하시겠어요?' });
    expect(dialog).toBeVisible();
    expect(dialog).toHaveTextContent('언제든 다시 로그인해서 저장된 결과를');

    await user.click(within(dialog).getByRole('button', { name: '취소' }));
    expect(
      screen.queryByRole('dialog', { name: '정말 로그아웃하시겠어요?' }),
    ).not.toBeInTheDocument();
  });

  it('opens the withdrawal confirmation modal', async () => {
    const user = userEvent.setup();
    render(<MyPage isLoggedIn />);

    await user.click(screen.getByRole('button', { name: '탈퇴하기' }));

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
    render(<MyPage isLoggedIn />);

    await user.click(screen.getByRole('button', { name: '탈퇴하기' }));
    withdrawOptions.at(-1)?.onError?.();

    expect(showToastMock).toHaveBeenCalledWith({
      id: 'withdraw-error',
      description: '탈퇴하지 못했습니다. 다시 시도해 주세요.',
      type: 'warning',
    });
  });
});
