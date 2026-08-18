import { z } from 'zod';

import { signupGoogle } from '@/shared/api/generated';

import { handleAuthSessionMutation } from './session-mutation';

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
  return handleAuthSessionMutation({
    request,
    schema: googleSignupRequestSchema,
    execute: (body) => signupGoogle({ body }),
  });
}
