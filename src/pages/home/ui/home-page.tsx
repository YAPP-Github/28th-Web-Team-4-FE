import { GoogleLinkSuccessToast } from './google-link-success-toast';
import { Footer } from './footer';
import { HomeFaq } from './home-faq';
import { HomeFinalCta } from './home-final-cta';
import { HomeHero } from './home-hero';
import { HomeServiceFinder } from './home-service-finder';

export function HomePage() {
  return (
    <div className="bg-surface-lowest flex flex-1 flex-col font-sans">
      <GoogleLinkSuccessToast />
      <main className="flex flex-col">
        <HomeHero />
        <HomeServiceFinder />
        <HomeFaq />
        <HomeFinalCta />
      </main>
      <Footer />
    </div>
  );
}
