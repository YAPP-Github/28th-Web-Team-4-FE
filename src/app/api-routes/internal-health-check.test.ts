import { describe, expect, it } from 'vitest';

import { getInternalHealthCheck } from '@/app/api-routes/internal-health-check';

describe('getInternalHealthCheck', () => {
  it('returns a no-content response without caching', () => {
    const response = getInternalHealthCheck();

    expect(response.status).toBe(204);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
  });
});
