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

이번 기본 설정 PR은 홈 로딩과 빌드를 제공한다. 창 재열기·외부 링크·연결 실패 복구는 다음 stacked PR,
Google 로그인 연결과 앱 내 업데이트는 각각 후속 PR 범위다.

## 검증

```bash
cd src-tauri
cargo fmt --check
cargo clippy --locked -- -D warnings
cargo test --locked
```

웹 검사는 저장소의 `node --run fmt:check`, `node --run lint`, Doppler 환경에서의 `node --run build`를 사용한다.
