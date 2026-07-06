'use client';

import { sendGAEvent } from '@next/third-parties/google';
import posthog from 'posthog-js';

import type { AnalyticsEventName } from './events';

export function trackClientEvent(
  event: AnalyticsEventName,
  properties?: Record<string, string | number | boolean>,
) {
  posthog.capture(event, properties);
  sendGAEvent('event', event, properties);
}
