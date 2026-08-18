import type {
  ChannelListItemResponse,
  RecommendationSummaryResponse,
} from '@/shared/api/generated';
import { formatRecommendationDate } from '@/shared/lib/format-recommendation-date';

export type SimulatorRecommendationChannel = {
  id: string;
  name: string;
};

export type SimulatorRecommendationSelection = {
  id: string;
  date: string;
  title: string;
  channels: readonly SimulatorRecommendationChannel[];
};

/** 저장된 추천 요약과 채널 카탈로그를 시뮬레이터 선택 카드 모델로 변환한다. */
export function createSimulatorRecommendationSelections(
  recommendations: readonly RecommendationSummaryResponse[],
  channels: readonly Pick<ChannelListItemResponse, 'id' | 'name'>[],
): SimulatorRecommendationSelection[] {
  const channelIdByName = new Map(channels.map((channel) => [channel.name, channel.id]));

  return recommendations.map((recommendation) => ({
    id: recommendation.id,
    date: formatRecommendationDate(recommendation.createdAt),
    title: recommendation.serviceName ?? '이름 없는 서비스',
    channels: recommendation.channelNames.flatMap((name) => {
      const id = channelIdByName.get(name);

      return id ? [{ id, name }] : [];
    }),
  }));
}

const createChannels = (prefix: string, names: readonly string[]) =>
  names.map((name, index) => ({
    id: `${prefix}-${index + 1}`,
    name,
  }));

/**
 * 추천 결과 선택 화면의 UI 상태를 확인하기 위한 디자인 fixture.
 */
export const SIMULATOR_RECOMMENDATION_SELECTION_PREVIEW = [
  {
    id: 'recommendation-1',
    date: '2026.06.12',
    title: '채소집',
    channels: createChannels('recommendation-1-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
      '카카오모먼트',
      '네이버 검색광고',
    ]),
  },
  {
    id: 'recommendation-2',
    date: '2026.06.12',
    title: '사이드 프로젝트 B',
    channels: createChannels('recommendation-2-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
    ]),
  },
  {
    id: 'recommendation-3',
    date: '2026.06.12',
    title: '사이드 프로젝트 C',
    channels: createChannels('recommendation-3-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
    ]),
  },
  {
    id: 'recommendation-4',
    date: '2026.06.12',
    title: '사이드 프로젝트 D',
    channels: createChannels('recommendation-4-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
    ]),
  },
  {
    id: 'recommendation-5',
    date: '2026.06.12',
    title: '사이드 프로젝트 E',
    channels: createChannels('recommendation-5-channel', [
      '네이버 검색광고',
      '메타 광고',
      '카카오모먼트',
      '카카오모먼트',
    ]),
  },
] satisfies readonly SimulatorRecommendationSelection[];

export const SIMULATOR_RECOMMENDATION_SELECTION_PAGE_SIZE = 5;
export const SIMULATOR_RECOMMENDATION_CHANNEL_LIMIT = 3;
