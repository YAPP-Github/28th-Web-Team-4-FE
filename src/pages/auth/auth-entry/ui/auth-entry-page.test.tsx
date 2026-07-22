import { render, screen, waitFor } from '@testing-library/react';
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
    const user = userEvent.setup();
    render(<AuthEntryPage />);
    const emailInput = screen.getByRole('textbox', { name: '이메일' });

    await user.type(emailInput, 'invalid-email');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');
    });

    await user.clear(emailInput);
    await user.type(emailInput, 'user@example.com');

    expect(screen.getByRole('alert')).toHaveTextContent('이메일 형식을 확인해 주세요.');

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
