import { afterEach, describe, expect, it, vi } from 'vitest';

import { isMswEnabled } from './msw-enabled';

describe('isMswEnabled', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('disables MSW in production when NEXT_PUBLIC_MSW_ENABLED is unset', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_MSW_ENABLED', undefined);

    expect(isMswEnabled()).toBe(false);
  });

  it('disables MSW in production even when NEXT_PUBLIC_MSW_ENABLED is truthy', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_MSW_ENABLED', 'true');

    expect(isMswEnabled()).toBe(false);
  });

  it('enables MSW by default in development', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_MSW_ENABLED', undefined);

    expect(isMswEnabled()).toBe(true);
  });

  it('disables MSW in development when NEXT_PUBLIC_MSW_ENABLED is false', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('NEXT_PUBLIC_MSW_ENABLED', 'false');

    expect(isMswEnabled()).toBe(false);
  });

  it.each(['true', '1', 'on', 'yes'])(
    'enables MSW in development when NEXT_PUBLIC_MSW_ENABLED is %s',
    (value) => {
      vi.stubEnv('NODE_ENV', 'development');
      vi.stubEnv('NEXT_PUBLIC_MSW_ENABLED', value);

      expect(isMswEnabled()).toBe(true);
    },
  );

  it('disables MSW by default in test', () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.stubEnv('NEXT_PUBLIC_MSW_ENABLED', undefined);

    expect(isMswEnabled()).toBe(false);
  });
});
