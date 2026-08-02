# Architecture (FSD)

이 프로젝트는 [Feature-Sliced Design](https://fsd.how/kr/docs/get-started/overview/)을 따릅니다.  
Next.js App Router 연동은 [FSD + Next.js 가이드](https://fsd.how/kr/docs/guides/tech/with-nextjs/)를 따릅니다.

## 디렉터리 구조

```text
app/                     # Next.js App Router (얇은 re-export만)
pages/README.md          # src/pages를 Pages Router로 오인하지 않기 위한 빈 폴더
src/
  app/                   # FSD app (providers, styles, api-routes)
  pages/                 # FSD pages (+ slice grouping)
  features/              # FSD features
  shared/
    ui/
    lib/
    api/                 # 예정: HTTP 클라이언트·공통 API
```

루트 `pages/`에는 Next Pages Router 라우트를 넣지 않습니다.

## 레이어 (1차 도입)

| 레이어                 | 역할                                                     |
| ---------------------- | -------------------------------------------------------- |
| `app` (FSD, `src/app`) | providers, 전역 스타일, Route Handler 구현(`api-routes`) |
| `pages`                | 라우트 단위 화면 조립                                    |
| `features`             | 재사용되는 사용자 행동(동사) 단위 기능                   |
| `shared`               | 도메인 비의존 공통 코드                                  |

`widgets`, `entities`는 1차에서 사용하지 않습니다.

## 의존성 방향

```text
app/ (Next) → src/app → src/pages → src/features → src/shared
```

- 상위 레이어만 하위 레이어를 import 할 수 있습니다.
- **같은 레이어의 다른 슬라이스를 import 하지 않습니다.** (slice group 안에서도 동일)
- 그룹 내 공용이 필요하면 `features` 또는 `shared`로 올립니다.

## Slice grouping

동일 도메인 페이지가 많으면 [카카오페이 FSD 적용기](https://tech.kakaopay.com/post/fsd/#2-slice-grouping-%ED%97%88%EC%9A%A9-%EB%B0%8F-pages-%EB%A0%88%EC%9D%B4%EC%96%B4-%EA%B5%AC%EC%84%B1)처럼 group 아래에 slice를 둡니다.

```text
src/pages/
  benefit/                 # slice group
    benefit-list/          # slice
      ui/
      model/
    benefit-detail/
      ui/
  coupon/
    coupon-list/
      ...
```

`features`도 group 단위로 묶을 수 있습니다.

> `index.ts`(public API) 배치·import 규칙은 팀 합의 후 문서화합니다(아래 보류). 합의 전에도 슬라이스 폴더 구조는 위 예시를 따릅니다.

## Segments

슬라이스 안에서는 목적 기준 segment를 씁니다. `components` / `hooks` 같은 성격 이름은 지양합니다.

| Segment  | 용도                                                   |
| -------- | ------------------------------------------------------ |
| `ui`     | UI 컴포넌트, 스타일                                    |
| `model`  | 상태, 스키마, 비즈니스 흐름                            |
| `lib`    | 슬라이스 전용 순수 유틸                                |
| `api`    | 해당 슬라이스 전용 API (추후 `shared/api`와 역할 분리) |
| `config` | 설정, feature flag                                     |

## 네이밍

- 폴더·파일: **kebab-case** (예: `benefit-list/`, `home-page.tsx`)
- 컴포넌트: **PascalCase** (예: `HomePage`)
- 훅: **`use` prefix** (예: `useBenefitList`)
- 경로 alias: `@/*` → `src/*`

## API 배치 (예정)

- 공통 HTTP 클라이언트·여러 화면에서 쓰는 API는 추후 `src/shared/api`에 모읍니다.
- 페이지/기능에만 쓰는 API는 해당 슬라이스의 `api` segment에 둘 수 있습니다.
- `entities` 레이어는 쓰지 않습니다.

## Next.js 연동

루트 `app`의 라우트 파일은 FSD page를 re-export만 합니다.

```tsx
// app/page.tsx
export { HomePage as default } from '@/pages/home';
```

Route Handler는 구현을 `src/app/api-routes`에 두고, `app/api/**/route.ts`에서 re-export 합니다.

## 참고 링크

### Architecture

- [광고 온보딩 feature 경계와 상태 정책](./ad-onboarding.md)
- [FSD Overview (한국어)](https://fsd.how/kr/docs/get-started/overview/)
- [FSD Usage with Next.js (한국어)](https://fsd.how/kr/docs/guides/tech/with-nextjs/)
- [카카오페이 FSD 적용기 (Slice Grouping / Pages)](https://tech.kakaopay.com/post/fsd/)

### Design

- [채움ZIP 디자인 전용 (Figma)](https://www.figma.com/design/3J4diS4SEIAz3VF9fnvbe7/-%EC%B1%84%EC%86%8CZIP--%EB%94%94%EC%9E%90%EC%9D%B8-%EC%A0%84%EC%9A%A9?node-id=450-14485&p=f&t=xxwibMG1jwvu9dwd-0)

UI는 Figma 기준, `shared/ui`·Storybook과 맞춥니다.

> **보류:** Public API(`index.ts` / 배럴) 정책은 팀 합의 후 이 문서에 추가합니다. 합의 전에는 슬라이스 밖 import 경로를 새로 단정하지 말고, 기존 코드 패턴을 따르거나 팀에 확인합니다.
