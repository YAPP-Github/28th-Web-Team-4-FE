import type { z } from 'zod';

import { extractTokenResponse } from '@/shared/lib/auth/session';
import { writeAuthSession } from '@/app/api-routes/auth/session-cookie';

import {
  forbiddenMutationResponse,
  invalidRequestResponse,
  isTrustedMutation,
  readJson,
  upstreamErrorResponse,
} from './route-utils';

type SessionMutationResult = {
  data?: { data?: unknown };
  error?: unknown;
  response?: Response;
};

type SessionMutationOptions<TBody> = {
  request: Request;
  schema: z.ZodType<TBody>;
  execute: (body: TBody) => Promise<SessionMutationResult>;
};

export async function handleAuthSessionMutation<TBody>({
  request,
  schema,
  execute,
}: SessionMutationOptions<TBody>): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const body = schema.safeParse(await readJson(request));

  if (!body.success) {
    return invalidRequestResponse();
  }

  const result = await execute(body.data);

  if (result.error !== undefined) {
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  if (!result.data) {
    return upstreamErrorResponse(null);
  }

  const tokens = extractTokenResponse(result.data.data);

  if (!tokens) {
    return upstreamErrorResponse(null);
  }

  await writeAuthSession(tokens);

  return new Response(null, { status: 204 });
}
