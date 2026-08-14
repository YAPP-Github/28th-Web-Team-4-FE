import { createHash } from 'node:crypto';
import { setTimeout } from 'node:timers';

import { refresh } from '@/shared/api/generated';
import { extractTokenResponse, type AuthSession } from '@/shared/lib/auth/session';

import { writeAuthSession } from './session-cookie';

const REFRESH_FLIGHT_GRACE_MS = 5_000;

type RefreshResult = Awaited<ReturnType<typeof refresh>>;

type RefreshSessionResult =
  | { session: AuthSession }
  | { session: null; error: unknown; response?: Response };

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
  const removeFailedFlight = () => {
    if (refreshFlights.get(fingerprint) === flight) {
      refreshFlights.delete(fingerprint);
    }
  };

  void flight.then(scheduleCleanup, removeFailedFlight);

  return flight;
}

export async function refreshAuthSession(session: AuthSession): Promise<RefreshSessionResult> {
  let result: RefreshResult;

  try {
    result = await requestRefreshSingleFlight(session.refreshToken);
  } catch (error) {
    return { session: null, error };
  }

  if ('error' in result) {
    return { session: null, error: result.error, response: result.response };
  }

  const tokens = extractTokenResponse(result.data.data);

  if (!tokens) {
    return { session: null, error: null, response: result.response };
  }

  return { session: await writeAuthSession(tokens) };
}
