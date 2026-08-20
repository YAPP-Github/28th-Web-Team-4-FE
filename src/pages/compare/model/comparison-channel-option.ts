import type { ChannelListItemResponse, RecommendationItemResponse } from '@/shared/api/generated';

/** 비교 결과의 채널 추가 드롭다운에서 표시하는 채널 옵션이다. */
export type ComparisonChannelOption = {
  readonly id: string;
  readonly isDisabled: boolean;
  readonly isRecommended: boolean;
  readonly name: string;
};

type ComparisonChannel = Pick<ChannelListItemResponse, 'id' | 'name'>;
type ComparisonRecommendation = Pick<RecommendationItemResponse, 'channelId'>;

/** 검색된 채널에 추천·선택 상태를 합쳐 비교 채널 옵션으로 변환한다. */
export function createComparisonChannelOptions({
  recommendations,
  searchedChannels,
  selectedChannelIds,
}: {
  recommendations: readonly ComparisonRecommendation[];
  searchedChannels: readonly ComparisonChannel[];
  selectedChannelIds: readonly string[];
}): ComparisonChannelOption[] {
  const selectedChannelIdSet = new Set(selectedChannelIds);
  const recommendedChannelIdSet = new Set(
    recommendations.map((recommendation) => recommendation.channelId),
  );

  return searchedChannels
    .map((channel) => ({
      id: channel.id,
      isDisabled: selectedChannelIdSet.has(channel.id),
      isRecommended: recommendedChannelIdSet.has(channel.id),
      name: channel.name,
    }))
    .toSorted(
      (left, right) =>
        Number(right.isRecommended) - Number(left.isRecommended) ||
        left.name.localeCompare(right.name, 'ko'),
    );
}
