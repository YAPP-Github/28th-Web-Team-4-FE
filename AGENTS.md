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

| 명령                          | 용도                                         |
| ----------------------------- | -------------------------------------------- |
| `node --run dev`              | 개발 서버                                    |
| `node --run build`            | 토큰 빌드 + Next build                       |
| `node --run lint` / `fmt`     | oxlint / oxfmt                               |
| `node --run test` / `test:ci` | Vitest                                       |
| `node --run storybook`        | Storybook                                    |
| `node --run tokens`           | 디자인 토큰 빌드·검증                        |
| `node --run skills:sync`      | `.agents/skills` → Cursor/Claude 스킬 동기화 |

프로젝트 스킬은 **`.agents/skills/`만 수정**한 뒤 `node --run skills:sync`로 맞춘다. Claude 전용 스킬(예: PostHog)은 sync 대상이 아니다.

## 4. UI

- UI 언어: 한국어 (`lang="ko"`).
- `shared/ui` 프리미티브·`cn` 재사용. 도메인 UI는 `pages` / `features`에 둔다.
- 디자인·FSD 참고 링크는 [`docs/architecture.md`](docs/architecture.md) 참고 섹션.

## 5. 시크릿·환경 변수

시크릿·환경 변수는 **Doppler**로 관리한다. 레포/클라이언트에 키를 넣지 말고, 없는 값은 추측하지 말고 확인한다.

## 6. 스킬·트리거

원본: `.agents/skills/` (수정 후 `node --run skills:sync`).  
매칭이 애매하면 **스킬 이름을 말해** 수동 호출한다.

| 스킬                            | 이럴 때 사용 (트리거 예시)                                                                      |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| `github-workflow`               | 이슈·브랜치·커밋·푸시·draft PR. “커밋할까?”, “PR 만들어”, “이슈 먼저”                           |
| `vercel-react-best-practices`   | React/Next 작성·리뷰·성능. “페이지 최적화”, “데이터 페칭”, “번들 줄여”                          |
| `vercel-composition-patterns`   | 컴포넌트 API·합성. “boolean props 많음”, “compound component”, “shared/ui API”                  |
| `web-design-guidelines`         | UI/a11y/UX 가이드 리뷰. “UI 리뷰”, “접근성 체크”, “디자인 감사”                                 |
| `vercel-react-view-transitions` | View Transition API·라우트 전환. “페이지 전환 애니”, `ViewTransition`, “공유 요소 모션”         |
| `emil-design-eng`               | UI 폴리시·버튼/모달/토스트 디테일. “이 인터랙션 다듬어”, “애니메이션 넣을까?”                   |
| `apple-design`                  | 제스처·시트·드래그·스프링. “바텀시트”, “애플처럼 물리적 모션”                                   |
| `animation-vocabulary`          | 효과 이름. “뭐라고 불러?”, “저 튕기는 스크롤 용어”                                              |
| `improve-animations`            | 레포 모션 **감사·로드맵** (코드 미수정). “모션 감사”, “애니 개선 계획”                          |
| `review-animations`             | 애니 **디프 리뷰**. **자동 호출 거의 안 됨** → `review-animations로 리뷰해`처럼 **이름을 명시** |
| `integration-nextjs-app-router` | PostHog **신규** 연동만 (이미 연동됨 → 사용 금지)                                               |

모션: 한 파일/디프 → `review-animations` / 전체 점검·계획 → `improve-animations` / 네이티브 VT·라우트 전환 → `vercel-react-view-transitions` / Emil 폴리시 → `emil-design-eng`.
