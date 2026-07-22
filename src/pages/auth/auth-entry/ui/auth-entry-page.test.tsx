import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AuthEntryPage } from './auth-entry-page';

describe('AuthEntryPage', () => {
  it('renders the email and social authentication entry points', () => {
    render(<AuthEntryPage />);

    expect(screen.getByRole('heading', { name: '이메일로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: '이메일' })).toHaveAttribute('type', 'email');
    expect(screen.getByRole('button', { name: '이메일로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google로 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '비밀번호를 잊으셨나요?' })).toBeInTheDocument();
  });

  it('shows the email format error using the designed helper text', async () => {
    const user = userEvent.setup();
    render(<AuthEntryPage />);

    await user.type(screen.getByRole('textbox', { name: '이메일' }), 'invalid-email');
    await user.click(screen.getByRole('button', { name: '이메일로 시작하기' }));

    expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');
    expect(screen.getByRole('textbox', { name: '이메일' })).toHaveAttribute('aria-invalid', 'true');
  });

  it('validates the email after the user stops typing', async () => {
    vi.useFakeTimers();
    try {
      render(<AuthEntryPage />);

      fireEvent.change(screen.getByRole('textbox', { name: '이메일' }), {
        target: { value: 'invalid-email' },
      });

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();

      await act(() => vi.advanceTimersByTimeAsync(400));

      expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');

      fireEvent.change(screen.getByRole('textbox', { name: '이메일' }), {
        target: { value: 'user@example.com' },
      });

      expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');

      await act(() => vi.advanceTimersByTimeAsync(400));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });
});
