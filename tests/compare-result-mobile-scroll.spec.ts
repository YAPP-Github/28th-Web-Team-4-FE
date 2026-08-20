import { expect, test } from '@playwright/test';

const APP_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

const CHANNELS = [
  {
    channelId: 'channel-naver',
    channelName: '네이버 검색 광고',
    cpcWon: 320,
    cpmWon: 4_800,
  },
  {
    channelId: 'channel-kakao',
    channelName: '카카오 키워드 광고',
    cpcWon: 410,
    cpmWon: 5_200,
  },
  {
    channelId: 'channel-meta',
    channelName: '메타 피드 광고',
    cpcWon: 530,
    cpmWon: 6_100,
  },
].map((channel, index) => ({
  ...channel,
  previewImageUrl: null,
  audienceSummary: '20~40대 직장인과 육아 중인 고객, 관련 상품을 반복 구매하는 사용자',
  adFormats: ['피드', '배너', '영상', '카러셀'],
  targetingMethods: ['관심사', '행동', '지역', '유사 타겟'],
  minBudgetWon: 200_000 + index * 100_000,
  advantages: ['높은 도달률', '세밀한 타겟 설정'],
  tags: ['인지도', '전환'],
  matchRate: 90 - index * 5,
  estImpressions: { min: 10_000, max: 20_000 },
  estClicks: { min: 100, max: 200 },
}));

test.use({
  serviceWorkers: 'block',
  viewport: { width: 390, height: 844 },
});

test('모바일에서 결과 본문을 끝까지 스크롤해도 헤더와 결과 제목을 계속 보여준다', async ({
  page,
}) => {
  await page.route(/\/api\/v1\/channel-comparisons(?:\?|$)/, async (route) => {
    if (route.request().method() !== 'GET') {
      await route.continue();
      return;
    }

    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { items: CHANNELS },
        error: null,
        code: null,
      }),
    });
  });

  await page.goto(`${APP_URL}/compare/result?channels=channel-naver,channel-kakao,channel-meta`);

  const siteHome = page.getByRole('link', { name: 'chaesozip' });
  const resultTitle = page.getByRole('heading', {
    name: '선택한 채널별 특징과 성과를 비교한 결과예요',
  });
  const insightsTitle = page.getByRole('heading', { name: '채널별 인사이트' });

  await expect(resultTitle).toBeInViewport();

  await page.mouse.move(195, 700);
  await page.mouse.wheel(0, 10_000);

  await expect(insightsTitle).toBeInViewport();

  await page.mouse.wheel(0, 2_000);

  await expect(siteHome).toBeInViewport();
  await expect(resultTitle).toBeInViewport();
});
