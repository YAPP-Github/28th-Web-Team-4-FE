import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Default Test Code', () => {
  it('true to be true', () => {
    expect(true).toBe(true);
  });

  it('can component mount', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <button>click</button>
      </div>,
    );

    await user.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toHaveTextContent('click');
  });
});
