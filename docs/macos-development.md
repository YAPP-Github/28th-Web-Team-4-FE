# macOS 앱 개발

기존 Next.js 서버의 웹을 여는 Apple Silicon용 Tauri 앱이다. Next.js를 정적 export하거나 앱에 Node 서버를 포함하지 않는다.

## 준비

- Xcode 또는 Xcode Command Line Tools
- [rustup](https://rustup.rs/) 설치. `src-tauri/rust-toolchain.toml`의 Rust 버전을 사용한다.
- `mise install` 후 `mise exec -- pnpm install --frozen-lockfile`
- Doppler의 `frontend / dev` 접근 권한

Rust 설치 직후 현재 셸에 Cargo가 없다면 `source "$HOME/.cargo/env"`를 실행한다.

## 실행

```bash
mise exec -- node --run desktop:dev
```

Doppler 개발 설정을 확인한 뒤 3000~3004 중 첫 빈 포트에서 Next.js를 실행하고 앱이 해당 URL을 연다.
포트가 모두 사용 중이거나 Doppler 설정에 실패하면 중단한다. 터미널에서 `Ctrl+C`로 개발 실행을 종료한다.
서비스 환경 변수는 웹 서버에만 주입하며 앱 바이너리에 넣지 않는다.

## 개발용 설치 파일

```bash
mise exec -- node --run desktop:build
```

`src-tauri/target/aarch64-apple-darwin/release/bundle/`에 `.app`과 DMG를 생성한다.
설치 앱은 `https://chaeso-zip.com`의 홈을 연다. 웹 배포는 기존 웹 파이프라인으로 수행한다.

현재는 ad-hoc 서명한 개발용 빌드이며 공증되지 않았다. 일반 사용자 배포용 Developer ID 서명·공증은 후속 PR에서 구성한다.
설정의 도구 기본 최소 OS 값은 지원 보장이 아니다. 실제 검증한 최소 macOS는 외부 배포 전에 확정한다.

앱 식별자는 서비스 도메인을 기준으로 `com.chaeso-zip.desktop`을 사용한다. 서명·배포 전에 팀 계정에서 등록 가능 여부를 확인한다.
아이콘은 `app/icon.svg`를 비율을 유지한 정사각형 캔버스에 배치한 뒤 Tauri CLI로 생성했다.

## 앱 기본 동작

- 최초 실행·완전 재실행은 홈으로 이동한다. 빨간 닫기 버튼과 `⌘W`는 창을 숨기며 Dock 클릭 또는 `윈도우 → 채소ZIP 보기`로 현재 화면을 다시 연다. `⌘Q`는 앱을 종료한다.
- `채소ZIP`, `편집`, `윈도우` 메뉴를 제공한다. `⌘R`은 새로고침, `⌘⇧H`는 홈으로 이동한다.
- 운영에서는 `https://chaeso-zip.com`과 정확히 같은 origin만 앱에서 연다. 개발에서는 선택한 localhost 포트가 기준이다. 같은 서비스의 새 창 요청은 기존 창으로 이동하고, 외부 HTTP(S) 링크는 기본 브라우저로 연다.
- 사용자 정보가 포함된 URL과 `file:`, `javascript:`, 임의 앱 scheme은 차단한다. 원격 웹에 네이티브 명령 권한을 추가하지 않는다.
- 시작·홈 이동 시 앱에 포함된 로딩 화면을 먼저 표시한다. 20초 안에 웹 문서 로딩이 끝나지 않으면 앱 내 오류 화면에서 다시 시도할 수 있다. 이 화면은 인터넷이나 웹 서버 없이도 제공된다.
- 웹이 이미 열린 뒤 API 오류는 기존 웹의 오류 처리를 사용한다. 이후 탐색에서 복구가 필요하면 `윈도우 → 홈으로 이동`으로 로딩·재시도를 다시 시작한다. SPA 내부 이동에는 타임아웃을 적용하지 않는다.

Google 로그인 후 앱 복귀·세션 연결과 앱 내 업데이트는 아직 구현하지 않았다. 이 빌드는 일반 사용자에게 배포할 첫 출시 버전이 아니다.

## 수동 확인 항목

아래 항목은 실제 WKWebView에서 확인한다. Playwright WebKit 결과만으로 시스템 WebKit 검증을 대신하지 않는다.

- 홈 → 추천/비교/시뮬레이션 진입, 창 최소 크기·전체 화면에서 이미지·입력·스크롤 확인
- 다른 화면에서 창 닫기 → Dock 재열기 시 화면 유지, `⌘Q` → 재실행 시 홈
- 입력창 복사·붙여넣기·실행 취소, 메뉴 새로고침·홈 이동
- 같은 서비스 `target="_blank"`는 기존 창, 외부 링크는 기본 브라우저, 위험 scheme은 차단
- 인터넷 연결 없이 앱 시작 → 20초 후 오류 안내 → 연결 복구 후 다시 시도
- 서버 응답을 지연시킨 뒤 재시도했을 때 이전 요청 타이머가 새 페이지를 덮어쓰지 않는지 확인

현재 개발 환경의 OS 접근성·화면 캡처 권한 제한으로 네이티브 UI 조작 전체와 시각 검증은 미완료다.
자동 검증은 Rust URL 정책·로딩 상태 테스트, 빌드, 로컬 앱의 HTTP 응답까지 확인했다.

## 검증

```bash
cd src-tauri
cargo fmt --check
cargo clippy --locked -- -D warnings
cargo test --locked
```

웹 검사는 저장소의 `node --run fmt:check`, `node --run lint`, Doppler 환경에서의 `node --run build`를 사용한다.
