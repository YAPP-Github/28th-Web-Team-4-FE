import { z } from 'zod';

export const signupNameSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(1, '이름을 입력해 주세요')
    .max(50, '이름은 50자 이하로 입력해 주세요'),
});
