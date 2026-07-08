import { isMswEnabled } from './msw-enabled';
import { worker } from './browser';

let started = false;

export async function startMsw() {
  if (!isMswEnabled()) {
    return;
  }

  if (started) {
    return;
  }

  started = true;

  await worker.start({
    // 핸들러에 없는 요청은 실제 네트워크로 그대로 전달합니다.
    onUnhandledRequest: 'bypass',
    quiet: true,
  });
}
