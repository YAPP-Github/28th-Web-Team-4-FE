---
paths:
  - "src/pages/**"
  - "src/features/**"
  - "src/shared/**"
  - "src/app/**"
  - "app/**"
  - "pages/**"
---

# FSD rules

필독: `docs/architecture.md`

## Layers (1차)

`app` → `pages` → `features` → `shared`  
widgets / entities 사용 금지.

## Layout

- Next App Router: 루트 `app/` (얇은 re-export만)
- 루트 `pages/README.md`만 유지 — **Pages Router 라우트 추가 금지**
- FSD: `src/app`, `src/pages`, `src/features`, `src/shared`
- Route Handler 구현: `src/app/api-routes` → `app/api/**/route.ts`에서 re-export

## Imports

- 상위 → 하위만
- 같은 레이어 cross-slice import 금지 (slice group 안에서도 동일)
- Public API(`index.ts` / 배럴): **팀 합의 전 새로 단정하지 말 것**. 기존 패턴을 따르거나 팀에 확인

## Slice grouping · naming

```text
src/pages/benefit/benefit-list/{ui,model}
```

- 폴더·파일: kebab-case
- 컴포넌트: PascalCase / 훅: `use` prefix

## API

공유 HTTP는 추후 `src/shared/api`. 슬라이스 전용만 해당 slice `api` segment.
