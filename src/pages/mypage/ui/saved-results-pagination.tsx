import type { JSX } from 'react';

import { Center } from '@/shared/ui/layout/center';
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
    <Center className="py-008 w-full">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </Center>
  );
}
