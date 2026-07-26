import {
  assertValidPerformanceFile,
  formatFileSize,
  isAcceptedPerformanceFileExtension,
  MAX_PERFORMANCE_FILE_SIZE,
  validatePerformanceFileList,
} from './file-upload';

function createFile(name: string, size = 1024): File {
  return new File(['a'.repeat(size)], name);
}

describe('file upload validation', () => {
  it('csv와 xlsx 확장자를 허용한다', () => {
    expect(isAcceptedPerformanceFileExtension('report.csv')).toBe(true);
    expect(isAcceptedPerformanceFileExtension('report.XLSX')).toBe(true);
    expect(isAcceptedPerformanceFileExtension('report.pdf')).toBe(false);
  });

  it('유효한 파일 메타데이터를 반환한다', () => {
    const result = validatePerformanceFileList([createFile('report.csv')], []);

    expect(result.errorMessage).toBeUndefined();
    expect(result.acceptedFileList).toMatchObject([{ name: 'report.csv', size: 1024 }]);
  });

  it('지원하지 않는 확장자를 제외한다', () => {
    const result = validatePerformanceFileList([createFile('report.pdf')], []);

    expect(result.acceptedFileList).toEqual([]);
    expect(result.errorMessage).toBe('.csv 또는 .xlsx 파일만 업로드할 수 있어요.');
  });

  it('단일 파일 검증 실패 시 예외를 던진다', () => {
    expect(() => assertValidPerformanceFile(createFile('report.pdf'))).toThrow(
      '.csv 또는 .xlsx 파일만 업로드할 수 있어요.',
    );
  });

  it('10MB를 초과하는 파일을 제외한다', () => {
    const result = validatePerformanceFileList(
      [createFile('heavy.csv', MAX_PERFORMANCE_FILE_SIZE + 1)],
      [],
    );

    expect(result.acceptedFileList).toEqual([]);
    expect(result.errorMessage).toBe('파일당 10MB 이하만 업로드할 수 있어요.');
  });

  it('최대 5개까지만 받고 초과분은 제외한다', () => {
    const result = validatePerformanceFileList(
      Array.from({ length: 6 }, (_, index) => createFile(`report-${index}.csv`)),
      [],
    );

    expect(result.acceptedFileList).toHaveLength(5);
    expect(result.errorMessage).toBe('파일은 최대 5개까지 업로드할 수 있어요.');
  });

  it('기존 파일 개수를 포함해 최대 5개를 계산한다', () => {
    const result = validatePerformanceFileList(
      [createFile('new-1.csv'), createFile('new-2.csv')],
      [
        { id: '1', name: 'old-1.csv', size: 10 },
        { id: '2', name: 'old-2.csv', size: 10 },
        { id: '3', name: 'old-3.csv', size: 10 },
        { id: '4', name: 'old-4.csv', size: 10 },
      ],
    );

    expect(result.acceptedFileList).toHaveLength(1);
    expect(result.acceptedFileList[0]?.name).toBe('new-1.csv');
    expect(result.errorMessage).toBe('파일은 최대 5개까지 업로드할 수 있어요.');
  });

  it('중복 파일도 허용한다', () => {
    const firstFile = createFile('same.csv');
    const secondFile = createFile('same.csv');
    const result = validatePerformanceFileList([firstFile, secondFile], []);

    expect(result.acceptedFileList).toHaveLength(2);
    expect(result.acceptedFileList[0]?.id).not.toBe(result.acceptedFileList[1]?.id);
  });

  it('파일 크기를 표시용 문자열로 포맷한다', () => {
    expect(formatFileSize(900)).toBe('900B');
    expect(formatFileSize(2048)).toBe('2KB');
    expect(formatFileSize(1024 * 1024)).toBe('1.0MB');
  });
});
