'use client';

import { useAuthSession } from '@/features/auth/session';
import { GoogleLinkSuccessToast } from './google-link-success-toast';
import { Footer } from './footer';
import { HomeFaq } from './home-faq';
import { HomeFinalCta } from './home-final-cta';
import { HomeServiceFinder } from './home-service-finder';

export function HomePage() {
  const { isAuthenticated } = useAuthSession();

  if (!isAuthenticated) {
    return <div className="bg-surface-lowest min-h-screen flex-1" />;
  }

  return (
    <div className="bg-surface-lowest flex flex-1 flex-col font-sans">
      <GoogleLinkSuccessToast />
      <main className="flex flex-col">
        <HomeServiceFinder />
        <HomeFaq />
        <HomeFinalCta />
      </main>
      <Footer />
    </div>
  );
}
