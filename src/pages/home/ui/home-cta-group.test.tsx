import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { HomeCtaGroup } from './home-cta-group';

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn<(href: string) => void>(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

describe('HomeCtaGroup', () => {
  afterEach(() => {
    pushMock.mockReset();
  });

  it('navigates to onboarding with the trimmed service name', async () => {
    const user = userEvent.setup();

    render(<HomeCtaGroup />);

    await user.type(screen.getByRole('textbox', { name: '서비스 이름' }), '  채소집  ');
    await user.click(screen.getByRole('button', { name: '추천 시작' }));

    const assignedUrl = new URL(pushMock.mock.calls[0]?.[0] ?? '', 'http://localhost');

    expect(assignedUrl.pathname).toBe('/recommend/onboarding/new');
    expect(assignedUrl.searchParams.get('serviceName')).toBe('채소집');
  });

  it('disables submit until a service name is entered', () => {
    render(<HomeCtaGroup />);

    expect(screen.getByRole('button', { name: '추천 시작' })).toBeDisabled();
  });
});
