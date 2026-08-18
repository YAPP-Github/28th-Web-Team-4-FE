import type { JSX, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '@/shared/ui/cn';
import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
};

function PaginationButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}): JSX.Element {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn([
        'size-024 inline-flex cursor-pointer items-center justify-center rounded-[var(--radius-s)] text-icon-default transition-colors',
        'hover:not-disabled:bg-surface-low active:not-disabled:scale-[0.97]',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
        'disabled:cursor-not-allowed disabled:opacity-40',
      ])}
    >
      {children}
    </button>
  );
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  ariaLabel = '페이지네이션',
}: PaginationProps): JSX.Element {
  const isFirstPage = currentPage <= 1;
  const isLastPage = currentPage >= totalPages;
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Box as="nav" aria-label={ariaLabel} className="gap-004 flex items-center">
      <PaginationButton label="첫 페이지" disabled={isFirstPage} onClick={() => onPageChange(1)}>
        <ChevronsLeft aria-hidden className="size-020" strokeWidth={1.6} />
      </PaginationButton>
      <PaginationButton
        label="이전 페이지"
        disabled={isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft aria-hidden className="size-020" strokeWidth={1.6} />
      </PaginationButton>
      <Box className="gap-002 flex items-center">
        {pageNumbers.map((pageNumber) => {
          const isCurrentPage = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              type="button"
              aria-label={`페이지 ${pageNumber}`}
              aria-current={isCurrentPage ? 'page' : undefined}
              onClick={() => onPageChange(pageNumber)}
              className={cn([
                'size-024 relative flex cursor-pointer items-center justify-center rounded-[var(--radius-s)] transition-colors',
                'hover:bg-surface-low active:scale-[0.97]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sys-primary-default',
              ])}
            >
              <Text
                variant="subtitle-xxs"
                className={cn(
                  'text-text-low',
                  isCurrentPage && 'font-semibold leading-020 text-text-highest',
                )}
              >
                {pageNumber}
              </Text>
            </button>
          );
        })}
      </Box>
      <PaginationButton
        label="다음 페이지"
        disabled={isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight aria-hidden className="size-020" strokeWidth={1.6} />
      </PaginationButton>
      <PaginationButton
        label="마지막 페이지"
        disabled={isLastPage}
        onClick={() => onPageChange(totalPages)}
      >
        <ChevronsRight aria-hidden className="size-020" strokeWidth={1.6} />
      </PaginationButton>
    </Box>
  );
}
