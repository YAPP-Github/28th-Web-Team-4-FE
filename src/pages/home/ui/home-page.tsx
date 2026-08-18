import { GoogleLinkSuccessToast } from './google-link-success-toast';
import { Footer } from './footer';
import { HomeChannelPreview } from './home-channel-preview';
import { HomeFeatureSummary } from './home-feature-summary';
import { HomeFinalCta } from './home-final-cta';
import { HomeHero } from './home-hero';
import { HomeProductFlow } from './home-product-flow';

export function HomePage() {
  return (
    <div className="bg-surface-lowest flex flex-1 flex-col font-sans">
      <GoogleLinkSuccessToast />
      <main className="flex flex-col">
        <HomeHero />
        <HomeProductFlow />
        <HomeChannelPreview />
        <HomeFeatureSummary />
        <HomeFinalCta />
      </main>
      <Footer />
    </div>
  );
}
