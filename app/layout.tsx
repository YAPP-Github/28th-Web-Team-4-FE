import MSWBootstrap from '@/app/providers/msw-bootstrap';
import { AppProviders } from '@/app/providers/app-providers';
import { pretendard } from '@/shared/fonts';

import '@/app/styles/globals.css';

export { metadata } from '@/app/config/metadata';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <div className="root flex min-h-full flex-1 flex-col">
          <MSWBootstrap>
            <AppProviders>{children}</AppProviders>
          </MSWBootstrap>
        </div>
      </body>
    </html>
  );
}
