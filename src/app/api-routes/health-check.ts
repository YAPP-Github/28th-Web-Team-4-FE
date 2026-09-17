/** 외부 서비스가 애플리케이션 생존 여부를 확인할 수 있는 최소 응답을 반환한다. */
export function getHealthCheck() {
  return new Response('Hello, Next.js!', {
    status: 200,
  });
}
