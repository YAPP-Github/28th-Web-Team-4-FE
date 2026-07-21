import { FormPanel } from '@/shared/ui/form-panel';

import { AuthEntryForm } from './auth-entry-form';

export function AuthEntryPage() {
  return (
    <main className="bg-surface-lower px-016 py-032 flex min-h-svh flex-1 items-center justify-center">
      <FormPanel aria-labelledby="auth-entry-title">
        <AuthEntryForm />
      </FormPanel>
    </main>
  );
}
