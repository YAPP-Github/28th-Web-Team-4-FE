/**
 * 추천 광고 성과 dropzone의 클릭 선택, drag-and-drop, 검증 오류와 삭제 동작을 검증한다.
 */

import { useState, type JSX } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';

import type { UploadedPerformanceFile } from '@/features/ad-onboarding/model/recommend-onboarding-options';
import {
  PerformanceFileDropzone,
  type PerformanceFileDropzoneProps,
} from '@/features/ad-onboarding/ui/questions/recommend/ad-experience/performance-file-dropzone';

function PerformanceFileDropzoneStory(props: PerformanceFileDropzoneProps): JSX.Element {
  const [fileList, setFileList] = useState<UploadedPerformanceFile[]>(props.fileList);

  return (
    <div className="w-full max-w-[458px]">
      <PerformanceFileDropzone
        fileList={fileList}
        onFileListChange={(nextFileList) => {
          setFileList(nextFileList);
          props.onFileListChange(nextFileList);
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Features/AdOnboarding/Recommend/PerformanceFileDropzone',
  component: PerformanceFileDropzoneStory,
  tags: ['autodocs'],
  args: {
    fileList: [],
    onFileListChange: fn(),
  },
} satisfies Meta<typeof PerformanceFileDropzoneStory>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 브라우저 drag event가 요구하는 실제 DataTransfer에 테스트 파일을 담는다. */
function createDataTransfer(file: File): DataTransfer {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);

  return dataTransfer;
}

/** Chromium이 실제 DragEvent 생성 시 요구하는 DataTransfer를 이벤트에 연결한다. */
function createFileDragEvent(
  type: 'dragenter' | 'dragleave' | 'drop',
  file: File,
  init?: DragEventInit,
): DragEvent {
  const event = new DragEvent(type, { bubbles: true, cancelable: true, ...init });
  Object.defineProperty(event, 'dataTransfer', {
    value: createDataTransfer(file),
  });

  return event;
}

export const Default: Story = {};

export const ClickUploadAndRemove: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fileInput = canvas.getByLabelText('광고 성과 파일');
    const file = new File(['performance'], 'meta-performance.csv', {
      type: 'text/csv',
      lastModified: 1,
    });

    await userEvent.upload(fileInput, file);
    await expect(canvas.getByText('meta-performance.csv')).toBeVisible();
    await expect(canvas.getByText('11B')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'meta-performance.csv 삭제' }));
    await expect(canvas.queryByText('meta-performance.csv')).not.toBeInTheDocument();
  },
};

export const DragActive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropzone = canvas.getByRole('group', { name: '광고 성과 파일 업로드 영역' });
    const file = new File(['valid'], 'performance.xlsx', {
      lastModified: 1,
    });

    await fireEvent(dropzone, createFileDragEvent('dragenter', file));

    await waitFor(() => expect(dropzone).toHaveClass('bg-sys-primary-lower'));
    await expect(canvas.getByText('여기에 파일을 놓아 주세요')).toBeVisible();
    await expect(canvas.queryByText('파일을 드래그하거나 클릭해서 업로드')).not.toBeInTheDocument();
  },
};

export const DragCancel: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropzone = canvas.getByRole('group', { name: '광고 성과 파일 업로드 영역' });
    const file = new File(['valid'], 'performance.xlsx', {
      lastModified: 1,
    });

    await fireEvent(dropzone, createFileDragEvent('dragenter', file));
    await waitFor(() => expect(canvas.getByText('여기에 파일을 놓아 주세요')).toBeVisible());

    await fireEvent(
      dropzone,
      createFileDragEvent('dragleave', file, {
        clientX: -1,
        clientY: -1,
      }),
    );

    await waitFor(() =>
      expect(canvas.getByText('파일을 드래그하거나 클릭해서 업로드')).toBeVisible(),
    );
    await expect(canvas.queryByText('여기에 파일을 놓아 주세요')).not.toBeInTheDocument();
  },
};

export const DragAndDropValidation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dropzone = canvas.getByRole('group', { name: '광고 성과 파일 업로드 영역' });
    const invalidFile = new File(['invalid'], 'performance.pdf', {
      type: 'application/pdf',
      lastModified: 1,
    });
    const validFile = new File(['valid'], 'performance.xlsx', {
      lastModified: 2,
    });

    await fireEvent(dropzone, createFileDragEvent('dragenter', validFile));
    await waitFor(() => expect(dropzone).toHaveClass('bg-sys-primary-lower'));
    await expect(canvas.getByText('여기에 파일을 놓아 주세요')).toBeVisible();

    await fireEvent(dropzone, createFileDragEvent('drop', invalidFile));
    await waitFor(() =>
      expect(canvas.getByRole('alert')).toHaveTextContent(
        '.csv 또는 .xlsx 파일만 업로드할 수 있어요.',
      ),
    );

    await fireEvent(dropzone, createFileDragEvent('drop', validFile));
    await waitFor(() => expect(canvas.getByText('performance.xlsx')).toBeVisible());
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
  },
};
