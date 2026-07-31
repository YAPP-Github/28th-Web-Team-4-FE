import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Dropdown } from './dropdown';

const OPTIONS = [
  { value: 'development', label: '개발' },
  { value: 'design', label: '디자인' },
  { value: 'marketing', label: '마케팅' },
];

describe('Dropdown', () => {
  it('renders its placeholder and accessible name', () => {
    render(
      <Dropdown options={OPTIONS} placeholder="직무를 입력해 주세요" triggerAriaLabel="직무" />,
    );

    expect(screen.getByRole('combobox', { name: '직무' })).toHaveTextContent(
      '직무를 입력해 주세요',
    );
  });

  it('opens its options and selects a value', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<(value: string | null) => void>();

    render(
      <Dropdown
        options={OPTIONS}
        placeholder="직무를 입력해 주세요"
        triggerAriaLabel="직무"
        onValueChange={handleValueChange}
      />,
    );

    const trigger = screen.getByRole('combobox', { name: '직무' });
    await user.click(trigger);

    const developmentOption = await screen.findByRole('option', { name: '개발' });
    await user.click(developmentOption);

    expect(handleValueChange).toHaveBeenCalledWith('development', expect.anything());
    expect(screen.getByRole('combobox', { name: '직무' })).toHaveTextContent('개발');
  });

  it('prevents interaction when disabled', () => {
    render(
      <Dropdown
        options={OPTIONS}
        placeholder="직무를 입력해 주세요"
        triggerAriaLabel="직무"
        disabled
      />,
    );

    expect(screen.getByRole('combobox', { name: '직무' })).toBeDisabled();
  });
});
