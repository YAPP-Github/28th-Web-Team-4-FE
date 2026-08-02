import { createHash } from 'node:crypto';
import { setTimeout } from 'node:timers';

import { refresh } from '@/shared/api/generated';
import { extractTokenResponse } from '@/shared/lib/auth/session';
import {
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from '@/app/api-routes/auth/session-cookie';
import {
  forbiddenMutationResponse,
  isTrustedMutation,
  upstreamErrorResponse,
} from '@/app/api-routes/auth/route-utils';

const REFRESH_FLIGHT_GRACE_MS = 5_000;
type RefreshResult = Awaited<ReturnType<typeof refresh>>;

const refreshFlights = new Map<string, Promise<RefreshResult>>();

function getRefreshTokenFingerprint(refreshToken: string): string {
  return createHash('sha256').update(refreshToken).digest('base64url');
}

function requestRefreshSingleFlight(refreshToken: string): Promise<RefreshResult> {
  const fingerprint = getRefreshTokenFingerprint(refreshToken);
  const existingFlight = refreshFlights.get(fingerprint);

  if (existingFlight) {
    return existingFlight;
  }

  const flight = refresh({ body: { refreshToken } });
  refreshFlights.set(fingerprint, flight);

  const scheduleCleanup = () => {
    const timeout = setTimeout(() => {
      if (refreshFlights.get(fingerprint) === flight) {
        refreshFlights.delete(fingerprint);
      }
    }, REFRESH_FLIGHT_GRACE_MS);
    timeout.unref();
  };

  void flight.then(scheduleCleanup, scheduleCleanup);

  return flight;
}

export async function postRefresh(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  const session = await readAuthSession();

  if (!session || session.refreshTokenExpiresAt <= Date.now()) {
    await clearAuthSession();
    return new Response(null, { status: 401 });
  }

  const result = await requestRefreshSingleFlight(session.refreshToken);

  if ('error' in result) {
    if (result.response?.status === 401) {
      await clearAuthSession();
    }

    return upstreamErrorResponse(result.error, result.response?.status);
  }

  const tokens = extractTokenResponse(result.data.data);

  if (!tokens) {
    return upstreamErrorResponse(null);
  }

  await writeAuthSession(tokens);

  return new Response(null, { status: 204 });
}
