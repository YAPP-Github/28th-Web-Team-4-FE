import { ensureResponseOk } from '@/shared/api/response';

export async function linkGoogleAccount(idToken: string): Promise<void> {
  const response = await fetch('/api/auth/google/link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  await ensureResponseOk(response);
}
