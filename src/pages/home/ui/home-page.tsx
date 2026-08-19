'use client';

import { useEffect } from 'react';

import { GoogleLinkSuccessToast } from './google-link-success-toast';
import { Footer } from './footer';
import { HomeChannelBanner } from './home-channel-banner';
import { HomeFaq } from './home-faq';
import { HomeFinalCta } from './home-final-cta';
import { HomeFolderFeatures } from './home-folder-features';
import { HomeHero } from './home-hero';
import { HomeQuestion } from './home-question';

export function HomePage() {
  // 뒤로가기(BFCache 등)로 진입하거나 새로고침/재진입 시 스크롤 위치가 애매하게 남아
  // 인트로와 스크롤 리빌 영역이 겹치지 않도록 스크롤을 맨 처음(0, 0)으로 초기화한다.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const resetScroll = () => {
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    };

    resetScroll();

    const handlePageShow = () => {
      resetScroll();
    };

    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);

  return (
    <div className="bg-surface-lowest flex flex-1 flex-col font-sans">
      <GoogleLinkSuccessToast />
      <main className="flex flex-col">
        <HomeHero />
        <HomeQuestion />
        <HomeChannelBanner />
        <HomeFolderFeatures />
        <HomeFaq />
        <HomeFinalCta />
      </main>
      <Footer />
    </div>
  );
}
