/** 헬스체크가 분석 전송 없이 생존 응답만 반환하는지 검증한다. */

import { describe, expect, it } from 'vitest';

import { getHealthCheck } from './health-check';

describe('getHealthCheck', () => {
  it('성공 상태와 고정 응답을 반환한다', async () => {
    const response = getHealthCheck();

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toBe('Hello, Next.js!');
  });
});
