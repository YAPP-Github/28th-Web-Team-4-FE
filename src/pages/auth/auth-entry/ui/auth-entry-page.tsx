import { AuthEntryForm } from './auth-entry-form';

export function AuthEntryPage({ returnTo = '/' }: { returnTo?: string }) {
  return <AuthEntryForm returnTo={returnTo} />;
}
