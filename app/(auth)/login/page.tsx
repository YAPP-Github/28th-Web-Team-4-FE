import { AuthEntryPage } from '@/pages/auth/auth-entry';
import { resolveAuthReturnPath } from '@/pages/auth/auth-entry/model/resolve-auth-return-path';

type LoginPageProps = {
  searchParams: Promise<{
    returnTo?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { returnTo } = await searchParams;

  return <AuthEntryPage returnTo={resolveAuthReturnPath(returnTo)} />;
}
