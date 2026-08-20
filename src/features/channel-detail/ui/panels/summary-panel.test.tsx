import { render, screen } from '@testing-library/react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';

import { ChannelDetailSummaryPanel } from './summary-panel';

const BASE_CHANNEL: ChannelDetail = {
  id: 'channel-meta',
  name: '메타 광고',
  iconUrl: '',
  tagline: '관심사에 맞는 고객에게 도달하기 좋아요',
  summary: {
    keywords: ['KPI 최적', '입문자 추천'],
    paragraphs: [],
    recommendationReason: {
      category: '쇼핑·커머스',
      objective: '구매 전환',
      objectiveWithParticle: '구매 전환을',
      budget: '50만 원',
      rationale: '관심사에 맞는 고객에게 광고를 노출해 구매로 이어질 가능성이 가장 높으므로',
    },
  },
  products: [],
  productsNote: '',
  audience: {
    primaryAgeBand: '-',
    primaryGender: '전체',
    metrics: [],
    traits: '-',
  },
  similarCases: [],
};

describe('ChannelDetailSummaryPanel', () => {
  it('핵심 요약 keyword가 있으면 좋은 점 섹션에 칩으로 표시한다', () => {
    render(<ChannelDetailSummaryPanel channel={BASE_CHANNEL} />);

    expect(screen.getByRole('heading', { name: '이런 점이 좋아요' })).toBeVisible();
    expect(screen.getByText('KPI 최적')).toBeVisible();
    expect(screen.getByText('입문자 추천')).toBeVisible();
  });

  it('recommendationBasis와 rationale을 예시 문장 순서로 조립하고 핵심 값을 강조한다', () => {
    render(<ChannelDetailSummaryPanel channel={BASE_CHANNEL} />);

    expect(screen.getByRole('heading', { name: '이런 이유로 추천해요' })).toBeVisible();
    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent ===
          '입력하신 구매 전환 목적, 쇼핑·커머스 업종, 50만 원 예산 기준으로 도달 효율이 가장 높아요.',
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent ===
          '관심사에 맞는 고객에게 광고를 노출해 구매로 이어질 가능성이 가장 높으므로, 구매 전환을 목표로 하는 쇼핑·커머스 업종에 최적이에요.',
      ),
    ).toBeVisible();
    expect(screen.getByText('구매 전환 목적, 쇼핑·커머스 업종, 50만 원 예산 기준')).toBeVisible();
    expect(
      screen.getByText(
        '관심사에 맞는 고객에게 광고를 노출해 구매로 이어질 가능성이 가장 높으므로, 구매 전환을 목표로 하는 쇼핑·커머스 업종에 최적이에요.',
      ),
    ).toBeVisible();
  });

  it('recommendationBasis가 없으면 추천 이유 영역을 표시하지 않는다', () => {
    render(
      <ChannelDetailSummaryPanel
        channel={{
          ...BASE_CHANNEL,
          summary: {
            keywords: [],
            paragraphs: ['핵심 요약만 있어요.'],
            recommendationReason: null,
          },
        }}
      />,
    );

    expect(screen.queryByRole('heading', { name: '이런 이유로 추천해요' })).not.toBeInTheDocument();
    expect(screen.getByText('핵심 요약만 있어요.')).toBeVisible();
  });

  it('keywords가 없으면 좋은 점 섹션을 표시하지 않는다', () => {
    render(
      <ChannelDetailSummaryPanel
        channel={{
          ...BASE_CHANNEL,
          summary: {
            keywords: [],
            paragraphs: BASE_CHANNEL.summary.paragraphs,
            recommendationReason: BASE_CHANNEL.summary.recommendationReason,
          },
        }}
      />,
    );

    expect(screen.queryByRole('heading', { name: '이런 점이 좋아요' })).not.toBeInTheDocument();
  });

  it('핵심 요약, keyword, 추천 이유가 모두 없으면 기존 빈 상태를 표시한다', () => {
    render(
      <ChannelDetailSummaryPanel
        channel={{
          ...BASE_CHANNEL,
          summary: { keywords: [], paragraphs: [], recommendationReason: null },
        }}
      />,
    );

    expect(screen.getByText('등록된 핵심 요약이 없습니다.')).toBeVisible();
  });
});
