---
description: TypeScript JSDoc·주석 스타일. src TS/TSX 작업 시
alwaysApply: false
globs:
  - src/**/*.ts
  - src/**/*.tsx
claudeFile: 30-typescript-style.md
---

# TypeScript style

적용 범위: `src/**/*.ts`, `src/**/*.tsx`.

- 파일 상단에는 해당 파일의 역할을 설명하는 주석을 둔다.
- 공개 타입·함수·컴포넌트·훅에는 JSDoc을 작성한다. 여기서 공개 API는 `export`되는 선언과 다른 슬라이스에서 사용할 수 있는 선언을 뜻한다.
- JSDoc은 의도, 입력/출력 계약, 제약, 부수 효과처럼 호출자가 알아야 하는 정보를 적는다.
- 자명한 구현을 반복하는 주석은 작성하지 않는다. 코드 한 줄을 자연어로 옮기는 주석보다 이름·타입·구조를 개선한다.
