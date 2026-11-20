/**
 * ECS 컨테이너 상태 확인 전용 endpoint입니다.
 * 외부 분석·네트워크 호출을 하지 않아 장애 전파나 비용을 만들지 않습니다.
 */
export function getInternalHealthCheck() {
  return new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
