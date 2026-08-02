import { isMswEnabled } from './msw-enabled';

let started = false;

export async function startMsw() {
  if (!isMswEnabled()) {
    return;
  }

  if (started) {
    return;
  }

  started = true;

  // setupWorker는 브라우저에서만 동작하므로, 서버 번들 평가 시 실행되지 않게 동적 import 합니다.
  const { worker } = await import('./browser');

  await worker.start({
    // 핸들러에 없는 요청은 실제 네트워크로 그대로 전달합니다.
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
}
