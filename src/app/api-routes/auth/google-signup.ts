import { z } from 'zod';

import { signupGoogle } from '@/shared/api/generated';
import { extractTokenResponse } from '@/shared/lib/auth/session';
import { writeAuthSession } from '@/app/api-routes/auth/session-cookie';
import {
  forbiddenMutationResponse,
  invalidRequestResponse,
  isTrustedMutation,
  readJson,
  upstreamErrorResponse,
} from '@/app/api-routes/auth/route-utils';

const googleSignupRequestSchema = z.object({
  signupToken: z.string().min(1),
  nickname: z.string().min(1),
  companyName: z.string().min(1),
  occupation: z
    .enum(['DEVELOPMENT', 'DESIGN', 'MARKETING', 'PLANNING', 'SALES', 'DATA', 'MANAGEMENT', 'ETC'])
    .optional(),
  termsAgreed: z.boolean(),
  marketingAgreed: z.boolean().optional(),
});

export async function postGoogleSignup(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const body = googleSignupRequestSchema.safeParse(await readJson(request));

  if (!body.success) {
    return invalidRequestResponse();
  }

  const result = await signupGoogle({ body: body.data });

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
