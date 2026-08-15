# Auth BFF 개발 가이드

채소ZIP은 인증 토큰을 브라우저에 노출하지 않기 위해 Next.js Route Handler를 BFF(Backend for
Frontend)로 사용합니다. 인증이 필요한 백엔드 API를 추가하거나 호출할 때 이 문서를 기준으로
구현합니다.

회원가입 화면의 단계, draft, validation, Google 분기는 [`signup-flow.md`](./signup-flow.md)를
참고합니다. FSD 레이어와 파일 배치는 [`architecture.md`](./architecture.md)를 따릅니다.

## 반드시 지킬 규칙

- 브라우저에서 인증이 필요한 백엔드 API를 직접 호출하지 않습니다.
- 브라우저 JavaScript에 access token과 refresh token을 전달하지 않습니다.
- 인증이 필요한 요청은 반드시 Next.js BFF Route Handler를 거칩니다.
- BFF가 HttpOnly 세션 쿠키를 읽고 백엔드 요청에 access token을 추가합니다.
- 클라이언트의 로그인 상태는 UI 표시용이며 서버 권한 검사의 근거가 아닙니다.
- 보호 데이터 API는 요청마다 서버에서 세션을 검증합니다.
- 토큰, 쿠키 평문, 암호화 키를 응답 body나 로그에 남기지 않습니다.

## 요청 구조

```text
브라우저
  │
  │ 1. 토큰 없는 same-origin 요청
  ▼
Next.js Route Handler (BFF)
  │
  ├─ 2. HttpOnly 세션 쿠키 복호화
  ├─ 3. access token 유효성 확인
  ├─ 4. 필요하면 refresh token 회전 및 쿠키 교체
  │
  │ 5. Authorization: Bearer <accessToken>
  ▼
백엔드 API
  │
  │ 6. 토큰을 제외한 필요한 데이터만 반환
  ▼
브라우저
```

브라우저는 세션 쿠키를 직접 읽지 못합니다. 같은 origin의 BFF 요청에 쿠키가 자동으로 포함되고,
BFF만 복호화된 토큰에 접근합니다.

## 주요 코드 위치

| 역할 | 위치 |
| --- | --- |
| Route Handler 진입점 | `app/api/**/route.ts` |
| BFF 구현 | `src/app/api-routes/` |
| 인증 BFF 구현 | `src/app/api-routes/auth/` |
| 쿠키 읽기·쓰기·삭제 | `src/app/api-routes/auth/session-cookie.ts` |
| 세션 암호화·만료 계산 | `src/shared/lib/auth/session.ts` |
| 요청 출처·오류 처리 | `src/app/api-routes/auth/route-utils.ts` |
| 생성된 백엔드 SDK | `src/shared/api/generated/` |
| 클라이언트 세션 기능 | `src/features/auth/session/` |

루트 `app/api/**/route.ts`에는 로직을 작성하지 않고 `src/app/api-routes/**`의 구현을 얇게
re-export합니다.

```ts
// app/api/example/route.ts
export { getExample as GET } from '@/app/api-routes/example';
```

## BFF를 거쳐야 하는 요청

다음 중 하나라도 해당하면 BFF를 사용합니다.

- access token이 필요한 백엔드 API
- 사용자별 데이터 조회·생성·수정·삭제
- refresh token 또는 세션 쿠키를 사용하는 요청
- 응답에 서비스 토큰이 포함되는 로그인·소셜 인증·회원가입 요청
- 브라우저에 공개하면 안 되는 서버 전용 자격 증명을 사용하는 요청

공개 API라도 이후 사용자별 응답이나 인증이 추가될 가능성이 높다면 처음부터 BFF 경계를 두는
편이 안전합니다.

## 공통 백엔드 프록시

브라우저에서 생성된 API 클라이언트를 사용할 때는 `src/shared/api/hey-api.ts`가 base URL을
same-origin인 `/api/backend`로 설정합니다. `app/api/backend/[...path]/route.ts`는 이 요청을
백엔드로 전달하며, 서버에서 읽은 HttpOnly 세션의 access token을 `Authorization` 헤더에
추가합니다.

```text
브라우저 generated SDK
  └─ /api/backend/api/v1/...
       └─ Next.js backend-proxy
            └─ https://api.chaeso-zip.com/api/v1/...
                 └─ Authorization: Bearer <accessToken>
```

프록시는 클라이언트가 보낸 `Authorization` 헤더를 신뢰하지 않고 세션 쿠키에서 얻은 토큰만
사용합니다. access token이 만료에 가까우면 refresh single-flight를 거쳐 세션 쿠키를 교체한
뒤 요청하며, 백엔드가 401을 반환하면 한 번만 refresh 후 재요청합니다. 세션이 없는 공개 API는
토큰 없이 백엔드로 전달됩니다.

서버 코드에서 generated SDK를 직접 호출하는 경우에는 기존처럼 해당 Route Handler에서
`auth: session.accessToken`을 명시합니다. 브라우저의 same-origin 호출만 공통 프록시를
사용합니다.

## 인증이 필요한 API 추가 방법

예를 들어 로그인한 사용자의 프로필 API를 추가한다고 가정합니다.

### 1. Route Handler 진입점 추가

```ts
// app/api/me/route.ts
export { getMe as GET } from '@/app/api-routes/me';
```

### 2. BFF에서 세션 확인

```ts
// src/app/api-routes/me.ts
import { readAuthSession } from '@/app/api-routes/auth/session-cookie';
import { upstreamErrorResponse } from '@/app/api-routes/auth/route-utils';
import { getMe as getBackendMe } from '@/shared/api/generated';

export async function getMe(): Promise<Response> {
  const session = await readAuthSession();

  if (!session || session.refreshTokenExpiresAt <= Date.now()) {
    return new Response(null, { status: 401 });
  }

  const result = await getBackendMe({ auth: session.accessToken });

  if (result.error !== undefined) {
    return upstreamErrorResponse(result.error, result.response?.status);
  }

  return Response.json(result.data);
}
```

위 코드는 구조를 설명하기 위한 최소 예시입니다. access token 만료 처리와 오류 응답은 아래 공통
정책을 따라야 합니다.

### 3. 브라우저에서는 BFF만 호출

```ts
export async function getMyProfile(): Promise<MyProfile> {
  const response = await fetch('/api/me', {
    cache: 'no-store',
    credentials: 'same-origin',
  });

  return parseJsonResponse<MyProfile>(response);
}
```

다음처럼 generated SDK를 브라우저에서 직접 호출하거나 토큰을 주입하면 안 됩니다.

```ts
// 금지: 브라우저 코드에서 인증 백엔드를 직접 호출
await getBackendMe({ auth: accessToken });
```

## Access token 만료 처리

세션 쿠키에는 access token과 refresh token의 만료 시각이 함께 저장됩니다.

```ts
type AuthSession = {
  accessToken: string;
  accessTokenExpiresAt: number;
  refreshToken: string;
  refreshTokenExpiresAt: number;
};
```

현재 클라이언트의 `AuthSessionManager`는 access token 만료 30초 전에
`POST /api/auth/refresh`를 호출합니다. BFF는 refresh token으로 새 토큰 쌍을 발급받아 쿠키를
교체합니다.

하지만 브라우저 타이머만 신뢰해서는 안 됩니다. 백그라운드 탭, 절전 모드, 네트워크 지연 때문에
만료 후 API 요청이 먼저 도착할 수 있습니다. 인증 BFF 공통화 시 다음 정책을 적용해야 합니다.

1. BFF가 access token 만료 시각을 확인합니다.
2. 만료가 임박했으면 서버에서 한 번만 refresh합니다.
3. 새 access token으로 원래 요청을 수행합니다.
4. refresh가 실패하면 쿠키를 삭제하고 클라이언트에 실패를 반환합니다.
5. 동일 refresh token을 동시에 회전하지 않도록 요청을 직렬화합니다.

Refresh token 회전은 요청 성공 여부가 불확실한 네트워크 오류에서 같은 토큰을 안전하게 재사용할
수 없습니다. 따라서 클라이언트는 refresh를 자동 재시도하지 않으며, 한 번이라도 실패하면
로그아웃 정리를 시도하고 재로그인을 요청합니다. 동일 서버 인스턴스에 동시에 들어온 요청은 BFF
single-flight가 최초 요청의 결과를 공유합니다.

현재 refresh single-flight는 서버 프로세스 메모리 기반입니다. 다중 서버 인스턴스까지 보장해야
하면 Redis 등 공유 저장소를 사용하는 분산 잠금 또는 서버 세션 구조가 필요합니다.

## Mutation BFF 보안

`POST`, `PUT`, `PATCH`, `DELETE` Route Handler는 `isTrustedMutation(request)`로 요청 출처를
검사합니다.

```ts
export async function postExample(request: Request): Promise<Response> {
  if (!isTrustedMutation(request)) {
    return forbiddenMutationResponse();
  }

  // body 검증 및 백엔드 요청
}
```

추가로 지켜야 할 사항:

- `request.json()` 결과는 Zod schema로 검증합니다.
- 브라우저가 전달한 사용자 ID를 그대로 신뢰하지 않습니다.
- 사용자 식별은 검증된 access token의 주체를 기준으로 백엔드에서 결정합니다.
- 백엔드 오류는 `upstreamErrorResponse` 등 정해진 형태로 변환합니다.
- 토큰이나 세션 전체 객체를 `console.log` 또는 관측 도구에 전달하지 않습니다.
- 사용자 입력을 백엔드 URL이나 헤더에 검증 없이 조합하지 않습니다.

## 세션 상태 API

브라우저는 `GET /api/auth/session`으로 다음 정보만 받을 수 있습니다.

```ts
type AuthSessionState =
  | { authenticated: false }
  | { authenticated: true; accessTokenExpiresAt: number };
```

토큰과 사용자 권한 정보는 이 응답에 포함하지 않습니다. UI에서 로그인 여부가 필요하면 별도
상태를 만들지 말고 `useAuthSession()`을 사용합니다.

```tsx
const { data, isAuthenticated, isPending } = useAuthSession();
```

`isAuthenticated`는 헤더 같은 UI 분기에만 사용합니다. 이 값을 근거로 보호 데이터를 반환하거나
서버 권한 검사를 생략하면 안 됩니다.

`(with-header)` 서버 레이아웃은 복호화한 세션에서 토큰을 제외한 `AuthSessionState`만 React
Query에 hydrate합니다. 따라서 첫 렌더부터 서버와 헤더의 로그인 상태가 일치하며, 브라우저에
access token이나 refresh token은 직렬화되지 않습니다.

## 페이지 접근 제어와 API 권한 검사의 차이

현재 로그인 사용자의 인증 화면 접근은 `AuthLayout`, 비로그인 사용자의 `/mypage` 접근은
`ProtectedLayout`이 제어합니다.

```tsx
// app/(with-header)/new-protected-page/layout.tsx
export { ProtectedLayout as default } from '@/app/layouts/protected-layout';
```

페이지 리다이렉트는 UX를 위한 낙관적 검사입니다. 사용자가 Route Handler URL을 직접 호출할 수
있으므로 데이터 보안은 BFF의 세션·권한 검사가 담당해야 합니다.

```text
ProtectedLayout ── 화면 접근 UX
       +
BFF 인증 검사 ──── 실제 데이터 보호
```

둘 중 하나만 구현해서는 안 됩니다.

## 로그아웃과 세션 종료

브라우저는 `POST /api/auth/logout`만 호출합니다. BFF가 백엔드 세션을 폐기하고 로컬 쿠키를
삭제합니다. 브라우저가 refresh token을 전달하거나 직접 백엔드 logout API를 호출하지 않습니다.

로그아웃 요청은 네트워크 오류가 나더라도 서버에서는 완료됐을 수 있습니다. 클라이언트 오류
처리에서는 `/api/auth/session`을 다시 조회해 실제 상태로 수렴해야 합니다.

## 환경 변수

| 변수 | 용도 | 노출 범위 |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API base URL | 브라우저 포함 |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google Identity Services | 브라우저 포함 |
| `BFF_ALLOWED_ORIGINS` | mutation BFF가 허용할 요청 origin 목록(쉼표 구분) | 서버 전용 |
| `SESSION_ENCRYPTION_KEY` | 세션 쿠키 암복호화 | 서버 전용 |

`BFF_ALLOWED_ORIGINS`는 다음 값으로 Doppler의 서버 환경에 추가합니다.

```text
BFF_ALLOWED_ORIGINS=https://chaeso-zip.com,http://localhost:3000
```

`BFF_ALLOWED_ORIGINS`와 `SESSION_ENCRYPTION_KEY`는 Doppler로만 관리하고 저장소나 클라이언트
코드에 추가하지 않습니다. `BFF_ALLOWED_ORIGINS`는 프록시 내부 host가 아닌 브라우저가 접근하는
공개 origin을 사용해야 합니다.

```bash
doppler run -- node --run dev
```

## 테스트 체크리스트

새 인증 BFF 또는 보호 API를 추가할 때 다음 항목을 테스트합니다.

- [ ] 세션이 없으면 `401`을 반환하는가?
- [ ] refresh token이 만료되면 쿠키를 삭제하는가?
- [ ] 유효한 access token이 generated SDK의 `auth`에 전달되는가?
- [ ] 응답 body에 access token과 refresh token이 포함되지 않는가?
- [ ] mutation이 다른 origin의 요청을 거부하는가?
- [ ] 잘못된 request body를 백엔드로 전달하지 않는가?
- [ ] 백엔드 `401`, `403`, `5xx`를 의도한 상태로 변환하는가?
- [ ] 동시에 들어온 refresh 요청이 한 번만 수행되는가?
- [ ] 로그아웃 또는 refresh 실패 후 클라이언트 세션 상태가 서버와 일치하는가?

```bash
node --run fmt:check
node --run lint
node --run test:ci -- --project unit
node --run build
```

## 구현 전 확인사항

- 이 API는 인증이 필요한가?
- 브라우저가 generated SDK를 직접 호출하고 있지 않은가?
- BFF에서 세션과 권한을 다시 확인하는가?
- access token 만료 시 동작이 정의되어 있는가?
- refresh token 회전이 중복될 가능성이 없는가?
- 토큰이 응답·로그·에러 객체에 노출되지 않는가?
- Route Handler가 FSD 구현을 얇게 re-export하는가?
- 관련 정상·실패·동시성 테스트가 있는가?
