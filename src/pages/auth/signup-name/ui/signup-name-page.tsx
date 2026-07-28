import { FormPanel } from '@/shared/ui/form-panel';

import { SignupNameForm } from './signup-name-form';

export function SignupNamePage() {
  return (
    <main className="bg-surface-lower px-016 py-032 flex min-h-svh flex-1 items-center justify-center">
      <FormPanel aria-labelledby="signup-name-title">
        <SignupNameForm />
      </FormPanel>
    </main>
  );
}
