import { useMutation } from '@tanstack/react-query';

import {
  getAuthEmailMethods,
  sendAuthSignupCode,
  type AuthEmailResolution,
} from '@/pages/auth/auth-entry/api/resolve-auth-email';

export function useResolveAuthEmail() {
  const loginMethodsMutation = useMutation({ mutationFn: getAuthEmailMethods });
  const signupCodeMutation = useMutation({ mutationFn: sendAuthSignupCode });

  return useMutation({
    mutationFn: async (email: string): Promise<AuthEmailResolution> => {
      const methods = await loginMethodsMutation.mutateAsync(email);

      if (methods.includes('LOCAL')) {
        return { type: 'login', email };
      }

      if (methods.includes('GOOGLE')) {
        return { type: 'google', email };
      }

      const type = await signupCodeMutation.mutateAsync(email);

      return { type, email };
    },
  });
}
