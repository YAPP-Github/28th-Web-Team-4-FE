/** 채널 인사이트 DQA 쿼리의 적용 범위와 URL 동기화를 검증한다. */

import type { ReactNode } from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { withNuqsTestingAdapter, type OnUrlUpdateFunction } from 'nuqs/adapters/testing';

import { MOCK_COMPARE_RESULT_CHANNELS } from '@/pages/compare/model/compare-result-channel';

import { CompareResultChannelInsightsDqa } from './compare-result-channel-insights-dqa';

type LevaControl = {
  value: string | boolean;
  options?: readonly string[] | Record<string, string>;
  label: string;
  onChange?: (value: never, path: string, context: { initial: boolean }) => void;
};

const { levaPanelState } = vi.hoisted(() => ({
  levaPanelState: {
    controls: {} as Record<string, LevaControl>,
  },
}));

vi.mock('leva', () => ({
  useCreateStore: () => ({}),
  useControls: (controls: Record<string, LevaControl>) => {
    levaPanelState.controls = controls;
  },
  LevaPanel: ({ titleBar }: { titleBar: { title: string } }) => {
    const variantControl = levaPanelState.controls.variant;
    const variantOptions = Array.isArray(variantControl.options)
      ? variantControl.options.map((option) => ({ label: option, value: option }))
      : Object.entries(variantControl.options ?? {}).map(([label, value]) => ({ label, value }));

    return (
      <section aria-label={titleBar.title}>
        <p>{titleBar.title}</p>
        <label>
          {variantControl.label}
          <select
            aria-label={variantControl.label}
            value={String(variantControl.value)}
            onChange={(event) => {
              variantControl.onChange?.(event.target.value as never, 'variant', {
                initial: false,
              });
            }}
          >
            {variantOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>
    );
  },
}));

function renderDqaInsights(
  searchParams: string,
  onUrlUpdate: (event: Parameters<OnUrlUpdateFunction>[0]) => void = () => {},
) {
  const NuqsTestingAdapter = withNuqsTestingAdapter({ searchParams, onUrlUpdate });

  function Wrapper({ children }: { children: ReactNode }) {
    return <NuqsTestingAdapter>{children}</NuqsTestingAdapter>;
  }

  return render(<CompareResultChannelInsightsDqa channels={MOCK_COMPARE_RESULT_CHANNELS} />, {
    wrapper: Wrapper,
  });
}

describe('CompareResultChannelInsightsDqa', () => {
  it('DQA 모드가 아니면 인사이트 관련 쿼리를 적용하지 않는다', () => {
    renderDqaInsights('?insightVariant=split&insightOpen=false');

    const region = screen.getByRole('region', { name: '채널별 인사이트' });
    const firstChannel = within(region).getByRole('article', { name: '네이버 검색 광고' });

    expect(firstChannel).toHaveAttribute(
      'aria-labelledby',
      'compare-result-channel-naver-split-insight-title',
    );
    expect(within(region).getByRole('article', { name: '카카오 키워드 광고' })).toBeVisible();
    expect(screen.queryByText('채널 인사이트 DQA')).not.toBeInTheDocument();
  });

  it('DQA 모드에서는 URL의 카드 안과 펼침 상태를 적용한다', async () => {
    renderDqaInsights(
      '?dqa=channel-insight&insightVariant=split&insightOpen=false&insightCollapse=first',
    );

    const region = await screen.findByRole('region', { name: '채널별 인사이트' });
    const firstChannel = within(region).getByRole('article', { name: '네이버 검색 광고' });

    expect(firstChannel).toHaveAttribute(
      'aria-labelledby',
      'compare-result-channel-naver-split-insight-title',
    );
    expect(
      within(region).queryByRole('article', { name: '카카오 키워드 광고' }),
    ).not.toBeInTheDocument();
    expect(await screen.findByText('채널 인사이트 DQA')).toBeVisible();
  });

  it('Leva에서 선택한 카드 레이아웃을 URL에 직접 저장한다', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    renderDqaInsights('?dqa=channel-insight&insightVariant=split', onUrlUpdate);

    const variantControl = await screen.findByRole('combobox', { name: '카드 레이아웃' });
    const actionOption = within(variantControl).getByRole('option', { name: 'action' });

    await user.selectOptions(variantControl, actionOption);
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

    expect(onUrlUpdate.mock.lastCall?.[0].searchParams.get('insightVariant')).toBe('action');
  });

  it('DQA의 기본 접힘 상태에서 제목만 남긴다', async () => {
    renderDqaInsights('?dqa=channel-insight&insightOpen=false');

    const region = await screen.findByRole('region', { name: '채널별 인사이트' });

    expect(within(region).queryAllByRole('article')).toHaveLength(0);
  });

  it('DQA에서 접기 상태를 바꿀 때 기존 결과 쿼리를 유지한다', async () => {
    const user = userEvent.setup();
    const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();

    renderDqaInsights(
      '?channels=channel-naver,channel-kakao&onboardingId=42&dqa=channel-insight&insightVariant=action',
      onUrlUpdate,
    );

    await user.click(await screen.findByRole('button', { name: '채널별 인사이트' }));
    await waitFor(() => expect(onUrlUpdate).toHaveBeenCalled());

    const event = onUrlUpdate.mock.lastCall?.[0];

    expect(event?.searchParams.get('channels')).toBe('channel-naver,channel-kakao');
    expect(event?.searchParams.get('onboardingId')).toBe('42');
    expect(event?.searchParams.get('dqa')).toBe('channel-insight');
    expect(event?.searchParams.get('insightVariant')).toBe('action');
    expect(event?.searchParams.get('insightOpen')).toBe('false');
    expect(event?.options.history).toBe('replace');
    expect(event?.options.shallow).toBe(true);
  });
});
