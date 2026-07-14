---
name: figma-bridge
description: >-
  Figma MCP로 UI를 구현·토큰 매핑할 때 사용한다. 노드/값을 못 가져오면
  추측하지 말고 멈춘다. 핸드오프 검수는 design-handoff.
  Use when implementing UI from Figma MCP or mapping design tokens to code.
---

# Figma Bridge

구현·토큰 매핑 전용. 핸드오프 체크리스트는 `design-handoff`.

Figma: [`docs/architecture.md`](../../docs/architecture.md) 참고 링크.

## 토큰·게이트

- 매핑 SSOT: 생성된 **`src/styles/tokens/`** (`colors`, `typography`, `layout`, `effects`, `index`). `design-tokens/`는 빌드 원본.
- Figma/MCP로 확인한 값만 사용. 확인 불가·추정·토큰 미매칭이면 **구현 중단**하고 **바로 알린다** (새 토큰 / 스펙 오차 / 예외).
- 토큰에 없는 색·spacing을 발명하거나 raw hex로 우회하지 않는다. MCP 실패 상태에서 “비슷한 UI”를 쓰지 않는다.

## 절차

1. 노드 URL / architecture Figma 링크 확인.
2. MCP로 레이아웃·타이포·컬러·간격 조회 (`get_design_context` 등).
3. `src/styles/tokens` · Tailwind/`@theme` · `shared/ui`에 매핑. 어긋나면 보고 후 진행 여부 확인.
4. 구조는 FSD:
   - 화면/피처 → `create-fsd-slice`
   - 공유 UI → `add-shared-ui-storybook`
