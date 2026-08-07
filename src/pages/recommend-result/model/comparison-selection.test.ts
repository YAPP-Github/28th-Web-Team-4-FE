import { describe, expect, it } from 'vitest';

import { MAX_COMPARISON_CHANNELS, toggleComparisonChannel } from './comparison-selection';

describe('toggleComparisonChannel', () => {
  it('adds a channel while preserving selection order', () => {
    expect(toggleComparisonChannel(['naver-search-ad'], 'youtube-ad')).toEqual({
      ids: ['naver-search-ad', 'youtube-ad'],
      result: 'added',
    });
  });

  it('removes an already selected channel', () => {
    expect(toggleComparisonChannel(['naver-search-ad', 'youtube-ad'], 'naver-search-ad')).toEqual({
      ids: ['youtube-ad'],
      result: 'removed',
    });
  });

  it('does not add a fourth channel', () => {
    const selectedIds = ['naver-search-ad', 'youtube-ad', 'kakao-business'];

    expect(selectedIds).toHaveLength(MAX_COMPARISON_CHANNELS);
    expect(toggleComparisonChannel(selectedIds, 'meta-ad')).toEqual({
      ids: selectedIds,
      result: 'max-reached',
    });
  });
});
