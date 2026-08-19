import type { ChannelResult } from './simulator-channel';

export const simulatorPreviewChannels: readonly ChannelResult[] = [
  {
    name: '네이버 검색 광고',
    type: 'naver',
    budgetWon: 0,
    cpcWon: null,
    impressions: { value: '0회', fillPercentage: 0 },
    clicks: { value: '0회', fillPercentage: 0 },
  },
  {
    name: '뉴스캐시',
    type: 'newscash',
    budgetWon: 0,
    cpcWon: null,
    impressions: { value: '0회', fillPercentage: 0 },
    clicks: { value: '0회', fillPercentage: 0 },
  },
  {
    name: '메타 광고',
    type: 'meta',
    budgetWon: 0,
    cpcWon: null,
    impressions: { value: '0회', fillPercentage: 0 },
    clicks: { value: '0회', fillPercentage: 0 },
    unavailable: true,
  },
] as const;
