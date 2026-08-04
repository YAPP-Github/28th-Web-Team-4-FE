'use client';

import { debounce, parseAsInteger, parseAsString, useQueryStates } from 'nuqs';

const SEARCH_URL_UPDATE_LIMIT = debounce(300);

const compareQueryParsers = {
  q: parseAsString.withDefault(''),
  category: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
};

export function useCompareQueryState() {
  const [{ q, category, page }, setQuery] = useQueryStates(compareQueryParsers, {
    history: 'replace',
  });

  const setSearchQuery = (nextQuery: string) => {
    void setQuery(
      { q: nextQuery, page: 1 },
      {
        history: 'replace',
        limitUrlUpdates: SEARCH_URL_UPDATE_LIMIT,
      },
    );
  };

  const setCategory = (nextCategory: string | null) => {
    void setQuery(
      { category: nextCategory, page: 1 },
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

  return {
    q,
    category,
    page: Math.max(1, page),
    setSearchQuery,
    setCategory,
    setPage,
  };
}
