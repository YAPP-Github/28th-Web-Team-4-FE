import { z } from 'zod';

import { login, signup } from '@/shared/api/generated';
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

  if (signupTokens) {
    await writeAuthSession(signupTokens);
    return new Response(null, { status: 204 });
  }

  // 이메일 가입 API는 현재 사용자 정보만 반환하므로, 세션 발급은 BFF 안에서만 수행한다.
  const loginResult = await login({
    body: {
      email: body.data.email,
      password: body.data.password,
    },
  });

  if (loginResult.error !== undefined) {
    return upstreamErrorResponse(loginResult.error, loginResult.response?.status);
  }

  if (!loginResult.data) {
    return upstreamErrorResponse(null);
  }

  const loginTokens = extractTokenResponse(loginResult.data.data);

  if (!loginTokens) {
    return upstreamErrorResponse(null);
  }

  await writeAuthSession(loginTokens);

  return new Response(null, { status: 204 });
}
