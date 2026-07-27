import { z } from 'zod';

export const signupEmailSchema = z.string().trim().email();

export const signupEmailVerificationSchema = z.object({
  code: z
    .string()
    .min(1, '인증 코드를 입력해 주세요.')
    .regex(/^\d{6}$/, '인증 코드는 6자리 숫자로 입력해 주세요.'),
});
