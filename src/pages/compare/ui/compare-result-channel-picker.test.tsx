import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { ComparisonChannelOption } from '@/pages/compare/model/comparison-channel-option';

import {
  CompareResultChannelPicker,
  type CompareResultChannelPickerProps,
} from './compare-result-channel-picker';

const OPTIONS = [
  { id: 'channel-google', isDisabled: false, isRecommended: true, name: '구글 검색 광고' },
  { id: 'channel-kakao', isDisabled: false, isRecommended: false, name: '카카오 모먼트' },
  { id: 'channel-meta', isDisabled: false, isRecommended: true, name: '메타 광고' },
  {
    id: 'channel-meta-search',
    isDisabled: true,
    isRecommended: false,
    name: '메타 검색 광고',
  },
] as const satisfies readonly ComparisonChannelOption[];

const retryMock = vi.fn<() => void>();
const selectMock = vi.fn<(option: ComparisonChannelOption) => void>();

type HarnessProps = Pick<
  CompareResultChannelPickerProps,
  'disabled' | 'isError' | 'isPending' | 'options'
>;

function PickerHarness({
  disabled = false,
  isError = false,
  isPending = false,
  options = OPTIONS,
}: Partial<HarnessProps>): JSX.Element {
  const [open, setOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const filteredOptions = options.filter((option) => option.name.includes(searchKeyword));

  return (
    <div>
      <CompareResultChannelPicker
        disabled={disabled}
        isError={isError}
        isPending={isPending}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen);

          if (!nextOpen) {
            setSearchKeyword('');
          }
        }}
        onRetry={retryMock}
        onSearchKeywordChange={setSearchKeyword}
        onSelect={selectMock}
        open={open}
        options={filteredOptions}
        searchKeyword={searchKeyword}
      />
      <button type="button">외부 버튼</button>
    </div>
  );
}

function renderOpenPicker(
  props: Partial<
    Pick<CompareResultChannelPickerProps, 'isError' | 'isPending' | 'options' | 'searchKeyword'>
  > = {},
) {
  return render(
    <CompareResultChannelPicker
      isError={props.isError ?? false}
      isPending={props.isPending ?? false}
      onOpenChange={vi.fn<(open: boolean) => void>()}
      onRetry={retryMock}
      onSearchKeywordChange={vi.fn<(searchKeyword: string) => void>()}
      onSelect={selectMock}
      open
      options={props.options ?? OPTIONS}
      searchKeyword={props.searchKeyword ?? ''}
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
    screen
      .getAllByRole('checkbox', { hidden: true })
      .forEach((checkbox) => expect(checkbox).not.toBeChecked());
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

  it('현재 비교 중인 채널은 unchecked disabled 상태로 표시하고 선택하지 않는다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness />);
    await user.click(screen.getByLabelText('비교할 채널 추가'));
    const searchInput = await screen.findByRole('combobox', { name: '추가할 채널 검색' });
    await user.type(searchInput, '메타 검색');

    const selectedChannel = screen.getByRole('option', { name: /메타 검색 광고/ });
    const checkbox = selectedChannel.querySelector('[role="checkbox"]');
    expect(selectedChannel).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).toHaveAttribute('aria-hidden', 'true');
    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).not.toBeChecked();

    await user.click(selectedChannel);
    await user.keyboard('{ArrowDown}{Enter}');

    expect(selectMock).not.toHaveBeenCalled();
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
    renderOpenPicker({ isPending: true, options: [] });

    expect(screen.getByRole('status')).toHaveTextContent('채널을 불러오고 있어요');
    expect(screen.getAllByTestId('channel-picker-skeleton')).toHaveLength(5);
    expect(screen.getByLabelText('추가할 채널 선택')).toHaveAttribute('aria-busy', 'true');
  });

  it('조회 상태가 바뀌어도 목록을 mount한 채 검색창 포커스를 유지한다', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<PickerHarness options={[]} />);

    await user.click(screen.getByLabelText('비교할 채널 추가'));
    const searchInput = await screen.findByRole('combobox', { name: '추가할 채널 검색' });

    rerender(<PickerHarness isPending options={[]} />);

    expect(screen.getByRole('listbox', { hidden: true })).toHaveClass('hidden');
    expect(screen.getByRole('combobox', { name: '추가할 채널 검색' })).toBe(searchInput);
    expect(searchInput).toHaveFocus();

    rerender(<PickerHarness isError options={[]} />);

    expect(screen.getByRole('listbox', { hidden: true })).toHaveClass('hidden');
    expect(screen.getByRole('combobox', { name: '추가할 채널 검색' })).toBe(searchInput);
    expect(searchInput).toHaveFocus();

    rerender(<PickerHarness options={OPTIONS} />);

    expect(screen.getByRole('listbox')).toBeVisible();
    expect(screen.getByRole('combobox', { name: '추가할 채널 검색' })).toBe(searchInput);
    expect(searchInput).toHaveFocus();
  });

  it('검색 결과가 없으면 빈 상태를 표시한다', async () => {
    const user = userEvent.setup();

    render(<PickerHarness />);
    await user.click(screen.getByLabelText('비교할 채널 추가'));
    await user.type(await screen.findByRole('combobox', { name: '추가할 채널 검색' }), '없는 채널');

    expect(screen.getByRole('status')).toHaveTextContent('검색 결과가 없어요');
  });

  it('검색 전에는 빈 상태를 표시하지 않는다', () => {
    renderOpenPicker({ options: [] });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
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
