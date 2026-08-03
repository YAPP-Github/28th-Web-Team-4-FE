import type { JSX } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { Box } from '@/shared/ui/layout/box';
import { Text } from '@/shared/ui/text';

const PAGE_NUMBERS = [1, 2, 3, 4, 5] as const;

export function ComparePagination(): JSX.Element {
  return (
    <Box aria-label="페이지네이션" className="gap-004 flex items-center">
      <ChevronsLeft aria-hidden className="size-020 text-icon-default" strokeWidth={1.6} />
      <ChevronLeft aria-hidden className="size-020 text-icon-default" strokeWidth={1.6} />
      <Box className="gap-002 flex items-center">
        {PAGE_NUMBERS.map((pageNumber) => (
          <Box
            key={pageNumber}
            as="span"
            aria-current={pageNumber === 1 ? 'page' : undefined}
            className="size-024 relative flex items-center justify-center"
          >
            <Text
              variant={pageNumber === 1 ? 'subtitle-sm' : 'subtitle-xxs'}
              className={pageNumber === 1 ? 'text-text-highest' : 'text-text-low'}
            >
              {pageNumber}
            </Text>
          </Box>
        ))}
      </Box>
      <ChevronRight aria-hidden className="size-020 text-icon-default" strokeWidth={1.6} />
      <ChevronsRight aria-hidden className="size-020 text-icon-default" strokeWidth={1.6} />
    </Box>
  );
}
