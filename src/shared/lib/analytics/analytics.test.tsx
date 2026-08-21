/** Analytics compound component의 Context 전파와 renderless 클릭 합성을 검증한다. */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Analytics } from './analytics';

const { trackClientEventMock } = vi.hoisted(() => ({
  trackClientEventMock: vi.fn<(eventKey: string, properties: Record<string, unknown>) => void>(),
}));

vi.mock('./track-client', () => ({
  trackClientEvent: trackClientEventMock,
}));

describe('Analytics', () => {
  it('기존 DOM을 유지하고 child handler 뒤에 Scope 속성을 합쳐 전송한다', async () => {
    const user = userEvent.setup();
    const childClickHandler = vi.fn<() => void>();
    const { container } = render(
      <Analytics.Scope entryPoint="recommendation" isLoggedIn>
        <Analytics.Click event="channel_comparison_start" properties={{ channel_count: 2 }}>
          <button type="button" onClick={childClickHandler}>
            비교하기
          </button>
        </Analytics.Click>
      </Analytics.Scope>,
    );

    const button = screen.getByRole('button', { name: '비교하기' });
    expect(container.firstElementChild).toBe(button);

    await user.click(button);

    expect(childClickHandler).toHaveBeenCalledOnce();
    expect(trackClientEventMock).toHaveBeenCalledOnce();
    expect(trackClientEventMock).toHaveBeenCalledWith('channel_comparison_start', {
      entry_point: 'recommendation',
      is_logged_in: true,
      channel_count: 2,
    });
    expect(childClickHandler.mock.invocationCallOrder[0]).toBeLessThan(
      trackClientEventMock.mock.invocationCallOrder[0],
    );
  });
});
