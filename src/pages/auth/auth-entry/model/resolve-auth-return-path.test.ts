import { resolveAuthReturnPath } from './resolve-auth-return-path';

describe('resolveAuthReturnPath', () => {
  it('keeps a same-origin path', () => {
    expect(resolveAuthReturnPath('/recommend/onboarding-87')).toBe('/recommend/onboarding-87');
  });

  it('uses the first value when the query parameter is repeated', () => {
    expect(resolveAuthReturnPath(['/recommend/onboarding-87', '/mypage'])).toBe(
      '/recommend/onboarding-87',
    );
  });

  it.each([undefined, '', 'https://attacker.example', '//attacker.example'])(
    'falls back home for an unsafe return path: %s',
    (value) => {
      expect(resolveAuthReturnPath(value)).toBe('/');
    },
  );
});
