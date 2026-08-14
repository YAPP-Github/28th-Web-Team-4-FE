import type { ChannelListItemResponse } from '@/shared/api/generated';

export type ChannelListItem = ChannelListItemResponse;
export type ChannelDetailHeaderData = Pick<
  ChannelListItemResponse,
  'id' | 'name' | 'logoUrl' | 'description'
>;
