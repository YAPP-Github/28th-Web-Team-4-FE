const GOOGLE_LINKED_FEEDBACK_KEY = 'google-account-linked';

export function markGoogleLinkFeedbackPending(): void {
  try {
    sessionStorage.setItem(GOOGLE_LINKED_FEEDBACK_KEY, 'true');
  } catch {
    // Toast 피드백은 부가 기능이므로 저장소 접근 실패가 로그인 완료를 막지 않는다.
  }
}

export function consumeGoogleLinkFeedback(): boolean {
  try {
    const isPending = sessionStorage.getItem(GOOGLE_LINKED_FEEDBACK_KEY) === 'true';
    sessionStorage.removeItem(GOOGLE_LINKED_FEEDBACK_KEY);
    return isPending;
  } catch {
    return false;
  }
}
