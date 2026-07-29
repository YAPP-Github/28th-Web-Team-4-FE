'use client';

/**
 * 광고 성과 파일의 클릭 선택, drag-and-drop, 검증 결과와 파일 목록을 표시한다.
 */

import { useRef, useState, type ChangeEvent, type DragEvent, type JSX } from 'react';
import { File, Upload, X } from 'lucide-react';

import {
  ACCEPTED_PERFORMANCE_FILE_EXTENSION_LIST,
  formatFileSize,
  validatePerformanceFileList,
} from '@/features/ad-onboarding/lib/file-upload';
import type { UploadedPerformanceFile } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import { cn } from '@/shared/ui/cn';
import { Text } from '@/shared/ui/text';

const ACCEPTED_FILE_TYPE = ACCEPTED_PERFORMANCE_FILE_EXTENSION_LIST.join(',');

export type PerformanceFileDropzoneProps = {
  fileList: UploadedPerformanceFile[];
  onFileListChange: (fileList: UploadedPerformanceFile[]) => void;
};

type PerformanceFileListProps = {
  fileList: UploadedPerformanceFile[];
  onRemove: (fileId: string) => void;
};

/**
 * 선택과 drop에 동일한 검증을 적용하고 유효한 파일 메타데이터만 상위 폼에 전달한다.
 */
export function PerformanceFileDropzone({
  fileList,
  onFileListChange,
}: PerformanceFileDropzoneProps): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const addFileList = (nextFileList: File[]): void => {
    const validationResult = validatePerformanceFileList(nextFileList, fileList);

    if (validationResult.acceptedFileList.length > 0) {
      onFileListChange([...fileList, ...validationResult.acceptedFileList]);
    }

    setErrorMessage(validationResult.errorMessage);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    addFileList(Array.from(event.currentTarget.files ?? []));
    event.currentTarget.value = '';
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    const nextTarget = event.relatedTarget;

    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }

    const dropzoneRect = event.currentTarget.getBoundingClientRect();
    const isPointerInsideDropzone =
      event.clientX >= dropzoneRect.left &&
      event.clientX <= dropzoneRect.right &&
      event.clientY >= dropzoneRect.top &&
      event.clientY <= dropzoneRect.bottom;

    if (isPointerInsideDropzone) {
      return;
    }

    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
    event.preventDefault();
    setIsDragging(false);
    addFileList(Array.from(event.dataTransfer.files));
  };

  const removeFile = (fileId: string): void => {
    onFileListChange(fileList.filter((file) => file.id !== fileId));
    setErrorMessage(undefined);
  };

  let dropzoneContent: JSX.Element;

  if (isDragging) {
    dropzoneContent = <PerformanceFileDropActiveContent />;
  } else if (fileList.length > 0) {
    dropzoneContent = (
      <>
        <button
          type="button"
          aria-label="광고 성과 파일 추가"
          className={[
            'absolute inset-0 rounded-[var(--radius-s)] outline-none',
            'focus-visible:outline-2 focus-visible:outline-offset-2',
            'focus-visible:outline-outline-high',
          ].join(' ')}
          onClick={() => inputRef.current?.click()}
        />
        <PerformanceFileList fileList={fileList} onRemove={removeFile} />
      </>
    );
  } else {
    dropzoneContent = (
      <button
        type="button"
        className={[
          'gap-010 absolute inset-0 flex cursor-pointer flex-col items-center justify-center',
          'rounded-[var(--radius-s)] outline-none',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          'focus-visible:outline-outline-high',
        ].join(' ')}
        onClick={() => inputRef.current?.click()}
      >
        <File aria-hidden className="text-icon-default size-040 stroke-[1.5]" />
        <div className="gap-002 flex flex-col items-center text-center">
          <Text variant="body-xl" className="text-text-default">
            파일을 드래그하거나 클릭해서 업로드
          </Text>
          <Text variant="body-xs" className="text-icon-default">
            지원 형식 · .xlsx, .csv (최대 10MB)
          </Text>
        </div>
      </button>
    );
  }

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        aria-label="광고 성과 파일"
        accept={ACCEPTED_FILE_TYPE}
        multiple
        onChange={handleInputChange}
      />
      <div
        role="group"
        aria-label="광고 성과 파일 업로드 영역"
        className={cn(
          [
            'border-outline-default bg-surface-lowest relative flex min-h-[146px] w-full',
            'flex-col items-center justify-center rounded-[var(--radius-s)] border border-dashed',
            'px-018 py-014 transition-colors',
            'hover:bg-surface-lower',
          ],
          fileList.length > 0 &&
            !isDragging &&
            'bg-surface-lower items-stretch justify-start gap-008',
          isDragging &&
            'border-primitive-orange-40 bg-sys-primary-lower hover:bg-sys-primary-lower',
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDragEnd={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {dropzoneContent}
      </div>

      {errorMessage ? (
        <div className="mt-006 flex justify-end">
          <Text role="alert" variant="body-xs" className="text-sys-error-default text-right">
            {errorMessage}
          </Text>
        </div>
      ) : null}
    </div>
  );
}

/** 드래그 중에는 Figma의 drop 가능 상태를 파일 목록이나 기본 안내보다 우선 표시한다. */
function PerformanceFileDropActiveContent(): JSX.Element {
  return (
    <div className="gap-010 pointer-events-none flex flex-col items-center justify-center">
      <div className="bg-sys-primary-low flex size-[48px] items-center justify-center rounded-full">
        <Upload aria-hidden className="text-icon-primary-low size-024 stroke-[1.5]" />
      </div>
      <Text variant="body-xl" className="text-icon-primary-low text-center">
        여기에 파일을 놓아 주세요
      </Text>
    </div>
  );
}

/** 업로드된 파일 메타데이터를 삭제 버튼과 함께 표시한다. */
function PerformanceFileList({ fileList, onRemove }: PerformanceFileListProps): JSX.Element {
  return (
    <ul className="gap-008 pointer-events-none relative z-10 flex w-full flex-col">
      {fileList.map((file) => (
        <li key={file.id} className="gap-010 flex min-w-0 items-center">
          <button
            type="button"
            aria-label={`${file.name} 삭제`}
            className={cn([
              'bg-surface-low text-icon-high flex size-014 shrink-0 items-center justify-center',
              'rounded-[var(--radius-max)] outline-none pointer-events-auto',
              'hover:bg-surface-default focus-visible:outline-2',
              'focus-visible:outline-offset-2 focus-visible:outline-outline-high',
            ])}
            onClick={(event) => {
              event.preventDefault();
              onRemove(file.id);
            }}
          >
            <X aria-hidden className="size-010" />
          </button>
          <Text
            variant="subtitle-xs"
            className="text-text-default min-w-0 flex-1 truncate"
            title={file.name}
          >
            {file.name}
          </Text>
          <Text variant="body-xs" className="text-icon-default shrink-0">
            {formatFileSize(file.size)}
          </Text>
        </li>
      ))}
    </ul>
  );
}
