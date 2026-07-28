import { FormPanel } from '@/shared/ui/form-panel';

import { SignupPasswordForm } from './signup-password-form';

export function SignupPasswordPage() {
  return (
    <main className="bg-surface-lower px-016 py-032 flex min-h-svh flex-1 items-center justify-center">
      <FormPanel aria-labelledby="signup-password-title">
        <SignupPasswordForm />
      </FormPanel>
    </main>
  );
}
