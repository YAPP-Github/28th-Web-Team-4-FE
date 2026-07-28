import { FormPanel } from '@/shared/ui/form-panel';

import { SignupCompanyForm } from './signup-company-form';

export function SignupCompanyPage() {
  return (
    <main className="bg-surface-lower px-016 py-032 flex min-h-svh flex-1 items-center justify-center">
      <FormPanel aria-labelledby="signup-company-title">
        <SignupCompanyForm />
      </FormPanel>
    </main>
  );
}
