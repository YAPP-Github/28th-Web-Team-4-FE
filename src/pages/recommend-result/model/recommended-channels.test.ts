import { describe, expect, it } from 'vitest';

import { recommendedChannels } from './recommended-channels';

describe('recommendedChannels', () => {
  it('provides eight unique recommendation fixtures', () => {
    const channelIds = recommendedChannels.map((channel) => channel.id);

    expect(recommendedChannels).toHaveLength(8);
    expect(new Set(channelIds).size).toBe(8);
  });
});
