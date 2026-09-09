---
name: use-layout-components
description: >-
  React/Next TSX UI에서 flex·grid 레이아웃을 작성하거나 리팩터링할 때
  shared/ui/layout 컴포넌트를 선택하고 Box·네이티브 컨테이너·Layout 불변 속성의
  오용을 점검한다. src/**/*.tsx 또는 app/**/*.tsx의 레이아웃 className 변경,
  페이지·피처·shared UI 생성, Base UI·motion 레이아웃 합성 시 사용.
---

# Layout 컴포넌트 사용

[`shared/rules/ui-layout.md`](../../rules/ui-layout.md)를 먼저 읽고 그 선택 기준과 불변 속성을 따른다.

## 절차

1. 작업 전 대상 TSX에서 `Box`·네이티브 요소의 `flex`·`grid`와 기존 Layout의 불변 속성 충돌을 찾는다.
2. 가장 구체적인 Layout을 선택한다. breakpoint에서 축이나 불변 정렬이 바뀌면 `Flex`를 선택한다.
3. 기존 semantic 태그는 Layout의 `as`로 보존하고, Layout을 위한 DOM 래퍼를 추가하지 않는다.
4. Base UI는 지원되는 `render` 합성을 우선한다. `motion.*`은 props·ref·animation 전달이 안전할 때만 `as`로 합성한다.
5. Layout이 제공하는 불변 클래스는 호출부에서 제거하고 크기·간격·색·반응형 비불변 클래스만 남긴다.
6. 수정 전후에 `node --run layout:check -- --changed`를 실행한다. 스크립트는 후보 탐색을 돕는 도구이며 결과를 기계적으로 모두 치환하지 않는다.
7. 남은 `Box + flex/grid`, 네이티브 레이아웃, Base UI·motion 예외는 사유와 함께 작업 결과에 보고한다. 특히 인라인 흐름과 breakpoint display 전환은 현재 Layout으로 대체해 동작을 바꾸지 않는다.

## 확인

- [ ] `Box`는 전용 Layout으로 표현할 수 없는 경우에만 남음
- [ ] Layout의 불변 속성을 기본·breakpoint variant에서 바꾸지 않음
- [ ] semantic 태그·ARIA·event·ref가 보존됨
- [ ] 불필요한 DOM 래퍼가 추가되지 않음
- [ ] class·DOM 구조만 단언하는 테스트를 추가하지 않음
- [ ] 시각 영향이 있으면 Storybook 또는 실제 화면으로 확인함

`Spacing`은 사용하지 않는다. 일반 컨테이너는 `Box`, 간격은 부모의 `gap`·padding·margin으로 표현하고 구분선은 별도 `Separator` 설계 대상으로 남긴다.
