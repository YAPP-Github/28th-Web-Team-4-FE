import { z } from 'zod';

export const signupCompanySchema = z.object({
  companyName: z.string().trim().max(50, '회사명은 50자 이하로 입력해 주세요'),
});
