import { describe, expect, it } from 'vitest';

import type { RecommendationItemResponse } from '@/shared/api/generated/types.gen';

import { mapRecommendationItemsToChannels, recommendedChannels } from './recommended-channels';

describe('recommendedChannels', () => {
  it('provides eight unique recommendation fixtures', () => {
    const channelIds = recommendedChannels.map((channel) => channel.id);

    expect(recommendedChannels).toHaveLength(8);
    expect(new Set(channelIds).size).toBe(8);
  });

  it('maps API recommendation items to the card view model', () => {
    expect(
      mapRecommendationItemsToChannels([
        {
          channelId: 'kakao-1',
          channelName: '카카오 비즈보드',
          wordmarkUrl: 'https://assets.chaeso-zip.com/wordmarks/kakao.png',
          matchRate: 84,
          recommendationReason: '모바일 도달에 적합해요.',
          primaryTarget: '20대',
          cpcWon: 320,
          pricingModel: 'CPC',
          minBudgetWon: 300000,
          estImpressions: { min: 12000, max: 15000 },
          estClicks: { min: 300, max: 450 },
          isExecutable: true,
          shortfallWon: null,
        },
      ]),
    ).toEqual([
      {
        id: 'kakao-1',
        name: '카카오 비즈보드',
        description: '모바일 도달에 적합해요.',
        cpcPrice: '클릭 1회당 320원~',
        isLowestCpc: true,
        matchRate: 84,
        thumbnailSrc: 'https://assets.chaeso-zip.com/wordmarks/kakao.png',
        thumbnailFallbackSrc: '/recommend-assets/kakao-ad.png',
        metrics: [
          { label: '예상 노출', value: '12,000~15,000회' },
          { label: '예상 클릭', value: '300~450회' },
          { label: '최소 예산', value: '30만' },
          { label: '주요 타깃', value: '20대' },
          { label: '과금 방식', value: '클릭당(CPC)' },
        ],
      },
    ]);
  });

  it('marks every channel tied for the lowest non-null CPC', () => {
    const createItem = (
      channelId: string,
      cpcWon: RecommendationItemResponse['cpcWon'],
    ): RecommendationItemResponse => ({
      channelId,
      channelName: channelId,
      wordmarkUrl: null,
      matchRate: 80,
      recommendationReason: '추천 이유',
      primaryTarget: '20대',
      cpcWon,
      pricingModel: 'CPC',
      minBudgetWon: 300000,
      estImpressions: null,
      estClicks: null,
      isExecutable: true,
      shortfallWon: null,
    });

    const channels = mapRecommendationItemsToChannels([
      createItem('higher', 500),
      createItem('missing', null),
      createItem('lowest-first', 300),
      createItem('lowest-second', 300),
    ]);

    expect(channels.map(({ id, isLowestCpc }) => ({ id, isLowestCpc }))).toEqual([
      { id: 'higher', isLowestCpc: false },
      { id: 'missing', isLowestCpc: false },
      { id: 'lowest-first', isLowestCpc: true },
      { id: 'lowest-second', isLowestCpc: true },
    ]);
  });

  it('does not mark a lowest CPC when every value is null', () => {
    const channels = mapRecommendationItemsToChannels([
      {
        channelId: 'missing-cpc',
        channelName: '단가 없는 채널',
        wordmarkUrl: null,
        matchRate: 70,
        recommendationReason: '추천 이유',
        primaryTarget: '20대',
        cpcWon: null,
        pricingModel: 'OTHER',
        minBudgetWon: null,
        estImpressions: null,
        estClicks: null,
        isExecutable: false,
        shortfallWon: null,
      },
    ]);

    expect(channels[0]?.isLowestCpc).toBe(false);
  });

  it('keeps non-round budget values exact and falls back for missing API values', () => {
    expect(
      mapRecommendationItemsToChannels([
        {
          channelId: 'unknown-1',
          channelName: '새로운 광고 채널',
          wordmarkUrl: null,
          matchRate: 42,
          recommendationReason: '조건에 맞는 채널이에요.',
          primaryTarget: '정보 없음',
          cpcWon: null,
          pricingModel: 'OTHER',
          minBudgetWon: 15000,
          estImpressions: null,
          estClicks: null,
          isExecutable: false,
          shortfallWon: null,
        },
      ]),
    ).toMatchObject([
      {
        cpcPrice: '클릭당 비용 정보 없음',
        thumbnailSrc: '/recommend-assets/naver-search-ad.png',
        metrics: [
          { label: '예상 노출', value: '정보 없음' },
          { label: '예상 클릭', value: '정보 없음' },
          { label: '최소 예산', value: '15,000' },
          { label: '주요 타깃', value: '정보 없음' },
          { label: '과금 방식', value: '기타' },
        ],
      },
    ]);
  });
});
