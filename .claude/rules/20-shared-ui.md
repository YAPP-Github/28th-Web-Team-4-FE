---
paths:
  - "src/shared/ui/**"
  - "src/**/*.stories.*"
---

# Shared UI

- 도메인 비의존 UI만 `src/shared/ui`에 둔다. 비즈니스/도메인 UI는 `pages` / `features`.
- 인터랙티브/a11y UI는 **Base UI(`@base-ui/react`)를 최대한** 쓴다. 구현 전 https://base-ui.com/llms.txt (Radix `asChild` 금지 → `render`).
- `cn`·layout(`Flex`, `Stack`, `Box` 등) 재사용. 텍스트는 Text 컴포넌트 또는 `typo-*` (`src/styles/tokens/typography.css`).
- 파일명은 kebab-case. import는 모듈 단위 경로로 (거대 `shared/ui` 배럴을 새로 만들지 않음).
- 새 shared 컴포넌트에는 Storybook 스토리. CSF는 **로컬 `src/stories` 우선**, 애매할 때만 https://storybook.js.org/llms.txt.
- UI 테스트는 role/name/label·표시 문구·상호작용처럼 **사용자가 관찰할 수 있는 결과**만 검증한다. class/style/data 속성·DOM 구조·HTML/SVG 프레젠테이션 속성은 단언하지 않는다. 시각 차이는 Storybook 또는 실제 화면으로 확인하고, 사용자 관찰 결과가 없으면 구현 확인용 테스트를 추가하지 않는다. 단, `href`, `disabled`, `checked`, `aria-expanded`, `aria-current`처럼 동작·탐색·접근성 상태 자체가 공개 계약인 속성은 검증할 수 있다.
- 디자인 기준: `docs/architecture.md` 참고 링크(Figma).
- 절차 스킬: `add-shared-ui-storybook`.
