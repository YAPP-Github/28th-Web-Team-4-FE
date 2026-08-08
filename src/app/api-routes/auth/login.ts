import { z } from 'zod';

import { login } from '@/shared/api/generated';

import { handleAuthSessionMutation } from './session-mutation';

const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function postLogin(request: Request): Promise<Response> {
  return handleAuthSessionMutation({
    request,
    schema: loginRequestSchema,
    execute: (body) => login({ body }),
  });
}
