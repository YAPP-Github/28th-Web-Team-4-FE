import { render, screen, within } from '@testing-library/react';

import type { ChannelDetail } from '@/features/channel-detail/model/channel-detail';

import { ChannelDetailProductsPanel } from './products-panel';

const BASE_CHANNEL: ChannelDetail = {
  id: 'channel-meta',
  name: '메타 광고',
  iconUrl: '',
  tagline: '관심사에 맞는 고객에게 도달하기 좋아요',
  summary: {
    keywords: [],
    paragraphs: [],
    recommendationReason: null,
  },
  products: [
    {
      id: 'product-feed',
      name: '피드 광고',
      budgetRange: '20~50만 원',
      expectedImpressions: '5~15만 회',
      expectedClicks: '1.2만 회',
      isExecutable: true,
    },
    {
      id: 'product-story',
      name: '스토리 광고',
      budgetRange: '30~100만 원',
      expectedImpressions: '10~30만 회',
      expectedClicks: '900회',
      isExecutable: false,
    },
    {
      id: 'product-retargeting',
      name: '리타기팅 광고',
      budgetRange: '50만 원 이상',
      expectedImpressions: '맞춤 설정',
      expectedClicks: '300회',
      isExecutable: null,
    },
  ],
  productsNote: '일부 채널은 해당 지표를 공개하지 않아요.',
  audience: {
    primaryAgeBand: '-',
    primaryGender: '전체',
    metrics: [],
    traits: '-',
  },
  similarCases: [],
};

function getProductRow(productName: string): HTMLElement {
  const rows = within(screen.getByRole('table')).getAllByRole('row');
  const row = rows.find((candidate) => within(candidate).queryByText(productName));

  if (!row) {
    throw new Error(`${productName} row not found`);
  }

  return row;
}

describe('ChannelDetailProductsPanel', () => {
  it('상품 테이블에 집행 가능 컬럼과 상품별 상태를 표시한다', () => {
    render(<ChannelDetailProductsPanel channel={BASE_CHANNEL} />);

    const table = screen.getByRole('table');
    expect(within(table).getByRole('columnheader', { name: '집행 가능' })).toBeVisible();

    expect(within(getProductRow('피드 광고')).getByText('집행 가능')).toHaveClass('sr-only');
    expect(within(getProductRow('스토리 광고')).getByText('집행 불가')).toHaveClass('sr-only');
    expect(within(getProductRow('리타기팅 광고')).getByText('-')).toBeVisible();
  });

  it('등록된 상품이 없으면 빈 상태 문구를 표시한다', () => {
    render(<ChannelDetailProductsPanel channel={{ ...BASE_CHANNEL, products: [] }} />);

    expect(screen.getByText('등록된 광고 상품이 없습니다.')).toBeVisible();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
