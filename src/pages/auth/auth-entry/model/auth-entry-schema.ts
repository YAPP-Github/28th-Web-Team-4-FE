import { z } from 'zod';

export const authEntrySchema = z.object({
  email: z.string().trim().min(1, '이메일을 입력해 주세요.').email('이메일 형식을 확인해 주세요.'),
});

export const loginMethodsSchema = z.object({
  methods: z.array(z.enum(['LOCAL', 'GOOGLE'])),
});

export const googleAuthResolutionSchema = z.discriminatedUnion('status', [
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
