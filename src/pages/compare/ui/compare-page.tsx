import { type JSX, Suspense } from 'react';

import { CompareChannelSelection } from './compare-channel-selection';

export function ComparePage(): JSX.Element {
  return (
    <main className="bg-surface-background-default flex min-h-0 flex-1 flex-col overflow-hidden">
      <Suspense>
        <CompareChannelSelection />
      </Suspense>
    </main>
  );
}
