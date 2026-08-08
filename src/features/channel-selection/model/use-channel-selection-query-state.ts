'use client';

import { debounce, parseAsArrayOf, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

const SEARCH_URL_UPDATE_LIMIT = debounce(300);

const channelSelectionQueryParsers = {
  q: parseAsString.withDefault(''),
  category: parseAsArrayOf(parseAsString).withDefault([]),
  page: parseAsInteger.withDefault(1),
};

export function useChannelSelectionQueryState() {
  const [{ q, category, page }, setQuery] = useQueryStates(channelSelectionQueryParsers, {
    history: 'replace',
  });

  const setSearchQuery = (nextQuery: string) => {
    void setQuery(
      { q: nextQuery, page: null },
      {
        history: 'replace',
        limitUrlUpdates: SEARCH_URL_UPDATE_LIMIT,
      },
    );
  };

  const setCategories = (nextCategories: readonly string[]) => {
    void setQuery(
      { category: nextCategories.length > 0 ? [...nextCategories] : null, page: null },
      {
        history: 'push',
      },
    );
  };

  const setPage = (nextPage: number) => {
    void setQuery(
      { page: Math.max(1, Math.trunc(nextPage)) },
      {
        history: 'push',
      },
    );
  };

  const resetFilters = () => {
    void setQuery(
      { q: null, category: null, page: null },
      {
        history: 'push',
      },
    );
  };

  return {
    q,
    category,
    page: Math.max(1, page),
    setSearchQuery,
    setCategories,
    setPage,
    resetFilters,
  };
}
