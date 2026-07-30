import type { JSX } from 'react';

import type { RecommendedChannel } from '@/pages/recommend-result/model/recommended-channels';

import { RecommendedChannelCard } from './recommended-channel-card';

type RecommendedChannelGridProps = {
  channels: readonly RecommendedChannel[];
};

export function RecommendedChannelGrid({ channels }: RecommendedChannelGridProps): JSX.Element {
  return (
    <ul className="gap-024 grid w-full max-w-[1200px] grid-cols-1 justify-items-center md:grid-cols-2 xl:grid-cols-4">
      {channels.map((channel) => (
        <li key={channel.id} className="flex w-full justify-center">
          <RecommendedChannelCard channel={channel} />
        </li>
      ))}
    </ul>
  );
}
