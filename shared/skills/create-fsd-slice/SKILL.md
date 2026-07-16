---
name: create-fsd-slice
description: >-
  FSD pages/features 슬라이스를 스캐폴드한다 (slice grouping, ui/model/lib,
  얇은 index.ts). 새 페이지·피처·슬라이스 추가 요청 시 사용.
  Use when creating an FSD slice, page, or feature under src/pages or src/features.
---

# FSD 슬라이스 생성

[`docs/architecture.md`](../../docs/architecture.md)를 따른다. 대상은 `src/pages` 또는 `src/features`.

## 절차

1. **레이어**
   - 화면 조립 / 라우트 UI → `src/pages`
   - 재사용 사용자 행동 → `src/features`
2. **slice grouping** — 같은 도메인 페이지가 많으면 확인
   - 있음: `src/pages/{group}/{slice-name}/`
   - 없음: `src/pages/{slice-name}/`
3. **세그먼트** (필요한 것만)
   - `ui/` · `model/`(선택) · `lib/`(선택) · `api/`(슬라이스 전용만)
4. **슬라이스 진입점** — 기존 `src/pages/home`처럼 `index.ts`로 필요한 export만 노출. Public API/배럴 **신규 규칙 단정 금지**(architecture 보류).
5. **Next 연결**
   - `app/.../page.tsx`에서 `@/pages/...` re-export
   - Route Handler: 구현 `src/app/api-routes` → `app/api/**/route.ts`
6. **체크**
   - [ ] 같은 레이어 cross-slice import 없음
   - [ ] 폴더·파일 kebab-case / 컴포넌트 PascalCase / 훅 `use` prefix
   - [ ] 레이어 루트 거대 배럴 추가 안 함
   - [ ] 루트 `pages/`에 Pages Router 라우트 추가 안 함

## 기준 예시 (`pages`, group 없음)

```text
src/pages/home/
  ui/home-page.tsx
  index.ts
```

```ts
// src/pages/home/index.ts
export { HomePage } from './ui/home-page';

// app/page.tsx
export { HomePage as default } from '@/pages/home';
```

## 예시 (`pages` + group)

```text
src/pages/benefit/benefit-list/
  ui/benefit-list-page.tsx
  model/use-benefit-list.ts
  index.ts
```

```ts
// app/benefit/list/page.tsx
export { BenefitListPage as default } from '@/pages/benefit/benefit-list';
```
