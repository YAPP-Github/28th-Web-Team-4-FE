import { withdraw } from '@/shared/api/generated';
import { readAuthSession } from '@/app/api-routes/auth/session-cookie';

import { forbiddenMutationResponse, isTrustedMutation, upstreamErrorResponse } from './route-utils';

export async function postWithdraw(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const session = await readAuthSession();

  if (!session) {
    return new Response(null, { status: 401 });
  }

  let result: Awaited<ReturnType<typeof withdraw>>;

  try {
    result = await withdraw({ auth: session.accessToken });
  } catch (error) {
    return upstreamErrorResponse(error);
  }

  if (result.error !== undefined) {
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  if (!result.data) {
    return upstreamErrorResponse(null);
  }

  return new Response(null, { status: 204 });
}
