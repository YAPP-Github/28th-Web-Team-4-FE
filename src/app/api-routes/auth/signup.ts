import { z } from 'zod';

import { signup } from '@/shared/api/generated';
import { extractTokenResponse } from '@/shared/lib/auth/session';
import { writeAuthSession } from '@/app/api-routes/auth/session-cookie';

import {
  forbiddenMutationResponse,
  invalidRequestResponse,
  isTrustedMutation,
  readJson,
  upstreamErrorResponse,
} from './route-utils';

const signupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  nickname: z.string().min(1),
  companyName: z.string().min(1),
  occupation: z
    .enum(['DEVELOPMENT', 'DESIGN', 'MARKETING', 'PLANNING', 'SALES', 'DATA', 'MANAGEMENT', 'ETC'])
    .optional(),
  termsAgreed: z.boolean(),
  marketingAgreed: z.boolean().optional(),
});

export async function postSignup(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const body = signupRequestSchema.safeParse(await readJson(request));

  if (!body.success) {
    return invalidRequestResponse();
  }

  const signupResult = await signup({ body: body.data });

  if (signupResult.error !== undefined) {
    return upstreamErrorResponse(signupResult.error, signupResult.response?.status);
  }

  if (!signupResult.data) {
    return upstreamErrorResponse(null);
  }

  const signupTokens = extractTokenResponse(signupResult.data.data);

  // 가입 응답에 발급된 토큰이 없으면 계약을 위반한 응답이므로 세션을 만들지 않는다.
  if (!signupTokens) {
    return upstreamErrorResponse(null);
  }

  await writeAuthSession(signupTokens);

  return new Response(null, { status: 204 });
}
