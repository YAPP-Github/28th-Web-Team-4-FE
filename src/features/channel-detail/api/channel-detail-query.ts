import { getChannelOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { ChannelDetailResponse, GetChannelResponse } from '@/shared/api/generated';

import { toChannelDetailViewModel } from '@/features/channel-detail/model/channel-detail-adapter';

export function channelDetailQueryOptions(id: string) {
  return {
    ...getChannelOptions({ path: { id } }),
    select: (response: GetChannelResponse) => {
      // 200 성공 응답에는 상세 data가 존재한다는 API 계약을 따른다.
      // oxlint-disable-next-line typescript/no-non-null-assertion
      const channel: NonNullable<ChannelDetailResponse> = response.data!;
      return toChannelDetailViewModel(channel);
    },
  };
}
