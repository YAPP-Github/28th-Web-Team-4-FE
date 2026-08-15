import { getMyOnboardingTag as getBackendMyOnboardingTag } from '@/shared/api/generated';
import type { AuthSession } from '@/shared/lib/auth/session';
import { clearAuthSession, readAuthSession } from '@/app/api-routes/auth/session-cookie';

import { getMyOnboardingTag as getMyOnboardingTagRoute } from './onboarding-tags';

vi.mock('@/shared/api/generated', () => ({
  getMyOnboardingTag: vi.fn<typeof getBackendMyOnboardingTag>(),
}));
vi.mock('@/app/api-routes/auth/session-cookie', () => ({
  clearAuthSession: vi.fn<typeof clearAuthSession>(),
  readAuthSession: vi.fn<typeof readAuthSession>(),
}));

const getMyOnboardingTagMock = vi.mocked(getBackendMyOnboardingTag);
const clearAuthSessionMock = vi.mocked(clearAuthSession);
const readAuthSessionMock = vi.mocked(readAuthSession);
const now = 1_000_000;
const session: AuthSession = {
  accessToken: 'access-token',
  accessTokenExpiresAt: now + 60_000,
  refreshToken: 'refresh-token',
  refreshTokenExpiresAt: now + 3_600_000,
};

const onboardingTag = {
  hasOnboarding: true,
  onboardingId: 'onboarding-1',
  serviceName: '채소집',
  industry: 'SHOPPING_COMMERCE' as const,
  serviceType: 'WEB' as const,
  targetAgeBands: ['AGE_30S', 'AGE_40S'] as const,
  campaignObjective: 'CONVERSION' as const,
  budgetMin: 500_000,
  budgetMax: 5_000_000,
  period: 'M1' as const,
  adExperience: 'EXPERIENCED' as const,
};

function onboardingTagSuccessResponse(): Awaited<ReturnType<typeof getBackendMyOnboardingTag>> {
  return {
    data: { success: true, data: onboardingTag, error: null, code: null },
    response: new Response(null, { status: 200 }),
  };
}

describe('my onboarding tags BFF', () => {
  beforeEach(() => {
    vi.spyOn(Date, 'now').mockReturnValue(now);
    readAuthSessionMock.mockResolvedValue(session);
    clearAuthSessionMock.mockResolvedValue();
    getMyOnboardingTagMock.mockResolvedValue(onboardingTagSuccessResponse());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 401 without calling the backend when there is no session', async () => {
    readAuthSessionMock.mockResolvedValue(null);

    const response = await getMyOnboardingTagRoute();

    expect(response.status).toBe(401);
    expect(getMyOnboardingTagMock).not.toHaveBeenCalled();
    expect(clearAuthSessionMock).toHaveBeenCalledOnce();
  });

  it('forwards onboarding tags with the session access token', async () => {
    const response = await getMyOnboardingTagRoute();

    expect(response.status).toBe(200);
    expect(getMyOnboardingTagMock).toHaveBeenCalledWith({ auth: 'access-token' });
    await expect(response.json()).resolves.toEqual({
      success: true,
      data: onboardingTag,
      error: null,
      code: null,
    });
  });
});
