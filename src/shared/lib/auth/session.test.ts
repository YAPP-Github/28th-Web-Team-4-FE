import type { TokenResponse } from '@/shared/api/generated/types.gen';

import {
  createAuthSession,
  decryptAuthSession,
  encryptAuthSession,
  extractTokenResponse,
  getSessionCookieOptions,
} from './session';

const encryptionKey = Buffer.alloc(32, 7).toString('base64url');
const tokens: TokenResponse = {
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
  accessTokenExpiresIn: 600,
  refreshTokenExpiresIn: 7_200,
};

describe('encrypted auth session', () => {
  beforeEach(() => {
    vi.stubEnv('SESSION_ENCRYPTION_KEY', encryptionKey);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('encrypts and decrypts service tokens without exposing plaintext', () => {
    const session = createAuthSession(tokens, 1_000);
    const encrypted = encryptAuthSession(session);

    expect(encrypted).not.toContain(tokens.accessToken);
    expect(encrypted).not.toContain(tokens.refreshToken);
    expect(decryptAuthSession(encrypted)).toEqual(session);
  });

  it('rejects a modified encrypted session', () => {
    const encrypted = encryptAuthSession(createAuthSession(tokens));
    const [version, iv, ciphertext, authTag] = encrypted.split('.');
    const tamperedCiphertext = `${ciphertext?.startsWith('a') ? 'b' : 'a'}${ciphertext?.slice(1)}`;
    const tampered = [version, iv, tamperedCiphertext, authTag].join('.');

    expect(decryptAuthSession(tampered)).toBeNull();
  });

  it('rejects a session encrypted with another key', () => {
    const encrypted = encryptAuthSession(createAuthSession(tokens));
    vi.stubEnv('SESSION_ENCRYPTION_KEY', Buffer.alloc(32, 8).toString('base64url'));

    expect(decryptAuthSession(encrypted)).toBeNull();
  });

  it('requires a 32-byte base64url encryption key', () => {
    vi.stubEnv('SESSION_ENCRYPTION_KEY', Buffer.alloc(16).toString('base64url'));

    expect(() => encryptAuthSession(createAuthSession(tokens))).toThrow(
      'SESSION_ENCRYPTION_KEY must be a base64url-encoded 32-byte key.',
    );
  });

  it('uses hardened cookie options', () => {
    vi.spyOn(Date, 'now').mockReturnValue(1_000);
    const expiresAt = 61_000;

    expect(getSessionCookieOptions(expiresAt)).toMatchObject({
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60,
      priority: 'high',
    });
  });

  it('accepts direct and nested token response shapes', () => {
    expect(extractTokenResponse(tokens)).toEqual(tokens);
    expect(extractTokenResponse({ tokens })).toEqual(tokens);
    expect(extractTokenResponse({ accessToken: '' })).toBeNull();
  });
});
