---
description: 스택·스크립트·시크릿·관측 도구 공통 제약 (매 세션)
alwaysApply: true
claudeFile: 00-project-stack.md
---

# Project stack

포인터: `AGENTS.md`, FSD 상세는 `docs/architecture.md`.

- 스크립트: `node --run <script>` (`npm run` / `pnpm run`으로 안내하지 않음)
- 툴체인: mise (`mise.toml` — Node 24, pnpm 11.4)
- 버전 고정: `next` / `react` / `react-dom` / `typescript`는 `package.json` 기준 임의 업그레이드 금지
- 시크릿: Doppler. 레포·클라이언트에 키를 넣지 말고, 없는 값은 추측하지 말고 확인
- Observability: Sentry / PostHog / GA는 이미 연동됨. 신규 연동 스킬로 중복 설치하지 않음
- Next 16: 학습 데이터와 다를 수 있음 → 불확실하면 `node_modules/next/dist/docs/` 확인
