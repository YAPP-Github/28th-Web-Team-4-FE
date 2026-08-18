import type { ReactElement } from 'react';
import type * as ReactQuery from '@tanstack/react-query';

import { hasActiveAuthSession } from '@/shared/lib/auth/session-cookie';

import { RecommendResultWithRecommendations } from './recommend-result-page';
import { RecommendResultRoute } from './recommend-result-route';

const { getRecommendationsOptionsMock, prefetchQueryMock } = vi.hoisted(() => ({
  getRecommendationsOptionsMock: vi.fn<(options: unknown) => unknown>(),
  prefetchQueryMock: vi.fn<(options: unknown) => Promise<void>>(),
}));

vi.mock('@/shared/api/generated/@tanstack/react-query.gen', () => ({
  getRecommendationsOptions: getRecommendationsOptionsMock,
}));
vi.mock('@/shared/lib/auth/session-cookie', () => ({
  hasActiveAuthSession: vi.fn<() => Promise<boolean>>(),
}));
vi.mock('@/shared/lib/query-client', () => ({
  getQueryClient: () => ({ prefetchQuery: prefetchQueryMock }),
}));
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<ReactQuery>();

  return {
    ...actual,
    dehydrate: () => ({ mutations: [], queries: [] }),
  };
});

const hasActiveAuthSessionMock = vi.mocked(hasActiveAuthSession);

function getResultElement(routeElement: ReactElement): ReactElement {
  const suspenseElement = routeElement.props.children as ReactElement;

  return suspenseElement.props.children as ReactElement;
}

describe('RecommendResultRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getRecommendationsOptionsMock.mockImplementation((options) => options);
    prefetchQueryMock.mockResolvedValue();
  });

  it('passes an authenticated session and the route id to the recommendation result', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(true);

    const routeElement = await RecommendResultRoute({
      params: Promise.resolve({ id: 'onboarding-87' }),
    });
    const resultElement = getResultElement(routeElement);

    expect(resultElement.type).toBe(RecommendResultWithRecommendations);
    expect(resultElement.props).toMatchObject({
      isGuest: false,
      onboardingId: 'onboarding-87',
    });
    expect(getRecommendationsOptionsMock).toHaveBeenCalledWith({
      query: { onboardingId: 'onboarding-87' },
    });
    expect(prefetchQueryMock).toHaveBeenCalledOnce();
  });

  it('passes a guest session when there is no active auth session', async () => {
    hasActiveAuthSessionMock.mockResolvedValue(false);

    const routeElement = await RecommendResultRoute({
      params: Promise.resolve({ id: 'onboarding-guest' }),
    });
    const resultElement = getResultElement(routeElement);

    expect(resultElement.props).toMatchObject({
      isGuest: true,
      onboardingId: 'onboarding-guest',
    });
  });
});
