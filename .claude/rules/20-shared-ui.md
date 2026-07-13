---
paths:
  - "src/shared/ui/**"
  - "src/**/*.stories.*"
---

# Shared UI

- 도메인 비의존 UI만 `src/shared/ui`에 둔다. 비즈니스/도메인 UI는 `pages` / `features`.
- `cn`과 기존 layout 프리미티브(`Flex`, `Stack`, `Box`, `Text` 등)를 재사용한다.
- 파일명은 kebab-case. import는 모듈 단위 경로로 (거대 `shared/ui` 배럴을 새로 만들지 않음).
- 새 shared 컴포넌트에는 Storybook 스토리(`*.stories.tsx`)를 추가한다.
- 디자인 기준: `docs/architecture.md` 참고 링크(Figma).
