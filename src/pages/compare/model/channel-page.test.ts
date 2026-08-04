import {
  COMPARE_CHANNEL_PAGE_COUNT,
  COMPARE_CHANNEL_PAGE_SIZE,
  compareChannelPages,
  getChannelCategoryLabel,
  toOnboardingCategoryId,
} from './channel-page';

describe('compare channel page fixture', () => {
  it('Swagger 성공 data 형태로 12개씩 5페이지를 제공한다', () => {
    expect(compareChannelPages).toHaveLength(COMPARE_CHANNEL_PAGE_COUNT);
    expect(compareChannelPages.flatMap((page) => page.content)).toHaveLength(60);
    expect(
      compareChannelPages.every((page) => page.content.length === COMPARE_CHANNEL_PAGE_SIZE),
    ).toBe(true);
    expect(compareChannelPages.map((page) => page.number)).toEqual([0, 1, 2, 3, 4]);
    expect(compareChannelPages.map((page) => page.first)).toEqual([
      true,
      false,
      false,
      false,
      false,
    ]);
    expect(compareChannelPages.map((page) => page.last)).toEqual([
      false,
      false,
      false,
      false,
      true,
    ]);
    expect(
      new Set(compareChannelPages.flatMap((page) => page.content.map((channel) => channel.id))),
    ).toHaveLength(60);

    expect(compareChannelPages[0]).toMatchObject({
      size: 12,
      totalElements: 60,
      totalPages: 5,
    });
  });

  it('채널 item은 example 필드와 nullable logoUrl을 사용한다', () => {
    const channel = compareChannelPages[0]?.content[0];

    expect(channel).toBeDefined();
    expect(channel).toMatchObject({
      id: 'naver-search-ad',
      name: '네이버 검색 광고',
      logoUrl: null,
      description: expect.any(String),
      primaryCategory: 'EDUCATION',
    });
    expect(Object.keys(channel ?? {}).sort()).toEqual([
      'description',
      'id',
      'logoUrl',
      'name',
      'primaryCategory',
    ]);
  });

  it('API의 OTHERS를 온보딩의 OTHER와 기타 label로 매핑한다', () => {
    expect(toOnboardingCategoryId('OTHERS')).toBe('OTHER');
    expect(getChannelCategoryLabel('OTHERS')).toBe('기타');
    expect(getChannelCategoryLabel('SHOPPING_COMMERCE')).toBe('쇼핑·커머스');
  });
});
