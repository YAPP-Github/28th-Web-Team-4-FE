![내게 맞는 광고 채널을 한눈에 찾는 채소ZIP](./.github/assets/readme/cover.png)

# 채소ZIP

**당신의 광고, 제철 채널로 채우세요**

내 서비스에 맞는 광고 채널을 추천받고, 비교하고, 예산별 예상 성과까지 확인해 보세요.

[![CI](https://github.com/YAPP-Github/28th-Web-Team-4-FE/actions/workflows/ci.yml/badge.svg)](https://github.com/YAPP-Github/28th-Web-Team-4-FE/actions/workflows/ci.yml)

## 내게 맞는 광고 채널을 한눈에

![광고 채널 탐색, 예산 산정, 성과 예측의 어려움을 보여주는 채소ZIP 서비스 소개](./.github/assets/readme/01-overview.png)

채소ZIP은 광고 채널 선택에 필요한 추천, 비교, 성과 예측을 한곳에 모았습니다.

- **맞춤 추천:** 업종, 서비스 형태, 타깃, 광고 목표와 예산에 맞는 채널을 찾습니다.
- **채널 비교:** 최대 3개 채널의 비용, 오디언스, 광고 형태와 예상 성과를 비교합니다.
- **예산 시뮬레이션:** 채널별 예산을 조정하며 예상 노출과 클릭을 확인합니다.

## 주요 기능

### 1. 온보딩 + 채널 추천 + 비교 결과 보기

서비스 정보와 광고 조건을 입력하면 적합한 채널을 추천받고, 추천 이유와 예상 성과를 비교할 수 있습니다.

![서비스 정보 입력과 광고 데이터 업로드를 거쳐 맞춤 채널을 추천받는 과정](./.github/assets/readme/02-recommendation.png)

- 서비스 정보와 광고 데이터를 입력해 추천 조건을 구성합니다.
- 입력한 조건에 적합한 채널과 추천 이유를 함께 확인합니다.
- 채널별 주요 정보를 살펴보고 다음 광고 계획에 활용합니다.

<div>
<div><strong>온보딩 전체 입력과 추천 결과</strong>
<video src="https://github.com/user-attachments/assets/41a8f4ab-b1da-41dc-9256-a7bf920a88f4" controls width="100%"></video>
<p>서비스 정보와 광고 조건을 입력하고 맞춤 추천 결과를 확인합니다.</p>
</div>
<div><strong>추천 상세의 네 탭과 광고 예시</strong>
<video src="https://github.com/user-attachments/assets/119dd4b4-8e66-4953-b111-416ea74f7871" controls width="100%"></video>
<p>추천 채널의 핵심 요약·광고 상품·타깃층·광고 예시를 살펴봅니다.</p></div>
</div>

<details>
<summary>추천 채널 비교 더 보기</summary>

- [추천 채널로 비교하기](./docs/demo/1e-recommend-compare.mp4): 추천받은 채널 3개를 선택해 비교 결과를 확인합니다.

</details>

### 2. 채널 비교 및 결과 보기

검색과 카테고리 필터로 광고 채널을 찾고, 최대 3개 채널의 주요 지표와 예상 성과를 나란히 비교합니다.

![필터를 적용해 비교할 광고 채널을 선택하는 화면](./.github/assets/readme/03-comparison.png)

- 조건별 필터로 필요한 채널을 탐색하고 최대 3개까지 선택합니다.
- 최소 광고비, 주요 오디언스, 광고 형태와 과금 방식을 확인합니다.

![광고 채널별 예상 성과와 주요 지표를 비교하는 결과 화면](./.github/assets/readme/04-comparison-result.png)

- 예상 노출, 예상 클릭, CPC와 CPM을 나란히 비교합니다.
- 지표별 인사이트를 참고해 서비스에 맞는 채널을 선택합니다.

<div>
<div><strong>검색과 카테고리 필터</strong>
<video src="https://github.com/user-attachments/assets/ffe9262e-d768-41f6-be15-e8b62d8f0455" controls width="100%"></video>
<p>카테고리와 검색어로 원하는 광고 채널을 찾습니다.</p></div>
<div><strong>직접 선택한 채널 비교</strong>
<video src="https://github.com/user-attachments/assets/cd20e90b-98f9-4767-857c-cfc5a668a862" controls width="100%"></video>
<p>세 채널을 선택해 예상 노출과 클릭을 나란히 비교합니다.</p></div>
</div>

<details>
<summary>필터 조합과 비교 후보 선택 더 보기</summary>

- [여러 카테고리 선택과 초기화](./docs/demo/2c-multi-filter.mp4): 여러 카테고리를 함께 선택하고 필터를 초기화합니다.
- [비교 후보 교체](./docs/demo/2d-replace-candidate.mp4): 선택한 채널을 해제하고 다른 후보를 추가합니다.
- [검색 결과가 없을 때](./docs/demo/2e-empty-recovery.mp4): 검색어와 필터를 조정해 채널 목록을 다시 확인합니다.

</details>

### 3. 시뮬레이터

총예산과 집행 기간을 설정하고, 채널별 예산 배분에 따라 예상 노출과 클릭이 어떻게 달라지는지 확인합니다.

![광고 예산을 조정하고 채널별 예상 성과를 확인하는 시뮬레이터](./.github/assets/readme/05-simulator.png)

- 채널마다 예산을 배분하며 예상 노출과 클릭의 변화를 확인합니다.
- 시뮬레이션 결과를 그래프와 표로 전환해 살펴봅니다.

<div>
<div><strong>예산 재배분과 성과 변화</strong>
<video src="https://github.com/user-attachments/assets/fd7944bb-907f-4410-8e42-c32d5705e806" controls width="100%"></video>
<p>채널별 예산 배분을 바꾸며 예상 노출과 클릭의 변화를 확인합니다.</p></div>
<div><strong>표로 확인하고 결과 저장</strong>
<video src="https://github.com/user-attachments/assets/d499d58c-eac1-4808-80a5-3a41cd2f11f5" controls width="100%"></video>
<p>계산 결과를 표로 살펴보고 이름을 붙여 저장합니다.</p></div>
</div>

<details>
<summary>초기 조건 설정 더 보기</summary>

- [조건 설정과 첫 계산](./docs/demo/3a-simulator-setup.mp4): 총 200만원과 1개월을 설정하고 채널별 예산을 배분합니다.

</details>

### 4. 저장된 결과 다시 보기

마이페이지에서 저장한 추천, 비교, 시뮬레이션 결과를 다시 열어 이전 광고 계획을 이어서 검토합니다.

- 로그인 사용자는 추천, 비교, 시뮬레이션 결과를 각각 저장할 수 있습니다.
- 저장한 결과는 마이페이지에서 다시 확인할 수 있습니다.
- 저장한 추천 결과의 채널을 불러와 예산 시뮬레이션을 이어서 진행할 수 있습니다.

<div>
<div><strong>저장된 추천 다시 보기</strong>
<video src="https://github.com/user-attachments/assets/0ec28c9a-819e-4b4e-97a3-8bebb4219900" controls width="100%"></video>
<p>마이페이지에서 저장한 추천 결과와 채널 정보를 다시 확인합니다.</p></div>
<div><strong>저장된 시뮬레이션 다시 보기</strong>
<video src="https://github.com/user-attachments/assets/6252a494-d045-4a9f-9c21-4c4435b26b15" controls width="100%"></video>
<p>저장한 시뮬레이션을 열어 예산 배분과 예상 성과를 확인합니다.</p></div>
</div>

<details>
<summary>저장한 비교 결과 더 보기</summary>

- [저장된 비교 다시 보기](./docs/demo/4b-saved-compare.mp4): 저장한 채널 비교 결과를 확인합니다.

</details>

> [!NOTE]
> 예상 성과는 매체 정보와 입력 조건을 바탕으로 계산한 참고값이며 실제 광고 성과를 보장하지 않습니다.

## 기술적 특징

### Feature-Sliced Design

Next.js App Router 진입점은 얇게 유지하고 페이지, 사용자 행동, 공통 모듈의 책임을 분리했습니다. 레이어 간 의존성은 상위에서 하위 방향으로만 흐릅니다.

### Design Token Pipeline

Tokens Studio의 토큰을 Style Dictionary로 변환해 Tailwind CSS 4의 `@theme` 변수로 사용합니다. GitHub Actions가 토큰 생성, 검증과 PR 생성을 자동화합니다.

### Type-safe API Client

`@hey-api/openapi-ts`로 OpenAPI 명세에서 TypeScript 타입, SDK와 TanStack Query 코드를 생성합니다. 명세가 변경되면 GitHub Actions가 생성 코드를 갱신하고 자동 PR을 만듭니다.

### Continuous Delivery

`main` 브랜치가 변경되면 Doppler 환경에서 Next.js를 빌드합니다. 빌드된 정적 파일은 Amazon S3에 동기화한 뒤 CloudFront로 배포하고, ARM64 컨테이너 이미지는 Amazon ECR을 거쳐 VPC 내부의 ECS Fargate에 배포합니다. 서비스 트래픽은 public 서브넷의 Application Load Balancer(ALB)를 통해 private 서브넷의 ECS 태스크로 전달되며, ECS 네이티브 블루그린 배포로 무중단 전환을 지원합니다. private 서브넷의 외부 통신은 NAT Gateway 대신 NAT Instance를 사용해 비용을 최적화했습니다.

### Motion & Interaction

Motion을 활용해 추천 결과 카드, 채널 상세 탭과 결과 저장 상태에 필요한 전환과 피드백을 적용했습니다. 사용자의 reduced-motion 설정에서는 이동 효과를 줄입니다.

자세한 구조와 규칙은 [아키텍처 문서](./docs/architecture.md), 디자인 토큰 흐름은 [디자인 토큰 문서](./design-tokens/README.md)에서 확인할 수 있습니다.

## Tech Stack

| 영역       | 기술                                                                  |
| ---------- | --------------------------------------------------------------------- |
| Core       | Next.js 16, React 19, TypeScript 6                                    |
| UI         | Tailwind CSS 4, Base UI, Style Dictionary, Motion                     |
| Data / API | TanStack Query, Zustand, ky, zod, React Hook Form, Hey API OpenAPI TS |
| Delivery   | Doppler, GitHub Actions, Amazon S3, CloudFront, ECR, ECS Fargate      |

## 시작하기

### 사전 준비

- [mise](https://mise.jdx.dev/)가 설치되어 있어야 합니다.
- Doppler CLI와 팀 프로젝트의 `dev` 환경 접근 권한이 필요합니다.

### 1. 저장소와 의존성 설치

```bash
git clone https://github.com/YAPP-Github/28th-Web-Team-4-FE.git
cd 28th-Web-Team-4-FE

mise install
node -v && pnpm -v
pnpm install --frozen-lockfile
```

Node.js `24.x`, pnpm `11.4.x`가 출력되는지 확인합니다.

### 2. Doppler 개발 환경 연결

```bash
doppler setup --config dev
```

> [!IMPORTANT]
> 로컬 실행에는 환경 변수가 필요하며, 이 프로젝트는 환경 변수와 시크릿을 **Doppler로 관리합니다**. Doppler 접근 권한이 없다면 프로젝트 관리자에게 요청해 주세요. 시크릿 값을 README나 저장소에 직접 추가하지 않습니다.

인증 환경 변수는 [인증 문서](./docs/auth.md#환경-변수), 분석 환경 변수는 [분석 문서](./docs/analytics.md#환경-변수)에서 확인할 수 있습니다.

### 3. 개발 서버 실행

```bash
doppler run -- node --run dev
```

[http://localhost:3000](http://localhost:3000)에서 서비스를 확인합니다. 개발 환경에서는 MSW가 기본으로 활성화됩니다. 실제 백엔드 API와 연동하려면 다음 명령을 사용합니다.

```bash
doppler run -- node --run dev:no-msw
```

`node --run`에서 `bad option: --run` 오류가 발생하면 mise의 Node.js를 명시해 실행합니다.

```bash
mise exec -- node --run <script>
```

## 주요 명령

프로젝트 스크립트는 `npm run`이나 `pnpm run` 대신 `node --run <script>`로 실행합니다.

| 명령                                   | 설명                                      |
| -------------------------------------- | ----------------------------------------- |
| `doppler run -- node --run dev`        | MSW를 사용하는 개발 서버 실행             |
| `doppler run -- node --run dev:no-msw` | 실제 백엔드 API를 사용하는 개발 서버 실행 |
| `doppler run -- node --run build`      | 디자인 토큰 생성 후 프로덕션 빌드         |
| `node --run lint`                      | 타입 정보를 포함한 정적 분석              |
| `node --run fmt:check`                 | 포맷 변경 여부 확인                       |
| `node --run test:ci`                   | Vitest 단발성 실행                        |
| `node --run storybook`                 | Storybook 개발 서버 실행 (`6006` 포트)    |
| `node --run tokens`                    | 디자인 토큰 CSS 생성 및 검증              |
| `node --run openapi-ts`                | OpenAPI 기반 API 클라이언트 코드 생성     |

## 문서

| 문서                                     | 내용                                           |
| ---------------------------------------- | ---------------------------------------------- |
| [아키텍처](./docs/architecture.md)       | FSD 레이어, 의존성, 네이밍 규칙                |
| [인증](./docs/auth.md)                   | BFF, 세션 쿠키, 인증 환경 변수                 |
| [회원가입 흐름](./docs/signup-flow.md)   | 이메일 및 Google 회원가입 흐름과 상태 관리     |
| [광고 온보딩](./docs/ad-onboarding.md)   | 추천 조건 입력 단계와 상태 정책                |
| [제품 분석](./docs/analytics.md)         | PostHog와 GA 이벤트 및 개인정보 정책           |
| [디자인 토큰](./design-tokens/README.md) | Tokens Studio에서 Tailwind CSS까지의 변환 과정 |

![채소ZIP 서비스 QR 코드와 YAPP 28기 Web Team 4 구성원](./.github/assets/readme/06-team.png)
