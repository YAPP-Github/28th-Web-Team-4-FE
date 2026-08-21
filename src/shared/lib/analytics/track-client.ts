'use client';

/** typed event registry를 사용해 GA4와 PostHog 전송을 분기하는 클라이언트 facade. */

import { sendGAEvent } from '@next/third-parties/google';
import posthog from 'posthog-js';

import { getClientAnalyticsConfig } from './analytics-config';
import {
  ANALYTICS_EVENT_REGISTRY,
  type AnalyticsEventDefinition,
  type AnalyticsEventKey,
  type AnalyticsEventProperties,
  type ExactAnalyticsEventProperties,
} from './events';

/**
 * 이벤트 key와 일치하는 속성을 registry에 정의된 분석 도구로 전송한다.
 * 비활성 환경에서는 SDK를 호출하지 않으며 호출부는 실제 SDK 이름을 알지 않는다.
 *
 * @param eventKey 내부 이벤트 key
 * @param properties 이벤트별 허용 속성
 */
export function trackClientEvent<
  EventKey extends AnalyticsEventKey,
  Properties extends AnalyticsEventProperties<NoInfer<EventKey>>,
>(eventKey: EventKey, properties: ExactAnalyticsEventProperties<EventKey, Properties>): void {
  const analyticsConfig = getClientAnalyticsConfig();

  if (!analyticsConfig.enabled) {
    return;
  }

  const definition: AnalyticsEventDefinition = ANALYTICS_EVENT_REGISTRY[eventKey];
  const propertiesWithMetadata = {
    ...properties,
    event_version: definition.version,
    environment: analyticsConfig.environment,
    feature_area: definition.featureArea,
  };

  if ('posthogEventName' in definition) {
    posthog.capture(definition.posthogEventName, propertiesWithMetadata);
  }

  if ('ga4EventName' in definition) {
    sendGAEvent('event', definition.ga4EventName, propertiesWithMetadata);
  }
}
