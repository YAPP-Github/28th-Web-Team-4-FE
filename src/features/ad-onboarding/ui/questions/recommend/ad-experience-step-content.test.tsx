import type { JSX, ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider } from 'react-hook-form';
import { http, HttpResponse } from 'msw';

import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { useRecommendOnboardingForm } from '@/features/ad-onboarding/model/use-recommend-onboarding-form';
import type {
  ChannelListItemResponse,
  PageResponseChannelListItemResponse,
} from '@/shared/api/generated';
import { server } from '@/shared/api/mocks/server';

import { AdExperienceStepContent } from './ad-experience-step-content';

vi.mock('@/shared/api/hey-api', () => ({
  createClientConfig: (config?: Record<string, unknown>) => ({
    ...config,
    baseUrl: 'http://localhost',
  }),
}));

function createChannel(id: string, name: string): ChannelListItemResponse {
  return {
    id,
    name,
    primaryCategory: 'OTHERS',
  };
}

function createChannelPage(
  content: ChannelListItemResponse[],
): PageResponseChannelListItemResponse {
  return {
    content,
    number: 0,
    size: content.length,
    totalElements: content.length,
    totalPages: 1,
    first: true,
    last: true,
  };
}

function renderAdExperienceStep() {
  let submittedDraft: RecommendOnboardingDraft | undefined;
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  function QueryWrapper({ children }: { children: ReactNode }): JSX.Element {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  }

  function TestHarness(): JSX.Element {
    const form = useRecommendOnboardingForm();

    return (
      <QueryWrapper>
        <FormProvider {...form}>
          <AdExperienceStepContent
            onAction={() => {
              submittedDraft = form.getValues();
            }}
          />
        </FormProvider>
      </QueryWrapper>
    );
  }

  const view = render(<TestHarness />);

  return {
    ...view,
    getSubmittedDraft: () => submittedDraft,
  };
}

describe('AdExperienceStepContent', () => {
  it('shows the description matching the selected ad experience type', async () => {
    const user = userEvent.setup();
    renderAdExperienceStep();

    await user.click(screen.getByRole('radio', { name: '광고 운영은 처음이에요' }));
    expect(
      screen.getByText('최대 5개의 데이터를 바탕으로 더 정확한 채널을 추천해요'),
    ).toBeVisible();

    await user.click(screen.getByRole('radio', { name: '광고를 운영해 봤어요' }));
    expect(screen.getByText('데이터를 바탕으로 더 정확한 채널을 추천해요')).toBeVisible();
  });

  it('clears uploaded performance files before skipping performance input', async () => {
    const user = userEvent.setup();
    const { container, getSubmittedDraft } = renderAdExperienceStep();

    await user.click(screen.getByRole('radio', { name: '광고를 운영해 봤어요' }));
    await user.click(screen.getByRole('button', { name: '다음' }));

    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]');
    const file = new File(['performance'], 'meta-performance.csv', {
      type: 'text/csv',
      lastModified: 1,
    });

    expect(fileInput).not.toBeNull();
    if (!fileInput) {
      return;
    }

    await user.upload(fileInput, file);
    expect(screen.getByText('meta-performance.csv')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '건너뛰기' }));

    expect(getSubmittedDraft()).toMatchObject({
      adExperienceType: 'EXPERIENCED',
      performanceFileList: [],
      performanceManualChannelList: [],
    });
  });

  it('submits manual performance input after at least two metrics are filled for the channel', async () => {
    const user = userEvent.setup();
    let requestedUrl: URL | undefined;
    const { getSubmittedDraft } = renderAdExperienceStep();

    server.use(
      http.get(/\/api\/v1\/channels$/, ({ request }) => {
        requestedUrl = new URL(request.url);

        return HttpResponse.json({
          success: true,
          data: createChannelPage([createChannel('channel-meta', '메타 광고')]),
        });
      }),
    );

    await user.click(screen.getByRole('radio', { name: '광고를 운영해 봤어요' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('tab', { name: '직접 입력' }));

    await user.type(await screen.findByRole('combobox', { name: '광고 채널 검색' }), '메타');
    await user.click(await screen.findByRole('option', { name: '메타 광고' }));

    expect(screen.getByRole('button', { name: '메타 광고 삭제' })).toBeVisible();
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();

    await user.type(screen.getByRole('textbox', { name: '예산(원)' }), '100000');
    expect(screen.getByRole('button', { name: '다음' })).toBeDisabled();

    await user.type(screen.getByRole('textbox', { name: '집행 기간' }), '14');
    await user.click(screen.getByRole('button', { name: '다음' }));

    expect(requestedUrl?.searchParams.get('size')).toBeNull();
    expect(getSubmittedDraft()).toMatchObject({
      adExperienceType: 'EXPERIENCED',
      performanceMode: 'MANUAL',
      performanceManualChannelList: [
        {
          channelId: 'channel-meta',
          channelNameRaw: '메타 광고',
          budgetWon: 100000,
          periodDays: 14,
        },
      ],
    });
  });

  it('shows a direct-add option even when the search keyword exactly matches a catalog channel', async () => {
    const user = userEvent.setup();
    renderAdExperienceStep();

    server.use(
      http.get(/\/api\/v1\/channels$/, () =>
        HttpResponse.json({
          success: true,
          data: createChannelPage([createChannel('channel-naver-sa', '네이버 SA')]),
        }),
      ),
    );

    await user.click(screen.getByRole('radio', { name: '광고를 운영해 봤어요' }));
    await user.click(screen.getByRole('button', { name: '다음' }));
    await user.click(screen.getByRole('tab', { name: '직접 입력' }));

    await user.type(await screen.findByRole('combobox', { name: '광고 채널 검색' }), '네이버 SA');

    expect(await screen.findByRole('option', { name: '네이버 SA' })).toBeVisible();
    expect(screen.getByRole('option', { name: '‘네이버 SA’ 직접 추가하기' })).toBeVisible();
  });
});
