import { render } from '@testing-library/react';

import { consumeGoogleLinkFeedback } from '@/shared/lib/auth/google-link-feedback';
import { showToast } from '@/shared/ui/toast';

import { GoogleLinkSuccessToast } from './google-link-success-toast';

vi.mock('@/shared/lib/auth/google-link-feedback', () => ({
  consumeGoogleLinkFeedback: vi.fn<typeof consumeGoogleLinkFeedback>(),
}));
vi.mock('@/shared/ui/toast', () => ({
  showToast: vi.fn<typeof showToast>(),
}));

const consumeGoogleLinkFeedbackMock = vi.mocked(consumeGoogleLinkFeedback);
const showToastMock = vi.mocked(showToast);

describe('GoogleLinkSuccessToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows the success toast when link feedback is pending', () => {
    consumeGoogleLinkFeedbackMock.mockReturnValue(true);

    render(<GoogleLinkSuccessToast />);

    expect(showToastMock).toHaveBeenCalledWith({
      id: 'google-account-linked',
      description: '기존 이메일 계정과 Google 계정이 연결되었어요.',
    });
  });

  it('does not show a toast without pending link feedback', () => {
    consumeGoogleLinkFeedbackMock.mockReturnValue(false);

    render(<GoogleLinkSuccessToast />);

    expect(showToastMock).not.toHaveBeenCalled();
  });
});
