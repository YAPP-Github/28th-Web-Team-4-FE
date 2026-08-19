import { metadata } from './metadata';

describe('metadata', () => {
  it('브랜드명과 검색 철자 변형을 루트 메타데이터로 제공한다', () => {
    expect(metadata).toMatchObject({
      applicationName: '채소ZIP',
      title: '채소ZIP',
      keywords: [
        '채소ZIP',
        '채소집',
        'chaesozip',
        'ChaesoZIP',
        'Chaeso Zip',
        'chaeso-zip',
        '광고 채널 추천',
        '광고 채널 비교',
        '광고 예산 시뮬레이터',
      ],
    });
  });
});
