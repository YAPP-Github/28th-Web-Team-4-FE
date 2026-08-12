import type { ChannelDetail } from '@/features/channel-detail/resolved';

import type { RecommendedChannel } from './recommended-channels';

function getMetricValue(channel: RecommendedChannel, label: string): string {
  return channel.metrics.find((metric) => metric.label === label)?.value ?? '-';
}

/** 추천 결과 카드의 요약 데이터를 상세 모달에서 사용할 채널 상세 형태로 변환한다. */
export function getRecommendedChannelDetail(channel: RecommendedChannel): ChannelDetail {
  const targetAudience = getMetricValue(channel, '주요 타깃');
  const expectedImpressions = getMetricValue(channel, '예상 노출');
  const minimumBudget = getMetricValue(channel, '최소 예산');
  const billingMethod = getMetricValue(channel, '과금 방식');

  return {
    id: channel.id,
    name: channel.name,
    logoUrl: channel.thumbnailSrc,
    tagline: channel.description,
    summary: {
      paragraphs: [
        `${channel.name}은(는) ${channel.description}`,
        `${channel.cpcPrice} 기준으로 광고를 운영할 수 있어요.`,
        `추천 결과 기준 ${targetAudience} 타깃에게 ${expectedImpressions} 규모로 도달할 수 있어요.`,
      ],
    },
    products: [
      {
        id: `${channel.id}-default`,
        name: '기본 광고 상품',
        budgetRange: `${minimumBudget}부터`,
        expectedImpressions,
        expectedClicks: getMetricValue(channel, '예상 클릭'),
      },
    ],
    productsNote: `${billingMethod} 기준 예상 데이터이며 실제 성과는 캠페인 설정에 따라 달라질 수 있어요.`,
    audience: {
      primaryAgeBand: targetAudience,
      primaryGender: '전체',
      userScale: expectedImpressions,
      dailyActiveUsers: '채널별 상이',
      traits: channel.description,
    },
    similarCases: [`${channel.name} 활용 캠페인`, '유사 업종 성공 사례', '맞춤 타깃 테스트 사례'],
  };
}
