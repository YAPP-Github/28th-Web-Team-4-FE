'use client';

/**
 * 광고 성과 직접 입력에서 채널 검색 API를 TanStack Query로 조회한다.
 */

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getChannelsOptions } from '@/shared/api/generated/@tanstack/react-query.gen';
import type { ChannelListItemResponse, GetChannelsResponse } from '@/shared/api/generated';

/**
 * 채널 목록 API 응답에서 검색 UI가 소비하는 채널 배열만 추출한다.
 *
 * @param data 채널 목록 API 응답
 * @returns 검색 결과 채널 목록
 */
function selectChannelList(data: GetChannelsResponse): ChannelListItemResponse[] {
  return data.data?.content ?? [];
}

/**
 * 광고 채널명을 검색한다.
 *
 * @param searchKeyword 사용자가 입력한 검색어
 * @param options 검색 실행 여부 등 query 제어 옵션
 * @returns 채널 검색 query 결과
 */
export function usePerformanceChannelSearch(
  searchKeyword: string,
  options: { enabled?: boolean } = {},
) {
  const normalizedKeyword = searchKeyword.trim();
  const isSearchEnabled = (options.enabled ?? true) && normalizedKeyword.length > 0;
  const queryOptions = getChannelsOptions({
    query: {
      name: normalizedKeyword || undefined,
    },
  });

  return useQuery({
    ...queryOptions,
    enabled: isSearchEnabled,
    placeholderData: keepPreviousData,
    select: selectChannelList,
  });
}
