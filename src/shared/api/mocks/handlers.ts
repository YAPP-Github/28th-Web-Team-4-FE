import { http, HttpResponse } from 'msw';

/**
 * 프론트에서 호출될 API 엔드포인트를 mock 합니다.
 * (핸들러에 없는 요청은 worker/server 설정의 onUnhandledRequest에 따라 bypass 됩니다.)
 */
export const handlers = [
  // origin(host/port)은 환경마다 달라질 수 있으니 path 기준으로 매칭합니다.
  http.get(/\/api\/health-check$/, () => {
    return HttpResponse.text('Hello, Next.js! (mocked by MSW)');
  }),
];
