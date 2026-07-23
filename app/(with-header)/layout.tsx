import type { ReactNode } from 'react';

import { PageHeader } from '@/features/navigation/page-header';

export default function WithHeaderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageHeader />
      {children}
    </>
  );
}
