import Image from 'next/image';

import { GoogleLinkSuccessToast } from './google-link-success-toast';

export function HomePage() {
  return (
    <div className="bg-surface-background-default flex flex-1 flex-col items-center justify-center font-sans">
      <GoogleLinkSuccessToast />
      <main className="bg-surface-lower px-016 py-032 shadow-drop-shadow-01 flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-10 sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="typo-heading-xl text-text-high max-w-xs">
            To get started, edit the page.tsx file.
          </h1>
          <p className="typo-body-lg text-text-medium max-w-md">
            Looking for a starting point or more instructions? Head over to{' '}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="text-text-primary font-medium"
            >
              Templates
            </a>{' '}
            or the{' '}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="text-text-primary font-medium"
            >
              Learning
            </a>{' '}
            center.
          </p>
        </div>
      </main>
    </div>
  );
}
