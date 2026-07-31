export type SignupEmailVerificationState = {
  code: string;
  status: 'error' | 'verified' | 'waiting';
  errorMessage?: string;
};

type SignupEmailVerificationAction =
  | { type: 'codeChanged'; code: string }
  | { type: 'failed'; errorMessage?: string }
  | { type: 'resendSucceeded' }
  | { type: 'verified' };

export const initialSignupEmailVerificationState: SignupEmailVerificationState = {
  code: '',
  status: 'waiting',
};

export function signupEmailVerificationReducer(
  state: SignupEmailVerificationState,
  action: SignupEmailVerificationAction,
): SignupEmailVerificationState {
  switch (action.type) {
    case 'codeChanged':
      return { ...state, code: action.code };
    case 'failed':
      return state.status === 'verified'
        ? state
        : { ...state, status: 'error', errorMessage: action.errorMessage };
    case 'resendSucceeded':
      return state.status === 'verified' ? state : initialSignupEmailVerificationState;
    case 'verified':
      return { ...state, status: 'verified', errorMessage: undefined };
  }
}
