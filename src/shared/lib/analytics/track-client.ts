'use client';

import { sendGAEvent } from '@next/third-parties/google';
import posthog from 'posthog-js';

import type { AnalyticsEventName } from './events';

export function trackClientEvent(
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean>,
) {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  try {
    posthog.capture(event, properties);
  } catch {
    // 분석 실패가 사용자 동작을 막지 않도록 예외를 전파하지 않는다.
  }

  try {
    sendGAEvent('event', event, properties ?? {});
  } catch {
    // 한 분석 도구의 실패가 다른 도구나 제품 흐름에 영향을 주지 않는다.
  }
}
