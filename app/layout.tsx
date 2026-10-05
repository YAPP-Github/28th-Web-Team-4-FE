import MSWBootstrap from '@/app/providers/msw-bootstrap';
import { AppProviders } from '@/app/providers/app-providers';
import { pretendard, wantedSans } from '@/shared/fonts';

import '@/app/styles/globals.css';
import { Stack } from '@/shared/ui/layout/stack';

export { metadata } from '@/app/config/metadata';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${wantedSans.variable} h-full antialiased`}>
      <Stack as="body" className="min-h-full">
        <Stack className="root min-h-full flex-1">
          <MSWBootstrap>
            <AppProviders>{children}</AppProviders>
          </MSWBootstrap>
        </Stack>
      </Stack>
    </html>
  );
}
