import type { ChannelListItemResponse } from '@/shared/api/generated';

export type ChannelDetailHeaderData = Pick<
  ChannelListItemResponse,
  'id' | 'name' | 'iconUrl' | 'description'
>;
