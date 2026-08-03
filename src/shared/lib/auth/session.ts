import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

import { z } from 'zod';

import type { TokenResponse } from '@/shared/api/generated/types.gen';

const SESSION_VERSION = 'v1';
const SESSION_COOKIE_MAX_BYTES = 3_800;
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;

const sessionPayloadSchema = z.object({
  accessToken: z.string().min(1),
  accessTokenExpiresAt: z.number().int().positive(),
  refreshToken: z.string().min(1),
  refreshTokenExpiresAt: z.number().int().positive(),
});

export type AuthSession = z.infer<typeof sessionPayloadSchema>;

export const tokenResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  accessTokenExpiresIn: z.number().int().positive(),
  refreshTokenExpiresIn: z.number().int().positive(),
});

export function getSessionCookieName(): string {
  return process.env.NODE_ENV === 'production' ? '__Host-chaesozip-session' : 'chaesozip-session';
}

function getEncryptionKey(): Buffer {
  const encodedKey = process.env.SESSION_ENCRYPTION_KEY?.trim();

  if (!encodedKey) {
    throw new Error('SESSION_ENCRYPTION_KEY must be set.');
  }

  const key = Buffer.from(encodedKey, 'base64url');

  if (key.byteLength !== 32) {
    throw new Error('SESSION_ENCRYPTION_KEY must be a base64url-encoded 32-byte key.');
  }

  return key;
}

function getAdditionalAuthenticatedData(): Buffer {
  return Buffer.from(`${getSessionCookieName()}:${SESSION_VERSION}`, 'utf8');
}

export function createAuthSession(tokens: TokenResponse, now = Date.now()): AuthSession {
  const parsedTokens = tokenResponseSchema.parse(tokens);

  return {
    accessToken: parsedTokens.accessToken,
    accessTokenExpiresAt: now + parsedTokens.accessTokenExpiresIn * 1_000,
    refreshToken: parsedTokens.refreshToken,
    refreshTokenExpiresAt: now + parsedTokens.refreshTokenExpiresIn * 1_000,
  };
}

export function encryptAuthSession(session: AuthSession): string {
  const parsedSession = sessionPayloadSchema.parse(session);
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv('aes-256-gcm', getEncryptionKey(), iv);
  cipher.setAAD(getAdditionalAuthenticatedData());

  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(parsedSession), 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  const encryptedSession = [
    SESSION_VERSION,
    iv.toString('base64url'),
    ciphertext.toString('base64url'),
    authTag.toString('base64url'),
  ].join('.');

  if (Buffer.byteLength(encryptedSession, 'utf8') > SESSION_COOKIE_MAX_BYTES) {
    throw new Error('Encrypted auth session exceeds the safe cookie size.');
  }

  return encryptedSession;
}

export function decryptAuthSession(encryptedSession: string): AuthSession | null {
  try {
    const [version, encodedIv, encodedCiphertext, encodedAuthTag, extraPart] =
      encryptedSession.split('.');

    if (
      version !== SESSION_VERSION ||
      !encodedIv ||
      !encodedCiphertext ||
      !encodedAuthTag ||
      extraPart
    ) {
      return null;
    }

    const iv = Buffer.from(encodedIv, 'base64url');
    const ciphertext = Buffer.from(encodedCiphertext, 'base64url');
    const authTag = Buffer.from(encodedAuthTag, 'base64url');

    if (iv.byteLength !== IV_BYTES || authTag.byteLength !== AUTH_TAG_BYTES) {
      return null;
    }

    const decipher = createDecipheriv('aes-256-gcm', getEncryptionKey(), iv);
    decipher.setAAD(getAdditionalAuthenticatedData());
    decipher.setAuthTag(authTag);

    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
      'utf8',
    );
    const result = sessionPayloadSchema.safeParse(JSON.parse(plaintext));

    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function getSessionCookieOptions(refreshTokenExpiresAt: number) {
  const maxAge = Math.max(0, Math.floor((refreshTokenExpiresAt - Date.now()) / 1_000));

  return {
    name: getSessionCookieName(),
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
    priority: 'high' as const,
  };
}

export function extractTokenResponse(value: unknown): TokenResponse | null {
  const directResult = tokenResponseSchema.safeParse(value);

  if (directResult.success) {
    return directResult.data;
  }

  const nestedResult = z.object({ tokens: tokenResponseSchema }).safeParse(value);

  return nestedResult.success ? nestedResult.data.tokens : null;
}
