---
name: design-handoff
description: >-
  디자이너→FE 핸드오프·구현 전 스펙 검수에만 사용한다. 코드는 수정하지 않는다.
  픽셀 구현·MCP 매핑은 figma-bridge. Use when reviewing design handoff before
  coding — questions and checklist only, not while implementing from Figma.
---

# 디자이너 → FE 핸드오프

구현 **전** 검수 전용. **질문은 하되 코드·파일은 수정하지 않는다.**  
픽셀 구현은 `figma-bridge`.

Figma: [`docs/architecture.md`](../../docs/architecture.md) 참고 링크.

## 게이트

1. 색·간격·타이포 진실 소스 = Figma.
2. 스펙 공백이면 추측하지 말고 질문.
3. 통과 후에만 `figma-bridge`(또는 shared/ui·slice 스킬)로 구현.

## 체크리스트

- [ ] 프레임/노드 링크
- [ ] 색·타이포·간격이 Figma에서 식별됨 (이후 매핑은 `src/styles/tokens`)
- [ ] hover / disabled / empty 등 상태
- [ ] 공백 → 질문 후 진행

## 하지 말 것

- 토큰 값을 md에 장황 복붙 (이중 소스 — 생성된 `src/styles/tokens`가 SSOT)
- “일단 비슷하게” 구현 → 그건 `figma-bridge` + 게이트
- 이 스킬로 컴포넌트·스타일·스토리 코드를 작성하거나 수정하기
