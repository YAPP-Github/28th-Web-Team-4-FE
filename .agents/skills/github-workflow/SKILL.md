---
name: github-workflow
description: >-
  GitHub 워크플로(커밋, 브랜치, draft PR, 이슈 템플릿 기반 생성, 조회)를 gh와 git으로 수행한다.
  사용자가 커밋·PR·이슈·push·gh를 요청하거나 브랜치 작업을 정리할 때 사용한다.
---

# GitHub workflow

레포 스크립트는 `node --run`을 쓴다. GitHub CLI는 `gh`를 쓴다.

## 템플릿 경로 (필수)

| 용도      | 경로                                        |
| --------- | ------------------------------------------- |
| PR        | `.github/pull_request_template.md`          |
| 기능 이슈 | `.github/ISSUE_TEMPLATE/feature-request.md` |
| 버그 이슈 | `.github/ISSUE_TEMPLATE/bug_report.md`      |

PR·이슈 body는 **위 템플릿 구조를 그대로** 쓰고, placeholder/주석을 실제 내용으로 채운다. 임의 Summary/Test plan 형식으로 바꾸지 않는다.

## 공통 안전 규칙

- 사용자가 **명시적으로 요청하기 전에는** 커밋·푸시·PR·이슈 생성을 하지 않는다.
- `git config` 변경 금지.
- force push / hard reset 등 파괴적 명령은 사용자가 분명히 요청한 경우만.
- `--no-verify`, `--no-gpg-sign` 등 훅 건너뛰기 금지 (명시 요청 제외).
- `main`/`master`에 force push 하지 않는다. 요청이 오면 경고한다.
- 시크릿(`.env`, 키, Doppler 값)은 커밋하지 않는다. 요청이 오면 경고한다.
- 사용자가 명시적으로 요청하기 전에는 `--amend`하지 않는다. 훅이 커밋을 거절했으면 amend하지 말고 수정 후 **새 커밋**한다.

## 커밋

요청받았을 때만 진행한다.

1. 병렬로 상태 파악:
   - `git status`
   - `git diff` / `git diff --staged`
   - `git log --oneline -n 10` (메시지 스타일 맞춤)
2. 스테이징: 관련 파일만 `git add`. 시크릿·무관한 산출물 제외.
3. 메시지: **why** 중심 1~2문장. 이 레포 스타일 예: `feat:` / `fix:` / `docs:` / `chore:` / `refactor:`
4. HEREDOC으로 커밋:

```bash
git commit -m "$(cat <<'EOF'
타입: 변경 이유를 한 문장으로.

EOF
)"
```

5. 훅 실패 시: 원인 수정 후 **새 커밋** (실패 커밋을 amend하지 않음). oxfmt 등 포맷 훅이면 포맷 적용 후 재커밋.
6. `git status`로 성공 확인. push는 따로 요청받기 전엔 하지 않음.

## 이슈

PR에 연결할 이슈가 **없거나**, 사용자가 이슈 본문/번호를 주지 않았으면 **이슈를 먼저** 만든다.
예외: 사용자가 “이슈 없이”/“이슈 생략”을 말했거나, 이미 연결할 이슈 번호가 있으면 새로 만들지 않는다.

1. 성격에 맞는 템플릿 선택:
   - 기능·잡일·문서·하네스 등 → `feature-request.md`
   - 버그 → `bug_report.md`
   - 불명확하면 사용자에게 짧게 확인
2. 템플릿 frontmatter의 `title` 접두(`feature: ` / `bug: `)와 본문 섹션(TODO 또는 bug 설명 등)을 채운다.
3. YAML frontmatter(`name`/`about`/…)는 GitHub UI용이다. `gh issue create` body에는 **본문 마크다운만** 넣고, 제목은 frontmatter `title` 규칙을 따른다.

```bash
gh issue create --title "feature: 짧은 요약" --body "$(cat <<'EOF'
## TODO

- [ ] …

## 기타 참고사항

…

EOF
)"
```

4. 생성 후 이슈 번호·URL을 확보하고, PR body의 `Closes #n` 등에 연결한다.
5. 이슈와 함께(또는 이어서) 작업 브랜치를 만들 때는 아래 **브랜치 네이밍**을 따른다.

## 브랜치 네이밍

이슈·작업용 브랜치는 **`{prefix}-{kebab-description}`** 형식이다.

- `prefix`: 이슈 성격에 맞춤 — `feat` / `bug` / `docs` / `chore` / `refactor` 등 (이슈 제목의 `feature:` → 브랜치는 `feat`)
- 나머지: 작업을 나타내는 짧은 단어들을 **kebab-case**로 연결
- 예: `feat-add-ai`, `bug-fix-login-redirect`, `docs-agents-architecture`
- 공백·언더스코어·PascalCase 금지. 이슈 번호를 이름에 넣을지는 사용자가 원하면 허용하되, 기본은 **의미 있는 kebab 설명** 우선.

```bash
git checkout -b feat-add-ai
```

## Pull Request

요청받았을 때만 진행한다. **항상 draft PR**로 만든다 (`--draft`). ready-for-review 전환은 사용자가 따로 요청할 때만.

1. 이슈 확인: 번호/본문이 없으면 위 **이슈** 절대로 템플릿 기반 이슈를 먼저 생성.
2. 작업 브랜치가 없으면 **브랜치 네이밍** 규칙으로 생성·체크아웃.
3. 병렬로 파악:
   - `git status`
   - `git diff` / `git diff [base]...HEAD`
   - 트래킹·ahead/behind
   - PR에 들어갈 **전체** 커밋 로그
4. remote에 없으면 `git push -u origin HEAD`.
5. body는 `.github/pull_request_template.md`를 읽어 섹션을 채운다:
   - `## 무엇을 변경했나요?`
   - `## 왜 변경했나요?` (+ `Closes #n`)
   - `## 확인 사항` 체크리스트 (해당 항목만 체크, 나머지는 유지)
6. 생성:

```bash
gh pr create --draft --base main --title "제목" --body "$(cat <<'EOF'
## 무엇을 변경했나요?

…

## 왜 변경했나요?

Closes #n

## 확인 사항
…
EOF
)"
```

7. base는 **`main`으로 고정**한다 (`--base main`). 완료 후 **PR URL**(draft)을 돌려준다.

## 이슈·PR·체크 조회

- 이슈: `gh issue view <n>`
- PR: `gh pr view`, `gh pr checks`
- 웹 UI 대신 CLI로 정보를 가져와 요약한다.

## 하지 말 것

- 대화형 git (`-i`, `git add -i`, `rebase -i`)
- 빈 커밋
- 요청 없는 push / PR / 이슈
- **non-draft PR** 생성 (기본 금지)
- 레포 템플릿을 무시하고 임의 PR/이슈 body 형식 사용
- prefix 없는 브랜치·camelCase/snake_case 브랜치 이름 (이슈 연동 작업 시)
- 추측으로 remote 브랜치·리뷰어·라벨 대량 변경
