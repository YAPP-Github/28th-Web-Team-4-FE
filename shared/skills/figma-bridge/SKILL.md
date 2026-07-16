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

## MCP 설정·트러블슈팅

- Figma MCP가 없으면 Codex CLI에서 설정한다: `codex mcp add figma --url https://mcp.figma.com/mcp` 후 `codex mcp login figma`.
- 설정 확인은 `codex mcp list` / `codex mcp get figma`를 쓴다. `figma`가 `enabled`이고 `Auth`가 `OAuth`여야 한다.
- 이미 떠 있는 Conductor/Codex 세션은 새 MCP OAuth 상태를 못 물고 있을 수 있다. `token_revoked` / `USER_NOT_LOGGED_IN` / handshaking 401이 계속되면 `codex mcp logout figma && codex mcp login figma` 후 새 Codex 세션에서 다시 시도한다.
- Figma 링크는 `https://www.figma.com/design/...?...node-id=...` 형태의 selection link를 받는다. `node-id` 없는 파일 링크나 `figma://` 앱 링크만 있으면 노드별 링크를 요청한다.

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
