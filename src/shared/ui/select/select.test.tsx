import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Select } from './select';

const OPTIONS = [
  { value: 'development', label: '개발' },
  { value: 'design', label: '디자인' },
  { value: 'marketing', label: '마케팅' },
];

describe('Select', () => {
  it('supports multiple selections with checkbox options and a custom value renderer', async () => {
    const user = userEvent.setup();
    const handleValueChange = vi.fn<(value: string[]) => void>();

    render(
      <Select
        options={OPTIONS}
        placeholder="직무를 입력해 주세요"
        triggerAriaLabel="직무"
        defaultValue={['development']}
        onValueChange={handleValueChange}
        renderValue={(values) => `${values.length}개 선택`}
      />,
    );

    const trigger = screen.getByRole('combobox', { name: '직무' });

    expect(trigger).toHaveTextContent('1개 선택');

    await user.click(trigger);

    const designOption = await screen.findByRole('option', { name: /디자인/ });

    expect(screen.getByRole('checkbox', { name: '개발 선택' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: '디자인 선택' })).not.toBeChecked();

    await user.click(designOption);

    expect(handleValueChange).toHaveBeenCalledWith(['development', 'design'], expect.anything());
    expect(trigger).toHaveTextContent('2개 선택');
    expect(screen.getByRole('checkbox', { name: '디자인 선택' })).toBeChecked();
    expect(screen.getByRole('option', { name: /디자인/ })).toBeInTheDocument();
  });

  it('prevents interaction when disabled', () => {
    render(
      <Select
        options={OPTIONS}
        placeholder="직무를 입력해 주세요"
        triggerAriaLabel="직무"
        disabled
      />,
    );

    expect(screen.getByRole('combobox', { name: '직무' })).toBeDisabled();
  });
});
