'use client';

import { useState } from 'react';

import { useDebouncedValue } from '@/shared/lib/use-debounced-value';

const SEARCH_DEBOUNCE_MS = 300;

/** 비교 결과 채널 picker의 검색어와 debounce 상태를 관리한다. */
export function useCompareResultChannelPickerSearchKeyword() {
  const [searchKeyword, setSearchKeyword] = useState('');
  const normalizedSearchKeyword = searchKeyword.trim();
  const debouncedSearchKeyword = useDebouncedValue(normalizedSearchKeyword, SEARCH_DEBOUNCE_MS);
  const isDebouncing =
    normalizedSearchKeyword.length > 0 && normalizedSearchKeyword !== debouncedSearchKeyword;
  const querySearchKeyword =
    normalizedSearchKeyword === debouncedSearchKeyword ? debouncedSearchKeyword : '';

  const clearSearchKeyword = (): void => {
    setSearchKeyword('');
  };

  return {
    clearSearchKeyword,
    isDebouncing,
    querySearchKeyword,
    searchKeyword,
    setSearchKeyword,
  };
}

/** 비교 결과 채널 picker의 열림 상태를 관리한다. */
export function useCompareResultChannelPickerOpen(onClose: () => void) {
  const [open, setOpen] = useState(false);

  const close = (): void => {
    setOpen(false);
    onClose();
  };

  const handleOpenChange = (nextOpen: boolean): void => {
    if (nextOpen) {
      setOpen(true);
      return;
    }

    close();
  };

  return {
    close,
    handleOpenChange,
    open,
  };
}
