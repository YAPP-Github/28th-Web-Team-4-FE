# FSD `features` layer

재사용되는 사용자 행동(동사) 단위 기능입니다. 규칙은 [`docs/architecture.md`](../../docs/architecture.md)를 따릅니다.

예시:

```text
src/features/
  benefit/
    ui/
    model/
    index.ts
```

같은 레이어의 다른 슬라이스를 import 하지 마세요. 공용은 `shared`로 올리거나 group 내 public API로만 노출하세요.
