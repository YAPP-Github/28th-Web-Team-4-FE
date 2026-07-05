'use client';

import { sendGAEvent } from '@next/third-parties/google';
import Image from 'next/image';
import posthog from 'posthog-js';

export function HomeCTALinks() {
  const handleDeployNowClick = () => {
    posthog.capture('deploy_now_clicked');
    sendGAEvent('event', 'deploy_now_clicked');
  };

  const handleDocumentationClick = () => {
    posthog.capture('documentation_clicked');
    sendGAEvent('event', 'documentation_clicked');
  };

  return (
    <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
      <a
        className="bg-foreground text-background flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 transition-colors hover:bg-[#383838] md:w-[158px] dark:hover:bg-[#ccc]"
        href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDeployNowClick}
      >
        <Image
          className="dark:invert"
          src="/vercel.svg"
          alt="Vercel logomark"
          width={16}
          height={16}
        />
        Deploy Now
      </a>
      <a
        className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] md:w-[158px] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleDocumentationClick}
      >
        Documentation
      </a>
    </div>
  );
}
