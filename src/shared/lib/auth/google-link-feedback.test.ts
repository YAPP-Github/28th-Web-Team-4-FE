import { consumeGoogleLinkFeedback, markGoogleLinkFeedbackPending } from './google-link-feedback';

describe('Google link feedback', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('is consumed only once after navigation', () => {
    markGoogleLinkFeedbackPending();

    expect(consumeGoogleLinkFeedback()).toBe(true);
    expect(consumeGoogleLinkFeedback()).toBe(false);
  });

  it('does not fail login completion when storage writes are blocked', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is blocked', 'SecurityError');
    });

    expect(() => markGoogleLinkFeedbackPending()).not.toThrow();
  });

  it('skips the toast when storage reads are blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage is blocked', 'SecurityError');
    });

    expect(consumeGoogleLinkFeedback()).toBe(false);
  });
});
