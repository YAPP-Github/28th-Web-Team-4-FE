import { timingSafeEqual } from 'node:crypto';

function getConfiguredBearerToken(): string | undefined {
  const token = process.env.OBSERVABILITY_METRICS_BEARER_TOKEN?.trim();

  if (!token) {
    return undefined;
  }

  return token;
}

function getRequestBearerToken(request: Request): string | undefined {
  const authorization = request.headers.get('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return undefined;
  }

  return authorization.slice('Bearer '.length).trim();
}

/**
 * `/api/metrics` 요청의 선택적 bearer token을 검증합니다.
 *
 * `OBSERVABILITY_METRICS_BEARER_TOKEN`이 없으면 메트릭 접근을 허용합니다. 내부망에서만
 * scrape하는 구성을 지원하기 위한 정책입니다. 공개 도메인에서 scrape한다면 endpoint를
 * 켜기 전에 token을 설정해야 합니다.
 */
export function isAuthorizedMetricsRequest(request: Request): boolean {
  const configuredToken = getConfiguredBearerToken();

  if (!configuredToken) {
    return true;
  }

  const receivedToken = getRequestBearerToken(request);

  if (!receivedToken) {
    return false;
  }

  const configured = Buffer.from(configuredToken);
  const received = Buffer.from(receivedToken);

  return configured.length === received.length && timingSafeEqual(configured, received);
}

/** 메트릭 인증 실패 시 사용할 표준 unauthorized 응답을 만듭니다. */
export function unauthorizedMetricsResponse(): Response {
  return new Response(null, {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Bearer',
    },
  });
}
