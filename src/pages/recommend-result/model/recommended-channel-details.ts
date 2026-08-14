import type { RecommendedChannel } from './recommended-channels';

import type { ChannelDetailHeaderData } from '@/features/channel-detail/model/channel-list-item';

/** 추천 결과 카드 데이터를 상세 조회 모달 헤더에 필요한 형태로 변환한다. */
export function getRecommendedChannelDetailHeader(
  channel: RecommendedChannel,
): ChannelDetailHeaderData {
  return {
    id: channel.id,
    name: channel.name,
    logoUrl: channel.thumbnailSrc,
    description: channel.description,
  };
}
