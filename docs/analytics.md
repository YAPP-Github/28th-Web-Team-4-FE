# 제품 분석 이벤트

제품 행동 이벤트의 속성 타입과 전송 대상은 `src/shared/lib/analytics/events.ts`의 `AnalyticsEventMap`, `ANALYTICS_EVENT_REGISTRY`에서 관리한다. 호출부는 `trackClientEvent`를 사용하며, registry가 PostHog·GA4 전송 여부와 실제 전송 이름을 결정한다.

기존 화면에 적용된 6개 이벤트는 이름·필수 속성·발생 시점과 양쪽 전송을 유지한다. 모든 명시적 이벤트에는 tracker가 `event_version`, `environment`, `feature_area`를 추가한다. `entry_point`, `is_logged_in`은 선택적 공통 속성이며, 개별 이벤트 계약에서 필수로 지정한 경우에는 반드시 전달한다.

분석 SDK 오류는 제품 흐름에 영향을 주지 않도록 도구별로 격리한다. 이메일, 서비스명, 사용자 입력값 등 식별 가능하거나 자유 형식인 값은 이벤트 속성으로 보내지 않는다.

## 현재 화면에 적용된 이벤트

| 이벤트 | 발생 조건 | 속성 | 전송 대상 |
| --- | --- | --- | --- |
| `recommend_onboarding_completed` | 추천 온보딩 제출 API 성공 | `service_name_prefilled: boolean` | PostHog, GA4 |
| `simulator_run_started` | 유효한 채널 선택을 마치고 시뮬레이션 결과로 이동 | `selected_channel_count: number` | PostHog, GA4 |
| `channel_comparison_started` | 유효한 채널 선택을 마치고 비교 결과로 이동 | `selected_channel_count: number` | PostHog, GA4 |
| `recommendation_result_saved` | 추천 결과 저장 API 성공 | `onboarding_migrated: boolean` | PostHog, GA4 |
| `simulation_result_saved` | 시뮬레이션 결과 저장 API 성공 | `channel_count: number` | PostHog, GA4 |
| `channel_comparison_result_saved` | 채널 비교 결과 저장 API 성공 | `channel_count: number`, `save_source: 'service_name' \| 'onboarding'` | PostHog, GA4 |

시작 이벤트는 입력 검증을 통과한 뒤 결과 화면으로 이동할 때 한 번 기록한다. 저장 이벤트는 API의 성공 콜백에서만 기록하므로 실패한 저장은 집계하지 않는다.

`health_check_requested`는 제품 분석에서 제거했다. 헬스체크는 외부 분석 서비스에 의존하지 않고 기존 200 응답을 반환한다. 기존 PostHog 대시보드의 헬스체크 필터/집계 정리는 별도 운영 작업이다.

## 기반 계약과 후속 계측

event map에는 후속 계측용 PRD 이벤트도 정의되어 있다. 예를 들어 `login`, `tutorial_complete`, `channel_detail_view`는 계약이 준비된 상태이며, 이번 통합에서 화면에 새 호출을 추가하지 않는다. `channel_detail_view`의 GA4 alias는 `select_content`이고 `comparison_search` 같은 상세 행동은 PostHog에만 전송한다. 전체 destination은 registry를 기준으로 확인한다.

`channel_comparison_started`와 `channel_comparison_start`처럼 비슷한 이름은 자동 alias가 아니다. 기존 화면에서는 위 카탈로그의 이벤트를 계속 사용한다. 같은 행동에서 기존 이벤트와 PRD 이벤트를 동시에 호출하지 않는다. 이름·속성·destination 전환은 대시보드와 GA4 Key event 영향, 적용 시점을 검토한 후 별도로 진행한다.

## 호출 방법

### 성공·검증 완료 이벤트

```ts
trackClientEvent(ANALYTICS_EVENTS.simulationResultSaved, {
  channel_count: simulationResult.items.length,
});
```

event key가 속성 타입을 결정한다. 필수 속성 누락, 잘못된 enum, 미등록 key는 컴파일 단계에서 거부한다. 객체를 변수로 전달해도 미등록 key를 검사한다. 속성이 없는 이벤트에는 `{}`를 전달한다.

SDK 호출은 각각 `try/catch`로 격리한다. PostHog 실패가 GA4 전송을 막지 않고, 어느 SDK의 동기 예외도 저장 완료 처리나 화면 이동에 전파하지 않는다. 런타임 sanitizer나 key 검사, nullish 제거, 예산 변환은 수행하지 않는다. `any` 또는 타입 단언으로 호출부 검사를 우회하지 않는다.

### 클릭과 Context

```tsx
import { Analytics } from '@/shared/lib/analytics/analytics';

<Analytics.Scope entryPoint="recommendation" isLoggedIn={isLoggedIn}>
  <Analytics.Click
    event="channel_detail_view"
    properties={{ channel_id: channelId, rank: 1 }}
  >
    <button type="button" onClick={openChannelDetail}>상세 보기</button>
  </Analytics.Click>
</Analytics.Scope>;
```

후속 클릭 계측의 사용 예시다. Scope가 `entry_point`, `is_logged_in`을 제공하므로 Click의 properties에서는 두 값을 중복 지정할 수 없다. 가까운 Scope의 두 값을 사용하며 중첩 Scope는 부모 값을 누적하지 않는다. Scope 밖에서 Click을 사용하면 오류가 발생한다.

Click은 단일 React element의 `onClick`을 합성하며 DOM wrapper를 추가하지 않는다. 커스텀 자식 컴포넌트는 받은 `onClick`을 실제 클릭 요소에 연결해야 한다. 기존 handler를 먼저 실행한 뒤 로깅하므로 handler가 예외를 던지면 로깅도 실행되지 않는다. handler 안에서 조건부로 행동을 취소하거나 검증 결과가 결정되는 경우에는 적절한 분기에서 tracker를 직접 호출한다. 저장 성공·실패와 비동기 결과는 성공·실패 콜백에서 기록한다.

명령형 `trackClientEvent`는 React Context를 자동으로 읽지 않는다. 필요한 공통 속성은 호출자가 전달한다. `useMemo`, event path, 별도의 클릭 이벤트 key 목록은 사용하지 않는다.

## 환경 변수

환경 변수와 시크릿은 Doppler에서 관리한다.

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | PostHog 프로젝트 토큰 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 측정 ID |
| `NEXT_PUBLIC_ANALYTICS_ENVIRONMENT` | `production` / `staging` / `development`. 미설정·잘못된 값은 비활성 처리 |
| `NEXT_PUBLIC_ANALYTICS_DEBUG` | `true`일 때 활성 환경에서 PostHog debug와 GA4 DebugView 활성화 |

`NODE_ENV === 'production'`이면서 analytics environment가 `production` 또는 `staging`일 때만 초기화·전송한다. 별도 `NEXT_PUBLIC_ANALYTICS_ENABLED` flag는 사용하지 않는다. 개발 서버와 테스트에서는 운영 키가 있어도 초기화하지 않는다. PostHog token 또는 GA measurement ID가 없는 도구는 초기화하지 않는다.

헬스체크가 유일한 사용처였던 서버 PostHog client와 `posthog-node` 의존성도 제거했다. `NEXT_PUBLIC_POSTHOG_HOST`는 현재 코드에서 사용하지 않으며, 브라우저는 기존 `/ingest` 프록시로 전송한다. Doppler의 기존 값은 이 작업에서 삭제하지 않는다.

PostHog는 `instrumentation-client.ts`에서 초기화하고 `loaded` 콜백으로 첫 자동 pageview 전에 `environment`를 공통 속성으로 등록한다. PostHog 초기화 예외는 Sentry와 API 오류 interceptor의 초기화를 막지 않는다. 기존 autocapture·pageview·replay 설정은 유지한다. GA의 자동 pageview에 별도의 environment 속성을 추가하는 설정은 이번 범위에 포함하지 않는다.

### 배포와 복구

- 배포 **빌드 전에** Doppler에서 `NEXT_PUBLIC_ANALYTICS_ENVIRONMENT`를 명시한다. 기존 배포에는 없던 값이므로, 누락한 채 배포하면 운영 수집이 중단된다. 이 저장소 작업에서는 Doppler 설정을 변경하지 않는다.
- `NEXT_PUBLIC_*`는 빌드에 고정된다. 환경을 바꾸려면 해당 환경값으로 다시 빌드·배포한다. staging은 별도 PostHog 프로젝트와 GA4 stream/property를 사용하는 것을 권장하며, 실제 분리 여부는 배포 담당자가 확인한다.
- 적용 후 기존 6개 이벤트를 각각 한 번 발생시켜 이름·필수 속성·발생 횟수·metadata와 양쪽 수신을 확인한다. SDK mock 테스트는 실제 수집 성공을 보장하지 않는다.
- 문제가 있으면 기존 배포 artifact로 되돌릴 수 있다. 이번 변경은 기존 이벤트 이름이나 수집 데이터를 삭제하지 않으므로 기존 대시보드를 유지할 수 있다. 이전 artifact로 복구하면 기존 헬스체크 계측과 환경 정책도 복원된다.

## 콘솔 설정

### PostHog

이벤트를 미리 등록할 필요는 없다. 배포 후 Live events에서 수신을 확인하고 다음 퍼널을 대시보드에 추가한다.

1. `recommend_onboarding_completed` → `recommendation_result_saved`
2. `simulator_run_started` → `simulation_result_saved`
3. `channel_comparison_started` → `channel_comparison_result_saved`

### GA4

배포 후 Realtime 또는 DebugView에서 이벤트 수신을 먼저 확인한다. 이벤트 속성을 보고서와 탐색에서 사용하려면 다음 Custom definitions를 등록한다.

- 이벤트 범위 측정기준: `service_name_prefilled`, `onboarding_migrated`, `save_source`
- 맞춤 측정항목: `selected_channel_count`, `channel_count`

비즈니스 핵심 행동으로 사용할 경우 `recommend_onboarding_completed`와 세 종류의 결과 저장 이벤트를 Key event로 지정한다. 시작 이벤트는 퍼널의 진입 단계로 사용하고 Key event로 지정하지 않는다.

## 변경 규칙

- 신규 이벤트는 `AnalyticsEventMap`과 `ANALYTICS_EVENT_REGISTRY`에 함께 등록한다. typed event key 문자열로 호출할 수 있다. `ANALYTICS_EVENTS`는 기존 화면 호출부를 유지하기 위한 상수이며 값은 event map의 key로 검증한다.
- 이벤트를 추가하거나 속성을 바꾸면 이 문서의 카탈로그와 콘솔 설정을 함께 갱신한다.
- 저장 이벤트는 성공 콜백에서만 호출한다.
- 이메일, 서비스명, 원문 검색어, 오류 메시지, 온보딩/저장 결과 ID 등 사용자 식별값과 자유 형식 입력값을 속성에 포함하지 않는다. 계약에서 명시한 카탈로그 `channel_id`만 허용한다.
