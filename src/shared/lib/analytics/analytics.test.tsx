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
  it('고유 속성이 없는 이벤트에도 Scope 값을 전달한다', async () => {
    const user = userEvent.setup();
    render(
      <Analytics.Scope entryPoint="comparison_selection" isLoggedIn={false}>
        <Analytics.Click event="comparison_filter_apply" properties={{}}>
          <button type="button">필터 적용</button>
        </Analytics.Click>
      </Analytics.Scope>,
    );
    await user.click(screen.getByRole('button', { name: '필터 적용' }));
    expect(trackClientEventMock).toHaveBeenCalledOnce();
    expect(trackClientEventMock).toHaveBeenCalledWith('comparison_filter_apply', {
      entry_point: 'comparison_selection',
      is_logged_in: false,
    });
  });

  it('Click 속성에서도 미등록 key와 Scope 속성의 재입력을 거부한다', () => {
    const invalidElements = () => {
      const propertiesWithExtraKey = { selected_channel_count: 2, email: 'person@example.com' };
      const extra = (
        // @ts-expect-error 변수의 미등록 속성도 거부한다.
        <Analytics.Click event="channel_comparison_started" properties={propertiesWithExtraKey}>
          <button />
        </Analytics.Click>
      );
      const scopeOverride = (
        // @ts-expect-error Scope가 제공하는 속성은 중복 입력하지 않는다.
        <Analytics.Click event="comparison_filter_apply" properties={{ is_logged_in: true }}>
          <button />
        </Analytics.Click>
      );
      const unexpected = (
        // @ts-expect-error 고유 속성이 없는 이벤트에도 임의 속성을 추가할 수 없다.
        <Analytics.Click event="comparison_filter_apply" properties={{ code: '123' }}>
          <button />
        </Analytics.Click>
      );
      return [extra, scopeOverride, unexpected];
    };
    expect(invalidElements).toBeTypeOf('function');
  });

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
