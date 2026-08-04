import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withNuqsTestingAdapter } from 'nuqs/adapters/testing';

import { ComparePage } from './compare-page';

const { showWarningToastMock } = vi.hoisted(() => ({
  showWarningToastMock: vi.fn<(description: string, options?: { id?: string }) => void>(),
}));

vi.mock('@number-flow/react', () => ({
  default: ({ value }: { value: number }) => <span>{value}</span>,
}));

vi.mock('@/shared/ui/toast', () => ({
  showWarningToast: showWarningToastMock,
}));

vi.mock('motion/react', () => ({
  useReducedMotion: () => false,
}));

function renderComparePage(searchParams = '') {
  return render(<ComparePage />, {
    wrapper: withNuqsTestingAdapter({
      searchParams,
    }),
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getChannelCheckbox(name: string) {
  return screen.getByRole('checkbox', { name: new RegExp(`${escapeRegExp(name)} 선택`) });
}

function getCompareButton() {
  return screen.getByRole('button', { name: /선택한 채널 비교하기/ });
}

describe('ComparePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Figma compare page shell with 12 channel cards and a disabled CTA', () => {
    renderComparePage();

    expect(screen.getByRole('heading', { name: '비교할 채널을 선택해 주세요' })).toBeVisible();
    expect(screen.getByText('최대 3개까지 선택할 수 있어요')).toBeVisible();
    expect(screen.getByRole('button', { name: '전체' })).toBeVisible();
    expect(screen.getByLabelText('채널 검색')).toHaveAttribute('placeholder', '검색');
    expect(screen.getAllByRole('checkbox')).toHaveLength(12);
    expect(screen.getByText('1').closest('[aria-current="page"]')).not.toBeNull();
    expect(getCompareButton()).toBeDisabled();
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (0/3)');
  });

  it('filters channels by name, description, and category', async () => {
    const user = userEvent.setup();
    renderComparePage();

    await user.type(screen.getByLabelText('채널 검색'), 'CRM');

    expect(screen.getByText('카카오 채널 메시지')).toBeVisible();
    expect(screen.queryByText('네이버 검색 광고')).not.toBeInTheDocument();

    await user.clear(screen.getByLabelText('채널 검색'));
    await user.type(screen.getByLabelText('채널 검색'), '없는 검색어');

    expect(screen.getByText('검색 결과가 없어요')).toBeVisible();
    expect(screen.getByText('다른 검색어로 다시 찾아보세요')).toBeVisible();
  });

  it('selects and unselects cards while updating the CTA count', async () => {
    const user = userEvent.setup();
    renderComparePage();

    const naverCheckbox = getChannelCheckbox('네이버 검색 광고');
    const naverCard = screen.getByText('네이버 검색 광고').closest('label');

    await user.click(naverCheckbox);

    expect(naverCheckbox).toBeChecked();
    expect(naverCard).toHaveClass('border-outline-selected');
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (1/3)');

    await user.click(naverCheckbox);

    expect(naverCheckbox).not.toBeChecked();
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (0/3)');
  });

  it('keeps the selection at 3 and shows a warning toast when the limit is exceeded', async () => {
    const user = userEvent.setup();
    renderComparePage();

    await user.click(getChannelCheckbox('네이버 검색 광고'));
    await user.click(getChannelCheckbox('카카오 키워드 광고'));
    await user.click(getChannelCheckbox('메타 피드 광고'));
    await user.click(getChannelCheckbox('유튜브 영상 광고'));

    expect(getChannelCheckbox('네이버 검색 광고')).toBeChecked();
    expect(getChannelCheckbox('카카오 키워드 광고')).toBeChecked();
    expect(getChannelCheckbox('메타 피드 광고')).toBeChecked();
    expect(getChannelCheckbox('유튜브 영상 광고')).not.toBeChecked();
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (3/3)');
    expect(showWarningToastMock).toHaveBeenCalledWith('채널 비교는 최대 3개까지만 선택 가능해요.', {
      id: 'compare-selection-limit',
    });
  });

  it('enables the CTA for exactly 3 selected channels and shows a temporary toast', async () => {
    const user = userEvent.setup();
    renderComparePage();

    await user.click(getChannelCheckbox('네이버 검색 광고'));
    await user.click(getChannelCheckbox('카카오 키워드 광고'));
    await user.click(getChannelCheckbox('메타 피드 광고'));

    expect(getCompareButton()).toBeEnabled();

    await user.click(getCompareButton());

    expect(showWarningToastMock).toHaveBeenCalledWith('채널 비교 기능은 준비 중이에요.', {
      id: 'compare-coming-soon',
    });
  });

  it('기존 channels query에서 선택을 복원하지 않는다', () => {
    renderComparePage(
      'channels=meta-feed-ad,unknown,kakao-bizboard,youtube-video-ad,naver-search-ad',
    );

    expect(getChannelCheckbox('메타 피드 광고')).not.toBeChecked();
    expect(getChannelCheckbox('카카오 비즈보드')).not.toBeChecked();
    expect(getChannelCheckbox('유튜브 영상 광고')).not.toBeChecked();
    expect(getCompareButton()).toHaveTextContent('선택한 채널 비교하기 (0/3)');
  });
});
