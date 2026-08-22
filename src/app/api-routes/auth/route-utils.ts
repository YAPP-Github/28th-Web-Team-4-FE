import { z } from 'zod';

import { captureException } from '@/shared/lib/sentry/error-reporting';

const apiErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    fieldErrors: z.array(z.unknown()).optional(),
  }),
});

export function isTrustedMutation(request: Request): boolean {
  const origin = request.headers.get('origin');
  const fetchSite = request.headers.get('sec-fetch-site');
  const allowedOrigins = new Set(
    (process.env.BFF_ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );

  if (origin && !allowedOrigins.has(origin)) {
    return false;
  }

  return fetchSite === 'same-origin' || fetchSite === 'none';
}

export function forbiddenMutationResponse(): Response {
  return Response.json(
    {
      success: false,
      error: {
        code: 'BFF-001',
        message: '허용되지 않은 요청 출처입니다.',
        fieldErrors: [],
      },
    },
    { status: 403 },
  );
}

export function invalidRequestResponse(): Response {
  return Response.json(
    {
      success: false,
      error: {
        code: 'C-001',
        message: '요청 형식이 올바르지 않습니다.',
        fieldErrors: [],
      },
    },
    { status: 400 },
  );
}

export function upstreamErrorResponse(error: unknown, status = 502): Response {
  if (status >= 500) {
    captureException(error, {
      feature: 'auth-bff',
      'http.status_code': status,
      operation: 'upstream-error-response',
    });
  }

  const result = apiErrorSchema.safeParse(error);

  if (result.success) {
    return Response.json(error, { status });
  }

  return Response.json(
    {
      success: false,
      error: {
        code: 'BFF-002',
        message: '인증 서버 요청 중 문제가 발생했습니다.',
        fieldErrors: [],
      },
    },
    { status },
  );
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
