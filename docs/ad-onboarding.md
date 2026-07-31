# 광고 온보딩

`src/features/ad-onboarding`은 채널 추천과 예산 시뮬레이터가 공유하는 광고 정보 입력
행동을 소유한다. 질문을 표시하는 페이지나 결과를 조회하는 feature와는 분리한다.

## FSD 경계

```text
src/features/ad-onboarding/
  model/      # 선택지, Draft, 완료 답변, 단계, 검증 규칙, 임시 추천 store
  lib/        # 예산 보정과 파일 검증 순수 함수
  ui/
    questions/
      common/     # 서비스 이름, 업종, 서비스 형태, 예산, 집행 기간
      recommend/  # 연령대, 광고 목표, 광고 경험과 성과 입력
```

- 공통 질문은 `CommonOnboardingDraft`만 사용한다.
- 추천 전용 질문만 `RecommendOnboardingDraft`에 의존한다.
- `CommonOnboardingStepContent`는 공통 5개 질문을 렌더링한다.
- `RecommendOnboardingStepContent`는 공통 renderer에 위임하고 추천 전용 질문만 추가한다.
- `SelectCard`, `SelectChip`, `StepActionButton`은 도메인 밖 재사용 사례가 생길 때까지 feature
  내부에 둔다.
- feature public API는 페이지에 필요한 완료 답변 타입과 임시 추천 store만 공개한다.
- 결과 조회와 결과 화면은 별도 feature가 소유하며 feature끼리 직접 import하지 않는다.

## 완료 답변

공통 완료 답변은 서비스 이름, 업종, 서비스 형태, 예산 범위, 집행 기간으로 구성한다.
시뮬레이터 답변은 이 공통 계약과 동일하며 연령대, 광고 목표, 광고 경험을 포함하지 않는다.
추천 답변은 공통 계약에 연령대 목록, 광고 목표, 광고 경험을 추가한다.

Draft는 `Pick`과 `Partial`로 완료 답변에서 파생한다. 예산 input의 편집 값, 성과 입력 모드,
업로드 파일 목록처럼 최종 답변에 없는 UI 상태만 근거 JSDoc과 함께 Draft에 둔다. factory를
통해 새 Draft를 만들며 배열과 객체 참조를 플로우 간에 공유하지 않는다.

## 단계 구성

| 순서 | 추천 | 시뮬레이터 |
| ---: | --- | --- |
| 1 | `service-name` | `service-name` |
| 2 | `category` | `category` |
| 3 | `service-type` | `service-type` |
| 4 | `age-ranges` | `budget` |
| 5 | `ad-goal` | `campaign-period` |
| 6 | `budget` |  |
| 7 | `campaign-period` |  |
| 8 | `ad-experience` |  |

질문 메타데이터는 ID 기반 definition map 하나에서 관리한다. 순서와 진행률은 flow별 ID
배열 index에서 파생하며 별도 step number는 저장하지 않는다. 추천 진행률은
`[0, 12, 25, 37, 50, 62, 75, 87, 100]`, 시뮬레이터 진행률은
`[0, 20, 40, 60, 80, 100]`이다.

## 입력 정책

- 연령대는 복수 선택한다. 구체적인 연령대와 `잘 모르겠어요`는 서로 배타적으로 disabled
  처리한다.
- 광고 목표는 인지도 목적과 행동 유도 목적의 두 그룹으로 표시한다.
- 예산은 최소·최대 input과 두 Thumb Slider로 입력한다. 초기값은 `0원~1,000만 원`이다.
- 예산 단계는 `0`, `50`, `200`, `500`, `1,000만 원`이며 blur 또는 Enter에서 가장 가까운
  단계로 보정한다. 거리가 같으면 낮은 값으로 보정하고 빈 input은 `0`으로 확정한다.
- 두 예산 값이 모두 `0`이면 오류를 표시하고 진행을 막는다. 같은 단계에 Thumb 두 개가
  겹치는 것은 허용한다.
- Slider는 drag 중 연속 위치를 보여 주고 종료 시 단계로 snap한다. 두 Thumb 사이만
  indicator 색을 표시한다.
- 성과 파일은 native file input과 drag event를 사용한다. `.csv`, `.xlsx`, 파일당 10MB,
  최대 5개를 검증하며 파싱과 서버 업로드는 하지 않는다.

## 후속 플로우

후속 PR에서 `RecommendOnboardingFlow`와 `SimulatorOnboardingFlow` facade를 제공한다.
feature는 React Hook Form, 현재/수정 단계, 진행률, 답변 Bubble을 소유하고 페이지는 인사말,
완료 콘텐츠, 제출 콜백과 라우팅을 제공한다.

- 답변 완료 후 질문 Bubble만 남기고 입력과 액션은 접는다.
- 수정 중에는 수정 대상 질문만 열고 나머지 질문과 답변을 닫는다.
- 수정 완료 후 이후 답변과 원래 진행률을 복구한다.
- 단계 전환은 `flushSync`로 먼저 커밋한 뒤 첫 입력에 focus하고 같은 frame에서 scroll한다.
- Draft는 재진입 시 초기화하며 Zustand persist를 사용하지 않는다.
- 제출 상태는 `ANSWERING`, `EDITING`, `SUBMITTING`, `COMPLETING`, `SUBMIT_ERROR`,
  `RESULT_ERROR`로 구분한다.

## 제출과 결과 조회

실제 API 연동은 후속 범위다. 입력 POST는 `useMutation`으로 처리하고 성공한 뒤 받은
`requestId`로 결과 GET을 실행한다. 완료 화면의 조회 mutation은
`queryClient.fetchQuery(getRecommendationResultOptions(requestId))`를 호출해 동일 query
key에 응답을 저장한다. 결과 페이지는 같은 options를 `useSuspenseQuery`에 전달한다.

- 추천 결과 경로: `/recommend/result/[requestId]`
- 시뮬레이터 결과 경로: `/simulator/result/[requestId]`
- 완료 결과는 `staleTime: Infinity`, 기본 `gcTime`을 사용한다.
- 결과는 URL ID와 서버 응답만으로 새로고침 복원이 가능해야 한다.
- 404는 재시도하지 않고 온보딩 CTA를 표시한다. 일시 오류는 결과 GET만 재시도한다.
- 현재 Zustand 완료 답변은 목 구현용이며 실제 API 연동 시 제거한다.

## 현재 범위 제외

- `/recommend`와 시뮬레이터의 전체 페이지 조합
- 시뮬레이터 Zustand store
- 실제 제출 및 결과 조회 API
- 추천·시뮬레이션 결과 화면과 결과 필터
- 추천 알고리즘, 파일 파싱과 서버 업로드
- 신규 UI 의존성과 전역 디자인 토큰 변경
