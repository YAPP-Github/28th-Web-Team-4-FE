/** 이벤트 registry의 전송 계약과 이벤트별 속성 타입을 검증한다. */

import { describe, expect, it } from 'vitest';

import {
  ANALYTICS_EVENT_REGISTRY,
  type AnalyticsEventKey,
  type AnalyticsEventProperties,
  type ExactAnalyticsEventProperties,
} from './events';

function acceptEventProperties<
  EventKey extends AnalyticsEventKey,
  Properties extends AnalyticsEventProperties<NoInfer<EventKey>>,
>(_eventKey: EventKey, _properties: ExactAnalyticsEventProperties<EventKey, Properties>): void {}

describe('ANALYTICS_EVENT_REGISTRY', () => {
  it('binds each event key to its allowed property type', () => {
    expect(acceptEventProperties('login', { method: 'email' })).toBeUndefined();
    expect(acceptEventProperties('auth_verification_complete', {})).toBeUndefined();

    // @ts-expect-error login은 정의되지 않은 속성을 허용하지 않는다.
    acceptEventProperties('login', { method: 'email', email: 'person@example.com' });
    // @ts-expect-error login method는 allowlist 밖의 값을 허용하지 않는다.
    acceptEventProperties('login', { method: 'password' });
    // @ts-expect-error 속성이 없는 이벤트에는 임의 속성을 추가할 수 없다.
    acceptEventProperties('auth_verification_complete', { code: '123456' });

    const loginPropertiesWithEmail = {
      method: 'email',
      email: 'person@example.com',
    } as const;

    // @ts-expect-error 변수로 전달해도 이벤트 계약 밖의 key를 허용하지 않는다.
    acceptEventProperties('login', loginPropertiesWithEmail);
  });

  it('maps channel detail view to the GA4 recommended event alias', () => {
    expect(ANALYTICS_EVENT_REGISTRY.channel_detail_view).toEqual({
      destination: 'both',
      posthogEventName: 'channel_detail_view',
      ga4EventName: 'select_content',
      featureArea: 'recommendation',
      version: 1,
    });
  });

  it('keeps detailed product behavior events in PostHog only', () => {
    expect(ANALYTICS_EVENT_REGISTRY.comparison_search).toEqual({
      destination: 'posthog',
      posthogEventName: 'comparison_search',
      featureArea: 'comparison',
      version: 1,
    });
  });

  it('defines valid names and versions for every registry entry', () => {
    const definitions = Object.values(ANALYTICS_EVENT_REGISTRY);
    const eventNames = definitions.flatMap((definition) => [
      ...('posthogEventName' in definition ? [definition.posthogEventName] : []),
      ...('ga4EventName' in definition ? [definition.ga4EventName] : []),
    ]);

    for (const definition of definitions) {
      expect(definition.featureArea).toMatch(
        /^(auth|onboarding|recommendation|comparison|simulation|mypage)$/,
      );
      expect(definition.version).toBeGreaterThan(0);
    }

    for (const eventName of eventNames) {
      expect(eventName).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });
});
