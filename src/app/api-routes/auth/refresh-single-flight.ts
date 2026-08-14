import { createHash } from 'node:crypto';
import { setTimeout } from 'node:timers';

import { refresh } from '@/shared/api/generated';

const REFRESH_FLIGHT_GRACE_MS = 5_000;
type RefreshResult = Awaited<ReturnType<typeof refresh>>;

const refreshFlights = new Map<string, Promise<RefreshResult>>();

function getRefreshTokenFingerprint(refreshToken: string): string {
  return createHash('sha256').update(refreshToken).digest('base64url');
}

export function requestRefreshSingleFlight(refreshToken: string): Promise<RefreshResult> {
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
