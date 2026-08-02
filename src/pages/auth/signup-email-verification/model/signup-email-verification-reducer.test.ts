import {
  initialSignupEmailVerificationState,
  signupEmailVerificationReducer,
  type SignupEmailVerificationState,
} from './signup-email-verification-reducer';

describe('signupEmailVerificationReducer', () => {
  it('updates the code without changing the current status', () => {
    expect(
      signupEmailVerificationReducer(
        { code: '', status: 'error', errorMessage: '인증 오류' },
        { type: 'codeChanged', code: '123456' },
      ),
    ).toEqual({ code: '123456', status: 'error', errorMessage: '인증 오류' });
  });

  it('stores an error while verification is not complete', () => {
    expect(
      signupEmailVerificationReducer(initialSignupEmailVerificationState, {
        type: 'failed',
        errorMessage: '발송 오류',
      }),
    ).toEqual({ code: '', status: 'error', errorMessage: '발송 오류' });
  });

  it('clears the code and error after resending succeeds', () => {
    expect(
      signupEmailVerificationReducer(
        { code: '123456', status: 'error', errorMessage: '인증 오류' },
        { type: 'resendSucceeded' },
      ),
    ).toEqual(initialSignupEmailVerificationState);
  });

  it('preserves verified state when a send result arrives later', () => {
    const verifiedState: SignupEmailVerificationState = {
      code: '123456',
      status: 'verified',
    };

    expect(
      signupEmailVerificationReducer(verifiedState, {
        type: 'failed',
        errorMessage: '늦게 도착한 발송 오류',
      }),
    ).toBe(verifiedState);
    expect(signupEmailVerificationReducer(verifiedState, { type: 'resendSucceeded' })).toBe(
      verifiedState,
    );
  });

  it('marks verification as complete and clears the previous error', () => {
    expect(
      signupEmailVerificationReducer(
        { code: '123456', status: 'error', errorMessage: '인증 오류' },
        { type: 'verified' },
      ),
    ).toEqual({ code: '123456', status: 'verified', errorMessage: undefined });
  });
});
