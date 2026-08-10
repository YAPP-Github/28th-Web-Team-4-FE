import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider } from 'react-hook-form';
import type { JSX } from 'react';

import type { RecommendOnboardingDraft } from '@/features/ad-onboarding/model/onboarding-draft';
import { useRecommendOnboardingForm } from '@/features/ad-onboarding/model/use-recommend-onboarding-form';

import { AdExperienceStepContent } from './ad-experience-step-content';

function renderAdExperienceStep() {
  let submittedDraft: RecommendOnboardingDraft | undefined;

  function TestHarness(): JSX.Element {
    const form = useRecommendOnboardingForm();

    return (
      <FormProvider {...form}>
        <AdExperienceStepContent
          onAction={() => {
            submittedDraft = form.getValues();
          }}
        />
      </FormProvider>
    );
  }

  const view = render(<TestHarness />);

  return {
    ...view,
    getSubmittedDraft: () => submittedDraft,
  };
}

describe('AdExperienceStepContent', () => {
  it('clears uploaded performance files before skipping performance input', async () => {
    const user = userEvent.setup();
    const { container, getSubmittedDraft } = renderAdExperienceStep();

    await user.click(screen.getByRole('radio', { name: '광고를 운영해 봤어요' }));
    await user.click(screen.getByRole('button', { name: '다음' }));

    const fileInput = container.querySelector<HTMLInputElement>('input[type="file"]');
    const file = new File(['performance'], 'meta-performance.csv', {
      type: 'text/csv',
      lastModified: 1,
    });

    expect(fileInput).not.toBeNull();
    if (!fileInput) {
      return;
    }

    await user.upload(fileInput, file);
    expect(screen.getByText('meta-performance.csv')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '건너뛰기' }));

    expect(getSubmittedDraft()).toMatchObject({
      adExperienceType: 'EXPERIENCED',
      performanceFileList: [],
      performanceChannel: undefined,
    });
  });
});
