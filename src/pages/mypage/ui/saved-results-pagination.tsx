import type { JSX } from 'react';

import { Box } from '@/shared/ui/layout/box';
import { Pagination } from '@/shared/ui/pagination';

type SavedResultsPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function SavedResultsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SavedResultsPaginationProps): JSX.Element {
  return (
    <Box className="py-008 flex w-full items-center justify-center">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </Box>
  );
}
