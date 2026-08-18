import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ComparisonChannelOption } from '@/pages/compare/model/comparison-channel-option';

import {
  CompareResultChannelPicker,
  type CompareResultChannelPickerProps,
} from './compare-result-channel-picker';

const OPTIONS = [
  { id: 'channel-google', name: '구글 검색 광고', isRecommended: true },
  { id: 'channel-kakao', name: '카카오 모먼트', isRecommended: false },
  { id: 'channel-meta', name: '메타 광고', isRecommended: true },
] as const satisfies readonly ComparisonChannelOption[];

const retryMock = vi.fn<() => void>();
const selectMock = vi.fn<(option: ComparisonChannelOption) => void>();

type HarnessProps = Pick<
  CompareResultChannelPickerProps,
  'disabled' | 'isError' | 'isLoading' | 'options'
>;

function PickerHarness({
  disabled = false,
  isError = false,
  isLoading = false,
  options = OPTIONS,
}: Partial<HarnessProps>): JSX.Element {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <CompareResultChannelPicker
        disabled={disabled}
        isError={isError}
        isLoading={isLoading}
        onOpenChange={setOpen}
        onRetry={retryMock}
        onSelect={selectMock}
        open={open}
        options={options}
      />
      <button type="button">외부 버튼</button>
    </div>
  );
}

function renderOpenPicker(
  props: Partial<Pick<CompareResultChannelPickerProps, 'isError' | 'isLoading' | 'options'>> = {},
) {
  return render(
    <CompareResultChannelPicker
      isError={props.isError ?? false}
      isLoading={props.isLoading ?? false}
      onOpenChange={vi.fn<(open: boolean) => void>()}
      onRetry={retryMock}
      onSelect={selectMock}
      open
      options={props.options ?? OPTIONS}
    />,
  );
}

describe('CompareResultChannelPicker', () => {
  beforeEach(() => {
    retryMock.mockReset();
    selectMock.mockReset();
  });

  it('추가 카드를 열면 검색창에 포커스하고 추천 채널을 표시한다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness />);

    await user.click(screen.getByLabelText('비교할 채널 추가'));

    const searchInput = await screen.findByRole('combobox', { name: '추가할 채널 검색' });
    expect(searchInput).toHaveFocus();
    expect(screen.getAllByText('추천')).toHaveLength(2);
    expect(screen.getByRole('option', { name: /구글 검색 광고/ })).toBeVisible();
    expect(screen.getByRole('option', { name: /카카오 모먼트/ })).toBeVisible();
  });

  it('입력한 채널명으로 목록을 필터링한다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness />);
    await user.click(screen.getByLabelText('비교할 채널 추가'));

    await user.type(await screen.findByRole('combobox', { name: '추가할 채널 검색' }), '카카오');

    expect(screen.getByRole('option', { name: /카카오 모먼트/ })).toBeVisible();
    expect(screen.queryByRole('option', { name: /구글 검색 광고/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('option', { name: /메타 광고/ })).not.toBeInTheDocument();
  });

  it('마우스로 채널을 선택하면 옵션을 전달하고 팝업을 닫는다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness />);
    const trigger = screen.getByLabelText('비교할 채널 추가');
    await user.click(trigger);
    await user.click(await screen.findByRole('option', { name: /메타 광고/ }));

    expect(selectMock).toHaveBeenCalledWith(OPTIONS[2]);
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it('키보드로 검색 결과를 선택할 수 있다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness />);
    await user.click(screen.getByLabelText('비교할 채널 추가'));
    const searchInput = await screen.findByRole('combobox', { name: '추가할 채널 검색' });

    await user.type(searchInput, '카카오');
    await user.keyboard('{ArrowDown}{Enter}');

    expect(selectMock).toHaveBeenCalledWith(OPTIONS[1]);
  });

  it('Escape로 닫은 뒤 다시 열면 검색어가 초기화된다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness />);
    const trigger = screen.getByLabelText('비교할 채널 추가');
    await user.click(trigger);
    const searchInput = await screen.findByRole('combobox', { name: '추가할 채널 검색' });
    await user.type(searchInput, '메타');
    await user.keyboard('{Escape}');

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();

    await user.click(trigger);
    expect(await screen.findByRole('combobox', { name: '추가할 채널 검색' })).toHaveValue('');
  });

  it('외부를 클릭하면 팝업을 닫는다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness />);
    await user.click(screen.getByLabelText('비교할 채널 추가'));
    expect(await screen.findByRole('listbox')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '외부 버튼' }));

    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
  });

  it('로딩 상태를 팝업 안에 표시한다', () => {
    renderOpenPicker({ isLoading: true, options: [] });

    expect(screen.getByRole('status')).toHaveTextContent('채널을 불러오고 있어요');
    expect(screen.getByLabelText('추가할 채널 선택')).toHaveAttribute('aria-busy', 'true');
  });

  it('검색 결과가 없으면 빈 상태를 표시한다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness />);
    await user.click(screen.getByLabelText('비교할 채널 추가'));
    await user.type(await screen.findByRole('combobox', { name: '추가할 채널 검색' }), '없는 채널');

    expect(screen.getByRole('status')).toHaveTextContent('검색 결과가 없어요');
  });

  it('추가 가능한 채널이 없으면 별도 빈 상태를 표시한다', () => {
    renderOpenPicker({ options: [] });

    expect(screen.getByRole('status')).toHaveTextContent('추가할 수 있는 채널이 없어요');
  });

  it('오류 상태에서 재시도를 요청한다', async () => {
    const user = userEvent.setup();

    renderOpenPicker({ isError: true, options: [] });
    expect(screen.getByRole('alert')).toHaveTextContent('채널 목록을 불러오지 못했어요');

    await user.click(screen.getByRole('button', { name: '다시 시도' }));

    expect(retryMock).toHaveBeenCalledOnce();
  });

  it('비활성 상태에서는 추가 카드를 열 수 없다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness disabled />);
    const trigger = screen.getByLabelText('비교할 채널 추가');

    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });
});
