import { entries, keys, values } from '@/shared/lib/object';

describe('object utils', () => {
  const sample = {
    display: 'xl',
    heading: 'md',
    body: 'lg',
  } as const;

  describe('keys', () => {
    it('객체 키 배열을 반환한다', () => {
      expect(keys(sample)).toEqual(['display', 'heading', 'body']);
    });

    it('빈 객체면 빈 배열을 반환한다', () => {
      expect(keys({})).toEqual([]);
    });
  });

  describe('values', () => {
    it('객체 값 배열을 반환한다', () => {
      expect(values(sample)).toEqual(['xl', 'md', 'lg']);
    });

    it('빈 객체면 빈 배열을 반환한다', () => {
      expect(values({})).toEqual([]);
    });
  });

  describe('entries', () => {
    it('키-값 쌍 배열을 반환한다', () => {
      expect(entries(sample)).toEqual([
        ['display', 'xl'],
        ['heading', 'md'],
        ['body', 'lg'],
      ]);
    });

    it('빈 객체면 빈 배열을 반환한다', () => {
      expect(entries({})).toEqual([]);
    });
  });
});
