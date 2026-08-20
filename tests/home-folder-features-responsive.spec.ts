import { expect, test, type Locator, type Page } from '@playwright/test';

const APP_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';
const FOLDER_ASPECT_RATIO = 1200 / 762;

const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1023, height: 768 },
  { width: 1024, height: 768 },
  { width: 1189, height: 714 },
  { width: 1207, height: 750 },
  { width: 1440, height: 900 },
] as const;

const FEATURE_STATES = [
  {
    progress: 0.08,
    category: 'Recommendation',
    title: '내게 맞는 광고 채널을 추천받아요',
    imageAlt: '채소집 채널 추천 기능 소개',
  },
  {
    progress: 0.28,
    category: 'Comparison',
    title: '여러 광고 채널을 한눈에 비교해요',
    imageAlt: '채소집 채널 비교 기능 소개',
  },
  {
    progress: 0.48,
    category: 'Simulator',
    title: '예산에 따른 광고 성과를 미리 시뮬레이션해요',
    imageAlt: '채소집 예산 시뮬레이션 기능 소개',
  },
] as const;

test.use({ serviceWorkers: 'block' });

async function mockGuestSession(page: Page): Promise<void> {
  await page.route(/\/api\/auth\/session(?:\?|$)/, async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({ authenticated: false }),
    });
  });
}

async function scrollToFeatureProgress(section: Locator, progress: number): Promise<void> {
  await section.evaluate((element, targetProgress) => {
    const sectionTop = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: sectionTop + element.clientHeight * targetProgress,
      left: 0,
      behavior: 'instant',
    });
  }, progress);
}

async function getBoundingBox(locator: Locator) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();
  if (!box) {
    throw new Error('Expected the element to have a bounding box.');
  }

  return box;
}

for (const viewport of VIEWPORTS) {
  test(`${viewport.width}x${viewport.height}에서 기능 카드와 텍스트가 같은 비율 영역에 머문다`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await mockGuestSession(page);
    await page.goto(APP_URL);

    const section = page.locator('section[aria-label="채소집 기능 및 서비스 과정 소개"]');
    const sectionHeading = page.getByRole('heading', {
      name: '광고 고민을 덜어주는 채소집의 핵심 기능을 만나보세요',
    });
    const pageHeader = page.getByRole('banner');
    const recommendationCard = page.getByAltText('채소집 채널 추천 기능 소개').locator('..');
    const stage = recommendationCard.locator('..');

    await expect(section).toBeAttached();
    await expect(sectionHeading).toBeAttached();
    await page.waitForTimeout(1_200);

    for (const state of FEATURE_STATES) {
      await scrollToFeatureProgress(section, state.progress);
      await page.waitForTimeout(700);

      const card = page.getByAltText(state.imageAlt).locator('..');
      const category = page.getByText(state.category, { exact: true }).filter({ visible: true });
      const title = page.getByRole('heading', { name: state.title }).filter({ visible: true });

      await expect(category).toBeVisible();
      await expect(title).toBeVisible();
      await expect(sectionHeading).toBeInViewport();
      await expect(card).toBeInViewport({ ratio: 0.99 });

      const [headerBox, stageBox, cardBox, categoryBox, titleBox, headingBox] = await Promise.all([
        getBoundingBox(pageHeader),
        getBoundingBox(stage),
        getBoundingBox(card),
        getBoundingBox(category),
        getBoundingBox(title),
        getBoundingBox(sectionHeading),
      ]);

      expect(Math.abs(stageBox.width / stageBox.height - FOLDER_ASPECT_RATIO)).toBeLessThan(0.01);
      expect(Math.abs(cardBox.width / cardBox.height - FOLDER_ASPECT_RATIO)).toBeLessThan(0.01);
      expect(headingBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 0.5);
      expect(cardBox.y).toBeGreaterThanOrEqual(headerBox.y + headerBox.height - 0.5);
      expect(cardBox.y + cardBox.height).toBeLessThanOrEqual(viewport.height + 0.5);
      expect(headingBox.x).toBeGreaterThanOrEqual(0);
      expect(headingBox.x + headingBox.width).toBeLessThanOrEqual(viewport.width);
      expect(categoryBox.x).toBeGreaterThanOrEqual(0);
      expect(categoryBox.x + categoryBox.width).toBeLessThanOrEqual(viewport.width);
      expect(titleBox.x).toBeGreaterThanOrEqual(0);
      expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(viewport.width);

      if (viewport.width < 640) {
        const mobileCopy = page.getByTestId('mobile-feature-copy');
        const mobileCopyBox = await getBoundingBox(mobileCopy);

        expect(categoryBox.y + categoryBox.height).toBeLessThanOrEqual(stageBox.y + 0.5);
        expect(titleBox.y + titleBox.height).toBeLessThanOrEqual(stageBox.y + 0.5);
        expect(mobileCopyBox.width).toBeLessThanOrEqual(stageBox.width + 0.5);

        if (viewport.width === 390) {
          const mobileButton = mobileCopy.getByRole('button');
          const mobileButtonBox = await getBoundingBox(mobileButton);

          expect(titleBox.height).toBeLessThan(46);
          expect(mobileButtonBox.height).toBeLessThan(32);
        }
      } else {
        expect(categoryBox.x).toBeGreaterThanOrEqual(cardBox.x - 0.5);
        expect(categoryBox.x + categoryBox.width).toBeLessThanOrEqual(
          cardBox.x + cardBox.width + 0.5,
        );
        expect(titleBox.x).toBeGreaterThanOrEqual(cardBox.x - 0.5);
        expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width + 0.5);
        expect(titleBox.x + titleBox.width).toBeLessThanOrEqual(cardBox.x + cardBox.width * 0.34);
      }

      const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(documentWidth).toBeLessThanOrEqual(viewport.width);
    }
  });
}
