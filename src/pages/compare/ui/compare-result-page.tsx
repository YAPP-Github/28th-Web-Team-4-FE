import type { JSX } from 'react';

import { CompareResultSubHeader } from './compare-result-sub-header';

const MOCK_COMPARE_RESULT_CHANNELS = [
  { id: 'naver', name: '네이버 검색 광고' },
  { id: 'kakao', name: '카카오 키워드 광고' },
  { id: 'meta', name: '메타 피드 광고' },
] as const;

export function CompareResultPage(): JSX.Element {
  return (
    <>
      <CompareResultSubHeader />
      <main data-testid="compare-result-placeholder">
        <ul>
          {MOCK_COMPARE_RESULT_CHANNELS.map((channel) => (
            <li key={channel.id}>{channel.name}</li>
          ))}
        </ul>
      </main>
    </>
  );
}
