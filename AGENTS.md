<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

FSD·레이어 상세는 [`docs/architecture.md`](docs/architecture.md)를 본다.

## 1. 기술 스택

**Node / pnpm은 [mise](https://mise.jdx.dev/)로 관리한다.** 버전 단일 소스는 루트 [`mise.toml`](mise.toml) (`node = "24"`, `pnpm = "11.4.0"`).

```bash
mise install          # mise.toml 기준으로 Node·pnpm 설치
node -v && pnpm -v    # 24.x / 11.4.x 확인
```

| 영역          | 선택                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------- |
| Runtime       | Node **24**, pnpm **11.4** (mise)                                                              |
| Framework     | Next.js **16.2.6** (App Router), React **19.2.4**                                              |
| Language      | TypeScript **6.0.x** (strict)                                                                  |
| Styling       | Tailwind CSS **4.3**, Style Dictionary 토큰 (`design-tokens/`)                                 |
| Data / form   | TanStack Query 5, Zustand 5, ky 2, zod 4, react-hook-form 7                                    |
| Observability | Sentry, PostHog, GA (`@next/third-parties`) — 이미 연동됨. 신규 연동 스킬로 중복 설치하지 않음 |
| Quality       | oxlint, oxfmt, Vitest 4, Playwright, Storybook 10                                              |

`next` / `react` / `react-dom` / `typescript`는 `package.json` 기준으로 **임의 업그레이드하지 않는다.**

## 2. FSD 요약

레이어(1차): `app` · `pages` · `features` · `shared` (`widgets` / `entities` 미사용).

```text
app/                 # Next App Router (얇은 re-export)
pages/README.md      # Pages Router 오인 방지 (라우트 추가 금지)
src/app/             # providers, styles, api-routes
src/pages/           # 화면 (+ slice grouping)
src/features/        # 재사용 행동
src/shared/          # ui / lib / (추후 api)
```

의존성: 상위 → 하위만. 같은 레이어 cross-slice import 금지. 자세한 규칙은 `docs/architecture.md`.

## 3. 스크립트

스크립트는 **`node --run <script>`** 로 실행한다 (`npm run` / `pnpm run`으로 안내하지 않음).

| 명령                          | 용도                   |
| ----------------------------- | ---------------------- |
| `node --run dev`              | 개발 서버              |
| `node --run build`            | 토큰 빌드 + Next build |
| `node --run lint` / `fmt`     | oxlint / oxfmt         |
| `node --run test` / `test:ci` | Vitest                 |
| `node --run storybook`        | Storybook              |
| `node --run tokens`           | 디자인 토큰 빌드·검증  |

## 4. UI

- UI 언어: 한국어 (`lang="ko"`).
- `shared/ui` 프리미티브·`cn` 재사용. 도메인 UI는 `pages` / `features`에 둔다.
- 디자인·FSD 참고 링크는 [`docs/architecture.md`](docs/architecture.md) 참고 섹션.

## 5. 시크릿·환경 변수

시크릿·환경 변수는 **Doppler**로 관리한다. 레포/클라이언트에 키를 넣지 말고, 없는 값은 추측하지 말고 확인한다.
