import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { StepBar } from './step-bar';

vi.mock('@number-flow/react', () => ({
  default: ({ value, suffix }: { value: number; suffix?: string }) => (
    <span>
      {value}
      {suffix}
    </span>
  ),
}));

const ONBOARDING_LABELS = [0, 12, 25, 37, 50, 62, 75, 87, 100];

function renderStepBar(currentStep: number) {
  return render(<StepBar currentStep={currentStep} totalSteps={8} labels={ONBOARDING_LABELS} />);
}

describe('StepBar', () => {
  it('renders the initial step label and aria value', () => {
    renderStepBar(0);

    const progressBar = screen.getByRole('progressbar', { name: '진행률' });

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
    expect(progressBar).toHaveAttribute('aria-valuetext', '0%');
  });

  it('renders active segments and label for the current step', () => {
    renderStepBar(3);

    expect(screen.getByText('37%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '3');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '37%');
  });

  it('renders the completed state', () => {
    renderStepBar(8);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '8');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '100%');
  });

  it('clamps a current step outside the valid range', () => {
    const { rerender } = render(
      <StepBar currentStep={-1} totalSteps={8} labels={ONBOARDING_LABELS} />,
    );

    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '0%');

    rerender(<StepBar currentStep={10} totalSteps={8} labels={ONBOARDING_LABELS} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '8');
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '100%');
  });

  it('throws when labels length does not match total steps', () => {
    expect(() => render(<StepBar currentStep={1} totalSteps={8} labels={[0, 100]} />)).toThrow(
      'StepBar labels length must equal totalSteps + 1.',
    );
  });

  it('throws when labels contain a non-finite value', () => {
    expect(() =>
      render(<StepBar currentStep={1} totalSteps={1} labels={[0, Number.NaN]} />),
    ).toThrow('StepBar labels must contain only finite numbers.');
  });

  it('throws when total steps is invalid', () => {
    expect(() => render(<StepBar currentStep={0} totalSteps={0} labels={[0]} />)).toThrow(
      'StepBar totalSteps must be an integer greater than or equal to 1.',
    );
  });

  it('does not render the label when showLabel is false', () => {
    render(<StepBar currentStep={3} totalSteps={8} labels={ONBOARDING_LABELS} showLabel={false} />);

    expect(screen.queryByText('37%')).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '37%');
  });
});
