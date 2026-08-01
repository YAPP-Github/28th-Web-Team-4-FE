/**
 * 광고 성과 파일의 확장자·크기·개수 검증과 표시용 메타데이터 변환을 담당한다.
 */

import type { UploadedPerformanceFile } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { z } from 'zod';

export const ACCEPTED_PERFORMANCE_FILE_EXTENSION_LIST = ['.csv', '.xlsx'] as const;
export const MAX_PERFORMANCE_FILE_SIZE = 10 * 1024 * 1024;
export const MAX_PERFORMANCE_FILE_COUNT = 5;

const PERFORMANCE_FILE_SCHEMA = z
  .custom<File>((file) => typeof File !== 'undefined' && file instanceof File)
  .refine((file) => isAcceptedPerformanceFileExtension(file.name), {
    message: '.csv 또는 .xlsx 파일만 업로드할 수 있어요.',
  })
  .refine((file) => file.size <= MAX_PERFORMANCE_FILE_SIZE, {
    message: '파일당 10MB 이하만 업로드할 수 있어요.',
  });

export type PerformanceFileValidationResult = {
  acceptedFileList: UploadedPerformanceFile[];
  errorMessage?: string;
};

type PerformanceFileReducer = (
  result: PerformanceFileValidationResult,
  file: File,
) => PerformanceFileValidationResult;

/**
 * 선택/드롭된 파일 목록을 검증하고 업로드 UI에 추가 가능한 파일 메타데이터만 반환한다.
 *
 * @param fileList 사용자가 선택하거나 드롭한 브라우저 File 목록
 * @param currentFileList 이미 업로드 UI에 반영된 파일 메타데이터 목록
 * @returns 추가 가능한 파일 목록과 첫 번째 검증 오류 메시지
 */
export function validatePerformanceFileList(
  fileList: File[],
  currentFileList: UploadedPerformanceFile[],
): PerformanceFileValidationResult {
  return fileList.reduce<PerformanceFileValidationResult>(
    createPerformanceFileReducer(currentFileList),
    { acceptedFileList: [] },
  );
}

/**
 * 단일 파일을 엄격하게 검증해야 하는 흐름에서 사용할 수 있도록 실패 시 예외를 던진다.
 *
 * @param file 검증할 브라우저 File 객체
 * @throws 확장자나 크기 제한을 만족하지 않는 경우 Error를 던진다.
 */
export function assertValidPerformanceFile(file: File): void {
  const parsedFile = PERFORMANCE_FILE_SCHEMA.safeParse(file);

  if (!parsedFile.success) {
    const message = parsedFile.error.issues[0]?.message ?? '업로드할 수 없는 파일이에요.';

    throw new Error(message);
  }
}

/**
 * 파일명 기준으로 성과 업로드에서 허용하는 확장자인지 확인한다.
 *
 * @param fileName 검증할 파일명
 * @returns .csv 또는 .xlsx 확장자 여부
 */
export function isAcceptedPerformanceFileExtension(fileName: string): boolean {
  const normalizedFileName = fileName.toLowerCase();

  return ACCEPTED_PERFORMANCE_FILE_EXTENSION_LIST.some((extension) =>
    normalizedFileName.endsWith(extension),
  );
}

/**
 * 업로드 파일 목록에서 표시할 사람이 읽기 쉬운 파일 크기 문자열을 만든다.
 *
 * @param size 바이트 단위 파일 크기
 * @returns B, KB, MB 단위 표시 문자열
 */
export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size}B`;
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)}KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

/**
 * 현재 파일 목록을 기준으로 파일 검증 reduce callback을 만든다.
 *
 * @param currentFileList 이미 업로드 UI에 반영된 파일 메타데이터 목록
 * @returns 파일 하나를 검증하고 누적 결과를 갱신하는 reducer
 */
function createPerformanceFileReducer(
  currentFileList: UploadedPerformanceFile[],
): PerformanceFileReducer {
  return (result, file) => {
    if (currentFileList.length + result.acceptedFileList.length >= MAX_PERFORMANCE_FILE_COUNT) {
      return {
        ...result,
        errorMessage: result.errorMessage ?? '파일은 최대 5개까지 업로드할 수 있어요.',
      };
    }

    const parsedFile = PERFORMANCE_FILE_SCHEMA.safeParse(file);

    if (!parsedFile.success) {
      return {
        ...result,
        errorMessage: result.errorMessage ?? parsedFile.error.issues[0]?.message,
      };
    }

    return {
      ...result,
      acceptedFileList: [
        ...result.acceptedFileList,
        createUploadedPerformanceFile(file, [...currentFileList, ...result.acceptedFileList]),
      ],
    };
  };
}

/**
 * 브라우저 File 객체에서 UI와 최종 답변에 저장할 최소 메타데이터를 만든다.
 *
 * @param file 메타데이터로 변환할 브라우저 File 객체
 * @param currentFileList id 충돌을 피하기 위해 확인할 현재 업로드 목록
 * @returns UI와 최종 답변에 저장할 파일 메타데이터
 */
function createUploadedPerformanceFile(
  file: File,
  currentFileList: UploadedPerformanceFile[],
): UploadedPerformanceFile {
  const usedFileIdSet = new Set(currentFileList.map((currentFile) => currentFile.id));
  const id =
    Array.from(
      { length: MAX_PERFORMANCE_FILE_COUNT },
      (_, index) => `${index}-${file.name}-${file.size}-${file.lastModified}`,
    ).find((candidateId) => !usedFileIdSet.has(candidateId)) ??
    `${currentFileList.length}-${file.name}-${file.size}-${file.lastModified}`;

  return {
    id,
    name: file.name,
    size: file.size,
  };
}
