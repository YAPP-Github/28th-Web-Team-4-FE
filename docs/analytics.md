# 제품 분석 이벤트

제품 행동 이벤트의 이름과 발생 조건은 `src/shared/lib/analytics/events.ts`를 단일 소스로 사용한다. 클라이언트 이벤트는 프로덕션에서만 `trackClientEvent`를 통해 PostHog와 GA4에 같은 이름으로 전송한다.

분석 SDK 오류는 제품 흐름에 영향을 주지 않도록 도구별로 격리한다. 이메일, 서비스명, 사용자 입력값 등 식별 가능하거나 자유 형식인 값은 이벤트 속성으로 보내지 않는다.

## 이벤트 카탈로그

| 이벤트 | 발생 조건 | 속성 | 전송 대상 |
| --- | --- | --- | --- |
| `recommend_onboarding_completed` | 추천 온보딩 제출 API 성공 | `service_name_prefilled: boolean` | PostHog, GA4 |
| `simulator_run_started` | 유효한 채널 선택을 마치고 시뮬레이션 결과로 이동 | `selected_channel_count: number` | PostHog, GA4 |
| `channel_comparison_started` | 유효한 채널 선택을 마치고 비교 결과로 이동 | `selected_channel_count: number` | PostHog, GA4 |
| `recommendation_result_saved` | 추천 결과 저장 API 성공 | `onboarding_migrated: boolean` | PostHog, GA4 |
| `simulation_result_saved` | 시뮬레이션 결과 저장 API 성공 | `channel_count: number` | PostHog, GA4 |
| `channel_comparison_result_saved` | 채널 비교 결과 저장 API 성공 | `channel_count: number`, `save_source: 'service_name' \| 'onboarding'` | PostHog, GA4 |
| `health_check_requested` | 프로덕션 운영 상태 확인 API 호출 | `source: 'api'` | PostHog |

시작 이벤트는 입력 검증을 통과한 뒤 결과 화면으로 이동할 때 한 번 기록한다. 저장 이벤트는 API의 성공 콜백에서만 기록하므로 실패한 저장은 집계하지 않는다.

## 환경 변수

환경 변수와 시크릿은 Doppler에서 관리한다.

| 변수 | 용도 |
| --- | --- |
| `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` | PostHog 프로젝트 토큰 |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog 수집 호스트 |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 측정 ID |

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

- 이벤트 이름을 직접 문자열로 사용하지 않고 `ANALYTICS_EVENTS`에 먼저 추가한다.
- 이벤트를 추가하거나 속성을 바꾸면 이 문서의 카탈로그와 콘솔 설정을 함께 갱신한다.
- 저장 이벤트는 성공 콜백에서만 호출한다.
- 고유 ID, 이메일, 서비스명, 검색어, 자유 형식 입력값을 속성에 포함하지 않는다.
