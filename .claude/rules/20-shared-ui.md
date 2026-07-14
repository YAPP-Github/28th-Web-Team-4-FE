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
- 디자인 기준: `docs/architecture.md` 참고 링크(Figma).
- 절차 스킬: `add-shared-ui-storybook`.
