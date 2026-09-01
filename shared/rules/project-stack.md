---
description: 스택·스크립트·시크릿·관측 도구 공통 제약 (매 세션)
alwaysApply: true
claudeFile: 00-project-stack.md
---

# Project stack

포인터: `AGENTS.md`, FSD 상세는 `docs/architecture.md`.

- 스크립트: `node --run <script>` (`npm run` / `pnpm run`으로 안내하지 않음)
- 개발 서버: Doppler 개발 설정을 먼저 보장한다.
  - 실행 전에 `doppler setup --project frontend --config dev --no-interactive`
  - `3000`부터 `3004`까지 순서대로 리스닝 중인지 확인하고 첫 번째 빈 포트를 선택
  - 실행은 `doppler run -- node --run dev -- --port <available-port>`
  - `3000`~`3004`가 모두 사용 중이면 임의 포트를 선택하지 말고 중단한 뒤 사용자에게 확인
  - Doppler 인증이나 프로젝트/config 설정에 실패하면 값을 추측하거나 우회하지 말고 중단한 뒤 사용자에게 확인
- 툴체인: mise (`mise.toml` — Node 24, pnpm 11.4)
- 버전 고정: `next` / `react` / `react-dom` / `typescript`는 `package.json` 기준 임의 업그레이드 금지
- 시크릿: Doppler. 레포·클라이언트에 키를 넣지 말고, 없는 값은 추측하지 말고 확인
- Observability: Sentry / PostHog / GA는 이미 연동됨. 신규 연동 스킬로 중복 설치하지 않음
- Next 16: 학습 데이터와 다를 수 있음 → 불확실하면 `node_modules/next/dist/docs/` 확인
