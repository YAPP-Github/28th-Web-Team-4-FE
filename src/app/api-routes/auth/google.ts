import { z } from 'zod';

import { googleAuth } from '@/shared/api/generated';
import { extractTokenResponse } from '@/shared/lib/auth/session';
import { writeAuthSession } from '@/app/api-routes/auth/session-cookie';
import {
  forbiddenMutationResponse,
  invalidRequestResponse,
  isTrustedMutation,
  readJson,
  upstreamErrorResponse,
} from '@/app/api-routes/auth/route-utils';

const googleAuthRequestSchema = z.object({
  idToken: z.string().min(1),
});

const googleResolutionSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('LOGIN') }).passthrough(),
  z.object({
    status: z.literal('LINK_REQUIRED'),
    email: z.string().email(),
  }),
  z.object({
    status: z.literal('SIGNUP_REQUIRED'),
    signupToken: z.string().min(1),
    prefill: z.object({
      email: z.string().email(),
      suggestedNickname: z.string(),
    }),
  }),
]);

export async function postGoogleAuth(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const body = googleAuthRequestSchema.safeParse(await readJson(request));

  if (!body.success) {
    return invalidRequestResponse();
  }

  const result = await googleAuth({
    body: body.data,
  });

  if (result.error !== undefined) {
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  const resolution = googleResolutionSchema.safeParse(result.data.data);

  if (!resolution.success) {
    return upstreamErrorResponse(null);
  }

  if (resolution.data.status === 'LOGIN') {
    const tokens = extractTokenResponse(resolution.data);

    if (!tokens) {
      return upstreamErrorResponse(null);
    }

    await writeAuthSession(tokens);

    return Response.json({ status: 'LOGIN' });
  }

  return Response.json(resolution.data);
}
