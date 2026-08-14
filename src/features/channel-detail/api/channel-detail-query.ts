import { getChannelOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { GetChannelResponse } from '@/shared/api/generated';

import { toChannelDetailViewModel } from '@/features/channel-detail/model/channel-detail-adapter';

export function channelDetailQueryOptions(id: string) {
  return {
    ...getChannelOptions({ path: { id } }),
    select: (response: GetChannelResponse) => {
      return toChannelDetailViewModel(response.data);
    },
  };
}
