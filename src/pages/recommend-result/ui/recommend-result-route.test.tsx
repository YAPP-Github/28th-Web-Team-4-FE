import type { ReactElement } from 'react';

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
  const actual = await importOriginal<Record<string, unknown>>();

  return {
    ...actual,
    dehydrate: () => ({ mutations: [], queries: [] }),
  };
});

const hasActiveAuthSessionMock = vi.mocked(hasActiveAuthSession);

type ResultElementProps = {
  isGuest: boolean;
  onboardingId: string;
};

function getResultElement(routeElement: ReactElement): ReactElement {
  const routeProps = routeElement.props as {
    children: ReactElement<{ children: ReactElement<ResultElementProps> }>;
  };

  return routeProps.children.props.children;
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
