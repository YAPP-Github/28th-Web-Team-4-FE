---
name: add-shared-ui-storybook
description: >-
  src/shared/ui에 도메인 비의존 공유 UI와 Storybook 스토리를 추가한다.
  Base UI(@base-ui/react) 프리미티브를 최대한 쓰고, cn·layout·typo/Text를 재사용한다.
  shared 컴포넌트·디자인 시스템 UI·스토리 추가 요청 시 사용.
  도메인/화면 UI면 create-fsd-slice를 쓴다.
  Use when adding shared UI or Storybook stories; prefer Base UI primitives.
---

# shared UI + Storybook 추가

[`docs/architecture.md`](../../docs/architecture.md) · `shared/rules/shared-ui.md`(sync → Cursor/Claude rules)를 따른다.

## 필수 문서 (구현 전 읽기)

학습 데이터·Radix 습관에 의존하지 않는다. **구현 전에** Base UI 문서를 확인한다.

| 대상 | URL | 용도 |
| --- | --- | --- |
| Base UI | https://base-ui.com/llms.txt | 컴포넌트 목록·Handbook. 필요 시 항목의 `.md` 링크를 추가로 연다 |

Base UI 주의 (Radix와 다름):

- `asChild` 없음 → **`render` prop** 합성. Handbook: https://base-ui.com/react/handbook/composition.md
- props·data attribute·부품 구성이 Radix와 다름 → 항상 Base UI 문서 기준

## 절차

1. **도메인 비의존인지 확인** — 제품 플로우/비즈니스 UI면 `pages` / `features` + `create-fsd-slice`.
2. **Base UI 우선** — Dialog, Menu, Select, Tabs 등 인터랙티브/접근성 UI는 이미 설치된 `@base-ui/react` 프리미티브를 **최대한** 쓴다. 처음부터 네이티브/`div`+수동 a11y로 다시 만들지 않는다.
3. **기존 패턴 읽기** — `src/shared/ui/cn.ts`, `layout/*`, `polymorphic.ts`, 기존 `src/stories/*.stories.tsx`.
4. **텍스트** — `src/shared/ui`에 **Text**가 있으면 사용. 없으면 `src/styles/tokens/typography.css`의 **`typo-*`** + 토큰 색(`text-text-high` 등).
5. **컴포넌트 추가** — kebab-case. 예: `src/shared/ui/button/button.tsx` (Base UI + `cn`으로 스타일).
6. **import** — `@/shared/ui/button/button`처럼 모듈 경로. `shared/ui` 거대 배럴을 새로 만들지 않음.
7. **Storybook** — `src/stories/<name>.stories.tsx`에 **기존 스토리 패턴을 우선** 따른다. CSF가 애매할 때만 https://storybook.js.org/llms.txt (필요 시 관련 `.md`)를 연다.
8. **디자인** — Figma 맞춤·토큰 매핑·스펙 공백은 `design-handoff` / `figma-bridge`에 맡긴다.
9. 확인: `node --run storybook` (요청 시).

## 체크리스트

- [ ] Base UI `llms.txt`(및 해당 컴포넌트 `.md`) 확인. Radix API 추측 금지
- [ ] 적합한 Base UI 프리미티브가 있으면 사용함
- [ ] 스토리는 로컬 `src/stories` 패턴을 따름 (`Meta` / `StoryObj` / `tags: ['autodocs']` 등)
- [ ] `cn` / layout(`Flex`, `Stack`, `Box` 등) 재사용
- [ ] 텍스트는 Text 또는 `typo-*` (+ 토큰 색)
- [ ] `shared`에 비즈니스·엔티티 네이밍 없음
- [ ] 스토리에 기본 상태(+ 필요 시 disabled 등)
- [ ] Figma 프레임이 있으면 맞춤; 공백이면 추측하지 말고 질문

## 스토리 스케치

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '@/shared/ui/button/button';

const meta = {
  title: 'components/Button',
  component: Button,
  tags: ['autodocs'],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
```
