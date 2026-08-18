import { GoogleLinkSuccessToast } from './google-link-success-toast';
import { Footer } from './footer';
import { HomeChannelBanner } from './home-channel-banner';
import { HomeFinalCta } from './home-final-cta';
import { HomeHero } from './home-hero';
import { HomeQuestion } from './home-question';

export function HomePage() {
  return (
    <div className="bg-surface-lowest flex flex-1 flex-col font-sans">
      <GoogleLinkSuccessToast />
      <main className="flex flex-col">
        <HomeHero />
        <HomeQuestion />
        <HomeChannelBanner />
        <HomeFinalCta />
      </main>
      <Footer />
    </div>
  );
}
