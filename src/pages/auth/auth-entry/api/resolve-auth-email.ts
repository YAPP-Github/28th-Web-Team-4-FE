import { loginMethods } from '@/shared/api/generated';
import { loginMethodsSchema } from '@/pages/auth/auth-entry/model/auth-entry-schema';

export type AuthMethod = 'LOCAL' | 'GOOGLE';

export async function getAuthEmailMethods(email: string): Promise<AuthMethod[]> {
  const { data: response } = await loginMethods({
    body: { email },
    throwOnError: true,
  });
  const result = loginMethodsSchema.safeParse(response.data);

  if (!result.success) {
    throw new Error('로그인 수단 응답 형식이 올바르지 않습니다.');
  }

  return result.data.methods;
}
