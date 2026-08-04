import { z } from 'zod';

import { linkGoogle } from '@/shared/api/generated';
import { extractTokenResponse } from '@/shared/lib/auth/session';
import { writeAuthSession } from '@/app/api-routes/auth/session-cookie';
import {
  forbiddenMutationResponse,
  invalidRequestResponse,
  isTrustedMutation,
  readJson,
  upstreamErrorResponse,
} from '@/app/api-routes/auth/route-utils';

const googleLinkRequestSchema = z.object({
  idToken: z.string().min(1),
});

export async function postGoogleLink(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const body = googleLinkRequestSchema.safeParse(await readJson(request));

  if (!body.success) {
    return invalidRequestResponse();
  }

  const result = await linkGoogle({ body: body.data });

  if (result.error !== undefined) {
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  const tokens = extractTokenResponse(result.data.data);

  if (!tokens) {
    return upstreamErrorResponse(null);
  }

  await writeAuthSession(tokens);

  return new Response(null, { status: 204 });
}
