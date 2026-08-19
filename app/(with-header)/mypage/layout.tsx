import type { ReactNode } from 'react';

export { nonIndexableMetadata as metadata } from '@/app/config/search-metadata';

export default function MyPageLayout({ children }: { children: ReactNode }) {
  return children;
}
