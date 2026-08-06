import { z } from 'zod';

import { linkGoogle } from '@/shared/api/generated';

import { handleAuthSessionMutation } from './session-mutation';

const googleLinkRequestSchema = z.object({
  idToken: z.string().min(1),
});

export async function postGoogleLink(request: Request): Promise<Response> {
  return handleAuthSessionMutation({
    request,
    schema: googleLinkRequestSchema,
    execute: (body) => linkGoogle({ body }),
  });
}
