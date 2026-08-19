import { createSerializer, parseAsArrayOf, parseAsString } from 'nuqs/server';

export const MAX_COMPARISON_CHANNELS = 3;
export const MIN_COMPARISON_CHANNELS = 2;

type ChannelComparisonHrefOptions = {
  onboardingId?: string;
};

const channelComparisonSearchParams = {
  channels: parseAsArrayOf(parseAsString).withDefault([]),
  onboardingId: parseAsString,
};

const serializeChannelComparisonSearchParams = createSerializer(channelComparisonSearchParams);

export function normalizeComparisonChannelIds(channelIds: readonly string[]): string[] {
  return [...new Set(channelIds.filter((channelId) => channelId.length > 0))].slice(
    0,
    MAX_COMPARISON_CHANNELS,
  );
}

export function isComparisonSelectionComplete(channelIds: readonly string[]): boolean {
  return normalizeComparisonChannelIds(channelIds).length === MAX_COMPARISON_CHANNELS;
}

export function isComparisonResultQueryValid(channelIds: readonly string[]): boolean {
  const channelCount = normalizeComparisonChannelIds(channelIds).length;

  return channelCount >= MIN_COMPARISON_CHANNELS && channelCount <= MAX_COMPARISON_CHANNELS;
}

export function createChannelComparisonHref(
  channelIds: readonly string[],
  options: ChannelComparisonHrefOptions = {},
): string {
  const normalizedChannelIds = normalizeComparisonChannelIds(channelIds);

  return serializeChannelComparisonSearchParams('/compare/result', {
    channels: normalizedChannelIds.length > 0 ? normalizedChannelIds : null,
    onboardingId: options.onboardingId ?? null,
  });
}
