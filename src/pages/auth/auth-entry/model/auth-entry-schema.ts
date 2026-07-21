import { z } from 'zod';

export const authEntrySchema = z.object({
  email: z.string().trim().min(1, '이메일을 입력해 주세요.').email('이메일 형식을 확인해 주세요.'),
});
