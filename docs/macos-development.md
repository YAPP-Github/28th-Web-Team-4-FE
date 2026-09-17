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

비대화형 환경에서 DMG 생성이 실패하면 `CI=true mise exec -- node --run desktop:build`로
Finder 아이콘 배치용 AppleScript를 생략할 수 있다. 이번 구조 변경의 `.app`·DMG 생성은 이 방식으로 검증했다.
일반 빌드 명령의 DMG 후처리 실패 원인은 별도로 확인해야 한다.

현재는 ad-hoc 서명한 개발용 빌드이며 공증되지 않았다. 일반 사용자 배포용 Developer ID 서명·공증은 후속 PR에서 구성한다.
설정의 도구 기본 최소 OS 값은 지원 보장이 아니다. 실제 검증한 최소 macOS는 외부 배포 전에 확정한다.

앱 식별자는 서비스 도메인을 기준으로 `com.chaeso-zip.desktop`을 사용한다. 서명·배포 전에 팀 계정에서 등록 가능 여부를 확인한다.
아이콘은 `app/icon.svg`를 비율을 유지한 정사각형 캔버스에 배치한 뒤 Tauri CLI로 생성했다.

## 앱 기본 동작

- 최초 실행·완전 재실행은 홈으로 이동한다. 빨간 닫기 버튼과 `⌘W`는 창을 숨기며 Dock 클릭 또는 `윈도우 → 채소ZIP 보기`로 현재 화면을 다시 연다. `⌘Q`는 앱을 종료한다.
- `채소ZIP`, `편집`, `윈도우` 메뉴를 제공한다. `⌘R`은 새로고침, `⌘⇧H`는 홈으로 이동한다.
- 운영에서는 `https://chaeso-zip.com`과 정확히 같은 origin만 앱에서 연다. 개발에서는 선택한 localhost 포트가 기준이다. 같은 서비스의 새 창 요청은 기존 창으로 이동하고, 외부 HTTP(S) 링크는 기본 브라우저로 연다.
- 사용자 정보가 포함된 URL과 `file:`, `javascript:`, 임의 앱 scheme은 차단한다. 원격 웹에 네이티브 명령 권한을 추가하지 않는다.
- 시작·홈 이동 시 기존 웹 홈을 바로 연다. 별도 로컬 HTML, 연결 감시 타이머, 오프라인 오류 화면은 제공하지 않는다.
- 웹이 열린 뒤 API·렌더링 오류는 기존 웹의 오류 처리를 사용한다. `global-error.tsx`는 최초 웹 접속 실패를 대신 처리하지 않는다. 최초 접속에 실패하면 연결 복구 후 `윈도우 → 홈으로 이동`으로 홈 접속을 다시 시도한다. 앱 자체의 접속 실패 안내는 후속 과제다.

Google 로그인 후 앱 복귀·세션 연결과 앱 내 업데이트는 아직 구현하지 않았다. 이 빌드는 일반 사용자에게 배포할 첫 출시 버전이 아니다.

## Rust 구조

Rust edition은 2024이며 툴체인 버전은 `rust-toolchain.toml`을 따른다.

| 파일 | 역할 |
| --- | --- |
| `src/main.rs` | 라이브러리의 `run()` 호출 |
| `src/lib.rs` | 플러그인·창·메뉴·이벤트 연결 |
| `src/window.rs` | 창 생성, 탐색·새 창 처리, 표시·숨기기·홈 이동·재열기 |
| `src/menu.rs` | 네이티브 메뉴 정의와 창 동작 연결 |
| `src/navigation.rs` | 개발/운영 홈 주소, URL 분류, 외부 브라우저 실행 |

앱 실행 → `run()` → `window::create()` → 웹 홈 직접 탐색 순서다.
`tauri.conf.json`의 `create: false`는 URL 정책을 연결한 뒤 Rust에서 창을 생성하기 위한 설정이다.
메뉴·Dock은 같은 창 함수를 호출하고, 창 설정은 배열 위치가 아닌 `main` 라벨로 찾는다.

외부 링크는 공식 `tauri-plugin-opener`의 Rust API로 연다. 플러그인의 자동 JS 링크 처리 옵션은 끄고,
`navigation::classify()`를 통과한 외부 HTTP(S) URL만 전달한다. `capabilities: []`를 유지하며 웹에 IPC 권한을 추가하지 않는다.
별도 JavaScript Opener 패키지는 설치하지 않는다. 창 작업·외부 브라우저 실행 실패는 표준 오류 출력에 기록한다.

Moa와 `dannysmith/tauri-template`의 진입점·모듈 구성·Opener 사용을 참고했다.
두 프로젝트는 화면을 앱에 포함하지만 우리는 원격 Next.js 웹을 연다. 로컬 오류 화면 제거는 이 차이가 사라졌다는 뜻이 아니라,
첫 버전에서 자체 연결 복구 UI를 제외하기로 한 범위 결정이다.

## 수동 확인 항목

아래 항목은 실제 WKWebView에서 확인한다. Playwright WebKit 결과만으로 시스템 WebKit 검증을 대신하지 않는다.

- 홈 → 추천/비교/시뮬레이션 진입, 창 최소 크기·전체 화면에서 이미지·입력·스크롤 확인
- 다른 화면에서 창 닫기 → Dock 재열기 시 화면 유지, `⌘Q` → 재실행 시 홈
- 입력창 복사·붙여넣기·실행 취소, 메뉴 새로고침·홈 이동
- 같은 서비스 `target="_blank"`는 기존 창, 외부 링크는 기본 브라우저, 위험 scheme은 차단
- 홈 푸터·회원가입의 노션 약관 링크가 기본 브라우저에서 열리고 앱 페이지는 유지되는지 확인
- 최초 접속 실패 시 자체 오류 화면이 없음을 확인하고, 연결 복구 후 `윈도우 → 홈으로 이동`으로 재접속 확인

현재 개발 환경의 OS 접근성·화면 캡처 권한 제한으로 네이티브 UI 조작 전체와 시각 검증은 미완료다.
자동 검증은 Rust URL 정책 테스트와 빌드로 확인한다. 이전 구현에서 로컬 앱의 HTTP 응답을 확인했지만, 구조 변경 후의 실제 네이티브 동작은 위 수동 항목으로 별도 확인해야 한다.

## 검증

```bash
cd src-tauri
cargo fmt --check
cargo clippy --locked --all-targets -- -D warnings
cargo test --locked
```

웹 검사는 저장소의 `node --run fmt:check`, `node --run lint`, Doppler 환경에서의 `node --run build`를 사용한다.
