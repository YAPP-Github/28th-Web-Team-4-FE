import { loginMethods } from '@/shared/api/generated';

import { getAuthEmailMethods } from './resolve-auth-email';

vi.mock('@/shared/api/generated', () => ({
  loginMethods: vi.fn<typeof loginMethods>(),
}));

const loginMethodsMock = vi.mocked(loginMethods);

function loginMethodsResponse(methods: ('LOCAL' | 'GOOGLE')[]) {
  return {
    data: { success: true, data: { methods } },
    response: new Response(null, { status: 200 }),
  };
}

describe('auth email API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns the available login methods for an account', async () => {
    loginMethodsMock.mockResolvedValue(loginMethodsResponse(['LOCAL']));

    await expect(getAuthEmailMethods('member@example.com')).resolves.toEqual(['LOCAL']);
  });
});
