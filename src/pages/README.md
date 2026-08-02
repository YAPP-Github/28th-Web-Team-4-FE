# FSD `pages` layer

라우트 단위 화면 조립 레이어입니다. Slice grouping 규칙은 [`docs/architecture.md`](../../docs/architecture.md)를 따릅니다.

예시:

```text
src/pages/
  home/
    ui/
    index.ts
  benefit/
    benefitList/
      ui/
      index.ts
```

Next 라우트 파일(루트 `app/…/page.tsx`)에서는 이 레이어의 public API만 re-export 합니다.
