import { isTrustedMutation } from './route-utils';

describe('auth BFF mutation origin checks', () => {
  it('accepts a same-origin browser request', () => {
    const request = new Request('https://chaeso-zip.com/api/auth/login', {
      headers: {
        origin: 'https://chaeso-zip.com',
        'sec-fetch-site': 'same-origin',
      },
    });

    expect(isTrustedMutation(request)).toBe(true);
  });

  it('rejects a mismatched origin', () => {
    const request = new Request('https://chaeso-zip.com/api/auth/login', {
      headers: { origin: 'https://attacker.example' },
    });

    expect(isTrustedMutation(request)).toBe(false);
  });

  it('rejects a cross-site fetch even without an Origin header', () => {
    const request = new Request('https://chaeso-zip.com/api/auth/login', {
      headers: { 'sec-fetch-site': 'cross-site' },
    });

    expect(isTrustedMutation(request)).toBe(false);
  });
});
