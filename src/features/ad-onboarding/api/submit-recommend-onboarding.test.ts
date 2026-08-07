import { presignOnboardingPerformanceFiles, submitOnboarding } from '@/shared/api/generated';
import type { RecommendOnboardingAnswer } from '@/features/ad-onboarding/model/onboarding-answer';

import {
  createSubmitOnboardingRequest,
  submitRecommendOnboarding,
} from './submit-recommend-onboarding';

vi.mock('@/shared/api/generated', () => ({
  presignOnboardingPerformanceFiles: vi.fn<typeof presignOnboardingPerformanceFiles>(),
  submitOnboarding: vi.fn<typeof submitOnboarding>(),
}));

const presignOnboardingPerformanceFilesMock = vi.mocked(presignOnboardingPerformanceFiles);
const submitOnboardingMock = vi.mocked(submitOnboarding);
const fetchMock = vi.fn<typeof fetch>();

const baseAnswer = {
  serviceName: '채소집',
  category: 'SHOPPING_COMMERCE',
  serviceType: 'APP_AND_WEB',
  ageRangeList: ['TWENTIES', 'THIRTIES'],
  adGoal: 'PURCHASE_CONVERSION',
  budget: {
    minAmount: 500000,
    maxAmount: 5000000,
  },
  campaignPeriod: 'ONE_MONTH',
  adExperience: { type: 'FIRST_TIME' },
} as const satisfies RecommendOnboardingAnswer;

describe('createSubmitOnboardingRequest', () => {
  it('maps the frontend onboarding answer to the submit API contract', () => {
    expect(createSubmitOnboardingRequest(baseAnswer)).toMatchObject({
      serviceName: '채소집',
      industry: 'SHOPPING_COMMERCE',
      serviceType: 'WEB_AND_APP',
      targetAgeBands: ['AGE_20S', 'AGE_30S'],
      campaignObjective: 'CONVERSION',
      budgetMin: 500000,
      budgetMax: 5000000,
      period: 'M1',
      adExperience: 'NONE',
      adHistory: [],
      rawFileKeys: [],
    });
  });

  it('temporarily maps UNKNOWN age range to every supported API age band', () => {
    const request = createSubmitOnboardingRequest({
      ...baseAnswer,
      ageRangeList: ['UNKNOWN'],
    });

    expect(request.targetAgeBands).toEqual([
      'AGE_10S',
      'AGE_20S',
      'AGE_30S',
      'AGE_40S',
      'AGE_50S_PLUS',
    ]);
  });

  it('maps manual ad history to the API adHistory list', () => {
    const request = createSubmitOnboardingRequest({
      ...baseAnswer,
      adExperience: {
        type: 'EXPERIENCED',
        performanceInput: {
          mode: 'MANUAL',
          channel: 'NAVER_SA',
        },
      },
    });

    expect(request.adExperience).toBe('EXPERIENCED');
    expect(request.adHistory).toEqual([{ channelNameRaw: '네이버 SA' }]);
  });
});

describe('submitRecommendOnboarding', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    fetchMock.mockReset();
    presignOnboardingPerformanceFilesMock.mockReset();
    submitOnboardingMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('uploads performance files and submits only successful file keys', async () => {
    const firstFile = new File(['one'], 'first.csv', { type: 'text/csv' });
    const secondFile = new File(['two'], 'second.csv', { type: 'text/csv' });
    const answer = {
      ...baseAnswer,
      adExperience: {
        type: 'EXPERIENCED',
        performanceInput: {
          mode: 'UPLOAD',
          fileList: [
            { id: 'first', name: 'first.csv', size: firstFile.size, file: firstFile },
            { id: 'second', name: 'second.csv', size: secondFile.size, file: secondFile },
          ],
        },
      },
    } as const satisfies RecommendOnboardingAnswer;

    presignOnboardingPerformanceFilesMock.mockResolvedValue({
      data: {
        success: true,
        data: [
          {
            key: 'raw/first.csv',
            uploadUrl: 'https://storage.example/first',
            contentType: 'text/csv',
            expiresAt: '2026-08-07T00:00:00Z',
          },
          {
            key: 'raw/second.csv',
            uploadUrl: 'https://storage.example/second',
            contentType: 'text/csv',
            expiresAt: '2026-08-07T00:00:00Z',
          },
        ],
      },
      response: new Response(null, { status: 200 }),
    });
    fetchMock
      .mockResolvedValueOnce(new Response(null, { status: 200 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }));
    submitOnboardingMock.mockResolvedValue({
      data: {
        success: true,
        data: {
          onboardingId: 'onboarding-1',
          createdAt: '2026-08-07T00:00:00Z',
        },
      },
      response: new Response(null, { status: 201 }),
    });

    await expect(submitRecommendOnboarding(answer)).resolves.toMatchObject({
      onboardingId: 'onboarding-1',
    });
    expect(presignOnboardingPerformanceFilesMock).toHaveBeenCalledWith({
      body: {
        files: [
          { fileName: 'first.csv', fileSizeBytes: firstFile.size },
          { fileName: 'second.csv', fileSizeBytes: secondFile.size },
        ],
      },
      throwOnError: true,
    });
    expect(fetchMock).toHaveBeenCalledWith('https://storage.example/first', {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/csv',
        'x-amz-tagging': 'retain=pending',
      },
      body: firstFile,
    });
    expect(submitOnboardingMock).toHaveBeenCalledWith({
      body: expect.objectContaining({
        rawFileKeys: ['raw/first.csv'],
      }),
      throwOnError: true,
    });
  });
});
