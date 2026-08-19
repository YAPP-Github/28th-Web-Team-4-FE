'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';

import {
  isComparisonResultQueryValid,
  normalizeComparisonChannelIds,
} from './channel-comparison-query';

const channelIdsParser = parseAsArrayOf(parseAsString).withDefault([]);

function areChannelIdsEqual(left: readonly string[], right: readonly string[]): boolean {
  return (
    left.length === right.length && left.every((channelId, index) => channelId === right[index])
  );
}

export function useChannelComparisonResultQueryState() {
  const router = useRouter();
  const [rawChannelIds, setRawChannelIds] = useQueryState('channels', channelIdsParser);
  const [onboardingId] = useQueryState('onboardingId', parseAsString);
  const channelIds = useMemo(() => normalizeComparisonChannelIds(rawChannelIds), [rawChannelIds]);
  const isValid = isComparisonResultQueryValid(channelIds);

  const setChannelIds = (nextChannelIds: readonly string[]) => {
    const normalizedChannelIds = normalizeComparisonChannelIds(nextChannelIds);

    return setRawChannelIds(normalizedChannelIds.length > 0 ? normalizedChannelIds : null, {
      history: 'replace',
    });
  };

  useEffect(() => {
    if (!isValid) {
      router.replace('/compare');
      return;
    }

    if (!areChannelIdsEqual(rawChannelIds, channelIds)) {
      void setRawChannelIds(channelIds, { history: 'replace' });
    }
  }, [channelIds, isValid, rawChannelIds, router, setRawChannelIds]);

  return {
    channelIds,
    onboardingId,
    isValid,
    setChannelIds,
  };
}
