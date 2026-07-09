# Design Tokens

Token Studio에서 export한 `tokens.json`을 Style Dictionary로 변환해 Tailwind CSS 4 `@theme` 변수로 사용합니다.

## 토큰 업데이트 워크플로우

1. Figma Token Studio에서 토큰을 export해 `design-tokens/tokens.json`을 교체합니다.
2. 아래 명령으로 CSS 변수를 재생성하고 유틸리티 클래스를 검증합니다.

```bash
node --run tokens
```

3. 생성된 `src/styles/tokens/` diff를 확인하고 PR을 생성합니다.

## 출력 파일

| 파일                               | 내용                                                          |
| ---------------------------------- | ------------------------------------------------------------- |
| `src/styles/tokens/colors.css`     | semantic + primitive color                                    |
| `src/styles/tokens/layout.css`     | spacing, radius, opacity                                      |
| `src/styles/tokens/typography.css` | font primitive (`@theme`) + semantic typo (`@utility typo-*`) |
| `src/styles/tokens/effects.css`    | box shadow                                                    |
| `src/styles/tokens/index.css`      | 위 파일 import (자동 생성)                                    |

`globals.css`에서는 `tokens/index.css`만 import합니다.

## Tailwind 클래스 매핑 (개발자용)

Figma 토큰 이름과 Tailwind 클래스명이 다를 수 있습니다. 아래 규칙을 따릅니다.

| CSS 변수 예시             | Tailwind 클래스         | 주의                                          |
| ------------------------- | ----------------------- | --------------------------------------------- |
| `--color-surface-lower`   | `bg-surface-lower`      | `text-*`는 색상일 수도, 폰트 크기일 수도 있음 |
| `--color-text-high`       | `text-text-high`        | 글자 **색상**                                 |
| `--font-weight-regular`   | `font-regular`          | `font-weight-regular` ❌                      |
| `--text-14`               | `text-14`               | 폰트 **크기** (primitive)                     |
| `@utility typo-body-lg`   | `typo-body-lg`          | semantic typography (`@apply` 조합)           |
| `--radius-radius-m`       | `rounded-m`             | 빌드 시 `radius-` 중복 제거                   |
| `--shadow-drop-shadow-01` | `shadow-drop-shadow-01` |                                               |
| `--opacity-50`            | `opacity-50`            | 값은 `0.5` (50 → 0.5 변환)                    |

## 구조

`sd-tailwindv4`의 processor / CSSBuilder 패턴을 참고해 빌드 로직을 분리했습니다.

```
design-tokens/
  build.mjs
  validate.mjs
  lib/
    class-map.mjs        # 변수 → 유틸리티 매핑
    constants.mjs
    expand-types.mjs     # typography만 expand
    filters.mjs
    composite-typography.mjs
    css-theme.mjs
    name-transform.mjs
    utils.mjs
```

## 포함 범위

- `color-semantic`, `color-primitive`
- `spacing`, `radius`, `opacity`, `boxShadow`
- `typography` primitive + composite

## 후속 작업

- Pretendard 폰트 파일 추가 및 `layout.tsx` 연동 (`globals.css`의 `--font-pre` override 제거)
