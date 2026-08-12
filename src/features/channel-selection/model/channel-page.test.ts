import {
  CHANNEL_CATEGORY_OPTION_LIST,
  getChannelCategoryLabel,
  normalizeChannelCategories,
} from './channel-page';

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
});
