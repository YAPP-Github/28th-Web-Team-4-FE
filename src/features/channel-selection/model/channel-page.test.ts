import {
  CHANNEL_CATEGORY_OPTION_LIST,
  createCategoryChannelPage,
  getChannelCategoryLabel,
  normalizeChannelCategories,
  type ChannelListItem,
} from './channel-page';

function createChannel(
  id: string,
  primaryCategory: ChannelListItem['primaryCategory'],
): ChannelListItem {
  return {
    id,
    name: `채널 ${id}`,
    logoUrl: null,
    description: null,
    primaryCategory,
  };
}

describe('channel selection page model', () => {
  it('API 카테고리 값을 그대로 사용하고 OTHERS를 기타로 표시한다', () => {
    expect(CHANNEL_CATEGORY_OPTION_LIST).toContainEqual({ value: 'OTHERS', label: '기타' });
    expect(getChannelCategoryLabel('OTHERS')).toBe('기타');
    expect(getChannelCategoryLabel('SHOPPING_COMMERCE')).toBe('쇼핑·커머스');
  });

  it('URL 카테고리를 API 옵션 순서로 중복 없이 정규화한다', () => {
    expect(
      normalizeChannelCategories([
        'SHOPPING_COMMERCE',
        'INVALID_CATEGORY',
        'EDUCATION',
        'OTHERS',
        'SHOPPING_COMMERCE',
      ]),
    ).toEqual(['EDUCATION', 'SHOPPING_COMMERCE', 'OTHERS']);
  });

  it('유효한 URL 카테고리가 없으면 빈 배열을 반환한다', () => {
    expect(normalizeChannelCategories(['INVALID_CATEGORY'])).toEqual([]);
  });

  it('OTHERS 카테고리를 변환 없이 필터링한다', () => {
    const othersChannel = createChannel('others', 'OTHERS');
    const page = createCategoryChannelPage(
      [othersChannel, createChannel('game', 'GAME')],
      ['OTHERS'],
      1,
    );

    expect(page.content).toEqual([othersChannel]);
  });

  it('선택한 카테고리의 전체 채널을 12개 단위로 페이지 처리한다', () => {
    const channels = Array.from({ length: 14 }, (_, index) =>
      createChannel(`game-${index}`, 'GAME'),
    ).concat(createChannel('education', 'EDUCATION'));

    const firstPage = createCategoryChannelPage(channels, ['GAME'], 1);
    const secondPage = createCategoryChannelPage(channels, ['GAME'], 2);

    expect(firstPage.content).toHaveLength(12);
    expect(firstPage).toMatchObject({ number: 0, totalElements: 14, totalPages: 2, last: false });
    expect(secondPage.content).toHaveLength(2);
    expect(secondPage).toMatchObject({ number: 1, totalElements: 14, totalPages: 2, last: true });
  });

  it('URL 페이지가 범위를 벗어나면 채널을 표시하지 않는다', () => {
    const page = createCategoryChannelPage([createChannel('game', 'GAME')], ['GAME'], 3);

    expect(page.content).toEqual([]);
    expect(page.number).toBe(2);
    expect(page.totalPages).toBe(1);
  });
});
